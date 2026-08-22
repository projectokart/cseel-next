import { NextRequest, NextResponse } from 'next/server';

export interface NavItemConfig {
  id: string;
  label: string;
  route: string;
  enabled: boolean;
  isSpecial?: boolean;
  children?: {
    id: string;
    label: string;
    route: string;
    enabled: boolean;
  }[];
}

export const DEFAULT_NAV_SETTINGS: NavItemConfig[] = [
  {
    id: 'library',
    label: 'Library',
    route: '/hands-on-experiments',
    enabled: true,
    children: [
      { id: 'library-experiments', label: 'Hands-on Experiments', route: '/hands-on-experiments', enabled: true },
      { id: 'library-simulations', label: 'Virtual Simulations', route: '/demo', enabled: true },
      { id: 'library-projects', label: 'Projectokart Inventions', route: '/projects', enabled: true },
    ],
  },
  {
    id: 'edu-network',
    label: 'EduNetwork',
    route: '/edu-network',
    enabled: true,
    isSpecial: true,
    children: [
      { id: 'edu-schools', label: 'Schools & Institutions', route: '/edu-network', enabled: true },
      { id: 'edu-jobs', label: 'Teaching & Lab Jobs', route: '/edu-network/jobs', enabled: true },
      { id: 'edu-teachers', label: 'Verified Faculty', route: '/edu-network/teachers', enabled: true },
      { id: 'edu-students', label: 'Student Innovators', route: '/edu-network/students', enabled: true },
    ],
  },
  {
    id: 'programs',
    label: 'Programs',
    route: '/teacher-training',
    enabled: true,
    children: [
      { id: 'prog-training', label: 'Teacher Training', route: '/teacher-training', enabled: true },
      { id: 'prog-workshops', label: 'Workshops & Bootcamps', route: '/workshops', enabled: true },
      { id: 'prog-research', label: 'Research Programs', route: '/research', enabled: true },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    route: '/events',
    enabled: true,
    children: [
      { id: 'event-upcoming', label: 'Upcoming Events', route: '/events/upcoming', enabled: true },
      { id: 'event-seminars', label: 'Seminars & Webinars', route: '/seminars', enabled: true },
      { id: 'event-past', label: 'Past Events', route: '/events/past', enabled: true },
      { id: 'event-exhibitions', label: 'Exhibitions & Fairs', route: '/exhibitions', enabled: true },
    ],
  },
  {
    id: 'why-cseel',
    label: 'Why CSEEL',
    route: '/why-cseel',
    enabled: true,
    children: [
      { id: 'why-main', label: 'Why CSEEL Overview', route: '/why-cseel', enabled: true },
      { id: 'why-students', label: 'For Students', route: '/for-students', enabled: true },
      { id: 'why-educators', label: 'For Educators', route: '/for-educators', enabled: true },
      { id: 'why-institutions', label: 'For Institutions', route: '/for-institutions', enabled: true },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    route: '/materials',
    enabled: true,
    children: [
      { id: 'res-materials', label: 'Lab Materials & Kits', route: '/materials', enabled: true },
      { id: 'res-blog', label: 'Science Blog & NEP 2020', route: '/blog', enabled: true },
      { id: 'res-safety', label: 'Lab Safety & Manuals', route: '/safety', enabled: true },
      { id: 'res-media', label: 'Media Archive', route: '/media-archive', enabled: true },
      { id: 'res-help', label: 'Help Center & FAQs', route: '/help', enabled: true },
    ],
  },
  {
    id: 'about',
    label: 'About',
    route: '/our-story',
    enabled: true,
    children: [
      { id: 'about-story', label: 'Our Story', route: '/our-story', enabled: true },
      { id: 'about-team', label: 'Leadership & Team', route: '/team', enabled: true },
      { id: 'about-careers', label: 'Careers & Vacancies', route: '/careers', enabled: true },
      { id: 'about-contact', label: 'Contact Us', route: '/contact-us', enabled: true },
    ],
  },
];

let IN_MEMORY_NAV_SETTINGS = JSON.parse(JSON.stringify(DEFAULT_NAV_SETTINGS));

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: IN_MEMORY_NAV_SETTINGS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body && Array.isArray(body.settings)) {
      IN_MEMORY_NAV_SETTINGS = body.settings;
      return NextResponse.json({ success: true, settings: IN_MEMORY_NAV_SETTINGS });
    }
    return NextResponse.json({ success: false, error: 'Invalid settings payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
