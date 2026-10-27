'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, Phone, Mail, MapPin, CheckCircle2, ChevronRight,
  User, Award, Briefcase, FileText, ArrowLeft, ShieldCheck, Upload,
  Sparkles, Layers, BookOpen, AlertCircle, Lock
} from 'lucide-react';
import CloudflareTurnstile from '@/components/shared/CloudflareTurnstile';
import { INDIAN_STATES_DISTRICTS } from '@/app/(public)/edu-network/teachers/Client';
import { VerifiedFacultyItem } from '@/data/facultyJobsData';

export default function RegisterFacultyClient() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'PGT',
    subject: 'Physics',
    board: 'CBSE',
    qualification: '',
    experienceYears: 5,
    state: 'Haryana',
    district: 'Gurugram',
    city: 'Gurugram',
    address: '',
    pincode: '',
    pastSchools: '',
    skills: '',
    avatarUrl: '',
    phonePrivate: true,
    emailPrivate: true,
    expectedSalary: '₹9 - ₹12 LPA',
    bio: '',
  });

  const [isCompressingAvatar, setIsCompressingAvatar] = useState(false);
  const [avatarCompressedSize, setAvatarCompressedSize] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bot Armor & Cloudflare Turnstile States
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypotVal, setHoneypotVal] = useState('');
  const formMountTime = React.useRef(Date.now());

  // Compress image to WebP <= 10KB
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingAvatar(true);
    setAvatarCompressedSize(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let quality = 0.8;
          let dataUrl = canvas.toDataURL('image/webp', quality);

          while (dataUrl.length > 13500 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/webp', quality);
          }

          const byteSize = Math.round((dataUrl.length * 3) / 4);
          setAvatarCompressedSize(byteSize);
          setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
        }
        setIsCompressingAvatar(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 0. Bot Protection Layer 1: Honeypot Trap
    if (honeypotVal) {
      console.warn('[Bot Armor] Automated bot submission rejected.');
      return;
    }

    // 0. Bot Protection Layer 2: Rapid Submit Threshold
    if (Date.now() - formMountTime.current < 1500) {
      setErrorMessage('Security notice: Form submitted too rapidly. Please review your details.');
      return;
    }

    // 0. Bot Protection Layer 3: Cloudflare Turnstile Token Verification
    if (!turnstileToken) {
      setErrorMessage('Cloudflare Security Check Required: Please verify the Cloudflare Turnstile challenge before submitting.');
      return;
    }

    // 1. Name validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    // 2. Direct Indian Mobile Number Validation
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send secure registration request through multi-layer server defense
      const payload = {
        ...formData,
        turnstileToken,
        website_company_trap: honeypotVal,
        clientTimestamp: formMountTime.current,
      };

      const res = await fetch('/api/faculty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Security verification failed.');
        return;
      }

      const newFacultyItem = data.educator;
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('cseel_custom_faculty') || '[]');
          localStorage.setItem('cseel_custom_faculty', JSON.stringify([newFacultyItem, ...stored]));
        } catch {}
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDistricts = INDIAN_STATES_DISTRICTS[formData.state] || [formData.city];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight size={13} className="text-slate-400" />
          <Link href="/edu-network/teachers" className="hover:text-slate-900 transition">EduNetwork</Link>
          <ChevronRight size={13} className="text-slate-400" />
          <Link href="/edu-network/teachers" className="hover:text-slate-900 transition">Teachers Directory</Link>
          <ChevronRight size={13} className="text-slate-400" />
          <span className="text-[#005689] font-bold">Register as Faculty</span>
        </nav>

        {isSuccess ? (
          /* ─── SUCCESS CONFIRMATION SCREEN ─── */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Verified & Recorded
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Thank you! Successfully submitted.
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your educator profile has been recorded in our verified database. It is currently placed under <strong>Admin Verification</strong> and will be published across the faculty roster once verified.
              </p>
            </div>

            {/* Profile Card Preview */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={formData.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                  alt={formData.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{formData.name}</h4>
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {formData.designation} in {formData.subject} ({formData.board})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span>{formData.city}, {formData.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile (Protected)</span>
                  <span className="font-mono font-semibold text-slate-800">
                    +91 {formData.phone.charAt(0)}*********
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/edu-network/teachers"
                className="w-full sm:w-auto px-6 py-3 bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <BookOpen size={15} />
                <span>Browse Teachers Directory</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData((prev) => ({ ...prev, name: '', phone: '', email: '', bio: '' }));
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Register Another Educator
              </button>
            </div>
          </div>
        ) : (
          /* ─── DEDICATED REGISTRATION FORM ─── */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">

            {/* Header */}
            <div className="border-b border-slate-100 pb-5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005689] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                  Educator Onboarding Portal
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Verified Profile</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Register as a Verified STEM Faculty
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Join thousands of school educators across India. Create your public educator profile with verified qualifications, subject expertise, and anti-spam contact privacy.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. Identity & Profile Photo */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <User size={14} className="text-[#005689]" />
                  <span>1. Personal & Profile Identity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="e.g. Dr. Arvind Joshi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Profile Photo (Max 10KB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-[#005689] hover:file:bg-blue-100 cursor-pointer w-full"
                    />
                    {isCompressingAvatar && (
                      <p className="text-[10.5px] text-amber-600 font-semibold mt-1">Compressing to WebP &lt;= 10KB...</p>
                    )}
                    {avatarCompressedSize !== null && !isCompressingAvatar && (
                      <p className="text-[10.5px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>{(avatarCompressedSize / 1024).toFixed(2)} KB (✓ WebP Verified)</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Direct Mobile Phone & Email */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Phone size={14} className="text-[#005689]" />
                  <span>2. Direct Contact & Privacy Settings</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Direct Mobile Phone */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs text-slate-400 font-mono font-bold">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210 (10-digit number)"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setFormData({ ...formData, phone: val });
                        }}
                        className="w-full pl-12 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:bg-white font-mono transition"
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Direct contact number for school recruitment coordinators.
                    </p>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={60}
                      placeholder="teacher@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:bg-white transition"
                    />
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      Used for verified school interview alerts.
                    </p>
                  </div>
                </div>


              </div>

              {/* 3. Academic Level, Subject & Board */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-[#005689]" />
                  <span>3. Teaching Credentials & Subject Domain</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Teaching Level *</label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="PGT">PGT (Class 11 - 12)</option>
                      <option value="TGT">TGT (Class 6 - 10)</option>
                      <option value="PRT">PRT (Primary Class 1 - 5)</option>
                      <option value="Lab In-Charge">Lab In-Charge / Assistant</option>
                      <option value="ATL Mentor">ATL Mentor / Robotics</option>
                      <option value="Academic Coordinator">Academic Coordinator / HOD</option>
                      <option value="Special Educator">Special Educator</option>
                      <option value="Counselor">School Counselor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Core Discipline *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Computer Science">Computer Science / IP / AI</option>
                      <option value="Robotics & AI">Robotics & AI / STEM</option>
                      <option value="General Science">General Science / EVS</option>
                      <option value="English">English Literature</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Social Studies">Social Studies / SST</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Board Syllabus *</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="CBSE">CBSE Board</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="Cambridge / IB">Cambridge / IB</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      placeholder="e.g. M.Sc Physics (Gold Medalist), B.Ed"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Years of Teaching Experience: <span className="text-[#005689] font-extrabold">{formData.experienceYears} Years</span>
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-[#005689] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-slate-700 w-12 text-right">{formData.experienceYears} yrs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Location & Experience */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#005689]" />
                  <span>4. Location & Educational Background</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        const nextState = e.target.value;
                        const firstDistrict = INDIAN_STATES_DISTRICTS[nextState]?.[0] || 'Delhi NCR';
                        setFormData({ ...formData, state: nextState, district: firstDistrict, city: firstDistrict });
                      }}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {Object.keys(INDIAN_STATES_DISTRICTS).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">City / District *</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value, city: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Past / Current Schools Taught At</label>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="e.g. DPS R.K. Puram, Amity International"
                      value={formData.pastSchools}
                      onChange={(e) => setFormData({ ...formData, pastSchools: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Expected Salary Band</label>
                    <select
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="₹3 - ₹5 LPA">₹3 - ₹5 LPA</option>
                      <option value="₹5 - ₹8 LPA">₹5 - ₹8 LPA</option>
                      <option value="₹8 - ₹12 LPA">₹8 - ₹12 LPA</option>
                      <option value="₹12 - ₹18 LPA">₹12 - ₹18 LPA</option>
                      <option value="₹18+ LPA">₹18+ LPA (Leadership / Senior PGT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Key Pedagogical Skills (Comma Separated)</label>
                  <input
                    type="text"
                    maxLength={150}
                    placeholder="e.g. NEP 2020 Experiential Pedagogy, CBSE Board Evaluation, Atal Tinkering Labs"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Professional Bio (Max 250 characters)</label>
                  <textarea
                    rows={3}
                    maxLength={250}
                    placeholder="Briefly describe your teaching philosophy and classroom laboratory achievements..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] resize-none"
                  />
                  <span className="text-[10px] text-slate-400 block text-right">{formData.bio.length}/250</span>
                </div>
              </div>

              {/* 5. Cloudflare Turnstile Bot Defense Widget */}
              <div className="pt-2">
                {/* Honeypot Trap - Invisible to humans, catches automated bots */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website_company_trap"
                    value={honeypotVal}
                    onChange={(e) => setHoneypotVal(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <CloudflareTurnstile
                  onVerify={(token) => {
                    setTurnstileToken(token);
                    setErrorMessage(null);
                  }}
                  onExpire={() => setTurnstileToken(null)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href="/edu-network/teachers"
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken}
                  className={`px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 ${
                    turnstileToken
                      ? 'bg-[#005689] hover:bg-[#003c6e] text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Registering Profile...</span>
                  ) : !turnstileToken ? (
                    <>
                      <Lock size={14} className="text-slate-400" />
                      <span>Verify Security Check to Submit</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-300" />
                      <span>Register as Verified Faculty</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
