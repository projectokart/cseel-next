'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  School,
  GraduationCap,
  BookOpen,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  Sparkles,
  ShieldCheck,
  Phone,
  User,
  AlertCircle,
  Lock,
  Edit3
} from 'lucide-react';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const BOARDS = [
  'CBSE',
  'ICSE / ISC',
  'State Board',
  'IB (International Baccalaureate)',
  'Cambridge (IGCSE)',
  'Other'
];

const SCHOOL_TYPES = [
  'Private Unaided (Recognized)',
  'Kendriya Vidyalaya (KVS)',
  'Jawahar Navodaya Vidyalaya (JNV)',
  'Government School',
  'Government Aided School',
  'Army / Defence Public School',
  'Other'
];

const BOARDING_TYPES = [
  'Day School',
  'Residential / Boarding',
  'Day-cum-Boarding',
  'Other'
];

const DESIGNATIONS = [
  'Principal / Head of Institution',
  'Lab In-charge / STEM Coordinator',
  'Vice Principal / Dean',
  'Trustee / School Management',
  'Administrative Officer',
  'Teacher / Faculty Member',
  'Other'
];

const STUDENT_GRADES = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11 (Science - PCM)', 'Class 11 (Science - PCB)', 'Class 11 (Commerce / Arts)',
  'Class 12 (Science - PCM)', 'Class 12 (Science - PCB)', 'Class 12 (Commerce / Arts)',
  'Undergraduate / College', 'Other'
];

const TEACHER_SUBJECTS = [
  'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science & AI',
  'Integrated Science (Classes 6-10)', 'Robotics & STEM Tinkering', 'General Science',
  'Other'
];

