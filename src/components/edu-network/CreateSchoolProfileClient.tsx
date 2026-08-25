'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2, MapPin, Star, ShieldCheck, CheckCircle2,
  Briefcase, Heart, MessageSquare, Share2, Send, Plus,
  ChevronRight, Award, Beaker, Users, Calendar, ArrowLeft,
  ThumbsUp, ExternalLink, Check, X, Sparkles, Navigation,
  Clock, Eye, Camera, BookOpen, Microscope, Laptop, Maximize2,
  Phone, Mail, Globe, Wallet, ChartBar, Wand2, Image as ImageIcon,
  Play, Download, Lock, CheckSquare, HelpCircle, FileText, ChevronDown,
  Scale, Bell, Bookmark, Bot, Video, UserCheck, Key, Copy, CheckCheck,
  Trophy, GraduationCap, ArrowRight, Save, EyeOff
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';

export default function CreateSchoolProfileClient() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<'card' | 'detail' | 'preview'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newSchoolId, setNewSchoolId] = useState('');

  // Form State: Part 1 (Directory Card Info)
  const [cardForm, setCardForm] = useState({
    name: '',
    udiseCode: '07010200389',
    board: 'CBSE' as const,
    affiliation: 'CBSE Affiliated Senior Secondary School',
    locality: 'Sector 62',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110001',
    address: 'Plot No. 12, Institutional Area, New Delhi',
    monthlyFees: '₹12,500 / mo',
    monthlyFeesNum: 12500,
    classesOffered: 'Nursery to 12th',
    studentFacultyRatio: '14:1',
    admissionStatus: 'Open for 2026-27' as const,
    stemLabsCount: 12,
    hasVerifiedLabs: true,
    logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=600&q=80',
    facilitiesChips: 'Smart Classrooms, Robotics Lab, Swimming Pool, Transport'
  });

  // Form State: Part 2 (Full Detail Page Info)
  const [detailForm, setDetailForm] = useState({
    description: 'A forward-thinking educational institution empowering students with experiential STEM inquiry, global CBSE/IB curricula, and future-ready innovation ecosystems.',
    established: 1998,
    studentStrength: 2400,
    email: 'admissions@school.edu.in',
    phone: '+91 11 4987 6543',
    website: 'https://www.school.edu.in',
    principalName: 'Dr. Sunita Kapoor',
    principalDesignation: 'Principal (Ph.D, M.Ed)',
    principalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    principalMessage: 'We inspire holistic global education by instilling critical inquiries, creativity, and empathy in every learner.',
    // Academic Stats
    instructionLanguage: 'English',
    academicSession: 'April to March',
    totalFacultyCount: 110,
    // Fees Breakdown
    admissionFee: 45000,
    registrationFee: 1000,
    tuitionFeeQuarterly: 37500,
    securityDeposit: 15000,
    annualLogisticsFee: 18000,
    developmentFund: 12000,
    // Academic Results
    passRate: '100%',
    topScore: '99.4%',
    batchAverage: '89.2%',
    topper1Name: 'Ananya Sharma',
    topper1Score: '99.4%',
    topper1Stream: 'Science (PCM + CS)',
    topper2Name: 'Kabir Malhotra',
    topper2Score: '98.8%',
    topper2Stream: 'Commerce with Math',
    // Virtual Tour & Media
    virtualTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    // STEM Labs checkboxes
    selectedLabs: [
      'Science Experiential Lab',
      'Composite Science Lab',
      'Atal Tinkering Lab (ATL)',
      'Robotics & IoT Lab',
      'AI & Machine Learning Lab',
      'AR / VR Immersive Pods',
      'Language & Phonetics Lab',
      'Astronomy & Space Observatory',
      'Mathematics Activity Lab',
      '3D Printing & CAD Studio',
      'Bio-Tech & Hydroponics Unit',
      'Coding & Cyber-Security Suite'
    ]
  });

  const handleLabToggle = (labName: string) => {
    setDetailForm(prev => ({
      ...prev,
      selectedLabs: prev.selectedLabs.includes(labName)
        ? prev.selectedLabs.filter(l => l !== labName)
        : [...prev.selectedLabs, labName]
    }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSlug = cardForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-school';
    const finalOrgId = `org-${generatedSlug}-${Date.now().toString().slice(-4)}`;

    const newOrg: OrganizationItem = {
      id: finalOrgId,
      name: cardForm.name,
      type: 'School',
      affiliation: cardForm.affiliation,
      city: cardForm.city,
      state: cardForm.state,
      pincode: cardForm.pincode,
      address: cardForm.address,
      locality: cardForm.locality,
      email: detailForm.email,
      phone: detailForm.phone,
      website: detailForm.website,
      verified: true,
      rating: 4.9,
      reviews: 1,
      stemLabsCount: detailForm.selectedLabs.length,
      studentStrength: detailForm.studentStrength,
      logo: cardForm.logo,
      bannerImage: cardForm.bannerImage,
      description: detailForm.description,
      openJobsCount: 2,
      established: detailForm.established,
      facilities: cardForm.facilitiesChips.split(',').map(s => s.trim()),
      classesOffered: cardForm.classesOffered,
      monthlyFees: cardForm.monthlyFees,
      monthlyFeesNum: cardForm.monthlyFeesNum,
      board: cardForm.board,
      studentFacultyRatio: cardForm.studentFacultyRatio,
      admissionStatus: cardForm.admissionStatus,
      udiseCode: cardForm.udiseCode,
      isFeatured: true,
    };

    // Save in ALL_ORGANIZATIONS
    ALL_ORGANIZATIONS.unshift(newOrg);
    setNewSchoolId(finalOrgId);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP HEADER & BREADCRUMB ────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/edu-network" className="hover:text-blue-600">EduNetwork</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/edu-network/organisation/school" className="hover:text-blue-600">Schools</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-bold">Create School Profile</span>
            </div>

            <Link
              href="/edu-network/organisation/school"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#001f3f] via-[#002b4e] to-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Institutional Onboarding Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Create Verified School Profile
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  List your K-12 institution with all 12 UniApply sections, STEM Live Labs, Class 10/12 results, fee breakdown, and verified UDISE credentials.
                </p>
              </div>

              {/* Step Navigation Tabs */}
              <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveStep('card')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeStep === 'card'
                      ? 'bg-white text-blue-950 font-black shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>1. Card Info</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('detail')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeStep === 'detail'
                      ? 'bg-white text-blue-950 font-black shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>2. Detail Page</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('preview')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeStep === 'preview'
                      ? 'bg-white text-blue-950 font-black shadow-md'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3. Live Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SUCCESS BANNER IF CREATED ──────────────────────────────────────── */}
        {submitSuccess && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">School Profile Successfully Published!</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                <strong>{cardForm.name}</strong> is now live on CSEEL EduNetwork with verified UDISE: <code>{cardForm.udiseCode}</code>, STEM Live Lab matrix, and year-wise academic toppers.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href={`/edu-network/org/${newSchoolId}`}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <span>View Full Profile Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/edu-network/organisation/school"
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition"
                >
                  <span>Go to School Directory</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN ONBOARDING FORM ──────────────────────────────────────────── */}
        {!submitSuccess && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleFinalSubmit} className="space-y-8">
              
              {/* ────────────────────────────────────────────────────────────── */}
              {/* PART 1: DIRECTORY CARD INFORMATION                            */}
              {/* ────────────────────────────────────────────────────────────── */}
              {activeStep === 'card' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
                      <h2 className="text-lg font-black text-slate-900">Card Information (Directory Listing)</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      These details appear directly on the school directory cards across All India and city pages.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-semibold">
                    
                    {/* School Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Official School Name *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.name}
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                        placeholder="e.g. K.R. Mangalam Global School"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900 focus:bg-white transition"
                      />
                    </div>

                    {/* UDISE Code */}
                    <div>
                      <label className="block text-slate-700 mb-1">UDISE+ Code (11 Digits) *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.udiseCode}
                        onChange={(e) => setCardForm({ ...cardForm, udiseCode: e.target.value })}
                        placeholder="e.g. 07010200301"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold text-slate-900"
                      />
                    </div>

                    {/* Board / Affiliation */}
                    <div>
                      <label className="block text-slate-700 mb-1">Board / Affiliation *</label>
                      <select
                        value={cardForm.board}
                        onChange={(e) => setCardForm({ ...cardForm, board: e.target.value as any })}
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                      >
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>

                    {/* Locality */}
                    <div>
                      <label className="block text-slate-700 mb-1">Locality / Sector *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.locality}
                        onChange={(e) => setCardForm({ ...cardForm, locality: e.target.value })}
                        placeholder="e.g. Greater Kailash / Sector 62"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.city}
                        onChange={(e) => setCardForm({ ...cardForm, city: e.target.value })}
                        placeholder="e.g. Delhi NCR / Mumbai"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.state}
                        onChange={(e) => setCardForm({ ...cardForm, state: e.target.value })}
                        placeholder="e.g. Delhi / Maharashtra"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="block text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.pincode}
                        onChange={(e) => setCardForm({ ...cardForm, pincode: e.target.value })}
                        placeholder="110001"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Full Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Full Campus Address *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.address}
                        onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })}
                        placeholder="Plot No. 12, Sri Aurobindo Marg, New Delhi"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Monthly Fee Display & Num */}
                    <div>
                      <label className="block text-slate-700 mb-1">Monthly Fee (Display Format) *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.monthlyFees}
                        onChange={(e) => setCardForm({ ...cardForm, monthlyFees: e.target.value })}
                        placeholder="₹12,500 / mo"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Monthly Fee Numeric (for Filters ₹) *</label>
                      <input
                        type="number"
                        required
                        value={cardForm.monthlyFeesNum}
                        onChange={(e) => setCardForm({ ...cardForm, monthlyFeesNum: Number(e.target.value) })}
                        placeholder="12500"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                      />
                    </div>

                    {/* Classes Offered */}
                    <div>
                      <label className="block text-slate-700 mb-1">Classes Offered *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.classesOffered}
                        onChange={(e) => setCardForm({ ...cardForm, classesOffered: e.target.value })}
                        placeholder="Nursery to 12th"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Student Ratio */}
                    <div>
                      <label className="block text-slate-700 mb-1">Student-Faculty Ratio *</label>
                      <input
                        type="text"
                        required
                        value={cardForm.studentFacultyRatio}
                        onChange={(e) => setCardForm({ ...cardForm, studentFacultyRatio: e.target.value })}
                        placeholder="13:1"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Admission Status */}
                    <div>
                      <label className="block text-slate-700 mb-1">Admission Status *</label>
                      <select
                        value={cardForm.admissionStatus}
                        onChange={(e) => setCardForm({ ...cardForm, admissionStatus: e.target.value as any })}
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold text-emerald-700"
                      >
                        <option value="Open for 2026-27">Open for 2026-27</option>
                        <option value="On Going">On Going</option>
                        <option value="Closing Soon">Closing Soon</option>
                        <option value="Merit Based">Merit Based</option>
                      </select>
                    </div>

                    {/* Logo & Banner URLs */}
                    <div>
                      <label className="block text-slate-700 mb-1">Logo Image URL *</label>
                      <input
                        type="url"
                        required
                        value={cardForm.logo}
                        onChange={(e) => setCardForm({ ...cardForm, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Campus Banner Image URL *</label>
                      <input
                        type="url"
                        required
                        value={cardForm.bannerImage}
                        onChange={(e) => setCardForm({ ...cardForm, bannerImage: e.target.value })}
                        placeholder="https://example.com/campus-cover.jpg"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                    {/* Facilities Chips */}
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Top Facilities Chips (Comma separated) *</label>
                      <input
                        type="text"
                        value={cardForm.facilitiesChips}
                        onChange={(e) => setCardForm({ ...cardForm, facilitiesChips: e.target.value })}
                        placeholder="Smart Classrooms, Robotics Lab, Swimming Pool, Transport, CCTV Surveillance"
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveStep('detail')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      <span>Proceed to Part 2: Detail Page Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────── */}
              {/* PART 2: FULL DETAIL PAGE INFORMATION                          */}
              {/* ────────────────────────────────────────────────────────────── */}
              {activeStep === 'detail' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">2</span>
                      <h2 className="text-lg font-black text-slate-900">Detail Page Information (All 12 Sections)</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Provide comprehensive information for Academic Stats, Fee Matrix, STEM Live Labs, Results, and Principal's message.
                    </p>
                  </div>

                  {/* Section A: Institutional Overview & Leadership */}
                  <div className="space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>1. Overview & Leadership</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="sm:col-span-3">
                        <label className="block text-slate-700 mb-1">About School / Vision Statement *</label>
                        <textarea
                          rows={3}
                          required
                          value={detailForm.description}
                          onChange={(e) => setDetailForm({ ...detailForm, description: e.target.value })}
                          className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Established Year</label>
                        <input
                          type="number"
                          value={detailForm.established}
                          onChange={(e) => setDetailForm({ ...detailForm, established: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Student Strength</label>
                        <input
                          type="number"
                          value={detailForm.studentStrength}
                          onChange={(e) => setDetailForm({ ...detailForm, studentStrength: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Official Helpline Email</label>
                        <input
                          type="email"
                          value={detailForm.email}
                          onChange={(e) => setDetailForm({ ...detailForm, email: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Principal Name</label>
                        <input
                          type="text"
                          value={detailForm.principalName}
                          onChange={(e) => setDetailForm({ ...detailForm, principalName: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 mb-1">From Principal's Desk (Quote / Message)</label>
                        <input
                          type="text"
                          value={detailForm.principalMessage}
                          onChange={(e) => setDetailForm({ ...detailForm, principalMessage: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: STEM Live Lab & Innovation Ecosystem */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Microscope className="w-4 h-4 text-emerald-600" />
                        <span>2. STEM Live Lab & Innovation Ecosystem ({detailForm.selectedLabs.length}/12 Selected)</span>
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Soft Light Compact Theme
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                      {[
                        'Science Experiential Lab',
                        'Composite Science Lab',
                        'Atal Tinkering Lab (ATL)',
                        'Robotics & IoT Lab',
                        'AI & Machine Learning Lab',
                        'AR / VR Immersive Pods',
                        'Language & Phonetics Lab',
                        'Astronomy & Space Observatory',
                        'Mathematics Activity Lab',
                        '3D Printing & CAD Studio',
                        'Bio-Tech & Hydroponics Unit',
                        'Coding & Cyber-Security Suite'
                      ].map((lab) => {
                        const isChecked = detailForm.selectedLabs.includes(lab);
                        return (
                          <label
                            key={lab}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isChecked
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            <span className="text-[11px] leading-tight">{lab}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleLabToggle(lab)}
                              className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 shrink-0"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section C: Fee Structure Breakdown */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <span>3. Comprehensive Fee Matrix</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
                      <div>
                        <label className="block text-slate-700 mb-1">Admission Fee (₹)</label>
                        <input
                          type="number"
                          value={detailForm.admissionFee}
                          onChange={(e) => setDetailForm({ ...detailForm, admissionFee: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Registration Fee (₹)</label>
                        <input
                          type="number"
                          value={detailForm.registrationFee}
                          onChange={(e) => setDetailForm({ ...detailForm, registrationFee: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Tuition Fee/Qtr (₹)</label>
                        <input
                          type="number"
                          value={detailForm.tuitionFeeQuarterly}
                          onChange={(e) => setDetailForm({ ...detailForm, tuitionFeeQuarterly: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Security Deposit (₹)</label>
                        <input
                          type="number"
                          value={detailForm.securityDeposit}
                          onChange={(e) => setDetailForm({ ...detailForm, securityDeposit: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Annual Logistics (₹)</label>
                        <input
                          type="number"
                          value={detailForm.annualLogisticsFee}
                          onChange={(e) => setDetailForm({ ...detailForm, annualLogisticsFee: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Development Fund (₹)</label>
                        <input
                          type="number"
                          value={detailForm.developmentFund}
                          onChange={(e) => setDetailForm({ ...detailForm, developmentFund: Number(e.target.value) })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section D: Academic Results & Board Achievers */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>4. Academic Results & Board Toppers</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                      <div>
                        <label className="block text-slate-700 mb-1">Board Pass Rate (%)</label>
                        <input
                          type="text"
                          value={detailForm.passRate}
                          onChange={(e) => setDetailForm({ ...detailForm, passRate: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-emerald-700"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Top High Score (%)</label>
                        <input
                          type="text"
                          value={detailForm.topScore}
                          onChange={(e) => setDetailForm({ ...detailForm, topScore: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">School Batch Average (%)</label>
                        <input
                          type="text"
                          value={detailForm.batchAverage}
                          onChange={(e) => setDetailForm({ ...detailForm, batchAverage: e.target.value })}
                          className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-blue-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold pt-2">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Class 12th Topper</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={detailForm.topper1Name}
                            onChange={(e) => setDetailForm({ ...detailForm, topper1Name: e.target.value })}
                            className="p-2 border rounded-xl bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Score %"
                            value={detailForm.topper1Score}
                            onChange={(e) => setDetailForm({ ...detailForm, topper1Score: e.target.value })}
                            className="p-2 border rounded-xl bg-white font-bold"
                          />
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Class 10th Topper</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={detailForm.topper2Name}
                            onChange={(e) => setDetailForm({ ...detailForm, topper2Name: e.target.value })}
                            className="p-2 border rounded-xl bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Score %"
                            value={detailForm.topper2Score}
                            onChange={(e) => setDetailForm({ ...detailForm, topper2Score: e.target.value })}
                            className="p-2 border rounded-xl bg-white font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveStep('card')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back to Card Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep('preview')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      <span>Preview Profile Before Submitting</span>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────── */}
              {/* PART 3: LIVE PREVIEW & FINAL PUBLISH                          */}
              {/* ────────────────────────────────────────────────────────────── */}
              {activeStep === 'preview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Summary Alert */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-black text-sm text-blue-950">Review School Profile (Live Card & Detail Preview)</h3>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Check how your school appears in search results and full profile views before final publishing.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSubmitting ? 'Publishing Profile...' : 'Save & Publish School Profile'}</span>
                    </button>
                  </div>

                  {/* Preview Card */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md flex flex-col md:flex-row gap-5 items-stretch relative">
                    <span className="absolute -top-3 right-6 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow">
                      Directory Card Preview
                    </span>

                    <div className="relative w-full md:w-48 h-36 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img
                        src={cardForm.bannerImage}
                        alt={cardForm.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center">
                        <img src={cardForm.logo} alt={cardForm.name} className="w-full h-full object-contain rounded-lg" />
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Lab</span>
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                              {cardForm.name || 'Your School Name'}
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium flex-wrap">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{cardForm.locality}, {cardForm.city}, {cardForm.state}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700">{cardForm.board}</span>
                              <span>•</span>
                              <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold border border-slate-200">
                                UDISE: {cardForm.udiseCode}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-black shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>4.9</span>
                            <span className="text-[10px] text-slate-400 font-normal">(1)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Fee</span>
                            <p className="font-black text-slate-900">{cardForm.monthlyFees}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Classes</span>
                            <p className="font-bold text-slate-800">{cardForm.classesOffered}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Student Ratio</span>
                            <p className="font-bold text-slate-800">{cardForm.studentFacultyRatio}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Admissions</span>
                            <span className="inline-block font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                              {cardForm.admissionStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px]">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>{detailForm.selectedLabs.length} STEM Labs</span>
                          </span>
                          {cardForm.facilitiesChips.split(',').slice(0, 3).map((f, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400 font-semibold">Listing ready for publication</span>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Apply / Enquire</span>
                          <span className="px-3.5 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold">View Profile →</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep('detail')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Edit Detail Page Info
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xl transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSubmitting ? 'Publishing...' : 'Confirm & Publish School Profile'}</span>
                    </button>
                  </div>

                </div>
              )}

            </form>
          </main>
        )}

      </div>
    </PageTransition>
  );
}
