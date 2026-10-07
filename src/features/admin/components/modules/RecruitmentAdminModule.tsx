'use client';

import React, { useState } from 'react';
import { GraduationCap, Briefcase, Zap, ShieldCheck, Search, CheckCircle2, Clock, MapPin, DollarSign, Award, Star } from 'lucide-react';
import { ALL_TEACHERS, ALL_JOBS, TeacherItem, EduJobItem } from '@/lib/eduNetworkData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const RecruitmentAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [teachers, setTeachers] = useState<TeacherItem[]>(ALL_TEACHERS.slice(0, 15));
  const [jobs, setJobs] = useState<EduJobItem[]>(ALL_JOBS.slice(0, 10));
  const [activeTab, setActiveTab] = useState<'teachers' | 'jobs'>('teachers');
  const [searchQuery, setSearchQuery] = useState('');

  const toggle72hFlash = (id: string) => {
    setTeachers(teachers.map(t => {
      if (t.id === id) {
        const nextState = !t.isActivelySeekingJob;
        addAuditLog('TOGGLED_72H_FLASH', 'teaching_recruitment', `Toggled 72h Flash Seeking to ${nextState} for ${t.name}`);
        return {
          ...t,
          isActivelySeekingJob: nextState,
          jobSeekingExpiresInHours: nextState ? 72 : 0,
        };
      }
      return t;
    }));
  };

  const filteredTeachers = teachers.filter((t) =>
    !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-black text-purple-700">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>EXTERNAL FACULTY RECRUITMENT & 72H FLASH DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Teaching Jobs Board & Verified Faculty Registry
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Control the 50+ Verified Faculty profiles and 40+ School Teaching Job Vacancies on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/edu-network/teachers</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/edu-network/jobs</code>. Manage 72h flash immediate joiner activations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'teachers' ? 'bg-purple-700 text-white shadow-md' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}
          >
            Verified Faculty ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'jobs' ? 'bg-purple-700 text-white shadow-md' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}
          >
            School Teaching Jobs ({jobs.length})
          </button>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search educator name, teaching subject (e.g. Physics, Robotics), or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none text-gray-800"
          />
        </div>
      </div>

      {/* ── TEACHER PROFILES TABLE ── */}
      {activeTab === 'teachers' ? (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-gray-700 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Educator Name</th>
                  <th className="px-4 py-3">Subject & Degree</th>
                  <th className="px-4 py-3">Location & Institute</th>
                  <th className="px-4 py-3">Exp. Salary</th>
                  <th className="px-4 py-3">⚡ 72h Flash Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover border border-purple-200 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 truncate">{t.name}</p>
                          <p className="text-[10px] text-gray-500">{t.experienceYears} Yrs Exp • ★ {t.rating}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-purple-700">{t.subject} Faculty</p>
                      <p className="text-[10px] text-gray-500">{t.qualification}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold">{t.currentInstitute}</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{t.city}, {t.state}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {t.expectedSalary}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggle72hFlash(t.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                          t.isActivelySeekingJob
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs animate-pulse'
                            : 'bg-slate-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>{t.isActivelySeekingJob ? `Active (${t.jobSeekingExpiresInHours || 48}h left)` : 'Inactive (Off)'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/edu-network/teachers/${t.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg transition-colors inline-block"
                      >
                        View Profile
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── JOBS BOARD LIST ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {j.subject}
                </span>
                <span className="text-xs font-black text-gray-800">{j.salary}</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900">{j.title}</h4>
                <p className="text-xs text-gray-500">{j.orgName} • {j.city}, {j.state}</p>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Posted {j.postedDate}</span>
                <a href={`/edu-network/jobs/${j.id}`} target="_blank" className="text-xs font-bold text-emerald-700 hover:underline">View Live Job Posting →</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruitmentAdminModule;
