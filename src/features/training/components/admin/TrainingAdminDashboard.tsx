'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrainingProgram, TrainingFormat, TrainingLevel, TrainingFilterState } from '../../types';
import { trainingApi } from '../../api/trainingApiClient';
import {
  GraduationCap, Plus, Search, Filter, Download, Upload,
  Clock, Users, Award, Calendar, Trash2, Edit2, Copy,
  X, SlidersHorizontal, RefreshCw, CheckCircle2, DollarSign
} from 'lucide-react';

interface TrainingAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function TrainingAdminDashboard({ onAuditLog }: TrainingAdminDashboardProps) {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<TrainingFormat[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'startDate' | 'enrolled' | 'newest'>('startDate');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<TrainingProgram | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Physics');
  const [format, setFormat] = useState<string>('Hands-on Bootcamp');
  const [level, setLevel] = useState<string>('Foundational');
  const [durationHours, setDurationHours] = useState(24);
  const [batchSize, setBatchSize] = useState(40);
  const [leadTrainer, setLeadTrainer] = useState('Dr. Senior Scientist');
  const [trainerRole, setTrainerRole] = useState('National Pedagogy Lead');
  const [certificationOffered, setCertificationOffered] = useState('Certified STEM Master Educator');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [feeInr, setFeeInr] = useState(2499);
  const [curriculumSummary, setCurriculumSummary] = useState('');
  const [learningOutcomesInput, setLearningOutcomesInput] = useState('Design 15+ lab setups, Assessment rubrics');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await trainingApi.fetchPrograms({
        searchQuery,
        selectedCategories,
        selectedFormats,
        status: statusFilter,
        sortBy,
      });
      setPrograms(res.items);
      setTotalCount(res.total);
      setCategories(res.categories);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories, selectedFormats, statusFilter, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingProg(null);
    setTitle('');
    setCategory('Physics');
    setFormat('Hands-on Bootcamp');
    setLevel('Foundational');
    setDurationHours(24);
    setBatchSize(40);
    setLeadTrainer('Dr. Senior Scientist');
    setTrainerRole('National Pedagogy Lead');
    setCertificationOffered('Certified STEM Master Educator');
    setStartDate('2026-09-15');
    setFeeInr(2499);
    setCurriculumSummary('Comprehensive practical training covering hands-on pedagogy...');
    setLearningOutcomesInput('Design 15+ lab setups, Assessment rubrics');
    setFormOpen(true);
  };

