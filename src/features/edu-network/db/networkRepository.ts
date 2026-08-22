import { PartnerSchool, NetworkFilterState } from '../types';

export const INITIAL_SCHOOLS: PartnerSchool[] = [
  {
    id: 'sch-1',
    name: 'Delhi Public School (R.K. Puram)',
    code: 'DPS-DEL-001',
    type: 'ATL School',
    board: 'CBSE',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110022',
    studentCount: 3200,
    facultyCount: 140,
    principalName: 'Dr. Meenakshi Sundaram',
    email: 'principal@dpsrkp.edu.in',
    phone: '+91 11 2617 4242',
    labsEquipped: ['ATL Robotics Lab', 'Borosilicate Chemistry Lab', 'Optics Physics Lab'],
    status: 'verified',
    accreditationLevel: 'Tier 1 Lead',
    joinedDate: '2024-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-2',
    name: 'National Public School (Indiranagar)',
    code: 'NPS-BLR-002',
    type: 'K-12',
    board: 'CBSE',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    studentCount: 2450,
    facultyCount: 115,
    principalName: 'Dr. Shantha Chandran',
    email: 'office@npsinr.edu.in',
    phone: '+91 80 2528 0611',
    labsEquipped: ['STEM Makerspace', 'Biochemistry Research Lab'],
    status: 'verified',
    accreditationLevel: 'Tier 1 Lead',
    joinedDate: '2024-03-20',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-3',
    name: 'DAV Model School (Sector 15)',
    code: 'DAV-CHD-003',
    type: 'K-12',
    board: 'CBSE',
    city: 'Chandigarh',
    state: 'Punjab / UT',
    pincode: '160015',
    studentCount: 1890,
    facultyCount: 88,
    principalName: 'Mrs. Anuja Sharma',
    email: 'davsec15@gmail.com',
    phone: '+91 172 254 3956',
    labsEquipped: ['Physics practical Lab', 'Robotics Hub'],
    status: 'verified',
    accreditationLevel: 'Tier 2 Certified',
    joinedDate: '2024-06-10',
    created_at: new Date().toISOString(),
  },
];

class NetworkRepository {
  private schools: PartnerSchool[] = [...INITIAL_SCHOOLS];

  public async getAll(filter?: Partial<NetworkFilterState>): Promise<{ items: PartnerSchool[]; total: number; states: string[]; boards: string[] }> {
    let result = [...this.schools];

    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.principalName.toLowerCase().includes(q)
      );
    }

    if (filter?.selectedStates && filter.selectedStates.length > 0) {
      result = result.filter((s) => filter.selectedStates!.includes(s.state));
    }

    if (filter?.selectedBoards && filter.selectedBoards.length > 0) {
      result = result.filter((s) => filter.selectedBoards!.includes(s.board));
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((s) => s.status === filter.status);
    }

    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'students':
          result.sort((a, b) => b.studentCount - a.studentCount);
          break;
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          break;
      }
    }

    const states = Array.from(new Set(this.schools.map((s) => s.state)));
    const boards = Array.from(new Set(this.schools.map((s) => s.board)));

    return { items: result, total: result.length, states, boards };
  }

  public async getById(id: string): Promise<PartnerSchool | null> {
    const found = this.schools.find((s) => s.id === id || s.code === id);
    return found ? { ...found } : null;
  }

  public async create(data: Omit<PartnerSchool, 'id' | 'created_at' | 'updated_at'>): Promise<PartnerSchool> {
    const id = `sch-${Date.now()}`;
    const newSchool: PartnerSchool = {
      ...data,
      id,
      joinedDate: data.joinedDate || new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.schools.unshift(newSchool);
    return newSchool;
  }

  public async update(id: string, updates: Partial<PartnerSchool>): Promise<PartnerSchool | null> {
    const index = this.schools.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return null;
    const updated = { ...this.schools[index], ...updates, updated_at: new Date().toISOString() };
    this.schools[index] = updated;
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const index = this.schools.findIndex((s) => s.id === id || s.code === id);
    if (index === -1) return false;
    this.schools.splice(index, 1);
    return true;
  }

  public async bulkInsert(items: Partial<PartnerSchool>[]): Promise<PartnerSchool[]> {
    const created: PartnerSchool[] = [];
    for (const item of items) {
      if (!item.name || !item.city) continue;
      const school = await this.create({
        name: item.name,
        code: item.code || `SCH-${Date.now().toString().slice(-4)}`,
        type: item.type || 'K-12',
        board: item.board || 'CBSE',
        city: item.city,
        state: item.state || 'Delhi',
        pincode: item.pincode || '110001',
        studentCount: Number(item.studentCount) || 500,
        facultyCount: Number(item.facultyCount) || 30,
        principalName: item.principalName || 'Principal',
        email: item.email || 'school@cseel.org',
        phone: item.phone || '+91 9876543210',
        labsEquipped: item.labsEquipped || ['Standard STEM Lab'],
        status: item.status || 'verified',
        accreditationLevel: item.accreditationLevel || 'Associate Partner',
        joinedDate: new Date().toISOString().slice(0, 10),
      });
      created.push(school);
    }
    return created;
  }
}

export const networkRepository = new NetworkRepository();
