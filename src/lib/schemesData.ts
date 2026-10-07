export interface SchemeOfficialLink {
  title: string;
  subtitle: string;
  url: string;
  isPdf?: boolean;
}

export interface SchemeStat {
  label: string;
  value: string;
  detail: string;
}

export interface SchemeFinancialItem {
  component: string;
  allocation: string;
  nature: string; // Recurring / Non-recurring / Capital
  rules: string;
}

export interface SchemeStep {
  step: number;
  title: string;
  desc: string;
  portal?: string;
}

export interface SchemeFaq {
  q: string;
  a: string;
}

export interface SchemeArticleData {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  badge: string;
  badgeColor?: string;
  readTime: string;
  updatedDate: string;
  author: {
    name: string;
    role: string;
    initials: string;
    bio: string;
  };
  heroImage: string;
  heroImageAlt: string;
  tagline: string;
  stats: SchemeStat[];
  officialLinks: SchemeOfficialLink[];
  tags: string[];
  
  // Structured Article Sections
  overview: {
    heading: string;
    paragraphs: string[];
    calloutText?: string;
  };
  eligibility: {
    heading: string;
    bullets: string[];
    note?: string;
  };
  financialMatrix: {
    heading: string;
    intro: string;
    items: SchemeFinancialItem[];
    totalOrMaxGrant: string;
  };
  labInfrastructure: {
    heading: string;
    intro: string;
    labTypes: {
      name: string;
      sqft: string;
      hardware: string[];
      mandate: string;
    }[];
  };
  processSteps: {
    heading: string;
    intro: string;
    steps: SchemeStep[];
  };
  complianceAndAudits: {
    heading: string;
    points: string[];
    warningNote: string;
  };
  faqs: SchemeFaq[];
  relatedSlugs: string[];
}

