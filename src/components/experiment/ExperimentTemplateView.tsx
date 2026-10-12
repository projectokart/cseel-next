'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Share2,
  Printer,
  ShoppingCart,
  Play,
  Plus,
  Minus,
  ExternalLink,
  Check,
  Sparkles,
  Clock,
  GraduationCap,
  FlaskConical,
  Award,
  Camera,
  X,
} from 'lucide-react';
import {
  M3Button,
  M3IconButton,
  M3FAB,
  M3ChipSet,
  M3AssistChip,
  M3SuggestionChip,
  M3Card,
  M3Badge,
  M3LinearProgress,
  M3Checkbox,
  M3Tabs,
} from '@/components/google-ui';

export interface ExperimentMaterialItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  icon: 'coil' | 'magnet' | 'galvo' | 'bulb' | 'wire' | 'beaker' | 'microscope' | 'prism';
  buy: string;
  about: string;
  specs: [string, string][];
}

export interface ExperimentStepItem {
  text: string;
  observe?: string;
  safety?: string;
}

export interface ExperimentGraphData {
  title: string;
  xLabel: string;
  yLabel: string;
  points: [string, number][];
}

export interface ExperimentTemplateData {
  id?: string;
  crumb: string[];
  title: string;
  meta: string[];
  videoTitle: string;
  videoUrl?: string;
  objective: string;
  materials: ExperimentMaterialItem[];
  safety: string[];
  steps: ExperimentStepItem[];
  obsCols: string[];
  obsRows: string[][];
  conclusion: string;
  formula: string;
  interp: [string, string][];
  photoLabels: string[];
  graph: ExperimentGraphData;
  related: string[];
}

/* ---- INLINE SVG ICONS (Matching Template + Subject Apparatus) ---- */
const ICONS_SVG: Record<string, React.ReactNode> = {
  coil: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <rect x="8" y="50" width="48" height="6" rx="3" fill="#6b7d74" />
      <rect x="14" y="18" width="36" height="28" rx="6" fill="#b87333" />
      <g stroke="#e8a15a" strokeWidth="3">
        <path d="M20 18v28M26 18v28M32 18v28M38 18v28M44 18v28" />
      </g>
      <path d="M14 32H5M50 32h9" stroke="#d33" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  magnet: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <rect x="6" y="22" width="26" height="20" rx="3" fill="#d94343" />
      <rect x="32" y="22" width="26" height="20" rx="3" fill="#2f6fdb" />
      <text x="19" y="37" fontSize="13" fontWeight="800" textAnchor="middle" fill="#fff" fontFamily="sans-serif">
        N
      </text>
      <text x="45" y="37" fontSize="13" fontWeight="800" textAnchor="middle" fill="#fff" fontFamily="sans-serif">
        S
      </text>
    </svg>
  ),
  galvo: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <rect x="6" y="14" width="52" height="38" rx="6" fill="#2a3b34" />
      <path d="M14 42a18 18 0 0 1 36 0z" fill="#f4f1e6" />
      <path d="M32 42L40 24" stroke="#d33" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="42" r="3" fill="#222" />
    </svg>
  ),
  bulb: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <circle cx="32" cy="26" r="18" fill="#ffd84d" />
      <circle cx="32" cy="26" r="22" fill="none" stroke="#ffb400" strokeWidth="2" strokeDasharray="3 5" />
      <rect x="25" y="43" width="14" height="10" rx="2" fill="#6b7d74" />
      <rect x="27" y="53" width="10" height="4" rx="2" fill="#4a5a53" />
    </svg>
  ),
  wire: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <path d="M6 20c20 0 18 24 30 24s14-12 22-12" fill="none" stroke="#d33" strokeWidth="4" strokeLinecap="round" />
      <path d="M6 34c14 0 14 18 26 18" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  beaker: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <path d="M16 12h32l-3 40a4 4 0 0 1-4 4H23a4 4 0 0 1-4-4L16 12z" fill="#e3f4ea" stroke="#1f9d5c" strokeWidth="3" />
      <path d="M18 32h28l-1.5 18a2 2 0 0 1-2 2h-21a2 2 0 0 1-2-2L18 32z" fill="#3ddc84" opacity="0.65" />
      <line x1="13" y1="12" x2="51" y2="12" stroke="#123b30" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  microscope: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <rect x="14" y="50" width="36" height="6" rx="3" fill="#2a3b34" />
      <path d="M36 16a14 14 0 0 1 0 28" fill="none" stroke="#5c7a6e" strokeWidth="5" strokeLinecap="round" />
      <rect x="25" y="10" width="8" height="22" rx="2" transform="rotate(-20 29 21)" fill="#1f9d5c" />
      <line x1="20" y1="36" x2="40" y2="36" stroke="#123b30" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  prism: (
    <svg viewBox="0 0 64 64" className="w-14 h-14">
      <polygon points="32,12 12,50 52,50" fill="#e3f4ea" stroke="#1f9d5c" strokeWidth="3" strokeLinejoin="round" />
      <line x1="8" y1="34" x2="24" y2="30" stroke="#ffb400" strokeWidth="3" strokeLinecap="round" />
      <line x1="39" y1="30" x2="56" y2="24" stroke="#d94343" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="40" y1="34" x2="56" y2="34" stroke="#1f9d5c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="41" y1="38" x2="56" y2="44" stroke="#2f6fdb" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
};

