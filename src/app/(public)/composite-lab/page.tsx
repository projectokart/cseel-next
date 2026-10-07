import type { Metadata } from 'next';
import CompositeLabClient from './Client';

export const metadata: Metadata = {
  title: "CBSE Composite Science Lab Setup - 600 Sq Ft Norms, Equipment & SOP | CSEEL",
  description: "Complete guide & turnkey setup for CBSE Composite Science & Skill Laboratory as per SARAS SOP & Circular Skill-75/2024. 600 sq ft room size, 8 sinks, 49 non-consumables, chemicals, and official PDF download.",
  keywords: [
    "material for composite lab",
    "vendor for composite lab setup",
    "space for composite lab",
    "composite science lab cbse sop",
    "cbse composite skill lab setup",
    "composite lab equipment list",
    "composite lab room size 600 sq ft",
    "cbse affiliation lab rules",
    "composite lab chemicals and glassware",
    "composite lab setup cost in india",
    "cbse circular skill 75 2024",
    "saras composite science lab sop pdf"
  ].join(", "),
  alternates: {
    canonical: "https://www.cseel.org/composite-lab",
  },
  openGraph: {
    title: "CBSE Composite Science Lab Setup - 600 Sq Ft Norms, Equipment & SOP | CSEEL",
    description: "Official CBSE SARAS SOP & Circular Skill-75/2024 guidelines. Turnkey execution, 8-sink plumbing, 49 apparatus checklist, chemicals, and inspection preparation.",
    url: "https://www.cseel.org/composite-lab",
    siteName: "CSEEL - Center for Scientific Exploration & Experiential Learning",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <CompositeLabClient />;
}
