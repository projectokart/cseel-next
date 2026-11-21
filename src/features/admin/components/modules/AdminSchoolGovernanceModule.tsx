'use client';

import React, { useState, useEffect } from 'react';
import {
  School,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Sliders,
  Filter,
  Save,
  Trash2,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';

export default function AdminSchoolGovernanceModule() {
  const [activeSubTab, setActiveSubTab] = useState<'claims' | 'udise_directory'>('claims');

  // Claims State
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [claimsFilter, setClaimsFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Directory State
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const limit = 20;

  // Multi-select & Bulk Delete State
  const [selectedClaimIds, setSelectedClaimIds] = useState<Set<string>>(new Set());
  const [isDeletingClaims, setIsDeletingClaims] = useState(false);

  const [selectedUdiseCodes, setSelectedUdiseCodes] = useState<Set<string>>(new Set());
  const [isDeletingSchools, setIsDeletingSchools] = useState(false);

  // Approval Modal State
  const [approvingClaim, setApprovingClaim] = useState<any | null>(null);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // New School Modal State
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [newSchoolForm, setNewSchoolForm] = useState({
    udiseCode: '',
    schoolName: '',
    stateName: 'DELHI',
    districtName: 'WEST',
    board: 'CBSE',
    residentialSchool: 'Day School',
    address: '',
    pincode: '110058',
    isVerified: true
  });
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Edit School Modal State
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Status message
  const [actionFeedback, setActionFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setActionFeedback({ text, type });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 1. Fetch Claims (Lightweight & Fast)
  const fetchClaims = async () => {
    setIsLoadingClaims(true);
    try {
      const res = await fetch('/api/admin/school-governance?action=list_claims');
      const json = await res.json();
      if (json.success) {
        setClaims(json.claims || []);
      }
    } catch {
      showFeedback('Failed to load claims list.', 'error');
    } finally {
      setIsLoadingClaims(false);
    }
  };

  // 2. Fetch Schools Directory (Paginated with Range & Index)
  const fetchSchools = async (query = searchQuery, targetPage = page) => {
    setIsLoadingSchools(true);
    try {
      const res = await fetch(
        `/api/admin/school-governance?action=list_schools&search=${encodeURIComponent(query)}&page=${targetPage}&limit=${limit}`
      );
      const json = await res.json();
      if (json.success) {
        setSchools(json.schools || []);
        setTotalSchools(json.total || 0);
        setPage(targetPage);
      }
    } catch {
      showFeedback('Failed to load schools directory.', 'error');
    } finally {
      setIsLoadingSchools(false);
    }
  };

  // Lazy loading: only fetch schools when directory tab is selected
  useEffect(() => {
    if (activeSubTab === 'claims') {
      fetchClaims();
    } else {
      fetchSchools(searchQuery, page);
    }
  }, [activeSubTab]);

  // 3. Handle Approve Claim (Bcrypt Key Generation)
  const handleApproveClaim = async (claim: any) => {
    setApprovingClaim(claim);
    setIsApproving(true);
    setGeneratedKey(null);
    setIsCopied(false);

    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_claim',
          udiseCode: claim.udise_code,
          adminEmail: 'superadmin@cseel.org'
        })
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedKey(json.generatedSecretKey);
        showFeedback(`Claim approved for ${claim.school_name || claim.udise_code}!`);
        await fetchClaims();
        await fetchSchools();
      } else {
        showFeedback(json.error || 'Failed to approve claim.', 'error');
        setApprovingClaim(null);
      }
    } catch {
      showFeedback('Network error during claim approval.', 'error');
      setApprovingClaim(null);
    } finally {
      setIsApproving(false);
    }
  };

  // 4. Handle Reject Claim
  const handleRejectClaim = async (udiseCode: string) => {
    if (!confirm(`Are you sure you want to reject/revoke the claim for UDISE ${udiseCode}? This will revoke access.`)) return;

    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_claim',
          udiseCode,
          adminEmail: 'superadmin@cseel.org'
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(`Claim for UDISE ${udiseCode} rejected and key revoked.`);
        await fetchClaims();
      } else {
        showFeedback(json.error || 'Failed to reject claim.', 'error');
      }
    } catch {
      showFeedback('Network error.', 'error');
    }
  };

  // 4B. Handle Delete Claim (Admin Full Power - Single Test/Real Delete)
  const handleDeleteClaim = async (claim: any) => {
    const udise = claim.udise_code;
    const name = claim.school_name || udise;
    if (!confirm(`Are you sure you want to permanently DELETE the claim for "${name}" (UDISE: ${udise})? This will completely remove the claim record from Supabase database.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_claim',
          udiseCode: udise,
          claimId: claim.id,
          adminEmail: 'superadmin@cseel.org'
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message || `Claim for UDISE ${udise} permanently deleted from database.`);
        setSelectedClaimIds(prev => {
          const next = new Set(prev);
          next.delete(claim.id || udise);
          return next;
        });
        await fetchClaims();
      } else {
        showFeedback(json.error || 'Failed to delete claim.', 'error');
      }
    } catch {
      showFeedback('Network error during claim deletion.', 'error');
    }
  };

  // 4C. Handle Bulk Delete Selected Claims (Multi-select Delete)
  const handleBulkDeleteClaims = async () => {
    if (selectedClaimIds.size === 0) return;
    const count = selectedClaimIds.size;
    if (!confirm(`Are you sure you want to permanently DELETE ${count} selected claim(s) from Supabase database? This action cannot be undone.`)) {
      return;
    }

    setIsDeletingClaims(true);
    try {
      const selectedList = claims.filter(c => selectedClaimIds.has(c.id || c.udise_code));
      const claimIds = selectedList.map(c => c.id).filter(Boolean);
      const udiseCodes = selectedList.map(c => c.udise_code).filter(Boolean);

      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_delete_claims',
          claimIds,
          udiseCodes,
          adminEmail: 'superadmin@cseel.org'
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message || `${count} claims permanently deleted from Supabase database.`);
        setSelectedClaimIds(new Set());
        await fetchClaims();
      } else {
        showFeedback(json.error || 'Failed to delete claims.', 'error');
      }
    } catch {
      showFeedback('Network error during bulk claim deletion.', 'error');
    } finally {
      setIsDeletingClaims(false);
    }
  };

  // 5B. Handle Delete School (Single)
  const handleDeleteSchool = async (school: any) => {
    const udise = school.udise_code;
    const name = school.school_name || udise;
    if (!confirm(`Are you sure you want to permanently DELETE school "${name}" (UDISE: ${udise}) from master UDISE database?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_school',
          udiseCode: udise
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message || `School ${name} permanently deleted from database.`);
        setSelectedUdiseCodes(prev => {
          const next = new Set(prev);
          next.delete(udise);
          return next;
        });
        await fetchSchools(searchQuery, page);
      } else {
        showFeedback(json.error || 'Failed to delete school.', 'error');
      }
    } catch {
      showFeedback('Network error during school deletion.', 'error');
    }
  };

  // 5C. Handle Bulk Delete Selected Schools (Multi-select Delete)
  const handleBulkDeleteSchools = async () => {
    if (selectedUdiseCodes.size === 0) return;
    const count = selectedUdiseCodes.size;
    if (!confirm(`Are you sure you want to permanently DELETE ${count} selected school(s) from master UDISE database?`)) {
      return;
    }

    setIsDeletingSchools(true);
    try {
      const udiseCodes = Array.from(selectedUdiseCodes);
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_delete_schools',
          udiseCodes
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message || `${count} schools permanently deleted from database.`);
        setSelectedUdiseCodes(new Set());
        await fetchSchools(searchQuery, page);
      } else {
        showFeedback(json.error || 'Failed to delete schools.', 'error');
      }
    } catch {
      showFeedback('Network error during bulk deletion.', 'error');
    } finally {
      setIsDeletingSchools(false);
    }
  };

  // 5. Handle Toggle Publish / Hide
  const handleTogglePublish = async (udiseCode: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_publish',
          udiseCode,
          publish: newStatus
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(json.message);
        setSchools(prev => prev.map(s => s.udise_code === udiseCode ? { ...s, is_published: newStatus, is_verified: newStatus } : s));
      } else {
        showFeedback(json.error || 'Failed to update visibility.', 'error');
      }
    } catch {
      showFeedback('Network error.', 'error');
    }
  };

  // 6. Handle Create School in UDISE Master Directory
  const handleCreateSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolForm.udiseCode || newSchoolForm.udiseCode.length < 6) {
      setCreateMsg({ text: 'Please enter a valid 11-digit UDISE code.', error: true });
      return;
    }
    if (!newSchoolForm.schoolName) {
      setCreateMsg({ text: 'School name is required.', error: true });
      return;
    }

    setIsCreatingSchool(true);
    setCreateMsg(null);

    try {
      const res = await fetch('/api/admin/school-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_udise_school',
          ...newSchoolForm
        })
      });
      const json = await res.json();
      if (json.success) {
        showFeedback(`School ${newSchoolForm.schoolName} added to UDISE Directory!`);
        setIsAddSchoolModalOpen(false);
        setNewSchoolForm({
          udiseCode: '',
          schoolName: '',
          stateName: 'DELHI',
          districtName: 'WEST',
          board: 'CBSE',
          residentialSchool: 'Day School',
          address: '',
          pincode: '110058',
          isVerified: true
        });
        await fetchSchools('');
      } else {
        setCreateMsg({ text: json.error || 'Failed to add school.', error: true });
      }
    } catch {
      setCreateMsg({ text: 'Network error.', error: true });
    } finally {
      setIsCreatingSchool(false);
    }
  };

  // Filtered claims
  const filteredClaims = claims.filter(c => {
    if (claimsFilter === 'all') return true;
    return (c.status || '').toLowerCase() === claimsFilter;
  });

  return (
    <div className="space-y-4">
      {/* ── Sub Navigation Header ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            <span>School Directory &amp; Claims Governance Console</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bcrypt Hashing Live
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Admin controls: review school ownership claims, approve with hashed secret keys, and manage master UDISE directory records.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('claims')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'claims'
                ? 'bg-white text-blue-700 shadow-xs border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Claims Approval Queue</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
              {claims.filter(c => c.status === 'pending').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('udise_directory')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'udise_directory'
                ? 'bg-white text-blue-700 shadow-xs border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>UDISE Master Directory</span>
          </button>
        </div>
      </div>

      {/* Global Action Feedback Notification */}
      {actionFeedback && (
        <div className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in ${
          actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {actionFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{actionFeedback.text}</span>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          VIEW 1: CLAIMS APPROVAL QUEUE
         ═════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'claims' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {/* Controls Bar */}
          <div className="p-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Filter Status:</span>
              {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setClaimsFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
                    claimsFilter === f
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f} {f === 'all' ? `(${claims.length})` : `(${claims.filter(c => (c.status || '').toLowerCase() === f).length})`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchClaims}
              disabled={isLoadingClaims}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingClaims ? 'animate-spin' : ''}`} />
              <span>Refresh Claims</span>
            </button>
          </div>

          {/* Multi-Selection Bulk Action Bar */}
          {selectedClaimIds.size > 0 && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-900 bg-rose-200/70 px-2 py-0.5 rounded-full text-[11px]">
                  {selectedClaimIds.size} Selected
                </span>
                <span className="text-rose-700 font-medium">Claims selected for permanent deletion from database</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClaimIds(new Set())}
                  className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={handleBulkDeleteClaims}
                  disabled={isDeletingClaims}
                  className="px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeletingClaims ? 'Deleting...' : `Delete Selected (${selectedClaimIds.size})`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Claims Table */}
          <div className="overflow-x-auto">
            {isLoadingClaims ? (
              <div className="p-12 text-center text-gray-500 text-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading claims from Supabase database...</span>
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                No school claims found matching this filter.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-9">
                      <input
                        type="checkbox"
                        checked={filteredClaims.length > 0 && filteredClaims.every(c => selectedClaimIds.has(c.id || c.udise_code))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClaimIds(new Set(filteredClaims.map(c => c.id || c.udise_code)));
                          } else {
                            setSelectedClaimIds(new Set());
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        title="Select / Deselect All Claims"
                      />
                    </th>
                    <th className="py-2.5 px-3">School Name &amp; UDISE</th>
                    <th className="py-2.5 px-3">Claimant Details</th>
                    <th className="py-2.5 px-3">Designation / Phone</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Security (Bcrypt Hash)</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClaims.map((claim) => {
                    const isPending = claim.status === 'pending';
                    const isApproved = claim.status === 'approved';
                    const hasKeyHash = Boolean(claim.key_hash);
                    const isSelected = selectedClaimIds.has(claim.id || claim.udise_code);

                    return (
                      <tr key={claim.id || claim.udise_code} className={`transition-colors ${isSelected ? 'bg-rose-50/60' : 'hover:bg-blue-50/40'}`}>
                        <td className="py-3 px-3 w-9">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const key = claim.id || claim.udise_code;
                              setSelectedClaimIds(prev => {
                                const next = new Set(prev);
                                if (e.target.checked) next.add(key);
                                else next.delete(key);
                                return next;
                              });
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{claim.school_name || 'School Profile'}</p>
                          <p className="font-mono text-[11px] text-gray-500 mt-0.5">UDISE: {claim.udise_code}</p>
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-medium text-gray-900">{claim.claimant_name || '—'}</p>
                          <p className="text-[11px] text-gray-500">{claim.claimant_email || '—'}</p>
                        </td>

                        <td className="py-3 px-3">
                          <p className="text-gray-800">{claim.designation || 'Administrator'}</p>
                          <p className="font-mono text-[11px] text-gray-500">{claim.whatsapp_number || '—'}</p>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            isPending ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{claim.status || 'Pending'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {hasKeyHash ? (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono" title={claim.key_hash}>
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>{claim.key_hash.slice(0, 12)}...</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">No Key (Pending Approval)</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveClaim(claim)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve &amp; Generate Key</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectClaim(claim.udise_code)}
                                  className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium cursor-pointer"
                                  title="Reject claim"
                                >
                                  <XCircle className="w-3 h-3" />
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveClaim(claim)}
                                  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                  title="Re-generate and overwrite secret key"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Regen Key</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectClaim(claim.udise_code)}
                                  className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                  title="Reject and revoke this approved claim"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {!isPending && !isApproved && (
                              <button
                                type="button"
                                onClick={() => handleApproveClaim(claim)}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                title="Re-approve claim"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Permanently Delete Claim Button (Admin Full Power) */}
                            <button
                              type="button"
                              onClick={() => handleDeleteClaim(claim)}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
                              title="Delete claim permanently from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`/dashboard/school-profile?udise=${claim.udise_code}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                              title="Open School Profile Dashboard"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {!isLoadingSchools && schools.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-medium">
                  Showing <strong className="text-gray-900">{((page - 1) * limit) + 1}</strong> to{' '}
                  <strong className="text-gray-900">{Math.min(page * limit, totalSchools)}</strong> of{' '}
                  <strong className="text-gray-900">{totalSchools.toLocaleString()}</strong> schools
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || isLoadingSchools}
                    onClick={() => fetchSchools(searchQuery, page - 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-mono font-bold text-blue-900">
                    Page {page} of {Math.max(1, Math.ceil(totalSchools / limit))}
                  </span>
                  <button
                    type="button"
                    disabled={page >= Math.ceil(totalSchools / limit) || isLoadingSchools}
                    onClick={() => fetchSchools(searchQuery, page + 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          VIEW 2: UDISE MASTER DIRECTORY & SCHOOL PROFILES
         ═════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'udise_directory' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {/* Controls Bar */}
          <div className="p-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50/70">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by School Name or 11-digit UDISE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchSchools(searchQuery)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
              </div>
              <button
                type="button"
                onClick={() => fetchSchools(searchQuery)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddSchoolModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add School to UDISE</span>
              </button>

              <button
                type="button"
                onClick={() => fetchSchools('')}
                disabled={isLoadingSchools}
                className="p-1.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
                title="Reload"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingSchools ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Schools Table */}
          <div className="overflow-x-auto">
            {isLoadingSchools ? (
              <div className="p-12 text-center text-gray-500 text-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading schools from master database...</span>
              </div>
            ) : schools.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">
                No schools found in UDISE master directory.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3">UDISE Code</th>
                    <th className="py-2.5 px-3">School Name</th>
                    <th className="py-2.5 px-3">Location (State / District)</th>
                    <th className="py-2.5 px-3">Board</th>
                    <th className="py-2.5 px-3">Claim Status</th>
                    <th className="py-2.5 px-3">Visibility</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schools.map((school) => {
                    const isPublished = school.is_published !== false;
                    const isClaimed = Boolean(school.is_claimed);

                    return (
                      <tr key={school.udise_code} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-blue-900">
                          {school.udise_code}
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{school.school_name}</p>
                          <p className="text-[11px] text-gray-500 truncate max-w-xs">{school.address || '—'}</p>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-gray-800">{school.state_name || 'DELHI'}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-600">{school.district_name || 'WEST'}</span>
                        </td>

                        <td className="py-3 px-3 font-semibold text-gray-700">
                          {school.profile_board || school.board_10th || 'CBSE'}
                        </td>

                        <td className="py-3 px-3">
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Claimed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Unclaimed
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(school.udise_code, isPublished)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                            }`}
                            title="Click to toggle Public Visibility"
                          >
                            {isPublished ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                            <span>{isPublished ? 'Published' : 'Hidden'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/dashboard/school-profile?udise=${school.udise_code}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                              title="Edit in Visual School Profile Dashboard"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Profile</span>
                            </a>

                            <a
                              href={`/edu-network/school/delhi/west/${school.udise_code}/${encodeURIComponent(school.school_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                              title="View Public Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {!isLoadingSchools && schools.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-t border-gray-200 text-xs">
                <span className="text-gray-500 font-medium">
                  Showing <strong className="text-gray-900">{((page - 1) * limit) + 1}</strong> to{' '}
                  <strong className="text-gray-900">{Math.min(page * limit, totalSchools)}</strong> of{' '}
                  <strong className="text-gray-900">{totalSchools.toLocaleString()}</strong> schools
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || isLoadingSchools}
                    onClick={() => fetchSchools(searchQuery, page - 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-mono font-bold text-blue-900">
                    Page {page} of {Math.max(1, Math.ceil(totalSchools / limit))}
                  </span>
                  <button
                    type="button"
                    disabled={page >= Math.ceil(totalSchools / limit) || isLoadingSchools}
                    onClick={() => fetchSchools(searchQuery, page + 1)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── APPROVAL KEY GENERATION MODAL ── */}
      {approvingClaim && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#003B5C] text-white p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight">Claim Approved &amp; Bcrypt Key Generated</h3>
              <p className="text-xs text-sky-200 mt-1">
                The secret key has been hashed using BCrypt and securely stored in the database.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p><strong className="text-gray-900">School:</strong> {approvingClaim.school_name}</p>
                <p><strong className="text-gray-900">UDISE:</strong> <span className="font-mono">{approvingClaim.udise_code}</span></p>
                <p><strong className="text-gray-900">Claimant:</strong> {approvingClaim.claimant_name} ({approvingClaim.claimant_email})</p>
              </div>

              {generatedKey ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Single-Use Verification Secret Key:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedKey}
                      className="w-full px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-300 font-mono text-base font-black text-emerald-900 text-center tracking-widest outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Send this secret key to <strong className="text-gray-800">{approvingClaim.claimant_email}</strong>. They can use it to unlock their school profile dashboard.
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Processing approval and hashing key...</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setApprovingClaim(null)}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 cursor-pointer"
                >
                  Close &amp; Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD SCHOOL MODAL ── */}
      {isAddSchoolModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold">Add New School to UDISE Master Directory</h3>
                <p className="text-xs text-blue-200 mt-0.5">Creates record directly in public.udise_private_schools</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSchoolModalOpen(false)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchoolSubmit} className="p-6 space-y-3.5">
              {createMsg && (
                <div className={`p-2.5 rounded-lg text-xs font-bold ${
                  createMsg.error ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {createMsg.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">UDISE Code (11 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="e.g. 07070388888"
                    value={newSchoolForm.udiseCode}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, udiseCode: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Board *</label>
                  <select
                    value={newSchoolForm.board}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, board: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                    <option value="Cambridge">Cambridge (IGCSE)</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">School Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School A - International Campus"
                  value={newSchoolForm.schoolName}
                  onChange={e => setNewSchoolForm(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">State Name</label>
                  <select
                    value={newSchoolForm.stateName}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, stateName: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="DELHI">Delhi</option>
                    <option value="HARYANA">Haryana</option>
                    <option value="UTTAR PRADESH">Uttar Pradesh</option>
                    <option value="MAHARASHTRA">Maharashtra</option>
                    <option value="KARNATAKA">Karnataka</option>
                    <option value="TAMIL NADU">Tamil Nadu</option>
                    <option value="GUJARAT">Gujarat</option>
                    <option value="RAJASTHAN">Rajasthan</option>
                    <option value="PUNJAB">Punjab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">District Name</label>
                  <input
                    type="text"
                    placeholder="e.g. WEST"
                    value={newSchoolForm.districtName}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, districtName: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 42, Janakpuri Institutional Area"
                  value={newSchoolForm.address}
                  onChange={e => setNewSchoolForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="110058"
                    value={newSchoolForm.pincode}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Residential Type</label>
                  <select
                    value={newSchoolForm.residentialSchool}
                    onChange={e => setNewSchoolForm(prev => ({ ...prev, residentialSchool: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Day School">Day School</option>
                    <option value="Residential">Residential</option>
                    <option value="Day Boarding">Day Boarding</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddSchoolModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSchool}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingSchool && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add School to Master</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
