'use client';

import React, { useState } from 'react';
import {
  Briefcase, Plus, Users, CheckCircle2, Clock, MapPin,
  DollarSign, Download, Eye, X, Filter, Tag, Calendar,
  Building2, Sparkles, Check
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { UniversalEditor } from '@/components/editor';
import { UniversalEditorValue } from '@/components/editor/types';

interface InternalJobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote' | 'Internship';
  experience: string;
  salary: string;
  skills?: string[];
  deadline?: string;
  descriptionHtml?: string;
  applicantsCount: number;
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
}

const INITIAL_INTERNAL_JOBS: InternalJobItem[] = [
  {
    id: 'hr-1',
    title: 'Senior STEM Curriculum Architect (Physics)',
    department: 'Academic Science',
    location: 'New Delhi / Hybrid',
    type: 'Full-Time',
    experience: '5+ Years',
    salary: '₹12,00,000 - ₹18,00,000 /yr',
    skills: ['Physics Curriculum', 'NEP 2020', 'Virtual Labs', 'Teacher Training'],
    deadline: '2026-09-30',
    applicantsCount: 24,
    status: 'active',
    postedDate: '3 days ago',
  },
  {
    id: 'hr-2',
    title: 'ATL & Robotics Hardware Engineer',
    department: 'Projectokart R&D',
    location: 'Bengaluru',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '₹9,00,000 - ₹14,00,000 /yr',
    skills: ['Arduino', 'PCB Design', 'Robotics Kits', 'Embedded C'],
    deadline: '2026-10-15',
    applicantsCount: 42,
    status: 'active',
    postedDate: '1 week ago',
  },
  {
    id: 'hr-3',
    title: 'Virtual Simulation Full-Stack Engineer',
    department: 'EdTech Platform',
    location: 'Remote (India)',
    type: 'Full-Time',
    experience: '4+ Years',
    salary: '₹14,00,000 - ₹22,00,000 /yr',
    skills: ['Next.js', 'WebGL', 'Three.js', 'TypeScript', 'Tailwind CSS'],
    deadline: '2026-09-15',
    applicantsCount: 68,
    status: 'active',
    postedDate: '2 weeks ago',
  },
  {
    id: 'hr-4',
    title: 'Institutional School Relations Lead',
    department: 'EduNetwork Outreach',
    location: 'Mumbai / Pune',
    type: 'Full-Time',
    experience: '4+ Years',
    salary: '₹10,00,000 - ₹15,00,000 /yr',
    skills: ['School Onboarding', 'STEM Lab Sales', 'Institutional Partnerships'],
    deadline: '2026-10-01',
    applicantsCount: 19,
    status: 'active',
    postedDate: '4 days ago',
  },
];

const DEPARTMENT_SUGGESTIONS = [
  'Academic Science',
  'Projectokart R&D',
  'EdTech Platform',
  'EduNetwork Outreach',
  'Robotics & AI Labs',
  'Faculty Operations',
  'Curriculum Design',
  'Executive Leadership',
];

const DEFAULT_JOB_DESCRIPTION = `
<h2>1. Role Overview</h2>
<p>We are looking for a dedicated <span style="color: #7c3aed; font-weight: bold;">Senior STEM Curriculum Architect</span> to lead high-impact experiential learning across India with <mark style="background-color: #fef08a;">NEP-2020 alignment</mark>.</p>

<h2>2. Key Responsibilities</h2>
<ol>
  <li>Lead experiential laboratory setup and practical curriculum alignment with NEP-2020 guidelines.</li>
  <li>Collaborate with cross-functional academic leads, hardware engineers, and school faculties.</li>
  <li>Evaluate student project submissions, ATL innovation challenges, and national exhibitions.</li>
</ol>

<h2>3. Required Technical Skills & Tools</h2>
<ul>
  <li>Strong command of <code>Python</code>, <code>Arduino C++</code>, and Virtual Simulation modeling.</li>
  <li>Demonstrated track record of technical rigor, clarity of thought, and proactive ownership.</li>
  <li>Exceptional verbal and written communication capabilities.</li>
</ul>

<h2>4. Evaluation Metrics & Milestone Table</h2>
<table class="editor-table">
  <thead>
    <tr>
      <th>Milestone Phase</th>
      <th>Deliverable Target</th>
      <th>Timeline</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Phase 1</td>
      <td>Virtual Lab Simulations Setup</td>
      <td>Month 1-2</td>
      <td><span style="color: #16a34a; font-weight: bold;">Active</span></td>
    </tr>
    <tr>
      <td>Phase 2</td>
      <td>National STEM Teachers Workshop</td>
      <td>Month 3-4</td>
      <td><span style="color: #2563eb; font-weight: bold;">Planned</span></td>
    </tr>
    <tr>
      <td>Phase 3</td>
      <td>School Hackathon & Exhibition</td>
      <td>Month 5-6</td>
      <td><span style="color: #d97706; font-weight: bold;">Upcoming</span></td>
    </tr>
  </tbody>
</table>

<p>For more details, visit our official portal at <a href="https://www.cseel.org" target="_blank" rel="noopener noreferrer">CSEEL STEM Platform</a>.</p>
`;

