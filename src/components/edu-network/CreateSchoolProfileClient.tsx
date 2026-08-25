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
  Trophy, GraduationCap, ArrowRight, Save, EyeOff, ShieldAlert,
  Activity, Radio, Compass, Stethoscope
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';

export default function CreateSchoolProfileClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'preview'>('step1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newSchoolId, setNewSchoolId] = useState('');

  // ── FORM STATE: ALL DETAIL PAGE FIELDS ────────────────────────────────────
  const [form, setForm] = useState({
    // Step 1: Card & General Info
    name: '',
    type: 'School' as const,
    udiseCode: '07010200389',
    board: 'CBSE' as const,
    affiliation: 'CBSE Affiliated Senior Secondary Institution',
    locality: 'Sector 62',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110001',
    address: 'Plot No. 12, Institutional Area, Phase II',
    monthlyFees: '₹12,500 / mo',
    monthlyFeesNum: 12500,
    classesOffered: 'Pre-K - 12th',
    studentFacultyRatio: '13:1',
    admissionStatus: 'Open for 2026-27' as const,
    logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=600&q=80',
    facilitiesChips: 'Smart Classrooms, Robotics Lab, Swimming Pool, Transport, CCTV Surveillance',

    // Step 2: Overview, Leadership & Academic Stats
    description: 'A premier educational ecosystem dedicated to experiential STEM inquiry, holistic K-12 academic excellence, and future-ready scientific leadership.',
    established: 1998,
    studentStrength: 2400,
    campusAcreage: '12 Acres Urban Campus',
    instructionLanguage: 'English (Bilingual Hindi Option)',
    academicSession: 'April to March',
    totalFacultyCount: 125,
    cityAvgFacultyCount: 25,
    email: 'admissions@institution.edu.in',
    phone: '+91 11 4987 6543 / +91 98765 43210',
    website: 'https://www.institution.edu.in',
    principalName: 'Dr. Sunita Kapoor',
    principalDesignation: 'Principal / Academic Director (Ph.D, M.Ed)',
    principalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    principalMessage: 'We inspire holistic global education by instilling critical inquiries, experiential lab prototypes, and empathy in every learner.',

    // Step 3: Admission Dates & Eligibility Criteria
    admissionFormStartDate: '01 Nov 2025',
    admissionFormEndDate: '31 Jan 2026',
    entranceTestDate: '15 Feb 2026',
    meritListDate: '28 Feb 2026',
    sessionStartDate: '01 Apr 2026',
    minAgeNursery: '3+ Years as on 31st March',
    minAgeClass1: '6+ Years as on 31st March',
    additionalAdmissionNotes: 'Mandatory birth certificate, transfer certificate from previous recognized school, and medical immunization record required at registration.',
    requiredDocs: [
      'Transfer Certificate (TC)',
      'Birth Certificate',
      'Photograph - Child',
      'Photograph - Parents/Guardian',
      'Marksheet / Previous Report Card',
      'Medical Fitness Certificate',
      'Character Certificate',
      'Valid Passport & Visa (if applicable)',
      'Aadhar Card - Child',
      'Achievement & Sports Certificates',
      'Immunization & Vaccination Card',
      'Pancard - Parents'
    ],

    // Step 4: Comprehensive Fee Matrix Breakdown (Class-Wise)
    admissionFee: 45000,
    registrationFee: 1000,
    tuitionQuarterly: 37500,
    securityDeposit: 15000,
    annualLogisticsFee: 18000,
    developmentFund: 12000,

    // Step 5: STEM Live Labs & 9 Facilities Matrix Categories
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
    ],
    classroomFacilities: ['Smart Classrooms', 'AC Classrooms', 'Wi-Fi Campus', 'Audio-Visual Projectors'],
    infrastructureFacilities: ['Central Library (15,000+ Books)', 'Auditorium (800 Seater)', 'Power Backup (100%)', 'RO Drinking Water', 'Cafeteria'],
    safetyFacilities: ['24x7 CCTV Surveillance', 'GPS Bus Fleet Tracking', 'Female Attendant in Buses', 'Full-time Doctor & Nurse', 'Fire Safety ISO Certified'],
    sportsFacilities: ['Olympic Size Swimming Pool', 'Cricket Ground & Nets', 'Football Turf', 'Basketball Courts', 'Indoor Badminton Court', 'Table Tennis Arena'],
    disabledFacilities: ['Wheelchair Ramps on All Floors', 'Disabled Restrooms', 'Elevators / Lifts', 'Braille Signage'],

    // Step 6: Academic Results & Board Toppers
    passRate: '100%',
    topScore: '99.4%',
    batchAverage: '89.2%',
    topper12Name: 'Ananya Sharma',
    topper12Score: '99.4%',
    topper12Stream: 'Science (PCM + CS) • Rank 1',
    topper12Photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    topper10Name: 'Diya Verma',
    topper10Score: '99.2%',
    topper10Stream: 'All Subjects (CBSE 10th Topper)',
    topper10Photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    resultPosterUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=600&q=80',

    // Media & Virtual Tour
    virtualTourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.604473852084!2d77.1953247!3d28.5516047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce27038e2d469%3A0x89e248b6c4b22c07!2sSri%20Aurobindo%20Marg!5e0!3m2!1sen!2sin!4v1700000000000',
    galleryPhotos: [
      { title: 'Medical Diagnostics Room', category: 'Medical / Health', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' },
      { title: 'Smart Interactive Classroom', category: 'Classroom', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80' },
      { title: 'Central Research Library', category: 'Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80' },
      { title: 'Robotics & AI Innovation Studio', category: 'STEM Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
      { title: 'Olympic Sports Arena', category: 'Sports', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' }
    ]
  });

  const handleLabToggle = (lab: string) => {
    setForm(prev => ({
      ...prev,
      selectedLabs: prev.selectedLabs.includes(lab)
        ? prev.selectedLabs.filter(l => l !== lab)
        : [...prev.selectedLabs, lab]
    }));
  };

  const handleDocToggle = (doc: string) => {
    setForm(prev => ({
      ...prev,
      requiredDocs: prev.requiredDocs.includes(doc)
        ? prev.requiredDocs.filter(d => d !== doc)
        : [...prev.requiredDocs, doc]
    }));
  };

  const handleFacilityToggle = (categoryKey: 'classroomFacilities' | 'infrastructureFacilities' | 'safetyFacilities' | 'sportsFacilities' | 'disabledFacilities', item: string) => {
    setForm(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] as string[]).includes(item)
        ? (prev[categoryKey] as string[]).filter(i => i !== item)
        : [...(prev[categoryKey] as string[]), item]
    }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-institution';
    const finalId = `org-${slug}-${Date.now().toString().slice(-4)}`;

    const newOrg: OrganizationItem = {
      id: finalId,
      name: form.name,
      type: form.type,
      affiliation: form.affiliation,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      address: form.address,
      locality: form.locality,
      email: form.email,
      phone: form.phone,
      website: form.website,
      verified: true,
      rating: 4.9,
      reviews: 1,
      stemLabsCount: form.selectedLabs.length,
      studentStrength: form.studentStrength,
      logo: form.logo,
      bannerImage: form.bannerImage,
      description: form.description,
      openJobsCount: 2,
      established: form.established,
      facilities: form.facilitiesChips.split(',').map(s => s.trim()),
      classesOffered: form.classesOffered,
      monthlyFees: form.monthlyFees,
      monthlyFeesNum: form.monthlyFeesNum,
      board: form.board,
      studentFacultyRatio: form.studentFacultyRatio,
      admissionStatus: form.admissionStatus,
      udiseCode: form.udiseCode,
      isFeatured: true,
    };

    ALL_ORGANIZATIONS.unshift(newOrg);
    setNewSchoolId(finalId);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP BREADCRUMB ────────────────────────────────────────────────── */}
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

        {/* ── BANNER HEADER ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#001f3f] via-[#002b4e] to-slate-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Institutional Full-Profile Onboarding Wizard
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Create Verified School &amp; Institution Profile
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Configure every detail page field: UDISE+ code, 12 STEM Live Labs, 9-category Facilities Matrix, Fee Breakdown, 12 Required Documents, Results &amp; Toppers, and Virtual Tour.
                </p>
              </div>

              {/* Steps Progress Tabs */}
              <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/20 overflow-x-auto scrollbar-none shrink-0">
                {[
                  { id: 'step1', label: '1. Card Info', icon: Building2 },
                  { id: 'step2', label: '2. Overview & Leader', icon: UserCheck },
                  { id: 'step3', label: '3. Admissions & Docs', icon: Calendar },
                  { id: 'step4', label: '4. Fee Matrix', icon: Wallet },
                  { id: 'step5', label: '5. STEM Labs & Facilities', icon: Microscope },
                  { id: 'step6', label: '6. Results & Gallery', icon: Trophy },
                  { id: 'preview', label: '7. Live Preview', icon: Eye }
                ].map((step) => {
                  const Icon = step.icon;
                  const isActive = activeTab === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveTab(step.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? 'bg-white text-blue-950 font-black shadow-md'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── SUCCESS NOTICE ────────────────────────────────────────────────── */}
        {submitSuccess && (
          <div className="max-w-4xl mx-auto px-4 mt-8">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Institution Profile Published!</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                <strong>{form.name}</strong> is now live with full UniApply sections, verified UDISE code <code>{form.udiseCode}</code>, STEM Live Lab matrix, and year-wise academic toppers.
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

        {/* ── FORM CONTENT ──────────────────────────────────────────────────── */}
        {!submitSuccess && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleFinalSubmit} className="space-y-8">
              
              {/* STEP 1: CARD & BASIC LISTING INFO */}
              {activeTab === 'step1' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>Step 1: Card &amp; Basic Listing Information</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Appears on directory search cards and top hero banner.</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
                      Step 1 of 6
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Official Institution Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. AIIMS New Delhi / K.R. Mangalam Global School"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Institution Type *</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                      >
                        <option value="School">K-12 School</option>
                        <option value="University">University</option>
                        <option value="Research Institute">Medical / Research Institute</option>
                        <option value="College">Degree College</option>
                        <option value="Atal Tinkering Lab">Atal Tinkering Lab</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">UDISE+ / Affiliation Code *</label>
                      <input
                        type="text"
                        required
                        value={form.udiseCode}
                        onChange={(e) => setForm({ ...form, udiseCode: e.target.value })}
                        placeholder="07010200301"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-mono font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Board / Affiliation Authority *</label>
                      <select
                        value={form.board}
                        onChange={(e) => setForm({ ...form, board: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-slate-900"
                      >
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / ISC Board</option>
                        <option value="IB">IB (International Baccalaureate)</option>
                        <option value="UGC/AICTE">UGC / AICTE / Medical Council</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Locality / Sector *</label>
                      <input
                        type="text"
                        required
                        value={form.locality}
                        onChange={(e) => setForm({ ...form, locality: e.target.value })}
                        placeholder="e.g. Sri Aurobindo Marg / Sector 62"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Delhi NCR / Mumbai / Bengaluru"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        placeholder="Delhi / Maharashtra / Karnataka"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        placeholder="110029"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Full Physical Campus Address *</label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Monthly Fee (Display Text) *</label>
                      <input
                        type="text"
                        required
                        value={form.monthlyFees}
                        onChange={(e) => setForm({ ...form, monthlyFees: e.target.value })}
                        placeholder="₹12,000 / mo"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Classes / Degrees Offered *</label>
                      <input
                        type="text"
                        required
                        value={form.classesOffered}
                        onChange={(e) => setForm({ ...form, classesOffered: e.target.value })}
                        placeholder="Pre-K - 12th / Undergraduate - Ph.D."
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Student-Faculty Ratio *</label>
                      <input
                        type="text"
                        required
                        value={form.studentFacultyRatio}
                        onChange={(e) => setForm({ ...form, studentFacultyRatio: e.target.value })}
                        placeholder="10:1 / 13:1"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Admission Status *</label>
                      <select
                        value={form.admissionStatus}
                        onChange={(e) => setForm({ ...form, admissionStatus: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold text-emerald-700"
                      >
                        <option value="Open for 2026-27">Open for 2026-27</option>
                        <option value="On Going">On Going</option>
                        <option value="Closing Soon">Closing Soon</option>
                        <option value="Merit Based">Merit Based</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Logo URL *</label>
                      <input
                        type="url"
                        required
                        value={form.logo}
                        onChange={(e) => setForm({ ...form, logo: e.target.value })}
                        placeholder="https://example.com/logo.jpg"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Campus Cover Banner URL *</label>
                      <input
                        type="url"
                        required
                        value={form.bannerImage}
                        onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step2')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Overview &amp; Leadership →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: OVERVIEW, LEADERSHIP & ACADEMIC STATS */}
              {activeTab === 'step2' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-indigo-600" />
                        <span>Step 2: Institutional Overview, Principal &amp; Academic Stats</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 2 (Stats), Section 4 (Academic Stats), and Leadership quotes.</p>
                    </div>
                    <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-200">
                      Step 2 of 6
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">About Institution / Vision &amp; Mission *</label>
                      <textarea
                        rows={3}
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-medium text-slate-900 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Established Year</label>
                      <input
                        type="number"
                        value={form.established}
                        onChange={(e) => setForm({ ...form, established: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Total Student Strength</label>
                      <input
                        type="number"
                        value={form.studentStrength}
                        onChange={(e) => setForm({ ...form, studentStrength: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Campus Acreage / Infrastructure Area</label>
                      <input
                        type="text"
                        value={form.campusAcreage}
                        onChange={(e) => setForm({ ...form, campusAcreage: e.target.value })}
                        placeholder="e.g. 15 Acres Urban Campus"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Language of Instruction</label>
                      <input
                        type="text"
                        value={form.instructionLanguage}
                        onChange={(e) => setForm({ ...form, instructionLanguage: e.target.value })}
                        placeholder="English / Bilingual"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Academic Session Cycle</label>
                      <input
                        type="text"
                        value={form.academicSession}
                        onChange={(e) => setForm({ ...form, academicSession: e.target.value })}
                        placeholder="April to March"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Total Faculty Count (School vs City Avg)</label>
                      <input
                        type="number"
                        value={form.totalFacultyCount}
                        onChange={(e) => setForm({ ...form, totalFacultyCount: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal / Director Name</label>
                      <input
                        type="text"
                        value={form.principalName}
                        onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                        placeholder="Dr. Sunita Kapoor"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal Designation &amp; Degrees</label>
                      <input
                        type="text"
                        value={form.principalDesignation}
                        onChange={(e) => setForm({ ...form, principalDesignation: e.target.value })}
                        placeholder="Principal (Ph.D, M.Ed)"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal Photo URL</label>
                      <input
                        type="url"
                        value={form.principalPhoto}
                        onChange={(e) => setForm({ ...form, principalPhoto: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">From Principal's Desk (Quote Message) *</label>
                      <textarea
                        rows={2}
                        value={form.principalMessage}
                        onChange={(e) => setForm({ ...form, principalMessage: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Helpline Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step1')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step3')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Admissions &amp; Required Docs →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: ADMISSION DATES & 12 REQUIRED DOCS */}
              {activeTab === 'step3' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <span>Step 3: Admission Dates &amp; 12 Mandatory Documents</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 5 (Admission Dates) and Section 6 (Criteria &amp; Eligibility).</p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                      Step 3 of 6
                    </span>
                  </div>

                  {/* Admission Dates Timeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-700 mb-1">Form Opens</label>
                      <input
                        type="text"
                        value={form.admissionFormStartDate}
                        onChange={(e) => setForm({ ...form, admissionFormStartDate: e.target.value })}
                        className="w-full p-2 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Form Closes</label>
                      <input
                        type="text"
                        value={form.admissionFormEndDate}
                        onChange={(e) => setForm({ ...form, admissionFormEndDate: e.target.value })}
                        className="w-full p-2 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Entrance / Interaction</label>
                      <input
                        type="text"
                        value={form.entranceTestDate}
                        onChange={(e) => setForm({ ...form, entranceTestDate: e.target.value })}
                        className="w-full p-2 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Merit List</label>
                      <input
                        type="text"
                        value={form.meritListDate}
                        onChange={(e) => setForm({ ...form, meritListDate: e.target.value })}
                        className="w-full p-2 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Session Begins</label>
                      <input
                        type="text"
                        value={form.sessionStartDate}
                        onChange={(e) => setForm({ ...form, sessionStartDate: e.target.value })}
                        className="w-full p-2 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* 12 Verified Required Documents Checklist */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                        12 Verified Required Documents Checklist ({form.requiredDocs.length}/12 Enabled)
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">UniApply Verified Standard</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                      {[
                        'Transfer Certificate (TC)',
                        'Birth Certificate',
                        'Photograph - Child',
                        'Photograph - Parents/Guardian',
                        'Marksheet / Previous Report Card',
                        'Medical Fitness Certificate',
                        'Character Certificate',
                        'Valid Passport & Visa (if applicable)',
                        'Aadhar Card - Child',
                        'Achievement & Sports Certificates',
                        'Immunization & Vaccination Card',
                        'Pancard - Parents'
                      ].map((doc) => {
                        const isChecked = form.requiredDocs.includes(doc);
                        return (
                          <label
                            key={doc}
                            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="text-[11px]">{doc}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleDocToggle(doc)}
                              className="w-3.5 h-3.5 accent-emerald-600"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age Criteria & Additional Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-slate-700 mb-1">Age Eligibility Criteria (Nursery &amp; Grade 1)</label>
                      <input
                        type="text"
                        value={form.minAgeNursery}
                        onChange={(e) => setForm({ ...form, minAgeNursery: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Additional Admission Notes</label>
                      <input
                        type="text"
                        value={form.additionalAdmissionNotes}
                        onChange={(e) => setForm({ ...form, additionalAdmissionNotes: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step2')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step4')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Fee Matrix Breakdown →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: COMPREHENSIVE FEE MATRIX */}
              {activeTab === 'step4' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-amber-600" />
                        <span>Step 4: Comprehensive 6-Component Fee Matrix</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 3 (Class-Wise Interactive Fee Table).</p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                      Step 4 of 6
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Admission Fee (One-time)</span>
                      <input
                        type="number"
                        value={form.admissionFee}
                        onChange={(e) => setForm({ ...form, admissionFee: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Registration Fee (One-time)</span>
                      <input
                        type="number"
                        value={form.registrationFee}
                        onChange={(e) => setForm({ ...form, registrationFee: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Quarterly Tuition (x4)</span>
                      <input
                        type="number"
                        value={form.tuitionQuarterly}
                        onChange={(e) => setForm({ ...form, tuitionQuarterly: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Security Deposit (Refundable)</span>
                      <input
                        type="number"
                        value={form.securityDeposit}
                        onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Annual Academic Logistics</span>
                      <input
                        type="number"
                        value={form.annualLogisticsFee}
                        onChange={(e) => setForm({ ...form, annualLogisticsFee: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Development Fund</span>
                      <input
                        type="number"
                        value={form.developmentFund}
                        onChange={(e) => setForm({ ...form, developmentFund: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Calculated First Year Total Cost:</span>
                      <p className="text-[11px] text-blue-700 mt-0.5">Sum of one-time charges + 4 quarters tuition + annual development fund</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-blue-950">
                        ₹{(form.admissionFee + form.registrationFee + (form.tuitionQuarterly * 4) + form.securityDeposit + form.annualLogisticsFee + form.developmentFund).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step3')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step5')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: STEM Labs &amp; Facilities →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: STEM LIVE LABS & FACILITIES MATRIX */}
              {activeTab === 'step5' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-emerald-600" />
                        <span>Step 5: STEM Live Labs &amp; Facilities Matrix Breakdown</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Special STEM Live Lab section and Section 9 (Facilities Matrix).</p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                      Step 5 of 6
                    </span>
                  </div>

                  {/* 12 Specialized STEM Live Labs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                        STEM Live Lab Ecosystem ({form.selectedLabs.length}/12 Active)
                      </label>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
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
                        const isChecked = form.selectedLabs.includes(lab);
                        return (
                          <label
                            key={lab}
                            className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="text-[11px] leading-tight">{lab}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleLabToggle(lab)}
                              className="w-3.5 h-3.5 accent-emerald-600"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Facilities Matrix Categories */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                      UniApply 9-Category Facilities Checklist
                    </label>

                    {/* Classroom & Safety */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Classroom Facilities</span>
                        <div className="space-y-1.5">
                          {['Smart Classrooms', 'AC Classrooms', 'Wi-Fi Campus', 'Audio-Visual Projectors'].map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.classroomFacilities.includes(f)}
                                onChange={() => handleFacilityToggle('classroomFacilities', f)}
                                className="w-3.5 h-3.5 accent-blue-600"
                              />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Safety &amp; Security</span>
                        <div className="space-y-1.5">
                          {['24x7 CCTV Surveillance', 'GPS Bus Fleet Tracking', 'Female Attendant in Buses', 'Full-time Doctor & Nurse', 'Fire Safety ISO Certified'].map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.safetyFacilities.includes(f)}
                                onChange={() => handleFacilityToggle('safetyFacilities', f)}
                                className="w-3.5 h-3.5 accent-blue-600"
                              />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Sports &amp; Fitness</span>
                        <div className="space-y-1.5">
                          {['Olympic Size Swimming Pool', 'Cricket Ground & Nets', 'Football Turf', 'Basketball Courts', 'Indoor Badminton Court', 'Table Tennis Arena'].map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.sportsFacilities.includes(f)}
                                onChange={() => handleFacilityToggle('sportsFacilities', f)}
                                className="w-3.5 h-3.5 accent-blue-600"
                              />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800">Disabled Friendly Infrastructure</span>
                        <div className="space-y-1.5">
                          {['Wheelchair Ramps on All Floors', 'Disabled Restrooms', 'Elevators / Lifts', 'Braille Signage'].map((f) => (
                            <label key={f} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.disabledFacilities.includes(f)}
                                onChange={() => handleFacilityToggle('disabledFacilities', f)}
                                className="w-3.5 h-3.5 accent-blue-600"
                              />
                              <span>{f}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step4')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step6')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Results, Toppers &amp; Virtual Tour →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: ACADEMIC RESULTS, TOPPERS & VIRTUAL TOUR */}
              {activeTab === 'step6' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span>Step 6: Board Results, Toppers, Gallery &amp; Virtual Tour</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 7 (Results &amp; Toppers), Section 11 (Gallery), and Section 12 (Video Tours).</p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-200">
                      Step 6 of 6
                    </span>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-700 mb-1">Board Pass Rate (%) *</label>
                      <input
                        type="text"
                        value={form.passRate}
                        onChange={(e) => setForm({ ...form, passRate: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Top High Score (%) *</label>
                      <input
                        type="text"
                        value={form.topScore}
                        onChange={(e) => setForm({ ...form, topScore: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Batch Average (%) *</label>
                      <input
                        type="text"
                        value={form.batchAverage}
                        onChange={(e) => setForm({ ...form, batchAverage: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-blue-700"
                      />
                    </div>
                  </div>

                  {/* Class 12 & Class 10 Toppers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <span className="font-bold text-slate-900 text-sm">Class 12th Board Topper</span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={form.topper12Name}
                          onChange={(e) => setForm({ ...form, topper12Name: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Score %"
                            value={form.topper12Score}
                            onChange={(e) => setForm({ ...form, topper12Score: e.target.value })}
                            className="p-2 border rounded-xl bg-white font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Stream / Rank"
                            value={form.topper12Stream}
                            onChange={(e) => setForm({ ...form, topper12Stream: e.target.value })}
                            className="p-2 border rounded-xl bg-white"
                          />
                        </div>
                        <input
                          type="url"
                          placeholder="Student Photo URL"
                          value={form.topper12Photo}
                          onChange={(e) => setForm({ ...form, topper12Photo: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <span className="font-bold text-slate-900 text-sm">Class 10th Board Topper</span>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={form.topper10Name}
                          onChange={(e) => setForm({ ...form, topper10Name: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white font-medium"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Score %"
                            value={form.topper10Score}
                            onChange={(e) => setForm({ ...form, topper10Score: e.target.value })}
                            className="p-2 border rounded-xl bg-white font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Stream / Rank"
                            value={form.topper10Stream}
                            onChange={(e) => setForm({ ...form, topper10Stream: e.target.value })}
                            className="p-2 border rounded-xl bg-white"
                          />
                        </div>
                        <input
                          type="url"
                          placeholder="Student Photo URL"
                          value={form.topper10Photo}
                          onChange={(e) => setForm({ ...form, topper10Photo: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Result Banner Poster & Virtual Tour */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
                    <div>
                      <label className="block text-slate-700 mb-1">Result Poster / Banner Image URL</label>
                      <input
                        type="url"
                        value={form.resultPosterUrl}
                        onChange={(e) => setForm({ ...form, resultPosterUrl: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">360° Virtual Video Tour URL (YouTube Embed)</label>
                      <input
                        type="url"
                        value={form.virtualTourEmbedUrl}
                        onChange={(e) => setForm({ ...form, virtualTourEmbedUrl: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step5')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Review Live Preview &amp; Publish →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: LIVE PREVIEW & FINAL PUBLISH */}
              {activeTab === 'preview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-black text-sm text-blue-950">Review Institutional Profile Before Publishing</h3>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Verified UDISE <code>{form.udiseCode}</code>, 12 STEM Live Labs, 9-category facilities matrix, and board toppers.
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

                  {/* Directory Card Preview */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md flex flex-col md:flex-row gap-5 items-stretch relative">
                    <span className="absolute -top-3 right-6 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow">
                      Directory Card Preview
                    </span>

                    <div className="relative w-full md:w-48 h-36 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img
                        src={form.bannerImage}
                        alt={form.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center">
                        <img src={form.logo} alt={form.name} className="w-full h-full object-contain rounded-lg" />
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
                              {form.name || 'Institution Name'}
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium flex-wrap">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{form.locality}, {form.city}, {form.state}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-700">{form.board}</span>
                              <span>•</span>
                              <span className="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold border border-slate-200">
                                UDISE: {form.udiseCode}
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
                            <p className="font-black text-slate-900">{form.monthlyFees}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Classes</span>
                            <p className="font-bold text-slate-800">{form.classesOffered}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Student Ratio</span>
                            <p className="font-bold text-slate-800">{form.studentFacultyRatio}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Admissions</span>
                            <span className="inline-block font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                              {form.admissionStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px]">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>{form.selectedLabs.length} STEM Labs</span>
                          </span>
                          {form.facilitiesChips.split(',').slice(0, 3).map((f, idx) => (
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
                      onClick={() => setActiveTab('step6')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Edit Results &amp; Media
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
