'use client';

import React, { useState, useEffect, useRef } from 'react';
import { resolveLocationViaApi } from '@/lib/location-utils';
import {
  Sparkles,
  Save,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Trash2,
  Copy,
  Plus,
  Minus,
  Compass,
  CheckCircle2,
  AlertCircle,
  Video,
  Image as ImageIcon,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  Palette,
  Paintbrush,
  Highlighter,
  Type,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  Play,
  RotateCcw,
  RotateCw,
  BookOpen,
  FlaskConical,
  Zap,
  Target,
  TrendingUp,
  FolderGit2,
  Languages,
  ShieldCheck,
  Shield,
  User,
  ExternalLink,
  Lock,
  Star,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  CaseUpper,
  Sliders,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Search,
  CheckCircle,
  Medal,
  LocateFixed,
  Navigation,
  Baseline
} from 'lucide-react';

export type SectionType =
  | 'header_hero'
  | 'metrics_strip'
  | 'career_objective'
  | 'advantage_box'
  | 'qualifications_table'
  | 'experience_timeline'
  | 'certifications_box'
  | 'skills_tags'
  | 'areas_of_expertise'
  | 'key_achievements'
  | 'personal_details'
  | 'experiments_section'
  | 'demo_videos'
  | 'photo_gallery'
  | 'custom_richtext';

export interface BlockStyle {
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontFamily?: 'sans' | 'serif' | 'mono' | 'heading';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  backgroundColor?: string;
  highlightColor?: string;
  borderColor?: string;
  padding?: 'compact' | 'normal' | 'relaxed';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  listStyle?: 'disc' | 'decimal' | 'none';
  dropCap?: boolean;
  customClass?: string;
}

export interface ResumeSectionBlock {
  id: string;
  type: SectionType;
  title: string;
  data: any;
  style?: BlockStyle;
}

export interface ResumeBuilderCanvasProps {
  initialData?: any;
  userId?: string;
  onSave?: (profile: any) => Promise<any>;
  onClose?: () => void;
}

