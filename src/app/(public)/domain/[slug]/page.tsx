'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Download, 
  FlaskConical, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  GraduationCap, 
  Building, 
  School, 
  BadgeCheck, 
  Plus, 
  X, 
  CheckCircle2,
  Cpu,
  Palette,
  Sparkles,
  Layers,
  Wrench,
  Bot
} from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SubjectOverview {
  title: string;
  desc: string;
  image: string;
  link: string;
}

interface SampleModule {
  title: string;
  topic: string;
  stream: string;
  type: string;
  image: string;
  link: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface DomainConfig {
  slug: string;
  eyebrow: string;
  titlePrefix: string;
  highlightWord: string;
  titleSuffix: string;
  lead: string;
  heroImage: string;
  trustLine: string;
  whyEyebrow: string;
  whyHeading: string;
  whyPoints: Array<{ icon: any; title: string; desc: string }>;
  libEyebrow: string;
  libHeading: string;
  subjects: SubjectOverview[];
  sampleEyebrow: string;
  sampleHeading: string;
  filterStreams: string[];
  sampleModules: SampleModule[];
  tutorEyebrow: string;
  tutorHeading: string;
  tutorLead: string;
  tutorChatLines: string[];
  tutorImage: string;
  whoEyebrow: string;
  whoHeading: string;
  whoCards: Array<{ icon: any; title: string; desc: string }>;
  standardsHeading: string;
  standardsLead: string;
  faqs: FAQItem[];
  caseStudies: Array<{ institute: string; title: string; desc: string; link: string }>;
  otherDisciplines: Array<{ title: string; href: string }>;
  ctaHeading: string;
  ctaSub: string;
}

// ─── DOMAIN DATA SETS ─────────────────────────────────────────────────────────

const DOMAIN_DATA: Record<string, DomainConfig> = {
  science: {
    slug: 'science',
    eyebrow: 'VR Labs · Sciences',
    titlePrefix: 'Virtual reality labs for ',
    highlightWord: 'science',
    titleSuffix: ' education.',
    lead: 'Virtual reality (VR) experiments in physics, chemistry, botany, and zoology that students can run anytime, repeat infinitely, and learn from — without consumables, breakage, or scheduling constraints. Curriculum-aligned, assessment-ready, AI-guided.',
    heroImage: 'https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif',
    trustLine: 'Recognised by Meta · ISO Certified · 10+ years in EdTech',
    whyEyebrow: 'Why VR',
    whyHeading: 'What VR adds to science labs.',
    whyPoints: [
      {
        icon: FlaskConical,
        title: 'No consumables, no breakage',
        desc: 'Run chemistry experiments without chemicals, physics practicals without equipment failures.',
      },
      {
        icon: Users,
        title: 'Every student gets a bench',
        desc: 'No more three students per apparatus. Every learner runs the full experiment independently.',
      },
      {
        icon: ShieldCheck,
        title: 'Safe failure',
        desc: 'Students explore what happens when they get it wrong. Errors teach without consequences.',
      },
      {
        icon: BarChart3,
        title: 'Data and assessment built in',
        desc: 'Automatic measurement capture, lab report scaffolding, and faculty analytics.',
      },
    ],
    libEyebrow: 'The science library',
    libHeading: 'Core Science & Mathematics Subjects. One Integrated Platform.',
    subjects: [
      {
        title: 'Physics',
        desc: 'Run hands-on experiments across classical mechanics, ray optics, circuit electricity, electromagnetism, and wave phenomena. Students set up apparatus, vary parameters, and observe live physical laws.',
        image: '/images/categories/physics.jpg',
        link: '/subject/physics',
      },
      {
        title: 'Chemistry',
        desc: 'Carry out full chemistry experiments — acid-base titrations, reaction kinetics, molecular synthesis, and gas laws with zero chemical waste, no breakage, and absolute laboratory safety.',
        image: '/images/categories/chemistry.jpg',
        link: '/subject/chemistry',
      },
      {
        title: 'Biology & Life Sciences',
        desc: 'Investigate living systems through high-magnification optical microscopy, cell division mitosis, plant histology, photosynthesis, and mammalian anatomical structures.',
        image: '/images/hero/biology-hero-desktop.jpg',
        link: '/subject/biology',
      },
      {
        title: 'Mathematics & Spatial Geometry',
        desc: 'Transform abstract equations into interactive 3D spatial models. Explore conic sections, 3D coordinate geometry, calculus slopes, trigonometry, and statistics through visual manipulatives.',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/math',
      },
    ],
    sampleEyebrow: 'The library',
    sampleHeading: 'Explore Experiments Across Science & Mathematics.',
    filterStreams: ['All', 'Physics', 'Chemistry', 'Biology', 'Mathematics'],
    sampleModules: [
      {
        title: 'Cell Division & Mitosis Under Magnification',
        topic: 'Cytology & Mitosis Stages',
        stream: 'Biology',
        type: 'Experiment',
        image: '/images/hero/biology-mitosis-desktop.jpg',
        link: '/subject/biology',
      },
      {
        title: 'Plant Cellular Structure & Stomata',
        topic: 'Optical Microscopy & Botany',
        stream: 'Biology',
        type: 'Experiment',
        image: '/images/hero/biology-hero-desktop.jpg',
        link: '/subject/biology',
      },
      {
        title: '3D Spatial Geometry & Conic Sections',
        topic: 'Parabolas, Ellipses & Hyperbolas',
        stream: 'Mathematics',
        type: 'Interactive Model',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/math',
      },
      {
        title: 'Visual Calculus: Derivatives & Rate of Change',
        topic: 'Curves, Tangents & Differential Slopes',
        stream: 'Mathematics',
        type: 'Simulation',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/math',
      },
      {
        title: "Ohm's Law & Circuit Analysis",
        topic: 'Current Electricity & Resistance',
        stream: 'Physics',
        type: 'Experiment',
        image: '/images/hero/physics-circuit-desktop.jpg',
        link: '/subject/physics',
      },
      {
        title: 'Ray Optics: Refraction Through Lenses & Prisms',
        topic: 'Dispersion & Focal Lengths',
        stream: 'Physics',
        type: 'Experiment',
        image: '/images/hero/physics-optics-desktop.jpg',
        link: '/subject/physics',
      },
      {
        title: 'Acid-Base Titration & Neutralization',
        topic: 'Analytical Chemistry & Molarity',
        stream: 'Chemistry',
        type: 'Experiment',
        image: '/images/categories/chemistry.jpg',
        link: '/subject/chemistry',
      },
      {
        title: 'Chemical Kinetics & Reaction Rates',
        topic: 'Catalysis & Activation Energy',
        stream: 'Chemistry',
        type: 'Experiment',
        image: '/images/categories/chemistry-card-2.png',
        link: '/subject/chemistry',
      },
      {
        title: 'Rat Dissection & Anatomy Alternative',
        topic: 'Mammalian Comparative Anatomy',
        stream: 'Biology',
        type: 'Experiment',
        image: '/images/categories/biology.jpg',
        link: '/subject/biology',
      },
    ],
    tutorEyebrow: 'Meet 7thi',
    tutorHeading: 'An AI tutor for every experiment.',
    tutorLead: '7thi inside science modules prompts hypotheses, checks predictions against results, and adapts to each student\'s mastery. Faculty configure the depth: foundation practicals or advanced research-level analysis.',
    tutorChatLines: [
      "You've measured the current. What do you predict will happen when you double the resistance?",
      "The titration has reached the endpoint. Can you identify the colour change?",
      "Let's compare your photosynthesis readings with the theoretical yield curve.",
      "Shall we repeat the pendulum experiment at a different amplitude to inspect damping?"
    ],
    tutorImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=700&auto=format&fit=crop',
    whoEyebrow: 'Who it\'s for',
    whoHeading: 'Built for science faculties.',
    whoCards: [
      {
        icon: GraduationCap,
        title: 'Universities',
        desc: 'BSc, MSc, and integrated science degree programmes with rigorous research modules.',
      },
      {
        icon: Building,
        title: 'Colleges & Institutes',
        desc: 'Diploma, polytechnic, and applied science practicals requiring frequent repetitive hands-on practice.',
      },
      {
        icon: School,
        title: 'Schools adopting VR',
        desc: 'Senior secondary and high school CBSE, ICSE, and state board science laboratories.',
      },
    ],
    standardsHeading: 'Mapped to science curricula.',
    standardsLead: 'Every science module is aligned to recognized curricula including NEP 2020, CBSE, ICSE, and international frameworks. We work directly with your faculty to verify syllabus alignment before deployment.',
    faqs: [
      {
        q: 'Which science subjects does CSEEL cover?',
        a: 'Physics, chemistry, botany, zoology, and mathematics. Modules range from foundational experiments (Ohm\'s Law, titrations, cell structure) to advanced topics (spectroscopy, plant physiology, comparative anatomy). The library grows quarterly.',
      },
      {
        q: 'Can VR science labs replace physical practicals?',
        a: 'For some experiments, yes — especially where consumables are expensive, equipment is limited, or the experiment is hazardous. For others, VR is best used as pre-lab preparation so students arrive at the physical lab already competent.',
      },
      {
        q: 'Are modules aligned to Indian science curricula?',
        a: 'Yes. Modules map to NEP 2020, CBSE, ICSE, NAAC, NBA, and university-specific syllabi. We verify alignment with your faculty before deployment.',
      },
      {
        q: 'How does assessment work in science modules?',
        a: 'Each module includes embedded assessment — measurement accuracy, procedure adherence, and concept questions. Results appear on the faculty analytics dashboard, exportable to your LMS.',
      },
      {
        q: 'Do students need VR headsets for science modules?',
        a: 'No. Every module runs directly in any modern browser on laptop, tablet, or smartboard without a headset. VR headsets enhance the immersive experience but aren\'t required to start.',
      },
    ],
    caseStudies: [
      {
        institute: 'IIT Delhi & Premier Institutions',
        title: 'WebXR labs, served on campus at scale.',
        desc: 'Browser-based VR modules rolled out across undergraduate programmes and integrated with campus LMS — zero special hardware required.',
        link: '/about',
      },
      {
        institute: 'Across 500+ Partner Institutions',
        title: 'Browse all deployments & case studies.',
        desc: 'See how institutions across India are putting CSEEL virtual labs to work to elevate practical science outcomes.',
        link: '/about',
      },
    ],
    otherDisciplines: [
      { title: 'Engineering & Technology', href: '/domain/engineering' },
      { title: 'Art & Design STEAM', href: '/domain/art' },
    ],
    ctaHeading: 'See the science library in 30 minutes.',
    ctaSub: 'Tailored to your science curriculum, your student cohort, and your laboratory constraints.',
  },

  engineering: {
    slug: 'engineering',
    eyebrow: 'VR Labs · Engineering',
    titlePrefix: 'Virtual reality labs for ',
    highlightWord: 'engineering',
    titleSuffix: ' & technical education.',
    lead: 'Virtual reality engineering modules spanning robotics, IoT, mechanical mechanisms, electrical machines, and civil structures that students can build, test, and iterate on — without expensive machinery or physical danger.',
    heroImage: '/images/categories/engineering.jpg',
    trustLine: 'NEP 2020 Aligned · ATL Ready · 500+ Engineering Labs',
    whyEyebrow: 'Why Virtual Engineering',
    whyHeading: 'What virtual labs add to engineering colleges.',
    whyPoints: [
      {
        icon: Wrench,
        title: 'Zero machine downtime',
        desc: 'Test high-voltage machines, CNC routers, and heavy mechanisms without maintenance bottlenecks.',
      },
      {
        icon: Users,
        title: 'Individual workbench for all',
        desc: 'Every engineering student gets their own oscilloscope, robotic arm, and PLC programmer.',
      },
      {
        icon: ShieldCheck,
        title: 'Safe high-risk experimentation',
        desc: 'Simulate short-circuits, structural overloads, and chemical combustion with complete physical safety.',
      },
      {
        icon: BarChart3,
        title: 'Telemetry & real-time analytics',
        desc: 'Real-time sensor logs, MATLAB-compatible CSV exports, and automated design validation.',
      },
    ],
    libEyebrow: 'The engineering library',
    libHeading: 'Four engineering disciplines. One platform.',
    subjects: [
      {
        title: 'Robotics & Automation',
        desc: 'Program 6-DOF industrial robot arms, kinematic inverse solvers, and autonomous path planners in high-precision WebGL virtual workspaces.',
        image: '/images/categories/technology.jpg',
        link: '/subject/technology',
      },
      {
        title: 'Electronics & IoT',
        desc: 'Wire microcontroller breadboards, sensor arrays, ESP32 modules, and wireless telemetry pipelines with live oscilloscope signal tracing.',
        image: '/images/categories/engineering.jpg',
        link: '/subject/technology',
      },
      {
        title: 'Mechanical & Fluid Power',
        desc: 'Dissect four-stroke internal combustion engines, gear trains, hydraulic actuators, and wind turbine aerodynamics in exploded 3D views.',
        image: '/images/categories/engineering.jpg',
        link: '/subject/engineering',
      },
      {
        title: 'Civil & Structural Design',
        desc: 'Conduct tensile strain tests on concrete beams, bridge truss deflection analyses, and total station topographical surveying virtually.',
        image: '/images/categories/technology.jpg',
        link: '/subject/engineering',
      },
    ],
    sampleEyebrow: 'The library',
    sampleHeading: 'A sample of the engineering library.',
    filterStreams: ['All', 'Robotics', 'Electronics', 'Mechanical', 'Civil'],
    sampleModules: [
      {
        title: '6-Axis Industrial Robotic Arm',
        topic: 'Forward & Inverse Kinematics',
        stream: 'Robotics',
        type: 'Simulation',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop',
        link: '/subject/engineering',
      },
      {
        title: 'Arduino & Sensor Telemetry',
        topic: 'Embedded Systems & C++',
        stream: 'Electronics',
        type: 'Experiment',
        image: '/images/categories/technology.jpg',
        link: '/subject/technology',
      },
      {
        title: 'Truss Bridge Structural Load Testing',
        topic: 'Finite Element Stress Deflection',
        stream: 'Civil',
        type: 'Simulation',
        image: '/images/categories/engineering.jpg',
        link: '/subject/engineering',
      },
      {
        title: 'Four-Stroke Diesel Engine Cycle',
        topic: 'Thermodynamics & PV Indicator',
        stream: 'Mechanical',
        type: 'Experiment',
        image: '/images/categories/engineering.jpg',
        link: '/subject/engineering',
      },
      {
        title: 'Smart Home IoT Sensor Network',
        topic: 'MQTT & Cloud Data Visualisation',
        stream: 'Electronics',
        type: 'Experiment',
        image: '/images/categories/technology.jpg',
        link: '/subject/technology',
      },
      {
        title: 'Hydraulic Actuator Circuit',
        topic: 'Fluid Power Control & Valves',
        stream: 'Mechanical',
        type: 'Simulation',
        image: '/images/categories/engineering.jpg',
        link: '/subject/engineering',
      },
    ],
    tutorEyebrow: 'Meet 7thi',
    tutorHeading: 'An AI engineering mentor for every simulation.',
    tutorLead: '7thi guides future engineers through systematic debugging, structural safety limits, and circuit logic validation — stepping in when motors stall or circuits burn.',
    tutorChatLines: [
      "The motor draw exceeds 2.5A. Which PWM duty cycle will bring it back into nominal torque range?",
      "Truss member BC is under compression. Check if the buckling factor satisfies Eurocode/IS-800.",
      "The baud rate matches, but parity bits are misaligned. Let's inspect the UART packet frame.",
      "What happens to the turbine torque curve when you adjust the blade pitch angle to 15 degrees?"
    ],
    tutorImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop',
    whoEyebrow: 'Who it\'s for',
    whoHeading: 'Built for engineering & technical institutions.',
    whoCards: [
      {
        icon: GraduationCap,
        title: 'Engineering Universities',
        desc: 'B.Tech, M.Tech, and polytechnic programmes across Mechanical, Civil, Electrical, and CSE streams.',
      },
      {
        icon: Building,
        title: 'Atal Tinkering Labs (ATLs)',
        desc: 'Hands-on maker modules mapped to NITI Aayog ATL tinkering challenges and regional hackathons.',
      },
      {
        icon: School,
        title: 'STEM & Vocational Schools',
        desc: 'Classes 8–12 introducing real-world coding, mechatronics, sensors, and design thinking.',
      },
    ],
    standardsHeading: 'Mapped to AICTE & NBA frameworks.',
    standardsLead: 'Modules strictly map to AICTE model curricula, NBA Outcome Based Education (OBE) criteria, and NEP 2020 skill verticals.',
    faqs: [
      {
        q: 'What engineering disciplines does CSEEL support?',
        a: 'Mechanical, civil, electrical, electronics & communication, robotics, AI & IoT. Our simulations cover foundational labs (fluid mechanics, strength of materials, digital electronics) through advanced mechatronics.',
      },
      {
        q: 'Does it support Atal Tinkering Labs (ATLs)?',
        a: 'Yes, 100%. Our platform includes dedicated ATL learning paths covering 3D printing design, microcontroller coding, sensors, and maker challenges aligned with AIM guidelines.',
      },
      {
        q: 'Do students need CAD software installed?',
        a: 'No. Everything runs via browser WebGL engines. Students can interact with CAD assemblies, slice models, and run physics simulations without installing software.',
      },
      {
        q: 'Can faculty export assessment records for NBA accreditation?',
        a: 'Yes. All student experiment logs, error iterations, and quiz completions map to course outcomes (COs) and program outcomes (POs) for automated NBA reporting.',
      },
    ],
    caseStudies: [
      {
        institute: 'Premier Technical Institutes',
        title: 'Virtual Robotics & IoT on Campus.',
        desc: 'Eliminated hardware waiting queues in mechatronics labs, doubling student hands-on coding repetitions.',
        link: '/about',
      },
      {
        institute: 'Atal Tinkering Lab Network',
        title: 'Nationwide ATL Maker Deployment.',
        desc: 'Equipped over 200+ schools with virtual breadboards and IoT prototypes before physical fabrication.',
        link: '/about',
      },
    ],
    otherDisciplines: [
      { title: 'Science & Mathematics', href: '/domain/science' },
      { title: 'Art & Design STEAM', href: '/domain/art' },
    ],
    ctaHeading: 'Tour the engineering workbench in 30 minutes.',
    ctaSub: 'Experience interactive virtual engineering labs tailored to your institutional syllabus.',
  },

  art: {
    slug: 'art',
    eyebrow: 'VR Labs · Art & STEAM',
    titlePrefix: 'Creative STEAM labs for ',
    highlightWord: 'art & design',
    titleSuffix: ' education.',
    lead: 'Virtual reality and interactive STEAM environments where color physics, photochemistry, generative geometry, and bio-art converge — empowering students to explore the deep science behind visual creation.',
    heroImage: '/images/categories/art.jpg',
    trustLine: 'NEP 2020 Experiential Learning · Holistic STEAM · Cross-Discipline',
    whyEyebrow: 'Why Creative STEAM',
    whyHeading: 'Why science belongs in the art studio.',
    whyPoints: [
      {
        icon: Palette,
        title: 'Color physics & spectroscopy',
        desc: 'Learn pigment chemistry, RGB vs CMYK color spaces, and photon wavelength absorption first-hand.',
      },
      {
        icon: Sparkles,
        title: 'Design thinking in 3D',
        desc: 'Iterative prototyping, user empathy mapping, and spatial ergonomics explored without material limits.',
      },
      {
        icon: Layers,
        title: 'Photochemistry & darkroom science',
        desc: 'Silver halide reactions, cyanotype sun printing, and camera obscura optics with zero toxic chemicals.',
      },
      {
        icon: BarChart3,
        title: 'Cross-disciplinary portfolios',
        desc: 'Students graduate with both scientific reasoning and striking visual design work for admissions portfolios.',
      },
    ],
    libEyebrow: 'The STEAM library',
    libHeading: 'Four creative domains. One platform.',
    subjects: [
      {
        title: 'Color Physics & Light Optics',
        desc: 'Investigate prism dispersion, complementary color mixing, subtractive pigment matrices, and retinal cone responses in an interactive optical workbench.',
        image: '/images/categories/art.jpg',
        link: '/subject/art',
      },
      {
        title: 'Photochemistry & Cyanotype',
        desc: 'Simulate UV-sensitive emulsion chemistry, light exposures, and chemical fixer washes — observing photolytic reactions safely.',
        image: '/images/categories/art.jpg',
        link: '/subject/art',
      },
      {
        title: 'Sacred Geometry & Math Art',
        desc: 'Generate Fibonacci spirals, fractals, tessellations, and Islamic geometric patterns using computational mathematical algorithms.',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/mathematics',
      },
      {
        title: 'Bio-Art & Organic Pigments',
        desc: 'Extract chlorophyll, anthocyanins, and bio-dyes from botanicals, studying pH-dependent pigment shifts across alkaline and acidic ranges.',
        image: '/images/categories/biology.jpg',
        link: '/subject/art',
      },
    ],
    sampleEyebrow: 'The library',
    sampleHeading: 'A sample of the creative STEAM library.',
    filterStreams: ['All', 'Color Physics', 'Photochemistry', 'Math Art', 'Bio-Art'],
    sampleModules: [
      {
        title: 'Additive vs Subtractive Color Mixing',
        topic: 'Wave Optics & Spectrophotometry',
        stream: 'Color Physics',
        type: 'Experiment',
        image: '/images/categories/art.jpg',
        link: '/subject/art',
      },
      {
        title: 'Cyanotype Photochemical Sun Print',
        topic: 'UV Iron Salt Photolysis',
        stream: 'Photochemistry',
        type: 'Experiment',
        image: '/images/categories/art.jpg',
        link: '/subject/art',
      },
      {
        title: 'Golden Ratio & Spiral Harmonics',
        topic: 'Geometry & Visual Proportion',
        stream: 'Math Art',
        type: 'Simulation',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/mathematics',
      },
      {
        title: 'Anthocyanin Natural pH Indicators',
        topic: 'Red Cabbage Botanical Dye Chemistry',
        stream: 'Bio-Art',
        type: 'Experiment',
        image: '/images/categories/chemistry.jpg',
        link: '/subject/chemistry',
      },
      {
        title: 'Camera Obscura & Pinhole Optics',
        topic: 'Focal Length & Inverted Real Images',
        stream: 'Color Physics',
        type: 'Simulation',
        image: '/images/categories/physics.jpg',
        link: '/subject/physics',
      },
      {
        title: 'Tessellations & Fractal Dimensions',
        topic: 'M.C. Escher Symmetry Mathematics',
        stream: 'Math Art',
        type: 'Simulation',
        image: '/images/categories/mathematics.jpg',
        link: '/subject/mathematics',
      },
    ],
    tutorEyebrow: 'Meet 7thi',
    tutorHeading: 'An AI mentor for creative & scientific inquiry.',
    tutorLead: '7thi prompts design students to uncover the underlying scientific laws behind aesthetic outcomes, connecting art theory to chemistry and physics.',
    tutorChatLines: [
      "Notice how the cyan dye deepens as you increase UV exposure. What is happening to the ferric ammonium citrate?",
      "Why does mixing yellow and cyan pigment produce green, but mixing yellow and cyan light yields white?",
      "Let's calculate the golden spiral divergence angle. How does nature use this in sunflower seed arrangements?",
      "The anthocyanin changed from crimson red to deep teal. What does this reveal about your solution's pH level?"
    ],
    tutorImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop',
    whoEyebrow: 'Who it\'s for',
    whoHeading: 'Built for progressive educators & design faculties.',
    whoCards: [
      {
        icon: GraduationCap,
        title: 'Design & Architecture Colleges',
        desc: 'Foundation courses in light, materiality, color science, and structural prototyping.',
      },
      {
        icon: Building,
        title: 'STEAM Innovation Hubs',
        desc: 'Interdisciplinary makerspaces blending digital media, creative coding, and physical sciences.',
      },
      {
        icon: School,
        title: 'K-12 Progressive Schools',
        desc: 'Fulfilling NEP 2020 arts-integrated learning mandates with hands-on experiential modules.',
      },
    ],
    standardsHeading: 'Aligned to NEP 2020 Arts-Integrated Pedagogy.',
    standardsLead: 'Our modules fulfill national mandates for experiential learning, encouraging students to combine analytical rigor with creative synthesis.',
    faqs: [
      {
        q: 'What is STEAM and why is it important?',
        a: 'STEAM integrates Arts into STEM (Science, Technology, Engineering, Mathematics). Research demonstrates that combining creative design with scientific inquiry boosts concept retention, spatial intelligence, and innovation ability.',
      },
      {
        q: 'Do students need specialized art supplies?',
        a: 'No. All modules run in the browser with interactive chemical synthesizers, virtual light spectrophotometers, and parametric design canvases. Zero consumables required.',
      },
      {
        q: 'Is this aligned with CBSE or ICSE curriculum?',
        a: 'Yes. All modules map directly to NCERT/CBSE Art-Integrated Learning (AIL) guidelines and NEP 2020 competency-based learning outcomes.',
      },
      {
        q: 'Can students export high-resolution portfolio artifacts?',
        a: 'Yes! Students can export publication-grade PNG images, SVG vector paths, and lab reports complete with scientific formulas and visual outputs.',
      },
    ],
    caseStudies: [
      {
        institute: 'Leading Design Academies',
        title: 'Color Spectroscopy in Foundation Year.',
        desc: 'Replaced expensive darkroom chemicals with virtual photochemistry, saving schools budget while increasing student experimentation.',
        link: '/about',
      },
      {
        institute: 'Arts-Integrated K-12 Schools',
        title: 'NEP 2020 STEAM Pilots.',
        desc: 'Over 120+ partner schools introduced bio-art and fractal geometry, reporting a 34% increase in student engagement.',
        link: '/about',
      },
    ],
    otherDisciplines: [
      { title: 'Science & Mathematics', href: '/domain/science' },
      { title: 'Engineering & Technology', href: '/domain/engineering' },
    ],
    ctaHeading: 'Experience creative STEAM labs in 30 minutes.',
    ctaSub: 'A walkthrough tailored to your institution, your art curriculum, and your student cohort.',
  },
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function DomainPage({ params }: { params: { slug: string } }) {
  const currentSlug = params?.slug?.toLowerCase() || 'science';
  const defaultDomain = DOMAIN_DATA[currentSlug] || DOMAIN_DATA['science'];
  const [domain, setDomain] = useState<DomainConfig>(defaultDomain);

  // Fetch dynamic domain content from API/Database
  useEffect(() => {
    fetch(`/api/cms?page=domain:${currentSlug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          const api = json.data;
          setDomain((prev) => ({
            ...prev,
            eyebrow: api.eyebrow || prev.eyebrow,
            titlePrefix: api.title ? api.title.split(' ')[0] + ' ' : prev.titlePrefix,
            lead: api.lead || api.description || prev.lead,
            heroImage: api.heroImage || prev.heroImage,
            ...(api.sections?.whyPoints ? { whyPoints: api.sections.whyPoints } : {}),
            ...(api.customFields?.faqs ? { faqs: api.customFields.faqs } : {}),
          }));
        }
      })
      .catch((err) => console.error('Failed to load domain from CMS:', err));
  }, [currentSlug]);

  // Active filter stream for sample catalogue
  const [activeStream, setActiveStream] = useState<string>('All');
  
  // Chat cycle state
  const [activeChatIdx, setActiveChatIdx] = useState<number>(0);

  // Brochure modal state
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [brochureSubmitted, setBrochureSubmitted] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', institution: '' });

  // Rotate chat bubble prompt every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveChatIdx((prev) => (prev + 1) % domain.tutorChatLines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [domain.tutorChatLines.length]);

  // Reset stream when domain changes
  useEffect(() => {
    setActiveStream('All');
    setActiveChatIdx(0);
  }, [currentSlug]);

  const filteredModules = activeStream === 'All'
    ? domain.sampleModules
    : domain.sampleModules.filter((m) => m.stream.toLowerCase() === activeStream.toLowerCase());

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBrochureSubmitted(true);
    setTimeout(() => {
      setShowBrochureModal(false);
      setBrochureSubmitted(false);
      setLeadForm({ name: '', email: '', phone: '', institution: '' });
    }, 2500);
  };

  return (
    <main id="main" data-screen-label={`${domain.titlePrefix} subject page`} className="min-h-screen bg-white">
      
      {/* ── SECTION 1: HERO (bg-white sec-pad) ─────────────────────────── */}
      <section className="bg-white sec-pad" aria-labelledby="hero-h1">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="grid gap-10 items-start lg:grid-cols-12 lg:gap-14">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              <p className="hero-eyebrow mb-6">{domain.eyebrow}</p>
              
              <h1 className="hero-h1 mb-7" id="hero-h1">
                {domain.titlePrefix}
                <span className="text-[#005689]">{domain.highlightWord}</span>
                {domain.titleSuffix}
              </h1>
              
              <p className="hero-lead mb-9 max-w-[560px]">
                {domain.lead}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  href="/contact-us"
                  className="btn btn-primary inline-flex items-center gap-2 px-6 py-3.5 bg-[#005689] text-white rounded-xl font-bold text-sm hover:bg-[#0D4979] shadow-btn transition-all"
                >
                  Book a demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  href="/virtual-lab"
                  className="btn btn-secondary inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#005689] border border-[#005689] rounded-xl font-bold text-sm hover:bg-[#EDF5FA] transition-all"
                >
                  Explore modules
                </Link>
                
                <button
                  type="button"
                  onClick={() => setShowBrochureModal(true)}
                  className="btn inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#005689] border border-[#005689] rounded-xl font-bold text-sm hover:bg-[#EDF5FA] transition-all cursor-pointer"
                  style={{ outline: '1px solid #005689' }}
                >
                  <Download className="w-4 h-4 text-[#005689]" />
                  Download brochure
                </button>
              </div>
              
              <p className="text-slate-muted font-medium tracking-wide text-[13px]">
                {domain.trustLine}
              </p>
            </div>

            {/* Right Hero Image Column */}
            <div className="lg:col-span-6">
              <div className="thumb-zoom shadow-card rounded-card overflow-hidden">
                <img
                  className="w-full aspect-[4/3] object-cover"
                  src={domain.heroImage}
                  alt={`${domain.highlightWord} virtual laboratory in action`}
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: WHY VR (bg-tint sec-pad) ────────────────────────── */}
      <section className="bg-tint sec-pad" aria-labelledby="why-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="mb-14 max-w-[760px] lg:mb-16">
            <p className="eyebrow mb-4">{domain.whyEyebrow}</p>
            <h2 id="why-h" className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] tracking-tight">
              {domain.whyHeading}
            </h2>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            {domain.whyPoints.map((point, idx) => {
              const IconComp = point.icon;
              return (
                <article
                  key={idx}
                  className="lift bg-white rounded-card shadow-card p-7 border lg:p-9 border-rule/60 hover:shadow-card-hi transition-all"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-[#005689] mb-5 bg-[#005689]/10">
                    <IconComp className="w-6 h-6 text-[#005689]" />
                  </span>
                  <h3 className="text-xl font-bold text-[#0D4979] mb-3">
                    {point.title}
                  </h3>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    {point.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SUBJECT LIBRARY (bg-white sec-pad) ─────────────── */}
      <section className="bg-white sec-pad" aria-labelledby="cats-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="mb-14 max-w-[760px] lg:mb-16">
            <p className="eyebrow mb-4">{domain.libEyebrow}</p>
            <h2 id="cats-h" className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] tracking-tight">
              {domain.libHeading}
            </h2>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            {domain.subjects.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.link}
                className="lift block bg-white rounded-card shadow-card border overflow-hidden border-rule/60 flex flex-col justify-between group hover:border-[#005689]/40 hover:shadow-card-hi transition-all"
              >
                <div className="p-7 pb-5 lg:p-8">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-2xl font-bold text-[#0D4979] group-hover:text-[#005689] transition-colors">
                      {sub.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#005689] group-hover:translate-x-1 transition-transform shrink-0">
                      Explore Labs <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-slate-body text-[15px] leading-relaxed">
                    {sub.desc}
                  </p>
                </div>
                <div className="px-7 pb-7 lg:px-8 lg:pb-8">
                  <div className="thumb-zoom rounded-xl overflow-hidden shadow-sm">
                    <img
                      className="w-full object-cover aspect-[16/9] group-hover:scale-104 transition-transform duration-500"
                      src={sub.image}
                      alt={sub.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SAMPLE CATALOGUE (bg-tint sec-pad) ──────────────── */}
      <section className="bg-tint sec-pad" aria-labelledby="catalogue-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-end lg:mb-10">
            <div>
              <p className="eyebrow mb-4">{domain.sampleEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] tracking-tight !mb-0" id="catalogue-h">
                {domain.sampleHeading}
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 font-bold text-[#005689] group flex-shrink-0 hover:text-[#0D4979] transition-colors"
              href="/virtual-lab"
            >
              See all modules
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stream Filter Chips */}
          <div className="flex flex-wrap mb-10 gap-2.5">
            {domain.filterStreams.map((st) => {
              const isActive = activeStream.toLowerCase() === st.toLowerCase();
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setActiveStream(st)}
                  className={`discipline-chip ${isActive ? 'is-active' : ''}`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Module Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {filteredModules.map((m, idx) => (
              <Link
                key={idx}
                href={m.link}
                className="lift block bg-white rounded-card shadow-card border border-rule/60 overflow-hidden group hover:border-[#005689]/40 transition-all"
              >
                <div className="thumb-zoom rounded-none overflow-hidden aspect-[16/10] bg-[#EDF5FA]">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="w-full h-full object-cover !rounded-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[17px] font-bold text-[#0D4979] mb-2 leading-snug group-hover:text-[#005689] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-slate-body mb-3 text-[14px]">
                    {m.topic}
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[12px]">
                    <span className="px-2.5 py-1 rounded-full bg-[#005689]/10 text-[#005689] font-bold">
                      {m.stream}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rule text-slate-body font-semibold">
                      {m.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 5: MEET 7THI / AI TUTOR (bg-white sec-pad) ─────────── */}
      <section className="bg-white sec-pad" aria-labelledby="thi-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="grid gap-10 items-center lg:grid-cols-12 lg:gap-14">
            
            {/* Left Prompt & Cycle */}
            <div className="lg:col-span-6">
              <p className="eyebrow mb-4">{domain.tutorEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] mb-5 tracking-tight" id="thi-h">
                {domain.tutorHeading}
              </h2>
              <p className="text-slate-body text-base leading-relaxed mb-7">
                {domain.tutorLead}
              </p>

              {/* Chat Cycle Bubble */}
              <div className="chat-cycle relative mb-7 min-h-[110px]">
                <div className="chat-bubble">
                  <div className="who flex items-center gap-1.5">
                    <span className="text-[#D71F27] font-black text-sm">7</span>thi
                    <span className="text-[10px] text-slate-400 font-normal">· Real-time inquiry prompt</span>
                  </div>
                  <p className="transition-all duration-300 italic font-medium text-slate-800">
                    &ldquo;{domain.tutorChatLines[activeChatIdx]}&rdquo;
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-bold text-[#005689] group hover:text-[#0D4979] transition-colors"
              >
                See how AI Tutor works
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-6">
              <div className="thumb-zoom shadow-card-hi rounded-card overflow-hidden">
                <img
                  className="w-full object-cover aspect-[16/10]"
                  src={domain.tutorImage}
                  alt="AI Tutor prompting students during interactive experiment"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 6: WHO IT'S FOR (bg-tint sec-pad) ──────────────────── */}
      <section className="bg-tint sec-pad" aria-labelledby="builtfor-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="mb-14 max-w-[760px] lg:mb-16">
            <p className="eyebrow mb-4">{domain.whoEyebrow}</p>
            <h2 id="builtfor-h" className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] tracking-tight">
              {domain.whoHeading}
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {domain.whoCards.map((c, idx) => {
              const IconComp = c.icon;
              return (
                <article
                  key={idx}
                  className="lift bg-white rounded-card shadow-card p-7 border lg:p-9 border-rule/60 hover:shadow-card-hi transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-[#005689] mb-5 bg-[#005689]/10">
                      <IconComp className="w-6 h-6 text-[#005689]" />
                    </span>
                    <h3 className="text-xl font-bold text-[#0D4979] mb-3">
                      {c.title}
                    </h3>
                    <p className="text-slate-body text-[15px] leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CURRICULUM STANDARDS (bg-white sec-pad) ─────────── */}
      <section className="bg-white sec-pad" aria-labelledby="curr-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="grid gap-10 items-center lg:grid-cols-12 lg:gap-16">
            
            <div className="lg:col-span-6">
              <p className="eyebrow mb-4">Standards</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] mb-5 tracking-tight" id="curr-h">
                {domain.standardsHeading}
              </h2>
              <p className="text-slate-body text-base leading-relaxed mb-8">
                {domain.standardsLead}
              </p>
              <Link
                className="inline-flex items-center gap-2 font-bold text-[#005689] group hover:text-[#0D4979] transition-colors"
                href="/contact-us"
              >
                Request a syllabus map for your institution
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="lift bg-white rounded-card shadow-card border p-5 border-rule/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="font-bold text-[#0D4979] leading-none text-[19px]">NEP 2020</div>
                    <BadgeCheck className="w-5 h-5 text-[#005689]" />
                  </div>
                  <div className="text-slate-muted leading-snug text-[12.5px]">
                    India · Experiential &amp; Competency-Based Learning
                  </div>
                </div>

                <div className="lift bg-white rounded-card shadow-card border p-5 border-rule/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="font-bold text-[#0D4979] leading-none text-[19px]">CBSE &amp; ICSE</div>
                    <BadgeCheck className="w-5 h-5 text-[#005689]" />
                  </div>
                  <div className="text-slate-muted leading-snug text-[12.5px]">
                    National · Practical Laboratory Syllabi Alignment
                  </div>
                </div>

                <div className="lift bg-white rounded-card shadow-card border p-5 border-rule/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="font-bold text-[#0D4979] leading-none text-[19px]">NAAC &amp; NBA</div>
                    <BadgeCheck className="w-5 h-5 text-[#005689]" />
                  </div>
                  <div className="text-slate-muted leading-snug text-[12.5px]">
                    Higher Ed · Course &amp; Program Outcome Analytics
                  </div>
                </div>

                <div className="lift bg-white rounded-card shadow-card border p-5 border-rule/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="font-bold text-[#0D4979] leading-none text-[19px]">ISO 9001:2015</div>
                    <BadgeCheck className="w-5 h-5 text-[#005689]" />
                  </div>
                  <div className="text-slate-muted leading-snug text-[12.5px]">
                    Certified Quality · Lab Safety Standards
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 8: FAQ ACCORDION (bg-tint sec-pad) ─────────────────── */}
      <section className="bg-tint sec-pad" aria-labelledby="faq-h">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <div className="grid gap-12 items-start lg:grid-cols-12 lg:gap-16">
            
            {/* Sticky Left Column */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow mb-4">Common questions</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] mb-5 tracking-tight" id="faq-h">
                  Questions faculties ask us.
                </h2>
                <p className="text-slate-body mb-7 leading-relaxed text-[15px]">
                  For procurement, IT, and curriculum-mapping questions, our academic team is one message away.
                </p>
                <Link
                  className="inline-flex items-center gap-2 font-bold text-[#005689] group hover:text-[#0D4979] transition-colors"
                  href="/contact-us"
                >
                  Talk to us
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Accordion Details */}
            <div className="lg:col-span-7 space-y-3">
              {domain.faqs.map((faq, idx) => (
                <details key={idx} className="faq" open={idx === 0}>
                  <summary>
                    <span>{faq.q}</span>
                    <Plus className="w-5 h-5 text-[#005689] shrink-0" />
                  </summary>
                  <p className="answer">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 9: IN PRACTICE / CASE STUDIES (bg-white sec-pad) ───── */}
      <section className="bg-white sec-pad border-t border-rule">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10">
          <p className="eyebrow mb-4">In practice</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D4979] mb-8 tracking-tight">
            See how institutions use CSEEL for {domain.highlightWord}.
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {domain.caseStudies.map((cs, idx) => (
              <Link
                key={idx}
                href={cs.link}
                className="lift block bg-white rounded-card shadow-card border p-7 group border-rule/60 hover:border-[#005689]/40 transition-all"
              >
                <p className="eyebrow mb-2">{cs.institute}</p>
                <h3 className="text-xl font-bold text-[#0D4979] mb-2 group-hover:text-[#005689] transition-colors">
                  {cs.title}
                </h3>
                <p className="text-slate-body mb-4 text-[14px] leading-relaxed">
                  {cs.desc}
                </p>
                <span className="inline-flex items-center font-bold text-[#005689] gap-1.5 text-[14px]">
                  Read the case study
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: EXPLORE OTHER DISCIPLINES (bg-tint py-10) ──────── */}
      <section className="bg-tint py-12 border-t border-rule">
        <div className="mx-auto px-6 max-w-[1280px] lg:px-10 text-center">
          <p className="text-slate-body mb-6 font-bold text-[15px] uppercase tracking-wider text-slate-500">
            Explore other disciplines
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {domain.otherDisciplines.map((od, idx) => (
              <Link
                key={idx}
                className="btn btn-secondary text-[14px] px-6 py-3 bg-white hover:bg-[#EDF5FA] rounded-xl border border-[#005689] text-[#005689] font-bold shadow-2xs hover:shadow-xs transition-all"
                href={od.href}
              >
                {od.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: FINAL CTA BANNER ───────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(315deg, #0D4979 0%, #005689 55%, #086FA6 100%)' }}
        aria-labelledby="cta-h"
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at top right, rgba(77,177,218,0.35), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div className="mx-auto px-6 py-20 text-center max-w-[1280px] lg:px-10 lg:py-28 relative z-10">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight" id="cta-h">
            {domain.ctaHeading}
          </h2>
          <p className="text-sky-100 mb-9 mx-auto text-lg max-w-[640px] leading-relaxed">
            {domain.ctaSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="btn btn-on-blue inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#005689] rounded-xl font-bold text-sm hover:bg-[#EDF5FA] shadow-md transition-all"
            >
              Book a demo
              <ArrowRight className="w-4 h-4 text-[#005689]" />
            </Link>
            <button
              type="button"
              onClick={() => setShowBrochureModal(true)}
              className="btn inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white border border-white/50 hover:border-white hover:bg-white/10 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download brochure
            </button>
            <Link
              href="/contact-us"
              className="btn btn-ghost-white inline-flex items-center gap-2 px-7 py-3.5 text-white/90 hover:text-white rounded-xl font-bold text-sm transition-all"
            >
              Talk to academic team
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROCHURE & DEMO POPUP MODAL ─────────────────────────────────── */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0F172A]/75 backdrop-blur-xs transition-opacity"
            onClick={() => setShowBrochureModal(false)}
          />
          <div className="relative bg-white rounded-card shadow-card-hi w-full max-w-[460px] p-7 sm:p-8 z-10 border border-rule">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="eyebrow mb-1">Academic Brochure</p>
                <h3 className="text-xl font-extrabold text-[#0D4979]">Download {domain.highlightWord} curriculum guide</h3>
              </div>
              <button
                onClick={() => setShowBrochureModal(false)}
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {brochureSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-[#0D4979]">Brochure On The Way!</h4>
                <p className="text-sm text-slate-600 mt-1.5">
                  We have dispatched the complete {domain.highlightWord} curriculum catalogue &amp; lab specs to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" htmlFor="lead-name">
                    Full Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-rule rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" htmlFor="lead-email">
                    Institutional Email
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    placeholder="rajesh@college.edu.in"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-rule rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" htmlFor="lead-inst">
                    School / University Name
                  </label>
                  <input
                    id="lead-inst"
                    type="text"
                    required
                    placeholder="e.g. National Science Academy"
                    value={leadForm.institution}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, institution: e.target.value }))}
                    className="w-full border border-rule rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005689]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#005689] hover:bg-[#0D4979] text-white font-bold rounded-xl text-sm shadow-btn transition-colors mt-2"
                >
                  Download Complete Syllabus PDF
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
