'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Mail,
  KeyRound,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { M3Button, M3IconButton, M3AssistChip, M3Card } from "@/components/google-ui";
import { useToast } from "@/hooks/use-toast";

type AuthTab = "passwordless" | "password";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const rawParam = searchParams.get('returnUrl') || searchParams.get('redirect') || searchParams.get('next') || '';

  const {
    user,
    roles,
    signIn,
    signInWithGoogle,
    signInWithOtp,
    sendEmailOtp,
    sendFirebaseSignInLink,
    completeSignInWithEmailLink,
    signOut,
    resetPassword,
  } = useAuth();

  // Tab & Form States
  const [authTab, setAuthTab] = useState<AuthTab>("passwordless");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const getSafeDestination = (url: string, currentRoles?: string[]) => {
    if (!url || url === '/' || url === '/login' || url === '/signup' || url.startsWith('/onboarding') || url.startsWith('/profile/setup')) {
      if (currentRoles?.includes('teacher')) return '/dashboard/teacher';
      if (currentRoles?.includes('organisation')) return '/dashboard/school';
      if (currentRoles?.includes('student')) return '/dashboard/student';
      return '/schools';
    }
    if (url === '/dashboard') {
      if (currentRoles?.includes('teacher')) return '/dashboard/teacher';
      if (currentRoles?.includes('organisation')) return '/dashboard/school';
      return '/dashboard/student';
    }
    if (url === '/edu-network/teachers/create-profile') {
      return '/edu-network/teachers';
    }
    return url;
  };

  const returnUrl = getSafeDestination(rawParam, roles);

  // Auto-login on mount if URL contains Magic Link / OTP parameters
  useEffect(() => {
    const queryEmail = searchParams.get('email');
    const queryOtp = searchParams.get('otp');

    // 1. If 1-click magic link with OTP code
    if (queryEmail && queryOtp && !user) {
      setEmail(queryEmail);
      setOtpCode(queryOtp);
      setOtpLoading(true);
      signInWithOtp(queryEmail, queryOtp)
        .then((res) => {
          setOtpLoading(false);
          if (!res.error) {
            toast({
              title: "Authenticated!",
              description: "Welcome back! Redirecting to your workspace...",
            });
            window.location.href = res.redirect || returnUrl;
          } else {
            toast({
              title: "Link Expired",
              description: res.error.message || "Please request a new login code.",
              variant: "destructive",
            });
          }
        })
        .catch(() => setOtpLoading(false));
    }

    // 2. If Firebase native email link
    if (typeof window !== 'undefined' && window.location.href.includes('apiKey=') && window.location.href.includes('oobCode=') && !user) {
      completeSignInWithEmailLink(queryEmail || undefined)
        .then((res) => {
          if (res.success) {
            toast({
              title: "Authenticated with Firebase!",
              description: "Redirecting...",
            });
            window.location.href = returnUrl;
          }
        })
        .catch(() => {});
    }
  }, [searchParams, user, returnUrl]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        window.location.href = returnUrl;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user, returnUrl]);

  // Google OAuth Login
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

  // Dispatch OTP & Magic Link
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast({ title: "Valid email required", description: "Please enter your email address to receive your sign-in code.", variant: "destructive" });
      return;
    }

    setOtpLoading(true);

    // Trigger Firebase native passwordless sign in link
    sendFirebaseSignInLink(cleanEmail, returnUrl).catch(() => {});

    // Trigger instant OTP code dispatch
    const res = await sendEmailOtp(cleanEmail, returnUrl);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(60);
      toast({
        title: "Verification Sent!",
        description: `We've sent a 6-digit code and a 1-click magic link to ${cleanEmail}.`,
      });
    } else {
      toast({
        title: "Could not send code",
        description: res.error || "Please verify your email address and try again.",
        variant: "destructive",
      });
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length < 6) {
      toast({ title: "Incomplete Code", description: "Please enter the full 6-digit verification code.", variant: "destructive" });
      return;
    }

    setOtpLoading(true);
    const { error, redirect } = await signInWithOtp(cleanEmail, cleanOtp);
    setOtpLoading(false);

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired code. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed In Successfully!",
        description: "Welcome to CSEEL.",
      });
      window.location.href = redirect || returnUrl;
    }
  };

  // Standard Email & Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Restrict administrative credentials on public portal
    if (cleanPass === 'Dev@12345' || cleanPass === 'dev@12345' || cleanEmail.includes('@123')) {
      toast({
        title: "Administrative Access Restricted",
        description: "Departmental and Super Administrators must log in via the Central Governance Portal (/admin).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(cleanEmail, cleanPass);
    setLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please verify your email and password.",
        variant: "destructive",
      });
    } else {
      window.location.href = returnUrl;
    }
  };

  // Forgot Password
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast({ title: "Valid email required", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(cleanEmail);
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Reset link sent!",
        description: `Check ${cleanEmail} for password reset instructions from Firebase.`,
      });
      setForgotMode(false);
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
          <h1 className="text-2xl font-black text-white mb-2">Welcome to CSEEL</h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            Centre for Scientific Exploration & Experiential Learning &bull; India's Premier Educational Network
          </p>
        </div>
      </motion.div>

      {/* Right Content */}
      <motion.div
        className="flex-1 flex items-start justify-center px-4 sm:px-6 pt-6 sm:pt-10 pb-16 bg-background overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md py-2">
          {/* ── FORGOT PASSWORD ── */}
          {forgotMode && (
            <div>
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="flex items-center gap-1 text-xs font-semibold text-[#005689] hover:underline mb-4 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to login
              </button>
              <h2 className="text-2xl font-bold mb-1 text-[#1f1f1f]">Reset Password</h2>
              <p className="text-[#444746] text-xs sm:text-sm mb-5">
                We'll dispatch a secure reset link directly from Firebase to your email address.
              </p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f1f1f]">Your Account Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#003c6e] hover:bg-[#002b50] text-white font-bold h-11"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link via Firebase"}
                </Button>
              </form>
            </div>
          )}

          {/* ── CURRENTLY SIGNED IN CARD ── */}
          {user && !forgotMode && (
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
                  {user.displayName || user.user_metadata?.full_name || 'Welcome Back!'}
                </h2>
                <p className="text-xs text-[#444746] mt-1 font-mono">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#c2e7ff] text-xs text-[#0b57d0] space-y-1">
                <p className="font-semibold">You are already authenticated with your CSEEL account.</p>
                <p className="text-[11px] text-[#444746]">Redirecting to {returnUrl}...</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <M3Button
                  variant="filled"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    window.location.href = returnUrl;
                  }}
                >
                  Continue &rarr;
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

          {/* ── MAIN LOGIN INTERFACE ── */}
          {!user && !forgotMode && (
            <div>
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1f1f1f]">
                  Sign In to CSEEL
                </h2>
                <p className="text-[#444746] text-xs sm:text-sm mt-1">
                  Access school vacancies, educator dashboard, and scientific simulations.
                </p>
              </div>

              {/* Google OAuth Login */}
              <M3Button
                type="button"
                variant="outlined"
                size="lg"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading || otpLoading}
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

              {/* Login Method Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0f4f9] rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setAuthTab("passwordless")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    authTab === "passwordless"
                      ? "bg-white text-[#003c6e] shadow-sm"
                      : "text-[#444746] hover:text-[#1f1f1f]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Passwordless OTP / Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab("password")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                    authTab === "password"
                      ? "bg-white text-[#003c6e] shadow-sm"
                      : "text-[#444746] hover:text-[#1f1f1f]"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* ── TAB 1: PASSWORDLESS OTP / MAGIC LINK ── */}
              {authTab === "passwordless" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="otp-email" className="text-xs font-bold text-[#1f1f1f]">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="otp-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="pl-9"
                          />
                          <Mail className="w-4 h-4 text-[#747775] absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-[11px] text-[#444746] mt-1">
                          No password required. We'll email you a secure 6-digit OTP code and a 1-click magic link.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#003c6e] hover:bg-[#002b50] text-white font-bold h-11"
                        disabled={otpLoading}
                      >
                        {otpLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending Secure Code...
                          </span>
                        ) : (
                          "Send Login Code & Magic Link &rarr;"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#c2e7ff] text-xs text-[#0b57d0]">
                        <p className="font-semibold">Code sent to: {email}</p>
                        <p className="text-[11px] text-[#444746] mt-0.5">
                          Enter the 6-digit verification code below or tap the link in the email.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="otp-input" className="text-xs font-bold text-[#1f1f1f]">
                          6-Digit Verification Code
                        </Label>
                        <Input
                          id="otp-input"
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
                            <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                          </span>
                        ) : (
                          "Verify & Sign In &rarr;"
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

              {/* ── TAB 2: EMAIL & PASSWORD ── */}
              {authTab === "password" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-xs font-bold text-[#1f1f1f]">
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-pwd" className="text-xs font-bold text-[#1f1f1f]">
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-xs font-semibold text-[#005689] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-pwd"
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Your password"
                      />
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                        <M3IconButton
                          type="button"
                          variant="standard"
                          size="sm"
                          ariaLabel={showPwd ? "Hide password" : "Show password"}
                          icon={showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          onClick={() => setShowPwd((v) => !v)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#003c6e] hover:bg-[#002b50] text-white font-bold h-11"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In &rarr;"}
                  </Button>
                </form>
              )}

              {/* ── SECURITY BADGE & FOOTER ── */}
              <div className="mt-6 pt-5 border-t border-[#c4c7c5]/60 flex items-center justify-center gap-2 text-[11px] text-[#444746]">
                <ShieldCheck className="w-4 h-4 text-[#137333]" />
                <span>Protected by Firebase Secure Cloud Infrastructure</span>
              </div>

              <p className="text-center text-sm text-[#444746] mt-5">
                Don't have an account?{" "}
                <Link
                  href={`/signup?redirect=${encodeURIComponent(returnUrl)}`}
                  className="text-[#005689] font-bold hover:underline"
                >
                  Create Free Account
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
