export interface SteamPackage {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  gradeLevels: string;
  studentCapacity: string;
  recommendedSpace: string;
  estimatedPriceRange: string;
  compliance: string[];
  keyHighlights: string[];
  equipmentIncluded: {
    category: string;
    items: string[];
  }[];
  curriculumModules: string[];
  mentorshipAndSupport: string[];
  bestFor: string;
  downloadBrochureSlug: string;
}

export interface SteamExperimentProject {
  id: string;
  title: string;
  category: 'Robotics & AI' | 'IoT & Smart Systems' | 'Clean Tech & Green Energy' | '3D Design & Making' | 'Computational Bio & Chem' | 'Early STEAM Mechanics';
  grade: 'Grades 1-5' | 'Grades 6-8' | 'Grades 9-10' | 'Grades 11-12 & Higher Ed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  hardwareRequired: string[];
  nepSkills: string[];
  description: string;
  learningOutcome: string;
}

export interface SteamEquipmentCategory {
  category: string;
  icon: string;
  description: string;
  items: {
    name: string;
    spec: string;
    applications: string;
    safetyLevel: 'Safe for All Grades' | 'Teacher Supervision Recommended' | 'Senior Secondary Only';
  }[];
}

export interface SteamFaq {
  question: string;
  answer: string;
  category: 'ATL Setup & Grants' | 'Curriculum & NEP 2020' | 'Hardware & Infrastructure' | 'Teacher Training & Support' | 'Cost & Procurement';
}

