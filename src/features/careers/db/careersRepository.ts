import { CareerVacancy, CareerFilterState } from '../types';
import { slugify } from '@/lib/utils';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

export const INITIAL_VACANCIES: CareerVacancy[] = [
  {
    id: 'job-1',
    slug: 'senior-stem-curriculum-architect',
    title: 'Senior STEM Curriculum Architect (Physics / NEP 2020)',
    department: 'Academic R&D',
    location: 'Bengaluru / New Delhi (Hybrid)',
    type: 'Full-time',
    experience: '4-7 Years',
    salary: '₹14,00,000 - ₹18,00,000 / annum',
    skills: ['Physics Pedagogy', 'NEP 2020 Framework', 'ATL Laboratory Design', 'Instructional Design'],
    descriptionHtml: `
      <h2>Role Overview</h2>
      <p>Lead the architectural design of experiential physics experiments for CBSE, ICSE, and IB affiliated schools across India.</p>
      <h3>Key Responsibilities:</h3>
      <ul>
        <li>Develop NEP-2020 compliant hands-on laboratory practical manuals for Class 9-12.</li>
        <li>Architect low-cost, high-precision apparatus prototypes for ATL Labs.</li>
        <li>Collaborate with academic advisory councils and university researchers.</li>
      </ul>
    `,
    deadline: '2026-09-30',
    applicantsCount: 38,
    status: 'active',
    postedDate: '3 days ago',
  },
  {
    id: 'job-2',
    slug: 'embedded-systems-robotics-trainer',
    title: 'Lead Robotics & IoT Trainer (ATL & AI Labs)',
    department: 'Training Operations',
    location: 'Bhubaneswar (Onsite)',
    type: 'Full-time',
    experience: '2-5 Years',
    salary: '₹8,50,000 - ₹12,00,000 / annum',
    skills: ['ESP32', 'Arduino', 'Raspberry Pi', 'Python', 'ROS Robotics', 'PCB Design'],
    descriptionHtml: `
      <h2>About the Opportunity</h2>
      <p>Drive hands-on educator masterclasses in micro-controller programming, IoT sensor telemetry, and AI robotics.</p>
    `,
    deadline: '2026-10-15',
    applicantsCount: 64,
    status: 'active',
    postedDate: '5 days ago',
  },
];

class CareersRepository {
  private vacancies: CareerVacancy[] = [...INITIAL_VACANCIES];

  public async getAll(filter?: Partial<CareerFilterState>): Promise<{ items: CareerVacancy[]; total: number; departments: string[] }> {
    const { data } = await departmentDb.query<CareerVacancy>('careers', 'vacancies', this.vacancies);
    let result = [...data];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.department.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filter?.selectedDepartments && filter.selectedDepartments.length > 0) {
      result = result.filter((v) => filter.selectedDepartments!.includes(v.department));
    }

    if (filter?.selectedTypes && filter.selectedTypes.length > 0) {
      result = result.filter((v) => filter.selectedTypes!.includes(v.type));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((v) => v.status === filter.status);
    }

    const departments = Array.from(new Set(this.vacancies.map((v) => v.department)));

    return { items: result, total: result.length, departments };
  }

  public async getById(id: string): Promise<CareerVacancy | null> {
    const { data } = await departmentDb.query<CareerVacancy>('careers', 'vacancies', this.vacancies, {
      match: { id },
    });
    const found = data.find((v) => v.id === id || v.slug === id);
    return found ? { ...found } : null;
  }

  public async create(vacancyData: Omit<CareerVacancy, 'id' | 'slug' | 'applicantsCount' | 'postedDate'>): Promise<CareerVacancy> {
    const id = `job-${Date.now()}`;
    const slug = slugify(vacancyData.title);

    const newVacancy: CareerVacancy = {
      ...vacancyData,
      id,
      slug,
      applicantsCount: 0,
      postedDate: 'Just now',
    };

    await departmentDb.insert('careers', 'vacancies', newVacancy);
    this.vacancies.unshift(newVacancy);
    return newVacancy;
  }

  public async update(id: string, updates: Partial<CareerVacancy>): Promise<CareerVacancy | null> {
    await departmentDb.update('careers', 'vacancies', id, updates);

    const index = this.vacancies.findIndex((v) => v.id === id || v.slug === id);
    if (index === -1) return null;
    const updated = { ...this.vacancies[index], ...updates };
    this.vacancies[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('careers', 'vacancies', id);

    const index = this.vacancies.findIndex((v) => v.id === id || v.slug === id);
    if (index === -1) return false;
    this.vacancies.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<CareerVacancy>[]): Promise<CareerVacancy[]> {
    const created: CareerVacancy[] = [];
    for (const item of items) {
      if (item.title) {
        const c = await this.create({
          title: item.title,
          department: item.department || 'Academic R&D',
          location: item.location || 'Pan India (Remote / Hybrid)',
          type: item.type || 'Full-time',
          experience: item.experience || '1-3 Years',
          salary: item.salary || 'Competitive',
          skills: item.skills || [],
          descriptionHtml: item.descriptionHtml || `<p>${item.title}</p>`,
          deadline: item.deadline || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          status: item.status || 'active',
        });
        created.push(c);
      }
    }
    return created;
  }
}

export const careersRepository = new CareersRepository();
