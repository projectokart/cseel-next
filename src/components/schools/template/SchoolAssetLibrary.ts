export interface SchoolIconOption {
  id: string;
  name: string;
  category: 'Labs & Tech' | 'Academics & Arts' | 'Sports & Fitness' | 'Campus & Facilities';
  iconName: string;
  color: string;
}

export interface SchoolIllustrationOption {
  id: string;
  title: string;
  category: string;
  previewName: string;
}

export interface CuratedPhotoOption {
  id: string;
  title: string;
  category: 'Campus' | 'Labs' | 'Sports' | 'Classroom' | 'Transport' | 'Events';
  url: string;
}

export const SCHOOL_ICONS_COLLECTION: SchoolIconOption[] = [
  // Labs & Tech
  { id: 'flask', name: 'Science & Chemistry Lab', category: 'Labs & Tech', iconName: 'FlaskConical', color: '#2563EB' },
  { id: 'bot', name: 'AI & Robotics Lab', category: 'Labs & Tech', iconName: 'Bot', color: '#7C3AED' },
  { id: 'monitor', name: 'Computer & Coding Lab', category: 'Labs & Tech', iconName: 'Monitor', color: '#0284C7' },
  { id: 'tv', name: 'Smart Digital Classrooms', category: 'Labs & Tech', iconName: 'Tv', color: '#059669' },
  { id: 'microscope', name: 'Biology & Life Sciences Lab', category: 'Labs & Tech', iconName: 'Eye', color: '#16A34A' },
  { id: 'atom', name: 'Physics & Tinkering Lab', category: 'Labs & Tech', iconName: 'Sparkles', color: '#D97706' },

  // Academics & Arts
  { id: 'book', name: 'Central Library & Reading Halls', category: 'Academics & Arts', iconName: 'BookOpen', color: '#0D9488' },
  { id: 'palette', name: 'Fine Arts, Craft & Design', category: 'Academics & Arts', iconName: 'Palette', color: '#E11D48' },
  { id: 'award', name: 'Excellence & Olympiads', category: 'Academics & Arts', iconName: 'Award', color: '#F59E0B' },
  { id: 'grad', name: 'Higher Secondary & Career Wing', category: 'Academics & Arts', iconName: 'GraduationCap', color: '#4F46E5' },
  { id: 'speech', name: 'Language Lab & Debate', category: 'Academics & Arts', iconName: 'MessageSquare', color: '#0284C7' },

  // Sports & Fitness
  { id: 'sports', name: 'Multi-Sport Complex & Grounds', category: 'Sports & Fitness', iconName: 'Activity', color: '#EA580C' },
  { id: 'trophy', name: 'Championship Tournaments', category: 'Sports & Fitness', iconName: 'Trophy', color: '#CA8A04' },
  { id: 'target', name: 'Archery, Shooting & Focus Sports', category: 'Sports & Fitness', iconName: 'Target', color: '#DC2626' },
  { id: 'heart', name: 'Yoga, Meditation & Wellness', category: 'Sports & Fitness', iconName: 'Heart', color: '#EC4899' },

  // Campus & Facilities
  { id: 'bus', name: 'GPS-Tracked Bus Transport Fleet', category: 'Campus & Facilities', iconName: 'Bus', color: '#EAB308' },
  { id: 'medical', name: 'Infirmary & First Aid Care', category: 'Campus & Facilities', iconName: 'HeartPulse', color: '#EF4444' },
  { id: 'hostel', name: 'Boarding & Student Residential Wing', category: 'Campus & Facilities', iconName: 'Home', color: '#6366F1' },
  { id: 'audit', name: 'Auditorium & Amphitheatre', category: 'Campus & Facilities', iconName: 'Building2', color: '#3B82F6' },
  { id: 'security', name: '24/7 CCTV & Campus Safety', category: 'Campus & Facilities', iconName: 'ShieldCheck', color: '#10B981' },
  { id: 'cafe', name: 'Nutritious Cafeteria & Dining', category: 'Campus & Facilities', iconName: 'Lightbulb', color: '#F97316' },
];

export const SCHOOL_ILLUSTRATIONS_COLLECTION: SchoolIllustrationOption[] = [
  { id: 'science-lab', title: 'Experiential Science Laboratory', category: 'Labs', previewName: 'ScienceLabIllustration' },
  { id: 'computer-lab', title: 'High-Tech Computer Lab', category: 'Labs', previewName: 'ComputerLabIllustration' },
  { id: 'robotics-lab', title: 'Robotics & STEM Tinkering Station', category: 'Labs', previewName: 'RoboticsLabIllustration' },
  { id: 'library', title: 'Modern Library & Digital Archives', category: 'Academics', previewName: 'LibraryIllustration' },
  { id: 'smart-class', title: 'Smart Classroom & Interactive Panels', category: 'Academics', previewName: 'SmartClassroomIllustration' },
  { id: 'sports', title: 'Outdoor Sports & Athletics Grounds', category: 'Sports', previewName: 'SportsIllustration' },
  { id: 'art-music', title: 'Art, Music & Creative Studio', category: 'Arts', previewName: 'ArtMusicIllustration' },
  { id: 'auditorium', title: 'Centrally Air-Conditioned Auditorium', category: 'Events', previewName: 'AuditoriumIllustration' },
  { id: 'transport', title: 'Safe Fleet Transport & Bus Facility', category: 'Transport', previewName: 'TransportIllustration' },
  { id: 'medical', title: 'Full-Time Doctor & Medical Infirmary', category: 'Health', previewName: 'MedicalRoomIllustration' },
  { id: 'campus', title: 'Green Eco-Friendly School Campus', category: 'Campus', previewName: 'SchoolCampusIllustration' },
  { id: 'principal', title: 'Principal & Leadership Desk', category: 'Admin', previewName: 'PrincipalDeskIllustration' },
];

export const CURATED_SCHOOL_PHOTOS: CuratedPhotoOption[] = [
  {
    id: 'campus-1',
    title: 'Modern Academic Building',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'campus-2',
    title: 'Heritage School Portico',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'campus-3',
    title: 'Lush Green School Quadrangle',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-1',
    title: 'Advanced Science Laboratory Bench',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-2',
    title: 'Robotics & STEM Tinkering Hub',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'lab-3',
    title: 'Computer Workstations Lab',
    category: 'Labs',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'class-1',
    title: 'Active Interactive Classroom',
    category: 'Classroom',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sports-1',
    title: 'Sports Field & Athletics Track',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'transport-1',
    title: 'School Transport Fleet',
    category: 'Transport',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'events-1',
    title: 'Annual Day Celebrations & Stage',
    category: 'Events',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  }
];
