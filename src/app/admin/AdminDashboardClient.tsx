'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LayoutWrapper, { ContentSubHeader } from '@/components/LayoutWrapper';
import { useAuth } from '@/contexts/AuthContext';
import type { UniversalEditorValue } from '@/components/editor/types';

const UniversalEditor = dynamic(() => import('@/components/editor/UniversalEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 min-h-[420px]">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 animate-pulse">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
        <span>Initializing CSEEL Scientific &amp; LaTeX Authoring Studio...</span>
      </div>
    </div>
  ),
});
import {
  Menu,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
  Plus,
  X,
  Eye,
  Edit3,
  Download,
  Share2,
  Calendar,
  Grid3X3,
  HelpCircle,
  Home,
  BarChart3,
  Compass,
  Megaphone,
  Layers,
  FolderOpen,
  Activity,
  School,
  FlaskConical,
  Briefcase,
  Package,
  Newspaper,
  ShieldCheck,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  FileText,
  UploadCloud,
  Send,
  Trash2,
  Clock,
  BookOpen,
  Award,
  Video,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Calculator,
  Save,
  Check,
  RefreshCw,
  Printer,
  User,
  GraduationCap,
  Building,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export type DashboardType =
  | 'home'
  | 'reports'
  | 'cms'
  | 'inventory'
  | 'schools'
  | 'jobs'
  | 'school'
  | 'teacher'
  | 'labs'
  | 'media'
  | 'admin';

const CMS_TEMPLATES: Record<string, { title: string; abstract: string; category: string; html: string }> = {
  experiment: {
    title: "Verification of Ohm's Law & Resistance of a Wire",
    abstract: "To determine resistance per unit length of a given specimen wire by establishing potential difference as a function of electric current flowing through it.",
    category: "Physics Laboratory",
    html: `<h2>1. Objective &amp; Theoretical Principle</h2>
<p>To determine the resistance per unit length of a given specimen wire by measuring the potential difference \(V\) as a function of current \(I\).</p>
<p>According to Ohm's Law, when physical conditions (temperature, pressure, tension) remain strictly invariant, the electric current through a conductor is proportional to the applied voltage:</p>
<div data-type="formula" data-latex="V = I \\cdot R \\implies R = \\frac{V}{I}" data-display-mode="true">$$V = I \\cdot R \\implies R = \\frac{V}{I}$$</div>
<p>The specific electrical resistivity \(\\rho\) is governed by wire cross-section \(A = \\pi r^2\) and length \(L\):</p>
<div data-type="formula" data-latex="\\rho = \\frac{R \\cdot A}{L} = \\frac{R \\cdot \\pi r^2}{L}" data-display-mode="true">$$\\rho = \\frac{R \\cdot A}{L} = \\frac{R \\cdot \\pi r^2}{L}$$</div>

<h2>2. Experimental Circuit Schematic</h2>
<div data-type="mermaid" data-code="flowchart LR
  Batt[Battery Eliminator 6V] --> Key[Plug Key]
  Key --> Rheo[Rheostat]
  Rheo --> Wire[Specimen Wire R]
  Wire --> Amm[Ammeter 0-1.5A]
  Amm --> Batt
  subgraph Parallel Measurement
    Volt[Voltmeter 0-3V] --- Wire
  end"></div>

<h2>3. Observations &amp; Data Logging</h2>
<table class="editor-table">
  <thead>
    <tr>
      <th>Obs #</th>
      <th>Voltage V (Volts)</th>
      <th>Current I (Amperes)</th>
      <th>Calculated R = V/I (Ω)</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>0.40 V</td>
      <td>0.20 A</td>
      <td>2.00 Ω</td>
      <td>Nominal</td>
    </tr>
    <tr>
      <td>2</td>
      <td>0.80 V</td>
      <td>0.40 A</td>
      <td>2.00 Ω</td>
      <td>Nominal</td>
    </tr>
    <tr>
      <td>3</td>
      <td>1.20 V</td>
      <td>0.60 A</td>
      <td>2.00 Ω</td>
      <td>Verified</td>
    </tr>
    <tr>
      <td>4</td>
      <td>1.60 V</td>
      <td>0.79 A</td>
      <td>2.02 Ω</td>
      <td>Verified</td>
    </tr>
  </tbody>
</table>

<div data-type="callout" data-variant="tip">
  <p><strong>Safety Precaution:</strong> Disconnect the plug key between readings to avoid Joule heating (\(H = I^2 R t\)), which shifts wire resistance due to positive temperature coefficient \(\\alpha\).</p>
</div>`,
  },
  paper: {
    title: "Quantum State Superposition & Wave Mechanics in Low-Dimensional Structures",
    abstract: "A rigorous mathematical formulation and analytical solution of particle-in-a-box wavefunctions, eigen-energy spectra, and tunneling probabilities in semiconductor quantum wells.",
    category: "Quantum Physics & Advanced Mathematics",
    html: `<h2>Abstract</h2>
<p>We present an exact analytical derivation of non-relativistic quantum states confined within one-dimensional finite potential barriers. The time-independent Schrödinger wave equation is solved subject to Dirichlet boundary conditions, confirming discrete energy quantization.</p>

<h2>1. Mathematical Formulation &amp; Schrödinger Equation</h2>
<p>The steady-state wave mechanics for an electron of effective mass \(m^*\) under potential \(V(x)\) is expressed by the Hamiltonian eigenvalue equation:</p>
<div data-type="formula" data-latex="-\\frac{\\hbar^2}{2m^*} \\frac{d^2 \\psi(x)}{dx^2} + V(x)\\psi(x) = E\\psi(x)" data-display-mode="true">$$-\\frac{\\hbar^2}{2m^*} \\frac{d^2 \\psi(x)}{dx^2} + V(x)\\psi(x) = E\\psi(x)$$</div>

<p>For an infinite potential well of width \(L\), the normalized stationary state eigen-functions and corresponding quantized energy levels are given by:</p>
<div data-type="formula" data-latex="\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n \\pi x}{L}\\right), \\quad E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m^* L^2}" data-display-mode="true">$$\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n \\pi x}{L}\\right), \\quad E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2 m^* L^2}$$</div>

<h2>2. Normalization &amp; Probability Density</h2>
<p>The continuous probability density distribution \(P(x) = |\\psi_n(x)|^2\) satisfies the global unitarity condition:</p>
<div data-type="formula" data-latex="\\int_{0}^{L} |\\psi_n(x)|^2 \\, dx = \\frac{2}{L} \\int_{0}^{L} \\sin^2\\left(\\frac{n\\pi x}{L}\\right) dx = 1" data-display-mode="true">$$\\int_{0}^{L} |\\psi_n(x)|^2 \\, dx = \\frac{2}{L} \\int_{0}^{L} \\sin^2\\left(\\frac{n\\pi x}{L}\\right) dx = 1$$</div>

<h2>3. Calculated Energy Eigenvalues</h2>
<table class="editor-table">
  <thead>
    <tr>
      <th>Quantum Number (n)</th>
      <th>Wave Node Count</th>
      <th>Eigen-Energy E_n (eV)</th>
      <th>Transition ΔE (n → n-1)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>n = 1 (Ground)</td>
      <td>0</td>
      <td>0.376 eV</td>
      <td>—</td>
    </tr>
    <tr>
      <td>n = 2 (1st Excited)</td>
      <td>1</td>
      <td>1.504 eV</td>
      <td>1.128 eV (λ = 1100 nm)</td>
    </tr>
    <tr>
      <td>n = 3 (2nd Excited)</td>
      <td>2</td>
      <td>3.384 eV</td>
      <td>1.880 eV (λ = 660 nm)</td>
    </tr>
  </tbody>
</table>

<div data-type="callout" data-variant="note">
  <p><strong>Theoretical Conclusion:</strong> As quantum well width \(L\) decreases below de Broglie wavelength \(\\lambda_{dB} = \\frac{h}{p}\), quantum size confinement effects dominate classical continuum transport.</p>
</div>`,
  },
  blog: {
    title: "Understanding James Webb Telescope's Deep Field Spectroscopy",
    abstract: "How infrared diffraction and redshift Doppler formulations allow astrophysicists to peer back 13.5 billion years to witness the earliest galactic structures.",
    category: "Astronomy & Astrophysics",
    html: `<h2>Unlocking Cosmological Redshift</h2>
<p>The James Webb Space Telescope (JWST) relies on Near-Infrared Spectrograph (NIRSpec) instruments to detect highly cosmological redshifted photons emitted by early stars.</p>

<p>The cosmological redshift parameter \(z\) relates the observed wavelength \(\\lambda_{\\text{obs}}\) to the rest-frame emitted wavelength \(\\lambda_{\\text{emit}}\):</p>
<div data-type="formula" data-latex="z = \\frac{\\lambda_{\\text{obs}} - \\lambda_{\\text{emit}}}{\\lambda_{\\text{emit}}} = \\frac{a(t_0)}{a(t_{\\text{emit}})} - 1" data-display-mode="true">$$z = \\frac{\\lambda_{\\text{obs}} - \\lambda_{\\text{emit}}}{\\lambda_{\\text{emit}}} = \\frac{a(t_0)}{a(t_{\\text{emit}})} - 1$$</div>

<p>The energy of emitted photon packages follows Planck's quantum law:</p>
<div data-type="formula" data-latex="E = h \\cdot \\nu = \\frac{h \\cdot c}{\\lambda}" data-display-mode="true">$$E = h \\cdot \\nu = \\frac{h \\cdot c}{\\lambda}$$</div>

<div data-type="callout" data-variant="tip">
  <p><strong>Key Insight:</strong> Light traveling across an expanding spacetime fabric has its wavelength stretched, shifting optical and ultraviolet emissions directly into the infrared spectrum.</p>
</div>`,
  },
  circular: {
    title: "Official Notification: Mandatory Upgradation of STEM & Robotics Lab Workstations",
    abstract: "Directive for all affiliated schools and experiential learning centers regarding annual calibration, sensor checks, and safety audits.",
    category: "Institutional Governance & Compliance",
    html: `<h2>Notification Ref No: CSEEL/DIR/2026/CBSE-882</h2>
<p>All affiliated laboratory coordinators and department heads are hereby directed to complete statutory safety audits and apparatus zero-error calibrations before the commencement of the academic term.</p>

<h2>Mandatory Audit Deliverables:</h2>
<table class="editor-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Inspection Parameter</th>
      <th>Compliance Benchmark</th>
      <th>Deadline</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Physics Laboratory</td>
      <td>Digital &amp; Analog Galvanometer Calibrations</td>
      <td>Zero Drift &lt; 0.5%</td>
      <td>15 Nov 2026</td>
    </tr>
    <tr>
      <td>Chemistry Laboratory</td>
      <td>Fume Hood Air Velocity &amp; Neutralizer Stocks</td>
      <td>OSHA Standard 100 fpm</td>
      <td>20 Nov 2026</td>
    </tr>
    <tr>
      <td>Robotics &amp; AI Hub</td>
      <td>LiPo Battery Storage Cabinets</td>
      <td>Fire-Safe Thermal Enclosures</td>
      <td>30 Nov 2026</td>
    </tr>
  </tbody>
</table>

<div data-type="callout" data-variant="warning">
  <p><strong>Compliance Notice:</strong> Failure to submit signed audit logs within the stipulated deadline will result in temporary suspension of experimental certification privileges.</p>
</div>`,
  },
};

export default function AdminGovernanceConsoleClient({ initialDashboard = 'reports' }: { initialDashboard?: DashboardType } = {}) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>(initialDashboard);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [rail1Hovered, setRail1Hovered] = useState(false);
  const [rail2Open, setRail2Open] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setRail2Open(true);
    }
  }, []);
  const [activeNavId, setActiveNavId] = useState<string>(
    initialDashboard === 'teacher'
      ? 'teacher-resume'
      : initialDashboard === 'school'
      ? 'school-post-job'
      : initialDashboard === 'jobs'
      ? 'jobs-schools'
      : 'reports-snapshot'
  );

  // Dropdown States
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [propertySelectorOpen, setPropertySelectorOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 28 days');
  const [selectedProperty, setSelectedProperty] = useState('CSEEL - Experiential Learning Lab');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplateModal, setActiveTemplateModal] = useState<string | null>(null);

  // In-House Editor State
  const [editorContentType, setEditorContentType] = useState<'experiment' | 'blog' | 'paper' | 'circular'>('experiment');
  const [editorTitle, setEditorTitle] = useState("Verification of Ohm's Law & Resistance of a Wire");
  const [editorAbstract, setEditorAbstract] = useState('To determine resistance per unit length of a given specimen wire by establishing potential difference as a function of electric current flowing through it.');
  const [editorCategory, setEditorCategory] = useState('Physics Laboratory');
  const [editorGrade, setEditorGrade] = useState('Class 11 - 12 (Senior Secondary)');
  const [editorKolbStage, setEditorKolbStage] = useState('Concrete Experience');
  const [editorVisibility, setEditorVisibility] = useState('Public & All CBSE Schools');
  const [editorTags, setEditorTags] = useState('physics, electricity, ohms-law, resistance, cbse-lab');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [editorHtml, setEditorHtml] = useState<string>(CMS_TEMPLATES.experiment.html);
  const [editorContent, setEditorContent] = useState<string>('');

  const handleSwitchFormat = (formatId: 'experiment' | 'blog' | 'paper' | 'circular') => {
    setEditorContentType(formatId);
    const tpl = CMS_TEMPLATES[formatId];
    if (tpl) {
      setEditorTitle(tpl.title);
      setEditorAbstract(tpl.abstract);
      setEditorCategory(tpl.category);
      setEditorHtml(tpl.html);
    }
  };

  const [saveStatusText, setSaveStatusText] = useState('Saved as draft (just now)');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const propertyMenuRef = useRef<HTMLDivElement>(null);

  // Job & Verification Dashboard State (Schools, Teachers, Jobs from School / Indeed / LinkedIn)
  const [adminSchools, setAdminSchools] = useState([
    { id: 'sch-1', name: 'Delhi Public School (R.K. Puram)', udise: '07010204803', affiliation: 'CBSE Affiliation # 2730017', city: 'South West Delhi, Delhi', status: 'Pending Review', docs: 'Affiliation Certificate & Fire NOC', contact: 'Dr. S. K. Aggarwal' },
    { id: 'sch-2', name: 'Kendriya Vidyalaya No. 1', udise: '09050100102', affiliation: 'CBSE Affiliation # 2100012', city: 'Kanpur, Uttar Pradesh', status: 'Verified', docs: 'Ministry Sanction & UDISE Record', contact: 'Mrs. Pratibha Singh' },
    { id: 'sch-3', name: 'St. Xavier High School', udise: '27210502301', affiliation: 'ICSE Affiliation # MH-042', city: 'Mumbai, Maharashtra', status: 'Pending Review', docs: 'State Dept NOC & Society Reg', contact: 'Fr. David Dsouza' },
    { id: 'sch-4', name: 'DAV Centenary Public School', udise: '06180104505', affiliation: 'CBSE Affiliation # 530089', city: 'Faridabad, Haryana', status: 'Pending Review', docs: 'Trust Deed & Land Certificate', contact: 'Mr. Ashok Kumar' },
  ]);

  const [adminTeachers, setAdminTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(true);

  // Load real registered faculty from API & localStorage
  const loadAdminTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const res = await fetch('/api/admin/faculty');
      const data = await res.json();
      let list: any[] = [];
      if (data && data.success && Array.isArray(data.faculty)) {
        list = data.faculty;
      }
      
      // Merge with browser local storage submissions
      if (typeof window !== 'undefined') {
        try {
          const verifiedUsers: string[] = JSON.parse(localStorage.getItem('cseel_admin_verified_users') || '[]');
          const localStored = JSON.parse(localStorage.getItem('cseel_custom_faculty') || '[]');
          if (Array.isArray(localStored)) {
            for (const item of localStored) {
              const existingIdx = list.findIndex(t => t.id === item.id || t.slug === item.slug);
              const isItemVerified = Boolean(item.verified || verifiedUsers.includes(item.id) || verifiedUsers.includes(item.slug));
              if (existingIdx !== -1) {
                list[existingIdx] = { ...list[existingIdx], verified: isItemVerified, status: isItemVerified ? 'Verified' : 'Pending Review' };
              } else {
                list.unshift({
                  id: item.id || item.slug,
                  slug: item.slug,
                  name: item.name,
                  phone: item.phone,
                  email: item.email,
                  subject: item.subject,
                  qualification: item.qualification,
                  experience: `${item.experienceYears || 3} Years`,
                  city: `${item.city}, ${item.state}`,
                  status: isItemVerified ? 'Verified' : 'Pending Review',
                  verified: isItemVerified,
                  skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '')
                });
              }
            }
          }
        } catch {}
      }

      setAdminTeachers(list);
    } catch (err) {
      console.warn('[Admin] Error loading faculty:', err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    loadAdminTeachers();
  }, []);

  const [adminJobs, setAdminJobs] = useState([
    { id: 'jb-1', title: 'Senior Secondary PGT Physics Faculty', school: 'Delhi Public School (R.K. Puram)', location: 'New Delhi', salary: '₹50,000 - ₹70,000 / mo', type: 'Full Time', source: 'CSEEL Direct', sourceType: 'school', postedDate: 'Today', status: 'Pending Review', eligibility: 'M.Sc Physics + B.Ed + 5 yrs exp' },
    { id: 'jb-2', title: 'Atal Tinkering Lab (ATL) Mentor & Robotics Trainer', school: 'Kendriya Vidyalaya No. 1', location: 'Kanpur, UP', salary: '₹35,000 - ₹48,000 / mo', type: 'Contractual', source: 'CSEEL Direct', sourceType: 'school', postedDate: 'Yesterday', status: 'Live & Approved', eligibility: 'B.Tech / B.Sc + ATL Certification' },
    { id: 'jb-3', title: 'PGT Chemistry & Senior Lab Instructor', school: 'St. Kabir Public School', location: 'Chandigarh', salary: '₹45,000 - ₹60,000 / mo', type: 'Full Time', source: 'LinkedIn Jobs', sourceType: 'linkedin', postedDate: '2 days ago', status: 'Live & Approved', eligibility: 'M.Sc Chemistry + B.Ed' },
    { id: 'jb-4', title: 'TGT Science & STEM Lab Incharge', school: 'Ryan International School', location: 'Gurugram, HR', salary: '₹38,000 - ₹52,000 / mo', type: 'Full Time', source: 'Indeed Education', sourceType: 'indeed', postedDate: '3 days ago', status: 'Pending Review', eligibility: 'B.Sc / M.Sc + B.Ed' },
    { id: 'jb-5', title: 'Biology Laboratory Demonstrator & NEET Mentor', school: 'Narayana Olympiad School', location: 'Hyderabad, TS', salary: '₹55,000 - ₹80,000 / mo', type: 'Full Time', source: 'LinkedIn Jobs', sourceType: 'linkedin', postedDate: '4 days ago', status: 'Live & Approved', eligibility: 'M.Sc Zoology/Botany + 3 yrs' },
  ]);

  const [jobSourceFilter, setJobSourceFilter] = useState<'all' | 'school' | 'indeed' | 'linkedin'>('all');

  const handleVerifySchool = (id: string) => {
    setAdminSchools(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Verified' ? 'Pending Review' : 'Verified' } : s));
  };

  const handleVerifyTeacher = async (id: string, slug?: string) => {
    const current = adminTeachers.find(t => t.id === id || t.slug === slug);
    if (!current) return;
    const newVerified = !current.verified;

    // Optimistic UI update
    setAdminTeachers(prev => prev.map(t => (t.id === id || t.slug === slug) ? {
      ...t,
      verified: newVerified,
      status: newVerified ? 'Verified' : 'Pending Review'
    } : t));

    // Update in Supabase via API
    try {
      await fetch('/api/admin/faculty', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, slug: slug || current.slug, verified: newVerified })
      });
    } catch (e) {
      console.warn('[Admin] Error updating faculty in DB:', e);
    }

    // Update in local storage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('cseel_custom_faculty') || '[]');
        const updated = stored.map((item: any) => {
          if (item.id === id || item.slug === slug || item.slug === current.slug) {
            return { ...item, verified: newVerified };
          }
          return item;
        });
        localStorage.setItem('cseel_custom_faculty', JSON.stringify(updated));

        // Sync with verified users list
        const verifiedUsers: string[] = JSON.parse(localStorage.getItem('cseel_admin_verified_users') || '[]');
        if (newVerified) {
          const setUsers = new Set([...verifiedUsers, id, slug || current.slug, current.name]);
          localStorage.setItem('cseel_admin_verified_users', JSON.stringify(Array.from(setUsers)));
        } else {
          localStorage.setItem('cseel_admin_verified_users', JSON.stringify(verifiedUsers.filter(x => x !== id && x !== (slug || current.slug) && x !== current.name)));
        }
      } catch {}
    }
  };

  const handleApproveJob = (id: string) => {
    setAdminJobs(prev => prev.map(j => j.id === id ? { ...j, status: j.status === 'Live & Approved' ? 'Pending Review' : 'Live & Approved' } : j));
  };

  // Dedicated Teacher State
  const [teacherName, setTeacherName] = useState('Dr. Ramesh Sharma');
  const [teacherHeadline, setTeacherHeadline] = useState('Senior Secondary PGT Physics Faculty & Experiential Lab Mentor');
  const [teacherEmail, setTeacherEmail] = useState('ramesh.sharma@cseel.edu');
  const [teacherPhone, setTeacherPhone] = useState('+91 98765 43210');
  const [teacherCity, setTeacherCity] = useState('Noida');
  const [teacherState, setTeacherState] = useState('Uttar Pradesh');
  const [teacherBio, setTeacherBio] = useState('Dedicated Physics educator with 12+ years of experiential laboratory pedagogy, specializing in CBSE senior secondary curriculum, optics apparatus calibration, and Atal Tinkering Lab (ATL) robotics integration.');
  const [teacherSubject, setTeacherSubject] = useState('Senior Secondary Physics (Class 11 - 12)');
  const [teacherExp, setTeacherExp] = useState('12 Years');
  const [teacherCtc, setTeacherCtc] = useState('₹65,000 - ₹80,000 / month');
  const [teacherNotice, setTeacherNotice] = useState('15 Days (Immediate)');
  const [teacherCtet, setTeacherCtet] = useState('Paper 2: 122 / 150 (Qualified)');
  const [teacherRoll, setTeacherRoll] = useState('CTET2019-8834921');
  const [teacherSkills, setTeacherSkills] = useState('Optical Bench, Cathode Ray Oscilloscope, Spherometer, Kolb Cycle, Atal Tinkering Lab (ATL), Arduino / Sensors');
  const [teacherQualifications, setTeacherQualifications] = useState([
    { degree: 'Ph.D in Applied Physics', institution: 'Delhi Technological University (DTU)', year: '2016', score: 'First Division with Distinction' },
    { degree: 'M.Sc Physics (Electronics)', institution: 'University of Delhi (Hindu College)', year: '2011', score: '78.5%' },
    { degree: 'Bachelor of Education (B.Ed)', institution: 'Jamia Millia Islamia', year: '2013', score: '82.0%' }
  ]);
  const [teacherHistory, setTeacherHistory] = useState([
    { school: 'Delhi Public School, Noida', role: 'PGT Physics & Lab Incharge', tenure: '2018 - Present', achievements: 'Mentored 180+ Class 12 board students with a 94.2% practical distinction rate. Set up state-of-the-art optical bench and dual-trace oscilloscope setups.' },
    { school: 'Apeejay School, Pitampura', role: 'TGT Science & ATL Coordinator', tenure: '2014 - 2018', achievements: 'Led National Science Exhibition team to 2nd prize at CBSE Zonal. Coordinated daily STEM and experiential tinkering practicals.' }
  ]);
  const [teacherSaveSuccess, setTeacherSaveSuccess] = useState(false);

  // Dedicated School State
  const [schoolName] = useState('Delhi Public School (R.K. Puram)');
  const [schoolUdise] = useState('07010204803');
  const [schoolAffiliation] = useState('CBSE Affiliation # 2730017');
  const [schoolJobTitle, setSchoolJobTitle] = useState('Senior Secondary PGT Physics Faculty');
  const [schoolJobSubject, setSchoolJobSubject] = useState('Physics');
  const [schoolJobGrade, setSchoolJobGrade] = useState('Class 11 - 12 (Senior Secondary / PGT)');
  const [schoolJobType, setSchoolJobType] = useState('Full Time Regular');
  const [schoolJobSalary, setSchoolJobSalary] = useState('₹50,000 - ₹70,000 / month');
  const [schoolJobExp, setSchoolJobExp] = useState('3 - 5 Years');
  const [schoolJobQual, setSchoolJobQual] = useState('M.Sc in Physics (First Class) + B.Ed (Mandatory), CTET Paper 2 Qualified.');
  const [schoolJobLab, setSchoolJobLab] = useState('Candidate must be adept at handling senior secondary optical benches, spectrometer calibrations, and NEP experiential setups.');
  const [schoolJobPerks, setSchoolJobPerks] = useState('Campus Quarters / HRA, Medical Insurance, PF, Child Tuition Concession for 2 children.');
  const [schoolJobDeadline, setSchoolJobDeadline] = useState('2026-11-15');
  const [schoolSubmitSuccess, setSchoolSubmitSuccess] = useState(false);
  const [schoolVacancies, setSchoolVacancies] = useState([
    { id: 'sv-1', title: 'Senior Secondary PGT Physics Faculty', subject: 'Physics', grade: 'Class 11 - 12', type: 'Full Time', salary: '₹50,000 - ₹70,000 / mo', status: 'Live on Portal', applicants: 18, date: '24 Oct 2026' },
    { id: 'sv-2', title: 'Atal Tinkering Lab (ATL) Mentor & Robotics Trainer', subject: 'Robotics & AI', grade: 'Class 6 - 10', type: 'Contractual', salary: '₹35,000 - ₹48,000 / mo', status: 'Pending Admin Review', applicants: 6, date: 'Today' },
    { id: 'sv-3', title: 'TGT Chemistry & Experiential Science Instructor', subject: 'Chemistry', grade: 'Class 9 - 10', type: 'Full Time', salary: '₹42,000 - ₹55,000 / mo', status: 'Live on Portal', applicants: 24, date: '18 Oct 2026' }
  ]);

  const handlePostSchoolJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolJobTitle.trim()) {
      alert('Please enter a job title');
      return;
    }
    const newJob = {
      id: `sv-${Date.now()}`,
      title: schoolJobTitle,
      subject: schoolJobSubject,
      grade: schoolJobGrade,
      type: schoolJobType,
      salary: schoolJobSalary,
      status: 'Pending Admin Review',
      applicants: 0,
      date: 'Just now'
    };
    setSchoolVacancies([newJob, ...schoolVacancies]);
    setSchoolSubmitSuccess(true);
    setTimeout(() => {
      setSchoolSubmitSuccess(false);
      setActiveNavId('school-vacancies');
    }, 1200);
  };

  // Switch Dashboard with realistic page loading transition & URL sync
  const handleSwitchDashboard = (newDash: DashboardType, defaultNav: string = 'overview') => {
    if (activeDashboard === newDash && activeNavId === defaultNav) return;
    setIsPageLoading(true);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    setActiveDashboard(newDash);
    setActiveNavId(defaultNav);

    // Update browser URL query without reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', newDash);
      if (defaultNav && defaultNav !== 'overview') {
        url.searchParams.set('tab', defaultNav);
      } else {
        url.searchParams.delete('tab');
      }
      window.history.pushState({}, '', url.pathname + url.search);
    }

    setTimeout(() => {
      setIsPageLoading(false);
    }, 280);
  };

  // Switch Sub-Tab with URL sync
  const handleSelectTab = (tabId: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setRail2Open(false);
    }
    setActiveNavId(tabId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url.pathname + url.search);
    }
  };

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (propertyMenuRef.current && !propertyMenuRef.current.contains(e.target as Node)) {
        setPropertySelectorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        setCreateDropdownOpen(false);
        setPropertySelectorOpen(false);
        setUserDropdownOpen(false);
        setActiveTemplateModal(null);
        setShowPublishModal(false);
        if (isInput) (document.activeElement as HTMLElement)?.blur();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setRail2Open(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);

    const validDashboards: DashboardType[] = [
      'home',
      'reports',
      'cms',
      'inventory',
      'schools',
      'jobs',
      'school',
      'teacher',
      'labs',
      'media',
      'admin'
    ];

    const syncUrlToState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') as DashboardType;
      const tab = params.get('tab');
      if (view && validDashboards.includes(view)) {
        setActiveDashboard(view);
      }
      if (tab) {
        setActiveNavId(tab);
      }
    };

    syncUrlToState();
    window.addEventListener('popstate', syncUrlToState);
    return () => window.removeEventListener('popstate', syncUrlToState);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {}
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#f8fafd] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <LayoutWrapper
      portalName="Super Administrator"
      portalBadge="Master Directorate"
      badgeColor="bg-purple-50 text-purple-800 border-purple-200"
      searchPlaceholder='Try searching "experiments", "faculty jobs", "schools"...'
      roleIcon="admin"
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      isLoading={isPageLoading}
      onToggleSidebar={() => setRail2Open(prev => !prev)}
      isSidebarOpen={rail2Open}
      customLeftContent={
        <div className="relative" ref={propertyMenuRef}>
          <button
            type="button"
            onClick={() => setPropertySelectorOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-gray-700 hover:bg-[#f1f3f4] rounded-md transition-colors cursor-pointer border border-transparent hover:border-gray-200"
            title="Select property"
          >
            <div className="flex items-center gap-1.5 text-left">
              <span className="text-[11px] text-[#5f6368] hidden sm:inline">CSEEL &gt;</span>
              <span className="font-semibold text-[#202124] text-xs truncate max-w-[160px] sm:max-w-[200px]">
                {selectedProperty}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0 ml-0.5" />
          </button>

          {propertySelectorOpen && (
            <div className="absolute left-0 mt-1.5 w-76 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1.5 z-[700] text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-[#5f6368] uppercase tracking-wider text-[10px]">Select Property</span>
                <span className="text-[10px] text-gray-400">Account ID: 350052428</span>
              </div>
              <div className="py-1">
                {[
                  { id: 'p1', name: 'CSEEL - Experiential Learning Lab', stream: 'Primary Live Stream' },
                  { id: 'p2', name: 'CSEEL - CBSE Composite Labs', stream: 'SARAS 49 Stream' },
                  { id: 'p3', name: 'CSEEL - Staging Sandbox', stream: 'Testing Stream' }
                ].map((prop) => (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => {
                      setSelectedProperty(prop.name);
                      setPropertySelectorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 transition-colors flex items-center justify-between ${
                      selectedProperty === prop.name ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-gray-800'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{prop.name}</p>
                      <p className="text-[10px] text-[#5f6368]">{prop.stream}</p>
                    </div>
                    {selectedProperty === prop.name && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    >

      {/* 2. DUAL-RAIL MAIN AREA */}
      <div className="flex-1 h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] flex overflow-hidden relative">
        
        {/* Fixed placeholder so underlying content never shifts */}
        <div className="portal-rail-placeholder w-[48px] min-w-[48px] max-w-[48px] h-full shrink-0" />

        {/* RAIL 1: ULTRA-COMPACT HOVER SLIDE-OVER RAIL */}
        <aside
          onMouseEnter={() => setRail1Hovered(true)}
          onMouseLeave={() => setRail1Hovered(false)}
          className={`portal-rail1 absolute top-0 left-0 h-full z-40 transition-all duration-200 ease-out bg-white ${
            rail1Hovered ? 'w-[220px] shadow-xl' : 'w-[48px] shadow-none'
          }`}
        >
          <div className="flex flex-col gap-1 w-full">
            {[
              { id: 'home', label: 'Home', icon: Home, defaultTab: 'overview' },
              { id: 'reports', label: 'Reports', icon: BarChart3, defaultTab: 'reports-snapshot' },
              { id: 'cms', label: 'CMS (Editor)', icon: Edit3, defaultTab: 'cms-all' },
              { id: 'jobs', label: 'Job Verification Hub', icon: ShieldCheck, defaultTab: 'jobs-schools' },
              { id: 'schools', label: 'School Directory', icon: Building, defaultTab: 'claims-verification' },
              { id: 'inventory', label: 'Inventory Dashboard', icon: Package, defaultTab: 'inventory-overview' },
              { id: 'labs', label: 'Lab Management', icon: FlaskConical, defaultTab: 'labs-all' },
              { id: 'media', label: 'Media Management', icon: Newspaper, defaultTab: 'media-gallery' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeDashboard === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSwitchDashboard(item.id as DashboardType, item.defaultTab)}
                  className={`portal-rail1-btn ${
                    isActive ? 'portal-rail1-btn-active' : 'portal-rail1-btn-inactive'
                  }`}
                  title={item.label}
                >
                  <div className="portal-rail1-icon-box">
                    <Icon className="portal-rail1-icon" />
                  </div>
                  <span className={`portal-rail1-label transition-all duration-150 ${
                    rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Rail Items: Tasks + Admin */}
          <div className="flex flex-col gap-1 w-full pt-2 border-t border-[#dadce0]">
            <button
              type="button"
              onClick={() => handleSwitchDashboard('schools', 'claims-verification')}
              className={`portal-rail1-btn ${
                activeDashboard === 'schools' && activeNavId === 'claims-verification'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Tasks"
            >
              <div className="portal-rail1-icon-box">
                <CheckCircle2 className="w-4 h-4 fill-[#202124] text-white" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
              }`}>
                Tasks
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchDashboard('admin', 'admin-settings')}
              className={`portal-rail1-btn ${
                activeDashboard === 'admin'
                  ? 'portal-rail1-btn-active'
                  : 'portal-rail1-btn-inactive'
              }`}
              title="Settings"
            >
              <div className="portal-rail1-icon-box">
                <Settings className="w-4 h-4 text-[#202124]" />
              </div>
              <span className={`portal-rail1-label transition-all duration-150 ${
                rail1Hovered ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}>
                Settings
              </span>
            </button>
          </div>
        </aside>

        {/* RAIL 2 TOGGLE EXPAND BUTTON (when Rail 2 is collapsed - GA4 Exact Tab) */}
        {!rail2Open && (
          <button
            type="button"
            onClick={() => setRail2Open(true)}
            className="portal-rail-expand-btn hidden md:flex"
            title="Expand navigation (Ctrl+B)"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}

        {/* RAIL 2: SUB-NAVIGATION SIDEBAR */}
        {rail2Open && (
          <aside className="portal-rail2 h-full z-20">
            <div className="flex-1 overflow-y-auto">
              
              <div className="px-3.5 pt-3 pb-2 border-b border-gray-100 mb-1 flex items-center justify-between">
                <div>
                  <h2 className="portal-rail2-header-title">
                  {activeDashboard === 'reports' && 'Reports'}
                  {activeDashboard === 'cms' && 'CSEEL Content Studio'}
                  {activeDashboard === 'inventory' && 'Inventory Hub'}
                  {activeDashboard === 'schools' && 'School Directory'}
                  {activeDashboard === 'jobs' && 'Job Post Verification Hub'}
                  {activeDashboard === 'labs' && 'Science Labs'}
                  {activeDashboard === 'media' && 'Media & Circulars'}
                  {activeDashboard === 'home' && 'Executive Hub'}
                  {activeDashboard === 'admin' && 'Governance & RBAC'}
                </h2>
                <p className="portal-rail2-header-sub">Directorate Governance</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRail2Open(false)}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-900 rounded-md hover:bg-gray-100"
                  title="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Module Switcher Dropdown (Only visible on mobile screens) */}
              <div className="md:hidden px-3 pt-1 pb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Active Console
                </label>
                <select
                  value={activeDashboard}
                  onChange={(e) => {
                    const val = e.target.value as DashboardType;
                    const defaultTabs: Record<string, string> = {
                      home: 'overview',
                      reports: 'reports-snapshot',
                      cms: 'cms-all',
                      jobs: 'jobs-schools',
                      schools: 'claims-verification',
                      inventory: 'inventory-overview',
                      labs: 'labs-all',
                      media: 'media-gallery',
                      admin: 'admin-settings'
                    };
                    handleSwitchDashboard(val, defaultTabs[val] || 'overview');
                  }}
                  className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-800"
                >
                  <option value="home">Home (Overview)</option>
                  <option value="reports">Reports &amp; Analytics</option>
                  <option value="cms">CMS (Content Studio)</option>
                  <option value="jobs">Job Post Verification</option>
                  <option value="schools">School Directory</option>
                  <option value="inventory">Inventory Hub</option>
                  <option value="labs">Science Labs</option>
                  <option value="media">Media Management</option>
                  <option value="admin">Admin Settings</option>
                </select>
              </div>

              {/* "+ Create" Pill Button */}
              <div className="px-3 pb-3 relative" ref={createMenuRef}>
                <button
                  type="button"
                  onClick={() => setCreateDropdownOpen(prev => !prev)}
                  className="portal-rail2-create-btn"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    <span>Create</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#5f6368]" />
                </button>

                {createDropdownOpen && (
                  <div className="absolute left-3 right-3 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-[800] text-xs animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSwitchDashboard('cms', 'cms-editor');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-gray-800 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">New Content Draft</p>
                        <p className="text-[10px] text-gray-500">Experiment, Blog, Paper</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSwitchDashboard('school', 'school-post-job');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-gray-800 cursor-pointer"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Post School Job</p>
                        <p className="text-[10px] text-gray-500">School faculty vacancy</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSwitchDashboard('teacher', 'teacher-resume');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-gray-800 cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Teacher Resume Builder</p>
                        <p className="text-[10px] text-gray-500">Faculty profile &amp; CV</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateDropdownOpen(false);
                        handleSwitchDashboard('inventory', 'inventory-overview');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-gray-800 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">GeM Procurement Order</p>
                        <p className="text-[10px] text-gray-500">Apparatus kit order</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <div className="space-y-0.5 px-2">
                {activeDashboard === 'reports' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('reports-snapshot')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'reports-snapshot' ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold' : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 shrink-0" />
                      <span className="truncate">Reports snapshot</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('realtime')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'realtime' ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold' : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Activity className="w-4 h-4 shrink-0" />
                        <span className="truncate">Realtime</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    </button>
                  </>
                )}

                {activeDashboard === 'cms' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('cms-editor')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'cms-editor' ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold' : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">Authoring Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('cms-published')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 font-medium cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">Published Items</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">142</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('cms-drafts')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 font-medium cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="truncate">Saved Drafts</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">6</span>
                    </button>
                  </>
                )}

                {activeDashboard === 'inventory' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('inventory-overview')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs bg-[#e8f0fe] text-[#1967d2] font-semibold text-left"
                    >
                      <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Apparatus Stock</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('gem-orders')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <TrendingUp className="w-4 h-4 shrink-0" />
                        <span className="truncate">GeM Procurement</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">24</span>
                    </button>
                  </>
                )}

                {activeDashboard === 'schools' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('udise-directory')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs bg-[#e8f0fe] text-[#1967d2] font-semibold text-left"
                    >
                      <School className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">15L+ UDISE Registry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('claims-verification')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Verification Tasks</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">8</span>
                    </button>
                  </>
                )}

                {activeDashboard === 'jobs' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('jobs-schools')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'jobs-schools'
                          ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <School className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">School Verification</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        {adminSchools.filter(s => s.status === 'Pending Review').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('jobs-teachers')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'jobs-teachers'
                          ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Users className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">Teacher Verification</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                        {adminTeachers.filter(t => t.status === 'Pending Review').length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('jobs-posts')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        activeNavId === 'jobs-posts' || activeNavId === 'jobs-active'
                          ? 'bg-[#e8f0fe] text-[#1967d2] font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">Jobs (Indeed/LinkedIn)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                        {adminJobs.filter(j => j.status === 'Pending Review').length}
                      </span>
                    </button>
                  </>
                )}

                {activeDashboard === 'labs' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('labs-catalog')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs bg-[#e8f0fe] text-[#1967d2] font-semibold text-left"
                    >
                      <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="truncate">Simulations Catalog</span>
                    </button>
                  </>
                )}

                {activeDashboard === 'media' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelectTab('media-gallery')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs bg-[#e8f0fe] text-[#1967d2] font-semibold text-left"
                    >
                      <ImageIcon className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="truncate">Visual Assets</span>
                    </button>
                  </>
                )}

                {(activeDashboard === 'home' || activeDashboard === 'admin') && (
                  <>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs bg-[#e8f0fe] text-[#1967d2] font-semibold text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="truncate">Master Overview</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Collapse Button */}
            <div className="p-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setRail2Open(false)}
                className="portal-rail-collapse-btn"
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                <span>Collapse (Ctrl+B)</span>
              </button>
            </div>
          </aside>
        )}

        {/* 3. MAIN WORKSPACE CANVAS */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8fafd] relative">
          
          {/* Top Google-style Loading Progress Bar */}
          {isPageLoading && (
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-100 z-50 overflow-hidden">
              <div className="h-full bg-blue-600 w-1/3 animate-pulse" />
            </div>
          )}

          {/* Reusable Content Sub-Header Bar */}
          <ContentSubHeader
            title={activeNavId.replace('-', ' ').toUpperCase()}
            subtitle={`Master governance and regulatory controls for ${activeDashboard.toUpperCase()}`}
            badge={activeDashboard.toUpperCase()}
            badgeColor="bg-blue-50 text-blue-800 border-blue-200"
            isSidebarOpen={rail2Open}
            onToggleSidebar={() => setRail2Open(!rail2Open)}
            actions={
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                    className="portal-btn portal-btn-sm portal-btn-outline gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#5f6368]" />
                    <span>{selectedDateRange}</span>
                    <ChevronDown className="w-3 h-3 text-[#5f6368]" />
                  </button>

                  {datePickerOpen && (
                    <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1 z-[700] text-xs">
                      {['Today', 'Yesterday', 'Last 7 days', 'Last 28 days', 'Last 90 days'].map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setSelectedDateRange(range);
                            setDatePickerOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-[#202124]"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="portal-header-tool-btn"
                  title="Share dashboard"
                >
                  <Share2 className="portal-header-tool-icon" />
                </button>
              </div>
            }
          />

          {/* DASHBOARD AREA - HIGH DENSITY GOOGLE STANDARD DESIGN */}
          <div className="p-3.5 sm:p-4 space-y-3.5 max-w-6xl mx-auto w-full select-text">
            
            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 1: IN-HOUSE CSEEL CMS STUDIO & RICH EDITOR
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'cms' && (
              <div className="space-y-3.5">
                
                {/* Top Studio Control Bar */}
                <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-2">
                    <div>
                      <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-600" />
                        CSEEL Native Publishing &amp; Authoring Studio
                      </h2>
                      <p className="text-[11px] text-[#5f6368] mt-0.5">
                        Author, design, and publish rich interactive lab experiments, STEM blogs, research papers &amp; circulars.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-medium hidden sm:inline mr-1">
                        {saveStatusText}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSaveStatusText('Draft saved locally (' + new Date().toLocaleTimeString() + ')');
                          alert('Content draft saved successfully!');
                        }}
                        className="text-xs border-[#dadce0] text-[#3c4043] h-8 px-2.5 rounded-md hover:bg-gray-50"
                      >
                        <Save className="w-3.5 h-3.5 mr-1 text-[#5f6368]" />
                        Save Draft
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowPublishModal(true)}
                        className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold px-3 h-8 flex items-center gap-1.5 rounded-md shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Publish to CSEEL
                      </Button>
                    </div>
                  </div>

                  {/* Content Format Type Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mr-1">Format:</span>
                      {[
                        { id: 'experiment', label: 'Lab Experiment', icon: FlaskConical, color: 'bg-amber-50 text-amber-800 border-amber-300' },
                        { id: 'blog', label: 'Science Blog', icon: Edit3, color: 'bg-blue-50 text-blue-800 border-blue-300' },
                        { id: 'paper', label: 'Research Paper', icon: FileText, color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
                        { id: 'circular', label: 'Official Circular', icon: Megaphone, color: 'bg-rose-50 text-rose-800 border-rose-300' }
                      ].map((type) => {
                        const TypeIcon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleSwitchFormat(type.id as any)}
                            className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                              editorContentType === type.id
                                ? `${type.color} font-semibold ring-1 ring-blue-400/30 shadow-3xs`
                                : 'bg-white border-[#dadce0] text-[#3c4043] hover:bg-gray-50'
                            }`}
                          >
                            <TypeIcon className="w-3.5 h-3.5" />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Compose vs Live Preview Switcher */}
                    <div className="flex items-center bg-[#f1f3f4] p-0.5 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setEditorTab('write')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          editorTab === 'write' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Compose Mode</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('preview')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          editorTab === 'preview' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main 2-Column Editor Layout: 70% Writing Canvas + 30% Meta Inspector */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                  
                  {/* LEFT WRITING CANVAS (8 Cols) */}
                  <div className="lg:col-span-8 bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      {/* Publication Title */}
                      <input
                        type="text"
                        value={editorTitle}
                        onChange={(e) => setEditorTitle(e.target.value)}
                        placeholder="Write article, paper or experiment title..."
                        className="w-full text-base sm:text-lg font-semibold text-[#202124] border-none focus:outline-none placeholder-gray-400 pb-1"
                      />

                      {/* Subheading / Abstract */}
                      <input
                        type="text"
                        value={editorAbstract}
                        onChange={(e) => setEditorAbstract(e.target.value)}
                        placeholder="Add a concise abstract, thesis statement, or objective..."
                        className="w-full text-xs text-[#5f6368] border-none focus:outline-none placeholder-gray-400 pb-2 border-b border-gray-100"
                      />

                      {/* Visual TipTap & KaTeX Universal Editor */}
                      {editorTab === 'write' ? (
                        <div className="space-y-3">
                          <div className="p-2.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 text-blue-900 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span>
                                <strong>LaTeX Scientific Studio Active:</strong> Type <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px] text-blue-700">/</code> anywhere to insert equations, tables, graphs &amp; callouts.
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0 self-start sm:self-auto">
                              KaTeX + TipTap Scientific Bundle
                            </span>
                          </div>

                          <UniversalEditor
                            key={editorContentType}
                            contentType={
                              editorContentType === 'experiment'
                                ? 'experiment'
                                : editorContentType === 'paper'
                                ? 'document'
                                : editorContentType === 'blog'
                                ? 'blog'
                                : 'notice'
                            }
                            initialContent={editorHtml}
                            value={editorHtml}
                            onChange={(val: UniversalEditorValue) => {
                              setEditorHtml(val.html || '');
                              setEditorContent(val.text || '');
                            }}
                            minHeight="480px"
                            showWordCount={true}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold">IEEE / CBSE Live Scientific Article Render</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.print()}
                                className="text-xs h-7 border-gray-300 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 mr-1" />
                                Print / PDF
                              </Button>
                              <button
                                type="button"
                                onClick={() => setEditorTab('write')}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer ml-1"
                              >
                                Return to Compose
                              </button>
                            </div>
                          </div>

                          {/* Scientific Journal Publication Preview Card */}
                          <div className="p-4 sm:p-6 border border-[#dadce0] rounded-lg bg-white shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-4 font-sans">
                            <div className="border-b border-gray-100 pb-3 space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                  {editorCategory}
                                </span>
                                <span className="text-[10px] font-medium text-[#5f6368]">
                                  CBSE UDISE Curricular Standard • Peer-Reviewed
                                </span>
                              </div>
                              <h1 className="text-lg sm:text-xl font-bold text-[#202124] leading-tight">
                                {editorTitle}
                              </h1>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                                <span><strong>Author:</strong> CSEEL Senior STEM Faculty</span>
                                <span>•</span>
                                <span><strong>Published:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span>•</span>
                                <span><strong>Audience:</strong> {editorVisibility}</span>
                              </div>
                              <div className="p-3 bg-slate-50 border-l-4 border-blue-600 rounded-r-xl mt-3">
                                <p className="text-xs text-gray-700 italic font-serif leading-relaxed">
                                  <strong>Abstract:</strong> {editorAbstract}
                                </p>
                              </div>
                            </div>

                            <UniversalEditor
                              key={`preview-${editorContentType}`}
                              readOnly={true}
                              contentType={
                                editorContentType === 'experiment'
                                  ? 'experiment'
                                  : editorContentType === 'paper'
                                  ? 'document'
                                  : editorContentType === 'blog'
                                  ? 'blog'
                                  : 'notice'
                              }
                              initialContent={editorHtml}
                              value={editorHtml}
                              minHeight="300px"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Scientific LaTeX (KaTeX) &amp; TipTap Engine Active</span>
                      <span>Instant Rendering • Formula Presets &amp; Quick Symbols</span>
                    </div>
                  </div>

                  {/* RIGHT PUBLISHING & METADATA SIDEBAR (4 Cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    
                    {/* 1. Publishing Controls Card */}
                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5">
                      <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                        Publishing Settings
                      </h3>

                      <div>
                        <label className="text-[11px] font-medium text-[#3c4043] block mb-1">
                          Audience &amp; Visibility
                        </label>
                        <select
                          value={editorVisibility}
                          onChange={(e) => setEditorVisibility(e.target.value)}
                          className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                        >
                          <option>Public &amp; All CBSE Schools</option>
                          <option>Verified UDISE Hubs Only</option>
                          <option>Registered STEM Teachers Only</option>
                          <option>Private Internal Draft</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#3c4043] block mb-1">
                          Schedule Publication
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            defaultValue="2026-10-26"
                            className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <Button
                          onClick={() => setShowPublishModal(true)}
                          className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold h-8 rounded-md shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Publish to CSEEL
                        </Button>
                      </div>
                    </div>

                    {/* 2. Taxonomy & Curriculum Category */}
                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2.5">
                      <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                        Curriculum Mapping
                      </h3>

                      <div>
                        <label className="text-[11px] font-medium text-[#3c4043] block mb-1">
                          Academic Stream / Lab
                        </label>
                        <select
                          value={editorCategory}
                          onChange={(e) => setEditorCategory(e.target.value)}
                          className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                        >
                          <option>Physics Laboratory</option>
                          <option>Chemistry Laboratory</option>
                          <option>Biology Laboratory</option>
                          <option>ATL &amp; Robotics</option>
                          <option>NEP 2020 Pedagogies</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#3c4043] block mb-1">
                          Grade Level
                        </label>
                        <select
                          value={editorGrade}
                          onChange={(e) => setEditorGrade(e.target.value)}
                          className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                        >
                          <option>Class 6 - 8 (Middle)</option>
                          <option>Class 9 - 10 (Secondary)</option>
                          <option>Class 11 - 12 (Senior Secondary)</option>
                          <option>Faculty &amp; Educators</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#3c4043] block mb-1">
                          NEP 2020 Kolb Cycle
                        </label>
                        <select
                          value={editorKolbStage}
                          onChange={(e) => setEditorKolbStage(e.target.value)}
                          className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] bg-white"
                        >
                          <option>Concrete Experience (Hands-On Lab)</option>
                          <option>Reflective Observation (Analysis)</option>
                          <option>Abstract Conceptualization (Theory)</option>
                          <option>Active Experimentation (Application)</option>
                        </select>
                      </div>
                    </div>

                    {/* 3. Featured Cover Media */}
                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2">
                      <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                        Featured Lab Diagram / Cover
                      </h3>
                      <div className="h-24 border-2 border-dashed border-[#dadce0] hover:border-blue-400 rounded-md flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors bg-[#f8fafd]">
                        <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xs text-blue-600 font-medium">Upload cover photo</span>
                        <span className="text-[10px] text-[#5f6368]">PNG, JPG, or SVG up to 5MB</span>
                      </div>
                    </div>

                    {/* 4. Tags */}
                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-2">
                      <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                        Search Tags (SEO)
                      </h3>
                      <input
                        type="text"
                        value={editorTags}
                        onChange={(e) => setEditorTags(e.target.value)}
                        placeholder="Comma separated tags..."
                        className="w-full h-8 px-2.5 text-xs text-[#202124] border border-[#dadce0] rounded-md focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Published Content Queue Layout */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Published Curriculum &amp; Content Queue (142 Items)
                      </h3>
                      <p className="text-[11px] text-gray-500">Live publications across student and school portals.</p>
                    </div>
                    <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
                      View all items &gt;
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 font-bold uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Audience</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { title: 'Verification of Ohm’s Law & Resistance of a Wire', type: 'Lab Experiment', cat: 'Physics Lab', grade: 'Class 11-12', status: 'Live' },
                          { title: 'Volumetric Titration of Strong Acid vs Strong Base', type: 'Lab Experiment', cat: 'Chemistry Lab', grade: 'Class 11-12', status: 'Live' },
                          { title: 'Integrating Kolb’s Reflective Cycle into CBSE Science', type: 'Research Paper', cat: 'NEP Pedagogy', grade: 'Educators', status: 'Live' },
                          { title: 'Setting Up an ATL Robotics Sandbox for Secondary Schools', type: 'Science Blog', cat: 'ATL & Robotics', grade: 'Class 9-10', status: 'Draft' }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-semibold text-gray-900">{row.title}</td>
                            <td className="py-2.5 px-3 text-gray-600">{row.type}</td>
                            <td className="py-2.5 px-3 text-gray-500">{row.cat}</td>
                            <td className="py-2.5 px-3 text-gray-500">{row.grade}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                row.status === 'Live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button type="button" className="text-blue-600 hover:text-blue-800 font-semibold text-xs mr-2">Edit</button>
                              <button type="button" className="text-gray-400 hover:text-gray-600 text-xs">Preview</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 2: INVENTORY DASHBOARD LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'inventory' && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">Apparatus Items</p>
                    <p className="text-xl font-semibold text-[#202124] mt-1">1,480 Items</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">GeM Active Orders</p>
                    <p className="text-xl font-semibold text-[#202124] mt-1">24 Orders</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">Low Stock Warnings</p>
                    <p className="text-xl font-semibold text-amber-600 mt-1">12 Kits</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">SARAS 49 Score</p>
                    <p className="text-xl font-semibold text-emerald-600 mt-1">98.4%</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                      CBSE SARAS 49 Science Apparatus Stock &amp; Kits
                    </h3>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7.5 px-2.5 rounded-md">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Apparatus
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                        <tr>
                          <th className="py-2 px-3">Item Name</th>
                          <th className="py-2 px-3">Category</th>
                          <th className="py-2 px-3">Stock Count</th>
                          <th className="py-2 px-3">Procurement Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/80">
                          <td className="py-2 px-3 font-semibold text-[#202124]">Optical Bench with Convex Lens Set</td>
                          <td className="py-2 px-3 text-[#5f6368]">Physics Lab</td>
                          <td className="py-2 px-3 font-mono text-[#3c4043]">48 Sets</td>
                          <td className="py-2 px-3 text-[#5f6368]">GeM Portal</td>
                        </tr>
                        <tr className="hover:bg-gray-50/80">
                          <td className="py-2 px-3 font-semibold text-[#202124]">Compound Microscopes (1000x)</td>
                          <td className="py-2 px-3 text-[#5f6368]">Biology Lab</td>
                          <td className="py-2 px-3 font-mono text-[#3c4043]">32 Units</td>
                          <td className="py-2 px-3 text-[#5f6368]">Direct Requisition</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 3: SCHOOL MANAGEMENT DASHBOARD LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'schools' && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">15L+ UDISE Directory</p>
                    <p className="text-xl font-semibold text-[#202124] mt-1">1,509,240</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">Verified Lab Hubs</p>
                    <p className="text-xl font-semibold text-emerald-600 mt-1">1,420 Schools</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">Pending Claims</p>
                    <p className="text-xl font-semibold text-amber-600 mt-1">8 Claims</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                    <p className="text-[11px] font-semibold text-[#5f6368] uppercase">SARAS 49 Audits</p>
                    <p className="text-xl font-semibold text-purple-700 mt-1">94.8% Pass</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                  <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                    School Affiliation Claims Queue
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                        <tr>
                          <th className="py-2 px-3">School Name</th>
                          <th className="py-2 px-3">UDISE Code</th>
                          <th className="py-2 px-3">Location</th>
                          <th className="py-2 px-3 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50/80">
                          <td className="py-2 px-3 font-semibold text-[#202124]">Delhi Public School Sector 45</td>
                          <td className="py-2 px-3 font-mono text-[#5f6368]">06180102914</td>
                          <td className="py-2 px-3 text-[#5f6368]">Gurugram, Haryana</td>
                          <td className="py-2 px-3 text-right">
                            <button type="button" className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#1a73e8] text-white cursor-pointer hover:bg-[#1557b0]">Approve</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 4: JOB MANAGEMENT & VERIFICATION DASHBOARD LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'jobs' && (
              <div className="space-y-6">
                
                {/* Top Control Bar */}
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Job Post &amp; Faculty KYC Verification Hub
                    </h2>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">
                      Verify registered schools, audit teacher credentials (CTET/B.Ed), and approve job posts from schools, LinkedIn &amp; Indeed.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/dashboard/teacher"
                      target="_blank"
                      className="px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Open Teacher Portal</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>

                    <Link
                      href="/dashboard/school"
                      target="_blank"
                      className="px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <School className="w-3.5 h-3.5" />
                      <span>Open School Portal</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>

                {/* 3 Verification KPI Cards */}
                {/* TOP SUMMARY TILES (COMPACT GOOGLE CLOUD STYLE) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => handleSelectTab('jobs-schools')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      activeNavId === 'jobs-schools' ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30' : 'bg-white border-[#dadce0] hover:border-gray-300 shadow-[0_1px_2px_rgba(60,64,67,0.06)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Schools KYC</span>
                      <School className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <p className="text-xl font-semibold text-[#202124] mt-1">
                      {adminSchools.filter(s => s.status === 'Pending Review').length}
                      <span className="text-[11px] font-normal text-[#5f6368] ml-1">Pending Approval</span>
                    </p>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">{adminSchools.length} Total Registered Schools</p>
                  </div>

                  <div
                    onClick={() => handleSelectTab('jobs-teachers')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      activeNavId === 'jobs-teachers' ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/30' : 'bg-white border-[#dadce0] hover:border-gray-300 shadow-[0_1px_2px_rgba(60,64,67,0.06)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Teachers / Faculty KYC</span>
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <p className="text-xl font-semibold text-[#202124] mt-1">
                      {adminTeachers.filter(t => t.status === 'Pending Review').length}
                      <span className="text-[11px] font-normal text-[#5f6368] ml-1">Pending Verification</span>
                    </p>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">{adminTeachers.length} Candidate Profiles</p>
                  </div>

                  <div
                    onClick={() => handleSelectTab('jobs-posts')}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      activeNavId === 'jobs-posts' || activeNavId === 'jobs-active' ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-400/30' : 'bg-white border-[#dadce0] hover:border-gray-300 shadow-[0_1px_2px_rgba(60,64,67,0.06)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">Job Vacancies</span>
                      <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <p className="text-xl font-semibold text-[#202124] mt-1">
                      {adminJobs.filter(j => j.status === 'Pending Review').length}
                      <span className="text-[11px] font-normal text-[#5f6368] ml-1">Needs Moderation</span>
                    </p>
                    <p className="text-[11px] text-[#5f6368] mt-0.5">Aggregated from School, Indeed &amp; LinkedIn</p>
                  </div>
                </div>

                {/* Sub-Tab Navigation Bar */}
                <div className="flex items-center gap-1.5 border-b border-[#dadce0] pb-2">
                  {[
                    { id: 'jobs-schools', label: 'School Verification', icon: School, count: adminSchools.filter(s => s.status === 'Pending Review').length },
                    { id: 'jobs-teachers', label: 'Teacher Verification', icon: Users, count: adminTeachers.filter(t => t.status === 'Pending Review').length },
                    { id: 'jobs-posts', label: 'Job Posts Moderation', icon: Briefcase, count: adminJobs.filter(j => j.status === 'Pending Review').length },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    const isCurrent = activeNavId === sub.id || (sub.id === 'jobs-posts' && activeNavId === 'jobs-active');
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectTab(sub.id)}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-[#1a73e8] text-white shadow-2xs font-semibold'
                            : 'bg-white text-[#3c4043] hover:bg-gray-100 border border-[#dadce0]'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                        {sub.count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 1: SCHOOL VERIFICATION */}
                {activeNavId === 'jobs-schools' && (
                  <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-[#202124]">Registered Schools KYC Queue</h3>
                        <p className="text-[11px] text-[#5f6368]">Verify CBSE/ICSE affiliation codes, state NOCs and UDISE+ credentials.</p>
                      </div>
                      <span className="text-[11px] font-medium text-[#5f6368]">{adminSchools.length} Schools Listed</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                          <tr>
                            <th className="py-2 px-3">School Name &amp; City</th>
                            <th className="py-2 px-3">UDISE+ &amp; Affiliation</th>
                            <th className="py-2 px-3">Authorized Contact</th>
                            <th className="py-2 px-3">Submitted Docs</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminSchools.map((sch) => (
                            <tr key={sch.id} className="hover:bg-gray-50/80">
                              <td className="py-2.5 px-3">
                                <p className="font-semibold text-[#202124]">{sch.name}</p>
                                <p className="text-[#5f6368] text-[11px]">{sch.city}</p>
                              </td>
                              <td className="py-2.5 px-3">
                                <p className="font-mono text-[#3c4043] font-medium">{sch.udise}</p>
                                <p className="text-[#5f6368] text-[11px]">{sch.affiliation}</p>
                              </td>
                              <td className="py-2.5 px-3 text-[#3c4043]">
                                {sch.contact}
                              </td>
                              <td className="py-2.5 px-3 text-[#5f6368] text-[11px]">
                                {sch.docs}
                              </td>
                              <td className="py-2.5 px-3">
                                {sch.status === 'Verified' ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifySchool(sch.id)}
                                  className={`text-xs h-7 px-2.5 rounded-md cursor-pointer ${
                                    sch.status === 'Verified'
                                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                      : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium'
                                  }`}
                                >
                                  {sch.status === 'Verified' ? 'Revoke' : 'Verify School'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SECTION 2: TEACHER VERIFICATION (ADMIN: ptdevkaushik101@admin) */}
                {activeNavId === 'jobs-teachers' && (
                  <div className="bg-white rounded-xl border border-[#dadce0] p-4 sm:p-5 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#202124]">Faculty Registrations &amp; Verification Roster</h3>
                          <span className="text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                            Admin: ptdevkaushik101
                          </span>
                        </div>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Applicants who filled the Faculty Form. Verify credentials to grant the official &quot;Verified&quot; green badge on their card.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={loadAdminTeachers}
                          className="h-8 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={12} className={loadingTeachers ? 'animate-spin' : ''} />
                          <span>Refresh Submissions</span>
                        </Button>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {adminTeachers.length} Applicants ({adminTeachers.filter(t => !t.verified).length} Pending)
                        </span>
                      </div>
                    </div>

                    {adminTeachers.length === 0 ? (
                      <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                        <Users className="w-10 h-10 text-slate-400 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-800">No Faculty Submissions Found</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          New teacher registrations submitted on /edu-network/teachers/register will appear here in real-time for verification.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                            <tr>
                              <th className="py-3 px-3.5">Candidate Details</th>
                              <th className="py-3 px-3.5">Subject &amp; Target Role</th>
                              <th className="py-3 px-3.5">Qualifications &amp; Institute</th>
                              <th className="py-3 px-3.5">Current Status</th>
                              <th className="py-3 px-3.5 text-right">Admin Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {adminTeachers.map((tch) => {
                              const isVer = Boolean(tch.verified || tch.status === 'Verified');
                              return (
                                <tr key={tch.id || tch.slug} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-3.5">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#005689] font-bold text-xs flex items-center justify-center shrink-0">
                                        {tch.name?.charAt(0) || 'E'}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{tch.name}</p>
                                        <p className="text-slate-500 text-[11px] truncate">{tch.email || 'No email provided'}</p>
                                        <p className="text-slate-600 font-mono text-[10.5px]">{tch.phone ? `+91 ${tch.phone}` : ''} • {tch.city}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3.5 text-slate-700">
                                    <p className="font-bold text-slate-900">{tch.subject}</p>
                                    <p className="text-slate-500 text-[11px]">{tch.experience || '3+ Years Exp'}</p>
                                  </td>
                                  <td className="py-3 px-3.5 text-slate-700">
                                    <p className="font-medium">{tch.qualification || 'Post Graduate / B.Ed'}</p>
                                    <p className="text-slate-400 text-[11px] truncate max-w-xs">{tch.skills || tch.currentInstitute || 'Senior Secondary'}</p>
                                  </td>
                                  <td className="py-3 px-3.5">
                                    {isVer ? (
                                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Verified</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Under Verification</span>
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3.5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleVerifyTeacher(tch.id, tch.slug)}
                                        className={`text-xs h-7.5 px-3 rounded-lg font-bold transition cursor-pointer active:scale-95 ${
                                          isVer
                                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                        }`}
                                      >
                                        {isVer ? 'Revoke' : '✓ Verify & Grant Badge'}
                                      </Button>
                                      <Link
                                        href={`/edu-network/teachers/${tch.slug || tch.id}`}
                                        target="_blank"
                                        className="h-7.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 inline-flex items-center gap-1 text-[11px] font-semibold transition"
                                        title="View Live Card"
                                      >
                                        <ExternalLink size={12} />
                                        <span>Card</span>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 3: JOB POSTS (SCHOOL DIRECT + INDEED/LINKEDIN AGGREGATED) */}
                {(activeNavId === 'jobs-posts' || activeNavId === 'jobs-active') && (
                  <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 sm:p-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-[#202124]">Job Posts &amp; External Syndication Moderation</h3>
                        <p className="text-[11px] text-[#5f6368]">Moderation queue for direct school vacancies and jobs aggregated from LinkedIn &amp; Indeed.</p>
                      </div>

                      {/* Source Filter Pills */}
                      <div className="flex items-center gap-1 bg-[#f1f3f4] p-0.5 rounded-md border border-[#dadce0] text-xs">
                        {[
                          { id: 'all', label: 'All Feeds' },
                          { id: 'school', label: 'CSEEL Direct' },
                          { id: 'linkedin', label: 'LinkedIn' },
                          { id: 'indeed', label: 'Indeed' }
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            type="button"
                            onClick={() => setJobSourceFilter(flt.id as any)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-all ${
                              jobSourceFilter === flt.id ? 'bg-white text-blue-700 shadow-3xs font-semibold' : 'text-[#5f6368] hover:text-[#202124]'
                            }`}
                          >
                            {flt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 border-b border-[#dadce0] text-[11px] text-[#5f6368] font-semibold uppercase">
                          <tr>
                            <th className="py-2 px-3">Role &amp; Subject</th>
                            <th className="py-2 px-3">Institution &amp; Location</th>
                            <th className="py-2 px-3">Source Channel</th>
                            <th className="py-2 px-3">Salary &amp; Type</th>
                            <th className="py-2 px-3">Approval Status</th>
                            <th className="py-2 px-3 text-right">Moderation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {adminJobs
                            .filter(j => jobSourceFilter === 'all' || j.sourceType === jobSourceFilter)
                            .map((job) => (
                              <tr key={job.id} className="hover:bg-gray-50/80">
                                <td className="py-2.5 px-3">
                                  <p className="font-semibold text-[#202124]">{job.title}</p>
                                  <p className="text-[#5f6368] text-[11px]">{job.eligibility}</p>
                                </td>
                                <td className="py-2.5 px-3">
                                  <p className="font-medium text-[#202124]">{job.school}</p>
                                  <p className="text-[#5f6368] text-[11px]">{job.location}</p>
                                </td>
                                <td className="py-2.5 px-3">
                                  {job.sourceType === 'school' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                                      {job.source}
                                    </span>
                                  )}
                                  {job.sourceType === 'linkedin' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-indigo-50 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                                      {job.source}
                                    </span>
                                  )}
                                  {job.sourceType === 'indeed' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-purple-50 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                                      {job.source}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  <p className="font-medium text-[#202124]">{job.salary}</p>
                                  <p className="text-[#5f6368] text-[11px]">{job.type}</p>
                                </td>
                                <td className="py-2.5 px-3">
                                  {job.status === 'Live & Approved' ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                      <Clock className="w-3 h-3 text-amber-600" /> Needs Approval
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveJob(job.id)}
                                    className={`text-xs h-7 px-2.5 rounded-md cursor-pointer ${
                                      job.status === 'Live & Approved'
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        : 'bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium'
                                    }`}
                                  >
                                    {job.status === 'Live & Approved' ? 'Unpublish' : 'Approve & Publish'}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 5: LAB MANAGEMENT DASHBOARD LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'labs' && (
              <div className="space-y-3.5">
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-amber-600" />
                      Academic Labs &amp; Experiential Simulations
                    </h2>
                    <p className="text-[11px] text-[#5f6368]">240+ Interactive physics, chemistry, biology and robotics practicals.</p>
                  </div>
                  <Button size="sm" onClick={() => handleSwitchDashboard('cms', 'cms-editor')} className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs h-7.5 px-3 rounded-md">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Simulation
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'Physics Laboratory', count: '68 Practicals', color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
                    { name: 'Chemistry Laboratory', count: '54 Practicals', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
                    { name: 'Biology Laboratory', count: '62 Practicals', color: 'border-rose-200 bg-rose-50/50 text-rose-900' },
                    { name: 'ATL & Robotics Lab', count: '56 Practicals', color: 'border-purple-200 bg-purple-50/50 text-purple-900' }
                  ].map((stream, idx) => (
                    <div key={idx} className={`p-3.5 rounded-lg border ${stream.color} space-y-1.5`}>
                      <h4 className="font-semibold text-xs">{stream.name}</h4>
                      <p className="text-lg font-semibold">{stream.count}</p>
                      <button
                        type="button"
                        onClick={() => handleSwitchDashboard('cms', 'cms-editor')}
                        className="text-[11px] font-medium underline pt-1 block cursor-pointer"
                      >
                        Manage Experiments &gt;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 6: MEDIA MANAGEMENT DASHBOARD LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'media' && (
              <div className="space-y-3.5">
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-rose-600" />
                      Media Assets &amp; Official Publications
                    </h2>
                    <p className="text-[11px] text-[#5f6368]">Upload and manage diagram assets and video walkthroughs.</p>
                  </div>
                  <Button size="sm" className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs h-7.5 px-3 rounded-md">
                    <UploadCloud className="w-3.5 h-3.5 mr-1" /> Upload Asset
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Optical Bench Diagram.png', 'CBSE Circular 2026.pdf', 'Kolb Cycle.svg', 'Titration Curve.mp4'].map((title, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-[#dadce0] space-y-1.5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                      <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center text-[#5f6368] text-xs">
                        Asset Preview
                      </div>
                      <p className="font-medium text-xs text-[#202124] truncate">{title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 7: REPORTS & ANALYTICS (GA4 SNAPSHOT)
               ═════════════════════════════════════════════════════════════ */}
            {activeDashboard === 'reports' && (
              <div className="space-y-3.5">
                <div className="bg-white rounded-lg border border-[#dadce0] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_1px_2px_rgba(60,64,67,0.06)] relative overflow-hidden">
                  <div className="max-w-xl space-y-1.5 z-10">
                    <h2 className="text-base sm:text-lg font-semibold text-[#202124] tracking-tight">
                      Reports snapshot
                    </h2>
                    <p className="text-xs text-[#5f6368] leading-relaxed">
                      The Reports snapshot helps you monitor the performance metrics of your choice. To get started, choose one of these templates.
                    </p>
                  </div>

                  <div className="w-48 sm:w-56 h-28 shrink-0 relative flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-tr from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-100 p-2.5 flex flex-col justify-between shadow-3xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="h-1.5 w-10 bg-blue-200 rounded" />
                        </div>
                        <div className="h-1.5 w-5 bg-gray-200 rounded" />
                      </div>
                      
                      <div className="flex items-end justify-between gap-1.5 h-12 px-1">
                        <div className="w-3 bg-blue-300 rounded-t h-[40%]" />
                        <div className="w-3 bg-blue-400 rounded-t h-[65%]" />
                        <div className="w-3 bg-blue-500 rounded-t h-[85%]" />
                        <div className="w-3 bg-blue-600 rounded-t h-[50%]" />
                        <div className="w-3 bg-indigo-500 rounded-t h-[75%]" />
                        <div className="w-3 bg-purple-500 rounded-t h-[95%]" />
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-gray-400 pt-0.5 border-t border-gray-100">
                        <span>Oct 1</span>
                        <span>Oct 15</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                    Create your Reports snapshot
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 flex flex-col justify-between shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#202124]">User behaviour</h4>
                          <p className="text-[11px] text-[#5f6368] mt-0.5">
                            Get an overview of top simulation screens, user counts and engagement.
                          </p>
                        </div>
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-[#5f6368]">Labs &amp; Curriculum</span>
                        <span className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">Choose template &gt;</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 flex flex-col justify-between shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#202124]">Sales and revenue</h4>
                          <p className="text-[11px] text-[#5f6368] mt-0.5">
                            Identify top-performing apparatus kits and GeM procurement orders.
                          </p>
                        </div>
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-[#5f6368]">Procurement</span>
                        <span className="text-xs font-medium text-emerald-600 cursor-pointer hover:underline">Choose template &gt;</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 flex flex-col justify-between shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                      <div className="space-y-2">
                        <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                          <School className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[#202124]">School UDISE &amp; SARAS 49</h4>
                          <p className="text-[11px] text-[#5f6368] mt-0.5">
                            Track CBSE affiliation verification and composite lab equipment audits.
                          </p>
                        </div>
                      </div>
                      <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-[#5f6368]">Institutions</span>
                        <span className="text-xs font-medium text-purple-600 cursor-pointer hover:underline">Choose template &gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#dadce0] p-3.5 space-y-2 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                        Users in last 30 minutes
                      </h4>
                    </div>
                    <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View realtime &gt;</span>
                  </div>
                  <span className="text-2xl font-normal text-[#202124]">4,289</span>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                LAYOUT 8: HOME / ADMIN MASTER LAUNCHER LAYOUT
               ═════════════════════════════════════════════════════════════ */}
            {(activeDashboard === 'home' || activeDashboard === 'admin') && (
              <div className="space-y-3.5">
                <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] space-y-1">
                  <h2 className="text-sm font-semibold text-[#202124] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    CSEEL Master Governance Console
                  </h2>
                  <p className="text-[11px] text-[#5f6368]">
                    Click any specialized dashboard layout below to navigate:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'cms', title: 'CMS Content Studio (Editor)', desc: 'Publish blogs, lab experiments & papers', icon: Edit3, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                    { id: 'inventory', title: 'Apparatus & Inventory Dashboard', desc: 'CBSE SARAS 49 kits & stock levels', icon: Package, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                    { id: 'reports', title: 'Reports & Analytics Dashboard', desc: 'GA4 metrics, user engagement, realtime', icon: BarChart3, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                    { id: 'schools', title: 'School Management Dashboard', desc: '15L+ UDISE directory & claims', icon: School, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                    { id: 'jobs', title: 'Job & Faculty Management', desc: 'Recruit STEM mentors & teachers', icon: Briefcase, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                    { id: 'labs', title: 'Academic Lab Management', desc: 'Physics, Chemistry, Biology & ATL', icon: FlaskConical, color: 'text-rose-600 bg-rose-50 border-rose-200' }
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleSwitchDashboard(card.id as DashboardType)}
                        className="bg-white p-3.5 rounded-lg border border-[#dadce0] hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center border ${card.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[#202124] group-hover:text-blue-600 transition-colors">
                              {card.title}
                            </h4>
                            <p className="text-[11px] text-[#5f6368] mt-0.5">{card.desc}</p>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] font-medium text-blue-600 group-hover:underline">Open Layout</span>
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

                      </div>
        </main>
      </div>

      {/* 4. PUBLISH CONFIRMATION MODAL */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full border border-[#dadce0] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8fafd]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">
                  Ready to Publish Live?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-gray-600">
              <p>
                You are about to publish <strong>"{editorTitle}"</strong> to the CSEEL live portal.
              </p>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1">
                <p><strong>Format:</strong> {editorContentType.toUpperCase()}</p>
                <p><strong>Stream:</strong> {editorCategory}</p>
                <p><strong>Target Grade:</strong> {editorGrade}</p>
                <p><strong>Kolb Stage:</strong> {editorKolbStage}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Successfully published "${editorTitle}" live to CSEEL!`);
                  setShowPublishModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm &amp; Publish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}