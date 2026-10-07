import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: "3D Interactive Virtual Science Lab | Real-Time Three.js Physics & Chemistry Workbench | CSEEL",
  description: "Experience CSEEL's immersive 3D interactive science laboratory. Operate laser optics benches, magnetic reaction flasks, 4K research microscopes, and robotics with real-time physics simulation.",
  keywords: "3D virtual lab, Three.js science laboratory, interactive physics simulation, chemistry virtual workbench, CBSE 3D science experiments, ATL robotics virtual lab",
  alternates: {
    canonical: "https://www.cseel.org/virtual-lab",
  },
  openGraph: {
    title: "3D Interactive Virtual Science Lab | CSEEL India",
    description: "Step into an immersive 3D interactive laboratory with real-time laser optics, chemistry fluid dynamics, and cellular microscopy.",
    url: "https://www.cseel.org/virtual-lab",
    siteName: "CSEEL",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.cseel.org/images/cseel-science-lab-hero.png",
        width: 1200,
        height: 630,
        alt: "CSEEL 3D Interactive Virtual Lab",
      },
    ],
  },
};

export default function VirtualLabPage() {
  return <Client />;
}
