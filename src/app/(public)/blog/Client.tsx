'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PageTransition from "@/components/shared/PageTransition";
import { ALL_BLOGS, BlogPostItem } from "@/lib/blogsData";
import { 
  Heart, 
  Share2, 
  Check, 
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen
} from "lucide-react";

// Labster-inspired categories mapped to CSEEL STEM curriculum
const CATEGORIES = [
  "View all",
  "Pedagogy",
  "Physics",
  "Chemistry",
  "Biology",
  "ATL Robotics",
  "Safety & Guidelines"
];

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES_COUNT = 29;

// Generate 29 pages worth of rich articles by cycling and expanding ALL_BLOGS
const EXPANDED_BLOGS: BlogPostItem[] = (() => {
  const list: BlogPostItem[] = [...ALL_BLOGS];
  const titles = [
    "From Consideration to Enrollment: What Online STEM Students Want",
    "How to Successfully Implement a Virtual Reality Lab in Higher Education: A Practical 7-Stage Framework",
    "Can VR Labs Help Improve NAAC/NIRF/ABET Scores?",
    "Teaching Total Station Operation in VR",
    "How to Get Funding for VR Labs in Higher Education",
    "VR for Traffic Training and Transportation Simulation in Universities",
    "Cost of VR Lab Setup: A Budget Guide for Universities and Colleges",
    "Microbiology Laboratory Practicals in 3D: Bacterial Gram Staining",
    "Optics Bench Simulation: Convex Lenses, Focal Length & Ray Tracing",
    "Acid-Base Titration Curves with Automated pH Sensor Logging",
    "Neuroscience of Kinesthetic Discovery in School Science Laboratories",
    "Designing Safe Chemistry Experiments for K-12 Classrooms",
    "Atal Tinkering Lab Setup Checklist: 3D Printers, Soldering & Microcontrollers",
    "Electromagnetic Induction & Faraday's Law in 3D Interactive Workbench",
    "Genetics & DNA Electrophoresis Gel Running Simulation Guide",
    "Thermal Expansion & Heat Transfer Practical Demonstration Protocols"
  ];
  const authors = [
    { name: "Dev Sharma", role: "Founder & Lead Innovator", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop" },
    { name: "Dr. Arvind Sharma", role: "Director of Curriculum", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop" },
    { name: "Priya Nair", role: "ATL Robotics Engineer", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop" },
    { name: "Eva Jones", role: "STEM Educational Specialist", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop" },
    { name: "Dr. Rajesh Verma", role: "Head of 3D Simulation", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop" }
  ];

  while (list.length < TOTAL_PAGES_COUNT * ITEMS_PER_PAGE) {
    const idx = list.length;
    const base = ALL_BLOGS[idx % ALL_BLOGS.length];
    const title = titles[idx % titles.length] + (idx > 20 ? ` (Part ${Math.floor(idx / 10)})` : '');
    const author = authors[idx % authors.length];
    const date = new Date(2025, 8 - Math.floor(idx / 15), 28 - (idx % 27));

    list.push({
      id: `blog-gen-${idx + 1}`,
      slug: `${base.slug}-${idx + 1}`,
      title: title,
      summary: base.summary,
      content: base.content,
      category: base.category,
      author: author,
      publishedAt: date.toISOString(),
      readTime: `${5 + (idx % 5)} min read`,
      coverImage: base.coverImage,
      tags: base.tags
    });
  }
  return list;
})();

// Pre-seeded likes map for blogs
const INITIAL_LIKES: Record<string, number> = {
  "blog-1": 42,
  "blog-2": 38,
  "blog-3": 29,
  "blog-4": 56,
  "blog-5": 19,
  "blog-6": 34,
  "blog-7": 27,
  "blog-8": 45,
};

// Pagination list generator
function buildPageList(current: number, total: number): (number | string)[] {
  const w = 2;
  if (total <= 7) {
    const all: number[] = [];
    for (let i = 1; i <= total; i++) all.push(i);
    return all;
  }
  let start = Math.max(2, current - w);
  let end = Math.min(total - 1, current + w);
  if (current - w < 2) end = Math.min(total - 1, end + (2 - (current - w)));
  if (current + w > total - 1) start = Math.max(2, start - ((current + w) - (total - 1)));
  const pages: (number | string)[] = [1];
  if (start > 2) pages.push('…');
  for (let j = start; j <= end; j++) pages.push(j);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("View all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [likes, setLikes] = useState<Record<string, number>>(INITIAL_LIKES);
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSent, setNewsletterSent] = useState<boolean>(false);
  const [newsletterError, setNewsletterError] = useState<string>("");

  // Toggle Like Handler
  const handleToggleLike = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setUserLiked((prev) => {
      const isAlreadyLiked = !!prev[postId];
      const newStatus = !isAlreadyLiked;

      setLikes((likePrev) => ({
        ...likePrev,
        [postId]: (likePrev[postId] || 24) + (newStatus ? 1 : -1),
      }));

      return { ...prev, [postId]: newStatus };
    });
  };

  // Share Handler
  const handleShare = async (e: React.MouseEvent, post: BlogPostItem) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : `/blog/${post.slug}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: postUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(postUrl);
      setCopiedSlug(post.slug);
      setTimeout(() => {
        setCopiedSlug(null);
      }, 2000);
    }
  };

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return EXPANDED_BLOGS.filter((post) => {
      // Category check
      let matchesCategory = true;
      if (selectedCategory !== "View all") {
        if (selectedCategory === "Safety & Guidelines") {
          matchesCategory = post.category.includes("Safety") || post.tags.some(t => t.toLowerCase().includes("safety"));
        } else if (selectedCategory === "ATL Robotics") {
          matchesCategory = post.category.includes("Robotics") || post.category.includes("ATL") || post.tags.some(t => t.toLowerCase().includes("robotics"));
        } else {
          matchesCategory = post.category.toLowerCase().includes(selectedCategory.toLowerCase());
        }
      }

      // Search query check
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        matchesSearch = post.title.toLowerCase().includes(q) ||
                        post.summary.toLowerCase().includes(q) ||
                        post.category.toLowerCase().includes(q) ||
                        post.tags.some(t => t.toLowerCase().includes(q));
      }

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Featured post is the first article
  const featuredPost = ALL_BLOGS[0];

  // Grid posts: exclude featured post if viewing all without active search
  const gridPosts = useMemo(() => {
    if (selectedCategory === "View all" && searchQuery.trim() === "") {
      return filteredPosts.slice(1);
    }
    return filteredPosts;
  }, [filteredPosts, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(gridPosts.length / ITEMS_PER_PAGE) || 1;

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [gridPosts, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('blog-overview-grid');
      if (el) {
        window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
      }
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <PageTransition>
      <main className="main-wrapper min-h-screen bg-white text-[#1B1F23] font-sans antialiased selection:bg-[#006FCC]/20 selection:text-[#023858]">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: section_two_column core-primary-gradient                 */}
        {/* Exact Labster Layout: 2 Columns (Left: Heading/Lead/CTA, Right: Card)    */}
        {/* ========================================================================= */}
        <section 
          className="section_two_column core-primary-gradient relative overflow-hidden" 
          style={{ background: 'linear-gradient(90deg, #D6EDFF 0%, #F2FDF9 100%)' }}
        >
          <div className="padding-global max-w-[1240px] mx-auto px-6 lg:px-8">
            <div className="container-large">
              <div className="padding-vertical padding-two-column-header py-14 lg:py-20">
                <div className="two_column_main_wrap u-grid-column-2 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  
                  {/* Left Column (5.5 cols): Heading + Description + Primary Button */}
                  <div className="content-wrap u-hflex-left-center lg:col-span-5 flex flex-col items-start justify-center">
                    <h1 
                      className="two_column_heading heading-style-h1 text-[40px] sm:text-[48px] lg:text-[54px] font-extrabold tracking-tight leading-[1.08] mb-4"
                      style={{ color: '#023858' }}
                    >
                      CSEEL Blog
                    </h1>
                    
                    <p className="two_column_description text-size-medium text-[#5F6265] text-base lg:text-[17px] leading-relaxed mb-8 max-w-[480px]">
                      From practical teaching resources and proven strategies to product updates and research-backed insights, explore insights, ideas, and innovations in science education.
                    </p>

                    <Link 
                      href="/match-your-syllabus" 
                      className="button_primary w-button inline-flex items-center justify-center bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-[15px] px-7 py-3.5 rounded-[12px] shadow-[0_4px_14px_rgba(0,111,204,0.28)] hover:shadow-[0_6px_20px_rgba(0,111,204,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                      Match Your Syllabus
                    </Link>
                  </div>

                  {/* Right Column (6.5 cols): Overview Hero Featured Card (background-color-white) */}
                  <div className="content-wrap lg:col-span-7">
                    <div className="overview_clw w-dyn-list">
                      <div role="list" className="overview_cl w-dyn-items">
                        <div role="listitem" className="overview_ci w-dyn-item">
                          
                          <div className="overview_card_wrap background-color-white group relative bg-white rounded-[18px] border border-[#E8E9E9] overflow-hidden shadow-[0_4px_24px_rgba(0,28,51,0.06)] hover:shadow-[0_12px_36px_rgba(0,111,204,0.12)] transition-all duration-300 flex flex-col">
                            {/* Card Image */}
                            <Link href={`/blog/${featuredPost.slug}`} className="overview_card_image_wrap block relative aspect-[16/9] overflow-hidden bg-slate-100">
                              <img 
                                alt={featuredPost.title}
                                src={featuredPost.coverImage} 
                                loading="lazy"
                                className="overview_card_image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                              />
                            </Link>

                            {/* Card Content */}
                            <div className="overview_card_content_wrap p-6 lg:p-7 flex flex-col flex-1">
                              {/* Category and Date info wrap */}
                              <div className="overview_card_content_info_wrap u-hflex-left-center flex items-center gap-2 text-xs mb-3">
                                <span 
                                  fs-cmsfilter-field="overview-category" 
                                  className="font-bold text-[#006FCC] uppercase tracking-wider text-[12px]"
                                >
                                  {featuredPost.category || "Research and Insights"}
                                </span>
                                <span className="overview_card_content_info_dot w-1 h-1 rounded-full bg-[#8C9095]"></span>
                                <span className="text-[#5F6265] font-medium text-[12px]">
                                  {formatDate(featuredPost.publishedAt)}
                                </span>
                              </div>

                              {/* Title */}
                              <Link href={`/blog/${featuredPost.slug}`}>
                                <h2 
                                  fs-cmsfilter-field="name" 
                                  className="overview_card_content_heading heading-style-h4 text-style-3lines text-[21px] lg:text-[23px] font-bold line-clamp-3 leading-snug group-hover:text-[#006FCC] transition-colors mb-3"
                                  style={{ color: '#1B1F23' }}
                                >
                                  {featuredPost.title}
                                </h2>
                              </Link>

                              {/* Description */}
                              <p 
                                fs-cmsfilter-field="description" 
                                className="overview_card_content_description margin-0 text-style-4lines text-[#5F6265] text-[14px] leading-relaxed line-clamp-3 mb-5 flex-1"
                              >
                                {featuredPost.summary}
                              </p>

                              {/* Footer: Author info & Interactive Like/Share */}
                              <div className="flex items-center justify-between pt-4 border-t border-[#E8E9E9]">
                                <div className="flex items-center gap-2.5">
                                  <img 
                                    src={featuredPost.author.avatar} 
                                    alt={featuredPost.author.name}
                                    className="w-7 h-7 rounded-full object-cover border border-[#E8E9E9]" 
                                  />
                                  <span className="text-[12px] font-semibold text-[#1B1F23]">
                                    {featuredPost.author.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleLike(e, featuredPost.id)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                      userLiked[featuredPost.id]
                                        ? "bg-rose-50 border-rose-200 text-rose-600"
                                        : "bg-white border-[#E8E9E9] text-[#5F6265] hover:border-rose-300 hover:text-rose-500"
                                    }`}
                                    title="Like this post"
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${userLiked[featuredPost.id] ? "fill-current text-rose-500" : ""}`} />
                                    <span>{likes[featuredPost.id] || 42}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => handleShare(e, featuredPost)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E8E9E9] text-[#5F6265] hover:border-[#006FCC] hover:text-[#006FCC] transition-all"
                                    title="Share post"
                                  >
                                    {copiedSlug === featuredPost.slug ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-600">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FILTER & SEARCH SECTION: section_filters                               */}
        {/* Exact Labster Pill Filter Bar + Live Search Input                         */}
        {/* ========================================================================= */}
        <section cg-animation-trigger="vertical" className="section_filters py-10 lg:py-12 bg-white" id="blog-overview-grid">
          <div className="padding-global max-w-[1240px] mx-auto px-6 lg:px-8">
            <div className="container-large">
              
              {/* Filter controls row */}
              <div className="filters_main_wrap flex flex-col md:flex-row md:items-center justify-between gap-5 pb-8 border-b border-[#E8E9E9]">
                
                {/* Category Pills (horizontal scrollable on mobile) */}
                <div className="filter_inputs_wrap flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-[#003C6E] text-white shadow-sm"
                            : "bg-white text-[#5F6265] border border-[#E8E9E9] hover:border-[#006FCC] hover:text-[#006FCC]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="filter_input_wrap relative min-w-[260px] md:min-w-[300px]">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-[#8C9095] pointer-events-none" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search articles..."
                      className="filter_search_bar w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-[#DADCE0] text-[13.5px] text-[#1B1F23] placeholder-[#8C9095] focus:outline-none focus:border-[#006FCC] focus:ring-2 focus:ring-[#006FCC]/15 bg-white transition-all"
                    />
                    {searchQuery && (
                      <button 
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 text-xs text-[#8C9095] hover:text-[#1B1F23]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* 3. BLOG POSTS 3-COLUMN GRID: overview_cl u-grid-custom                   */}
              {/* Exact Labster Card: background-color-grey (#F7F8F8) + rounded-[18px]      */}
              {/* ========================================================================= */}
              <div className="bottom-wrapper pt-10">
                {paginatedPosts.length > 0 ? (
                  <div className="overview_clw w-dyn-list">
                    <div 
                      role="list" 
                      className="overview_cl u-grid-custom w-dyn-items grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {paginatedPosts.map((post) => {
                        const isPostLiked = !!userLiked[post.id];
                        const postLikeCount = likes[post.id] || (post.tags.length * 7 + 12);
                        const isCopied = copiedSlug === post.slug;

                        return (
                          <div key={post.id} role="listitem" className="overview_ci w-dyn-item">
                            
                            {/* Card Wrapper: Labster background-color-grey (#F7F8F8) */}
                            <div className="overview_card_wrap background-color-grey group relative bg-[#F7F8F8] rounded-[18px] border border-[#E8E9E9] overflow-hidden flex flex-col h-full hover:border-[#006FCC]/40 hover:shadow-[0_12px_28px_rgba(0,28,51,0.08)] transition-all duration-300">
                              
                              {/* Card Image */}
                              <Link href={`/blog/${post.slug}`} className="overview_card_image_wrap block relative aspect-[16/10] overflow-hidden bg-slate-200">
                                <img 
                                  src={post.coverImage} 
                                  alt={post.title}
                                  loading="lazy"
                                  className="overview_card_image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                                />
                              </Link>

                              {/* Card Content Wrap */}
                              <div className="overview_card_content_wrap p-6 flex flex-col flex-1">
                                
                                {/* Info wrap: Category & Date */}
                                <div className="overview_card_content_info_wrap u-hflex-left-center flex items-center gap-2 text-xs mb-2.5">
                                  <span 
                                    fs-cmsfilter-field="overview-category"
                                    className="font-bold text-[#006FCC] uppercase tracking-wider text-[11.5px]"
                                  >
                                    {post.category}
                                  </span>
                                  <span className="overview_card_content_info_dot w-1 h-1 rounded-full bg-[#8C9095]"></span>
                                  <span className="text-[#5F6265] font-medium text-[11.5px]">
                                    {formatDate(post.publishedAt)}
                                  </span>
                                </div>

                                {/* Title */}
                                <Link href={`/blog/${post.slug}`}>
                                  <h2 
                                    fs-cmsfilter-field="name"
                                    className="overview_card_content_heading heading-style-h4 text-style-3lines text-[18px] font-bold line-clamp-3 leading-snug group-hover:text-[#006FCC] transition-colors mb-2.5"
                                    style={{ color: '#1B1F23' }}
                                  >
                                    {post.title}
                                  </h2>
                                </Link>

                                {/* Description */}
                                <p 
                                  fs-cmsfilter-field="description"
                                  className="overview_card_content_description margin-0 text-style-4lines text-[#5F6265] text-[13.5px] leading-relaxed line-clamp-3 mb-5 flex-1"
                                >
                                  {post.summary}
                                </p>

                                {/* Card Footer: Author + Like/Share Interactive Controls */}
                                <div className="flex items-center justify-between pt-3.5 border-t border-[#E8E9E9]/80 mt-auto">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={post.author.avatar} 
                                      alt={post.author.name}
                                      className="w-6 h-6 rounded-full object-cover border border-[#E8E9E9]" 
                                    />
                                    <span className="text-[12px] font-medium text-[#1B1F23] truncate max-w-[110px]">
                                      {post.author.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleLike(e, post.id)}
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                                        isPostLiked
                                          ? "bg-rose-50 border-rose-200 text-rose-600"
                                          : "bg-white border-[#E8E9E9] text-[#5F6265] hover:border-rose-200 hover:text-rose-500"
                                      }`}
                                      title="Like"
                                    >
                                      <Heart className={`w-3 h-3 ${isPostLiked ? "fill-current text-rose-500" : ""}`} />
                                      <span>{postLikeCount}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleShare(e, post)}
                                      className="inline-flex items-center p-1.5 rounded-full text-[11px] font-semibold bg-white border border-[#E8E9E9] text-[#5F6265] hover:border-[#006FCC] hover:text-[#006FCC] transition-all"
                                      title="Share"
                                    >
                                      {isCopied ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Share2 className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                              </div>

                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#F7F8F8] rounded-[18px] border border-[#E8E9E9] px-6">
                    <BookOpen className="w-10 h-10 text-[#006FCC] mx-auto mb-3 opacity-60" />
                    <h3 className="text-lg font-bold text-[#1B1F23] mb-1" style={{ color: '#1B1F23' }}>No articles found</h3>
                    <p className="text-[#5F6265] text-sm mb-6 max-w-sm mx-auto">
                      We couldn&apos;t find any posts matching your selection. Try clearing your filters or searching for something else.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("View all");
                        setSearchQuery("");
                      }}
                      className="px-5 py-2.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold rounded-[12px] transition-all shadow-sm"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 4. PAGINATION: Exact Labster Pagination Bar                               */}
                {/* ========================================================================= */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper pagination mt-14 flex flex-col items-center gap-3">
                    <p className="text-[12.5px] font-medium text-[#5F6265]">
                      Showing page <span className="font-bold text-[#1B1F23]">{currentPage}</span> of <span className="font-bold text-[#1B1F23]">{totalPages}</span>
                    </p>

                    <div className="flex items-center justify-center flex-wrap gap-2">
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-[10px] text-xs font-semibold border border-[#E8E9E9] bg-white text-[#5F6265] hover:border-[#006FCC] hover:text-[#006FCC] disabled:opacity-40 disabled:pointer-events-none transition-all"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      {/* Numbered Page Buttons */}
                      {buildPageList(currentPage, totalPages).map((item, idx) => {
                        if (item === '…' || item === '...') {
                          return (
                            <span 
                              key={`ellipsis-${idx}`} 
                              className="px-2 text-[#8C9095] text-sm select-none"
                            >
                              …
                            </span>
                          );
                        }
                        const pageNum = Number(item);
                        const isActive = currentPage === pageNum;
                        return (
                          <button
                            key={`page-${pageNum}`}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[36px] h-9 px-3 rounded-[10px] text-xs font-bold transition-all ${
                              isActive
                                ? "bg-[#003C6E] text-white shadow-sm"
                                : "bg-white text-[#5F6265] border border-[#E8E9E9] hover:border-[#006FCC] hover:text-[#006FCC]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Page Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-[10px] text-xs font-semibold border border-[#E8E9E9] bg-white text-[#5F6265] hover:border-[#006FCC] hover:text-[#006FCC] disabled:opacity-40 disabled:pointer-events-none transition-all"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. LABSTER BOTTOM CTA BANNER: section_cta is-home                         */}
        {/* Exact Labster Layout: Dark Navy Gradient with SVG Ring & Student Image    */}
        {/* ========================================================================= */}
        <section 
          cg-animation-trigger="horizontal" 
          className="section_cta is-home relative overflow-hidden my-12 mx-auto max-w-[1240px] px-6 lg:px-8"
        >
          <div 
            className="rounded-[24px] relative overflow-hidden p-8 sm:p-12 lg:p-16"
            style={{ background: 'linear-gradient(110deg, #023858 36%, #005499 68%)' }}
          >
            {/* Labster Background SVG Ring */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 538 538" 
              fill="none" 
              className="cta_bg absolute -top-24 -right-24 w-[460px] h-[460px] pointer-events-none opacity-30"
            >
              <circle cx="268.5" cy="268.5" r="268" stroke="#338CD6" strokeWidth="2"></circle>
            </svg>

            <div className="card-wrapper is-home grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column (7 cols): Heading + Description + Button */}
              <div className="content-wrapper is-home lg:col-span-7 flex flex-col items-start">
                <div className="heading-wrap is-home mb-4">
                  <h2 
                    className="text-color-white text-[32px] sm:text-[40px] font-extrabold tracking-tight leading-[1.15]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Pricing Built For You
                  </h2>
                </div>

                <p className="text-size-medium text-[#D6EDFF] text-[15px] sm:text-[17px] leading-relaxed mb-8 max-w-[500px]">
                  Explore how CSEEL virtual STEM lab pricing works for your institution and get a tailored proposal based on your school&apos;s curriculum, syllabus, and lab requirements.
                </p>

                <div className="cta_wrap flex flex-wrap gap-4">
                  <Link 
                    href="/contact"
                    className="button_primary w-button inline-flex items-center justify-center bg-[#006FCC] hover:bg-[#007ee8] text-white font-bold text-[15px] px-8 py-4 rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Learn About Pricing
                  </Link>

                  <Link 
                    href="/domain/science"
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white font-semibold text-[15px] px-6 py-4 rounded-[12px] border border-white/20 transition-all duration-200 backdrop-blur-sm"
                  >
                    Explore Science Curriculum
                  </Link>
                </div>
              </div>

              {/* Right Column (5 cols): Labster Student/Laptop Image */}
              <div className="image-wrapper is-home lg:col-span-5">
                <div className="relative rounded-[18px] overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] max-w-[480px] mx-auto">
                  <img 
                    src="https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66c366924698e845aff6397c_Group-Laptop-Labster-edit-2.avif" 
                    alt="Group of students surrounding a laptop in a STEM lab" 
                    loading="lazy"
                    className="image_cover w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#023858]/60 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. NEWSLETTER / RESEARCH NOTES SUBSCRIPTION                               */}
        {/* ========================================================================= */}
        <section className="bg-white py-14 border-t border-[#E8E9E9]">
          <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
            <div className="max-w-[560px] mx-auto text-center">
              <span className="text-[12px] font-bold text-[#006FCC] uppercase tracking-widest mb-2 block">
                Stay in the loop
              </span>
              <h2 
                className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-3"
                style={{ color: '#023858' }}
              >
                New posts, straight to your inbox.
              </h2>
              <p className="text-[#5F6265] mb-7 text-[15px] leading-relaxed">
                No noise — just the articles that matter for virtual labs, pedagogy, and STEM education in schools and colleges.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-[12px] border border-[#DADCE0] text-[14px] text-[#1B1F23] focus:outline-none focus:border-[#006FCC] focus:ring-2 focus:ring-[#006FCC]/15"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-[12px] bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {newsletterSent && (
                <p className="font-semibold text-[#006FCC] bg-[#D6EDFF]/50 border border-[#006FCC]/30 rounded-[12px] px-4 py-3 mt-4 text-[13.5px]">
                  Thank you! You are now subscribed to CSEEL research notes.
                </p>
              )}

              {newsletterError && (
                <p className="font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-[12px] px-4 py-3 mt-4 text-[13.5px]">
                  {newsletterError}
                </p>
              )}
            </div>
          </div>
        </section>

      </main>
    </PageTransition>
  );
}
