import { slugify } from "@/lib/utils";

export interface MaterialItem {
  id: string;
  slug: string;
  name: string;
  scientific_name: string;
  common_names: string[];
  category: string;
  categoryLabel?: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  stock: number;
  current_stock: number;
  image_url: string;
  gallery?: string[];
  tag?: string;
  description: string;
  specification: string;
  includes: string[];
  safety: string;
  warning: string;
  handling: string;
  storage: string;
  grade?: string;
  purity?: string;
  cas_number?: string;
  relatedExperiments?: { id: string; title: string; subject: string }[];
}

export const ALL_MATERIALS: MaterialItem[] = [
  {
    id: "m1",
    slug: "borosilicate-glass-beaker",
    name: "Borosilicate Glass Beaker (Set of 5)",
    scientific_name: "Graduated Borosilicate 3.3 Glass Beaker Set",
    common_names: ["Glass Beaker", "Lab Beaker", "Graduated Beaker"],
    category: "GLS",
    categoryLabel: "Glassware",
    price: 85,
    original_price: 100,
    rating: 4.8,
    reviews: 142,
    stock: 80,
    current_stock: 80,
    image_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop",
      "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
      "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif"
    ],
    tag: "15% OFF",
    description: "High quality Borosilicate 3.3 laboratory glass beakers engineered with uniform wall thickness and excellent thermal shock resistance. Features double-scale white ceramic graduations and an extra large marking spot for easy sample identification.",
    specification: "Material: Borosilicate Glass 3.3 (ISO 3819 / DIN 12331). Temperature resistance up to 500°C. Autoclavable at 121°C.",
    includes: [
      "1x 50ml Low Form Griffin Beaker",
      "1x 100ml Low Form Griffin Beaker",
      "1x 250ml Low Form Griffin Beaker",
      "1x 500ml Low Form Griffin Beaker",
      "1x 1000ml Low Form Griffin Beaker",
      "1x Protective Foam Packaging Box"
    ],
    safety: "Always inspect glassware for chips, stars, or cracks before applying heat or chemical solutions.",
    warning: "Sudden temperature differences exceeding 100°C may cause thermal stress fractures.",
    handling: "Use heat-resistant tongs or silicone gloves when handling heated glass beakers.",
    storage: "Store on non-slip rubberized shelving in a dedicated glassware lab cabinet.",
    grade: "ISO 3819 Class A Standard",
    purity: "Hydrolytic Class 1",
    relatedExperiments: [
      { id: "e1", title: "Acid-Base Titration", subject: "Chemistry" },
      { id: "e2", title: "Chemical Solution Preparation & Dilution", subject: "Chemistry" }
    ]
  },
  {
    id: "m2",
    slug: "burette-50ml",
    name: "Burette with PTFE Stopcock (50ml)",
    scientific_name: "Class A 50ml Borosilicate Straight Bore Burette with PTFE Key",
    common_names: ["Titration Burette", "Chemical Burette", "Lab Burette 50ml"],
    category: "GLS",
    categoryLabel: "Glassware",
    price: 450,
    original_price: 520,
    rating: 4.7,
    reviews: 98,
    stock: 45,
    current_stock: 45,
    image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop",
      "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg"
    ],
    tag: "13% OFF",
    description: "Precision Class A 50ml volumetric burette with smooth PTFE needle stopcock requiring zero grease. Printed with durable high-contrast blue enamel graduations with Schellbach stripe for effortless meniscus reading.",
    specification: "Capacity: 50ml (Subdivision 0.10ml, Tolerance ±0.05ml). Complies with ISO 385 & ASTM E287 Class A calibration standard.",
    includes: [
      "1x 50ml Class A Borosilicate Glass Burette",
      "1x Chemical-Resistant PTFE Stopcock Assembly",
      "1x Calibration Certificate with Batch Number"
    ],
    safety: "Do not leave strong caustic alkaline solutions (NaOH / KOH) in the burette for prolonged periods to avoid glass etching.",
    warning: "Ensure clamp is padded with cork or rubber sleeve to avoid pinching the glass barrel.",
    handling: "Rinse with distilled water and prime with titrant solution before commencing volumetric analysis.",
    storage: "Store inverted in vertical burette stand with dust cap.",
    grade: "Class A Certified Calibration",
    relatedExperiments: [
      { id: "e1", title: "Acid-Base Titration Simulation", subject: "Chemistry" },
      { id: "e4", title: "Redox Titration of Potassium Permanganate", subject: "Chemistry" }
    ]
  },
  {
    id: "m3",
    slug: "conical-flask-erlenmeyer",
    name: "Conical Flask (Erlenmeyer) 250ml",
    scientific_name: "Narrow Neck Erlenmeyer Flask 250ml Borosilicate 3.3",
    common_names: ["Erlenmeyer Flask", "Conical Flask", "Titration Flask"],
    category: "GLS",
    categoryLabel: "Glassware",
    price: 95,
    original_price: 110,
    rating: 4.9,
    reviews: 210,
    stock: 120,
    current_stock: 120,
    image_url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
      "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg"
    ],
    tag: "14% OFF",
    description: "Indispensable laboratory Erlenmeyer flask designed for swirling liquids, titrations, and microbial broth cultures without splashing. Narrow neck accommodates rubber stoppers and cotton plugs.",
    specification: "Capacity: 250ml. Thermal expansion 3.3x10^-6/K. Heavy duty beaded rim resists mechanical chipping.",
    includes: [
      "1x 250ml Borosilicate Conical Flask",
      "1x Silicone Solid Stopper (#4)"
    ],
    safety: "Do not heat flasks that are tightly sealed with stoppers — always provide a vapor release vent.",
    warning: "Inspect base for scratches before placing on magnetic stirrers.",
    handling: "Use wire gauze with ceramic center when heating over Bunsen flame.",
    storage: "Store dry in lab cabinets with rim facing upwards.",
    grade: "ISO 1773 Standard",
    relatedExperiments: [
      { id: "e1", title: "Acid-Base Titration", subject: "Chemistry" },
      { id: "e5", title: "Microbial Fermentation and Yeast Respiration", subject: "Biology" }
    ]
  },
  {
    id: "m4",
    slug: "digital-weighing-balance",
    name: "Digital Precision Weighing Balance (0.01g / 500g)",
    scientific_name: "High Accuracy Electronic Analytical Laboratory Balance 500g x 0.01g",
    common_names: ["Lab Digital Scale", "Weighing Balance", "Precision Scale"],
    category: "EQP",
    categoryLabel: "Equipment",
    price: 8500,
    original_price: 9500,
    rating: 4.8,
    reviews: 64,
    stock: 9,
    current_stock: 9,
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop"
    ],
    tag: "Only 9 left",
    description: "Professional scientific precision balance with electromagnetic force restoration strain gauge. Features auto-calibration tare function, counting mode, backlit LCD display, and leveling bubble with adjustable vibration dampening feet.",
    specification: "Max Capacity: 500g, Resolution: 0.01g, Repeatability: ±0.01g, Stainless Steel Pan Diameter: 120mm. RS232 PC interface port.",
    includes: [
      "1x Digital Precision Electronic Balance Unit",
      "1x Stainless Steel Weighing Pan",
      "1x Acrylic Draft Shield Enclosure",
      "1x 200g F1 Grade Stainless Steel Calibration Weight",
      "1x 12V DC Adapter & 4x AA Battery Holder"
    ],
    safety: "Always use weighing boats or butter paper when weighing chemical powders directly.",
    warning: "Do not exceed max rated load capacity of 500g to avoid damaging sensitive load cell sensors.",
    handling: "Keep draft shield closed during measurement to eliminate ambient air currents.",
    storage: "Keep in a dust-free, vibration-isolated marble balance table.",
    grade: "NABL Traceable Calibration Standard",
    relatedExperiments: [
      { id: "e6", title: "Law of Conservation of Mass", subject: "Chemistry" },
      { id: "e7", title: "Molar Solution Preparation", subject: "Chemistry" }
    ]
  },
  {
    id: "m5",
    slug: "compound-microscope-1000x",
    name: "Compound Biological Microscope (1000x)",
    scientific_name: "Monocular Student Biological Optical Microscope 40x-1000x with LED",
    common_names: ["Student Microscope", "Biology Microscope", "1000x Lab Microscope"],
    category: "BIO",
    categoryLabel: "Biological",
    price: 3499,
    original_price: 4299,
    rating: 4.9,
    reviews: 312,
    stock: 20,
    current_stock: 20,
    image_url: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    gallery: [
      "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
      "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66be608d71d32863b2bf5487_Students-Desk-Classroom-Laptop-reverse.avif"
    ],
    tag: "Bestseller",
    description: "High-precision compound optical microscope with all-glass achromatic optics providing crisp 40x to 1000x magnification. Includes a curated set of 25 permanent biological specimen slides (plant cells, human blood smear, onion root tip mitosis, bacteria).",
    specification: "Achromatic Objective lenses: 4x, 10x, 40x (Spring), 100x (Oil). Eyepieces: WF10x and WF25x. LED illumination with rechargeable battery backup.",
    includes: [
      "1x High-Resolution Monocular Compound Microscope",
      "25x Pre-Prepared Biological Specimen Glass Slides",
      "50x Blank Glass Slides with 100x Cover Slips",
      "1x Microtome & Specimen Staining Reagent Kit (Methylene Blue & Safranin)",
      "1x Cedarwood Immersion Oil Dropper Bottle",
      "1x Dust Cover & Protective Padded Storage Case"
    ],
    safety: "Handle glass slides and cover slips by the edges to avoid fingerprints and cuts.",
    warning: "Fragile optical glass. Do not expose optical lenses to harsh solvents.",
    handling: "Use coarse adjustment for initial focus on low power only, then switch to fine focus on high magnification.",
    storage: "Always store covered with dust jacket in a dry, fungus-free environment with silica gel pack.",
    grade: "Clinical & Educational Optical Standard",
    relatedExperiments: [
      { id: "b1", title: "Plant & Animal Cell Structure Observation", subject: "Biology" },
      { id: "b2", title: "Mitosis in Onion Root Tip Cells", subject: "Biology" },
      { id: "b3", title: "Human Cheek Cell Smear & Staining", subject: "Biology" }
    ]
  },
  {
    id: "m6",
    slug: "basic-chemistry-kit",
    name: "Basic Chemistry Lab Kit",
    scientific_name: "Comprehensive Chemistry Practical Starter Kit (Class 9-12)",
    common_names: ["School Chemistry Kit", "Chemistry Practical Set", "High School Lab Kit"],
    category: "CHE",
    categoryLabel: "Chemical",
    price: 1299,
    original_price: 1599,
    rating: 4.8,
    reviews: 234,
    stock: 50,
    current_stock: 50,
    image_url: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
    gallery: [
      "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
      "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif"
    ],
    tag: "Bestseller",
    description: "A complete, curriculum-aligned chemistry laboratory set specifically designed for secondary and senior secondary students (Class 9 to 12). Includes premium borosilicate test tubes, beakers, essential chemical test reagents, and protective eye gear for safe hands-on experiments.",
    specification: "Borosilicate 3.3 Glassware, ISO 9001 certified laboratory reagents, Polycarbonate safety goggles with UV400 protection.",
    includes: [
      "20x Borosilicate Test Tubes (15x125mm)",
      "5x Beakers (50ml, 100ml, 250ml, 500ml, 1000ml)",
      "1x Test Tube Stand & Wooden Test Tube Holder",
      "1x Polycarbonate Safety Goggles",
      "1x Chemical Reagents Kit (Litmus, Phenolphthalein, Universal Indicator, Copper Sulfate, Zinc Granules)",
      "1x Detailed 48-Page Experiment Guide & Lab Manual"
    ],
    safety: "Always wear safety goggles and latex gloves when handling chemical reagents. Work in a well-ventilated area.",
    warning: "Contains mild acid and base solutions. Not suitable for children under 10 years without adult supervision.",
    handling: "Use test tube holder when heating. Never point the mouth of a heated test tube towards yourself or others.",
    storage: "Store in a cool, dry place away from direct sunlight. Keep chemical bottles tightly capped.",
    grade: "Laboratory Educational Grade (AR/LR)",
    purity: "98.5% Standard Reagents",
    relatedExperiments: [
      { id: "e1", title: "Acid-Base Titration Simulation", subject: "Chemistry" },
      { id: "e2", title: "Chemical Reactions & Equations", subject: "Chemistry" }
    ]
  },
  {
    id: "m7",
    slug: "physics-mechanics-apparatus-kit",
    name: "Physics Mechanics & Dynamics Kit",
    scientific_name: "Classical Mechanics & Dynamics Experimental Apparatus",
    common_names: ["Mechanics Lab Set", "Newton's Laws Kit", "Physics Practical Kit"],
    category: "PHY",
    categoryLabel: "Physics",
    price: 2199,
    original_price: 2799,
    rating: 4.7,
    reviews: 187,
    stock: 30,
    current_stock: 30,
    image_url: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    gallery: [
      "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"
    ],
    tag: "New",
    description: "Master classical mechanics and dynamics through hands-on experiments. Covers Newton's laws of motion, friction coefficient calculation, simple harmonic motion with pendulums, and mechanical advantage of pulleys and inclined planes.",
    specification: "Anodized aluminum alloy inclined track (80cm) with protractor, precision slotted brass weights (10g-500g), dual spring balances (0.5N and 5N).",
    includes: [
      "1x Adjustable Inclined Plane with Pulley & Angle Scale",
      "1x Simple Pendulum Bob Set with Stand & Clamp",
      "1x Slotted Brass Weights Set (500g total)",
      "2x Tubular Spring Balances (1N, 5N)",
      "1x Low-Friction Dynamic Cart with Ball Bearings",
      "1x Comprehensive Physics Mechanics Guidebook"
    ],
    safety: "Ensure clamp stands are securely fastened to benchtop before suspending heavy weights.",
    warning: "Keep small weight pieces away from young children to prevent choking hazard.",
    handling: "Calibrate spring balances to zero before each reading.",
    storage: "Store weights in designated wooden storage box to prevent corrosion and surface scratching.",
    grade: "Physics Lab Standard Calibration",
    relatedExperiments: [
      { id: "p1", title: "Verification of Newton's Second Law", subject: "Physics" },
      { id: "p2", title: "Simple Pendulum Time Period & Gravity 'g'", subject: "Physics" }
    ]
  },
  {
    id: "m8",
    slug: "laboratory-safety-ppe-kit",
    name: "Complete Laboratory Safety & PPE Kit",
    scientific_name: "OSHA & NABL Compliant Student Laboratory Personal Protective Equipment Set",
    common_names: ["Lab Coat & Goggles", "PPE Kit", "Safety Gear Set"],
    category: "SAF",
    categoryLabel: "Safety",
    price: 699,
    original_price: 899,
    rating: 4.9,
    reviews: 178,
    stock: 95,
    current_stock: 95,
    image_url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=800&auto=format&fit=crop"
    ],
    tag: "Essential",
    description: "Complete personal protective safety gear designed for student and teacher safety in chemistry, biology, and physics laboratories. Protects against chemical splashes, particulate matter, and heat.",
    specification: "100% Cotton 220 GSM Anti-Static Lab Coat with press studs. UV400 Splash Proof Polycarbonate Goggles with indirect ventilation.",
    includes: [
      "1x Heavy Duty 100% Cotton White Lab Coat (Choose Size S/M/L/XL)",
      "1x Indirect-Vented Anti-Fog Chemical Splash Goggles",
      "2x Pairs Chemical-Resistant Nitrile Gloves",
      "1x Acid/Alkali Resistant PVC Apron",
      "1x Emergency Pocket Eyewash Bottle (250ml)",
      "1x Pocket Laboratory Safety Protocol & Hazard Guide"
    ],
    safety: "Wear PPE at all times upon entering active laboratory spaces.",
    warning: "Do not use nitrile gloves for high temperature handling above 100°C.",
    handling: "Wash lab coat separately in lukewarm water.",
    storage: "Hang in ventilated locker away from chemical storage shelves.",
    grade: "EN 166 & OSHA Standard",
    relatedExperiments: [
      { id: "e1", title: "Acid-Base Titration", subject: "Chemistry" },
      { id: "e3", title: "Action of Acids on Metals", subject: "Chemistry" }
    ]
  },
  {
    id: "m9",
    slug: "digital-multimeter-dt830d",
    name: "Digital Multimeter DT-830D with Probes",
    scientific_name: "Compact Digital Multimeter with Transistor & Diode Continuity Test",
    common_names: ["Multimeter", "Voltage Tester", "DMM DT830D"],
    category: "ELC",
    categoryLabel: "Electrical",
    price: 299,
    original_price: 399,
    rating: 4.6,
    reviews: 420,
    stock: 65,
    current_stock: 65,
    image_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop"
    ],
    tag: "25% OFF",
    description: "Compact, versatile electronic multimeter for measuring DC/AC voltage, DC current, resistance, transistor hFE gain, and audible continuity buzzer. Ideal for physics and electronics STEM projects.",
    specification: "DC Voltage: 200mV-1000V, AC Voltage: 200V-750V, DC Current: 200µA-10A, Resistance: 200Ω-2000kΩ. 3.5 Digit 7-Segment LCD Display.",
    includes: [
      "1x Digital Multimeter Unit",
      "1x Pair Heavy-Duty Red/Black Shrouded Test Leads",
      "1x 9V Transistor Battery (Pre-installed)",
      "1x User Instruction Manual"
    ],
    safety: "Never connect multimeter in current (A) mode parallel across a voltage source to avoid blowing the internal 500mA fuse.",
    warning: "High voltage warning when measuring circuits above 36V DC / 25V AC.",
    handling: "Select highest range first when unknown voltage/current is measured.",
    storage: "Turn selector rotary switch to OFF position after use to preserve battery life.",
    grade: "CAT II 600V Certified",
    relatedExperiments: [
      { id: "p4", title: "Ohm's Law Verification & Resistance Calculation", subject: "Physics" },
      { id: "p5", title: "Series & Parallel Resistor Circuit Analysis", subject: "Physics" }
    ]
  }
];

export function getMaterialBySlugOrId(identifier: string): MaterialItem | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  return ALL_MATERIALS.find(
    (m) =>
      m.slug.toLowerCase() === clean ||
      m.id.toLowerCase() === clean ||
      slugify(m.name) === clean ||
      slugify(m.scientific_name) === clean ||
      clean.includes(m.slug.toLowerCase()) ||
      m.slug.toLowerCase().includes(clean)
  );
}
