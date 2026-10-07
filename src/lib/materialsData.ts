import { slugify } from "@/lib/utils";

export interface MaterialItem {
  id: string;
  slug: string;
  name: string;
  scientific_name: string;
  common_names: string[];
  category: string;
  categoryLabel?: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  stock: number;
  current_stock: number;
  image_url: string;
  gallery?: string[];
  tag?: string;
  description: string;
  specification: string;
  includes: string[];
  safety: string;
  warning: string;
  handling: string;
  storage: string;
  grade?: string;
  purity?: string;
  cas_number?: string;
  relatedExperiments?: { id: string; title: string; subject: string }[];
}

export const ALL_MATERIALS: MaterialItem[] = [];

export function getMaterialBySlugOrId(identifier: string): MaterialItem | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  return ALL_MATERIALS.find(
    (m) =>
      m.slug.toLowerCase() === clean ||
      m.id.toLowerCase() === clean ||
      slugify(m.name) === clean ||
      slugify(m.scientific_name) === clean ||
      clean.includes(m.slug.toLowerCase()) ||
      m.slug.toLowerCase().includes(clean)
  );
}