export const STEAM_LAB_PACKAGES: SteamPackage[] = [
  {
    id: 'atal-tinkering-lab-atl',
    name: 'Atal Tinkering Lab (ATL) Turnkey Setup',
    badge: 'NITI Aayog Compliant',
    tagline: 'Official Package 1, 2, 3 & 4 Equipment with NEP 2020 Experiential Curriculum',
    description: 'A comprehensive, end-to-end tinkering lab designed strictly under NITI Aayog AIM guidelines. Equipped with microcontrollers, rapid prototyping 3D printers, mechanical fabrication kits, and complete student workbenches for Grades 6 to 12.',
    gradeLevels: 'Grades 6 to 12',
    studentCapacity: '30-40 Students per batch (1,500+ across school)',
    recommendedSpace: '1,000 – 1,500 sq. ft.',
    estimatedPriceRange: '₹10,00,000 - ₹20,00,000 (Govt Grant & Private Models)',
    compliance: [
      'NITI Aayog AIM ATL Guidelines 2026',
      'NEP 2020 Experiential Learning Framework',
      'CBSE Composite Skill Lab Mandate',
      'BIS & CE Safety Certified Hardware'
    ],
    keyHighlights: [
      'Full ATL Package P1 (Electronics & STEM), P2 (3D Printing & Prototyping), P3 (Mechanical & Tools), P4 (Sensors & IoT)',
      '120+ Structured Lesson Plans mapped to CBSE, ICSE, and State Board Science Syllabus',
      'Annual Maintenance, Spare Parts Pool, and Dedicated ATL In-charge Mentorship',
      'Participation in National STEM Challenges, ATL Marathon & Innovation Bootcamps'
    ],
    equipmentIncluded: [
      {
        category: 'P1: Electronics & STEM Development',
        items: [
          'Arduino UNO R4 & Nano Microcontroller Development Boards (30+ units)',
          'BBC micro:bit v2 with expansion breakout shields',
          'Breadboards, jumper wires, passive electronic components & sensor shields',
          'Robotics chassis kits with dual gear motors & L298N drivers'
        ]
      },
      {
        category: 'P2: Rapid Prototyping & 3D Fabrication',
        items: [
          'Industrial-Grade Enclosed CoreXY 3D Printer with auto-bed leveling',
          'High-precision PLA/PETG filament spools (Eco-friendly, non-toxic)',
          '3D Printing Ergonomic Pens with variable feed rate (15 units)',
          'Tinkercad & Fusion 360 Student CAD design workstations setup'
        ]
      },
      {
        category: 'P3: Mechanical Tools & Assembly',
        items: [
          'Digital temperature-controlled soldering stations with ESD fume extraction',
          'Precision hand toolsets (wire strippers, cutters, screw drivers, hex keys)',
          'Rotary multi-tool carving & drill station with flexible shaft',
          'Safety gear: Anti-static ESD wristbands, safety goggles, fire safety kit'
        ]
      },
      {
        category: 'P4: Sensors, IoT & Telemetry',
        items: [
          'ESP32 Wi-Fi & Bluetooth IoT development boards (20 units)',
          'Sensor array: Ultrasonic, IR, Soil Moisture, DHT22 Temp/Humidity, Gas MQ-2, Pulse Heart-Rate, Light LDR',
          'OLED displays (0.96 inch) and 16x2 I2C LCD screens',
          'Cloud IoT dashboard access for real-world environmental telemetry'
        ]
      }
    ],
    curriculumModules: [
      'Foundation of Tinkering & Design Thinking',
      'Physical Computing & Block-to-Text Python Coding',
      'Autonomous Mobile Robotics & Navigation',
      'Smart Agriculture & Community IoT Systems',
      'Patent & Intellectual Property (IPR) Basics for Student Innovators'
    ],
    mentorshipAndSupport: [
      '5-Day Hands-on Teacher Training & Educator Certification Program',
      'Quarterly Expert Visits by Robotics & AI Mentors',
      'School Innovation Marathon & Internal Tinkerfest Hosting Support',
      'Direct integration with CSEEL Virtual Labs for pre-lab simulations'
    ],
    bestFor: 'Schools looking to establish or upgrade an official Atal Tinkering Lab or create a premier school innovation center.',
    downloadBrochureSlug: 'atl-turnkey-proposal-cseel.pdf'
  },
  {
    id: 'ai-robotics-iot-superlab',
    name: 'AI, IoT & Advanced Robotics Super-Lab',
    badge: 'CBSE Skill Subject Mapped',
    tagline: 'Cutting-Edge Edge-AI, Drone Mechanics, Robotic Arms & Smart City IoT for High Schools',
    description: 'Designed specifically to deliver CBSE Skill Education Subject Codes 417 (Artificial Intelligence), 418 (Coding), and 419 (Data Science). Equip your school with computer vision cameras, edge-AI neural accelerators, multi-axis robotic arms, and programmable UAV drones.',
    gradeLevels: 'Grades 6 to 12 & Pre-University',
    studentCapacity: '25-35 Students per batch',
    recommendedSpace: '800 – 1,200 sq. ft.',
    estimatedPriceRange: '₹8,50,000 - ₹16,00,000',
    compliance: [
      'CBSE AI Curriculum (Subject Code 417)',
      'CBSE Coding & Data Science Framework (Codes 418/419)',
      'ICSE Robotics and AI Guidelines',
      'Global IEEE & CSforALL Standards'
    ],
    keyHighlights: [
      'Edge AI Vision Kits (HuskyLens / OpenCV-compatible cameras)',
      '4-DOF & 6-DOF Programmable Robotic Arms with Grippers and vacuum suction',
      'Quadcopter Drone Physics & Aerodynamics DIY Assembly Kits',
      'Python & TensorFlow Lite Micro Machine Learning on Microcontrollers'
    ],
    equipmentIncluded: [
      {
        category: 'Edge AI & Machine Vision',
        items: [
          'HuskyLens AI Vision Sensors with face, object & line recognition',
          'Raspberry Pi 5 (8GB) AI Starter Bundles with Camera Module 3',
          'Coral USB TPU Accelerators for fast on-device inference',
          'Speech Recognition & Natural Language Voice AI modules'
        ]
      },
      {
        category: 'Advanced Robotics & Manipulation',
        items: [
          '6-Axis Programmable Robotic Arms with precision metal servos',
          'Mecanum Wheel Omnidirectional Robotic Platforms',
          'LiDAR Laser Distance Scanners for SLAM 2D mapping',
          'Color Sorting Conveyor Belt industrial simulator'
        ]
      },
      {
        category: 'Drones & Aeronautics',
        items: [
          'Classroom-Safe Modular Quadcopters with propeller guards',
          'Optical Flow & Altitude Hold Flight Controllers',
          'Python Programmable Autonomous Flight Path SDK',
          'Aerodynamics testing wind-tunnel visualizer'
        ]
      },
      {
        category: 'Cloud IoT & Edge Gateways',
        items: [
          'ESP32-S3 Dual Core IoT Gateway modules with LoRa connectivity',
          'Smart City Sensor Grid (Air quality, acoustic noise, rain sensor, UV index)',
          'Industrial Relay Boards & Home Automation AC/DC switching simulators',
          'Real-time MQTT telemetry dashboard'
        ]
      }
    ],
    curriculumModules: [
      'Introduction to Machine Learning & Computer Vision',
      'Object Detection, Gesture Control & Autonomous Driving Algorithms',
      'Kinematics & Inverse Kinematics in Robotic Manipulators',
      'Industrial IoT (IIoT) & Smart Grid Telemetry',
      'Ethics of Artificial Intelligence & Data Privacy'
    ],
    mentorshipAndSupport: [
      'Masterclasses by Industry AI Scientists & Robotics Engineers',
      'Year-round Hackathon & Robotics Championship mentorship',
      'Dedicated GitHub Repositories and Video Project Manuals',
      'Teacher Upskilling on Python, OpenCV, and Edge-AI algorithms'
    ],
    bestFor: 'Progressive schools aiming to lead in AI, Robotics, and Computer Science education.',
    downloadBrochureSlug: 'ai-robotics-superlab-cseel.pdf'
  },
  {
    id: 'pm-shri-composite-skill-lab',
    name: 'PM SHRI & Composite Skill Lab Solution',
    badge: 'Govt & PM SHRI Aligned',
    tagline: 'Turnkey Vocational, STEM & 21st-Century Multi-Skill Lab for NEP 2020 Standards',
    description: 'Customized for PM SHRI schools, Kendriya Vidyalayas, Navodaya Vidyalayas, and state government institutions. Combines experiential science, vocational trades, basic electronics, carpentry prototyping, and digital literacy under one roof.',
    gradeLevels: 'Grades 6 to 12',
    studentCapacity: '40-50 Students per batch',
    recommendedSpace: '800 – 1,500 sq. ft.',
    estimatedPriceRange: '₹6,00,000 - ₹12,00,000',
    compliance: [
      'PM SHRI Scheme Lab Guidelines',
      'NEP 2020 Vocational Education Integration',
      'NSDC & Skill India Mission Modules',
      'GeM (Government e-Marketplace) Compliance'
    ],
    keyHighlights: [
      'Turnkey Delivery through GeM / Approved Institutional Procurement',
      'Bilingual Curriculum (Hindi & English) for diverse student demographics',
      'Modular Multi-Skill Workstations: Electronics, Woodcraft, Green Farming, Digital CAD',
      'Complete lab ergonomics: Modular heavy-duty storage, safety cabinetry, power distribution'
    ],
    equipmentIncluded: [
      {
        category: 'Skill Education & Vocational Tools',
        items: [
          'Multi-purpose Woodcraft & Prototyping benchtop tools',
          'Basic Plumbing, Electrical & Mechanical trainer boards',
          'Digital Multimeters, Clamp meters & Circuit fault trainers',
          'Soldering stations, hot air rework & desoldering pumps'
        ]
      },
      {
        category: 'STEM & Coding Infrastructure',
        items: [
          'STEM Starter Kits with plug-and-play magnetic sensors',
          'Arduino & ESP32 Microcontroller experiment kits (25 sets)',
          'Interactive LED Matrix displays & Solar energy demonstration kits',
          '3D Printer with localized teacher training software'
        ]
      },
      {
        category: 'Lab Furniture & Infrastructure',
        items: [
          'Anti-static modular student octagonal lab workbenches',
          'Mobile tool storage trollies with central key locking',
          'Ergonomic student lab stools & teacher demonstration podium',
          'Wall-mounted interactive tool shadow boards for 5S organization'
        ]
      }
    ],
    curriculumModules: [
      'Foundations of Craft & Prototyping',
      'Basic Electrical Wiring & Electronic Circuitry',
      'Green Energy & Solar Appliance Assembly',
      'Digital Literacy, 3D CAD & Digital Fabrication',
      'Community Problem Solving & Rural Innovation Projects'
    ],
    mentorshipAndSupport: [
      'On-site installation and testing by certified CSEEL engineers',
      'Comprehensive Teacher Handbook and bilingual video tutorials',
      'Regular compliance & safety audit reports',
      'Direct GeM catalog part numbers for effortless maintenance'
    ],
    bestFor: 'PM SHRI, KV, JNV, and State Government institutions looking for accredited skill infrastructure.',
    downloadBrochureSlug: 'pm-shri-composite-lab-cseel.pdf'
  },
  {
    id: 'clean-tech-green-energy-lab',
    name: 'Clean Tech & Green Energy Innovation Lab',
    badge: 'Sustainability & Climate Tech',
    tagline: 'Solar PV, Wind Dynamics, Hydrogen Fuel Cells & IoT Environmental Monitoring',
    description: 'Empower students to solve real-world climate and clean energy challenges. Featuring real-time solar panel angle optimizers, hydrogen generation electrolyzers, miniature wind tunnels, and soil/water environmental monitoring stations.',
    gradeLevels: 'Grades 6 to 12 & Colleges',
    studentCapacity: '25-35 Students per batch',
    recommendedSpace: '600 – 1,000 sq. ft.',
    estimatedPriceRange: '₹5,50,000 - ₹11,00,000',
    compliance: [
      'UN Sustainable Development Goals (SDG 7, 11, 13)',
      'NEP 2020 Environmental Education Integration',
      'CBSE Green School & Eco-Club Mandates',
      'ISO 14001 Environmental Safety Standards'
    ],
    keyHighlights: [
      'Reversible Proton Exchange Membrane (PEM) Fuel Cell sets',
      'Dual-Axis Solar Tracker with IoT telemetry for efficiency curve logging',
      'Wind Turbine aerodynamics kit with pitch-adjustable blades',
      'Biomass anaerobic digestion micro-reactor demonstration setup'
    ],
    equipmentIncluded: [
      {
        category: 'Solar Energy & Photovoltaics',
        items: [
          'Monocrystalline & Polycrystalline solar test panels with light simulators',
          'Solar I-V curve tracer with digital data logger',
          'Automated Dual-axis sun tracking servo motor system',
          'Solar water heating & thermal efficiency test bench'
        ]
      },
      {
        category: 'Hydrogen & Fuel Cell Technology',
        items: [
          'PEM Electrolyzer with distilled water splitting unit',
          'Transparent Fuel Cell stack with oxygen & hydrogen gas storage cylinders',
          'Miniature hydrogen electric car chassis model',
          'Digital load resistance box for polarization curve studies'
        ]
      },
      {
        category: 'Wind & Hydro Dynamics',
        items: [
          'Modular wind turbine with 3-blade and 6-blade aerodynamic hubs',
          'Digital anemometer with wind speed & air velocity logging',
          'Miniature Pelton wheel hydroelectric power generator',
          'Capacitor bank & battery storage energy management unit'
        ]
      },
      {
        category: 'Environmental IoT Sensors',
        items: [
          'Water quality probe kit: pH, Dissolved Oxygen (DO), Turbidity, TDS, Temp',
          'Soil moisture, NPK fertility sensor, and leaf wetness sensor',
          'Particulate matter PM2.5 / PM10 optical air quality sensor',
          'Live weather station transmitting data to school website'
        ]
      }
    ],
    curriculumModules: [
      'Physics of Photovoltaic Energy Conversion',
      'Electrochemical Storage & Hydrogen Economy',
      'Aerodynamics of Wind Turbines & Power Curves',
      'IoT Weather Telemetry & Microclimate Data Analysis',
      'Carbon Footprint Auditing & Circular Economy Models'
    ],
    mentorshipAndSupport: [
      'Mentorship from Renewable Energy Researchers & Climate Scientists',
      'School-wide Energy Audit and Sustainability Certification support',
      'Curated Eco-Club Project Manuals and competition guidelines',
      'Online cloud repository for comparative school weather data'
    ],
    bestFor: 'Schools focused on sustainability, eco-clubs, and future-forward green engineering.',
    downloadBrochureSlug: 'clean-tech-green-lab-cseel.pdf'
  },
  {
    id: 'computational-biotech-lab',
    name: 'Computational Biology & Molecular Simulation Lab',
    badge: 'Advanced Life Sciences',
    tagline: 'Molecular Docking (AutoDock Vina), GROMACS Simulations, Bioinformatics & Micro-Chemistry',
    description: 'Bringing computational drug discovery, genomics, and micro-scale biochemistry to senior secondary and undergraduate classrooms. Students run molecular docking simulations, visualize 3D protein structures in PyMOL, and explore DNA sequencing data.',
    gradeLevels: 'Grades 9 to 12 & Higher Education',
    studentCapacity: '20-30 Students per batch',
    recommendedSpace: '600 – 1,000 sq. ft.',
    estimatedPriceRange: '₹6,00,000 - ₹14,00,000',
    compliance: [
      'CBSE Biotechnology & Chemistry Curriculum',
      'DBT (Department of Biotechnology) Student Research Guidelines',
      'International Bioinformatics & NIH PDB Standards',
      'GLP (Good Laboratory Practice) Micro-scale Standards'
    ],
    keyHighlights: [
      'Pre-configured Linux & Windows workstations with AutoDock Vina, PyMOL, and GROMACS',
      'Curated Protein Data Bank (RCSB PDB) learning modules on cancer targets & antibiotics',
      'Micro-scale green chemistry kits (minimizes chemical waste by 95%)',
      'Digital microscopes with high-resolution USB 4K sensor output for group viewing'
    ],
    equipmentIncluded: [
      {
        category: 'Bioinformatics & Computational Workstations',
        items: [
          'Dedicated high-performance multi-threaded computational stations',
          'AutoDock Vina, AutoDock4 & Blind Docking workflow automation suite',
          'PyMOL & ChimeraX 3D molecular structure visualizers',
          'NCBI BLAST, Sequence Alignment & Phylogenetic Tree toolkits'
        ]
      },
      {
        category: 'Micro-Scale Biochemistry & Genetics',
        items: [
          'Micro-centrifuges with digital RPM tachometer',
          'Agarose Gel Electrophoresis tanks with blue light transilluminators',
          'Micropipettes set (0.5-10µL, 10-100µL, 100-1000µL) with calibration certs',
          'Micro-scale organic chemistry glassware sets with Teflon connectors'
        ]
      },
      {
        category: 'Digital Microscopy & Spectrophotometry',
        items: [
          'Compound Trinocular Microscope with 5MP 4K USB Camera',
          'Visible Spectrophotometer (320-1100 nm) for enzyme kinetics',
          'Incubator shaker mini unit for bacterial culture simulations',
          'Autoclave and UV sterilization safety cabinet'
        ]
      }
    ],
    curriculumModules: [
      'Structure-Based Drug Design & Molecular Docking Workflows',
      'Protein-Ligand Interaction Scoring and Binding Affinity',
      'DNA Extraction, PCR Principles & Gel Electrophoresis',
      'Enzyme Kinetics & Michaelis-Menten Analysis',
      'Micro-Scale Chemical Synthesis & Chromatography'
    ],
    mentorshipAndSupport: [
      'Guidance by PhD Bioinformaticians & Computational Biologists',
      'Support for publishing student papers in international high-school research journals',
      'Assistance with National Science Fair & Bio-Olympiad preparation',
      'Complete lab safety protocols and biological disposal guidelines'
    ],
    bestFor: 'Senior secondary schools, pre-med academies, and colleges aiming for premier STEM research.',
    downloadBrochureSlug: 'computational-biotech-lab-cseel.pdf'
  },
  {
    id: 'junior-innovators-stem-lab',
    name: 'Junior Innovators Early STEAM Lab',
    badge: 'Grades 1 to 5 Foundational',
    tagline: 'Sensory Mechanics, Magnetic Levitation, Light Optics & Block Coding for Young Minds',
    description: 'Ignite curiosity in primary school learners through tactile, colourful, and 100% child-safe hands-on STEAM kits. Kids build gears, explore pneumatic levers, create vibrant kaleidoscope patterns, and code their first animated robot.',
    gradeLevels: 'Grades 1 to 5 (Ages 6 to 11)',
    studentCapacity: '30-40 Students per batch',
    recommendedSpace: '500 – 800 sq. ft.',
    estimatedPriceRange: '₹3,50,000 - ₹7,00,000',
    compliance: [
      'NEP 2020 Foundational & Preparatory Stage Mandates',
      'Toy-Based Pedagogy Guidelines (NCERT)',
      'EN71 & ASTM Non-Toxic Child Safety Standards',
      'Montessori & Reggio Emilia Experiential Principles'
    ],
    keyHighlights: [
      'Child-safe wooden mechanical gears, pulleys, and linkage sets',
      'Screen-free coding rovers with color barcode and tactile button navigation',
      'Magnetic levitation, optical reflection, and acoustic resonance models',
      'Illustrated bilingual storybook activity manuals for young children'
    ],
    equipmentIncluded: [
      {
        category: 'Sensory Mechanics & Engineering',
        items: [
          'Modular interlocking gear trains & planetary gear demonstrator',
          'Pneumatic & Hydraulic syringe mechanical arms',
          'Magnetic levitation track sets and neodymium ring magnets',
          'Gravity ball marble run with kinetic momentum loops'
        ]
      },
      {
        category: 'Optics, Sound & Energy Exploration',
        items: [
          'Kaleidoscope & Periscope DIY assembly kits',
          'Laser reflection acrylic prism set with safety low-power lasers',
          'Tuning forks with resonance sound boxes and vibration ping-pong balls',
          'Hand-crank dynamo LED flashlights and potato clock kits'
        ]
      },
      {
        category: 'Early Coding & Screen-Free Robotics',
        items: [
          'MatataLab / Codey screen-free tangible coding robots (10 sets)',
          'ScratchJr interactive floor coding mats and directional cards',
          'Vibrant LED conductive dough and circuit clay kits',
          'Interactive story-based mission challenges'
        ]
      }
    ],
    curriculumModules: [
      'Wonders of Simple Machines: Levers, Pulleys & Wheels',
      'Color Mixing, Light Reflection & Rainbow Optics',
      'Forces You Cannot See: Magnetism & Static Electricity',
      'Algorithms in Real Life: Step-by-Step Problem Solving',
      'Bio-Mimicry: Learning Engineering from Nature'
    ],
    mentorshipAndSupport: [
      'Specialized Primary Teacher Workshop on Toy-Based Pedagogy',
      'Parent-Child STEAM Weekend Discovery Workshop kits',
      'Junior Maker Badges and Innovation Passports for every student',
      'Monthly replenishment of consumable materials (circuit clay, paper crafts)'
    ],
    bestFor: 'Primary schools, kindergarten academies, and progressive pre-schools.',
    downloadBrochureSlug: 'junior-steam-lab-cseel.pdf'
  }
];