export function getSafeEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const url = rawUrl.trim();

  // 1. Google Drive File
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([\w-]+)/i);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // 2. Google Drive Folder
  const folderMatch = url.match(/drive\.google\.com\/drive\/folders\/([\w-]+)/i);
  if (folderMatch) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`;
  }

  // 3. YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // 4. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
}

const COLOR_PALETTE = [
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Slate Light', hex: '#f1f5f9' },
  { name: 'Slate Gray', hex: '#64748b' },
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Deep Black', hex: '#020617' }
];

// Helper: Build Combined Formatted Address (localAddress, district, state - pincode)
export function buildFormattedAddress(local?: string, district?: string, state?: string, pincode?: string) {
  const parts = [local?.trim(), district?.trim(), state?.trim()].filter(Boolean);
  let addr = parts.join(', ');
  if (pincode?.trim()) {
    addr += (addr ? ' - ' : '') + pincode.trim();
  }
  return addr;
}

// Helper: Calculate Haversine Distance in Kilometers
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Helper: Parse Google Maps URLs or raw coordinates string to extract latitude & longitude
export function parseGoogleMapsLocation(input: string): { latitude: number; longitude: number } | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // 1. Raw Coordinates e.g. "28.1432, 77.3241" or "28.1432,77.3241"
  const rawCoordsMatch = trimmed.match(/^([-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)),\s*([-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$/);
  if (rawCoordsMatch) {
    return {
      latitude: parseFloat(rawCoordsMatch[1]),
      longitude: parseFloat(rawCoordsMatch[5])
    };
  }

  // 2. URL containing @lat,lng e.g. /@28.1432,77.3241,17z
  const atMatch = trimmed.match(/@([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/);
  if (atMatch) {
    return {
      latitude: parseFloat(atMatch[1]),
      longitude: parseFloat(atMatch[2])
    };
  }

  // 3. URL query parameter q=lat,lng or ll=lat,lng or destination=lat,lng
  const queryMatch = trimmed.match(/[?&](?:q|ll|destination)=([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/i);
  if (queryMatch) {
    return {
      latitude: parseFloat(queryMatch[1]),
      longitude: parseFloat(queryMatch[2])
    };
  }

  // 4. Fallback search for any "lat,lng" float pair in the string
  const generalPairMatch = trimmed.match(/([-+]?\d{1,2}\.\d{4,}),\s*([-+]?\d{1,3}\.\d{4,})/);
  if (generalPairMatch) {
    return {
      latitude: parseFloat(generalPairMatch[1]),
      longitude: parseFloat(generalPairMatch[2])
    };
  }

  return null;
}

// Complete Authentic Master Sections (Original Starting Layout with All Details)

export const EMPTY_RESUME_SECTIONS: ResumeSectionBlock[] = [
  {
    id: 'sec-hero',
    type: 'header_hero',
    title: 'Hero Header & Contact',
    data: {
      name: '',
      slug: '',
      subject: 'Physics Faculty',
      title: '',
      experienceBadge: '',
      phone: '',
      altPhone: '',
      email: '',
      photoUrl: '',
      bio: '',
      address: '',
      addressDetails: {
        state: '',
        district: '',
        pincode: '',
        blockOrCluster: '',
        localAddress: '',
        googleMapLocation: '',
        isLocationVerified: false
      }
    }
  },
  {
    id: 'sec-objective',
    type: 'career_objective',
    title: 'Career Objective',
    data: {
      heading: 'Career Objective',
      content: ''
    }
  },
  {
    id: 'sec-qualifications',
    type: 'qualifications_table',
    title: 'Academic Qualifications',
    data: {
      heading: 'Academic Qualifications',
      items: []
    }
  },
  {
    id: 'sec-experience',
    type: 'experience_timeline',
    title: 'Professional Experience',
    data: {
      heading: 'Professional Experience',
      items: []
    }
  },
  {
    id: 'sec-certifications',
    type: 'certifications_box',
    title: 'Certifications & Accreditations',
    data: {
      heading: 'National Certifications',
      items: []
    }
  },
  {
    id: 'sec-personal',
    type: 'personal_details',
    title: 'Personal Details & Declaration',
    data: {
      heading: 'Personal Details',
      dateOfBirth: '',
      fatherName: '',
      nationality: 'Indian',
      languagesKnown: '',
      declarationHeading: 'Declaration',
      declarationText: 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'
    }
  }
];

export const FULL_DEV_SHARMA_SECTIONS: ResumeSectionBlock[] = [
  {
    id: 'sec-hero',
    type: 'header_hero',
    title: 'Hero Header & Contact',
    data: {
      name: 'Devender (Dev Sharma)',
      slug: 'DevSharma',
      subject: 'Physics Faculty',
      title: 'Senior Physics Faculty | Master Trainer & Composite Lab Architect',
      experienceBadge: '5+ Years Senior Secondary Experience',
      phone: '+91 8683979659',
      altPhone: '+91 9050778830',
      email: 'ptdevkaushik101@gmail.com',
      photoUrl: '/images/dev-sharma.jpg',
      bio: 'Dedicated, result-driven Physics educator passionate about experiential, activity-driven teaching. Specialist in setting up Composite Science & STEM Labs and conducting pan-India student workshops aligned with NEP 2020.',
      address: 'Prakash Vihar Colony, Palwal, Haryana - 121102',
      addressDetails: {
        state: 'Haryana',
        district: 'Palwal',
        pincode: '121102',
        blockOrCluster: 'Palwal',
        localAddress: 'Prakash Vihar Colony',
        googleMapLocation: 'https://maps.google.com/?q=28.1432,77.3241',
        latitude: 28.1432,
        longitude: 77.3241,
        liveLatitude: 28.1432,
        liveLongitude: 77.3241,
        distanceKm: 0.0,
        isLocationVerified: true,
        verificationStatus: 'verified_within_2km',
        source: 'browser_gps'
      }
    }
  },
  {
    id: 'sec-metrics',
    type: 'metrics_strip',
    title: 'Impact Metrics Strip',
    data: {
      metrics: [
        { val: '100%', lbl: '1st Division Track Record' },
        { val: '100+', lbl: 'Pan-India Workshops' },
        { val: '4x', lbl: 'GATE, CTET & HTET Certified' },
        { val: 'NEP 2020', lbl: 'Master Lab Trainer' }
      ]
    }
  },
  {
    id: 'sec-objective',
    type: 'career_objective',
    title: 'Career Objective',
    data: {
      heading: 'Career Objective',
      content: 'Dedicated and result-oriented Physics educator with strong subject expertise and a passion for experiential, hands-on teaching. Skilled in simplifying complex concepts through experiments, models, and activity-based learning aligned with the National Education Policy (NEP) 2020. Proven track record in Experimental, STEM and Composite Lab Development, Curriculum Development, and academic management. Experienced in conducting physics workshops and faculty training programs across reputed schools in India. Seeking to contribute energetic teaching, strong administrative coordination, and a deep commitment to building future-ready, lab-driven learning environments for students.'
    }
  },
  {
    id: 'sec-advantage',
    type: 'advantage_box',
    title: 'Pedagogical Advantage',
    data: {
      pillText: 'Pedagogical Advantage',
      headline: 'Why Experiential Learning? (Audio-Visual + Hands-On = 90% Retention)',
      description: 'Textbook lectures only produce 10–20% retention because abstract formulas fade quickly. When students experience Audio-Visual + Hands-On Physical Demonstrations, neural encoding deepens, making Board Exams and JEE/NEET problem-solving intuitive and permanent.',
      cards: [
        {
          badge: 'Traditional Rote Method',
          badgeColor: 'red',
          title: '10% - 20% Retention',
          points: [
            'Passive listening and memorizing derivations without physical context.',
            'Concepts like Electromagnetism & Optics feel abstract and intimidating.',
            'High exam stress when facing twisted numerical questions.'
          ]
        },
        {
          badge: "Dev Sharma's Experiential Method",
          badgeColor: 'green',
          title: '75% - 90% Retention',
          points: [
            'Dual-Coding Theory: Audio + Visual + Hands-on experimentation.',
            'Live Apparatus Proofs: Concepts verified with working models first.',
            'Effortless Recall: Students recall live experiments naturally during exams.'
          ]
        }
      ]
    }
  },
  {
    id: 'sec-qualifications',
    type: 'qualifications_table',
    title: 'Academic Qualifications',
    data: {
      heading: 'Academic Qualifications',
      items: [
        {
          degree: 'B.Ed.',
          division: '1st',
          percentage: '72%',
          board: 'Kurukshetra University',
          year: '2022',
          institute: 'Kurukshetra University'
        },
        {
          degree: 'M.Sc. (Physics)',
          division: '1st',
          percentage: '8.09 CGPA',
          board: 'YMCA University of Sci. & Tech., Faridabad',
          year: '2020',
          institute: 'YMCA University of Science & Technology'
        },
        {
          degree: 'B.Sc.',
          division: '1st',
          percentage: '77%',
          board: 'Kurukshetra University',
          year: '2017',
          institute: 'Kurukshetra University'
        },
        {
          degree: '12th',
          division: '1st',
          percentage: '88.4%',
          board: 'HBSE',
          year: '2013',
          institute: 'Board of School Education Haryana (HBSE)'
        },
        {
          degree: '10th',
          division: '1st',
          percentage: '87.6%',
          board: 'HBSE',
          year: '2011',
          institute: 'Board of School Education Haryana (HBSE)'
        }
      ]
    }
  },
  {
    id: 'sec-experience',
    type: 'experience_timeline',
    title: 'Professional Experience',
    data: {
      heading: 'Professional Experience',
      items: [
        {
          role: 'Physics Faculty & Master Trainer',
          institution: 'Desco Education (Jigyasu)',
          tenure: '2025 - Present',
          details: [
            'Leading curriculum delivery, faculty mentoring, and STEM lab installations across premier partner schools.',
            'Conducted high-impact physics workshops at CMS Lucknow, DPS, DAV Schools, and Odisha Govt Schools.',
            'Architected Composite Science Labs integrating Physics, Chemistry, and Biology.'
          ]
        },
        {
          role: 'Senior Physics Faculty',
          institution: 'Priyadarshi Group of Colleges & Schools, Pune',
          tenure: '2024 - 2025',
          details: [
            'Taught Senior Secondary batches with strong focus on experimental clarity and model-based teaching.',
            'Set up interactive science activity corners and practical demonstration kits.'
          ]
        },
        {
          role: 'Senior Physics Faculty (Class 12)',
          institution: 'D.A.V. Public School',
          tenure: '2023 - 2024',
          details: [
            'Taught Class 12 Physics with expert numerical problem-solving and lab exam preparation.',
            'Achieved exceptional board examination pass percentages and top scores.'
          ]
        }
      ]
    }
  },
  {
    id: 'sec-certifications',
    type: 'certifications_box',
    title: 'Certifications & Accreditations',
    data: {
      heading: 'National Certifications',
      items: [
        {
          name: 'GATE (Physics) Qualified',
          score: 'QUALIFIED',
          regNo: 'Graduate Aptitude Test in Engineering • National Level (IIT / IISc)',
          year: 'National Level'
        },
        {
          name: 'CTET Level II (Math & Science)',
          score: 'QUALIFIED',
          regNo: 'CBSE, Central Government',
          year: '2021'
        },
        {
          name: 'CTET Level I',
          score: 'QUALIFIED',
          regNo: 'CBSE, Central Government',
          year: '2021'
        },
        {
          name: 'HTET (Mathematics)',
          score: 'QUALIFIED',
          regNo: 'Board of School Education Haryana',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'sec-skills',
    type: 'skills_tags',
    title: 'Core Skills & Strengths',
    data: {
      heading: 'Core Competencies & Skills',
      tags: [
        'In-depth conceptual and applied knowledge of Physics, with strong experimental foundation',
        'Hands-on, activity-based and experiential teaching methodology (\'learning by doing\')',
        'Experimental Lab Development and STEM Lab Development for schools',
        'Composite Lab design - integrated Physics, Chemistry, Biology & Math lab spaces',
        'Curriculum Development and lesson planning aligned with NEP 2020',
        'Conducting large-scale physics workshops and teacher-training programs across India',
        'Faculty training, academic program management, and quality monitoring',
        'Effective communication and ability to simplify complex topics for diverse learners',
        'Time management, classroom coordination, and critical-thinking development',
        'Strong administrative, planning and organizational skills'
      ]
    }
  },
  {
    id: 'sec-expertise',
    type: 'areas_of_expertise',
    title: 'Areas of Expertise',
    data: {
      heading: 'Areas of Expertise',
      cards: [
        {
          title: 'Experimental & STEM Lab Development',
          points: [
            'Designing, setting up and operationalizing Physics, Experimental and STEM labs in schools as per NEP 2020 norms.',
            'Developing low-cost, activity-based experiment kits to encourage inquiry-based learning.'
          ]
        },
        {
          title: 'Composite Lab Development',
          points: [
            'Planning integrated/composite labs combining Physics, Chemistry, Biology and Mathematics for cross-disciplinary STEM learning.',
            'Coordinating with school administration for lab infrastructure, equipment procurement, and safety standards.'
          ]
        },
        {
          title: 'Curriculum Development (NEP 2020 Aligned)',
          points: [
            'Designing competency-based curriculum and lesson plans in line with NEP 2020\'s focus on experiential and holistic learning.',
            'Mapping experiments and activities to learning outcomes for Classes IX-XII Physics.',
            'Creating teacher handbooks and training material to support consistent curriculum delivery.'
          ]
        },
        {
          title: 'Experiential & Hands-On Teaching',
          points: [
            'Implementing \'learning by doing\' pedagogy through demonstrations, models, and student-led experiments.',
            'Conducting hands-on physics workshops across reputed schools throughout India, e.g. City Montessori School (CMS) Lucknow, D.A.V. Public Schools, Delhi Public School (DPS), and Government Schools in Odisha.'
          ]
        }
      ]
    }
  },
  {
    id: 'sec-achievements',
    type: 'key_achievements',
    title: 'Key Milestones & Achievements',
    data: {
      heading: 'Key Achievements',
      points: [
        'Successfully led Experimental, STEM and Composite Lab Development projects across multiple partner schools.',
        'Designed NEP 2020-aligned curriculum modules adopted across schools under Desco Education (Jigyasu).',
        'Conducted hands-on physics workshops in reputed schools pan-India, impacting hundreds of students and teachers.',
        'Recognized as a Master Trainer for delivering effective, experiment-based teacher training programs.',
        'Maintained consistent academic excellence - 1st Division throughout academic career (10th to M.Sc.).'
      ]
    }
  },
  {
    id: 'sec-personal',
    type: 'personal_details',
    title: 'Personal Details & Declaration',
    data: {
      heading: 'Personal Details',
      dateOfBirth: '04-11-1995',
      fatherName: 'Shree Rajkumar',
      nationality: 'Indian',
      languagesKnown: 'Hindi & English',
      declarationHeading: 'Declaration',
      declarationText: 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'
    }
  },
  {
    id: 'sec-experiments',
    type: 'experiments_section',
    title: 'Signature Lab Demonstrations & Rigs',
    data: {
      heading: 'Signature Hands-On Demonstrations & Lab Rigs Built',
      items: [
        {
          title: '3-Ray Laser Optical Refraction & Total Internal Reflection Bench',
          classLevel: 'Class 12 / JEE',
          apparatus: 'Solid Acrylic Semicircular Slab, 532nm Green Laser Module, 360-Degree Optical Protractor',
          concept: 'Demonstrates Snell’s law, critical angle, and fibre optic light transmission in real time with high visual clarity.'
        },
        {
          title: "Faraday's Electromagnetic Induction & Eddy Currents Rig",
          classLevel: 'Class 12 / JEE',
          apparatus: 'Neodymium N52 Magnets, Copper/Aluminium Slotted Tubes, Galvanometer, Induction Coils',
          concept: 'Direct visualization of Lenz’s Law and electromagnetic damping through free-fall velocity differences in metals.'
        }
      ]
    }
  },
  {
    id: 'sec-videos',
    type: 'demo_videos',
    title: 'Demo Lecture Video Archives',
    data: {
      items: [
        {
          id: '1XTERWis8nfHiAX3K3D1nqDdHqIb-rLpW',
          title: 'Wave Optics & Light Ray Reflection/Refraction Demonstration',
          category: 'Optics',
          duration: '14:20',
          url: 'https://drive.google.com/file/d/1XTERWis8nfHiAX3K3D1nqDdHqIb-rLpW/preview'
        },
        {
          id: '1IUzcwpcoonTu_qR5tQz6Y0H-jdBBy5ev',
          title: "Electromagnetism & Faraday's Law — Experiential Lab Setup",
          category: 'Electromagnetism',
          duration: '8:45',
          url: 'https://drive.google.com/file/d/1IUzcwpcoonTu_qR5tQz6Y0H-jdBBy5ev/preview'
        },
        {
          id: '16hSUfsnaEfsB95U3vV0ffvwpPC8Wu140',
          title: 'NEP 2020 Hands-On Teacher Training & Composite Science Lab',
          category: 'NEP 2020',
          duration: '12:10',
          url: 'https://drive.google.com/file/d/16hSUfsnaEfsB95U3vV0ffvwpPC8Wu140/preview'
        },
        {
          id: '1nqw4zreuwIERpn0795AJ8-kPcgzk0F4E',
          title: 'Mechanics, Inertia & Laws of Motion Interactive Workshop',
          category: 'Mechanics',
          duration: '6:30',
          url: 'https://drive.google.com/file/d/1nqw4zreuwIERpn0795AJ8-kPcgzk0F4E/preview'
        },
        {
          id: '1cPj0kxe2L9YKrijAn0DAA6ZLbhEsM1J-',
          title: 'Class 12 Board Exam Numerical Problem Solving Session',
          category: 'Class 12',
          duration: '15:40',
          url: 'https://drive.google.com/file/d/1cPj0kxe2L9YKrijAn0DAA6ZLbhEsM1J-/preview'
        },
        {
          id: '1ozH4UGTPd7Jxrr5SZSHCRKWdrPEAyObd',
          title: 'Composite Science & STEM Lab Setup Demonstration for Schools',
          category: 'Composite Lab',
          duration: '10:15',
          url: 'https://drive.google.com/file/d/1ozH4UGTPd7Jxrr5SZSHCRKWdrPEAyObd/preview'
        }
      ]
    }
  },
  {
    id: 'sec-gallery',
    type: 'photo_gallery',
    title: 'Workshop & Laboratory Photo Showcase',
    data: {
      items: [
        {
          title: 'Devender (Dev Sharma) — Senior Physics Faculty & Master Trainer',
          subtitle: 'Verified Profile • M.Sc. Physics (1st Div)',
          url: '/images/dev-sharma.jpg',
          category: 'workshops'
        },
        {
          title: 'Hands-on Physics Workshop at City Montessori School (CMS) Lucknow',
          subtitle: 'CMS Lucknow • 100+ Students',
          url: '/images/devender-sharma.jpg',
          category: 'workshops'
        },
        {
          title: 'Composite Science & STEM Lab Setup Demonstration',
          subtitle: 'NEP 2020 Experiential Lab Architecture',
          url: '/images/dev-sharma-profile.jpg',
          category: 'lab'
        },
        {
          title: 'Experiential Teacher Training Demonstration & Activity Stations',
          subtitle: 'Master Trainer Workshop',
          url: '/images/dev-sharma.jpg',
          category: 'workshops'
        },
        {
          title: 'D.A.V. & DPS Pan-India Classroom Physics Lab Session',
          subtitle: 'Senior Secondary Lab',
          url: '/images/dev-sharma-profile.jpg',
          category: 'lab'
        },
        {
          title: 'National & State Eligibility Certifications (HTET & CTET Qualified)',
          subtitle: 'HTET Maths, CTET I, CTET II Qualified',
          url: '/images/devender-sharma.jpg',
          category: 'certificates'
        },
        {
          title: 'Ray Optics Activity Demonstration & Physical Apparatus',
          subtitle: 'Experiential Pedagogy',
          url: '/images/dev-sharma.jpg',
          category: 'lab'
        },
        {
          title: 'Student Interactive Science Exhibition & Model Presentation',
          subtitle: 'Experiential Pedagogy',
          url: '/images/dev-sharma-profile.jpg',
          category: 'workshops'
        }
      ]
    }
  }
];

const AVAILABLE_SECTION_TEMPLATES: {
  type: SectionType;
  title: string;
  category: 'core' | 'academic' | 'media' | 'custom';
  icon: any;
  desc: string;
  defaultData: (isFreshBlank?: boolean) => any;
}[] = [
  {
    type: 'header_hero',
    title: 'Hero Header & Contact',
    category: 'core',
    icon: MapPin,
    desc: 'Gradient hero, verified ribbon, avatar, contact chips and GPS badge',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? {
            name: '',
            slug: '',
            subject: 'Physics Faculty',
            title: '',
            experienceBadge: '',
            phone: '',
            email: '',
            photoUrl: '/images/dev-sharma.jpg',
            bio: '',
            address: '',
            addressDetails: {
              localAddress: '',
              district: '',
              state: '',
              pincode: '',
              googleMapLocation: '',
              isLocationVerified: false
            }
          }
        : FULL_DEV_SHARMA_SECTIONS[0].data
  },
  {
    type: 'metrics_strip',
    title: 'Highlights Metric Strip',
    category: 'core',
    icon: TrendingUp,
    desc: '4 high-impact statistical cards (100% 1st Div, 100+ Workshops, etc.)',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { metrics: [{ val: '100%', lbl: '1st Division' }, { val: '5+ Yrs', lbl: 'Experience' }] }
        : FULL_DEV_SHARMA_SECTIONS[1].data
  },
  {
    type: 'career_objective',
    title: 'Career Objective',
    category: 'core',
    icon: Compass,
    desc: 'Professional summary, pedagogy mission and career statement',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Career Objective', content: '' }
        : FULL_DEV_SHARMA_SECTIONS[2].data
  },
  {
    type: 'advantage_box',
    title: 'Pedagogical Advantage',
    category: 'academic',
    icon: Zap,
    desc: 'Experiential Method vs Traditional Rote retention comparison cards',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { pillText: 'Pedagogical Advantage', headline: 'Why Experiential Learning? (Audio-Visual + Hands-On = 90% Retention)', description: 'Hands-on live apparatus demonstrations.', cards: [{ badge: "Dev Sharma's Experiential Method", badgeColor: 'green', title: '75% - 90% Retention', points: ['Live Apparatus Proofs'] }] }
        : FULL_DEV_SHARMA_SECTIONS[3].data
  },
  {
    type: 'qualifications_table',
    title: 'Academic Education Table',
    category: 'academic',
    icon: GraduationCap,
    desc: 'Structured degrees table (Course, Division, Percentage/CGPA, University, Year)',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Education', items: [{ degree: 'Degree Name', division: '1st', percentage: '80%', board: 'University Name', year: '2024' }] }
        : FULL_DEV_SHARMA_SECTIONS[4].data
  },
  {
    type: 'experience_timeline',
    title: 'Professional Experience',
    category: 'academic',
    icon: Briefcase,
    desc: 'Work experience timeline with roles, tenure, schools and bullet points',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Professional Experience', items: [{ role: 'Physics Faculty', institution: 'School / Institution', tenure: '2024 - Present', details: ['Lead Physics and experimental learning modules.'] }] }
        : FULL_DEV_SHARMA_SECTIONS[5].data
  },
  {
    type: 'certifications_box',
    title: 'Certifications & Tests',
    category: 'academic',
    icon: Award,
    desc: 'HTET, CTET, GATE or other competitive qualifications cards',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Certifications', items: [{ name: 'Certification Name', score: 'Qualified', regNo: 'REG-001', year: '2024' }] }
        : FULL_DEV_SHARMA_SECTIONS[6].data
  },
  {
    type: 'skills_tags',
    title: 'Core Skills & Competencies',
    category: 'academic',
    icon: Target,
    desc: 'Interactive pill tag cloud of core skills and strengths',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Core Skills', tags: ['Experiential Physics Pedagogy', 'STEM Lab Architecture', 'NEP 2020 Curriculum'] }
        : FULL_DEV_SHARMA_SECTIONS[7].data
  },
  {
    type: 'areas_of_expertise',
    title: 'Areas of Expertise',
    category: 'academic',
    icon: BookOpen,
    desc: 'Categorized specialty cards (Lab Dev, Composite Labs, Curriculum, Hands-on)',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Areas of Expertise', cards: [{ title: 'Specialty Area', points: ['Key capability point 1', 'Key capability point 2'] }] }
        : FULL_DEV_SHARMA_SECTIONS[8].data
  },
  {
    type: 'key_achievements',
    title: 'Key Achievements',
    category: 'academic',
    icon: Star,
    desc: 'Bullet list of standout professional and academic milestones',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Key Achievements', points: ['Major career achievement or milestone.'] }
        : FULL_DEV_SHARMA_SECTIONS[9].data
  },
  {
    type: 'personal_details',
    title: 'Personal Details & Declaration',
    category: 'core',
    icon: User,
    desc: 'DOB, Father name, Nationality, Languages known, and Signed declaration',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Personal Details', dateOfBirth: '', fatherName: '', nationality: 'Indian', languagesKnown: 'Hindi & English', declarationHeading: 'Declaration', declarationText: 'I hereby declare that all the information provided above is true and correct.' }
        : FULL_DEV_SHARMA_SECTIONS[10].data
  },
  {
    type: 'experiments_section',
    title: 'Signature Lab Demonstrations',
    category: 'academic',
    icon: FlaskConical,
    desc: 'Interactive physics rigs (Laser Optics bench, Faraday induction, etc.)',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { heading: 'Signature Demonstrations', items: [{ title: 'Optics Rig', classLevel: 'Class 12', apparatus: 'Optical bench', concept: 'Refraction & TIR' }] }
        : FULL_DEV_SHARMA_SECTIONS[11].data
  },
  {
    type: 'demo_videos',
    title: 'Demo Lecture Video Archives',
    category: 'media',
    icon: Video,
    desc: 'Embedded video lecture cards with duration and in-modal player',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { items: [] }
        : FULL_DEV_SHARMA_SECTIONS[12].data
  },
  {
    type: 'photo_gallery',
    title: 'Workshop & Lab Photo Showcase',
    category: 'media',
    icon: ImageIcon,
    desc: 'Grid of high-res photos from partner school workshops and lab setups',
    defaultData: (isFreshBlank) =>
      isFreshBlank
        ? { items: [] }
        : FULL_DEV_SHARMA_SECTIONS[13].data
  },
  {
    type: 'custom_richtext',
    title: 'Custom Rich Text Block',
    category: 'custom',
    icon: FileText,
    desc: 'Add custom heading and freeform text block with custom styling',
    defaultData: () => ({ heading: 'Custom Section', content: 'Enter text here...' })
  }
];

export default function ResumeBuilderCanvas({
  initialData,
  userId,
  onSave,
  onClose
}: ResumeBuilderCanvasProps) {
  // Initialize sections - deduplicate by block id or load master
  const [sections, setSections] = useState<ResumeSectionBlock[]>(() => {
    if (initialData?.sections && Array.isArray(initialData.sections) && initialData.sections.length > 0) {
      return initialData.sections;
    }
    const isDev = (initialData?.name || '').toLowerCase().includes('devender') || (initialData?.slug || '').toLowerCase() === 'devsharma';
    if (isDev) {
      return FULL_DEV_SHARMA_SECTIONS;
    }
    const defaultSlug = initialData?.slug || (initialData?.name ? initialData.name.toLowerCase().replace(/[^a-z0-9]/g, '') : `faculty-${Date.now().toString().slice(-4)}`);
    return EMPTY_RESUME_SECTIONS.map((sec) => {
      if (sec.id === 'sec-hero' || sec.type === 'header_hero') {
        return {
          ...sec,
          data: {
            ...sec.data,
            name: initialData?.name || '',
            slug: defaultSlug,
            subject: initialData?.subject || 'Physics Faculty',
            title: initialData?.title || '',
            phone: initialData?.phone || '',
            altPhone: initialData?.altPhone || '',
            email: initialData?.email || '',
            address: initialData?.address || '',
            bio: initialData?.bio || '',
            photoUrl: initialData?.photoUrl || '',
            addressDetails: initialData?.addressDetails || sec.data.addressDetails
          }
        };
      }
      return JSON.parse(JSON.stringify(sec));
    });
  });

  // Sync state if initialData changes dynamically
  useEffect(() => {
    if (initialData?.sections && Array.isArray(initialData.sections) && initialData.sections.length > 0) {
      setSections(initialData.sections);
      setHistory([initialData.sections]);
      setHistoryIndex(0);
    } else if (initialData?.isNew) {
      const isDev = (initialData?.name || '').toLowerCase().includes('devender') || (initialData?.slug || '').toLowerCase() === 'devsharma';
      if (isDev) {
        setSections(FULL_DEV_SHARMA_SECTIONS);
        setHistory([FULL_DEV_SHARMA_SECTIONS]);
        setHistoryIndex(0);
        return;
      }
      const defaultSlug = initialData.slug || (initialData.name ? initialData.name.toLowerCase().replace(/[^a-z0-9]/g, '') : `faculty-${Date.now().toString().slice(-4)}`);
      const newSecs = EMPTY_RESUME_SECTIONS.map((sec) => {
        if (sec.id === 'sec-hero' || sec.type === 'header_hero') {
          return {
            ...sec,
            data: {
              ...sec.data,
              name: initialData.name || '',
              slug: defaultSlug,
              subject: initialData.subject || 'Physics Faculty',
              title: initialData.title || '',
              phone: initialData.phone || '',
              altPhone: initialData.altPhone || '',
              email: initialData.email || '',
              address: initialData.address || '',
              bio: initialData.bio || '',
              photoUrl: initialData.photoUrl || '',
              addressDetails: initialData.addressDetails || sec.data.addressDetails
            }
          };
        }
        return JSON.parse(JSON.stringify(sec));
      });
      setSections(newSecs);
      setHistory([newSecs]);
      setHistoryIndex(0);
    }
  }, [initialData]);

  // History state for Undo / Redo
  const [history, setHistory] = useState<ResumeSectionBlock[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Inspector & selection states
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id || null);
  const [inspectorTab, setInspectorTab] = useState<'document' | 'block'>('block');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'academic' | 'media' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Published / Live URLs Success Modal State
  const [publishedModalData, setPublishedModalData] = useState<{
    isOpen: boolean;
    name: string;
    slug: string;
    subject: string;
    accessKey?: string;
    resumeUrl: string;
    videosUrl: string;
    galleryUrl: string;
    facultyCode?: string;
  } | null>(null);

  const [copiedUrlType, setCopiedUrlType] = useState<string | null>(null);

  // GPS Verification UI States
  const [isGpsChecking, setIsGpsChecking] = useState(false);
  const [isSearchingAddressLocation, setIsSearchingAddressLocation] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Left Drawer: OPEN by default on desktop!
  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightInspector, setShowRightInspector] = useState(false);

  // Video & Image Preview modals
  const [testVideoUrl, setTestVideoUrl] = useState<string | null>(null);
  const [testImageUrl, setTestImageUrl] = useState<string | null>(null);

  // Dragging states
  const [draggingSectionIndex, setDraggingSectionIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Push new history state
  const pushState = (newSections: ResumeSectionBlock[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newSections);
    if (updatedHistory.length > 25) updatedHistory.shift();
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSections(newSections);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const activeSection = sections.find((s) => s.id === activeSectionId) || null;

  const updateSectionData = (id: string, partialData: any) => {
    const updated = sections.map((sec) => {
      if (sec.id === id) {
        return { ...sec, data: { ...sec.data, ...partialData } };
      }
      return sec;
    });
    pushState(updated);
  };

  const updateSectionStyle = (id: string, partialStyle: Partial<BlockStyle>) => {
    const updated = sections.map((sec) => {
      if (sec.id === id) {
        return { ...sec, style: { ...(sec.style || {}), ...partialStyle } };
      }
      return sec;
    });
    pushState(updated);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const newSecs = [...sections];
    const [moved] = newSecs.splice(index, 1);
    newSecs.splice(targetIndex, 0, moved);
    pushState(newSecs);
  };

  const deleteSection = (id: string) => {
    const newSecs = sections.filter((s) => s.id !== id);
    pushState(newSecs);
    if (activeSectionId === id) {
      setActiveSectionId(newSecs[0]?.id || null);
    }
  };

  const duplicateSection = (index: number) => {
    const target = sections[index];
    if (!target) return;
    const newBlock: ResumeSectionBlock = {
      ...target,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${target.title} (Copy)`,
      data: JSON.parse(JSON.stringify(target.data))
    };
    const newSecs = [...sections];
    newSecs.splice(index + 1, 0, newBlock);
    pushState(newSecs);
    setActiveSectionId(newBlock.id);
  };

  const addSectionFromTemplate = (type: SectionType, targetIndex?: number) => {
    const template = AVAILABLE_SECTION_TEMPLATES.find((t) => t.type === type);
    if (!template) return;
    const newBlock: ResumeSectionBlock = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: template.type,
      title: template.title,
      data: JSON.parse(JSON.stringify(template.defaultData(false))),
      style: {
        fontSize: 'sm',
        fontFamily: 'sans',
        textAlign: 'left'
      }
    };
    const newSecs = [...sections];
    if (typeof targetIndex === 'number') {
      newSecs.splice(targetIndex, 0, newBlock);
    } else {
      newSecs.push(newBlock);
    }
    pushState(newSecs);
    setActiveSectionId(newBlock.id);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingSectionIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedTemplateType = e.dataTransfer.getData('application/x-section-type') as SectionType;
    if (draggedTemplateType) {
      addSectionFromTemplate(draggedTemplateType, targetIndex);
    } else if (draggingSectionIndex !== null) {
      if (draggingSectionIndex !== targetIndex) {
        const newSecs = [...sections];
        const [moved] = newSecs.splice(draggingSectionIndex, 1);
        newSecs.splice(targetIndex, 0, moved);
        pushState(newSecs);
      }
    }
    setDraggingSectionIndex(null);
    setDragOverIndex(null);
  };

  // Search / Calculate Location from Village, District, State, Pincode (Geocoding)
  const handleSearchLocationFromAddress = async (sectionId: string, currentAddrDetails: any) => {
    const { localAddress, district, state, pincode } = currentAddrDetails || {};
    if (!localAddress && !district && !state && !pincode) {
      setGpsStatusMessage({
        type: 'warning',
        text: 'Please fill in Village/Local Address, District, State, or Pincode to search location.'
      });
      return;
    }
    setIsSearchingAddressLocation(true);
    setGpsStatusMessage(null);
    try {
      const res = await resolveLocationViaApi({
        localAddress,
        district,
        state,
        pincode
      });
      if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
        const updatedAddr = {
          ...currentAddrDetails,
          latitude: res.latitude,
          longitude: res.longitude,
          googleMapLocation: res.googleMapUrl || `https://maps.google.com/?q=${res.latitude.toFixed(6)},${res.longitude.toFixed(6)}`
        };
        const combined = buildFormattedAddress(localAddress, district, state, pincode);
        updateSectionData(sectionId, {
          addressDetails: updatedAddr,
          address: combined
        });
        setGpsStatusMessage({
          type: 'success',
          text: `✓ Location Calculated: ${res.resolvedAddress || `${district}, ${state}`} (Lat: ${res.latitude.toFixed(4)}, Lon: ${res.longitude.toFixed(4)})`
        });
      } else {
        setGpsStatusMessage({
          type: 'warning',
          text: res.error || 'Could not find exact coordinates. You can paste a Google Maps link or enter Lat/Lng directly.'
        });
      }
    } catch (err: any) {
      setGpsStatusMessage({
        type: 'error',
        text: err.message || 'Geocoding failed. Please check your connection.'
      });
    } finally {
      setIsSearchingAddressLocation(false);
    }
  };

  // Detect 2km Range & Verify GPS Coordinates (Supports Short links maps.app.goo.gl, Lat/Lng & Geocoding)
  const handleDetect2kmRange = async (sectionId: string, currentAddrDetails: any) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsChecking(true);
    setGpsStatusMessage(null);

    try {
      let targetLat: number | undefined = currentAddrDetails?.latitude;
      let targetLon: number | undefined = currentAddrDetails?.longitude;

      const pastedInput = currentAddrDetails?.googleMapLocation || '';

      // If lat/lon not explicitly present or if URL was pasted, resolve via API (handles short URLs)
      if (typeof targetLat !== 'number' || typeof targetLon !== 'number') {
        if (pastedInput) {
          const res = await resolveLocationViaApi({ url: pastedInput });
          if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
            targetLat = res.latitude;
            targetLon = res.longitude;
          }
        } else if (currentAddrDetails?.localAddress || currentAddrDetails?.district || currentAddrDetails?.state || currentAddrDetails?.pincode) {
          const res = await resolveLocationViaApi({
            localAddress: currentAddrDetails.localAddress,
            district: currentAddrDetails.district,
            state: currentAddrDetails.state,
            pincode: currentAddrDetails.pincode
          });
          if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
            targetLat = res.latitude;
            targetLon = res.longitude;
          }
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const liveLat = position.coords.latitude;
          const liveLon = position.coords.longitude;

          if (typeof targetLat === 'number' && typeof targetLon === 'number') {
            const distance = calculateHaversineDistanceKm(liveLat, liveLon, targetLat, targetLon);
            const isWithin2km = distance <= 2.0;

            const updatedAddr = {
              ...currentAddrDetails,
              liveLatitude: liveLat,
              liveLongitude: liveLon,
              latitude: targetLat,
              longitude: targetLon,
              distanceKm: distance,
              isLocationVerified: isWithin2km,
              verificationStatus: isWithin2km ? 'verified_within_2km' : 'outside_2km',
              source: 'browser_gps'
            };

            const combined = buildFormattedAddress(
              currentAddrDetails?.localAddress,
              currentAddrDetails?.district,
              currentAddrDetails?.state,
              currentAddrDetails?.pincode
            );

            updateSectionData(sectionId, {
              addressDetails: updatedAddr,
              address: combined
            });

            if (isWithin2km) {
              setGpsStatusMessage({
                type: 'success',
                text: `✓ GPS 2km Verified! Current GPS is ${distance} km from declared location (Within 2.0 km range).`
              });
            } else {
              setGpsStatusMessage({
                type: 'warning',
                text: `⚠️ Current device location is ${distance} km away from declared location. Must be within 2.0 km for auto-verification.`
              });
            }
          } else {
            // Auto-set current GPS position
            const autoMapsUrl = `https://maps.google.com/?q=${liveLat.toFixed(6)},${liveLon.toFixed(6)}`;
            const updatedAddr = {
              ...currentAddrDetails,
              googleMapLocation: autoMapsUrl,
              latitude: liveLat,
              longitude: liveLon,
              liveLatitude: liveLat,
              liveLongitude: liveLon,
              distanceKm: 0.0,
              isLocationVerified: true,
              verificationStatus: 'verified_within_2km',
              source: 'browser_gps'
            };

            const combined = buildFormattedAddress(
              currentAddrDetails?.localAddress,
              currentAddrDetails?.district,
              currentAddrDetails?.state,
              currentAddrDetails?.pincode
            );

            updateSectionData(sectionId, {
              addressDetails: updatedAddr,
              address: combined
            });

            setGpsStatusMessage({
              type: 'success',
              text: `✓ Current GPS coordinates detected (${liveLat.toFixed(4)}, ${liveLon.toFixed(4)}) and verified within 2.0 km!`
            });
          }

          setIsGpsChecking(false);
        },
        (err) => {
          console.error(err);
          setIsGpsChecking(false);
          setGpsStatusMessage({
            type: 'error',
            text: `GPS Access Error: ${err.message || 'Unable to retrieve your location. Please check browser permissions.'}`
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (err: any) {
      setIsGpsChecking(false);
      setGpsStatusMessage({
        type: 'error',
        text: `Error resolving location: ${err.message || 'Unknown error'}`
      });
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const heroSec = sections.find((s) => s.type === 'header_hero');
      const qualSec = sections.find((s) => s.type === 'qualifications_table');
      const expSec = sections.find((s) => s.type === 'experience_timeline');
      const certSec = sections.find((s) => s.type === 'certifications_box');
      const skillSec = sections.find((s) => s.type === 'skills_tags');
      const expRigsSec = sections.find((s) => s.type === 'experiments_section');
      const videoSec = sections.find((s) => s.type === 'demo_videos');
      const photoSec = sections.find((s) => s.type === 'photo_gallery');
      const objSec = sections.find((s) => s.type === 'career_objective');
      const expCardsSec = sections.find((s) => s.type === 'areas_of_expertise');
      const achSec = sections.find((s) => s.type === 'key_achievements');
      const personalSec = sections.find((s) => s.type === 'personal_details');

      const heroData = heroSec?.data || {};
      const cleanSubject = (heroData.subject || 'Physics').trim();
      const facultyName = (heroData.name || initialData?.name || '').trim();

      const isDevSharma =
        facultyName.toLowerCase().includes('devender') ||
        facultyName.toLowerCase().includes('dev sharma');

      let cleanSlug = (heroData.slug || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');

      // If user is not Dev Sharma, but slug defaulted to DevSharma or is generic/empty, generate proper slug
      if (!isDevSharma && (cleanSlug.toLowerCase() === 'devsharma' || !cleanSlug || cleanSlug.startsWith('faculty-'))) {
        if (facultyName && facultyName !== 'Faculty Member') {
          cleanSlug = facultyName.toLowerCase().replace(/[^a-z0-9]/g, '');
        } else if (initialData?.slug) {
          cleanSlug = initialData.slug;
        } else {
          cleanSlug = `faculty-${Date.now().toString().slice(-4)}`;
        }
      }

      if (!cleanSlug) {
        cleanSlug = facultyName && facultyName !== 'Faculty Member'
          ? facultyName.toLowerCase().replace(/[^a-z0-9]/g, '')
          : `faculty-${Date.now().toString().slice(-4)}`;
      }

      const finalName = facultyName || 'Faculty Member';

      const profilePayload = {
        name: finalName,
        slug: cleanSlug,
        subject: cleanSubject,
        title: heroData.title || `${finalName} | ${cleanSubject} Faculty`,
        experience: heroData.experienceBadge || 'Experienced Faculty',
        phone: heroData.phone || '',
        altPhone: heroData.altPhone || '',
        email: heroData.email || '',
        location: heroData.address || '',
        address: heroData.address || '',
        addressDetails: heroData.addressDetails,
        isLocationVerified: heroData.addressDetails?.isLocationVerified ?? true,
        photoUrl: heroData.photoUrl || '/images/dev-sharma.jpg',
        isVerified: true,
        status: 'verified',
        careerObjective: objSec?.data?.content || heroData.bio || '',
        professionalExperience: expSec?.data?.items || [],
        education: qualSec?.data?.items || [],
        certifications: certSec?.data?.items || [],
        coreSkills: skillSec?.data?.tags || [],
        areasOfExpertise: expCardsSec?.data?.cards || [],
        keyAchievements: achSec?.data?.points || [],
        personalDetails: personalSec?.data || {},
        videos: videoSec?.data?.items || [],
        galleryImages: photoSec?.data?.items || [],
        sections: sections,
        updatedAt: new Date().toISOString()
      };

      let resultData: any = null;
      if (onSave) {
        resultData = await onSave(profilePayload);
      } else {
        const res = await fetch('/api/faculty-resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profilePayload)
        });
        resultData = await res.json();
        if (!res.ok || !resultData?.success) {
          throw new Error(resultData?.error || resultData?.message || 'Save failed');
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      const subSlug = cleanSubject.toLowerCase().replace(/[^a-z0-9]/g, '');
      const savedAccessKey = resultData?.accessKey || resultData?.faculty?.accessKey || heroData.accessKey || '';
      const facultyCode = resultData?.facultyCode || resultData?.faculty?.facultyCode || '';

      // Direct public URLs (e.g. https://resumes.cseel.org/best-Teacherfaculty/physics/DevSharma.html)
      const directResumeUrl = `https://resumes.cseel.org/best-Teacherfaculty/${subSlug}/${cleanSlug}.html`;
      const directVideosUrl = `https://resumes.cseel.org/best-Teacherfaculty/${subSlug}/${cleanSlug}-videos.html`;
      const directGalleryUrl = `https://resumes.cseel.org/best-Teacherfaculty/${subSlug}/${cleanSlug}-gallery.html`;

      setPublishedModalData({
        isOpen: true,
        name: heroData.name || 'Faculty Member',
        slug: cleanSlug,
        subject: cleanSubject,
        accessKey: savedAccessKey,
        facultyCode: facultyCode,
        resumeUrl: directResumeUrl,
        videosUrl: directVideosUrl,
        galleryUrl: directGalleryUrl
      });
    } catch (err: any) {
      console.error(err);
      alert('Failed to save resume: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTemplates = AVAILABLE_SECTION_TEMPLATES.filter((tmpl) => {
    if (activeCategory !== 'all' && tmpl.category !== activeCategory) return false;
    if (searchQuery) {
      return (
        tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const heroData = sections.find((s) => s.type === 'header_hero')?.data || {};

  return (
        <div className="min-h-screen w-full bg-[#f0f2f5] text-slate-800 font-sans text-xs flex flex-col">
      <style>{`
        .drawer-vertical-scroller {
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: auto !important;
          scrollbar-color: #2563eb #e2e8f0 !important;
          overscroll-behavior: contain !important;
        }
        .drawer-vertical-scroller::-webkit-scrollbar {
          width: 10px !important;
          display: block !important;
        }
        .drawer-vertical-scroller::-webkit-scrollbar-track {
          background: #e2e8f0 !important;
          border-left: 1px solid #cbd5e1 !important;
        }
        .drawer-vertical-scroller::-webkit-scrollbar-thumb {
          background: #2563eb !important;
          border-radius: 5px !important;
          border: 2px solid #e2e8f0 !important;
        }
        .drawer-vertical-scroller::-webkit-scrollbar-thumb:hover {
          background: #1d4ed8 !important;
        }
      `}</style>
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP GUTENBERG / NOTION HEADER TOOLBAR (Ultra Compact) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 h-[56px] bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Profile Navigation Button */}
          <a
            href="/user"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition shrink-0"
            title="Go to User Profile & Resumes"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">User Profile</span>
          </a>

          {/* Toggle Block Library */}
          <button
            type="button"
            onClick={() => setShowLeftDrawer(!showLeftDrawer)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              showLeftDrawer
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showLeftDrawer ? 'Hide Library' : '+ Add Block'}</span>
          </button>

          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-0.5 border-l border-slate-200 pl-2">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-1.5 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Block Floating Formatting Bar */}
          {activeSection && !previewMode && (
            <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-2 text-slate-600">
              <span className="text-[11px] font-bold text-slate-400 max-w-[110px] truncate">
                {activeSection.title}
              </span>

              {/* Alignments */}
              <div className="flex items-center bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'left' })}
                  className={`p-1 rounded ${activeSection.style?.textAlign === 'left' ? 'bg-white shadow-2xs text-blue-600' : 'hover:bg-slate-200 text-slate-600'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'center' })}
                  className={`p-1 rounded ${activeSection.style?.textAlign === 'center' ? 'bg-white shadow-2xs text-blue-600' : 'hover:bg-slate-200 text-slate-600'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'right' })}
                  className={`p-1 rounded ${activeSection.style?.textAlign === 'right' ? 'bg-white shadow-2xs text-blue-600' : 'hover:bg-slate-200 text-slate-600'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3 h-3" />
                </button>
              </div>

              {/* Font Weight */}
              <button
                type="button"
                onClick={() =>
                  updateSectionStyle(activeSection.id, {
                    fontWeight: activeSection.style?.fontWeight === 'bold' ? 'normal' : 'bold'
                  })
                }
                className={`p-1.5 rounded ${activeSection.style?.fontWeight === 'bold' ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-100'}`}
                title="Bold"
              >
                <Bold className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
          <span className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight">
            {heroData.name || 'Devender (Dev Sharma)'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
            ({sections.length} Sections)
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Load Master Template */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Load complete authentic starting profile with all 14 detailed sections?')) {
                pushState(FULL_DEV_SHARMA_SECTIONS);
              }
            }}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Load Master Profile"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Master Profile</span>
          </button>

          {/* Preview Mode Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              previewMode
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>

          {/* Inspector Gear Toggle */}
          {!previewMode && (
            <button
              type="button"
              onClick={() => setShowRightInspector(!showRightInspector)}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                showRightInspector ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Block / Document Inspector"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Publish / Create Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold shadow-sm transition active:scale-95 ${
              saveSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : initialData?.isNew
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 ring-1 ring-blue-400/40'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : initialData?.isNew ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>
              {isSaving
                ? (initialData?.isNew ? 'Creating Resume...' : 'Saving...')
                : saveSuccess
                ? (initialData?.isNew ? 'Created & Live!' : 'Saved!')
                : (initialData?.isNew ? 'Create & Publish Resume' : 'Save & Publish')}
            </span>
          </button>
        </div>
      </header>
      {/* ------------------------------------------------------------- */}
      {/* 1.1 TOP FORMATTING RIBBON (Canva / Word / Notion Style Ribbon) */}
      {/* ------------------------------------------------------------- */}
      {!previewMode && activeSection && (
        <div className="sticky top-[56px] z-30 bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Left: Active Section Badge & Reordering */}
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
              <Layers className="w-3.5 h-3.5" />
              <span className="max-w-[150px] sm:max-w-[200px] truncate">{activeSection.title}</span>
            </span>

            {/* Move Up / Down Controls */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection.id);
                  if (idx > 0) moveSection(idx, 'up');
                }}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                title="Move Section Up"
              >
                <MoveUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = sections.findIndex((s) => s.id === activeSection.id);
                  if (idx >= 0 && idx < sections.length - 1) moveSection(idx, 'down');
                }}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
                title="Move Section Down"
              >
                <MoveDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Duplicate & Delete */}
            <button
              type="button"
              onClick={() => {
                const idx = sections.findIndex((s) => s.id === activeSection.id);
                if (idx >= 0) duplicateSection(idx);
              }}
              className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-md border border-slate-700 transition"
              title="Duplicate Block"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteSection(activeSection.id)}
              className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-md border border-slate-700 transition"
              title="Delete Block"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Typography, Alignment & Colors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Font Size */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-md px-2 py-0.5 border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold">Size:</span>
              <select
                value={activeSection.style?.fontSize || 'sm'}
                onChange={(e) => updateSectionStyle(activeSection.id, { fontSize: e.target.value as any })}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                <option value="xs" className="bg-slate-900">XS</option>
                <option value="sm" className="bg-slate-900">Small</option>
                <option value="base" className="bg-slate-900">Normal</option>
                <option value="lg" className="bg-slate-900">Large</option>
                <option value="xl" className="bg-slate-900">XL</option>
                <option value="2xl" className="bg-slate-900">2XL</option>
              </select>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-md px-2 py-0.5 border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold">Font:</span>
              <select
                value={activeSection.style?.fontFamily || 'sans'}
                onChange={(e) => updateSectionStyle(activeSection.id, { fontFamily: e.target.value as any })}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                <option value="sans" className="bg-slate-900">Sans</option>
                <option value="serif" className="bg-slate-900">Serif</option>
                <option value="mono" className="bg-slate-900">Mono</option>
              </select>
            </div>

            {/* Alignments */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'left' })}
                className={`p-1 rounded ${activeSection.style?.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'center' })}
                className={`p-1 rounded ${activeSection.style?.textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateSectionStyle(activeSection.id, { textAlign: 'right' })}
                className={`p-1 rounded ${activeSection.style?.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bold / Italic */}
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() =>
                  updateSectionStyle(activeSection.id, {
                    fontWeight: activeSection.style?.fontWeight === 'bold' ? 'normal' : 'bold'
                  })
                }
                className={`p-1 rounded font-bold text-xs ${activeSection.style?.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  updateSectionStyle(activeSection.id, {
                    fontStyle: activeSection.style?.fontStyle === 'italic' ? 'normal' : 'italic'
                  })
                }
                className={`p-1 rounded italic text-xs ${activeSection.style?.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. Background Color Controller */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-md px-2 py-1 border border-slate-700">
              <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                <Paintbrush className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">BG:</span>
              </div>
              {/* Native Color Spectrum / Wheel Picker */}
              <input
                type="color"
                value={
                  activeSection.style?.backgroundColor && activeSection.style.backgroundColor.startsWith('#') && activeSection.style.backgroundColor.length === 7
                    ? activeSection.style.backgroundColor
                    : '#ffffff'
                }
                onChange={(e) => updateSectionStyle(activeSection.id, { backgroundColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border border-slate-600 bg-transparent p-0 flex-shrink-0"
                title="Choose Background from Color Spectrum / Wheel"
              />
              {/* Hex Code Input */}
              <input
                type="text"
                placeholder="#HEX"
                maxLength={7}
                value={activeSection.style?.backgroundColor || ''}
                onChange={(e) => updateSectionStyle(activeSection.id, { backgroundColor: e.target.value })}
                className="w-14 bg-slate-950 border border-slate-700 text-white text-[10px] font-mono px-1 py-0.5 rounded focus:outline-none focus:border-blue-500 uppercase"
                title="Enter Hex Color Code (e.g. #2563eb)"
              />
              {/* Quick Swatches */}
              <div className="hidden xl:flex items-center gap-1">
                {['#ffffff', '#f8fafc', '#f0fdf4', '#eff6ff', '#fefce8'].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateSectionStyle(activeSection.id, { backgroundColor: hex })}
                    className={`w-3.5 h-3.5 rounded-full border border-slate-600 transition hover:scale-110 ${
                      activeSection.style?.backgroundColor === hex ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set BG: ${hex}`}
                  />
                ))}
              </div>
              {activeSection.style?.backgroundColor && (
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { backgroundColor: undefined })}
                  className="text-[9px] text-slate-400 hover:text-white underline ml-0.5"
                  title="Clear Background"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 2. Text Color Controller */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-md px-2 py-1 border border-slate-700">
              <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                <Type className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Text:</span>
              </div>
              {/* Native Color Spectrum / Wheel Picker */}
              <input
                type="color"
                value={
                  activeSection.style?.textColor && activeSection.style.textColor.startsWith('#') && activeSection.style.textColor.length === 7
                    ? activeSection.style.textColor
                    : '#0f172a'
                }
                onChange={(e) => updateSectionStyle(activeSection.id, { textColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border border-slate-600 bg-transparent p-0 flex-shrink-0"
                title="Choose Text Color from Color Spectrum / Wheel"
              />
              {/* Hex Code Input */}
              <input
                type="text"
                placeholder="#HEX"
                maxLength={7}
                value={activeSection.style?.textColor || ''}
                onChange={(e) => updateSectionStyle(activeSection.id, { textColor: e.target.value })}
                className="w-14 bg-slate-950 border border-slate-700 text-white text-[10px] font-mono px-1 py-0.5 rounded focus:outline-none focus:border-blue-500 uppercase"
                title="Enter Hex Text Color (e.g. #0f172a)"
              />
              {/* Quick Swatches */}
              <div className="hidden xl:flex items-center gap-1">
                {['#0f172a', '#2563eb', '#059669', '#dc2626', '#7c3aed'].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateSectionStyle(activeSection.id, { textColor: hex })}
                    className={`w-3.5 h-3.5 rounded-full border border-slate-600 transition hover:scale-110 ${
                      activeSection.style?.textColor === hex ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set Text Color: ${hex}`}
                  />
                ))}
              </div>
              {activeSection.style?.textColor && (
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { textColor: undefined })}
                  className="text-[9px] text-slate-400 hover:text-white underline ml-0.5"
                  title="Clear Text Color"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 3. Highlight Color Controller */}
            <div className="flex items-center gap-1.5 bg-slate-800 rounded-md px-2 py-1 border border-slate-700">
              <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                <Highlighter className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Highlight:</span>
              </div>
              {/* Native Color Spectrum / Wheel Picker */}
              <input
                type="color"
                value={
                  activeSection.style?.highlightColor && activeSection.style.highlightColor.startsWith('#') && activeSection.style.highlightColor.length === 7
                    ? activeSection.style.highlightColor
                    : '#fef08a'
                }
                onChange={(e) => updateSectionStyle(activeSection.id, { highlightColor: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border border-slate-600 bg-transparent p-0 flex-shrink-0"
                title="Choose Highlight from Color Spectrum / Wheel"
              />
              {/* Hex Code Input */}
              <input
                type="text"
                placeholder="#HEX"
                maxLength={7}
                value={activeSection.style?.highlightColor || ''}
                onChange={(e) => updateSectionStyle(activeSection.id, { highlightColor: e.target.value })}
                className="w-14 bg-slate-950 border border-slate-700 text-white text-[10px] font-mono px-1 py-0.5 rounded focus:outline-none focus:border-blue-500 uppercase"
                title="Enter Hex Highlight Code (e.g. #fef08a)"
              />
              {/* Quick Pastel Highlighters */}
              <div className="hidden xl:flex items-center gap-1">
                {['#fef08a', '#bbf7d0', '#bfdbfe', '#fed7aa', '#fbcfe8'].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateSectionStyle(activeSection.id, { highlightColor: hex })}
                    className={`w-3.5 h-3.5 rounded-full border border-slate-600 transition hover:scale-110 ${
                      activeSection.style?.highlightColor === hex ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`Set Highlight: ${hex}`}
                  />
                ))}
              </div>
              {activeSection.style?.highlightColor && (
                <button
                  type="button"
                  onClick={() => updateSectionStyle(activeSection.id, { highlightColor: undefined })}
                  className="text-[9px] text-slate-400 hover:text-white underline ml-0.5"
                  title="Clear Highlight"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Deselect / Close Ribbon */}
            <button
              type="button"
              onClick={() => setActiveSectionId(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition ml-auto sm:ml-0"
              title="Close Formatting Ribbon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN 3-PANEL WORKSPACE (Full Height & Smooth Scrolling) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full flex-1 flex flex-col">
        {/* ------------------------------------------------------------- */}
        {/* LEFT INSERTER DRAWER / DOCKED SIDEBAR */}
        {/* ------------------------------------------------------------- */}
        <aside className={`fixed left-0 bottom-0 z-40 w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-200 ${showLeftDrawer ? "translate-x-0" : "-translate-x-full"}`} style={{ top: "56px", height: "calc(100vh - 56px)" }}>
            {/* Close button for all screens */}
            {/* Drawer Header */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2 font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Add Section Blocks ({filteredTemplates.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLeftDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                title="Hide Library"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1">
                {(['all', 'core', 'academic', 'media', 'custom'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Blocks List (Draggable + 1-Click Add) */}
            <div className="flex-1 overflow-y-scroll overscroll-contain p-3 pb-32 space-y-2 bg-slate-50/50 drawer-vertical-scroller" style={{ overflowY: "scroll", WebkitOverflowScrolling: "touch" }}>
              {filteredTemplates.map((template) => {
                const IconComp = template.icon;
                return (
                  <div
                    key={template.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/x-section-type', template.type);
                    }}
                    onClick={() => addSectionFromTemplate(template.type)}
                    className="group border border-slate-200 hover:border-blue-500 rounded-xl p-2.5 bg-white hover:bg-blue-50/40 cursor-grab active:cursor-grabbing transition shadow-2xs flex items-start gap-2.5"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition flex-shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">
                          {template.title}
                        </h4>
                        <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-blue-500">
                          + Add
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        {template.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

        {/* ------------------------------------------------------------- */}
        {/* CENTER CANVAS AREA (A4 Paper Sheet Simulation - Full Scroll) */}
        {/* ------------------------------------------------------------- */}
        <main className={`w-full min-h-screen py-6 px-3 sm:px-6 md:px-8 flex flex-col items-center transition-all duration-200 ${showLeftDrawer ? "lg:pl-84" : ""}`}>
          {/* Simulation Paper Sheet */}
          <div
            className={`w-full max-w-4xl bg-white shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 mb-32 transition-all ${
              previewMode ? 'ring-2 ring-amber-400' : ''
            }`}
          >
            {sections.length > 0 && (
              sections.map((section, idx) => {
                const isActive = activeSectionId === section.id && !previewMode;
                const isDragOver = dragOverIndex === idx;

                return (
                  <div
                    key={section.id}
                    onClick={() => {
                      if (!previewMode) {
                        setActiveSectionId(section.id);
                      }
                    }}
                    draggable={!previewMode}
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`relative transition-all ${
                      isActive
                        ? 'ring-2 ring-blue-500 bg-blue-50/10 z-20'
                        : 'hover:bg-slate-50/50'
                    } ${isDragOver ? 'border-t-4 border-blue-500' : ''}`}
                  >
                    {/* Block Action Controls on Active Hover */}
                    {isActive && (
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-slate-900/95 text-white px-2 py-1 rounded-lg shadow-xl backdrop-blur-xs text-[10px] animate-in fade-in">
                        <span className="font-bold text-slate-300 pr-1 border-r border-slate-700">
                          {section.title}
                        </span>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                          className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                          className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); duplicateSection(idx); }}
                          className="p-1 hover:bg-slate-800 rounded text-blue-400"
                          title="Duplicate Block"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400"
                          title="Delete Block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Render exact section with live BlockStyle applied */}
                    <div
                      style={{
                        backgroundColor:
                          section.style?.backgroundColor ||
                          (section.style?.highlightColor ? `${section.style.highlightColor}20` : undefined),
                        color: section.style?.textColor || undefined,
                        boxShadow: section.style?.highlightColor
                          ? `inset 0 0 0 2px ${section.style.highlightColor}, 0 4px 16px ${section.style.highlightColor}33`
                          : undefined,
                        borderLeft: section.style?.highlightColor
                          ? `4px solid ${section.style.highlightColor}`
                          : undefined,
                        textAlign: section.style?.textAlign || undefined,
                        fontWeight: section.style?.fontWeight || undefined,
                        fontStyle: section.style?.fontStyle || undefined,
                        textDecoration: section.style?.textDecoration || undefined,
                        textTransform: section.style?.textTransform || undefined,
                        fontFamily:
                          section.style?.fontFamily === 'serif'
                            ? 'Georgia, Cambria, serif'
                            : section.style?.fontFamily === 'mono'
                            ? 'ui-monospace, monospace'
                            : undefined,
                        fontSize:
                          section.style?.fontSize === 'xs'
                            ? '0.75rem'
                            : section.style?.fontSize === 'sm'
                            ? '0.875rem'
                            : section.style?.fontSize === 'lg'
                            ? '1.125rem'
                            : section.style?.fontSize === 'xl'
                            ? '1.25rem'
                            : section.style?.fontSize === '2xl'
                            ? '1.5rem'
                            : section.style?.fontSize === '3xl'
                            ? '1.875rem'
                            : undefined,
                        padding:
                          section.style?.padding === 'compact'
                            ? '0.5rem'
                            : section.style?.padding === 'relaxed'
                            ? '2rem'
                            : undefined,
                        borderRadius:
                          section.style?.borderRadius === 'sm'
                            ? '0.25rem'
                            : section.style?.borderRadius === 'md'
                            ? '0.5rem'
                            : section.style?.borderRadius === 'lg'
                            ? '0.75rem'
                            : section.style?.borderRadius === 'xl'
                            ? '1rem'
                            : section.style?.borderRadius === 'full'
                            ? '9999px'
                            : undefined,
                      }}
                      className={section.style?.customClass || ''}
                    >
                      {renderSectionContent(section, idx)}
                    </div>
                  </div>
                );
              })
            )}

            {/* Bottom Append Area */}
            {!previewMode && (
              <div
                onDragOver={(e) => handleDragOver(e, sections.length)}
                onDrop={(e) => handleDrop(e, sections.length)}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 p-4 sm:p-6 text-center m-3 sm:m-6 rounded-xl transition bg-slate-50 hover:bg-blue-50/50 cursor-pointer"
                onClick={() => addSectionFromTemplate('custom_richtext')}
              >
                <p className="text-xs font-semibold text-slate-600">
                  + Drag any section from the left library or click to add a Custom Block
                </p>
              </div>
            )}
          </div>

          {/* Quick Floating Scroll Controls (Top & Bottom Jump) */}
          <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 bg-slate-900/90 text-white p-1.5 rounded-full shadow-2xl backdrop-blur-md border border-slate-700/80">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('resume-canvas-scroll-container');
                if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition flex items-center gap-1 text-[10px] font-bold"
              title="Scroll to Top"
            >
              <MoveUp className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Top</span>
            </button>

            <span className="h-4 w-px bg-slate-700" />

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('resume-canvas-scroll-container');
                if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
              }}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition flex items-center gap-1 text-[10px] font-bold"
              title="Scroll to Bottom"
            >
              <MoveDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Bottom</span>
            </button>
          </div>
        </main>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT INSPECTOR PANEL (Fixed on side during document scroll) */}
        {/* ------------------------------------------------------------- */}
        {!previewMode && showRightInspector && (
          <aside className="fixed right-0 bottom-0 z-40 w-72 sm:w-80 bg-[#ffffff] text-slate-900 border-l border-slate-200 flex flex-col shadow-2xl" style={{ top: "56px", height: "calc(100vh - 56px)" }}>
            {/* Inspector Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 pt-3 pb-0 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setInspectorTab('document')}
                  className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                    inspectorTab === 'document'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Document
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorTab('block')}
                  className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                    inspectorTab === 'block'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Block
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowRightInspector(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md -mt-2"
                title="Close Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Body */}
            <div className="flex-1 overflow-y-scroll overscroll-contain p-3 pb-32 space-y-2 bg-slate-50/50 drawer-vertical-scroller" style={{ overflowY: "scroll", WebkitOverflowScrolling: "touch" }}>
              {inspectorTab === 'block' ? (
                activeSection ? (
                  <>
                    {/* Block Info Header */}
                    <div className="pb-3 border-b border-slate-100 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{activeSection.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Configure text, typography, colors, and styling.
                        </p>
                      </div>
                    </div>

                    {/* Typography Settings */}
                    <div className="space-y-3">
                      <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                        Typography
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-slate-600 block mb-1">Font Size</span>
                          <select
                            value={activeSection.style?.fontSize || 'sm'}
                            onChange={(e) => updateSectionStyle(activeSection.id, { fontSize: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            <option value="xs">Extra Small (xs)</option>
                            <option value="sm">Small (sm)</option>
                            <option value="base">Regular (base)</option>
                            <option value="lg">Large (lg)</option>
                            <option value="xl">Extra Large (xl)</option>
                            <option value="2xl">Heading 2XL</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-600 block mb-1">Font Family</span>
                          <select
                            value={activeSection.style?.fontFamily || 'sans'}
                            onChange={(e) => updateSectionStyle(activeSection.id, { fontFamily: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                          >
                            <option value="sans">Modern Sans</option>
                            <option value="serif">Academic Serif</option>
                            <option value="mono">Clean Mono</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                        Colors
                      </label>

                      {/* Background Color */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                            <Paintbrush className="w-3 h-3 text-blue-500" />
                            <span>Background Color</span>
                          </span>
                          {activeSection.style?.backgroundColor && (
                            <button
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { backgroundColor: undefined })}
                              className="text-[10px] text-blue-600 hover:underline font-semibold"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {/* Spectrum Picker + Hex input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={
                              activeSection.style?.backgroundColor && activeSection.style.backgroundColor.startsWith('#') && activeSection.style.backgroundColor.length === 7
                                ? activeSection.style.backgroundColor
                                : '#ffffff'
                            }
                            onChange={(e) => updateSectionStyle(activeSection.id, { backgroundColor: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                            title="Open Color Spectrum / Wheel"
                          />
                          <input
                            type="text"
                            placeholder="#HEX e.g. #2563eb"
                            maxLength={7}
                            value={activeSection.style?.backgroundColor || ''}
                            onChange={(e) => updateSectionStyle(activeSection.id, { backgroundColor: e.target.value })}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        {/* Quick Palette */}
                        <div className="grid grid-cols-7 gap-1 pt-1">
                          {COLOR_PALETTE.map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { backgroundColor: color.hex })}
                              title={color.name}
                              className={`w-6 h-6 rounded-full border border-slate-300 transition hover:scale-110 flex items-center justify-center ${
                                activeSection.style?.backgroundColor === color.hex ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                              }`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {activeSection.style?.backgroundColor === color.hex && (
                                <Check className={`w-3 h-3 ${color.hex === '#ffffff' || color.hex === '#f1f5f9' ? 'text-slate-900' : 'text-white'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                            <Type className="w-3 h-3 text-amber-500" />
                            <span>Text Color</span>
                          </span>
                          {activeSection.style?.textColor && (
                            <button
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { textColor: undefined })}
                              className="text-[10px] text-blue-600 hover:underline font-semibold"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {/* Spectrum Picker + Hex input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={
                              activeSection.style?.textColor && activeSection.style.textColor.startsWith('#') && activeSection.style.textColor.length === 7
                                ? activeSection.style.textColor
                                : '#0f172a'
                            }
                            onChange={(e) => updateSectionStyle(activeSection.id, { textColor: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                            title="Open Color Spectrum / Wheel"
                          />
                          <input
                            type="text"
                            placeholder="#HEX e.g. #0f172a"
                            maxLength={7}
                            value={activeSection.style?.textColor || ''}
                            onChange={(e) => updateSectionStyle(activeSection.id, { textColor: e.target.value })}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        {/* Quick Palette */}
                        <div className="grid grid-cols-7 gap-1 pt-1">
                          {COLOR_PALETTE.map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { textColor: color.hex })}
                              title={color.name}
                              className={`w-6 h-6 rounded-full border border-slate-300 transition hover:scale-110 flex items-center justify-center ${
                                activeSection.style?.textColor === color.hex ? 'ring-2 ring-blue-600 ring-offset-1' : ''
                              }`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {activeSection.style?.textColor === color.hex && (
                                <Check className={`w-3 h-3 ${color.hex === '#ffffff' || color.hex === '#f1f5f9' ? 'text-slate-900' : 'text-white'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Highlight Color */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                            <Highlighter className="w-3 h-3 text-emerald-500" />
                            <span>Highlight Color</span>
                          </span>
                          {activeSection.style?.highlightColor && (
                            <button
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { highlightColor: undefined })}
                              className="text-[10px] text-blue-600 hover:underline font-semibold"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        {/* Spectrum Picker + Hex input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={
                              activeSection.style?.highlightColor && activeSection.style.highlightColor.startsWith('#') && activeSection.style.highlightColor.length === 7
                                ? activeSection.style.highlightColor
                                : '#fef08a'
                            }
                            onChange={(e) => updateSectionStyle(activeSection.id, { highlightColor: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                            title="Open Color Spectrum / Wheel"
                          />
                          <input
                            type="text"
                            placeholder="#HEX e.g. #fef08a"
                            maxLength={7}
                            value={activeSection.style?.highlightColor || ''}
                            onChange={(e) => updateSectionStyle(activeSection.id, { highlightColor: e.target.value })}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        {/* Quick Highlighters */}
                        <div className="grid grid-cols-6 gap-1 pt-1">
                          {[
                            { name: 'Yellow', hex: '#fef08a' },
                            { name: 'Green', hex: '#bbf7d0' },
                            { name: 'Blue', hex: '#bfdbfe' },
                            { name: 'Peach', hex: '#fed7aa' },
                            { name: 'Pink', hex: '#fbcfe8' },
                            { name: 'Purple', hex: '#e9d5ff' }
                          ].map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => updateSectionStyle(activeSection.id, { highlightColor: color.hex })}
                              title={color.name}
                              className={`w-6 h-6 rounded-full border border-slate-300 transition hover:scale-110 flex items-center justify-center ${
                                activeSection.style?.highlightColor === color.hex ? 'ring-2 ring-emerald-600 ring-offset-1' : ''
                              }`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {activeSection.style?.highlightColor === color.hex && (
                                <Check className="w-3 h-3 text-slate-900" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-2">
                      <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                        Advanced
                      </label>
                      <div>
                        <span className="text-[11px] text-slate-600 block mb-1">Additional CSS Class</span>
                        <input
                          type="text"
                          placeholder="e.g. shadow-lg border-2"
                          value={activeSection.style?.customClass || ''}
                          onChange={(e) => updateSectionStyle(activeSection.id, { customClass: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Layers className="w-7 h-7 mx-auto mb-2 opacity-50" />
                    <p>No block selected. Click any block in the canvas to inspect.</p>
                  </div>
                )
              ) : (
                /* Document Settings Tab */
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1">
                      Faculty Resume Slug
                    </label>
                    <input
                      type="text"
                      value={heroData.slug || ''}
                      onChange={(e) => {
                        const hero = sections.find((s) => s.type === 'header_hero');
                        if (hero) updateSectionData(hero.id, { slug: e.target.value });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Public Link: <span className="font-bold text-blue-600">resumes.cseel.org/best-Teacherfaculty/{heroData.subject?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'physics'}/{heroData.slug || 'faculty'}.html</span>
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1">
                      Primary Subject
                    </label>
                    <input
                      type="text"
                      value={heroData.subject || ''}
                      onChange={(e) => {
                        const hero = sections.find((s) => s.type === 'header_hero');
                        if (hero) updateSectionData(hero.id, { subject: e.target.value });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <label className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-2">
                      Document Outline ({sections.length} Blocks)
                    </label>
                    <div className="space-y-1">
                      {sections.map((sec, i) => (
                        <div
                          key={sec.id}
                          onClick={() => {
                            setActiveSectionId(sec.id);
                            setInspectorTab('block');
                          }}
                          className={`p-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition ${
                            activeSectionId === sec.id ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span>{i + 1}. {sec.title}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS FOR VIDEO & IMAGE PREVIEWS */}
      {/* ------------------------------------------------------------- */}
      {testVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <span>Video Demonstration Player</span>
              </h3>
              <button
                type="button"
                onClick={() => setTestVideoUrl(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <iframe
                src={getSafeEmbedUrl(testVideoUrl)}
                title="Video Demo"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-3 bg-slate-800/80 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
              <span>Google Drive / Cloud Video Player</span>
              <a
                href={testVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Drive / Source</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {testImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Demonstration Image Preview</span>
              </h3>
              <button
                type="button"
                onClick={() => setTestImageUrl(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-black/40 rounded-xl overflow-hidden max-h-[70vh]">
              <img src={testImageUrl} alt="Preview" className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SUCCESS MODAL: RESUME CREATED & PUBLISHED LIVE URLS */}
      {/* ------------------------------------------------------------- */}
      {publishedModalData && publishedModalData.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-800 my-auto animate-in zoom-in-95 duration-150">
            {/* Header with vibrant gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-6 sm:p-7 relative">
              <button
                type="button"
                onClick={() => setPublishedModalData(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved in Database (Supabase PostgreSQL)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Resume Created & Published Live!
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                Faculty profile for <span className="font-bold underline text-white">{publishedModalData.name}</span> is live. Anyone can view this resume using the public link below.
              </p>
            </div>

            {/* Body with Generated Public URLs */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* 1. Main Public Resume URL Card */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>1. Main Public Resume URL</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Live Public Link
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedModalData.resumeUrl}
                    className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(publishedModalData.resumeUrl);
                      setCopiedUrlType('resume');
                      setTimeout(() => setCopiedUrlType(null), 2500);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition flex-shrink-0 shadow-sm"
                  >
                    {copiedUrlType === 'resume' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrlType === 'resume' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Video Demonstrations URL Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-500" />
                    <span>2. Dedicated Videos Page</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedModalData.videosUrl}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-700 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(publishedModalData.videosUrl);
                      setCopiedUrlType('videos');
                      setTimeout(() => setCopiedUrlType(null), 2500);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold text-xs flex items-center gap-1 transition flex-shrink-0"
                  >
                    {copiedUrlType === 'videos' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrlType === 'videos' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* 3. Photo Gallery URL Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Dedicated Photo Gallery Page</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publishedModalData.galleryUrl}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-700 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(publishedModalData.galleryUrl);
                      setCopiedUrlType('gallery');
                      setTimeout(() => setCopiedUrlType(null), 2500);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold text-xs flex items-center gap-1 transition flex-shrink-0"
                  >
                    {copiedUrlType === 'gallery' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrlType === 'gallery' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <a
                  href={publishedModalData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs text-center flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <span>Open Live Public Resume</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPublishedModalData(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition active:scale-95"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // -----------------------------------------------------------------
  // SECTION RENDERERS WITH 100% INLINE EDITING & PREVIEW SUPPORT
  // -----------------------------------------------------------------
  function renderSectionContent(section: ResumeSectionBlock, idx: number) {
    switch (section.type) {
      case 'header_hero':
        return renderHeroSection(section);
      case 'metrics_strip':
        return renderMetricsStrip(section);
      case 'career_objective':
        return renderCareerObjective(section);
      case 'advantage_box':
        return renderAdvantageBox(section);
      case 'qualifications_table':
        return renderQualificationsTable(section);
      case 'experience_timeline':
        return renderExperienceTimeline(section);
      case 'certifications_box':
        return renderCertificationsBox(section);
      case 'skills_tags':
        return renderSkillsTags(section);
      case 'areas_of_expertise':
        return renderAreasOfExpertise(section);
      case 'key_achievements':
        return renderKeyAchievements(section);
      case 'personal_details':
        return renderPersonalDetails(section);
      case 'experiments_section':
        return renderExperimentsSection(section);
      case 'demo_videos':
        return renderDemoVideos(section);
      case 'photo_gallery':
        return renderPhotoGallery(section);
      case 'custom_richtext':
        return renderCustomRichtext(section);
      default:
        return null;
    }
  }

  // 1. HERO HEADER SECTION
  function renderHeroSection(section: ResumeSectionBlock) {
    const data = section.data || {};
    const addr = data.addressDetails || {};

    return (
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0d9488] text-white p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          {/* Avatar with Ribbon Badge */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative">
              <img
                src={data.photoUrl || '/images/dev-sharma.jpg'}
                alt={data.name || 'Faculty Avatar'}
                className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-[18px] sm:rounded-[20px] object-cover border-[3px] sm:border-[3.5px] border-white shadow-xl bg-slate-800"
              />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#16a34a] text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/40 flex items-center gap-1">
                <span>★ VERIFIED FACULTY</span>
              </div>
            </div>

            {!previewMode && (
              <div className="mt-3 flex flex-col gap-1 w-full">
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={data.photoUrl || ''}
                  onChange={(e) => updateSectionData(section.id, { photoUrl: e.target.value })}
                  className="bg-slate-900/90 border border-slate-700 rounded-md px-2 py-1 text-[10px] text-white w-32 sm:w-36 text-center placeholder-slate-400"
                />
              </div>
            )}
          </div>

          {/* Hero Bio & Details */}
          <div className="flex-1 text-center md:text-left space-y-1.5 sm:space-y-2 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              {previewMode ? (
                <span className="bg-white/15 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20">
                  {data.subject || 'Physics Faculty'}
                </span>
              ) : (
                <input
                  type="text"
                  value={data.subject || ''}
                  onChange={(e) => updateSectionData(section.id, { subject: e.target.value })}
                  placeholder="Subject (e.g. Physics Faculty)"
                  className="bg-white/15 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-white/20 focus:outline-none focus:bg-white/25 w-36 text-center"
                />
              )}
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Document Verified</span>
              </span>
              {addr.isLocationVerified && (
                <span className="bg-teal-500/25 text-teal-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full border border-teal-400/40 flex items-center gap-1">
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>GPS 2km Verified</span>
                </span>
              )}
            </div>

            {previewMode ? (
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {data.name || 'Faculty Member'}
              </h1>
            ) : (
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => {
                  const newName = e.target.value;
                  const currentSlug = data.slug || '';
                  const isGenericSlug = !currentSlug || currentSlug === 'DevSharma' || currentSlug.startsWith('faculty-');
                  const matchesOldName = currentSlug === (data.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

                  const updates: any = { name: newName };
                  if ((initialData?.isNew || isGenericSlug || matchesOldName) && newName.trim()) {
                    updates.slug = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
                  }
                  updateSectionData(section.id, updates);
                }}
                placeholder="Faculty Full Name"
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg px-2.5 py-1 w-full focus:outline-none"
              />
            )}

            {previewMode ? (
              <p className="text-xs sm:text-sm md:text-base font-semibold text-teal-200">
                {data.title || 'Senior Physics Faculty | Master Trainer & Composite Lab Architect'}
              </p>
            ) : (
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateSectionData(section.id, { title: e.target.value })}
                placeholder="Designation / Specialization"
                className="text-xs sm:text-sm md:text-base font-semibold text-teal-200 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-lg px-2.5 py-1 w-full focus:outline-none"
              />
            )}

            {/* Contact Details */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 pt-1">
              <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-xs text-white text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg border border-white/10">
                <MapPin className="w-3 h-3 text-teal-300 flex-shrink-0" />
                <span>{data.address || 'Prakash Vihar Colony, Palwal, Haryana - 121102'}</span>
              </span>

              {previewMode ? (
                <>
                  <a
                    href={`tel:${data.phone || '+918683979659'}`}
                    className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-xs text-white hover:text-teal-200 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg border border-white/10 transition"
                  >
                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span>{data.phone || '+91 8683979659'}</span>
                  </a>
                  <a
                    href={`mailto:${data.email || 'ptdevkaushik101@gmail.com'}`}
                    className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-xs text-white hover:text-teal-200 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-lg border border-white/10 transition"
                  >
                    <Mail className="w-3 h-3 text-blue-300 flex-shrink-0" />
                    <span>{data.email || 'ptdevkaushik101@gmail.com'}</span>
                  </a>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-xs text-white text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border border-white/10">
                    <Phone className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={data.phone || ''}
                      onChange={(e) => updateSectionData(section.id, { phone: e.target.value })}
                      placeholder="Phone"
                      className="bg-transparent border-none text-white focus:outline-none w-28 text-[11px]"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-xs text-white text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg border border-white/10">
                    <Mail className="w-3 h-3 text-blue-300 flex-shrink-0" />
                    <input
                      type="text"
                      value={data.email || ''}
                      onChange={(e) => updateSectionData(section.id, { email: e.target.value })}
                      placeholder="Email"
                      className="bg-transparent border-none text-white focus:outline-none w-44 text-[11px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* ADDRESS BUILDER & 2KM GPS RANGE VERIFICATION (Edit Mode Only) */}
            {/* ----------------------------------------------------------------- */}
            {!previewMode && (
              <div className="mt-4 p-3.5 bg-slate-900/85 border border-slate-700/80 rounded-xl space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Address & 2km GPS Verification</span>
                  </span>
                  {addr.isLocationVerified ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified ({addr.distanceKm ?? 0} km)</span>
                    </span>
                  ) : (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Unverified</span>
                    </span>
                  )}
                </div>

                {/* 4 Discrete Fields: Local Address, District, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Local Address / Colony</label>
                    <input
                      type="text"
                      placeholder="e.g. Prakash Vihar Colony"
                      value={addr.localAddress || ''}
                      onChange={(e) => {
                        const newLocal = e.target.value;
                        const newAddrObj = { ...addr, localAddress: newLocal };
                        const combined = buildFormattedAddress(newLocal, addr.district, addr.state, addr.pincode);
                        updateSectionData(section.id, {
                          addressDetails: newAddrObj,
                          address: combined
                        });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">District</label>
                    <input
                      type="text"
                      placeholder="e.g. Palwal"
                      value={addr.district || ''}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        const newAddrObj = { ...addr, district: newDist };
                        const combined = buildFormattedAddress(addr.localAddress, newDist, addr.state, addr.pincode);
                        updateSectionData(section.id, {
                          addressDetails: newAddrObj,
                          address: combined
                        });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Haryana"
                      value={addr.state || ''}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const newAddrObj = { ...addr, state: newState };
                        const combined = buildFormattedAddress(addr.localAddress, addr.district, newState, addr.pincode);
                        updateSectionData(section.id, {
                          addressDetails: newAddrObj,
                          address: combined
                        });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 121102"
                      value={addr.pincode || ''}
                      onChange={(e) => {
                        const newPin = e.target.value;
                        const newAddrObj = { ...addr, pincode: newPin };
                        const combined = buildFormattedAddress(addr.localAddress, addr.district, addr.state, newPin);
                        updateSectionData(section.id, {
                          addressDetails: newAddrObj,
                          address: combined
                        });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                {/* Combined Address & Search Location from Address Button */}
                <div className="bg-black/40 border border-slate-800 rounded-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300 truncate flex-1">
                    <span className="text-teal-400 font-bold">Combined:</span>
                    <span className="text-white font-medium truncate">
                      {data.address || buildFormattedAddress(addr.localAddress, addr.district, addr.state, addr.pincode) || 'Address not filled yet'}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isSearchingAddressLocation}
                    onClick={() => handleSearchLocationFromAddress(section.id, addr)}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-md text-[10px] transition flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                  >
                    <Compass className={`w-3 h-3 ${isSearchingAddressLocation ? 'animate-spin' : ''}`} />
                    <span>{isSearchingAddressLocation ? 'Searching...' : '🔍 Search Location from Address'}</span>
                  </button>
                </div>

                {/* Google Map Link / Short Share URL (e.g. maps.app.goo.gl) */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-400 block font-semibold">
                      Google Maps Share Link or URL (e.g. https://maps.app.goo.gl/...)
                    </label>
                    {addr.googleMapLocation && (
                      <a
                        href={addr.googleMapLocation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-teal-300 hover:underline font-bold flex items-center gap-0.5"
                      >
                        <span>Open Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. https://maps.app.goo.gl/ay3PNWXtb1qq1515A or https://maps.google.com/?q=28.2298,77.3142"
                    value={addr.googleMapLocation || ''}
                    onChange={(e) => {
                      const newLoc = e.target.value;
                      const parsed = parseGoogleMapsLocation(newLoc);
                      const newAddrObj = {
                        ...addr,
                        googleMapLocation: newLoc,
                        latitude: parsed?.latitude ?? addr.latitude,
                        longitude: parsed?.longitude ?? addr.longitude
                      };
                      updateSectionData(section.id, { addressDetails: newAddrObj });
                    }}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>

                {/* Direct Latitude & Longitude Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Latitude (e.g. 28.229811)</label>
                    <input
                      type="text"
                      placeholder="28.229811"
                      value={addr.latitude !== undefined && addr.latitude !== null ? String(addr.latitude) : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = val ? parseFloat(val) : undefined;
                        const newAddrObj = {
                          ...addr,
                          latitude: num,
                          googleMapLocation: num && addr.longitude ? `https://maps.google.com/?q=${num},${addr.longitude}` : addr.googleMapLocation
                        };
                        updateSectionData(section.id, { addressDetails: newAddrObj });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5 font-semibold">Longitude (e.g. 77.314282)</label>
                    <input
                      type="text"
                      placeholder="77.314282"
                      value={addr.longitude !== undefined && addr.longitude !== null ? String(addr.longitude) : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const num = val ? parseFloat(val) : undefined;
                        const newAddrObj = {
                          ...addr,
                          longitude: num,
                          googleMapLocation: addr.latitude && num ? `https://maps.google.com/?q=${addr.latitude},${num}` : addr.googleMapLocation
                        };
                        updateSectionData(section.id, { addressDetails: newAddrObj });
                      }}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
                    />
                  </div>
                </div>

                {/* Detect Device GPS & Verify 2km Range Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={isGpsChecking}
                    onClick={() => handleDetect2kmRange(section.id, addr)}
                    className="w-full py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-98 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isGpsChecking ? 'animate-spin' : ''}`} />
                    <span>{isGpsChecking ? 'Detecting Device GPS & Calculating Distance...' : '📡 Detect Device GPS & Verify 2km Range'}</span>
                  </button>
                </div>

                {/* GPS Status Message */}
                {gpsStatusMessage && (
                  <div
                    className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                      gpsStatusMessage.type === 'success'
                        ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-700/50'
                        : 'bg-amber-900/40 text-amber-200 border border-amber-700/50'
                    }`}
                  >
                    {gpsStatusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                    <span>{gpsStatusMessage.text}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. HIGHLIGHTS METRICS STRIP (100% Inline Editable)
  function renderMetricsStrip(section: ResumeSectionBlock) {
    const metrics: any[] = section.data?.metrics || [];

    return (
      <div className="bg-[#1e293b] text-white p-3 sm:p-5 border-b border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="text-center p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 relative group">
              {previewMode ? (
                <>
                  <div className="text-base sm:text-lg md:text-xl font-extrabold text-teal-400">
                    {m.val}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 font-semibold mt-0.5">
                    {m.lbl}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={m.val || ''}
                    onChange={(e) => {
                      const updated = [...metrics];
                      updated[i] = { ...updated[i], val: e.target.value };
                      updateSectionData(section.id, { metrics: updated });
                    }}
                    placeholder="Value (e.g. 100%)"
                    className="text-base sm:text-lg md:text-xl font-extrabold text-teal-400 bg-transparent text-center border-b border-slate-600 focus:border-teal-400 focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    value={m.lbl || ''}
                    onChange={(e) => {
                      const updated = [...metrics];
                      updated[i] = { ...updated[i], lbl: e.target.value };
                      updateSectionData(section.id, { metrics: updated });
                    }}
                    placeholder="Label"
                    className="text-[10px] sm:text-[11px] text-slate-300 font-semibold bg-transparent text-center border-b border-slate-600 focus:border-teal-400 focus:outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = metrics.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { metrics: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full text-[9px] hover:bg-red-700 transition shadow"
                    title="Remove Metric"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {!previewMode && (
          <div className="mt-2.5 text-center">
            <button
              type="button"
              onClick={() => {
                const updated = [...metrics, { val: '100+', lbl: 'Metric Description' }];
                updateSectionData(section.id, { metrics: updated });
              }}
              className="text-[10px] text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700"
            >
              <Plus className="w-3 h-3" />
              <span>Add Metric Card</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. CAREER OBJECTIVE (100% Inline Editable)
  function renderCareerObjective(section: ResumeSectionBlock) {
    const data = section.data || {};

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-white">
        <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2 border-b border-[#e2e8f0] pb-2">
          <Compass className="w-4 h-4 text-[#2563eb]" />
          {previewMode ? (
            <span>{data.heading || 'Career Objective'}</span>
          ) : (
            <input
              type="text"
              value={data.heading || ''}
              onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
              placeholder="Section Heading"
              className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-blue-50/50 rounded px-1 -mx-1"
            />
          )}
        </h3>

        {previewMode ? (
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
            {data.content || ''}
          </p>
        ) : (
          <textarea
            rows={4}
            value={data.content || ''}
            onChange={(e) => updateSectionData(section.id, { content: e.target.value })}
            placeholder="Enter career objective..."
            className="text-xs sm:text-[13px] text-slate-700 leading-relaxed w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500 font-medium"
          />
        )}
      </div>
    );
  }

  // 4. EXPERIENTIAL ADVANTAGE BOX (100% Inline Editable)
  function renderAdvantageBox(section: ResumeSectionBlock) {
    const data = section.data || {};
    const cards: any[] = data.cards || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-4 bg-gradient-to-r from-blue-50 to-teal-50 border-t border-slate-100">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          {previewMode ? (
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              {data.pillText || 'Experiential Pedagogy'}
            </span>
          ) : (
            <input
              type="text"
              value={data.pillText || ''}
              onChange={(e) => updateSectionData(section.id, { pillText: e.target.value })}
              placeholder="Pill Badge"
              className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider text-center focus:outline-none"
            />
          )}

          {previewMode ? (
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 pt-1">
              {data.headline || 'Audio-Visual & Hands-On Science with 90% Concept Retention'}
            </h3>
          ) : (
            <input
              type="text"
              value={data.headline || ''}
              onChange={(e) => updateSectionData(section.id, { headline: e.target.value })}
              placeholder="Headline"
              className="text-sm sm:text-base font-extrabold text-slate-900 pt-1 bg-transparent text-center w-full focus:outline-none focus:bg-white/80 rounded px-1"
            />
          )}

          {previewMode ? (
            <p className="text-xs text-slate-600">
              {data.description || ''}
            </p>
          ) : (
            <textarea
              rows={2}
              value={data.description || ''}
              onChange={(e) => updateSectionData(section.id, { description: e.target.value })}
              placeholder="Brief summary description..."
              className="text-xs text-slate-600 bg-transparent text-center w-full focus:outline-none focus:bg-white/80 rounded px-1 resize-none"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border shadow-2xs space-y-2 relative group ${
                c.badgeColor === 'green'
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-rose-50/50 border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                {previewMode ? (
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      c.badgeColor === 'green' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {c.badge}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={c.badge || ''}
                    onChange={(e) => {
                      const updated = [...cards];
                      updated[i] = { ...updated[i], badge: e.target.value };
                      updateSectionData(section.id, { cards: updated });
                    }}
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      c.badgeColor === 'green' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    } focus:outline-none`}
                  />
                )}
              </div>

              {previewMode ? (
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{c.title}</h4>
              ) : (
                <input
                  type="text"
                  value={c.title || ''}
                  onChange={(e) => {
                    const updated = [...cards];
                    updated[i] = { ...updated[i], title: e.target.value };
                    updateSectionData(section.id, { cards: updated });
                  }}
                  className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:bg-white/90 border border-transparent focus:border-slate-300 rounded px-1.5 py-0.5 w-full focus:outline-none"
                />
              )}

              <ul className="text-xs text-slate-700 space-y-1">
                {(c.points || []).map((pt: string, pIdx: number) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <span className="mt-0.5">{c.badgeColor === 'green' ? '✓' : '✗'}</span>
                    {previewMode ? (
                      <span className="flex-1">{pt}</span>
                    ) : (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={pt || ''}
                          onChange={(e) => {
                            const updated = [...cards];
                            const pts = [...(updated[i].points || [])];
                            pts[pIdx] = e.target.value;
                            updated[i] = { ...updated[i], points: pts };
                            updateSectionData(section.id, { cards: updated });
                          }}
                          className="flex-1 bg-transparent hover:bg-white/80 focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cards];
                            const pts = updated[i].points.filter((_: any, idx: number) => idx !== pIdx);
                            updated[i] = { ...updated[i], points: pts };
                            updateSectionData(section.id, { cards: updated });
                          }}
                          className="text-red-400 hover:text-red-600 text-xs px-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {!previewMode && (
                <div className="pt-1 flex items-center justify-between border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...cards];
                      const pts = [...(updated[i].points || []), 'New comparison point'];
                      updated[i] = { ...updated[i], points: pts };
                      updateSectionData(section.id, { cards: updated });
                    }}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    + Add Point
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. QUALIFICATIONS / EDUCATION TABLE (100% Inline Editable)
  function renderQualificationsTable(section: ResumeSectionBlock) {
    const data = section.data || {};
    const items: any[] = data.items || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Academic Qualifications'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-white rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { degree: 'Degree Name', division: '1st', percentage: '75%', board: 'Board / University', year: '2024' }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-[#2563eb] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#cbd5e1] shadow-2xs bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1e3a8a] text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="p-2.5 sm:p-3 border border-blue-900/40">Course / Degree</th>
                <th className="p-2.5 sm:p-3 border border-blue-900/40 text-center">Division</th>
                <th className="p-2.5 sm:p-3 border border-blue-900/40 text-center">Percentage / CGPA</th>
                <th className="p-2.5 sm:p-3 border border-blue-900/40">University / Board</th>
                <th className="p-2.5 sm:p-3 border border-blue-900/40 text-center">Year</th>
                {!previewMode && <th className="p-2 sm:p-2 border border-blue-900/40 text-center w-8"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {items.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/40 transition">
                  <td className="p-2 sm:p-2.5 font-bold text-slate-900 border-r border-slate-200">
                    {previewMode ? (
                      row.degree
                    ) : (
                      <input
                        type="text"
                        value={row.degree || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], degree: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="w-full bg-transparent font-bold text-slate-900 focus:outline-none focus:bg-blue-50/60 rounded px-1"
                      />
                    )}
                  </td>
                  <td className="p-2 sm:p-2.5 text-center border-r border-slate-200 font-semibold text-blue-700">
                    {previewMode ? (
                      row.division
                    ) : (
                      <input
                        type="text"
                        value={row.division || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], division: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="w-full bg-transparent text-center font-semibold text-blue-700 focus:outline-none focus:bg-blue-50/60 rounded px-1"
                      />
                    )}
                  </td>
                  <td className="p-2 sm:p-2.5 text-center font-bold text-emerald-700 border-r border-slate-200">
                    {previewMode ? (
                      row.percentage
                    ) : (
                      <input
                        type="text"
                        value={row.percentage || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], percentage: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="w-full bg-transparent text-center font-bold text-emerald-700 focus:outline-none focus:bg-blue-50/60 rounded px-1"
                      />
                    )}
                  </td>
                  <td className="p-2 sm:p-2.5 border-r border-slate-200">
                    {previewMode ? (
                      row.board || row.institute
                    ) : (
                      <input
                        type="text"
                        value={row.board || row.institute || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], board: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="w-full bg-transparent text-slate-700 focus:outline-none focus:bg-blue-50/60 rounded px-1"
                      />
                    )}
                  </td>
                  <td className="p-2 sm:p-2.5 text-center font-bold text-slate-600">
                    {previewMode ? (
                      row.year
                    ) : (
                      <input
                        type="text"
                        value={row.year || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], year: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="w-full bg-transparent text-center font-bold text-slate-600 focus:outline-none focus:bg-blue-50/60 rounded px-1"
                      />
                    )}
                  </td>
                  {!previewMode && (
                    <td className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = items.filter((_, idx) => idx !== i);
                          updateSectionData(section.id, { items: updated });
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete Degree"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 6. PROFESSIONAL EXPERIENCE TIMELINE (100% Inline Editable)
  function renderExperienceTimeline(section: ResumeSectionBlock) {
    const data = section.data || {};
    const items: any[] = data.items || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Teaching & Professional Experience'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-blue-50/50 rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { role: 'Faculty / Specialist', institution: 'School / Institute Name', tenure: '2024 - Present', details: ['Lead hands-on science activities.'] }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-[#2563eb] hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          )}
        </div>

        <div className="space-y-6 pl-2 border-l-2 border-blue-500">
          {items.map((item, i) => (
            <div key={i} className="relative pl-5 sm:pl-6 space-y-1.5 group">
              <div className="absolute -left-[29px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#2563eb] border-2 border-white shadow-2xs" />
              
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                {previewMode ? (
                  <h4 className="text-xs sm:text-sm font-bold text-[#0f172a]">
                    {item.institution} — <span className="text-blue-700 font-semibold">{item.role}</span>
                  </h4>
                ) : (
                  <div className="flex flex-wrap items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={item.institution || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], institution: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="School / Organization"
                      className="text-xs sm:text-sm font-bold text-[#0f172a] bg-transparent focus:bg-blue-50/60 border border-transparent focus:border-blue-300 rounded px-1 focus:outline-none"
                    />
                    <span className="text-slate-400">—</span>
                    <input
                      type="text"
                      value={item.role || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], role: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Role Designation"
                      className="text-xs sm:text-sm font-semibold text-blue-700 bg-transparent focus:bg-blue-50/60 border border-transparent focus:border-blue-300 rounded px-1 focus:outline-none"
                    />
                  </div>
                )}

                {previewMode ? (
                  <span className="bg-[#e2e8f0] text-[#334155] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {item.tenure}
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={item.tenure || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], tenure: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Tenure (e.g. 2021 - Present)"
                      className="bg-[#e2e8f0] text-[#334155] text-[10px] font-bold px-2 py-0.5 rounded-full border-none focus:outline-none text-center w-28"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = items.filter((_, idx) => idx !== i);
                        updateSectionData(section.id, { items: updated });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <ul className="text-xs text-[#475569] space-y-1 pt-1.5">
                {(Array.isArray(item.details) ? item.details : [item.details]).map((d: string, dIdx: number) => (
                  <li key={dIdx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-[#2563eb] font-bold flex-shrink-0">•</span>
                    {previewMode ? (
                      <span>{d}</span>
                    ) : (
                      <div className="flex-1 flex items-center gap-1">
                        <textarea
                          rows={2}
                          value={d || ''}
                          onChange={(e) => {
                            const updated = [...items];
                            const currentDetails = Array.isArray(updated[i].details) ? [...updated[i].details] : [updated[i].details];
                            currentDetails[dIdx] = e.target.value;
                            updated[i] = { ...updated[i], details: currentDetails };
                            updateSectionData(section.id, { items: updated });
                          }}
                          className="flex-1 text-xs text-[#475569] bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-slate-300 rounded p-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...items];
                            const currentDetails = (Array.isArray(updated[i].details) ? updated[i].details : [updated[i].details]).filter((_: any, idx: number) => idx !== dIdx);
                            updated[i] = { ...updated[i], details: currentDetails };
                            updateSectionData(section.id, { items: updated });
                          }}
                          className="text-red-400 hover:text-red-600 text-xs px-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {!previewMode && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...items];
                      const currentDetails = Array.isArray(updated[i].details) ? [...updated[i].details, 'New milestone accomplishment'] : [updated[i].details, 'New milestone accomplishment'];
                      updated[i] = { ...updated[i], details: currentDetails };
                      updateSectionData(section.id, { items: updated });
                    }}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    + Add Bullet Point
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. NATIONAL CERTIFICATIONS BOX (100% Inline Editable)
  function renderCertificationsBox(section: ResumeSectionBlock) {
    const data = section.data || {};
    const items: any[] = data.items || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#16a34a]" />
            {previewMode ? (
              <span>{data.heading || 'National Certifications & Accreditations'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-white rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { name: 'Certification Name', score: 'Qualified', regNo: 'Reg #', year: '2024' }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-emerald-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.map((c, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border-l-4 border-[#16a34a] border-y border-r border-slate-200 shadow-2xs space-y-1.5 relative group"
            >
              {previewMode ? (
                <>
                  <h4 className="text-xs font-bold text-[#0f172a] leading-snug">{c.name}</h4>
                  <p className="text-[11px] font-semibold text-[#16a34a] flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{c.score || 'Qualified'}</span>
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                    <span>{c.regNo}</span>
                    <span className="font-bold text-slate-700">{c.year}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={c.name || ''}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], name: e.target.value };
                      updateSectionData(section.id, { items: updated });
                    }}
                    placeholder="Exam / Certification Name"
                    className="text-xs font-bold text-[#0f172a] bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 py-0.5 w-full focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={c.score || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], score: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Status / Score"
                      className="text-[11px] font-semibold text-[#16a34a] bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 w-full focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <input
                      type="text"
                      value={c.regNo || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], regNo: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Reg / Roll Number"
                      className="text-[10px] text-slate-500 bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 flex-1 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={c.year || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], year: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Year"
                      className="text-[10px] font-bold text-slate-700 bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 w-16 text-right focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = items.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { items: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-red-400 hover:text-red-600"
                    title="Remove Certification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. SKILLS TAGS (100% Inline Editable)
  function renderSkillsTags(section: ResumeSectionBlock) {
    const data = section.data || {};
    const tags: string[] = data.tags || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Core Competencies & Skills'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-white rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...tags, 'New Skill / Competency'];
                updateSectionData(section.id, { tags: updated });
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="bg-white text-[#1e293b] border border-[#cbd5e1] text-xs font-medium px-3 py-2 rounded-xl shadow-2xs flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
              {previewMode ? (
                <span className="flex-1">{tag}</span>
              ) : (
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="text"
                    value={tag || ''}
                    onChange={(e) => {
                      const updated = [...tags];
                      updated[i] = e.target.value;
                      updateSectionData(section.id, { tags: updated });
                    }}
                    className="flex-1 bg-transparent focus:bg-blue-50/50 border border-transparent focus:border-blue-300 rounded px-1 text-xs text-slate-800 font-medium focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = tags.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { tags: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. AREAS OF EXPERTISE (100% Inline Editable - Matches Screenshot!)
  function renderAreasOfExpertise(section: ResumeSectionBlock) {
    const data = section.data || {};
    const cards: any[] = data.cards || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-4 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Areas of Expertise'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-blue-50/50 rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...cards, { title: 'New Expertise Domain', points: ['Add description point.'] }];
                updateSectionData(section.id, { cards: updated });
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expertise Card</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                {previewMode ? (
                  <h4 className="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{card.title}</span>
                  </h4>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => {
                        const updated = [...cards];
                        updated[i] = { ...updated[i], title: e.target.value };
                        updateSectionData(section.id, { cards: updated });
                      }}
                      placeholder="Card Title"
                      className="flex-1 text-xs sm:text-sm font-bold text-blue-900 bg-transparent focus:bg-white border border-transparent focus:border-blue-300 rounded px-1.5 py-0.5 focus:outline-none"
                    />
                  </div>
                )}
                {!previewMode && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = cards.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { cards: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                    title="Delete Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <ul className="text-xs text-slate-700 space-y-1.5 pl-2">
                {(card.points || []).map((pt: string, pIdx: number) => (
                  <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    {previewMode ? (
                      <span className="flex-1">{pt}</span>
                    ) : (
                      <div className="flex-1 flex items-start gap-1">
                        <textarea
                          rows={2}
                          value={pt || ''}
                          onChange={(e) => {
                            const updated = [...cards];
                            const pts = [...(updated[i].points || [])];
                            pts[pIdx] = e.target.value;
                            updated[i] = { ...updated[i], points: pts };
                            updateSectionData(section.id, { cards: updated });
                          }}
                          placeholder="Point details..."
                          className="flex-1 text-xs text-slate-700 bg-transparent hover:bg-white/80 focus:bg-white border border-transparent focus:border-slate-300 rounded p-1 leading-relaxed focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cards];
                            const pts = updated[i].points.filter((_: any, idx: number) => idx !== pIdx);
                            updated[i] = { ...updated[i], points: pts };
                            updateSectionData(section.id, { cards: updated });
                          }}
                          className="text-red-400 hover:text-red-600 text-xs px-1 mt-1"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {!previewMode && (
                <div className="pt-1 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...cards];
                      const pts = [...(updated[i].points || []), 'New description point'];
                      updated[i] = { ...updated[i], points: pts };
                      updateSectionData(section.id, { cards: updated });
                    }}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    + Add Point
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. KEY ACHIEVEMENTS (100% Inline Editable)
  function renderKeyAchievements(section: ResumeSectionBlock) {
    const data = section.data || {};
    const points: string[] = data.points || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            {previewMode ? (
              <span>{data.heading || 'Key Achievements'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-white rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...points, 'New standout professional achievement milestone'];
                updateSectionData(section.id, { points: updated });
              }}
              className="text-xs text-amber-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {points.map((pt, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 border-l-4 border-amber-500 border-y border-r border-slate-200 shadow-2xs flex items-start gap-2.5 text-xs text-slate-800 group"
            >
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              {previewMode ? (
                <span className="leading-relaxed font-medium flex-1">{pt}</span>
              ) : (
                <div className="flex-1 flex items-start gap-1">
                  <textarea
                    rows={2}
                    value={pt || ''}
                    onChange={(e) => {
                      const updated = [...points];
                      updated[i] = e.target.value;
                      updateSectionData(section.id, { points: updated });
                    }}
                    className="flex-1 text-xs text-slate-800 font-medium bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-slate-300 rounded p-1 leading-relaxed focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = points.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { points: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 11. PERSONAL DETAILS & DECLARATION (100% Inline Editable)
  function renderPersonalDetails(section: ResumeSectionBlock) {
    const data = section.data || {};

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-5 bg-white border-t border-slate-100">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2 border-b border-[#e2e8f0] pb-2 mb-3">
            <User className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Personal Details'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-blue-50/50 rounded px-1 -mx-1"
              />
            )}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 w-32">Date of Birth:</span>
              {previewMode ? (
                <span className="text-slate-900 font-semibold">{data.dateOfBirth || '04-11-1995'}</span>
              ) : (
                <input
                  type="text"
                  value={data.dateOfBirth || ''}
                  onChange={(e) => updateSectionData(section.id, { dateOfBirth: e.target.value })}
                  placeholder="04-11-1995"
                  className="bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 py-0.5 text-slate-900 font-semibold flex-1 focus:outline-none"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 w-32">Father's Name:</span>
              {previewMode ? (
                <span className="text-slate-900 font-semibold">{data.fatherName || 'Shree Rajkumar'}</span>
              ) : (
                <input
                  type="text"
                  value={data.fatherName || ''}
                  onChange={(e) => updateSectionData(section.id, { fatherName: e.target.value })}
                  placeholder="Father's Name"
                  className="bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 py-0.5 text-slate-900 font-semibold flex-1 focus:outline-none"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 w-32">Nationality:</span>
              {previewMode ? (
                <span className="text-slate-900 font-semibold">{data.nationality || 'Indian'}</span>
              ) : (
                <input
                  type="text"
                  value={data.nationality || ''}
                  onChange={(e) => updateSectionData(section.id, { nationality: e.target.value })}
                  placeholder="Indian"
                  className="bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 py-0.5 text-slate-900 font-semibold flex-1 focus:outline-none"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 w-32">Languages Known:</span>
              {previewMode ? (
                <span className="text-slate-900 font-semibold">{data.languagesKnown || 'Hindi & English'}</span>
              ) : (
                <input
                  type="text"
                  value={data.languagesKnown || ''}
                  onChange={(e) => updateSectionData(section.id, { languagesKnown: e.target.value })}
                  placeholder="Hindi, English"
                  className="bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 py-0.5 text-slate-900 font-semibold flex-1 focus:outline-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          {previewMode ? (
            <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1">
              {data.declarationHeading || 'Declaration'}
            </h4>
          ) : (
            <input
              type="text"
              value={data.declarationHeading || ''}
              onChange={(e) => updateSectionData(section.id, { declarationHeading: e.target.value })}
              placeholder="Declaration Heading"
              className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-slate-50 rounded px-1"
            />
          )}

          {previewMode ? (
            <p className="text-xs text-slate-600 italic">
              "{data.declarationText || 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'}"
            </p>
          ) : (
            <textarea
              rows={2}
              value={data.declarationText || ''}
              onChange={(e) => updateSectionData(section.id, { declarationText: e.target.value })}
              placeholder="Declaration statement..."
              className="text-xs text-slate-600 italic w-full p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
      </div>
    );
  }

  // 12. EXPERIMENTS RIG SECTION (100% Inline Editable)
  function renderExperimentsSection(section: ResumeSectionBlock) {
    const data = section.data || {};
    const items: any[] = data.items || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || 'Signature Demonstrations & Lab Rigs'}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Section Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-blue-50/50 rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { classLevel: 'Class IX-XII', title: 'Experiment Rig Name', apparatus: 'List apparatus', concept: 'Core concept' }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rig</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 relative group">
              <div className="flex items-center justify-between">
                {previewMode ? (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                    {item.classLevel}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={item.classLevel || ''}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], classLevel: e.target.value };
                      updateSectionData(section.id, { items: updated });
                    }}
                    placeholder="Class Level"
                    className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border-none focus:outline-none w-24 text-center"
                  />
                )}
                {!previewMode && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = items.filter((_, idx) => idx !== i);
                      updateSectionData(section.id, { items: updated });
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1"
                    title="Delete Experiment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {previewMode ? (
                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
              ) : (
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[i] = { ...updated[i], title: e.target.value };
                    updateSectionData(section.id, { items: updated });
                  }}
                  placeholder="Experiment Title"
                  className="text-xs font-bold text-slate-800 bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1.5 py-0.5 w-full focus:outline-none"
                />
              )}

              {previewMode ? (
                <p className="text-[11px] text-slate-600"><strong>Apparatus:</strong> {item.apparatus}</p>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <strong className="flex-shrink-0">Apparatus:</strong>
                  <input
                    type="text"
                    value={item.apparatus || ''}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], apparatus: e.target.value };
                      updateSectionData(section.id, { items: updated });
                    }}
                    placeholder="Apparatus details"
                    className="flex-1 bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 text-[11px] focus:outline-none"
                  />
                </div>
              )}

              {previewMode ? (
                <p className="text-[11px] text-slate-600"><strong>Concept:</strong> {item.concept}</p>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <strong className="flex-shrink-0">Concept:</strong>
                  <input
                    type="text"
                    value={item.concept || ''}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], concept: e.target.value };
                      updateSectionData(section.id, { items: updated });
                    }}
                    placeholder="Physical principle"
                    className="flex-1 bg-transparent focus:bg-white border border-transparent focus:border-slate-300 rounded px-1 text-[11px] focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 13. DEMO VIDEOS (100% Inline Editable)
  function renderDemoVideos(section: ResumeSectionBlock) {
    const items: any[] = section.data?.items || [];
    const data = section.data || {};

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <Video className="w-4 h-4 text-[#ea4335]" />
            {previewMode ? (
              <span>{data.heading || `Demonstration Video Lectures (${items.length} Sessions)`}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Video Lectures Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-white rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { title: 'New Video Lecture', duration: '15:00', category: 'Physics', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-red-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Video</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {items.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition group relative"
            >
              <div
                onClick={() => setTestVideoUrl(v.url)}
                className="aspect-video bg-slate-900 flex items-center justify-center relative cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded">
                  {v.duration || 'Video'}
                </span>
              </div>
              <div className="p-2.5 sm:p-3 space-y-1">
                {previewMode ? (
                  <>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-1">
                      {v.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Category: {v.category || 'General'}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={v.title || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], title: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Video Title"
                      className="text-xs font-bold text-slate-800 bg-transparent focus:bg-slate-50 border border-transparent focus:border-slate-300 rounded px-1 w-full focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <input
                        type="text"
                        value={v.category || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], category: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        placeholder="Category"
                        className="bg-transparent border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={v.duration || ''}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], duration: e.target.value };
                          updateSectionData(section.id, { items: updated });
                        }}
                        placeholder="Duration (e.g. 12:45)"
                        className="bg-transparent border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={v.url || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], url: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="YouTube Embed URL"
                      className="text-[9px] font-mono text-slate-400 bg-transparent border border-slate-200 rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = items.filter((_, idx) => idx !== i);
                        updateSectionData(section.id, { items: updated });
                      }}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                    >
                      Delete Video
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 14. PHOTO GALLERY (100% Inline Editable)
  function renderPhotoGallery(section: ResumeSectionBlock) {
    const items: any[] = section.data?.items || [];
    const data = section.data || {};

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#2563eb]" />
            {previewMode ? (
              <span>{data.heading || `Workshop & Laboratory Photo Showcase (${items.length} Photos)`}</span>
            ) : (
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
                placeholder="Gallery Heading"
                className="font-bold text-[#0f172a] uppercase tracking-wider bg-transparent focus:outline-none focus:bg-slate-50 rounded px-1 -mx-1"
              />
            )}
          </h3>
          {!previewMode && (
            <button
              type="button"
              onClick={() => {
                const updated = [...items, { title: 'New Lab Showcase', subtitle: 'Hands-on Activity', url: '/images/dev-sharma.jpg' }];
                updateSectionData(section.id, { items: updated });
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {items.map((img, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition group relative"
            >
              <div
                onClick={() => setTestImageUrl(img.url)}
                className="aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-2.5 sm:p-3 bg-white space-y-1">
                {previewMode ? (
                  <>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                      {img.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{img.subtitle}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={img.title || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], title: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Photo Title"
                      className="text-xs font-bold text-slate-800 bg-transparent focus:bg-slate-50 border border-transparent focus:border-slate-300 rounded px-1 w-full focus:outline-none"
                    />
                    <input
                      type="text"
                      value={img.subtitle || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], subtitle: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Subtitle / Location"
                      className="text-[10px] text-slate-500 bg-transparent focus:bg-slate-50 border border-transparent focus:border-slate-300 rounded px-1 w-full focus:outline-none"
                    />
                    <input
                      type="text"
                      value={img.url || ''}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], url: e.target.value };
                        updateSectionData(section.id, { items: updated });
                      }}
                      placeholder="Image URL"
                      className="text-[9px] font-mono text-slate-400 bg-transparent border border-slate-200 rounded px-1 py-0.5 w-full focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = items.filter((_, idx) => idx !== i);
                        updateSectionData(section.id, { items: updated });
                      }}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                    >
                      Delete Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15. CUSTOM RICHTEXT BLOCK (100% Inline Editable)
  function renderCustomRichtext(section: ResumeSectionBlock) {
    const data = section.data || {};

    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-3 bg-white border-t border-slate-100">
        {previewMode ? (
          <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            {data.heading || 'Custom Section'}
          </h3>
        ) : (
          <input
            type="text"
            value={data.heading || ''}
            onChange={(e) => updateSectionData(section.id, { heading: e.target.value })}
            placeholder="Section Heading"
            className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider border-b border-[#e2e8f0] pb-1 w-full focus:outline-none focus:border-blue-500 bg-transparent"
          />
        )}

        {previewMode ? (
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {section.style?.dropCap && data.content ? (
              <p>
                <span className="float-left text-2xl sm:text-3xl font-extrabold text-blue-600 mr-2 leading-none mt-1">
                  {data.content[0]}
                </span>
                {data.content.slice(1)}
              </p>
            ) : (
              <p>{data.content || ''}</p>
            )}
          </div>
        ) : (
          <textarea
            rows={4}
            value={data.content || ''}
            onChange={(e) => updateSectionData(section.id, { content: e.target.value })}
            placeholder="Enter custom content text, achievements, or announcements..."
            className="text-xs text-slate-700 leading-relaxed w-full p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-500"
          />
        )}
      </div>
    );
  }
}
