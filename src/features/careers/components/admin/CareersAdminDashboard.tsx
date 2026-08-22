'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { JobOpening, JobEmploymentType, JobFilterState } from '../../types';
import { careersApi } from '../../api/careersApiClient';
import { UniversalEditor, UniversalEditorValue } from '@/components/editor';
import {
  Briefcase, Plus, Search, Filter, Download, Upload,
  MapPin, Clock, DollarSign, Users, CheckCircle2,
  Calendar, Trash2, Edit2, Copy, X, SlidersHorizontal,
  ChevronRight, ExternalLink, RefreshCw, AlertTriangle,
  Grid2X2, List, Table as TableIcon
} from 'lucide-react';

interface CareersAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

const DEFAULT_VACANCY_CONTENT = `
<h2>1. Role Overview</h2>
<p>Lead the architectural design of experiential laboratory curricula across Indian partner schools with <mark style="background-color: #fef08a;">NEP-2020 alignment</mark>.</p>

<h2>2. Key Responsibilities</h2>
<ol>
  <li>Design hands-on experimental guides for Physics, Chemistry, and Robotics.</li>
  <li>Conduct high-impact teacher training masterclasses for school faculties.</li>
  <li>Evaluate student project submissions, ATL innovation challenges, and national exhibitions.</li>
</ol>

<h2>3. Required Technical Skills & Tools</h2>
<ul>
  <li>Strong command of <code>Python</code>, <code>Arduino C++</code>, and Virtual Simulation modeling.</li>
  <li>Demonstrated track record of technical rigor, clarity of thought, and proactive ownership.</li>
</ul>
`;

