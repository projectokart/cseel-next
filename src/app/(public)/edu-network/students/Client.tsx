'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, Award, Star, ExternalLink, MapPin, Search,
  Filter, CheckCircle2, ChevronRight, ArrowRight, Eye, BookOpen
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_STUDENTS, StudentItem } from '@/lib/eduNetworkData';

export default function StudentsDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const filteredStudents = useMemo(() => {
    return ALL_STUDENTS.filter((student) => {
      if (selectedGrade !== 'All' && !student.classGrade.includes(selectedGrade)) return false;
      if (selectedCity !== 'All' && !student.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          student.name.toLowerCase().includes(q) ||
          student.schoolCollege.toLowerCase().includes(q) ||
          student.city.toLowerCase().includes(q) ||
          student.interests.some((i) => i.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, selectedGrade, selectedCity]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200/90 pt-8 pb-8 px-4">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>National Student Innovator Showcase & ATL Talents</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Student Innovators & Science Fair Prototypes
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Explore 50+ outstanding school science fair prototypes, hardware schematics, robotics projects, and verified research portfolios from young innovators across India.
            </p>
          </div>
        </div>

        {/* ── MAIN GRID ──────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Filter Sidebar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 sticky top-20">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-600" />
                <span>Filter Innovators</span>
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Search Innovator</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, school, project..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Class / Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="All">All Grades (6th - 12th)</option>
                  <option value="Class 8">Class 8th</option>
                  <option value="Class 9">Class 9th</option>
                  <option value="Class 10">Class 10th</option>
                  <option value="Class 11">Class 11th</option>
                  <option value="Class 12">Class 12th</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="All">All Cities</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bhubaneswar">Bhubaneswar</option>
                </select>
              </div>
            </div>

            {/* Student Cards Grid */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <span className="text-slate-600 font-bold">
                  Showing <strong className="text-slate-900">{filteredStudents.length}</strong> verified innovators
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <h2 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                            {s.name}
                          </h2>
                          <p className="text-xs font-bold text-amber-800">{s.classGrade}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{s.schoolCollege}, {s.city}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {s.bio}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {s.interests.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-md text-[10px] font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">
                        {s.projectsCount} Verified Projects
                      </span>
                      <Link
                        href={`/edu-network/students/${s.id}`}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span>View Portfolio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </PageTransition>
  );
}
