'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'description', title: '2. Description of Service' },
    { id: 'accounts', title: '3. User Accounts' },
    { id: 'acceptable-use', title: '4. Acceptable Use' },
    { id: 'intellectual-property', title: '5. Intellectual Property' },
    { id: 'institutions', title: '6. School & Institution Terms' },
    { id: 'payment', title: '7. Payment & Subscription' },
    { id: 'disclaimer', title: '8. Disclaimer of Warranties' },
    { id: 'liability', title: '9. Limitation of Liability' },
    { id: 'termination', title: '10. Termination' },
    { id: 'governing-law', title: '11. Governing Law' },
    { id: 'contact', title: '12. Contact Information' },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="min-h-screen bg-[#EDF5FA]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#005689] to-[#003c6e] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white">Terms of Service</h1>
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
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="acceptance">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using the CSEEL platform (Centre for Science, Engineering and Experiential Learning), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="description">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">2. Description of Service</h2>
            <p className="text-gray-700">
              CSEEL is an Indian EdTech platform that provides educational resources, including virtual labs, a comprehensive school directory, and specialized teacher training modules designed to enhance experimental learning.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="accounts">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">3. User Accounts & Registration</h2>
            <p className="text-gray-700 mb-2">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Provide accurate and complete registration information.</li>
              <li>Maintain the security and confidentiality of your credentials.</li>
              <li>Be responsible for all activities that occur under your account.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="acceptable-use">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">4. Acceptable Use Policy</h2>
            <p className="text-gray-700">
              You agree to use CSEEL solely for educational and lawful purposes. You shall not attempt to disrupt the platform, scrape data, distribute malware, or post inappropriate content. Violations may result in immediate account suspension.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="intellectual-property">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">5. Intellectual Property</h2>
            <p className="text-gray-700">
              All platform content, software, and educational materials are owned by CSEEL. Users retain full ownership of the data and content they submit, but grant CSEEL a license to use it to operate the service.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="institutions">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">6. School &amp; Institution Terms</h2>
            <p className="text-gray-700">
              Institutional users must ensure they have the right to share student and teacher data with CSEEL. Institutions are responsible for obtaining necessary parental consents as required by local laws prior to creating accounts for minor students.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="payment">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">7. Payment &amp; Subscription</h2>
            <p className="text-gray-700">
              Certain premium features may require payment or a subscription. All fees are non-refundable unless otherwise required by law. Pricing and subscription models are subject to change with prior notice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="disclaimer">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700">
              The platform is provided &quot;as is&quot; and &quot;as available&quot;. CSEEL disclaims all warranties, express or implied, including the accuracy of educational content or uninterrupted access to the service.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="liability">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">9. Limitation of Liability</h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, CSEEL shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="termination">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">10. Termination</h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your access to CSEEL at our discretion, without notice, for conduct that violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="governing-law">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">11. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Haryana.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" id="contact">
            <h2 className="text-2xl font-bold mb-4 text-[#0D4979]">12. Contact Information</h2>
            <p className="text-gray-700">
              For any questions regarding these Terms, please contact us at:<br/>
              <strong>Email:</strong> ptdevkaushik104@gmail.com <br/>
              <strong>Website:</strong> https://cseel.org
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
