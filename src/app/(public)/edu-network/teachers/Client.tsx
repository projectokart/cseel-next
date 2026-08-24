'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap, MapPin, Search, Star, CheckCircle2, ShieldCheck,
  Filter, Sparkles, Phone, Mail, Award, Clock, ArrowRight, X, Check,
  Send, Users, BookOpen
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_TEACHERS, TeacherItem } from '@/lib/eduNetworkData';

export default function TeachersDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [minExp, setMinExp] = useState<number>(0);
  const [onlySeekingJob, setOnlySeekingJob] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'name'>('rating');

  // Direct Connect Modal
  const [selectedTeacherForConnect, setSelectedTeacherForConnect] = useState<TeacherItem | null>(null);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({ name: '', email: '', phone: '', orgName: '', message: '' });
  const [connectSuccess, setConnectSuccess] = useState(false);

  const filteredTeachers = useMemo(() => {
    return ALL_TEACHERS.filter((teacher) => {
      if (selectedSubject !== 'All' && teacher.subject !== selectedSubject) return false;
      if (selectedCity !== 'All' && !teacher.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      if (teacher.experienceYears < minExp) return false;
      if (onlySeekingJob && !teacher.isActivelySeekingJob) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          teacher.name.toLowerCase().includes(q) ||
          teacher.subject.toLowerCase().includes(q) ||
          teacher.city.toLowerCase().includes(q) ||
          teacher.qualification.toLowerCase().includes(q) ||
          teacher.currentInstitute.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
  }, [searchQuery, selectedSubject, selectedCity, minExp, onlySeekingJob, sortBy]);

  const handleOpenConnect = (teacher: TeacherItem) => {
    setSelectedTeacherForConnect(teacher);
    setIsConnectOpen(true);
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setIsConnectOpen(false);
      setConnectForm({ name: '', email: '', phone: '', orgName: '', message: '' });
    }, 1800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28">

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200/90 pt-8 pb-8 px-4">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>India's Verified STEM & Science Faculty Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Verified STEM Educators & NEP-2020 Faculty
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Search and connect with 50+ verified Physics, Chemistry, Biology, Mathematics, Robotics, and Computer Science educators. Filter by subject, experience, and hiring status.
            </p>
          </div>
        </div>

        {/* ── FILTER & CARDS GRID ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left Filter Sidebar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4 sticky top-20">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                <span>Filter Faculty</span>
              </h3>

              {/* Search */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Search Educator</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, school, qualification..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject Specialization</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="All">All Subjects</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Robotics & AI">Robotics & AI</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="All">All Cities</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Bhubaneswar">Bhubaneswar</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Min Experience Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="font-bold text-slate-700">Min Experience</label>
                  <span className="font-black text-purple-700">{minExp}+ Years</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Checkboxes */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlySeekingJob}
                    onChange={(e) => setOnlySeekingJob(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Actively Seeking Jobs (72h Flash)</span>
                </label>
              </div>
            </div>

            {/* Right Cards List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <span className="text-slate-600 font-bold">
                  Showing <strong className="text-slate-900">{filteredTeachers.length}</strong> verified educators
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="experience">Most Experienced</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredTeachers.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-black text-slate-900">{t.name}</h2>
                          {t.verified && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>NEP-2020 Verified</span>
                            </span>
                          )}
                          {t.isActivelySeekingJob && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full animate-pulse">
                              🔥 Actively Available
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-purple-700 font-bold">{t.qualification} • {t.subject}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.city}, {t.state}</span>
                          <span>•</span>
                          <span>{t.experienceYears} Years Exp</span>
                          <span>•</span>
                          <span className="text-slate-700 font-semibold">{t.currentInstitute}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                      <button
                        onClick={() => handleOpenConnect(t)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Direct Connect / Hire</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Connect Modal */}
        {isConnectOpen && selectedTeacherForConnect && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-auto">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Direct Faculty Connect</span>
                  <h3 className="font-black text-base text-slate-900">{selectedTeacherForConnect.name}</h3>
                </div>
                <button onClick={() => setIsConnectOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {connectSuccess ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-base text-slate-900">Message Sent!</h4>
                  <p className="text-xs text-slate-500">{selectedTeacherForConnect.name} will receive your message with verified credentials.</p>
                </div>
              ) : (
                <form onSubmit={handleConnectSubmit} className="p-6 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Name / Recruiter Name *</label>
                    <input
                      type="text"
                      required
                      value={connectForm.name}
                      onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })}
                      placeholder="e.g. Principal / HR Head"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">School / Organization Name *</label>
                    <input
                      type="text"
                      required
                      value={connectForm.orgName}
                      onChange={(e) => setConnectForm({ ...connectForm, orgName: e.target.value })}
                      placeholder="e.g. Delhi Public School"
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={connectForm.phone}
                        onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                      <input
                        type="email"
                        value={connectForm.email}
                        onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })}
                        placeholder="hr@dps.edu"
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message / Job Opportunity Details</label>
                    <textarea
                      rows={3}
                      value={connectForm.message}
                      onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                      placeholder="We have an opening for Senior Physics Faculty..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all mt-4"
                  >
                    Send Direct Invitation
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
