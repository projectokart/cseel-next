'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ArrowLeft,
  X,
  Printer,
  Sparkles,
  MoreVertical,
  Copy,
  Edit3,
  Trash2,
  Plus,
  Clock,
  AlertCircle,
  Check,
  ChevronRight,
  Layers,
  Search,
  BookOpen,
  Users,
  CheckSquare,
  SlidersHorizontal,
  Flame,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_ORGANIZATIONS, slugify } from '@/lib/eduNetworkData';
import { CORE_TEACHING_SUBJECTS } from '@/data/indiaLocations';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ManagedJobItem {
  id: string;
  title: string;
  category: 'teaching' | 'non-teaching';
  level: string; // PGT, TGT, PRT, NTT, Staff, Coordinator, etc.
  subject: string; // Physics, Mathematics, Science, Accounts, etc.
  department?: string;
  salary: string;
  roleType: 'Full-Time' | 'Part-Time' | 'Visiting Faculty';
  experience: string;
  openings: number;
  board?: string;
  description: string;
  schoolName: string;
  schoolLogo?: string;
  city: string;
  state: string;
  status: 'active' | 'inactive';
  activatedAt?: string;
  activeUntil?: string; // ISO date string
  validityDays?: number; // e.g. 15
  createdAt: string;
}

// Pre-built Template Definition
interface JobTemplate {
  id: string;
  category: 'teaching' | 'non-teaching';
  level: string;
  defaultTitle: string;
  availableSubjects: string[];
  defaultSubject: string;
  experience: string;
  salary: string;
  roleType: 'Full-Time' | 'Part-Time' | 'Visiting Faculty';
  openings: number;
  description: string;
  badge: string;
}

