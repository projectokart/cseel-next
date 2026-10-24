'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EventsHeroSlider,
  EventsFilterBar,
  EventCard,
  useEventsFilter,
  EVENTS_DATA,
  CseelEvent,
} from '@/features/events';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Calendar, Users } from 'lucide-react';

export default function EventsClient() {
  const router = useRouter();
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    activeFilterCount,
    resetFilters,
  } = useEventsFilter(EVENTS_DATA);

  const [registerEvent, setRegisterEvent] = useState<CseelEvent | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', school: '', count: '1' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const featured = EVENTS_DATA.slice(0, 3);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRegisterEvent(null);
      toast.success(`Registered successfully for ${registerEvent?.title}!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] pb-20">
      {/* Hero Carousel */}
      <EventsHeroSlider
        featuredEvents={featured}
        onRegister={(evt) => setRegisterEvent(evt)}
      />

      {/* Filter Bar */}
      <EventsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        activeFilterCount={activeFilterCount}
        totalCount={EVENTS_DATA.length}
        filteredCount={filteredEvents.length}
        onResetFilters={resetFilters}
      />

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#16171A] font-['Google_Sans',Roboto,sans-serif]">
              All Events & Workshops
            </h2>
            <p className="text-sm text-[#656773] mt-0.5">
              Showing {filteredEvents.length} of {EVENTS_DATA.length} national STEM conclaves & practical bootcamps
            </p>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#dadce0] rounded-2xl shadow-xs">
            <Calendar className="w-12 h-12 text-[#656773] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#16171A]">No events match your criteria</p>
            <p className="text-xs text-[#656773] mt-1">Try resetting filters or searching with another term.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#1a73e8] bg-[#eef3fc] hover:bg-[#e3ecf8] rounded-full transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onClick={() => router.push(`/events/${evt.slug}`)}
                onRegister={() => setRegisterEvent(evt)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Registration Modal */}
      <Dialog open={!!registerEvent} onOpenChange={() => setRegisterEvent(null)}>
        <DialogContent className="max-w-md bg-white border border-[#dadce0] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#16171A] font-['Google_Sans',Roboto,sans-serif]">
              Register for {registerEvent?.title}
            </DialogTitle>
            <p className="text-xs text-[#656773]">
              {registerEvent?.date} &bull; {registerEvent?.venue}, {registerEvent?.city}
            </p>
          </DialogHeader>

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 mt-3">
            <div>
              <Label htmlFor="reg-name" className="text-xs font-medium text-[#16171A]">Full Name *</Label>
              <Input
                id="reg-name"
                required
                placeholder="Dr. / Mr. / Ms."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 h-10 text-xs rounded-xl border-[#dadce0]"
              />
            </div>
            <div>
              <Label htmlFor="reg-email" className="text-xs font-medium text-[#16171A]">Email Address *</Label>
              <Input
                id="reg-email"
                type="email"
                required
                placeholder="your.email@school.edu.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 h-10 text-xs rounded-xl border-[#dadce0]"
              />
            </div>
            <div>
              <Label htmlFor="reg-school" className="text-xs font-medium text-[#16171A]">School / Institution Name *</Label>
              <Input
                id="reg-school"
                required
                placeholder="e.g. Delhi Public School, Rewari"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
                className="mt-1 h-10 text-xs rounded-xl border-[#dadce0]"
              />
            </div>
            <div>
              <Label htmlFor="reg-phone" className="text-xs font-medium text-[#16171A]">Mobile / WhatsApp *</Label>
              <Input
                id="reg-phone"
                required
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 h-10 text-xs rounded-xl border-[#dadce0]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-11 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium text-xs shadow-sm font-['Google_Sans',Roboto,sans-serif]"
            >
              {isSubmitting ? 'Confirming Registration...' : 'Complete Free Registration'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
