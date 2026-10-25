import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    "id": "blog-jigyasu-lab-reality",
    "slug": "truth-behind-jigyasu-school-lab-kits-scam-safety-reality",
    "title": "The Ground Reality of School Lab Kit Vendors: The Case of Jigyasu (Jigyasu.co.in), Fake 800+ Counts & Severe Safety Hazards",
    "summary": "An urgent investigative advisory for Indian school principals: Unpacking the reality behind vendors like Jigyasu.co.in\u2014from recycled 800+ activity counts and 50x-100x markups to unlabelled hazardous chemicals and life-threatening 230V apparatus.",
    "category": "School Leadership",
    "author": {
      "name": "CSEEL School Safety & Lab Audit Cell",
      "role": "Academic Lab Standards & Compliance",
      "avatarUrl": "/images/hero/kolb_cycle_circle_pristine.png"
    },
    "publishedAt": "October 25, 2026",
    "readTimeMinutes": 5,
    "coverImage": "/images/categories/chemistry-card-1.jpg",
    "tags": [
      "School Lab Safety",
      "Jigyasu Review",
      "Hands-On Learning",
      "Vendor Red Flags",
      "CBSE Lab Norms",
      "School Leadership"
    ],
    "isFeatured": true
  },

  {
    id: 'nep-2020-experiential-learning-mandate',
    slug: 'nep-2020-experiential-learning-mandate',
    title: 'Transforming CBSE Practical Labs Under NEP 2020: From Rote to Experiential Mastery',
    summary:
      'How schools are migrating from passive observation practicals to inquiry-driven, student-led experimentation aligned with the National Education Policy 2020.',
    category: 'Pedagogy & NEP 2020',
    author: {
      name: 'Dr. Ramesh Kaushik',
      role: 'Director of Academic Pedagogy, CSEEL',
      avatarUrl: '/images/hero/kolb_cycle_circle_pristine.png',
    },
    publishedAt: 'October 15, 2026',
    readTimeMinutes: 6,
    coverImage: '/images/categories/chemistry-card-1.jpg',
    tags: ['NEP 2020', 'CBSE Practicals', 'Experiential Learning', 'Pedagogy'],
    isFeatured: true,
  },
  {
    id: 'building-state-of-art-atl-lab',
    slug: 'building-state-of-art-atl-lab',
    title: 'Setting Up an Atal Tinkering Lab 2.0: Package Procurement, Tooling & Safety Norms',
    summary:
      'A comprehensive institutional blueprint for school principals and STEM coordinators to set up an inspection-ready ATL lab with IoT, 3D printing and robotics.',
    category: 'Atal Tinkering Labs (ATL)',
    author: {
      name: 'Er. Sandeep Verma',
      role: 'Chief Tinkering Architect',
    },
    publishedAt: 'October 10, 2026',
    readTimeMinutes: 8,
    coverImage: '/images/categories/engineering.jpg',
    tags: ['ATL 2.0', 'Robotics', 'NITI Aayog', 'Makerspace'],
    isFeatured: true,
  },
  {
    id: 'demystifying-conic-sections-tactile-math',
    slug: 'demystifying-conic-sections-tactile-math',
    title: 'Tactile Mathematics: Why 3D Wooden Dissections Make Conic Sections Intuitive',
    summary:
      'Research shows a 35% increase in Class 11 calculus retention when students physically trace parabolic and hyperbolic conic cross-sections before solving algebraic equations.',
    category: 'Mathematics in Practice',
    author: {
      name: 'Prof. Ananya Sen',
      role: 'Curriculum Head, Experiential Math',
    },
    publishedAt: 'September 28, 2026',
    readTimeMinutes: 5,
    coverImage: '/images/categories/mathematics.jpg',
    tags: ['Math Lab', 'Conic Sections', 'Tactile Proofs', 'Class 11'],
  },
  {
    id: 'safe-virtual-simulations-in-chemistry',
    slug: 'safe-virtual-simulations-in-chemistry',
    title: 'Zero Chemical Breakage: How Virtual Wet Labs Complement Physical Titrations',
    summary:
      'How hybrid simulation laboratories allow students to fail safely, explore endpoint overshoots, and master quantitative volumetric techniques without hazards.',
    category: 'Science & Experiments',
    author: {
      name: 'Dr. Ramesh Kaushik',
      role: 'Director of Academic Pedagogy, CSEEL',
    },
    publishedAt: 'September 18, 2026',
    readTimeMinutes: 5,
    coverImage: '/images/categories/chemistry.jpg',
    tags: ['Chemistry', 'Titration', 'Lab Safety', 'Simulation'],
  },
  {
    id: 'arts-integrated-learning-stem-to-steam',
    slug: 'arts-integrated-learning-stem-to-steam',
    title: 'From STEM to STEAM: Infusing Color Physics and Origami Engineering Into Classrooms',
    summary:
      'Exploring how photochemistry cyanotype printing and deployable origami structures enhance scientific curiosity and structural engineering understanding.',
    category: 'EdTech & Future Skills',
    author: {
      name: 'Pooja Nair',
      role: 'STEAM Integration Specialist',
    },
    publishedAt: 'September 05, 2026',
    readTimeMinutes: 7,
    coverImage: '/images/categories/art.jpg',
    tags: ['STEAM', 'Origami', 'Photochemistry', 'Creativity'],
  },
];

export const getBlogPosts = (): BlogPost[] => BLOG_POSTS;
