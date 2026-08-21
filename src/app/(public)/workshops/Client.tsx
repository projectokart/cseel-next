'use client';

import Link from 'next/link';

import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { FlaskConical, Cpu, Leaf, Calculator, Zap, Microscope } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const workshops = [
  { icon: FlaskConical, title: "Chemistry in Action", subject: "Chemistry", age: "Class 8–12", duration: "1 Day", desc: "Hands-on experiments covering titration, pH analysis, electrochemistry and more." },
  { icon: Microscope, title: "Biology Exploration", subject: "Biology", age: "Class 6–12", duration: "1 Day", desc: "Cell structure, DNA extraction, photosynthesis and hands-on microscopy sessions." },
  { icon: Zap, title: "Physics Fundamentals", subject: "Physics", age: "Class 8–12", duration: "1 Day", desc: "Newton's laws, optics, electricity and magnetism through real experiments." },
  { icon: Cpu, title: "Engineering & Robotics", subject: "Engineering", age: "Class 9–12", duration: "2 Days", desc: "Build working robots and circuits — introduction to electronics and automation." },
  { icon: Calculator, title: "Mathematics Visualized", subject: "Mathematics", age: "Class 6–10", duration: "1 Day", desc: "3D geometry, probability experiments, and mathematical modeling activities." },
  { icon: Leaf, title: "Environmental Science", subject: "Environment", age: "Class 6–10", duration: "1 Day", desc: "Soil testing, water quality analysis, and sustainability projects." },
];

const Workshops = () => (
  <>
<PageTransition>
      
      <section className="about-hero-gradient py-10 sm:py-16 md:py-20 text-center text-primary-foreground">
        <div className="container mx-auto px-4">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 opacity-80">Hands-On Learning</p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3">CSEEL Workshops</h1>
          <p className="text-xs sm:text-base opacity-90 max-w-xl mx-auto leading-relaxed">
            Intensive one and two-day workshops that bring science alive through real experiments and guided discovery.
          </p>
          <Link href="/contact-us">
            <Button size="sm" variant="secondary" className="mt-4 sm:mt-6 rounded-full font-bold">Book a Workshop</Button>
          </Link>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-background">
        <div className="container mx-auto px-3 sm:px-4">
          <ScrollReveal>
            <h2 className="text-xl sm:text-3xl font-black text-center text-foreground mb-2">Workshop Catalog</h2>
            <p className="text-center text-xs sm:text-sm text-muted-foreground mb-8 max-w-xl mx-auto">Choose from our range of subject-specific workshops designed for different age groups.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 max-w-6xl mx-auto">
            {workshops.map((w) => (
              <div key={w.title} className="bg-card border border-border rounded-2xl p-4 sm:p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <w.icon className="h-7 w-7 sm:h-9 sm:w-9 text-[#006fcc]" />
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full">{w.duration}</span>
                </div>
                <h3 className="text-sm sm:text-lg font-black text-foreground mb-1">{w.title}</h3>
                <p className="text-[11px] sm:text-xs text-primary font-semibold mb-2">{w.subject} · {w.age}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 hero-gradient text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-lg sm:text-2xl font-black text-foreground mb-2">Bring a Workshop to Your School</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-xl mx-auto">We come to you! Our facilitators travel across India to conduct workshops at your premises.</p>
          <Link href="/contact-us">
            <Button className="rounded-full px-6 sm:px-8 text-xs sm:text-sm font-bold">Request Workshop →</Button>
          </Link>
        </div>
      </section>
    </PageTransition>
  </>
);

export default Workshops;
