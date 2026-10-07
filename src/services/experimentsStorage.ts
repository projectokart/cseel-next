import { ExperimentItem } from '@/types/experiment';
import { INITIAL_EXPERIMENTS } from '@/data/experimentsSeed';
import customExperimentsJson from '@/data/experiments_custom.json';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'cseel_admin_experiments_v1';

const MERGED_INITIAL_EXPERIMENTS: ExperimentItem[] = (() => {
  const map = new Map<string, ExperimentItem>();
  INITIAL_EXPERIMENTS.forEach((exp) => map.set(exp.id, exp));
  (customExperimentsJson as unknown as ExperimentItem[]).forEach((exp) => map.set(exp.id, exp));
  return Array.from(map.values());
})();

export class ExperimentsStorageService {
  private static cache: ExperimentItem[] | null = null;

  public static getExperiments(): ExperimentItem[] {
    if (typeof window === 'undefined') {
      return [...MERGED_INITIAL_EXPERIMENTS];
    }

    if (this.cache) {
      return this.cache;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any custom JSON additions so new experiments are always loaded
          const map = new Map<string, ExperimentItem>();
          parsed.forEach((p: ExperimentItem) => map.set(p.id, p));
          (customExperimentsJson as unknown as ExperimentItem[]).forEach((exp) => map.set(exp.id, exp));
          this.cache = Array.from(map.values());
          return this.cache;
        }
      }
    } catch (e) {
      console.error('Failed reading experiments from localStorage', e);
    }

    // Default to merged initial seed
    this.cache = [...MERGED_INITIAL_EXPERIMENTS];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (e) {}

    return this.cache;
  }

  public static getExperimentById(idOrSlug: string): ExperimentItem | null {
    const list = this.getExperiments();
    const query = decodeURIComponent(idOrSlug).toLowerCase().trim();

    const matchesExp = (exp: ExperimentItem): boolean => {
      const expId = exp.id.toLowerCase();
      const expSlug = (
        exp.slug ||
        exp.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/[\s_-]+/g, '-')
      ).toLowerCase();

      if (
        expId === query ||
        expSlug === query ||
        query.startsWith(expSlug) ||
        expSlug.startsWith(query)
      ) {
        return true;
      }

      // Keyword / Topic Matching
      if (query.includes('thermite') && (expSlug.includes('thermite') || exp.tags?.some((t) => t.toLowerCase().includes('thermite')))) {
        return true;
      }
      if (query.includes('elephant') && expSlug.includes('elephant')) return true;
      if (query.includes('pendulum') && expSlug.includes('pendulum')) return true;
      if (query.includes('oxygen') && expSlug.includes('oxygen')) return true;

      return false;
    };

    const found = list.find(matchesExp);
    if (found) return found;

    // Fallback search in MERGED_INITIAL_EXPERIMENTS directly
    return MERGED_INITIAL_EXPERIMENTS.find(matchesExp) || null;
  }

  public static saveExperiment(experiment: ExperimentItem): ExperimentItem {
    const list = this.getExperiments();
    const existingIndex = list.findIndex((e) => e.id === experiment.id);

    const now = new Date().toISOString();
    const toSave: ExperimentItem = {
      ...experiment,
      updatedAt: now,
      createdAt: experiment.createdAt || now,
    };

    let updatedList: ExperimentItem[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = toSave;
    } else {
      updatedList = [toSave, ...list];
    }

    this.cache = updatedList;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error('Failed saving to localStorage', e);
      }
    }

    // Attempt async background API sync
    this.syncWithServer(toSave, existingIndex >= 0 ? 'PUT' : 'POST').catch(() => {});

    return toSave;
  }

  public static deleteExperiment(id: string): boolean {
    const list = this.getExperiments();
    const updated = list.filter((e) => e.id !== id);
    this.cache = updated;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
    }

    // Attempt API delete
    fetch(`/api/admin/experiments/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  }

  public static duplicateExperiment(id: string): ExperimentItem | null {
    const original = this.getExperimentById(id);
    if (!original) return null;

    const copyId = `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const cloned: ExperimentItem = {
      ...JSON.parse(JSON.stringify(original)),
      id: copyId,
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.saveExperiment(cloned);
  }

  public static bulkAdd(newExperiments: Partial<ExperimentItem>[]): ExperimentItem[] {
    const list = this.getExperiments();
    const addedList: ExperimentItem[] = [];

    newExperiments.forEach((item) => {
      const id = item.id || `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const completeItem: ExperimentItem = {
        id,
        title: item.title || 'Untitled Experiment',
        subtitle: item.subtitle || '',
        subjectSlug: item.subjectSlug || 'science',
        subjectName: item.subjectName || 'Science',
        category: item.category || 'General Science',
        gradeLevel: item.gradeLevel || 'Middle (6-8)',
        difficulty: item.difficulty || 'Beginner',
        duration: item.duration || '30 Mins',
        safetyLevel: item.safetyLevel || 'Safe for Home',
        status: item.status || 'published',
        tags: item.tags || ['STEM', 'NEP 2020'],
        createdAt: now,
        updatedAt: now,
        sections: item.sections || [],
      };
      addedList.push(completeItem);
    });

    const combined = [...addedList, ...list];
    this.cache = combined;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
      } catch (e) {}
    }
    return addedList;
  }

  public static exportToJSON(): string {
    const list = this.getExperiments();
    return JSON.stringify(list, null, 2);
  }

  public static exportToExcel(): void {
    if (typeof window === 'undefined') return;
    const list = this.getExperiments();

    // Flatten experiments into rows for Excel
    const rows = list.map((exp) => ({
      ID: exp.id,
      Title: exp.title,
      Subtitle: exp.subtitle,
      Subject: exp.subjectName,
      Category: exp.category,
      GradeLevel: exp.gradeLevel,
      Difficulty: exp.difficulty,
      Duration: exp.duration,
      SafetyLevel: exp.safetyLevel,
      Status: exp.status,
      Tags: exp.tags.join(', '),
      SectionsCount: exp.sections.length,
      CreatedAt: exp.createdAt,
      UpdatedAt: exp.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Experiments');

    // Trigger download
    XLSX.writeFile(workbook, `CSEEL_Experiments_Directory_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  public static importFromJSON(jsonText: string): { success: boolean; count: number; error?: string } {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object' && data.id && data.title) {
          this.saveExperiment(data as ExperimentItem);
          return { success: true, count: 1 };
        }
        return { success: false, count: 0, error: 'JSON must be an array of experiments or a single experiment object.' };
      }

      let count = 0;
      data.forEach((exp: any) => {
        if (exp.title) {
          const id = exp.id || `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          this.saveExperiment({
            ...exp,
            id,
            sections: exp.sections || []
          });
          count++;
        }
      });

      return { success: true, count };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Invalid JSON syntax.' };
    }
  }

  public static resetToDefaultSeed(): void {
    this.cache = [...INITIAL_EXPERIMENTS];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      } catch (e) {}
    }
  }

  private static async syncWithServer(experiment: ExperimentItem, method: 'POST' | 'PUT'): Promise<void> {
    try {
      await fetch('/api/admin/experiments', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiment),
      });
    } catch (e) {
      // In-browser fallback persists safely
    }
  }
}