export const HrAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [jobs, setJobs] = useState<InternalJobItem[]>(INITIAL_INTERNAL_JOBS);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form State
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: 'New Delhi / Hybrid',
    type: 'Full-Time' as InternalJobItem['type'],
    experience: '3+ Years',
    salary: '₹10,00,000 - ₹16,00,000 /yr',
    skillsInput: 'STEM Pedagogy, Physics, ATL Labs, Teacher Mentorship',
    deadline: '2026-10-31',
    description: DEFAULT_JOB_DESCRIPTION,
  });

  const [editorValue, setEditorValue] = useState<UniversalEditorValue>({
    html: DEFAULT_JOB_DESCRIPTION,
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.department.trim()) return;

    const skillsArray = newJob.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created: InternalJobItem = {
      id: `hr-${Date.now()}`,
      title: newJob.title.trim(),
      department: newJob.department.trim(),
      location: newJob.location.trim(),
      type: newJob.type,
      experience: newJob.experience.trim(),
      salary: newJob.salary.trim(),
      skills: skillsArray,
      deadline: newJob.deadline,
      descriptionHtml: editorValue.html || newJob.description,
      applicantsCount: 0,
      status: 'active',
      postedDate: 'Just now',
    };

    setJobs([created, ...jobs]);
    setIsNewJobOpen(false);
    addAuditLog('CREATED_CAREER_OPENING', 'hr_careers', `Published internal vacancy: ${newJob.title} (${newJob.department})`);

    // Reset form
    setNewJob({
      title: '',
      department: '',
      location: 'New Delhi / Hybrid',
      type: 'Full-Time',
      experience: '3+ Years',
      salary: '₹10,00,000 - ₹16,00,000 /yr',
      skillsInput: 'STEM Pedagogy, Physics, ATL Labs',
      deadline: '2026-10-31',
      description: DEFAULT_JOB_DESCRIPTION,
    });
  };

  const toggleStatus = (id: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id === id) {
          const nextStatus = j.status === 'active' ? 'paused' : 'active';
          addAuditLog('CHANGED_CAREER_STATUS', 'hr_careers', `Toggled status of ${j.title} to ${nextStatus}`);
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-black text-rose-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CSEEL TALENT ACQUISITION & CAREERS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Company Job Postings & Applicant Pipelines
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Create, format, and publish internal hiring vacancies displayed publicly on{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/careers</code>. Equipped with full fields and the Universal Content Editor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsNewJobOpen(true);
            setActiveTab('edit');
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* ── ACTIVE JOB OPENINGS LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-2xs space-y-4 hover:border-rose-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 truncate">
                  {job.department}
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 ${
                    job.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-gray-900 leading-snug">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[11px]">
                    {job.type}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-gray-800">{job.salary}</span>
                </div>
              </div>

              {/* Skills Tags */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl">
                <Users className="w-3.5 h-3.5" />
                <span>{job.applicantsCount} Applicants</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(job.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  {job.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-xs transition-colors"
                >
                  View Pipeline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE JOB MODAL WITH FULL FIELDS & UNIVERSAL EDITOR ── */}
      {isNewJobOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white leading-tight">
                    Post Internal CSEEL Vacancy
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Full field vacancy creator powered by the Universal Content Editor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeTab === 'edit' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Edit Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-2xs' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewJobOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateJob} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {activeTab === 'edit' ? (
                <>
                  {/* Row 1: Job Title & Department (Text Based Typing) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Job Title / Role *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Roboticist & STEM Pedagogy Architect"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-xs sm:text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:bg-white transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Department (Text-based Typing) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Type any department (e.g. Physics & Simulation Labs)"
                        value={newJob.department}
                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl outline-none font-bold text-xs sm:text-sm text-gray-900 dark:text-white focus:border-rose-500 focus:bg-white transition-all shadow-2xs"
                      />

                      {/* Quick Department Suggestion Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[10px] font-bold text-gray-400">Suggestions:</span>
                        {DEPARTMENT_SUGGESTIONS.slice(0, 4).map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => setNewJob({ ...newJob, department: dept })}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-[10px] font-semibold text-slate-600 transition-colors"
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Location, Employment Type, Experience, Salary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="e.g. Bengaluru / Hybrid"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Employment Type
                      </label>
                      <select
                        value={newJob.type}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Experience Required
                      </label>
                      <input
                        type="text"
                        value={newJob.experience}
                        onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                        placeholder="e.g. 3-5 Years"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Salary Package
                      </label>
                      <input
                        type="text"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        placeholder="e.g. ₹12,00,000 - ₹18,00,000 /yr"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 3: Skills & Tags and Application Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Required Skills & Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={newJob.skillsInput}
                        onChange={(e) => setNewJob({ ...newJob, skillsInput: e.target.value })}
                        placeholder="e.g. STEM Pedagogy, Physics, Arduino, Robotics"
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={newJob.deadline}
                        onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 4: Universal Content Editor for Detailed Job Description */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Job Description, Responsibilities & Qualifications (Universal Editor)</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-bold">
                        Rich Text • Notion-style / commands • Bullet points
                      </span>
                    </div>

                    <UniversalEditor
                      contentType="job"
                      value={editorValue}
                      onChange={(val) => setEditorValue(val)}
                      minHeight="260px"
                      placeholder="Type job responsibilities, candidate profile, and hiring criteria..."
                    />
                  </div>
                </>
              ) : (
                /* Preview Tab */
                <div className="space-y-6 bg-slate-50/60 dark:bg-slate-950/40 p-6 rounded-3xl border border-gray-200/80">
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      {newJob.department || 'Department Name'}
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                      {newJob.title || 'Untitled Job Role'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500" />{newJob.location}</span>
                      <span>•</span>
                      <span className="font-bold">{newJob.type}</span>
                      <span>•</span>
                      <span>{newJob.experience}</span>
                      <span>•</span>
                      <span className="font-bold text-gray-900">{newJob.salary}</span>
                    </div>
                  </div>

                  {/* Rendered HTML preview */}
                  <div
                    className="prose prose-slate max-w-none text-xs sm:text-sm bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800"
                    dangerouslySetInnerHTML={{ __html: editorValue.html || '' }}
                  />
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewJobOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Vacancy to /careers</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrAdminModule;
