import type { Metadata } from 'next';
import Link from 'next/link';
import { ROBOTICS_COMPANIES } from '@/data/roboticsCompaniesData';
import CompanyCarousel from '@/components/companies/CompanyCarousel';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Calendar, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Indian School Robotics & Experiential Learning Directory | Knowledge Index',
  description: 'Public directory of leading STEM, robotics, and Atal Tinkering Lab (ATL) companies for schools across India. Company profiles, products, and contact information.',
  keywords: [
    'robotics company for schools India',
    'stem companies in India',
    'steamrobo',
    'stemrobo',
    'avishkaar',
    'tinkerly',
    'robokart',
    'experiential learning companies India',
    'Atal Tinkering Lab vendors',
    'school robotics lab setup',
  ],
  alternates: {
    canonical: 'https://cseel.org/info/companies',
  },
};

export default function CompaniesDirectoryPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            National Educational Knowledge Repository
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Indian School Robotics &amp; STEM Directory
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Objective public encyclopedia of leading experiential learning, Atal Tinkering Lab (ATL), and robotics education providers across India.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Interactive Auto-Scrolling Carousel with Full Card Images */}
        <CompanyCarousel 
          companies={ROBOTICS_COMPANIES} 
          title="Featured Innovation Partners" 
          subtitle="Auto-scrolling showcase of India's leading experiential learning and robotics companies"
        />

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Featured Educational Providers ({ROBOTICS_COMPANIES.length})
              </h2>
              <p className="text-xs text-slate-500">
                Verified public business profiles with products, curriculum, and registered headquarters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ROBOTICS_COMPANIES.map((company) => (
              <div
                key={company.slug}
                className="rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition-all p-6 shadow-xs flex flex-col justify-between hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {company.headquarters.split(',')[0]}
                    </span>
                    <span className="text-slate-400">Est. {company.foundedYear}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    <Link
                      href={`/info/companies/${company.slug}`}
                      className="hover:text-sky-600 transition"
                    >
                      {company.name}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">
                    {company.tagline}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {company.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {company.coreOfferings.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {item.split('&')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {company.address.locality}, {company.address.region}
                  </span>
                  <Link
                    href={`/info/companies/${company.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 group"
                  >
                    Read Profile &amp; FAQs
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