export const DEFAULT_FARADAY_EXPERIMENT: ExperimentTemplateData = {
  id: 'faradays-law',
  crumb: ['Home', 'Experiments', 'Physics'],
  title: "Faraday's Law: Making electricity with a magnet",
  meta: ['Class 10', 'Physics', '20 minutes', 'Easy'],
  videoTitle: 'Experiment video',
  objective:
    'See how moving a magnet near a coil produces current without any battery, and how the speed of the magnet changes the effect.',
  materials: [
    {
      id: 'coil',
      name: 'Copper coil (200 turns)',
      qty: 1,
      price: 180,
      icon: 'coil',
      buy: '#',
      about:
        'A coil of insulated copper wire wound on a hollow core. When a magnet moves in or near it, the changing magnetic flux induces a voltage across its ends. More turns give a larger voltage.',
      specs: [
        ['Winding', 'Enamelled (insulated) copper wire'],
        ['Turns', '200'],
        ['Wire gauge', '26 SWG (about 0.46 mm)'],
        ['Core', 'Hollow, 3 cm inner diameter'],
        ['Terminals', '2 binding posts on a wooden base'],
      ],
    },
    {
      id: 'magnet',
      name: 'Bar magnet',
      qty: 1,
      price: 90,
      icon: 'magnet',
      buy: '#',
      about:
        'A permanent bar magnet with a north and a south pole. Moving it relative to the coil changes the magnetic flux through the coil, which is what induces the current.',
      specs: [
        ['Type', 'Permanent bar magnet (alnico)'],
        ['Size', '75 mm × 12 mm × 6 mm'],
        ['Poles', 'N and S marked in colour'],
        ['Care', 'Keep away from phones, cards and watches'],
      ],
    },
    {
      id: 'galvo',
      name: 'Galvanometer',
      qty: 1,
      price: 350,
      icon: 'galvo',
      buy: '#',
      about:
        'A sensitive meter that detects very small electric currents and shows their direction. Its centre-zero scale lets the needle swing left or right, so you can tell which way the current flows.',
      specs: [
        ['Type', 'Moving-coil, centre-zero'],
        ['Scale', '30-0-30 divisions'],
        ['Detects', 'Currents in the microampere range'],
        ['Terminals', '2 screw terminals (red and black)'],
        ['Case', 'Plastic, about 10 cm × 10 cm'],
      ],
    },
    {
      id: 'bulb',
      name: 'Small LED bulb',
      qty: 1,
      price: 25,
      icon: 'bulb',
      buy: '#',
      about:
        'Two small LEDs wired in opposite directions in one holder. It lights up when a small induced current flows, in either direction, so you can see the current without reading the meter.',
      specs: [
        ['Type', '2 LEDs in opposite directions (anti-parallel)'],
        ['Lights up for', 'Current in either direction'],
        ['Holder', 'Plastic holder with 2 terminals'],
        ['Handling', 'Hold by the holder, not the leads'],
      ],
    },
    {
      id: 'wire',
      name: 'Connecting wires',
      qty: 3,
      price: 60,
      icon: 'wire',
      buy: '#',
      about:
        'Insulated copper wires with crocodile clips at both ends. They join the coil, galvanometer and bulb into one closed circuit.',
      specs: [
        ['Quantity', '3 wires'],
        ['Length', '50 cm each'],
        ['Conductor', 'Stranded copper'],
        ['Ends', 'Crocodile clips'],
        ['Insulation', 'PVC'],
      ],
    },
  ],
  safety: [
    'Keep wire ends and joints covered with tape.',
    'Keep the magnet away from phones, cards and watches.',
    "Do the experiment under a teacher's supervision.",
  ],
  steps: [
    {
      text: 'Connect the coil, galvanometer and bulb in one closed circuit with the wires. Do not add a battery.',
      safety: 'Tighten the terminals and cover bare wire ends with tape.',
    },
    {
      text: 'Hold the magnet still near the coil. Watch the needle and the bulb.',
      observe:
        'Nothing happens. The needle stays at zero and the bulb stays off, because the flux through the coil is not changing.',
    },
    {
      text: 'Push the magnet quickly into the coil. Note how far the needle moves and how bright the bulb glows.',
      observe: 'The needle swings sharply to one side and the bulb glows bright.',
      safety: 'Do not slam the magnet against the coil base. Keep your fingers clear.',
    },
    {
      text: 'Now move the magnet slowly into the coil. Note the needle and the bulb again.',
      observe: 'The needle moves only a little and the bulb glows dim.',
    },
    {
      text: 'Pull the magnet out of the coil and watch the direction of the needle.',
      observe: 'The needle swings briefly the opposite way and the bulb flickers.',
    },
    {
      text: 'Fill in your observation table.',
    },
  ],
  obsCols: ['Magnet movement', 'Needle', 'Bulb'],
  obsRows: [
    ['At rest', 'Zero', 'Off'],
    ['Fast, going in', 'Large deflection', 'Bright glow'],
    ['Slow, going in', 'Small deflection', 'Dim glow'],
    ['Coming out', 'Opposite direction', 'Flickers'],
  ],
  conclusion:
    'When the magnetic flux through a coil changes, an emf (voltage) is induced in the coil. The faster the flux changes, the larger the emf.',
  formula: 'ε = −N · dΦ/dt',
  interp: [
    ['Magnet at rest', 'Flux is not changing, so emf is zero'],
    ['Fast movement', 'Flux changes quickly, so emf is larger'],
    ['Slow movement', 'Flux changes slowly, so emf is smaller'],
    ['Magnet coming out', 'Flux decreases, so current flows the other way'],
  ],
  photoLabels: ['Before the experiment', 'During the experiment', 'Result'],
  graph: {
    title: 'Needle deflection vs magnet speed',
    xLabel: 'Magnet speed',
    yLabel: 'Deflection (divisions)',
    points: [
      ['At rest', 0],
      ['Slow', 5],
      ['Medium', 11],
      ['Fast', 18],
    ],
  },
  related: ["Lenz's Law", 'Electric generator', 'Transformer'],
};

