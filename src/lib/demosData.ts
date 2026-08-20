import { slugify } from "@/lib/utils";

export interface DemoItem {
  id: string;
  slug: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  keyFeatures: string[];
  curriculumStandards: string[];
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
}

export const ALL_DEMOS: DemoItem[] = [
  {
    id: "demo-chemistry-virtual-titration",
    slug: "chemistry-virtual-titration-demo",
    title: "Interactive Virtual Acid-Base Titration Walkthrough",
    subject: "Chemistry",
    gradeLevel: "Class 11 - 12",
    duration: "12 mins",
    videoUrl: "https://www.youtube.com/watch?v=b20VRR9C37Q",
    thumbnail: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
    description: "Experience how students interact with digital burettes, indicators, and pH electrodes in our photorealistic WebGL virtual laboratory simulation before doing practicals in the physical lab.",
    keyFeatures: [
      "Real-time pH curve plotting with live equivalence point detection",
      "Dynamic indicator color transitions (Phenolphthalein, Methyl Orange)",
      "Zero chemical hazard risk & unlimited trial replays",
      "Auto-grading of student endpoint accuracy within ±0.05ml"
    ],
    curriculumStandards: ["CBSE Class 11 Chemistry Practical", "ICSE / ISC Chemistry", "NEP 2020 Experiential Learning"],
    instructor: {
      name: "Dr. Arvind Sharma",
      role: "Lead Chemistry Pedagogy Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    }
  },
  {
    id: "demo-physics-optics-ray-tracer",
    slug: "physics-optics-ray-tracer-demo",
    title: "Interactive Geometric Optics & Ray Tracing Simulator",
    subject: "Physics",
    gradeLevel: "Class 9 - 12",
    duration: "10 mins",
    videoUrl: "https://www.youtube.com/watch?v=gT8jLgq9A5A",
    thumbnail: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    description: "Visualize reflection, refraction through prisms, thin lens formula, and chromatic aberration with real-time vector ray tracing and drag-and-drop focal point adjustments.",
    keyFeatures: [
      "Real-time interactive ray physics calculation at 60 FPS",
      "Multiple lens combinations (Convex, Concave, Cylindrical)",
      "Snell's Law refractive index matrix from vacuum to diamond",
      "Student interactive quiz checkpoints"
    ],
    curriculumStandards: ["CBSE Class 10 Light Reflection & Refraction", "Class 12 Wave & Ray Optics", "JEE Main / NEET Physics"],
    instructor: {
      name: "Prof. Rajesh Mohapatra",
      role: "Senior Physics Research Fellow",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
    }
  },
  {
    id: "demo-biology-cellular-microscopy",
    slug: "biology-cellular-microscopy-demo",
    title: "High-Resolution Ultra-Zoom Virtual Microscope Demo",
    subject: "Biology",
    gradeLevel: "Class 8 - 12",
    duration: "15 mins",
    videoUrl: "https://www.youtube.com/watch?v=2K_X9L1P0gQ",
    thumbnail: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    description: "Explore gigapixel histological specimen slides of human tissues, plant mitosis, bacteria, and protozoa with fine focus controls, stain switching, and measurement calipers.",
    keyFeatures: [
      "40x to 1000x digital immersion zoom on authentic clinical slides",
      "Interactive organelle callouts and 3D cellular reconstructions",
      "Integrated biological classification key and histology notes"
    ],
    curriculumStandards: ["CBSE Class 11 Cell Structure & Function", "NEET Biology Practical Foundation"],
    instructor: {
      name: "Dr. Shalini Panda",
      role: "Head of Life Sciences Curriculum",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop"
    }
  },
  {
    id: "demo-math-3d-calculus-geometry",
    slug: "math-3d-calculus-geometry-demo",
    title: "3D Geometric Solids & Calculus Volume Integrator",
    subject: "Mathematics",
    gradeLevel: "Class 9 - 12",
    duration: "8 mins",
    videoUrl: "https://www.youtube.com/watch?v=302eJ3T5hVU",
    thumbnail: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    description: "Rotate and slice 3D cones, spheres, cylinders, and surfaces of revolution in real-time. Understand volumes, surface integrals, and conic sections intuitively.",
    keyFeatures: [
      "Real-time 3D parametric surface rotation and wireframe inspection",
      "Riemann sum volume approximation with dynamic slice slider",
      "Interactive coordinate geometry vector projection"
    ],
    curriculumStandards: ["CBSE Class 10 Surface Areas & Volumes", "Class 12 Application of Integrals"],
    instructor: {
      name: "Anand Verma",
      role: "Mathematics Pedagogy Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
    }
  }
];

export function getDemoBySlugOrId(identifier: string): DemoItem | undefined {
  const clean = identifier.toLowerCase().trim();
  return ALL_DEMOS.find(
    (d) => d.slug.toLowerCase() === clean || d.id.toLowerCase() === clean || slugify(d.title) === clean
  );
}
