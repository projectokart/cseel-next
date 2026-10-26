'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2, FileSpreadsheet, GraduationCap, Building2, Sparkles, Check, Download, ShieldCheck, Upload, User, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { M3Button, M3IconButton, M3AssistChip, M3Card } from "@/components/google-ui";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { INDIAN_STATES_DISTRICTS, INDIA_STATES_LIST, CORE_TEACHING_SUBJECTS } from "@/data/indiaLocations";

// ── Pincode API ───────────────────────────────────────────────────────────────
const fetchPincodeData = async (pincode: string) => {
  try {
    const res  = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const json = await res.json();
    if (json?.[0]?.Status === "Success" && json[0].PostOffice?.length > 0) {
      const po = json[0].PostOffice[0];
      return { district: po.District, state: po.State, country: "India" };
    }
  } catch {}
  return null;
};

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

type Step = "role" | "details" | "credentials";

interface OrgForm {
  org_name: string; phone: string; address: string;
  pincode: string; district: string; state: string; country: string;
}

interface UserForm {
  display_name: string; phone: string;
  institution_id: string; institution_name: string;
}

interface TeacherForm {
  name: string;
  highestQualification: string;
  avatar: string;
  state: string;
  district: string;
  localAddress: string;
  pincode: string;
  subjectTeaching: string;
}

const ROLES: { value: AppRole; label: string; desc: string; accent: string }[] = [
  { value: "student",      label: "Student",      desc: "Access experiments & assignments",  accent: "border-green-400  bg-green-50"  },
  { value: "teacher",      label: "Teacher",      desc: "Manage classes & assignments",       accent: "border-blue-400   bg-blue-50"   },
  { value: "organisation", label: "Organisation", desc: "Institution / centre management",    accent: "border-purple-400 bg-purple-50" },
];

