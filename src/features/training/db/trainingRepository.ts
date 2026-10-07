import { TrainingProgram, TrainingFilterState } from '../types';
import { slugify } from '@/lib/utils';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

export const INITIAL_PROGRAMS: TrainingProgram[] = [
  {
    id: 'tr-1',
    slug: 'nep2020-physics-experiment-mastery',
    title: 'NEP 2020 Physics Practical Pedagogy & Simulation Integration',
    category: 'Physics & Instrumentation',
    format: 'Hybrid (Live + Hands-on Kit)',
    level: 'Advanced PGT',
    durationHours: 24,
    batchSize: 45,
    enrolledCount: 38,
    leadTrainer: 'Prof. S. N. Bose Fellow Dr. Harshvardhan',
    trainerRole: 'Senior Principal Scientist',
    certificationOffered: 'Govt & CSEEL NEP-Certified Practical Instructor',
    startDate: '2026-09-05',
    feeInr: 3499,
    curriculumSummary: 'Comprehensive laboratory instrumentation training covering dual-beam oscilloscopes, spectrometry, and low-cost sensor calibration.',
    learningOutcomes: [
      'Master error propagation in Class 11-12 physics experiments',
      'Deploy interactive simulations before physical laboratory sessions',
      'Design open-ended inquiry-driven practical questions',
    ],
    status: 'upcoming',
  },
  {
    id: 'tr-2',
    slug: 'robotics-iot-atl-educator-bootcamp',
    title: 'ATL Innovation Bootcamp: Microcontrollers, IoT & STEM Curriculum',
    category: 'Robotics & AI',
    format: 'Virtual Bootcamp',
    level: 'Intermediate TGT/PGT',
    durationHours: 16,
    batchSize: 60,
    enrolledCount: 52,
    leadTrainer: 'Er. Karan Mehra',
    trainerRole: 'Lead Hardware Architect',
    certificationOffered: 'CSEEL Certified ATL Master Trainer',
    startDate: '2026-09-12',
    feeInr: 2199,
    curriculumSummary: 'ESP32 IoT sensor telemetry, block coding for middle school, and patent-ready science fair prototype curation.',
    learningOutcomes: [
      'Zero-to-Hero Arduino and ESP32 programming',
      'Mentoring students for National Science Exhibitions and Hackathons',
      'Effective ATL budget and hardware component lifecycle management',
    ],
    status: 'upcoming',
  },
];

class TrainingRepository {
  private programs: TrainingProgram[] = [...INITIAL_PROGRAMS];

  public async getAll(filter?: Partial<TrainingFilterState>): Promise<{ items: TrainingProgram[]; total: number; categories: string[] }> {
    const { data } = await departmentDb.query<TrainingProgram>('training', 'programs', this.programs);
    let result = [...data];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.leadTrainer.toLowerCase().includes(q) ||
          p.certificationOffered.toLowerCase().includes(q)
      );
    }

    if (filter?.selectedCategories && filter.selectedCategories.length > 0) {
      result = result.filter((p) => filter.selectedCategories!.includes(p.category));
    }

    if (filter?.selectedFormats && filter.selectedFormats.length > 0) {
      result = result.filter((p) => filter.selectedFormats!.includes(p.format));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((p) => p.status === filter.status);
    }

    const categories = Array.from(new Set(this.programs.map((p) => p.category)));

    return { items: result, total: result.length, categories };
  }

  public async getById(id: string): Promise<TrainingProgram | null> {
    const { data } = await departmentDb.query<TrainingProgram>('training', 'programs', this.programs, {
      match: { id },
    });
    const found = data.find((p) => p.id === id || p.slug === id);
    return found ? { ...found } : null;
  }

  public async create(programData: Omit<TrainingProgram, 'id' | 'slug' | 'enrolledCount'>): Promise<TrainingProgram> {
    const id = `tr-${Date.now()}`;
    const slug = slugify(programData.title);

    const newProgram: TrainingProgram = {
      ...programData,
      id,
      slug,
      enrolledCount: 0,
    };

    await departmentDb.insert('training', 'programs', newProgram);
    this.programs.unshift(newProgram);
    return newProgram;
  }

  public async update(id: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram | null> {
    await departmentDb.update('training', 'programs', id, updates);

    const index = this.programs.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    const updated = { ...this.programs[index], ...updates };
    this.programs[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('training', 'programs', id);

    const index = this.programs.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;
    this.programs.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<TrainingProgram>[]): Promise<TrainingProgram[]> {
    const created: TrainingProgram[] = [];
    for (const item of items) {
      if (item.title) {
        const c = await this.create({
          title: item.title,
          category: item.category || 'Physics & Instrumentation',
          format: item.format || 'Virtual Bootcamp',
          level: item.level || 'Intermediate',
          durationHours: item.durationHours || 16,
          batchSize: item.batchSize || 40,
          leadTrainer: item.leadTrainer || 'Lead Faculty',
          trainerRole: item.trainerRole || 'Senior Instructor',
          certificationOffered: item.certificationOffered || 'CSEEL Certification',
          startDate: item.startDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
          feeInr: item.feeInr || 1999,
          curriculumSummary: item.curriculumSummary || item.title,
          learningOutcomes: item.learningOutcomes || [],
          status: item.status || 'upcoming',
        });
        created.push(c);
      }
    }
    return created;
  }
}

export const trainingRepository = new TrainingRepository();
