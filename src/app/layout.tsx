import type { Metadata } from "next";
import { Inter, Montserrat, Poppins, Fredoka } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cseel.org"),
  title: {
    default: "CSEEL | #1 STEM & Experiential Science Learning Platform India | NEP 2020",
    template: "%s | CSEEL India",
  },
  description:
    "CSEEL (Center for Scientific Exploration and Experiential Learning) is India's leading STEM education & experiential science platform. Offering hands-on science experiments, hands-on science labs & live practicals, school STEM projects, science kits, teacher training workshops, educational conclaves, and nationwide science educator jobs aligned with NEP 2020.",
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
      "Transforming Indian education through NEP 2020 experiential learning: 1,000+ hands-on science experiments in Chemistry, Biology, Mathematics, Physics & Robotics, virtual lab simulations, school working models, teacher training & STEM career network.",
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
    icon: [
      { url: "/favicon.ico?v=5", sizes: "any" },
      { url: "/favicon-32x32.png?v=5", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=5", sizes: "16x16", type: "image/png" },
      { url: "/icon.png?v=5", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=5", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=5",
  },
  verification: {
    google: "google986da09e210cb549",
  },
  other: {
    "theme-color": "#003c6e",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "CSEEL",
    "msapplication-TileColor": "#003c6e",
    "geo.region": "IN",
    "geo.country": "India",
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
        {/* Resource Hints: Preconnect and DNS-Prefetch for zero-latency origin handshakes */}
        <link rel="preconnect" href="https://ukazkxthavxphibdbspd.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ukazkxthavxphibdbspd.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

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
                    "url": "https://www.cseel.org/images/og-cover.jpg",
                    "width": 1200,
                    "height": 630
                  },
                  "description": "CSEEL is India's leading experiential science and STEM education platform aligned with NEP 2020, providing curriculum-mapped hands-on experiments, virtual laboratory simulations, DIY school science kits, and teacher development programs.",
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
                    "Virtual Lab Simulations",
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
                      "name": "What subjects and classes are covered in CSEEL simulations and experiments?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "CSEEL provides comprehensive physics, chemistry, biology, environmental science, and applied robotics experiments and virtual simulations for students from Class 6 through Class 12, mapped to CBSE, ICSE, and state curricula."
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var reg of registrations) {
                    reg.unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var name of names) {
                      caches.delete(name);
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${poppins.variable} ${fredoka.variable} font-sans antialiased text-slate-900 bg-white min-h-screen selection:bg-sky-100 selection:text-sky-900`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
