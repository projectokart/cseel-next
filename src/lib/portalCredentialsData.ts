export interface PortalUserCredential {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'organisation' | 'user';
  roleLabel: string;
  institutionOrSubject: string;
  email: string;
  password: string;
  dashboardUrl: string;
  publicProfileUrl: string;
  avatar: string;
  badge: string;
}

export const ALL_PORTAL_CREDENTIALS: PortalUserCredential[] = [
  // ── 👨‍🎓 STUDENTS (Student Dashboard: /student) ─────────────────────────────
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    role: 'student',
    roleLabel: 'Student Innovator (Class 10)',
    institutionOrSubject: 'Delhi Public School, R.K. Puram',
    email: 'aarav.sharma@student.cseel.org',
    password: 'Student@Aarav2026',
    dashboardUrl: '/student',
    publicProfileUrl: '/edu-network/students/aarav-sharma-new-delhi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop',
    badge: '🏆 National ATL Tinkering Gold Medalist',
  },
  {
    id: 'std-2',
    name: 'Ananya Iyer',
    role: 'student',
    roleLabel: 'Student Innovator (Class 11 - PCB)',
    institutionOrSubject: 'The Mother\'s International School, Delhi',
    email: 'ananya.iyer@student.cseel.org',
    password: 'Student@Ananya2026',
    dashboardUrl: '/student',
    publicProfileUrl: '/edu-network/students/ananya-iyer-delhi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop',
    badge: '🧪 24 Live Lab Practicals Completed',
  },
  {
    id: 'std-3',
    name: 'Rohan Patel',
    role: 'student',
    roleLabel: 'Student Innovator (Class 12 - PCM)',
    institutionOrSubject: 'National Public School, Indiranagar, Bengaluru',
    email: 'rohan.patel@student.cseel.org',
    password: 'Student@Rohan2026',
    dashboardUrl: '/student',
    publicProfileUrl: '/edu-network/students/rohan-patel-bengaluru',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    badge: '🤖 Solar IoT Dual-Axis Prototype',
  },
  {
    id: 'std-4',
    name: 'Diya Mukherjee',
    role: 'student',
    roleLabel: 'Student Innovator (Class 9)',
    institutionOrSubject: 'Bombay Scottish School, Mahim, Mumbai',
    email: 'diya.mukherjee@student.cseel.org',
    password: 'Student@Diya2026',
    dashboardUrl: '/student',
    publicProfileUrl: '/edu-network/students/diya-mukherjee-mumbai',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop',
    badge: '🔬 Smart Hydroponics Science Fair',
  },

  // ── 👩‍🏫 TEACHERS (Teacher Dashboard: /teacher) ───────────────────────────
  {
    id: 'tch-1',
    name: 'Dr. Ramesh K. Mukherjee',
    role: 'teacher',
    roleLabel: 'Senior Physics PGT Faculty',
    institutionOrSubject: 'National Public School, Indiranagar, Bengaluru',
    email: 'ramesh.mukherjee@faculty.cseel.org',
    password: 'Faculty@Ramesh2026',
    dashboardUrl: '/teacher',
    publicProfileUrl: '/edu-network/teachers/dr-ramesh-k-mukherjee-bengaluru',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    badge: '⚡ 72h Flash Job Seeker Active • 14 Yrs Exp',
  },
  {
    id: 'tch-2',
    name: 'Sunita Deshmukh',
    role: 'teacher',
    roleLabel: 'Chemistry HOD & ATL Lead',
    institutionOrSubject: 'The Cathedral and John Connon School, Mumbai',
    email: 'sunita.deshmukh@faculty.cseel.org',
    password: 'Faculty@Sunita2026',
    dashboardUrl: '/teacher',
    publicProfileUrl: '/edu-network/teachers/sunita-deshmukh-mumbai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    badge: '⭐ 4.9 Rating • NEP Lab Certified',
  },
  {
    id: 'tch-3',
    name: 'Vipin Narang',
    role: 'teacher',
    roleLabel: 'Robotics & Computer Science PGT',
    institutionOrSubject: 'Delhi Public School, R.K. Puram, New Delhi',
    email: 'vipin.narang@faculty.cseel.org',
    password: 'Faculty@Vipin2026',
    dashboardUrl: '/teacher',
    publicProfileUrl: '/edu-network/teachers/vipin-narang-new-delhi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    badge: '🤖 AI & Microcontrollers Mentor',
  },
  {
    id: 'tch-4',
    name: 'Priyanka Sen',
    role: 'teacher',
    roleLabel: 'Biology TGT & Biotechnology Specialist',
    institutionOrSubject: 'SAI International School, Bhubaneswar',
    email: 'priyanka.sen@faculty.cseel.org',
    password: 'Faculty@Priyanka2026',
    dashboardUrl: '/teacher',
    publicProfileUrl: '/edu-network/teachers/priyanka-sen-bhubaneswar',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop',
    badge: '🔬 Virtual Lab Simulator Master',
  },

  // ── 🏫 ORGANISATIONS / SCHOOLS (School Dashboard: /org) ───────────────────
  {
    id: 'org-1',
    name: 'Delhi Public School, R.K. Puram',
    role: 'organisation',
    roleLabel: 'School Principal & Academic Admin',
    institutionOrSubject: 'CBSE Affiliated Senior Secondary School',
    email: 'principal@dpsrkp.cseel.org',
    password: 'School@DpsRkp2026',
    dashboardUrl: '/org',
    publicProfileUrl: '/edu-network/org/delhi-public-school-rk-puram-delhi',
    avatar: 'https://sc0.blr1.digitaloceanspaces.com/inline/827643-dgxdopizaz-1487753907.JPG',
    badge: '🏫 104 Verified STEM Labs • Rating 4.9',
  },
  {
    id: 'org-2',
    name: 'National Public School, Indiranagar',
    role: 'organisation',
    roleLabel: 'Head of Institution & Lab Director',
    institutionOrSubject: 'CBSE Affiliated STEM Hub, Bengaluru',
    email: 'admin@npsindiranagar.cseel.org',
    password: 'School@NpsBlr2026',
    dashboardUrl: '/org',
    publicProfileUrl: '/edu-network/org/national-public-school-indiranagar-bengaluru',
    avatar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop',
    badge: '🔬 Composite Labs Verified • 3 Open Jobs',
  },
  {
    id: 'org-3',
    name: 'The Cathedral and John Connon School',
    role: 'organisation',
    roleLabel: 'Dean of Academics & STEM Centre',
    institutionOrSubject: 'ICSE / IB Affiliated Heritage School, Mumbai',
    email: 'director@cathedral.cseel.org',
    password: 'School@Cathedral2026',
    dashboardUrl: '/org',
    publicProfileUrl: '/edu-network/org/the-cathedral-and-john-connon-school-mumbai',
    avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop',
    badge: '👑 Verified ATL Tinkering Hub',
  },
  {
    id: 'org-4',
    name: 'SAI International School, Bhubaneswar',
    role: 'organisation',
    roleLabel: 'Vice Chairman & Administration',
    institutionOrSubject: 'CBSE / Cambridge Affiliated School, Odisha',
    email: 'admin@saiinternational.cseel.org',
    password: 'School@SaiOdisha2026',
    dashboardUrl: '/org',
    publicProfileUrl: '/edu-network/org/sai-international-school-bhubaneswar',
    avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop',
    badge: '🏆 No. 1 Day-Cum-Boarding School',
  },

  // ── 👤 GENERAL USER / LEARNER (/user) ────────────────────────────────────
  {
    id: 'usr-1',
    name: 'Rahul Verma',
    role: 'user',
    roleLabel: 'Independent Science Learner & Maker',
    institutionOrSubject: 'Self-Directed STEM Enthusiast',
    email: 'rahul.learner@cseel.org',
    password: 'User@Rahul2026',
    dashboardUrl: '/user',
    publicProfileUrl: '/user/profile',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    badge: '🚀 Projectokart Maker & Sim User',
  },
];

/**
 * Generate CSV Content for Students, Teachers & Organisations Excel download
 */
export function generatePortalUsersCredentialsCSV(): string {
  const headers = [
    'User Name',
    'Account Role',
    'Designation / Class',
    'School / Institute Affiliation',
    'Login Email',
    'Login Password',
    'Private Dashboard URL',
    'Public Directory Profile URL',
    'Special Badges / Status',
  ];

  const rows = ALL_PORTAL_CREDENTIALS.map((user) => [
    `"${user.name}"`,
    `"${user.role.toUpperCase()}"`,
    `"${user.roleLabel}"`,
    `"${user.institutionOrSubject}"`,
    `"${user.email}"`,
    `"${user.password}"`,
    `"${user.dashboardUrl}"`,
    `"${user.publicProfileUrl}"`,
    `"${user.badge}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Trigger client-side direct CSV/Excel download for all portal users
 */
export function downloadPortalCredentialsCSVFile() {
  const csvContent = generatePortalUsersCredentialsCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CSEEL_Students_Teachers_Schools_Credentials_${new Date().toISOString().slice(0, 10)}.csv`);
  link.setAttribute('data-skip-progress', 'true');
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    try {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {}
  }, 100);
}
