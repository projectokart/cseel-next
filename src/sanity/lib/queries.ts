import groq from 'groq';

// GROQ Query to fetch all published blog posts
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    readTime,
    "category": category->title,
    "author": {
      "name": author->name,
      "role": author->role,
      "avatar": author->image.asset->url
    },
    "coverImage": mainImage.asset->url,
    tags
  }
`;

// GROQ Query to fetch single blog post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    body,
    publishedAt,
    readTime,
    "category": category->title,
    "author": {
      "name": author->name,
      "role": author->role,
      "avatar": author->image.asset->url,
      "bio": author->bio
    },
    "coverImage": mainImage.asset->url,
    tags,
    "relatedPosts": *[_type == "post" && slug.current != $slug && category._ref == ^.category._ref] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      summary,
      "coverImage": mainImage.asset->url,
      publishedAt,
      readTime
    }
  }
`;

// GROQ Query to fetch all post slugs for static paths
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// GROQ Query to fetch blog categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    description
  }
`;