export const STEAM_EXPERIMENTS_DIRECTORY: SteamExperimentProject[] = [
  {
    id: 'exp-line-follower-robot',
    title: 'Autonomous Dual-Sensor Line Follower Robot',
    category: 'Robotics & AI',
    grade: 'Grades 6-8',
    difficulty: 'Intermediate',
    duration: '2 Hours',
    hardwareRequired: ['Arduino UNO', 'Dual IR Sensor Array', 'L298N Motor Driver', 'Chassis with BO Motors', '7.4V Li-ion Battery'],
    nepSkills: ['Algorithmic Thinking', 'Closed-Loop Control Systems', 'Sensor Calibration'],
    description: 'Construct and program a dual-wheel autonomous mobile robot that follows a high-contrast black line trajectory using infrared reflection thresholds.',
    learningOutcome: 'Understand infrared reflectance differentials, binary state switching vs proportional control, and DC motor H-Bridge PWM speed modulation.'
  },
  {
    id: 'exp-iot-weather-station',
    title: 'ESP32 Cloud IoT Smart Weather Telemetry Station',
    category: 'IoT & Smart Systems',
    grade: 'Grades 9-10',
    difficulty: 'Intermediate',
    duration: '2.5 Hours',
    hardwareRequired: ['ESP32 Dev Module', 'DHT22 Temp/Humidity Sensor', 'BMP280 Barometric Pressure', '0.96 OLED Display', 'ThingSpeak / Blynk Cloud'],
    nepSkills: ['Cloud Telemetry', 'Wireless Networking (Wi-Fi/MQTT)', 'Data Analytics'],
    description: 'Deploy an automated microclimate weather station that logs ambient temperature, relative humidity, and barometric pressure to the cloud every 30 seconds.',
    learningOutcome: 'Master I2C communication protocol, JSON payload structuring, Wi-Fi reconnection routines, and graphical timeseries data interpretation.'
  },
  {
    id: 'exp-solar-sun-tracker',
    title: 'Dual-Axis Solar Photovoltaic Maximum Power Tracker',
    category: 'Clean Tech & Green Energy',
    grade: 'Grades 9-10',
    difficulty: 'Advanced',
    duration: '3 Hours',
    hardwareRequired: ['Arduino UNO', '4x LDR Sensors in Quadrant Divider', '2x SG90 Servo Motors', 'Mini Solar Panel (5V/1W)', 'Digital Multimeter'],
    nepSkills: ['Renewable Energy Optimization', 'Differential Feedback Loops', 'Mechanical Linkages'],
    description: 'Design a sun-tracking solar panel mount that rotates azimuthally and elevationally to orient perpendicular to incident light rays, increasing daily energy yield by up to 38%.',
    learningOutcome: 'Analyze solar elevation angles, LDR bridge balancing formulas, servo angle constraint algorithms, and photovoltaic power-voltage curves.'
  },
  {
    id: 'exp-molecular-docking-autodock',
    title: 'AutoDock Vina Computational Drug Discovery & Protein Docking',
    category: 'Computational Bio & Chem',
    grade: 'Grades 11-12 & Higher Ed',
    difficulty: 'Advanced',
    duration: '3 Hours',
    hardwareRequired: ['High-Performance PC', 'AutoDock Vina Software', 'PyMOL Molecular Graphics', 'RCSB Protein Data Bank (PDB ID: 1HSG)'],
    nepSkills: ['Structural Bioinformatics', 'Thermodynamic Binding Free Energy', 'Computational Modeling'],
    description: 'Simulate molecular docking of the anti-HIV inhibitor Indinavir into HIV-1 Protease catalytic pocket, computing conformational poses and binding affinity (kcal/mol).',
    learningOutcome: 'Master receptor-ligand grid box parameterization, hydrogen bond distance measurement in PyMOL, and empirical scoring function calculations.'
  },
  {
    id: 'exp-ai-smart-vision-trash-sorter',
    title: 'Edge-AI Computer Vision Smart Waste Sorting System',
    category: 'Robotics & AI',
    grade: 'Grades 9-10',
    difficulty: 'Advanced',
    duration: '3.5 Hours',
    hardwareRequired: ['HuskyLens AI Camera / Raspberry Pi', 'Servo Actuator Diverter', 'Conveyor Belt Rig', 'Plastic & Bio Waste Samples'],
    nepSkills: ['Computer Vision', 'Convolutional Neural Networks', 'Sustainable Waste Management'],
    description: 'Train a lightweight image classification model on organic waste vs recyclable plastic bottles and actuate a sorting gate in real time.',
    learningOutcome: 'Understand model training with bounding boxes, confidence score filtering, serial data interfacing with microcontrollers, and municipal waste mechanics.'
  },
  {
    id: 'exp-3d-printed-bionic-hand',
    title: '3D-Printed Bionic Robotic Hand with Flex Sensor Teleoperation',
    category: '3D Design & Making',
    grade: 'Grades 11-12 & Higher Ed',
    difficulty: 'Advanced',
    duration: '4 Hours',
    hardwareRequired: ['CoreXY 3D Printer', 'PLA Filament', '5x Flex Sensors', '5x Metal Gear Servos', 'Wearable Glove Harness', 'Arduino Mega'],
    nepSkills: ['Additive Manufacturing', 'CAD Parametric Modeling', 'Biomedical Prosthetics'],
    description: '3D print an anatomical five-finger prosthetic hand and actuate each finger proportionally based on the bending angles of flex sensors worn on a human operator glove.',
    learningOutcome: 'Analyze CAD clearances and tendon routing, flex sensor resistive voltage divider math, and multi-channel servo synchronized movement.'
  },
  {
    id: 'exp-potato-battery-redox',
    title: 'Bio-Electrochemical Voltage Generation in Zinc-Copper Electrolytes',
    category: 'Early STEAM Mechanics',
    grade: 'Grades 1-5',
    difficulty: 'Beginner',
    duration: '45 Mins',
    hardwareRequired: ['Copper Electrodes', 'Zinc Galvanized Nails', 'Potatoes / Lemons', 'Alligator Clip Leads', 'Low-Voltage LCD Clock'],
    nepSkills: ['Scientific Observation', 'Electrochemical Principles', 'Hands-on Circuitry'],
    description: 'Construct a series-parallel chemical cell using natural acidic juices in fruits to drive a digital clock without any commercial battery.',
    learningOutcome: 'Discover redox reactions, spontaneous electron transfer from zinc to copper, series voltage summation, and internal resistance.'
  },
  {
    id: 'exp-smart-irrigation-lora',
    title: 'Smart Precision Agriculture System with LoRa Long-Range Telemetry',
    category: 'IoT & Smart Systems',
    grade: 'Grades 11-12 & Higher Ed',
    difficulty: 'Advanced',
    duration: '3 Hours',
    hardwareRequired: ['LoRa SX1278 Transceiver Pair', 'Capacitive Soil Moisture Probe', 'Submersible 12V Water Pump', 'Relay Module', 'ESP32'],
    nepSkills: ['Sub-GHz Wireless Protocols', 'Precision Agriculture', 'Water Resource Conservation'],
    description: 'Build a long-range wireless farm telemetry node that transmits soil moisture levels across 2 kilometers to trigger drip irrigation pumps only when threshold drops below 30%.',
    learningOutcome: 'Understand capacitive vs resistive soil sensors, LoRa spreading factors, duty cycle constraints, and automated threshold hysteresis control.'
  }
];

