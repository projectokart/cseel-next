export interface SchoolRecord {
  // ─── IDENTIFICATION & ROUTING ───
  id: string;
  school_id: string; // Dynamic links (/org/org-school-${school_id})
  school_name: string;
  raw_school_name?: string;
  name?: string;
  shortName?: string;
  udise_code: string;
  udiseCode?: string;
  status: 'Operational' | 'Closed' | 'Verified' | 'Admissions Open';
  year_desc: string; // e.g. "2026-27"
  established_year: string | number;
  recog_year_pri?: string;
  recog_year_sec?: string;
  recog_year_hsec?: string;

  // ─── LOCATION & ADMINISTRATIVE HIERARCHY ───
  state_name: string;
  district_name: string;
  block_name: string;
  cluster_name?: string;
  village_ward: string;
  pincode: string;
  address: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  locality?: string;
  assembly_constituency?: string;
  urban_local_body?: string;
  rural_urban: 'Rural' | 'Urban' | 'Rural' | 'Urban';

  // ─── ACADEMICS, FEES & MANAGEMENT ───
  school_category: string;
  category_desc?: string;
  management_type: string;
  management_desc_state: 'Government' | 'Private' | 'Aided' | 'Other' | string;
  management?: 'Government' | 'Private' | 'Aided' | 'Others' | string;
  type?: 'Primary' | 'Upper Primary' | 'Secondary' | 'Senior Secondary';
  class_from: string;
  class_to: string;
  classes?: string;
  school_type: 'Co-educational' | 'Boys' | 'Girls' | 'Co-ed' | 'Boys' | 'Girls';
  gender?: 'Co-ed' | 'Boys' | 'Girls';
  board_secondary_10th: string;
  board_higher_secondary_12th: string;
  board?: string;
  affiliation?: string;
  affiliation_no?: string;
  affiliation_number?: string;
  medium_of_instruction_1: string;
  medium?: string;
  annual_fee: number; // e.g. 0 for govt, 35000, 55000, 140000
  annual_fee_formatted?: string; // e.g. "Free (Govt)", "₹35k/yr"
  annual_instructional_days?: number | string;
  residential_school?: string;
  minority_school?: string;
  pre_primary_section?: string;
  pm_shri: boolean;

  // ─── CONTACT & LEADERSHIP ───
  headmaster_principal_name: string;
  principalName?: string;
  respondent_name?: string;
  phone: string;
  email: string;
  website?: string;

  // ─── STUDENTS & TEACHERS DEMOGRAPHICS (STR) ───
  total_students: number;
  total_boys?: number;
  total_girls?: number;
  total_teachers: number;
  regular_teachers?: number;
  contract_teachers?: number;
  male_teachers?: number;
  female_teachers?: number;
  teachers_post_graduate_above?: number;
  teachers_graduate?: number;
  teachers_above_55_age?: number;
  teachers_in_service_trained?: number;
  teachers_non_teaching_assign?: number;
  student_teacher_ratio: string; // e.g. "15:1"

  // ─── BUILDING & CLASSROOM INFRASTRUCTURE ───
  building_status?: string;
  total_building_blocks: number;
  classrooms_total?: number;
  other_rooms?: number;
  classrooms_good_condition?: number;
  classrooms_minor_repair?: number;
  classrooms_major_repair?: number;
  boundary_wall_type?: string;
  students_with_furniture?: number | string;

  // ─── LABS, DIGITAL & INFRASTRUCTURE ───
  tinkering_lab_atl: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  ict_lab: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  integrated_science_lab: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  library?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  playground: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  desktop_computers_working?: number;
  laptops_working?: number;
  tablets_working?: number;
  projectors_working?: number;
  printers_total?: number;
  digital_boards_working?: number;
  dth_tv_access?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  internet_available?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;

  // ─── WATER, SANITATION & ACCESSIBILITY ───
  drinking_water?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  electricity?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  solar_panel?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  rainwater_harvesting?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  medical_checkup?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  ramps_accessible?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  handrails?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  boys_toilets_functional?: number;
  girls_toilets_functional?: number;
  boys_urinals?: number;
  girls_urinals?: number;
  cwsn_special_toilets_boys?: number;
  cwsn_special_toilets_girls?: number;
  handwash_available?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;
  meal_handwash_available?: 'Yes' | 'No' | 'Yes' | 'No' | boolean;

  // ─── UI & MEDIA HELPERS ───
  rating: number;
  reviews: number;
  image: string;
  facilities: string[];
  distance?: number;
}

export interface CityCoordinates {
  name: string;
  state: string;
  lat: number;
  lng: number;
  defaultRadius: number;
}

