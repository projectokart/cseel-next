'use client';

import { useParams, useRouter } from 'next/navigation';

import PageTransition from "@/components/shared/PageTransition";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { events, typeColors } from "@/lib/eventsData";


const RegistrationModal = ({ event, open, onClose }: { event: typeof events[0]; open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", participants: "1" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      toast.success("Registration successful! You'll receive a confirmation email shortly.");
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register for {event.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Your full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" placeholder="you@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="school">School / Institution</Label>
            <Input id="school" placeholder="Your school or institution name" value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="participants">Number of Participants *</Label>
            <Input id="participants" type="number" min="1" max="50" required value={form.participants} onChange={e => setForm(f => ({ ...f, participants: e.target.value }))} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Confirm Registration"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EventDetail = () => {
  const {  id  } = useParams() as { id: string };
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <>
<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => router.push("/events/upcoming")}>Back to Events</Button>
        </div>
      </>
    );
  }

  return (
    <>
<PageTransition>
        {/* Hero */}
        <section className="about-hero-gradient py-16 text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl">
            <button onClick={() => router.push("/events/upcoming")} className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-6 transition-opacity">
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </button>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block ${typeColors[event.type] || "bg-gray-100 text-gray-700"}`}>{event.type}</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-5 text-sm opacity-90">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {event.date}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {event.time}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.seats}</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-3 gap-8">
            {/* Left: Details */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-3">About This Event</h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{event.fullDesc}</div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">Event Agenda</h2>
                <div className="border border-border rounded-xl overflow-hidden">
                  {event.agenda.map((item, i) => (
                    <div key={i} className={`flex gap-4 px-5 py-3 ${i % 2 === 0 ? "bg-muted/40" : "bg-background"}`}>
                      <span className="text-sm font-semibold text-primary min-w-[80px]">{item.time}</span>
                      <span className="text-sm text-foreground">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Register Card */}
            <div className="md:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg">Reserve Your Spot</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {event.date}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {event.location}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {event.seats}</div>
                  <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> {event.type}</div>
                </div>
                <Button className="w-full" onClick={() => setShowModal(true)}>Register Now</Button>
                <p className="text-xs text-muted-foreground text-center">Free registration • Confirmation via email</p>
              </div>
            </div>
          </div>
        </section>

        <RegistrationModal event={event} open={showModal} onClose={() => setShowModal(false)} />
      </PageTransition>
    </>
  );
};

export default EventDetail;