'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  Check,
  X,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  MessageCircle,
  ChevronRight,
  Eye
} from 'lucide-react';
import Link from 'next/link';

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

  // Filtered claims
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
    <div className="space-y-4 max-w-7xl mx-auto w-full font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 bg-[#137333] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP HEADER (COMPACT GOOGLE ADMIN STYLE) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#dadce0]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-semibold text-[#1a73e8] bg-[#e8f0fe] px-2 py-0.5 rounded-md">
              Institutional Verifications
            </span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#202124]">
            School Profile Claims &amp; Add Requests
          </h1>
          <p className="text-xs text-[#5f6368]">
            Verify official institutional credentials and manage visual profile editing access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchClaims}
            disabled={loading}
            className="p-2 rounded-lg border border-[#dadce0] bg-white hover:bg-slate-50 text-[#5f6368] text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Refresh Claims"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── 4 COMPACT KPI METRIC CHIPS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
              : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Total Claims</span>
          <span className="text-lg font-bold text-[#202124]">{claims.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-100/70 border-amber-500 text-amber-900'
              : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider block">Pending Review</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
          </div>
          <span className="text-lg font-bold text-amber-700">{pendingCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
              : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Approved &amp; Active</span>
          <span className="text-lg font-bold text-emerald-700">{approvedCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-50 border-rose-500 text-rose-900'
              : 'bg-white border-[#dadce0] text-[#5f6368] hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Rejected</span>
          <span className="text-lg font-bold text-rose-700">{rejectedCount}</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER STRIP (COMPACT) ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-[#dadce0] shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by school, UDISE, claimant name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#5f6368]">
          <span className="text-[11px] font-medium">Showing: <strong>{filteredClaims.length}</strong> records</span>
        </div>
      </div>

      {/* ── CLAIMS TABLE (COMPACT GOOGLE WORKSPACE STYLE) ── */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-14 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#1a73e8] mx-auto" />
            <p className="text-xs text-[#5f6368] font-medium">Loading claims database...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="py-12 text-center text-[#5f6368] space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-[#202124]">No claims found matching filters</p>
            <p className="text-[11px] text-[#5f6368]">
              {statusFilter !== 'all' ? `There are no ${statusFilter} claim requests.` : 'No claims have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">
                  <th className="py-2.5 px-3">School &amp; UDISE</th>
                  <th className="py-2.5 px-3">Claimant Authority</th>
                  <th className="py-2.5 px-3">Contact &amp; Phone</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dadce0]/60">
                {filteredClaims.map((claim) => {
                  const isActionLoading = actionLoadingId === claim.id;
                  const cleanPhone = claim.whatsapp_number.replace(/\D/g, '');

                  return (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* School & UDISE */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#202124] leading-snug">
                          {claim.school_name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                            UDISE: {claim.udise_code}
                          </span>
                        </div>
                      </td>

                      {/* Claimant Authority */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#202124] flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{claim.claimant_name}</span>
                        </div>
                        <div className="text-[10px] text-[#5f6368] mt-0.5">
                          {claim.designation}
                        </div>
                      </td>

                      {/* Contact & Phone */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 text-[11px] text-[#1a73e8]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${claim.claimant_email}`} className="hover:underline">
                            {claim.claimant_email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{claim.whatsapp_number}</span>
                          {cleanPhone.length >= 10 && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(claim.claimant_name)},%20regarding%20your%20CSEEL%20school%20profile%20claim%20for%20${encodeURIComponent(claim.school_name)}:`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-2.5 px-3 text-[11px] text-[#5f6368] whitespace-nowrap">
                        {new Date(claim.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {claim.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        ) : claim.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-300">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Verification Action */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedClaim(claim)}
                            className="p-1.5 rounded-lg border border-[#dadce0] hover:bg-slate-100 text-[#5f6368] text-xs transition cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {claim.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => handleUpdateStatus(claim.id, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                title="Approve & Grant Visual Edit Access"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                disabled={isActionLoading}
                                onClick={() => setRejectModalClaim(claim)}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                title="Reject Claim"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {claim.status === 'approved' && (
                            <a
                              href={claim.visual_edit_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 font-bold text-[11px] transition flex items-center gap-1"
                              title="Open Live Profile Editor"
                            >
                              <span>Visual Editor</span>
                              <ExternalLink className="w-3 h-3" />
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

      {/* ── DETAIL MODAL ── */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Claim Request Review
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedClaim.school_name}
                </h3>
                <p className="text-xs font-mono text-slate-500">UDISE: {selectedClaim.udise_code}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/70">
                <p className="font-bold text-slate-800">Claimant Profile</p>
                <p>• <strong>Name:</strong> {selectedClaim.claimant_name}</p>
                <p>• <strong>Role:</strong> {selectedClaim.designation}</p>
                <p>• <strong>Email:</strong> <a href={`mailto:${selectedClaim.claimant_email}`} className="text-[#1a73e8]">{selectedClaim.claimant_email}</a></p>
                <p>• <strong>WhatsApp:</strong> {selectedClaim.whatsapp_number}</p>
              </div>

              {selectedClaim.note && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-slate-700 space-y-1">
                  <p className="font-bold text-[#003c6e]">Submitted Verification Note:</p>
                  <p className="whitespace-pre-wrap">{selectedClaim.note}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Submitted: {new Date(selectedClaim.created_at).toLocaleString('en-IN')}</span>
                <span className="font-bold capitalize">Status: {selectedClaim.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedClaim.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedClaim.id, 'approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Approve Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectModalClaim(selectedClaim)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT REASON MODAL ── */}
      {rejectModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Reject Claim for {rejectModalClaim.school_name}?
            </h3>
            <p className="text-xs text-slate-500">
              Please enter the administrative reason for rejecting this claim request:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Could not verify institution email address or official school authorization..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalClaim(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(rejectModalClaim.id, 'rejected', rejectReason)}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
