'use client';
import Link from 'next/link';
import { ChevronDown, Menu, X, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import { useNavVisibility } from '@/contexts/NavigationContext';

export interface NavChildItem {
  label: string;
  to: string;
  badge?: string;
  badgeText?: string;
  badgeType?: string;
}

export interface NavItem {
  label: string;
  hasDropdown?: boolean;
  isSpecial?: boolean;
  to?: string;
  badge?: string;
  badgeText?: string;
  badgeType?: string;
  children?: NavChildItem[];
}

const navItems: NavItem[] = [
  {
    label: "Library",
    hasDropdown: true,
    children: [
      { label: "Hands-on Experiments", to: "/hands-on-experiments" },
      { label: "hands-on experiments & live labs", to: "/demo" },
      { label: "Projectokart", to: "/projects" },
    ],
  },
  {
    label: "EduNetwork",
    hasDropdown: true,
    isSpecial: true,
    to: "/edu-network",
    children: [
      { label: "Schools & Institutions", to: "/edu-network" },
      { label: "Teaching & Lab Jobs", to: "/edu-network/jobs" },
      { label: "Verified Faculty", to: "/edu-network/teachers" },
      { label: "Student Innovators", to: "/edu-network/students" },
      { label: "Download Credentials", to: "/downloads/CSEEL_EduNetwork_Credentials.csv" },
    ],
  },
  {
    label: "Programs",
    hasDropdown: true,
    children: [
      { label: "Teacher Training", to: "/teacher-training" },
      { label: "Workshops", to: "/workshops" },
      { label: "Research Programs", to: "/research" },
    ],
  },
  {
    label: "Events",
    hasDropdown: true,
    badge: "3",
    badgeText: "Events",
    badgeType: "event",
    children: [
      { label: "Upcoming Events", to: "/events/upcoming", badge: "3", badgeText: "Upcoming", badgeType: "event" },
      { label: "Seminars & Webinars", to: "/seminars", badge: "Live", badgeText: "Live Webinars", badgeType: "live" },
      { label: "Past Events", to: "/events/past" },
      { label: "Exhibitions", to: "/exhibitions" },
    ],
  },
  {
    label: "Why CSEEL",
    hasDropdown: true,
    children: [
      { label: "Why CSEEL", to: "/why-cseel" },
      { label: "For Students", to: "/for-students" },
      { label: "For Educators", to: "/for-educators" },
      { label: "For Institutions", to: "/for-institutions" },
    ],
  },
  {
    label: "Resources",
    hasDropdown: true,
    children: [
      { label: "Lab Materials & Kits", to: "/materials" },
      { label: "Blog", to: "/blog" },
      { label: "Lab Safety & Manuals", to: "/safety" },
      { label: "Media Archive", to: "/media-archive" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    label: "About",
    hasDropdown: true,
    badge: "7",
    badgeText: "Job Opening",
    badgeType: "job",
    children: [
      { label: "Our Story", to: "/our-story" },
      { label: "Team", to: "/team" },
      { label: "Careers", to: "/careers", badge: "7", badgeText: "Job Openings", badgeType: "job" },
      { label: "Contact", to: "/contact-us" },
    ],
  },
];

const Navbar = () => {
  const { navSettings } = useNavVisibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dynamically filter sections and children based on Super Admin toggles
  const visibleNavItems: NavItem[] = navItems.filter((item) => {
    const sectionConfig = navSettings.find(
      (s) => s.label.toLowerCase() === item.label.toLowerCase() || s.id === item.label.toLowerCase().replace(/\s+/g, '-')
    );
    if (sectionConfig && !sectionConfig.enabled) return false;
    return true;
  }).map((item) => {
    if (!item.children) return item;
    const sectionConfig = navSettings.find(
      (s) => s.label.toLowerCase() === item.label.toLowerCase() || s.id === item.label.toLowerCase().replace(/\s+/g, '-')
    );
    if (!sectionConfig || !sectionConfig.children) return item;

    const filteredChildren: NavChildItem[] = item.children.filter((child) => {
      const childConfig = sectionConfig.children?.find(
        (c) => c.route === child.to || c.label.toLowerCase() === child.label.toLowerCase()
      );
      if (childConfig && !childConfig.enabled) return false;
      return true;
    });

    return { ...item, children: filteredChildren };
  });

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => { setOpenDropdown(null); }, 200);
  };

  const handleClick = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className={`bg-background border-b border-border sticky top-0 transition-all duration-300 w-full z-[400]`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="CSEEL Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-primary tracking-wide">C.S.E.E.L</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-0.5">
          {visibleNavItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.to || "#"}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors ${
                  item.isSpecial
                    ? "text-primary font-bold hover:text-primary/80"
                    : "text-foreground hover:text-primary"
                }`}
                onClick={(e) => {
                  if (!item.to) {
                    e.preventDefault();
                    handleClick(item.label);
                  }
                }}
              >
                <span>{item.label}</span>
                {item.isSpecial && (
                  <span className="px-1.5 py-0.2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[9px] font-black uppercase rounded-full tracking-wider shadow-2xs animate-pulse">
                    Hub
                  </span>
                )}
                {item.badgeText && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold shadow-2xs ${
                    item.badgeType === "job"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                      : "bg-amber-50 text-amber-800 border border-amber-300"
                  }`}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        item.badgeType === "job" ? "bg-emerald-400" : "bg-amber-400"
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        item.badgeType === "job" ? "bg-emerald-500" : "bg-amber-500"
                      }`}></span>
                    </span>
                    <span>{item.badgeText}</span>
                    {item.badge && (
                      <span className={`text-[8px] font-black px-1 rounded-full text-white ${
                        item.badgeType === "job" ? "bg-emerald-600" : "bg-amber-600"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
                {item.hasDropdown && (
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                )}
              </Link>

              {item.hasDropdown && openDropdown === item.label && (
                <div
                  className="absolute top-full left-0 bg-background border border-border rounded-xl shadow-xl py-2 min-w-60 z-[410] mt-1 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.to}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <span>{child.label}</span>
                      {'badgeText' in child && child.badgeText && (
                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black shadow-2xs ${
                          child.badgeType === "job"
                            ? "bg-emerald-500 text-white"
                            : child.badgeType === "live"
                            ? "bg-rose-500 text-white animate-pulse"
                            : "bg-amber-500 text-white"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          <span>{child.badgeText} {child.badge && `(${child.badge})`}</span>
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Link href="/compare-plans" className="hidden lg:inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors text-sm">
          Compare Plans
        </Link>

        {/* Mobile menu button */}
        <button className="lg:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden border-t border-border bg-background absolute top-full left-0 w-full shadow-2xl overflow-y-auto max-h-[85vh] transition-all duration-300 ease-in-out z-[410] ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="px-4 py-4 space-y-2">
          {visibleNavItems.map((item) => (
            <div key={item.label} className="flex flex-col border-b border-border/50 pb-1">
              <div className="flex items-center justify-between">
                <Link
                  href={item.to || "#"}
                  className="w-full text-left px-2 py-3 text-sm font-medium text-foreground flex items-center justify-between"
                  onClick={() => {
                    if (item.to) setMobileOpen(false);
                    else setOpenDropdown(openDropdown === item.label ? null : item.label);
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.isSpecial && (
                      <span className="px-1.5 py-0.2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[9px] font-black uppercase rounded-full">
                        Hub
                      </span>
                    )}
                    {item.badgeText && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                        item.badgeType === "job"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{item.badgeText} ({item.badge})</span>
                      </span>
                    )}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openDropdown === item.label ? "rotate-180" : ""}`} />
                </Link>
              </div>
              <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === item.label ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.to}
                      className="flex items-center justify-between px-6 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{child.label}</span>
                      {'badgeText' in child && child.badgeText && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          child.badgeType === "job"
                            ? "bg-emerald-500 text-white"
                            : child.badgeType === "live"
                            ? "bg-rose-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}>
                          {child.badgeText} ({child.badge})
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;