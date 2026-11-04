'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, Phone, Mail, MapPin, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

interface CurrentlyWorkingProps {
  pageTitle?: string;
  badge?: string;
  subtitle?: string;
  customDescription?: string;
}

export default function CurrentlyWorkingOnPage({
  pageTitle = 'Events & Workshops',
  badge = 'Work In Progress',
  subtitle = 'Experiential Science Conclaves & School Workshops',
  customDescription,
}: CurrentlyWorkingProps) {
  return (
    <PageTransition>
      <div className="min-h-[85vh] bg-[#f8fafd] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Subtle animated card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-8 sm:p-12 text-center relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#006FCC] via-[#38bdf8] to-[#006FCC]" />

            {/* Icon & Status Badge */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] text-[#006FCC] flex items-center justify-center mb-4 shadow-xs border border-[#bfdbfe]">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#eef3fc] text-[#006FCC] border border-[#d0e1fd]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            </div>

            {/* Main Headings */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight font-['Montserrat',sans-serif]">
              Currently Working on This Page
            </h1>

            <p className="mt-2 text-base sm:text-lg font-semibold text-[#006FCC]">
              {pageTitle}
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#64748b] max-w-lg mx-auto leading-relaxed">
              {customDescription ||
                'We are currently preparing and scheduling our upcoming experiential STEM conclaves, robotics bootcamps, and school workshops calendar. Verified official schedules will be published here shortly.'}
            </p>

            {/* Quick Contact & Assistance Box */}
            <div className="mt-8 pt-6 border-t border-[#f1f5f9] text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3 text-center">
                Need Immediate Assistance or Want to Organize a Workshop?
              </p>

              <div className="bg-[#f8fafc] rounded-2xl p-4 sm:p-5 border border-[#e2e8f0] space-y-3">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#334155]">
                  <Phone className="w-4 h-4 text-[#006FCC] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0f172a]">Direct Helplines: </span>
                    <a href="tel:+917838337284" className="hover:text-[#006FCC] font-medium">+91 7838337284</a>
                    {' • '}
                    <a href="tel:+919050778830" className="hover:text-[#006FCC] font-medium">+91 9050778830</a>
                    {' • '}
                    <a href="tel:+917678198568" className="hover:text-[#006FCC] font-medium">+91 7678198568</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#334155]">
                  <Mail className="w-4 h-4 text-[#006FCC] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#0f172a]">Email: </span>
                    <a href="mailto:contact@cseel.org" className="text-[#006FCC] hover:underline font-medium">contact@cseel.org</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#334155]">
                  <MapPin className="w-4 h-4 text-[#006FCC] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0f172a]">Headquarters: </span>
                    <span>690 GH14, Paschim Vihar, New Delhi - 110087</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact-us"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#006FCC] hover:bg-[#005bb5] text-white font-semibold text-sm shadow-sm transition-all duration-150"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1] font-semibold text-sm transition-all duration-150"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
