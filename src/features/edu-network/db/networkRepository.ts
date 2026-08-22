import { PartnerSchool, NetworkFilterState } from '../types';
import { departmentDb } from '@/lib/database/departmentDbAdapter';

export const INITIAL_SCHOOLS: PartnerSchool[] = [
  {
    id: 'sch-1',
    name: 'Delhi Public School, R.K. Puram',
    code: 'DPS-DEL-01',
    type: 'Senior Secondary K-12',
    board: 'CBSE',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110022',
    studentCount: 3200,
    facultyCount: 180,
    principalName: 'Dr. Padmavati BS',
    email: 'principal@dpsrkp.net',
    phone: '+91 11 4911 5500',
    labsEquipped: ['Physics Practical Lab', 'Chemistry Semi-Micro Lab', 'ATL AI & Robotics Studio'],
    status: 'verified',
    accreditationLevel: 'Tier 1 Lead',
    joinedDate: '2023-04-10',
  },
  {
    id: 'sch-2',
    name: 'National Public School, Indiranagar',
    code: 'NPS-BLR-02',
    type: 'Day School K-12',
    board: 'ICSE',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    studentCount: 2400,
    facultyCount: 140,
    principalName: 'Mrs. Shantha Chandran',
    email: 'contact@npsinr.com',
    phone: '+91 80 2528 0611',
    labsEquipped: ['Composite STEM Innovation Hub', 'Biology Specimen Chamber'],
    status: 'verified',
    accreditationLevel: 'Tier 1 Lead',
    joinedDate: '2023-08-15',
  },
  {
    id: 'sch-3',
    name: 'DAV Model School, Sector 15',
    code: 'DAV-CHD-03',
    type: 'Senior Secondary',
    board: 'CBSE',
    city: 'Chandigarh',
    state: 'Punjab / UT',
    pincode: '160015',
    studentCount: 1950,
    facultyCount: 95,
    principalName: 'Dr. Anuja Sharma',
    email: 'info@davmodel15.com',
    phone: '+91 172 277 0045',
    labsEquipped: ['Electronics & IoT Lab', 'Physics Practical Lab'],
    status: 'pending_review',
    accreditationLevel: 'Tier 2 Certified',
    joinedDate: '2024-01-20',
  },
];

class NetworkRepository {
  private schools: PartnerSchool[] = [...INITIAL_SCHOOLS];

  public async getAll(filter?: Partial<NetworkFilterState>): Promise<{ items: PartnerSchool[]; total: number }> {
    const { data } = await departmentDb.query<PartnerSchool>('network', 'schools', this.schools);
    let result = [...data];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.principalName.toLowerCase().includes(q)
      );
    }

    if (filter?.selectedBoards && filter.selectedBoards.length > 0) {
      result = result.filter((s) => filter.selectedBoards!.includes(s.board));
    }

    if (filter?.selectedStates && filter.selectedStates.length > 0) {
      result = result.filter((s) => filter.selectedStates!.includes(s.state));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((s) => s.status === filter.status);
    }

    return { items: result, total: result.length };
  }

  public async getById(id: string): Promise<PartnerSchool | null> {
    const { data } = await departmentDb.query<PartnerSchool>('network', 'schools', this.schools, {
      match: { id },
    });
    const found = data.find((s) => s.id === id || s.code === id);
    return found ? { ...found } : null;
  }

  public async create(schoolData: Omit<PartnerSchool, 'id' | 'joinedDate'>): Promise<PartnerSchool> {
    const id = `sch-${Date.now()}`;
    const newSchool: PartnerSchool = {
      ...schoolData,
      id,
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    await departmentDb.insert('network', 'schools', newSchool);
    this.schools.unshift(newSchool);
    return newSchool;
  }

  public async update(id: string, updates: Partial<PartnerSchool>): Promise<PartnerSchool | null> {
    await departmentDb.update('network', 'schools', id, updates);

    const index = this.schools.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return null;
    const updated = { ...this.schools[index], ...updates };
    this.schools[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await departmentDb.delete('network', 'schools', id);

    const index = this.schools.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return false;
    this.schools.splice(index, 1);
    return true;
  }
}

export const networkRepository = new NetworkRepository();
