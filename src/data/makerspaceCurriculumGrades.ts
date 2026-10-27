export interface CurriculumGradeItem {
  gradeNumber: number;
  gradeSlug: string;
  title: string;
  subtitle: string;
  chaptersCount?: number;
  activitiesCount?: number;
  ageGroup: string;
  themeColor: string;
  accentColor: string;
  status: 'active' | 'coming_soon';
  bookUrl?: string;
  downloadUrl?: string;
  description: string;
  highlights: string[];
}

export const MAKERSPACE_GRADES: CurriculumGradeItem[] = [
  {
    gradeNumber: 1,
    gradeSlug: 'grade-1',
    title: 'Grade 1 - Complete STEM Tinkering Curriculum',
    subtitle: 'Sensory Exploration, Art & Craft Engineering, Shapes & Fun Physics',
    chaptersCount: 30,
    activitiesCount: 100,
    ageGroup: 'Ages 5 - 7 (Primary)',
    themeColor: 'from-amber-400 to-orange-500',
    accentColor: '#FF914D',
    status: 'active',
    bookUrl: '/makerspace/curriculum/grade-1',
    description: 'An immersive 30-chapter foundational STEM workbook designed for young makers. Features hands-on paper folding, balance exploration, marble runs, color synthesis, and simple mechanisms aligned with NEP 2020 experiential learning.',
    highlights: ['30 Full Interactive Chapters', '100+ Hands-on Tasks', 'Color, Shapes & Balances', 'Material Safety Rules']
  },
  {
    gradeNumber: 2,
    gradeSlug: 'grade-2',
    title: 'Grade 2 - Makerspace Discovery & Structures',
    subtitle: 'Wheels, Axles, Levers & Material Properties',
    chaptersCount: 30,
    activitiesCount: 95,
    ageGroup: 'Ages 6 - 8 (Primary)',
    themeColor: 'from-sky-400 to-blue-600',
    accentColor: '#38B6FF',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-2',
    description: 'Explores mechanical foundations, motion, gravity, floating/sinking, and elementary structural design with recycled materials.',
    highlights: ['Structural Stability', 'Simple Wheels & Rollers', 'Water & Wind Energy Basics', 'Design Notebook Practice']
  },
  {
    gradeNumber: 3,
    gradeSlug: 'grade-3',
    title: 'Grade 3 - Early Mechanical Tinkering & Optics',
    subtitle: 'Light, Shadows, Pulleys & Mechanical Linkages',
    chaptersCount: 32,
    activitiesCount: 110,
    ageGroup: 'Ages 7 - 9 (Primary)',
    themeColor: 'from-emerald-400 to-teal-600',
    accentColor: '#10B981',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-3',
    description: 'Hands-on discovery of reflection, shadows, periscopes, simple gear trains, and weight-distribution engineering.',
    highlights: ['Periscopes & Kaleidoscope Labs', 'Gear Systems', 'Pulley Lift Models', 'Scientific Measurement']
  },
  {
    gradeNumber: 4,
    gradeSlug: 'grade-4',
    title: 'Grade 4 - Basic Circuits & Pneumatics',
    subtitle: 'Paper Circuits, Conductivity, Air Pressure & Hydraulic Arms',
    chaptersCount: 30,
    activitiesCount: 90,
    ageGroup: 'Ages 8 - 10 (Junior)',
    themeColor: 'from-purple-400 to-indigo-600',
    accentColor: '#8C52FF',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-4',
    description: 'Introduces safe low-voltage DC circuits, switches, conductive copper tape mazes, syringes for air and fluid mechanics.',
    highlights: ['Paper Circuit Cards', 'Syringe Hydraulic Lifts', 'Series vs Parallel Discovery', 'Magnetism & Compasses']
  },
  {
    gradeNumber: 5,
    gradeSlug: 'grade-5',
    title: 'Grade 5 - Electromagnetism & Design Thinking',
    subtitle: 'DC Motors, Electromagnets, Sound Waves & Prototyping',
    chaptersCount: 32,
    activitiesCount: 105,
    ageGroup: 'Ages 9 - 11 (Junior)',
    themeColor: 'from-rose-400 to-red-600',
    accentColor: '#F43F5E',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-5',
    description: 'Building homopolar motors, buzzers, acoustic resonance tubes, and structural bridge load challenges.',
    highlights: ['Electromagnet Cranes', 'Acoustic Megaphones', 'Truss Bridge Load Tests', 'Introduction to Prototyping']
  },
  {
    gradeNumber: 6,
    gradeSlug: 'grade-6',
    title: 'Grade 6 - Middle School Innovation & 3D Thinking',
    subtitle: '3D Spatial Modeling, Sensor Basics & Environmental Tech',
    chaptersCount: 34,
    activitiesCount: 120,
    ageGroup: 'Ages 10 - 12 (Middle)',
    themeColor: 'from-cyan-400 to-blue-700',
    accentColor: '#0284C7',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-6',
    description: 'Bridge between physical tinkering and digital design: isometric sketching, Tinkercad 3D modeling, and basic sensors.',
    highlights: ['Tinkercad 3D Basics', 'LDR & Solar Tracker', 'Hydroponics Model', 'CAD to Physical Making']
  },
  {
    gradeNumber: 7,
    gradeSlug: 'grade-7',
    title: 'Grade 7 - Robotics & Microcontroller Exploration',
    subtitle: 'Block-Based Coding, Micro:bit / Arduino & Smart Automations',
    chaptersCount: 36,
    activitiesCount: 130,
    ageGroup: 'Ages 11 - 13 (Middle)',
    themeColor: 'from-violet-500 to-purple-800',
    accentColor: '#7C3AED',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-7',
    description: 'Hands-on programming of LEDs, ultrasonic distance sensors, servo motors, and automated plant-watering prototypes.',
    highlights: ['Block Programming (Blockly)', 'Ultrasonic Obstacle Detectors', 'Servo Robotic Grippers', 'Smart Home Prototypes']
  },
  {
    gradeNumber: 8,
    gradeSlug: 'grade-8',
    title: 'Grade 8 - Applied Engineering & IoT Prototyping',
    subtitle: 'Data Logging, Environmental Sensors, Mechanics & ATL Capstones',
    chaptersCount: 36,
    activitiesCount: 140,
    ageGroup: 'Ages 12 - 14 (Middle)',
    themeColor: 'from-amber-500 to-red-700',
    accentColor: '#D97706',
    status: 'coming_soon',
    bookUrl: '/makerspace/curriculum/grade-8',
    description: 'Advanced project-based learning: Wi-Fi/Bluetooth sensors, line-following robots, automated sorting mechanisms, and science fair capstones.',
    highlights: ['Line Follower Robot', 'Cloud Data Loggers', 'Rapid Prototyping Sprints', 'ATL Innovation Marathon Ready']
  }
];
