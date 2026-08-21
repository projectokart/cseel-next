'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, Lock, Mail, Key, Eye, EyeOff,
  ArrowRight, ShieldCheck, CheckCircle2,
  AlertCircle, ArrowLeft, Building2, Briefcase, GraduationCap,
  Beaker, Wrench, Package, Calendar, Globe, Server
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export const AdminLoginScreen: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your administrative credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── TOP NAV BAR ── */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portal</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Trust Enterprise Gateway</span>
        </div>
      </header>

      {/* ── MAIN LOGIN CONTAINER ── */}
      <main className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8">
        
        {/* Left Side: Auth Box (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
              <Lock className="w-3 h-3" />
              <span>Administrative Access Control</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              CSEEL Governance Center
            </h1>
            <p className="text-xs text-slate-400">
              Authorized personnel only. Enter your administrative credentials to access your departmental workspace.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block">
                Administrative Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.name@cseel.org"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-medium outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Security Password
                </label>
                <span className="text-[10px] text-purple-400 font-bold">256-bit Encrypted</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 mt-3 active:scale-98"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-center gap-2">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span>Audit logs recorded automatically with IP address</span>
          </div>
        </div>

        {/* Right Side: Security & Departmental Overview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <span>National STEM Academic Governance Framework</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The CSEEL Central Administrative Console coordinates curriculum compliance, institution verifications, lab hardware supply chains, and faculty onboarding across India.
            </p>
          </div>

          {/* Department Coverage Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>100+ Verified Schools</span>
              </div>
              <p className="text-[11px] text-slate-400">CBSE, ICSE, and Atal Tinkering Lab institution accreditations.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Faculty Recruitment</span>
              </div>
              <p className="text-[11px] text-slate-400">Verified PGT/TGT subject matter experts and lab instructors.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Beaker className="w-4 h-4 text-emerald-400" />
                <span>Curriculum Labs (NEP 2020)</span>
              </div>
              <p className="text-[11px] text-slate-400">Class 6–12 experiential science experiments and simulations.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Projectokart Hardware Kits</span>
              </div>
              <p className="text-[11px] text-slate-400">STEM robotics, IoT microcontrollers, and sensor logistics.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Enterprise Security Policy Active</p>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                All administrative operations are encrypted and audited under PostgreSQL RLS security policies.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-slate-500">
        <p>© 2026 CSEEL — Center for Scientific Exploration & Experimental Learning. All rights reserved.</p>
      </footer>
    </div>
  );
};
