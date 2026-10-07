export interface CompositeSubTopic {
  slug: string;
  searchKeyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  summary: string;
  highlights: string[];
  keyDataPoints: { label: string; value: string; desc?: string }[];
}

export const COMPOSITE_LAB_SUBTOPICS: Record<string, CompositeSubTopic> = {
  'materials': {
    slug: 'materials',
    searchKeyword: 'material for composite lab',
    title: 'Materials, Equipment & Apparatus for CBSE Composite Skill Lab',
    metaTitle: 'Composite Lab Material & Equipment List for CBSE Schools India | CSEEL',
    metaDescription: 'Complete CBSE compliant equipment and material checklist for Composite Skill Labs. Microcontrollers, sensors, soldering stations, mechanical tools, 3D printing & AI kits.',
    badge: 'Equipment BOQ & Specs',
    summary: 'Comprehensive Bill of Quantities (BOQ) covering all mandatory tools, electronic test equipment, raw materials, and prototyping components required for CBSE Skill Education.',
    highlights: [
      'NITI Aayog & CBSE Skill Education aligned hardware packages',
      'Electronic workstations: Oscilloscopes, Multimeters, Soldering Stations & Regulated Power Supplies',
      'Microcontrollers & Embedded: Arduino Uno/Nano, ESP32 Wi-Fi, Raspberry Pi & sensor kits',
      'Prototyping & Fabrication: 3D Printers, PLA spools, hand tools, drill machines & safety goggles',
      'Industry-standard consumable packs: jumper wires, breadboards, LEDs, resistors & micro-servos'
    ],
    keyDataPoints: [
      { label: 'Total Hardware SKUs', value: '120+ Items', desc: 'Covering electronics, robotics, AI & making' },
      { label: 'Workbenches Required', value: '4 to 6 Workstations', desc: 'Accommodates 35-40 students per batch' },
      { label: 'Safety Compliance', value: '100% Certified', desc: 'ESD-safe mats, fire extinguishers & eye-wash' },
      { label: 'Consumable Buffer', value: '1 Full Academic Year', desc: 'Pre-packaged refills for continuous practicals' }
    ]
  },

  'vendors': {
    slug: 'vendors',
    searchKeyword: 'vendor for composite lab setup',
    title: 'Certified Turnkey Vendors & Setup Companies for Composite Skill Labs',
    metaTitle: 'Certified Vendor for Composite Skill Lab Setup in CBSE Schools | CSEEL',
    metaDescription: 'Looking for a certified vendor for CBSE Composite Skill Lab setup? CSEEL provides turnkey installation, GeM compliance, custom CAD blueprints & certified teacher training.',
    badge: 'GeM & Turnkey Execution',
    summary: 'Why choosing an accredited turnkey lab infrastructure partner is essential for seamless CBSE affiliation inspection and long-term curriculum execution.',
    highlights: [
      'Government e-Marketplace (GeM) registered vendor for direct institutional procurement',
      'End-to-End Execution: From 2D/3D architectural CAD layout to final equipment delivery',
      'On-site installation and workbench setup by qualified hardware & STEM engineers',
      '5-Day Certified Faculty Development Program (FDP) for school science & computer teachers',
      '3-Year Comprehensive On-Site Warranty and annual maintenance support (AMC)'
    ],
    keyDataPoints: [
      { label: 'Partner Schools', value: '150+ Campuses', desc: 'Across 18+ Indian States & UTs' },
      { label: 'Setup Timeline', value: '14 to 21 Days', desc: 'Fast-track execution before CBSE inspection' },
      { label: 'Procurement Channels', value: 'GeM / Direct BoQ', desc: 'Transparent institutional billing' },
      { label: 'Support SLA', value: '48h Response', desc: 'Dedicated regional service engineers' }
    ]
  },

  'space-requirements': {
    slug: 'space-requirements',
    searchKeyword: 'space required for composite lab',
    title: 'Space & Room Size Infrastructure Norms for CBSE Composite Skill Lab',
    metaTitle: 'Space Required for CBSE Composite Skill Lab - Room Dimensions & Layout | CSEEL',
    metaDescription: 'Know the exact room size, electrical, and infrastructure specifications for CBSE Composite Skill Lab as per Circular Skill-75/2024. 600 sq ft blueprint and layout guide.',
    badge: 'CBSE Room Dimensions',
    summary: 'Official CBSE room dimensions, electrical loads, furniture layouts, and ventilation norms mandated under Circular Skill-75/2024.',
    highlights: [
      'Option 1 (Unified Lab): Minimum 600 sq. ft. dedicated floor space for Classes VI to XII',
      'Option 2 (Dual Lab): Two separate labs of 400 sq. ft. each (one for VI–X and one for XI–XII)',
      'Electrical Specifications: 5 kVA dedicated stabilized power line with separate earth grounding',
      'Workstation Design: Modular anti-static tables (6ft x 3ft) with under-table lockable storage',
      'Network & AV: High-speed Wi-Fi / LAN drops, interactive digital flat panel (IFP) mounting'
    ],
    keyDataPoints: [
      { label: 'Minimum Carpet Area', value: '600 Sq. Ft.', desc: 'Single room option for full school' },
      { label: 'Batch Seating Capacity', value: '35–40 Students', desc: 'Ergonomic 4-student work clusters' },
      { label: 'Power Backup', value: '2 kVA Online UPS', desc: 'Prevents 3D printer print failure on cuts' },
      { label: 'Ventilation', value: 'Cross-Vent / AC', desc: 'Fume-exhaust for soldering and 3D printing' }
    ]
  },

  'cost-calculator': {
    slug: 'cost-calculator',
    searchKeyword: 'composite lab cost and budget',
    title: 'CBSE Composite Skill Lab Setup Cost & Budget Estimation',
    metaTitle: 'CBSE Composite Skill Lab Setup Cost & Price Estimate 2026 | CSEEL',
    metaDescription: 'Calculate the exact setup cost of a CBSE Composite Skill Lab. Budget packages from ₹3.5 Lakhs to ₹12 Lakhs including hardware, 3D printers, training and curriculum.',
    badge: 'Budget & Pricing',
    summary: 'Transparent, itemized pricing tiers for private, trust-run, and government schools seeking cost-effective or premium turnkey setups.',
    highlights: [
      'Essential CBSE Compliance Package: Starting at ₹3.50 Lakhs (Essential tools & affiliation checklist)',
      'Standard Innovation Package: ₹5.50 to ₹7.50 Lakhs (Adds 3D printing, Arduino & Robotics kits)',
      'Advanced Super-Lab Suite: ₹8.50 to ₹12.00 Lakhs (Complete AI, IoT, Robotics & VR testbeds)',
      'Flexible Payment Models: Milestone-based disbursement for school trusts and societies',
      'Govt Grant Alignment: Tailored budgets matching PM SHRI and CSR funding allocations'
    ],
    keyDataPoints: [
      { label: 'Entry Setup Cost', value: '₹3.50 Lakhs', desc: 'Fulfills basic CBSE affiliation mandate' },
      { label: 'Recommended Tier', value: '₹5.50 Lakhs', desc: 'Full STEM, Robotics & 3D prototyping' },
      { label: 'Per-Student Cost', value: '< ₹45 / month', desc: 'Calculated across 800 enrolled learners' },
      { label: 'Warranty Included', value: '3 to 5 Years', desc: 'Covers all core electronic modules' }
    ]
  },

  'cbse-circular': {
    slug: 'cbse-circular',
    searchKeyword: 'cbse circular composite skill lab',
    title: 'CBSE Circular Skill-75/2024 & Skill-13/2026: Official Guidelines & Deadlines',
    metaTitle: 'CBSE Circular for Composite Skill Lab (Skill-75/2024) Download PDF | CSEEL',
    metaDescription: 'Download official CBSE Circular Skill-75/2024 and Skill-13/2026 for Composite Skill Labs. Read mandatory affiliation deadlines (August 2027), NEP 2020 rules and norms.',
    badge: 'Official CBSE Directive',
    summary: 'Everything school leaders need to know about the official CBSE mandate, implementation timelines, legal obligations, and penalty avoidance.',
    highlights: [
      'Circular Number: CBSE Circular No. Skill-75/2024 (Dated 23 August 2024)',
      'Follow-up Circular: CBSE Circular No. Skill-13/2026 (Detailed implementation roadmap)',
      'Existing School Deadline: Mandatory establishment by 22nd August 2027',
      'New School Prerequisite: Composite Skill Lab is compulsory for fresh affiliation applications',
      'NEP 2020 & NCF-SE 2023: Bridging academic theory with vocational skill education'
    ],
    keyDataPoints: [
      { label: 'Circular Number', value: 'Skill-75/2024', desc: 'Notification by Director (Skill Education)' },
      { label: 'Final Deadline', value: '22 Aug 2027', desc: 'Strict compliance timeline for existing schools' },
      { label: 'Mandate Scope', value: 'All CBSE Schools', desc: 'Applicable pan-India & overseas schools' },
      { label: 'Affiliation Impact', value: 'Mandatory', desc: 'Inspected during physical affiliation visits' }
    ]
  },

  'skill-subjects': {
    slug: 'skill-subjects',
    searchKeyword: 'skill subjects in composite lab',
    title: 'CBSE Skill Subjects Mapped to Composite Skill Lab (Codes 417, 418, 419)',
    metaTitle: 'CBSE Skill Subjects (AI 417, Coding 418, Data Science) Lab Setup | CSEEL',
    metaDescription: 'Set up CBSE Skill Education practicals in your Composite Skill Lab. Mapped to Artificial Intelligence (417), Coding (418), Data Science (419) and Design Thinking.',
    badge: 'Curriculum & Subject Codes',
    summary: 'Curriculum mapping for Class 6 to 12 vocational subject codes introduced under National Education Policy (NEP 2020).',
    highlights: [
      'Subject Code 417 (Class IX–X): Artificial Intelligence (Python, Machine Learning, Computer Vision)',
      'Subject Code 418 (Class IX–X): Physical Computing, Coding, Arduino & IoT Smart Systems',
      'Subject Code 419 (Class IX–X): Data Science, Big Data Concepts & Statistical Modeling',
      'Middle School Modules (Class VI–VIII): 10-day bagless maker internships & early tinkering',
      'Senior Secondary Electives (Class XI–XII): Robotics & Automation, Electronics Technology'
    ],
    keyDataPoints: [
      { label: 'Class Bands', value: 'Classes 6 to 12', desc: 'Progressive age-appropriate difficulty' },
      { label: 'Official Textbooks', value: 'CBSE Mapped', desc: 'Theory & practical lab manuals provided' },
      { label: 'Assessment Ready', value: '100% Practical Marks', desc: 'Internal lab assessment scaffolding' },
      { label: 'Student Portfolio', value: 'Cap-Stone Projects', desc: 'Real-world problem solving artifacts' }
    ]
  }
};

