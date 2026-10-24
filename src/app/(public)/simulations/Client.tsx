'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import LazyImage from "@/components/shared/LazyImage";

import { useState, useEffect, useMemo, useRef } from "react";
import PageTransition from "@/components/shared/PageTransition";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpDown, X, Check, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { getExperimentList, onListUpdate, startRealtimeSync } from "@/cache/experimentCache";
import { slugify } from "@/lib/utils";
import { ALL_EXPERIMENTS } from "@/lib/experimentsData";
import ExperimentBottomSheetDrawer from "@/components/experiment/ExperimentBottomSheetDrawer";
import {
  M3Button,
  M3FilterChip,
  M3AssistChip,
  M3ChipSet,
  M3Badge,
  M3IconButton,
  M3LinearProgress,
} from "@/components/google-ui";
const disciplines = ["All", "Chemistry", "Biology", "Physics", "Engineering", "Technology", "Mathematics"];
const ALL_DISCIPLINES = ["Chemistry", "Biology", "Physics", "Engineering", "Technology", "Mathematics"];
const ALL_LEVELS = ["Higher Education", "High School"];
const SORT_OPTIONS = [
  { label: "Most Popular", value: "popularity" },
  { label: "Newest First", value: "newest" },
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
];

const PAGE_SIZE = 30; // max 30 per page