export const STEAM_EQUIPMENT_MATRIX: SteamEquipmentCategory[] = [
  {
    category: 'Microcontrollers & Edge Computing',
    icon: 'Cpu',
    description: 'Industry-standard computational boards from foundational 8-bit controllers to 64-bit neural edge processors.',
    items: [
      { name: 'Arduino UNO R4 WiFi', spec: 'Renesas RA4M1 32-bit ARM Cortex-M4, 48MHz, ESP32-S3 Wi-Fi/BLE, 12x8 LED Matrix', applications: 'Foundational electronics, robotics, analog/digital sensor interfacing', safetyLevel: 'Safe for All Grades' },
      { name: 'Raspberry Pi 5 (8GB)', spec: 'Broadcom BCM2712 Quad-core 2.4GHz ARM Cortex-A76, VideoCore VII GPU, Dual 4Kp60 HDMI', applications: 'Computer vision, Python programming, web servers, AI neural models', safetyLevel: 'Safe for All Grades' },
      { name: 'ESP32-S3 DevKitC', spec: 'Dual-Core Xtensa 240MHz, 2.4GHz Wi-Fi + BLE 5.0, Vector instructions for AI acceleration', applications: 'Cloud IoT, wireless sensor networks, smart home automation', safetyLevel: 'Safe for All Grades' },
      { name: 'BBC micro:bit v2', spec: 'Nordic nRF52833 ARM Cortex-M4F, 5x5 LED Display, built-in MEMS microphone & speaker', applications: 'Primary and middle school block coding (MakeCode) and sensor experiments', safetyLevel: 'Safe for All Grades' }
    ]
  },
  {
    category: '3D Prototyping & Digital Fabrication',
    icon: 'Printer',
    description: 'Enclosed, child-safe, high-speed 3D printers and CAD design tools for rapid tangible prototyping.',
    items: [
      { name: 'Enclosed CoreXY Rapid 3D Printer', spec: 'Print volume 220x220x250mm, max speed 500mm/s, direct drive extruder, HEPA air filtration', applications: 'Robotics chassis, custom sensor enclosures, mechanical gearboxes, prosthetic models', safetyLevel: 'Teacher Supervision Recommended' },
      { name: 'Eco-Friendly PLA & PETG Filaments', spec: '1.75mm diameter, dimensional accuracy +/-0.02mm, non-toxic cornstarch-derived biodegradable', applications: 'Classroom 3D printing with zero toxic fumes and vibrant multi-colour assortment', safetyLevel: 'Safe for All Grades' },
      { name: 'Ergonomic 3D Printing Pens', spec: 'Dual temperature modes (160C-210C), ceramic nozzle, OLED temperature indicator, USB powered', applications: 'Freehand 3D geometry, structural truss models, tactile wireframes', safetyLevel: 'Teacher Supervision Recommended' }
    ]
  },
  {
    category: 'Sensors, Actuators & Telemetry',
    icon: 'Radio',
    description: 'High-precision environmental, acoustic, optical, and biometric transducers for real-world data collection.',
    items: [
      { name: 'HuskyLens AI Vision Transducer', spec: 'Kendryte K210 dual-core 64-bit RISC-V processor, 2.0 inch IPS screen, UART/I2C output', applications: 'Face recognition, object tracking, color sorting, QR code navigation', safetyLevel: 'Safe for All Grades' },
      { name: 'Multi-Gas & Air Quality Telemetry Probe', spec: 'Sensirion / MQ series electrochemical sensors for CO2, PM2.5, VOCs, and flammable gases', applications: 'Smart classroom indoor air monitoring, environmental pollution mapping', safetyLevel: 'Safe for All Grades' },
      { name: 'Biometric Heart-Rate & SpO2 Transducer', spec: 'MAX30102 high-sensitivity pulse oximeter with ambient light cancellation', applications: 'Human physiology labs, sports science data collection, biomedical engineering', safetyLevel: 'Safe for All Grades' },
      { name: 'Solid-State LiDAR Distance Sensor', spec: 'Time-of-Flight (ToF) range 0.1m - 12m, 360 degree rotation, 10Hz sampling rate', applications: 'SLAM autonomous robot navigation, obstacle avoidance, room 3D surveying', safetyLevel: 'Safe for All Grades' }
    ]
  },
  {
    category: 'Robotics, Mechanics & Tools',
    icon: 'Wrench',
    description: 'Heavy-duty fabrication tools, digital soldering systems, and precision mechanical assembly stations.',
    items: [
      { name: 'Digital Soldering Station & Fume Extractor', spec: '60W rapid ceramic heating element (200C-480C), ESD safe, active carbon HEPA fume absorber', applications: 'PCB assembly, through-hole component soldering, wire splicing', safetyLevel: 'Teacher Supervision Recommended' },
      { name: 'Multi-Axis Precision Rotary Carving Tool', spec: 'Variable speed 5,000 - 32,000 RPM with 120-piece cutting, grinding, polishing accessory kit', applications: 'Model shaping, acrylic drilling, edge smoothing, PCB track isolation', safetyLevel: 'Teacher Supervision Recommended' },
      { name: '6-DOF Aluminum Robot Arm with Servos', spec: 'High-torque MG996R metal-gear servos (10kg-cm), mechanical gripper claw, base turret', applications: 'Pick-and-place industrial automation, kinematics algorithms, inverse physics', safetyLevel: 'Safe for All Grades' }
    ]
  }
];

