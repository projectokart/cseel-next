'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/shared/PageTransition";
import { ArrowLeft, Calendar, User, Clock, Share2, Sparkles, BookOpen } from "lucide-react";
import { getBlogBySlug, ALL_BLOGS } from "@/lib/blogsData";

interface Post {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  category?: string;
  read_time?: string;
  tags?: string[];
}

const BlogDetail = () => {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<Post | null>(() => {
    const local = getBlogBySlug(slug);
    if (local) {
      return {
        id: local.id,
        title: local.title,
        content: local.content,
        cover_image_url: local.coverImage,
        author_name: local.author.name,
        published_at: local.publishedAt,
        category: local.category,
        read_time: local.readTime,
        tags: local.tags,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    if (!slug) return;
    const local = getBlogBySlug(slug);
    if (local) {
      setPost({
        id: local.id,
        title: local.title,
        content: local.content,
        cover_image_url: local.coverImage,
        author_name: local.author.name,
        published_at: local.publishedAt,
        category: local.category,
        read_time: local.readTime,
        tags: local.tags,
      });
      setLoading(false);
      return;
    }

    (supabase as any).from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) {
          setPost(data as Post);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleShare = async () => {
    if (post && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50/40 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to All Articles
            </Link>
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="h-3.5 w-3.5" /> Share Article
            </button>
          </div>

          {loading ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Loading article...</p>
            </div>
          ) : !post ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
              <BookOpen className="w-12 h-12 text-gray-300" />
              <h2 className="text-xl font-bold text-gray-800">Article Not Found</h2>
              <p className="text-sm text-gray-500">The requested blog post &quot;{slug}&quot; does not exist.</p>
              <Link href="/blog" className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold">
                Browse Articles
              </Link>
            </div>
          ) : (
            <article className="bg-white border border-gray-100 rounded-3xl p-6 md:p-12 shadow-sm">
              {post.category && (
                <span className="px-3.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 inline-block">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Author & date metadata */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500 pb-6 mb-8 border-b border-gray-100">
                {post.author_name && (
                  <span className="flex items-center gap-1.5 font-bold text-gray-800">
                    <User className="h-4 w-4 text-primary" /> {post.author_name}
                  </span>
                )}
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" /> {post.published_at}
                  </span>
                )}
                {post.read_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" /> {post.read_time}
                  </span>
                )}
              </div>

              {post.cover_image_url && (
                <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
                  <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Post content */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 whitespace-pre-line text-sm md:text-base">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-8 mt-8 border-t border-gray-100 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BlogDetail;
