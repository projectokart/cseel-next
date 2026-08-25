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
  Activity, Radio, Compass, Stethoscope, Layers, Bus, Compass as MapIcon
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';

export default function CreateSchoolProfileClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'step7' | 'step8' | 'step9' | 'preview'
  >('step1');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newSchoolId, setNewSchoolId] = useState('');

  // ── RESULT DISPLAY MODE: 'banner' (Official Poster) vs 'toppers' (Individual Cards) ──
  const [resultMode, setResultMode] = useState<'both' | 'banner' | 'toppers'>('both');
  const [selectedResultYear, setSelectedResultYear] = useState('2025-26');

  // ── FORM STATE: ALL 10 SECTIONS ───────────────────────────────────────────
  const [form, setForm] = useState({
    // Step 1: Card & Basic Info
    name: '',
    type: 'School' as const,
    udiseCode: '07010200389',
    board: 'CBSE' as const,
    affiliation: 'CBSE Affiliated Senior Secondary Institution',
    monthlyFees: '₹12,500 / mo',
    monthlyFeesNum: 12500,
    classesOffered: 'Pre-K - 12th',
    studentFacultyRatio: '13:1',
    admissionStatus: 'Open for 2026-27' as const,
    logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=600&q=80',
    facilitiesChips: 'Smart Classrooms, Robotics Lab, Swimming Pool, Transport, CCTV Surveillance',

    // Step 2: Overview & Leadership
    description: 'A premier educational ecosystem dedicated to experiential STEM inquiry, holistic K-12 academic excellence, and future-ready scientific leadership.',
    established: 1998,
    studentStrength: 2400,
    campusAcreage: '12 Acres Urban Campus',
    instructionLanguage: 'English (Bilingual Hindi Option)',
    academicSession: 'April to March',
    totalFacultyCount: 125,
    cityAvgFacultyCount: 25,
    principalName: 'Dr. Sunita Kapoor',
    principalDesignation: 'Principal / Academic Director (Ph.D, M.Ed)',
    principalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    principalMessage: 'We inspire holistic global education by instilling critical inquiries, experiential lab prototypes, and empathy in every learner.',

    // Step 3: Admissions & 12 Required Documents
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

    // Step 4: Comprehensive 6-Component Fee Matrix
    admissionFee: 45000,
    registrationFee: 1000,
    tuitionQuarterly: 37500,
    securityDeposit: 15000,
    annualLogisticsFee: 18000,
    developmentFund: 12000,

    // Step 5: STEM Live Labs (12 Specialized Labs)
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

    // Step 6: Facilities Matrix (9 Categories)
    classroomFacilities: ['Smart Classrooms', 'AC Classrooms', 'Wi-Fi Campus', 'Audio-Visual Projectors'],
    boardingFacilities: ['Day School', 'Cafeteria / Healthy Meal Plan'],
    infrastructureFacilities: ['Central Library (15,000+ Books)', 'Auditorium (800 Seater)', 'Power Backup (100%)', 'RO Drinking Water Plant'],
    safetyFacilities: ['24x7 CCTV Surveillance', 'GPS Bus Fleet Tracking', 'Female Attendant in Buses', 'Full-time Doctor & Nurse', 'Fire Safety ISO Certified'],
    advancedFacilities: ['Robotic STEM Lab', 'Virtual Reality Pods', 'Solar Powered Green Campus'],
    extracurricularFacilities: ['Music & Classical Dance Studio', 'Drama & Theater Club', 'Art & Craft Studio', 'Debate Society', 'Yoga & Meditation Zone'],
    sportsFacilities: ['Olympic Size Swimming Pool', 'Cricket Ground & Nets', 'Football Turf', 'Basketball Courts', 'Indoor Badminton Court', 'Table Tennis Arena'],
    labFacilities: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer Science Lab', 'Math Lab', 'Language & Phonetics Lab'],
    disabledFacilities: ['Wheelchair Ramps on All Floors', 'Disabled Restrooms', 'Elevators / Lifts', 'Braille Signage'],

    // Step 7: Academic Results & Year-wise Banners
    passRate: '100%',
    topScore: '99.4%',
    batchAverage: '89.2%',
    // Option A: Manual Topper Cards
    topper12Name: 'Ananya Sharma',
    topper12Score: '99.4%',
    topper12Stream: 'Science (PCM + CS) • Rank 1',
    topper12Photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    topper10Name: 'Diya Verma',
    topper10Score: '99.2%',
    topper10Stream: 'All Subjects (CBSE 10th Topper)',
    topper10Photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    // Option B: Official Result Graphic Banners (Year-wise)
    banner12th_2026: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=600&q=80',
    banner10th_2026: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&h=600&q=80',
    banner12th_2025: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&h=600&q=80',
    banner10th_2025: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&h=600&q=80',

    // Step 8: Gallery & Virtual Video Tour
    virtualTourEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    galleryPhotos: [
      { title: 'Interactive Science Experiential Lab', category: 'STEM Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
      { title: 'Central Research & Digital Library', category: 'Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80' },
      { title: 'Olympic Sports Arena & Turf', category: 'Sports', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
      { title: 'Smart Interactive Classroom', category: 'Classroom', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80' },
      { title: 'Campus Medical & Wellness Center', category: 'Medical', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' }
    ],

    // Step 9: Address, Location & Google Maps
    locality: 'Sri Aurobindo Marg',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110029',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    phone: '+91 11 4987 6543 / +91 98765 43210',
    email: 'admissions@institution.edu.in',
    website: 'https://www.institution.edu.in',
    transportRoutes: 'AC Bus Fleet covering 45+ routes across Delhi NCR with GPS Tracking & Speed Governors',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.604473852084!2d77.1953247!3d28.5516047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce27038e2d469%3A0x89e248b6c4b22c07!2sSri%20Aurobindo%20Marg!5e0!3m2!1sen!2sin!4v1700000000000',
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

  const handleFacilityToggle = (
    categoryKey:
      | 'classroomFacilities'
      | 'boardingFacilities'
      | 'infrastructureFacilities'
      | 'safetyFacilities'
      | 'advancedFacilities'
      | 'extracurricularFacilities'
      | 'sportsFacilities'
      | 'labFacilities'
      | 'disabledFacilities',
    item: string
  ) => {
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

  const stepsList = [
    { id: 'step1', label: '1. Card Info', icon: Building2 },
    { id: 'step2', label: '2. Overview & Leader', icon: UserCheck },
    { id: 'step3', label: '3. Admissions & Docs', icon: Calendar },
    { id: 'step4', label: '4. Fee Matrix', icon: Wallet },
    { id: 'step5', label: '5. STEM Labs', icon: Microscope },
    { id: 'step6', label: '6. Facilities Matrix', icon: Layers },
    { id: 'step7', label: '7. Results & Banners', icon: Trophy },
    { id: 'step8', label: '8. Gallery & Video', icon: Camera },
    { id: 'step9', label: '9. Address & Map', icon: MapPin },
    { id: 'preview', label: '10. Live Preview', icon: Eye }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP BREADCRUMB ────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
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

        {/* ── BANNER HEADER & TABS ──────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#001f3f] via-[#002b4e] to-slate-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 10-Step Full Detail Profile Onboarding
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Create Verified School &amp; Institution Profile
                </h1>
              </div>

              <div className="text-xs text-slate-300 font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 shrink-0">
                <span>Active Step: </span>
                <strong className="text-white font-black">{stepsList.find(s => s.id === activeTab)?.label}</strong>
              </div>
            </div>

            {/* Horizontal Step Pills Bar */}
            <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/15 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
              {stepsList.map((step) => {
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

        {/* ── SUCCESS NOTICE ────────────────────────────────────────────────── */}
        {submitSuccess && (
          <div className="max-w-4xl mx-auto px-4 mt-8">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">School Profile Published!</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                <strong>{form.name}</strong> is now live with all 10 UniApply sections, verified UDISE code <code>{form.udiseCode}</code>, STEM Live Lab matrix, result banners, and map coordinates.
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

        {/* ── FORM BODY ─────────────────────────────────────────────────────── */}
        {!submitSuccess && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleFinalSubmit} className="space-y-8">

              {/* STEP 1: CARD & BASIC INFO */}
              {activeTab === 'step1' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>Step 1: Card &amp; Basic Listing Information</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Appears on directory listing search cards and hero title.</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
                      Step 1 of 10
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
                        placeholder="e.g. HOCL School / AIIMS New Delhi / K.R. Mangalam Global School"
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
                        placeholder="07010200389"
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
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Top Facility Badges (Comma Separated)</label>
                      <input
                        type="text"
                        value={form.facilitiesChips}
                        onChange={(e) => setForm({ ...form, facilitiesChips: e.target.value })}
                        placeholder="Smart Classrooms, Robotics Lab, Swimming Pool, Transport, CCTV Surveillance"
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
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

              {/* STEP 2: OVERVIEW & LEADERSHIP */}
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
                      Step 2 of 10
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
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Total Student Strength</label>
                      <input
                        type="number"
                        value={form.studentStrength}
                        onChange={(e) => setForm({ ...form, studentStrength: Number(e.target.value) })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Campus Acreage</label>
                      <input
                        type="text"
                        value={form.campusAcreage}
                        onChange={(e) => setForm({ ...form, campusAcreage: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Language of Instruction</label>
                      <input
                        type="text"
                        value={form.instructionLanguage}
                        onChange={(e) => setForm({ ...form, instructionLanguage: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Academic Session Cycle</label>
                      <input
                        type="text"
                        value={form.academicSession}
                        onChange={(e) => setForm({ ...form, academicSession: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Total Teaching Faculty</label>
                      <input
                        type="number"
                        value={form.totalFacultyCount}
                        onChange={(e) => setForm({ ...form, totalFacultyCount: Number(e.target.value) })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal / Director Name</label>
                      <input
                        type="text"
                        value={form.principalName}
                        onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal Designation &amp; Degrees</label>
                      <input
                        type="text"
                        value={form.principalDesignation}
                        onChange={(e) => setForm({ ...form, principalDesignation: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Principal Photo URL</label>
                      <input
                        type="url"
                        value={form.principalPhoto}
                        onChange={(e) => setForm({ ...form, principalPhoto: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">From Principal's Desk (Quote Message) *</label>
                      <textarea
                        rows={2}
                        value={form.principalMessage}
                        onChange={(e) => setForm({ ...form, principalMessage: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 resize-none"
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

              {/* STEP 3: ADMISSIONS & 12 REQUIRED DOCS */}
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
                      Step 3 of 10
                    </span>
                  </div>

                  {/* Admission Dates */}
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
                      <label className="block text-slate-700 mb-1">Entrance Test</label>
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

                  {/* 12 Required Documents Checklist */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                      12 Verified Required Documents Checklist ({form.requiredDocs.length}/12 Enabled)
                    </label>

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

              {/* STEP 4: FEE MATRIX */}
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
                      Step 4 of 10
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Admission Fee</span>
                      <input
                        type="number"
                        value={form.admissionFee}
                        onChange={(e) => setForm({ ...form, admissionFee: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Registration Fee</span>
                      <input
                        type="number"
                        value={form.registrationFee}
                        onChange={(e) => setForm({ ...form, registrationFee: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Tuition Quarterly</span>
                      <input
                        type="number"
                        value={form.tuitionQuarterly}
                        onChange={(e) => setForm({ ...form, tuitionQuarterly: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Security Deposit</span>
                      <input
                        type="number"
                        value={form.securityDeposit}
                        onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border rounded-xl bg-white font-black text-slate-900"
                      />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Annual Logistics</span>
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
                      <span>Next: STEM Live Labs →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: STEM LIVE LABS */}
              {activeTab === 'step5' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Microscope className="w-5 h-5 text-emerald-600" />
                        <span>Step 5: STEM Live Lab Ecosystem (12 Specialized Labs)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Select the verified laboratories active on your campus.</p>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200">
                      Step 5 of 10
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
                      <span>Next: Facilities Matrix (9 Categories) →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: FACILITIES MATRIX (9 CATEGORIES) */}
              {activeTab === 'step6' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-purple-600" />
                        <span>Step 6: UniApply 9-Category Facilities Matrix</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 9 (Facilities Matrix Checklist).</p>
                    </div>
                    <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full border border-purple-200">
                      Step 6 of 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {/* Classroom */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">1. Classroom Facilities</span>
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

                    {/* Boarding */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">2. Boarding / Meals</span>
                      <div className="space-y-1.5">
                        {['Day School', 'Day Boarding', 'Full Hostel', 'Cafeteria / Healthy Meal Plan'].map((f) => (
                          <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.boardingFacilities.includes(f)}
                              onChange={() => handleFacilityToggle('boardingFacilities', f)}
                              className="w-3.5 h-3.5 accent-blue-600"
                            />
                            <span>{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">3. Campus Infrastructure</span>
                      <div className="space-y-1.5">
                        {['Central Library (15,000+ Books)', 'Auditorium (800 Seater)', 'Power Backup (100%)', 'RO Drinking Water Plant'].map((f) => (
                          <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.infrastructureFacilities.includes(f)}
                              onChange={() => handleFacilityToggle('infrastructureFacilities', f)}
                              className="w-3.5 h-3.5 accent-blue-600"
                            />
                            <span>{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Safety */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">4. Safety &amp; Security</span>
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

                    {/* Sports */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">5. Sports &amp; Fitness</span>
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

                    {/* Disabled Friendly */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">6. Disabled Friendly</span>
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
                      onClick={() => setActiveTab('step7')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Results &amp; Year-wise Banners →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: RESULTS & YEAR-WISE BANNERS (2 MODES) */}
              {activeTab === 'step7' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span>Step 7: Board Results &amp; Year-wise Banner Posters</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Publish student toppers manually OR upload official school result banner graphics (Year-wise for 10th &amp; 12th).
                      </p>
                    </div>
                    
                    {/* Result Mode Switcher */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                      <button
                        type="button"
                        onClick={() => setResultMode('both')}
                        className={`px-3 py-1.5 rounded-lg transition ${resultMode === 'both' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                      >
                        Both Options
                      </button>
                      <button
                        type="button"
                        onClick={() => setResultMode('banner')}
                        className={`px-3 py-1.5 rounded-lg transition ${resultMode === 'banner' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                      >
                        Banner Graphics
                      </button>
                      <button
                        type="button"
                        onClick={() => setResultMode('toppers')}
                        className={`px-3 py-1.5 rounded-lg transition ${resultMode === 'toppers' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
                      >
                        Topper Cards
                      </button>
                    </div>
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

                  {/* OPTION B: OFFICIAL RESULT GRAPHIC BANNERS (YEAR-WISE) */}
                  {(resultMode === 'both' || resultMode === 'banner') && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <span>Option 2: Official Year-Wise Result Banner Graphics (10th &amp; 12th)</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-500">Academic Year:</span>
                          <select
                            value={selectedResultYear}
                            onChange={(e) => setSelectedResultYear(e.target.value)}
                            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
                          >
                            <option value="2025-26">2025-26 (Current Year)</option>
                            <option value="2024-25">2024-25 (Past Year)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900">Class 12th Board Result Banner URL ({selectedResultYear})</span>
                          <input
                            type="url"
                            value={selectedResultYear === '2025-26' ? form.banner12th_2026 : form.banner12th_2025}
                            onChange={(e) => setForm({
                              ...form,
                              [selectedResultYear === '2025-26' ? 'banner12th_2026' : 'banner12th_2025']: e.target.value
                            })}
                            className="w-full p-2 border rounded-xl bg-white text-[11px]"
                          />
                          <div className="h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                            <img
                              src={selectedResultYear === '2025-26' ? form.banner12th_2026 : form.banner12th_2025}
                              alt="Class 12 Result Banner Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900">Class 10th Board Result Banner URL ({selectedResultYear})</span>
                          <input
                            type="url"
                            value={selectedResultYear === '2025-26' ? form.banner10th_2026 : form.banner10th_2025}
                            onChange={(e) => setForm({
                              ...form,
                              [selectedResultYear === '2025-26' ? 'banner10th_2026' : 'banner10th_2025']: e.target.value
                            })}
                            className="w-full p-2 border rounded-xl bg-white text-[11px]"
                          />
                          <div className="h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                            <img
                              src={selectedResultYear === '2025-26' ? form.banner10th_2026 : form.banner10th_2025}
                              alt="Class 10 Result Banner Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPTION A: MANUAL TOPPER CARDS */}
                  {(resultMode === 'both' || resultMode === 'toppers') && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <span className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Option 1: Individual Student Topper Profiles (Class 10th &amp; 12th)</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900">Class 12th Board Topper</span>
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={form.topper12Name}
                            onChange={(e) => setForm({ ...form, topper12Name: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-white"
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

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-900">Class 10th Board Topper</span>
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={form.topper10Name}
                            onChange={(e) => setForm({ ...form, topper10Name: e.target.value })}
                            className="w-full p-2 border rounded-xl bg-white"
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
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step6')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step8')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Campus Gallery &amp; Video Tour →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 8: GALLERY & VIRTUAL VIDEO TOUR */}
              {activeTab === 'step8' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-sky-600" />
                        <span>Step 8: Campus Gallery &amp; 360° Virtual Video Tour</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 11 (Photo Gallery) and Section 12 (Video Tours).</p>
                    </div>
                    <span className="text-xs bg-sky-50 text-sky-700 font-bold px-3 py-1 rounded-full border border-sky-200">
                      Step 8 of 10
                    </span>
                  </div>

                  {/* Virtual Video Tour Embed */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-rose-600" />
                      <span>360° Virtual Campus Video Tour (YouTube Embed URL)</span>
                    </span>
                    <input
                      type="url"
                      value={form.virtualTourEmbedUrl}
                      onChange={(e) => setForm({ ...form, virtualTourEmbedUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>

                  {/* Campus Gallery Photos */}
                  <div className="space-y-3 pt-2">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900 block">
                      Campus Infrastructure Photo Showcase ({form.galleryPhotos.length} Images)
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {form.galleryPhotos.map((photo, idx) => (
                        <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 space-y-1.5 p-2">
                          <div className="h-28 rounded-xl overflow-hidden bg-slate-200">
                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-900 truncate">{photo.title}</p>
                          <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                            {photo.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step7')}
                      className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('step9')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next: Address &amp; Google Maps →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 9: ADDRESS, CONTACT & GOOGLE MAPS */}
              {activeTab === 'step9' && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rose-600" />
                        <span>Step 9: Location, Address &amp; Google Maps</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Powers Section 13 (Location &amp; Bus Fleet Routes).</p>
                    </div>
                    <span className="text-xs bg-rose-50 text-rose-700 font-bold px-3 py-1 rounded-full border border-rose-200">
                      Step 9 of 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-700 mb-1">Locality / Sector *</label>
                      <input
                        type="text"
                        required
                        value={form.locality}
                        onChange={(e) => setForm({ ...form, locality: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Helpline Phone *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Full Physical Campus Address *</label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Transport Fleet &amp; Bus Routes Coverage</label>
                      <input
                        type="text"
                        value={form.transportRoutes}
                        onChange={(e) => setForm({ ...form, transportRoutes: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Google Maps Embed URL</label>
                      <input
                        type="url"
                        value={form.googleMapsEmbedUrl}
                        onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('step8')}
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

              {/* STEP 10: LIVE PREVIEW & FINAL PUBLISH */}
              {activeTab === 'preview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-black text-sm text-blue-950">Review Complete Institutional Profile</h3>
                      <p className="text-xs text-blue-800 mt-0.5">
                        UDISE <code>{form.udiseCode}</code>, 12 STEM Live Labs, 9-category facilities matrix, and board result banners.
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
                        <span className="text-xs text-slate-400 font-semibold">Ready for publication</span>
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
                      onClick={() => setActiveTab('step9')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      ← Edit Address &amp; Maps
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
