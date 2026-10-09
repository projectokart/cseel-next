'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  Check,
  X,
  Phone,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Users,
  Search,
  RefreshCw
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminLoginScreen from './AdminLoginScreen';
import { MaintenanceControlPanel } from '@/features/maintenance/components/MaintenanceControlPanel';
import SchoolClaimsAdminModule from './modules/SchoolClaimsAdminModule';
import ExperimentsAdminModule from '../experiments/ExperimentsAdminModule';
import NavigationCmsControlModule from './modules/NavigationCmsControlModule';
import MarketingAdminModule from './modules/MarketingAdminModule';
import GlobalStylingAdminModule from './modules/GlobalStylingAdminModule';
import { AdminModuleId } from '../types';

interface ClaimItem {
  id: string;
  claimId: string;
  udiseCode: string;
  schoolName: string;
  district?: string;
  state?: string;
  pincode?: string;
  claimantName: string;
  claimantRole: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  editToken?: string;
}

const PendingClaimsOverviewWidget: React.FC = () => {
  const { setActiveModule } = useAdminAuth();
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/school-claim', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.claims)) {
        setClaims(data.claims);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const pendingClaims = claims.filter((c) => c.status === 'pending');

  const handleApprove = async (claimId: string) => {
    try {
      setActionLoading(claimId);
      const res = await fetch('/api/school-claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, action: 'approve' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ text: 'Claim approved! Verification email sent.', type: 'success' });
        setTimeout(() => setFeedbackMsg(null), 4000);
        await fetchClaims();
      } else {
        setFeedbackMsg({ text: data.error || 'Failed to approve', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err?.message || 'Network error', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (claimId: string) => {
    const reason = window.prompt('Enter reason for rejection (claimant will be notified):', 'UDISE mismatch or verification incomplete');
    if (!reason) return;

    try {
      setActionLoading(claimId);
      const res = await fetch('/api/school-claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, action: 'reject', rejectionReason: reason }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({ text: 'Claim rejected.', type: 'success' });
        setTimeout(() => setFeedbackMsg(null), 4000);
        await fetchClaims();
      } else {
        setFeedbackMsg({ text: data.error || 'Failed to reject', type: 'error' });
      }
    } catch (err: any) {
      setFeedbackMsg({ text: err?.message || 'Network error', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.08)] overflow-hidden">
      {/* Header Row */}
      <div className="px-3.5 py-2.5 bg-[#f8fafd] border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#e8f0fe] text-[#1a73e8]">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs text-[#202124]">
            School Profile Claims &amp; Add Requests
          </span>
          {pendingClaims.length > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
              {pendingClaims.length} Pending Approval
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e6f4ea] text-[#137333]">
              0 Pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchClaims}
            className="p-1 text-[#5f6368] hover:text-[#202124] rounded hover:bg-black/5 transition-colors"
            title="Refresh claims"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('schools_institutions')}
            className="text-[11px] font-semibold text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Claims</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${
          feedbackMsg.type === 'success' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'
        }`}>
          {feedbackMsg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="p-4 text-center text-xs text-[#5f6368]">
          <RefreshCw className="w-4 h-4 animate-spin inline-block mr-1 text-[#1a73e8]" />
          Checking school claims...
        </div>
      ) : pendingClaims.length === 0 ? (
        <div className="p-3.5 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <CheckCircle2 className="w-4 h-4 text-[#137333]" />
            <span>All submitted school profiles &amp; claims are verified. Total registered records: <strong>{claims.length}</strong>.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModule('schools_institutions')}
            className="px-3 py-1 rounded-md border border-[#dadce0] hover:bg-[#f8fafd] text-[11px] font-medium text-[#1a73e8]"
          >
            Manage Records ({claims.length})
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#dadce0]/70 overflow-x-auto">
          {pendingClaims.map((claim) => (
            <div key={claim.id || claim.claimId} className="p-3 hover:bg-[#f8fafd] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-[#202124] text-xs truncate max-w-sm">
                    {claim.schoolName}
                  </h4>
                  <span className="px-1.5 py-0.2 bg-[#f1f3f4] text-[#5f6368] rounded text-[10px] font-mono font-medium">
                    UDISE: {claim.udiseCode}
                  </span>
                  {claim.district && (
                    <span className="text-[11px] text-[#5f6368]">
                      • {claim.district}, {claim.state}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5f6368]">
                  <span>Claimant: <strong className="text-[#202124]">{claim.claimantName}</strong> ({claim.claimantRole})</span>
                  <span>Phone: <a href={`tel:${claim.phone}`} className="text-[#1a73e8] hover:underline font-mono">{claim.phone}</a></span>
                  <span>Email: <a href={`mailto:${claim.email}`} className="text-[#1a73e8] hover:underline">{claim.email}</a></span>
                  <span>Date: {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <a
                  href={`https://wa.me/91${claim.phone.replace(/[^0-9]/g, '').slice(-10)}?text=Hello%20${encodeURIComponent(claim.claimantName)},%20this%20is%20CSEEL%20Admin%20regarding%20your%20school%20profile%20claim%20for%20${encodeURIComponent(claim.schoolName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-[#137333] hover:bg-[#e6f4ea] transition-colors"
                  title="WhatsApp Claimant"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  disabled={actionLoading === claim.claimId}
                  onClick={() => handleReject(claim.claimId)}
                  className="px-2.5 py-1 rounded-md text-[#c5221f] hover:bg-[#fce8e6] text-[11px] font-semibold border border-transparent hover:border-[#fad2cf] transition-all cursor-pointer disabled:opacity-50"
                  title="Reject Claim"
                >
                  Reject
                </button>

                <button
                  type="button"
                  disabled={actionLoading === claim.claimId}
                  onClick={() => handleApprove(claim.claimId)}
                  className="px-3 py-1 rounded-md bg-[#137333] hover:bg-[#0d652d] text-white text-[11px] font-semibold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Approve Claim & Send Verification Link"
                >
                  {actionLoading === claim.claimId ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminCanvasContent: React.FC = () => {
  const { setActiveModule } = useAdminAuth();

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto w-full font-sans">
      {/* ── TOP MAINTENANCE MODE & CONSTRUCTION CONTROLLER (COMPACT) ── */}
      <div id="maintenance-panel">
        <MaintenanceControlPanel />
      </div>

      {/* ── HIGH PRIORITY: PENDING SCHOOL CLAIMS & ADD REQUESTS ── */}
      <PendingClaimsOverviewWidget />

      {/* ── COMPACT HEADER ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#dadce0]/60">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#202124] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-[11px] text-[#5f6368]">
            Operations, school network, curriculum labs, and live CMS slots.
          </p>
        </div>

        {/* Quick Module Shortcut Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModule('schools_institutions')}
            className="px-3 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#f8fafd] text-[#202124] text-xs font-medium shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>School Claims</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule('marketing_growth')}
            className="px-3 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Offers &amp; Ads</span>
          </button>
        </div>
      </div>

      {/* ── 4 COMPACT GOOGLE-STYLE SUMMARY METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-3 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
              <Users className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-1.5 py-0.2 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#5f6368]">Active Inquiries</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-[#202124]">44</span>
            <span className="text-[10px] text-[#5f6368]">this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-3 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#e6f4ea] text-[#137333]">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-1.5 py-0.2 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" /> +6.8%
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#5f6368]">Labs Configured</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-[#202124]">24</span>
            <span className="text-[10px] text-[#5f6368]">active</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-3 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#fce8e6] text-[#c5221f]">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-semibold text-[#c5221f] bg-[#fce8e6] px-1.5 py-0.2 rounded-full">
              100% Live
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#5f6368]">Published Articles</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-[#202124]">50</span>
            <span className="text-[10px] text-[#5f6368]">in Sanity</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-3 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#fef7e0] text-[#b06000]">
              <Building2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-semibold text-[#137333] flex items-center gap-0.5 bg-[#e6f4ea] px-1.5 py-0.2 rounded-full">
              <TrendingUp className="w-2.5 h-2.5" /> +2.5%
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#5f6368]">Partner Schools</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-[#202124]">150+</span>
            <span className="text-[10px] text-[#5f6368]">labs</span>
          </div>
        </div>
      </div>

      {/* ── WORKSPACE SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Main Central Card */}
        <div className="lg:col-span-8 bg-white rounded-xl p-3.5 sm:p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dadce0]/60">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#202124]">
                  Visual CMS &amp; Marketing Banners
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#5f6368]">
                  Manage 10 page ad slots, Swiper carousels, and order swaps
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                ● Live
              </span>
            </div>

            <div className="py-4 text-center text-[#5f6368] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-[#ea3829]">
                <Layers className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#202124]">
                Page Ad Slots &amp; Visual Templates
              </p>
              <p className="text-[11px] text-[#5f6368] max-w-sm mx-auto">
                Configure offers, hero banners, and popup placements with live preview.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModule('marketing_growth')}
                  className="px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  Open Banners Studio →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Distribution Card */}
        <div className="lg:col-span-4 bg-white rounded-xl p-3.5 sm:p-4 border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dadce0]/60">
              <h3 className="font-bold text-xs text-[#202124]">Lab Distribution</h3>
              <span className="text-[10px] text-[#5f6368]">By Category</span>
            </div>

            <div className="space-y-2.5 pt-0.5">
              {[
                { label: 'Atal Tinkering Labs (ATL)', pct: '85%', color: 'bg-[#1a73e8]' },
                { label: 'AI & Robotics Hubs', pct: '65%', color: 'bg-[#34a853]' },
                { label: 'PM SHRI Composite Labs', pct: '50%', color: 'bg-[#fbbc04]' },
                { label: 'Clean Tech Green Labs', pct: '35%', color: 'bg-[#ea4335]' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-[#202124]">{item.label}</span>
                    <span className="font-bold text-[#5f6368]">{item.pct}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#f1f3f4] overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortalRoot: React.FC<{ initialModule?: AdminModuleId; children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, activeModule } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8fafd] text-[#202124] font-sans antialiased selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* ── 1. TOP HEADER (COMPACT 48px GOOGLE WORKSPACE STYLE) ── */}
      <AdminHeader
        onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onToggleSidebarCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* ── 2. BODY ROW (Sidebar on left + Main Content on right) ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* SIDEBAR DRAWER */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 bg-[#f8fafd]">
          {children ? (
            children
          ) : activeModule === 'schools_institutions' || activeModule === 'school_claims' ? (
            <SchoolClaimsAdminModule />
          ) : activeModule === 'experiments_studio' ? (
            <ExperimentsAdminModule />
          ) : activeModule === 'marketing_growth' ? (
            <MarketingAdminModule />
          ) : activeModule === 'navigation_cms' ? (
            <NavigationCmsControlModule />
          ) : activeModule === 'global_styling' ? (
            <GlobalStylingAdminModule />
          ) : (
            <AdminCanvasContent />
          )}
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ initialModule?: AdminModuleId; children?: React.ReactNode }> = ({ initialModule, children }) => {
  return (
    <AdminAuthProvider defaultModule={initialModule}>
      <AdminPortalRoot initialModule={initialModule}>
        {children}
      </AdminPortalRoot>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
