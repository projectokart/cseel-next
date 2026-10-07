import { ExperimentItem } from '@/types/experiment';
import { SUBJECTS_DATA } from './subjectActivitiesData';

export const INITIAL_EXPERIMENTS: ExperimentItem[] = [
  {
    id: 'chem-1',
    title: 'Exothermic Elephant Toothpaste Reaction',
    subtitle: 'Rapid Catalytic Decomposition of Hydrogen Peroxide into Foam Plumes',
    subjectSlug: 'chemistry',
    subjectName: 'Chemistry',
    category: 'Inorganic Chemistry & Catalysis',
    gradeLevel: 'Middle (6-8)',
    difficulty: 'Beginner',
    duration: '20 Mins',
    safetyLevel: 'Adult Supervision',
    status: 'published',
    tags: ['Kinetics', 'Catalyst', 'Exothermic', 'Gases', 'NEP 2020'],
    badge: 'Popular Classic',
    heroImage: '/images/categories/chemistry.jpg',
    colorTheme: 'from-amber-500 to-orange-600',
    author: 'CSEEL Science Laboratory',
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    sections: [
      {
        id: 'sec-mat-1',
        type: 'materials',
        title: 'Materials & Apparatus Required',
        description: 'Ensure all reagents are pre-measured and stored in clean, labeled glass containers.',
        order: 1,
        isEnabled: true,
        columns: [
          { id: 'col-1', key: 'name', label: 'Item / Reagent Name', type: 'text' },
          { id: 'col-2', key: 'image', label: 'Item Image / Icon', type: 'image' },
          { id: 'col-3', key: 'buyLink', label: 'Buy Link / Source', type: 'link' },
          { id: 'col-4', key: 'quantity', label: 'Quantity', type: 'text' },
          { id: 'col-5', key: 'spec', label: 'Specification / Grade', type: 'text' }
        ],
        rows: [
          {
            id: 'row-1',
            name: 'Hydrogen Peroxide (H₂O₂)',
            image: '/images/categories/chemistry.jpg',
            buyLink: 'https://material.cseel.org/products/h2o2-lab-grade',
            quantity: '100 mL',
            spec: '12% - 30% Analytical Grade'
          },
          {
            id: 'row-2',
            name: 'Potassium Iodide (KI) Catalyst',
            image: '/images/categories/chemistry.jpg',
            buyLink: 'https://material.cseel.org/products/potassium-iodide',
            quantity: '5 g',
            spec: 'Lab Reagent Pure Powder'
          },
          {
            id: 'row-3',
            name: 'Liquid Dishwashing Detergent',
            image: '',
            buyLink: '',
            quantity: '15 mL',
            spec: 'High-foaming commercial detergent'
          },
          {
            id: 'row-4',
            name: 'Erlenmeyer Flask',
            image: '',
            buyLink: 'https://material.cseel.org/products/erlenmeyer-500ml',
            quantity: '1 Unit',
            spec: '500 mL Borosilicate 3.3 Glass'
          },
          {
            id: 'row-5',
            name: 'Containment Safety Tray',
            image: '',
            buyLink: '',
            quantity: '1 Unit',
            spec: 'Polypropylene 40 x 30 cm Basin'
          }
        ]
      },
      {
        id: 'sec-prec-1',
        type: 'precautions',
        title: 'Safety Precautions & Lab Safety Protocol',
        order: 2,
        isEnabled: true,
        safetyLevel: 'Adult Supervision',
        ppeRequired: ['Safety Goggles', 'Nitrile Gloves', 'Lab Coat', 'Ventilated Bench'],
        warnings: [
          {
            id: 'warn-1',
            type: 'caution',
            title: 'Exothermic Thermal Output',
            text: 'The reaction reaches temperatures above 65°C rapidly. Never touch the warm foam immediately after eruption without insulating gloves.'
          },
          {
            id: 'warn-2',
            type: 'danger',
            title: 'Corrosive Oxidizer Hazard',
            text: 'Concentrated Hydrogen Peroxide (30%) can cause skin irritation and chemical bleaching. Flush affected skin with running cold water for 15 minutes.'
          },
          {
            id: 'warn-3',
            type: 'disposal',
            title: 'Safe Neutralization & Disposal',
            text: 'The resulting foam is primarily oxygen bubbles, water, soap, and dilute iodine salts. It may be rinsed down laboratory drains with abundant tap water.'
          }
        ]
      },
      {
        id: 'sec-theo-1',
        type: 'theory',
        title: 'Scientific Principle & Reaction Kinetics',
        order: 3,
        isEnabled: true,
        headingLevel: 'h2',
        alignment: 'left',
        content: `Hydrogen peroxide ($H_2O_2$) naturally undergoes a slow unimolecular decomposition into liquid water and gaseous oxygen. Under ambient laboratory conditions, this reaction proceeds at an imperceptible velocity due to a substantial activation energy barrier ($E_a \\approx 75\\text{ kJ/mol}$).

When Potassium Iodide ($KI$) or biological Catalase is introduced, iodide ions ($I^-$) act as a homogeneous catalyst. The iodide ion reacts with $H_2O_2$ in the rate-determining step to form hypoiodite intermediate ($IO^-$), which subsequently undergoes rapid redox breakdown to regenerate the catalytic iodide ion while releasing voluminous gaseous oxygen.

The trapped liquid dish soap encapsulates the escaping oxygen gas into trillions of pressurized micro-bubbles, resulting in the iconic towering foam pillar known colloquially as Elephant Toothpaste.`
      },
      {
        id: 'sec-math-1',
        type: 'math_formula',
        title: 'Chemical Equations & Mathematical Kinetics',
        description: 'Stoichiometric balance and Arrhenius reaction rate formulation.',
        order: 4,
        isEnabled: true,
        formulas: [
          {
            id: 'form-1',
            label: 'Overall Catalytic Decomposition',
            latex: '2H_2O_2 (aq) \\xrightarrow{I^-} 2H_2O (l) + O_2 (g) + \\Delta H',
            explanation: 'Exothermic enthalpy release: Delta H = -98.2 kJ/mol per mole of hydrogen peroxide decomposed.'
          },
          {
            id: 'form-2',
            label: 'Reaction Step 1 (Rate Determining)',
            latex: 'H_2O_2 + I^- \\rightarrow H_2O + IO^- \\quad (\\text{Slow step})',
            explanation: 'Hypoiodite intermediate formation drives the kinetic pathway.'
          },
          {
            id: 'form-3',
            label: 'Reaction Step 2 (Catalyst Regeneration)',
            latex: 'H_2O_2 + IO^- \\rightarrow H_2O + O_2 + I^- \\quad (\\text{Rapid regeneration})',
            explanation: 'Iodide catalyst is fully regenerated and available for subsequent decomposition cycles.'
          },
          {
            id: 'form-4',
            label: 'Arrhenius Reaction Velocity',
            latex: 'k = A \\cdot e^{-\\frac{E_a}{R \\cdot T}}',
            explanation: 'Catalysis reduces the activation energy barrier Ea, increasing the rate constant k by a factor of 10^5.'
          }
        ]
      },
      {
        id: 'sec-proc-1',
        type: 'procedure',
        title: 'Step-by-Step Experimental Procedure',
        order: 5,
        isEnabled: true,
        steps: [
          {
            id: 'step-1',
            stepNumber: 1,
            title: 'Set up Containment Environment',
            instruction: 'Place the 500 mL Erlenmeyer flask firmly in the center of the plastic safety containment tray on a level laboratory bench.',
            duration: '2 Mins',
            tip: 'Work on a surface covered with plastic sheeting or easily washable linoleum.'
          },
          {
            id: 'step-2',
            stepNumber: 2,
            title: 'Dispense Hydrogen Peroxide Reagent',
            instruction: 'Carefully measure 100 mL of Hydrogen Peroxide (12% to 30%) with a graduated cylinder and pour it into the flask using a glass funnel.',
            duration: '3 Mins',
            tip: 'Wear safety goggles and nitrile gloves during all pouring operations.'
          },
          {
            id: 'step-3',
            stepNumber: 3,
            title: 'Incorporate Detergent and Color Strips',
            instruction: 'Add 15 mL of liquid dish soap to the flask and gently tilt the flask to create 4 vertical food-coloring stripes down the inner flask walls.',
            duration: '2 Mins',
            tip: 'Swirl gently without agitating into foam prematurely.'
          },
          {
            id: 'step-4',
            stepNumber: 4,
            title: 'Prepare Catalyst Solution',
            instruction: 'In a separate 100 mL beaker, dissolve 5 grams of Potassium Iodide (or dry baker’s yeast) in 30 mL of warm water (approx 40°C).',
            duration: '3 Mins'
          },
          {
            id: 'step-5',
            stepNumber: 5,
            title: 'Initiate Catalytic Eruption',
            instruction: 'Pour the dissolved catalyst solution into the Erlenmeyer flask swiftly in one smooth motion, then immediately step back at least 2 meters.',
            duration: '1 Min',
            tip: 'Observe the rapid steam release and vertical expansion of the striated foam column.'
          }
        ]
      },
      {
        id: 'sec-obs-1',
        type: 'observation',
        title: 'Observation & Experimental Data Recording',
        description: 'Record qualitative observations and thermal temperature gradients throughout the reaction progression.',
        order: 6,
        isEnabled: true,
        columns: [
          { id: 'obs-col-1', key: 'parameter', label: 'Observation Parameter' },
          { id: 'obs-col-2', key: 'initial', label: 'Initial State (t = 0s)' },
          { id: 'obs-col-3', key: 'peak', label: 'Peak Eruption (t = 5-15s)' },
          { id: 'obs-col-4', key: 'final', label: 'Post-Reaction (t = 300s)' }
        ],
        rows: [
          {
            parameter: 'Physical Mixture State',
            initial: 'Clear liquid solution',
            peak: 'Dense expanding foam column',
            final: 'Settling bubbly soap mass'
          },
          {
            parameter: 'Temperature Reading',
            initial: '24.2 °C (Ambient room temp)',
            peak: '72.8 °C (Strongly exothermic)',
            final: '38.4 °C (Gradual ambient cooling)'
          },
          {
            parameter: 'Gas Evolution Indicator',
            initial: 'No visible bubbles',
            peak: 'Violent continuous steam/O₂ release',
            final: 'Trace effervescence'
          },
          {
            parameter: 'Glowing Splint Test',
            initial: 'Splint extinguishes',
            peak: 'Glowing splint violently relights (O₂ confirmed)',
            final: 'Weak rekindling'
          }
        ],
        inference: 'The rapid volumetric expansion and elevated temperature definitively verify an exothermic catalytic decomposition yielding oxygen gas as the dominant gaseous product.'
      },
      {
        id: 'sec-vid-1',
        type: 'video',
        title: 'High-Definition Demonstration Video',
        order: 7,
        isEnabled: true,
        videoUrl: 'https://www.youtube.com/watch?v=28rAN41mCDk',
        caption: 'Laboratory demonstration of catalytic hydrogen peroxide decomposition with thermal imaging camera view.',
        provider: 'youtube'
      },
      {
        id: 'sec-gal-1',
        type: 'gallery',
        title: 'Apparatus & Reaction Visual Gallery',
        order: 8,
        isEnabled: true,
        displayMode: 'slider',
        images: [
          {
            id: 'img-1',
            url: '/images/categories/chemistry.jpg',
            title: 'Borosilicate Glass Setup',
            caption: 'Safety containment basin and Erlenmeyer flask before adding catalyst.'
          },
          {
            id: 'img-2',
            url: '/images/categories/physics.jpg',
            title: 'Thermal Camera Heat Map',
            caption: 'Infrared visualization capturing rapid thermal release up to 73°C.'
          },
          {
            id: 'img-3',
            url: '/images/categories/biology.jpg',
            title: 'Microscopic Foam Matrix',
            caption: 'Optical microscopic view of microscopic oxygen micro-bubbles trapped in surfactant.'
          }
        ]
      },
      {
        id: 'sec-cust-1',
        type: 'custom',
        title: 'Viva Voce & Real-World Industrial Applications',
        order: 9,
        isEnabled: true,
        icon: 'Sparkles',
        content: `### Real-World Industrial Connections
- **Rocket Propulsion:** Hydrazine and monopropellant rocket thrusters use silver and ruthenium catalytic beds to rapidly decompose liquid peroxides into high-pressure reaction exhaust.
- **Biochemical Defense:** Biological catalase enzyme in human liver cells decomposes cellular metabolic peroxide at rates exceeding 40,000,000 molecules per second to prevent oxidative damage.
- **Bleaching and Sanitization:** Eco-friendly pulp and paper bleaching uses catalyzed peroxides as chlorine-free oxidizers.`
      }
    ]
  },
  {
    id: 'phys-1',
    title: 'Precision Simple Harmonic Pendulum Oscillation',
    subtitle: 'Determine Local Gravitational Acceleration g using Isochronous Oscillation',
    subjectSlug: 'physics',
    subjectName: 'Physics',
    category: 'Classical Mechanics & Gravitation',
    gradeLevel: 'Secondary (9-10)',
    difficulty: 'Intermediate',
    duration: '45 Mins',
    safetyLevel: 'Safe for Home',
    status: 'published',
    tags: ['Harmonic Motion', 'Gravity', 'Kinematics', 'NEP 2020'],
    badge: 'Lab Benchmark',
    heroImage: '/images/categories/physics.jpg',
    colorTheme: 'from-blue-600 to-indigo-700',
    author: 'CSEEL Physics Research Group',
    createdAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    sections: [
      {
        id: 'phys-mat-1',
        type: 'materials',
        title: 'Apparatus & Instruments Table',
        description: 'High-precision measurement instruments for harmonic motion timing.',
        order: 1,
        isEnabled: true,
        columns: [
          { id: 'c1', key: 'name', label: 'Instrument / Item', type: 'text' },
          { id: 'c2', key: 'image', label: 'Item Image / Icon', type: 'image' },
          { id: 'c3', key: 'buyLink', label: 'Procurement Link', type: 'link' },
          { id: 'c4', key: 'quantity', label: 'Quantity', type: 'text' },
          { id: 'c5', key: 'spec', label: 'Precision / Range', type: 'text' }
        ],
        rows: [
          {
            id: 'pr-1',
            name: 'Brass Spherical Bob',
            image: '/images/categories/physics.jpg',
            buyLink: 'https://material.cseel.org/products/pendulum-bob-brass',
            quantity: '1 Unit',
            spec: 'Diameter 2.5 cm, Mass 50g with hook'
          },
          {
            id: 'pr-2',
            name: 'Inextensible Fine Thread',
            image: '',
            buyLink: '',
            quantity: '1.5 Meters',
            spec: 'Braided nylon zero-stretch filament'
          },
          {
            id: 'pr-3',
            name: 'Rigid Cast-Iron Retort Stand',
            image: '',
            buyLink: 'https://material.cseel.org/products/retort-stand-heavy',
            quantity: '1 Stand',
            spec: 'Heavy tripod base with cork clamp'
          },
          {
            id: 'pr-4',
            name: 'Digital Photogate / Stopwatch',
            image: '',
            buyLink: '',
            quantity: '1 Timer',
            spec: 'Resolution ±0.01 sec'
          },
          {
            id: 'pr-5',
            name: 'Steel Metric Rule & Vernier Calipers',
            image: '',
            buyLink: '',
            quantity: '1 Set',
            spec: '100 cm scale (±0.5 mm) & Vernier (±0.02 mm)'
          }
        ]
      },
      {
        id: 'phys-prec-1',
        type: 'precautions',
        title: 'Experimental Precautions & Systematic Error Control',
        order: 2,
        isEnabled: true,
        safetyLevel: 'Safe for Home',
        ppeRequired: ['None required (Safe for all environments)'],
        warnings: [
          {
            id: 'pw-1',
            type: 'caution',
            title: 'Small Amplitude Angle Approximation',
            text: 'Displace the bob by less than 5 degrees (approx 4 cm displacement). Angles above 10 degrees introduce anharmonic restoring forces that invalidate T = 2π√(L/g).'
          },
          {
            id: 'pw-2',
            type: 'info',
            title: 'Eliminate Elliptical Orbiting',
            text: 'Release the bob strictly from rest without imparting lateral velocity to ensure pure single-plane planar oscillation.'
          }
        ]
      },
      {
        id: 'phys-math-1',
        type: 'math_formula',
        title: 'Theoretical Formulations & Error Formula',
        description: 'Mathematical derivation of gravitational constant calculation.',
        order: 3,
        isEnabled: true,
        formulas: [
          {
            id: 'pf-1',
            label: 'Time Period of Simple Pendulum',
            latex: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
            explanation: 'Where L is the effective length from suspension pivot to center of mass of the spherical bob.'
          },
          {
            id: 'pf-2',
            label: 'Gravitational Acceleration Formula',
            latex: 'g = 4\\pi^2 \\cdot \\frac{L}{T^2}',
            explanation: 'Slope of L versus T^2 linear regression line equals g / (4π^2).'
          },
          {
            id: 'pf-3',
            label: 'Fractional Experimental Error',
            latex: '\\frac{\\Delta g}{g} = \\frac{\\Delta L}{L} + 2\\frac{\\Delta T}{T}',
            explanation: 'Propagation of uncertainty through logarithmic differentiation.'
          }
        ]
      },
      {
        id: 'phys-obs-1',
        type: 'observation',
        title: 'Harmonic Oscillation Timing Records',
        description: 'Recorded across varying pendulum effective lengths L (20 oscillations per trial).',
        order: 4,
        isEnabled: true,
        columns: [
          { id: 'oc-1', key: 'length', label: 'Length L (cm)' },
          { id: 'oc-2', key: 't20', label: 'Time for 20 Osc (s)' },
          { id: 'oc-3', key: 'period', label: 'Period T (s)' },
          { id: 'oc-4', key: 'tsq', label: 'T² (s²)' },
          { id: 'oc-5', key: 'calcG', label: 'Calculated g (m/s²)' }
        ],
        rows: [
          { length: '50.0', t20: '28.32', period: '1.416', tsq: '2.005', calcG: '9.84' },
          { length: '70.0', t20: '33.56', period: '1.678', tsq: '2.816', calcG: '9.81' },
          { length: '90.0', t20: '38.04', period: '1.902', tsq: '3.618', calcG: '9.82' },
          { length: '110.0', t20: '42.06', period: '2.103', tsq: '4.423', calcG: '9.81' }
        ],
        inference: 'Mean local gravitational constant g = 9.82 ± 0.03 m/s², agreeing within 0.3% of the standard terrestrial gravitational constant.'
      },
      {
        id: 'phys-gal-1',
        type: 'gallery',
        title: 'Apparatus Setup & Graph Visualizations',
        order: 5,
        isEnabled: true,
        displayMode: 'grid',
        images: [
          {
            id: 'pimg-1',
            url: '/images/categories/physics.jpg',
            title: 'Rigid Retort Pivot Stand',
            caption: 'Double-split cork ensuring frictionless single-point suspension.'
          },
          {
            id: 'pimg-2',
            url: '/images/categories/mathematics.jpg',
            title: 'L vs T² Linear Fit',
            caption: 'Regression slope verifying linear proportionality with R² = 0.9998.'
          }
        ]
      }
    ]
  }
];

// Helper to get initial experiments with fallback
export function getSeedExperiments(): ExperimentItem[] {
  return [...INITIAL_EXPERIMENTS];
}
