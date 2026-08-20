'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, HelpCircle, LogOut, ChevronDown, LayoutDashboard, ArrowLeft, Home } from "lucide-react";
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

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initials    = displayName.slice(0, 2).toUpperCase();
  const primaryRole = roles[0] || "user";

  const dashboardPath = isOrganisation
    ? "/org"
    : isTeacher
    ? "/teacher"
    : isStudent
    ? "/student"
    : "/user";

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const [canGoBack, setCanGoBack] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const historyLength = window.history.length;
        const prevPath = sessionStorage.getItem('cseel_nav_prev');
        const currentPath = window.location.pathname;

        if (prevPath && prevPath !== currentPath) {
          setCanGoBack(true);
        } else if (historyLength > 2) {
          setCanGoBack(true);
        } else {
          setCanGoBack(false);
        }

        sessionStorage.setItem('cseel_nav_prev', currentPath);
      } catch (e) {
        setCanGoBack(false);
      }
    }
  }, [pathname]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && canGoBack) {
      window.history.back();
    }
  };

  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : [];
  const isSubPage = pathname && pathname !== '/' && pathname !== '';

  return (
    <div className="bg-topbar text-topbar-foreground text-xs md:text-sm border-b border-white/10 relative z-[600]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-1.5 md:py-2 gap-3 min-h-[38px]">
          
          {/* ── LEFT SIDE: WHITE BACK BUTTON & DYNAMIC BREADCRUMB TRAIL ────── */}
          <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
            {isSubPage ? (
              <>
                {/* White Back Button with Fade/Disabled state */}
                <button
                  onClick={canGoBack ? handleBack : undefined}
                  disabled={!canGoBack}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[11px] md:text-xs transition-all shrink-0 shadow-2xs ${
                    canGoBack
                      ? 'bg-white/15 hover:bg-white/25 text-white font-black border-white/30 active:scale-95 group cursor-pointer opacity-100'
                      : 'bg-white/5 text-white/40 border-white/10 opacity-35 cursor-not-allowed pointer-events-none'
                  }`}
                  title={canGoBack ? 'Go Back to Previous Page' : 'No previous history (Refreshed / Entry Page)'}
                >
                  <ArrowLeft className={`w-3.5 h-3.5 ${canGoBack ? 'group-hover:-translate-x-0.5 transition-transform' : ''}`} />
                  <span>Back</span>
                </button>

                {/* Breadcrumbs Trail */}
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] md:text-xs text-white/80 font-medium overflow-hidden">
                  <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors shrink-0">
                    <Home className="w-3 h-3 text-white/70" />
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
                          <span className="text-white font-black truncate max-w-[140px] md:max-w-[240px]">
                            {formattedName}
                          </span>
                        ) : (
                          <Link href={href} className="hover:text-white transition-colors truncate max-w-[110px]">
                            {formattedName}
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-white/70 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white/85">CSEEL National Academic & STEM Research Network</span>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDE: NAVIGATION LINKS & LOGIN / USER PROFILE ────────── */}
          <div className="flex items-center gap-2 md:gap-5 shrink-0 text-xs md:text-sm font-medium">
            <Link href="/" className="hidden md:inline hover:text-white transition-colors whitespace-nowrap">Home</Link>
            <Link href="/feed" className="hover:text-white transition-colors whitespace-nowrap">Community</Link>
            <Link href="/get-support" className="hidden sm:inline hover:text-white transition-colors whitespace-nowrap">Get Support</Link>
            <Link href="/contact-us" className="hidden sm:inline hover:text-white transition-colors whitespace-nowrap">Contact Us</Link>
            
            {/* Admin Governance Quick Link */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-600/60 hover:bg-purple-600 text-white text-[11px] font-black rounded-lg border border-purple-400/40 transition-all shadow-xs"
              title="Open Role-Based Admin Portal"
            >
              <span>Admin Portal</span>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none ml-1">
                  <Avatar className="h-6 w-6 md:h-7 md:w-7 border border-white/30">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-semibold max-w-[110px] truncate text-white">{displayName}</span>
                  <ChevronDown className="h-3 w-3 hidden md:inline text-white/80" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 ${ROLE_COLORS[primaryRole] || "bg-gray-100 text-gray-600"}`}>
                      {ROLE_LABELS[primaryRole] || "User"}
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <LayoutDashboard className="mr-2 h-4 w-4 text-purple-600" /> Admin Portal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(dashboardPath)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`${dashboardPath}/profile` === "/user/profile" ? "/user/profile" : dashboardPath)}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/help")}>
                    <HelpCircle className="mr-2 h-4 w-4" /> Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="font-bold text-white hover:text-white/80 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-md border border-white/20 transition-all whitespace-nowrap">
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;