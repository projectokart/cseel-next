'use client';

import React, { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/shared/PageTransition";
import { getBlogBySlug, ALL_BLOGS, BlogPostItem } from "@/lib/blogsData";
import {
  ChevronRight,
  Linkedin,
  Link2,
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  author_role?: string;
  author_avatar?: string;
  published_at: string | null;
  category?: string;
  read_time?: string;
  tags?: string[];
  summary?: string;
}

/* ─── helpers ────────────────────────────────────────────────────── */
function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Recent";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch { return "Recent"; }
}

function formatYear(dateStr?: string | null) {
  if (!dateStr) return "2026";
  try { return new Date(dateStr).getFullYear().toString(); }
  catch { return "2026"; }
}

/** Pull plain-text headings (## / ###) from markdown-ish content */
function extractTocItems(content: string): { id: string; label: string; level: number }[] {
  const lines = content.split("\n");
  const items: { id: string; label: string; level: number }[] = [];
  lines.forEach((line) => {
    const m3 = line.match(/^### (.+)/);
    const m2 = line.match(/^## (.+)/);
    if (m2) {
      const label = m2[1].trim();
      items.push({ id: slugifyHeading(label), label, level: 2 });
    } else if (m3) {
      const label = m3[1].trim();
      items.push({ id: slugifyHeading(label), label, level: 3 });
    }
  });
  return items.slice(0, 10);
}

function slugifyHeading(txt: string) {
  return txt.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Minimal markdown → JSX renderer (handles **bold**, ## h2, ### h3, - lists, numbers) */
function renderContent(raw: string) {
  const blocks = raw.split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // h2
    const h2 = trimmed.match(/^### (.+)/);
    if (h2) {
      const label = h2[1];
      return (
        <h3 key={bi} id={slugifyHeading(label)}>
          {inlineParse(label)}
        </h3>
      );
    }
    const h2b = trimmed.match(/^## (.+)/);
    if (h2b) {
      const label = h2b[1];
      return (
        <h2 key={bi} id={slugifyHeading(label)}>
          {inlineParse(label)}
        </h2>
      );
    }

    // ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(Boolean);
      return (
        <ol key={bi} className="list-decimal pl-6 mb-6 space-y-2">
          {items.map((item, ii) => (
            <li key={ii}>{inlineParse(item.replace(/^\d+\.\s/, ""))}</li>
          ))}
        </ol>
      );
    }

    // unordered list
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(l => /^[-*]\s/.test(l));
      return (
        <ul key={bi}>
          {items.map((item, ii) => (
            <li key={ii}>{inlineParse(item.replace(/^[-*]\s/, ""))}</li>
          ))}
        </ul>
      );
    }

    // blockquote
    if (trimmed.startsWith(">")) {
      return (
        <blockquote key={bi}>
          {inlineParse(trimmed.replace(/^>\s?/, ""))}
        </blockquote>
      );
    }

    // paragraph
    return <p key={bi}>{inlineParse(trimmed)}</p>;
  });
}

function inlineParse(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return p;
  });
}

