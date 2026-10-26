'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Settings, HelpCircle, LogOut, ChevronDown, LayoutDashboard,
  ArrowLeft, Home, Headphones, Mail, LogIn, Users, Briefcase,
  Edit3, PlusCircle, Clock, ShieldCheck, Sparkles
} from "lucide-react";
import dynamic from 'next/dynamic';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddSchoolModal = dynamic(() => import('@/components/schools/AddSchoolModal'), { ssr: false });

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
  const [userSchoolClaim, setUserSchoolClaim] = useState<any | null>(null);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setUserSchoolClaim(null);
      return;
    }
    let isCancelled = false;
    async function checkSchool() {
      try {
        const res = await fetch(`/api/school-claim/auth-status?user_id=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email || '')}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isCancelled && data.success) {
          setUserSchoolClaim(data.primarySchool || null);
        }
      } catch (_) {}
    }
    checkSchool();
    return () => { isCancelled = true; };
  }, [user]);

  const meta = user?.user_metadata;
  const avatarUrl = meta?.avatar_url || meta?.picture || "";
  const displayName =
    meta?.full_name ||
    meta?.name ||
    meta?.display_name ||
    user?.email?.split("@")[0] ||
    "User";
  const initials    = (displayName || "US").slice(0, 2).toUpperCase();
  const primaryRole = (roles && roles.length > 0) ? roles[0] : "user";

  const dashboardPath = "/dashboard";

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

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement | null>(null);
  const profileOpenTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
const [localProfile, setLocalProfile] = useState<any | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cseel_user_profile');
      if (stored) setLocalProfile(JSON.parse(stored));
    } catch (e) {}
  }, [profileMenuOpen]);

  const clearProfileTimers = () => {
    if (profileOpenTimer.current) {
      clearTimeout(profileOpenTimer.current);
      profileOpenTimer.current = null;
    }
    if (profileCloseTimer.current) {
      clearTimeout(profileCloseTimer.current);
      profileCloseTimer.current = null;
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        clearProfileTimers();
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      clearProfileTimers();
    };
  }, []);

  const handleProfileMouseEnter = () => {
    clearProfileTimers();
    profileOpenTimer.current = setTimeout(() => {
      setProfileMenuOpen(true);
    }, 180);
  };

  const handleProfileMouseLeave = () => {
    clearProfileTimers();
    profileCloseTimer.current = setTimeout(() => {
      setProfileMenuOpen(false);
    }, 350);
  };

  return (
    <div id="site-topbar" className="site-topbar bg-[#001C33] text-white text-[11px] border-b border-[#002F56]/80 sticky top-0 z-[500] shadow-xs pointer-events-auto font-['Hanken_Grotesk',sans-serif]">
      <div className="container mx-auto px-2.5 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between py-0 gap-2 h-[26px] min-h-[26px] w-full">
          
          {/* ── LEFT SIDE: BACK BUTTON & BRAND / BREADCRUMBS ────────── */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0">
            {isSubPage ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 text-white hover:text-white/80 active:scale-95 font-semibold text-[11px] transition-all shrink-0 cursor-pointer bg-transparent border-0 px-1.5 py-0.5 -ml-1 h-5 touch-manipulation group"
                title="Go Back to Previous Page"
              >
                <ArrowLeft className="w-3 h-3 text-white group-hover:-translate-x-0.5 transition-transform shrink-0" />
                <span className="text-white font-semibold">Back</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-white hover:text-white/80 font-bold text-[11px] shrink-0 transition-colors py-0.5 px-1 touch-manipulation"
              >
                <Home className="w-3 h-3 text-white" />
                <span className="text-white">CSEEL</span>
              </Link>
            )}

            {/* Breadcrumb Trail on Desktop */}
            {isSubPage && (
              <div className="hidden lg:flex items-center gap-1 text-[10.5px] text-white/80 font-medium overflow-hidden">
                <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors shrink-0 text-white/80">
                  <Home className="w-2.5 h-2.5 text-white" />
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
                        <Link href={href} className="text-white/80 hover:text-white transition-colors truncate max-w-[90px]">
                          {formattedName}
                        </Link>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDE: CAREERS | GET SUPPORT | CONTACT US | LOGIN / AVATAR ──── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-[11px] font-semibold">
            
            {/* Careers Link */}
            <Link
              href="/careers"
              aria-label="Careers at CSEEL"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 h-5 justify-center text-white/90 hover:text-white active:scale-95 transition-all shrink-0 touch-manipulation"
              title="Careers at CSEEL"
            >
              <Briefcase className="w-3 h-3 text-white shrink-0" />
              <span className="hidden sm:inline text-white">Careers</span>
            </Link>

            {/* Get Support */}
            <Link
              href="/get-support"
              aria-label="Student and Teacher Support"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 h-5 justify-center text-white/90 hover:text-white active:scale-95 transition-all shrink-0 touch-manipulation"
              title="Helpdesk & Student/Teacher Support"
            >
              <Headphones className="w-3 h-3 text-white shrink-0" />
              <span className="hidden sm:inline text-white">Support</span>
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact-us"
              aria-label="Contact CSEEL Directorate"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 h-5 justify-center text-white/90 hover:text-white active:scale-95 transition-all shrink-0 touch-manipulation"
              title="Contact CSEEL National Directorate"
            >
              <Mail className="w-3 h-3 text-white shrink-0" />
              <span className="hidden sm:inline text-white">Contact</span>
            </Link>

            {/* Login / Circular User Profile Icon (Hover or Click to Open Menu) */}
            {mounted && user ? (
              <div
                ref={profileRef}
                className="relative ml-1 shrink-0"
                onMouseEnter={handleProfileMouseEnter}
                onMouseLeave={handleProfileMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    clearProfileTimers();
                    setProfileMenuOpen((prev) => !prev);
                  }}
                  aria-label="User account menu"
                  title={displayName}
                  className="flex items-center justify-center h-5 w-5 rounded-full ring-1 ring-white/40 hover:ring-2 hover:ring-white transition-all outline-none cursor-pointer shadow-xs overflow-hidden"
                >
                  <Avatar className="h-5 w-5">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />}
                    <AvatarFallback className="bg-[#006FCC] text-white text-[9px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {profileMenuOpen && (
                  <div
                    onMouseEnter={clearProfileTimers}
                    onMouseLeave={handleProfileMouseLeave}
                    className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white text-[#3C4043] shadow-lg border border-gray-200 py-1.5 z-[700] animate-in fade-in duration-150"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-[#202124] truncate">{displayName}</p>
                      <p className="text-xs text-[#5F6368] truncate">{user.email}</p>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${
                          ROLE_COLORS[primaryRole] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ROLE_LABELS[primaryRole] || "User"}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          router.push('/dashboard');
                        }}
                        className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-[#202124] hover:bg-[#F1F3F4] cursor-pointer transition-colors"
                      >
                        <LayoutDashboard className="mr-2.5 h-4 w-4 text-[#006FCC]" />
                        <span>Dashboard</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center px-3.5 py-2 text-xs font-bold text-[#EA4335] hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        <LogOut className="mr-2.5 h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 py-0.5 px-2 text-white/95 hover:text-white active:scale-95 font-semibold text-[11px] transition-all shrink-0 whitespace-nowrap ml-1 cursor-pointer touch-manipulation bg-transparent border-0 h-5"
                title="Sign in to CSEEL Portal"
              >
                <LogIn className="w-3 h-3 text-white shrink-0" />
                <span className="text-white font-semibold">Login</span>
              </Link>
            )}

          </div>

        </div>
      </div>

      {/* Structured School Registration / Claim Modal */}
      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
      />
    </div>
  );
};

export default TopBar;