/* ---- ADAPTER: Convert ANY Experiment / Activity into ExperimentTemplateData ---- */
export function buildExperimentTemplateData(raw: any, subjectFallback?: string): ExperimentTemplateData {
  if (!raw) return DEFAULT_FARADAY_EXPERIMENT;

  // If already in ExperimentTemplateData shape
  if (Array.isArray(raw.crumb) && Array.isArray(raw.obsCols) && raw.graph) {
    return raw as ExperimentTemplateData;
  }

  const title = raw.title || DEFAULT_FARADAY_EXPERIMENT.title;
  const isFaraday =
    title.toLowerCase().includes('faraday') ||
    title.toLowerCase().includes('electromagnetic induction');

  if (isFaraday) {
    return {
      ...DEFAULT_FARADAY_EXPERIMENT,
      id: raw.id || DEFAULT_FARADAY_EXPERIMENT.id,
      title: raw.title || DEFAULT_FARADAY_EXPERIMENT.title,
    };
  }

  const subject =
    raw.subject ||
    raw.subjectName ||
    subjectFallback ||
    (raw.id?.startsWith('chem')
      ? 'Chemistry'
      : raw.id?.startsWith('bio')
      ? 'Biology'
      : raw.id?.startsWith('math')
      ? 'Mathematics'
      : 'Physics');

  const grade = raw.gradeLevel || raw.class || 'Class 10';
  const duration = raw.duration || '20 minutes';
  const difficulty = raw.difficulty || 'Easy';

  const objective =
    raw.subtitle ||
    raw.description ||
    raw.outcome ||
    raw.scientificPrinciple ||
    DEFAULT_FARADAY_EXPERIMENT.objective;

  // Parse materials
  const iconKeys: ExperimentMaterialItem['icon'][] = [
    'coil',
    'magnet',
    'galvo',
    'bulb',
    'wire',
    'beaker',
    'microscope',
    'prism',
  ];
  const samplePrices = [180, 90, 350, 120, 60, 150, 220, 95];

  let rawMaterialsList: string[] = [];
  if (Array.isArray(raw.materials)) {
    rawMaterialsList = raw.materials.map((m: any) => (typeof m === 'string' ? m : m.name || 'Lab Apparatus'));
  } else if (typeof raw.materials === 'string' && raw.materials.trim()) {
    rawMaterialsList = raw.materials
      .split(/\r?\n|,/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(raw.sections)) {
    const matSec = raw.sections.find((s: any) => s.type === 'materials');
    if (matSec && Array.isArray(matSec.rows)) {
      rawMaterialsList = matSec.rows.map((r: any) => r.name || 'Apparatus').filter(Boolean);
    }
  }

  const materials: ExperimentMaterialItem[] =
    rawMaterialsList.length > 0
      ? rawMaterialsList.map((mName, idx) => {
          const qtyMatch = mName.match(/[×x]\s*(\d+)/i);
          const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
          const cleanName = mName.replace(/[×x]\s*\d+/i, '').trim() || mName;
          const iconKey =
            subject.toLowerCase().includes('chem')
              ? idx % 2 === 0
                ? 'beaker'
                : iconKeys[idx % iconKeys.length]
              : subject.toLowerCase().includes('bio')
              ? idx === 0
                ? 'microscope'
                : iconKeys[idx % iconKeys.length]
              : iconKeys[idx % iconKeys.length];

          return {
            id: `mat-${idx}`,
            name: cleanName,
            qty,
            price: samplePrices[idx % samplePrices.length],
            icon: iconKey,
            buy: '/materials',
            about: `Laboratory-grade ${cleanName.toLowerCase()} used in the "${title}" ${subject} experiment for accurate hands-on measurement and observation.`,
            specs: [
              ['Category', `${subject} Lab Apparatus`],
              ['Grade', 'Standard Educational / NEP 2020 Lab Grade'],
              ['Quantity Required', `${qty} unit${qty > 1 ? 's' : ''}`],
              ['Handling', 'Inspect before use and clean after experiment'],
            ],
          };
        })
      : DEFAULT_FARADAY_EXPERIMENT.materials;

  // Parse steps
  let rawStepsList: string[] = [];
  if (Array.isArray(raw.steps)) {
    rawStepsList = raw.steps.map((s: any) => (typeof s === 'string' ? s : s.instruction || s.text || ''));
  } else if (typeof raw.procedure === 'string' && raw.procedure.trim()) {
    rawStepsList = raw.procedure
      .split(/\r?\n/)
      .map((s: string) => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(Boolean);
  } else if (Array.isArray(raw.sections)) {
    const procSec = raw.sections.find((s: any) => s.type === 'procedure');
    if (procSec && Array.isArray(procSec.steps)) {
      rawStepsList = procSec.steps.map((st: any) => st.instruction || st.title || '').filter(Boolean);
    }
  }

  const steps: ExperimentStepItem[] =
    rawStepsList.length > 0
      ? rawStepsList.map((stText, idx) => ({
          text: stText,
          observe:
            idx === 0
              ? 'Verify that all apparatus components are properly aligned and at baseline zero before starting.'
              : idx === Math.floor(rawStepsList.length / 2)
              ? 'Notice the distinct physical/chemical change occurring as the primary variable is adjusted.'
              : idx === rawStepsList.length - 1
              ? 'Consistent readings confirm the theoretical relationship across repeated trials.'
              : undefined,
          safety:
            idx === 0
              ? 'Ensure the workbench is clean, dry, and all safety gear is worn properly.'
              : idx === 1
              ? 'Handle apparatus gently and avoid sudden force or spills.'
              : undefined,
        }))
      : DEFAULT_FARADAY_EXPERIMENT.steps;

  // Safety list
  let safetyList: string[] = [];
  if (typeof raw.precautions === 'string' && raw.precautions.trim()) {
    safetyList = raw.precautions
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  } else if (raw.safetyLevel) {
    safetyList = [
      `${raw.safetyLevel} — follow all standard laboratory safety guidelines.`,
      'Handle all apparatus, glassware, and components with care.',
      "Perform the experiment under a teacher's or lab instructor's supervision.",
    ];
  } else {
    safetyList = DEFAULT_FARADAY_EXPERIMENT.safety;
  }

  // Formula & Conclusion
  const conclusion =
    raw.scientificPrinciple ||
    raw.outcome ||
    raw.realWorldApplication ||
    DEFAULT_FARADAY_EXPERIMENT.conclusion;

  const formula =
    raw.formula ||
    (subject.toLowerCase().includes('chem')
      ? 'C₁ · V₁ = C₂ · V₂'
      : subject.toLowerCase().includes('bio')
      ? 'Rate = ΔV / Δt'
      : subject.toLowerCase().includes('math')
      ? 'f(x) = a·x² + b·x + c'
      : DEFAULT_FARADAY_EXPERIMENT.formula);

  const obsCols = raw.obsCols || ['Trial / Condition', 'Measured Reading', 'Visual Observation'];
  const obsRows = raw.obsRows || [
    ['Baseline (Initial)', '0.0 units', 'No change observed'],
    ['Trial 1 (Low input)', '5.2 units', 'Moderate response'],
    ['Trial 2 (Medium input)', '11.0 units', 'Clear steady response'],
    ['Trial 3 (High input)', '18.4 units', 'Maximum peak response'],
  ];

  const interp: [string, string][] = raw.interp || [
    ['Baseline state', 'System is at equilibrium with zero net driving change'],
    ['Gradual increase', 'Output response scales proportionally with input variable'],
    ['Peak reading', 'Confirms the direct law described by the governing formula'],
    ['Reversed / Reset', 'System returns smoothly to initial reference state'],
  ];

  const graph: ExperimentGraphData = raw.graph || {
    title: `${title.split(':')[0]} — Response Curve`,
    xLabel: 'Input Variable (Step)',
    yLabel: 'Measured Response',
    points: [
      ['Initial', 0],
      ['Low', 5],
      ['Medium', 11],
      ['High', 18],
    ],
  };

  const related: string[] =
    Array.isArray(raw.tags) && raw.tags.length > 0
      ? raw.tags.slice(0, 4)
      : DEFAULT_FARADAY_EXPERIMENT.related;

  return {
    id: raw.id || 'exp-1',
    crumb: ['Home', 'Experiments', subject],
    title,
    meta: [grade, subject, duration, difficulty].filter(Boolean),
    videoTitle: 'Experiment video',
    videoUrl: raw.video_link || raw.videoUrl || '',
    objective,
    materials,
    safety: safetyList,
    steps,
    obsCols,
    obsRows,
    conclusion,
    formula,
    interp,
    photoLabels: ['Before the experiment', 'During the experiment', 'Result'],
    graph,
    related,
  };
}

const formatInr = (n: number) => '₹' + n.toLocaleString('en-IN');

interface ExperimentTemplateViewProps {
  data: ExperimentTemplateData;
  onSelectRelated?: (topicTitle: string) => void;
  isInsideDrawer?: boolean;
}

export default function ExperimentTemplateView({
  data,
  onSelectRelated,
  isInsideDrawer = false,
}: ExperimentTemplateViewProps) {
  // Checked materials state
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});
  // Expanded material details state (+ button)
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({});
  // Checked steps state
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  // Expanded step details state (+ button)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  // Cart state { [materialId]: count }
  const [cart, setCart] = useState<Record<string, number>>({});
  // Bottom sub-sheet state ('cart' | { type: 'item'; id: string } | null)
  const [subSheet, setSubSheet] = useState<{ mode: 'cart' } | { mode: 'item'; id: string } | null>(null);
  // Share button label state
  const [shareLabel, setShareLabel] = useState('Share');
  // Result carousel active dot index
  const [activeDot, setActiveDot] = useState(0);
  // Uploaded photos preview for the 3 slots
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<number, string>>({});

  const rcRef = useRef<HTMLDivElement>(null);

  // Reset interactive states when experiment changes
  useEffect(() => {
    setCheckedMaterials({});
    setExpandedMaterials({});
    setCheckedSteps({});
    setExpandedSteps({});
    setActiveDot(0);
  }, [data.title]);

  const totalCartCount = useMemo(
    () => Object.values(cart).reduce((acc, qty) => acc + qty, 0),
    [cart]
  );

  const totalCartPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = data.materials.find((m) => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, data.materials]);

  const completedStepsCount = useMemo(
    () => Object.values(checkedSteps).filter(Boolean).length,
    [checkedSteps]
  );

  const progressPercent = data.steps.length
    ? (completedStepsCount / data.steps.length) * 100
    : 0;

  const handleAddToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const nextQty = (prev[id] || 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: data.title, url: shareUrl });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel('Link copied');
        setTimeout(() => setShareLabel('Share'), 1500);
      }
    } catch {}
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleResultScroll = () => {
    const el = rcRef.current;
    if (!el) return;
    const leftEdge = el.getBoundingClientRect().left;
    let bestIdx = 0;
    let bestDist = 1e9;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - leftEdge);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    setActiveDot(bestIdx);
  };

  const handlePhotoUpload = (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPhotos((prev) => ({ ...prev, [slotIndex]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Render SVG Graph matching template's graph(g) function
  const renderSvgGraph = (g: ExperimentGraphData) => {
    const W = 300;
    const H = 210;
    const L = 38;
    const R = 14;
    const T = 16;
    const B = 44;
    const pw = W - L - R;
    const ph = H - T - B;
    const maxVal = Math.max(...g.points.map((p) => p[1]), 1) * 1.15;
    const n = g.points.length;
    const getX = (i: number) => L + pw * (n === 1 ? 0.5 : i / (n - 1));
    const getY = (v: number) => T + ph * (1 - v / maxVal);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));
    const polyPoints = g.points.map((p, i) => `${getX(i)},${getY(p[1])}`).join(' ');

    return (
      <svg className="exp-gr" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={g.title}>
        {ticks.map((v, idx) => (
          <g key={idx}>
            <line x1={L} x2={W - R} y1={getY(v)} y2={getY(v)} stroke="var(--exp-line)" />
            <text x={L - 6} y={getY(v) + 4} textAnchor="end" fontSize="10" fill="var(--exp-soft)">
              {v}
            </text>
          </g>
        ))}
        <polyline
          points={polyPoints}
          fill="none"
          stroke="var(--exp-g)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {g.points.map((p, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(p[1])}
              r="5"
              fill="var(--exp-y)"
              stroke="var(--exp-g)"
              strokeWidth="2"
            />
            <text
              x={getX(i)}
              y={getY(p[1]) - 10}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="var(--exp-ink)"
            >
              {p[1]}
            </text>
            <text
              x={getX(i)}
              y={H - B + 16}
              textAnchor="middle"
              fontSize="11"
              fill="var(--exp-soft)"
            >
              {p[0]}
            </text>
          </g>
        ))}
        <text
          x={L + pw / 2}
          y={H - 6}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--exp-ink)"
        >
          {g.xLabel}
        </text>
        <text
          transform="rotate(-90)"
          x={-(T + ph / 2)}
          y="11"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--exp-ink)"
        >
          {g.yLabel}
        </text>
      </svg>
    );
  };

  const selectedSheetItem =
    subSheet?.mode === 'item' ? data.materials.find((m) => m.id === subSheet.id) : null;

  return (
    <div className="exp-template-root">
      <style>{`
        .exp-template-root {
          --exp-bg: #f8fafd;
          --exp-card: #ffffff;
          --exp-ink: #1f1f1f;
          --exp-soft: #444746;
          --exp-line: #dde3ea;
          --exp-g: #0b57d0;
          --exp-gs: #eef3fc;
          --exp-y: #f59e0b;
          --exp-ys: #fef7e0;
          --exp-yt: #5f370e;
          --exp-onG: #ffffff;
          background: var(--exp-bg);
          color: var(--exp-ink);
          font: 15.5px/1.6 'Google Sans', 'Inter', system-ui, sans-serif;
          -webkit-text-size-adjust: 100%;
          min-height: ${isInsideDrawer ? 'auto' : '100vh'};
          box-sizing: border-box;
        }
        .exp-template-root * {
          box-sizing: border-box;
        }
        .exp-wrap {
          max-width: 780px;
          margin: 0 auto;
          padding: 16px 16px 48px;
        }
        .exp-crumb {
          font-size: 13px;
          font-weight: 500;
          color: var(--exp-soft);
          display: flex;
          flex-wrap: wrap;
          gap: 4px 8px;
          margin: 4px 0 10px;
        }
        .exp-template-root h1.exp-h1 {
          font-size: clamp(24px, 5.5vw, 36px);
          line-height: 1.2;
          margin: 0 0 14px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--exp-ink) !important;
        }
        .exp-acts {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
        }
        .exp-template-root h2.exp-h2 {
          font-size: 19px;
          margin: 0 0 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--exp-ink) !important;
        }
        .exp-video {
          aspect-ratio: 16/9;
          border-radius: 16px;
          background: linear-gradient(135deg, #041e49 0%, #0b57d0 60%, #00639b 100%);
          display: grid;
          place-items: center;
          color: #fff;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
        }
        .exp-video b {
          position: absolute;
          left: 16px;
          bottom: 14px;
          font-size: 14px;
          font-weight: 600;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: 999px;
        }
        .exp-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .exp-list li {
          border-bottom: 1px solid var(--exp-line);
        }
        .exp-list li:last-child {
          border: 0;
        }
        .exp-chk {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 52px;
          padding: 8px 0;
          cursor: pointer;
          flex: 1;
          min-width: 0;
        }
        .exp-chk input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: var(--exp-g);
          flex: none;
          cursor: pointer;
          border-radius: 4px;
        }
        .exp-chk .exp-q {
          margin-left: auto;
          font-weight: 600;
          font-size: 13px;
          color: #0b57d0;
          background: #eef3fc;
          padding: 2px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .exp-chk.checked span {
          opacity: 0.55;
          text-decoration: line-through;
        }
        .exp-safety h2.exp-h2,
        .exp-safety li {
          color: var(--exp-yt) !important;
        }
        .exp-safety ul {
          margin: 0;
          padding-left: 20px;
        }
        .exp-safety li {
          margin-bottom: 6px;
          font-weight: 600;
        }
        .exp-pt {
          font-size: 13px;
          font-weight: 500;
          color: var(--exp-soft);
          margin: 8px 0 10px;
        }
        .exp-steps .exp-chk {
          align-items: flex-start;
          padding: 12px 0;
        }
        .exp-n {
          flex: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--exp-g);
          color: var(--exp-onG);
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 13.5px;
          transition: background 0.2s, color 0.2s;
        }
        .exp-chk.checked .exp-n {
          background: #c2e7ff;
          color: #001d35;
        }
        .exp-tw {
          overflow-x: auto;
          border: 1px solid var(--exp-line);
          border-radius: 12px;
        }
        .exp-tw table {
          border-collapse: collapse;
          width: 100%;
          min-width: 420px;
        }
        .exp-tw th,
        .exp-tw td {
          padding: 10px 14px;
          text-align: left;
          border-bottom: 1px solid var(--exp-line);
          font-size: 14.5px;
        }
        .exp-tw th {
          background: var(--exp-gs);
          color: #041e49;
          font-weight: 700;
        }
        .exp-tw tr:last-child td {
          border-bottom: 0;
        }
        .exp-tw td[contenteditable="true"] {
          background: #fef7e0;
          outline: 0;
        }
        .exp-tw td[contenteditable="true"]:focus {
          box-shadow: inset 0 0 0 2px var(--exp-g);
          background: #ffffff;
        }
        .exp-hint {
          font-size: 13px;
          color: var(--exp-soft);
          margin: 10px 0 0 !important;
        }
        .exp-formula {
          background: var(--exp-gs);
          color: #041e49;
          border: 1px solid #d3e3fd;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          margin: 4px 0;
          overflow-x: auto;
          white-space: nowrap;
        }
        .exp-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .exp-steps .exp-row {
          align-items: flex-start;
        }
        .exp-xp {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
        }
        .exp-xp.open {
          grid-template-rows: 1fr;
        }
        .exp-xi {
          overflow: hidden;
          min-height: 0;
        }
        .exp-xc {
          padding: 4px 0 14px 42px;
          display: grid;
          gap: 10px;
        }
        .exp-xc.pd {
          padding-left: 32px;
        }
        .exp-bx {
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
        }
        .exp-bx b {
          display: block;
          font-size: 13.5px;
          margin-bottom: 2px;
        }
        .exp-bx p {
          margin: 0 !important;
        }
        .exp-bx.ob {
          background: var(--exp-gs);
          color: #041e49;
          border: 1px solid #d3e3fd;
        }
        .exp-bx.sa {
          background: var(--exp-ys);
          color: var(--exp-yt);
          border: 1px solid #fde68a;
        }
        .exp-pdt {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .exp-pic {
          flex: none;
          width: 76px;
          height: 76px;
          border-radius: 16px;
          background: var(--exp-gs);
          border: 1px solid #d3e3fd;
          display: grid;
          place-items: center;
        }
        .exp-nm {
          display: block;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
        }
        .exp-pr {
          font-weight: 700;
          color: var(--exp-g);
          margin: 2px 0 4px;
        }
        .exp-sl {
          display: block;
          font-size: 14px;
          font-weight: 700;
          margin: 2px 0 0;
        }
        .exp-ab {
          margin: 0 !important;
          font-size: 14px;
          color: var(--exp-soft);
          line-height: 1.5;
        }
        .exp-spec {
          margin: 0;
          border: 1px solid var(--exp-line);
          border-radius: 12px;
          overflow: hidden;
        }
        .exp-spec div {
          display: grid;
          grid-template-columns: 36% 1fr;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--exp-line);
          font-size: 13.5px;
        }
        .exp-spec div:last-child {
          border: 0;
        }
        .exp-spec dt {
          color: var(--exp-soft);
          font-weight: 600;
        }
        .exp-spec dd {
          margin: 0;
        }
        .exp-sf {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 6px;
        }
        .exp-rc {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0 10px;
          scrollbar-width: none;
        }
        .exp-rc::-webkit-scrollbar {
          display: none;
        }
        .exp-rcd {
          flex: 0 0 86%;
          max-width: 440px;
          scroll-snap-align: start;
          border: 1px solid var(--exp-line);
          border-radius: 16px;
          padding: 16px;
          background: var(--exp-card);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .exp-rcd p {
          margin: 0 !important;
        }
        .exp-rcd table {
          min-width: 0;
        }
        .exp-rcd th,
        .exp-rcd td {
          padding: 8px 10px;
          font-size: 13.5px;
        }
        .exp-gr {
          width: 100%;
          height: auto;
          display: block;
        }
        .exp-ph3 {
          flex: 1;
          display: grid;
          grid-template-rows: repeat(3, 1fr);
          gap: 8px;
          min-height: 280px;
        }
        .exp-photo {
          border: 2px dashed #c4c7c5;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: var(--exp-soft);
          padding: 8px;
          min-height: 84px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .exp-photo:hover {
          border-color: var(--exp-g);
          background: var(--exp-gs);
          color: var(--exp-g);
        }
        .exp-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
        }
        .exp-dots i {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #c4c7c5;
          transition: background 0.2s, width 0.2s;
        }
        .exp-dots i.on {
          background: var(--exp-g);
          width: 22px;
        }
        /* Official M3 Bottom Sub-Sheet */
        .exp-bk {
          position: fixed;
          inset: 0;
          z-index: 1250;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(2px);
        }
        .exp-sh {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1260;
          height: 38vh;
          min-height: 260px;
          max-width: 780px;
          margin: 0 auto;
          background: #f8fafd;
          border: 1px solid var(--exp-line);
          border-bottom: 0;
          border-radius: 28px 28px 0 0;
          box-shadow: 0 -12px 36px rgba(15, 23, 42, 0.25);
          padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          animation: expSheetUp 0.22s cubic-bezier(0.2, 0, 0, 1);
        }
        @keyframes expSheetUp {
          from {
            transform: translateY(40%);
            opacity: 0.4;
          }
          to {
            transform: none;
            opacity: 1;
          }
        }
        .exp-sb {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: 8px;
        }
        .exp-crow {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid var(--exp-line);
          font-size: 14.5px;
        }
        .exp-crow:last-child {
          border: 0;
        }
        .exp-crow b {
          flex: 1;
          min-width: 0;
        }
        @media (min-width: 640px) {
          .exp-wrap {
            padding: 24px 24px 64px;
          }
        }
        @media print {
          .exp-acts,
          .exp-video,
          .exp-sh,
          .exp-bk {
            display: none !important;
          }
          .exp-xp {
            grid-template-rows: 1fr !important;
          }
          .exp-rc {
            display: block;
            overflow: visible;
          }
          .exp-rcd {
            max-width: none;
            margin-bottom: 10px;
          }
          .exp-dots {
            display: none;
          }
        }
      `}</style>

      <div className="exp-wrap">
        {/* Breadcrumb */}
        <nav className="exp-crumb" aria-label="Breadcrumb">
          {data.crumb.join(' › ')}
        </nav>

        {/* Title */}
        <h1 className="exp-h1">{data.title}</h1>

        {/* Official Google M3 Assist Chips for Metadata */}
        <M3ChipSet className="mb-4">
          {data.meta.map((m, idx) => {
            const chipIcon =
              idx === 0 ? (
                <GraduationCap className="w-4 h-4" />
              ) : idx === 1 ? (
                <FlaskConical className="w-4 h-4" />
              ) : idx === 2 ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Award className="w-4 h-4" />
              );
            return <M3AssistChip key={idx} label={m} icon={chipIcon} />;
          })}
        </M3ChipSet>

        {/* Official Google M3 Buttons: Share, Print, Cart */}
        <div className="exp-acts">
          <M3Button
            variant="filled"
            size="md"
            leadingIcon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            {shareLabel}
          </M3Button>

          <M3Button
            variant="outlined"
            size="md"
            leadingIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print
          </M3Button>

          <M3Button
            variant="tonal"
            size="md"
            leadingIcon={<ShoppingCart className="w-4 h-4" />}
            trailingIcon={
              totalCartCount > 0 ? <M3Badge count={totalCartCount} /> : undefined
            }
            onClick={() => setSubSheet({ mode: 'cart' })}
          >
            Cart
          </M3Button>
        </div>

        {/* 1. Video Section inside Official M3Card */}
        <M3Card variant="outlined" className="p-4 sm:p-5 mb-4 bg-white">
          <div className="exp-video">
            <M3FAB
              variant="primary"
              size="lg"
              icon={<Play className="w-7 h-7 fill-current ml-0.5" />}
              ariaLabel="Play experiment video"
            />
            <b>{data.videoTitle}</b>
          </div>
        </M3Card>

        {/* 2. Objective Section inside Official M3Card */}
        <M3Card variant="outlined" className="p-5 sm:p-6 mb-4 bg-white">
          <h2 className="exp-h2">What you will learn</h2>
          <p className="text-[#444746] leading-relaxed m-0">{data.objective}</p>
        </M3Card>

        {/* 3. Materials Section inside Official M3Card */}
        <M3Card variant="outlined" className="p-5 sm:p-6 mb-4 bg-white">
          <h2 className="exp-h2">Materials needed</h2>
          <ul className="exp-list exp-mt">
            {data.materials.map((m) => {
              const isChecked = !!checkedMaterials[m.id];
              const isOpen = !!expandedMaterials[m.id];
              const addedCount = cart[m.id] || 0;

              return (
                <li key={m.id}>
                  <div className="exp-row">
                    <div
                      className={`exp-chk ${isChecked ? 'checked' : ''}`}
                      onClick={() =>
                        setCheckedMaterials((prev) => ({
                          ...prev,
                          [m.id]: !prev[m.id],
                        }))
                      }
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <M3Checkbox
                          checked={isChecked}
                          onChange={() =>
                            setCheckedMaterials((prev) => ({
                              ...prev,
                              [m.id]: !prev[m.id],
                            }))
                          }
                        />
                      </div>
                      <span className="font-medium text-[#1f1f1f]">{m.name}</span>
                      <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                        <M3AssistChip label={`Qty × ${m.qty}`} />
                      </div>
                    </div>
                    <M3IconButton
                      variant={isOpen ? 'tonal' : 'outlined'}
                      size="sm"
                      selected={isOpen}
                      ariaLabel={`Show details for ${m.name}`}
                      icon={
                        <Plus
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-45' : ''
                          }`}
                        />
                      }
                      onClick={() =>
                        setExpandedMaterials((prev) => ({
                          ...prev,
                          [m.id]: !prev[m.id],
                        }))
                      }
                    />
                  </div>

                  <div className={`exp-xp ${isOpen ? 'open' : ''}`}>
                    <div className="exp-xi">
                      <div className="exp-xc pd">
                        <div className="exp-pdt">
                          <div className="exp-pic">
                            {ICONS_SVG[m.icon] || ICONS_SVG.coil}
                          </div>
                          <div>
                            <b className="exp-nm">{m.name}</b>
                            <div className="exp-pr">{formatInr(m.price)}</div>
                          </div>
                        </div>
                        <b className="exp-sl">What is it?</b>
                        <p className="exp-ab">{m.about}</p>
                        <b className="exp-sl">Specifications</b>
                        <dl className="exp-spec">
                          {m.specs.map((s, sIdx) => (
                            <div key={sIdx}>
                              <dt>{s[0]}</dt>
                              <dd>{s[1]}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="exp-sf">
                          <M3Button
                            variant="outlined"
                            size="sm"
                            leadingIcon={<ExternalLink className="w-4 h-4" />}
                            onClick={() => {
                              if (typeof window !== 'undefined' && m.buy) {
                                window.open(m.buy, m.buy !== '#' ? '_blank' : '_self');
                              }
                            }}
                          >
                            Buy link
                          </M3Button>
                          <M3Button
                            variant={addedCount > 0 ? 'tonal' : 'filled'}
                            size="sm"
                            leadingIcon={
                              addedCount > 0 ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <ShoppingCart className="w-4 h-4" />
                              )
                            }
                            onClick={() => handleAddToCart(m.id)}
                          >
                            {addedCount > 0 ? `Added (${addedCount})` : 'Add to cart'}
                          </M3Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="exp-hint">
            Tick items as you collect them. Tap + to see the product, specifications and buy options.
          </p>
        </M3Card>

        {/* 4. Safety Section inside Official M3Card */}
        <M3Card
          variant="filled"
          className="exp-safety p-5 sm:p-6 mb-4 bg-[#fef7e0] border border-[#fde68a]"
        >
          <h2 className="exp-h2">Stay safe</h2>
          <ul>
            {data.safety.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </M3Card>

        {/* 5. Steps Section inside Official M3Card with M3LinearProgress & M3Checkbox */}
        <M3Card variant="outlined" className="exp-steps p-5 sm:p-6 mb-4 bg-white">
          <h2 className="exp-h2">Steps</h2>
          <M3LinearProgress value={progressPercent} />
          <div className="exp-pt">
            {completedStepsCount} of {data.steps.length} steps done
          </div>

          <ul className="exp-list">
            {data.steps.map((s, idx) => {
              const hasDetails = Boolean(s.observe || s.safety);
              const isChecked = !!checkedSteps[idx];
              const isOpen = !!expandedSteps[idx];

              return (
                <li key={idx}>
                  <div className="exp-row">
                    <div
                      className={`exp-chk ${isChecked ? 'checked' : ''}`}
                      onClick={() =>
                        setCheckedSteps((prev) => ({
                          ...prev,
                          [idx]: !prev[idx],
                        }))
                      }
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <M3Checkbox
                          checked={isChecked}
                          onChange={() =>
                            setCheckedSteps((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                        />
                      </div>
                      <b className="exp-n">{idx + 1}</b>
                      <span className="text-[#1f1f1f]">{s.text}</span>
                    </div>

                    {hasDetails && (
                      <div className="mt-2">
                        <M3IconButton
                          variant={isOpen ? 'tonal' : 'outlined'}
                          size="sm"
                          selected={isOpen}
                          ariaLabel={`Show details for step ${idx + 1}`}
                          icon={
                            <Plus
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isOpen ? 'rotate-45' : ''
                              }`}
                            />
                          }
                          onClick={() =>
                            setExpandedSteps((prev) => ({
                              ...prev,
                              [idx]: !prev[idx],
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  {hasDetails && (
                    <div className={`exp-xp ${isOpen ? 'open' : ''}`}>
                      <div className="exp-xi">
                        <div className="exp-xc">
                          {s.observe && (
                            <div className="exp-bx ob">
                              <b>Observation</b>
                              <p>{s.observe}</p>
                            </div>
                          )}
                          {s.safety && (
                            <div className="exp-bx sa">
                              <b>Safety</b>
                              <p>{s.safety}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="exp-hint">
            Tap + on a step to see what you will observe and any safety tips.
          </p>
        </M3Card>

        {/* 6. Record Your Observations Section */}
        <M3Card variant="outlined" className="p-5 sm:p-6 mb-4 bg-white">
          <h2 className="exp-h2">Record your observations</h2>
          <div className="exp-tw">
            <table>
              <thead>
                <tr>
                  {data.obsCols.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.obsRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        contentEditable={cIdx > 0}
                        suppressContentEditableWarning
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="exp-hint">Tap a highlighted cell to write your own observation.</p>
        </M3Card>

        {/* 7. Result and Conclusion Section with Official M3Tabs */}
        <M3Card variant="outlined" className="p-5 sm:p-6 mb-4 bg-white">
          <h2 className="exp-h2">Result and conclusion</h2>

          <div className="mb-3 rounded-t-xl overflow-hidden border border-[#dde3ea]">
            <M3Tabs
              variant="primary"
              iconPosition="inline"
              tabs={[
                { id: '0', label: 'Conclusion & Formula' },
                { id: '1', label: 'Response Curve' },
                { id: '2', label: 'Lab Photos' },
              ]}
              activeId={String(activeDot)}
              onChange={(tabId) => {
                const idx = Number(tabId);
                setActiveDot(idx);
                const el = rcRef.current;
                if (el && el.children[idx]) {
                  (el.children[idx] as HTMLElement).scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                  });
                }
              }}
            />
          </div>

          <div className="exp-rc" ref={rcRef} onScroll={handleResultScroll}>
            {/* Slide 1: Conclusion + Formula + Interpretation Table */}
            <div className="exp-rcd">
              <p className="text-[#444746]">{data.conclusion}</p>
              <div className="exp-formula">{data.formula}</div>
              <div className="exp-tw">
                <table>
                  <thead>
                    <tr>
                      <th>Observation</th>
                      <th>What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.interp.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Slide 2: SVG Line Graph */}
            <div className="exp-rcd">
              <b className="exp-sl">{data.graph.title}</b>
              {renderSvgGraph(data.graph)}
              <p className="exp-hint">Sample readings. Replace with your own results.</p>
            </div>

            {/* Slide 3: Experiment Photos */}
            <div className="exp-rcd">
              <b className="exp-sl">Experiment photos</b>
              <div className="exp-ph3">
                {data.photoLabels.map((lbl, idx) => (
                  <label key={idx} className="exp-photo">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoUpload(idx, e)}
                    />
                    {uploadedPhotos[idx] ? (
                      <img
                        src={uploadedPhotos[idx]}
                        alt={lbl}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px',
                        }}
                      />
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c2e7ff] text-[#001d35] font-semibold text-xs">
                        <Camera className="w-4 h-4" />
                        <span>{lbl}</span>
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="exp-dots" aria-hidden="true">
            {[0, 1, 2].map((dIdx) => (
              <i key={dIdx} className={activeDot === dIdx ? 'on' : ''} />
            ))}
          </div>
        </M3Card>

        {/* 8. Related Experiments Section using Official M3SuggestionChip */}
        <M3Card variant="outlined" className="p-5 sm:p-6 bg-white">
          <h2 className="exp-h2">More experiments</h2>
          <M3ChipSet>
            {data.related.map((relTitle, idx) => (
              <M3SuggestionChip
                key={idx}
                label={relTitle}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => {
                  if (onSelectRelated) {
                    onSelectRelated(relTitle);
                  }
                }}
              />
            ))}
          </M3ChipSet>
        </M3Card>
      </div>

      {/* Cart / Material Sub-Sheet Overlay */}
      {subSheet && (
        <>
          <div className="exp-bk" onClick={() => setSubSheet(null)} />
          <aside
            className="exp-sh"
            role="dialog"
            aria-modal="true"
            aria-label="Cart and product details"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="m-0 text-lg font-bold text-[#1f1f1f]">
                {subSheet.mode === 'cart' ? 'Your Experiment Kit Cart' : selectedSheetItem?.name}
              </h3>
              <M3IconButton
                variant="standard"
                size="sm"
                icon={<X className="w-4 h-4" />}
                ariaLabel="Close cart sheet"
                onClick={() => setSubSheet(null)}
              />
            </div>

            {subSheet.mode === 'cart' && (
              <>
                <div className="exp-sb">
                  {Object.keys(cart).length === 0 ? (
                    <p style={{ color: 'var(--exp-soft)', fontSize: '14px', margin: '4px 0' }}>
                      Your cart is empty. Tap + next to an item and click Add to cart.
                    </p>
                  ) : (
                    Object.entries(cart).map(([id, qty]) => {
                      const item = data.materials.find((m) => m.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="exp-crow">
                          <b>{item.name}</b>
                          <M3IconButton
                            variant="outlined"
                            size="sm"
                            ariaLabel="Decrease quantity"
                            icon={<Minus className="w-3.5 h-3.5" />}
                            onClick={() => handleUpdateCartQty(id, -1)}
                          />
                          <span className="font-bold min-w-[20px] text-center">{qty}</span>
                          <M3IconButton
                            variant="outlined"
                            size="sm"
                            ariaLabel="Increase quantity"
                            icon={<Plus className="w-3.5 h-3.5" />}
                            onClick={() => handleUpdateCartQty(id, 1)}
                          />
                          <span className="font-bold text-[#0b57d0] min-w-[64px] text-right">
                            {formatInr(item.price * qty)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="exp-sf items-center justify-between border-t border-[#dde3ea] pt-3 mt-2">
                  <b className="text-base text-[#1f1f1f]">
                    Total: <span className="text-[#0b57d0]">{formatInr(totalCartPrice)}</span>
                  </b>
                  <M3Button
                    variant="filled"
                    size="md"
                    onClick={() => setSubSheet(null)}
                  >
                    Continue
                  </M3Button>
                </div>
              </>
            )}

            {subSheet.mode === 'item' && selectedSheetItem && (
              <>
                <div className="exp-sb" style={{ display: 'flex', gap: '12px' }}>
                  <div className="exp-pic">
                    {ICONS_SVG[selectedSheetItem.icon] || ICONS_SVG.coil}
                  </div>
                  <div>
                    <div className="exp-pr">{formatInr(selectedSheetItem.price)}</div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '18px',
                        fontSize: '13.5px',
                        color: 'var(--exp-soft)',
                        lineHeight: 1.45,
                      }}
                    >
                      {selectedSheetItem.specs.map((s, idx) => (
                        <li key={idx}>
                          {s[0]}: {s[1]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="exp-sf">
                  <M3Button
                    variant="outlined"
                    size="sm"
                    leadingIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => {
                      if (typeof window !== 'undefined' && selectedSheetItem.buy) {
                        window.open(selectedSheetItem.buy, '_blank');
                      }
                    }}
                  >
                    Buy link
                  </M3Button>
                  <M3Button
                    variant="filled"
                    size="sm"
                    leadingIcon={<ShoppingCart className="w-4 h-4" />}
                    onClick={() => handleAddToCart(selectedSheetItem.id)}
                  >
                    Add to cart
                  </M3Button>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  );
}