/* ─── Component ──────────────────────────────────────────────────── */
const BlogDetail = () => {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<Post | null>(() => {
    const local = getBlogBySlug(slug);
    if (!local) return null;
    return {
      id: local.id, title: local.title, content: local.content,
      summary: local.summary, cover_image_url: local.coverImage,
      author_name: local.author.name, author_role: local.author.role,
      author_avatar: local.author.avatar, published_at: local.publishedAt,
      category: local.category, read_time: local.readTime, tags: local.tags,
    };
  });
  const [loading, setLoading] = useState(!post);
  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState("");
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const local = getBlogBySlug(slug);
    if (local) {
      setPost({
        id: local.id, title: local.title, content: local.content,
        summary: local.summary, cover_image_url: local.coverImage,
        author_name: local.author.name, author_role: local.author.role,
        author_avatar: local.author.avatar, published_at: local.publishedAt,
        category: local.category, read_time: local.readTime, tags: local.tags,
      });
      setLoading(false);
      return;
    }
    (supabase as any).from("blog_posts")
      .select("*").eq("slug", slug).eq("is_published", true).maybeSingle()
      .then(({ data }: any) => { if (data) setPost(data as Post); setLoading(false); });
  }, [slug]);

  /* sticky TOC active-link tracking */
  useEffect(() => {
    if (!post) return;
    const toc = extractTocItems(post.content);
    if (!toc.length) return;
    const handler = () => {
      const scrollY = window.scrollY + 140;
      let current = toc[0]?.id || "";
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      setActiveToc(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank", "noopener,noreferrer"
    );
  };

  const relatedPosts = ALL_BLOGS.filter(b => b.slug !== slug).slice(0, 3);
  const tocItems = post ? extractTocItems(post.content) : [];

  /* ── Loading ── */
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#005689] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#64748B]">Loading article...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ── Not Found ── */
  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-3xl p-10 border border-[#E2E8F0] max-w-md w-full shadow-sm">
            <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
            <p className="text-sm text-[#64748B] mb-6">
              The article <span className="font-semibold">"{slug}"</span> could not be located.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005689] text-white rounded-xl text-sm font-bold hover:bg-[#004570] transition-colors"
            >
              Browse All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const readTimeNum = parseInt((post.read_time || "7 min read").replace(/\D/g, ""), 10) || 7;

  return (
    <PageTransition>
      {/* ── 1. HERO HEADER: breadcrumb + meta + title + author ── */}
      <section className="bg-white pt-10 pb-6 lg:pt-14">
        <div className="max-w-[760px] mx-auto px-6 lg:px-10">

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#64748B] mb-8" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:text-[#005689] transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {post.category && (
              <>
                <span className="hover:text-[#005689] cursor-default">{post.category}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="text-[#0F172A] font-medium line-clamp-1">{post.title}</span>
          </nav>

          {/* Read time + year */}
          <div className="flex items-center gap-3 mb-6 text-[12px] font-semibold text-[#64748B]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#005689]" />
              {readTimeNum} min read
            </span>
            <span>·</span>
            <span>{formatYear(post.published_at)}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15] tracking-tight mb-8"
              style={{ color: "#005689", letterSpacing: "-0.02em" }}>
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={post.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"}
              alt={post.author_name || "Author"}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#005689]/20"
            />
            <div>
              <div className="font-semibold text-[#0F172A] text-[15px]">{post.author_name || "CSEEL Research Team"}</div>
              <div className="text-[#64748B] text-[13px]">{post.author_role || "STEM Pedagogy Specialist"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COVER IMAGE (full-width) ── */}
      {post.cover_image_url && (
        <section className="bg-white pb-10">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
            <div className="rounded-2xl overflow-hidden shadow-[0_14px_40px_rgba(13,73,121,0.13)] aspect-[16/9] bg-[#EDF5FA]">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── 3. ARTICLE + SIDEBAR ── */}
      <section className="bg-white pb-14">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 grid gap-12 items-start lg:grid-cols-[1fr_280px] lg:gap-16">

          {/* Article Body */}
          <article ref={articleRef} className="prose-article max-w-[680px]">
            {renderContent(post.content)}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 mt-10 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#64748B] mr-1">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#EDF5FA] text-[#005689] border border-[#D5E9F0] rounded-lg text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block sticky top-28 space-y-8">

            {/* TOC */}
            {tocItems.length > 0 && (
              <div>
                <div className="font-bold uppercase text-[#64748B] mb-3 text-[12px] tracking-[0.1em]">
                  On this page
                </div>
                <nav>
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`toc-link ${activeToc === item.id ? "active" : ""} ${item.level === 3 ? "pl-8" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Share */}
            <div className="pb-8 border-b border-[#E2E8F0]">
              <div className="font-bold uppercase text-[#64748B] mb-3 text-[12px] tracking-[0.1em]">Share</div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleShareLinkedIn}
                  className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#005689] hover:border-[#005689] transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#005689] hover:border-[#005689] transition-colors"
                  aria-label="Copy link"
                  title={copied ? "Copied!" : "Copy link"}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-[#005689]" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Recent posts */}
            <div>
              <div className="font-bold uppercase text-[#64748B] mb-4 text-[12px] tracking-[0.1em]">Recent</div>
              <ul className="space-y-4 list-none p-0 m-0">
                {ALL_BLOGS.filter(b => b.slug !== slug).slice(0, 3).map((b) => (
                  <li key={b.id}>
                    <Link href={`/blog/${b.slug}`} className="group flex gap-3">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-[72px] h-[54px] object-cover rounded-md bg-[#EDF5FA] flex-shrink-0"
                      />
                      <span className="font-semibold text-[#0F172A] leading-snug text-[14px] group-hover:text-[#005689] transition-colors">
                        {b.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* ── 4. DEMO CTA CARD ── */}
      <section className="bg-white pb-8">
        <div className="max-w-[760px] mx-auto px-6 lg:px-10">
          <div className="bg-[#EDF5FA] rounded-[18px] border border-[#E2E8F0]/60 p-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h3 className="text-[20px] font-bold mb-2" style={{ color: "#005689" }}>
                See learning-by-doing in action.
              </h3>
              <p className="text-[#334155] text-[15px]">
                Explore CSEEL's hands-on STEM programmes and experiential labs.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#005689] text-white rounded-xl text-sm font-bold hover:bg-[#004570] transition-all flex-shrink-0 shadow-sm hover:shadow-md"
            >
              Get in touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. GRADIENT CTA BANNER ── */}
      <section
        className="relative overflow-hidden text-white py-24 lg:py-28"
        style={{ background: "linear-gradient(315deg, #004570 0%, #005689 55%, #0878A8 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-white text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Curious how CSEEL can work for your school?
          </h2>
          <p className="text-[#D5E9F0] mb-10 mx-auto text-[18px] max-w-[640px]">
            Explore our experiential science labs, STEAM kits, and teacher training programmes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact-us" className="btn-on-blue">
              Request a Demo
            </Link>
            <Link href="/blog" className="btn-ghost-white">
              More Articles
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. RELATED ARTICLES ── */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F8FAFC] py-14 overflow-hidden">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight" style={{ color: "#005689" }}>Related Insights</h3>
                <span className="text-[11px] text-[#64748B] sm:hidden">Swipe to explore →</span>
              </div>
              <Link href="/blog" className="text-xs font-bold text-[#005689] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {/* Mobile horizontal scroll / Desktop 3-column grid */}
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="w-[280px] sm:w-auto shrink-0 snap-start group block bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_14px_40px_rgba(13,73,121,0.13)] transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#EDF5FA]">
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-[#005689] uppercase tracking-wider block mb-1">
                      {r.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#005689] line-clamp-2 leading-snug transition-colors">
                      {r.title}
                    </h4>
                    <div className="mt-2 text-[11px] text-[#64748B] flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {r.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
};

export default BlogDetail;
