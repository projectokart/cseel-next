'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Lock, Eye, EyeOff,
  ArrowRight, AlertCircle, ArrowLeft, Building2, Briefcase, GraduationCap,
  Beaker, Wrench, Package, Calendar, Megaphone, CheckCircle2, Shield
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AdminLoginScreen: React.FC = () => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = login(email.trim(), password.trim());
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your administrative credentials.');
    } else if (res.redirectUrl && typeof window !== 'undefined') {
      if (res.redirectUrl.startsWith('http')) {
        window.location.href = res.redirectUrl;
      }
    }
  };

  const quickRoles = [
    { u: 'super@123', label: 'Super Admin' },
    { u: 'marketing@123', label: 'Marketing' },
    { u: 'material@123', label: 'Materials & Lab' },
    { u: 'hr@123', label: 'HR & Careers' },
    { u: 'school@123', label: 'Schools Network' },
    { u: 'science@123', label: 'Science & NEP' },
    { u: 'projectokart@123', label: 'Hardware Kits' },
    { u: 'events@123', label: 'Events & Conclaves' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-background">
      {/* ── LEFT PANEL (MAIN WEBSITE BRANDING GRADIENT) ── */}
      <motion.div
        className="hidden lg:flex lg:w-[42%] about-hero-gradient flex-col items-center justify-between p-12 text-center"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full flex justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-primary-foreground border border-white/15">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Governance</span>
          </div>
        </div>

        <div className="my-auto py-8">
          <img
            src="/images/logo.png"
            alt="CSEEL"
            className="h-20 w-20 mx-auto mb-6 brightness-200 drop-shadow-md"
          />
          <h1 className="text-4xl font-black text-primary-foreground tracking-tight mb-3">
            C.S.E.E.L
          </h1>
          <p className="text-primary-foreground/90 text-base max-w-sm mx-auto leading-relaxed">
            Center for Scientific Exploration and Experiential Learning
          </p>

          <div className="mt-8 pt-8 border-t border-white/15 text-left max-w-xs mx-auto space-y-3">
            <div className="flex items-center gap-3 text-xs text-primary-foreground/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Multi-departmental role-based access</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-foreground/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Zero-trust cryptographic audit logs</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary-foreground/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Real-time CMS, offers and material logistics</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-primary-foreground/70">
          CSEEL Enterprise Governance Framework
        </div>
      </motion.div>

      {/* ── RIGHT PANEL (CLEAN MAIN WEBSITE FORM) ── */}
      <motion.div
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 bg-background overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-md py-4">
          
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to public website</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>Staff Authentication</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
              Admin Portal
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mb-6">
              Sign in with your department or super admin credentials
            </p>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Username or Email</Label>
                <Input
                  id="admin-email"
                  type="text"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. super@123 or hr@123 or marketing@123"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="admin-password">Password</Label>
                  <span className="text-[11px] text-muted-foreground">Default: Dev@12345</span>
                </div>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold shadow-md hover:shadow-lg transition-all mt-2"
                disabled={loading}
              >
                <span>Sign In to Governance Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* Quick role selection buttons (Clean without emojis) */}
            <div className="mt-6 pt-5 border-t border-border space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Quick Select Role:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickRoles.map((item) => (
                  <button
                    key={item.u}
                    type="button"
                    onClick={() => {
                      setEmail(item.u);
                      setPassword('Dev@12345');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/15 hover:text-primary border border-border text-xs font-medium text-muted-foreground transition-all active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enterprise SSL Security Badge */}
            <div className="mt-6 pt-5 border-t border-border flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Enterprise 256-Bit SSL Encrypted Authentication</span>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginScreen;
