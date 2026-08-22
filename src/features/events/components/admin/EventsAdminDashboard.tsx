'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CseelEvent, EventType, EventsFilterState } from '../../types';
import { eventsApi } from '../../api/eventsApiClient';
import {
  Calendar, Plus, Search, Filter, Download, Upload,
  MapPin, Clock, Users, Award, Trash2, Edit2, Copy,
  X, SlidersHorizontal, RefreshCw, CheckCircle2, Mic
} from 'lucide-react';

interface EventsAdminDashboardProps {
  onAuditLog?: (action: string, module: string, details: string) => void;
}

export default function EventsAdminDashboard({ onAuditLog }: EventsAdminDashboardProps) {
  const [events, setEvents] = useState<CseelEvent[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'registered' | 'newest'>('date');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingEv, setEditingEv] = useState<CseelEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('National Symposium');
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('10:00 AM - 05:00 PM IST');
  const [venue, setVenue] = useState('Vigyan Bhawan / Hybrid');
  const [city, setCity] = useState('New Delhi');
  const [speakersInput, setSpeakersInput] = useState('Dr. Scientist, Prof. Pedagogy');
  const [capacity, setCapacity] = useState(400);
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop');
  const [agendaSummary, setAgendaSummary] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await eventsApi.fetchEvents({
        searchQuery,
        selectedTypes,
        status: statusFilter,
        sortBy,
      });
      setEvents(res.items);
      setTotalCount(res.total);
      setTypes(res.types);
    } catch {}
    finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedTypes, statusFilter, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingEv(null);
    setTitle('');
    setEventType('National Symposium');
    setDate('2026-10-18');
    setTime('10:00 AM - 05:00 PM IST');
    setVenue('Vigyan Bhawan / Hybrid');
    setCity('New Delhi');
    setSpeakersInput('Dr. Scientist, Prof. Pedagogy');
    setCapacity(400);
    setBannerImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop');
    setAgendaSummary('National Science Symposium deliberation on experiential lab curricula...');
    setFormOpen(true);
  };

  const openEditModal = (e: CseelEvent) => {
    setEditingEv(e);
    setTitle(e.title);
    setEventType(e.type);
    setDate(e.date);
    setTime(e.time);
    setVenue(e.venue);
    setCity(e.city);
    setSpeakersInput(e.keynoteSpeakers.join(', '));
    setCapacity(e.capacity);
    setBannerImage(e.bannerImage);
    setAgendaSummary(e.agendaSummary);
    setFormOpen(true);
  };

  const handleSaveEvent = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setIsSubmitting(true);
    try {
      const speakers = speakersInput.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        type: eventType,
        date,
        time: time.trim(),
        venue: venue.trim(),
        city: city.trim(),
        keynoteSpeakers: speakers,
        capacity: Number(capacity),
        bannerImage: bannerImage.trim(),
        agendaSummary: agendaSummary.trim(),
        status: 'upcoming' as const,
        isRegistrationOpen: true,
      };

      if (editingEv) {
        await eventsApi.updateEvent(editingEv.id, payload);
        onAuditLog?.('UPDATED_EVENT', 'events_rnd', `Updated event: ${title}`);
      } else {
        await eventsApi.createEvent(payload);
        onAuditLog?.('CREATED_EVENT', 'events_rnd', `Created event: ${title}`);
      }

      setFormOpen(false);
      loadData();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string, eTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eTitle}"?`)) return;
    try {
      await eventsApi.deleteEvent(id);
      onAuditLog?.('DELETED_EVENT', 'events_rnd', `Deleted event: ${eTitle}`);
      loadData();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 select-none">
      
      {/* ── HEADER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-black text-amber-800 dark:text-amber-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>EVENTS & NATIONAL OUTREACH SERVICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Symposia, Hackathons & Exhibitions Management
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Govern national STEM symposia, school science exhibitions, and space hackathons with live delegate ticketing and CSV reporting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={eventsApi.getExportUrl()}
            download
            data-skip-progress="true"
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* ── WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>Filters</span>
              </span>
              {(selectedTypes.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTypes([]);
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-amber-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase text-slate-400">Event Format</p>
              <div className="space-y-1">
                {(['National Symposium', 'Webinar', 'Science Hackathon', 'Exhibition', 'Panel Discussion'] as EventType[]).map((t) => {
                  const isChecked = selectedTypes.includes(t);
                  return (
                    <label
                      key={t}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer ${
                        isChecked ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedTypes((prev) =>
                              prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
                            )
                          }
                          className="w-3.5 h-3.5 accent-amber-600 rounded"
                        />
                        <span>{t}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by title, venue, speakers, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-xs outline-none"
              >
                <option value="date">Event Date</option>
                <option value="registered">Most Registrations</option>
                <option value="newest">Newest First</option>
              </select>
              <button onClick={loadData} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 animate-pulse">
                  <div className="h-40 bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold">No events match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800">
                    <img src={e.bannerImage} alt={e.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase">
                      {e.type}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {e.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {e.agendaSummary}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {e.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {e.city}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-600 font-bold" /> {e.registeredCount}/{e.capacity} Registered</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{e.venue}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(e)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(e.id, e.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── MODAL: Create / Edit Event ── */}
      {formOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-amber-100 text-amber-800">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingEv ? 'Edit Science Event' : 'Schedule National Science Event'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Symposia, Webinars, Hackathons & Exhibitions</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl font-bold bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Format</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value as any)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-bold">
                    <option value="National Symposium">National Symposium</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Science Hackathon">Science Hackathon</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Panel Discussion">Panel Discussion</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Venue / Platform</label>
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Keynote Speakers (Comma Separated)</label>
                  <input type="text" value={speakersInput} onChange={(e) => setSpeakersInput(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Capacity</label>
                  <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Image URL</label>
                <input type="url" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} className="w-full px-3 py-2 border rounded-xl bg-slate-50" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Agenda Summary</label>
                <textarea rows={2} value={agendaSummary} onChange={(e) => setAgendaSummary(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-md flex items-center gap-2">
                  <span>{isSubmitting ? 'Saving...' : editingEv ? 'Update Event' : 'Publish Event'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
