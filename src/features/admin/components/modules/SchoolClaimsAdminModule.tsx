'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  Check,
  X,
  User,
  MessageCircle,
  Eye
} from 'lucide-react';

export interface SchoolClaimItem {
  id: string;
  udise_code: string;
  school_id: string;
  school_name: string;
  claimant_name: string;
  claimant_email: string;
  whatsapp_number: string;
  designation: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  visual_edit_token: string;
  visual_edit_url: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export default function SchoolClaimsAdminModule() {
  const [claims, setClaims] = useState<SchoolClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<SchoolClaimItem | null>(null);
  const [rejectModalClaim, setRejectModalClaim] = useState<SchoolClaimItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/school-claim', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.claims)) {
        setClaims(data.claims);
      }
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleUpdateStatus = async (claimId: string, newStatus: 'approved' | 'rejected', reviewNote?: string) => {
    setActionLoadingId(claimId);
    try {
      const res = await fetch('/api/school-claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim_id: claimId,
          status: newStatus,
          review_note: reviewNote || (newStatus === 'approved' ? 'Verified by Administrator' : 'Rejected by Administrator'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`Claim marked as ${newStatus}!`);
        setTimeout(() => setToastMessage(null), 3000);
        await fetchClaims();
        if (selectedClaim?.id === claimId) {
          setSelectedClaim(data.claim);
        }
      }
    } catch (err) {
      console.error('Error updating claim status:', err);
    } finally {
      setActionLoadingId(null);
      setRejectModalClaim(null);
      setRejectReason('');
    }
  };

