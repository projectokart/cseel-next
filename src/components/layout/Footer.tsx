'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  const getLinkClass = (href: string, extra = 'block text-[14px] py-2') => {
    const isActive = pathname === href;
    return `${extra} transition-colors ${
      isActive
        ? 'text-[#1A73E8] font-medium'
        : 'text-[#5F6368] hover:text-[#1A73E8] active:text-[#1A73E8] focus:text-[#1A73E8]'
    }`;
  };

  return (
    <footer
      className="bg-white text-[#5F6368] border-t border-[rgba(0,0,0,0.12)] flex justify-center w-full"
      style={{ fontFamily: 'var(--font-roboto), Roboto, Arial, sans-serif' }}
    >
      <div className="w-full max-w-[1118px] px-4 sm:px-6">
        {/* ── Tier 1: Top Social Bar ("Follow us on:") ── */}
        <div className="flex items-center justify-between sm:justify-start h-[96px] text-[16px] font-medium leading-[24px] text-[#5F6368]">
          <span>Follow us on:</span>
          <div className="flex items-center pl-5 gap-3">
            {/* Twitter — Official Bird Glyph, Twitter Blue on Hover */}
            <a
              href="https://twitter.com/cseel_org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSEEL on Twitter"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6368] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>

            {/* LinkedIn — Official LinkedIn Glyph, LinkedIn Blue on Hover */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow CSEEL on LinkedIn"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6368] hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
              </svg>
            </a>

            {/* Blog / Insights — Official Blogger Glyph, Orange on Hover */}
            <Link
              href="/blog"
              aria-label="CSEEL Blog & Insights"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6368] hover:text-[#FF5722] hover:bg-[#FF5722]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M19.5 12h-1.25c-.69 0-1.25-.56-1.25-1.25C17 7.02 13.98 4 10.25 4H8.75C5.58 4 3 6.58 3 9.75v4.5C3 17.42 5.58 20 8.75 20h6.5c3.17 0 5.75-2.58 5.75-5.75v-1c0-.69-.56-1.25-1.5-1.25zm-10.75-4h1.5c1.1 0 2 .9 2 2s-.9 2-2 2h-1.5c-1.1 0-2-.9-2-2s.9-2 2-2zm6.5 8h-6.5c-1.1 0-2-.9-2-2s.9-2 2-2h6.5c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </Link>

            {/* YouTube — Official YouTube Play Glyph, Red on Hover */}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CSEEL on YouTube"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6368] hover:text-[#FF0000] hover:bg-[#FF0000]/10 transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Tier 2: 4-Column Links Grid with Top & Bottom Divider ── */}
        <div className="border-t border-b border-[rgba(0,0,0,0.12)] pt-6 pb-4">
          <div className="flex flex-col md:flex-row">
            {/* Column 1: Experiential Labs */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[16px] font-normal leading-[24px] text-[#3C4043] pb-2 pt-4 md:pt-0">
                Experiential Labs
              </div>
              <Link href="/steam-lab" className={getLinkClass('/steam-lab')}>
                STEAM & ATL Labs
              </Link>
              <Link href="/simulations" className={getLinkClass('/simulations')}>
                Simulations Catalog
              </Link>
              <Link href="/virtual-lab-tour" className={getLinkClass('/virtual-lab-tour')}>
                Live Lab Tour
              </Link>
            </div>

            {/* Column 2: Programs & Schools */}
            <div className="flex-1 min-h-[140px] md:min-h-0">
              <div className="text-[16px] font-normal leading-[24px] text-[#3C4043] pb-2 pt-4 md:pt-0">
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
              <div className="text-[16px] font-normal leading-[24px] text-[#3C4043] pb-2 pt-4 md:pt-0">
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
              <div className="text-[16px] font-normal leading-[24px] text-[#3C4043] pb-2 pt-4 md:pt-0">
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
        <div className="flex flex-wrap items-center h-[96px] text-[14px] font-medium text-[#5F6368]">
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