const CardItem = ({
  sim, isSelected, onToggle, onNavigate,
}: {
  sim: any; isSelected: boolean; onToggle: () => void; onNavigate: () => void;
}) => {
  return (
    <div className={`m3-card relative flex flex-row md:flex-col items-center md:items-stretch gap-3 md:gap-0 p-3 md:p-0 transition-all bg-white h-full select-none overflow-hidden ${
      isSelected
        ? "m3-card--selected ring-2 ring-[#0b57d0] border border-[#0b57d0]"
        : "m3-card--outlined hover:shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
    }`}>
      {/* Image — lazy loaded, only navigates */}
      <div
        onClick={(e) => { e.stopPropagation(); onNavigate(); }}
        className="w-24 h-24 md:w-full md:h-48 flex-shrink-0 overflow-hidden rounded-[12px] md:rounded-b-none md:rounded-t-[16px] bg-[#eef3fc] cursor-pointer"
      >
        <LazyImage
          src={sim.thumbnail_url || "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"}
          alt={sim.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Text */}
      <div
        onClick={(e) => { e.stopPropagation(); onNavigate(); }}
        className="flex-1 min-w-0 pr-2 md:px-5 md:pt-4 md:pb-14 cursor-pointer"
      >
        <span className="text-[10px] font-bold text-[#0b57d0] uppercase tracking-wider mb-1 block">
          {sim.subject}
        </span>
        <h3 className="text-[13px] md:text-lg font-bold text-[#1f1f1f] leading-tight line-clamp-2">
          {sim.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 md:mt-3">
          <span className="text-[11px] text-[#041e49] font-semibold px-2.5 py-0.5 bg-[#d3e3fd] rounded-full">
            {sim.class || "Higher Ed"}
          </span>
          {sim.difficulty && (
            <span className="text-[11px] text-[#444746] font-medium px-2.5 py-0.5 bg-[#e9eef6] rounded-full">
              {sim.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Desktop M3 Button */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="hidden md:flex absolute bottom-0 right-0 p-3.5 z-10"
      >
        <M3Button
          size="sm"
          variant={isSelected ? "filled" : "tonal"}
          leadingIcon={isSelected ? <Check /> : undefined}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggle(); }}
        >
          {isSelected ? "Selected" : "+ Select"}
        </M3Button>
      </div>

      {/* Mobile M3 IconButton */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="md:hidden flex-shrink-0 z-10"
      >
        <M3IconButton
          size="sm"
          variant={isSelected ? "filled" : "outlined"}
          selected={isSelected}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggle(); }}
          icon={<Check />}
          label="Select simulation"
        />
      </div>
    </div>
  );
};

const Experiments = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [activeDisciplines, setActiveDisciplines] = useState<string[]>([]);
  const [activeLevel, setActiveLevel] = useState("Higher Education");
  const [activeSort, setActiveSort] = useState("popularity");

  const router = useRouter();
  const { totalItems, isInCart, selectedIds, toggleSelect: cartToggle } = useCart();

  const toggleSelect = (sim: any) => {
    cartToggle({ id: sim.id, title: sim.title, subject: sim.subject, thumbnail_url: sim.thumbnail_url, class: sim.class });
  };

  const [sheetMode, setSheetMode] = useState<"filter" | "sort" | null>(null);
  const [tempDisciplines, setTempDisciplines] = useState<string[]>([]);
  const [tempLevel, setTempLevel] = useState("Higher Education");
  const [tempSort, setTempSort] = useState("popularity");

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragCurrentY = useRef<number>(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeDrawerExp, setActiveDrawerExp] = useState<any | null>(null);

  const allExperiments = useMemo(() => {
    return ALL_EXPERIMENTS.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      subject: e.subject,
      class: e.class,
      difficulty: e.difficulty,
      thumbnail_url: e.thumbnail_url,
      created_at: "2026-01-01",
      popularity: e.views || 80,
    }));
  }, []);

  const filtered = useMemo(() => {
    let result = allExperiments.filter((sim) => {
      const matchSearch =
        !search ||
        sim.title.toLowerCase().includes(search.toLowerCase()) ||
        sim.subject.toLowerCase().includes(search.toLowerCase());

      const matchLevel =
        !activeLevel ||
        activeLevel === "All" ||
        (activeLevel === "Higher Education" && (sim.class?.toLowerCase().includes("higher") || sim.class?.toLowerCase().includes("b") || sim.class?.toLowerCase().includes("11") || sim.class?.toLowerCase().includes("12") || sim.class?.toLowerCase().includes("high") || !sim.class)) ||
        (activeLevel === "High School" && (sim.class?.toLowerCase().includes("high") || sim.class?.toLowerCase().includes("school") || sim.class?.toLowerCase().includes("8") || sim.class?.toLowerCase().includes("9") || sim.class?.toLowerCase().includes("10") || sim.class?.toLowerCase().includes("higher") || !sim.class));

      const matchDiscipline = activeDisciplines.length === 0 || activeDisciplines.includes(sim.subject);
      return matchSearch && matchLevel && matchDiscipline;
    });
    return [...result].sort((a, b) => {
      if (activeSort === "az") return a.title.localeCompare(b.title);
      if (activeSort === "za") return b.title.localeCompare(a.title);
      if (activeSort === "newest") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return (b.popularity || 0) - (a.popularity || 0);
    });
  }, [search, activeLevel, activeDisciplines, activeSort, allExperiments]);

  const displayed = filtered.slice(0, visibleCount);

  // Reset on filter change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, activeLevel, activeDisciplines, activeSort]);


  // Infinite scroll — sentinel observe karo
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const tempFiltered = useMemo(() => {
    return allExperiments.filter((sim) => {
      const matchSearch = sim.title.toLowerCase().includes(search.toLowerCase());
      const matchLevel = (sim.class || "Higher Education") === tempLevel;
      const matchDiscipline = tempDisciplines.length === 0 || tempDisciplines.includes(sim.subject);
      return matchSearch && matchLevel && matchDiscipline;
    });
  }, [search, tempLevel, tempDisciplines, allExperiments]);

  const availableDisciplines = useMemo(() => {
    return ALL_DISCIPLINES.filter((d) =>
      allExperiments.some((sim) =>
        (sim.class || "Higher Education") === tempLevel &&
        sim.subject === d &&
        sim.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [tempLevel, allExperiments, search]);

  const openSheet = (mode: "filter" | "sort") => {
    setTempDisciplines([...activeDisciplines]);
    setTempLevel(activeLevel);
    setTempSort(activeSort);
    setSheetMode(mode);
  };
  const closeSheet = () => setSheetMode(null);
  const applySheet = () => {
    setActiveDisciplines([...tempDisciplines]);
    setActiveLevel(tempLevel);
    setActiveSort(tempSort);
    closeSheet();
  };
  const resetSheet = () => {
    if (sheetMode === "filter") { setTempDisciplines([]); setTempLevel("Higher Education"); }
    else setTempSort("popularity");
  };
  const toggleTempDiscipline = (d: string) => {
    setTempDisciplines((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };
  const handleTouchStart = (e: React.TouchEvent) => { dragStartY.current = e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    dragCurrentY.current = delta;
    if (sheetRef.current && delta > 0) sheetRef.current.style.transform = `translateY(${delta}px)`;
  };
  const handleTouchEnd = () => {
    if (dragCurrentY.current > 80) closeSheet();
    else if (sheetRef.current) sheetRef.current.style.transform = "";
    dragStartY.current = null;
    dragCurrentY.current = 0;
  };

  const activeFilterCount = activeDisciplines.length + (activeLevel !== "Higher Education" ? 1 : 0);
  const isSortActive = activeSort !== "popularity";

  const SheetBody = () => (
    <>
      {sheetMode === "filter" && (
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Level</p>
            <div className="flex flex-col gap-2">
              {ALL_LEVELS.map((l) => (
                <button key={l} onClick={() => setTempLevel(l)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-full text-sm font-medium border transition-all ${
                    tempLevel === l ? "bg-gray-50 border-gray-900 text-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span>{l}</span>
                  {tempLevel === l && <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Check size={11} strokeWidth={3} className="text-white" /></span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Discipline
              {tempDisciplines.length > 0 && <button onClick={() => setTempDisciplines([])} className="ml-2 normal-case text-gray-400 font-medium underline">Clear</button>}
            </p>
            <M3ChipSet>
              {ALL_DISCIPLINES.map((d) => {
                const isAvailable = availableDisciplines.includes(d);
                const isSel = tempDisciplines.includes(d);
                return (
                  <M3FilterChip
                    key={d}
                    label={d}
                    selected={isSel}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && toggleTempDiscipline(d)}
                  />
                );
              })}
            </M3ChipSet>
          </div>
        </div>
      )}
      {sheetMode === "sort" && (
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setTempSort(opt.value)}
              className={`flex items-center justify-between w-full px-4 py-3.5 rounded-[12px] text-sm font-semibold border transition-all ${
                tempSort === opt.value ? "bg-[#c2e7ff] border-[#0b57d0] text-[#001d35]" : "bg-white border-[#c4c7c5] text-[#444746] hover:bg-[#f8fafd]"
              }`}>
              <span>{opt.label}</span>
              {tempSort === opt.value && <span className="w-5 h-5 bg-[#0b57d0] rounded-full flex items-center justify-center"><Check size={11} strokeWidth={3} className="text-white" /></span>}
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <PageTransition>
      
      <>
{/* STICKY HEADER */}
        <div className="sticky top-0 z-[300] bg-white/95 backdrop-blur-md border-b border-[#dadce0] shadow-xs">
          <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center gap-3">
            <div className="relative flex-1 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444746]">
                <Search size={18} strokeWidth={2.5} />
              </span>
              <input
                type="text"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#eef3fc] hover:bg-[#e3e9f4] border-none rounded-full text-sm text-[#1f1f1f] outline-none focus:ring-2 focus:ring-[#0b57d0] transition-all" />
            </div>
            <M3Badge variant="large" count={selectedIds.length} color="primary" className={selectedIds.length === 0 ? "hidden" : ""}>
              <M3IconButton
                variant="tonal"
                onClick={() => router.push("/my-selections")}
                icon={<BookmarkCheck />}
                label="My Selected Experiments"
              />
            </M3Badge>
          </div>

          <div className="max-w-7xl mx-auto px-4 pb-2 flex flex-col gap-3">
            <M3ChipSet scrollable>
              <M3AssistChip
                leadingIcon={<Filter />}
                label={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
                elevated={activeFilterCount > 0}
                onClick={() => openSheet("filter")}
              />
              <M3AssistChip
                leadingIcon={<ArrowUpDown />}
                label={isSortActive ? "Sort (1)" : "Sort"}
                elevated={isSortActive}
                onClick={() => openSheet("sort")}
              />
              <div className="h-5 w-[1px] bg-[#c4c7c5] flex-shrink-0 mx-1" />
              {disciplines.map((d) => {
                const isChipSelected =
                  (d === "All" && activeDisciplines.length === 0) ||
                  activeDisciplines.includes(d);
                return (
                  <M3FilterChip
                    key={d}
                    label={d}
                    selected={isChipSelected}
                    onClick={() => setActiveDisciplines(d === "All" ? [] : [d])}
                  />
                );
              })}
            </M3ChipSet>

            <div className="flex justify-between items-center pb-2 border-b border-gray-50 md:border-none">
              <p className="text-[10px] md:text-[11px] text-[#444746] uppercase font-bold tracking-widest">
                Showing <span className="text-[#1f1f1f]">{displayed.length}</span> of <span className="text-[#1f1f1f]">{filtered.length}</span> Labs
              </p>
              <div className="flex gap-6">
                {["Higher Education", "High School"].map((l) => (
                  <button key={l} onClick={() => setActiveLevel(l)}
                    className={`text-[11px] md:text-xs font-bold transition-all relative py-1 cursor-pointer ${
                      activeLevel === l ? 'text-[#0b57d0] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:rounded-t-full after:bg-[#0b57d0]' : 'text-[#444746] hover:text-[#1f1f1f]'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <M3LinearProgress
            value={filtered.length > 0 ? Math.min((visibleCount / filtered.length) * 100, 100) : 0}
            className="h-1 rounded-none"
          />
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#001D38] via-[#003C6E] to-[#005689] py-12 text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/20 text-xs font-bold uppercase tracking-wider">
                Hands-On Practical Library · NEP 2020 Aligned
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ color: '#ffffff' }}>
                Curriculum-Mapped Experimental Library
              </h1>
              <p className="text-slate-100/90 text-sm md:text-base leading-relaxed">
                Turn abstract formulas into hands-on practical discoveries. Explore certified physics, chemistry, biology, and engineering simulations.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link href="/compare-plans">
                  <M3Button variant="tonal">View Plans</M3Button>
                </Link>
                <Link href="/demo">
                  <M3Button variant="outlined" className="border-white text-white hover:bg-white/15">View Demo</M3Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="py-6 bg-gray-50/30 min-h-screen">
          <div className="container mx-auto px-4 max-w-7xl">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse flex flex-row md:flex-col gap-3 md:gap-0 p-3 md:p-0">
                    <div className="w-24 h-24 md:w-full md:h-48 flex-shrink-0 rounded-xl md:rounded-none bg-gray-200" />
                    <div className="flex-1 flex flex-col gap-2 py-1 md:p-4">
                      <div className="h-2.5 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                      <div className="h-3 bg-gray-100 rounded w-3/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayed.length > 0 ? (
                  displayed.map((sim, i) => (
                    <div
                      key={sim.id}
                      style={{
                        animation: i < PAGE_SIZE
                          ? `fadeInUp 0.25s ease forwards ${Math.min(i * 0.025, 0.4)}s`
                          : undefined,
                        opacity: i < PAGE_SIZE ? 0 : 1,
                      }}
                    >
                      <CardItem
                        sim={sim}
                        isSelected={selectedIds.includes(sim.id)}
                        onToggle={() => toggleSelect(sim)}
                        onNavigate={() => setActiveDrawerExp(sim)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">No matching experiments found</h3>
                    <p className="text-xs text-gray-500 max-w-sm">Try clearing your search query or discipline filter to explore all hands-on experiments & live labs.</p>
                    <button
                      onClick={() => { setSearch(""); setActiveDisciplines([]); }}
                      className="mt-2 px-5 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-colors shadow-xs"
                    >
                      Show All Experiments
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* INFINITE SCROLL SENTINEL */}
            <div ref={sentinelRef} className="py-10 flex justify-center">
              {visibleCount < filtered.length ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading more...</span>
                </div>
              ) : (
                filtered.length > 0 && <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">End of Catalog</span>
              )}
            </div>
          </div>
        </section>

        {/* SHEET (Google Material Design 3) */}
        <AnimatePresence>
          {sheetMode && (
            <>
              <motion.div key="backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-[2px] z-[1100]"
                onClick={closeSheet}
              />
              <motion.div key="sheet-mobile" ref={sheetRef}
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-[1150] bg-white rounded-t-[28px] shadow-[0_-12px_36px_rgba(0,0,0,0.22)]"
                style={{ maxHeight: "85vh", overflowY: "auto" }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
              >
                <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
                  <div className="w-10 h-1.5 bg-[#747775]/40 rounded-full" />
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#dadce0]/80 sticky top-5 bg-white z-10">
                  <button onClick={resetSheet} className="text-sm text-[#0b57d0] font-semibold">Reset</button>
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">{sheetMode === "filter" ? "Filters" : "Sort by"}</h2>
                  <button onClick={closeSheet} className="w-8 h-8 flex items-center justify-center bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#444746] rounded-full"><X size={16} /></button>
                </div>
                <div className="px-5 py-5"><SheetBody /></div>
                <div className="px-5 pb-8 pt-3 sticky bottom-0 bg-white border-t border-[#dadce0]/80">
                  <button onClick={applySheet} className="w-full py-3.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full text-sm font-semibold shadow-[0_1px_3px_rgba(60,64,67,0.3)] active:scale-[0.98] transition-all">
                    Show {sheetMode === "filter" ? tempFiltered.length : filtered.length} Results
                  </button>
                </div>
              </motion.div>
              <motion.div key="sheet-desktop"
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-[1150] bg-white rounded-r-[28px] shadow-[0_12px_36px_rgba(0,0,0,0.22)] border-r border-[#dadce0]/80"
                style={{ width: "360px" }}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dadce0]/80">
                  <button onClick={resetSheet} className="text-sm text-[#0b57d0] font-semibold hover:underline transition-colors">Reset</button>
                  <h2 className="text-[16px] font-bold text-[#1f1f1f]">{sheetMode === "filter" ? "Filters" : "Sort by"}</h2>
                  <button onClick={closeSheet} className="w-9 h-9 flex items-center justify-center bg-[#f1f3f4] rounded-full hover:bg-[#e8eaed] text-[#444746] transition-colors"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6"><SheetBody /></div>
                <div className="px-6 py-5 border-t border-[#dadce0]/80">
                  <button onClick={applySheet} className="w-full py-3.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full text-sm font-semibold shadow-[0_1px_3px_rgba(60,64,67,0.3)] active:scale-[0.98] transition-all">
                    Show {sheetMode === "filter" ? tempFiltered.length : filtered.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* EXPERIMENT DETAIL DRAGGABLE BOTTOM SHEET DRAWER */}
        {activeDrawerExp && (
          <ExperimentBottomSheetDrawer
            experiment={activeDrawerExp}
            onClose={() => setActiveDrawerExp(null)}
            subjectFallback={activeDrawerExp.subject}
            relatedPool={allExperiments}
          />
        )}

        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}@keyframes fadeInUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </>
    </PageTransition>
  );
};

export default Experiments;