'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SupportTicket, TicketStatus, TicketPriority, TicketCategory, SupportFilterState } from '../../types';
import { supportApi } from '../../api/supportApiClient';
import {
  HelpCircle, Plus, Search, Filter, Download,
  CheckCircle2, Clock, AlertTriangle, MessageSquare,
  Building, User, Trash2, Edit2, X, RefreshCw
} from 'lucide-react';

interface SupportAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function SupportAdminDashboard({ onAuditLog }: SupportAdminDashboardProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Form Fields
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Lab Equipment & Delivery');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [schoolOrOrgName, setSchoolOrOrgName] = useState('');
  const [description, setDescription] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await supportApi.fetchTickets({
        searchQuery,
        status: statusFilter,
      });
      setTickets(res.items);
      setTotalCount(res.total);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !requesterEmail.trim()) return;

    setIsSubmitting(true);
    try {
      await supportApi.createTicket({
        subject: subject.trim(),
        category,
        priority,
        requesterName: requesterName.trim() || 'Institutional Coordinator',
        requesterEmail: requesterEmail.trim(),
        schoolOrOrgName: schoolOrOrgName.trim(),
        description: description.trim(),
        status: 'open',
      });
      onAuditLog?.('OPENED_TICKET', 'support_helpdesk', `Opened ticket: ${subject}`);
      setFormOpen(false);
      loadData();
    } catch (err: any) {
      alert('Failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (ticket: SupportTicket, newStatus: TicketStatus) => {
    try {
      await supportApi.updateTicket(ticket.id, {
        status: newStatus,
        resolutionNotes: resolutionText || ticket.resolutionNotes,
      });
      onAuditLog?.('UPDATED_TICKET_STATUS', 'support_helpdesk', `Ticket ${ticket.ticketNumber} marked as ${newStatus}`);
      setSelectedTicket(null);
      loadData();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-full text-xs font-black text-sky-700 dark:text-sky-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SUPPORT & HELPDESK SERVICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Institutional Inquiries & Support Tickets
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Triage lab equipment delivery issues, ATL technical troubleshooting, and teacher inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={supportApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by subject, ticket #, school name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-xs outline-none"
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button onClick={loadData} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── TICKETS LIST ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-5 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="font-bold">No support tickets found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setSelectedTicket(t);
                setResolutionText(t.resolutionNotes || '');
              }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {t.ticketNumber}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {t.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    t.priority === 'Critical / Emergency' || t.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800'
                  }`}>
                    {t.priority}
                  </span>
                </div>

                <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                  {t.subject}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 flex-wrap font-medium">
                  <span>From: <strong className="text-slate-700 dark:text-slate-300">{t.requesterName}</strong></span>
                  {t.schoolOrOrgName && <span>• {t.schoolOrOrgName}</span>}
                  <span>• {new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-black capitalize ${
                  t.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : t.status === 'in_progress' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: Ticket Detail & Resolution ── */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl p-6 space-y-4 my-auto text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-sky-700">{selectedTicket.ticketNumber}</span>
                <h3 className="font-black text-base text-slate-900">{selectedTicket.subject}</h3>
              </div>
              <button type="button" onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <p className="font-bold text-slate-700">Requester Description:</p>
              <p className="text-slate-600 leading-relaxed">{selectedTicket.description}</p>
              <p className="text-[11px] text-slate-400 font-mono">Contact: {selectedTicket.requesterName} ({selectedTicket.requesterEmail}) • {selectedTicket.schoolOrOrgName}</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Resolution & Administrative Notes:</label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Enter investigation updates, calibration report links, or resolution summary..."
                className="w-full p-2.5 border rounded-xl bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedTicket, 'in_progress')}
                  className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold rounded-xl hover:bg-sky-100"
                >
                  Mark In-Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedTicket, 'resolved')}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve Ticket</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-1.5 bg-slate-100 font-bold rounded-xl text-slate-600"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: Create Ticket ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-3 my-auto text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Open Institutional Support Ticket</h3>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject / Issue Title *</label>
                <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Lab Equipment & Delivery">Lab Equipment & Delivery</option>
                    <option value="Curriculum & Pedagogy">Curriculum & Pedagogy</option>
                    <option value="Platform & Student Login">Platform & Student Login</option>
                    <option value="ATL Lab Setup">ATL Lab Setup</option>
                    <option value="Billing & Institutional PO">Billing & Institutional PO</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical / Emergency">Critical / Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Requester Name</label>
                  <input type="text" value={requesterName} onChange={(e) => setRequesterName(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Requester Email *</label>
                  <input type="email" required value={requesterEmail} onChange={(e) => setRequesterEmail(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">School / Organization</label>
                <input type="text" value={schoolOrOrgName} onChange={(e) => setSchoolOrOrgName(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 font-bold text-slate-600">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md">
                  {isSubmitting ? 'Opening...' : 'Open Ticket'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
