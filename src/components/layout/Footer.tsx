'use client';
import Link from 'next/link';



const Footer = () => {
  return (
    <footer className="bg-topbar text-topbar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="CSEEL" className="h-8 w-8 brightness-200" />
              <span className="text-lg font-bold tracking-wide">C.S.E.E.L</span>
            </Link>
            <p className="text-sm opacity-80">
              Center for Scientific Exploration and Experiential Learning
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/simulations" className="hover:opacity-100 transition-opacity">Simulations</Link></li>
              <li><Link href="/why-cseel" className="hover:opacity-100 transition-opacity">Why CSEEL</Link></li>
              <li><Link href="/for-educators" className="hover:opacity-100 transition-opacity">For Educators</Link></li>
              <li><Link href="/for-students" className="hover:opacity-100 transition-opacity">For Students</Link></li>
              <li><Link href="/compare-plans" className="hover:opacity-100 transition-opacity">Compare Plans</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/our-story" className="hover:opacity-100 transition-opacity">Our Story</Link></li>
              <li><Link href="/team" className="hover:opacity-100 transition-opacity">Team</Link></li>
              <li><Link href="/careers" className="hover:opacity-100 transition-opacity">Careers</Link></li>
              <li><Link href="/blog" className="hover:opacity-100 transition-opacity">Blog</Link></li>
              <li><Link href="/contact-us" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/help" className="hover:opacity-100 transition-opacity">Help Center</Link></li>
              <li><Link href="/get-support" className="hover:opacity-100 transition-opacity">Get Support</Link></li>
              <li><Link href="/terms" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-topbar-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
          © {new Date().getFullYear()} CSEEL. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
