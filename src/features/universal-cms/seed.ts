import { UniversalPageData } from './types';

export const INITIAL_CMS_PAGES: Record<string, UniversalPageData> = {
  // ─── DOMAINS ──────────────────────────────────────────────────────────────────
  'domain:science': {
    pageKey: 'domain:science',
    title: 'Science & Mathematics',
    eyebrow: 'Core STEM Foundation',
    subtitle: 'Hands-on experiential learning across Chemistry, Physics, Biology, and Mathematics aligned with NEP 2020.',
    description: 'Explore interactive virtual labs, simulations, and real-world experiments that replace expensive consumables with unlimited exploratory practicals.',
    heroImage: '/images/categories/chemistry.webp',
    badge: '15 Labs Available',
    ctaText: 'Explore Science Labs',
    ctaLink: '/domain/science#labs',
    secondaryCtaText: 'Download Curriculum',
    secondaryCtaLink: '/materials',
    customFields: {
      totalLabs: '15 Labs',
      curriculum: 'NEP 2020 • CBSE • ICSE',
      icon: '🔬',
      subjectsList: ['Chemistry', 'Biology', 'Physics', 'Mathematics'],
    },
    sections: {
      whyPoints: [
        { icon: '⚗️', title: 'Zero Consumables & Safe Failure', desc: 'Run chemistry experiments without toxic reagents and physics practicals without equipment breakage.' },
        { icon: '👥', title: 'Every Student Gets a Bench', desc: 'No more three students crowding around one apparatus. Every learner controls the experiment independently.' },
        { icon: '📊', title: 'Assessment & Analytics Built In', desc: 'Automatic data logging, interactive graph plotting, and teacher analytics dashboards.' },
        { icon: '🎯', title: 'NEP 2020 Pedagogical Alignment', desc: 'Direct mapping to NCERT, CBSE, and state board practical learning outcomes.' }
      ]
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Seed',
  },

  'domain:engineering': {
    pageKey: 'domain:engineering',
    title: 'Engineering & Technology',
    eyebrow: 'Future-Ready Skills',
    subtitle: 'Robotics, IoT, AI, Electronics, and Atal Tinkering Lab modules building real-world problem-solving.',
    description: 'Hands-on engineering design thinking, circuit breadboarding, automated sensors, and coding simulators designed for school students.',
    heroImage: '/images/categories/engineering.webp',
    badge: '12 Labs Available',
    ctaText: 'Explore Tech Labs',
    ctaLink: '/domain/engineering#labs',
    secondaryCtaText: 'View ATL Kits',
    secondaryCtaLink: '/materials',
    customFields: {
      totalLabs: '12 Labs',
      curriculum: 'NEP 2020 • ATL • AI Ready',
      icon: '⚙️',
      subjectsList: ['Robotics', 'IoT', 'Artificial Intelligence', 'Electronics'],
    },
    sections: {
      whyPoints: [
        { icon: '🤖', title: 'Real-World Robotics & Coding', desc: 'Simulate microcontroller code, sensor telemetry, and motor drivers in interactive 3D.' },
        { icon: '🧠', title: 'Artificial Intelligence & Neural Nets', desc: 'Visual AI concept modules allowing class 6-12 students to understand machine learning.' },
        { icon: '⚡', title: 'Safe High-Voltage Electronics', desc: 'Explore AC circuits and power electronics virtually with zero electric shock risk.' },
        { icon: '🏆', title: 'ATL Competition Ready', desc: 'Modules designed to mentor students for national science exhibitions and hackathons.' }
      ]
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Seed',
  },

  'domain:art': {
    pageKey: 'domain:art',
    title: 'Art & Design',
    eyebrow: 'Creative STEAM',
    subtitle: 'Where creativity meets science: Color Physics, Photochemistry, Design Thinking & Aesthetics.',
    description: 'Bridging the arts and sciences through tactile simulations, optical spectroscopy, natural pigments chemistry, and creative design thinking.',
    heroImage: '/images/categories/art.webp',
    badge: '8 Labs Available',
    ctaText: 'Explore STEAM Labs',
    ctaLink: '/domain/art#labs',
    secondaryCtaText: 'View Gallery',
    secondaryCtaLink: '/domain/art',
    customFields: {
      totalLabs: '8 Labs',
      curriculum: 'STEAM • NEP 2020 Holistic',
      icon: '🎨',
      subjectsList: ['Color Physics', 'Photochemistry', 'Design Thinking', 'Creative STEAM'],
    },
    sections: {
      whyPoints: [
        { icon: '🌈', title: 'Color Physics & Light Wave Theory', desc: 'Interact with additive and subtractive color models, prism dispersion, and RGB wave mechanics.' },
        { icon: '📷', title: 'Photochemistry & Cyanotype', desc: 'Explore light-sensitive chemical reactions, cyanotype printing, and darkroom principles.' },
        { icon: '💡', title: 'Human-Centered Design Thinking', desc: 'Structured frameworks for empathy mapping, prototyping, and testing creative innovations.' },
        { icon: '🌿', title: 'Natural Pigments & Sustainable Art', desc: 'Extract and analyze anthocyanins and plant dyes using green chemistry techniques.' }
      ]
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Seed',
  },

  // ─── CORE PAGES ───────────────────────────────────────────────────────────────
  'page:about': {
    pageKey: 'page:about',
    title: 'About CSEEL Ecosystem',
    eyebrow: 'Our Mission & Vision',
    subtitle: 'Center for Scientific Exploration and Experiential Learning',
    description: 'CSEEL is dedicated to democratizing high-quality experimental STEAM education across schools in India through browser-based live simulations and verified school networks.',
    heroImage: '/images/schools/sanskriti-school-chanakyapuri-delhi.webp',
    ctaText: 'Explore Programs',
    ctaLink: '/compare-plans',
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Seed',
  },

  'page:why-cseel': {
    pageKey: 'page:why-cseel',
    title: 'Why CSEEL Experiential Platform',
    eyebrow: 'Scientifically Validated Impact',
    subtitle: 'Measurable academic gains and 82% higher student engagement.',
    description: 'Transforming theoretical textbook rote memorization into active inquiry-driven discovery with safety, scalability, and automated assessments.',
    heroImage: '/images/features/students-collaborative-laptop-learning.avif',
    ctaText: 'Compare Plans',
    ctaLink: '/compare-plans',
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Seed',
  }
};