  const openEditModal = (p: TrainingProgram) => {
    setEditingProg(p);
    setTitle(p.title);
    setCategory(p.category);
    setFormat(p.format);
    setLevel(p.level);
    setDurationHours(p.durationHours);
    setBatchSize(p.batchSize);
    setLeadTrainer(p.leadTrainer);
    setTrainerRole(p.trainerRole);
    setCertificationOffered(p.certificationOffered);
    setStartDate(p.startDate);
    setFeeInr(p.feeInr);
    setCurriculumSummary(p.curriculumSummary);
    setLearningOutcomesInput(p.learningOutcomes.join(', '));
    setFormOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const outcomes = learningOutcomesInput.split(',').map((o) => o.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        category,
        format,
        level,
        durationHours: Number(durationHours),
        batchSize: Number(batchSize),
        leadTrainer: leadTrainer.trim(),
        trainerRole: trainerRole.trim(),
        certificationOffered: certificationOffered.trim(),
        startDate,
        feeInr: Number(feeInr),
        curriculumSummary: curriculumSummary.trim(),
        learningOutcomes: outcomes,
        status: 'active' as const,
      };

      if (editingProg) {
        await trainingApi.updateProgram(editingProg.id, payload);
        onAuditLog?.('UPDATED_TRAINING', 'programs_training', `Updated program: ${title}`);
      } else {
        await trainingApi.createProgram(payload);
        onAuditLog?.('CREATED_TRAINING', 'programs_training', `Created program: ${title}`);
      }

      setFormOpen(false);
      loadData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProgram = async (id: string, pTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${pTitle}"?`)) return;
    try {
      await trainingApi.deleteProgram(id);
      onAuditLog?.('DELETED_TRAINING', 'programs_training', `Deleted program: ${pTitle}`);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-black text-purple-700 dark:text-purple-300">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>TRAINING & PROGRAMS SERVICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Teacher Training & Pedagogy Bootcamps
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Govern national teacher training cohorts, experiential science masterclasses, and ATL innovation certifications.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={trainingApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Training Cohort</span>
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
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                <span>Filters</span>
              </span>
              {(selectedCategories.length > 0 || selectedFormats.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedFormats([]);
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-purple-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400">Subject Discipline</p>
              <div className="space-y-1">
                {['Physics', 'Chemistry', 'Robotics & IoT', 'NEP Pedagogy', 'AI in Classroom'].map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer ${
                        isChecked ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                            )
                          }
                          className="w-3.5 h-3.5 accent-purple-600 rounded"
                        />
                        <span>{cat}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Format Filter */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Delivery Format</p>
              <div className="space-y-1">
                {(['Hands-on Bootcamp', 'Online Masterclass', 'Hybrid Certification', 'ATL Lab Workshop'] as TrainingFormat[]).map((f) => {
                  const isChecked = selectedFormats.includes(f);
                  return (
                    <label
                      key={f}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                        isChecked ? 'text-purple-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedFormats((prev) =>
                            prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
                          )
                        }
                        className="w-3.5 h-3.5 accent-purple-600 rounded"
                      />
                      <span>{f}</span>
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
                placeholder="Search programs by title, trainer, curriculum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-xs outline-none"
              >
                <option value="startDate">Start Date</option>
                <option value="enrolled">Most Enrolled</option>
                <option value="newest">Newest First</option>
              </select>
              <button onClick={loadData} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
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
          ) : programs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold">No training programs match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-black uppercase border border-purple-200">
                        {p.category} • {p.format}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ₹{p.feeInr.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {p.curriculumSummary}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Starts {p.startDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {p.durationHours} Hours</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-600 font-bold" /> {p.enrolledCount}/{p.batchSize} Enrolled</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] space-y-0.5">
                      <p className="font-bold text-slate-700 dark:text-slate-300">Lead Trainer: {p.leadTrainer}</p>
                      <p className="text-slate-400 text-[10px] truncate">{p.trainerRole}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Certificate Included
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProgram(p.id, p.title)}
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

      {/* ── MODAL: Add / Edit Program ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-purple-100 text-purple-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingProg ? 'Edit Training Cohort' : 'Create Teacher Training Cohort'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Experiential STEM Masterclasses & Pedagogical Certifications</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cohort Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Robotics & IoT">Robotics & IoT</option>
                    <option value="NEP Pedagogy">NEP Pedagogy</option>
                    <option value="AI in Classroom">AI in Classroom</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Hands-on Bootcamp">Hands-on Bootcamp</option>
                    <option value="Online Masterclass">Online Masterclass</option>
                    <option value="Hybrid Certification">Hybrid Certification</option>
                    <option value="ATL Lab Workshop">ATL Lab Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Foundational">Foundational</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Master Educator">Master Educator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hours</label>
                  <input type="number" value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seats</label>
                  <input type="number" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fee (₹)</label>
                  <input type="number" value={feeInr} onChange={(e) => setFeeInr(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lead Trainer Name</label>
                  <input type="text" value={leadTrainer} onChange={(e) => setLeadTrainer(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Certification Title</label>
                  <input type="text" value={certificationOffered} onChange={(e) => setCertificationOffered(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Curriculum Summary</label>
                <textarea rows={2} value={curriculumSummary} onChange={(e) => setCurriculumSummary(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md flex items-center gap-2">
                  <span>{isSubmitting ? 'Saving...' : editingProg ? 'Update Cohort' : 'Create Cohort'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
