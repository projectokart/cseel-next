import json

with open('cleaned_atl_151.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

header = """export interface AtlEquipmentItem {
  srNo: number;
  package: 'Package 1' | 'Package 2' | 'Package 3' | 'Package 4';
  name: string;
  spec: string;
  qty60: string; // Quantity for 60 students
  qty90: string; // Quantity for 90 students
  type: 'Consumable' | 'Equipment';
  application: string;
  category: string;
  refUrl: string;
}

export interface AtlOfficialLink {
  title: string;
  subtitle: string;
  url: string;
  isPdf?: boolean;
}

export interface AtlSubpageMeta {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  badge: string;
  readTime: string;
  heroImage: string;
  heroImageAlt: string;
  tagline: string;
}

export const ATL_OFFICIAL_LINKS: AtlOfficialLink[] = [
  {
    title: 'NITI Aayog ATL Official Overview',
    subtitle: 'aim.gov.in/atl-overview.php — Atal Innovation Mission',
    url: 'https://aim.gov.in/atl-overview.php',
    isPdf: false
  },
  {
    title: 'Official ATL Equipment List (60 Students PDF)',
    subtitle: 'aim.gov.in Gazetted Specification for 60-Student Batches',
    url: 'https://aim.gov.in/pdf/ATL_Equipment_List/ATL_Equipment_List_60_students.pdf',
    isPdf: true
  },
  {
    title: 'Official ATL Equipment List (90 Students PDF)',
    subtitle: 'aim.gov.in Gazetted Specification for 90-Student Batches',
    url: 'https://aim.gov.in/pdf/ATL_Equipment_List/ATL_Equipment_List_90_students.pdf',
    isPdf: true
  },
  {
    title: 'ATL Fund Utilization Guidelines (PDF)',
    subtitle: 'Official NITI Aayog Grant-in-Aid & PFMS Rulebook',
    url: 'https://aim.gov.in/pdf/ATL-Fund-Utilization-Guidelines.pdf',
    isPdf: true
  },
  {
    title: 'ATL Query & Compliance Resolution Portal',
    subtitle: 'atl.aim.gov.in — School Compliance & Tranche Dashboard',
    url: 'https://atl.aim.gov.in',
    isPdf: false
  },
  {
    title: 'PFMS Public Financial Management System',
    subtitle: 'pfms.nic.in — Central Treasury Scheme [0217]',
    url: 'https://pfms.nic.in',
    isPdf: false
  }
];

export const ATL_EQUIPMENT_DATA: AtlEquipmentItem[] = """

footer = """;

export const ATL_SUBPAGES: Record<string, AtlSubpageMeta> = {
  overview: {
    slug: 'overview',
    title: 'Atal Tinkering Lab (ATL 2.0) Master Setup Guide & Operational Framework (2026)',
    shortTitle: 'ATL 2.0 Master Hub',
    eyebrow: 'NITI Aayog Flagship Innovation Model',
    badge: 'NITI Aayog Certified',
    readTime: '9 min read',
    heroImage: '/images/categories/technology.jpg',
    heroImageAlt: 'Students prototyping with 3D printer and robotics in modern Atal Tinkering Lab',
    tagline: 'Under the vision of cultivating one million neoteric child innovators across India, NITI Aayog establishes Atal Tinkering Laboratories (ATLs) in schools. Explore the complete 2026 setup blueprint, package guidelines, and operational framework.'
  },
  equipment: {
    slug: 'equipment',
    title: 'ATL Equipment List (Package 1 to 4): Official 60 vs 90 Students Specification (2026)',
    shortTitle: 'Equipment & Packages (60 vs 90)',
    eyebrow: 'Official NITI Aayog Inventory',
    badge: '151 Mandated SKUs',
    readTime: '12 min read',
    heroImage: '/images/categories/engineering.jpg',
    heroImageAlt: 'Comprehensive table of Package 1 to 4 ATL equipment with 3D printers, microcontrollers and tools',
    tagline: 'Itemized, clause-by-clause bill of materials for Package 1 (Electronics & IoT), Package 2 (3D Printing), Package 3 (Mechanical Tools), and Package 4 (Power & Safety) comparing official 60-student and 90-student batch allocations.'
  },
  infrastructure: {
    slug: 'infrastructure',
    title: 'ATL Space, Floor Plan & Room Infrastructure Norms: 1,500 Sq. Ft. Blueprint (2026)',
    shortTitle: 'Space & 1,500 Sq Ft Layout',
    eyebrow: 'Mandatory Architectural Guidelines',
    badge: '1,500 Sq Ft Norm',
    readTime: '8 min read',
    heroImage: '/images/categories/chemistry.jpg',
    heroImageAlt: 'Architectural layout of Atal Tinkering Lab showing 4 functional student zones and furniture',
    tagline: 'Mandatory physical room specifications, 4 functional zones (Ideation, Tinkering, Fabrication, Prototyping), electrical load distribution, ESD rubber matting, and furniture ergonomics required for NITI Aayog compliance.'
  },
  cost: {
    slug: 'cost',
    title: 'ATL Setup Cost & Budget Breakdown: ₹20 Lakh Grant Tranches & PFMS Guide (2026)',
    shortTitle: 'Cost, Budget & ₹20L Grant',
    eyebrow: 'Financial Norms & Audit Protocol',
    badge: '₹20 Lakh Funding',
    readTime: '8 min read',
    heroImage: '/images/categories/mathematics.jpg',
    heroImageAlt: 'Financial budget breakdown chart showing Tranche 1, Tranche 2, and Tranche 3 ATL grant allocation',
    tagline: 'Transparent financial analysis of the ₹20 Lakh Grant-in-Aid: ₹10 Lakh Capital Establishment grant, ₹10 Lakh 5-year O&M envelope, Tranche-1 (₹12 Lakh) upfront credit, Form GFR 12-A submission, and PFMS accounting.'
  },
  vendor: {
    slug: 'vendor',
    title: 'Empanelled Turnkey Vendors for ATL: GeM Procurement, Warranty & Setup Guide (2026)',
    shortTitle: 'GeM Turnkey Vendor Guide',
    eyebrow: 'Government Procurement Protocol',
    badge: 'GeM Registered',
    readTime: '7 min read',
    heroImage: '/images/categories/technology.jpg',
    heroImageAlt: 'Turnkey vendor technicians commissioning 3D printer and testing electronics in school ATL',
    tagline: 'How to select a verified turnkey partner on the Government e-Marketplace (GeM), ensure OEM product warranties, obtain certified teacher master training, and avoid common audit objections during NITI Aayog inspections.'
  }
};
"""

ts_content = header + json.dumps(items, indent=2, ensure_ascii=False) + footer

with open(r'd:\Projects\cseel_next\cseel-next\src\lib\atlData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Successfully written atlData.ts with all 151 items!')
