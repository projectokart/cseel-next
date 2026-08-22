'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PartnerSchool, NetworkFilterState } from '../../types';
import { networkApi } from '../../api/networkApiClient';
import {
  School, Plus, Search, Filter, Download, Upload,
  MapPin, Users, Award, ShieldCheck, CheckCircle2,
  Trash2, Edit2, Copy, X, SlidersHorizontal, RefreshCw,
  Building, BookOpen, AlertTriangle, Grid2X2, List, Table as TableIcon
} from 'lucide-react';

interface EduNetworkAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function EduNetworkAdminDashboard({ onAuditLog }: EduNetworkAdminDashboardProps) {
  const [schools, setSchools] = useState<PartnerSchool[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [boards, setBoards] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'students' | 'name'>('newest');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<PartnerSchool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
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
  const [labsEquippedInput, setLabsEquippedInput] = useState('ATL Robotics Lab, Chemistry Lab');
  const [accreditationLevel, setAccreditationLevel] = useState<string>('Tier 1 Lead');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await networkApi.fetchSchools({
        searchQuery,
        selectedStates,
        selectedBoards,
        status: statusFilter,
        sortBy,
      });
      setSchools(res.items);
      setTotalCount(res.total);
      setStates(res.states);
      setBoards(res.boards);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStates, selectedBoards, statusFilter, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    setLabsEquippedInput('ATL Robotics Lab, Chemistry Lab');
    setAccreditationLevel('Tier 1 Lead');
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
    setFormOpen(true);
  };

  const handleSaveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;

    setIsSubmitting(true);
    try {
      const labs = labsEquippedInput.split(',').map((l) => l.trim()).filter(Boolean);
      const payload = {
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
        status: 'verified' as const,
      };

      if (editingSchool) {
        await networkApi.updateSchool(editingSchool.id, payload);
        onAuditLog?.('UPDATED_SCHOOL', 'edu_network', `Updated partner school: ${name}`);
      } else {
        await networkApi.createSchool(payload);
        onAuditLog?.('REGISTERED_SCHOOL', 'edu_network', `Registered partner school: ${name}`);
      }

      setFormOpen(false);
      loadData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchool = async (id: string, sName: string) => {
    if (!confirm(`Are you sure you want to remove "${sName}"?`)) return;
    try {
      await networkApi.deleteSchool(id);
      onAuditLog?.('DELETED_SCHOOL', 'edu_network', `Removed school: ${sName}`);
      loadData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-black text-indigo-700 dark:text-indigo-300">
            <School className="w-3.5 h-3.5" />
            <span>EDUNETWORK & ACADEMIC PARTNERSHIPS SERVICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Partner Schools, ATL Labs & Faculty Registry
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Govern accredited K-12 partner schools, ATL lab infrastructure, and institutional certifications with dedicated microservice endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={networkApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner School</span>
          </button>
        </div>
      </div>

      {/* ── WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Filters</span>
              </span>
              {(selectedStates.length > 0 || selectedBoards.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStates([]);
                    setSelectedBoards([]);
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400">State / Region</p>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {states.map((st) => {
                  const isChecked = selectedStates.includes(st);
                  return (
                    <label
                      key={st}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer ${
                        isChecked ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedStates((prev) =>
                              prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
                            )
                          }
                          className="w-3.5 h-3.5 accent-indigo-600 rounded"
                        />
                        <span className="truncate">{st}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Board Filter */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Education Board</p>
              <div className="space-y-1">
                {['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge'].map((b) => {
                  const isChecked = selectedBoards.includes(b);
                  return (
                    <label
                      key={b}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                        isChecked ? 'text-indigo-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedBoards((prev) =>
                            prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
                          )
                        }
                        className="w-3.5 h-3.5 accent-indigo-600 rounded"
                      />
                      <span>{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search schools by name, city, code, principal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Grid View"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Detailed List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Spreadsheet Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-xs outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="students">Most Students</option>
                <option value="name">Alphabetical</option>
              </select>
              <button onClick={loadData} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <School className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold">No partner schools match your filters.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase text-slate-500 border-b">
                    <tr>
                      <th className="p-3">School Name & Code</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Board & Tier</th>
                      <th className="p-3">Students & Faculty</th>
                      <th className="p-3">Principal</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {schools.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{s.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{s.code}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-slate-700 dark:text-slate-300">{s.city}, {s.state}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold">
                            {s.board} • {s.accreditationLevel}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-indigo-600">{s.studentCount.toLocaleString('en-IN')} Students</p>
                          <p className="text-[10px] text-slate-400">{s.facultyCount} Faculty</p>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{s.principalName}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(s)}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSchool(s.id, s.name)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete"
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
            </div>
          ) : viewMode === 'list' ? (
            /* Detailed List View */
            <div className="space-y-3">
              {schools.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase">
                        {s.type} • {s.board}
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {s.accreditationLevel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{s.code}</span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate max-w-lg">
                      {s.name}
                    </h4>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                      <span>📍 {s.city}, {s.state}</span>
                      <span>👥 {s.studentCount.toLocaleString('en-IN')} Students</span>
                      <span>👨‍🏫 {s.facultyCount} Faculty</span>
                      <span>Principal: {s.principalName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchool(s.id, s.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {schools.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase border border-indigo-200">
                        {s.type} • {s.board}
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> {s.accreditationLevel}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {s.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Code: {s.code}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.city}, {s.state}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-600" /> {s.studentCount.toLocaleString('en-IN')} Students</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {s.labsEquipped.map((lab, lIdx) => (
                        <span key={lIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {lab}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Principal: {s.principalName}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSchool(s.id, s.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── MODAL: Register / Edit Partner School ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-700">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingSchool ? 'Edit Partner School' : 'Register Partner Institution'}
                  </h3>
                  <p className="text-[11px] text-slate-500">K-12 Schools, ATL Labs & Higher Ed Accreditation</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchool} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">School / Institution Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Affiliation Code</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-mono bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Institution Type</label>
                  <select value={schoolType} onChange={(e) => setSchoolType(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="ATL School">ATL School</option>
                    <option value="K-12">K-12</option>
                    <option value="Higher Ed">Higher Ed</option>
                    <option value="Vocational">Vocational</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Board</label>
                  <select value={board} onChange={(e) => setBoard(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State</label>
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Students</label>
                  <input type="number" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faculty Count</label>
                  <input type="number" value={facultyCount} onChange={(e) => setFacultyCount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Accreditation</label>
                  <select value={accreditationLevel} onChange={(e) => setAccreditationLevel(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Tier 1 Lead">Tier 1 Lead</option>
                    <option value="Tier 2 Certified">Tier 2 Certified</option>
                    <option value="Associate Partner">Associate Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Principal / Head Name</label>
                  <input type="text" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipped Science Labs (Comma Separated)</label>
                <input type="text" value={labsEquippedInput} onChange={(e) => setLabsEquippedInput(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md flex items-center gap-2">
                  <span>{isSubmitting ? 'Saving...' : editingSchool ? 'Update School' : 'Register School'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
