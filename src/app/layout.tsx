import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cseel.org"),
  title: {
    default: "CSEEL | #1 STEM & Experiential Science Learning Platform India | NEP 2020",
    template: "%s | CSEEL India",
  },
  description:
    "CSEEL (Center for Scientific Exploration and Experiential Learning) is India's leading STEM education & experiential science platform. Offering hands-on science experiments, hands-on science labs & live practicals, school STEM projects, science kits, teacher training workshops, educational conclaves, and nationwide science educator jobs aligned with NEP 2020.",
  keywords: [
    // Top Brand & Core Intent
    "CSEEL",
    "Center for Scientific Exploration and Experiential Learning",
    "cseel.org",
    "stem education India",
    "top stem companies India",
    "experiential learning science platform",
    "learning by doing NEP 2020",
    "national education policy experiential science",
    
    // Experiments & Working Models
    "hands-on science experiments",
    "best science projects for school students",
    "working science models for class 6 to 12",
    "CBSE science practical experiments",
    "ICSE physics chemistry biology experiments",
    "DIY science kits for kids India",
    "science exhibition working models",
    "stem science lab kits",
    
    // live lab & Simulations
    "hands-on science experiments & live labs India",
    "interactive physics live practicals",
    "chemistry lab hands-on experiments",
    "biology cell and human body 3D interactive models",
    "experiential live science laboratory for schools",
    "Atal Tinkering Lab curriculum experiments",
    
    // Seminars, Workshops & Teacher Training
    "science seminars and conclaves India",
    "national STEM principals symposium",
    "teacher training science workshops",
    "experiential pedagogy training for educators",
    "school science fairs and exhibitions",
    
    // Jobs & EduNetwork
    "STEM educator jobs India",
    "science teacher vacancies",
    "school STEM lab coordinator jobs",
    "physics teacher chemistry teacher jobs",
    "EduNetwork school partnerships India",
    
    // Lab Equipment & Materials Store
    "buy science experiment materials online",
    "school laboratory chemicals and apparatus",
    "affordable STEM kits for schools India",
    "scientific exploration kits",
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
      "Transforming Indian education through NEP 2020 experiential learning: 300+ hands-on science experiments, 3D hands-on experiments, school working models, teacher training & STEM career network.",
    images: [
      {
        url: "https://www.cseel.org/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Experiential Science Learning & live labs India",
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
    images: ["https://www.cseel.org/images/og-cover.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "google986da09e210cb549",
    yandex: "yandex",
    other: {
      "msvalidate.01": "bing-site-verification",
    },
  },
  other: {
    "theme-color": "#003c6e",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "CSEEL",
    "application-name": "CSEEL",
    "msapplication-TileColor": "#003c6e",
    "geo.region": "IN",
    "geo.country": "India",
    "revisit-after": "1 days",
    "rating": "General",
    "distribution": "Global",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Structured Data: EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CSEEL",
              alternateName: [
                "Center for Scientific Exploration and Experiential Learning",
                "CSEEL India",
                "CSEEL STEM Platform",
              ],
              url: "https://www.cseel.org",
              logo: {
                "@type": "ImageObject",
                url: "https://www.cseel.org/images/logo.png",
                width: 400,
                height: 100,
              },
              image: "https://www.cseel.org/images/og-cover.jpg",
              description:
                "CSEEL is India's leading experiential science and STEM education platform aligned with NEP 2020. Providing curriculum-mapped hands-on experiments, hands-on science labs, school science kits, teacher development programs, and national science symposia.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "Odisha",
                addressLocality: "Bhubaneswar",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "support@cseel.org",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://www.instagram.com/cseel_org",
                "https://www.facebook.com/cseel_org",
                "https://twitter.com/cseel_org",
                "https://www.linkedin.com/company/cseel",
              ],
            }),
          }}
        />

        {/* Structured Data: WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CSEEL",
              url: "https://www.cseel.org",
              description:
                "India's premier experiential learning and hands-on STEM platform for CBSE, ICSE, and state boards.",
              inLanguage: "en-IN",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.cseel.org/hands-on experiments?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data: FAQPage (High-Impact Google Rich Results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is CSEEL and what does it offer?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "CSEEL (Center for Scientific Exploration and Experiential Learning) is a premier Indian STEM educational initiative offering hands-on science experiments, 3D live laboratory hands-on experiments, curriculum-aligned project kits, teacher training workshops, and national science conclaves aligned with NEP 2020.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does CSEEL support NEP 2020 experiential learning?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "CSEEL shifts education from rote memorization to active inquiry and hands-on experimentation. Students observe, build, analyze, and apply scientific concepts to real-world challenges, developing critical thinking and scientific temper as envisioned by NEP 2020.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What subjects and classes are covered in CSEEL hands-on experiments and experiments?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "CSEEL provides comprehensive physics, chemistry, biology, environmental science, and applied robotics experiments and hands-on experiments for students from Class 6 through Class 12, mapped to CBSE, ICSE, and state curricula.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can schools, educators, and students access CSEEL programs?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Institutions, teachers, and students can explore live hands-on experiments, order DIY lab kits, register for national seminars, and join the CSEEL EduNetwork by visiting https://www.cseel.org.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
