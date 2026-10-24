'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  const getLinkClass = (href: string, extra = 'block text-[14px] py-2') => {
    const isActive = pathname === href;
    return `${extra} transition-colors ${
      isActive
        ? 'text-[#006FCC] font-bold'
        : 'text-slate-600 hover:text-[#006FCC] active:text-[#006FCC] focus:text-[#006FCC]'
    }`;
  };

  return (
    <footer
      className="bg-white text-slate-600 border-t border-slate-200 flex justify-center w-full"
      style={{ fontFamily: "'Lato', -apple-system, sans-serif" }}
    >
      <div className="w-full max-w-[1118px] px-4 sm:px-6">
        {/* ── Tier 1: Top Social Bar ("Follow us on:") ── */}
        <div className="flex items-center justify-between sm:justify-start h-[88px] text-[15px] font-bold text-[#003C6E] font-['Montserrat',sans-serif]">
          <span>Follow us on:</span>
          <div className="flex items-center pl-5 gap-3">
            {/* Twitter */}
            <a
              href="https://twitter.com/cseel_org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSEEL on Twitter"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#006FCC] hover:bg-[#EDF5FA] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSEEL on LinkedIn"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#006FCC] hover:bg-[#EDF5FA] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
              </svg>
            </a>

            {/* Blog / Insights */}
            <Link
              href="/blog"
              aria-label="CSEEL Blog & Insights"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#006FCC] hover:bg-[#EDF5FA] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M19.5 12h-1.25c-.69 0-1.25-.56-1.25-1.25C17 7.02 13.98 4 10.25 4H8.75C5.58 4 3 6.58 3 9.75v4.5C3 17.42 5.58 20 8.75 20h6.5c3.17 0 5.75-2.58 5.75-5.75v-1c0-.69-.56-1.25-1.5-1.25zm-10.75-4h1.5c1.1 0 2 .9 2 2s-.9 2-2 2h-1.5c-1.1 0-2-.9-2-2s.9-2 2-2zm6.5 8h-6.5c-1.1 0-2-.9-2-2s.9-2 2-2h6.5c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </Link>

            {/* YouTube */}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CSEEL on YouTube"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#006FCC] hover:bg-[#EDF5FA] transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Tier 2: 4-Column Links Grid with Top & Bottom Divider ── */}
        <div className="border-t border-b border-slate-200 pt-8 pb-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Column 1: Experiential Labs */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[15px] font-bold text-[#003C6E] pb-2 font-['Montserrat',sans-serif]">
                Experiential Labs
              </div>
              <Link href="/steam-lab" className={getLinkClass('/steam-lab')}>
                STEAM & ATL Labs
              </Link>
              <Link href="/makerspace" className={getLinkClass('/makerspace')}>
                Junior Makerspace
              </Link>
              <Link href="/composite-lab" className={getLinkClass('/composite-lab')}>
                Composite Science Lab
              </Link>
              <Link href="/simulations" className={getLinkClass('/simulations')}>
                Simulations Catalog
              </Link>
              <Link href="/steam-lab" className={getLinkClass('/steam-lab')}>
                STEAM & Tinkering Lab
              </Link>
            </div>

            {/* Column 2: Programs & Schools */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[15px] font-bold text-[#003C6E] pb-2 font-['Montserrat',sans-serif]">
                Programs & Schools
              </div>
              <Link href="/schools" className={getLinkClass('/schools')}>
                Schools Directory
              </Link>
              <Link href="/for-educators" className={getLinkClass('/for-educators')}>
                For Educators
              </Link>
              <Link href="/for-students" className={getLinkClass('/for-students')}>
                For Students
              </Link>
              <Link href="/compare-plans" className={getLinkClass('/compare-plans')}>
                Compare Plans
              </Link>
            </div>

            {/* Column 3: Organization */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[15px] font-bold text-[#003C6E] pb-2 font-['Montserrat',sans-serif]">
                Organization
              </div>
              <Link href="/about" className={getLinkClass('/about')}>
                About CSEEL
              </Link>
              <Link href="/why-cseel" className={getLinkClass('/why-cseel')}>
                Why CSEEL
              </Link>
              <Link href="/our-story" className={getLinkClass('/our-story')}>
                Our Story
              </Link>
              <Link href="/careers" className={getLinkClass('/careers')}>
                Careers
              </Link>
            </div>

            {/* Column 4: Support & Resources */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[15px] font-bold text-[#003C6E] pb-2 font-['Montserrat',sans-serif]">
                Support & Resources
              </div>
              <Link href="/help" className={getLinkClass('/help')}>
                Help & Documentation
              </Link>
              <Link href="/get-support" className={getLinkClass('/get-support')}>
                Get Support
              </Link>
              <Link href="/blog" className={getLinkClass('/blog')}>
                Blog & Insights
              </Link>
              <Link href="/contact-us" className={getLinkClass('/contact-us')}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* ── Tier 3: Bottom Utility Bar ("Help   CSEEL   Privacy   Terms") ── */}
        <div className="flex flex-wrap items-center h-[80px] text-[14px] font-medium text-slate-500">
          <Link href="/help" className={getLinkClass('/help', 'pr-10')}>
            Help
          </Link>
          <Link href="/" className={getLinkClass('/', 'pr-10')}>
            CSEEL
          </Link>
          <Link href="/privacy" className={getLinkClass('/privacy', 'pr-10')}>
            Privacy
          </Link>
          <Link href="/terms" className={getLinkClass('/terms', 'pr-10')}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