const PREBUILT_TEMPLATES: JobTemplate[] = [
  // ── Teaching Templates (Configurable Subject) ──────────────────────────────
  {
    id: 'tmpl-pgt',
    category: 'teaching',
    level: 'PGT',
    defaultTitle: 'PGT Senior Secondary Faculty',
    availableSubjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science / IP', 'English Core', 'Accountancy', 'Economics', 'Business Studies', 'History', 'Political Science'],
    defaultSubject: 'Physics',
    experience: '3-5 Years',
    salary: '₹55,000 - ₹85,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Senior Wing (XI-XII)',
    description: '<h3>Role Overview</h3><p>Deliver senior secondary curriculum with emphasis on conceptual clarity, board practicals, and competitive exam preparation (NEET/JEE/CUET).</p><ol><li>Conduct comprehensive laboratory practicals, optical bench experiments, and viva preparations.</li><li>Design periodic assessments aligned with CBSE board pattern.</li><li>Mentor students for national STEM olympiads and science exhibitions.</li></ol>'
  },
  {
    id: 'tmpl-tgt',
    category: 'teaching',
    level: 'TGT',
    defaultTitle: 'TGT High School Teacher',
    availableSubjects: ['Science (Physics/Chem/Bio)', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Robotics & AI', 'Computer Science', 'Sanskrit'],
    defaultSubject: 'Science (Physics/Chem/Bio)',
    experience: '2-4 Years',
    salary: '₹38,000 - ₹55,000 / mo',
    roleType: 'Full-Time',
    openings: 2,
    badge: 'Middle Wing (VI-X)',
    description: '<h3>Role Overview</h3><p>Drive active experiential learning and foundational subject mastery across classes 6 to 10 in accordance with NEP 2020 guidelines.</p><ol><li>Integrate laboratory demonstrations and hands-on activities into daily lesson plans.</li><li>Conduct continuous comprehensive evaluation (CCE) and remedial learning support.</li><li>Facilitate inter-school academic competitions and science fairs.</li></ol>'
  },
  {
    id: 'tmpl-prt',
    category: 'teaching',
    level: 'PRT',
    defaultTitle: 'PRT Primary Educator',
    availableSubjects: ['All Primary Subjects', 'Mathematics & EVS', 'English & Phonics', 'Hindi', 'General Science', 'Computer Literacy'],
    defaultSubject: 'All Primary Subjects',
    experience: '1-3 Years',
    salary: '₹28,000 - ₹40,000 / mo',
    roleType: 'Full-Time',
    openings: 2,
    badge: 'Primary Wing (I-V)',
    description: '<h3>Role Overview</h3><p>Engage primary students through activity-based learning, inquiry games, storytelling, and structured numeracy & literacy routines.</p><ol><li>Implement play-way experiential teaching methodologies.</li><li>Maintain child-centric portfolios and holistic development report cards.</li><li>Foster positive classroom culture and parental communication.</li></ol>'
  },
  {
    id: 'tmpl-ntt',
    category: 'teaching',
    level: 'Pre-Primary (NTT)',
    defaultTitle: 'Pre-Primary / Nursery Educator',
    availableSubjects: ['Early Childhood Care & EYFS', 'Montessori & Sensory Play', 'Phonics & Rhymes', 'Kindergarten Readiness'],
    defaultSubject: 'Early Childhood Care & EYFS',
    experience: '1-3 Years',
    salary: '₹22,000 - ₹32,000 / mo',
    roleType: 'Full-Time',
    openings: 2,
    badge: 'Foundational Stage',
    description: '<h3>Role Overview</h3><p>Lead kindergarten and nursery learning corners, sensory play activities, fine motor coordination, and foundational language development.</p><ol><li>Create joyful, stimulating thematic learning spaces.</li><li>Conduct daily rhyme, circle time, and sensory motor activities.</li><li>Ensure warm, secure, and affectionate pastoral care for early learners.</li></ol>'
  },
  {
    id: 'tmpl-pti',
    category: 'teaching',
    level: 'Physical Education (PTI)',
    defaultTitle: 'Activity & Sports Instructor',
    availableSubjects: ['Physical Education', 'Yoga & Wellness', 'Cricket & Football', 'Basketball & Athletics', 'Martial Arts / Taekwondo'],
    defaultSubject: 'Physical Education',
    experience: '2-5 Years',
    salary: '₹30,000 - ₹45,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Sports & Wellness',
    description: '<h3>Role Overview</h3><p>Manage campus sports infrastructure, morning physical drills, inter-school tournaments, and sports day celebrations.</p><ol><li>Train student cohorts in athletic agility, sportsmanship, and physical fitness.</li><li>Organize annual athletic meets and CBSE zonal tournaments.</li><li>Ensure first-aid safety protocols on the sports field.</li></ol>'
  },
  {
    id: 'tmpl-hod',
    category: 'teaching',
    level: 'Academic Coordinator',
    defaultTitle: 'Head of Department / Wing Incharge',
    availableSubjects: ['Science & STEM Stream', 'Mathematics Department', 'Humanities & Social Sciences', 'Primary Wing Incharge', 'Senior Secondary Academic Head'],
    defaultSubject: 'Science & STEM Stream',
    experience: '5-8 Years',
    salary: '₹65,000 - ₹95,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Leadership & HOD',
    description: '<h3>Role Overview</h3><p>Supervise departmental curriculum delivery, teacher lesson plans, CBSE affiliation audit readiness, and academic timetable management.</p><ol><li>Conduct classroom pedagogical audits and teacher masterclasses.</li><li>Monitor periodic test outcomes and implement student remediation strategies.</li><li>Liaise between school management, parents, and board inspection teams.</li></ol>'
  },

  // ── Non-Teaching Templates (Configurable Department / Specialization) ───────
  {
    id: 'tmpl-lab',
    category: 'non-teaching',
    level: 'Lab Assistant',
    defaultTitle: 'Composite Science & Lab Incharge',
    availableSubjects: ['Physics, Chemistry & Biology Labs', 'Atal Tinkering Lab (ATL & Robotics)', 'Computer Science & ICT Lab', 'General Science Lab'],
    defaultSubject: 'Physics, Chemistry & Biology Labs',
    experience: '1-3 Years',
    salary: '₹22,000 - ₹35,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Laboratory & Practical',
    description: '<h3>Role Overview</h3><p>Prepare chemical reagents, manage apparatus setups for board practicals, maintain laboratory equipment logs, and enforce lab safety protocols.</p><ol><li>Set up apparatus benches before student practical slots.</li><li>Maintain chemicals inventory, glassware stock, and hazardous waste disposal.</li><li>Assist teachers during board viva practical exams and ATL maker projects.</li></ol>'
  },
  {
    id: 'tmpl-accountant',
    category: 'non-teaching',
    level: 'Accountant',
    defaultTitle: 'School Accountant & Fee Controller',
    availableSubjects: ['School Fee Collection & Tally', 'Payroll & EPF Administration', 'Auditing & Vendor Billing', 'General Accounts'],
    defaultSubject: 'School Fee Collection & Tally',
    experience: '2-5 Years',
    salary: '₹28,000 - ₹42,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Finance & Accounts',
    description: '<h3>Role Overview</h3><p>Manage daily school fee collections, ERP entries, bank reconciliations, vendor invoices, and staff monthly payroll administration.</p><ol><li>Operate school ERP software and Tally Prime for fee receipts and dues tracking.</li><li>Generate monthly income-expenditure statements and audit schedules.</li><li>Handle parent fee queries and bank transfer reconciliation.</li></ol>'
  },
  {
    id: 'tmpl-librarian',
    category: 'non-teaching',
    level: 'Librarian',
    defaultTitle: 'Chief Librarian & Digital Media Lead',
    availableSubjects: ['Library Science & Digital Cataloging', 'Reading Club & Student Literacy', 'E-Library & Journal Subscriptions'],
    defaultSubject: 'Library Science & Digital Cataloging',
    experience: '2-4 Years',
    salary: '₹25,000 - ₹38,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Library & Media',
    description: '<h3>Role Overview</h3><p>Catalog reference books, manage circulation software, oversee student reading programs, and maintain quiet, resourceful library ambiance.</p><ol><li>Manage book accession register and barcode circulation system.</li><li>Coordinate annual book fairs and national library week celebrations.</li><li>Curate NEP-aligned experiential reading corners and competitive exam journals.</li></ol>'
  },
  {
    id: 'tmpl-counselor',
    category: 'non-teaching',
    level: 'Counselor',
    defaultTitle: 'Admission Counselor & PRO',
    availableSubjects: ['Admissions & Parent Relations', 'Student Career Guidance', 'Special Educator & Child Psychologist'],
    defaultSubject: 'Admissions & Parent Relations',
    experience: '2-4 Years',
    salary: '₹30,000 - ₹45,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Front Office & Admissions',
    description: '<h3>Role Overview</h3><p>Lead prospective parent walkthroughs, explain school curriculum and experiential labs, and drive new student enrollment conversions.</p><ol><li>Handle telephonic and walk-in parent admission inquiries.</li><li>Conduct campus lab walkthroughs and showcase academic highlights.</li><li>Maintain CRM admission pipeline logs and follow-up schedules.</li></ol>'
  },
  {
    id: 'tmpl-receptionist',
    category: 'non-teaching',
    level: 'Front Desk',
    defaultTitle: 'Front Desk Executive & Receptionist',
    availableSubjects: ['Visitor Management & EPABX', 'Administrative Assistance', 'Parent Helpdesk'],
    defaultSubject: 'Visitor Management & EPABX',
    experience: '1-3 Years',
    salary: '₹18,000 - ₹28,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Administration',
    description: '<h3>Role Overview</h3><p>Warmly greet campus visitors, manage EPABX telephone calls, maintain visitor entry registers, and direct inquiries to respective departments.</p><ol><li>Operate digital visitor management kiosk and security passes.</li><li>Coordinate appointments for Principal and academic coordinators.</li><li>Manage incoming/outgoing courier logs and general administrative notices.</li></ol>'
  },
  {
    id: 'tmpl-nurse',
    category: 'non-teaching',
    level: 'School Nurse',
    defaultTitle: 'Campus Nurse & Health Attendant',
    availableSubjects: ['Student Infirmary & First Aid', 'Annual Health Screenings', 'Emergency Care & Hygiene Audit'],
    defaultSubject: 'Student Infirmary & First Aid',
    experience: '1-3 Years',
    salary: '₹22,000 - ₹32,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Health & Wellness',
    description: '<h3>Role Overview</h3><p>Supervise school medical room, deliver immediate first aid care, maintain student medical files, and coordinate annual health check-up camps.</p><ol><li>Administer emergency first aid for sports injuries and acute ailments.</li><li>Maintain medication logs and emergency parent contact protocols.</li><li>Conduct periodic campus sanitation and canteen hygiene checks.</li></ol>'
  },
  {
    id: 'tmpl-transport',
    category: 'non-teaching',
    level: 'Transport Supervisor',
    defaultTitle: 'Transport Manager & Safety Incharge',
    availableSubjects: ['Bus Fleet Operations & GPS Tracking', 'Route Planning & Driver Compliance', 'Campus Security & Gate Safety'],
    defaultSubject: 'Bus Fleet Operations & GPS Tracking',
    experience: '3-6 Years',
    salary: '₹26,000 - ₹38,000 / mo',
    roleType: 'Full-Time',
    openings: 1,
    badge: 'Operations & Fleet',
    description: '<h3>Role Overview</h3><p>Oversee school bus route schedules, GPS tracking compliance, driver verification, RTO road safety fitness, and student dispersal safety.</p><ol><li>Plan optimized bus routes and manage bus attendant duty rosters.</li><li>Ensure 100% compliance with Supreme Court school transport safety norms.</li><li>Liaise with parent transport inquiries and bus tracking app updates.</li></ol>'
  }
];

// Pre-seeded initial jobs so dashboard looks alive immediately
const INITIAL_DEMO_JOBS: ManagedJobItem[] = [
  {
    id: 'job-seed-1',
    title: 'Senior IB DP & CBSE Physics Practical Lead',
    category: 'teaching',
    level: 'PGT',
    subject: 'Physics',
    salary: '₹60,000 - ₹95,000 / mo',
    roleType: 'Full-Time',
    experience: '3-6 Years',
    openings: 1,
    board: 'CBSE',
    schoolName: 'Delhi Public School',
    schoolLogo: '/images/default-school-placeholder.png',
    city: 'Rewari',
    state: 'Haryana',
    status: 'active',
    validityDays: 15,
    activatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    activeUntil: new Date(Date.now() + 12 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: '<h3>Role Overview</h3><p>Lead senior secondary experimental science practicals, design student research inquiry prototypes, and oversee hands-on physics laboratory sessions.</p><ol><li>Design and execute experiential physics practical lesson plans.</li><li>Supervise optical bench and laser experimental setups.</li><li>Mentor students for National STEM Conclaves.</li></ol>'
  },
  {
    id: 'job-seed-2',
    title: 'Middle School Mathematics & STEM Mentor',
    category: 'teaching',
    level: 'TGT',
    subject: 'Mathematics',
    salary: '₹42,000 - ₹60,000 / mo',
    roleType: 'Full-Time',
    experience: '2-5 Years',
    openings: 2,
    board: 'CBSE',
    schoolName: 'Delhi Public School',
    schoolLogo: '/images/default-school-placeholder.png',
    city: 'Rewari',
    state: 'Haryana',
    status: 'active',
    validityDays: 15,
    activatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    activeUntil: new Date(Date.now() + 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    description: '<h3>Role Overview</h3><p>Inspire middle school students through visual geometry, Vedic math shortcuts, hands-on math lab manipulatives, and problem-solving puzzles.</p>'
  },
  {
    id: 'job-seed-3',
    title: 'Composite Science & Atal Tinkering Lab Incharge',
    category: 'non-teaching',
    level: 'Lab Assistant',
    subject: 'Physics, Chemistry & Biology Labs',
    department: 'Laboratory & STEM',
    salary: '₹28,000 - ₹38,000 / mo',
    roleType: 'Full-Time',
    experience: '1-3 Years',
    openings: 1,
    schoolName: 'Delhi Public School',
    schoolLogo: '/images/default-school-placeholder.png',
    city: 'Rewari',
    state: 'Haryana',
    status: 'inactive',
    validityDays: 15,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    description: '<h3>Role Overview</h3><p>Manage chemistry reagents, physics optical benches, biology specimen jars, and student practical setups.</p>'
  }
];

export default function ManageJobsClient() {
  const router = useRouter();
  const { user } = useAuth();

  // ── School Info Detection ──────────────────────────────────────────────────
  const meta = (user?.user_metadata || {}) as Record<string, any>;
  const schoolName = meta.org_name || meta.school_name || meta.institutionName || 'Delhi Public School';
  const schoolLogo = meta.logo || '/images/default-school-placeholder.png';
  const schoolCity = meta.city || meta.district || 'Rewari';
  const schoolState = meta.state || 'Haryana';

  // ── Jobs State ─────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<ManagedJobItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load jobs from localStorage or fallback to seeded items
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('cseel_school_managed_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          return;
        }
      }
      // If nothing found, check cseel_custom_jobs
      const customStored = localStorage.getItem('cseel_custom_jobs');
      if (customStored) {
        const parsedCustom = JSON.parse(customStored);
        if (Array.isArray(parsedCustom) && parsedCustom.length > 0) {
          // Merge
          setJobs([...parsedCustom, ...INITIAL_DEMO_JOBS].slice(0, 30));
          return;
        }
      }
      setJobs(INITIAL_DEMO_JOBS);
    } catch (e) {
      setJobs(INITIAL_DEMO_JOBS);
    }
  }, []);

  // Save jobs on state changes
  const saveJobsToStorage = (updatedJobs: ManagedJobItem[]) => {
    setJobs(updatedJobs);
    try {
      localStorage.setItem('cseel_school_managed_jobs', JSON.stringify(updatedJobs));
      localStorage.setItem('cseel_custom_jobs', JSON.stringify(updatedJobs));
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Filters & Search ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'teaching' | 'non-teaching'>('all');

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && j.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = j.title?.toLowerCase().includes(q);
        const matchSubject = j.subject?.toLowerCase().includes(q);
        const matchLevel = j.level?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchLevel) return false;
      }
      return true;
    });
  }, [jobs, statusFilter, categoryFilter, searchQuery]);

  // ── 3-Dot Tools Menu State ─────────────────────────────────────────────────
  const [openMenuJobId, setOpenMenuJobId] = useState<string | null>(null);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleOutside = () => setOpenMenuJobId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  // ── Expiry Countdown Helper ────────────────────────────────────────────────
  const getJobExpiryDetails = (job: ManagedJobItem) => {
    if (job.status !== 'active' || !job.activeUntil) {
      return { isActive: false, label: 'Draft / Inactive', daysRemaining: 0 };
    }
    const dueTime = new Date(job.activeUntil).getTime();
    const now = Date.now();
    const diffMs = dueTime - now;
    if (diffMs <= 0) {
      return { isActive: false, isExpired: true, label: 'Expired (15 Days Over)', daysRemaining: 0 };
    }
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const formattedDue = new Date(job.activeUntil).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    return {
      isActive: true,
      label: `Active • ${days} days remaining (Due: ${formattedDue})`,
      daysRemaining: days,
      dueDate: formattedDue
    };
  };

  // ── Activation Modal (Due Date & 15-Day Auto Expiry) ────────────────────────
  const [activationModalJob, setActivationModalJob] = useState<ManagedJobItem | null>(null);
  const [customDays, setCustomDays] = useState<number>(15);
  const [customDueDate, setCustomDueDate] = useState<string>('');

  const openActivationModal = (job: ManagedJobItem) => {
    setActivationModalJob(job);
    setCustomDays(15);
    const futureDate = new Date(Date.now() + 15 * 86400000);
    setCustomDueDate(futureDate.toISOString().split('T')[0]);
  };

  const handleConfirmActivation = () => {
    if (!activationModalJob) return;
    const days = customDays > 0 ? customDays : 15;
    const now = new Date();
    const expiry = customDueDate
      ? new Date(customDueDate)
      : new Date(now.getTime() + days * 86400000);

    const updated = jobs.map(j => {
      if (j.id === activationModalJob.id) {
        return {
          ...j,
          status: 'active' as const,
          activatedAt: now.toISOString(),
          activeUntil: expiry.toISOString(),
          validityDays: days
        };
      }
      return j;
    });

    saveJobsToStorage(updated);
    setActivationModalJob(null);
    showToast(`Vacancy "${activationModalJob.title}" activated for ${days} days!`);
  };

  const handleToggleStatus = (job: ManagedJobItem) => {
    if (job.status === 'active') {
      // Deactivate immediately to draft
      const updated = jobs.map(j => {
        if (j.id === job.id) {
          return { ...j, status: 'inactive' as const, activeUntil: undefined };
        }
        return j;
      });
      saveJobsToStorage(updated);
      showToast(`Vacancy marked as Inactive/Draft.`);
    } else {
      // Open modal to set expiry date / 15 days default
      openActivationModal(job);
    }
  };

  // ── Duplicate Feature (Max 30 Limit) ───────────────────────────────────────
  const handleDuplicateJob = (job: ManagedJobItem) => {
    if (jobs.length >= 30) {
      alert('Limit Reached: Maximum 30 job cards can be stored. Please delete an older job to duplicate.');
      return;
    }

    const newJob: ManagedJobItem = {
      ...job,
      id: `job-dup-${Date.now()}`,
      title: `${job.title} (Copy)`,
      status: 'inactive', // newly duplicated is draft
      activatedAt: undefined,
      activeUntil: undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newJob, ...jobs];
    saveJobsToStorage(updated);
    showToast(`Duplicated "${job.title}". New draft added!`);
  };

  // ── Delete Feature ─────────────────────────────────────────────────────────
  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to remove this job vacancy?')) {
      const updated = jobs.filter(j => j.id !== id);
      saveJobsToStorage(updated);
      showToast('Vacancy deleted successfully.');
    }
  };

  // ── Edit Modal State ───────────────────────────────────────────────────────
  const [editingJob, setEditingJob] = useState<ManagedJobItem | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const updated = jobs.map(j => (j.id === editingJob.id ? editingJob : j));
    saveJobsToStorage(updated);
    setEditingJob(null);
    showToast(`Updated "${editingJob.title}".`);
  };

  // ── Side Sheet: Pre-built Templates ────────────────────────────────────────
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<'all' | 'teaching' | 'non-teaching'>('all');
  // State for user-selected subject inside each template card
  const [selectedTemplateSubjects, setSelectedTemplateSubjects] = useState<Record<string, string>>({});

  const handleSubjectChangeInTemplate = (templateId: string, subj: string) => {
    setSelectedTemplateSubjects(prev => ({
      ...prev,
      [templateId]: subj
    }));
  };

  const handleAddJobFromTemplate = (tmpl: JobTemplate) => {
    if (jobs.length >= 30) {
      alert('Limit Reached: Maximum 30 job cards can be stored. Please delete an older job to add new.');
      return;
    }

    const chosenSubject = selectedTemplateSubjects[tmpl.id] || tmpl.defaultSubject;
    const finalTitle = tmpl.category === 'teaching'
      ? `${tmpl.level} ${chosenSubject}`
      : `${tmpl.level} (${chosenSubject})`;

    const newJob: ManagedJobItem = {
      id: `job-tmpl-${Date.now()}`,
      title: finalTitle,
      category: tmpl.category,
      level: tmpl.level,
      subject: chosenSubject,
      department: tmpl.category === 'non-teaching' ? chosenSubject : undefined,
      salary: tmpl.salary,
      roleType: tmpl.roleType,
      experience: tmpl.experience,
      openings: tmpl.openings,
      board: tmpl.category === 'teaching' ? 'CBSE' : undefined,
      schoolName: schoolName,
      schoolLogo: schoolLogo,
      city: schoolCity,
      state: schoolState,
      status: 'active', // added from template starts as active for 15 days
      validityDays: 15,
      activatedAt: new Date().toISOString(),
      activeUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      description: tmpl.description
    };

    const updated = [newJob, ...jobs];
    saveJobsToStorage(updated);
    setIsTemplateDrawerOpen(false);
    showToast(`Added "${newJob.title}" with 15-day active listing!`);
  };

  const filteredTemplates = useMemo(() => {
    if (templateFilter === 'all') return PREBUILT_TEMPLATES;
    return PREBUILT_TEMPLATES.filter(t => t.category === templateFilter);
  }, [templateFilter]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 py-6 sm:py-10 px-3 sm:px-6 font-sans">
      {/* ── Toast Notification ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[99999] bg-[#003c6e] text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-400/40 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header & Actions ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto space-y-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/edu-network/teachers?tab=jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#005689] hover:text-[#003c6e] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Jobs Directory</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Side Sheet Templates Button */}
            <button
              type="button"
              onClick={() => setIsTemplateDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 px-3.5 py-2 rounded-xl border border-amber-300 shadow-xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Browse Job Templates (Side Sheet)</span>
            </button>

            {/* Custom Job Post Link */}
            <Link
              href="/edu-network/jobs/post"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#005689] hover:bg-[#003c6e] px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Custom Vacancy</span>
            </Link>
          </div>
        </div>

        {/* School Banner Card with 30-Card Limit Progress */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              {schoolLogo ? (
                <img src={schoolLogo} alt="School" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#003c6e] tracking-tight truncate">
                  {schoolName} — Vacancy Dashboard
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage active school vacancies, toggle 15-day expiry validity, clone posts, and use pre-built templates.
              </p>
            </div>
          </div>

          {/* Usage Meter: Max 30 Cards */}
          <div className="w-full md:w-56 p-3 bg-slate-50 rounded-2xl border border-slate-200 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Post Storage</span>
              <span className={jobs.length >= 30 ? 'text-rose-600' : 'text-[#005689]'}>
                {jobs.length} / 30 Posts
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  jobs.length >= 30 ? 'bg-rose-500' : 'bg-[#005689]'
                }`}
                style={{ width: `${Math.min((jobs.length / 30) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-right">Max 30 Vacancies Allowed</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, subject, level..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'all' ? 'bg-white text-[#005689] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({jobs.filter(j => j.status === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'inactive' ? 'bg-white text-slate-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Draft / Inactive ({jobs.filter(j => j.status === 'inactive').length})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                categoryFilter === 'all' ? 'bg-blue-50 text-[#005689] border-blue-200' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('teaching')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                categoryFilter === 'teaching' ? 'bg-blue-50 text-[#005689] border-blue-200' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Teaching
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('non-teaching')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                categoryFilter === 'non-teaching' ? 'bg-blue-50 text-[#005689] border-blue-200' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Non-Teaching
            </button>
          </div>
        </div>
      </div>

      {/* ── Main List of Job Cards ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#005689] rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                No Vacancies Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You have not added any job postings matching this filter. Browse pre-built templates or create a custom vacancy.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsTemplateDrawerOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Browse Pre-Built Templates
              </button>
              <Link
                href="/edu-network/jobs/post"
                className="px-4 py-2 bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Create Custom Vacancy
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => {
              const expiry = getJobExpiryDetails(job);

              return (
                <div
                  key={job.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 relative hover:shadow-md ${
                    job.status === 'active'
                      ? 'border-slate-200/90 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 opacity-90'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    {/* Left: Job Info Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Level Badge */}
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-[#005689]/10 text-[#005689] border border-[#005689]/20">
                          {job.level}
                        </span>

                        {/* Category Badge */}
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {job.category === 'teaching' ? 'Teaching Faculty' : 'Non-Teaching'}
                        </span>

                        {/* Status / Expiry Countdown Pill */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              job.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span>{expiry.label}</span>
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate" style={{ color: '#003c6e' }}>
                        {job.title}
                      </h3>

                      {/* Detail Chips Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                        {/* Subject / Dept */}
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <BookOpen className="w-3.5 h-3.5 text-[#005689]" />
                          <span>{job.subject}</span>
                        </span>

                        {/* Salary */}
                        <span className="flex items-center gap-1 font-extrabold text-[#0F9D58]">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{job.salary}</span>
                        </span>

                        {/* Role Type */}
                        <span className="flex items-center gap-1 text-slate-500">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.roleType}</span>
                        </span>

                        {/* Experience */}
                        <span className="flex items-center gap-1 text-slate-500">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.experience}</span>
                        </span>

                        {/* Openings */}
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.openings} Opening(s)</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Controls (Toggle Switch, Edit Button, 3-Dot Menu) */}
                    <div className="flex items-center gap-3 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                      
                      {/* Active / Inactive Switch Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">
                          {job.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(job)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            job.status === 'active' ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                          title={job.status === 'active' ? 'Click to deactivate' : 'Click to activate for 15 days'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              job.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingJob(job)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      {/* Three-Dot Tools Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuJobId(openMenuJobId === job.id ? null : job.id);
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          title="More Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuJobId === job.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-10 z-50 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 text-xs font-semibold text-slate-700"
                          >
                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                handleDuplicateJob(job);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition text-slate-800"
                            >
                              <Copy className="w-3.5 h-3.5 text-blue-600" />
                              <span>Create Duplicate</span>
                            </button>

                            {/* Publish / Unpublish */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                handleToggleStatus(job);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition text-slate-800"
                            >
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{job.status === 'active' ? 'Set as Inactive' : 'Activate (15 Days)'}</span>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                setEditingJob(job);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition text-slate-800"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit Details</span>
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuJobId(null);
                                handleDeleteJob(job.id);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Post</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: 15-DAY ACTIVATION / DUE DATE POPUP
         ══════════════════════════════════════════════════════════════════════════ */}
      {activationModalJob && (
        <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005689] bg-blue-50 px-2 py-0.5 rounded-full">
                  Activate Listing
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  Set Vacancy Validity Period
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivationModalJob(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Post will be prominently displayed on the CSEEL Faculty Network and automatically disabled once the validity period ends.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Valid For (Days) — Default 15 Days
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={customDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 15;
                    setCustomDays(days);
                    const future = new Date(Date.now() + days * 86400000);
                    setCustomDueDate(future.toISOString().split('T')[0]);
                  }}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-[#005689] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Or Specific Due Date / Expiry
                </label>
                <input
                  type="date"
                  value={customDueDate}
                  onChange={(e) => setCustomDueDate(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActivationModalJob(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActivation}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                Activate & Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: EDIT VACANCY MODAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {editingJob && (
        <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005689]">
                  Edit Vacancy
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900" style={{ color: '#003c6e' }}>
                  Update Job Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject / Domain *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.subject}
                    onChange={(e) => setEditingJob({ ...editingJob, subject: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.level}
                    onChange={(e) => setEditingJob({ ...editingJob, level: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salary Range *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.salary}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience *</label>
                  <input
                    type="text"
                    required
                    value={editingJob.experience}
                    onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Openings *</label>
                  <input
                    type="number"
                    min={1}
                    value={editingJob.openings}
                    onChange={(e) => setEditingJob({ ...editingJob, openings: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Description & Responsibilities</label>
                <textarea
                  rows={4}
                  value={editingJob.description.replace(/<[^>]*>/g, '')}
                  onChange={(e) => setEditingJob({ ...editingJob, description: `<p>${e.target.value}</p>` })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005689] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 font-bold text-white bg-[#005689] hover:bg-[#003c6e] rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SIDE SHEET (DRAWER): PRE-BUILT JOB TEMPLATES
         ══════════════════════════════════════════════════════════════════════════ */}
      {isTemplateDrawerOpen && (
        <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#005689] to-[#003c6e] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-200 font-bold uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Recruitment Library</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">Pre-Built Job Templates</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Pick any role, select or change the subject, and 1-click add to your active jobs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateDrawerOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Category Switcher */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold w-full">
                <button
                  type="button"
                  onClick={() => setTemplateFilter('all')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                    templateFilter === 'all' ? 'bg-[#005689] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Roles ({PREBUILT_TEMPLATES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateFilter('teaching')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                    templateFilter === 'teaching' ? 'bg-[#005689] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Teaching ({PREBUILT_TEMPLATES.filter(t => t.category === 'teaching').length})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateFilter('non-teaching')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${
                    templateFilter === 'non-teaching' ? 'bg-[#005689] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Non-Teaching ({PREBUILT_TEMPLATES.filter(t => t.category === 'non-teaching').length})
                </button>
              </div>
            </div>

            {/* Templates Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#005689] shrink-0 mt-0.5" />
                <p>
                  <strong>Customizable Subjects:</strong> Templates are role-based. Change the subject dropdown below for each role to fit your school's exact need.
                </p>
              </div>

              {filteredTemplates.map((tmpl) => {
                const currentSubject = selectedTemplateSubjects[tmpl.id] || tmpl.defaultSubject;

                return (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#005689] transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#005689]/10 text-[#005689]">
                            {tmpl.level}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {tmpl.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {tmpl.defaultTitle}
                        </h4>
                      </div>

                      <span className="text-xs font-extrabold text-[#0F9D58] bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">
                        {tmpl.salary}
                      </span>
                    </div>

                    {/* Interactive Subject Selection Dropdown (User can change subject) */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500 block">
                        Choose / Change Subject or Stream:
                      </label>
                      <select
                        value={currentSubject}
                        onChange={(e) => handleSubjectChangeInTemplate(tmpl.id, e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:border-[#005689]"
                      >
                        {tmpl.availableSubjects.map((subj) => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                      </select>
                    </div>

                    {/* Template Meta & Action */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500 font-medium">
                        Exp: {tmpl.experience} • {tmpl.roleType}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddJobFromTemplate(tmpl)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Vacancy Card</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>{jobs.length}/30 Cards in Dashboard</span>
              <button
                type="button"
                onClick={() => setIsTemplateDrawerOpen(false)}
                className="font-bold text-[#005689] hover:underline"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
