'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { PartnerSchool, NetworkFilterState } from '../../types';
import { networkApi } from '../../api/networkApiClient';
import { udiseMasterService, UdiseMasterRecord } from '../../api/udiseMasterService';
import uniqueLocations from '@/data/unique_locations.json';
import {
  School, Plus, Search, Filter, Download, Upload,
  MapPin, Users, Award, ShieldCheck, CheckCircle2,
  Trash2, Edit2, Copy, X, SlidersHorizontal, RefreshCw,
  Building, BookOpen, AlertTriangle, Grid2X2, List, Table as TableIcon,
  Globe, Eye, EyeOff, Share2, Check, FileSpreadsheet, Database, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';

interface EduNetworkAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function EduNetworkAdminDashboard({ onAuditLog }: EduNetworkAdminDashboardProps) {
  // ── ACTIVE TOP TAB ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'partners' | 'udise_master'>('partners');

  // ── TAB 1: PARTNER SCHOOLS STATE ────────────────────────────────────────────
  const [schools, setSchools] = useState<PartnerSchool[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');

  // Partner Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'students' | 'name'>('newest');

  // Partner Modals & Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<PartnerSchool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Partner Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [schoolType, setSchoolType] = useState<string>('ATL School');
  const [board, setBoard] = useState<string>('CBSE');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');
  const [studentCount, setStudentCount] = useState(1200);
  const [facultyCount, setFacultyCount] = useState(60);
  const [principalName, setPrincipalName] = useState('Dr. Principal');
  const [email, setEmail] = useState('principal@school.edu.in');
  const [phone, setPhone] = useState('+91 9876543210');
  const [labsEquippedInput, setLabsEquippedInput] = useState('ATL Robotics Lab, Experiential Science Lab');
  const [accreditationLevel, setAccreditationLevel] = useState<string>('Tier 1 Lead');
  const [status, setStatus] = useState<'verified' | 'pending' | 'suspended'>('verified');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // ── TAB 2: ALL-INDIA UDISE MASTER DATABASE STATE (4L+ Records) ──────────────
  const [udiseRecords, setUdiseRecords] = useState<UdiseMasterRecord[]>([]);
  const [udiseTotal, setUdiseTotal] = useState(0);
  const [udisePage, setUdisePage] = useState(1);
  const [udiseLoading, setUdiseLoading] = useState(false);
  const [udiseSearch, setUdiseSearch] = useState('');
  const [udiseStateFilter, setUdiseStateFilter] = useState('All');
  const [udiseDistrictFilter, setUdiseDistrictFilter] = useState('All');
  const [udiseBoardFilter, setUdiseBoardFilter] = useState('All');
  const [udiseImportModalOpen, setUdiseImportModalOpen] = useState(false);
  const [udiseEditRecord, setUdiseEditRecord] = useState<UdiseMasterRecord | null>(null);
  const [udiseFormOpen, setUdiseFormOpen] = useState(false);

  // CSV Import Temp States
  const [csvText, setCsvText] = useState('');
  const [csvPreviewCount, setCsvPreviewCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const udiseFileInputRef = useRef<HTMLInputElement | null>(null);

  // ── LOAD PARTNER SCHOOLS ──────────────────────────────────────────────────
  const loadPartnerData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await networkApi.fetchSchools({
        searchQuery,
        selectedStates,
        selectedBoards,
        status: statusFilter,
        sortBy,
      });
      let items = res.items;
      if (visibilityFilter === 'public') {
        items = items.filter(s => (s as any).isPublic !== false);
      } else if (visibilityFilter === 'private') {
        items = items.filter(s => (s as any).isPublic === false);
      }
      setSchools(items);
      setTotalCount(res.total);
      setStates(res.states);
      setBoards(res.boards);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStates, selectedBoards, statusFilter, visibilityFilter, sortBy]);

  // ── LOAD UDISE MASTER DATABASE RECORDS ────────────────────────────────────
  const loadUdiseData = useCallback(async () => {
    setUdiseLoading(true);
    try {
      const res = await udiseMasterService.fetchRecords({
        searchQuery: udiseSearch,
        state: udiseStateFilter,
        district: udiseDistrictFilter,
        board: udiseBoardFilter,
        page: udisePage,
        pageSize: 25
      });
      setUdiseRecords(res.items);
      setUdiseTotal(res.total);
    } catch (err) {
      console.error('Failed to load UDISE records:', err);
    } finally {
      setUdiseLoading(false);
    }
  }, [udiseSearch, udiseStateFilter, udiseDistrictFilter, udiseBoardFilter, udisePage]);

  useEffect(() => {
    if (activeTab === 'partners') {
      loadPartnerData();
    } else {
      loadUdiseData();
    }
  }, [activeTab, loadPartnerData, loadUdiseData]);

  // ── PARTNER ACTIONS ───────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingSchool(null);
    setName('');
    setCode(`SCH-${Date.now().toString().slice(-4)}`);
    setSchoolType('ATL School');
    setBoard('CBSE');
    setCity('New Delhi');
    setState('Delhi');
    setPincode('110001');
    setStudentCount(1200);
    setFacultyCount(60);
    setPrincipalName('Dr. Principal');
    setEmail('principal@school.edu.in');
    setPhone('+91 9876543210');
    setLabsEquippedInput('ATL Robotics Lab, Experiential Science Lab');
    setAccreditationLevel('Tier 1 Lead');
    setStatus('verified');
    setIsPublic(true);
    setFormOpen(true);
  };

  const openEditModal = (s: PartnerSchool) => {
    setEditingSchool(s);
    setName(s.name);
    setCode(s.code);
    setSchoolType(s.type);
    setBoard(s.board);
    setCity(s.city);
    setState(s.state);
    setPincode(s.pincode);
    setStudentCount(s.studentCount);
    setFacultyCount(s.facultyCount);
    setPrincipalName(s.principalName);
    setEmail(s.email);
    setPhone(s.phone);
    setLabsEquippedInput(s.labsEquipped.join(', '));
    setAccreditationLevel(s.accreditationLevel);
    setStatus((s.status as any) || 'verified');
    setIsPublic((s as any).isPublic !== false);
    setFormOpen(true);
  };

  const handleSavePartnerSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    setIsSubmitting(true);
    try {
      const labs = labsEquippedInput.split(',').map((l) => l.trim()).filter(Boolean);
      const payload: any = {
        name: name.trim(),
        code: code.trim(),
        type: schoolType,
        board,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        studentCount: Number(studentCount),
        facultyCount: Number(facultyCount),
        principalName: principalName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        labsEquipped: labs,
        accreditationLevel,
        status,
        isPublic
      };

      if (editingSchool) {
        await networkApi.updateSchool(editingSchool.id, payload);
        onAuditLog?.('UPDATED_SCHOOL', 'edu_network', `Updated partner school: ${name}`);
      } else {
        await networkApi.createSchool(payload);
        onAuditLog?.('REGISTERED_SCHOOL', 'edu_network', `Registered partner school: ${name}`);
      }

      setFormOpen(false);
      loadPartnerData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (school: PartnerSchool) => {
    const newIsPublic = !(school as any).isPublic;
    try {
      await networkApi.updateSchool(school.id, { isPublic: newIsPublic } as any);
      setSchools(prev => prev.map(s => s.id === school.id ? { ...s, isPublic: newIsPublic } as any : s));
      onAuditLog?.('VISIBILITY_CHANGE', 'edu_network', `Changed visibility of ${school.name} to ${newIsPublic ? 'Public' : 'Private'}`);
    } catch (err: any) {
      alert('Visibility update failed: ' + err.message);
    }
  };

  const handleToggleVerification = async (school: PartnerSchool) => {
    const newStatus = school.status === 'verified' ? 'pending' : 'verified';
    try {
      await networkApi.updateSchool(school.id, { status: newStatus });
      setSchools(prev => prev.map(s => s.id === school.id ? { ...s, status: newStatus } : s));
      onAuditLog?.('STATUS_CHANGE', 'edu_network', `Set status of ${school.name} to ${newStatus}`);
    } catch (err: any) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDeleteSchool = async (id: string, sName: string) => {
    if (!confirm(`Are you sure you want to delete "${sName}"?`)) return;
    try {
      await networkApi.deleteSchool(id);
      onAuditLog?.('DELETED_SCHOOL', 'edu_network', `Removed school: ${sName}`);
      loadPartnerData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleShareSchool = (school: PartnerSchool) => {
    const url = `${window.location.origin}/edu-network/org/${school.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(school.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    if (navigator.share) {
      navigator.share({ title: school.name, url }).catch(() => {});
    }
  };

  // ── PARTNER CSV IMPORT PARSER ─────────────────────────────────────────────
  const handlePartnerCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      const lines = text.split('\\n').filter(l => l.trim());
      setCsvPreviewCount(Math.max(0, lines.length - 1));
    };
    reader.readAsText(file);
  };

  const handleProcessPartnerCsv = async () => {
    if (!csvText.trim()) return;
    setIsSubmitting(true);
    try {
      const lines = csvText.split('\\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        alert('CSV must contain header row and at least 1 data row.');
        return;
      }
      let success = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols[0]) {
          const payload = {
            name: cols[0],
            code: cols[1] || `SCH-${Date.now().toString().slice(-4)}-${i}`,
            board: cols[2] || 'CBSE',
            city: cols[3] || 'Delhi',
            state: cols[4] || 'Delhi',
            studentCount: Number(cols[5]) || 1000,
            facultyCount: Number(cols[6]) || 50,
            principalName: cols[7] || 'Principal',
            email: cols[8] || 'contact@school.edu.in',
            phone: cols[9] || '+91 9876543210',
            type: 'ATL School',
            pincode: '110001',
            labsEquipped: ['Experiential Science Lab', 'Robotics Lab'],
            accreditationLevel: 'Tier 1 Lead',
            status: 'verified' as const
          };
          await networkApi.createSchool(payload);
          success++;
        }
      }
      alert(`Successfully imported ${success} partner schools!`);
      setImportModalOpen(false);
      setCsvText('');
      loadPartnerData();
    } catch (err: any) {
      alert('Import failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── UDISE MASTER ACTIONS ──────────────────────────────────────────────────
  const handleOnboardUdiseSchool = async (record: UdiseMasterRecord) => {
    try {
      await udiseMasterService.onboardSchool(record);
      setUdiseRecords(prev => prev.map(r => r.id === record.id ? { ...r, is_onboarded: true } : r));
      alert(`🎉 "${record.school_name}" has been onboarded to Verified Partner Schools Directory!`);
      onAuditLog?.('ONBOARD_UDISE_SCHOOL', 'edu_network', `Onboarded UDISE school: ${record.school_name} (${record.udise_code})`);
    } catch (err: any) {
      alert('Onboarding failed: ' + err.message);
    }
  };

  const handleDeleteUdiseRecord = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete UDISE record "${name}"?`)) return;
    try {
      await udiseMasterService.deleteRecord(id);
      loadUdiseData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSaveUdiseRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!udiseEditRecord) return;
    setIsSubmitting(true);
    try {
      if (udiseEditRecord.id) {
        await udiseMasterService.updateRecord(udiseEditRecord.id, udiseEditRecord);
      } else {
        await udiseMasterService.createRecord(udiseEditRecord);
      }
      setUdiseFormOpen(false);
      loadUdiseData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUdiseCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      const lines = text.split('\\n').filter(l => l.trim());
      setCsvPreviewCount(Math.max(0, lines.length - 1));
    };
    reader.readAsText(file);
  };

  const handleProcessUdiseCsv = async () => {
    if (!csvText.trim()) return;
    setIsSubmitting(true);
    try {
      const lines = csvText.split('\\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        alert('CSV must contain header row and at least 1 data row.');
        return;
      }
      const recordsToInsert: Partial<UdiseMasterRecord>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols[0] && cols[1]) {
          recordsToInsert.push({
            school_name: cols[0],
            udise_code: cols[1],
            district: cols[2] || 'Central',
            state: cols[3] || 'Delhi NCR',
            block: cols[4] || 'Block-1',
            board: cols[5] || 'CBSE',
            category: cols[6] || 'Pre-Primary to 12th',
            management: 'Private Unaided',
            is_onboarded: false
          });
        }
      }
      const res = await udiseMasterService.bulkUpsert(recordsToInsert);
      alert(`Successfully imported ${res.success} UDISE records into Master Database!`);
      setUdiseImportModalOpen(false);
      setCsvText('');
      loadUdiseData();
    } catch (err: any) {
      alert('UDISE bulk import failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportUdiseToCsv = () => {
    if (udiseRecords.length === 0) return;
    const headers = ['School Name', 'UDISE Code', 'District', 'State', 'Block', 'Board', 'Category', 'Is Onboarded'];
    const rows = udiseRecords.map(r => [
      `"${r.school_name}"`,
      `"${r.udise_code}"`,
      `"${r.district}"`,
      `"${r.state}"`,
      `"${r.block}"`,
      `"${r.board}"`,
      `"${r.category}"`,
      r.is_onboarded ? 'Yes' : 'No'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UDISE_Master_Database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* ── TOP NAVIGATION TABS (DUAL DATABASE SYSTEM) ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-black text-indigo-700 mb-1.5">
            <School className="w-3.5 h-3.5" />
            <span>ACADEMIC INSTITUTIONS &amp; NATIONAL UDISE DATA GOVERNANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {activeTab === 'partners' ? 'Partner Schools & STEM Infrastructure Registry' : 'All-India UDISE Master Database (400,000+ Schools)'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'partners' 
              ? 'Govern accredited partner schools, STEM live labs KYC, public/private visibility, and direct profile shares.' 
              : 'Nationwide institutional directory lookup storing 4,00,000+ schools with UDISE ID, District, Block, State & Board.'}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'partners' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Partner Schools ({totalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('udise_master')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'udise_master' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>🇮🇳 UDISE Master (4L+ Pool)</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: PARTNER SCHOOLS REGISTRY ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'partners' && (
        <div className="space-y-5">
          {/* Action Header Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner schools, code, city, board, principal..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Status & Visibility Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending KYC</option>
              </select>

              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as any)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="all">All Visibility</option>
                <option value="public">🌐 Public Only</option>
                <option value="private">🔒 Private Only</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500'}`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500'}`}
                  title="Grid View"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Import, Export, Add */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setImportModalOpen(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Import CSV</span>
              </button>

              <a
                href={networkApi.getExportUrl()}
                download
                data-skip-progress="true"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </a>

              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Partner</span>
              </button>
            </div>
          </div>

          {/* Data List / Table / Grid */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">Loading verified partner schools...</p>
            </div>
          ) : schools.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <School className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No partner schools found</h4>
              <p className="text-xs text-slate-500">Try changing your search term or add a new school.</p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">School &amp; Code</th>
                      <th className="p-3.5">Board &amp; Location</th>
                      <th className="p-3.5">Students / Staff</th>
                      <th className="p-3.5">STEM Labs</th>
                      <th className="p-3.5">Visibility</th>
                      <th className="p-3.5">KYC Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {schools.map((school) => {
                      const isPublicVal = (school as any).isPublic !== false;
                      const isVerified = school.status === 'verified';

                      return (
                        <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-black text-slate-900 flex items-center gap-1.5">
                              <Link href={`/edu-network/org/${school.id}`} className="hover:text-indigo-600 hover:underline">
                                {school.name}
                              </Link>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{school.code}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-700">
                              {school.board}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {school.city}, {school.state}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-800">{school.studentCount.toLocaleString()} Students</div>
                            <div className="text-[10px] text-slate-400">{school.facultyCount} Teachers</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                              {school.labsEquipped?.length || 0} Labs
                            </span>
                          </td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(school)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition cursor-pointer ${
                                isPublicVal ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                              title="Click to toggle Public / Private"
                            >
                              {isPublicVal ? <Globe className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                              <span>{isPublicVal ? 'Public' : 'Private'}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleVerification(school)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition cursor-pointer ${
                                isVerified ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                              title="Click to toggle Verification Status"
                            >
                              {isVerified ? <CheckCircle2 className="w-3 h-3 text-indigo-600" /> : <AlertTriangle className="w-3 h-3" />}
                              <span>{isVerified ? 'Verified' : 'Pending KYC'}</span>
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleShareSchool(school)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 transition"
                                title="Copy / Share Public Profile Link"
                              >
                                {copiedId === school.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(school)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition"
                                title="Edit School Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSchool(school.id, school.name)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition"
                                title="Delete School"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school) => {
                const isPublicVal = (school as any).isPublic !== false;
                const isVerified = school.status === 'verified';

                return (
                  <div key={school.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3 relative group hover:border-indigo-300 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{school.code}</span>
                        <h3 className="font-black text-sm text-slate-900 truncate">
                          <Link href={`/edu-network/org/${school.id}`}>{school.name}</Link>
                        </h3>
                        <p className="text-[11px] text-slate-500">{school.city}, {school.state} • {school.board}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isVerified ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-xl text-center text-[10px] font-bold text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Students</span>
                        <span>{school.studentCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Teachers</span>
                        <span>{school.facultyCount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Labs</span>
                        <span>{school.labsEquipped?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(school)}
                        className={`text-[10px] font-black flex items-center gap-1 ${
                          isPublicVal ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {isPublicVal ? <Globe className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isPublicVal ? 'Public Listed' : 'Private Draft'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button onClick={() => handleShareSchool(school)} className="p-1 text-slate-400 hover:text-indigo-600">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEditModal(school)} className="p-1 text-slate-400 hover:text-blue-600">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteSchool(school.id, school.name)} className="p-1 text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: ALL-INDIA UDISE MASTER DATABASE (400,000+ SCHOOLS) ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'udise_master' && (
        <div className="space-y-5">
          {/* UDISE Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">National UDISE Pool</span>
              <p className="text-lg font-black text-slate-900">{udiseTotal.toLocaleString()} Schools</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">States &amp; UTs</span>
              <p className="text-lg font-black text-indigo-700">16 States</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Districts Mapped</span>
              <p className="text-lg font-black text-blue-700">31+ Districts</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Onboarded to Partner</span>
              <p className="text-lg font-black text-emerald-600">{totalCount} Onboarded</p>
            </div>
          </div>

          {/* UDISE Filters & Action Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={udiseSearch}
                  onChange={(e) => {
                    setUdiseSearch(e.target.value);
                    setUdisePage(1);
                  }}
                  placeholder="Search UDISE Code, School Name, District, Block, State (e.g. 070102, DPS, Haryana)..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setUdiseImportModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bulk Upload UDISE CSV</span>
                </button>

                <button
                  type="button"
                  onClick={exportUdiseToCsv}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export UDISE CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUdiseEditRecord({
                      id: '',
                      school_name: '',
                      udise_code: `07${Date.now().toString().slice(-9)}`,
                      district: 'Central',
                      state: 'Delhi NCR',
                      block: 'Block-1',
                      board: 'CBSE',
                      category: 'Higher Secondary',
                      management: 'Private Unaided',
                      is_onboarded: false
                    });
                    setUdiseFormOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add UDISE Entry</span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
              <select
                value={udiseStateFilter}
                onChange={(e) => {
                  setUdiseStateFilter(e.target.value);
                  setUdiseDistrictFilter('All');
                  setUdisePage(1);
                }}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="All">All States ({uniqueLocations.states.length})</option>
                {uniqueLocations.states.map(s => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>

              <select
                value={udiseDistrictFilter}
                onChange={(e) => {
                  setUdiseDistrictFilter(e.target.value);
                  setUdisePage(1);
                }}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="All">All Districts / Cities</option>
                {uniqueLocations.cities
                  .filter(c => udiseStateFilter === 'All' || c.state.toLowerCase() === udiseStateFilter.toLowerCase())
                  .map(c => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
              </select>

              <select
                value={udiseBoardFilter}
                onChange={(e) => {
                  setUdiseBoardFilter(e.target.value);
                  setUdisePage(1);
                }}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
              >
                <option value="All">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB / Cambridge</option>
              </select>

              <span className="text-slate-400 font-medium ml-auto text-[11px]">
                Showing page {udisePage} of {Math.ceil(udiseTotal / 25) || 1} ({udiseTotal.toLocaleString()} total entries)
              </span>
            </div>
          </div>

          {/* UDISE Master Data Table */}
          {udiseLoading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">Querying All-India UDISE Master Database...</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">School Name</th>
                      <th className="p-3.5">UDISE ID</th>
                      <th className="p-3.5">State &amp; District</th>
                      <th className="p-3.5">Block / Locality</th>
                      <th className="p-3.5">Board / Level</th>
                      <th className="p-3.5">Registry Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {udiseRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 max-w-[220px] truncate">
                          {r.school_name}
                        </td>
                        <td className="p-3.5">
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(r.udise_code);
                              setCopiedId(r.udise_code);
                              setTimeout(() => setCopiedId(null), 1500);
                            }}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[11px] border border-slate-200 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                            title="Click to copy UDISE Code"
                          >
                            {r.udise_code} {copiedId === r.udise_code ? '✓' : ''}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{r.district}</div>
                          <div className="text-[10px] text-slate-400">{r.state}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {r.block || '-'}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                            {r.board || 'CBSE'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">{r.category}</div>
                        </td>
                        <td className="p-3.5">
                          {r.is_onboarded ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Onboarded Partner</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] border border-slate-200">
                              National Pool
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!r.is_onboarded && (
                              <button
                                type="button"
                                onClick={() => handleOnboardUdiseSchool(r)}
                                className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[10px] rounded-lg shadow-xs flex items-center gap-1 transition"
                                title="Onboard to Verified Partner Directory"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>+ Onboard</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setUdiseEditRecord(r);
                                setUdiseFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition"
                              title="Edit UDISE Entry"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUdiseRecord(r.id, r.school_name)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  type="button"
                  disabled={udisePage <= 1}
                  onClick={() => setUdisePage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="font-bold text-slate-700">
                  Page {udisePage} of {Math.ceil(udiseTotal / 25) || 1}
                </span>

                <button
                  type="button"
                  disabled={udisePage >= Math.ceil(udiseTotal / 25)}
                  onClick={() => setUdisePage(prev => prev + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold disabled:opacity-40 flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODALS (PARTNER EDIT / CREATE / CSV IMPORT / UDISE IMPORT) ── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {/* 1. Partner School Edit / Create Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900">
                {editingSchool ? `Edit "${editingSchool.name}"` : 'Register New Partner School'}
              </h3>
              <button onClick={() => setFormOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartnerSchool} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">School Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Delhi Public School"
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">School Code / UDISE *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="SCH-001 or 07010200301"
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Board</label>
                  <select value={board} onChange={(e) => setBoard(e.target.value)} className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold">
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB / Cambridge</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / District</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Students</label>
                  <input type="number" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Faculty / Teachers</label>
                  <input type="number" value={facultyCount} onChange={(e) => setFacultyCount(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipped STEM Labs (Comma Separated)</label>
                <input
                  type="text"
                  value={labsEquippedInput}
                  onChange={(e) => setLabsEquippedInput(e.target.value)}
                  placeholder="ATL Robotics Lab, Chemistry Lab, AR/VR Pod, Math Studio"
                  className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold text-blue-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Visibility on Public Directory</label>
                  <select
                    value={isPublic ? 'true' : 'false'}
                    onChange={(e) => setIsPublic(e.target.value === 'true')}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="true">🌐 Public (Visible on Website)</option>
                    <option value="false">🔒 Private (Hidden/Draft)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Verification Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="verified">✅ Verified Partner</option>
                    <option value="pending">⏳ Pending Review</option>
                    <option value="suspended">❌ Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md"
                >
                  {isSubmitting ? 'Saving...' : 'Save School Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Partner CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-base text-slate-900">Bulk Import Partner Schools (CSV)</h3>
              </div>
              <button onClick={() => setImportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Upload CSV file with columns: <br />
              <code className="font-mono bg-slate-100 p-1 rounded block mt-1 text-[11px]">
                Name, Code, Board, City, State, Students, Teachers, Principal, Email, Phone
              </code>
            </p>

            <div className="p-4 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl text-center space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handlePartnerCsvFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
              >
                Choose CSV File
              </button>
              {csvPreviewCount > 0 && (
                <p className="text-xs font-bold text-emerald-700">✓ Detected {csvPreviewCount} data rows</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button onClick={() => setImportModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleProcessPartnerCsv}
                disabled={csvPreviewCount === 0 || isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-md"
              >
                {isSubmitting ? 'Importing...' : `Import ${csvPreviewCount} Schools`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. UDISE Master CSV Import Modal */}
      {udiseImportModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-base text-slate-900">Bulk Upload UDISE Master Dataset (4L+ Pool)</h3>
              </div>
              <button onClick={() => setUdiseImportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Upload large UDISE datasets (CSV format) with headers: <br />
              <code className="font-mono bg-slate-100 p-1 rounded block mt-1 text-[11px]">
                school_name, udise_code, district, state, block, board, category
              </code>
            </p>

            <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl text-center space-y-2">
              <input
                ref={udiseFileInputRef}
                type="file"
                accept=".csv"
                onChange={handleUdiseCsvFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => udiseFileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Choose UDISE Master CSV File
              </button>
              {csvPreviewCount > 0 && (
                <p className="text-xs font-bold text-emerald-700">✓ Detected {csvPreviewCount} UDISE school records</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button onClick={() => setUdiseImportModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleProcessUdiseCsv}
                disabled={csvPreviewCount === 0 || isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-md"
              >
                {isSubmitting ? 'Upserting...' : `Ingest ${csvPreviewCount} UDISE Records`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. UDISE Record Edit / Create Modal */}
      {udiseFormOpen && udiseEditRecord && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-3 my-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-base text-slate-900">
                {udiseEditRecord.id ? 'Edit UDISE Master Record' : 'Create UDISE Master Record'}
              </h3>
              <button onClick={() => setUdiseFormOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUdiseRecord} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">School Name *</label>
                <input
                  type="text"
                  required
                  value={udiseEditRecord.school_name}
                  onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, school_name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">UDISE ID *</label>
                  <input
                    type="text"
                    required
                    value={udiseEditRecord.udise_code}
                    onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, udise_code: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Board</label>
                  <input
                    type="text"
                    value={udiseEditRecord.board}
                    onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, board: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">State</label>
                  <input
                    type="text"
                    value={udiseEditRecord.state}
                    onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, state: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">District</label>
                  <input
                    type="text"
                    value={udiseEditRecord.district}
                    onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Block</label>
                  <input
                    type="text"
                    value={udiseEditRecord.block}
                    onChange={(e) => setUdiseEditRecord({ ...udiseEditRecord, block: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-end gap-2">
                <button type="button" onClick={() => setUdiseFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl">
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
