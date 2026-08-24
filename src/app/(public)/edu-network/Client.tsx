'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, GraduationCap, Briefcase, Sparkles, Search,
  MapPin, ArrowRight, CheckCircle2, ShieldCheck, Star,
  Award, Users, BookOpen, ChevronRight, Globe
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

const TOP_CITIES = [
  { name: 'All India', slug: 'top-schools-in-india', count: '104+ Schools' },
  { name: 'Delhi NCR', slug: 'schools-in-delhi', count: '20+ Schools' },
  { name: 'Mumbai', slug: 'schools-in-mumbai', count: '15+ Schools' },
  { name: 'Bengaluru', slug: 'schools-in-bengaluru', count: '18+ Schools' },
  { name: 'Pune', slug: 'schools-in-pune', count: '12+ Schools' },
  { name: 'Bhubaneswar', slug: 'schools-in-bhubaneswar', count: '14+ Schools' },
  { name: 'Lucknow', slug: 'schools-in-lucknow', count: '10+ Schools' },
  { name: 'Jaipur', slug: 'schools-in-jaipur', count: '10+ Schools' },
  { name: 'Hyderabad', slug: 'schools-in-hyderabad', count: '12+ Schools' },
  { name: 'Chennai', slug: 'schools-in-chennai', count: '10+ Schools' },
  { name: 'Kolkata', slug: 'schools-in-kolkata', count: '10+ Schools' },
  { name: 'Ahmedabad', slug: 'schools-in-ahmedabad', count: '10+ Schools' },
];

export default function EduNetworkHubClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && selectedCity !== 'All') {
      const citySlug = `schools-in-${selectedCity.toLowerCase().replace(/\s+/g, '-')}`;
      router.push(`/edu-network/organisation/school/${citySlug}`);
    } else {
      router.push('/edu-network/organisation/school');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28">

        {/* ── HERO BANNER SECTION ────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-b from-[#002b4e] via-[#001d36] to-slate-950 text-white pt-14 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India's National Verified STEM EduNetwork Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              Connecting Top Schools, Educators, Jobs & Student Innovators
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Explore verified school directories with live STEM laboratory infrastructure, discover teaching faculty jobs, and connect with NEP-2020 science educators.
            </p>

            {/* Quick Search Redirect Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto pt-4">
              <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent font-bold outline-none cursor-pointer pr-1 text-slate-900"
                  >
                    <option value="All">All Major Cities</option>
                    <option value="delhi">Delhi NCR</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="pune">Pune</option>
                    <option value="bhubaneswar">Bhubaneswar</option>
                    <option value="lucknow">Lucknow</option>
                    <option value="jaipur">Jaipur</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="dehradun">Dehradun</option>
                    <option value="patna">Patna</option>
                    <option value="bhopal">Bhopal</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schools by name or city (e.g. DPS, Apeejay, Bangalore)..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 bg-transparent outline-none font-medium placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-black rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Explore Schools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── 4 MAIN GATEWAY CARDS (ORGANISATION/SCHOOL, JOBS, TEACHERS, STUDENTS) ── */}
        <section className="max-w-7xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Schools & Institutions */}
            <Link
              href="/edu-network/organisation/school"
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">UniApply Verified Directory</span>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Schools & Institutions
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Explore 100+ schools across India with verified fee structures, CBSE/ICSE/IB boards, and live STEM laboratories.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-600">
                <span>View School Directory</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Teaching & Lab Jobs */}
            <Link
              href="/edu-network/jobs"
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Indeed Career Hub</span>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Teaching & Lab Jobs
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    40+ active STEM faculty, physics, chemistry, biology educator vacancies, and live laboratory coordinator positions.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-600">
                <span>Browse Active Jobs</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Verified Faculty */}
            <Link
              href="/edu-network/teachers"
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">NEP-2020 Educators</span>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                    Verified Faculty
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Connect with 50+ certified science educators, curriculum specialists, and experimental learning mentors across India.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-600">
                <span>Explore Educators</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Student Innovators */}
            <Link
              href="/edu-network/students"
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">ATL & Science Fairs</span>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    Student Innovators
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Showcasing 50+ award-winning STEM hardware prototypes, robotics projects, and verified research portfolios.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-600">
                <span>View Innovator Vault</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </section>

        {/* ── CITY-WISE QUICK NAVIGATION SECTION (UNIAPPLY PATTERN) ─────────── */}
        <section className="max-w-7xl mx-auto px-4 mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900">Explore Top Schools by City</h2>
              <p className="text-xs text-slate-500">Select your city to view fees, CBSE/ICSE/IB boards, and laboratory facilities.</p>
            </div>
            <Link
              href="/edu-network/organisation/school"
              className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All 100+ Schools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TOP_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/edu-network/organisation/school/${city.slug}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">{city.name}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{city.count}</p>
                <div className="mt-2 flex items-center text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
