'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, Users, CheckCircle2, Clock, MapPin, DollarSign, Download, Eye, X, Filter } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface InternalJobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  experience: string;
  salary: string;
  applicantsCount: number;
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
}

const INITIAL_INTERNAL_JOBS: InternalJobItem[] = [
  { id: 'hr-1', title: 'Senior STEM Curriculum Architect (Physics)', department: 'Academic Science', location: 'New Delhi / Hybrid', type: 'Full-Time', experience: '5+ Years', salary: '₹12,00,000 - ₹18,00,000 /yr', applicantsCount: 24, status: 'active', postedDate: '3 days ago' },
  { id: 'hr-2', title: 'ATL & Robotics Hardware Engineer', department: 'Projectokart R&D', location: 'Bengaluru', type: 'Full-Time', experience: '3+ Years', salary: '₹9,00,000 - ₹14,00,000 /yr', applicantsCount: 42, status: 'active', postedDate: '1 week ago' },
  { id: 'hr-3', title: 'Virtual Simulation Full-Stack Engineer', department: 'EdTech Platform', location: 'Remote (India)', type: 'Full-Time', experience: '4+ Years', salary: '₹14,00,000 - ₹22,00,000 /yr', applicantsCount: 68, status: 'active', postedDate: '2 weeks ago' },
  { id: 'hr-4', title: 'Institutional School Relations Lead', department: 'EduNetwork Outreach', location: 'Mumbai / Pune', type: 'Full-Time', experience: '4+ Years', salary: '₹10,00,000 - ₹15,00,000 /yr', applicantsCount: 19, status: 'active', postedDate: '4 days ago' },
];

export const HrAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [jobs, setJobs] = useState<InternalJobItem[]>(INITIAL_INTERNAL_JOBS);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', department: 'Academic Science', location: 'New Delhi', type: 'Full-Time', experience: '3+ Years', salary: '₹8,00,000 - ₹12,00,000 /yr' });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title) return;
    const created: InternalJobItem = {
      id: `hr-${Date.now()}`,
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type as any,
      experience: newJob.experience,
      salary: newJob.salary,
      applicantsCount: 0,
      status: 'active',
      postedDate: 'Just now',
    };
    setJobs([created, ...jobs]);
    setIsNewJobOpen(false);
    addAuditLog('CREATED_CAREER_OPENING', 'hr_careers', `Published internal vacancy: ${newJob.title}`);
  };

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(j => {
      if (j.id === id) {
        const nextStatus = j.status === 'active' ? 'paused' : 'active';
        addAuditLog('CHANGED_CAREER_STATUS', 'hr_careers', `Toggled status of ${j.title} to ${nextStatus}`);
        return { ...j, status: nextStatus };
      }
      return j;
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-black text-rose-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>CSEEL TALENT ACQUISITION & INTERNAL CAREERS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Company Job Postings & Applicant Pipelines
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Manage all internal hiring vacancies displayed publicly on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/careers</code>. Review resumes, schedule candidate interviews, and publish new job roles.
          </p>
        </div>

        <button
          onClick={() => setIsNewJobOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Internal Opening</span>
        </button>
      </div>

      {/* ── ACTIVE JOB OPENINGS LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs space-y-4 hover:border-rose-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {job.department}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${job.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {job.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-gray-900">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500" />{job.location}</span>
                  <span>•</span>
                  <span>{job.experience}</span>
                  <span>•</span>
                  <span className="font-bold text-gray-800">{job.salary}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl">
                <Users className="w-3.5 h-3.5" />
                <span>{job.applicantsCount} Applicants</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(job.id)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  {job.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-xs transition-colors">
                  View Pipeline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE JOB MODAL ── */}
      {isNewJobOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsNewJobOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-base">Post Internal CSEEL Vacancy</h3>
              <button onClick={() => setIsNewJobOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Simulation Physicist"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Department</label>
                  <select
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                  >
                    {['Academic Science', 'Projectokart R&D', 'EdTech Platform', 'EduNetwork Outreach', 'Operations'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Experience</label>
                  <input
                    type="text"
                    value={newJob.experience}
                    onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Salary Package</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs rounded-xl shadow-md hover:opacity-95 transition-all mt-2"
              >
                Publish on /careers Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrAdminModule;
