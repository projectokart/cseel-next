export interface SeminarItem {
  id: string;
  title: string;
  topic: string;
  category: "Space Sciences" | "Quantum Physics" | "Green Chemistry" | "Genomics & Bio-Tech" | "Robotics & AI" | "NEP-2020 Pedagogy";
  mode: "In-Person Physical Meet" | "Hybrid (Physical + Online)" | "Live Virtual Webinar";
  date: string;
  time: string;
  duration: string;
  venueDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    googleMapsUrl: string;
    hallName: string;
    seatingCapacity: number;
  };
  speaker: {
    name: string;
    designation: string;
    institution: string;
    avatar: string;
  };
  bannerImage: string;
  summary: string;
  agenda: { time: string; session: string }[];
  keyTakeaways: string[];
  registeredAttendees: number;
  totalSeats: number;
  enrolledSchoolsCount: number;
  schoolInvitationDetails: {
    invitationCode: string;
    targetGrades: string;
    perksForSchools: string[];
    maxStudentsPerSchool: number;
    maxTeachersPerSchool: number;
    exhibitionBoothsAvailable: boolean;
    hospitalityProvided: string;
  };
  featured: boolean;
  status: "Upcoming" | "Live Now" | "Completed / Recorded";
  recordingLink?: string;
}

export const ALL_SEMINARS: SeminarItem[] = [
  {
    id: "national-stem-principals-symposium-delhi",
    title: "National STEM Principals & Educators Summit: NEP-2020 Lab Revolution",
    topic: "Educational Leadership, Practical Science & NEP-2020 Compliance",
    category: "NEP-2020 Pedagogy",
    mode: "In-Person Physical Meet",
    date: "April 25, 2026",
    time: "9:00 AM – 4:30 PM IST",
    duration: "Full-Day Summit",
    venueDetails: {
      name: "Vigyan Bhawan & India Habitat Centre",
      address: "Maulana Azad Road, Central Secretariat",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110011",
      landmark: "Near Udyog Bhawan Metro Station",
      googleMapsUrl: "https://maps.google.com/?q=Vigyan+Bhawan+New+Delhi",
      hallName: "Plenary Hall A & Innovation Concourse",
      seatingCapacity: 1200
    },
    speaker: {
      name: "Dr. Arvind Sharma & Prof. Rajesh Mohanty",
      designation: "National Board Advisors on Science Curriculum",
      institution: "Ministry of Education & CSEEL National Council",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    summary: "Grand physical symposium inviting School Principals, Trustees, and Science HODs across India. Experience live demonstrations of Atal Tinkering Labs, hybrid virtual practical suites, and government STEM grant allocations.",
    agenda: [
      { time: "9:00 AM", session: "Registration, Welcome Breakfast & Delegation Kit Distribution" },
      { time: "10:00 AM", session: "Inaugural Keynote: NEP-2020 Mandates for Hands-on School Labs" },
      { time: "11:30 AM", session: "Live Showcase: 50 Student Science Hardware Innovations" },
      { time: "1:00 PM", session: "Networking Executive Lunch & Institutional Meet" },
      { time: "2:15 PM", session: "Workshop: Transitioning from Cookbook Practicals to Inquiry Science" },
      { time: "3:45 PM", session: "Awarding National Exemplary STEM School Accreditations & MoU Signing" }
    ],
    keyTakeaways: [
      "Official CSEEL STEM Center of Excellence accreditation for enrolled schools.",
      "Hands-on training for Science Teachers on modern lab apparatus and virtual simulations.",
      "Access to ₹5 Lakhs ATL equipment matching grants and curriculum manuals."
    ],
    registeredAttendees: 840,
    totalSeats: 1200,
    enrolledSchoolsCount: 145,
    schoolInvitationDetails: {
      invitationCode: "CSEEL-DELHI-SUMMIT-2026",
      targetGrades: "Class 6 to 12 & Senior Secondary",
      perksForSchools: [
        "Complimentary VIP passes for Principal + up to 5 Science Teachers",
        "Official School Delegation Certificate of Honor",
        "Free STEM Lab Assessment Toolkit & Equipment Catalog",
        "Buffet Lunch & High-Tea for the entire delegation"
      ],
      maxStudentsPerSchool: 15,
      maxTeachersPerSchool: 5,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Complimentary Meals, Delegate Badges & Presentation Kits"
    },
    featured: true,
    status: "Upcoming"
  },
  {
    id: "chandrayaan-beyond-planetary-science-bengaluru",
    title: "ISRO Space Exploration & Satellite Technology National Seminar",
    topic: "Space Sciences, Orbital Dynamics & Astronomy Clubs",
    category: "Space Sciences",
    mode: "In-Person Physical Meet",
    date: "May 02, 2026",
    time: "9:30 AM – 3:30 PM IST",
    duration: "6 Hours",
    venueDetails: {
      name: "Jawaharlal Nehru Planetarium & Convention Center",
      address: "Sri T. Choudaiah Road, High Grounds",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      landmark: "Near Raj Bhavan & Vidhana Soudha",
      googleMapsUrl: "https://maps.google.com/?q=Jawaharlal+Nehru+Planetarium+Bengaluru",
      hallName: "Satish Dhawan Astronomy Amphitheatre",
      seatingCapacity: 800
    },
    speaker: {
      name: "Dr. K. S. Radhakrishnan",
      designation: "Senior Scientist & Mission Director",
      institution: "ISRO Satellite Center, Bengaluru",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    summary: "Exclusive in-person seminar and live payload exhibition for school student delegations and physics teachers. Learn directly from ISRO space engineers about satellite telemetry and space astronomy clubs.",
    agenda: [
      { time: "9:30 AM", session: "Delegation Registration & Space Dome Pass Allotment" },
      { time: "10:30 AM", session: "Keynote: Chandrayaan & Gaganyaan Mission Architectures" },
      { time: "12:00 PM", session: "Live Demonstration of Model Rockets & CubeSat Sensors" },
      { time: "1:00 PM", session: "Lunch & Astronomy Gallery Tour" },
      { time: "2:00 PM", session: "Student Q&A: How to Start an ISRO Space Club in Your School" },
      { time: "3:15 PM", session: "Certificate Distribution & Telescope Stargazing Guide" }
    ],
    keyTakeaways: [
      "Step-by-step kit on launching a licensed Amateur Radio & Space Club in school.",
      "Direct guidance on submitting school student experiments to ISRO PS4 orbital platform.",
      "Exclusive ISRO Space Science educational posters and curriculum kits."
    ],
    registeredAttendees: 620,
    totalSeats: 800,
    enrolledSchoolsCount: 88,
    schoolInvitationDetails: {
      invitationCode: "ISRO-BLR-SPACE-MEET-2026",
      targetGrades: "Class 8 to 12 & B.Sc/B.Tech Students",
      perksForSchools: [
        "School Banner displayed in the National Space Pavilion",
        "Free Entry for up to 20 Students + 3 Faculty Mentors",
        "Official Space Mentor certification for accompanying physics teachers",
        "Exclusive Planetarium Sky Theatre Show entry"
      ],
      maxStudentsPerSchool: 20,
      maxTeachersPerSchool: 4,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Planetarium Entry Passes, Lunch & Space Kit"
    },
    featured: true,
    status: "Upcoming"
  },
  {
    id: "odisha-state-stem-symposium-bbsr",
    title: "Eastern India School Science & Innovation Conclave 2026",
    topic: "Experiential Science, Robotics & Chemistry Practical Standards",
    category: "Robotics & AI",
    mode: "In-Person Physical Meet",
    date: "May 09, 2026",
    time: "9:00 AM – 5:00 PM IST",
    duration: "Full-Day Conclave",
    venueDetails: {
      name: "Bhubaneswar Convention Center & Science City Hall",
      address: "Infocity Road, Patia",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751024",
      landmark: "Opposite KIIT Campus & Infocity Tower",
      googleMapsUrl: "https://maps.google.com/?q=Bhubaneswar+Convention+Center",
      hallName: "Kalinga Main Auditorium",
      seatingCapacity: 1500
    },
    speaker: {
      name: "Dr. Shalini Mukhopadhyay & Prof. Santosh Jena",
      designation: "Directors of Experimental Pedagogy",
      institution: "CSIR & CSEEL Regional Science Chapter",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    summary: "The largest school STEM gathering in Eastern India bringing together 200+ schools from Odisha, West Bengal, Jharkhand, and Bihar for live lab competitions, robotics arenas, and educator masterclasses.",
    agenda: [
      { time: "9:00 AM", session: "School Delegation Check-in & Project Exhibition Stall Setup" },
      { time: "10:00 AM", session: "Inaugural Ceremony by State Education Secretary" },
      { time: "11:00 AM", session: "Inter-School Science Project Grand Jury Evaluation" },
      { time: "1:15 PM", session: "Delegates Lunch & Teacher Networking Session" },
      { time: "2:30 PM", session: "Masterclass: Safe Chemical Handling & Physics Apparatus Precision" },
      { time: "4:15 PM", session: "Grand Trophy Presentation: Top Science School of the Year 2026" }
    ],
    keyTakeaways: [
      "Chance for schools to win the ₹1,00,000 CSEEL Innovation Trophy & Lab Grants.",
      "Hands-on masterclass for biology, physics, and chemistry teachers.",
      "Free school booth to exhibit top 3 student projects to industry judges."
    ],
    registeredAttendees: 1100,
    totalSeats: 1500,
    enrolledSchoolsCount: 165,
    schoolInvitationDetails: {
      invitationCode: "CSEEL-EAST-CONCLAVE-2026",
      targetGrades: "Class 6 to 12 (CBSE / ICSE / State Board)",
      perksForSchools: [
        "Complimentary 10x10 ft Exhibition Booth for Student Projects",
        "Free Entry for 25 Students + 5 Accompanying Teachers",
        "Certificates with State Council Endorsement",
        "Full Meal & Transportation Support for registered school buses"
      ],
      maxStudentsPerSchool: 25,
      maxTeachersPerSchool: 5,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Exhibition Booth, Full Meals & Parking Facility"
    },
    featured: true,
    status: "Upcoming"
  },
  {
    id: "quantum-computing-physics-mumbai",
    title: "Quantum Physics & Advanced Materials National Seminar",
    topic: "Quantum Entanglement, Nano-Materials & Cryogenics",
    category: "Quantum Physics",
    mode: "Hybrid (Physical + Online)",
    date: "May 16, 2026",
    time: "10:00 AM – 3:00 PM IST",
    duration: "5 Hours",
    venueDetails: {
      name: "TIFR Homi Bhabha Auditorium",
      address: "Homi Bhabha Road, Navy Nagar, Colaba",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400005",
      landmark: "Near Colaba Post Office & Tata Memorial Area",
      googleMapsUrl: "https://maps.google.com/?q=Tata+Institute+of+Fundamental+Research+Mumbai",
      hallName: "Ramanujan Quantum Theatre",
      seatingCapacity: 600
    },
    speaker: {
      name: "Prof. Dr. Arvind Ramanathan",
      designation: "Chair Professor of Quantum Condensed Matter",
      institution: "Tata Institute of Fundamental Research (TIFR) & IISc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop",
    summary: "High-level physics seminar for senior secondary students and physics educators exploring quantum superposition, Bloch spheres, and superconducting materials.",
    agenda: [
      { time: "10:00 AM", session: "Registration & Superconducting Levitation Live Demo" },
      { time: "11:15 AM", session: "Lecture: Quantum Gates and Quantum Cryptography" },
      { time: "1:00 PM", session: "Lunch Break & Physics Lab Tours" },
      { time: "2:00 PM", session: "Simulation Session: Running Quantum Circuits in Classroom" }
    ],
    keyTakeaways: [
      "Understand atomic physics concepts beyond standard NCERT textbooks.",
      "How to conduct liquid nitrogen superconductivity demonstrations safely.",
      "Access to open-source Quantum SDK curriculum for school computers."
    ],
    registeredAttendees: 420,
    totalSeats: 600,
    enrolledSchoolsCount: 54,
    schoolInvitationDetails: {
      invitationCode: "TIFR-MUMBAI-QUANTUM-2026",
      targetGrades: "Class 11 & 12 (Physics Specialization)",
      perksForSchools: [
        "Entry to Premier National Research Laboratories at TIFR",
        "Physics Faculty Development Masterclass pass",
        "Custom Quantum Teaching Slides and Worksheets"
      ],
      maxStudentsPerSchool: 15,
      maxTeachersPerSchool: 3,
      exhibitionBoothsAvailable: false,
      hospitalityProvided: "Lunch, Delegate Passes & Laboratory Tour"
    },
    featured: false,
    status: "Upcoming"
  },
  {
    id: "green-chemistry-clean-energy-pune",
    title: "National Green Chemistry & Clean Hydrogen Symposium",
    topic: "Green Solvents, Sustainable Bio-Polymers & Water Electrolysis",
    category: "Green Chemistry",
    mode: "In-Person Physical Meet",
    date: "May 22, 2026",
    time: "9:30 AM – 4:00 PM IST",
    duration: "6.5 Hours",
    venueDetails: {
      name: "CSIR-NCL Innovation Park Auditorium",
      address: "Dr. Homi Bhabha Road, Pashan",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411008",
      landmark: "Near Pune University Campus",
      googleMapsUrl: "https://maps.google.com/?q=National+Chemical+Laboratory+Pune",
      hallName: "Sir C. V. Raman Lecture Hall",
      seatingCapacity: 700
    },
    speaker: {
      name: "Dr. Shalini Mukhopadhyay & Dr. Vivek Verma",
      designation: "Chief Research Scientists",
      institution: "CSIR-NCL Pune",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
    summary: "Hands-on chemical sciences symposium for schools focusing on eliminating toxic reagents, creating biodegradable plastic from banana peel, and safe school electrolysis.",
    agenda: [
      { time: "9:30 AM", session: "Registration & Bio-Chemistry Showcase" },
      { time: "10:30 AM", session: "Keynote: Zero-Carbon Energy & Green Chemical Principles" },
      { time: "12:30 PM", session: "Live Synthesis of Non-Toxic Natural Indicators & Polymers" },
      { time: "1:30 PM", session: "Lunch & Chemistry HOD Roundtable" },
      { time: "2:30 PM", session: "Student Innovation Pitch on Clean Water Technologies" }
    ],
    keyTakeaways: [
      "Zero-waste chemical practical handbook for CBSE/ICSE laboratories.",
      "Methods to produce green hydrogen in school physics/chemistry setups.",
      "CSIR research mentorship for top student projects."
    ],
    registeredAttendees: 510,
    totalSeats: 700,
    enrolledSchoolsCount: 62,
    schoolInvitationDetails: {
      invitationCode: "CSIR-PUNE-CHEM-2026",
      targetGrades: "Class 9 to 12 & Chemistry Teachers",
      perksForSchools: [
        "Free Green Chemistry Reagents Starter Kit for the school lab",
        "Official Certificate for School Eco-Club",
        "10 Free Student Delegate passes + 2 Chemistry Teachers"
      ],
      maxStudentsPerSchool: 12,
      maxTeachersPerSchool: 3,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Complimentary Lunch, Chemical Lab Manual & Delegate Pass"
    },
    featured: false,
    status: "Upcoming"
  },
  {
    id: "crispr-genomics-biotech-delhi",
    title: "Genomics, CRISPR & Molecular Biology National School Meet",
    topic: "Genetic Engineering, DNA Extraction & Biotechnology Careers",
    category: "Genomics & Bio-Tech",
    mode: "In-Person Physical Meet",
    date: "May 29, 2026",
    time: "9:30 AM – 3:30 PM IST",
    duration: "6 Hours",
    venueDetails: {
      name: "AIIMS JLN Auditorium & Biotech Center",
      address: "Ansari Nagar East, Sri Aurobindo Marg",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110029",
      landmark: "Opposite Safdarjung Hospital",
      googleMapsUrl: "https://maps.google.com/?q=AIIMS+New+Delhi",
      hallName: "Jawaharlal Nehru Auditorium",
      seatingCapacity: 900
    },
    speaker: {
      name: "Dr. Priyanka Das, MBBS, Ph.D.",
      designation: "Professor of Molecular Genetics & Bio-Ethics",
      institution: "AIIMS New Delhi",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
    summary: "Immersive physical bio-technology seminar for biology students and teachers exploring DNA extraction from fruits, CRISPR Cas9 mechanics, PCR amplification, and medical research pathways.",
    agenda: [
      { time: "9:30 AM", session: "Registration & DNA Helix Workshop Kits Handover" },
      { time: "10:30 AM", session: "Keynote: How CRISPR Technology is Curing Genetic Diseases" },
      { time: "12:00 PM", session: "Live Student Workshop: Extracting DNA in 15 Minutes" },
      { time: "1:15 PM", session: "Lunch & Medical Science Career Advisory" },
      { time: "2:15 PM", session: "Ethical Debate: Synthetic Biology & Designer Genomes" }
    ],
    keyTakeaways: [
      "Master DNA electrophoresis and PCR protocol teaching.",
      "Career roadmaps for students interested in NEET, AIIMS, and Bio-Tech research.",
      "Bio-safety guidelines and kit discounts for school laboratories."
    ],
    registeredAttendees: 680,
    totalSeats: 900,
    enrolledSchoolsCount: 79,
    schoolInvitationDetails: {
      invitationCode: "AIIMS-DELHI-GENOMICS-2026",
      targetGrades: "Class 9 to 12 (Biology / Pre-Medical)",
      perksForSchools: [
        "Hands-on Molecular Biology Workshop Kit for School Delegation",
        "Official AIIMS & CSEEL Participation Credential",
        "Free Entry for up to 15 Pre-Medical Students + 3 Biology Teachers"
      ],
      maxStudentsPerSchool: 15,
      maxTeachersPerSchool: 3,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Workshop Kits, Buffet Lunch & Delegate Badges"
    },
    featured: false,
    status: "Upcoming"
  },
  {
    id: "live-national-optics-laser-webinar",
    title: "Live National Science Masterclass: Low-Cost Optics & Laser Experiments for Classes 9-12",
    topic: "Interference, Diffraction, Ray Optics & NEP Inquiry Pedagogy",
    category: "Quantum Physics",
    mode: "Live Virtual Webinar",
    date: "Today (Live Now)",
    time: "4:00 PM – 5:30 PM IST",
    duration: "90 Minutes",
    venueDetails: {
      name: "CSEEL Virtual Interactive Studio (Broadcast Studio 1)",
      address: "Online Broadcast Portal & Zoom Live Stream",
      city: "Online / Virtual",
      state: "Pan-India",
      pincode: "110001",
      landmark: "Virtual Broadcast Room",
      googleMapsUrl: "https://maps.google.com/?q=New+Delhi",
      hallName: "Virtual Main Stage A",
      seatingCapacity: 5000
    },
    speaker: {
      name: "Prof. H. C. Verma & Dr. Arvind Sharma",
      designation: "Distinguished Physicist & Author",
      institution: "IIT Kanpur & CSEEL Academic Advisory Board",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop",
    summary: "Live interactive national webinar demonstrating 12 low-cost, high-impact laser diffraction, Snell's law refraction, and optical bench experiments that teachers can replicate using classroom materials.",
    agenda: [
      { time: "4:00 PM", session: "Welcome & Live Laser Demonstration Setup" },
      { time: "4:20 PM", session: "Interactive Ray Optics & Wave Optics Experiments" },
      { time: "5:00 PM", session: "Teacher Q&A and Lesson Planning Hacks" },
      { time: "5:20 PM", session: "Digital Attendance & Instant Certificate Generation" }
    ],
    keyTakeaways: [
      "12 downloadable printable optics experiment worksheets.",
      "Instant CPD verified certificate for attending science teachers.",
      "Access to simulation codes on CSEEL virtual lab."
    ],
    registeredAttendees: 3420,
    totalSeats: 5000,
    enrolledSchoolsCount: 380,
    schoolInvitationDetails: {
      invitationCode: "CSEEL-LIVE-OPTICS-2026",
      targetGrades: "Physics Educators & Students (Grades 9-12)",
      perksForSchools: [
        "Complimentary Live Interactive Studio Access",
        "E-Certificates for all attending students and educators",
        "Downloadable 3D Optics Simulation Package"
      ],
      maxStudentsPerSchool: 50,
      maxTeachersPerSchool: 10,
      exhibitionBoothsAvailable: false,
      hospitalityProvided: "Digital Handouts & Live Streaming Portal Access"
    },
    featured: true,
    status: "Live Now",
    recordingLink: "https://www.youtube.com/watch?v=live-optics-cseel"
  },
  {
    id: "past-stem-teachers-conclave-delhi-2025",
    title: "Winter STEM Educators Conclave 2025: Atal Tinkering Hub Mastery",
    topic: "Robotics, 3D Prototyping & ATL Guidelines",
    category: "Robotics & AI",
    mode: "In-Person Physical Meet",
    date: "December 18, 2025",
    time: "9:00 AM – 5:00 PM IST",
    duration: "Full-Day Summit",
    venueDetails: {
      name: "IIT Delhi Dogra Hall & Innovation Center",
      address: "Hauz Khas",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016",
      landmark: "IIT Delhi Main Gate",
      googleMapsUrl: "https://maps.google.com/?q=IIT+Delhi",
      hallName: "Dogra Plenary Hall",
      seatingCapacity: 950
    },
    speaker: {
      name: "Dr. Ramanathan Iyer & Er. Tarun Grover",
      designation: "ATL Master Trainers & Robotics Directors",
      institution: "NITI Aayog Partner Network & CSEEL",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop",
    summary: "Historic national summit where 350+ science educators from 120 schools mastered Arduino robotics programming, drone telemetry, and practical lab maintenance with hands-on hardware kits.",
    agenda: [
      { time: "9:00 AM", session: "Inaugural Address & ATL Toolkit Unboxing" },
      { time: "11:00 AM", session: "Hands-on Microcontroller & Sensor Interfacing" },
      { time: "1:00 PM", session: "Networking Luncheon" },
      { time: "2:30 PM", session: "3D CAD Modeling for School Science Models" },
      { time: "4:30 PM", session: "National Exemplary STEM Educator Award Ceremony" }
    ],
    keyTakeaways: [
      "Over 350 certified educators accredited across 120 institutions.",
      "50 student maker projects selected for national incubation.",
      "Comprehensive ATL lab safety manuals distributed."
    ],
    registeredAttendees: 950,
    totalSeats: 950,
    enrolledSchoolsCount: 120,
    schoolInvitationDetails: {
      invitationCode: "CSEEL-PAST-WINTER-2025",
      targetGrades: "All STEAM Educators",
      perksForSchools: ["Certified Educator Badges", "ATL Toolkits"],
      maxStudentsPerSchool: 10,
      maxTeachersPerSchool: 4,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Full Meals & Accreditation"
    },
    featured: false,
    status: "Completed / Recorded",
    recordingLink: "https://www.youtube.com/watch?v=cseel-winter-conclave"
  },
  {
    id: "past-astronomy-rocketry-meet-kolkata",
    title: "National School Astronomy & Rocketry Conclave 2025",
    topic: "Model Rocketry, Telescope Stargazing & Planetary Physics",
    category: "Space Sciences",
    mode: "In-Person Physical Meet",
    date: "November 14, 2025",
    time: "10:00 AM – 6:00 PM IST",
    duration: "Full-Day Science Festival",
    venueDetails: {
      name: "Science City Main Auditorium & Space Lawn",
      address: "JBS Haldane Avenue",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700046",
      landmark: "Near Park Circus Connector",
      googleMapsUrl: "https://maps.google.com/?q=Science+City+Kolkata",
      hallName: "Space Theatre & Science Lawn",
      seatingCapacity: 1400
    },
    speaker: {
      name: "Dr. K. S. Radhakrishnan & Dr. Ananya Roy",
      designation: "ISRO Mission Scientists",
      institution: "ISRO Space Applications Division",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    },
    bannerImage: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop",
    summary: "Over 1,200 students launched model solid-fuel rockets and observed lunar craters through 8-inch computerized telescopes during Children's Day national celebrations.",
    agenda: [
      { time: "10:00 AM", session: "Keynote: India in Deep Space" },
      { time: "12:00 PM", session: "Model Rocket Aerodynamics & Parachute Ejection Workshop" },
      { time: "2:30 PM", session: "Live Rocket Launch Trials on Science City Lawns" },
      { time: "4:30 PM", session: "Evening Stargazing Session with Celestron Telescopes" }
    ],
    keyTakeaways: [
      "120 model rockets successfully launched by school student teams.",
      "Hands-on telescope collimation training for physics teachers.",
      "Official certificate of rocketry engineering awarded."
    ],
    registeredAttendees: 1400,
    totalSeats: 1400,
    enrolledSchoolsCount: 140,
    schoolInvitationDetails: {
      invitationCode: "CSEEL-PAST-ROCKETRY-2025",
      targetGrades: "Class 6 to 12",
      perksForSchools: ["Rocket Kits", "Space Badges"],
      maxStudentsPerSchool: 20,
      maxTeachersPerSchool: 4,
      exhibitionBoothsAvailable: true,
      hospitalityProvided: "Buffet Lunch & Space Kit"
    },
    featured: false,
    status: "Completed / Recorded",
    recordingLink: "https://www.youtube.com/watch?v=cseel-kolkata-rocketry"
  }
];