  const filteredClaims = claims.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.school_name.toLowerCase().includes(q) ||
      c.udise_code.includes(q) ||
      c.claimant_name.toLowerCase().includes(q) ||
      c.claimant_email.toLowerCase().includes(q) ||
      c.whatsapp_number.includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const approvedCount = claims.filter((c) => c.status === 'approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;

  return (
    <div className="space-y-2.5 max-w-7xl mx-auto w-full font-sans text-[#202124]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 bg-[#137333] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP HEADER (COMPACT GOOGLE ADMIN STYLE) ── */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#dadce0]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#e8f0fe] text-[#1a73e8]">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-[#202124] tracking-tight">
                School Profile Claims &amp; Add Requests
              </h1>
              {pendingCount > 0 && (
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#5f6368]">
              Verify institutional credentials and control visual editing tokens.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchClaims}
          disabled={loading}
          className="p-1.5 rounded border border-[#dadce0] bg-white hover:bg-slate-50 text-[#5f6368] text-[11px] font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Refresh Claims"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── COMPACT FILTER TABS & SEARCH ROW ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-1.5 rounded-lg border border-[#dadce0] shadow-2xs">
        {/* Google Workspace style filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: claims.length },
            { id: 'pending', label: 'Pending', count: pendingCount, highlight: pendingCount > 0 },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                    : 'text-[#444746] hover:bg-[#f1f3f4]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 py-0 rounded ${
                  active
                    ? 'bg-white/80 text-[#001d35] font-bold'
                    : tab.highlight
                    ? 'bg-amber-100 text-amber-800 font-bold'
                    : 'text-[#5f6368]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Compact Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school, UDISE, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 text-[11px] rounded border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* ── CLAIMS TABLE (ULTRA COMPACT GOOGLE ADMIN STYLE) ── */}
      <div className="bg-white rounded-lg border border-[#dadce0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-8 text-center space-y-1.5">
            <RefreshCw className="w-4 h-4 animate-spin text-[#1a73e8] mx-auto" />
            <p className="text-[11px] text-[#5f6368]">Loading claims database...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="py-8 text-center text-[#5f6368] space-y-1">
            <Building2 className="w-6 h-6 mx-auto text-slate-300" />
            <p className="text-[11px] font-semibold text-[#202124]">No claims found</p>
            <p className="text-[10px] text-[#5f6368]">
              {statusFilter !== 'all' ? `No ${statusFilter} requests.` : 'No claims submitted.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[10px] font-bold text-[#5f6368] uppercase tracking-wide">
                  <th className="py-1.5 px-2.5">School &amp; UDISE</th>
                  <th className="py-1.5 px-2.5">Claimant Authority</th>
                  <th className="py-1.5 px-2.5">Contact &amp; Phone</th>
                  <th className="py-1.5 px-2.5">Submitted</th>
                  <th className="py-1.5 px-2.5">Status</th>
                  <th className="py-1.5 px-2.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dadce0]/60">
                {filteredClaims.map((claim) => {
                  const isActionLoading = actionLoadingId === claim.id;
                  const cleanPhone = claim.whatsapp_number.replace(/\D/g, '');

                  return (
                    <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* School & UDISE (Compact 1-2 line max) */}
                      <td className="py-1.5 px-2.5 max-w-[240px]">
                        <div className="font-semibold text-[11px] text-[#202124] truncate" title={claim.school_name}>
                          {claim.school_name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 py-0 rounded">
                            UDISE: {claim.udise_code}
                          </span>
                        </div>
                      </td>

                      {/* Claimant Authority */}
                      <td className="py-1.5 px-2.5 max-w-[180px]">
                        <div className="font-medium text-[11px] text-[#202124] flex items-center gap-1 truncate">
                          <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{claim.claimant_name}</span>
                        </div>
                        <div className="text-[9px] text-[#5f6368] truncate mt-0.5">
                          {claim.designation}
                        </div>
                      </td>

                      {/* Contact & Phone */}
                      <td className="py-1.5 px-2.5 max-w-[200px]">
                        <div className="flex items-center gap-1 text-[10px] text-[#1a73e8] truncate">
                          <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <a href={`mailto:${claim.claimant_email}`} className="hover:underline truncate">
                            {claim.claimant_email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span>{claim.whatsapp_number}</span>
                          {cleanPhone.length >= 10 && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(claim.claimant_name)},%20regarding%20your%20CSEEL%20school%20profile%20claim%20for%20${encodeURIComponent(claim.school_name)}:`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-1.5 px-2.5 text-[10px] text-[#5f6368] whitespace-nowrap">
                        {new Date(claim.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-1.5 px-2.5 whitespace-nowrap">
                        {claim.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Approved
                          </span>
                        ) : claim.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            <XCircle className="w-2.5 h-2.5 text-rose-600" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            <Clock className="w-2.5 h-2.5 text-amber-600" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Verification Action (Ultra Compact Buttons) */}
                      <td className="py-1.5 px-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedClaim(claim)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>

                          {claim.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => handleUpdateStatus(claim.id, 'approved')}
                                className="px-2 py-0.5 rounded bg-[#137333] hover:bg-[#0d652d] text-white font-medium text-[10px] transition cursor-pointer flex items-center gap-0.5 disabled:opacity-50"
                                title="Approve & Grant Visual Edit Access"
                              >
                                <Check className="w-2.5 h-2.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => setRejectModalClaim(claim)}
                                className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-[10px] transition cursor-pointer flex items-center gap-0.5 disabled:opacity-50"
                                title="Reject Claim"
                              >
                                <X className="w-2.5 h-2.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {claim.status === 'approved' && (
                            <a
                              href={claim.visual_edit_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 font-medium text-[10px] transition flex items-center gap-1"
                              title="Open Live Profile Editor"
                            >
                              <span>Visual Editor</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL (COMPACT) ── */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between border-b pb-2 border-slate-100">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Claim Details
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {selectedClaim.school_name}
                </h3>
                <p className="text-[10px] font-mono text-slate-500">UDISE: {selectedClaim.udise_code}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 border border-slate-200/70">
                <p className="font-bold text-slate-800 text-[10px] uppercase">Claimant Profile</p>
                <p>• <strong>Name:</strong> {selectedClaim.claimant_name}</p>
                <p>• <strong>Role:</strong> {selectedClaim.designation}</p>
                <p>• <strong>Email:</strong> <a href={`mailto:${selectedClaim.claimant_email}`} className="text-[#1a73e8]">{selectedClaim.claimant_email}</a></p>
                <p>• <strong>Phone:</strong> {selectedClaim.whatsapp_number}</p>
              </div>

              {selectedClaim.note && (
                <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-200/60">
                  <p className="text-[10px] font-bold text-amber-900 uppercase">Verification Note</p>
                  <p className="text-slate-700 mt-0.5">{selectedClaim.note}</p>
                </div>
              )}

              {selectedClaim.status === 'approved' && selectedClaim.visual_edit_url && (
                <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-200/60">
                  <p className="text-[10px] font-bold text-[#1a73e8] uppercase">Visual Edit Link</p>
                  <a
                    href={selectedClaim.visual_edit_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1a73e8] hover:underline font-mono text-[10px] break-all block mt-0.5"
                  >
                    {selectedClaim.visual_edit_url}
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-3 py-1 rounded border border-[#dadce0] text-[11px] text-[#5f6368] hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT REASON MODAL ── */}
      {rejectModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 shadow-xl border border-slate-200 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Reject Claim Request
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {rejectModalClaim.school_name} (UDISE: {rejectModalClaim.udise_code})
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Reason for Rejection
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. UDISE documentation mismatch, unauthorized claimant..."
                className="w-full p-2 text-[11px] rounded border border-slate-300 focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRejectModalClaim(null);
                  setRejectReason('');
                }}
                className="px-2.5 py-1 rounded border border-[#dadce0] text-[11px] text-[#5f6368] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(rejectModalClaim.id, 'rejected', rejectReason || 'Claim rejected by administrator')}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px]"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