export const COMPOSITE_LAB_EQUIPMENT_CATEGORIES = [
  {
    category: 'Electronic Test & Measurement',
    icon: '⚡',
    items: [
      { name: 'Digital Storage Oscilloscope (DSO 50MHz)', qty: '2 Units', spec: 'Dual channel, USB PC interface' },
      { name: 'Regulated DC Power Supply (0-30V, 5A)', qty: '4 Units', spec: 'Digital display, short-circuit protected' },
      { name: 'Digital Multimeters with Probe Kit', qty: '12 Units', spec: 'Auto-ranging, capacitance & frequency' },
      { name: 'Function Generator (10MHz)', qty: '2 Units', spec: 'Sine, square, triangle wave synthesis' },
      { name: 'Component Testers & Logic Probes', qty: '8 Sets', spec: 'Transistor, diode & logic level testing' }
    ]
  },
  {
    category: 'Rapid Prototyping & 3D Fabrication',
    icon: '🖨️',
    items: [
      { name: 'Industrial CoreXY High-Speed 3D Printer', qty: '1 Unit', spec: 'Enclosed chamber, 220x220x250mm build vol' },
      { name: 'PLA & PETG Filament Spools (Multi-color)', qty: '10 Kg', spec: '1.75mm non-toxic biodegradable' },
      { name: '3D Pen Creator Kits for Early Grades', qty: '6 Units', spec: 'Low-temp PCL filament for safety' },
      { name: 'Rotary Multi-Tool Engraver / Cutter', qty: '2 Sets', spec: 'Variable speed with 150+ accessories' },
      { name: 'Precision Digital Vernier Calipers', qty: '4 Units', spec: '0.01mm resolution, stainless steel' }
    ]
  },
  {
    category: 'Microcontrollers, IoT & AI Hardware',
    icon: '🤖',
    items: [
      { name: 'Arduino Uno R3/R4 STEM Starter Kits', qty: '15 Kits', spec: 'With 35+ sensors, breadboards & LCDs' },
      { name: 'ESP32 Wi-Fi & Bluetooth IoT Development Boards', qty: '10 Kits', spec: 'Cloud IoT automation & telemetry' },
      { name: 'Raspberry Pi 4 / 5 Single Board Computers', qty: '4 Sets', spec: '4GB RAM, pre-loaded Python & OpenCV' },
      { name: 'Smart AI Camera Vision Modules', qty: '6 Units', spec: 'Face recognition & object tracking' },
      { name: 'Obstacle-Avoiding Robot Chasis & Motors', qty: '8 Sets', spec: 'Dual DC gear motor, ultrasonic sensor' }
    ]
  },
  {
    category: 'Mechanical Hand Tools & Workstation Gear',
    icon: '🛠️',
    items: [
      { name: 'Temperature Controlled Soldering Stations', qty: '6 Units', spec: 'ESD safe, sleep mode, brass sponge' },
      { name: 'Desoldering Pumps & Solder Wire (Lead-Free)', qty: '10 Sets', spec: 'Rosin-core RoHS certified' },
      { name: 'Precision Screwdriver & Pliers Toolkits', qty: '6 Sets', spec: 'Magnetic bits, wire strippers & cutters' },
      { name: 'Mini Bench Vise (Swivel Base)', qty: '4 Units', spec: 'Clamp-on table workbench mounting' },
      { name: 'Hot Glue Guns with Glue Sticks', qty: '6 Units', spec: 'Dual temperature, insulated nozzle' }
    ]
  },
  {
    category: 'Health, Safety & Environment Norms',
    icon: '🛡️',
    items: [
      { name: 'Anti-Static ESD Workbench Rubber Mats', qty: '6 Mats', spec: 'With grounding cords & wrist straps' },
      { name: 'ABC Dry Powder Fire Extinguisher (4 Kg)', qty: '2 Units', spec: 'ISI marked, school lab compliant' },
      { name: 'Comprehensive First Aid & Burn Kit', qty: '1 Set', spec: 'Antiseptic, eye wash solution & bandages' },
      { name: 'Safety Goggles & Chemical-Resistant Gloves', qty: '40 Sets', spec: 'High-impact polycarbonate lenses' },
      { name: 'Spill Containment Tray & Fume Extractor Fan', qty: '2 Units', spec: 'Activated carbon air filtration' }
    ]
  }
];
