'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Users, Video, MapPin, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { ALL_SEMINARS } from '@/lib/seminarsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const ProgramsAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [seminarList, setSeminarList] = useState(ALL_SEMINARS);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-black text-indigo-700">
            <Calendar className="w-3.5 h-3.5" />
            <span>NATIONAL CONCLAVES, SEMINARS & EVENTS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Flagship Conclaves, Live Webinars & Teacher Training
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Manage the 9+ Flagship Seminars and Live Events on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/seminars</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/events</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/workshops</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/teacher-training</code>.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('SCHEDULED_SEMINAR', 'programs_events', 'Created new national conclave event')}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Conclave / Webinar</span>
        </button>
      </div>

      {/* ── SEMINARS LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seminarList.map((sem) => (
          <div key={sem.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {sem.mode}
                </span>
                <span className="text-[10px] font-bold text-gray-500">{sem.date}</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">{sem.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{sem.summary}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                {sem.registeredAttendees}+ Registered
              </span>
              <a
                href={`/seminars/${sem.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl transition-colors"
              >
                View Conclave Page
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsAdminModule;
