'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Settings, HelpCircle, LogOut, ChevronDown, LayoutDashboard,
  ArrowLeft, Home, Headphones, Mail, LogIn, Users
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLE_COLORS: Record<string, string> = {
  organisation: "bg-purple-100 text-purple-700",
  teacher:      "bg-blue-100 text-blue-700",
  student:      "bg-green-100 text-green-700",
  moderator:    "bg-orange-100 text-orange-700",
};

const ROLE_LABELS: Record<string, string> = {
  organisation: "Organisation",
  teacher:      "Teacher",
  student:      "Student",
  moderator:    "Moderator",
};

const TopBar = () => {
  const { user, isTeacher, isStudent, isOrganisation, signOut, roles } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initials    = (displayName || "US").slice(0, 2).toUpperCase();
  const primaryRole = (roles && roles.length > 0) ? roles[0] : "user";

  const dashboardPath = isOrganisation
    ? "/org"
    : isTeacher
    ? "/teacher"
    : isStudent
    ? "/student"
    : "/user";

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch {}
  };

  const isSubPage = pathname && pathname !== '/' && pathname !== '';

  const handleBack = () => {
    try {
      if (typeof window !== 'undefined') {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      }
    } catch {
      router.push('/');
    }
  };

  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : [];

  return (
    <div className="bg-topbar text-topbar-foreground text-xs md:text-sm border-b border-white/10 relative z-[600] select-none">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between py-1.5 md:py-2 gap-2 min-h-[38px] w-full">
          
          {/* ── LEFT SIDE: BACK BUTTON & BRAND / BREADCRUMBS ────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
            {isSubPage ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-[11px] sm:text-xs transition-all border border-white/25 shadow-xs shrink-0 cursor-pointer group"
                title="Go Back to Previous Page"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white font-black text-xs sm:text-sm shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSEEL</span>
              </Link>
            )}

            {/* Breadcrumb Trail on Desktop */}
            {isSubPage && (
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-white/75 font-medium overflow-hidden">
                <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors shrink-0">
                  <Home className="w-3 h-3 text-white/60" />
                  <span>Home</span>
                </Link>

                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;
                  const formattedName = segment
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <React.Fragment key={href}>
                      <span className="text-white/40">/</span>
                      {isLast ? (
                        <span className="text-white font-bold truncate max-w-[160px]">
                          {formattedName}
                        </span>
                      ) : (
                        <Link href={href} className="hover:text-white transition-colors truncate max-w-[90px]">
                          {formattedName}
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDE: COMMUNITY | GET SUPPORT | CONTACT US | LOGIN ──── */}
          {/* Note: Icons on mobile screen, Full labels on tablet/desktop */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 text-xs font-semibold">
            
            {/* Community Feed */}
            <Link
              href="/feed"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all shrink-0"
              title="Community Feed & Discussions"
            >
              <Users className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="hidden sm:inline">Community</span>
            </Link>

            {/* Get Support */}
            <Link
              href="/get-support"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all shrink-0"
              title="Helpdesk & Student/Teacher Support"
            >
              <Headphones className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="hidden sm:inline">Support</span>
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white/90 hover:text-white hover:bg-white/15 transition-all shrink-0"
              title="Contact CSEEL National Directorate"
            >
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">Contact</span>
            </Link>

            {/* Login / User Profile Dropdown */}
            {mounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 transition-all outline-none ml-1 cursor-pointer shrink-0">
                  <Avatar className="h-5 w-5 border border-white/40">
                    <AvatarFallback className="bg-emerald-600 text-white text-[9px] font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline font-bold max-w-[80px] md:max-w-[110px] truncate text-white">{displayName}</span>
                  <ChevronDown className="h-3 w-3 text-white/80 shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-[700]">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-bold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${ROLE_COLORS[primaryRole] || "bg-gray-100 text-gray-600"}`}>
                      {ROLE_LABELS[primaryRole] || "User"}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(dashboardPath)} className="cursor-pointer font-medium">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-emerald-600" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`${dashboardPath}/profile` === "/user/profile" ? "/user/profile" : dashboardPath)} className="cursor-pointer font-medium">
                    <User className="mr-2 h-4 w-4 text-blue-600" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/help")} className="cursor-pointer font-medium">
                    <HelpCircle className="mr-2 h-4 w-4 text-purple-600" /> Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer font-bold">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-950 font-black text-xs rounded-lg hover:bg-white/90 active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap ml-1"
                title="Sign in to CSEEL Portal"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                <span>Login</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;