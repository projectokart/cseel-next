export interface CompanyAddress {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
}

export type ContentBlock =
  | { type: 'header'; level?: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'image'; url: string; caption?: string; alt?: string }
  | { type: 'video'; embedUrl: string; title?: string }
  | { type: 'fact_box'; title?: string; items: { label: string; value: string }[] }
  | { type: 'kits_grid'; kits: { name: string; description: string; tag?: string }[] }
  | { type: 'faq'; faqs: { question: string; answer: string }[] };

export interface CompanyProfile {
  slug: string;
  name: string;
  brandVariants: string[];
  tagline: string;
  foundedYear: string;
  founders: string[];
  headquarters: string;
  address: CompanyAddress;
  websiteUrl: string;
  image: string;
  shortDescription: string;
  overview: string;
  coreOfferings: string[];
  keyProductsAndKits: { name: string; description: string; tag?: string }[];
  targetAudience: string[];
  strengths: string[];
  faqs: { question: string; answer: string }[];
  seoKeywords: string[];
  contentBlocks: ContentBlock[];
}

export const ROBOTICS_COMPANIES: CompanyProfile[] = [
  // 1. STEMROBO TECHNOLOGIES
  {
    slug: 'steamrobo',
    name: 'STEMROBO Technologies',
    brandVariants: ['STEMROBO', 'STEAMrobo', 'Stemrobo Technologies Private Limited', 'stemrobo.com'],
    tagline: 'Pioneering Turnkey STEM, Robotics, AI Labs, and Experiential Innovation for K-12 Schools',
    foundedYear: '2016',
    founders: ['Anurag Gupta', 'Rajeev Tiwari'],
    headquarters: 'Noida, Uttar Pradesh, India',
    address: {
      streetAddress: 'B-32, Block B, Sector 63',
      locality: 'Noida',
      region: 'Uttar Pradesh',
      postalCode: '201301',
      country: 'IN',
    },
    websiteUrl: 'https://www.stemrobo.com',
    image: '/images/companies/stemrobo-hero.jpg',
    shortDescription: 'STEMROBO Technologies is an Indian educational technology and robotics infrastructure enterprise that designs turnkey STEM innovation studios, Atal Tinkering Labs (ATLs), modular hardware kits, and AI curricula for over 1,800+ K-12 schools across India and abroad.',
    overview: 'STEMROBO Technologies (frequently searched by educators as steamrobo) was co-founded in 2016 by semiconductor and embedded systems engineers Anurag Gupta and Rajeev Tiwari. Based in Noida, the company emerged to address the acute gap between abstract textbook science theory and hands-on physical computing in Indian schools. Backed by government incubation initiatives including the Electropreneur Park and STPI, STEMROBO has evolved into an end-to-end institutional partner. Their model encompasses physical lab furniture, electronics prototyping hardware, structured grade-wise lesson manuals aligned with NEP 2020, and continuous teacher training workshops.',
    coreOfferings: [
      'Atal Tinkering Lab (ATL Packages 1 to 4) Turnkey Setup & AIM Grant Compliance',
      'Proprietary School Robotics & AI Innovation Studio Design and Installation',
      'Child-Safe Modular Electronics, Sensors, and Microcontroller Prototyping Kits',
      'NEP 2020 & CBSE Skill Education (AI Code 417) Aligned Multi-Grade Curriculum',
      '3-Tier Faculty Development Programs (FDP) & Year-Round Mentor Support',
      'Tinker Coders Cloud-Based Learning Management System (LMS) & Coding Platform',
      'Rapid Prototyping Facilities with Non-Toxic 3D Printers & Laser Cutters',
    ],
    keyProductsAndKits: [
      {
        name: 'Tinker Orbits',
        description: 'Modular plug-and-play electronics kit for Classes 4 to 8. Eliminates complex breadboard wiring by using color-coded magnetic interconnects to teach circuit fundamentals, inputs, outputs, and sensor integration.',
        tag: 'Modular Electronics',
      },
      {
        name: 'Bitli AI Learning Kit',
        description: 'Advanced edge-computing hardware kit for Classes 8 to 12. Introduces students to computer vision, speech synthesis, facial recognition, and machine learning models running directly on portable microcontrollers.',
        tag: 'Artificial Intelligence',
      },
      {
        name: 'Mechatron Construction Robotics',
        description: 'Heavy-duty robotics engineering kit with geared DC motors, multi-terrain wheels, infrared arrays, and microcontrollers for building autonomous obstacle-avoiding rovers, line followers, and robotic pick-and-place arms.',
        tag: 'Robotics Engineering',
      },
      {
        name: 'Tinker N Design Kit',
        description: 'Applied mechanical engineering set focusing on structural design, gears, pulleys, linkages, and torque transfer mechanisms aligned with middle-school physics practicals.',
        tag: 'Mechanical Design',
      },
      {
        name: 'STEAM Paper Circuit Kit',
        description: 'Elementary STEAM exploration kit introducing primary students (Classes 1 to 4) to electrical conductivity, copper foil circuits, coin batteries, and decorative LED craft projects.',
        tag: 'Junior STEAM',
      },
    ],
    targetAudience: [
      'CBSE, ICSE, Cambridge & State Board K-12 School Principals',
      'School Management Committees, Trustees & Academic Directors',
      'ATL In-Charge Teachers, Computer Science & Physics Faculty',
      'Students from Class 3 to Class 12 pursuing practical STEM skills',
    ],
    strengths: [
      'In-house hardware design and assembly with child-safe low-voltage DC (<12V) standards.',
      'Comprehensive curriculum mapping aligned with NEP 2020, NCF, and CBSE Skill Education modules.',
      'Dedicated pan-India ground team providing on-site lab commissioning and teacher mentorship.',
      'Tiered learning continuum moving students from block-based visual coding to text-based Python.',
      'Complete fulfillment partner for government Atal Innovation Mission (AIM) institutional grants.',
    ],
    faqs: [
      {
        question: 'What is STEMROBO Technologies and what solutions do they provide for schools?',
        answer: 'STEMROBO Technologies is an Indian educational technology and hardware manufacturing enterprise that sets up turnkey STEM Innovation Studios, Atal Tinkering Labs (ATLs), and Artificial Intelligence laboratories in K-12 schools. Their turnkey packages include modular electronics kits, 3D printers, child-safe workbenches, teacher masterclasses, and cloud-based coding software.',
      },
      {
        question: 'Where is STEMROBO Technologies headquartered and how can schools contact them?',
        answer: 'STEMROBO is officially registered and headquartered at B-32, Block B, Sector 63, Noida, Uttar Pradesh 201301, India. Institutional inquiries and lab consultations can be accessed directly via their official portal at stemrobo.com.',
      },
      {
        question: 'Does STEMROBO provide teacher training for schools after lab setup?',
        answer: 'Yes. STEMROBO conducts structured, multi-tiered Faculty Development Programs (FDP) that train school science and computer teachers on hardware handling, debugging, project facilitation, and term-wise curriculum delivery, backed by dedicated mentor visits.',
      },
      {
        question: 'Are STEMROBO kits safe for school students?',
        answer: 'Yes. All STEMROBO hardware kits, including Tinker Orbits and Mechatron sets, operate on child-safe low-voltage DC electricity (typically 5V to 9V battery or USB power) with reverse-polarity protection, completely eliminating high-voltage AC hazards.',
      },
      {
        question: 'How does STEMROBO align with the NEP 2020 education framework?',
        answer: 'STEMROBO curriculum is designed around competency-based experiential learning mandated by NEP 2020. Students learn scientific concepts through physical prototyping, hypothesis testing, error analysis, and computational design rather than rote memorization.',
      },
      {
        question: 'Can STEMROBO help schools apply for and set up Atal Tinkering Labs (ATL)?',
        answer: 'Yes. STEMROBO is an established fulfillment partner for NITI Aayog Atal Tinkering Labs, providing Package 1 (Electronics & Robotics), Package 2 (Rapid Prototyping & 3D Printing), Package 3 (Mechanical Workstation), and Package 4 (Medical & IoT sensors) adhering strictly to government AIM specifications.',
      },
    ],
    seoKeywords: [
      'steamrobo',
      'stemrobo',
      'stemrobo technologies',
      'stemrobo noida address',
      'stemrobo review for school',
      'stemrobo atl lab setup',
      'stemrobo robotics kit',
      'stemrobo bitli ai kit',
      'stemrobo tinker orbits',
      'robotics company for schools India',
      'experiential learning robotics India',
      'best STEM lab setup company India',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About STEMROBO Technologies & Corporate Origins',
      },
      {
        type: 'paragraph',
        text: 'STEMROBO Technologies (commonly searched by school administrators as steamrobo) is an Indian educational technology and hardware manufacturing enterprise headquartered in Noida, Uttar Pradesh. Founded in 2016 by semiconductor engineers Anurag Gupta (CEO) and Rajeev Tiwari, the organization was established to solve a fundamental problem in Indian schooling: the disconnect between theoretical textbook syllabi and real-world applied engineering. Recognised under the government Electropreneur Park and STPI initiatives, STEMROBO has partnered with more than 1,800 private and government schools across India, Africa, and the Middle East.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'STEMROBO Technologies Private Limited' },
          { label: 'Registered Headquarters', value: 'B-32, Block B, Sector 63, Noida, Uttar Pradesh – 201301, India' },
          { label: 'Year Established', value: '2016 (Operations expanded pan-India from 2017)' },
          { label: 'Founders & Leadership', value: 'Anurag Gupta (Co-Founder & CEO) & Rajeev Tiwari (Co-Founder)' },
          { label: 'Core Expertise', value: 'Turnkey Atal Tinkering Labs (ATL), School AI Studios, Robotics Hardware & Teacher FDP' },
          { label: 'Official Portal', value: 'https://www.stemrobo.com' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Turnkey School Laboratory Infrastructure & Setup',
      },
      {
        type: 'paragraph',
        text: 'Unlike vendors who supply loose boxes of unorganized retail components, STEMROBO provides schools with a comprehensive turnkey laboratory ecosystem. When commissioned by a school management committee, STEMROBO transforms designated campus rooms into vibrant innovation hubs equipped with electrostatic discharge (ESD) safe workbenches, organized modular storage bins, integrated power rails, and designated testing arenas.',
      },
      {
        type: 'bullets',
        items: [
          'Full compliance with NITI Aayog Atal Innovation Mission (AIM) guidelines across all 4 mandatory equipment packages.',
          'Child-safe heavy-duty modular workbenches with built-in DC power distribution and tool holders.',
          'Industrial rapid prototyping corner featuring enclosed FDM 3D printers, safe PLA filament, and mechanical hand-tools.',
          'Dedicated Artificial Intelligence and IoT workstation pods equipped with edge-processing microcontrollers and high-speed sensors.',
          'Organized inventory management systems with barcoded storage bins, eliminating component loss during practical sessions.',
        ],
      },
      {
        type: 'image',
        url: '/images/companies/stemrobo-lab.jpg',
        caption: 'Inside an active STEMROBO innovation lab: students collaborating on autonomous rovers and sensor breadboards.',
        alt: 'STEMROBO school innovation lab setup with active students and teachers',
      },
      {
        type: 'header',
        level: 2,
        text: 'Notable Educational Hardware & DIY Kits',
      },
      {
        type: 'paragraph',
        text: 'A cornerstone of STEMROBO’s institutional acceptance is its proprietary hardware lineup. Designed specifically for Indian school classroom dynamics, these kits feature robust child-safe casings, reverse-polarity power protection, and seamless progression from physical mechanical assembly to complex microcomputing.',
      },
      {
        type: 'kits_grid',
        kits: [
          {
            name: 'Tinker Orbits',
            description: 'Modular electronics and sensor platform for middle school. Uses snap-fit color-coded magnetic blocks to teach electrical resistance, capacitance, photodiode switching, and motor control without breadboard wiring frustration.',
            tag: 'Classes 4 to 8',
          },
          {
            name: 'Bitli AI Learning Kit',
            description: 'Cutting-edge edge AI microcontroller platform. Equips senior students with computer vision cameras, microphone arrays, and onboard neural-network accelerators to create voice-controlled smart appliances and gesture rovers.',
            tag: 'Classes 8 to 12',
          },
          {
            name: 'Mechatron Construction Robotics',
            description: 'Heavy-duty multi-chassis robotics construction system. Enables students to fabricate obstacle-avoiding autonomous vehicles, pick-and-place industrial robotic arms, and remote-controlled rovers using Arduino microcontrollers.',
            tag: 'Classes 6 to 10',
          },
          {
            name: 'Tinker N Design Prototyping',
            description: 'Mechanical engineering design toolkit covering gear ratios, bevel gears, rack-and-pinion steering, pulleys, and structural torque management for hands-on physics comprehension.',
            tag: 'Middle School',
          },
          {
            name: 'STEAM Paper Circuit Kit',
            description: 'Introductory physical computing toolkit for primary students, combining conductive adhesive copper traces with surface-mount LEDs and coin batteries to blend creative art with basic physics.',
            tag: 'Junior School',
          },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Software Ecosystem & Digital Learning Management',
      },
      {
        type: 'paragraph',
        text: 'To ensure seamless synergy between hardware and software, STEMROBO deploys its proprietary Tinker Coders platform. This cloud-based learning management system (LMS) allows students to practice block-based graphical programming (similar to Scratch and Blockly) before smoothly transitioning into syntax-based Python, C++, and Arduino IDE coding. Teachers can assign digital project rubrics, track student progress, and review live simulation runs.',
      },
      {
        type: 'header',
        level: 2,
        text: 'Teacher Enablement & Ongoing School Support',
      },
      {
        type: 'paragraph',
        text: 'A common challenge in school robotics labs across India is the abandonment of expensive hardware due to lack of teacher preparedness. STEMROBO addresses this through a structured 3-tier Faculty Development Program (FDP). School teachers receive hands-on training, lesson-by-lesson teacher guides, viva question banks, and scheduled on-site mentor visits to co-facilitate initial practical sessions.',
      },
      {
        type: 'bullets',
        items: [
          'Foundational, Intermediate, and Advanced educator certification tracks.',
          'Printed session-wise lab manuals mapped directly with CBSE and ICSE science timetables.',
          'Dedicated school success manager ensuring prompt component replacements under warranty.',
          'Student participation pipelines for national and international robotics Olympiads and hackathons.',
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Objective Evaluation & Institutional Considerations',
      },
      {
        type: 'paragraph',
        text: 'For school principals and management trustees, STEMROBO represents a reliable, pan-India turnkey vendor capable of delivering large-scale lab infrastructure and curriculum integration. Key factors to plan for include ensuring a dedicated room of at least 800 to 1,200 sq.ft. for optimal ATL layout, appointing a designated faculty member as lab in-charge, and establishing a regular schedule for consumable replenishers such as 3D printing filaments and sensor cables.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'What is STEMROBO Technologies and what solutions do they provide for schools?',
            answer: 'STEMROBO Technologies is an Indian educational technology and hardware manufacturing enterprise that sets up turnkey STEM Innovation Studios, Atal Tinkering Labs (ATLs), and Artificial Intelligence laboratories in K-12 schools. Their turnkey packages include modular electronics kits, 3D printers, child-safe workbenches, teacher masterclasses, and cloud-based coding software.',
          },
          {
            question: 'Where is STEMROBO Technologies headquartered and how can schools contact them?',
            answer: 'STEMROBO is officially registered and headquartered at B-32, Block B, Sector 63, Noida, Uttar Pradesh 201301, India. Institutional inquiries and lab consultations can be accessed directly via their official portal at stemrobo.com.',
          },
          {
            question: 'Does STEMROBO provide teacher training for schools after lab setup?',
            answer: 'Yes. STEMROBO conducts structured, multi-tiered Faculty Development Programs (FDP) that train school science and computer teachers on hardware handling, debugging, project facilitation, and term-wise curriculum delivery, backed by dedicated mentor visits.',
          },
          {
            question: 'Are STEMROBO kits safe for school students?',
            answer: 'Yes. All STEMROBO hardware kits, including Tinker Orbits and Mechatron sets, operate on child-safe low-voltage DC electricity (typically 5V to 9V battery or USB power) with reverse-polarity protection, completely eliminating high-voltage AC hazards.',
          },
          {
            question: 'How does STEMROBO align with the NEP 2020 education framework?',
            answer: 'STEMROBO curriculum is designed around competency-based experiential learning mandated by NEP 2020. Students learn scientific concepts through physical prototyping, hypothesis testing, error analysis, and computational design rather than rote memorization.',
          },
          {
            question: 'Can STEMROBO help schools apply for and set up Atal Tinkering Labs (ATL)?',
            answer: 'Yes. STEMROBO is an established fulfillment partner for NITI Aayog Atal Tinkering Labs, providing Package 1 (Electronics & Robotics), Package 2 (Rapid Prototyping & 3D Printing), Package 3 (Mechanical Workstation), and Package 4 (Medical & IoT sensors) adhering strictly to government AIM specifications.',
          },
        ],
      },
    ],
  },

  // 2. AVISHKAAR
  {
    slug: 'avishkaar',
    name: 'Avishkaar',
    brandVariants: ['Avishkaar', 'Avishkaar Box', 'Building Blocks of Future', 'avishkaar.cc'],
    tagline: 'Empowering Young Innovators Through Precision Modular Robotics, Coding, and Maker Studios',
    foundedYear: '2010',
    founders: ['Tarun Bhalla', 'Yogita Bhalla', 'Rajeev Gaba'],
    headquarters: 'New Delhi, India',
    address: {
      streetAddress: 'B-34, Lower Ground Floor, Okhla Phase 1',
      locality: 'New Delhi',
      region: 'Delhi',
      postalCode: '110020',
      country: 'IN',
    },
    websiteUrl: 'https://www.avishkaar.cc',
    image: '/images/companies/avishkaar-hero.webp',
    shortDescription: 'Avishkaar is one of India\'s earliest and most respected educational robotics pioneers, designing patented modular robotics kits, metallic construction sets, IoT maker boards, and K-12 innovation curricula for schools worldwide.',
    overview: 'Founded in 2010 by University of Washington alumnus Tarun Bhalla along with Yogita Bhalla and BITS Pilani alumnus Rajeev Gaba, Avishkaar is a category creator in Indian educational robotics. Unlike plastic toy manufacturers, Avishkaar developed heavy-duty, patented metallic mechanical construction systems that bridge school physics with industrial robotics. Over the last 15 years, Avishkaar has established innovation labs in thousands of premier K-12 schools, trained over 200,000 students, and organized Asia\'s largest student robotics tournament, the IRC League.',
    coreOfferings: [
      'Comprehensive K-12 Innovation Labs & ATL Setup Packages',
      'Patented Modular Metallic Construction Robotics Kits (E-Series, Pro, Full Kit)',
      'Tweak Modular Snap-to-Fit Robotics Platform for Early Learners (Ages 5+)',
      'Avishkaar Maker Board (Microcontroller with Display, Wi-Fi & Sensors)',
      'Avishkaar Maker Studio (AMS) Cloud-Based Visual Coding & Python Environment',
      'Structured School Robotics Clubs (Coders Club, Tinkerers Club, Mechanical Club)',
      'Annual International Robotics League (IRC League) & Global Student Competitions',
    ],
    keyProductsAndKits: [
      {
        name: 'Avishkaar Tweak',
        description: 'Award-winning modular snap-fit robotics kit for young learners (Ages 5 to 8). Allows children to create interactive robots without wires or screws, cultivating early computational thinking and mechanical reasoning.',
        tag: 'Ages 5+',
      },
      {
        name: 'Avishkaar E-Series (Lite & Intro)',
        description: 'Hands-on mechanical engineering and motorization set for Classes 3 to 6. Covers foundational physics concepts like center of gravity, friction, gear ratios, and motorized mechanisms using modular aluminum beams.',
        tag: 'Junior Robotics',
      },
      {
        name: 'Avishkaar Robotronics Full Kit & Pro',
        description: 'Flagship metallic construction set with high-torque geared DC motors, microcontrollers, infrared sensors, ultrasonic detectors, and Bluetooth control for building industrial-grade autonomous rovers.',
        tag: 'Advanced Robotics',
      },
      {
        name: 'Avishkaar Maker Board',
        description: 'All-in-one programmable microcontroller board featuring an integrated 5x5 LED matrix, buzzer, push buttons, light sensor, temperature sensor, and Wi-Fi/Bluetooth for rapid IoT project building.',
        tag: 'IoT & Microcontrollers',
      },
      {
        name: 'IoT & AI Smart Automation Kit',
        description: 'Applied computer science toolkit enabling high school students to interface sensors with cloud dashboards, program smart home automation systems, and train machine learning vision models.',
        tag: 'AI & IoT',
      },
    ],
    targetAudience: [
      'CBSE, ICSE, IB, and Cambridge International Schools',
      'School Principals, Academic Coordinators & Trustees',
      'Robotics Mentors, Science Teachers & Innovation Heads',
      'K-12 Students from Class 1 to Class 12',
    ],
    strengths: [
      'High-grade aircraft-grade aluminum mechanical parts that endure years of intense school lab use without breakage.',
      'Proprietary patent portfolio covering modular robotics joints, connectors, and software protocols.',
      'Organizers of the IRC League (International Robotics Competition), offering students national and international competition exposure.',
      'Seamless multi-year curriculum progression spanning Class 1 through Class 12 aligned with NEP 2020 and Cambridge STEAM norms.',
    ],
    faqs: [
      {
        question: 'What makes Avishkaar robotics kits different from plastic toy kits?',
        answer: 'Avishkaar kits use aircraft-grade anodized aluminum beams, precision metal gears, and industrial-grade high-torque DC motors rather than fragile plastic bazaar components. This enables students to build structurally rigid, real-world machines that demonstrate true mechanical physics and torque transfer.',
      },
      {
        question: 'Who founded Avishkaar and what is their background?',
        answer: 'Avishkaar was founded in 2010 by Tarun Bhalla (MBA from University of Washington, robotics patent holder), Yogita Bhalla (MS from Virginia Tech), and Rajeev Gaba (MS from BITS Pilani, former technical lead at Belkin).',
      },
      {
        question: 'What is the IRC League organized by Avishkaar?',
        answer: 'The IRC (International Robotics Competition) League is one of Asia’s largest school student robotics competitions organized annually by Avishkaar, where school teams from across India and abroad compete to solve real-world automation and engineering challenges.',
      },
      {
        question: 'Does Avishkaar provide software for coding their robots?',
        answer: 'Yes. Avishkaar developed the Avishkaar Maker Studio (AMS), a cloud-based software suite that allows students to start with drag-and-drop block coding and smoothly transition into text-based Python and C++ for advanced algorithms.',
      },
      {
        question: 'How do schools integrate Avishkaar programs into regular timetables?',
        answer: 'Avishkaar provides complete school club models (Tinkerers Club, Coders Club, Mechanical Modelling Club) with ready lesson plans, student workbooks, and teacher training, allowing schools to run dedicated weekly periods or after-school labs seamlessly.',
      },
    ],
    seoKeywords: [
      'avishkaar',
      'avishkaar robotics',
      'avishkaar box',
      'avishkaar school lab',
      'avishkaar maker studio',
      'avishkaar tweak kit',
      'avishkaar robotronics',
      'avishkaar irc league',
      'robotics company for schools India',
      'tarun bhalla avishkaar',
      'metallic robotics kit India',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About Avishkaar & Educational Robotics Legacy',
      },
      {
        type: 'paragraph',
        text: 'Avishkaar is widely recognized as one of India’s pioneering forces in K-12 robotics and STEM education. Established in 2010 by Tarun Bhalla (an alumnus of the University of Washington) alongside Yogita Bhalla and Rajeev Gaba, Avishkaar was born with the conviction that children learn science best by physically inventing and engineering things. Over the past decade and a half, Avishkaar has grown from a specialized robotics kit developer into an international edtech institution partnering with leading CBSE, ICSE, IB, and Cambridge schools across India, Southeast Asia, and the Middle East.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'Building Blocks of Future Private Limited (Avishkaar)' },
          { label: 'Registered Headquarters', value: 'B-34, Lower Ground Floor, Okhla Phase 1, New Delhi – 110020, India' },
          { label: 'Year Established', value: '2010 (15+ Years of Proven Educational Deployment)' },
          { label: 'Founders & Leadership', value: 'Tarun Bhalla (Founder & CEO), Rajeev Gaba (CTO), Yogita Bhalla (CLO)' },
          { label: 'Primary Focus', value: 'Patented Metallic Robotics Kits, K-12 Innovation Labs, Maker Board, IRC League' },
          { label: 'Official Portal', value: 'https://www.avishkaar.cc' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Precision Mechanical Hardware & Patented Construction Kits',
      },
      {
        type: 'paragraph',
        text: 'A major technical differentiator of Avishkaar is its focus on metallic mechanical modularity. While many school vendors repackage fragile plastic gears and brittle toys that break after one use, Avishkaar designed aircraft-grade anodized aluminum extrusions, precision steel axles, and high-torque DC motors. These durable parts allow students to assemble heavy mechanical structures, testing real-world engineering forces such as torque, shear strength, center of gravity, and gear reductions.',
      },
      {
        type: 'kits_grid',
        kits: [
          {
            name: 'Avishkaar Tweak',
            description: 'Snap-to-fit modular robotics system for early childhood (Ages 5+). Empowers primary learners to construct moving creatures and smart vehicles without tools or wires, fostering early spatial intuition.',
            tag: 'Primary Grades',
          },
          {
            name: 'Avishkaar E-Series (Lite & Intro)',
            description: 'Introductory metallic mechanics kit for middle school. Teaches gear trains, compound pulleys, steering linkages, and motorized chassis fabrication.',
            tag: 'Classes 3 to 6',
          },
          {
            name: 'Avishkaar Robotronics Full Kit & Pro',
            description: 'Flagship heavy-duty robotics platform with multi-channel programmable brain, bluetooth communication, line sensors, and ultrasonic modules for autonomous navigation.',
            tag: 'Classes 6 to 10',
          },
          {
            name: 'Avishkaar Maker Board',
            description: 'Integrated IoT development board packed with a 5x5 LED display, onboard buzzer, dual push-buttons, temperature & light sensors, and dual Wi-Fi/Bluetooth wireless connectivity.',
            tag: 'Classes 8 to 12',
          },
        ],
      },
      {
        type: 'image',
        url: '/images/companies/avishkaar-kits.webp',
        caption: 'Avishkaar modular robotics kits and projects assembled by school students during an innovation workshop.',
        alt: 'Avishkaar robotics kits and metallic construction parts',
      },
      {
        type: 'header',
        level: 2,
        text: 'Integrated Software: Avishkaar Maker Studio (AMS)',
      },
      {
        type: 'paragraph',
        text: 'Hardware without intuitive software often creates frustration in classrooms. Avishkaar developed Avishkaar Maker Studio (AMS), an all-in-one desktop and cloud platform. AMS allows junior students to program robots using an intuitive drag-and-drop block coding interface. As students advance into middle and senior school, AMS allows one-click conversion to authentic text-based Python and C++, giving students transferable industry-standard programming skills.',
      },
      {
        type: 'header',
        level: 2,
        text: 'School Innovation Ecosystem & IRC League Competitions',
      },
      {
        type: 'paragraph',
        text: 'Beyond hardware supply, Avishkaar establishes active student clubs within schools—such as the Coders Club, Tinkerers Club, and Mechanical Modelling Club. To maintain year-round student excitement, Avishkaar hosts the International Robotics Competition (IRC) League. Over 1,000 schools participate annually in regional qualifiers, culminating in national and international finals that celebrate student innovation and collaborative engineering.',
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'What makes Avishkaar robotics kits different from plastic toy kits?',
            answer: 'Avishkaar kits use aircraft-grade anodized aluminum beams, precision metal gears, and industrial-grade high-torque DC motors rather than fragile plastic bazaar components. This enables students to build structurally rigid, real-world machines that demonstrate true mechanical physics and torque transfer.',
          },
          {
            question: 'Who founded Avishkaar and what is their background?',
            answer: 'Avishkaar was founded in 2010 by Tarun Bhalla (MBA from University of Washington, robotics patent holder), Yogita Bhalla (MS from Virginia Tech), and Rajeev Gaba (MS from BITS Pilani, former technical lead at Belkin).',
          },
          {
            question: 'What is the IRC League organized by Avishkaar?',
            answer: 'The IRC (International Robotics Competition) League is one of Asia’s largest school student robotics competitions organized annually by Avishkaar, where school teams from across India and abroad compete to solve real-world automation and engineering challenges.',
          },
          {
            question: 'Does Avishkaar provide software for coding their robots?',
            answer: 'Yes. Avishkaar developed the Avishkaar Maker Studio (AMS), a cloud-based software suite that allows students to start with drag-and-drop block coding and smoothly transition into text-based Python and C++ for advanced algorithms.',
          },
          {
            question: 'How do schools integrate Avishkaar programs into regular timetables?',
            answer: 'Avishkaar provides complete school club models (Tinkerers Club, Coders Club, Mechanical Modelling Club) with ready lesson plans, student workbooks, and teacher training, allowing schools to run dedicated weekly periods or after-school labs seamlessly.',
          },
        ],
      },
    ],
  },

  // 3. TINKERLY (ELATION EDTECH)
  {
    slug: 'tinkerly',
    name: 'Tinkerly (Elation Edtech)',
    brandVariants: ['Tinkerly', 'SRJNA', 'Elation Edtech Private Limited', 'Let\'s Tinker', 'tinker.ly'],
    tagline: 'Bridging Physical Tinkering with Mobile Learning for Atal Tinkering Labs and K-12 Schools',
    foundedYear: '2015',
    founders: ['Sharad Bansal', 'OP Godara', 'Kapil Arya', 'Sanjeev Sharma'],
    headquarters: 'Jaipur, Rajasthan, India',
    address: {
      streetAddress: 'Plot No. 11, RIICO Software Complex, Sitapura Industrial Area',
      locality: 'Jaipur',
      region: 'Rajasthan',
      postalCode: '302022',
      country: 'IN',
    },
    websiteUrl: 'https://tinker.ly',
    image: '/images/companies/tinkerly-hero.jpg',
    shortDescription: 'Tinkerly (Elation Edtech) is a pioneer in blended STEM and Atal Tinkering Lab solutions in India, combining hands-on physical kits with its proprietary \'Let\'s Tinker\' digital learning platform to empower over 250,000+ students.',
    overview: 'Established in 2015 by a team of IIT Delhi and XLRI alumni—Sharad Bansal, OP Godara, Kapil Arya, and Sanjeev Sharma—Tinkerly (formerly known as SRJNA) is one of the leading educational technology companies specializing in Atal Tinkering Labs (ATLs) across India. Headquartered in Jaipur, Tinkerly recognized early on that physical tinkering kits alone cannot transform learning without continuous digital guidance. To solve this, they built a blended model integrating physical hardware with the \'Let\'s Tinker\' interactive mobile application, offering structured learning modules in AI, IoT, robotics, and coding.',
    coreOfferings: [
      'Government-Compliant Turnkey Atal Tinkering Lab (ATL) Package 1-4 Fulfillment',
      'Proprietary STEM & Robotics Tinkering Kits with Structured Curriculum Manuals',
      '\'Let\'s Tinker\' Interactive Mobile & Web Learning Application (200k+ Downloads)',
      'Bilingual Teacher Training & Faculty Development Workshops (Hindi & English)',
      'Curriculum Mapping Aligned with NEP 2020, CBSE, and State Board Frameworks',
      'Annual Innovation Challenges, Science Exhibitions & Project Showcase Fairs',
    ],
    keyProductsAndKits: [
      {
        name: 'ATL Package 1 to 4 Full Setup',
        description: 'Complete government-standard ATL lab package containing 160+ unique electronics, 3D printing, mechanical tools, safety stations, and consumable kits as mandated by NITI Aayog.',
        tag: 'Turnkey ATL Package',
      },
      {
        name: 'STEM Tinkering Kits (Grade-Wise)',
        description: 'Structured grade-appropriate science and robotics boxes covering breadboards, DC motors, ultrasonic distance meters, and Arduino coding for practical hands-on discovery.',
        tag: 'Classes 6 to 10',
      },
      {
        name: 'Let\'s Tinker Learning App',
        description: 'Gamified digital learning platform with video-guided project building, step-by-step schematics, interactive quizzes, and coding challenges for school students.',
        tag: 'Digital Learning App',
      },
      {
        name: 'Smart T-Box IoT Prototyping Kit',
        description: 'Connected micro-controller kit enabling students to wire smart environmental monitors, Wi-Fi connected weather stations, and automation circuits.',
        tag: 'IoT & Sensors',
      },
    ],
    targetAudience: [
      'Government and Private School Principals & ATL In-Charge Faculty',
      'District Education Officers, Kendriya Vidyalayas & Navodaya Vidyalayas',
      'K-12 STEM Teachers seeking bilingual structured teaching materials',
      'Students from Class 6 to 12 eager to explore hands-on maker skills',
    ],
    strengths: [
      'Strong institutional presence in government ATL implementations with proven vendor track record.',
      'Bilingual learning ecosystem providing documentation and video walkthroughs in both Hindi and English.',
      'Proprietary Let’s Tinker mobile app that allows students to continue practical learning at home.',
      'Close alignment with NITI Aayog Atal Innovation Mission benchmarks and transparent tool pricing.',
    ],
    faqs: [
      {
        question: 'Who founded Tinkerly and what are its origins?',
        answer: 'Tinkerly was founded in 2015 by alumni of IIT Delhi and XLRI Jamshedpur—Sharad Bansal, OP Godara, Kapil Arya, and Sanjeev Sharma. It originally launched under the name SRJNA before rebranding to Tinkerly.',
      },
      {
        question: 'What is the \'Let\'s Tinker\' mobile app?',
        answer: 'Let’s Tinker is Tinkerly’s proprietary mobile learning app with over 200,000 student users. It bridges physical hardware with video lessons, circuit schematics, and interactive coding challenges in robotics, AI, and IoT.',
      },
      {
        question: 'Does Tinkerly provide complete Atal Tinkering Lab setup packages?',
        answer: 'Yes. Tinkerly is an authorized and experienced fulfillment partner for NITI Aayog ATL grants, providing all mandatory tools across Electronics, 3D Printing, Mechanical Workstations, and Sensor kits with full inspection readiness.',
      },
      {
        question: 'Can rural and semi-urban schools easily implement Tinkerly programs?',
        answer: 'Yes. Tinkerly’s bilingual curriculum (Hindi and English) and low-bandwidth mobile app design make it particularly well-suited for Tier-2, Tier-3, and rural schools across India.',
      },
    ],
    seoKeywords: [
      'tinkerly',
      'elation edtech',
      'srjna',
      'let\'s tinker app',
      'tinkerly atl lab',
      'tinkerly jaipur address',
      'tinkerly robotics kit',
      'tinkerly school review',
      'atal tinkering lab vendor India',
      'best atl setup company India',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About Tinkerly & The Blended Tinkering Model',
      },
      {
        type: 'paragraph',
        text: 'Tinkerly (registered as Elation Edtech Private Limited) is an Indian edtech enterprise founded in 2015 by IIT Delhi and XLRI alumni Sharad Bansal, OP Godara, Kapil Arya, and Sanjeev Sharma. Operating from Jaipur, Rajasthan, Tinkerly has positioned itself as one of the most reliable and accessible partners for Atal Tinkering Labs (ATLs) and STEM education across India. Recognizing that physical lab kits often sit unused without continuous student engagement, Tinkerly pioneered a blended learning framework connecting physical hardware boxes with their proprietary \'Let\'s Tinker\' mobile application.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'Elation Edtech Private Limited (Tinkerly)' },
          { label: 'Registered Headquarters', value: 'Plot No. 11, RIICO Software Complex, Sitapura Industrial Area, Jaipur, Rajasthan – 302022' },
          { label: 'Year Established', value: '2015 (Formerly operated as SRJNA)' },
          { label: 'Founders & Leadership', value: 'Sharad Bansal (CEO), OP Godara, Kapil Arya, Sanjeev Sharma' },
          { label: 'Primary Focus', value: 'Turnkey Atal Tinkering Labs (ATL), Blended STEM Kits, Let\'s Tinker Mobile App' },
          { label: 'Official Portal', value: 'https://tinker.ly' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Government ATL Package Fulfillment & School Deployments',
      },
      {
        type: 'paragraph',
        text: 'Tinkerly is an established partner for government and private schools awarded NITI Aayog Atal Tinkering Lab grants. They supply over 160 to 200+ specialized items strictly meeting AIM equipment guidelines—ranging from precision FDM 3D printers and regulated soldering stations to oscilloscopes, microcontrollers (Arduino, NodeMCU), sensor arrays, and safety gear.',
      },
      {
        type: 'bullets',
        items: [
          'Full-package inspection-ready supply strictly aligned with NITI Aayog ATL guidelines.',
          'Bilingual teaching resources (Hindi and English) enabling teachers across all state regions to deliver lessons confidently.',
          'Integrated Let’s Tinker mobile platform facilitating home project continuation and virtual homework assignments.',
          'Structured student assessment rubrics tracking innovation milestones, computational thinking, and circuit literacy.',
        ],
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'Who founded Tinkerly and what are its origins?',
            answer: 'Tinkerly was founded in 2015 by alumni of IIT Delhi and XLRI Jamshedpur—Sharad Bansal, OP Godara, Kapil Arya, and Sanjeev Sharma. It originally launched under the name SRJNA before rebranding to Tinkerly.',
          },
          {
            question: 'What is the \'Let\'s Tinker\' mobile app?',
            answer: 'Let’s Tinker is Tinkerly’s proprietary mobile learning app with over 200,000 student users. It bridges physical hardware with video lessons, circuit schematics, and interactive coding challenges in robotics, AI, and IoT.',
          },
          {
            question: 'Does Tinkerly provide complete Atal Tinkering Lab setup packages?',
            answer: 'Yes. Tinkerly is an authorized and experienced fulfillment partner for NITI Aayog ATL grants, providing all mandatory tools across Electronics, 3D Printing, Mechanical Workstations, and Sensor kits with full inspection readiness.',
          },
          {
            question: 'Can rural and semi-urban schools easily implement Tinkerly programs?',
            answer: 'Yes. Tinkerly’s bilingual curriculum (Hindi and English) and low-bandwidth mobile app design make it particularly well-suited for Tier-2, Tier-3, and rural schools across India.',
          },
        ],
      },
    ],
  },

  // 4. ROBOKART
  {
    slug: 'robokart',
    name: 'Robokart',
    brandVariants: ['Robokart', 'Robokart.com', 'ARK Technosolutions Robokart', 'robokart.com'],
    tagline: 'Practical STEM Prototyping, Robotics Maker Spaces, and National Competitions for Schools',
    foundedYear: '2014',
    founders: ['Chaitali Shah', 'Ritesh Shah'],
    headquarters: 'Mumbai, Maharashtra, India',
    address: {
      streetAddress: '301, Mastermind 1, Royal Palms, Aarey Milk Colony, Goregaon East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400065',
      country: 'IN',
    },
    websiteUrl: 'https://www.robokart.com',
    image: '/images/companies/robokart-hero.png',
    shortDescription: 'Robokart is a premier Mumbai-based educational robotics, drone tech, and maker space solution provider that has empowered over 100,000+ students across India through hands-on STEM engineering and national championships.',
    overview: 'Established in November 2014 by Chaitali Shah and Ritesh Shah in Mumbai, Robokart emerged in partnership with ARK Technosolutions to democratize practical engineering education for Indian school students. Robokart focuses on transforming traditional classroom learning into active engineering creation. The company operates across three verticals: comprehensive school innovation and ATL lab setups, retail DIY robotics and drone prototyping kits, and nationwide competitive robotics championships organized in collaboration with premier technological institutions.',
    coreOfferings: [
      'Turnkey School Robotics Labs & Atal Tinkering Lab (ATL) Equipment Supply',
      'Robokart Maker Spaces & Franchise Practical STEM Innovation Centers',
      'Hands-On DIY Robotics Kits (Autonomous Rovers, Line Followers, Drone Prototyping)',
      'National Level Robotics Championship (NLRC) & Student Olympiad Organization',
      'Curriculum Mapping for Classes 3 to 12 Covering Electronics, Coding, and IoT',
      'Teacher Training Workshops & Practical Engineering Certification Courses',
    ],
    keyProductsAndKits: [
      {
        name: 'DIY Autonomous Robotics Kits',
        description: 'Multi-functional Arduino-based robotics construction kits featuring infrared sensors, ultrasonic distance meters, and motor driver shields for building line-following and obstacle-avoiding robots.',
        tag: 'Robotics Prototyping',
      },
      {
        name: 'Quadcopter & Drone Technology Kit',
        description: 'Hands-on aerospace engineering kit allowing senior students to assemble, balance, and fly quadcopters while mastering aerodynamics, gyroscopes, and brushless motor dynamics.',
        tag: 'Aviation & Drones',
      },
      {
        name: 'IoT & Home Automation Prototyping Kit',
        description: 'ESP8266 and ESP32 wireless development kit enabling students to connect sensors to mobile dashboards, controlling lights, relays, and smart alarms over Wi-Fi.',
        tag: 'IoT & Wireless',
      },
      {
        name: '3D Printing & Fabrication Lab Set',
        description: 'Classroom-safe 3D printers and filament extrusion systems packaged with basic CAD modeling curricula for school engineering studios.',
        tag: 'Rapid Prototyping',
      },
    ],
    targetAudience: [
      'School Principals, Trustees & Management Boards across Western and Pan-India',
      'Academic Coordinators looking to introduce robotics and aerospace clubs',
      'Computer Science & Physics Teachers seeking practical DIY projects',
      'School Students aspiring to participate in national robotics competitions',
    ],
    strengths: [
      'Extensive experience organizing national-level robotics championships in collaboration with top academic institutions.',
      'Comprehensive product catalog spanning robotics, microcontrollers, 3D printing, and drone technology.',
      'Flexible implementation models ranging from basic club packages to comprehensive school maker spaces.',
      'Active community of student makers and direct access to component replenishment.',
    ],
    faqs: [
      {
        question: 'What is Robokart and who are its founders?',
        answer: 'Robokart is an Indian educational technology and robotics hardware organization founded in 2014 by Chaitali Shah and Ritesh Shah in Mumbai. The company specializes in practical STEM labs, DIY robotics kits, and national robotics tournaments.',
      },
      {
        question: 'Does Robokart offer drone technology programs for schools?',
        answer: 'Yes. Robokart is one of the few educational providers in India offering structured Quadcopter and Drone Technology kits, teaching aerodynamics, flight controllers, sensor balancing, and radio communication to middle and high school students.',
      },
      {
        question: 'What is the National Level Robotics Championship (NLRC)?',
        answer: 'NLRC is a premier competitive robotics initiative organized by Robokart that invites school and college student teams across India to solve real-world autonomous robotics and automation challenges.',
      },
      {
        question: 'Where is Robokart headquartered?',
        answer: 'Robokart is headquartered in Mumbai, Maharashtra, at Mastermind 1, Royal Palms, Aarey Milk Colony, Goregaon East, Mumbai – 400065.',
      },
    ],
    seoKeywords: [
      'robokart',
      'robokart mumbai',
      'robokart robotics',
      'robokart school lab',
      'robokart review',
      'robokart drone kit',
      'robokart diy kits',
      'robotics company for schools India',
      'ritesh shah robokart',
      'chaitali shah robokart',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About Robokart & Hands-On Engineering Origins',
      },
      {
        type: 'paragraph',
        text: 'Robokart is a Mumbai-based educational technology and practical robotics enterprise established in November 2014 by Chaitali Shah and Ritesh Shah. Founded with the mission to disrupt rote theoretical instruction through direct kinesthetic engagement, Robokart has trained more than 100,000 students across India. The organization has established robotics studios, Atal Tinkering Labs, and innovation maker spaces in hundreds of educational institutions, earning an authoritative reputation in practical electronics, coding, and aerospace hardware prototyping.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'Robokart / ARK Technosolutions' },
          { label: 'Registered Headquarters', value: '301, Mastermind 1, Royal Palms, Aarey Milk Colony, Goregaon East, Mumbai, Maharashtra – 400065' },
          { label: 'Year Established', value: '2014 (Over a Decade of Practical STEM Outreach)' },
          { label: 'Founders & Leadership', value: 'Chaitali Shah (Managing Director) & Ritesh Shah (Co-Founder)' },
          { label: 'Primary Focus', value: 'School Robotics Labs, Drone Education, DIY Kits, NLRC Robotics Championships' },
          { label: 'Official Portal', value: 'https://www.robokart.com' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Robotics Labs, Drone Kits & Rapid Prototyping',
      },
      {
        type: 'paragraph',
        text: 'Robokart offers educational institutions structured lab packages designed to cover the entire spectrum of modern physical computing. Their hardware solutions span foundational sensor electronics, microcontroller programming (Arduino and ESP32), autonomous rover fabrication, and specialized aviation kits including flyable quadcopters and 3D printing design suites.',
      },
      {
        type: 'kits_grid',
        kits: [
          {
            name: 'Autonomous Rover Kit',
            description: 'Customizable robotics kit with chassis, DC motors, infrared sensors, and Arduino brain for line-following, maze solving, and obstacle detection.',
            tag: 'Robotics',
          },
          {
            name: 'Quadcopter Drone Kit',
            description: 'Aerodynamic flight engineering kit covering multi-rotor balance, brushless electronic speed controllers (ESCs), and radio-frequency piloting.',
            tag: 'Aerospace',
          },
          {
            name: 'IoT Home Automation Studio',
            description: 'Connected smart-sensor kit teaching students to interface relays, temperature sensors, and motion detectors with mobile dashboards.',
            tag: 'IoT',
          },
          {
            name: '3D Design & Prototyping Hub',
            description: 'Precision 3D printers and software toolkits teaching students to conceptualize, slice, and print physical engineering enclosures.',
            tag: 'Makerspace',
          },
        ],
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'What is Robokart and who are its founders?',
            answer: 'Robokart is an Indian educational technology and robotics hardware organization founded in 2014 by Chaitali Shah and Ritesh Shah in Mumbai. The company specializes in practical STEM labs, DIY robotics kits, and national robotics tournaments.',
          },
          {
            question: 'Does Robokart offer drone technology programs for schools?',
            answer: 'Yes. Robokart is one of the few educational providers in India offering structured Quadcopter and Drone Technology kits, teaching aerodynamics, flight controllers, sensor balancing, and radio communication to middle and high school students.',
          },
          {
            question: 'What is the National Level Robotics Championship (NLRC)?',
            answer: 'NLRC is a premier competitive robotics initiative organized by Robokart that invites school and college student teams across India to solve real-world autonomous robotics and automation challenges.',
          },
          {
            question: 'Where is Robokart headquartered?',
            answer: 'Robokart is headquartered in Mumbai, Maharashtra, at Mastermind 1, Royal Palms, Aarey Milk Colony, Goregaon East, Mumbai – 400065.',
          },
        ],
      },
    ],
  },

  // 5. PLAYTO LABS
  {
    slug: 'playto-labs',
    name: 'Playto Labs',
    brandVariants: ['Playto Labs', 'Playto', 'Playto Robotics', 'playtolabs.com'],
    tagline: 'Game-Based Experiential Robotics and Practical Innovation Studios for K-12 Learners',
    foundedYear: '2020',
    founders: ['Pavan Ponnaganti'],
    headquarters: 'Bengaluru, Karnataka, India',
    address: {
      streetAddress: 'HSR Layout, Sector 2',
      locality: 'Bengaluru',
      region: 'Karnataka',
      postalCode: '560102',
      country: 'IN',
    },
    websiteUrl: 'https://www.playtolabs.com',
    image: '/images/companies/playto-hero.png',
    shortDescription: 'Playto Labs is a high-growth experiential learning and robotics startup founded by IIT Kanpur alumni, transforming K-12 students from passive technology consumers into active creators through game-based robotics curricula.',
    overview: 'Playto Labs was established in 2020 by Pavan Ponnaganti, an alumnus of IIT Kanpur who previously co-founded Skyfi Labs. Headquartered in Bengaluru, Karnataka, Playto Labs emerged to solve a critical limitation of early coding education: learning code purely on a computer screen without physical interaction often leads to disinterest. Playto Labs combines physical programmable hardware with immersive game-based learning missions, allowing students aged 8 to 16 to build autonomous rovers, smart home inventions, and AI gadgets while mastering core logic, computational thinking, and physics.',
    coreOfferings: [
      'Turnkey K-12 School Robotics & Innovation Studio Deployments',
      'Playto Multi-Tiered Robotics Prototyping Hardware Kits (Levels 1 to 5)',
      'Gamified Software Platform with Interactive Missions & Logic Puzzles',
      '1-on-1 and Small-Group Experiential Robotics Learning Mentorship',
      'Curriculum Aligned with NEP 2020, International STEM Standards & CBSE AI',
      'Comprehensive Teacher Enablement & Practical Lab Delivery Blueprints',
    ],
    keyProductsAndKits: [
      {
        name: 'Playto Junior Robotics Kit (Level 1-2)',
        description: 'Safe plug-and-play electronics construction set for young students (Ages 7 to 10). Introduces motors, LEDs, sensors, and basic logic gates through visual build missions.',
        tag: 'Junior School',
      },
      {
        name: 'Playto Autonomous Rover & Smart Car (Level 3)',
        description: 'Programmable smart car chassis equipped with dual DC motors, ultrasonic radar, line-tracking arrays, and Bluetooth control for autonomous vehicle engineering.',
        tag: 'Middle School',
      },
      {
        name: 'Playto AI & IoT Smart Inventions Kit (Level 4-5)',
        description: 'Advanced development system with microcontrollers, camera sensors, and cloud communication modules to prototype smart home systems and computer vision gadgets.',
        tag: 'Senior School',
      },
    ],
    targetAudience: [
      'Progressive K-12 Schools, International Schools & Day-Boarding Institutions',
      'School Principals, Directors & Innovation Department Heads',
      'Science and ICT Teachers wanting game-based engagement models',
      'Students aged 8 to 16 eager to build tangible, functional robots',
    ],
    strengths: [
      'Leadership by IIT alumni with proven track record in engineering education and hands-on learning.',
      'High student retention driven by game-based mission mechanics rather than dry textbook lectures.',
      'Clean hardware architecture designed with safe jumper connectors and clear component labeling.',
      'Global student reach with learners across India, USA, Singapore, and Europe.',
    ],
    faqs: [
      {
        question: 'Who founded Playto Labs and what is the company’s vision?',
        answer: 'Playto Labs was founded in 2020 by Pavan Ponnaganti, an IIT Kanpur graduate and edtech entrepreneur who previously co-founded Skyfi Labs. His vision is to turn kids from passive screen consumers into active technology creators.',
      },
      {
        question: 'How do Playto Labs robotics programs work in schools?',
        answer: 'Playto Labs provides schools with physical robotics kits, gamified lesson modules, and teacher coaching. Students work in small teams to complete engineering challenges, building physical robots that interact with their environment.',
      },
      {
        question: 'What age groups are Playto Labs programs designed for?',
        answer: 'Playto Labs covers children aged 8 to 16 (Classes 3 to 10), with progressively tiered hardware kits ranging from simple visual circuits to advanced microcontroller coding and AI vision.',
      },
      {
        question: 'Where is Playto Labs based?',
        answer: 'Playto Labs is based in Bengaluru, Karnataka, India, with headquarters in HSR Layout, Sector 2 – 560102.',
      },
    ],
    seoKeywords: [
      'playto labs',
      'playto robotics',
      'playtolabs.com',
      'pavan ponnaganti playto labs',
      'playto labs bangalore',
      'playto labs school robotics',
      'playto robotics kits',
      'robotics company for schools India',
      'game based robotics learning India',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About Playto Labs & The Game-Based Learning Vision',
      },
      {
        type: 'paragraph',
        text: 'Playto Labs is a Bengaluru-based educational technology and robotics startup founded in 2020 by Pavan Ponnaganti, an alumnus of IIT Kanpur and serial edtech entrepreneur who previously co-founded Skyfi Labs. Playto Labs was established to solve a widespread problem in K-12 STEM education: teaching coding solely through computer screens often creates cognitive detachment and boredom. By pairing physical programmable hardware with story-driven game missions, Playto Labs transforms abstract algorithmic concepts into thrilling physical experiments.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'Playto Labs Private Limited' },
          { label: 'Registered Headquarters', value: 'HSR Layout, Sector 2, Bengaluru, Karnataka – 560102, India' },
          { label: 'Year Established', value: '2020 (Rapidly Scaled Across India & Globally)' },
          { label: 'Founders & Leadership', value: 'Pavan Ponnaganti (Founder & CEO, Alumnus of IIT Kanpur)' },
          { label: 'Primary Focus', value: 'Game-Based Robotics Labs, Multi-Tier Hardware Kits, K-12 Innovation Studios' },
          { label: 'Official Portal', value: 'https://www.playtolabs.com' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Multi-Tiered Hardware Architecture & School Innovation Hubs',
      },
      {
        type: 'paragraph',
        text: 'Playto Labs offers school campuses structured physical innovation studios equipped with modular robotics kits, testing surfaces, and digital mission consoles. The curriculum follows a progressive 5-tier architecture: beginning with basic mechanical linkages and DC motor circuits in junior school, moving into autonomous obstacle-navigating rovers in middle school, and culminating in IoT sensor networks and edge AI vision systems for high school students.',
      },
      {
        type: 'kits_grid',
        kits: [
          {
            name: 'Playto Level 1-2 Junior Kit',
            description: 'Safe electronics construction set teaching electricity, sensors, and mechanical assemblies through gamified build challenges.',
            tag: 'Junior School',
          },
          {
            name: 'Playto Level 3 Autonomous Car',
            description: 'Programmable smart vehicle kit equipped with ultrasonic radar, infrared line-tracking, and bluetooth control for algorithmic navigation.',
            tag: 'Middle School',
          },
          {
            name: 'Playto Level 4-5 IoT & AI Studio',
            description: 'Advanced development kit interfacing wireless microcontrollers with cloud dashboards and computer vision cameras for smart home prototyping.',
            tag: 'Senior School',
          },
        ],
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'Who founded Playto Labs and what is the company’s vision?',
            answer: 'Playto Labs was founded in 2020 by Pavan Ponnaganti, an IIT Kanpur graduate and edtech entrepreneur who previously co-founded Skyfi Labs. His vision is to turn kids from passive screen consumers into active technology creators.',
          },
          {
            question: 'How do Playto Labs robotics programs work in schools?',
            answer: 'Playto Labs provides schools with physical robotics kits, gamified lesson modules, and teacher coaching. Students work in small teams to complete engineering challenges, building physical robots that interact with their environment.',
          },
          {
            question: 'What age groups are Playto Labs programs designed for?',
            answer: 'Playto Labs covers children aged 8 to 16 (Classes 3 to 10), with progressively tiered hardware kits ranging from simple visual circuits to advanced microcontroller coding and AI vision.',
          },
          {
            question: 'Where is Playto Labs based?',
            answer: 'Playto Labs is based in Bengaluru, Karnataka, India, with headquarters in HSR Layout, Sector 2 – 560102.',
          },
        ],
      },
    ],
  },

  // 6. WITBLOX
  {
    slug: 'witblox',
    name: 'Witblox (We Techshiksha)',
    brandVariants: ['Witblox', 'We Techshiksha Labs', 'Witblox DIY', 'witblox.com'],
    tagline: 'Lego-Like Modular Electronic Building Blocks for Young Inventors and School Labs',
    foundedYear: '2014',
    founders: ['Amit Modi'],
    headquarters: 'Mumbai, Maharashtra, India',
    address: {
      streetAddress: 'Unit 4, Ground Floor, Reliable Industrial Estate, Kanjurmarg West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400078',
      country: 'IN',
    },
    websiteUrl: 'https://www.witblox.com',
    image: '/images/companies/witblox-hero.png',
    shortDescription: 'Witblox is a celebrated Indian hardware invention company known for its modular, plug-and-play electronic building blocks that allow school students to construct robots and smart circuits without soldering or complex wiring.',
    overview: 'Founded in 2014 by Amit Modi and operated under We Techshiksha Labs Private Limited in Mumbai, Witblox gained national prominence (including recognition on Shark Tank India) for democratizing hardware invention. The core innovation of Witblox is its color-coded modular electronic blocks: Power Blocks (Blue), Input Sensor Blocks (Yellow), Output Motor & Buzzer Blocks (Green), and Inverter/Logic Blocks (Red). By eliminating dangerous soldering irons and confusing breadboard spaghetti wires, Witblox enables students as young as 7 years old to prototype over 100+ creative robotic machines, automated trash cans, and IoT gadgets.',
    coreOfferings: [
      'Turnkey Primary & Middle School Tinkering Corners and STEM Innovation Labs',
      'Proprietary Plug-and-Play Modular Electronic Building Blocks (No Soldering, No Wires)',
      'Witblox Mega Discovery Kits & Multi-Project Robotics Invention Sets (100+ Projects)',
      'Witblox Community Learning App with Project Video Tutorials & Challenges',
      'Customized IoT (Wi-Fi) & Artificial Intelligence Prototyping Modules for K-12',
      'Educator Training Programs and Activity Blueprints Aligned with NEP 2020',
    ],
    keyProductsAndKits: [
      {
        name: 'Witblox Mega Project Kit',
        description: 'Flagship modular electronics kit containing 20+ specialized blocks (power, sensors, motors, logic). Enables students to build over 100+ functional mechanical and robotic inventions with zero breadboard wiring.',
        tag: 'Flagship Modular Set',
      },
      {
        name: 'Witblox IoT Wi-Fi Smart Kit',
        description: 'Internet of Things edition allowing children to connect physical blocks to home Wi-Fi networks, building remote-controlled appliances, smart alarms, and environmental monitors.',
        tag: 'IoT & Automation',
      },
      {
        name: 'Witblox AI Robotics Kit',
        description: 'Advanced block set integrating machine learning cameras and microcontrollers to teach computer vision and automated navigation through simple modular connections.',
        tag: 'Artificial Intelligence',
      },
    ],
    targetAudience: [
      'Primary and Middle School Principals & STEM Coordinators',
      'Schools seeking child-safe, zero-breakage electronics prototyping sets',
      'Educators teaching classes 2 to 8 seeking high student engagement',
      'Young makers aged 7 to 14 exploring hands-on invention building',
    ],
    strengths: [
      'Patented color-coded modular block architecture that completely eliminates wiring errors and short-circuits.',
      'Nationally recognized brand featured on Shark Tank India with proven consumer and school adoption.',
      'Exceptionally safe for young children—no hot soldering irons, sharp leads, or high-voltage components.',
      'Vibrant learning app community with thousands of user-submitted DIY project videos and tutorials.',
    ],
    faqs: [
      {
        question: 'What is Witblox and how do its electronic blocks work?',
        answer: 'Witblox is a modular electronic block system. Blocks are color-coded by function—Power (Blue), Input Sensors (Yellow), Outputs (Green), and Inverters (Red). Students snap blocks together like Lego to instantly build working electronic circuits and robots without soldering or breadboard wiring.',
      },
      {
        question: 'Who founded Witblox?',
        answer: 'Witblox was founded in 2014 by Amit Modi and is managed under We Techshiksha Labs Private Limited in Mumbai, Maharashtra.',
      },
      {
        question: 'Are Witblox kits safe for elementary school students?',
        answer: 'Yes, Witblox is engineered specifically for child safety. All blocks operate on low-voltage 9V battery power with reverse-polarity protection and enclosed casings, completely preventing accidental electric shocks or component burnout.',
      },
      {
        question: 'Can schools use Witblox to set up tinkering labs?',
        answer: 'Yes. Many schools across India deploy Witblox in primary and middle school tinkering corners as an accessible stepping stone before advancing students to raw Arduino and Raspberry Pi breadboard electronics.',
      },
    ],
    seoKeywords: [
      'witblox',
      'witblox diy',
      'witblox shark tank india',
      'amit modi witblox',
      'we techshiksha labs',
      'witblox mega kit',
      'modular electronic blocks India',
      'robotics company for schools India',
      'witblox school lab',
    ],
    contentBlocks: [
      {
        type: 'header',
        level: 2,
        text: 'About Witblox & The Modular Hardware Revolution',
      },
      {
        type: 'paragraph',
        text: 'Witblox (operated under We Techshiksha Labs Private Limited) is a celebrated Mumbai-based hardware edtech enterprise founded in 2014 by Amit Modi. Gaining nationwide acclaim, including a memorable showcase on Shark Tank India, Witblox was born from a simple insight: traditional electronics education intimidates young students with tangled breadboard wires, delicate pins, and dangerous soldering irons. Witblox transformed electronic circuits into Lego-like modular building blocks that snap together easily, allowing students as young as 7 to build complex working robots.',
      },
      {
        type: 'fact_box',
        title: 'Corporate Verification & Institutional Profile',
        items: [
          { label: 'Corporate Entity', value: 'We Techshiksha Labs Private Limited (Witblox)' },
          { label: 'Registered Headquarters', value: 'Unit 4, Reliable Industrial Estate, Kanjurmarg West, Mumbai, Maharashtra – 400078, India' },
          { label: 'Year Established', value: '2014 (Over a Decade of Modular Innovation)' },
          { label: 'Founders & Leadership', value: 'Amit Modi (Founder & CEO)' },
          { label: 'Primary Focus', value: 'Modular Electronic Building Blocks, Primary Tinkering Labs, Witblox Learning App' },
          { label: 'Official Portal', value: 'https://www.witblox.com' },
        ],
      },
      {
        type: 'header',
        level: 2,
        text: 'Color-Coded Modular Electronic Block Architecture',
      },
      {
        type: 'paragraph',
        text: 'The brilliance of Witblox lies in its intuitive color-coded architecture: Power Blocks (Blue) provide regulated battery energy; Input Blocks (Yellow) contain light, sound, and touch sensors; Output Blocks (Green) drive geared motors, buzzers, and LED lamps; and Logic Blocks (Red) perform signal inversion. This modular clarity allows young minds to grasp cause-and-effect, analog sensing, and digital logic effortlessly.',
      },
      {
        type: 'kits_grid',
        kits: [
          {
            name: 'Witblox Mega Project Set',
            description: 'Comprehensive modular kit containing over 20 blocks. Allows students to construct over 100+ creative robotic projects including solar trackers, automatic soap dispensers, and line-following buggies.',
            tag: 'Classes 2 to 8',
          },
          {
            name: 'Witblox IoT Wi-Fi Smart Kit',
            description: 'Internet-connected modular set enabling students to connect physical sensor blocks to home Wi-Fi networks and control home appliances via mobile dashboards.',
            tag: 'Classes 5 to 9',
          },
          {
            name: 'Witblox AI Vision System',
            description: 'Smart camera-equipped block set introducing children to machine learning, gesture recognition, and obstacle avoidance through modular block snapping.',
            tag: 'Classes 6 to 10',
          },
        ],
      },
      {
        type: 'faq',
        faqs: [
          {
            question: 'What is Witblox and how do its electronic blocks work?',
            answer: 'Witblox is a modular electronic block system. Blocks are color-coded by function—Power (Blue), Input Sensors (Yellow), Outputs (Green), and Inverters (Red). Students snap blocks together like Lego to instantly build working electronic circuits and robots without soldering or breadboard wiring.',
          },
          {
            question: 'Who founded Witblox?',
            answer: 'Witblox was founded in 2014 by Amit Modi and is managed under We Techshiksha Labs Private Limited in Mumbai, Maharashtra.',
          },
          {
            question: 'Are Witblox kits safe for elementary school students?',
            answer: 'Yes, Witblox is engineered specifically for child safety. All blocks operate on low-voltage 9V battery power with reverse-polarity protection and enclosed casings, completely preventing accidental electric shocks or component burnout.',
          },
          {
            question: 'Can schools use Witblox to set up tinkering labs?',
            answer: 'Yes. Many schools across India deploy Witblox in primary and middle school tinkering corners as an accessible stepping stone before advancing students to raw Arduino and Raspberry Pi breadboard electronics.',
          },
        ],
      },
    ],
  },
];

export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return ROBOTICS_COMPANIES.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.brandVariants.some((v) => v.toLowerCase() === clean) ||
      clean.includes(c.slug.toLowerCase()) ||
      c.slug.toLowerCase().includes(clean)
  );
}
