import { JobOpening, JobFilterState } from '../types';
import { slugify } from '@/lib/utils';

export const INITIAL_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'hr-1',
    slug: 'senior-stem-curriculum-architect',
    title: 'Senior STEM Curriculum Architect & Pedagogical Lead',
    department: 'Academic Innovations',
    location: 'New Delhi / Hybrid',
    type: 'Full-Time',
    experience: '5+ Years',
    salary: '₹14,00,000 - ₹20,00,000 /yr',
    skills: ['NEP-2020 Framework', 'Physics Pedagogy', 'ATL Lab Architecture', 'Robotics Curriculum'],
    descriptionHtml: `
      <h2>1. Role Overview</h2>
      <p>Lead the architectural design of experiential laboratory curricula across 1,000+ Indian partner schools aligned with NEP-2020.</p>
      <h2>2. Key Responsibilities</h2>
      <ol>
        <li>Design hands-on experimental guides for Physics, Chemistry, and Robotics.</li>
        <li>Conduct high-impact teacher training masterclasses for school faculties.</li>
        <li>Mentor student innovators for national science exhibitions and hackathons.</li>
      </ol>
    `,
    deadline: '2026-10-31',
    applicantsCount: 38,
    status: 'active',
    postedDate: '3 days ago',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hr-2',
    slug: 'robotics-iot-hardware-engineer',
    title: 'Robotics & IoT Educational Hardware Engineer',
    department: 'Projectokart Labs',
    location: 'Bengaluru / On-Site',
    type: 'Full-Time',
    experience: '3+ Years',
    salary: '₹10,00,000 - ₹16,00,000 /yr',
    skills: ['Arduino C++', 'PCB Design (KiCad)', 'Sensor Fusion', 'Embedded Firmware'],
    descriptionHtml: `
      <h2>1. Role Overview</h2>
      <p>Design low-cost educational robotics modules, sensor boards, and microcontroller learning kits for students.</p>
      <h2>2. Key Responsibilities</h2>
      <ol>
        <li>Prototype ATmega328P and ESP32 educational IoT developer kits.</li>
        <li>Create wiring schematics, assembly documentation, and diagnostic firmware.</li>
      </ol>
    `,
    deadline: '2026-11-15',
    applicantsCount: 47,
    status: 'active',
    postedDate: '1 week ago',
    created_at: new Date().toISOString(),
  },
  {
    id: 'hr-3',
    slug: 'master-teacher-trainer-fellow',
    title: 'Master STEM Teacher Trainer & Lab Mentor (Fellowship)',
    department: 'Faculty Development',
    location: 'Bhubaneswar / Regional',
    type: 'Fellowship',
    experience: '2+ Years',
    salary: '₹6,00,000 - ₹9,00,000 /yr',
    skills: ['Teacher Mentorship', 'Classroom Demonstrations', 'Experiential Learning'],
    descriptionHtml: `
      <h2>1. Role Overview</h2>
      <p>Deliver in-person experiential workshops for school science teachers across eastern states.</p>
    `,
    deadline: '2026-10-15',
    applicantsCount: 19,
    status: 'active',
    postedDate: '2 weeks ago',
    created_at: new Date().toISOString(),
  },
];

class CareersRepository {
  private jobs: JobOpening[] = [...INITIAL_JOB_OPENINGS];

  public async getAll(filter?: Partial<JobFilterState>): Promise<{ items: JobOpening[]; total: number; departments: string[] }> {
    let result = [...this.jobs];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filter?.selectedDepartments && filter.selectedDepartments.length > 0) {
      result = result.filter((j) => filter.selectedDepartments!.includes(j.department));
    }

    if (filter?.selectedTypes && filter.selectedTypes.length > 0) {
      result = result.filter((j) => filter.selectedTypes!.includes(j.type));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((j) => j.status === filter.status);
    }

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'applicants':
          result.sort((a, b) => b.applicantsCount - a.applicantsCount);
          break;
        case 'deadline':
          result.sort((a, b) => a.deadline.localeCompare(b.deadline));
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          break;
      }
    }

    const departments = Array.from(new Set(this.jobs.map((j) => j.department)));
    return { items: result, total: result.length, departments };
  }

  public async getById(id: string): Promise<JobOpening | null> {
    const found = this.jobs.find((j) => j.id === id || j.slug === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<JobOpening, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<JobOpening> {
    const id = `hr-${Date.now()}`;
    const slug = slugify(data.title) + `-${Date.now().toString().slice(-4)}`;

    const newJob: JobOpening = {
      ...data,
      id,
      slug,
      applicantsCount: 0,
      status: data.status || 'active',
      postedDate: 'Just now',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.jobs.unshift(newJob);
    return newJob;
  }

  public async update(id: string, updates: Partial<JobOpening>): Promise<JobOpening | null> {
    const index = this.jobs.findIndex((j) => j.id === id || j.slug === id);
    if (index === -1) return null;

    const updated: JobOpening = {
      ...this.jobs[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.jobs[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const index = this.jobs.findIndex((j) => j.id === id || j.slug === id);
    if (index === -1) return false;
    this.jobs.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<JobOpening>[]): Promise<JobOpening[]> {
    const created: JobOpening[] = [];
    for (const item of items) {
      if (!item.title || !item.department) continue;
      const job = await this.create({
        title: item.title,
        department: item.department,
        location: item.location || 'New Delhi / Hybrid',
        type: item.type || 'Full-Time',
        experience: item.experience || '2+ Years',
        salary: item.salary || 'Competitive',
        skills: item.skills || ['STEM Pedagogy'],
        descriptionHtml: item.descriptionHtml || '<p>Job description...</p>',
        deadline: item.deadline || '2026-12-31',
        applicantsCount: 0,
        status: 'active',
        postedDate: 'Just now',
      });
      created.push(job);
    }
    return created;
  }
}

export const careersRepository = new CareersRepository();
