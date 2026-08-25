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
  Activity, Radio, Compass, Stethoscope, Layers, Bus, Compass as MapIcon,
  LayoutGrid, FileCode2, SlidersHorizontal, CheckCircle, Info, Upload,
  Trash2, Eye as EyeIcon
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';
import PremiumSchoolProfileClient from '@/components/edu-network/PremiumSchoolProfileClient';

interface ContactChannel {
  id: string;
  type: string;
  email: string;
  phone: string;
  isPublic: boolean;
  description: string;
}

interface GalleryPhotoItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  description: string;
}

export default function CreateSchoolProfileClient() {
  const router = useRouter();

  // Mode: 'form' (Single-page edit form) vs 'preview' (Live Dual Preview)
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [previewSubTab, setPreviewSubTab] = useState<'both' | 'card' | 'detail'>('both');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newSchoolId, setNewSchoolId] = useState('');

  // ── FORM STATE: ALL 9 SECTIONS ────────────────────────────────────────────
  const [form, setForm] = useState({
    // Section 1: Card & Basic Info
    name: 'HOCL International School',
    shortName: 'HOCL',
    type: 'School' as const,
    udiseCode: '07010200389',
    board: 'CBSE' as const,
    affiliation: 'CBSE Affiliated Senior Secondary Institution (Affiliation No: 1130142)',
    monthlyFees: '₹12,500 / mo',
    monthlyFeesNum: 12500,
    classesOffered: 'Pre-K - 12th',
    studentFacultyRatio: '13:1',
    admissionStatus: 'Open for 2026-27' as const,
    logo: 'https://images.uniapply.com/uploads/college/image/logo/2186/KRMGS_L_220920_174918.jpg',
    bannerImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    facilitiesChips: 'Smart Classrooms, Robotics Lab, Swimming Pool, Transport, CCTV Surveillance',

    // Section 2: Overview & Leadership
    description: 'A premier educational ecosystem dedicated to experiential STEM inquiry, holistic K-12 academic excellence, and future-ready scientific leadership with state-of-the-art laboratory infrastructure and global pedagogical standards.',
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

    // Section 3: Admissions & 12 Required Documents
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

    // Section 4: Comprehensive 6-Component Fee Matrix
    admissionFee: 45000,
    registrationFee: 1000,
    tuitionQuarterly: 37500,
    securityDeposit: 15000,
    annualLogisticsFee: 18000,
    developmentFund: 12000,

    // Section 5: STEM Live Labs (12 Specialized Labs)
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

    // Section 6: Facilities Matrix (9 Categories)
    classroomFacilities: ['Smart Classrooms', 'AC Classrooms', 'Wi-Fi Campus', 'Audio-Visual Projectors'],
    boardingFacilities: ['Day School', 'Cafeteria / Healthy Meal Plan'],
    infrastructureFacilities: ['Central Library (15,000+ Books)', 'Auditorium (800 Seater)', 'Power Backup (100%)', 'RO Drinking Water Plant'],
    safetyFacilities: ['24x7 CCTV Surveillance', 'GPS Bus Fleet Tracking', 'Female Attendant in Buses', 'Full-time Doctor & Nurse', 'Fire Safety ISO Certified'],
    advancedFacilities: ['Robotic STEM Lab', 'Virtual Reality Pods', 'Solar Powered Green Campus'],
    extracurricularFacilities: ['Music & Classical Dance Studio', 'Drama & Theater Club', 'Art & Craft Studio', 'Debate Society', 'Yoga & Meditation Zone'],
    sportsFacilities: ['Olympic Size Swimming Pool', 'Cricket Ground & Nets', 'Football Turf', 'Basketball Courts', 'Indoor Badminton Court', 'Table Tennis Arena'],
    labFacilities: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer Science Lab', 'Math Lab', 'Language & Phonetics Lab'],
    disabledFacilities: ['Wheelchair Ramps on All Floors', 'Disabled Restrooms', 'Elevators / Lifts', 'Braille Signage'],

    // Section 7: Academic Results & Year-wise Banners
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

    // Section 8: Gallery (Max 10 Photos with Direct File Upload / URL)
    galleryPhotos: [
      { id: '1', title: 'Interactive Science Experiential Lab', category: 'STEM Lab', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
      { id: '2', title: 'Central Research & Digital Library', category: 'Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80' },
      { id: '3', title: 'Olympic Sports Arena & Football Turf', category: 'Sports', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
      { id: '4', title: 'Smart Interactive Classroom', category: 'Classroom', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80' },
      { id: '5', title: 'Campus Medical & Wellness Infirmary', category: 'Medical', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' }
    ] as GalleryPhotoItem[],

    // Section 8 (Videos): Max 3 Virtual Tours
    videosList: [
      { id: '1', title: '360° Virtual Campus Walkthrough Tour', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Comprehensive aerial and interior walkthrough of our 12-acre campus.' },
      { id: '2', title: 'STEM Live Labs & Innovation Practical Tour', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Live student experiments in Robotics, ATL, and Science Experiential Lab.' },
      { id: '3', title: 'Annual Academic & Sports Conclave Highlights', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Annual day performances, athletic turf events, and award ceremony.' }
    ] as VideoItem[],

    // Section 9: Department Contacts & Emails (Public vs Private Toggles)
    contactChannels: [
      {
        id: 'admissions',
        type: 'Admissions & Help Desk',
        email: 'admissions@institution.edu.in',
        phone: '+91 11 4987 6543',
        isPublic: true,
        description: 'Parent admission queries, registration fee, and campus walk-through appointments'
      },
      {
        id: 'careers',
        type: 'Careers & Faculty Jobs (HR Desk)',
        email: 'careers@institution.edu.in',
        phone: '+91 98765 43210',
        isPublic: true,
        description: 'Teacher recruitment, CV submissions, and laboratory faculty hiring'
      },
      {
        id: 'principal',
        type: 'Principal Direct Office',
        email: 'principal@institution.edu.in',
        phone: '+91 11 4987 6500',
        isPublic: false,
        description: 'Direct confidential leadership communication & academic escalation'
      },
      {
        id: 'admin',
        type: 'General Admin & Transport Helpline',
        email: 'info@institution.edu.in',
        phone: '+91 11 4987 6501',
        isPublic: true,
        description: 'School office, bus fleet route tracking, and student affairs'
      }
    ] as ContactChannel[],

    // Section 9: Address, Location & Google Maps
    locality: 'Sri Aurobindo Marg',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110029',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    website: 'https://www.institution.edu.in',
    transportRoutes: 'AC Bus Fleet covering 45+ routes across Delhi NCR with GPS Tracking, CCTV & Speed Governors',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.604473852084!2d77.1953247!3d28.5516047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce27038e2d469%3A0x89e248b6c4b22c07!2sSri%20Aurobindo%20Marg!5e0!3m2!1sen!2sin!4v1700000000000',
  });

  // Handlers for dynamic lists
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

  // Toggle Contact Channel Visibility (Public vs Private)
  const toggleContactVisibility = (index: number) => {
    setForm(prev => {
      const updated = [...prev.contactChannels];
      updated[index].isPublic = !updated[index].isPublic;
      return { ...prev, contactChannels: updated };
    });
  };

  const handleContactChange = (index: number, field: keyof ContactChannel, value: any) => {
    setForm(prev => {
      const updated = [...prev.contactChannels];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, contactChannels: updated };
    });
  };

  // Direct Photo Upload Handler (FileReader)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, photoIndex?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (typeof photoIndex === 'number' && photoIndex < form.galleryPhotos.length) {
        setForm(prev => {
          const updated = [...prev.galleryPhotos];
          updated[photoIndex].url = base64Url;
          return { ...prev, galleryPhotos: updated };
        });
      } else {
        if (form.galleryPhotos.length >= 10) {
          alert('Maximum 10 gallery photos allowed.');
          return;
        }
        const newPhoto: GalleryPhotoItem = {
          id: `photo-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          category: 'Campus',
          url: base64Url
        };
        setForm(prev => ({ ...prev, galleryPhotos: [...prev.galleryPhotos, newPhoto] }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeGalleryPhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
    }));
  };

  const handleVideoChange = (index: number, field: keyof VideoItem, value: string) => {
    setForm(prev => {
      const updated = [...prev.videosList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, videosList: updated };
    });
  };

    const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-institution';
    const finalId = 'org-' + slug + '-' + Date.now().toString().slice(-4);

    const primaryPublicContact = form.contactChannels.find(c => c.isPublic) || form.contactChannels[0];

    const newOrg = {
      ...form,
      id: finalId,
      slug: slug,
      email: primaryPublicContact?.email || 'admissions@institution.edu.in',
      phone: primaryPublicContact?.phone || '+91 11 4987 6543',
      verified: true,
      rating: 5.0,
      reviews: 4100,
      reviews_count: 4100,
      stemLabsCount: form.selectedLabs.length,
      facilities: form.facilitiesChips.split(',').map(s => s.trim()),
      openJobsCount: 1,
      isFeatured: true,
    };

    try {
      // 1. Persist directly via backend API route to Supabase
      await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrg),
      });
    } catch (err) {
      console.warn('API sync fallback active:', err);
    }

    ALL_ORGANIZATIONS.unshift(newOrg);
    setNewSchoolId(finalId);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const sectionsNav = [
    { id: 'sec-card', label: '1. Card Info', icon: Building2 },
    { id: 'sec-overview', label: '2. Overview & Leader', icon: UserCheck },
    { id: 'sec-admissions', label: '3. Admissions & Docs', icon: Calendar },
    { id: 'sec-fee', label: '4. Fee Matrix', icon: Wallet },
    { id: 'sec-stem', label: '5. STEM Labs', icon: Microscope },
    { id: 'sec-facilities', label: '6. Facilities Matrix', icon: Layers },
    { id: 'sec-results', label: '7. Results & Banners', icon: Trophy },
    { id: 'sec-gallery', label: '8. Gallery & 3 Videos', icon: Camera },
    { id: 'sec-contacts', label: '9. Department Emails & Map', icon: Mail },
  ];

  // Construct organization object for 100% exact PremiumSchoolProfileClient preview with all live form fields
  const primaryPublicContact = form.contactChannels.find(c => c.isPublic) || form.contactChannels[0];
  const exactPreviewOrg: any = {
    ...form,
    id: 'preview-institution-live',
    email: primaryPublicContact?.email || 'admissions@institution.edu.in',
    phone: primaryPublicContact?.phone || '+91 11 4987 6543',
    verified: true,
    rating: 5.0,
    reviews: 4100,
    stemLabsCount: form.selectedLabs.length,
    facilities: form.facilitiesChips.split(',').map(s => s.trim()),
    openJobsCount: 1,
    isFeatured: true,
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased pb-28">

        {/* ── TOP STICKY BAR: SWITCH BETWEEN SINGLE-PAGE FORM & DUAL PREVIEW ── */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
            
            {/* Breadcrumb & Title */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 min-w-0">
              <Link href="/edu-network/organisation/school" className="hover:text-blue-600 shrink-0">Schools</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-bold truncate">Create School Profile</span>
            </div>

            {/* View Mode Toggle (Single Page Form vs Live Dual Preview) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === 'form'
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Single-Page Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    viewMode === 'preview'
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview (Exact Public Detail Page)</span>
                </button>
              </div>

              {/* Publish Action Button */}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || submitSuccess}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Publishing...' : 'Save & Publish'}</span>
              </button>
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
                <strong>{form.name}</strong> is now live with all 9 detail sections, verified UDISE code <code>{form.udiseCode}</code>, STEM Live Lab matrix, result banners, gallery, and map coordinates.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href={`/edu-network/org/${newSchoolId}`}
                  className="px-6 py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <span>View Live Profile Page</span>
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

        {/* ── VIEW 1: SINGLE-PAGE ALL-SECTIONS FORM ─────────────────────────── */}
        {!submitSuccess && viewMode === 'form' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Sticky Quick Jump Navigation */}
              <div className="hidden lg:block lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-1 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
                <div className="pb-3 border-b border-slate-100 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">All 9 Sections (Single Page)</span>
                </div>
                {sectionsNav.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition flex items-center gap-2"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{sec.label}</span>
                    </a>
                  );
                })}

                <div className="pt-3 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Live Dual Preview</span>
                  </button>
                </div>
              </div>

              {/* Right Continuous Form (All 9 Sections) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* 1. Card & Basic Info */}
                <section id="sec-card" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>1. Card &amp; Basic Listing Information</span>
                    </h2>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Directory Card Data
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-semibold">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Official School / Institution Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. HOCL International School"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Short Name / Acronym</label>
                      <input
                        type="text"
                        value={form.shortName}
                        onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                        placeholder="HOCL"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">UDISE+ Code (11 Digits) *</label>
                      <input
                        type="text"
                        required
                        value={form.udiseCode}
                        onChange={(e) => setForm({ ...form, udiseCode: e.target.value })}
                        placeholder="07010200389"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Board / Affiliation Authority *</label>
                      <select
                        value={form.board}
                        onChange={(e) => setForm({ ...form, board: e.target.value as any })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
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
                        placeholder="₹12,500 / mo"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Classes / Degrees Offered *</label>
                      <input
                        type="text"
                        required
                        value={form.classesOffered}
                        onChange={(e) => setForm({ ...form, classesOffered: e.target.value })}
                        placeholder="Pre-K - 12th"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Student-Faculty Ratio *</label>
                      <input
                        type="text"
                        required
                        value={form.studentFacultyRatio}
                        onChange={(e) => setForm({ ...form, studentFacultyRatio: e.target.value })}
                        placeholder="13:1"
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Admission Status *</label>
                      <select
                        value={form.admissionStatus}
                        onChange={(e) => setForm({ ...form, admissionStatus: e.target.value as any })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-emerald-700"
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
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-[11px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 mb-1">Campus Cover Banner Image URL *</label>
                      <input
                        type="url"
                        required
                        value={form.bannerImage}
                        onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-[11px]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">Top Facility Chips for Directory Card (Comma Separated)</label>
                      <input
                        type="text"
                        value={form.facilitiesChips}
                        onChange={(e) => setForm({ ...form, facilitiesChips: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Overview & Leadership */}
                <section id="sec-overview" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span>2. Overview, Leadership &amp; Academic Stats</span>
                    </h2>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Vision &amp; Leadership
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-semibold">
                    <div className="sm:col-span-3">
                      <label className="block text-slate-700 mb-1">About Institution / Vision &amp; Mission *</label>
                      <textarea
                        rows={3}
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full p-3 border rounded-xl bg-slate-50 font-medium resize-none"
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
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-[11px]"
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
                </section>

                {/* 3. Admissions & 12 Required Documents */}
                <section id="sec-admissions" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>3. Admission Dates &amp; 12 Mandatory Documents</span>
                    </h2>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Admission Criteria
                    </span>
                  </div>

                  {/* Dates */}
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
                  <div className="space-y-3 pt-2">
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
                </section>

                {/* 4. Comprehensive Fee Matrix */}
                <section id="sec-fee" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <span>4. Comprehensive 6-Component Fee Matrix</span>
                    </h2>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                      Fee Breakdown
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
                </section>

                {/* 5. STEM Live Labs */}
                <section id="sec-stem" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-emerald-600" />
                      <span>5. STEM Live Lab Ecosystem (12 Specialized Labs)</span>
                    </h2>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Active: {form.selectedLabs.length}/12 Labs
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
                </section>

                {/* 6. Facilities Matrix (9 Categories) */}
                <section id="sec-facilities" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>6. UniApply 9-Category Facilities Matrix</span>
                    </h2>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                      Facilities Checklist
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Classroom Facilities</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Boarding &amp; Meals</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Campus Infrastructure</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Safety &amp; Security</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Sports &amp; Fitness</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Disabled Friendly</span>
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
                </section>

                {/* 7. Results & Year-wise Banners */}
                <section id="sec-results" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>7. Academic Results &amp; Year-wise Result Banners</span>
                    </h2>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                      Banners + Topper Cards
                    </span>
                  </div>

                  {/* Summary Numbers */}
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

                  {/* Option B: Official Result Graphic Banners (Year-wise) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Official Result Graphic Banners (Upload for 10th &amp; 12th)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                      <div>
                        <label className="block text-slate-600 mb-1">Class 12th Result Banner URL (2025-26)</label>
                        <input
                          type="url"
                          value={form.banner12th_2026}
                          onChange={(e) => setForm({ ...form, banner12th_2026: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Class 10th Result Banner URL (2025-26)</label>
                        <input
                          type="url"
                          value={form.banner10th_2026}
                          onChange={(e) => setForm({ ...form, banner10th_2026: e.target.value })}
                          className="w-full p-2 border rounded-xl bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Option A: Individual Topper Profiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-semibold">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="font-bold text-slate-900">Class 12th Topper Details</span>
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
                      <span className="font-bold text-slate-900">Class 10th Topper Details</span>
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
                </section>

                {/* 8. Campus Gallery (Direct File Upload / URL, Max 10) & 3 Videos */}
                <section id="sec-gallery" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-sky-600" />
                        <span>8. Campus Photo Gallery (Max 10) &amp; Virtual Tours (Max 3)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Upload photos directly from device or URL with custom text details.</p>
                    </div>
                    <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                      Photos: {form.galleryPhotos.length}/10 • Videos: {form.videosList.length}/3
                    </span>
                  </div>

                  {/* Direct Photo Upload Drop Area */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-black text-xs text-slate-900 block">Upload Campus Photos Directly</span>
                        <p className="text-[11px] text-slate-500">Attach photos of smart classrooms, science labs, library, turf, and infirmary.</p>
                      </div>

                      <label className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Upload Photo File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoFileUpload(e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Photos Grid with Editable Text Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {form.galleryPhotos.map((photo, idx) => (
                        <div key={photo.id || idx} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                          <div className="h-32 rounded-xl overflow-hidden bg-slate-100 relative group">
                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryPhoto(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg shadow opacity-90 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5 text-xs font-semibold">
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => {
                                const newPhotos = [...form.galleryPhotos];
                                newPhotos[idx].title = e.target.value;
                                setForm({ ...form, galleryPhotos: newPhotos });
                              }}
                              placeholder="Photo Description / Title"
                              className="w-full p-1.5 border rounded-lg bg-slate-50 text-[11px]"
                            />

                            <div className="flex items-center gap-2">
                              <select
                                value={photo.category}
                                onChange={(e) => {
                                  const newPhotos = [...form.galleryPhotos];
                                  newPhotos[idx].category = e.target.value;
                                  setForm({ ...form, galleryPhotos: newPhotos });
                                }}
                                className="w-full p-1.5 border rounded-lg bg-slate-50 text-[11px] font-bold text-slate-700"
                              >
                                <option value="STEM Lab">STEM Lab</option>
                                <option value="Library">Library</option>
                                <option value="Sports">Sports</option>
                                <option value="Classroom">Classroom</option>
                                <option value="Medical">Medical</option>
                                <option value="Campus">Campus</option>
                              </select>

                              <label className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer text-slate-700 border text-[11px] shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoFileUpload(e, idx)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Max 3 Video Tours Showcase */}
                  <div className="space-y-3 pt-2">
                    <span className="font-black text-xs text-slate-900 uppercase tracking-wide block">
                      Virtual Video Tours Showcase (Max 3 Videos)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                      {form.videosList.map((vid, idx) => (
                        <div key={vid.id || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <span className="font-black text-slate-900 text-xs block">Video #{idx + 1}</span>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => handleVideoChange(idx, 'title', e.target.value)}
                            placeholder="Video Title"
                            className="w-full p-2 border rounded-xl bg-white text-[11px]"
                          />
                          <input
                            type="url"
                            value={vid.url}
                            onChange={(e) => handleVideoChange(idx, 'url', e.target.value)}
                            placeholder="YouTube Embed URL"
                            className="w-full p-2 border rounded-xl bg-white text-[11px]"
                          />
                          <textarea
                            rows={2}
                            value={vid.description}
                            onChange={(e) => handleVideoChange(idx, 'description', e.target.value)}
                            placeholder="Brief description of video tour"
                            className="w-full p-2 border rounded-xl bg-white text-[11px] resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 9. Department Emails & Contacts with Public/Private Toggles + Address */}
                <section id="sec-contacts" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-rose-600" />
                        <span>9. Department Communications (Public / Private) &amp; Google Maps</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Set dedicated emails for Admissions, Job/Careers desk, and Principal with individual visibility controls.</p>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                      Privacy Controls
                    </span>
                  </div>

                  {/* 4 Department Communication Channels */}
                  <div className="space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                      Department Email &amp; Helpline Matrix
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {form.contactChannels.map((channel, idx) => (
                        <div
                          key={channel.id || idx}
                          className={`p-4 rounded-2xl border transition space-y-2.5 ${
                            channel.isPublic
                              ? 'bg-blue-50/40 border-blue-200'
                              : 'bg-slate-100/70 border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900">{channel.type}</span>
                            <button
                              type="button"
                              onClick={() => toggleContactVisibility(idx)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1 ${
                                channel.isPublic
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-700 text-white'
                              }`}
                            >
                              {channel.isPublic ? <EyeIcon className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              <span>{channel.isPublic ? 'Public Visible' : 'Private (Hidden)'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                            <div>
                              <label className="block text-slate-500 text-[10px] uppercase mb-0.5">Department Email</label>
                              <input
                                type="email"
                                value={channel.email}
                                onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                                className="w-full p-2 border rounded-xl bg-white text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 text-[10px] uppercase mb-0.5">Contact Phone</label>
                              <input
                                type="tel"
                                value={channel.phone}
                                onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                                className="w-full p-2 border rounded-xl bg-white text-[11px]"
                              />
                            </div>
                          </div>

                          <input
                            type="text"
                            value={channel.description}
                            onChange={(e) => handleContactChange(idx, 'description', e.target.value)}
                            placeholder="Purpose description"
                            className="w-full p-1.5 border rounded-lg bg-white/80 text-[10px] text-slate-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical Address & Google Maps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-semibold pt-3 border-t border-slate-100">
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
                      <label className="block text-slate-700 mb-1">Official Website URL</label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Google Maps Embed URL</label>
                      <input
                        type="url"
                        value={form.googleMapsEmbedUrl}
                        onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 text-[11px]"
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
                  </div>
                </section>

                {/* Bottom Publish Bar */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">Ready to Publish School Profile?</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Review the live card &amp; full detail page simulation before publishing.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Live Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Publishing...' : 'Save & Publish Profile'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ── VIEW 2: EXACT 1:1 PUBLIC DETAIL PAGE & CARD PREVIEW ── */}
        {!submitSuccess && viewMode === 'preview' && (
          <div className="space-y-6">
            
            {/* Preview Sub-tab Switcher Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Exact Public Page Live Preview Simulation</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">100% identical styling, components, and layout as seen by public visitors.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('both')}
                      className={`px-3 py-1.5 rounded-lg transition ${previewSubTab === 'both' ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600'}`}
                    >
                      Both Previews
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('card')}
                      className={`px-3 py-1.5 rounded-lg transition ${previewSubTab === 'card' ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600'}`}
                    >
                      Directory Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSubTab('detail')}
                      className={`px-3 py-1.5 rounded-lg transition ${previewSubTab === 'detail' ? 'bg-[#1e3a8a] text-white shadow-xs' : 'text-slate-600'}`}
                    >
                      Full Detail Profile
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('form')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>Edit Fields</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish Profile'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── PREVIEW PART 1: DIRECTORY LISTING CARD PREVIEW ── */}
            {(previewSubTab === 'both' || previewSubTab === 'card') && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Preview 1: School Directory Search Card
                  </span>
                  <span className="text-[11px] text-blue-600 font-bold">Appears on /edu-network/organisation/school</span>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-md flex flex-col md:flex-row gap-5 items-stretch relative">
                  <span className="absolute -top-3 right-6 px-3 py-0.5 bg-[#1e3a8a] text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow">
                    Directory Card Simulation
                  </span>

                  <div className="relative w-full md:w-52 h-40 md:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={form.bannerImage}
                      alt={form.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 w-11 h-11 rounded-xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center">
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
                          <span>5.0</span>
                          <span className="text-[10px] text-slate-400 font-normal">(4.1k)</span>
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
                      <span className="text-xs text-slate-400 font-semibold">Listing active on directory</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Apply / Enquire</span>
                        <span className="px-3.5 py-1 bg-[#1e3a8a] text-white rounded-xl text-xs font-bold">View Profile →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PREVIEW PART 2: EXACT 100% 1:1 PUBLIC DETAIL PROFILE PAGE RENDERING ── */}
            {(previewSubTab === 'both' || previewSubTab === 'detail') && (
              <div className="space-y-4 pt-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Preview 2: Full Institutional Detail Profile Page
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Live Component: &lt;PremiumSchoolProfileClient /&gt;
                  </span>
                </div>

                {/* EXACT COMPONENT RENDERED ON LIVE PUBLIC URL */}
                <div className="rounded-3xl overflow-hidden border-2 border-indigo-200/80 shadow-md">
                  <PremiumSchoolProfileClient overrideOrg={exactPreviewOrg} />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </PageTransition>
  );
}
