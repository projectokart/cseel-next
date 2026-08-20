export * from "@/lib/projectsData";
export * from "@/lib/experimentsData";
export * from "@/lib/materialsData";
export * from "@/lib/demosData";
export * from "@/lib/eventsData";
export * from "@/lib/advertisementsData";
export * from "@/lib/blogsData";

// Unified helper to search across all mock datasets
export function searchEverything(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { projects: [], experiments: [], materials: [], blogs: [], demos: [] };

  const { ALL_PROJECTS } = require("@/lib/projectsData");
  const { ALL_EXPERIMENTS } = require("@/lib/experimentsData");
  const { ALL_MATERIALS } = require("@/lib/materialsData");
  const { ALL_BLOGS } = require("@/lib/blogsData");
  const { ALL_DEMOS } = require("@/lib/demosData");

  return {
    projects: ALL_PROJECTS.filter((p: any) =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some((t: string) => t.toLowerCase().includes(q))
    ),
    experiments: ALL_EXPERIMENTS.filter((e: any) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q)
    ),
    materials: ALL_MATERIALS.filter((m: any) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    ),
    blogs: ALL_BLOGS.filter((b: any) =>
      b.title.toLowerCase().includes(q) ||
      b.summary.toLowerCase().includes(q)
    ),
    demos: ALL_DEMOS.filter((d: any) =>
      d.title.toLowerCase().includes(q) ||
      d.subject.toLowerCase().includes(q)
    ),
  };
}