type UserRoleType = 'school' | 'teacher' | 'student' | 'organisation';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common Profile Fields
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // School Specific Fields
  const [udiseCode, setUdiseCode] = useState('');
  const [isFetchingUdise, setIsFetchingUdise] = useState(false);
  const [udiseSuccessMessage, setUdiseSuccessMessage] = useState<string | null>(null);
  
  const [board, setBoard] = useState('CBSE');
  const [otherBoard, setOtherBoard] = useState('');
  
  const [schoolType, setSchoolType] = useState('Private Unaided (Recognized)');
  const [otherSchoolType, setOtherSchoolType] = useState('');
  
  const [boardingType, setBoardingType] = useState('Day School');
  const [otherBoardingType, setOtherBoardingType] = useState('');
  
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [designation, setDesignation] = useState('Principal / Head of Institution');
  const [otherDesignation, setOtherDesignation] = useState('');

  // Student / Teacher Specific
  const [gradeOrSubject, setGradeOrSubject] = useState('');
  const [otherGradeOrSubject, setOtherGradeOrSubject] = useState('');

  // Prepopulate from Auth User
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata;
      const initialName = meta?.full_name || meta?.name || meta?.display_name || user.email?.split('@')[0] || '';
      setDisplayName(initialName);
      if (meta?.phone && !phone) {
        setPhone(meta.phone);
      }
    }
  }, [user]);

  // UDISE validation helper
  const cleanUdise = udiseCode.trim().replace(/\D/g, '');
  const isUdiseValid = cleanUdise.length === 11;

  // Handle UDISE lookup
  const handleUdiseLookup = async (codeToSearch?: string) => {
    const code = (codeToSearch || cleanUdise).trim().replace(/\D/g, '');
    if (code.length !== 11) {
      setErrorMsg('UDISE code must be exactly 11 numeric digits.');
      return;
    }

    setIsFetchingUdise(true);
    setErrorMsg(null);
    setUdiseSuccessMessage(null);

    try {
      const res = await fetch(`/api/udise/lookup?code=${encodeURIComponent(code)}`);
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        if (d.schoolName) setSchoolName(d.schoolName);
        if (d.state) {
          const matchedState = INDIAN_STATES.find(s => s.toLowerCase() === d.state.toLowerCase()) || d.state;
          setStateName(matchedState);
        }
        if (d.district) setDistrict(d.district);
        if (d.streetAddress) setAddress(d.streetAddress);
        if (d.pincode) setPincode(d.pincode);
        if (d.contactPhone && !phone) setPhone(d.contactPhone);
        if (d.board) {
          const matchedBoard = BOARDS.find(b => b.toLowerCase().includes(d.board.toLowerCase()));
          if (matchedBoard) {
            setBoard(matchedBoard);
          } else {
            setBoard('Other');
            setOtherBoard(d.board);
          }
        }
        if (d.nature) {
          const matchedNature = BOARDING_TYPES.find(n => n.toLowerCase().includes(d.nature.toLowerCase()));
          if (matchedNature) {
            setBoardingType(matchedNature);
          } else {
            setBoardingType('Other');
            setOtherBoardingType(d.nature);
          }
        }
        setUdiseSuccessMessage(`Verified: Found "${d.schoolName || 'School Record'}" in national database!`);
      } else {
        setErrorMsg(json.error || 'UDISE code verified (11 digits), but not found in online cache. Please fill remaining details below.');
      }
    } catch (err: any) {
      setErrorMsg('UDISE code entered. Please complete the fields below.');
    } finally {
      setIsFetchingUdise(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be signed in to complete your profile.');
      return;
    }

    if (!displayName.trim()) {
      setErrorMsg('Please enter your Full Name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('A valid 10-digit Contact / Mobile number is required.');
      return;
    }

    // Role-specific validation
    if (selectedRole === 'school') {
      if (!isUdiseValid) {
        setErrorMsg('UDISE code is mandatory for school registration and must be exactly 11 digits.');
        return;
      }
      if (!schoolName.trim()) {
        setErrorMsg('Please provide your School Name.');
        return;
      }
      if (!stateName) {
        setErrorMsg('Please select your State.');
        return;
      }
      if (!district.trim()) {
        setErrorMsg('Please enter your District.');
        return;
      }
      if (board === 'Other' && !otherBoard.trim()) {
        setErrorMsg('Please specify your Board Affiliation in the "Other" field.');
        return;
      }
      if (schoolType === 'Other' && !otherSchoolType.trim()) {
        setErrorMsg('Please specify your School Type in the "Other" field.');
        return;
      }
      if (boardingType === 'Other' && !otherBoardingType.trim()) {
        setErrorMsg('Please specify your Boarding Format in the "Other" field.');
        return;
      }
      if (designation === 'Other' && !otherDesignation.trim()) {
        setErrorMsg('Please specify your Designation in the "Other" field.');
        return;
      }
    } else {
      if (!stateName) {
        setErrorMsg('Please select your State.');
        return;
      }
      if (!district.trim()) {
        setErrorMsg('Please enter your District.');
        return;
      }
      if (!schoolName.trim()) {
        setErrorMsg(selectedRole === 'organisation' ? 'Please enter your Organisation Name.' : 'Please enter your School / College name.');
        return;
      }
      if ((selectedRole === 'student' || selectedRole === 'teacher') && gradeOrSubject === 'Other' && !otherGradeOrSubject.trim()) {
        setErrorMsg('Please specify your custom Grade/Subject in the "Other" field.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Compute effective values (handling 'Other')
    const finalBoard = selectedRole === 'school' ? (board === 'Other' ? otherBoard.trim() : board) : null;
    const finalSchoolType = selectedRole === 'school' ? (schoolType === 'Other' ? otherSchoolType.trim() : schoolType) : null;
    const finalBoardingType = selectedRole === 'school' ? (boardingType === 'Other' ? otherBoardingType.trim() : boardingType) : null;
    const finalDesignation = selectedRole === 'school' ? (designation === 'Other' ? otherDesignation.trim() : designation) : null;
    const finalGradeOrSubject = (selectedRole === 'student' || selectedRole === 'teacher')
      ? (gradeOrSubject === 'Other' ? otherGradeOrSubject.trim() : gradeOrSubject.trim())
      : null;

    try {
      const dbRole = selectedRole === 'school' || selectedRole === 'organisation' ? 'organisation' : selectedRole;

      // 1. Update Profile in Supabase
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          phone: cleanPhone,
          organisation: schoolName.trim(),
          city: district.trim(),
          state: stateName,
          district: district.trim(),
          pincode: pincode.trim() || null,
          address: address.trim() || null,
          udise_code: selectedRole === 'school' ? cleanUdise : null,
          school_type: finalSchoolType,
          board: finalBoard,
          boarding_type: finalBoardingType,
          grade_or_subject: finalGradeOrSubject,
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      // 2. Insert / Upsert user role
      await (supabase as any)
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: dbRole,
        }, { onConflict: 'user_id' });

      // 3. Update Auth Metadata
      await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim(),
          phone: cleanPhone,
          is_onboarded: true,
          role: dbRole,
          school_name: schoolName.trim(),
          designation: finalDesignation,
          state: stateName,
          district: district.trim(),
        }
      });

      // 4. Redirect to destination or schools
      const next = searchParams.get('next') || searchParams.get('redirectTo') || '/schools';
      router.replace(next);
    } catch (err: any) {
      console.error('Onboarding submit error:', err);
      setErrorMsg(err.message || 'Something went wrong while saving your profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005689]/10 border border-[#005689]/20 text-[#005689] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CSEEL Onboarding</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight" style={{ color: '#003c6e' }}>
            {step === 1 ? 'Choose Your Role on CSEEL' : 'Complete Your Profile'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {step === 1
              ? 'Select how you plan to use CSEEL to get a personalized experiential learning & portal experience.'
              : `Setting up your details as a ${selectedRole.toUpperCase()}. This helps us verify and tailor your access.`}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 transition-all">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Please check the following:</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 1: ROLE SELECTION
          ═══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Role 1: Student */}
                <div
                  onClick={() => setSelectedRole('student')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'student'
                      ? 'border-[#005689] bg-[#EDF5FA] shadow-md ring-2 ring-[#005689]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">Student</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Learner
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Access virtual labs, STEM simulations, interactive quizzes & NEP 2020 experiential experiments.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedRole === 'student' ? 'border-[#005689] bg-[#005689] text-white' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'student' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Role 2: Teacher */}
                <div
                  onClick={() => setSelectedRole('teacher')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'teacher'
                      ? 'border-[#005689] bg-[#EDF5FA] shadow-md ring-2 ring-[#005689]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">Teacher / Faculty</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Educator
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Access lesson plans, lab guides, practical rubrics & continuous professional development.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedRole === 'teacher' ? 'border-[#005689] bg-[#005689] text-white' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'teacher' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Role 3: School / Institute */}
                <div
                  onClick={() => setSelectedRole('school')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'school'
                      ? 'border-[#005689] bg-[#EDF5FA] shadow-md ring-2 ring-[#005689]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <School className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">School / Institute</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          UDISE Mandatory
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Register institution using mandatory 11-digit UDISE code with auto data lookup and directory listing.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedRole === 'school' ? 'border-[#005689] bg-[#005689] text-white' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'school' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Role 4: Organisation / Partner */}
                <div
                  onClick={() => setSelectedRole('organisation')}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedRole === 'organisation'
                      ? 'border-[#005689] bg-[#EDF5FA] shadow-md ring-2 ring-[#005689]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">Organisation / Partner</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Partner
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        EdTech vendors, CSR foundations, Government departments & lab equipment providers.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      selectedRole === 'organisation' ? 'border-[#005689] bg-[#005689] text-white' : 'border-slate-300'
                    }`}>
                      {selectedRole === 'organisation' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2: FORM DETAILS BASED ON ROLE
          ═══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Back to Step 1 Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#005689] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role ({selectedRole.toUpperCase()})</span>
                </button>
                <span className="text-xs text-slate-400 font-medium">Step 2 of 2</span>
              </div>

              {/* Common: Your Name & Mandatory Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact / Mobile Number <span className="text-rose-600">* (Mandatory)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210 (10 digits)"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  IF ROLE IS SCHOOL / INSTITUTE (UDISE 11-DIGIT MANDATORY GATE)
              ───────────────────────────────────────────────────────────── */}
              {selectedRole === 'school' && (
                <div className="space-y-5 pt-2">
                  
                  {/* UDISE Code Box - Mandatory 11 Digits Gate */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border-2 border-blue-300 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#005689]">
                        <School className="w-5 h-5 shrink-0" />
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          Official UDISE+ Code <span className="text-rose-600">* (Mandatory 11 Digits)</span>
                        </h4>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isUdiseValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cleanUdise.length}/11 Digits
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Enter your official 11-digit UDISE code to unlock school profile fields and auto-fetch institutional records.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          maxLength={11}
                          value={udiseCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setUdiseCode(val);
                            if (val.length === 11) {
                              handleUdiseLookup(val);
                            }
                          }}
                          placeholder="e.g. 07090310120 (Must be exactly 11 digits)"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 font-mono tracking-wider bg-white ${
                            isUdiseValid ? 'border-emerald-400 focus:ring-emerald-500' : 'border-blue-300 focus:ring-[#005689]'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUdiseLookup()}
                        disabled={isFetchingUdise || !isUdiseValid}
                        className="px-5 py-2.5 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {isFetchingUdise ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Fetching...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>Fetch Record</span>
                          </>
                        )}
                      </button>
                    </div>

                    {udiseSuccessMessage && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{udiseSuccessMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* If UDISE is not 11 digits, lock the fields below */}
                  {!isUdiseValid ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm">School Details Locked</h5>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Please enter a complete 11-digit UDISE code above. School registration cannot proceed without a valid UDISE code.
                      </p>
                    </div>
                  ) : (
                    /* Unlocked School Form Fields */
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      
                      {/* School Name & Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            School Name <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="e.g. Modern Public Senior Secondary School"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Your Designation
                          </label>
                          <select
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          >
                            {DESIGNATIONS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          {designation === 'Other' && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                value={otherDesignation}
                                onChange={(e) => setOtherDesignation(e.target.value)}
                                placeholder="Please specify your designation..."
                                className="w-full px-3.5 py-2 rounded-lg border border-blue-300 text-xs sm:text-sm bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* State & District */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            State <span className="text-rose-600">*</span>
                          </label>
                          <select
                            required
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            District <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="e.g. Gurugram / Rewari"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          />
                        </div>
                      </div>

                      {/* Board & School Type & Boarding (with dynamic "Other" inputs) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Board */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Board Affiliation
                          </label>
                          <select
                            value={board}
                            onChange={(e) => setBoard(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          >
                            {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                          {board === 'Other' && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                value={otherBoard}
                                onChange={(e) => setOtherBoard(e.target.value)}
                                placeholder="Specify Board (e.g. Cambridge, CIE)..."
                                className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                              />
                            </div>
                          )}
                        </div>

                        {/* School Type */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            School Type
                          </label>
                          <select
                            value={schoolType}
                            onChange={(e) => setSchoolType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          >
                            {SCHOOL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          {schoolType === 'Other' && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                value={otherSchoolType}
                                onChange={(e) => setOtherSchoolType(e.target.value)}
                                placeholder="Specify School Type..."
                                className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                              />
                            </div>
                          )}
                        </div>

                        {/* Format */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Format / Nature
                          </label>
                          <select
                            value={boardingType}
                            onChange={(e) => setBoardingType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          >
                            {BOARDING_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                          </select>
                          {boardingType === 'Other' && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                value={otherBoardingType}
                                onChange={(e) => setOtherBoardingType(e.target.value)}
                                placeholder="Specify Format..."
                                className="w-full px-3 py-1.5 rounded-lg border border-blue-300 text-xs bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                              />
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Campus Address & Pincode */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Campus Address / Local Area
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. Sector 14, Main Bypass Road"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Pincode
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 122001"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white font-mono"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  IF ROLE IS TEACHER, STUDENT, OR ORGANISATION
              ───────────────────────────────────────────────────────────── */}
              {(selectedRole === 'teacher' || selectedRole === 'student' || selectedRole === 'organisation') && (
                <div className="space-y-4 pt-2">
                  
                  {/* State & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        State <span className="text-rose-600">*</span>
                      </label>
                      <select
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        District <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Rewari / Gurugram / New Delhi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                      />
                    </div>
                  </div>

                  {/* School / College Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {selectedRole === 'organisation' ? 'Organisation / Firm Name *' : 'School / College / Institute Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder={selectedRole === 'organisation' ? 'e.g. STEM Innovation Labs Pvt Ltd' : 'e.g. Delhi Public School / Govt Sr Sec School'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                    />
                  </div>

                  {/* Student Class OR Teacher Subject */}
                  {selectedRole === 'student' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Grade / Class
                      </label>
                      <select
                        value={gradeOrSubject}
                        onChange={(e) => setGradeOrSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                      >
                        <option value="">Select Grade</option>
                        {STUDENT_GRADES.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {gradeOrSubject === 'Other' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            value={otherGradeOrSubject}
                            onChange={(e) => setOtherGradeOrSubject(e.target.value)}
                            placeholder="Please specify your class / degree..."
                            className="w-full px-3.5 py-2 rounded-lg border border-blue-300 text-xs sm:text-sm bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRole === 'teacher' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Primary Subject / Department
                      </label>
                      <select
                        value={gradeOrSubject}
                        onChange={(e) => setGradeOrSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005689] bg-white"
                      >
                        <option value="">Select Subject</option>
                        {TEACHER_SUBJECTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {gradeOrSubject === 'Other' && (
                        <div className="mt-2">
                          <input
                            type="text"
                            required
                            value={otherGradeOrSubject}
                            onChange={(e) => setOtherGradeOrSubject(e.target.value)}
                            placeholder="Please specify your subject / discipline..."
                            className="w-full px-3.5 py-2 rounded-lg border border-blue-300 text-xs sm:text-sm bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || (selectedRole === 'school' && !isUdiseValid)}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Security & Verification Guarantee */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified under CSEEL Academic Trust & NEP 2020 Experiential Guidelines</span>
        </div>

      </div>
    </div>
  );
}
