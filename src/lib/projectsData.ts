import { slugify } from "@/lib/utils";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  subcategory: string;
  tags: string[];
  duration: string;
  views: number;
  likes: number;
  rating: number;
  img: string;
  desc: string;
  featured: boolean;
  components: string[];
  procedure?: string[];
  schematics_url?: string;
  code_snippet?: string;
  updated: string;
}

export const ALL_PROJECTS: ProjectItem[] = [];

export function getProjectBySlugOrId(identifier: string): ProjectItem | undefined {
  const clean = identifier.toLowerCase().trim();
  return ALL_PROJECTS.find(
    (p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean || slugify(p.title) === clean
  );
}
