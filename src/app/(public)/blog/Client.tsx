'use client';

import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/shared/PageTransition";
import ShareButton from "@/components/shared/ShareButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowRight, Sparkles } from "lucide-react";
import { ALL_BLOGS, BlogPostItem } from "@/lib/blogsData";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  is_featured: boolean | null;
  read_time?: string;
  category?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    ALL_BLOGS.map((b, i) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.summary,
      cover_image_url: b.coverImage,
      author_name: b.author.name,
      published_at: b.publishedAt,
      is_featured: i === 0,
      read_time: b.readTime,
      category: b.category,
    }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (supabase as any).from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, author_name, published_at, is_featured")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .then(({ data }: any) => {
        if (data && data.length > 0) {
          setPosts(data as BlogPost[]);
        }
      });
  }, []);

  const featured = posts.filter((p) => p.is_featured);
  const regular = posts.filter((p) => !p.is_featured);

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative py-20 text-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> STEM Research &amp; Learning Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 tracking-tight">
            CSEEL Science &amp; EdTech Blog
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover cutting-edge pedagogy, student hardware innovations, laboratory safety guidelines, and hands-on experiment guides.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* FEATURED POST */}
        {featured.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
              <h2 className="text-xl font-bold text-gray-900">Featured Article</h2>
            </div>
            {featured.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-100 rounded-3xl overflow-hidden p-6 md:p-8 hover:shadow-xl transition-all">
                  <div className="lg:col-span-6 rounded-2xl overflow-hidden aspect-video lg:aspect-auto bg-gray-100 relative">
                    <img
                      src={p.cover_image_url || "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div>
                      {p.category && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 inline-block">
                          {p.category}
                        </span>
                      )}
                      <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-3">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        {p.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <User className="w-3.5 h-3.5 text-primary" /> {p.author_name}
                      </span>
                      {p.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {p.read_time}
                        </span>
                      )}
                      <span className="text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* REGULAR POSTS GRID */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <Card className="h-full border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all rounded-2xl overflow-hidden flex flex-col group">
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    <img
                      src={p.cover_image_url || "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    {p.category && (
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">
                        {p.category}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                      {p.excerpt}
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span className="truncate max-w-[120px]">{p.author_name}</span>
                      <div className="flex items-center gap-2">
                        <div onClick={(e) => e.stopPropagation()}>
                          <ShareButton
                            title={p.title}
                            text={p.excerpt ?? ''}
                            url={`/blog/${p.slug}`}
                            size="xs"
                            variant="icon"
                          />
                        </div>
                        <span className="text-primary font-semibold flex items-center gap-0.5">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Blog;
