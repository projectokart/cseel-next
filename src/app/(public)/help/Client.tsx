'use client';

import Link from 'next/link';

import PageTransition from "@/components/shared/PageTransition";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How do I create an account?", a: "Click on the Login button in the top bar, then switch to the Sign Up tab. Fill in your details and choose your role (Teacher or Student)." },
  { q: "How do I join a class?", a: "After signing up as a student, go to your dashboard and use the class code provided by your teacher to enroll." },
  { q: "Can I access experiments on mobile?", a: "Yes! CSEEL is fully responsive and works on phones, tablets, and desktops." },
  { q: "How do teachers assign experiments?", a: "Teachers can create assignments from their dashboard by selecting an experiment and assigning it to a class." },
  { q: "I forgot my password. What do I do?", a: "Click on 'Forgot password?' on the login page and enter your email. You'll receive a reset link." },
  { q: "How do I contact support?", a: "Visit our Get Support page to submit a ticket, or email us at support@cseel.org." },
];

const Help = () => (
  <>
<PageTransition>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] py-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight" style={{ color: '#ffffff' }}>Help Center & Knowledge Base</h1>
          <p className="text-base text-slate-100/90 max-w-xl mx-auto">Find instant answers to common questions about accounts, practicals, and institutional access.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still need help?</p>
            <Link href="/get-support"><Button>Contact Support</Button></Link>
          </div>
        </div>
      </section>
    </PageTransition>
  </>
);

export default Help;
