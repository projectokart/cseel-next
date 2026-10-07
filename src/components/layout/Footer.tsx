'use client';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white text-[#023858] border-t border-[#E8E9E9]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4 hover:opacity-95 transition-opacity">
              <img
                src="/images/cseel-logo.png"
                alt="CSEEL - Centre for Scientific Exploration & Experiential Learning"
                className="h-12 w-auto object-contain shrink-0"
              />
            </Link>
            <p className="text-sm text-[#5F6265] leading-relaxed max-w-sm">
              Centre for Scientific Exploration and Experiential Learning — delivering curriculum-aligned virtual and hands-on laboratory practicals for schools and educators across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[15px] font-bold text-[#023858] mb-4 tracking-tight" style={{ color: '#023858' }}>
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/steam-lab" className="text-[#006FCC] font-semibold hover:underline">
                  STEAM & ATL Labs
                </Link>
              </li>
              <li>
                <Link href="/simulations" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Simulations Catalog
                </Link>
              </li>
              <li>
                <Link href="/why-cseel" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Why CSEEL
                </Link>
              </li>
              <li>
                <Link href="/for-educators" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  For Educators
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="/compare-plans" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Compare Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[15px] font-bold text-[#023858] mb-4 tracking-tight" style={{ color: '#023858' }}>
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Leadership & Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Blog & Insights
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-[15px] font-bold text-[#023858] mb-4 tracking-tight" style={{ color: '#023858' }}>
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/help" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Help & Documentation
                </Link>
              </li>
              <li>
                <Link href="/get-support" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Get Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#5F6265] hover:text-[#006FCC] transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E8E9E9] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6265] gap-3">
          <p>© {new Date().getFullYear()} CSEEL (Centre for Scientific Exploration and Experiential Learning). All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/privacy" className="hover:text-[#006FCC] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#006FCC] transition-colors">Terms</Link>
            <Link href="/contact-us" className="hover:text-[#006FCC] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