export const STEAM_LAB_FAQS: SteamFaq[] = [
  {
    category: 'ATL Setup & Grants',
    question: 'What is the standard procedure to set up an Atal Tinkering Lab (ATL) in our school?',
    answer: 'Setting up an ATL involves 4 major phases: 1) Application under NITI Aayog AIM portal or allocating school capital funds, 2) Space allocation (minimum 1,000 to 1,500 sq. ft. with stable power and internet), 3) Procurement of standard Package 1 to 4 equipment compliant with government specifications, and 4) Faculty training & inauguration. CSEEL provides complete turnkey support—from grant advisory and space blueprinting to GeM-compliant hardware delivery, installation, and year-round teacher enablement.'
  },
  {
    category: 'ATL Setup & Grants',
    question: 'Can private and un-aided schools set up an ATL or STEAM Lab without government grants?',
    answer: 'Yes! Over 60% of modern STEAM labs are self-funded by private schools aiming to offer world-class robotics, AI, and tinkering facilities. CSEEL provides cost-optimized turnkey private packages starting from ₹5,50,000 with flexible installment and milestone-based rollouts.'
  },
  {
    category: 'Curriculum & NEP 2020',
    question: 'How is the CSEEL STEAM Lab aligned with NEP 2020 and CBSE/ICSE curriculum?',
    answer: 'Our curriculum is structured into 4 age-appropriate tiers (Grades 1-5, 6-8, 9-10, and 11-12) directly mapped to CBSE Skill Education subjects (AI Code 417, Coding Code 418, Data Science Code 419, Design Thinking). Every lesson follows the 5E Instructional Model (Engage, Explore, Explain, Elaborate, Evaluate) to ensure tangible experiential learning without increasing academic burden on teachers.'
  },
  {
    category: 'Hardware & Infrastructure',
    question: 'What infrastructure is required from the school before installing the lab?',
    answer: 'The school needs to provide: 1) A dedicated hall or classroom (minimum 600–1,500 sq. ft.), 2) Reliable single-phase electricity (minimum 5kVA with UPS power backup for 3D printers and computers), 3) Broadband internet connectivity (minimum 50 Mbps), and 4) Standard classroom ventilation/air conditioning. CSEEL handles all interior design layouts, modular anti-static workbenches, tool shadow boards, and safety equipment.'
  },
  {
    category: 'Teacher Training & Support',
    question: 'Who will teach the students? Do our existing science and computer teachers receive training?',
    answer: 'Yes. CSEEL conducts an intensive 5-Day Faculty Development Program (FDP) that certifies your existing physics, chemistry, biology, maths, and computer science teachers. We also assign a dedicated Regional STEM Mentor who conducts monthly masterclasses, assists with school tinkerfests, and prepares students for national competitions like the ATL Marathon and National STEM Challenge.'
  },
  {
    category: 'Cost & Procurement',
    question: 'Are CSEEL lab packages and components available on GeM (Government e-Marketplace)?',
    answer: 'Yes, our institutional packages, lab furniture, 3D printers, and electronics components are fully compliant with GeM procurement norms, BIS safety standards, and CE certifications for seamless procurement by PM SHRI, Kendriya Vidyalayas, and government educational societies.'
  },
  {
    category: 'Curriculum & NEP 2020',
    question: 'How do virtual lab simulations integrate with physical hands-on hardware?',
    answer: 'Every physical experiment in the CSEEL lab has a twin interactive virtual simulation on the CSEEL platform. Students can test circuit logic, simulate sensor code, and observe molecular docking on their laptops or tablets before handling physical hardware in the lab, reducing equipment damage and accelerating conceptual clarity.'
  }
];
