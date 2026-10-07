'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  History, Calendar, Filter, Download, FileText,
  Search, RefreshCw, CheckCircle2, AlertTriangle, Trash2,
  Edit2, Plus, ArrowRight, User, Shield, Clock, Building2,
  FileSpreadsheet, Sparkles, Layers, Check, Copy, ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole, AdminModuleId } from '../../types';

interface DailyLogItem {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRole;
  department: string;
  action: string;
  actionCategory: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'AUTH' | 'SETTINGS';
  targetEntity?: string;
  details: string;
  ipAddress?: string;
}

const CATEGORY_COLORS: Record<string, { badge: string; icon: any }> = {
  CREATE: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800', icon: Plus },
  UPDATE: { badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800', icon: Edit2 },
  DELETE: { badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800', icon: Trash2 },
  EXPORT: { badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800', icon: Download },
  AUTH: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800', icon: Shield },
  SETTINGS: { badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', icon: Sparkles },
};

export const DailyWorkHistoryModule: React.FC = () => {
  const { currentRole, currentAdmin, auditLogs } = useAdminAuth();
  
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [logs, setLogs] = useState<DailyLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch logs from API
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/admin/audit-logs', window.location.origin);
      if (selectedDate !== 'all') url.searchParams.set('date', selectedDate);
      if (selectedDepartment !== 'all') url.searchParams.set('department', selectedDepartment);
      if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, selectedDepartment, selectedCategory]);

  // Filter by search query in memory
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.adminName.toLowerCase().includes(q) ||
        item.adminEmail.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        (item.targetEntity && item.targetEntity.toLowerCase().includes(q)) ||
        item.details.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery]);

  // Metrics
  const totalActionsToday = filteredLogs.length;
  const createsCount = filteredLogs.filter((l) => l.actionCategory === 'CREATE').length;
  const updatesCount = filteredLogs.filter((l) => l.actionCategory === 'UPDATE').length;
  const deletesCount = filteredLogs.filter((l) => l.actionCategory === 'DELETE').length;

  const handleDownloadTextFile = () => {
    const url = `/api/admin/audit-logs?date=${selectedDate}&format=text`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `CSEEL_Daily_Work_History_${selectedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLogsText = () => {
    const textOutput = filteredLogs.map((l, i) => 
      `[${i + 1}] [${l.date} ${l.time}] [${l.adminRole.toUpperCase()}] [${l.actionCategory}]\n` +
      `Admin: ${l.adminName} (${l.adminEmail})\n` +
      `Department: ${l.department}\n` +
      `Action: ${l.action}\n` +
      `Target: ${l.targetEntity || 'N/A'}\n` +
      `Details: ${l.details}\n`
    ).join('\n---\n\n');

    navigator.clipboard.writeText(textOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* ── HEADER BANNER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-black text-purple-700 dark:text-purple-300">
            <History className="w-3.5 h-3.5" />
            <span>EXECUTIVE AUDIT TRAIL & WORK LEDGER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Daily Work History & Operational Log
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Date-wise, department-wise historical log of every item created, modified, deleted, exported, and authenticated across CSEEL portals. Stored persistently in database and downloadable as structured text files.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
          <button
            type="button"
            onClick={handleCopyLogsText}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Copy formatted text log to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Copy Text Log</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadTextFile}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
            title="Download full daily work history as text file (.txt)"
          >
            <Download className="w-4 h-4" />
            <span>Download .TXT Log</span>
          </button>
        </div>
      </div>

      {/* ── KPI STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Total Work Actions</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalActionsToday}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Items / Records Created</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{createsCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Plus className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Modifications & Edits</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">{updatesCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <Edit2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Deletions & Archivals</p>
            <p className="text-xl font-black text-rose-600 mt-0.5">{deletesCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── FILTER & DATE CONTROLS BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Quick Date Range Buttons + Date Picker */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Date:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedDate === todayStr ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                setSelectedDate(y.toISOString().split('T')[0]);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedDate !== todayStr && selectedDate !== 'all' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              Yesterday
            </button>

            <button
              type="button"
              onClick={() => setSelectedDate('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedDate === 'all' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Dates
            </button>

            {/* Custom Date Input */}
            <input
              type="date"
              value={selectedDate === 'all' ? '' : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || 'all')}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Department, Category & Search Filters */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap">
            
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">🏢 All Departments</option>
              <option value="Materials">📦 Materials & Store</option>
              <option value="Careers">💼 HR & Careers</option>
              <option value="Institutional">🏫 School Network</option>
              <option value="Training">🎓 Teacher Training</option>
              <option value="Events">🎪 Seminars & Events</option>
              <option value="Support">🛠️ Technical Support</option>
              <option value="Executive">👑 Central Super Admin</option>
            </select>

            {/* Action Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">⚡ All Action Types</option>
              <option value="CREATE">➕ Create / New Record</option>
              <option value="UPDATE">✏️ Update / Edit</option>
              <option value="DELETE">🗑️ Delete / Archive</option>
              <option value="EXPORT">📥 Export & CSV Sync</option>
              <option value="AUTH">🔒 Login & Security</option>
            </select>

            <button
              type="button"
              onClick={fetchLogs}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Refresh log feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>

        </div>

        {/* Search Query Input */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search work history by admin name, item SKU, department, or action details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* ── WORK HISTORY TIMELINE FEED ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 space-y-2 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-black text-slate-800 dark:text-slate-200 text-base">No Work Activity Recorded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No administrative operations match the selected date ({selectedDate}) and filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log, idx) => {
            const cat = CATEGORY_COLORS[log.actionCategory] || CATEGORY_COLORS.UPDATE;
            const CatIcon = cat.icon;

            return (
              <div
                key={log.id || idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:border-purple-300 transition-all space-y-3"
              >
                {/* Top Row: Timestamp, Category Badge, Department */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${cat.badge}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{log.actionCategory}</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      📅 {log.date} at {log.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {log.department}
                    </span>
                    {log.ipAddress && (
                      <span className="text-[10px] font-mono text-slate-400">
                        IP: {log.ipAddress}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Admin Actor & Target Entity */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-[10px]">
                        {log.adminName.charAt(0)}
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.adminName}
                      </span>
                      <span className="text-[10px] text-slate-400">({log.adminEmail})</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded-md font-bold">
                        {log.adminRole}
                      </span>
                    </div>

                    {log.targetEntity && (
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-400 pl-8">
                        Target: {log.targetEntity}
                      </p>
                    )}

                    {/* Detailed Diff / Action Summary */}
                    <div className="pl-8 pt-1">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {log.details}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default DailyWorkHistoryModule;
