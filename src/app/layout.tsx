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
    default: "CSEEL | Center for Scientific Exploration & Experimental Learning India",
    template: "%s",
  },
  description:
    "CSEEL – India's leading platform for hands-on science experiments, virtual lab simulations, STEM education, teacher training, science workshops & national exhibitions for students and educators across India.",
  keywords: [
    "science education India",
    "experimental learning India",
    "hands-on science experiments",
    "virtual science lab India",
    "science simulations",
    "STEM education India",
    "science exhibitions India",
    "teacher training science",
    "CSEEL",
    "center for scientific exploration",
  ],
  authors: [{ name: "CSEEL - Center for Scientific Exploration & Experimental Learning" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "CSEEL",
    url: "https://www.cseel.org/",
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description:
      "Hands-on experiments, virtual simulations, science exhibitions & teacher training. India's most comprehensive experimental learning platform for students & educators.",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CSEEL - Center for Scientific Exploration & Experimental Learning India",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "CSEEL | India's #1 Experimental Science Learning Platform",
    description:
      "Hands-on experiments, virtual simulations, science exhibitions & teacher training. India's most comprehensive experimental learning platform.",
    images: ["/images/og-cover.jpg"],
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
              alternateName: "Center for Scientific Exploration & Experimental Learning",
              url: "https://www.cseel.org",
              logo: {
                "@type": "ImageObject",
                url: "https://www.cseel.org/images/logo.png",
                width: 400,
                height: 100,
              },
              image: "https://www.cseel.org/images/og-cover.jpg",
              description:
                "CSEEL offers hands-on science experiments, virtual simulations, teacher training, workshops, and national-level exhibitions for students and educators across India.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "Odisha",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://www.instagram.com/cseel_org",
                "https://www.facebook.com/cseel_org",
                "https://twitter.com/cseel_org",
              ],
            }),
          }}
        />
        {/* Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CSEEL",
              url: "https://www.cseel.org",
              description: "India's leading experimental science learning platform for students and educators",
              inLanguage: "en-IN",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.cseel.org/simulations?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
