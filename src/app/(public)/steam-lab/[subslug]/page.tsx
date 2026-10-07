import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Bot, 
  Glasses, 
  Boxes, 
  Construction, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Home, 
  Compass, 
  Download, 
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface Props {
  params: {
    subslug: string;
  };
}

const LAB_CONFIGS: Record<string, {
  title: string;
  category: string;
  subtitle: string;
  description: string;
  icon: any;
  features: string[];
  specs: string[];
}> = {
  'ai-robotics-lab': {
    title: 'AI, IoT & Robotics Lab',
    category: 'Advanced STEM 2026',
    subtitle: 'Next-gen coding, automation, microcontrollers & computer vision kits',
    description: 'Designed for Class 6 to 12 learners to design, build, and deploy real-world artificial intelligence models, Internet of Things sensor arrays, and autonomous robotics projects aligned with CBSE Skill Hub & NEP 2020.',
    icon: Bot,
    features: [
      'Arduino, Raspberry Pi & ESP32 Microcontroller kits',
      'Computer Vision, OpenCV & Machine Learning camera modules',
      'IoT Sensor Hubs (Ultrasonic, PIR, DHT11, Gas & Soil moisture)',
      'Autonomous Rover chassis, servo motors & motor drivers',
      'Hands-on block coding & Python workspace integration'
    ],
    specs: [
      'Min Space: 400 - 600 sq ft',
      'Capacity: 30 - 45 students per practical batch',
      'Power: Dedicated surge-protected workbenches',
      'Safety: ESD anti-static mats & fire retardant tool racks'
    ]
  },
  'ar-vr-lab': {
    title: 'AR / VR Immersive Lab',
    category: 'Spatial Experiential Learning',
    subtitle: 'Interactive 3D spatial simulations, holographic dissection & planetary tours',
    description: 'Brings abstract science concepts to life through virtual reality headsets and augmented reality interactive cubes, allowing students to conduct risky or microscopic practicals with 100% safety.',
    icon: Glasses,
    features: [
      'Interactive 3D stereoscopic biology dissections without specimens',
      'Virtual chemical reaction testing without hazardous fumes',
      'Space exploration, planetary orbit mechanics & astrophysics walkthroughs',
      'Multi-user collaborative virtual lab benches',
      'Teacher master dashboard with real-time student observation'
    ],
    specs: [
      'Min Space: 350 - 500 sq ft open play space',
      'Equipment: 6-12 Standalone 6-DoF VR units & AR tablets',
      'Network: Dual-band Wi-Fi 6 low-latency routing',
      'Hygiene: UV-C sanitization charging stations'
    ]
  },
  'pre-tinkering-lab': {
    title: 'Pre-Tinkering STEM Lab',
    category: 'Classes 1 to 5 Foundational Learning',
    subtitle: 'Experiential maker space designed for primary school curiosity & mechanical thinking',
    description: 'A dedicated foundational tinkering lab tailored for elementary learners. Cultivates spatial intelligence, basic electronics, simple machines, and design thinking without screen fatigue.',
    icon: Boxes,
    features: [
      'Magnetic circuit blocks & child-safe conductive play dough',
      'Wooden architectural balancing gears & pneumatic lifters',
      'Beginner origami geometry & tactile paper-circuit projects',
      'Child-safe hand tools & rounded workbench furniture',
      'NEP 2020 Foundational Stage (Jadui Pitara) aligned activities'
    ],
    specs: [
      'Min Space: 400 - 500 sq ft colorful tactile room',
      'Capacity: 25 - 35 primary learners',
      'Furniture: Modular rounded edge safety tables',
      'Storage: Color-coded bin racking for self-directed cleanup'
    ]
  }
};

export function generateStaticParams() {
  return [
    { subslug: 'ai-robotics-lab' },
    { subslug: 'ar-vr-lab' },
    { subslug: 'pre-tinkering-lab' }
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const lab = LAB_CONFIGS[params.subslug];
  const title = lab ? lab.title : 'STEAM Lab Solution';
  return {
    title: `${title} | CSEEL STEM Directorate`,
    description: lab ? lab.description : 'Explore turnkey school lab setups and experiential learning solutions by CSEEL.',
  };
}

export default function SteamLabSubpage({ params }: Props) {
  const lab = LAB_CONFIGS[params.subslug] || {
    title: params.subslug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: 'STEAM Lab Innovation',
    subtitle: 'Turnkey Lab Setup & Equipment Curriculum',
    description: 'CSEEL STEM Directorate is currently calibrating this turnkey lab specification.',
    icon: Cpu,
    features: ['Curriculum Mapping', 'Hardware Norms', 'Vendor Procurement Guidelines'],
    specs: ['Standard School Benchmarks', 'NEP 2020 Aligned']
  };

  const IconComponent = lab.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0A4B69] via-[#0E5C82] to-[#0A4B69] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-amber-300 mb-4">
            <Construction className="w-3.5 h-3.5" />
            <span>Under Active Development • 2026 Turnkey Deployment</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-sky-200 font-bold block mb-1">
                {lab.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
                {lab.title}
              </h1>
              <p className="text-sky-100 text-base md:text-lg leading-relaxed">
                {lab.description}
              </p>
            </div>

            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
              <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-[#F8A130]" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left 2 Cols: Features & Status */}
          <div className="md:col-span-2 space-y-8">
            {/* Status Notification */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  !
                </div>
                <h2 className="text-lg font-bold text-amber-900">
                  Full Interactive Simulation & BOQ Catalog Coming Soon
                </h2>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                The detailed bill of quantities (BOQ), verified GeM vendor specifications, and interactive 3D browser simulators for <strong>{lab.title}</strong> are undergoing final academic validation. In the meantime, preview the core syllabus and space benchmarks below.
              </p>
            </div>

            {/* Core Curriculum Features */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0A4B69] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F8A130]" />
                Key Equipment & Activity Modules
              </h3>
              <ul className="space-y-3">
                {lab.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Col: Specifications & Consultation */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A4B69]" />
                Lab Benchmark Norms
              </h3>
              <div className="space-y-3">
                {lab.specs.map((spec, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A4B69] to-[#08354a] text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-base font-bold text-white mb-2">
                Request Early Blueprint
              </h3>
              <p className="text-xs text-sky-200 mb-4 leading-relaxed">
                Looking to set up an {lab.title} for your school or institution before next academic session?
              </p>
              <Link
                href="/contact-us"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8A130] text-slate-950 font-bold text-xs hover:bg-[#e89425] transition-all shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Talk to Lab Architect</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Hub */}
        <div className="border-t border-slate-200 pt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/steam-lab"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A4B69] hover:underline"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to All STEAM Labs</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/virtual-lab"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Virtual Labs Tour
            </Link>
            <Link
              href="/composite-lab"
              className="px-4 py-2 rounded-xl bg-[#0A4B69] text-white text-xs font-semibold hover:bg-[#07364c]"
            >
              CBSE Composite Lab
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