// ─────────────────────────────────────────────────────────────────────────────
const Login = () => {
  // Login
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPwd, setShowPwd]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [forgotMode, setForgotMode]     = useState(false);
  const [isSignup, setIsSignup]         = useState(false);

  // Signup
  const [step, setStep]     = useState<Step>("role");
  const [role, setRole]     = useState<AppRole>("student");
  const [orgForm, setOrgForm] = useState<OrgForm>({
    org_name: "", phone: "", address: "", pincode: "", district: "", state: "", country: "India",
  });
  const [userForm, setUserForm] = useState<UserForm>({
    display_name: "", phone: "", institution_id: "", institution_name: "",
  });
  const [teacherForm, setTeacherForm] = useState<TeacherForm>({
    name: "",
    highestQualification: "",
    avatar: "",
    state: "Haryana",
    district: "Gurugram",
    localAddress: "",
    pincode: "",
    subjectTeaching: "Physics",
  });
  const [customSubject, setCustomSubject] = useState("");
  const [signupEmail, setSignupEmail]         = useState("");
  const [signupPassword, setSignupPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pincodeLoading, setPincodeLoading]   = useState(false);
  const [pincodeOk, setPincodeOk]             = useState(false);
  const [organisations, setOrganisations]     = useState<{ id: string; org_name: string; district: string; state: string }[]>([]);
  const [orgSearch, setOrgSearch]             = useState("");
  const { signIn, signInWithGoogle, signUp, signOut, resetPassword, user, roles, rolesLoading } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParam = searchParams.get('returnUrl') || searchParams.get('redirect') || searchParams.get('next') || '';

  const getSafeDestination = (url: string, currentRoles?: string[]) => {
    if (!url || url === '/' || url === '/login' || url.startsWith('/onboarding') || url.startsWith('/profile/setup')) {
      if (currentRoles?.includes('teacher')) return '/dashboard/teacher';
      if (currentRoles?.includes('organisation')) return '/dashboard/school';
      if (currentRoles?.includes('student')) return '/dashboard/student';
      return '/schools';
    }
    // Remap deleted or legacy routes safely
    if (url === '/dashboard') {
      if (currentRoles?.includes('teacher')) return '/dashboard/teacher';
      if (currentRoles?.includes('organisation')) return '/dashboard/school';
      if (currentRoles?.includes('student')) return '/dashboard/student';
      return '/dashboard/student';
    }
    if (url === '/edu-network/teachers/create-profile') {
      return '/edu-network/teachers';
    }
    return url;
  };

  const returnUrl = getSafeDestination(rawParam, roles);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const target = getSafeDestination(rawParam, roles);
      const { error } = await signInWithGoogle(target);
      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message || "Could not authenticate with Google",
          variant: "destructive"
        });
        setGoogleLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Google Sign In Failed",
        description: err?.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setGoogleLoading(false);
    }
  };

  // Redirect if already logged in — go to safe destination
  useEffect(() => {
    if (user) {
      const dest = getSafeDestination(rawParam, roles);
      const timer = setTimeout(() => {
        window.location.href = dest;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user, rawParam, roles]);

  // Load organisations list when student/teacher reaches details step
  useEffect(() => {
    if ((role === "student" || role === "teacher") && step === "details") {
      (supabase as any).from("organisations")
        .select("id, org_name, district, state")
        .order("org_name")
        .then(({ data }) => { if (data) setOrganisations(data); });
    }
  }, [role, step]);

  // Pincode auto-fill for Organisation
  const handlePincodeChange = async (val: string) => {
    setOrgForm(f => ({ ...f, pincode: val, district: "", state: "", country: "India" }));
    setPincodeOk(false);
    if (val.length === 6 && /^\d{6}$/.test(val)) {
      setPincodeLoading(true);
      const data = await fetchPincodeData(val);
      setPincodeLoading(false);
      if (data) {
        setOrgForm(f => ({ ...f, district: data.district, state: data.state, country: data.country }));
        setPincodeOk(true);
      } else {
        toast({ title: "Invalid pincode", description: "Location data not found", variant: "destructive" });
      }
    }
  };

  // Pincode auto-fill for Teacher
  const handleTeacherPincodeChange = async (val: string) => {
    const cleanPin = val.replace(/[^0-9]/g, '').slice(0, 6);
    setTeacherForm(f => ({ ...f, pincode: cleanPin }));
    setPincodeOk(false);
    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      const data = await fetchPincodeData(cleanPin);
      setPincodeLoading(false);
      if (data) {
        setTeacherForm(f => ({
          ...f,
          district: data.district,
          state: data.state in INDIAN_STATES_DISTRICTS ? data.state : f.state
        }));
        setPincodeOk(true);
      }
    }
  };

  // Teacher photo upload handler
  const handleTeacherPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Max 4MB image allowed", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setTeacherForm(f => ({ ...f, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Strictly restrict administrative credentials on public user login
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    if (cleanPass === 'Dev@12345' || cleanPass === 'dev@12345' || cleanEmail.includes('@123')) {
      setLoading(false);
      toast({
        title: "Administrative Access Restricted",
        description: "Departmental and Super Administrators must log in via the Central Governance Portal (/admin).",
        variant: "destructive",
      });
      return;
    }

    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
  };

    // ── Universal Signup ───────────────────────────────────────────────────────
  const [signupFullName, setSignupFullName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFullName.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (signupPassword.length < 6) {
      toast({ title: "Password too short", description: "Min. 6 characters", variant: "destructive" });
      return;
    }
    if (signupPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, 'student', {
      displayName: signupFullName.trim(),
    });
    setLoading(false);

    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Welcome to CSEEL. Let's explore the platform." });
      // Redirect to safe role-based dashboard or schools
      window.location.href = getSafeDestination(rawParam, roles);
    }
  };

  // ── Forgot ─────────────────────────────────────────────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Reset link sent!" }); setForgotMode(false); }
  };

  const filteredOrgs = organisations.filter(o =>
    o.org_name.toLowerCase().includes(orgSearch.toLowerCase()) ||
    (o.district || "").toLowerCase().includes(orgSearch.toLowerCase())
  );

  const selectSel = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col lg:flex-row">
      {/* Left */}
      <motion.div
        className="hidden lg:flex lg:w-[42%] about-hero-gradient items-center justify-center p-12"
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="inline-block bg-white px-5 py-2.5 rounded-2xl mb-6 shadow-lg">
            <img src="/images/logo.png?v=2026" alt="CSEEL - Centre for Scientific Exploration & Experiential Learning" className="h-14 w-auto max-w-[260px] mx-auto object-contain" />
          </div>
          <p className="text-primary-foreground/80 text-base max-w-md">Centre for Scientific Exploration & Experiential Learning</p>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div
        className="flex-1 flex items-start justify-center px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10 pb-12 bg-background overflow-y-auto"
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md py-1 sm:py-3">

          {/* ── FORGOT PASSWORD ──────────────────────────────────────────── */}
          {forgotMode && (
            <div>
              <button onClick={() => setForgotMode(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to login
              </button>
              <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
              <p className="text-muted-foreground text-sm mb-5">We'll send a reset link to your email</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}</Button>
              </form>
            </div>
          )}

          {/* ── ALREADY LOGGED IN ───────────────────────────────────────── */}
          {user && (
            <M3Card variant="outlined" className="text-center py-6 px-5 space-y-4 bg-[#f8fafd]">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <M3AssistChip
                  label="Currently Signed In"
                  className="h-6 text-[10px] font-bold uppercase tracking-widest bg-[#e6f4ea] border-[#ceead6] text-[#137333] pointer-events-none"
                />
                <h2 className="text-2xl font-black text-[#1f1f1f] mt-2.5">
                  {user.user_metadata?.full_name || 'Welcome Back!'}
                </h2>
                <p className="text-xs text-[#444746] mt-1 font-mono">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#c2e7ff] text-xs text-[#0b57d0] space-y-1">
                <p className="font-semibold">You are already authenticated with your CSEEL account.</p>
                <p className="text-[11px] text-[#444746]">Redirecting to your destination...</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <M3Button
                  variant="filled"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    const dest = getSafeDestination(rawParam, roles);
                    window.location.href = dest;
                  }}
                >
                  Continue to {returnUrl.includes('schools') ? 'Schools Directory' : 'Dashboard'} &rarr;
                </M3Button>
                <M3Button
                  variant="outlined"
                  size="md"
                  fullWidth
                  onClick={() => signOut()}
                  className="!text-[#b3261e] !border-[#f2b8b5] hover:!bg-[#fce8e6]"
                >
                  Sign Out / Switch Account
                </M3Button>
              </div>
            </M3Card>
          )}

          {/* ── LOGIN ────────────────────────────────────────────────────── */}
          {!user && !forgotMode && !isSignup && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1f1f1f] mb-1">Welcome back</h2>
              <p className="text-[#444746] text-xs sm:text-sm mb-4 sm:mb-6">Sign in to your CSEEL account</p>

              {/* Google OAuth Login — Official M3 Outlined Pill Button */}
              <M3Button
                type="button"
                variant="outlined"
                size="lg"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="mb-4 bg-white border-[#747775] text-[#1f1f1f] hover:bg-[#f8fafd]"
                leadingIcon={
                  googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0b57d0]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )
                }
              >
                Continue with Google
              </M3Button>

              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-[#c4c7c5] w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider relative shrink-0">
                  or sign in with email
                </span>
                <div className="border-t border-[#c4c7c5] w-full" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus /></div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Password</Label>
                    <button type="button" onClick={() => setForgotMode(true)} className="text-xs font-semibold text-[#0b57d0] hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <Input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                      <M3IconButton
                        type="button"
                        variant="standard"
                        size="sm"
                        ariaLabel={showPwd ? "Hide password" : "Show password"}
                        icon={showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        onClick={() => setShowPwd(v => !v)}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold shadow-md hover:shadow-lg transition-all" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              {/* ── SECURITY BADGE & FOOTER ── */}
              <div className="mt-6 pt-5 border-t border-[#c4c7c5]/60 flex items-center justify-center gap-2 text-[11px] text-[#444746]">
                <ShieldCheck className="w-4 h-4 text-[#137333]" />
                <span>Enterprise 256-Bit SSL Encrypted Authentication</span>
              </div>

              <p className="text-center text-sm text-[#444746] mt-5">
                Don't have an account?{" "}
                <button onClick={() => { setIsSignup(true); setStep("role"); }} className="text-[#0b57d0] font-bold hover:underline">Sign up</button>
              </p>
            </div>
          )}

          {/* ── UNIVERSAL SIGNUP (ALL USERS SAME) ─────────────────────────── */}
          {!forgotMode && isSignup && (
            <div>
              {/* Back to sign in */}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#005689] hover:underline mb-4 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to sign in</span>
              </button>

              <div className="mb-5">
                <h2 className="text-2xl font-black text-[#003c6e] mb-1">Create Account</h2>
                <p className="text-[#444746] text-xs">
                  Join CSEEL as a universal member. You can complete your profile (School, Teacher, Student) right after login.
                </p>
              </div>

              {/* Google Sign In */}
              <M3Button
                type="button"
                variant="outlined"
                size="lg"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="mb-4 bg-white border-[#747775] text-[#1f1f1f] hover:bg-[#f8fafd]"
                leadingIcon={
                  googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0b57d0]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )
                }
              >
                Sign up with Google
              </M3Button>

              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-[#c4c7c5] w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider relative shrink-0">
                  or sign up with email
                </span>
                <div className="border-t border-[#c4c7c5] w-full" />
              </div>

              <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Arvind Sharma / Sunita Verma"
                    value={signupFullName}
                    onChange={e => setSignupFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Password * (Min. 6 Characters)</Label>
                  <div className="relative">
                    <Input
                      type={showPwd ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                      <M3IconButton
                        type="button"
                        variant="standard"
                        size="sm"
                        ariaLabel={showPwd ? "Hide password" : "Show password"}
                        icon={showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        onClick={() => setShowPwd(v => !v)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Confirm Password *</Label>
                  <Input
                    type={showPwd ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && signupPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-500 font-medium">Passwords don't match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold shadow-md hover:shadow-lg transition-all mt-2 bg-[#005689] hover:bg-[#003c6e] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Account →"}
                </Button>
              </form>

              <p className="text-center text-xs text-[#444746] mt-5">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className="text-[#005689] font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center mt-6">
            <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
