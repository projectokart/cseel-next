'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Building2,
  User,
  ShieldCheck,
  Sparkles,
  Mail,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { AppRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { M3Button, M3IconButton, M3AssistChip, M3Card } from '@/components/google-ui';
import { useToast } from '@/hooks/use-toast';

type SignupMethod = 'password' | 'otp';

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const rawRole = searchParams.get('role');
  const initialRole: AppRole =
    rawRole === 'teacher' || rawRole === 'organisation' || rawRole === 'student'
      ? rawRole
      : 'teacher';

  const rawRedirect =
    searchParams.get('redirect') ||
    searchParams.get('returnUrl') ||
    searchParams.get('next') ||
    '';

  const [role, setRole] = useState<AppRole>(initialRole);
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('password');

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    user,
    roles,
    signUp,
    signInWithGoogle,
    signInWithOtp,
    sendEmailOtp,
    sendFirebaseSignInLink,
    sendVerificationEmail,
    signOut,
  } = useAuth();

  const getSafeDestination = (url: string) => {
    if (!url || url === '/' || url === '/signup' || url === '/login') {
      if (role === 'teacher') return '/edu-network/teachers/register';
      if (role === 'organisation') return '/dashboard/school';
      return '/schools';
    }
    return url;
  };

  const targetDestination = getSafeDestination(rawRedirect);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        window.location.href = targetDestination;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, targetDestination]);

  // Google OAuth Sign Up
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle(targetDestination);
      if (error) {
        toast({
          title: 'Google Sign In Failed',
          description: error.message || 'Could not authenticate with Google',
          variant: 'destructive',
        });
        setGoogleLoading(false);
      }
    } catch (err: any) {
      toast({
        title: 'Google Sign In Failed',
        description: err?.message || 'An error occurred during Google authentication',
        variant: 'destructive',
      });
      setGoogleLoading(false);
    }
  };

  // 1. Password Signup Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanName) {
      toast({ title: 'Full Name is required', variant: 'destructive' });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast({ title: 'Valid email address is required', variant: 'destructive' });
      return;
    }
    if (cleanPass.length < 6) {
      toast({ title: 'Password too short', description: 'Minimum 6 characters required', variant: 'destructive' });
      return;
    }
    if (cleanPass !== confirmPassword.trim()) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error, isExistingUser } = await signUp(cleanEmail, cleanPass, role, {
      displayName: cleanName,
    });
    setLoading(false);

    if (error) {
      const isEmailTaken =
        isExistingUser ||
        error.code === 'auth/email-already-in-use' ||
        error.message?.includes('already exists') ||
        error.message?.includes('already in use') ||
        error.message?.includes('EMAIL_EXISTS');

      if (isEmailTaken) {
        toast({
          title: 'Account Already Exists',
          description: 'An account with this email is already registered. Redirecting to Sign In...',
          variant: 'destructive',
        });
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(cleanEmail)}&redirect=${encodeURIComponent(targetDestination)}`);
        }, 1200);
        return;
      }

      toast({
        title: 'Sign Up Failed',
        description: error.message || 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created Successfully!',
        description: `Welcome ${cleanName}. Directing to your workspace...`,
      });
      sendVerificationEmail().catch(() => {});
      window.location.href = targetDestination;
    }
  };

  // 2. OTP Dispatch for Sign Up
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      toast({ title: 'Full Name is required', variant: 'destructive' });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast({ title: 'Valid email is required', variant: 'destructive' });
      return;
    }

    setOtpLoading(true);
    sendFirebaseSignInLink(cleanEmail, targetDestination).catch(() => {});
    const res = await sendEmailOtp(cleanEmail, targetDestination);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(60);
      toast({
        title: 'Verification Code Sent!',
        description: `We've sent a 6-digit verification code to ${cleanEmail}.`,
      });
    } else {
      toast({
        title: 'Failed to Send Code',
        description: res.error || 'Please verify your email address.',
        variant: 'destructive',
      });
    }
  };

  // 3. Verify OTP and Create Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length < 6) {
      toast({ title: 'Incomplete Code', description: 'Please enter the 6-digit code.', variant: 'destructive' });
      return;
    }

    setOtpLoading(true);
    const { error, redirect } = await signInWithOtp(cleanEmail, cleanOtp);
    setOtpLoading(false);

    if (error) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid or expired code.',
        variant: 'destructive',
      });
    } else {
      // Store user metadata
      if (typeof window !== 'undefined') {
        try {
          const registered = JSON.parse(localStorage.getItem('cseel_registered_users') || '{}');
          registered[cleanEmail] = {
            email: cleanEmail,
            displayName: cleanName,
            role,
            verified: true,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('cseel_registered_users', JSON.stringify(registered));
        } catch {}
      }

      toast({
        title: 'Account Verified & Created!',
        description: `Welcome to CSEEL, ${cleanName}!`,
      });
      window.location.href = redirect || targetDestination;
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col lg:flex-row">
      {/* Left Branding */}
      <motion.div
        className="hidden lg:flex lg:w-[42%] about-hero-gradient items-center justify-center p-12"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center max-w-md">
          <div className="inline-block bg-white px-5 py-2.5 rounded-2xl mb-6 shadow-lg">
            <img
              src="/images/logo.png?v=2026"
              alt="CSEEL - Centre for Scientific Exploration & Experiential Learning"
              className="h-14 w-auto max-w-[260px] mx-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">
            {role === 'teacher' ? 'Empowering Indian Educators' : 'CSEEL Learning Network'}
          </h1>
          <p className="text-primary-foreground/85 text-sm leading-relaxed">
            {role === 'teacher'
              ? 'Connect directly with CBSE, ICSE, and IB schools across India. Access verified vacancy alerts and direct HR interviews with zero commission.'
              : 'Explore science laboratories, interactive simulations, and cutting-edge curriculum tools.'}
          </p>
        </div>
      </motion.div>

      {/* Right Form */}
      <motion.div
        className="flex-1 flex items-start justify-center px-4 sm:px-6 pt-6 sm:pt-10 pb-16 bg-background overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md py-2">
          {/* If already signed in */}
          {user ? (
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
                  {user.displayName || user.email?.split('@')[0] || 'Welcome!'}
                </h2>
                <p className="text-xs text-[#444746] mt-1 font-mono">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#c2e7ff] text-xs text-[#0b57d0] space-y-1">
                <p className="font-semibold">You already have an active session.</p>
                <p className="text-[11px] text-[#444746]">Redirecting to {targetDestination}...</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <M3Button
                  variant="filled"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    window.location.href = targetDestination;
                  }}
                >
                  Continue
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
          ) : (
            <div>
              {/* Back to Login */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/login?redirect=${encodeURIComponent(targetDestination)}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#005689] hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Already have an account? Sign In
                </Link>
              </div>

              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f1f1f]">
                  {role === 'teacher' ? 'Create Educator Account' : 'Create Free Account'}
                </h2>
                <p className="text-[#444746] text-xs sm:text-sm mt-1">
                  100% Free Lifetime Access &bull; Verified Academic Network
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#f0f4f9] rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    role === 'teacher'
                      ? 'bg-white text-[#003c6e] shadow-sm'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mb-0.5" />
                  Educator
                </button>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    role === 'student'
                      ? 'bg-white text-[#003c6e] shadow-sm'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  <User className="w-4 h-4 mb-0.5" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('organisation')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                    role === 'organisation'
                      ? 'bg-white text-[#003c6e] shadow-sm'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-0.5" />
                  School / Org
                </button>
              </div>

              {/* ── 1. GOOGLE SIGN UP BUTTON ── */}
              <M3Button
                type="button"
                variant="outlined"
                size="lg"
                fullWidth
                onClick={handleGoogleSignUp}
                disabled={googleLoading || loading || otpLoading}
                className="mb-4 bg-white border-[#747775] text-[#1f1f1f] hover:bg-[#f8fafd]"
                leadingIcon={
                  googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0b57d0]" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )
                }
              >
                Sign up with Google
              </M3Button>

              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-[#c4c7c5] w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-[#444746] uppercase tracking-wider relative shrink-0">
                  or choose signup method
                </span>
                <div className="border-t border-[#c4c7c5] w-full" />
              </div>

              {/* Method Toggle: Email/Password vs Fast OTP */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0f4f9] rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setSignupMethod('password')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    signupMethod === 'password'
                      ? 'bg-white text-[#003c6e] shadow-sm'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Email & Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupMethod('otp')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    signupMethod === 'otp'
                      ? 'bg-white text-[#003c6e] shadow-sm'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Fast OTP Sign Up</span>
                </button>
              </div>

              {/* ── 2. EMAIL & PASSWORD SIGN UP FORM ── */}
              {signupMethod === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-xs font-bold text-[#1f1f1f]">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="e.g. Dr. Ramesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-bold text-[#1f1f1f]">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-pwd" className="text-xs font-bold text-[#1f1f1f]">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-pwd"
                        type={showPwd ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                        <M3IconButton
                          type="button"
                          variant="standard"
                          size="sm"
                          ariaLabel={showPwd ? 'Hide password' : 'Show password'}
                          icon={showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          onClick={() => setShowPwd((v) => !v)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm-pwd" className="text-xs font-bold text-[#1f1f1f]">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signup-confirm-pwd"
                      type="password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-bold shadow-md hover:shadow-lg transition-all bg-[#003c6e] hover:bg-[#002b50] text-white h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                      </span>
                    ) : (
                      `Create ${role === 'teacher' ? 'Educator' : ''} Account`
                    )}
                  </Button>
                </form>
              )}

              {/* ── 3. FAST OTP SIGN UP FORM (NO PASSWORD NEEDED) ── */}
              {signupMethod === 'otp' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="otp-signup-name" className="text-xs font-bold text-[#1f1f1f]">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="otp-signup-name"
                          type="text"
                          placeholder="e.g. Dr. Ramesh Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="otp-signup-email" className="text-xs font-bold text-[#1f1f1f]">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="otp-signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-9"
                          />
                          <Mail className="w-4 h-4 text-[#747775] absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-[11px] text-[#444746] mt-0.5">
                          We will send a 6-digit confirmation code to verify your email.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#003c6e] hover:bg-[#002b50] text-white font-bold h-11"
                        disabled={otpLoading}
                      >
                        {otpLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending Verification Code...
                          </span>
                        ) : (
                          "Send Code"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#c2e7ff] text-xs text-[#0b57d0]">
                        <p className="font-semibold">Code sent to: {email}</p>
                        <p className="text-[11px] text-[#444746] mt-0.5">
                          Enter the 6-digit code sent to your email to activate your account.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signup-otp-input" className="text-xs font-bold text-[#1f1f1f]">
                          6-Digit Verification Code
                        </Label>
                        <Input
                          id="signup-otp-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="000000"
                          value={otpCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                            setOtpCode(val);
                          }}
                          required
                          autoFocus
                          className="text-center text-2xl font-mono tracking-widest font-black h-12"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#003c6e] hover:bg-[#002b50] text-white font-bold h-11"
                        disabled={otpLoading || otpCode.length < 6}
                      >
                        {otpLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Verifying & Activating...
                          </span>
                        ) : (
                          `Verify & Create Account`
                        )}
                      </Button>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode('');
                          }}
                          className="text-[#005689] hover:underline font-semibold"
                        >
                          Change Email
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          disabled={countdown > 0 || otpLoading}
                          className={`flex items-center gap-1 font-semibold ${
                            countdown > 0 ? 'text-[#747775] cursor-not-allowed' : 'text-[#005689] hover:underline'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend Code'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Security info */}
              <div className="mt-6 pt-5 border-t border-[#c4c7c5]/60 flex items-center justify-center gap-2 text-[11px] text-[#444746]">
                <ShieldCheck className="w-4 h-4 text-[#137333]" />
                <span>Protected by CSEEL Security & TLS 1.3</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