export default function CareersAdminDashboard({ onAuditLog }: CareersAdminDashboardProps) {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<JobEmploymentType[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'applicants' | 'deadline' | 'title'>('newest');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('New Delhi / Hybrid');
  const [jobType, setJobType] = useState<JobEmploymentType>('Full-Time');
  const [experience, setExperience] = useState('3+ Years');
  const [salary, setSalary] = useState('₹10,00,000 - ₹16,00,000 /yr');
  const [skillsInput, setSkillsInput] = useState('STEM Pedagogy, Physics, ATL Labs');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [editorVal, setEditorVal] = useState<UniversalEditorValue>({ html: DEFAULT_VACANCY_CONTENT });

  // Load Data
  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await careersApi.fetchJobs({
        searchQuery,
        selectedDepartments,
        selectedTypes,
        status: statusFilter,
        sortBy,
      });
      setJobs(res.items);
      setTotalCount(res.total);
      setDepartments(res.departments);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedDepartments, selectedTypes, statusFilter, sortBy]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const openCreateModal = () => {
    setEditingJob(null);
    setTitle('');
    setDepartment('');
    setLocation('New Delhi / Hybrid');
    setJobType('Full-Time');
    setExperience('3+ Years');
    setSalary('₹10,00,000 - ₹16,00,000 /yr');
    setSkillsInput('STEM Pedagogy, Physics, ATL Labs');
    setDeadline('2026-10-31');
    setEditorVal({ html: DEFAULT_VACANCY_CONTENT });
    setFormOpen(true);
  };

  const openEditModal = (job: JobOpening) => {
    setEditingJob(job);
    setTitle(job.title);
    setDepartment(job.department);
    setLocation(job.location);
    setJobType(job.type);
    setExperience(job.experience);
    setSalary(job.salary);
    setSkillsInput(job.skills.join(', '));
    setDeadline(job.deadline);
    setEditorVal({ html: job.descriptionHtml });
    setFormOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !department.trim()) return;

    setIsSubmitting(true);
    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        department: department.trim(),
        location: location.trim(),
        type: jobType,
        experience: experience.trim(),
        salary: salary.trim(),
        skills,
        descriptionHtml: editorVal.html || '<p>Description</p>',
        deadline,
        status: 'active' as const,
      };

      if (editingJob) {
        await careersApi.updateJob(editingJob.id, payload);
        onAuditLog?.('UPDATED_JOB', 'hr_careers', `Updated job: ${title}`);
      } else {
        await careersApi.createJob(payload);
        onAuditLog?.('CREATED_JOB', 'hr_careers', `Created job: ${title}`);
      }

      setFormOpen(false);
      loadJobs();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    try {
      await careersApi.deleteJob(id);
      onAuditLog?.('DELETED_JOB', 'hr_careers', `Deleted job: ${jobTitle}`);
      loadJobs();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full text-xs font-black text-rose-700 dark:text-rose-300">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CAREERS & TALENT ACQUISITION SERVICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Institutional Career Openings & Faculty Hiring
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Create and govern internal vacancies with Universal Content Editor, candidate pipelines, and spreadsheet synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={careersApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* ── WORKSPACE: Left Sidebar + Right Job Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                <span>Filters</span>
              </span>
              {(selectedDepartments.length > 0 || selectedTypes.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDepartments([]);
                    setSelectedTypes([]);
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400">Department</p>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {departments.map((dept) => {
                  const isChecked = selectedDepartments.includes(dept);
                  return (
                    <label
                      key={dept}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer ${
                        isChecked ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedDepartments((prev) =>
                              prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
                            )
                          }
                          className="w-3.5 h-3.5 accent-rose-600 rounded"
                        />
                        <span className="truncate">{dept}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Employment Type</p>
              <div className="space-y-1">
                {(['Full-Time', 'Part-Time', 'Contract', 'Remote / Hybrid', 'Fellowship'] as JobEmploymentType[]).map((t) => {
                  const isChecked = selectedTypes.includes(t);
                  return (
                    <label
                      key={t}
                      className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                        isChecked ? 'text-rose-700 font-bold' : 'text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedTypes((prev) =>
                            prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
                          )
                        }
                        className="w-3.5 h-3.5 accent-rose-600 rounded"
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Search & Sort */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vacancies by title, department, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Grid View"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Detailed List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
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
                <option value="applicants">Most Applicants</option>
                <option value="deadline">Application Deadline</option>
                <option value="title">Alphabetical</option>
              </select>
              <button onClick={loadJobs} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Cards Grid / List / Table */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-10 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold">No active job openings match your criteria.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black uppercase text-slate-500 border-b">
                    <tr>
                      <th className="p-3">Job Role & Location</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Salary & Type</th>
                      <th className="p-3">Applicants</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{j.title}</p>
                          <p className="text-[10px] text-slate-400">{j.location}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md text-[10px] font-bold">
                            {j.department}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-emerald-700">{j.salary}</p>
                          <p className="text-[10px] text-slate-400">{j.type}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-bold text-[10px]">
                            {j.applicantsCount} Applicants
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{j.deadline}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(j)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(j.id, j.title)}
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
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:border-rose-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black uppercase">
                        {job.department}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {job.salary}
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate max-w-lg">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                      <span>📍 {job.location}</span>
                      <span>⏱️ {job.type}</span>
                      <span>👥 {job.applicantsCount} Applicants</span>
                      <span className="font-mono text-[10px]">Deadline: {job.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job.id, job.title)}
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
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase border border-rose-200">
                        {job.department}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {job.salary}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.type}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-600" /> {job.applicantsCount} Applicants</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">Deadline: {job.deadline}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(job)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id, job.title)}
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

      {/* ── MODAL: Post / Edit Vacancy with Universal Content Editor ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-rose-100 text-rose-700">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    {editingJob ? 'Edit Career Opening' : 'Post Internal CSEEL Vacancy'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Universal Content Editor with lists, colors & table support</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Roboticist & STEM Pedagogy Architect"
                    className="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department (Text Typing) *</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Academic Innovations & ATL Labs"
                    className="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employment Type</label>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote / Hybrid">Remote / Hybrid</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience</label>
                  <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salary Package</label>
                  <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Required Skills (Comma Separated)</label>
                  <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono" />
                </div>
              </div>

              {/* Universal Editor for Job Description */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 block">Job Description & Responsibilities (Universal Editor)</label>
                <UniversalEditor
                  contentType="job"
                  value={editorVal}
                  onChange={(val) => setEditorVal(val)}
                  minHeight="240px"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-md flex items-center gap-2">
                  <span>{isSubmitting ? 'Publishing...' : editingJob ? 'Update Vacancy' : 'Publish Vacancy'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