export const POPULAR_CITIES: CityCoordinates[] = [
  { name: 'Rewari', state: 'Haryana', lat: 28.1833, lng: 76.6167, defaultRadius: 5 },
  { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, defaultRadius: 10 },
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, defaultRadius: 10 },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, defaultRadius: 10 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, defaultRadius: 10 },
  { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, defaultRadius: 10 },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, defaultRadius: 10 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, defaultRadius: 10 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, defaultRadius: 10 },
];

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function computeSTR(students: number, teachers: number): string {
  if (!teachers || teachers <= 0) return '15:1';
  return `${Math.round(students / teachers)}:1`;
}

// Authoritative Seed Data (UDISE Verified)
export const SCHOOLS_DATA: SchoolRecord[] = [
  {
    id: '1931599',
    school_id: '1931599',
    school_name: 'ELGI VIDYA BHAVAN',
    name: 'ELGI VIDYA BHAVAN',
    shortName: 'ELGi School',
    udise_code: '1931599',
    udiseCode: '1931599',
    affiliation_number: '1931599',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '2014',
    state_name: 'Tamilnadu',
    state: 'Tamilnadu',
    district_name: 'Coimbatore',
    city: 'Coimbatore',
    block_name: 'Annur',
    cluster_name: 'Kovilpalayam',
    village_ward: 'Kovilpalayam',
    locality: 'Kovilpalayam',
    pincode: '641107',
    address: 'Kovilpalayam, Annur, Coimbatore, Tamil Nadu 641107',
    latitude: 11.1396,
    longitude: 77.0425,
    lat: 11.1396,
    lng: 77.0425,
    rural_urban: 'Rural',
    school_category: 'Secondary School (Class 1 to 10th)',
    management_type: 'Independent / Private Unaided',
    management_desc_state: 'Private',
    management: 'Private',
    class_from: '1',
    class_to: '10',
    classes: 'Class 1st - 10th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'CBSE',
    board_higher_secondary_12th: 'CBSE',
    board: 'CBSE',
    medium_of_instruction_1: 'English',
    medium: 'English',
    annual_fee: 42000,
    annual_fee_formatted: '₹42k/yr',
    headmaster_principal_name: 'Archana V',
    principalName: 'Archana V',
    phone: '0422-2414195',
    email: 'info@elgischool.org',
    website: 'https://www.elgischool.com',
    pm_shri: false,
    total_building_blocks: 3,
    student_teacher_ratio: '19:1',
    total_students: 780,
    total_boys: 410,
    total_girls: 370,
    total_teachers: 42,
    classrooms_total: 32,
    tinkering_lab_atl: 'Yes',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    rating: 4.6,
    reviews: 18,
    image: '',
    facilities: ['Smart Classrooms', 'Science Lab', 'Computer ICT Lab', 'Library', 'Sports Playground'],
  },
  {
    id: '33120100101',
    school_id: '33120100101',
    school_name: 'KOVILPALAYAM GOVT MODEL HIGHER SECONDARY SCHOOL',
    name: 'KOVILPALAYAM GOVT MODEL HIGHER SECONDARY SCHOOL',
    shortName: 'Kovilpalayam Govt School',
    udise_code: '33120100101',
    udiseCode: '33120100101',
    affiliation_number: '',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '1972',
    state_name: 'Tamilnadu',
    state: 'Tamilnadu',
    district_name: 'Coimbatore',
    city: 'Coimbatore',
    block_name: 'Annur',
    cluster_name: 'Kovilpalayam',
    village_ward: 'Kovilpalayam',
    locality: 'Main Road',
    pincode: '641107',
    address: 'Sathy Road, Kovilpalayam, Annur, Coimbatore, Tamil Nadu 641107',
    latitude: 11.1450,
    longitude: 77.0480,
    lat: 11.1450,
    lng: 77.0480,
    rural_urban: 'Rural',
    school_category: 'Higher Secondary School (Class 6 to 12th)',
    management_type: 'Department of Education',
    management_desc_state: 'Government',
    management: 'Government',
    class_from: '6',
    class_to: '12',
    classes: 'Class 6th - 12th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'State Board',
    board_higher_secondary_12th: 'State Board',
    board: 'State Board',
    medium_of_instruction_1: 'Tamil',
    medium: 'Tamil / English',
    annual_fee: 0,
    annual_fee_formatted: 'Free (Govt)',
    headmaster_principal_name: 'M. Senthilkumar',
    principalName: 'M. Senthilkumar',
    phone: '0422-2654321',
    email: 'kovilpalayamghss@gov.in',
    website: '',
    pm_shri: true,
    total_building_blocks: 4,
    student_teacher_ratio: '21:1',
    total_students: 1120,
    total_boys: 590,
    total_girls: 530,
    total_teachers: 54,
    classrooms_total: 44,
    tinkering_lab_atl: 'Yes',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    rating: 4.4,
    reviews: 24,
    image: '',
    facilities: ['Atal Tinkering Lab', 'Hi-Tech Computer Lab', 'Playground', 'Library'],
  },
  {
    id: '33120100202',
    school_id: '33120100202',
    school_name: 'ANNUR CENTRAL MATRICULATION SCHOOL',
    name: 'ANNUR CENTRAL MATRICULATION SCHOOL',
    shortName: 'Annur Central School',
    udise_code: '33120100202',
    udiseCode: '33120100202',
    affiliation_number: '',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '2005',
    state_name: 'Tamilnadu',
    state: 'Tamilnadu',
    district_name: 'Coimbatore',
    city: 'Coimbatore',
    block_name: 'Annur',
    cluster_name: 'Annur',
    village_ward: 'Annur Town',
    locality: 'Othimalai Road',
    pincode: '641653',
    address: 'Othimalai Road, Annur, Coimbatore, Tamil Nadu 641653',
    latitude: 11.1550,
    longitude: 77.0600,
    lat: 11.1550,
    lng: 77.0600,
    rural_urban: 'Urban',
    school_category: 'Higher Secondary (Class 1 to 12th)',
    management_type: 'Private Unaided',
    management_desc_state: 'Private',
    management: 'Private',
    class_from: '1',
    class_to: '12',
    classes: 'Class 1st - 12th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'Matriculation',
    board_higher_secondary_12th: 'Matriculation',
    board: 'State Board',
    medium_of_instruction_1: 'English',
    medium: 'English',
    annual_fee: 38000,
    annual_fee_formatted: '₹38k/yr',
    headmaster_principal_name: 'Dr. R. Natarajan',
    principalName: 'Dr. R. Natarajan',
    phone: '04254-262100',
    email: 'annurcentral@gmail.com',
    website: '',
    total_students: 860,
    total_boys: 450,
    total_girls: 410,
    total_teachers: 46,
    classrooms_total: 36,
    tinkering_lab_atl: 'No',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    pm_shri: false,
    total_building_blocks: 2,
    student_teacher_ratio: '19:1',
    rating: 4.5,
    reviews: 14,
    image: '',
    facilities: ['Science Lab', 'Computer Lab', 'Library', 'Sports'],
  },
  {
    id: '29331008313',
    school_id: '29331008313',
    school_name: 'SRI VIDYARANYA INTERNATIONAL SCHOOL',
    name: 'SRI VIDYARANYA INTERNATIONAL SCHOOL',
    udise_code: '29331008313',
    udiseCode: '29331008313',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '2023',
    state_name: 'KARNATAKA',
    state: 'KARNATAKA',
    district_name: 'YADGIR',
    city: 'YADGIR',
    block_name: 'Yadgir',
    village_ward: 'Hosalli Cross',
    locality: 'Hosalli Cross',
    pincode: '585202',
    address: 'BYPASS STATION ROAD, HOSALLI CROSS, YADGIR',
    latitude: 0,
    longitude: 0,
    lat: 0,
    lng: 0,
    rural_urban: 'Urban',
    school_category: 'Secondary School (Class 1 to 10th)',
    management_type: 'Independent / Private Unaided',
    management_desc_state: 'Private',
    management: 'Private',
    class_from: '1',
    class_to: '10',
    classes: 'Class 1st - 10th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'CBSE',
    board_higher_secondary_12th: 'CBSE',
    board: 'CBSE',
    affiliation: 'Affiliation: 831374',
    affiliation_no: '831374',
    affiliation_number: '831374',
    medium_of_instruction_1: 'English',
    medium: 'English',
    annual_fee: 35000,
    annual_fee_formatted: '₹35k/yr',
    pm_shri: false,
    headmaster_principal_name: 'RAJANI UPPUTOORI',
    principalName: 'RAJANI UPPUTOORI',
    phone: '7892223996',
    email: 'svisyadgir@gmail.com',
    website: 'http://www.sviscbse.in/',
    total_students: 450,
    total_boys: 235,
    total_girls: 215,
    total_teachers: 25,
    male_teachers: 10,
    female_teachers: 15,
    total_building_blocks: 2,
    classrooms_total: 18,
    student_teacher_ratio: '18:1',
    tinkering_lab_atl: 'Yes',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    rating: 0,
    reviews: 0,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    facilities: ['Atal Tinkering Lab', 'Computer Lab', 'Smart Classrooms', 'Sports Ground']
  },
  {
    id: '29280704515',
    school_id: '29280704515',
    school_name: 'VIDYA VIHAR INTERNATIONAL SCHOOL',
    name: 'VIDYA VIHAR INTERNATIONAL SCHOOL',
    shortName: 'Vidya Vihar International',
    udise_code: '29280704515',
    udiseCode: '29280704515',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '2008',
    state_name: 'KARNATAKA',
    state: 'KARNATAKA',
    district_name: 'BENGALURU URBAN',
    city: 'Bengaluru',
    block_name: 'Bengaluru North',
    village_ward: 'Abbigere',
    locality: 'Abbigere',
    pincode: '560090',
    address: 'Abbigere, Lakshmipura Main Road, Bengaluru North, Karnataka 560090',
    latitude: 13.0827,
    longitude: 77.5256,
    lat: 13.0827,
    lng: 77.5256,
    rural_urban: 'Urban',
    school_category: 'Secondary School (Class 1 to 10th)',
    management_type: 'Independent / Private Unaided',
    management_desc_state: 'Private',
    management: 'Private',
    class_from: 'Nursery',
    class_to: '10',
    classes: 'Nursery - 10th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'CBSE',
    board_higher_secondary_12th: 'CBSE',
    board: 'CBSE',
    affiliation: 'Affiliation: 830412',
    affiliation_no: '830412',
    affiliation_number: '830412',
    medium_of_instruction_1: 'English',
    medium: 'English',
    annual_fee: 45000,
    annual_fee_formatted: '₹45k/yr',
    pm_shri: false,
    headmaster_principal_name: 'Principal In-Charge',
    principalName: 'Principal In-Charge',
    phone: '08028391234',
    email: 'info@vidyavihar.edu.in',
    website: 'https://vidyavihar.edu.in',
    total_students: 1250,
    total_boys: 650,
    total_girls: 600,
    total_teachers: 55,
    male_teachers: 20,
    female_teachers: 35,
    total_building_blocks: 3,
    classrooms_total: 35,
    student_teacher_ratio: '23:1',
    tinkering_lab_atl: 'Yes',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    rating: 4.7,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    facilities: ['Smart Classes', 'Library', 'Computer ICT Lab', 'Science Composite Lab', 'Playground / Sports'],
  },
  {
    id: '06180101926',
    school_id: '06180101926',
    school_name: 'HERITAGE XPERIENTIAL LEARNING SCHOOL',
    name: 'HERITAGE XPERIENTIAL LEARNING SCHOOL',
    udise_code: '06180101926',
    udiseCode: '06180101926',
    status: 'Operational',
    year_desc: '2026-27',
    established_year: '2003',
    state_name: 'HARYANA',
    state: 'HARYANA',
    district_name: 'GURUGRAM',
    city: 'Gurugram',
    block_name: 'Gurgaon',
    village_ward: 'Sector 62',
    locality: 'Sector 62',
    pincode: '122011',
    address: 'Sector 62, Gurugram, Haryana - 122011',
    latitude: 28.4068,
    longitude: 77.0858,
    lat: 28.4068,
    lng: 77.0858,
    rural_urban: 'Urban',
    school_category: 'Senior Secondary (Class Nursery to 12th)',
    management_type: 'Private Unaided (Recognized)',
    management_desc_state: 'Private',
    management: 'Private',
    class_from: 'Nursery',
    class_to: '12',
    classes: 'Nursery - 12th',
    school_type: 'Co-educational',
    gender: 'Co-ed',
    board_secondary_10th: 'CBSE',
    board_higher_secondary_12th: 'CBSE',
    board: 'CBSE',
    affiliation: 'Affiliation: 530550',
    affiliation_no: '530550',
    affiliation_number: '530550',
    medium_of_instruction_1: 'English',
    medium: 'English',
    annual_fee: 455600,
    annual_fee_formatted: '₹4.55L - ₹5.32L/yr',
    pm_shri: false,
    headmaster_principal_name: 'Dr. Mona Khanna',
    principalName: 'Dr. Mona Khanna',
    phone: '01242855124',
    email: 'info@ggn.hxls.org',
    website: 'https://www.heritagexperiential.org/',
    total_students: 3750,
    total_boys: 1950,
    total_girls: 1800,
    total_teachers: 250,
    male_teachers: 55,
    female_teachers: 195,
    total_building_blocks: 4,
    classrooms_total: 135,
    student_teacher_ratio: '15:1',
    tinkering_lab_atl: 'Yes',
    ict_lab: 'Yes',
    integrated_science_lab: 'Yes',
    library: 'Yes',
    playground: 'Yes',
    rating: 0,
    reviews: 0,
    image: 'https://www.heritagexperiential.org/wp-content/uploads/2026/06/HXLS62-Campus.png',
    facilities: ['Experiential STEM Labs', 'Interactive Smart Classrooms', 'Olympic Sports Complex', 'Design & Maker Studios', 'Atal Tinkering Lab']
  }
];
