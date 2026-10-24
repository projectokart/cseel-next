import type { Metadata } from 'next';
import ResearchPreviewClient from './ResearchPreviewClient';

export const metadata: Metadata = {
  title: "The Confidence Effect: What Keeps Online STEM Students Enrolled | CSEEL Research",
  description: "New CSEEL research surveyed 411 online and hybrid STEM students to reveal what drives persistence and retention, and why experiential learning is the key.",
  keywords: "STEM education research, student retention in STEM, online STEM learning, experiential learning cycle, virtual labs impact, STEM career readiness, higher education persistence",
  alternates: {
    canonical: "https://www.cseel.org/online-stem-retention-research-preview",
  },
  openGraph: {
    title: "The Confidence Effect: What Keeps Online STEM Students Enrolled | CSEEL Empirical Research",
    description: "New CSEEL research surveyed 411 online and hybrid STEM students to reveal what drives persistence, retention, and career readiness.",
    url: "https://www.cseel.org/online-stem-retention-research-preview",
    siteName: "CSEEL - Center for Scientific Exploration & Experimental Learning",
    locale: "en_IN",
    type: "article",
    publishedTime: "2026-10-24T00:00:00Z",
    authors: ["CSEEL Empirical Research Team"],
    images: [
      {
        url: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75ff0972d096cdd6372596_Thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "The Confidence Effect - CSEEL STEM Retention Research Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    title: "The Confidence Effect: What Keeps Online STEM Students Enrolled | CSEEL Research",
    description: "411 online and hybrid STEM students surveyed: why experiential learning is the #1 predictor of student persistence.",
    images: ["https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75ff0972d096cdd6372596_Thumbnail.jpg"],
  },
};

export default function OnlineStemRetentionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The #1 Predictor of STEM Retention Isn’t Flexibility. It’s Confidence.",
    "name": "The Confidence Effect: Why Experiential Learning Has Become Essential to Student Retention & the Future of STEM Education",
    "description": "New CSEEL empirical research surveyed 411 online and hybrid STEM students to reveal what drives persistence, retention, and career readiness.",
    "url": "https://www.cseel.org/online-stem-retention-research-preview",
    "inLanguage": "en",
    "image": "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/6a75ff0972d096cdd6372596_Thumbnail.jpg",
    "author": {
      "@type": "Organization",
      "name": "CSEEL Empirical Research Initiative",
      "url": "https://www.cseel.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CSEEL",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cseel.org/images/logo.png"
      }
    },
    "about": {
      "@type": "ResearchProject",
      "name": "Online & Hybrid STEM Student Retention and Experiential Learning Study",
      "description": "Survey of 411 students enrolled in four-year undergraduate and graduate online and hybrid STEM programs across North America and India."
    },
    "keywords": "STEM education, student retention, experiential learning, virtual labs, STEM persistence, hybrid education, career readiness"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.cseel.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Research",
        "item": "https://www.cseel.org/research"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "The Confidence Effect (STEM Retention)",
        "item": "https://www.cseel.org/online-stem-retention-research-preview"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ResearchPreviewClient />
    </>
  );
}
