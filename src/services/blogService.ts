import { client, isSanityConfigured } from "@/sanity/lib/client";
import { postsQuery, postBySlugQuery } from "@/sanity/lib/queries";
import { ALL_BLOGS, BlogPostItem } from "@/lib/blogsData";
import { supabase } from "@/integrations/supabase/client";

export async function fetchBlogPosts(): Promise<BlogPostItem[]> {
  // 1. If Sanity is configured, fetch live posts from Sanity Headless CMS
  if (isSanityConfigured) {
    try {
      const sanityPosts = await client.fetch<BlogPostItem[]>(postsQuery, {}, { next: { revalidate: 60 } });
      if (sanityPosts && sanityPosts.length > 0) {
        return sanityPosts;
      }
    } catch (e) {
      console.warn('Sanity fetch failed, falling back to local database:', e);
    }
  }

  // 2. Fallback to Supabase
  try {
    const { data } = await (supabase as any)
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        slug: d.slug,
        title: d.title,
        summary: d.summary || d.excerpt || '',
        content: d.content || '',
        category: d.category || 'STEM Innovation',
        author: {
          name: d.author_name || 'CSEEL Editorial Board',
          role: d.author_role || 'Lead Science Editor',
          avatar: d.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
        },
        publishedAt: d.published_at || new Date().toISOString(),
        readTime: d.read_time || '5 min read',
        coverImage: d.cover_image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        tags: d.tags || ['STEM', 'Science'],
      }));
    }
  } catch (err) {
    // ignore
  }

  // 3. Robust fallback to built-in curated posts
  return ALL_BLOGS;
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  if (!slug) return null;

  // 1. Fetch from Sanity by slug
  if (isSanityConfigured) {
    try {
      const post = await client.fetch<BlogPostItem>(postBySlugQuery, { slug }, { next: { revalidate: 60 } });
      if (post && post.title) {
        return post;
      }
    } catch (e) {
      console.warn('Sanity single post fetch failed:', e);
    }
  }

  // 2. Fetch from Local Curated List
  const localPost = ALL_BLOGS.find((b) => b.slug.toLowerCase() === slug.toLowerCase() || b.id === slug);
  if (localPost) return localPost;

  // 3. Fetch from Supabase
  try {
    const { data } = await (supabase as any)
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        summary: data.summary || data.excerpt || '',
        content: data.content || '',
        category: data.category || 'STEM Innovation',
        author: {
          name: data.author_name || 'CSEEL Editorial Board',
          role: data.author_role || 'Lead Science Editor',
          avatar: data.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
        },
        publishedAt: data.published_at || new Date().toISOString(),
        readTime: data.read_time || '5 min read',
        coverImage: data.cover_image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        tags: data.tags || ['STEM', 'Science'],
      };
    }
  } catch {}

  return null;
}
