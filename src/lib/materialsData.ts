import { slugify } from "@/lib/utils";
import physicsMaterialsRaw from "@/data/physics_materials_954.json";

export interface MaterialItem {
  id: string;
  sku: string;
  slug: string;
  name: string;
  scientific_name: string;
  cbse_chapter: string;
  description: string;
  image_url: string;
  cdn_image_url?: string;
  admin_cost_ref?: number;
  is_available: boolean;
}

export const ALL_MATERIALS: MaterialItem[] = (physicsMaterialsRaw as any[]).map((m) => ({
  id: m.id || m.sku,
  sku: m.sku || m.id,
  slug: m.slug || slugify(m.name),
  name: m.name,
  scientific_name: m.name,
  cbse_chapter: m.cbse_chapter || "Physics & Science Laboratory",
  description: m.description || "",
  image_url: m.image_url || `/images/materials/physics/${m.sku || m.id}.jpg`,
  cdn_image_url: m.cdn_image_url || `https://cdn.jsdelivr.net/gh/projectokart/cseel-next@main/public/images/materials/physics/${m.sku || m.id}.jpg`,
  admin_cost_ref: m.admin_cost_ref || 500,
  is_available: m.is_available ?? true,
}));

export function getMaterialBySlugOrId(identifier: string): MaterialItem | undefined {
  if (!identifier) return undefined;
  const clean = decodeURIComponent(identifier).toLowerCase().trim();
  return ALL_MATERIALS.find(
    (m) =>
      m.slug.toLowerCase() === clean ||
      m.id.toLowerCase() === clean ||
      (m.sku && m.sku.toLowerCase() === clean) ||
      slugify(m.name) === clean ||
      clean.includes(m.slug.toLowerCase()) ||
      m.slug.toLowerCase().includes(clean)
  );
}

export function getRelatedMaterials(material: MaterialItem, limit = 4): MaterialItem[] {
  return ALL_MATERIALS.filter(
    (m) => m.id !== material.id && m.cbse_chapter === material.cbse_chapter
  ).slice(0, limit);
}
