'use client';

import React, { useState } from 'react';
import { FileText, Plus, Globe, Sparkles, Image, CheckCircle2, Eye, Layout } from 'lucide-react';
import { ALL_BLOGS } from '@/lib/blogsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const ContentAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [blogs, setBlogs] = useState(ALL_BLOGS);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-black text-sky-700">
            <Globe className="w-3.5 h-3.5" />
            <span>GENERAL WEB PLATFORM, HOMEPAGE & CMS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Homepage Banners, Announcements & Blog Articles
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Manage global website promotional announcements, hero section CTAs on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/</code> and scientific research articles published on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/blog</code>.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('CREATED_BLOG_POST', 'content_homepage', 'Opened blog article CMS editor')}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Article</span>
        </button>
      </div>

      {/* ── HOMEPAGE LIVE BANNER STATUS ── */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-3xl p-5 border border-sky-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-sky-950 flex items-center gap-2">
            <Layout className="w-4 h-4 text-sky-700" />
            <span>Homepage Hero Banner & Announcement Bar Active Config</span>
          </h3>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            ● Live on Website (/)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-sky-100 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Top Announcement Bar</p>
            <p className="font-black text-gray-900">"🚀 National Science Day Conclave 2026 Registration Open — Join 100+ Schools Across India"</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-sky-100 space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Main Hero Badge</p>
            <p className="font-black text-gray-900">"India's Premier Experiential Science & Simulation Ecosystem"</p>
          </div>
        </div>
      </div>

      {/* ── BLOG ARTICLES CMS LIST ── */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-gray-900">Published Blog & Science Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogs.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {b.category}
                </span>
                <h4 className="text-sm font-black text-gray-900 leading-snug">{b.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{b.summary}</p>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-gray-400">{b.publishedAt} • {b.readTime}</span>
                <a href={`/blog/${b.slug}`} target="_blank" className="text-xs font-bold text-sky-700 hover:underline">
                  View Article →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentAdminModule;
