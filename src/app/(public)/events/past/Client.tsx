'use client';

import PageTransition from "@/components/shared/PageTransition";
import { Calendar, Users, MapPin, Award } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const pastEvents = [
  { title: "Annual STEM Expo 2025", date: "Nov 20, 2025", location: "Bhubaneswar", participants: "800+", highlight: "50 school projects showcased", img: "https://www.ase.org.uk/sites/default/files/Spacestation%20by%20S%2BB%20UK.JPG" },
  { title: "Teacher Training Summit 2025", date: "Sep 14, 2025", location: "CSEEL Campus", participants: "120 teachers", highlight: "NEP 2020 curriculum workshop", img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif" },
  { title: "National Science Olympiad 2025", date: "Jul 5, 2025", location: "Online", participants: "2000+ students", highlight: "34 schools participated", img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66be608d71d32863b2bf5487_Students-Desk-Classroom-Laptop-reverse.avif" },
];

const EventsPast = () => (
  <>
<PageTransition>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] text-white py-16 md:py-20 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider">
            Event Highlights & Conclave Archives
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
            Past Events & Science Expos
          </h1>
          <p className="text-sm md:text-base text-slate-100/90 max-w-2xl mx-auto leading-relaxed">
            Relive the inspiring moments, award-winning student prototypes, and teacher development summits from past CSEEL conclaves.
          </p>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((e) => (
              <div key={e.title} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={e.img} alt={e.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-2">{e.title}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.date}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</div>
                    <div className="flex items-center gap-1"><Users className="h-3 w-3" /> {e.participants}</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                    <Award className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-primary">{e.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  </>
);

export default EventsPast;
