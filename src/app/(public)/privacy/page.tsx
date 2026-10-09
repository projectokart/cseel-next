'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  const sections = [
    { id: 'information-we-collect', title: '1. Information We Collect' },
    { id: 'how-we-use', title: '2. How We Use Information' },
    { id: 'data-sharing', title: '3. Data Sharing' },
    { id: 'data-security', title: '4. Data Security' },
    { id: 'childrens-privacy', title: '5. Children\'s Privacy' },
    { id: 'your-rights', title: '6. Your Rights' },
    { id: 'cookies-policy', title: '7. Cookies Policy' },
    { id: 'google-oauth', title: '8. Google OAuth Data' },
    { id: 'indian-law', title: '9. Indian Law Compliance' },
    { id: 'contact', title: '10. Contact Information' },
    { id: 'changes', title: '11. Changes to Policy' },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="min-h-screen bg-[#EDF5FA]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#005689] to-[#003c6e] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white">Privacy Policy</h1>
          <p className="text-blue-100 mt-4 text-lg">Last updated: October 8, 2026</p>
        </div>
      </div>

      {/* Content with sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky TOC sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-[#0D4979]">Table of Contents</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#EDF5FA] text-[#005689] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#005689]'
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-8 print:space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="information-we-collect">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">1. Information We Collect</h2>
            <div className="text-gray-700 space-y-3">
              <p>At CSEEL, we collect information to provide a better learning experience. The types of data we collect include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Personal Information:</strong> Name, email address, role (student, teacher, or school administrator), and profile details provided during registration.</li>
                <li><strong>Usage Data:</strong> Information on how you interact with our virtual labs, training modules, and school directory.</li>
                <li><strong>Cookies & Tracking:</strong> Technical data such as IP address, browser type, and session information.</li>
                <li><strong>Google OAuth Data:</strong> When you use Google Login, we receive your basic profile information (name, email, and profile picture).</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="how-we-use">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">2. How We Use Information</h2>
            <div className="text-gray-700 space-y-3">
              <p>The information we collect is used strictly to enhance our platform and provide core services:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Providing and maintaining platform features like virtual labs and teacher training.</li>
                <li>Personalizing your learning experience.</li>
                <li>Communicating critical updates, account notices, and platform changes.</li>
                <li>Analyzing usage patterns to improve performance and usability.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="data-sharing">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">3. Data Sharing</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>We do not sell your personal data.</strong> We only share information with trusted third-party service providers who assist us in operating our platform:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> For secure database management and user authentication.</li>
                <li><strong>Google:</strong> For Google OAuth integration and analytics.</li>
                <li><strong>Vercel:</strong> For secure hosting and infrastructure.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="data-security">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">4. Data Security</h2>
            <p className="text-gray-700">
              We employ industry-standard security measures, including encryption in transit and at rest, to protect your data. All sensitive information is stored securely, and access is strictly limited to authorized personnel only.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="childrens-privacy">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">5. Children&apos;s Privacy</h2>
            <p className="text-gray-700">
              Protecting the privacy of children is critically important. For students under 13 years of age, we require verified parental or guardian consent before an account can be created. We align our practices with global standards similar to COPPA, ensuring data is used solely for educational purposes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="your-rights">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">6. Your Rights</h2>
            <p className="text-gray-700 mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
              <li><strong>Deletion:</strong> Request the deletion of your account and associated data.</li>
              <li><strong>Portability:</strong> Obtain your data in a structured, commonly used format.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="cookies-policy">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">7. Cookies Policy</h2>
            <p className="text-gray-700">
              We use cookies to keep you logged in, remember your preferences, and understand how you interact with our platform. You can manage your cookie preferences through your browser settings, though some features may not function properly if cookies are disabled.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="google-oauth">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">8. Google OAuth Specific Information</h2>
            <p className="text-gray-700">
              By using Google OAuth to sign in, you grant us access to your name, email, and profile picture. We use this exclusively to create and manage your CSEEL account. We do not access your contacts, emails, or Google Drive files. Your use of Google OAuth is also subject to Google&apos;s Privacy Policy.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="indian-law">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">9. Indian Law Compliance</h2>
            <p className="text-gray-700">
              As an Indian EdTech platform, we comply with the Information Technology Act, 2000 and are aligning our practices with the Digital Personal Data Protection (DPDP) Act, 2023. We ensure lawful processing of digital personal data while respecting individuals&apos; rights to privacy.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="contact">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">10. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at: <br/>
              <strong>Email:</strong> ptdevkaushik104@gmail.com <br/>
              <strong>Website:</strong> https://cseel.org
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="changes">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">11. Changes to Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. When we make material changes, we will notify you through the platform or by email. The updated date will be reflected at the top of this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
