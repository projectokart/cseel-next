import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import ThemeHeadScript from "@/features/theme-system/ThemeHeadScript";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cseel.org"),
  title: {
    default: "CSEEL | #1 Experiential Learning Lab & Hands-on STEM Platform India | NEP 2020",
    template: "%s | CSEEL India",
  },
  description:
    "CSEEL (Center for Scientific Exploration and Experiential Learning) is India's leading STEM education & experiential science platform. Offering hands-on science experiments, hands-on science labs & live practicals, school STEM projects, science kits, teacher training workshops, educational conclaves, and nationwide science educator jobs aligned with NEP 2020.",
  keywords: [
    "CSEEL",
    "Center for Scientific Exploration and Experiential Learning",
    "STEM Education India",
    "Experiential Learning NEP 2020",
    "Experiential Learning Labs India",
    "Hands-on Science Practicals",
    "Physics Lab Experiments Class 9 10 11 12",
    "Chemistry Titration Experiential Lab",
    "Biology Cell Structure Simulations",
    "Mathematics Geometry Algebra Labs",
    "Atal Tinkering Labs ATL Turnkey Setup",
    "Composite Science Lab CBSE Byelaws",
    "School DIY Science Project Kits",
    "Teacher Development Workshops STEM",
    "Robotics AI IoT School Labs",
    "Kolb Experiential Learning Cycle",
    "5E Instructional Model Science",
    "Science Fair Projects India",
    "CBSE ICSE State Board Experiments",
  ],
  authors: [{ name: "CSEEL National Directorate - Center for Scientific Exploration and Experiential Learning", url: "https://www.cseel.org" }],
  creator: "CSEEL",
  publisher: "CSEEL National STEM Directorate",
  applicationName: "CSEEL Experiential Learning",
  category: "Education & STEM Technology",
  classification: "Educational Technology, STEM Science Labs, Experiential Learning",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.cseel.org",
    languages: {
      "en-IN": "https://www.cseel.org",
      "en": "https://www.cseel.org",
    },
  },
  openGraph: {
    type: "website",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    url: "https://www.cseel.org",
    title: "CSEEL | India's #1 Experiential Science & STEM Learning Platform",
    description:
      "Transforming Indian education through NEP 2020 experiential learning: 1,000+ hands-on science experiments in Chemistry, Biology, Mathematics, Physics & Robotics, experiential learning labs, school working models, teacher training & STEM career network.",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-social-preview.jpg",
        secureUrl: "https://www.cseel.org/images/cseel-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Experiential Science Learning & live labs India",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "CSEEL | India's #1 Experiential Science & STEM Learning Platform",
    description:
      "Hands-on science experiments, hands-on experiments & live labs, science fairs, school STEM kits & teacher workshops aligned with NEP 2020.",
    images: ["https://www.cseel.org/images/cseel-social-preview.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=31", type: "image/svg+xml" },
      { url: "/favicon-48x48.png?v=31", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=31", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png?v=31", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32x32.png?v=31", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=31", sizes: "16x16", type: "image/png" },
      { url: "/icon.png?v=31", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=31", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=31",
  },
  manifest: "/site.webmanifest?v=31",
  verification: {
    google: [
      "google986da09e210cb549",
      "-ZgEj0G-0B2nnGgkSs1CiVLYeE7p9Is5oH7t7sFA8DA",
      "google-site-verification=-ZgEj0G-0B2nnGgkSs1CiVLYeE7p9Is5oH7t7sFA8DA"
    ],
  },
  other: {
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CSEEL",
    "msapplication-TileColor": "#ffffff",
    "msapplication-navbutton-color": "#ffffff",
    "ai-content-declaration": "human-curated educational experiential learning labs, hands-on learning, project-based learning and problem-based learning platform",
    "ai-search-indexing": "allowed",
    "llm-access": "allowed",
    "gptbot": "index, follow",
    "oai-searchbot": "index, follow",
    "google-extended": "index, follow",
    "anthropic-ai": "index, follow",
    "claudebot": "index, follow",
    "perplexitybot": "index, follow",
    "applebot-extended": "index, follow",
    "meta-externalagent": "index, follow",
    "cohere-ai": "index, follow",
    "geo.region": "IN",
    "geo.country": "India",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Mobile Status Bar & Navigation Bar White Color */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-navbutton-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

                {/* Comprehensive AI Search & LLM Grounding Directives (ChatGPT, Gemini, Claude, Perplexity, Apple Intelligence) */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="gptbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="oai-searchbot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="chatgpt-user" content="index, follow" />
        <meta name="google-extended" content="index, follow" />
        <meta name="anthropic-ai" content="index, follow" />
        <meta name="claudebot" content="index, follow" />
        <meta name="claude-web" content="index, follow" />
        <meta name="perplexitybot" content="index, follow, max-snippet:-1" />
        <meta name="applebot" content="index, follow" />
        <meta name="applebot-extended" content="index, follow" />
        <meta name="meta-externalagent" content="index, follow" />
        <meta name="cohere-ai" content="index, follow" />
        <meta name="diffbot" content="index, follow" />
        <meta name="bytespider" content="index, follow" />
        <meta name="ai-content-declaration" content="human-curated educational experiential learning labs, hands-on learning, project-based learning and problem-based learning platform" />
        <meta name="ai-search-indexing" content="allowed" />
        <meta name="llm-access" content="allowed" />

        {/* Dublin Core Metadata for Academic & AI Knowledge Graph Ingestion */}
        <meta name="DC.title" content="CSEEL | India's #1 Experiential Science &amp; STEM Learning Platform" />
        <meta name="DC.creator" content="Center for Scientific Exploration and Experiential Learning" />
        <meta name="DC.description" content="India's leading Experiential Learning Lab platform aligned with NEP 2020. 1,000+ curriculum-mapped practicals, hands-on learning, learning by doing, project-based learning, problem-based learning, ATL tinkering models, and school science kits." />
        <meta name="DC.publisher" content="CSEEL National Directorate" />
        <meta name="DC.language" content="en-IN" />
        <meta name="DC.subject" content="Experiential Learning Lab, Hands-on Learning, Learning by Doing, Project-Based Learning, Problem-Based Learning, STEM Education, NEP 2020, CBSE Science Labs, ICSE Practical Experiments, Atal Tinkering Labs" />
        <meta name="DC.coverage" content="India" />

        {/* Links for AI Model Discovery (llmstxt.org Standard) */}
        <link rel="llms-txt" href="/llms.txt" type="text/markdown" />
        <link rel="help" href="/llms-full.txt" type="text/markdown" title="CSEEL LLM Knowledge Guide" />

        {/* Canonical Open Graph & Social Preview Tags for WhatsApp, Telegram, LinkedIn, Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CSEEL - Center for Scientific Exploration &amp; Experiential Learning" />
        <meta property="og:title" content="CSEEL | India's #1 Experiential Science &amp; STEM Learning Platform" />
        <meta property="og:description" content="CSEEL offers Experiential Learning Labs empowering students through hands-on learning, learning by doing, project-based learning, and problem-based learning aligned with NEP 2020 across India." />
        <meta property="og:url" content="https://www.cseel.org" />
        <meta property="og:image" content="https://www.cseel.org/images/cseel-social-preview.jpg" />
        <meta property="og:image:secure_url" content="https://www.cseel.org/images/cseel-social-preview.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CSEEL - Experiential Science Learning &amp; Live STEM Labs India" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cseel_org" />
        <meta name="twitter:title" content="CSEEL | India's #1 Experiential Science &amp; STEM Learning Platform" />
        <meta name="twitter:description" content="CSEEL offers Experiential Learning Labs empowering students through hands-on learning, learning by doing, project-based learning, and problem-based learning aligned with NEP 2020 across India." />
        <meta name="twitter:image" content="https://www.cseel.org/images/cseel-social-preview.jpg" />

        {/* Schema.org Microdata Fallback for WhatsApp */}
        <meta itemProp="name" content="CSEEL | India's #1 Experiential Science &amp; STEM Learning Platform" />
        <meta itemProp="description" content="CSEEL offers Experiential Learning Labs empowering students through hands-on learning, learning by doing, project-based learning, and problem-based learning aligned with NEP 2020 across India." />
        <meta itemProp="image" content="https://www.cseel.org/images/cseel-social-preview.jpg" />

        {/* Favicon Direct Links (Google Search Central 48px Multiple & Vector Standard with v=3 cache bust) */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=31" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=31" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=31" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png?v=31" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=31" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=31" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=31" />
        <link rel="manifest" href="/site.webmanifest?v=31" />

        {/* Resource Hints: Preconnect and DNS-Prefetch for zero-latency origin handshakes */}
        <link rel="preconnect" href="https://ukazkxthavxphibdbspd.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ukazkxthavxphibdbspd.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        {/* Preload Homepage Hero LCP Image */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/students-doing-chemistry-lab-experiment.webp"
          type="image/webp"
          // @ts-ignore
          fetchpriority="high"
          fetchPriority="high"
        />

        {/* Non-Blocking Font Loading (Zero Render-Blocking Overhead) */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          />
        </noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --font-roboto: 'Roboto', sans-serif; --font-inter: 'Inter', sans-serif; --font-montserrat: 'Montserrat', sans-serif; --font-poppins: 'Poppins', sans-serif; --font-fredoka: 'Fredoka', sans-serif; }`,
          }}
        />

        {/* Structured Data: Unified @graph (EducationalOrganization, WebSite, FAQPage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://www.cseel.org/#organization",
                  "name": "CSEEL",
                  "legalName": "Center for Scientific Exploration and Experiential Learning",
                  "alternateName": [
                    "CSEEL India",
                    "CSEEL STEM Platform",
                    "Center for Scientific Exploration and Experiential Learning Private Limited"
                  ],
                  "url": "https://www.cseel.org",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://www.cseel.org/#logo",
                    "url": "https://www.cseel.org/images/logo.png",
                    "caption": "CSEEL Logo",
                    "width": 400,
                    "height": 100
                  },
                  "image": {
                    "@type": "ImageObject",
                    "@id": "https://www.cseel.org/#primaryimage",
                    "url": "https://www.cseel.org/images/cseel-social-preview.jpg",
                    "width": 1200,
                    "height": 630
                  },
                  "description": "CSEEL is India's premier Experiential Learning Lab platform aligned with NEP 2020, driving hands-on learning, learning by doing, project-based learning, and problem-based learning through curriculum-mapped practicals, turnkey school labs, and teacher development programs.",
                  "slogan": "Empowering Scientific Temper Through Experiential Learning",
                  "foundingDate": "2024",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Connaught Place, Central Delhi",
                    "addressLocality": "New Delhi",
                    "addressRegion": "Delhi",
                    "postalCode": "110001",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 28.6139,
                    "longitude": 77.2090
                  },
                  "telephone": "+91-9050778830",
                  "email": "support@cseel.org",
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "contactType": "customer support",
                      "telephone": "+91-9050778830",
                      "email": "support@cseel.org",
                      "areaServed": "IN",
                      "availableLanguage": [
                        "English",
                        "Hindi"
                      ],
                      "hoursAvailable": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                      }
                    }
                  ],
                  "sameAs": [
                    "https://www.instagram.com/cseel_org",
                    "https://www.facebook.com/cseel_org",
                    "https://twitter.com/cseel_org",
                    "https://www.linkedin.com/company/cseel"
                  ],
                  "knowsAbout": [
                    "Experiential Learning",
                    "STEM Education",
                    "5E Instructional Model",
                    "Kolb's Experiential Learning Cycle",
                    "NEP 2020 Science Curriculum",
                    "Hands-on Science Kits",
                    "Experiential Learning Lab",
                    "Hands-on Learning",
                    "Learning by Doing",
                    "Project-Based Learning",
                    "Problem-Based Learning",
                    "Atal Tinkering Labs Framework",
                    "Physics Experiments",
                    "Chemistry Demonstrations",
                    "Biology Practicals",
                    "Applied Robotics"
                  ],
                  "areaServed": [
                    {
                      "@type": "Country",
                      "name": "India"
                    },
                    {
                      "@type": "AdministrativeArea",
                      "name": "Delhi NCR"
                    },
                    {
                      "@type": "City",
                      "name": "New Delhi"
                    },
                    {
                      "@type": "City",
                      "name": "Gurugram"
                    },
                    {
                      "@type": "City",
                      "name": "Noida"
                    },
                    {
                      "@type": "City",
                      "name": "Bengaluru"
                    },
                    {
                      "@type": "City",
                      "name": "Mumbai"
                    },
                    {
                      "@type": "City",
                      "name": "Pune"
                    },
                    {
                      "@type": "City",
                      "name": "Hyderabad"
                    },
                    {
                      "@type": "City",
                      "name": "Chennai"
                    },
                    {
                      "@type": "City",
                      "name": "Kolkata"
                    },
                    {
                      "@type": "City",
                      "name": "Ahmedabad"
                    },
                    {
                      "@type": "City",
                      "name": "Jaipur"
                    },
                    {
                      "@type": "City",
                      "name": "Chandigarh"
                    },
                    {
                      "@type": "City",
                      "name": "Lucknow"
                    },
                    {
                      "@type": "City",
                      "name": "Bhubaneswar"
                    }
                  ],
                  "audience": {
                    "@type": "EducationalAudience",
                    "educationalRole": [
                      "Student",
                      "Teacher",
                      "Educational Institution"
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.cseel.org/#website",
                  "url": "https://www.cseel.org",
                  "name": "CSEEL",
                  "description": "India's premier experiential learning and hands-on STEM platform for CBSE, ICSE, and state boards.",
                  "publisher": {
                    "@id": "https://www.cseel.org/#organization"
                  },
                  "inLanguage": "en-IN",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://www.cseel.org/hands-on-experiments?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://www.cseel.org/#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is CSEEL and what does it offer?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "CSEEL (Center for Scientific Exploration and Experiential Learning) is a premier Indian STEM educational initiative offering hands-on science experiments, 3D live laboratory simulations, curriculum-aligned project kits, teacher training workshops, and national science conclaves aligned with NEP 2020."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How does CSEEL support NEP 2020 experiential learning?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "CSEEL shifts education from rote memorization to active inquiry and hands-on experimentation. Students observe, build, analyze, and apply scientific concepts to real-world challenges, developing critical thinking and scientific temper as envisioned by NEP 2020."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What subjects and classes are covered in CSEEL Experiential Learning Labs?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "CSEEL provides comprehensive physics, chemistry, biology, mathematics, and robotics Experiential Learning Labs based on hands-on learning, learning by doing, project-based learning, and problem-based learning for Class 6 to 12 students."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How can schools, educators, and students access CSEEL programs?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Institutions, teachers, and students can explore live simulations, order DIY lab kits, register for national seminars, and join the CSEEL EduNetwork by visiting https://www.cseel.org."
                      }
                    }
                  ]
                }
              ]
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          media="all"
        />

        {/* Swiper & CDN Preconnects (From Labster UI Framework) */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/10.1.0/swiper-bundle.min.css"
          integrity="sha512-1mKT2l92H6btoIkk6fIotzeArJ3G59u/xMsDyBb/XROahx4zpXeXucqzVYssrrK0AHSNjSfe4QVE/loSr85jfA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />


        
        {/* Comprehensive CSEEL Fluid Typography, Micro-interactions & UI Utilities */}
        <style
          id="cseel-comprehensive-system-styles"
          dangerouslySetInnerHTML={{
            __html: `
              /* CSEEL Fluid Responsive Font Scaling */
              html { font-size: 1rem; }
              @media screen and (max-width:1920px) { html { font-size: 1rem; } }
              @media screen and (max-width:1440px) { html { font-size: calc(0.4375rem + 0.625vw); } }
              @media screen and (max-width:1280px) { html { font-size: calc(0.75rem + 0.3125vw); } }
              @media screen and (max-width:960px) { html { font-size: calc(0.875rem + 0.208vw); } }
              @media screen and (max-width:479px) { html { font-size: calc(0.812rem + 0.629vw); } }

              /* Text Crispness & Antialiasing */
              body {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
              }

              /* Outline & Badge Resets */
              .wf-force-outline-none[tabindex="-1"]:focus { outline: none !important; }
              .w-webflow-badge { display: none !important; visibility: hidden !important; }

              /* Keyboard Focus Accessibility */
              *[tabindex]:focus-visible, input[type="file"]:focus-visible {
                outline: 0.125rem solid #005689;
                outline-offset: 0.125rem;
              }

              /* Text Truncation System */
              .text-style-2lines {
                display: -webkit-box;
                overflow: hidden;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .text-style-3lines {
                display: -webkit-box;
                overflow: hidden;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
              .text-style-4lines {
                display: -webkit-box;
                overflow: hidden;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
              }

              /* Interactive Scale & Micro-Interactions */
              [parent]:hover [child] {
                transform: scale(1.05);
              }
              [child] {
                transition: transform 0.3s ease-in-out;
              }
              [button-arrow-wrapper]:hover [button-arrow] {
                transform: translateX(0.5rem);
                transition: transform 0.3s ease-in-out;
              }
              [button-arrow] {
                transition: transform 0.3s ease-in-out;
              }
              .icon_24 {
                transition: transform 0.3s ease;
              }
              .navbar_dropdown-link-list:hover .icon_24 {
                transform: translateX(0.25rem);
                opacity: 1;
                color: #005689;
              }
              .learning_list_card-item_wrap:hover .icon_24 {
                transform: translateX(0.25rem);
              }

              /* Active Tabs System */
              :root {
                --cg-tabs-position-inset: 0;
                --cg-tabs-opacity-hidden: 0;
                --cg-tabs-opacity-visible: 1;
                --cg-tabs-visibility-hidden: hidden;
                --cg-tabs-visibility-visible: visible;
                --site--width: 72.5rem;
              }
              .is-heading-active {
                color: #005689 !important;
              }
              .is-tabs-icon-active {
                transform: rotate(180deg);
                color: #005689;
              }

              /* Rich Text Normalization */
              .w-richtext > :not(div):first-child { margin-top: 0 !important; }
              .w-richtext > :last-child { margin-bottom: 0 !important; }
              .pointer-events-off { pointer-events: none; }
              .pointer-events-on { pointer-events: auto; }

              /* Comprehensive Gap Utilities */
              .u-gap-0 { gap: 0rem !important; }
              .u-gap-4 { gap: 0.25rem !important; }
              .u-gap-8 { gap: 0.5rem !important; }
              .u-gap-12 { gap: 0.75rem !important; }
              .u-gap-16 { gap: 1rem !important; }
              .u-gap-20 { gap: 1.25rem !important; }
              .u-gap-24 { gap: 1.5rem !important; }
              .u-gap-28 { gap: 1.75rem !important; }
              .u-gap-32 { gap: 2rem !important; }
              .u-gap-36 { gap: 2.25rem !important; }
              .u-gap-40 { gap: 2.5rem !important; }
              .u-gap-48 { gap: 3rem !important; }
              .u-gap-64 { gap: 4rem !important; }

              /* Swiper Adjustments */
              .swiper-pagination-bullets.swiper-pagination-horizontal {
                width: auto;
              }
            `,
          }}
        />

        {/* Labster Typography: Google Fonts Montserrat & Lato (100-900) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic%7CMontserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic&display=swap"
          media="all"
        />

        {/* Labster-Style Rich VideoObject Schema: CSEEL Homepage Hero Video - Experiential Learning Lab & Hands-on STEM 2026 */}
        <script
          id="w-json-ld-cseel-hero-video"
          className="w-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://www.cseel.org/#hero-video",
          "@type": "VideoObject",
          "name": "CSEEL Homepage Hero Video - Experiential Learning Lab & Hands-on STEM 2026",
          "description": "Center for Scientific Exploration and Experiential Learning (CSEEL) is India's leading Experiential Learning Lab platform. Fostering hands-on learning, learning by doing, project-based learning, and problem-based learning aligned with NEP 2020.",
          "duration": "PT30S",
          "thumbnailUrl": "https://www.cseel.org/images/hero/students-doing-chemistry-lab-experiment.webp",
          "embedUrl": "https://www.cseel.org/videos/cseel-hero-intro",
          "contentUrl": "https://www.cseel.org/videos/cseel-hero-intro.mp4",
          "uploadDate": "2026-01-15T09:00:00.000Z",
          "transcript": "Welcome to CSEEL, the Center for Scientific Exploration and Experiential Learning. Transforming Indian education through Experiential Learning Labs, hands-on learning, learning by doing, project-based learning, and problem-based learning for Class 6 to 12 students and educators.",
          "potentialAction": {
                    "@type": "SeekToAction",
                    "target": "https://www.cseel.org/?wtime={seek_to_second_number}",
                    "startOffset-input": "required name=seek_to_second_number"
          }
}),
          }}
        />

        {/* Labster-Style Rich VideoObject Schema: Does CSEEL Match My School Curriculum? (CBSE, ICSE, State Boards & NEP 2020) */}
        <script
          id="w-json-ld-cseel-curriculum"
          className="w-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://www.cseel.org/#curriculum-video",
          "@type": "VideoObject",
          "name": "Does CSEEL Match My School Curriculum? (CBSE, ICSE, State Boards & NEP 2020)",
          "description": "Looking for hands-on learning and Experiential Learning Labs for your students? CSEEL offers hundreds of curriculum-aligned modules based on learning by doing, project-based learning, and problem-based learning across Physics, Chemistry, Biology, and Mathematics.",
          "duration": "PT45S",
          "thumbnailUrl": "https://www.cseel.org/images/categories/chemistry.jpg",
          "embedUrl": "https://www.cseel.org/videos/curriculum-alignment",
          "contentUrl": "https://www.cseel.org/videos/curriculum-alignment.mp4",
          "uploadDate": "2026-02-10T11:30:00.000Z",
          "transcript": "Looking for hands-on learning and Experiential Learning Labs for your students? CSEEL has you covered. CSEEL offers hundreds of interactive modules rooted in learning by doing, project-based learning, and problem-based learning across key STEM disciplines: Chemistry, Biology, Physics, and Mathematics. Our experiential learning labs align with CBSE, ICSE, and State Board syllabi, ensuring students develop deep conceptual mastery and practical confidence. Ready to explore CSEEL full catalog? Get started today.",
          "potentialAction": {
                    "@type": "SeekToAction",
                    "target": "https://www.cseel.org/?wtime={seek_to_second_number}",
                    "startOffset-input": "required name=seek_to_second_number"
          }
}),
          }}
        />

        {/* Labster-Style Rich VideoObject Schema: How Can Schools & Teachers Get Started with CSEEL Experiential Learning Labs? */}
        <script
          id="w-json-ld-cseel-get-started"
          className="w-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://www.cseel.org/#get-started-video",
          "@type": "VideoObject",
          "name": "How Can Schools & Teachers Get Started with CSEEL Experiential Learning Labs?",
          "description": "Thinking about bringing Experiential Learning Labs, hands-on learning, and project-based learning to your school? Getting started with CSEEL is simple, turnkey, and zero-burden for teachers.",
          "duration": "PT50S",
          "thumbnailUrl": "https://www.cseel.org/images/categories/physics.jpg",
          "embedUrl": "https://www.cseel.org/videos/how-to-get-started",
          "contentUrl": "https://www.cseel.org/videos/how-to-get-started.mp4",
          "uploadDate": "2026-02-15T14:15:00.000Z",
          "transcript": "Thinking about bringing Experiential Learning Labs and hands-on learning to your students? With CSEEL, getting started is simple. First, let us talk setup. Once your school joins CSEEL, our team provides turnkey composite science lab equipment, learning-by-doing project kits, and complete lesson plans. Next, explore CSEEL teacher masterclasses in project-based learning and problem-based learning. Plus, our academic support hub guides teachers every step of the way. CSEEL makes STEM make sense. Get started today.",
          "potentialAction": {
                    "@type": "SeekToAction",
                    "target": "https://www.cseel.org/?wtime={seek_to_second_number}",
                    "startOffset-input": "required name=seek_to_second_number"
          }
}),
          }}
        />

        {/* Labster-Style Rich VideoObject Schema: What is a CSEEL Experiential Learning Lab? */}
        <script
          id="w-json-ld-cseel-virtual-lab"
          className="w-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://www.cseel.org/#what-is-virtual-lab",
          "@type": "VideoObject",
          "name": "What is a CSEEL Experiential Learning Lab? (Hands-on Learning & Learning by Doing)",
          "description": "CSEEL is the first choice for STEM educators who want better outcomes. An Experiential Learning Lab where students embrace hands-on learning, learning by doing, project-based learning, and problem-based learning.",
          "duration": "PT1M02S",
          "thumbnailUrl": "https://www.cseel.org/images/categories/biology.jpg",
          "embedUrl": "https://www.cseel.org/videos/what-is-cseel-virtual-lab",
          "contentUrl": "https://www.cseel.org/videos/what-is-cseel-virtual-lab.mp4",
          "uploadDate": "2026-02-20T10:00:00.000Z",
          "transcript": "CSEEL is the first choice for STEM educators who want better outcomes because studies show students improve by over twenty-five percent in board practical exams when they learn through hands-on learning and learning by doing. What is a CSEEL Experiential Learning Lab? It is an active scientific space where students work with real apparatus, sensor modules, and project kits to solve real-world challenges. Learning by doing makes STEM stick. Through project-based learning and problem-based inquiry, students develop critical thinking and lasting scientific temper.",
          "potentialAction": {
                    "@type": "SeekToAction",
                    "target": "https://www.cseel.org/?wtime={seek_to_second_number}",
                    "startOffset-input": "required name=seek_to_second_number"
          }
}),
          }}
        />

        {/* Labster-Style Rich VideoObject Schema: How Will CSEEL Help My School & Students Improve STEM Outcomes? */}
        <script
          id="w-json-ld-cseel-outcomes"
          className="w-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@id": "https://www.cseel.org/#stem-outcomes",
          "@type": "VideoObject",
          "name": "How Will CSEEL Help My School & Students Improve STEM Outcomes?",
          "description": "Want to make teaching STEM easier while helping your students achieve 25%+ higher marks in CBSE & ICSE practicals? Adding CSEEL experiential labs to your course is simple.",
          "duration": "PT50S",
          "thumbnailUrl": "https://www.cseel.org/images/categories/engineering.jpg",
          "embedUrl": "https://www.cseel.org/videos/stem-outcomes-benefit",
          "contentUrl": "https://www.cseel.org/videos/stem-outcomes-benefit.mp4",
          "uploadDate": "2026-03-01T16:00:00.000Z",
          "transcript": "Want to make teaching STEM easier while helping your students succeed? Adding CSEEL Experiential Learning Labs to your school is simple. CSEEL integrates hands-on learning, learning by doing, project-based learning, and problem-based learning into Class 6 to 12 curricula. Spend less time on passive lectures and more time seeing students master difficult concepts through active inquiry and practical projects. Partner with CSEEL today.",
          "potentialAction": {
                    "@type": "SeekToAction",
                    "target": "https://www.cseel.org/?wtime={seek_to_second_number}",
                    "startOffset-input": "required name=seek_to_second_number"
          }
}),
          }}
        />

        {/* CSEEL-Format Standalone Organization Schema */}
        <script
          id="w-json-ld-cseel-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.cseel.org/#organization",
          "name": "CSEEL",
          "legalName": "Center for Scientific Exploration and Experiential Learning",
          "url": "https://www.cseel.org/",
          "description": "CSEEL provides turnkey Experiential Learning Labs, hands-on learning kits, project-based learning modules, and problem-based learning curriculum helping Indian schools and educators improve student retention, score higher in CBSE/ICSE practical exams, and fulfill NEP 2020 experiential learning mandates.",
          "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.cseel.org/images/logo.png",
                    "width": 400,
                    "height": 100
          },
          "audience": {
                    "@type": "EducationalAudience",
                    "educationalRole": [
                              "administrator",
                              "faculty",
                              "educator",
                              "dean",
                              "principal",
                              "student"
                    ],
                    "audienceType": "K-12 Schools, CBSE and ICSE Institutions, Higher Secondary STEM Programs"
          },
          "sameAs": [
                    "https://www.linkedin.com/company/cseel",
                    "https://www.facebook.com/cseel_org",
                    "https://twitter.com/cseel_org",
                    "https://www.instagram.com/cseel_org"
          ],
          "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Support & Academic Advisory",
                    "telephone": "+91-9050778830",
                    "email": "support@cseel.org",
                    "url": "https://www.cseel.org/contact",
                    "availableLanguage": [
                              "English",
                              "Hindi"
                    ]
          },
          "areaServed": "India",
          "knowsAbout": [
                    "Experiential Learning Lab",
                    "Hands-on Learning",
                    "Learning by Doing",
                    "Project-Based Learning",
                    "Problem-Based Learning",
                    "Physics Experiential Practicals",
                    "Chemistry Hands-on Practicals",
                    "Biology Living Systems & Microscopy",
                    "Mathematics Hands-on Discovery",
                    "Robotics and IoT Labs",
                    "Atal Tinkering Labs Framework",
                    "CBSE Composite Science Lab Norms",
                    "NEP 2020 Experiential Learning",
                    "Kolb's Experiential Learning Cycle",
                    "5E Instructional Model"
          ]
}),
          }}
        />

        {/* CSEEL Standalone WebSite Schema with SearchAction */}
        <script
          id="w-json-ld-cseel-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://www.cseel.org/#website",
          "url": "https://www.cseel.org/",
          "name": "CSEEL Experiential Science & STEM",
          "publisher": {
                    "@id": "https://www.cseel.org/#organization"
          },
          "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.cseel.org/hands-on-experiments?search={search_term_string}",
                    "query-input": "required name=search_term_string"
          }
}),
          }}
        />



                {/* Google Tag Manager */}
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-59C7X2VD');
            `,
          }}
        />
        {/* End Google Tag Manager */}
        <ThemeHeadScript />
      </head>
      <body className="antialiased text-slate-700 bg-white min-h-screen selection:bg-[#D6EDFF] selection:text-[#003C6E]" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-59C7X2VD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-sky-900 focus:text-white focus:rounded-md focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 font-medium text-sm transition-all"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <div id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
              {children}
            </div>
          </div>
        </Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