export const SCHEMES_DATA: Record<string, SchemeArticleData> = {
  'pm-shri': {
    slug: 'pm-shri',
    title: 'PM SHRI Schools Scheme: Modernization Grants, Lab Upgrade & Infrastructure Norms (2026)',
    shortTitle: 'PM SHRI Schools Scheme',
    eyebrow: 'Centrally Sponsored Flagship Initiative',
    badge: '₹27,360 Cr Outlay',
    readTime: '9 min read',
    updatedDate: 'October 2026',
    author: {
      name: 'Devendra Singh',
      role: 'Lead Govt Grants & STEM Lab Consultant',
      initials: 'DS',
      bio: 'Advising 250+ KVs, JNVs, and State Model Schools on PM SHRI infrastructure DPR preparation, GFR-2017 compliant lab procurement, and PFMS fund utilization.'
    },
    heroImage: '/images/categories/engineering.jpg',
    heroImageAlt: 'PM SHRI exemplar school modern science laboratory with smart classroom and robotic workstations',
    tagline: 'The Pradhan Mantri Schools for Rising India (PM SHRI) initiative aims to transform over 14,500 exemplar government schools across India into NEP 2020 showcase institutions, providing 100% financial and technical assistance for integrated science laboratories, Atal Tinkering Labs, and digital ICT infrastructure.',
    stats: [
      { label: 'Total Budget Outlay', value: '₹27,360 Cr', detail: 'Covering 5 Years (2022-23 to 2026-27)' },
      { label: 'Exemplar Schools', value: '14,500+', detail: '2 Schools Per Block / Urban Local Body Across India' },
      { label: 'Funding Ratio', value: '60:40 / 90:10', detail: 'Centre:State (100% Central Funding for UTs without legislature)' },
      { label: 'Annual School Cap', value: 'Up to ₹2 Cr', detail: 'Phased Multi-Year Development Plan via PFMS' }
    ],
    officialLinks: [
      {
        title: 'PM SHRI Official National Portal',
        subtitle: 'National Project Management & Tracking System',
        url: 'https://pmshrischools.education.gov.in',
        isPdf: false
      },
      {
        title: 'PM SHRI Implementation Framework (PDF)',
        subtitle: 'Ministry of Education Gazetted Guidelines',
        url: 'https://dsel.education.gov.in/sites/default/files/2022-10/PM_SHRI_Guidelines.pdf',
        isPdf: true
      },
      {
        title: 'SQAF - School Quality Assessment Framework',
        subtitle: 'CBSE & MoE Benchmark Compliance Manual',
        url: 'https://pmshrischools.education.gov.in/sqaf',
        isPdf: true
      },
      {
        title: 'Department of School Education & Literacy',
        subtitle: 'dsel.education.gov.in Official Scheme Repository',
        url: 'https://dsel.education.gov.in/scheme/pm-shri',
        isPdf: false
      }
    ],
    tags: ['PMSHRI', 'NEP2020', 'ModernizationGrants', 'IntegratedScienceLab', 'SmartClassrooms', 'GFR2017'],
    overview: {
      heading: '1. What is PM SHRI Schools Scheme & Its National Strategic Vision?',
      paragraphs: [
        'The Pradhan Mantri Schools for Rising India (PM SHRI) is a landmark centrally sponsored scheme approved by the Union Cabinet on 7th September 2022 with a comprehensive financial outlay of ₹27,360 Crore spanning a five-year implementation window. Its foundational mandate is to upgrade more than 14,500 government schools (administered by Central Government/KVS/NVS, State Governments, and Local Bodies) into green, experiential, and future-ready institutions that embody the complete operational blueprint of the National Education Policy (NEP) 2020.',
        'Unlike conventional ad-hoc educational grants, PM SHRI adopts a rigorous "Saturation Approach". This methodology guarantees that designated institutions receive holistic, multi-pillar funding across Curriculum & Pedagogy, Infrastructure & Digital Technology, Human Resources & Leadership, Inclusive Practices & Gender Equity, Management & Governance, and Beneficiary Satisfaction.',
        'A significant proportion of the non-recurring capital grant is explicitly earmarked for constructing state-of-the-art Integrated Science Laboratories, Tinkering & Vocational Innovation Labs, Artificial Intelligence & Robotics workstations, and high-speed digital classrooms under General Financial Rules (GFR) 2017.'
      ],
      calloutText: '🎯 Core National Objective: To establish at least two exemplar schools per administrative block (one Elementary and one Secondary/Senior Secondary) that serve as local mentorship hubs, guiding neighboring cluster schools in progressive pedagogy, modern scientific inquiry, and vocational competencies.'
    },
    eligibility: {
      heading: '2. Eligibility Criteria & School Selection Methodology (Challenge Method)',
      bullets: [
        'Eligible Institutions: Only operational Government schools (including Kendriya Vidyalayas, Jawahar Navodaya Vidyalayas, State Government institutions, and Municipal/Local Body Schools) possessing an active UDISE+ code.',
        'Benchmark Assessment (Stage 1): Schools must initially achieve the state-mandated minimum qualifying score across core infrastructural prerequisites, including a permanent pucca structure, barrier-free separate restrooms for boys and girls, potable drinking water, and regular electrical connectivity.',
        'Challenge Method Competition (Stage 2): Qualified institutions compete nationally on the PM SHRI portal by submitting verifiable geotagged photographic documentation, historical learning outcome data, and a committed 5-year School Development Plan (SDP).',
        'Physical Verification & Sanction (Stage 3): State and Central Joint Screening Committees conduct physical site verifications and execute formal tripartite Memorandums of Understanding (MoUs) to formalize PM SHRI designation.'
      ],
      note: '⚠️ Note for Private Schools: Private unaided institutions are not directly eligible for central PM SHRI capital funding; however, they can form academic mentorship linkages and cluster partnerships with regional PM SHRI institutions to align with CBSE composite lab benchmarks.'
    },
    financialMatrix: {
      heading: '3. Financial Norms & Head-wise Budget Allocation Matrix',
      intro: 'PM SHRI allocations are governed strictly under Recurring and Non-Recurring accounting heads. Under Ministry of Education audit mandates, capital laboratory and workshop assets must be procured exclusively through non-recurring budget envelopes:',
      items: [
        {
          component: 'Integrated Science & Composite Lab',
          allocation: '₹8.00 Lakh to ₹14.00 Lakh',
          nature: 'Non-Recurring (Capital)',
          rules: 'Physics, Chemistry, and Biology apparatus, Borosilicate 3.3 glassware, granite workbenches, acid-resistant ceramic sinks, digital sensors, and safety infrastructure.'
        },
        {
          component: 'Atal Tinkering / Innovation Skill Lab',
          allocation: '₹10.00 Lakh to ₹12.00 Lakh',
          nature: 'Non-Recurring (Capital)',
          rules: 'FDM 3D Printers, educational robotics kits, Arduino/Raspberry Pi microcontrollers, soldering stations, DIY maker tools, and AI hardware modules.'
        },
        {
          component: 'Smart Classrooms & ICT Hub',
          allocation: '₹6.50 Lakh to ₹10.00 Lakh',
          nature: 'Non-Recurring (Digital Infra)',
          rules: 'Interactive Flat Panels (IFP 75" 4K), digital smart podiums, online UPS power backup systems, localized cloud LMS, and structured optical fiber cabling.'
        },
        {
          component: 'Green School & BaLA Infrastructure',
          allocation: '₹3.00 Lakh to ₹5.00 Lakh',
          nature: 'Capital / Minor Civil',
          rules: 'Rooftop solar panel installation, rainwater harvesting filtration, Building as Learning Aid (BaLA) science murals, and energy-efficient LED upgrades.'
        },
        {
          component: 'Annual Lab Consumables & Maintenance',
          allocation: '₹1.50 Lakh to ₹2.50 Lakh / Year',
          nature: 'Recurring Grant',
          rules: 'Analytical chemical reagents, biological specimen replacements, sensor recalibration, 3D printing filaments, and ongoing hardware servicing.'
        }
      ],
      totalOrMaxGrant: '₹1.00 Cr to ₹2.00 Cr per school (Disbursed in phased annual tranches via PFMS Single Nodal Accounts)'
    },
    labInfrastructure: {
      heading: '4. PM SHRI Mandatory Lab Setup Norms & Technical Specifications',
      intro: 'In accordance with Chapter 4 of the PM SHRI Operational Guidelines, every selected secondary and senior secondary institution must commission the following dedicated laboratory zones:',
      labTypes: [
        {
          name: 'Integrated Science & Composite Lab',
          sqft: 'Min. 600 Sq. Ft. (Continuous Unobstructed Layout)',
          hardware: [
            '10 Heavy-duty student workbenches topped with chemical-resistant polished black granite',
            '8 to 10 Acid-resistant ceramic wash sinks supplied with continuous pressurized running water',
            'Complete inventory of 49 non-consumable physics and general science apparatus',
            '18 High-purity analytical chemical reagents secured inside locked double-door metal storage cabinets',
            '15 Preserved biological museum specimens and permanent microscopic mounts'
          ],
          mandate: 'Mandatory for Class 6 to 10 general practicals and secondary CBSE affiliation.'
        },
        {
          name: 'Innovation & Tinkering Skill Lab (ATL Aligned)',
          sqft: 'Min. 500 to 600 Sq. Ft.',
          hardware: [
            'Fused Deposition Modeling (FDM) 3D Printer with auto-bed leveling and PLA filaments',
            'Robotics starter, intermediate, and autonomous sensor kits',
            'Microcontroller development boards (Arduino UNO, ESP32, Raspberry Pi 4/5)',
            'Digital storage oscilloscopes, precision multimeters, and soldering rework stations',
            'Anti-static ESD rubber bench matting and ergonomic student workstation stools'
          ],
          mandate: 'Mandatory for NEP 2020 10-bagless days and vocational innovation (Classes 6-12).'
        },
        {
          name: 'ICT & Computational Intelligence Lab',
          sqft: 'Min. 400 to 600 Sq. Ft.',
          hardware: [
            '20 to 40 All-in-One Desktop computers / Thin Clients connected via gigabit LAN',
            '1 Interactive 75-inch 4K Touch Display with dual-OS Windows/Android architecture',
            'Dedicated AI programming environments (Python, Jupyter, Scratch, OpenCV)',
            '2-Hour heavy-duty online UPS inverter power backup system'
          ],
          mandate: 'Mandatory for CBSE AI Curriculum (Code 417/843) and Coding (Code 418).'
        }
      ]
    },
    processSteps: {
      heading: '5. Step-by-Step Fund Utilization & Procurement Workflow',
      intro: 'All procurements must strictly adhere to the General Financial Rules (GFR-2017) and public procurement protocols executed via the Government e-Marketplace (GeM):',
      steps: [
        {
          step: 1,
          title: 'Annual Work Plan & Budget (AWP&B) Approval',
          desc: 'The School Management Committee (SMC) formulates and submits an itemized DPR for lab modernization to the District Project Office (DPO) and State Project Directorate.',
          portal: 'PM SHRI National Portal'
        },
        {
          step: 2,
          title: 'Activation of Single Nodal Account (SNA) / PFMS Child Account',
          desc: 'Central and State matching funds are electronically credited into the school’s designated Zero Balance Account (ZBA) mapped on the Public Financial Management System (PFMS).',
          portal: 'PFMS Portal (pfms.nic.in)'
        },
        {
          step: 3,
          title: 'GeM Bidding & Verified OEM Procurement',
          desc: 'Scientific apparatus, 3D printers, modular furniture, and digital hardware are procured via GeM Custom Bids or Direct Purchase under GFR Rule 149 from empanelled turnkey partners like CSEEL.',
          portal: 'GeM Portal (gem.gov.in)'
        },
        {
          step: 4,
          title: 'Physical Delivery, Installation & Asset Verification',
          desc: 'The turnkey supplier executes on-site commissioning, conducts equipment calibration, and assists with logging unique serial numbers in the Master Stock Register.',
          portal: 'On-site Inspection'
        },
        {
          step: 5,
          title: 'Utilization Certificate (UC) & Third-Party Audit',
          desc: 'The Principal submits a Form GFR 12-C Utilization Certificate certified by an authorized auditor. Subsequent tranche disbursals require proof of 75%+ fund utilization.',
          portal: 'PRABANDH / PM SHRI Dashboard'
        }
      ]
    },
    complianceAndAudits: {
      heading: '6. Mandatory Audits, Compliance & Critical Pitfalls to Avoid',
      points: [
        'GeM Procurement Compliance: Order splitting to circumvent competitive bidding thresholds is strictly prohibited under Central Vigilance Commission (CVC) and GFR guidelines.',
        'Permanent Asset Identification: All non-consumable equipment (microscopes, prisms, 3D printers) must be physically inscribed or stenciled with the official PM SHRI scheme logo, procurement year, and unique asset ID.',
        'Fire & Chemical Safety Clearances: Institutions must maintain valid Fire NOCs, Class ABC fire extinguishers, sand buckets, and first-aid kits prior to joint inspection committee reviews.',
        'Zero-Balance Account Maintenance: Unutilized capital funds at the conclusion of the financial year must be formally reconciled via PFMS; offline commercial savings accounts are prohibited.'
      ],
      warningNote: '🚨 Statutory Caution: Procuring scientific or digital hardware through unverified offline local vendors without GeM registration or valid GST invoices risks immediate disqualification during CAG audits and the revocation of subsequent grant tranches.'
    },
    faqs: [
      {
        q: 'Can PM SHRI schools procure lab equipment from private turnkey vendors?',
        a: 'Yes, provided the procurement is executed through the Government e-Marketplace (GeM) in strict accordance with GFR-2017 regulations. Schools can engage GeM-registered OEMs and turnkey lab providers like CSEEL through direct purchase or competitive bidding.'
      },
      {
        q: 'What is the total grant disbursement ceiling for an individual PM SHRI school?',
        a: 'The PM SHRI scheme is executed over a five-year cycle. Individual institutions are sanctioned an aggregate development envelope between ₹1.00 Crore and ₹2.00 Crore, with initial first-year allocations typically ranging from ₹25 Lakh to ₹40 Lakh for core lab and infrastructural modernization.'
      },
      {
        q: 'If a school already possesses an operational Atal Tinkering Lab (ATL), is it still eligible for science lab funding?',
        a: 'Yes. An ATL operates as a dedicated open innovation and tinkering workspace, whereas PM SHRI allocates separate, independent funding heads for curricular Composite Science Laboratories (Physics, Chemistry, Biology) and advanced ICT digital suites.'
      },
      {
        q: 'Which banking protocol governs vendor payments and fund releases?',
        a: 'All transactions are managed exclusively via the Public Financial Management System (PFMS) through a mapped Single Nodal Account (SNA) or Zero Balance Account (ZBA). Cash transactions and manual paper cheques are strictly disallowed.'
      },
      {
        q: 'What specific turnkey assistance does CSEEL provide to PM SHRI schools?',
        a: 'CSEEL delivers end-to-end turnkey support: preparing comprehensive DPRs, drafting GeM bid specifications, supplying 49 non-consumable apparatus and 3D printing hardware, conducting certified teacher training, and completing asset register documentation.'
      }
    ],
    relatedSlugs: ['atl-grants', 'samagra-shiksha', 'nep-2020-guidelines', 'cbse-skill-hub']
  },

  'atl-grants': {
    slug: 'atl-grants',
    title: 'NITI Aayog ATL Grants: ₹20 Lakh Funding, Tranche 1–3 Disbursement & Setup Guide (2026)',
    shortTitle: 'NITI Aayog ATL Grants',
    eyebrow: 'Atal Innovation Mission (AIM) Flagship',
    badge: '₹20 Lakh Grant',
    readTime: '10 min read',
    updatedDate: 'October 2026',
    author: {
      name: 'Devendra Singh',
      role: 'Atal Tinkering Lab Specialist & Master Trainer',
      initials: 'DS',
      bio: 'Guided over 180+ institutions across India through ATL application, PFMS registration, Package 1-4 equipment commissioning, and Tranche 2/3 UC approvals.'
    },
    heroImage: '/images/categories/technology.jpg',
    heroImageAlt: 'Students prototyping with 3D printer and robotics in NITI Aayog Atal Tinkering Lab setup',
    tagline: 'Under NITI Aayog’s Atal Innovation Mission (AIM), selected institutions receive a total Grant-in-Aid of ₹20 Lakh over five years. Explore the complete PFMS disbursement roadmap, Package 1-4 equipment specifications, and compliance rules for Tranche 1 (₹12 Lakh) and Tranche 2/3 (₹2 Lakh/year).',
    stats: [
      { label: 'Total Grant-in-Aid', value: '₹20 Lakhs', detail: 'Disbursed Across 5 Academic Years' },
      { label: 'One-Time Setup Cost', value: '₹10 Lakhs', detail: 'Package 1 to 4 Capital Equipment' },
      { label: 'Annual O&M Allowance', value: '₹2 Lakhs / Yr', detail: 'Consumables, Mentorship & Events (5 Yrs)' },
      { label: 'First Year Release', value: '₹12 Lakhs', detail: '₹10L Setup + ₹2L Year 1 O&M Upfront' }
    ],
    officialLinks: [
      {
        title: 'Atal Innovation Mission (AIM) Official Portal',
        subtitle: 'aim.gov.in — NITI Aayog Innovation Mission',
        url: 'https://aim.gov.in',
        isPdf: false
      },
      {
        title: 'ATL Query & Compliance Resolution Portal',
        subtitle: 'atl.aim.gov.in — School Login & Tranche Tracking',
        url: 'https://atl.aim.gov.in',
        isPdf: false
      },
      {
        title: 'ATL Fund Utilization Guidelines (PDF)',
        subtitle: 'Official NITI Aayog Grant-in-Aid Rulebook',
        url: 'https://aim.gov.in/pdf/ATL-Fund-Utilization-Guidelines.pdf',
        isPdf: true
      },
      {
        title: 'PFMS Public Financial Management System',
        subtitle: 'pfms.nic.in Central Treasury Disbursement Portal',
        url: 'https://pfms.nic.in',
        isPdf: false
      }
    ],
    tags: ['ATALab', 'NITIAayog', 'AIM', 'ATLGrants', 'Package1to4', 'PFMSDisbursement', 'RoboticsLab'],
    overview: {
      heading: '1. Understanding the NITI Aayog Atal Tinkering Lab (ATL) Scheme',
      paragraphs: [
        'The Atal Tinkering Lab (ATL) initiative is the Government of India’s premier innovation framework executed by the Atal Innovation Mission (AIM), NITI Aayog. Its core purpose is to cultivate scientific curiosity, creative problem-solving, and computational agility among students in Classes 6 through 12 using do-it-yourself (DIY) maker kits and emerging 21st-century technological tools.',
        'Under the scheme, every sanctioned school is awarded an aggregate Grant-in-Aid of ₹20,00,000 (Twenty Lakh Rupees). The grant is structured into two distinct financial compartments: a one-time capital establishment grant of ₹10.00 Lakh for procuring mandated Package 1-4 lab hardware, and ₹10.00 Lakh in operational and maintenance (O&M) funds distributed at ₹2.00 Lakh per annum across five operational years.',
        'During the initial year of sanction, schools receive a lump sum of ₹12.00 Lakhs directly into their dedicated PFMS account. Strict compliance with procurement categories and electronic accounting is necessary to guarantee uninterrupted release of subsequent annual installments.'
      ],
      calloutText: '💡 Key Principle: An ATL is fundamentally distinct from a standard science laboratory; it serves as a community prototyping studio where students transform conceptual theories into physical innovations using 3D printers, microcontrollers, IoT sensors, and mechanical assemblies.'
    },
    eligibility: {
      heading: '2. School Eligibility & Infrastructure Prerequisites for ATL Selection',
      bullets: [
        'Recognized Institutions: Government schools, local body institutions, central schools (KVs, JNVs), and private unaided CBSE/ICSE/State Board schools.',
        'Dedicated Floor Area: A minimum of 1,500 sq. ft. of dedicated, contiguous carpet area in plain regions (or 1,000 sq. ft. in hilly/northeastern states) reserved exclusively for ATL activities.',
        'Enrollment Norm: Regular student enrollment of at least 400 learners across Classes 6 to 12 (or 250 students in hilly and remote areas).',
        'Academic Track Record: Active participation in science exhibitions, an established computer laboratory with high-speed broadband, and dedicated mathematics/science faculty mentors.',
        'Administrative Readiness: Valid registration on NITI Aayog’s NGO-DARPAN portal for private trusts/societies and formal commitment to process all financial transactions via PFMS.'
      ],
      note: '📌 Mandatory Physical Boundary: The designated 1,500 sq. ft. area cannot be a shared or partitioned room inside an existing physics, chemistry, or general computer lab; it must function as a standalone maker space.'
    },
    financialMatrix: {
      heading: '3. ₹20 Lakh Grant Tranche Disbursement & Expenditure Breakdown',
      intro: 'The disbursement framework and permissible expenditure heads established by NITI Aayog are tracked electronically via PFMS:',
      items: [
        {
          component: 'Tranche 1: Capital Establishment Grant',
          allocation: '₹10,00,000 (One-time)',
          nature: 'Capital / Non-Recurring',
          rules: 'Mandatory procurement of Package 1 (Electronics & STEM kits), Package 2 (3D Printer & prototyping), Package 3 (Mechanical hand tools), and Package 4 (Sensors, IoT & safety).'
        },
        {
          component: 'Tranche 1: Year-1 Operational & Maintenance',
          allocation: '₹2,00,000 (Year 1)',
          nature: 'Recurring / O&M',
          rules: 'Consumables (PLA filaments, solder wire, batteries), teacher mentor honorariums, student travel for state/national STEM competitions, and ATL Community Day workshops.'
        },
        {
          component: 'Tranche 2: Year-2 & Year-3 O&M Release',
          allocation: '₹2,00,000 + ₹2,00,000',
          nature: 'Recurring / O&M',
          rules: 'Disbursed upon electronic submission of Form GFR 12-A Utilization Certificates, monthly activity updates on the AIM portal, and documented 75%+ utilization of prior funds.'
        },
        {
          component: 'Tranche 3: Year-4 & Year-5 O&M Release',
          allocation: '₹2,00,000 + ₹2,00,000',
          nature: 'Recurring / O&M',
          rules: 'Final annual tranches released upon verification of ATL Marathon submissions, student prototype documentation, and audited institutional financial statements.'
        }
      ],
      totalOrMaxGrant: '₹20,00,000 (Total Grant-in-Aid over 5 Operating Years)'
    },
    labInfrastructure: {
      heading: '4. Mandatory ATL Equipment Packages (Package 1 to 4 Specifications)',
      intro: 'NITI Aayog prescribes an exhaustive, curriculum-aligned inventory divided into four functional packages:',
      labTypes: [
        {
          name: 'Package 1: Electronics, DIY STEM & Microcontroller Kits',
          sqft: 'Core Electronic Workstations',
          hardware: [
            'Arduino UNO, Nano, ESP32, and BBC micro:bit microcontroller boards with USB cables',
            'Solderless breadboards, assorted jumper wires, resistors, capacitors, LEDs, and buzzer modules',
            'Relay modules, L298N motor drivers, geared DC motors, servo motors, and stepper motors',
            'Digital multimeters, regulated DC bench power supplies (0-30V, 5A)',
            'Temperature-controlled soldering stations, lead-free solder wire, and desoldering pumps'
          ],
          mandate: 'Foundational electronics prototyping and automated circuit assembly.'
        },
        {
          name: 'Package 2: 3D Printing & Rapid Prototyping Hardware',
          sqft: 'Digital Fabrication Corner',
          hardware: [
            'Fused Deposition Modeling (FDM) 3D Printer (Min. 200x200x200 mm build volume, heated bed, auto-leveling)',
            'Non-toxic, biodegradable PLA and PETG filament spools in assorted primary colors',
            '3D printing post-processing kit (precision scrapers, nozzle clean needles, heat-resistant tape)',
            'Installed open-source slicing software (UltiMaker Cura / PrusaSlicer) on lab workstations'
          ],
          mandate: 'Additive manufacturing, spatial engineering, and industrial design.'
        },
        {
          name: 'Package 3: Mechanical & Carpentry Maker Tools',
          sqft: 'Heavy Making Workbench',
          hardware: [
            'Electric hand drill machine with high-torque drill bit set and bench drill stand',
            'Hand tools: Wire strippers, combination pliers, precision screwdriver sets, hacksaw, ball-peen hammer',
            'Heavy-duty bench vice, digital vernier callipers, steel measuring tapes, and industrial hot glue guns',
            'Safety gear: Anti-cut gloves, impact-resistant safety goggles, heat-resistant aprons, and first aid kit'
          ],
          mandate: 'Structural fabrication, mechanical assembly, and chassis construction.'
        },
        {
          name: 'Package 4: Advanced Sensors, IoT & AI Drone Modules',
          sqft: 'Next-Gen Research Corner',
          hardware: [
            'Ultrasonic, IR, PIR motion, LDR light, soil moisture, and gas/smoke detection sensors',
            'IoT communication modules (Wi-Fi, Bluetooth BLE, LoRa) and serial camera modules',
            'DIY programmable educational quadcopter drone assembly kit with flight simulator software',
            'Raspberry Pi 4 / 5 single-board computers preloaded with Linux, Python, and computer vision libraries'
          ],
          mandate: 'Artificial intelligence, Internet of Things, and autonomous aerial robotics.'
        }
      ]
    },
    processSteps: {
      heading: '5. Step-by-Step PFMS Setup & Tranche Release Process',
      intro: 'To claim the ₹12.00 Lakh first tranche and secure recurring annual maintenance disbursements, schools follow this sequence:',
      steps: [
        {
          step: 1,
          title: 'Selection Notification & MyGov / AIM Verification',
          desc: 'The school receives an official sanction letter containing a unique ATL UID from the Atal Innovation Mission, NITI Aayog.',
          portal: 'aim.gov.in'
        },
        {
          step: 2,
          title: 'Execution of Memorandum of Agreement (MoA) & Indemnity Bond',
          desc: 'The school executes the bilateral MoA. Private trusts/societies must submit an Indemnity Bond registered on non-judicial stamp paper.',
          portal: 'ATL Compliance Portal'
        },
        {
          step: 3,
          title: 'Dedicated Bank Account & PFMS Scheme Mapping',
          desc: 'The school opens an independent savings bank account in a nationalized bank and maps it under Scheme [0217] - Atal Innovation Mission on PFMS.',
          portal: 'pfms.nic.in'
        },
        {
          step: 4,
          title: 'Tranche-1 Direct Credit (₹12 Lakhs Upfront)',
          desc: 'The central treasury executes an electronic direct bank transfer of ₹10 Lakhs (Capital) + ₹2 Lakhs (Year-1 O&M) into the mapped account.',
          portal: 'PFMS Electronic Transfer'
        },
        {
          step: 5,
          title: 'Commissioning & Teacher Master Training',
          desc: 'The school purchases Packages 1–4 from a verified turnkey partner like CSEEL, installs equipment, trains teachers, and formally inaugurates the lab.',
          portal: 'On-site ATL Room'
        },
        {
          step: 6,
          title: 'Monthly Reporting & Tranche 2/3 UC Submission',
          desc: 'The school submits monthly activity metrics on the AIM dashboard and uploads a CA-certified Form GFR 12-A to unlock subsequent annual ₹2 Lakh tranches.',
          portal: 'atl.aim.gov.in'
        }
      ]
    },
    complianceAndAudits: {
      heading: '6. Strict Financial Audit Rules & Mandatory Record-Keeping',
      points: [
        'Mandatory Electronic PFMS Payments: Diverting ATL funds into general institutional accounts, issuing manual bearer cheques, or cash withdrawals exceeding ₹500 results in immediate blacklisting by NITI Aayog.',
        'Annual Form GFR 12-A Submission: Within 12 months of fund credit, a comprehensive Utilization Certificate audited by a Chartered Accountant must be submitted.',
        'Asset Register Inscription: Non-consumable assets must be logged under Form GFR 22 with serial numbers, dates of purchase, and active warranty terms.',
        'Community Mentorship Obligation: Every ATL is mandated to mentor students from at least five neighboring government schools or community centers under the ATL Mentor India network.'
      ],
      warningNote: '⚠️ Legal & Recovery Notice: Retaining grant funds in savings accounts to earn bank interest without commissioning the laboratory within 12 months triggers statutory recovery proceedings by NITI Aayog with 18% penal interest.'
    },
    faqs: [
      {
        q: 'Does Tranche 1 disburse the entire ₹12 Lakhs in a single installment?',
        a: 'Yes. Upon successful completion of MoA execution, indemnity bond verification, and PFMS Scheme [0217] mapping, the central treasury deposits ₹10 Lakh (Capital Setup) and ₹2 Lakh (Year-1 O&M) simultaneously.'
      },
      {
        q: 'Are private unaided schools eligible for NITI Aayog ATL Grants?',
        a: 'Yes. Private schools registered under non-profit educational societies or charitable trusts are fully eligible, provided they hold active registration on the NGO-DARPAN portal and submit a registered indemnity bond.'
      },
      {
        q: 'What are the core prerequisites to unlock Tranche 2 (Year-2 ₹2 Lakh)?',
        a: 'The institution must demonstrate at least 75% utilization of the initial ₹12 Lakh grant, submit an audited Form GFR 12-A Utilization Certificate, and maintain a consistent monthly reporting record on the AIM dashboard.'
      },
      {
        q: 'Does CSEEL provide end-to-end Package 1 to 4 commissioning and training?',
        a: 'Yes. CSEEL supplies 100% NITI Aayog compliant 3D printers, robotics modules, electronic kits, tools, and sensors, accompanied by a 3-day on-site faculty training program and continuous 5-year mentorship support.'
      },
      {
        q: 'Can a school apply if it has less than 1,500 sq. ft. of available floor area?',
        a: 'For schools located in plain regions, 1,500 sq. ft. is mandatory (which can be two interconnected or adjacent rooms). A concession of 1,000 sq. ft. is granted specifically to institutions in designated hilly or northeastern states.'
      }
    ],
    relatedSlugs: ['pm-shri', 'samagra-shiksha', 'nep-2020-guidelines', 'cbse-skill-hub']
  },

  'samagra-shiksha': {
    slug: 'samagra-shiksha',
    title: 'Samagra Shiksha Abhiyan: Composite School Grant & Science Lab Infrastructure Norms (2026)',
    shortTitle: 'Samagra Shiksha Abhiyan',
    eyebrow: 'Unified Centrally Sponsored School Framework',
    badge: 'Govt & Aided Grants',
    readTime: '8 min read',
    updatedDate: 'October 2026',
    author: {
      name: 'Devendra Singh',
      role: 'Educational Policy & School Grant Consultant',
      initials: 'DS',
      bio: 'Expert in State Education Project Directorate norms, Samagra Shiksha civil/lab interventions, Swachhta Action Plan allocations, and SMC procurement frameworks.'
    },
    heroImage: '/images/categories/chemistry.jpg',
    heroImageAlt: 'Government school modern composite science laboratory funded under Samagra Shiksha Abhiyan',
    tagline: 'Under the Samagra Shiksha Abhiyan, government and government-aided secondary institutions receive annual Composite School Grants and capital laboratory allocations to modernize practical science facilities, replace glassware, and procure analytical reagents.',
    stats: [
      { label: 'Composite School Grant', value: '₹10K to ₹1 Lakh+', detail: 'Annual Recurring Grant Based on UDISE+ Enrolment' },
      { label: 'Secondary Lab Fund', value: 'Up to ₹10 Lakhs', detail: 'Integrated Science Lab Creation Grant' },
      { label: 'Swachhta Mandate', value: 'Min. 10%', detail: 'Compulsory Lab Hygiene & Sanitation Allocation' },
      { label: 'Executing Body', value: 'SMC / SDMC', detail: 'School Management Committee with PFMS Protocol' }
    ],
    officialLinks: [
      {
        title: 'Samagra Shiksha Official National Portal',
        subtitle: 'samagrashiksha.education.gov.in — Ministry of Education',
        url: 'https://samagrashiksha.education.gov.in',
        isPdf: false
      },
      {
        title: 'Samagra Shiksha Comprehensive Framework (PDF)',
        subtitle: 'Department of School Education & Literacy Manual',
        url: 'https://dsel.education.gov.in/sites/default/files/2019-05/Samagra_Shiksha_Framework.pdf',
        isPdf: true
      },
      {
        title: 'UDISE+ Unified District Information System',
        subtitle: 'udiseplus.gov.in School Data & Enrolment Verification',
        url: 'https://udiseplus.gov.in',
        isPdf: false
      },
      {
        title: 'PRABANDH Project Monitoring System',
        subtitle: 'State Project Directorate Financial Reporting',
        url: 'https://prabandh.education.gov.in',
        isPdf: false
      }
    ],
    tags: ['SamagraShiksha', 'CompositeSchoolGrant', 'GovtSchools', 'ScienceLabNorms', 'SMCExecution', 'UDISEPlus'],
    overview: {
      heading: '1. What is Samagra Shiksha Abhiyan & How Does It Fund School Labs?',
      paragraphs: [
        'Samagra Shiksha is an overarching national program for the school education sector spanning pre-school to class 12. Formulated in direct alignment with the National Education Policy 2020, it subsumes three erstwhile flagship centrally sponsored schemes: Sarva Shiksha Abhiyan (SSA), Rashtriya Madhyamik Shiksha Abhiyan (RMSA), and Teacher Education (TE).',
        'Under the infrastructure strengthening component of Samagra Shiksha, secondary and senior secondary schools receive targeted financial assistance to eliminate infrastructure deficiencies. The program specifically mandates that school laboratories must not remain static "showpieces", but should function as active experiential hubs equipped with continuous water supply, standardized apparatus, chemical consumables, and safety provisions.',
        'Funding is disbursed through two primary streams: the annual recurring "Composite School Grant" (CSG) scaled according to UDISE+ student enrollment for routine lab maintenance and chemical consumables, and dedicated capital development grants approved by the Project Approval Board (PAB) for establishing new Integrated Science Laboratories.'
      ],
      calloutText: '📋 Guiding Philosophy: No student in a government or aided school should be deprived of first-hand scientific experimentation due to lack of glassware, reagents, or workbenches. Samagra Shiksha provides the fiscal bedrock to move science teaching from textbooks to lab benches.'
    },
    eligibility: {
      heading: '2. Enrolment-based Grant Slabs (Composite School Grant Framework)',
      bullets: [
        'Enrolment up to 30 students: ₹10,000 per annum (Primary and Upper Primary schools with compact student bodies).',
        'Enrolment 31 to 100 students: ₹25,000 per annum (Covers essential teaching-learning materials and minor lab repairs).',
        'Enrolment 101 to 250 students: ₹50,000 per annum (Allocated for science practical supplies, test tubes, and glassware replenishment).',
        'Enrolment 251 to 1,000 students: ₹75,000 per annum (Comprehensive maintenance of secondary labs, chemical reagents, and student tools).',
        'Enrolment above 1,000 students: ₹1,00,000 per annum (Major composite maintenance grant for large multi-section secondary and senior secondary schools).',
        'Special PAB Capital Sanction: High schools approved under State Project Approval Boards receive up to ₹10 Lakhs for complete civil, plumbing, electrical, and furniture installations.'
      ],
      note: '🔔 Mandatory 10% Swachhta Head: Under Samagra Shiksha guidelines, a minimum of 10% of the Composite School Grant must be dedicated specifically to sanitation, lab wash sinks, and safe drainage upkeep.'
    },
    financialMatrix: {
      heading: '3. Allowable Expenditure Heads for Science Laboratories',
      intro: 'School Development and Management Committees (SDMCs) are legally authorized to disburse funds under the following approved operational heads:',
      items: [
        {
          component: 'Replenishment of Chemical Consumables',
          allocation: '₹15,000 to ₹30,000 / Yr',
          nature: 'Recurring Consumables',
          rules: 'Analytical-grade acids, bases, indicator solutions, copper sulphate, filter paper, test tubes, and spirit burner fuel.'
        },
        {
          component: 'Glassware & Breakage Replacement',
          allocation: '₹10,000 to ₹25,000 / Yr',
          nature: 'Consumable Maintenance',
          rules: 'Borosilicate 3.3 beakers, conical flasks, measuring cylinders, test tubes, watch glasses, and stirring rods.'
        },
        {
          component: 'Minor Repair of Lab Infrastructure',
          allocation: '₹10,000 to ₹20,000 / Yr',
          nature: 'Minor Civil / Plumbing',
          rules: 'Repairing leaking swan-neck taps, acid-resistant drainage traps, electrical points for microscopes, and damaged window fittings.'
        },
        {
          component: 'New Science Demonstration Kits',
          allocation: '₹15,000 to ₹40,000',
          nature: 'TLM / Pedagogical Tools',
          rules: 'NCERT-aligned secondary science kits, human anatomical models, optical benches, magnetic field kits, and compound microscopes.'
        }
      ],
      totalOrMaxGrant: '₹10,000 to ₹1,00,000+ Annual CSG + Up to ₹10 Lakhs Capital Grant'
    },
    labInfrastructure: {
      heading: '4. Samagra Shiksha Physical Laboratory Standards',
      intro: 'When establishing or upgrading secondary laboratories under state PAB allocations, schools must satisfy the following physical benchmarks:',
      labTypes: [
        {
          name: 'Secondary Composite Science Laboratory',
          sqft: 'Min. 500 to 600 Sq. Ft.',
          hardware: [
            'Concrete or wooden worktables topped with chemical-resistant black Kadappa or granite stone',
            'Minimum 4 to 8 stainless steel or ceramic sinks with continuous pressurized running water',
            'Acid-resistant drainage manifold connected to an external neutralizer soak pit',
            'Full inventory of 49 NCERT/CBSE mandated non-consumable apparatus',
            'Wall-mounted bilingual periodic tables, safety charts, and first-aid station'
          ],
          mandate: 'Compulsory for all upgraded secondary government high schools.'
        },
        {
          name: 'ICT & Digital Science Demonstration Space',
          sqft: 'Integrated within Lab or 400 Sq. Ft.',
          hardware: [
            'Smart TV display or digital projector with screen for virtual lab simulations',
            'Teacher computing terminal preloaded with NCERT digital curriculum content',
            'Compound microscope equipped with a USB digital camera eyepiece for whole-class display'
          ],
          mandate: 'Aligned to ICT@Schools sub-component under Samagra Shiksha.'
        }
      ]
    },
    processSteps: {
      heading: '5. Sanction, Procurement & Accounting Process through SMC',
      intro: 'Grant utilization is managed transparently through community-driven School Management Committees:',
      steps: [
        {
          step: 1,
          title: 'SMC / SDMC Resolution & Requirement Assessment',
          desc: 'The science faculty submits an itemized inventory requirement; the SMC convenes an official meeting and adopts a formal approval resolution.',
          portal: 'SMC Minute Book'
        },
        {
          step: 2,
          title: 'Direct Credit via PFMS into School Account',
          desc: 'The State Project Directorate credits funds directly into the school’s account under the Samagra Shiksha Single Nodal Account (SNA) banking framework.',
          portal: 'PFMS System'
        },
        {
          step: 3,
          title: 'Purchase through GeM or Local Procurement Committee',
          desc: 'Equipment and chemicals are ordered through the Government e-Marketplace (GeM) or competitive quotations adhering to state financial rules.',
          portal: 'GeM / Local Purchase Committee'
        },
        {
          step: 4,
          title: 'Stock Entry & Headmaster Verification',
          desc: 'All procured apparatus and chemical containers are cataloged in the Master Stock Register with physical signatures and asset markings.',
          portal: 'Physical Stock Register'
        },
        {
          step: 5,
          title: 'Submission of Utilization Certificate & PRABANDH Upload',
          desc: 'The Head of School uploads audited vouchers and submits a signed Utilization Certificate to the Block Education Officer (BEO).',
          portal: 'PRABANDH Portal'
        }
      ]
    },
    complianceAndAudits: {
      heading: '6. Audits, Social Audits & Prohibited Expenditures',
      points: [
        'Prohibition on General Utility Bills: Samagra Shiksha Composite Grants cannot be diverted to cover commercial power or water bills where state subsidies are active.',
        'Mandatory Annual Social Audit: A designated village/ward social audit committee inspects the physical presence and working order of all lab equipment annually.',
        'Voucher Retention Period: Original GST tax invoices, delivery challans, and SMC resolution copies must be preserved for seven years for Accountant General (AG) audits.',
        'Public Transparency Display Board: Schools are required to display grant receipts, expenditure breakdowns, and purchased items on a public wall board outside the laboratory.'
      ],
      warningNote: '📌 Regulatory Directive: Issuing advance payments to unverified local vendors without prior goods inspection is strictly prohibited under state financial protocols.'
    },
    faqs: [
      {
        q: 'Is the Composite School Grant (CSG) automatically disbursed every academic year?',
        a: 'Yes, provided the institution has uploaded the prior financial year’s Utilization Certificate (UC) and verified its enrollment numbers on the UDISE+ portal.'
      },
      {
        q: 'Are private unaided schools eligible for Samagra Shiksha lab grants?',
        a: 'No. Samagra Shiksha infrastructural and composite grants are reserved exclusively for government, local body, and government-aided institutions.'
      },
      {
        q: 'Can government high schools procure lab materials from CSEEL under Samagra Shiksha?',
        a: 'Yes. Schools can place orders with CSEEL through the Government e-Marketplace (GeM) portal or under state procurement guidelines for approved apparatus kits and borosilicate glassware.'
      },
      {
        q: 'Can the grant be utilized to install running water plumbing and sinks in the science lab?',
        a: 'Yes. Upgrading laboratory sinks, water supply pipes, and drainage traps is fully permissible under the minor repair and Swachhta (10%) budget heads.'
      }
    ],
    relatedSlugs: ['pm-shri', 'atl-grants', 'nep-2020-guidelines', 'cbse-skill-hub']
  },

  'nep-2020-guidelines': {
    slug: 'nep-2020-guidelines',
    title: 'NEP 2020 Lab Guidelines: Experiential STEAM, Vocational Skills & 10-Bagless Days Blueprint (2026)',
    shortTitle: 'NEP 2020 Lab Guidelines',
    eyebrow: 'National Education Policy Mandate',
    badge: 'Curriculum Transformation',
    readTime: '8 min read',
    updatedDate: 'October 2026',
    author: {
      name: 'Devendra Singh',
      role: 'NEP 2020 Experiential Curriculum Designer',
      initials: 'DS',
      bio: 'Advising educational leadership on NCF-SE 2023 alignment, 10-bagless day vocational integration, computational thinking, and competency-based assessment.'
    },
    heroImage: '/images/categories/art.jpg',
    heroImageAlt: 'Students engaged in hands-on STEAM experiential learning lab aligned with NEP 2020 guidelines',
    tagline: 'The National Education Policy (NEP) 2020 replaces passive rote memorization with 100% experiential, inquiry-based STEM learning. Learn how to implement mandatory 10 Bagless Days, vocational skill integration, and cross-disciplinary STEAM spaces in Classes 6 to 12.',
    stats: [
      { label: 'Policy Framework', value: 'NEP 2020 & NCF-SE', detail: 'National Curriculum Framework for School Education' },
      { label: 'Bagless Learning', value: '10 Bagless Days', detail: 'Mandatory for Classes 6 to 8 with Local Artisans' },
      { label: 'Vocational Target', value: '50% of Students', detail: 'Must Receive Formal Vocational Exposure by 2025-26' },
      { label: 'Curriculum Shift', value: '5+3+3+4 Structure', detail: 'Foundational, Preparatory, Middle & Secondary Stages' }
    ],
    officialLinks: [
      {
        title: 'National Education Policy 2020 Official Document (PDF)',
        subtitle: 'Ministry of Education Government of India Gazette',
        url: 'https://www.education.gov.in/sites/default/files/NEP_Final_English_0.pdf',
        isPdf: true
      },
      {
        title: 'NCF-SE National Curriculum Framework 2023 (PDF)',
        subtitle: 'NCERT Guidelines for School Education',
        url: 'https://ncert.nic.in/pdf/NCFSE_2023.pdf',
        isPdf: true
      },
      {
        title: 'CBSE Guidelines on 10 Bagless Days (PDF)',
        subtitle: 'Official Guidelines for Implementation in Schools',
        url: 'https://cbseacademic.nic.in/web_material/Manuals/10_Bagless_Days.pdf',
        isPdf: true
      },
      {
        title: 'Ministry of Education Innovation Cell (MIC)',
        subtitle: 'mic.gov.in School Innovation Marathon & Ideation',
        url: 'https://mic.gov.in',
        isPdf: false
      }
    ],
    tags: ['NEP2020', 'NCFSE2023', '10BaglessDays', 'STEAMEducation', 'ExperientialLearning', 'VocationalSkills'],
    overview: {
      heading: '1. The Paradigm Shift: From Rote Memorization to Experiential Labs',
      paragraphs: [
        'Paragraphs 4.4 through 4.8 of the National Education Policy 2020 mandate that experiential learning must become the central pedagogy across all stages of school education. This transition encompasses hands-on exploration, arts-integrated and sports-integrated curricula, storytelling methodologies, and critically, inquiry-driven laboratory experimentation.',
        'Under legacy educational formats, laboratories were restricted spaces reserved almost exclusively for senior secondary (Classes 11 and 12) specialized science streams, with secondary students limited to passive demonstrations. NEP 2020 inverts this architecture: hands-on experimentation, coding, design thinking, and vocational exploration are made compulsory beginning in Class 6.',
        'The National Curriculum Framework for School Education (NCF-SE 2023) further emphasizes multidisciplinary STEAM (Science, Technology, Engineering, Arts, and Mathematics) spaces where disciplinary boundaries between physical sciences, artistic expression, and computational modeling dissolve.'
      ],
      calloutText: '🎯 NEP 2020 Vision: "Science is not merely a collection of facts to be memorized; it is a systematic process of inquiry to be experienced." Critical thinking, problem-solving, and experimental verification form the core of modern schooling.'
    },
    eligibility: {
      heading: '2. Stage-Wise Laboratory Integration under NEP 5+3+3+4 Design',
      bullets: [
        'Foundational Stage (Ages 3-8 / Pre-school to Class 2): Activity-based play corners, sensory exploration kits, natural discovery spaces, and building blocks without formal structured laboratories.',
        'Preparatory Stage (Ages 8-11 / Classes 3 to 5): Pre-tinkering corners, observational science kits, plant growth studies, simple magnets, magnifying lenses, and basic measurement instruments.',
        'Middle Stage (Ages 11-14 / Classes 6 to 8): Mandatory Composite Science & Skill Labs, introduction of visual coding, computational logic, and 10 Bagless Days vocational workshops (carpentry, electrical wiring, gardening, pottery).',
        'Secondary Stage (Ages 14-18 / Classes 9 to 12): Specialized multidisciplinary inquiry labs, advanced AI/Robotics, separate or composite laboratories, design thinking studios, and vocational courses recognized under the National Credit Framework (NCrF).'
      ],
      note: '📚 National Credit Framework (NCrF): At the secondary stage, vocational laboratory courses carry equal academic credit weighting toward graduation and board examinations.'
    },
    financialMatrix: {
      heading: '3. NCF-SE 2023 Three Forms of Work Framework',
      intro: 'NCF-SE mandates that modern school laboratories must accommodate three broad dimensions of human productive labor:',
      items: [
        {
          component: 'Domain 1: Work with Life Forms',
          allocation: 'Biology, Agriculture & Ecology',
          nature: 'Biological & Environmental Lab',
          rules: 'Microscopic examination of plant and animal tissue, hydroponics, soil health testing, composting, and regional biodiversity mapping.'
        },
        {
          component: 'Domain 2: Work with Machines & Materials',
          allocation: 'Physical Science, Robotics & Tinkering',
          nature: 'STEAM & Prototyping Lab',
          rules: 'Circuits, carpentry tools, 3D printing, mechanics, gear assemblies, Ohm’s law, optics prisms, solar energy systems, and sensor integration.'
        },
        {
          component: 'Domain 3: Work in Human Services',
          allocation: 'IT, Design, Health & Public Services',
          nature: 'Digital & Media Studio',
          rules: 'Digital design, UI/UX prototyping, coding, health diagnostic kits, digital audio/video recording, first-aid simulation, and school event management.'
        }
      ],
      totalOrMaxGrant: 'Mandatory Compliance for all CBSE, ICSE, and State Board schools'
    },
    labInfrastructure: {
      heading: '4. The 10 Bagless Days Implementation Blueprint (Classes 6 to 8)',
      intro: 'Under CBSE Circular No. Acad-60/2024, schools must schedule 10 Bagless Days throughout the academic year for Middle School students:',
      labTypes: [
        {
          name: 'Vocational Hands-on Workshops (5 Days)',
          sqft: 'Inside Composite Skill Lab / Tinkering Space',
          hardware: [
            'Electrical maintenance kits: Digital multimeters, voltage testers, wire strippers, insulation tapes',
            'Woodworking starter tools: Hand drills, precision clamps, sandpapers, carpenter measuring squares',
            'Pottery & ceramics setup: Manual shaping wheels, modeling spatulas, non-toxic modeling clay',
            'Garment craft and natural vegetable dye preparation stations'
          ],
          mandate: 'Students intern with regional craftsmen or execute structured projects in school maker spaces.'
        },
        {
          name: 'Science Exploration & Local Ecology Days (3 Days)',
          sqft: 'Composite Science Lab + Outdoor Campus',
          hardware: [
            'Soil testing kits: Chemical pH strips, digital moisture probes, nitrogen/phosphorus reagents',
            'Water quality testing kits: Dissolved oxygen meters, turbidity tubes, chlorine testing tablets',
            'Compact binoculars, pocket magnifying lenses, botanical specimen preservation jars'
          ],
          mandate: 'Field sample collection followed by laboratory microscopic and chemical analysis.'
        },
        {
          name: 'Digital Creativity & Coding Days (2 Days)',
          sqft: 'ICT / Computer Laboratory',
          hardware: [
            'Block-based visual coding platforms (MIT Scratch, Blockly, Microsoft MakeCode)',
            'Educational robotics: Line-following vehicles, ultrasonic obstacle-avoidance kits',
            'Digital poster design, podcast recording, and interactive presentation tools'
          ],
          mandate: 'Development of computational thinking and creative digital expression.'
        }
      ]
    },
    processSteps: {
      heading: '5. How Schools Must Re-engineer Existing Labs for NEP Compliance',
      intro: 'Transitioning an existing school laboratory to satisfy NEP 2020 benchmarks involves four structural modifications:',
      steps: [
        {
          step: 1,
          title: 'Dismantle the "Teacher-Only" Demonstration Barrier',
          desc: 'Replace the single elevated teacher podium with collaborative island worktables where every learner has independent access to apparatus.',
          portal: 'Lab Layout Redesign'
        },
        {
          step: 2,
          title: 'Adopt the 2-in-1 Unified Hybrid Architecture',
          desc: 'Incorporate modular storage and retractable overhead power lines that allow the room to switch between wet science practicals and dry robotics/coding within minutes.',
          portal: 'Hybrid Architecture'
        },
        {
          step: 3,
          title: 'Embed Ongoing Competency Portfolios (PARAKH Aligned)',
          desc: 'Replace one-off end-of-year practical tests with continuous laboratory logbooks, student digital portfolios, and open-ended inquiry projects.',
          portal: 'Assessment Transformation'
        },
        {
          step: 4,
          title: 'Faculty Professional Upskilling',
          desc: 'Conduct hands-on teacher workshops on safety protocols, 3D printer operation, and facilitating inquiry-driven classroom debates.',
          portal: 'Faculty Training'
        }
      ]
    },
    complianceAndAudits: {
      heading: '6. Affiliation & Inspection Implications under NEP 2020',
      points: [
        'SQAA Inspection Criteria: CBSE School Quality Assessment and Assurance (SQAA) heavily weights weekly student lab hours over textbook lecture completion.',
        '10 Bagless Days Documentation: Inspection committees inspect activity logbooks, student photographic records, and physical artifacts produced during bagless sessions.',
        'Safety & Cleanliness Standards: Eye-wash stations, fire exits, emergency procedure charts, and Material Safety Data Sheets (MSDS) must be permanently mounted.',
        'Student-Equipment Ratio: Inspectors verify that the ratio of students to functional apparatus sets does not exceed 4:1 during practical classes.'
      ],
      warningNote: '💡 Inspection Directive: Laboratory facilities can no longer be prepared solely for annual inspection visits; regulatory boards verify continuous student logbooks and ongoing practical records.'
    },
    faqs: [
      {
        q: 'Is coding and hands-on lab work mandatory for Class 6 under NEP 2020?',
        a: 'Yes. Paragraph 4.25 of NEP 2020 explicitly mandates the introduction of coding and vocational hands-on practical skills beginning in the Middle Stage (Class 6).'
      },
      {
        q: 'What are 10 Bagless Days and how should schools schedule them?',
        a: 'Students in Classes 6 to 8 participate in 10 school days without backpacks, engaging in hands-on vocational trades with local artisans (carpenters, potters, electricians) or conducting exploratory STEAM projects in school laboratories.'
      },
      {
        q: 'Can existing science laboratories be upgraded to NEP compliance without heavy civil demolition?',
        a: 'Yes. Under CSEEL’s 2-in-1 Unified Hybrid Architecture, existing science benches can be retrofitted with modular mobile storage, robotics modules, and multi-disciplinary kits without structural alterations.'
      },
      {
        q: 'How are Arts and Sciences integrated (STEAM) under NEP 2020?',
        a: 'Students explore interconnected projects such as the physics of color and light (optics and spectroscopy), the chemistry of photography and natural pigments, and 3D architectural modeling.'
      }
    ],
    relatedSlugs: ['pm-shri', 'atl-grants', 'samagra-shiksha', 'cbse-skill-hub']
  },

  'cbse-skill-hub': {
    slug: 'cbse-skill-hub',
    title: 'CBSE Skill Hub Initiative: Vocational AI, Design & Robotics Labs under PMKVY 4.0 (2026)',
    shortTitle: 'CBSE Skill Hub Initiative',
    eyebrow: 'Skill India & CBSE Joint Framework',
    badge: 'PMKVY 4.0 Aligned',
    readTime: '9 min read',
    updatedDate: 'October 2026',
    author: {
      name: 'Devendra Singh',
      role: 'Skill Hub Consultant & Vocational Trainer',
      initials: 'DS',
      bio: 'Facilitated Skill Hub Center accreditations, PMKVY 4.0 batch registrations, NSDC NSQF curriculum mapping, and Composite Skill Lab setups for over 90+ CBSE schools.'
    },
    heroImage: '/images/categories/engineering.jpg',
    heroImageAlt: 'CBSE Skill Hub laboratory with students learning AI, robotics, and industrial design thinking',
    tagline: 'Under the CBSE Skill Hub Initiative and PMKVY 4.0, school infrastructure is utilized during post-school hours and weekends to deliver industry-aligned vocational education to students and community youth. Explore accreditation norms, 33+ skill subjects, and lab equipment standards.',
    stats: [
      { label: 'Parent Initiative', value: 'Skill Hub Initiative', detail: 'Under PMKVY 4.0 & Skill India Mission' },
      { label: 'Target Age Group', value: '15 to 45 Years', detail: 'In-School Students (9-12) & Out-of-School Youth' },
      { label: 'NSQF Slabs', value: 'Level 2 to Level 4', detail: 'National Skills Qualification Framework Certification' },
      { label: 'Skill Lab Deadline', value: 'August 22, 2027', detail: 'Mandatory Setup for All CBSE Affiliated Schools' }
    ],
    officialLinks: [
      {
        title: 'CBSE Skill Education Official Portal',
        subtitle: 'cbseacademic.nic.in/skill-education.html',
        url: 'https://cbseacademic.nic.in/skill-education.html',
        isPdf: false
      },
      {
        title: 'Skill Hub Initiative Implementation Manual (PDF)',
        subtitle: 'NSDC & Ministry of Skill Development Guidelines',
        url: 'https://www.skillindia.gov.in/files/Skill_Hub_Initiative_Guidelines.pdf',
        isPdf: true
      },
      {
        title: 'CBSE Circular No. Skill-75/2024 (PDF)',
        subtitle: 'Establishment of Composite Skill Labs in CBSE Schools',
        url: 'https://www.cbse.gov.in/cbsenew/documents/75_Circular_2024_Composite_Skill_Labs_27082024.pdf',
        isPdf: true
      },
      {
        title: 'National Skill Development Corporation (NSDC)',
        subtitle: 'nsdcindia.org Sector Skill Council Certifications',
        url: 'https://nsdcindia.org',
        isPdf: false
      }
    ],
    tags: ['CBSESkillHub', 'PMKVY4', 'NSDC', 'SkillIndia', 'ArtificialIntelligence', 'RoboticsLab', 'NSQF'],
    overview: {
      heading: '1. What is the CBSE Skill Hub Initiative under PMKVY 4.0?',
      paragraphs: [
        'The Skill Hub Initiative (SHI) is an ambitious joint project launched under the Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0) by the Ministry of Skill Development and Entrepreneurship (MSDE) in collaboration with the Department of School Education & Literacy, Ministry of Education, and the Central Board of Secondary Education (CBSE).',
        'Recognizing that thousands of educational campuses across India possess high-value physical infrastructure—such as computer laboratories, science apparatus, workshops, and uninterrupted power—that remains idle after 2:30 PM, on weekends, and during vacations, the initiative transforms these premises into community "Skill Hubs".',
        'These accredited hubs deliver certified, job-role oriented training aligned with the National Skills Qualification Framework (NSQF Levels 2, 3, and 4) to two beneficiary groups: regular in-school students of Classes 9 to 12 as part of their vocational electives, and out-of-school youth or dropouts (aged 15 to 45 years) seeking employable trade skills.'
      ],
      calloutText: '🇮🇳 National Objective: To ensure that by 2025-26, at least 50% of secondary learners receive formal exposure to vocational education, fostering genuine employability alongside academic credentials.'
    },
    eligibility: {
      heading: '2. Criteria for Schools to Become an Accredited CBSE Skill Hub',
      bullets: [
        'Affiliation Status: CBSE affiliated secondary or senior secondary school with a clean regulatory standing.',
        'Existing Vocational Track: Priority consideration is granted to institutions already offering at least one CBSE Skill Subject (e.g., AI Code 417, IT Code 402, Coding 418, Electronics, Design Thinking).',
        'Dedicated Lab Infrastructure: Possession of an existing Atal Tinkering Lab (ATL), a dedicated Composite Skill Lab (600 sq. ft. or two 400 sq. ft. rooms), or a digital laboratory with at least 20 operational computing terminals.',
        'Operational Availability: Formal institutional commitment to keep designated lab facilities, restrooms, and power infrastructure accessible post-school (3:00 PM to 6:00 PM) or on weekends/vacations.',
        'Master Certified Faculty: The school must designate or contract certified vocational trainers possessing Training of Trainer (ToT) credentials from respective Sector Skill Councils (SSCs).'
      ],
      note: '💼 Funding & Training Honorarium: Under PMKVY 4.0, accredited schools receive hourly training cost reimbursements, trainer honorariums, and candidate assessment allowances directly from the central skill development fund.'
    },
    financialMatrix: {
      heading: '3. High-Demand NSQF Vocational Job Roles for Schools',
      intro: 'CBSE schools can select from 33+ approved vocational subjects. The leading technology and design courses include:',
      items: [
        {
          component: 'Artificial Intelligence & Data Science (Code 417/843)',
          allocation: 'Class 9 to 12 (NSQF Level 2 & 4)',
          nature: 'Technology Skill Lab',
          rules: 'Computer Vision, Natural Language Processing, Python coding, data ethics, and supervised machine learning on Jupyter/Google Colab.'
        },
        {
          component: 'Information Technology & Coding (Code 402/418)',
          allocation: 'Class 9 & 10 (NSQF Level 2)',
          nature: 'Digital Computing Lab',
          rules: 'Web development, database management systems (DBMS), cyber security hygiene, block programming, and basic networking.'
        },
        {
          component: 'Robotics, IoT & Prototyping (Code 422)',
          allocation: 'Class 9 to 12 (NSQF Level 3/4)',
          nature: 'Electronics & Tinkering Space',
          rules: 'Circuit design, Arduino/ESP32 sensor programming, 3D printing rapid prototyping, soldering, and motor control.'
        },
        {
          component: 'Design Thinking & Innovation (Code 844)',
          allocation: 'Class 11 & 12 (NSQF Level 4)',
          nature: 'Design & Prototyping Studio',
          rules: 'Empathy mapping, user research, rapid card prototyping, ergonomic product analysis, and industrial sketching.'
        }
      ],
      totalOrMaxGrant: 'Government-funded PMKVY training reimbursement + School fee flexibility'
    },
    labInfrastructure: {
      heading: '4. Composite Skill Lab Hardware Specifications for Skill Hubs',
      intro: 'As mandated by CBSE Circular No. Skill-75/2024, every school operating a skill hub must commission the following dedicated infrastructure:',
      labTypes: [
        {
          name: 'Core AI & Digital Computing Zone',
          sqft: 'Part of 600 Sq. Ft. Composite Skill Lab',
          hardware: [
            '20 Dedicated Core i5/i7 computing terminals with high-speed internet',
            'Full HD webcams and stereo headsets for AI speech recognition practicals',
            'Licensed and open-source data science tools (Python, Anaconda, TensorFlow Lite)',
            'Interactive touch display (IFP 75") for trainer demonstration'
          ],
          mandate: 'Mandatory for CBSE AI, IT and Digital Design courses.'
        },
        {
          name: 'Robotics, Electronics & IoT Hardware Bay',
          sqft: 'Part of 600 Sq. Ft. Composite Skill Lab',
          hardware: [
            'FDM 3D Printer for structural prototyping',
            'Microcontroller kits (Arduino, Raspberry Pi, ESP32) with breadboards',
            'Comprehensive sensor bank: Ultrasonic, temperature, IR, Bluetooth, gyro',
            'Soldering and de-soldering safety stations with smoke absorbers'
          ],
          mandate: 'Mandatory for Robotics, Automation & Smart Agriculture skills.'
        },
        {
          name: 'Hand Tool & Maker Prototyping Corner',
          sqft: 'Part of 600 Sq. Ft. Composite Skill Lab',
          hardware: [
            'Heavy-duty worktable with vice, clamps, and precision hand tools',
            'Wire strippers, crimping tools, precision screwdrivers, hot air guns',
            'Safety gear: Anti-static wristbands, safety goggles, fire extinguisher'
          ],
          mandate: 'Mandatory for physical electronics assembly and product fabrication.'
        }
      ]
    },
    processSteps: {
      heading: '5. Accreditation, Registration & Student Batch Workflow',
      intro: 'Schools looking to operate an accredited Skill Hub follow this four-phase onboarding procedure:',
      steps: [
        {
          step: 1,
          title: 'Skill Hub Portal Registration',
          desc: 'The school registers on the Skill India Digital Hub (SIDH) portal (skillindiadigital.gov.in) using its UDISE+ and CBSE affiliation code.',
          portal: 'skillindiadigital.gov.in'
        },
        {
          step: 2,
          title: 'Selection of Job Roles & Sector Skill Council Alignment',
          desc: 'The school selects target courses (e.g., Junior Software Developer, IoT Assistant, AI Specialist) and maps them to affiliated SSCs.',
          portal: 'SIDH Dashboard'
        },
        {
          step: 3,
          title: 'Batch Creation & Biometric Attendance Setup',
          desc: 'Batches of 25-30 candidates are created; a mandatory Aadhaar-based biometric attendance system is configured.',
          portal: 'Skill Hub MIS'
        },
        {
          step: 4,
          title: 'Training, Assessment & Government Certification',
          desc: 'Following required instruction hours, independent third-party assessors conduct practical evaluations; successful candidates receive NSQF certificates.',
          portal: 'NSDC Certification'
        }
      ]
    },
    complianceAndAudits: {
      heading: '6. Quality Audits, Biometrics & Assessment Standards',
      points: [
        'Mandatory Aadhaar Biometric Attendance: 100% biometric logging of both trainers and students is compulsory; manual paper registers are rejected by NSDC.',
        'Trainer Certification (ToT): Every faculty member acting as a skill trainer must hold a valid Certificate of Trainer issued by the respective Sector Skill Council.',
        'Equipment Functionality Audits: Surprise remote video inspections verify that 3D printers, computer terminals, and robotics modules are fully operational and in use.',
        'August 22, 2027 Deadline: All existing CBSE schools must commission an operational Composite Skill Lab before August 22, 2027; for fresh affiliation, it is immediately mandatory.'
      ],
      warningNote: '⚠️ Compliance Notice: Fraudulent candidate enrollments or biometric bypasses result in immediate revocation of Skill Hub accreditation and formal reporting to the CBSE Affiliation Branch.'
    },
    faqs: [
      {
        q: 'Does establishing a CBSE Skill Hub require massive initial capital investment?',
        a: 'No. If the school already possesses an operational computer lab or Atal Tinkering Lab (ATL), that existing space can be leveraged post-school by adding specific vocational modules and software.'
      },
      {
        q: 'How are school students and community youth scheduled simultaneously?',
        a: 'Regular school students attend vocational classes during standard school hours, while sessions for community youth are conducted post-school (after 3:00 PM) or during weekends.'
      },
      {
        q: 'Do learners receive an officially accredited government certificate upon course completion?',
        a: 'Yes. Upon passing practical and theoretical evaluations, candidates receive a government-recognized NSQF certificate issued jointly by NSDC and the concerned Sector Skill Council.'
      },
      {
        q: 'How does CSEEL assist schools in setting up a Skill Hub?',
        a: 'CSEEL supplies complete turnkey infrastructure (AI workstations, 3D printers, robotics kits), maps NSDC NSQF curriculum frameworks, configures biometric systems, and conducts certified trainer development.'
      }
    ],
    relatedSlugs: ['pm-shri', 'atl-grants', 'samagra-shiksha', 'nep-2020-guidelines']
  }
};
