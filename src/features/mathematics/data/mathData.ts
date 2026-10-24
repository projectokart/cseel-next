import { SUBJECTS_DATA } from '@/data/subjectActivitiesData';
import { MathExperiment } from '../types';

export const MATH_METADATA = {
  slug: 'mathematics',
  name: 'Experiential Mathematics & Modeling',
  tagline: 'Tactile Geometry, Conic Sections & Dynamic Visualizations',
  accentColor: '#8b5cf6',
  badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  labType: 'Experiential Mathematics Lab',
  description:
    'Bridge theoretical equations with tactile physical proofs: conic sections, coordinate visualizers, trigonometric ratios, and practical geometrical derivations aligned to CBSE & NEP 2020.',
  popularConcepts: [
    'Conic Sections (Parabola & Ellipse)',
    'Trigonometric Heights & Distances',
    'Coordinate Geometry Proofs',
    'Quadratic Functions & Curves',
    'Pythagorean 3D Dissections',
  ],
};

export const getMathActivities = (): MathExperiment[] => {
  const raw = SUBJECTS_DATA.math?.activities || SUBJECTS_DATA.mathematics?.activities || [];
  return raw.map((a: any) => ({
    id: a.id,
    slug: a.slug || a.id,
    title: a.title,
    subtitle: a.subtitle || a.description,
    category: a.category || 'Pure Mathematics',
    gradeLevel: a.gradeLevel || 'Class 10th',
    difficulty: (a.difficulty as any) || 'Intermediate',
    duration: a.duration || '35 Mins',
    description: a.description,
    mathematicalConcept: a.scientificPrinciple || 'Geometric Derivation',
    realWorldApplication: a.realWorldApplication || 'Architecture, Celestial Orbits & Computer Graphics',
    tags: a.tags || ['Geometry', 'Calculus', 'Conics'],
    thumbnail_url: a.thumbnail_url || a.image || '/images/categories/mathematics.jpg',
    formula: a.formula,
    graph: a.graph,
    interp: a.interp,
  }));
};
