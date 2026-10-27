'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import makerspaceInventory from '@/data/makerspace_inventory.json';
import { getItemImage } from '@/data/makerspaceItemImages';

interface InventoryItem {
  sno: string;
  name: string;
  quantity: string;
}

interface InventorySection {
  id: string;
  title: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
  items: InventoryItem[];
}

export default function MakerspaceClient() {
  const sections = makerspaceInventory as InventorySection[];

  // Navigation Sheet state
  const [isNavSheetOpen, setIsNavSheetOpen] = useState(false);

  // Item Selection state & Long Press handler
  const [selectedItemKeys, setSelectedItemKeys] = useState<Set<string>>(new Set());
  const longPressTimerRef = React.useRef<{ [key: string]: any }>({});
  const isLongPressRef = React.useRef<{ [key: string]: boolean }>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Hero Multi-Step Booking Form state
  const [heroStep, setHeroStep] = useState<1 | 2>(1);
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);
  const [heroFormData, setHeroFormData] = useState({
    countryCode: 'India +91',
    mobileNumber: '',
    email: '',
    childAge: '8',
    timezone: 'Asia/Kolkata',
    childName: '',
    parentName: '',
    courseLanguage: 'English',
    selectedDate: 'Tomorrow (16 Oct)',
    selectedTime: '4:30 PM'
  });

  // Read More Modal State (From Image 3)
  const [readMoreModal, setReadMoreModal] = useState<{
    isOpen: boolean;
    ageBadge: string;
    ageLabel: string;
    title: string;
    level: 'Foundation' | 'Advanced';
  } | null>(null);

  // General Consultation Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    schoolName: '',
    contactName: '',
    phone: '',
    email: '',
    cityState: '',
    studentCount: '40 Students (Standard Cohort)',
    roomSize: '1,500 - 1,800 Sq. Ft.',
    phaseNeeded: 'Phase 1 & 2 (Turnkey Complete)',
    notes: ''
  });

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute total items
  const totalItemCount = useMemo(() => {
    return sections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [sections]);

  // Filtered sections and items
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return sections
      .map(sec => {
        if (selectedSectionId !== 'all' && sec.id !== selectedSectionId) {
          return null;
        }

        if (!q) {
          return sec;
        }

        const matchedItems = sec.items.filter(
          item =>
            item.name.toLowerCase().includes(q) ||
            item.quantity.toLowerCase().includes(q) ||
            sec.title.toLowerCase().includes(q) ||
            sec.badge.toLowerCase().includes(q)
        );

        if (matchedItems.length === 0) return null;

        return {
          ...sec,
          items: matchedItems
        };
      })
      .filter(Boolean) as InventorySection[];
  }, [sections, searchQuery, selectedSectionId]);

  const matchedItemCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [filteredSections]);

  // Item selection & long press helpers
  const toggleItemSelection = (itemKey: string) => {
    setSelectedItemKeys(prev => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const startLongPress = (itemKey: string) => {
    isLongPressRef.current[itemKey] = false;
    if (longPressTimerRef.current[itemKey]) {
      clearTimeout(longPressTimerRef.current[itemKey]);
    }
    longPressTimerRef.current[itemKey] = setTimeout(() => {
      isLongPressRef.current[itemKey] = true;
      toggleItemSelection(itemKey);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(50); } catch {}
      }
    }, 450);
  };

  const cancelLongPress = (itemKey: string) => {
    if (longPressTimerRef.current[itemKey]) {
      clearTimeout(longPressTimerRef.current[itemKey]);
      delete longPressTimerRef.current[itemKey];
    }
  };

  const handleSelectAllMaster = () => {
    const allKeys = new Set<string>();
    sections.forEach(sec => {
      sec.items.forEach(item => {
        allKeys.add(`${sec.id}-${item.sno}`);
      });
    });
    setSelectedItemKeys(allKeys);
  };

  const handleSelectVisible = () => {
    setSelectedItemKeys(prev => {
      const next = new Set(prev);
      filteredSections.forEach(sec => {
        sec.items.forEach(item => {
          next.add(`${sec.id}-${item.sno}`);
        });
      });
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedItemKeys(new Set());
  };

  const handleSelectCategory = (secId: string) => {
    const sec = sections.find(s => s.id === secId);
    if (!sec) return;
    setSelectedItemKeys(prev => {
      const next = new Set(prev);
      const allSecSelected = sec.items.every(it => next.has(`${sec.id}-${it.sno}`));
      sec.items.forEach(it => {
        const k = `${sec.id}-${it.sno}`;
        if (allSecSelected) {
          next.delete(k);
        } else {
          next.add(k);
        }
      });
      return next;
    });
  };

  // Export to Excel (.csv) - ONLY SELECTED ITEMS (or all filtered if none selected)
  const handleExportExcel = () => {
    let itemsToExport: Array<{ sectionTitle: string; sno: string; name: string; quantity: string }> = [];

    if (selectedItemKeys.size > 0) {
      sections.forEach(sec => {
        sec.items.forEach(item => {
          if (selectedItemKeys.has(`${sec.id}-${item.sno}`)) {
            itemsToExport.push({
              sectionTitle: sec.title,
              sno: item.sno,
              name: item.name,
              quantity: item.quantity
            });
          }
        });
      });
    } else {
      filteredSections.forEach(sec => {
        sec.items.forEach(item => {
          itemsToExport.push({
            sectionTitle: sec.title,
            sno: item.sno,
            name: item.name,
            quantity: item.quantity
          });
        });
      });
    }

    if (itemsToExport.length === 0) return;

    const headers = ['"Domain / Category"', '"Item S.No"', '"Material & Equipment Name"', '"Suggested Quantity"'];
    const rows = itemsToExport.map(item => [
      `"${item.sectionTitle.replace(/"/g, '""')}"`,
      `"${item.sno.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.quantity.replace(/"/g, '""')}"`
    ]);

    // Prepend UTF-8 BOM so Excel opens with proper UTF-8 character encoding
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = selectedItemKeys.size > 0
      ? `PRAYOGI_Makerspace_Custom_BOQ_${selectedItemKeys.size}_Selected_Items.csv`
      : 'PRAYOGI_Junior_Makerspace_Complete_Inventory_325_Items.csv';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleHeroStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFormData.mobileNumber || !heroFormData.email) return;
    setHeroStep(2);
  };

  const handleHeroStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormSubmitted(true);
    setTimeout(() => {
      setHeroFormSubmitted(false);
      setHeroStep(1);
      setHeroFormData({
        countryCode: 'India +91',
        mobileNumber: '',
        email: '',
        childAge: '8',
        timezone: 'Asia/Kolkata',
        childName: '',
        parentName: '',
        courseLanguage: 'English',
        selectedDate: 'Tomorrow (16 Oct)',
        selectedTime: '4:30 PM'
      });
    }, 4500);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalSubmitted(false);
      setModalFormData({
        schoolName: '',
        contactName: '',
        phone: '',
        email: '',
        cityState: '',
        studentCount: '40 Students (Standard Cohort)',
        roomSize: '1,500 - 1,800 Sq. Ft.',
        phaseNeeded: 'Phase 1 & 2 (Turnkey Complete)',
        notes: ''
      });
    }, 2500);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavSheetOpen(false);
        setIsModalOpen(false);
        setReadMoreModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navSections = [
    {
      id: 'overview',
      icon: '🚀',
      title: 'Lab Overview',
      subtitle: 'Hands-on STEM lab & consultation',
      badge: 'Hero'
    },
    {
      id: 'how-it-works',
      icon: '⚡',
      title: 'How Prayogi Works',
      subtitle: '4-step pedagogical turnkey setup',
      badge: 'Process'
    },
    {
      id: 'age-tracks',
      icon: '🎯',
      title: 'Age Tracks & Pathways',
      subtitle: 'Programs for ages 6–8, 8–10, 10–13, 13–18',
      badge: '4 Tracks'
    },
    {
      id: 'inventory',
      icon: '📦',
      title: '325 Master Equipment Directory',
      subtitle: 'All 14 categories & turnkey BOQ list',
      badge: '325 Items'
    },
    {
      id: 'roadmap',
      icon: '🗺️',
      title: 'Implementation Roadmap',
      subtitle: 'Phases 1, 2, 3 architectural sequence',
      badge: 'Phases'
    },
    {
      id: 'faq',
      icon: '❓',
      title: 'Frequently Asked Questions',
      subtitle: 'Safety, ATL/NEP alignment & budget',
      badge: 'FAQs'
    }
  ];

  const handleNavClick = (id: string) => {
    setIsNavSheetOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id) || document.getElementById(`section-${id}`);
      if (element) {
        const topOffset = 85;
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - topOffset;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      }
    }, 120);
  };



  return (
    <div
      className="min-h-screen bg-white text-[#1a1a2e]"
      style={{
        fontFamily: "'Outfit', 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* ── GOOGLE FONTS INJECTION FOR TYPOGRAPHY ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        .jl-font-outfit {
          font-family: 'Outfit', sans-serif;
        }
        .jl-btn-yellow {
          background-color: #f9de05;
          color: #1a1a2e;
          font-weight: 800;
          transition: all 0.2s ease;
          box-shadow: 0 4px 18px rgba(249, 222, 5, 0.35);
        }
        .jl-btn-yellow:hover {
          background-color: #e6cc00;
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(249, 222, 5, 0.45);
        }

        /* ── HOW PRAYOGI MAKERSPACE WORKS GLOW CARDS ── */
        .step-glow-card {
          background: #ffffff;
          border: 2px solid #fff380;
          border-radius: 18px;
          box-shadow: 0 0 22px rgba(249, 222, 5, 0.45);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .step-glow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 28px rgba(249, 222, 5, 0.65);
        }
        .step-number-orange {
          width: 48px;
          height: 48px;
          background-color: #ea6421;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
          margin: 0 auto 18px auto;
        }

        /* ── PRAYOGI FIND THE RIGHT PATH STYLES ── */
        .find-path-section {
          background-color: #ffffff;
          width: 100%;
          padding: 70px 20px 80px;
          border-bottom: 1px solid #e2e8f0;
        }
        .find-path-container {
          text-align: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
        }
        .find-path-title {
          color: #1a1a2e;
          margin-bottom: 12px;
          font-size: 38px;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
        }
        .find-path-subtitle {
          color: #555566;
          margin-bottom: 48px;
          font-size: 17px;
          font-family: 'Outfit', sans-serif;
        }
        .age-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 1024px) {
          .age-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 640px) {
          .age-cards-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        .age-card {
          height: 100%;
          text-align: center;
          background-color: #ffd200 !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 22px;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 30px 18px 24px;
          text-decoration: none;
          display: flex;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .age-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(255, 210, 0, 0.5);
        }
        .age-badge {
          color: #0070e0 !important;
          margin-bottom: 8px;
          font-size: 34px;
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
          line-height: 1.1;
        }
        .age-card-title {
          color: #1a1a2e;
          margin-bottom: 8px;
          font-size: 19px;
          font-weight: 900;
          font-family: 'Outfit', sans-serif;
        }
        .age-card-desc {
          color: #1a1a2e;
          flex-grow: 1;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.45;
          font-family: 'Outfit', sans-serif;
          padding: 0 4px;
        }
        .age-card-img-wrap {
          width: 100%;
          max-width: 220px;
          height: 140px;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          background-color: #f1f5f9;
        }
        .age-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .age-card:hover .age-card-img-wrap img {
          transform: scale(1.06);
        }
        .age-card-cta {
          color: #1a1a2e !important;
          font-size: 14px;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s ease;
        }
        .age-card:hover .age-card-cta {
          gap: 8px;
        }
        .button-45 {
          display: inline-block;
          background-color: #ffd200;
          color: #1a1a2e;
          font-weight: 900;
          font-size: 16px;
          padding: 14px 52px;
          border-radius: 14px;
          margin-top: 44px;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
        }
        .button-45:hover {
          background-color: #e6bd00;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 210, 0, 0.55);
        }
      `}</style>

      {/* ── 2. HERO SECTION ── */}
      <section id="overview" className="pt-8 pb-16 md:pt-12 md:pb-20 bg-white overflow-hidden scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow in Official CSEEL Deep Blue */}
          <h2 className="text-lg sm:text-xl font-black text-[#0E5A7A] tracking-tight mb-2">
            The future belongs to the curious.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Headline, Subtitle, 3 Badges, Multi-Step Booking Form */}
            <div className="lg:col-span-6 space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black text-[#1a1a2e] tracking-tight leading-[1.12]">
                Give your school the foundation to<br />
                own the future with Prayogi Makerspace.
              </h1>

              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Structured hands-on STEM, digital fabrication, and prototyping lab built to turn curiosity into capability.
              </p>

              {/* 3 Validation Feature Badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/makerspace/monitor-recorder.svg"
                    alt="Hands-on Tinkering Lab"
                    className="w-5 h-5"
                  />
                  <span className="text-xs font-bold text-[#1a1a2e]">Hands-on Tinkering Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/makerspace/emoji-normal.svg"
                    alt="For ages 6-16 (40 Cohort)"
                    className="w-5 h-5"
                  />
                  <span className="text-xs font-bold text-[#1a1a2e]">For ages 6-16 (40 Cohort)</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/makerspace/icon3.svg"
                    alt="NEP 2020 & ATL 2.0 Aligned"
                    className="w-5 h-5"
                  />
                  <span className="text-xs font-bold text-[#1a1a2e]">NEP 2020 &amp; ATL 2.0 Aligned</span>
                </div>
              </div>

              <div className="pt-1 pb-2">
                <Link
                  href="/makerspace/curriculum"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>📚</span>
                  <span>Explore Makerspace Curriculum (Grades 1–8)</span>
                  <span>→</span>
                </Link>
              </div>

              {/* ── THE 2-STEP INTERACTIVE BOOKING FORM CARD (Image 2) ── */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xl relative">
                {/* Yellow Progress Bar */}
                <div className="mb-5">
                  <div className="text-xs font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Step {heroStep} of 2</span>
                    {heroStep === 2 && (
                      <button
                        type="button"
                        onClick={() => setHeroStep(1)}
                        className="text-xs font-bold text-[#0c5f99] hover:underline"
                      >
                        ← Back to Step 1
                      </button>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full bg-[#f9de05] transition-all duration-300 ${
                        heroStep === 1 ? 'w-1/2' : 'w-full'
                      }`}
                    ></div>
                  </div>
                </div>

                {heroFormSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto">
                      ✓
                    </div>
                    <h3 className="text-xl font-black text-[#1a1a2e]">Slot Reserved Successfully!</h3>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Our academic advisor will send your trial class link and makerspace curriculum guide on WhatsApp.
                    </p>
                  </div>
                ) : heroStep === 1 ? (
                  /* Step 1 */
                  <form onSubmit={handleHeroStep1Submit} className="space-y-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          aria-label="Country Code"
                          value={heroFormData.countryCode}
                          onChange={e => setHeroFormData({ ...heroFormData, countryCode: e.target.value })}
                          className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f9de05]"
                        >
                          <option value="India +91">India +91</option>
                          <option value="US +1">US +1</option>
                          <option value="UK +44">UK +44</option>
                          <option value="UAE +971">UAE +971</option>
                          <option value="Singapore +65">Singapore +65</option>
                        </select>
                        <input
                          type="tel"
                          required
                          placeholder="Enter Mobile Number"
                          value={heroFormData.mobileNumber}
                          onChange={e => setHeroFormData({ ...heroFormData, mobileNumber: e.target.value })}
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Use the number you check on WhatsApp.</p>
                    </div>

                    {/* Email ID */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter Email ID"
                        value={heroFormData.email}
                        onChange={e => setHeroFormData({ ...heroFormData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">We will send class details to this email</p>
                    </div>

                    {/* Child's Age */}
                    <div>
                      <label htmlFor="childAgeSelect" className="block text-xs font-bold text-slate-700 mb-1">
                        Child&apos;s Age
                      </label>
                      <select
                        id="childAgeSelect"
                        aria-label="Child's Age"
                        value={heroFormData.childAge}
                        onChange={e => setHeroFormData({ ...heroFormData, childAge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      >
                        <option value="6">6 years old</option>
                        <option value="7">7 years old</option>
                        <option value="8">8 years old</option>
                        <option value="9">9 years old</option>
                        <option value="10">10 years old</option>
                        <option value="11">11 years old</option>
                        <option value="12">12 years old</option>
                        <option value="13">13 years old</option>
                        <option value="14">14 years old</option>
                        <option value="15">15 years old</option>
                        <option value="16">16+ years old</option>
                      </select>
                    </div>

                    {/* Yellow Button */}
                    <button
                      type="submit"
                      className="jl-btn-yellow w-full py-3.5 rounded-xl text-sm font-black text-[#1a1a2e] cursor-pointer"
                    >
                      Request School Consultation &amp; Quote
                    </button>
                  </form>
                ) : (
                  /* Step 2 */
                  <form onSubmit={handleHeroStep2Submit} className="space-y-4">
                    <div className="p-2.5 rounded-lg bg-[#DCEEEF] border border-[#0E5A7A]/30 text-xs text-[#0E5A7A] font-bold flex items-center justify-between">
                      <span>⏰ Senior Lab Architects Available</span>
                      <span className="text-[#E74C3C] font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E74C3C] animate-ping"></span>
                        Slots Filling Fast
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Coordinator / Principal Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={heroFormData.parentName}
                          onChange={e => setHeroFormData({ ...heroFormData, parentName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#f9de05] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">School / Institution Name</label>
                        <input
                          type="text"
                          required
                          placeholder="School Name"
                          value={heroFormData.childName}
                          onChange={e => setHeroFormData({ ...heroFormData, childName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#f9de05] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Date Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Consultation Date</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Tomorrow (16 Oct)', 'Saturday (17 Oct)', 'Sunday (18 Oct)'].map(d => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setHeroFormData({ ...heroFormData, selectedDate: d })}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                              heroFormData.selectedDate === d
                                ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['4:30 PM', '5:30 PM', '6:30 PM'].map(t => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setHeroFormData({ ...heroFormData, selectedTime: t })}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                              heroFormData.selectedTime === t
                                ? 'bg-[#f9de05] text-[#1a1a2e] border-[#f9de05]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="jl-btn-yellow w-full py-3.5 rounded-xl text-sm font-black text-[#1a1a2e] cursor-pointer"
                    >
                      Confirm Free Consultation Slot
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Hero Graphic with Rocket Makerspace Illustration & Floating Badges */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              {/* Colorful Background Accent Blobs */}
              <div className="absolute top-2 right-4 w-48 h-48 bg-[#ea6421]/20 rounded-full blur-2xl -z-0"></div>
              <div className="absolute top-10 -right-4 w-52 h-52 bg-[#f9de05]/30 rounded-full blur-2xl -z-0"></div>
              <div className="absolute bottom-4 left-4 w-44 h-44 bg-[#3294da]/20 rounded-full blur-2xl -z-0"></div>

              {/* The Hero Image */}
              <div className="relative z-10 max-w-xl w-full">
                <img
                  src="/images/makerspace/hero-rocket-makerspace.png"
                  alt="Young student makers building a rocket in Prayogi Makerspace"
                  className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  fetchPriority="high"
                  decoding="async"
                  width="600"
                  height="450"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. EXACT "HOW PRAYOGI MAKERSPACE WORKS" GLOW CARDS (Image 1) ── */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a2e] tracking-tight mb-2">
            How Prayogi Makerspace Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mb-14">
            From bare room blueprint to student innovation showcase — in 4 simple steps
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
            {/* Step 1 */}
            <div className="bg-white p-7 sm:p-8 rounded-[24px] border-2 border-[#ffde59]/80 shadow-[0_0_28px_rgba(254,218,3,0.42),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                1
              </div>
              <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Space &amp; Safety Audit</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We assess your 1,500–1,800 sq.ft. space, collaborative workbenches, electrical routing, and locked facilitator stations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 sm:p-8 rounded-[24px] border-2 border-[#ffde59]/80 shadow-[0_0_28px_rgba(254,218,3,0.42),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                2
              </div>
              <h3 className="text-lg font-black text-[#1a1a2e] mb-2">325+ Master Supply</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Turnkey delivery of all 14 categories — child-safe tools, robotics kits, 3D pens, circuit supplies, and modular storage.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 sm:p-8 rounded-[24px] border-2 border-[#ffde59]/80 shadow-[0_0_28px_rgba(254,218,3,0.42),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                3
              </div>
              <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Faculty Enablement</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                50+ hours of pedagogical masterclasses for school educators on lesson plans, safety protocols, and NEP 2020 scaffolding.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-7 sm:p-8 rounded-[24px] border-2 border-[#ffde59]/80 shadow-[0_0_28px_rgba(254,218,3,0.42),0_4px_16px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 transition-all flex flex-col justify-start">
              <div className="w-12 h-12 rounded-full bg-[#ff7a00] text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                4
              </div>
              <h3 className="text-lg font-black text-[#1a1a2e] mb-2">Showcase &amp; Faires</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Students construct tangible working models, participate in school maker exhibitions, and prepare portfolios for national STEM faires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FIND THE RIGHT PATH FOR YOUNG INNOVATORS ── */}
      <section id="age-tracks" className="find-path-section scroll-mt-16">
        <div id="pathways" className="relative -top-24" />
        <div className="find-path-container">
          <h2 className="find-path-title">Find the Right Path for Young Innovators</h2>
          <p className="find-path-subtitle">Select your child's age group to see our recommended starting point</p>

          <div className="age-cards-grid">
            {/* Card 1: 6-8 */}
            <div className="age-card">
              <div className="age-badge">6–8</div>
              <h3 className="age-card-title">Young Explorers</h3>
              <p className="age-card-desc">
                Start with Foundation Path: visual coding with Scratch, logic puzzles, and creative projects.
              </p>
              <div className="age-card-img-wrap">
                <img
                  src="/images/makerspace/age-6-8.webp"
                  alt="Young Explorers (Ages 6-8)"
                  loading="lazy"
                  width="220"
                  height="140"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setReadMoreModal({
                    isOpen: true,
                    ageBadge: '6–8',
                    ageLabel: 'Ages 6–8',
                    title: 'Young Explorers',
                    level: 'Foundation'
                  })
                }
                className="age-card-cta cursor-pointer bg-transparent border-none"
              >
                Read More →
              </button>
            </div>

            {/* Card 2: 8-10 */}
            <div className="age-card">
              <div className="age-badge">8–10</div>
              <h3 className="age-card-title">Curious Builders</h3>
              <p className="age-card-desc">
                Foundation or Advanced Path: Python basics, game development, and intro to AI concepts.
              </p>
              <div className="age-card-img-wrap">
                <img
                  src="/images/makerspace/age-8-10.webp"
                  alt="Curious Builders (Ages 8-10)"
                  loading="lazy"
                  width="220"
                  height="140"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setReadMoreModal({
                    isOpen: true,
                    ageBadge: '8–10',
                    ageLabel: 'Ages 8–10',
                    title: 'Curious Builders',
                    level: 'Foundation'
                  })
                }
                className="age-card-cta cursor-pointer bg-transparent border-none"
              >
                Read More →
              </button>
            </div>

            {/* Card 3: 10-13 */}
            <div className="age-card">
              <div className="age-badge">10–13</div>
              <h3 className="age-card-title">Tech Creators</h3>
              <p className="age-card-desc">
                Advanced Path: Python, web apps, robotics projects, and real-world problem solving.
              </p>
              <div className="age-card-img-wrap">
                <img
                  src="/images/makerspace/age-10-13.webp"
                  alt="Tech Creators (Ages 10-13)"
                  loading="lazy"
                  width="220"
                  height="140"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setReadMoreModal({
                    isOpen: true,
                    ageBadge: '10–13',
                    ageLabel: 'Ages 10–13',
                    title: 'Tech Creators',
                    level: 'Advanced'
                  })
                }
                className="age-card-cta cursor-pointer bg-transparent border-none"
              >
                Read More →
              </button>
            </div>

            {/* Card 4: 13-18 */}
            <div className="age-card">
              <div className="age-badge">13–18</div>
              <h3 className="age-card-title">Future Innovators</h3>
              <p className="age-card-desc">
                Pro Path: AI/ML, advanced robotics, competitive programming, and portfolio building.
              </p>
              <div className="age-card-img-wrap">
                <img
                  src="/images/makerspace/age-13-18.webp"
                  alt="Future Innovators (Ages 13-18)"
                  loading="lazy"
                  width="220"
                  height="140"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setReadMoreModal({
                    isOpen: true,
                    ageBadge: '13–18',
                    ageLabel: 'Ages 13–18',
                    title: 'Future Innovators',
                    level: 'Advanced'
                  })
                }
                className="age-card-cta cursor-pointer bg-transparent border-none"
              >
                Read More →
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="button-45"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ── 4. READ MORE POPUP MODAL (Exact Image 3) ── */}
      {readMoreModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setReadMoreModal(null)}
              className="absolute top-5 right-5 w-7 h-7 rounded-full border border-slate-300 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Top Toggle Pills: Foundation vs Advanced */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setReadMoreModal({ ...readMoreModal, level: 'Foundation' })}
                className={`px-5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  readMoreModal.level === 'Foundation'
                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                Foundation
              </button>
              <button
                onClick={() => setReadMoreModal({ ...readMoreModal, level: 'Advanced' })}
                className={`px-5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                  readMoreModal.level === 'Advanced'
                    ? 'bg-[#1a1a2e] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Title & Age Pill */}
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-black text-[#1a1a2e]">
                {readMoreModal.level}
              </h3>
              <span className="px-3 py-1 bg-[#fff9d6] border border-[#f9de05] text-[#b58900] font-bold text-xs rounded-full">
                {readMoreModal.ageLabel}
              </span>
            </div>

            {/* 4 Points with Yellow Circle Radio Icons */}
            <div className="space-y-4 mb-8">
              {readMoreModal.level === 'Foundation' ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Tactile making through paper circuits, cardboard engineering and safe modeling
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Early computational logic with screen-free Bee-Bot floor robots and tangrams
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Child-safe hand tool dexterity using safety snips, rolling pins and measuring rulers
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Collaborative problem-solving on dedicated 4–5 student island workstations
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Micro:bit and Arduino microcontroller programming with real-world sensor rigs
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Rapid digital fabrication using 3D printing pens and enclosed FDM 3D printers
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Mechanical load and stress testing on custom bridge, tower and crane prototypes
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#f9de05] text-[#f9de05] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Competition portfolio readiness aligned with Atal Tinkering &amp; CBSE STEM challenges
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Canary Yellow Button */}
            <button
              onClick={() => {
                setReadMoreModal(null);
                const el = document.getElementById('inventory') || document.getElementById('inventory-directory');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="jl-btn-yellow w-full py-3.5 rounded-xl text-sm font-black text-[#1a1a2e] text-center block cursor-pointer"
            >
              Explore 325 Materials &amp; Get BOQ →
            </button>
          </div>
        </div>
      )}

      {/* ── 5. MASTER 325-ITEM INVENTORY DIRECTORY (ZERO SKIPPED) ── */}
      <section id="inventory" className="py-16 md:py-24 bg-white border-b border-slate-200 scroll-mt-16">
        <div id="inventory-directory" className="relative -top-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Stats */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fff9d6] border border-[#f9de05] text-[#8a6d00] font-black text-xs rounded-full uppercase tracking-wider mb-2">
                Official Master Specification
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a2e] tracking-tight">
                All 325+ Materials & Equipment Items
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                Zero items omitted. Verbatim extraction from the official Prayogi Junior Makerspace master inventory for 40-student cohorts.
              </p>
            </div>

            {/* Quick Action Buttons (Excel Export & Print - NO PDF) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportExcel}
                className="jl-btn-yellow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>
                  {selectedItemKeys.size > 0
                    ? `Export Selected to Excel (${selectedItemKeys.size} Items)`
                    : 'Export Inventory to Excel (.csv)'}
                </span>
              </button>

              <button
                onClick={handleSelectAllMaster}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>✓</span>
                <span>Select All 325</span>
              </button>

              {selectedItemKeys.size > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>✕</span>
                  <span>Clear ({selectedItemKeys.size})</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Print BOQ</span>
              </button>
            </div>
          </div>

          {/* Quick Selection Status & Guidance Strip */}
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-[#f9de05] text-[#1a1a2e] flex items-center justify-center font-black text-[11px] shadow-xs">
                ✓
              </span>
              <span className="font-extrabold text-[#1a1a2e]">
                {selectedItemKeys.size > 0 ? (
                  <span className="text-[#0E5A7A]">
                    {selectedItemKeys.size} of 325 items selected
                  </span>
                ) : (
                  <span>0 of 325 items selected</span>
                )}
              </span>
              <span className="text-slate-400 hidden sm:inline">
                &bull; Tap card or hold to select/unselect items for customized Excel BOQ export
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectVisible}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
              >
                Select Filtered ({matchedItemCount})
              </button>
              {selectedItemKeys.size > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-slate-200 text-red-600 font-bold transition-all cursor-pointer"
                >
                  Deselect All
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                aria-label="Search materials and equipment"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any material e.g. 3D printer, microscope, scissors, breadboard, resistors, screws..."
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-end md:self-auto border border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'cards' ? 'bg-[#1a1a2e] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Card Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'table' ? 'bg-[#1a1a2e] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Specification Table
              </button>
            </div>
          </div>

          {/* 14 Category Filter Chips */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
            <button
              onClick={() => setSelectedSectionId('all')}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                selectedSectionId === 'all'
                  ? 'bg-[#1a1a2e] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 14 Categories ({totalItemCount})
            </button>
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSectionId === sec.id
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={selectedSectionId === sec.id ? { backgroundColor: sec.color } : {}}
              >
                {sec.badge} ({sec.items.length})
              </button>
            ))}
          </div>

          {/* Results Summary Counter */}
          <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center justify-between">
            <div>
              Showing <strong className="text-slate-900 font-black">{matchedItemCount}</strong> of {totalItemCount} items
              {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
            </div>
            {selectedSectionId !== 'all' && (
              <button
                onClick={() => setSelectedSectionId('all')}
                className="text-[#2a7cb7] hover:underline font-bold"
              >
                Clear Filter (Show All 325)
              </button>
            )}
          </div>

          {/* ── INVENTORY CONTENT (CARDS VIEW) ── */}
          {viewMode === 'cards' && (
            <div className="mt-8 space-y-10">
              {filteredSections.map(sec => (
                <div
                  key={sec.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm transition-shadow"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block"
                          style={{ backgroundColor: sec.color }}
                        ></span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          {sec.badge}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#1a1a2e] mt-1">
                        {sec.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                        {sec.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(sec.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#fff9d6] text-slate-700 hover:text-[#8a6d00] font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        Select All in {sec.badge}
                      </button>
                      <span className="px-3.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-full">
                        {sec.items.length} items
                      </span>
                    </div>
                  </div>

                  {/* Items Grid with Authentic Product Images & Selection */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {sec.items.map((item, idx) => {
                      const itemKey = `${sec.id}-${item.sno}`;
                      const isSelected = selectedItemKeys.has(itemKey);
                      const imgUrl = getItemImage(sec.id, item.name, item.sno);

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isLongPressRef.current[itemKey]) {
                              isLongPressRef.current[itemKey] = false;
                              return;
                            }
                            toggleItemSelection(itemKey);
                          }}
                          onPointerDown={() => startLongPress(itemKey)}
                          onPointerUp={() => cancelLongPress(itemKey)}
                          onPointerLeave={() => cancelLongPress(itemKey)}
                          onContextMenu={e => {
                            e.preventDefault();
                            toggleItemSelection(itemKey);
                          }}
                          className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none group ${
                            isSelected
                              ? 'bg-[#fffdeb] border-[#f9de05] ring-2 ring-[#f9de05] shadow-md -translate-y-0.5'
                              : 'bg-[#fafafc] border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          {/* Item Thumbnail Image with Zoom on Hover */}
                          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-xs flex items-center justify-center">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                width="88"
                                height="88"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-1.5 text-center bg-gradient-to-b from-slate-50 to-slate-100/90">
                                <span className="text-xl opacity-30">📦</span>
                              </div>
                            )}
                            {/* Checkbox badge on top-left of image */}
                            <div
                              className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#f9de05] text-[#1a1a2e] shadow-sm font-black'
                                  : 'bg-black/40 backdrop-blur-xs text-transparent hover:bg-black/60 border border-white/60'
                              }`}
                            >
                              ✓
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-black text-slate-500">
                                #{item.sno}
                              </span>
                              <span className="shrink-0 inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#fff9d6] border border-[#f9de05]/70 text-[#8a6d00]">
                                {item.quantity}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-[#0E5A7A] transition-colors">
                              {item.name}
                            </h4>

                            <div className="mt-1.5 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400 capitalize truncate max-w-[120px]">
                                {sec.badge}
                              </span>
                              <span
                                className={`font-bold transition-colors ${
                                  isSelected ? 'text-[#8a6d00]' : 'text-slate-400 group-hover:text-slate-600'
                                }`}
                              >
                                {isSelected ? 'Selected ✓' : 'Hold to Select'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INVENTORY CONTENT (COMPACT TABLE VIEW WITH IMAGES & SELECTION) ── */}
          {viewMode === 'table' && (
            <div className="mt-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1a1a2e] text-white">
                    <tr>
                      <th className="py-3.5 px-4 font-black w-12 text-center">
                        <input
                          type="checkbox"
                          aria-label="Select all visible items"
                          checked={
                            matchedItemCount > 0 &&
                            filteredSections.every(sec =>
                              sec.items.every(item => selectedItemKeys.has(`${sec.id}-${item.sno}`))
                            )
                          }
                          onChange={e => {
                            if (e.target.checked) {
                              handleSelectVisible();
                            } else {
                              handleClearSelection();
                            }
                          }}
                          className="w-4 h-4 rounded text-[#f9de05] focus:ring-[#f9de05] cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-3 font-black w-14">#</th>
                      <th className="py-3.5 px-4 font-black">Domain / Category</th>
                      <th className="py-3.5 px-4 font-black">Material / Equipment Name</th>
                      <th className="py-3.5 px-4 font-black w-52 text-right">Suggested Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSections.flatMap(sec =>
                      sec.items.map((item, i) => {
                        const itemKey = `${sec.id}-${item.sno}`;
                        const isSelected = selectedItemKeys.has(itemKey);
                        const imgUrl = getItemImage(sec.id, item.name, item.sno);

                        return (
                          <tr
                            key={`${sec.id}-${i}`}
                            onClick={() => toggleItemSelection(itemKey)}
                            className={`transition-colors cursor-pointer select-none ${
                              isSelected ? 'bg-[#fffdeb]' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItemSelection(itemKey)}
                                className="w-4 h-4 rounded text-[#f9de05] focus:ring-[#f9de05] cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-400">#{item.sno}</td>
                            <td className="py-3 px-4 font-black" style={{ color: sec.color }}>
                              {sec.badge}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {imgUrl ? (
                                  <div className="relative shrink-0">
                                    <img
                                      src={imgUrl}
                                      alt={item.name}
                                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                      loading="lazy"
                                      decoding="async"
                                      width="40"
                                      height="40"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 text-xs">
                                    📦
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-[#1a1a2e]">{item.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-800 text-right">
                              <span className="inline-block px-2.5 py-0.5 bg-[#fff9d6] rounded-md border border-[#f9de05]/60 text-[#8a6d00]">
                                {item.quantity}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PHASE-WISE ROLLOUT ROADMAP ── */}
      <section id="roadmap" className="py-16 md:py-24 bg-[#fafafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="inline-block px-3.5 py-1.5 bg-[#dcfce7] text-[#15803d] font-black text-xs rounded-full uppercase tracking-wider mb-2">
              Structured Rollout Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a2e] tracking-tight">
              Phase-Wise Implementation Roadmap
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Pedagogical and procurement sequence specified in the Prayogi master architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500 shadow-sm relative">
              <div className="inline-block px-3.5 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-full mb-4">
                Phase 1 • Mandatory Foundation
              </div>
              <h3 className="text-2xl font-black text-[#1a1a2e] mb-2">Essential Setup</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Furniture, open storage, basic tools, art and craft materials, construction materials, starter science resources, safety equipment, signage and consumables.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-blue-500 shadow-sm relative">
              <div className="inline-block px-3.5 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-full mb-4">
                Phase 2 • Core STEM Expansion
              </div>
              <h3 className="text-2xl font-black text-[#1a1a2e] mb-2">STEM & Robotics</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Beginner robotics, coding robots, circuit kits, motors, sensors, measuring tools and engineering kits. Planned around <strong>8–10 group stations for groups of 4–5 children</strong>.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border-2 border-purple-500 shadow-sm relative">
              <div className="inline-block px-3.5 py-1 bg-purple-50 text-purple-700 font-black text-xs rounded-full mb-4">
                Phase 3 • Digital Fabrication
              </div>
              <h3 className="text-2xl font-black text-[#1a1a2e] mb-2">Advanced Prototyping</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Enclosed 3D printers, 3D pens, digital fabrication equipment, advanced robotics and coding computers. Added once safety protocols are established.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ── */}
      <section id="faq" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1.5 bg-slate-100 text-slate-700 font-black text-xs rounded-full uppercase tracking-wider mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a2e] tracking-tight">
              Common Questions on Junior Makerspaces
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is the ideal room size for a Junior Makerspace?',
                a: 'For a standard 40-student cohort, the optimal space requirement is approximately 1,500 to 1,800 sq. ft. This accommodates 8–10 collaborative island worktables (4–5 students per table), a central ideation arena, perimeter storage organizers, facilitator locked cabinets, and wide safe circulation aisles.'
              },
              {
                q: 'Can this makerspace list be customized to our school budget?',
                a: 'Yes. The 325-item master list is divided into Phase 1 (Essential Setup), Phase 2 (STEM Expansion), and Phase 3 (Advanced Digital Fabrication). Schools can start with Phase 1 and scale progressively as student cohorts expand.'
              },
              {
                q: 'How does CSEEL ensure safety for primary-grade students (ages 6–10)?',
                a: 'All student-accessible electronics are strictly low-voltage (AA/AAA batteries or regulated DC up to 12V). Glue guns are low-temperature child safe, scissors are rounded-tip, and sharp tools (utility knives, hand saws, heat guns) remain strictly locked inside facilitator-controlled cabinets.'
              },
              {
                q: 'Does CSEEL provide teacher training alongside equipment supply?',
                a: 'Yes. Every turnkey makerspace installation includes 50+ hours of pedagogical masterclasses, NEP 2020 aligned project manuals, safety certification for lab teachers, and quarterly student competition challenges.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-[#fafafc] transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between font-black text-sm sm:text-base text-[#1a1a2e] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl font-normal text-slate-400 shrink-0 ml-4">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4 bg-white font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGH-IMPACT BOTTOM CTA BANNER ── */}
      <section className="py-20 md:py-28 bg-[#1a1a2e] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-7">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f9de05]/20 text-[#f9de05] text-xs font-black uppercase tracking-wider">
            Turnkey School Delivery Across India
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
            Ready to Build a World-Class Makerspace in Your School?
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
            Get complete turnkey procurement, 3D space architecture blueprints, verified equipment supply, and teacher enablement certified by CSEEL.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="jl-btn-yellow px-8 py-4 rounded-2xl text-base font-black cursor-pointer"
            >
              Request School Consultation & Quote →
            </button>

            <button
              onClick={handleExportExcel}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>📊</span>
              <span>Export Master Inventory to Excel</span>
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-400 pt-4">
            Direct Helpline: <span className="text-[#f9de05] font-black">+91 90507 78830</span> &bull; Email:{' '}
            <span className="text-[#f9de05] font-black">contact@cseel.org</span>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION & QUOTATION MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {modalSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-[#1a1a2e]">
                  Consultation Request Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Our Senior STEM Lab Architect will reach out via WhatsApp/Email within 4 hours with your customized Junior Makerspace BOQ and 3D layout plan.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2a7cb7]">
                    School Consultation
                  </span>
                  <h3 className="text-2xl font-black text-[#1a1a2e] mt-1">
                    Request Custom Makerspace BOQ
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete turnkey quotation, architectural layout, and equipment supply plan.
                  </p>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School / Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi Public School, Gurugram"
                      value={modalFormData.schoolName}
                      onChange={e => setModalFormData({ ...modalFormData, schoolName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Principal / Coordinator"
                        value={modalFormData.contactName}
                        onChange={e => setModalFormData({ ...modalFormData, contactName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={modalFormData.phone}
                        onChange={e => setModalFormData({ ...modalFormData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Email ID *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="principal@school.edu.in"
                        value={modalFormData.email}
                        onChange={e => setModalFormData({ ...modalFormData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City & State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rewari, Haryana"
                        value={modalFormData.cityState}
                        onChange={e => setModalFormData({ ...modalFormData, cityState: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f9de05] focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="jl-btn-yellow w-full py-4 rounded-xl text-sm font-black transition-all mt-2 cursor-pointer"
                  >
                    Submit & Receive Custom BOQ Quotation
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Strictly confidential. No spam. You will also receive the PDF directly on WhatsApp.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FLOATING COMPACT MENU BUTTON (ORIGINAL WORKING DESIGN) ── */}
      <button
        type="button"
        onClick={() => setIsNavSheetOpen(true)}
        aria-label="Open page navigation menu"
        className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a2e] hover:bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35),0_0_15px_rgba(249,222,5,0.3)] border-2 border-[#f9de05] hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#f9de05] animate-ping"></span>
        <svg
          className="w-4 h-4 text-[#f9de05] group-hover:rotate-90 transition-transform duration-300 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-xs font-black tracking-wide uppercase pr-0.5 text-[#f9de05]">Menu</span>
      </button>

      {/* ── FLOATING SELECTION & EXCEL ACTION DOCK ── */}
      {selectedItemKeys.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9980] max-w-lg w-[92vw] sm:w-auto bg-[#1a1a2e] text-white rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-2 border-[#f9de05] flex items-center justify-between sm:justify-start gap-3 sm:gap-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#f9de05] text-[#1a1a2e] flex items-center justify-center font-black text-xs shadow-xs">
              ✓
            </span>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">
                {selectedItemKeys.size} Item{selectedItemKeys.size > 1 ? 's' : ''} Selected
              </div>
              <div className="text-[10px] text-slate-400">Ready for Custom BOQ Excel Export</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-[#f9de05] hover:bg-[#e6cc00] text-[#1a1a2e] font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>📊</span>
              <span>Export Excel ({selectedItemKeys.size})</span>
            </button>
            <button
              onClick={handleClearSelection}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── LEFT-SIDE NAVIGATION SHEET (DRAWER) ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsNavSheetOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-[9998] transition-opacity duration-300 ${
          isNavSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Side Sheet Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[9999] w-80 sm:w-96 max-w-[85vw] bg-white text-[#1a1a2e] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isNavSheetOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Page navigation"
      >
        {/* Sheet Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f9de05] text-[#1a1a2e] flex items-center justify-center font-black text-sm shadow-sm border border-[#e6cc00]">
              P
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-[#1a1a2e] uppercase flex items-center gap-1">
                <span>PRAYOGI</span>
                <span className="px-1 py-0.2 bg-[#f9de05] text-[#1a1a2e] text-[9px] font-extrabold rounded">
                  MAKERSPACE
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">Page Quick Navigation</div>
            </div>
          </div>

          <button
            onClick={() => setIsNavSheetOpen(false)}
            aria-label="Close navigation menu"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          {/* Link to Curriculum Hub */}
          <div className="pb-2 px-1">
            <Link
              href="/makerspace/curriculum"
              onClick={() => setIsNavSheetOpen(false)}
              className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 transition-all flex items-start gap-3 group cursor-pointer block"
            >
              <span className="text-xl shrink-0 p-2 rounded-xl bg-orange-100 group-hover:bg-orange-200 transition-colors">
                📚
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-orange-950 group-hover:text-orange-700 transition-colors">
                    Curriculum (Grades 1-8)
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-orange-200 text-orange-900 shrink-0">
                    Grade 1 Active
                  </span>
                </div>
                <p className="text-[11px] text-orange-700 truncate mt-0.5">30 Interactive Chapters &amp; Challenges</p>
              </div>
            </Link>
          </div>

          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Page Sections
          </div>

          {navSections.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-3 group cursor-pointer"
            >
              <span className="text-xl shrink-0 p-2 rounded-xl bg-slate-100 group-hover:bg-[#fff9d6] transition-colors">
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-black text-[#1a1a2e] group-hover:text-[#0c5f99] transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
              </div>
            </button>
          ))}

          {/* Quick Category Jump Pill Strip */}
          <div className="pt-4 border-t border-slate-100 px-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Jump To Material Category (325 Total)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sections.slice(0, 8).map(sec => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    handleNavClick('inventory');
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-[#fff9d6] text-slate-700 transition-colors"
                >
                  {sec.badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sheet Footer Action CTAs */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          <button
            onClick={() => {
              setIsNavSheetOpen(false);
              setIsModalOpen(true);
            }}
            className="jl-btn-yellow w-full py-3 rounded-xl text-xs font-black text-[#1a1a2e] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>💬</span>
            <span>Request Turnkey Lab Consultation</span>
          </button>

          <button
            onClick={() => {
              setIsNavSheetOpen(false);
              handleExportExcel();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer active:scale-95"
          >
            <span>📊</span>
            <span>
              {selectedItemKeys.size > 0
                ? `Export Selected to Excel (${selectedItemKeys.size})`
                : 'Export Master Inventory to Excel'}
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}
