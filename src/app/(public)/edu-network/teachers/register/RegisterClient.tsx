'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, Phone, Mail, MapPin, CheckCircle2, ChevronRight,
  User, Award, Briefcase, FileText, ArrowLeft, ShieldCheck, Upload,
  Sparkles, Layers, BookOpen, AlertCircle, Lock, Clock, Edit3, X
} from 'lucide-react';
import CloudflareTurnstile from '@/components/shared/CloudflareTurnstile';
import { useAuth } from '@/contexts/AuthContext';
import { INDIAN_STATES_DISTRICTS } from '@/app/(public)/edu-network/teachers/Client';
import { VerifiedFacultyItem } from '@/data/facultyJobsData';

export default function RegisterFacultyClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [existingProfile, setExistingProfile] = useState<any | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  // Fast-resolving auth & existing profile check (never hangs indefinitely)
  React.useEffect(() => {
    // Safety timer: Ensure screen never gets stuck in loading state (max 800ms)
    const timeoutTimer = setTimeout(() => {
      setAuthResolved(true);
      setCheckingExisting(false);
    }, 800);

    if (authLoading) return () => clearTimeout(timeoutTimer);

    setAuthResolved(true);
    if (!user) {
      setCheckingExisting(false);
      clearTimeout(timeoutTimer);
      return;
    }

    setCheckingExisting(true);

    // Auto-populate user's registered name & email
    setFormData((prev) => ({
      ...prev,
      email: user.email || prev.email,
      name: prev.name || (user.user_metadata?.full_name || user.user_metadata?.name || ''),
    }));

    // Check local storage first (instant)
    try {
      const stored = JSON.parse(localStorage.getItem('cseel_created_teacher_profiles') || '[]');
      const match = stored.find((p: any) => (user.email && p.email?.toLowerCase() === user.email.toLowerCase()) || (p.userId && p.userId === user.id));
      if (match) {
        setExistingProfile(match);
        setCheckingExisting(false);
        clearTimeout(timeoutTimer);
        return;
      }
    } catch {}

    // Check backend API by user email
    if (user.email) {
      fetch(`/api/faculty/check?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.exists && data.profile) {
            setExistingProfile(data.profile);
          }
        })
        .catch(() => {})
        .finally(() => {
          setCheckingExisting(false);
          clearTimeout(timeoutTimer);
        });
    } else {
      setCheckingExisting(false);
      clearTimeout(timeoutTimer);
    }
  }, [user, authLoading]);

  // Handle start editing existing profile
  const handleStartEdit = () => {
    if (!existingProfile) return;
    setFormData({
      name: existingProfile.name || '',
      email: existingProfile.email || user?.email || '',
      phone: existingProfile.phone || '',
      designation: existingProfile.designation || 'PGT',
      subject: existingProfile.subject || 'Physics',
      board: existingProfile.board || 'CBSE',
      qualification: existingProfile.qualification || '',
      experienceYears: Number(existingProfile.experienceYears || existingProfile.experience_years) || 5,
      state: existingProfile.state || 'Haryana',
      district: existingProfile.district || existingProfile.city || 'Gurugram',
      city: existingProfile.city || existingProfile.district || 'Gurugram',
      address: existingProfile.address || '',
      pincode: existingProfile.pincode || '',
      pastSchools: existingProfile.currentInstitute || existingProfile.pastSchools || '',
      skills: Array.isArray(existingProfile.skills)
        ? existingProfile.skills.join(', ')
        : (existingProfile.skills || ''),
      avatarUrl: existingProfile.avatar || existingProfile.avatar_url || existingProfile.avatarUrl || '',
      phonePrivate: true,
      emailPrivate: true,
      expectedSalary: existingProfile.expectedSalary || existingProfile.expected_salary || '₹9 - ₹12 LPA',
      bio: existingProfile.bio || '',
    });
    setIsEditing(true);
    setIsSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Automatically compress uploaded image to WebP strictly <= 10KB
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingAvatar(true);
    setAvatarCompressedSize(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let currentDim = 120;
        let finalDataUrl = '';
        let finalByteSize = 0;

        // Loop to guarantee strictly under 10KB (<= 9900 bytes)
        while (currentDim >= 40) {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            height = Math.round((height * currentDim) / width);
            width = currentDim;
          } else {
            width = Math.round((width * currentDim) / height);
            height = currentDim;
          }
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let quality = 0.8;
            while (quality >= 0.15) {
              const testUrl = canvas.toDataURL('image/webp', quality);
              const byteSize = Math.round((testUrl.length * 3) / 4);
              if (byteSize <= 9900 || quality <= 0.2) {
                finalDataUrl = testUrl;
                finalByteSize = byteSize;
                if (byteSize <= 9900) break;
              }
              quality -= 0.15;
            }
          }
          if (finalByteSize > 0 && finalByteSize <= 9900) break;
          currentDim -= 20;
        }

        setAvatarCompressedSize(finalByteSize);
        setFormData((prev) => ({ ...prev, avatarUrl: finalDataUrl }));
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
      if (!user) {
        setErrorMessage('Authentication required: Please log in to submit your profile.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        userId: user.id,
        userEmail: user.email,
        isEdit: isEditing,
        profileId: existingProfile?.id,
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
        setIsSubmitting(false);
        return;
      }

      // CRITICAL: Any submission or edit places profile in "Under Verification" state
      const newFacultyItem = {
        ...data.educator,
        userId: user?.id,
        email: user?.email || formData.email,
        verified: false, // Reset to false: Under Verification
      };

      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('cseel_custom_faculty') || '[]');
          const filtered = stored.filter((p: any) => p.id !== newFacultyItem.id && p.email !== user?.email);
          localStorage.setItem('cseel_custom_faculty', JSON.stringify([newFacultyItem, ...filtered]));

          const storedProfiles = JSON.parse(localStorage.getItem('cseel_created_teacher_profiles') || '[]');
          const filteredProfiles = storedProfiles.filter((p: any) => p.id !== newFacultyItem.id && p.email !== user?.email);
          localStorage.setItem('cseel_created_teacher_profiles', JSON.stringify([newFacultyItem, ...filteredProfiles]));
        } catch {}
      }

      setExistingProfile(newFacultyItem);
      setIsEditing(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <span className="text-[#005689] font-bold">
            {isEditing ? 'Edit Faculty Profile' : 'Register as Faculty'}
          </span>
        </nav>

        {/* ─── LOADING STATE (Short max 800ms) ─── */}
        {!authResolved && authLoading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs space-y-4">
            <div className="w-8 h-8 border-3 border-[#004A75] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading educator portal...</p>
          </div>
        ) : !user ? (
          /* ─── UNAUTHENTICATED WELCOME & LOGIN GATE (NO INFINITE HANG) ─── */
          <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-50 text-[#004A75] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
              <GraduationCap className="w-8 h-8 text-[#004A75]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#004A75] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#004A75]" />
                <span>Verified Faculty Registry</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                List as a Verified Faculty Member
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Connect directly with 30,000+ CBSE, ICSE & IB schools across India. Sign in to create your verified educator profile or manage your listing.
              </p>
            </div>

            {/* Verification & Protection Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-xl mx-auto pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>1 Profile Per User</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Strictly 1 profile per account ensures authentic educator listings and zero recruiter spam.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Award size={14} className="text-blue-600 shrink-0" />
                  <span>NEP 2020 Badge</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Get verified for hands-on experiential pedagogy & Atal Tinkering Labs expertise.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Lock size={14} className="text-amber-600 shrink-0" />
                  <span>Contact Privacy</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your phone & email are shielded by default. Only verified school admins can request access.
                </p>
              </div>
            </div>

            {/* One-click Login / Signup Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/edu-network/teachers/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#004A75] hover:bg-[#003859] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
              >
                <User size={16} />
                <span>Log In with Google / Email</span>
              </Link>
              <Link
                href="/signup?role=teacher&redirect=/edu-network/teachers/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Create Free Educator Account</span>
              </Link>
            </div>
          </div>
        ) : existingProfile && !isEditing && !isSuccess ? (
          /* ─── ALREADY REGISTERED PROFILE SCREEN: SHOW STATUS & EDIT BUTTON ─── */
          <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-sm border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-50 text-[#004A75] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-9 h-9 text-[#004A75]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  existingProfile.verified
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-300'
                    : 'text-amber-800 bg-amber-50 border border-amber-300'
                }`}>
                  {existingProfile.verified ? (
                    <>
                      <ShieldCheck size={13} className="text-emerald-600" />
                      <span>Verified Faculty Member</span>
                    </>
                  ) : (
                    <>
                      <Clock size={13} className="text-amber-600" />
                      <span>Verification Under Process (Pending Review)</span>
                    </>
                  )}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Your Faculty Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your account (<strong>{user.email}</strong>) has an active listing. You can update your details anytime below.
              </p>
            </div>

            {/* Profile Preview Card with Status Details */}
            <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={existingProfile.avatar || existingProfile.avatar_url || existingProfile.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}
                  alt={existingProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900">{existingProfile.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                      existingProfile.verified
                        ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                        : 'text-amber-800 bg-amber-50 border border-amber-200'
                    }`}>
                      {existingProfile.verified ? 'Verified' : 'Under Verification'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {existingProfile.designation || 'Teacher'} in {existingProfile.subject || 'Faculty'} ({existingProfile.board || 'CBSE'})
                  </p>
                  <p className="text-[11.5px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{existingProfile.city || existingProfile.district || 'India'}, {existingProfile.state || ''}</span>
                  </p>
                </div>
              </div>

              {/* Status explanation notice */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                existingProfile.verified
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                {existingProfile.verified ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Your profile is active and verified!</strong> It is visible to thousands of CBSE & ICSE schools searching for qualified educators.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Verification Under Process:</strong> Your profile details are currently being reviewed by CSEEL academic moderators. If you edit your profile, it will be resubmitted for verification.
                    </div>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
                  <span className="font-medium text-slate-800">{existingProfile.qualification || 'Post Graduate'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-medium text-slate-800">{existingProfile.experienceYears || existingProfile.experience_years || 5} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Salary</span>
                  <span className="font-medium text-slate-800">{existingProfile.expectedSalary || existingProfile.expected_salary || '₹9 - ₹12 LPA'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact (Protected)</span>
                  <span className="font-mono text-slate-800">
                    {existingProfile.phone ? `+91 ${String(existingProfile.phone).slice(0, 2)}******${String(existingProfile.phone).slice(-2)}` : 'Shielded'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs: Edit Profile & View Directory */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#004A75] hover:bg-[#003859] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
              >
                <Edit3 size={15} />
                <span>✏️ Edit Profile Details</span>
              </button>
              <Link
                href="/edu-network/teachers?tab=faculty"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <BookOpen size={15} />
                <span>View in Faculty Directory</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          /* ─── SUCCESS CONFIRMATION SCREEN (UNDER VERIFICATION) ─── */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <Clock size={12} className="text-amber-600" />
                <span>Verification Under Process (Pending Admin Review)</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                Profile Submitted for Verification!
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your educator profile has been saved. It is currently placed under <strong>Admin Verification</strong> and will be visible across the verified faculty roster once verified.
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
                    <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-0.5">
                      <Clock size={10} className="text-amber-600" />
                      <span>Under Verification</span>
                    </span>
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
                    +91 {formData.phone ? formData.phone.charAt(0) : '9'}*********
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setIsEditing(false);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#004A75] hover:bg-[#003859] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View My Profile Status</span>
              </button>
              <Link
                href="/edu-network/teachers?tab=faculty"
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <BookOpen size={15} />
                <span>Faculty Directory</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* ─── REGISTRATION / EDIT FORM ─── */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8 animate-in fade-in">

            {/* Header */}
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#005689] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                  {isEditing ? 'Profile Editor' : 'Educator Onboarding Portal'}
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Clock size={12} />
                  <span>Subject to Admin Verification</span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
                  {isEditing ? '✏️ Edit Faculty Profile' : 'Register as a Verified STEM Faculty'}
                </h1>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Cancel Edit"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isEditing
                  ? 'Update your teaching qualifications, subjects, or contact details. Note: Any update will place your profile under re-verification by admin moderators.'
                  : 'Join thousands of school educators across India. Create your public educator profile with verified qualifications, subject expertise, and anti-spam contact privacy.'}
              </p>

              {isEditing && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2 font-medium">
                  <Clock size={14} className="text-amber-600 shrink-0" />
                  <span>
                    <strong>Re-Verification Notice:</strong> Saving changes will mark your profile status as <strong>Under Verification</strong> until verified by our moderators.
                  </span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. Personal & Profile Identity */}
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
                    {avatarCompressedSize && (
                      <p className="text-[10.5px] text-emerald-600 font-semibold mt-1">
                        ✓ Compressed to WebP ({(avatarCompressedSize / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Number * (10 Digits)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs font-semibold text-slate-400">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                        className="w-full pl-11 pr-3 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:bg-white transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="arvind.joshi@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Teaching Specialization & Board */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-[#005689]" />
                  <span>2. Teaching Designation & Board</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Designation</label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="PGT">PGT (Post Graduate Teacher)</option>
                      <option value="TGT">TGT (Trained Graduate Teacher)</option>
                      <option value="PRT">PRT (Primary Teacher)</option>
                      <option value="STEM Lab Lead">STEM Lab Lead / ATL Mentor</option>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="Vice Principal">Vice Principal / Academic Dean</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Primary Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science / AI</option>
                      <option value="General Science">General Science</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Affiliation Board</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="IB">International Baccalaureate (IB)</option>
                      <option value="Cambridge">Cambridge / IGCSE</option>
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
                      placeholder="e.g. M.Sc Physics, B.Ed (Gold Medalist)"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Teaching Experience (Years)</label>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Location & Geography */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#005689]" />
                  <span>3. Location & Preferred City</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const dists = INDIAN_STATES_DISTRICTS[newState] || [];
                        setFormData({
                          ...formData,
                          state: newState,
                          district: dists[0] || 'Central',
                          city: dists[0] || 'Central',
                        });
                      }}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">District / City</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value, city: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      {availableDistricts.map((dst) => (
                        <option key={dst} value={dst}>{dst}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Expected Salary (LPA)</label>
                    <select
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                    >
                      <option value="₹4 - ₹6 LPA">₹4 - ₹6 LPA</option>
                      <option value="₹6 - ₹9 LPA">₹6 - ₹9 LPA</option>
                      <option value="₹9 - ₹12 LPA">₹9 - ₹12 LPA</option>
                      <option value="₹12 - ₹16 LPA">₹12 - ₹16 LPA</option>
                      <option value="₹16 - ₹22 LPA">₹16 - ₹22 LPA</option>
                      <option value="₹22+ LPA">₹22+ LPA (Leadership / HOD)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Experience & Bio */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#005689]" />
                  <span>4. Current / Past Schools & Pedagogical Bio</span>
                </h3>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Current or Past Schools / Institutes</label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Delhi Public School, Springdales School"
                    value={formData.pastSchools}
                    onChange={(e) => setFormData({ ...formData, pastSchools: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
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
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Cancel
                  </button>
                ) : (
                  <Link
                    href="/edu-network/teachers"
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                  >
                    Cancel
                  </Link>
                )}

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
                    <span>{isEditing ? 'Saving Updates...' : 'Registering Profile...'}</span>
                  ) : !turnstileToken ? (
                    <>
                      <Lock size={14} className="text-slate-400" />
                      <span>Verify Security Check to Submit</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-300" />
                      <span>Save & Resubmit for Verification</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-300" />
                      <span>Submit Profile for Verification</span>
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
