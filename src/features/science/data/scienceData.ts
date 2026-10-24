import { SUBJECTS_DATA } from '@/data/subjectActivitiesData';
import { ScienceExperiment, ScienceSubjectMetadata } from '../types';

export const SCIENCE_SUBJECTS: Record<'physics' | 'chemistry' | 'biology', ScienceSubjectMetadata> = {
  physics: {
    slug: 'physics',
    name: 'Physics',
    tagline: 'Mechanics, Wave Optics & Electromagnetic Circuits',
    accentColor: '#0ea5e9',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    iconName: 'Atom',
    labType: 'Mechanics & Wave Optics Lab',
    description:
      'Explore classical mechanics, wave propagation, geometric ray optics, electromagnetic induction, and modern physics practicals mapped to CBSE & NEP 2020.',
    popularConcepts: ["Ohm's Law", 'Simple Pendulum', 'Convex Lens Optics', 'Sonometer Frequency', 'Prism Refraction'],
    activitiesCount: SUBJECTS_DATA.physics?.activities?.length || 10,
  },
  chemistry: {
    slug: 'chemistry',
    name: 'Chemistry',
    tagline: 'Volumetric Titrations, Qualitative Analysis & Kinetics',
    accentColor: '#f59e0b',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconName: 'FlaskConical',
    labType: 'Virtual Molecular & Wet Lab',
    description:
      'Volumetric titrations, redox reactions, qualitative salt analysis, reaction kinetics, and organic functional groups with real observation tables.',
    popularConcepts: ['Acid-Base Neutralization', 'Redox Titration (KMnO4)', 'Qualitative Salt Analysis', 'Reaction Kinetics', 'Paper Chromatography'],
    activitiesCount: SUBJECTS_DATA.chemistry?.activities?.length || 10,
  },
  biology: {
    slug: 'biology',
    name: 'Biology & Life Science',
    tagline: 'Microbiology, Cellular Anatomy & Genetics',
    accentColor: '#10b981',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconName: 'Dna',
    labType: 'Microbiology & Botanical Lab',
    description:
      'High-precision virtual microscopy, cell structure dissection, human physiology, respiration rates, and Mendelian genetics experiments.',
    popularConcepts: ['Compound Microscopy', 'Onion Peel Cell', 'Photosynthesis Rate', 'Human Anatomy Models', 'Stomatal Distribution'],
    activitiesCount: SUBJECTS_DATA.biology?.activities?.length || 10,
  },
};

export const getScienceActivities = (subject?: 'physics' | 'chemistry' | 'biology'): ScienceExperiment[] => {
  const mapActivity = (act: any, sub: 'physics' | 'chemistry' | 'biology'): ScienceExperiment => ({
    ...act,
    subject: sub,
    slug: act.slug || act.id,
    thumbnail_url: act.thumbnail_url || act.image || `/images/categories/${sub}.jpg`,
  });

  if (subject) {
    const raw = SUBJECTS_DATA[subject]?.activities || [];
    return raw.map((a) => mapActivity(a, subject));
  }

  const p = (SUBJECTS_DATA.physics?.activities || []).map((a) => mapActivity(a, 'physics'));
  const c = (SUBJECTS_DATA.chemistry?.activities || []).map((a) => mapActivity(a, 'chemistry'));
  const b = (SUBJECTS_DATA.biology?.activities || []).map((a) => mapActivity(a, 'biology'));

  return [...p, ...c, ...b];
};
