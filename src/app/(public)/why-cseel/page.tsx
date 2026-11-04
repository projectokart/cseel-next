import type { Metadata } from 'next';
import WhyCseelClient from './Client';

export const metadata: Metadata = {
  title: "Where Textbooks Come Alive | Why CSEEL Experiential Science Ecosystem",
  description: "A Comprehensive Experiential Learning Ecosystem for Schools. India's first offline experiential science space transforming textbooks into hands-on discovery, real creation, and 21st century competencies.",
  keywords: "why CSEEL, where textbooks come alive, experiential science learning ecosystem, school science lab setup, NEP 2020 science labs, Atal Tinkering Labs, Viksit Bharat 2047 science education",
  alternates: {
    canonical: "https://www.cseel.org/why-cseel",
  },
  openGraph: {
    title: "Where Textbooks Come Alive | Why CSEEL Experiential Science Ecosystem",
    description: "A Comprehensive Experiential Learning Ecosystem for Schools. India's first offline experiential science space transforming textbooks into hands-on discovery.",
    url: "https://www.cseel.org/why-cseel",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/why-cseel/slide_1.png",
        width: 636,
        height: 900,
        alt: "Where Textbooks Come Alive - CSEEL Experiential Science Ecosystem",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cseel_org",
    creator: "@cseel_org",
    title: "Where Textbooks Come Alive | Why CSEEL Experiential Science Ecosystem",
    description: "A Comprehensive Experiential Learning Ecosystem for Schools. India's first offline experiential science space transforming textbooks into hands-on discovery.",
    images: ["https://www.cseel.org/images/why-cseel/slide_1.png"],
  },
};

export default function Page() {
  return <WhyCseelClient />;
}
