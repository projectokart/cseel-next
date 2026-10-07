import type { Metadata } from 'next';
import CompositeSkillLabClient from './Client';

export const metadata: Metadata = {
  title: "CBSE Composite Skill Lab Setup - Circular Skill-75/2024 & 13/2026 Norms | CSEEL",
  description: "Complete guide & turnkey setup for CBSE Composite Skill Lab as per Circular No. Skill-75/2024 & Circular 13/2026. Option A (600 sq ft) vs Option B (two 400 sq ft), Classes VI to XII, and comparison with Composite Science Lab.",
  keywords: [
    "cbse composite skill lab",
    "circular skill 75 2024",
    "circular 13 2026 cbse",
    "composite skill lab vs composite science lab",
    "composite skill lab setup cost",
    "cbse vocational skill lab",
    "cbse ai code 417 lab",
    "skill education cbse circular",
    "composite skill lab equipment list"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/composite-skill-lab",
  },
  openGraph: {
    title: "CBSE Composite Skill Lab Setup - Circular Skill-75/2024 & 13/2026 Norms | CSEEL",
    description: "Official CBSE Circular Skill-75/2024 and Circular 13/2026 guidelines. Option A (600 sq ft) vs Option B (two 400 sq ft labs), Classes 6 to 12.",
    url: "https://www.cseel.org/composite-skill-lab",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <CompositeSkillLabClient />;
}
