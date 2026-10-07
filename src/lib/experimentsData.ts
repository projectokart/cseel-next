import { slugify } from "@/lib/utils";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExperimentItem {
  id: string;
  slug: string;
  title: string;
  subject: "Chemistry" | "Biology" | "Physics" | "Mathematics" | "Engineering" | "Technology";
  class: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  views: number;
  likes: number;
  rating: number;
  description: string;
  aim: string;
  theory: string;
  thumbnail_url: string;
  images: string[];
  video_link?: string;
  demo_link?: string;
  materials: string[];
  procedure: string[];
  outcome: string;
  precautions: string[];
  formulas?: { formula: string; explanation: string }[];
  quiz?: QuizQuestion[];
  relatedMaterialIds?: string[];
}

export const ALL_EXPERIMENTS: ExperimentItem[] = [];

export function getExperimentBySlugOrId(identifier: string): ExperimentItem | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  return ALL_EXPERIMENTS.find(
    (e) =>
      e.slug.toLowerCase() === clean ||
      e.id.toLowerCase() === clean ||
      slugify(e.title) === clean ||
      clean.includes(e.slug.toLowerCase()) ||
      e.slug.toLowerCase().includes(clean)
  );
}
