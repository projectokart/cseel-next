import { TrainingProgram, TrainingFilterState } from '../types';
import { slugify } from '@/lib/utils';

export const INITIAL_PROGRAMS: TrainingProgram[] = [
  {
    id: 'tr-1',
    slug: 'cbse-experiential-physics-practicals-masterclass',
    title: 'CBSE Experiential Physics Practicals & Optics Masterclass',
    category: 'Physics',
    format: 'Hands-on Bootcamp',
    level: 'Master Educator',
    durationHours: 24,
    batchSize: 40,
    enrolledCount: 36,
    leadTrainer: 'Dr. R.K. Varma',
    trainerRole: 'Senior Scientist & National Pedagogy Advisor',
    certificationOffered: 'Certified Experiential Physics Master Educator',
    startDate: '2026-09-15',
    feeInr: 2499,
    curriculumSummary: 'Comprehensive 3-day practical training covering laser ray optics, pendulum harmonic motion, and resistance verification with True-RMS meters.',
    learningOutcomes: ['Design 15+ zero-cost lab setups', 'Assess practical inquiry skills', 'NEP-2020 competency rubric design'],
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tr-2',
    slug: 'robotics-arduino-atl-mentor-certification',
    title: 'Atal Tinkering Lab (ATL) Robotics & IoT Mentor Certification',
    category: 'Robotics & IoT',
    format: 'Hybrid Certification',
    level: 'Intermediate',
    durationHours: 32,
    batchSize: 50,
    enrolledCount: 48,
    leadTrainer: 'Er. Sandeep Menon',
    trainerRole: 'Lead Robotics Architect, Projectokart',
    certificationOffered: 'ATL Master Innovation Coach',
    startDate: '2026-09-22',
    feeInr: 3499,
    curriculumSummary: 'Learn to mentor school students in building autonomous obstacle avoidance bots, ESP32 weather stations, and biometric attendances.',
    learningOutcomes: ['Breadboard circuit debugging', 'C++ firmware architecture', 'Tinkercad simulation mastery'],
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tr-3',
    slug: 'microscale-chemistry-lab-safety-workshop',
    title: 'Microscale Green Chemistry & Laboratory Safety Protocols',
    category: 'Chemistry',
    format: 'Hands-on Bootcamp',
    level: 'Foundational',
    durationHours: 16,
    batchSize: 30,
    enrolledCount: 22,
    leadTrainer: 'Dr. Sharmila Sen',
    trainerRole: 'Dean of Experimental Chemistry',
    certificationOffered: 'Lab Safety & Green Chemistry Specialist',
    startDate: '2026-10-05',
    feeInr: 1899,
    curriculumSummary: 'Techniques for conducting high-school qualitative analysis with 90% reduced chemical reagent consumption and zero hazardous emissions.',
    learningOutcomes: ['Waste neutralization protocols', 'Micro-titration accuracy', 'Emergency eyewash drills'],
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
];

class TrainingRepository {
  private programs: TrainingProgram[] = [...INITIAL_PROGRAMS];

  public async getAll(filter?: Partial<TrainingFilterState>): Promise<{ items: TrainingProgram[]; total: number; categories: string[] }> {
    let result = [...this.programs];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.leadTrainer.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.curriculumSummary.toLowerCase().includes(q)
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

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'enrolled':
          result.sort((a, b) => b.enrolledCount - a.enrolledCount);
          break;
        case 'startDate':
          result.sort((a, b) => a.startDate.localeCompare(b.startDate));
          break;
        default:
          result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          break;
      }
    }

    const categories = Array.from(new Set(this.programs.map((p) => p.category)));
    return { items: result, total: result.length, categories };
  }

  public async getById(id: string): Promise<TrainingProgram | null> {
    const found = this.programs.find((p) => p.id === id || p.slug === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<TrainingProgram, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<TrainingProgram> {
    const id = `tr-${Date.now()}`;
    const slug = slugify(data.title) + `-${Date.now().toString().slice(-4)}`;

    const newProg: TrainingProgram = {
      ...data,
      id,
      slug,
      enrolledCount: data.enrolledCount || 0,
      status: data.status || 'upcoming',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.programs.unshift(newProg);
    return newProg;
  }

  public async update(id: string, updates: Partial<TrainingProgram>): Promise<TrainingProgram | null> {
    const index = this.programs.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;
    const updated = { ...this.programs[index], ...updates, updated_at: new Date().toISOString() };
    this.programs[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const index = this.programs.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;
    this.programs.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<TrainingProgram>[]): Promise<TrainingProgram[]> {
    const created: TrainingProgram[] = [];
    for (const item of items) {
      if (!item.title || !item.category) continue;
      const prog = await this.create({
        title: item.title,
        category: (item.category as any) || 'Physics',
        format: item.format || 'Hands-on Bootcamp',
        level: item.level || 'Foundational',
        durationHours: Number(item.durationHours) || 16,
        batchSize: Number(item.batchSize) || 40,
        enrolledCount: 0,
        leadTrainer: item.leadTrainer || 'Senior Scientist',
        trainerRole: item.trainerRole || 'Faculty Trainer',
        certificationOffered: item.certificationOffered || 'Certificate of Completion',
        startDate: item.startDate || '2026-10-01',
        feeInr: Number(item.feeInr) || 1999,
        curriculumSummary: item.curriculumSummary || 'Pedagogical teacher training.',
        learningOutcomes: item.learningOutcomes || ['Active classroom engagement'],
        status: 'upcoming',
      });
      created.push(prog);
    }
    return created;
  }
}

export const trainingRepository = new TrainingRepository();
