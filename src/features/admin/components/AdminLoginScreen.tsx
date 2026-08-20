'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert, Lock, Mail, Key, Eye, EyeOff,
  ArrowRight, Download, FileSpreadsheet, Sparkles, Check,
  AlertCircle, ArrowLeft, Building2, Briefcase, GraduationCap,
  Beaker, Wrench, Package, Calendar, Globe
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ADMIN_ROLE_CONFIGS, INITIAL_ADMIN_USERS, downloadAdminCredentialsCSVFile } from '../data';
import { AdminRole } from '../types';

export const AdminLoginScreen: React.FC = () => {
  const { login, quickDemoLogin } = useAdminAuth();
  const [email, setEmail] = useState('superadmin@cseel.org');
  const [password, setPassword] = useState('SuperAdmin@2026#CSEEL');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  const handleSelectRolePill = (user: typeof INITIAL_ADMIN_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password || '');
    setErrorMessage('');
  };

  const handleDownloadCSV = () => {
    downloadAdminCredentialsCSVFile();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>

        {/* Download Credentials Excel Button */}
        <button
          type="button"
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-black border border-emerald-400/40 transition-all shadow-sm active:scale-95"
          title="Download Master Admin Passwords Spreadsheet (.CSV / Excel)"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Excel Downloaded!</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Download Credentials Sheet (Excel)</span>
            </>
          )}
        </button>
      </header>

      {/* ── MAIN LOGIN CONTAINER ── */}
      <main className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        
        {/* Left Side: Auth Box (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
              <Lock className="w-3 h-3" />
              <span>Enterprise RBAC Authentication</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              CSEEL Admin Portal Login
            </h1>
            <p className="text-xs text-slate-400">
              Sign in with your authorized departmental administrative credentials.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                Administrative Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cseel.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Security Password
                </label>
                <span className="text-[10px] text-purple-400 font-bold">Encrypted 256-bit</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono outline-none focus:border-purple-500 transition-colors"
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
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 mt-2 active:scale-98"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            <p>Protected by CSEEL Role-Based Access Control Architecture</p>
          </div>
        </div>

        {/* Right Side: Quick 1-Click Credentials Directory (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Department Staff Roster & Quick 1-Click Login</span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any staff member below to auto-fill their credentials or click <strong className="text-purple-300">"Direct Enter"</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get CSV File</span>
            </button>
          </div>

          {/* Quick Click Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {INITIAL_ADMIN_USERS.map((user) => {
              const cfg = ADMIN_ROLE_CONFIGS[user.role];
              const isSelected = email === user.email;

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectRolePill(user)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-purple-900/30 border-purple-500 shadow-md ring-1 ring-purple-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-black text-white truncate">{user.name}</p>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${cfg?.badgeBg || 'bg-slate-800 text-slate-300'}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-purple-300 truncate">{cfg?.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-mono text-slate-400 truncate bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      🔑 {user.password}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        quickDemoLogin(user.role);
                      }}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-lg transition-colors shrink-0 shadow-xs"
                    >
                      Direct Enter →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-2 text-[11px] text-slate-500">
        <p>CSEEL Subdomain-Ready Admin System • Credentials stored in <code className="text-purple-400">docs/admin_credentials.csv</code></p>
      </footer>
    </div>
  );
};

export default AdminLoginScreen;
