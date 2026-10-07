export interface SopEquipmentItem {
  name: string;
  qty: string;
  category: 'Physics' | 'Chemistry' | 'Biology' | 'General';
  spec?: string;
  image?: string;
  alt?: string;
}

export interface SopChemicalItem {
  name: string;
  qty: string;
  formula?: string;
  application?: string;
  image?: string;
  alt?: string;
}

export interface SopSpecimenItem {
  name: string;
  qty: string;
  type?: string;
  observation?: string;
  image?: string;
  alt?: string;
}

export interface CompositeSubPageData {
  slug: string;
  searchQuery: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  tagline: string;
  summary: string;
  image?: string;
  coreHighlights: string[];
  keySpecs: { label: string; value: string; note: string }[];
  faqs: { q: string; a: string }[];
}

export const CBSE_SOP_GENERAL_REQUIREMENTS = [
  { item: 'Minimum Lab Room Size', spec: '600 Sq. Ft.', rule: 'Mandatory minimum carpet area under CBSE Affiliation Bye-Laws' },
  { item: 'Student Capacity', spec: '40 Lab Stools', rule: 'Must accommodate 40 students per practical batch' },
  { item: 'Sinks with Running Water', spec: '8 Sinks', rule: 'Evenly distributed across student workbenches' },
  { item: 'Emergency Exits', spec: '2 Wide Doors', rule: 'Two unobstructed exit doors for fire & accident evacuation' },
  { item: 'Demonstration Table', spec: '1 Master Table with Sink & Tap', rule: 'Equipped with water, gas burner & electrical points for teacher' },
  { item: 'Teaching Facility', spec: 'Intelligent Board / Interactive Display', rule: 'Interactive flat panel with internet or white/green board' },
  { item: 'Computing Infrastructure', spec: '2 Laptop / Desktop Sets', rule: 'For digital simulations, research & data logging' },
  { item: 'Ventilation & Air Exhaust', spec: '2 Exhaust Fans', rule: 'Cross-ventilation required for chemical fume evacuation' },
  { item: 'Gas & Heating Provision', spec: 'Gas Pipeline + 1 Electric Heater', rule: 'Pipeline connected to Bunsen burners + 1 backup electric heater' },
  { item: 'Fire & Medical Safety', spec: 'Fire Extinguishers + 2 First Aid Kits', rule: 'Prominently displayed near doors and inside laboratory' },
  { item: 'Waste Segregation', spec: '2 Separate Bins', rule: 'Biodegradable and non-biodegradable chemical disposal bins' },
  { item: 'Chemical Storage', spec: 'Separate Cupboard with Lock & Key', rule: 'Vermin-free, dust-free locked storage for flammable chemicals' },
];

export const CBSE_SOP_NON_CONSUMABLES: SopEquipmentItem[] = [
  { name: 'Assembled Compound Microscope', qty: '10 Units', category: 'Biology', spec: 'Triple nosepiece, 10x/40x objectives, plan-concave mirror', image: '/images/categories/biology.jpg', alt: 'Assembled Compound Microscope 1000x - CBSE Composite Science Lab Apparatus' },
  { name: 'Test Tubes', qty: '10 Units', category: 'Chemistry', spec: '15x125mm, Borosilicate 3.3 heat-resistant glass with rim', image: '/images/categories/chemistry.jpg', alt: 'Test Tubes Borosilicate 3.3 Laboratory Grade - CBSE Chemistry Lab Apparatus' },
  { name: 'Boiling Tubes', qty: '20 Units', category: 'Chemistry', spec: '25x150mm heavy wall thermal shock proof glass', image: '/images/categories/chemistry-card-1.jpg', alt: 'Boiling Tubes Borosilicate Heavy Wall - CBSE Chemistry Lab Equipment' },
  { name: 'Beakers (100ml)', qty: '10 Units', category: 'Chemistry', spec: '100ml graduated with spout, ISO 3819 standard', image: '/images/features/hands-on-science-laboratory-beakers.avif', alt: '100ml Graduated Glass Beakers - CBSE Science Laboratory Glassware' },
  { name: 'Beakers (500ml)', qty: '5 Units', category: 'Chemistry', spec: '500ml double metric scale, high chemical durability', image: '/images/features/hands-on-science-laboratory-beakers.avif', alt: '500ml Metric Graduated Beakers - CBSE Science Laboratory Glassware' },
  { name: 'Conical Flasks', qty: '5 Units', category: 'Chemistry', spec: '250ml Erlenmeyer narrow neck with white enamel markings', image: '/images/categories/chemistry-card-2.png', alt: 'Conical Erlenmeyer Flasks 250ml - CBSE Chemistry Titration Equipment' },
  { name: 'Tripod Stands', qty: '10 Units', category: 'General', spec: 'Triangular cast iron top 150mm, zinc plated mild steel legs', image: '/images/hero/stem-robotics-and-electronics-breadboard.webp', alt: 'Triangular Cast Iron Tripod Stand - CBSE Laboratory Heating Apparatus' },
  { name: 'Wire Gauze with Asbestos Center', qty: '10 Units', category: 'General', spec: '150x150mm ceramic/asbestos center wire mesh for flame dispersion', image: '/images/categories/engineering.jpg', alt: 'Wire Gauze with Ceramic Center - CBSE Science Heating Equipment' },
  { name: 'Filter Paper Boxes', qty: '10 Boxes', category: 'Chemistry', spec: 'Whatman No. 1 equivalent 11cm qualitative circular discs', image: '/images/categories/chemistry.jpg', alt: 'Qualitative Filter Paper Discs - CBSE Chemistry Lab Separation Supplies' },
  { name: 'Wooden Assembling Storage Boxes', qty: '5 Units', category: 'General', spec: 'Polished teak wood partitioned storage box for optics & glassware', image: '/images/categories/art.jpg', alt: 'Polished Wooden Storage Box for Laboratory Apparatus - CBSE Equipment' },
  { name: 'Small Funnels (Glass & Plastic)', qty: '10 Glass + 10 Plastic', category: 'Chemistry', spec: '60-degree angle, 50mm diameter stem for filtration', image: '/images/categories/chemistry.jpg', alt: 'Glass and Polypropylene Filtration Funnels - CBSE Chemistry Lab Equipment' },
  { name: 'Big Funnels (Glass & Plastic)', qty: '5 Glass + 5 Plastic', category: 'Chemistry', spec: '75mm diameter wide stem for bulk liquid transfer', image: '/images/categories/chemistry.jpg', alt: 'Large Laboratory Funnels Glass and Plastic - CBSE Science Apparatus' },
  { name: 'Spatulas (Stainless Steel)', qty: '20 Units', category: 'Chemistry', spec: 'SS 304 grade 150mm one spoon end and one flat end', image: '/images/categories/engineering.jpg', alt: 'Stainless Steel Double Ended Laboratory Spatulas - CBSE Reagent Handling' },
  { name: 'Round Bottom Flasks (Small)', qty: '5 Units', category: 'Chemistry', spec: '150ml borosilicate round base for distillation setups', image: '/images/categories/chemistry-hero.png', alt: 'Round Bottom Distillation Flasks - CBSE Chemistry Lab Glassware' },
  { name: 'Laboratory Thermometers (-10°C to 110°C)', qty: '10 Units', category: 'Physics', spec: 'Red spirit/mercury filled, 1°C graduations, 300mm length', image: '/images/categories/physics.jpg', alt: 'Laboratory Glass Thermometer (-10C to 110C) - CBSE Physics Lab Equipment' },
  { name: 'Glass Stirring Rods', qty: '10 Units', category: 'Chemistry', spec: '200mm × 6mm polished rounded ends borosilicate glass', image: '/images/categories/chemistry.jpg', alt: 'Borosilicate Glass Stirring Rods - CBSE Chemistry Laboratory Apparatus' },
  { name: 'Droppers (Big & Small)', qty: '10 Big + 10 Small', category: 'Chemistry', spec: 'Borosilicate pipette stem with high-elasticity rubber teat', image: '/images/categories/chemistry.jpg', alt: 'Graduated Glass Droppers with Rubber Teats - CBSE Lab Reagent Pipettes' },
  { name: 'Deflagrating Spoons', qty: '5 Units', category: 'Chemistry', spec: 'Brass cup with stainless steel rod and vapor cork stopper disc', image: '/images/categories/engineering.jpg', alt: 'Deflagrating Combustion Spoon for Gas Jars - CBSE Chemistry Lab Equipment' },
  { name: 'Plane Mirrors with Stands', qty: '10 Mirrors + 10 Pairs Stands', category: 'Physics', spec: '100x75mm optical float glass silvered with wooden support stands', image: '/images/hero/physics-optics.jpg', alt: 'Plane Float Glass Mirror with Wooden Vertical Stands - CBSE Optics Lab' },
  { name: 'Test Tube Holders', qty: '10 Units', category: 'Chemistry', spec: 'Chrome plated spring brass wire clamp with wooden grip handle', image: '/images/categories/chemistry.jpg', alt: 'Wooden Handle Test Tube Clamp Holder - CBSE Heating Safety Apparatus' },
  { name: 'Dissection / Lab Scissors', qty: '4 Units', category: 'Biology', spec: 'Stainless steel 125mm sharp/blunt surgical points for botany practicals', image: '/images/categories/biology.jpg', alt: 'Stainless Steel Dissection Scissors - CBSE Biology Practical Equipment' },
  { name: 'Science Display Wall Charts', qty: '15 Charts', category: 'General', spec: 'Laminated 75x100cm periodic table, human anatomy & ray optics', image: '/images/hero/school-science-exhibition-tinkering-lab.webp', alt: 'Laminated Educational Wall Charts - CBSE Science Lab Visual Aids' },
  { name: 'Portraits of Eminent Scientists', qty: '20 Portraits', category: 'General', spec: 'Framed portraits of Newton, Raman, Curie, Einstein, Bose, APJ Abdul Kalam', image: '/images/hero/school-science-exhibition-tinkering-lab.webp', alt: 'Framed Scientist Portraits - CBSE Composite Science Laboratory Decor' },
  { name: 'Concave Mirrors (Focal length 15cm/20cm)', qty: '10 Units', category: 'Physics', spec: '50mm diameter optical glass with protective lacquer coating', image: '/images/hero/physics-optics.jpg', alt: 'Spherical Concave Mirror 50mm Optical Glass - CBSE Physics Optics Lab' },
  { name: 'Concave Lenses', qty: '10 Units', category: 'Physics', spec: '50mm optical crown glass, bi-concave with true focal mark', image: '/images/hero/physics-optics.jpg', alt: 'Bi-Concave Optical Glass Lens - CBSE Ray Optics Experiment Kit' },
  { name: 'Convex Mirrors', qty: '10 Units', category: 'Physics', spec: '50mm diameter spherical divergent mirror for focal length verification', image: '/images/hero/physics-optics.jpg', alt: 'Spherical Convex Optical Mirror - CBSE Secondary Physics Practical' },
  { name: 'Convex Lenses', qty: '10 Units', category: 'Physics', spec: '50mm bi-convex converging lens (focal length 10cm, 15cm, 20cm)', image: '/images/hero/physics-optics.jpg', alt: 'Bi-Convex Converging Optical Lens - CBSE Physics Ray Optics Equipment' },
  { name: 'Separating Funnels', qty: '10 Units', category: 'Chemistry', spec: '125ml pear-shaped with PTFE stopcock for immiscible liquids', image: '/images/categories/chemistry-card-2.png', alt: 'Pear Shaped Separating Funnel with PTFE Stopcock - CBSE Chemistry Lab' },
  { name: 'Porcelain China Dishes', qty: '10 Units', category: 'Chemistry', spec: '75mm glazed porcelain evaporating basin with pouring spout', image: '/images/categories/chemistry.jpg', alt: 'Glazed Porcelain China Dish for Evaporation - CBSE Lab Apparatus' },
  { name: 'Petri Dishes with Lids', qty: '10 Units', category: 'Biology', spec: '90x15mm borosilicate glass culture dishes with loose cover lids', image: '/images/categories/biology.jpg', alt: 'Borosilicate Glass Petri Dishes with Lids - CBSE Biology Culture Lab' },
  { name: 'Dissecting Needles', qty: '10 Units', category: 'Biology', spec: 'Stainless steel pointed straight & curved needles with plastic handles', image: '/images/categories/biology.jpg', alt: 'Dissecting Steel Needles with Handles - CBSE Biology Specimen Lab' },
  { name: 'Spring Balances (0–250 gm)', qty: '4 Units', category: 'Physics', spec: 'Tubular acrylic clear body with zero-adjust hook (0-250g / 2.5N)', image: '/images/categories/physics.jpg', alt: 'Tubular Spring Balance 0-250g - CBSE Mechanics Force Measurement' },
  { name: 'U-Shaped Magnets', qty: '5 Units', category: 'Physics', spec: 'Strong Alnico horseshoe magnet with steel keeper bar', image: '/images/categories/physics.jpg', alt: 'Alnico Horseshoe U-Shaped Magnet - CBSE Physics Magnetic Field Lab' },
  { name: 'Bar Magnets (Alnico)', qty: '10 Units', category: 'Physics', spec: 'Pair in wooden box with keepers, north-pole stamped (75mm)', image: '/images/categories/physics.jpg', alt: 'Pair of Alnico Bar Magnets with Keepers - CBSE Physics Magnetic Field' },
  { name: 'Iron Filings Boxes', qty: '4 Boxes', category: 'Physics', spec: 'Degreased fine iron filings in sprinkler dispenser containers', image: '/images/categories/physics.jpg', alt: 'Iron Filings Magnetic Field Visualisation Dispenser - CBSE Physics' },
  { name: 'Retort Iron Stands with Clamps', qty: '4 Units', category: 'General', spec: 'Heavy cast iron base 200x125mm with 600mm nickel-plated steel rod', image: '/images/hero/stem-robotics-and-electronics-breadboard.webp', alt: 'Cast Iron Retort Stand with Bosshead and Clamp - CBSE Lab Support' },
  { name: 'Thumb Pins for Optical Boards', qty: '2 Boxes', category: 'Physics', spec: 'Plastic head rust-free steel pins for securing drawing paper', image: '/images/categories/physics.jpg', alt: 'Optical Board Drawing Thumb Pins - CBSE Optics Experiment Supplies' },
  { name: 'Bunsen Burners with Gas Tubing', qty: 'As per Gas Pipeline Outlets', category: 'Chemistry', spec: 'Heavy brass base with air regulator collar and neoprene gas hose', image: '/images/features/hands-on-science-laboratory-beakers.avif', alt: 'Brass Bunsen Burner with Flame Regulator - CBSE Chemistry Lab Heating' },
  { name: 'Glass Prisms (Equilateral 50x50mm)', qty: '4 Units', category: 'Physics', spec: 'Crown optical glass, polished surfaces for light spectrum dispersion', image: '/images/hero/physics-optics.jpg', alt: 'Equilateral Optical Glass Prism 50x50mm - CBSE Physics Light Refraction' },
  { name: 'Gas Jars with Glass Lids', qty: '4 Units', category: 'Chemistry', spec: '200x50mm heavy thick glass cylinder with ground rim glass cover', image: '/images/categories/chemistry.jpg', alt: 'Gas Collecting Cylinder Jar with Ground Glass Lid - CBSE Chemistry' },
  { name: 'Crucible / Beaker Tongs', qty: '5 Pairs', category: 'Chemistry', spec: 'Nickel plated steel 200mm bowed jaws for hot glassware safety', image: '/images/categories/engineering.jpg', alt: 'Nickel Plated Crucible and Beaker Tongs - CBSE Laboratory Safety Tools' },
  { name: 'Pin Hole Cameras', qty: '4 Units', category: 'Physics', spec: 'Adjustable sliding wooden dual box with translucent ground screen', image: '/images/categories/physics.jpg', alt: 'Wooden Adjustable Pinhole Camera - CBSE Physics Optics Principle' },
  { name: 'Kaleidoscopes', qty: '5 Units', category: 'Physics', spec: 'Triangular mirror optical tube with colorful glass object chamber', image: '/images/categories/physics.jpg', alt: 'Educational Optical Kaleidoscope - CBSE Multiple Reflection Experiment' },
  { name: 'Magnetic Compasses (Plotting)', qty: '5 Units', category: 'Physics', spec: 'Aluminum body 25mm double-pivot magnetized plotting needle', image: '/images/categories/physics.jpg', alt: 'Magnetic Plotting Compass 25mm - CBSE Physics Magnetic Field Tracing' },
  { name: 'Laptop / Desktop Computing Station', qty: '2 Complete Sets', category: 'General', spec: 'Core i5/Ryzen 5 processor, 16GB RAM, SSD, dual HDMI for digital simulations', image: '/images/categories/technology.jpg', alt: 'Digital Computing Station for Science Simulations - CBSE Composite Lab' },
];

export const CBSE_SOP_CONSUMABLES: SopChemicalItem[] = [
  { name: 'Iodine Solution (Starch test)', qty: '200 ml', formula: 'I₂ in KI (Lugol\'s)', application: 'Food nutrient tests, starch detection in photosynthesis', image: '/images/categories/chemistry.jpg', alt: 'Iodine Solution Reagent (Lugols) - CBSE Biology & Chemistry Starch Test' },
  { name: 'Copper Sulphate Crystals', qty: '200 gm', formula: 'CuSO₄·5H₂O', application: 'Water of crystallization, displacement reactions, Biuret test', image: '/images/categories/chemistry-card-1.jpg', alt: 'Copper Sulphate Blue Crystals - CBSE Chemistry Reagent' },
  { name: 'Sodium Hydroxide Pellets (NaOH)', qty: '200 gm', formula: 'NaOH (Lab Grade 97%)', application: 'Base properties, saponification, acid-base neutralisation', image: '/images/categories/chemistry.jpg', alt: 'Sodium Hydroxide Caustic Soda Pellets - CBSE Chemistry Reagent' },
  { name: 'Hydrochloric Acid (Dilute & Concentrated HCl)', qty: '200 ml each', formula: 'HCl (Dilute 1N & Conc. 35%)', application: 'Acid reactivity with metals, carbonates & neutralisation', image: '/images/categories/chemistry-card-2.png', alt: 'Hydrochloric Acid Dilute and Concentrated Bottles - CBSE Chemistry Lab' },
  { name: 'Magnesium Ribbon Coils', qty: '4 Coils', formula: 'Mg (Pure Ribbon)', application: 'Combustion in air, basic oxide formation, exothermic reactions', image: '/images/categories/engineering.jpg', alt: 'Pure Magnesium Ribbon Coils - CBSE Chemistry Combustion Practical' },
  { name: 'Sulphur Powder', qty: '200 gm', formula: 'S₈ (Precipitated)', application: 'Non-metal combustion, iron-sulphur compound synthesis', image: '/images/categories/chemistry.jpg', alt: 'Sublimed Sulphur Powder Yellow - CBSE Chemistry Synthesis Reagent' },
  { name: 'Zinc Granules', qty: '2 Bottles', formula: 'Zn (Pure Granular)', application: 'Hydrogen gas evolution reactions with dilute acids', image: '/images/categories/chemistry.jpg', alt: 'Pure Metallic Zinc Granules - CBSE Chemistry Hydrogen Evolution' },
  { name: 'Sodium Chloride (Pure NaCl)', qty: '2,000 gm', formula: 'NaCl (Analytical Grade)', application: 'Electrolysis, solubility saturation, cooling mixtures', image: '/images/categories/chemistry.jpg', alt: 'Sodium Chloride Laboratory Salt - CBSE Physical Chemistry Practical' },
  { name: 'Litmus Paper Booklets (Red & Blue)', qty: '20 Booklets each', formula: 'Natural Lichen Indicator', application: 'Acid and base pH identification in aqueous solutions', image: '/images/categories/chemistry-card-1.jpg', alt: 'Red and Blue Litmus Indicator Paper Booklets - CBSE Acid Base Tests' },
  { name: 'Methyl Orange Indicator', qty: '2 Bottles', formula: 'C₁₄H₁₄N₃NaO₃S (0.1% sol)', application: 'Acid-base volumetric titration endpoint indicator (Red to Yellow)', image: '/images/categories/chemistry.jpg', alt: 'Methyl Orange pH Indicator Solution - CBSE Volumetric Titrations' },
  { name: 'Phenolphthalein Indicator Solution', qty: '2 Bottles', formula: 'C₂₀H₁₄O₄ (1% in ethanol)', application: 'Colorless to pink endpoint transition in neutralisations', image: '/images/categories/chemistry.jpg', alt: 'Phenolphthalein Indicator Solution - CBSE Chemistry Neutralisation' },
  { name: 'Fresh Lime Water Solution', qty: 'Prepared in lab', formula: 'Ca(OH)₂ (Aqueous)', application: 'Carbon dioxide gas confirmation (milky turbidity test)', image: '/images/features/hands-on-science-laboratory-beakers.avif', alt: 'Fresh Lime Water Calcium Hydroxide - CBSE CO2 Respiration Practical' },
  { name: 'Ethanol / Lab Alcohol', qty: '1,000 ml', formula: 'C₂H₅OH (99% Absolute)', application: 'Chlorophyll decolourisation in leaf starch experiments', image: '/images/categories/chemistry.jpg', alt: 'Laboratory Grade Ethanol Alcohol - CBSE Biology Photosynthesis Prep' },
  { name: 'Glass Microscope Slides Boxes', qty: '10 Boxes', formula: '75x25mm Float Glass (72/box)', application: 'Temporary mounts (onion peel, human cheek cells, stomata)', image: '/images/categories/biology.jpg', alt: 'Ground Edge Glass Microscope Blank Slides - CBSE Biology Mounts' },
  { name: 'Glass Cover Slips Boxes', qty: '10 Boxes', formula: '18x18mm Square No. 1 Glass', application: 'Specimen mounting without air bubbles for microscopic study', image: '/images/categories/biology.jpg', alt: 'Square Glass Cover Slips Boxes - CBSE Biology Microscopic Mounts' },
  { name: 'Hand Wash & Antiseptic Sanitizer', qty: '2 Bottles each', formula: 'Antiseptic chlorhexidine/alcohol', application: 'Hygiene, post-experiment disinfection & chemical clean-up', image: '/images/categories/chemistry.jpg', alt: 'Laboratory Hand Wash & Sanitizer Dispenser - CBSE Hygiene Safety' },
  { name: 'Safety Matchboxes', qty: '3 Boxes', formula: 'Friction strike safety matches', application: 'Lighting Bunsen burners & deflagrating spoons safely', image: '/images/categories/engineering.jpg', alt: 'Laboratory Safety Strike Matchboxes - CBSE Heating Practical Supplies' }
];

export const CBSE_SOP_BIOLOGY_SPECIMENS: SopSpecimenItem[] = [
  { name: 'Insectivorous Plant Specimen', qty: '3 Units', type: 'Preserved Museum Jar', observation: 'Pitcher plant / Utricularia showing leaf modification & digestive trap', image: '/images/categories/biology.jpg', alt: 'Insectivorous Pitcher Plant Specimen in Formalin - CBSE Museum Jar' },
  { name: 'Hydrilla Plant in Preservative', qty: '2 Units', type: 'Preserved Botanical Specimen', observation: 'Submerged aquatic plant morphology for oxygen evolution practicals', image: '/images/categories/biology.jpg', alt: 'Hydrilla Aquatic Plant Specimen - CBSE Biology Photosynthesis Lab' },
  { name: 'Model of Human Dentition', qty: '2 Sets', type: '3D Anatomical Plastic Model', observation: 'Incisors, canines, premolars & molars with root anchorage structure', image: '/images/categories/biology.jpg', alt: 'Human Dentition Teeth Model - CBSE Biology Anatomical Aid' },
  { name: 'Functional Model of Simple Pendulum', qty: '2 Sets', type: 'Mechanical Physics Model', observation: 'Oscillations, length vs time period squared (T²) proportionality', image: '/images/categories/physics.jpg', alt: 'Simple Pendulum Oscillations Apparatus Model - CBSE Physics Lab' },
  { name: 'Complete Life Cycle of Silkmoth', qty: '2 Sets', type: 'Mounted Display Showcase', observation: 'Egg, larva (silkworm), cocoon, pupa and adult male/female moth', image: '/images/categories/biology.jpg', alt: 'Life Cycle of Silkmoth Showcase Mount - CBSE Biology Metamorphosis' },
  { name: 'Root Nodules of Leguminous Plant', qty: '2 Units', type: 'Preserved Botanical Specimen', observation: 'Rhizobium nitrogen-fixing symbiotic nodule morphology', image: '/images/categories/biology.jpg', alt: 'Legume Root Nodules Rhizobium Specimen - CBSE Biology Nitrogen Cycle' },
  { name: 'Bacteria Slide (Bacilli, Cocci, Spirilla)', qty: '2 Each', type: 'Permanent Stained Slide', observation: 'Rod-shaped, spherical and spiral bacterial shapes under 400x', image: '/images/categories/biology.jpg', alt: 'Bacterial Shapes Gram Stained Permanent Slide - CBSE Microbiology' },
  { name: 'Amoeba Proteus Permanent Slide', qty: '2 Slides', type: 'Permanent Mounted Slide', observation: 'Unicellular protozoan with pseudopodia, nucleus and contractile vacuole', image: '/images/categories/biology.jpg', alt: 'Amoeba Proteus Stained Permanent Slide - CBSE Biology Cell Structure' },
  { name: 'Amoeba Binary Fission Permanent Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Asexual reproduction showing karyokinesis and cytokinesis constriction', image: '/images/categories/biology.jpg', alt: 'Amoeba Binary Fission Permanent Slide - CBSE Asexual Reproduction' },
  { name: 'Hydra Budding Permanent Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Adult hydra with lateral bud outgrowth and tentacles formation', image: '/images/categories/biology.jpg', alt: 'Hydra Budding Asexual Reproduction Slide - CBSE Biology Practical' },
  { name: 'Bread Mould (Rhizopus) Slide', qty: '2 Slides', type: 'Permanent Mounted Slide', observation: 'Fungal mycelium, hyphae, sporangiophores and spherical sporangia', image: '/images/categories/biology.jpg', alt: 'Rhizopus Bread Mould Permanent Slide - CBSE Mycology Spore Formation' },
  { name: 'Spirogyra Filament Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Green filamentous alga with characteristic spiral ribbon chloroplasts', image: '/images/categories/biology.jpg', alt: 'Spirogyra Algae Filament Permanent Slide - CBSE Botany Microscopic Mount' },
  { name: 'Budding in Yeast Permanent Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Saccharomyces yeast cells with developing daughter cell buds', image: '/images/categories/biology.jpg', alt: 'Yeast Budding Permanent Microscopic Slide - CBSE Biology Practical' },
  { name: 'Paramecium Caudatum Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Slipper animalcule showing cilia, oral groove and macronucleus', image: '/images/categories/biology.jpg', alt: 'Paramecium Caudatum Permanent Slide - CBSE Ciliated Protozoa Mount' },
  { name: 'Chlamydomonas Permanent Slide', qty: '2 Slides', type: 'Permanent Stained Slide', observation: 'Unicellular biflagellated green alga with cup-shaped chloroplast', image: '/images/categories/biology.jpg', alt: 'Chlamydomonas Alga Permanent Slide - CBSE Biology Unicellular Organisms' }
];

export const COMPOSITE_LAB_SUBPAGES: Record<string, CompositeSubPageData> = {
  'material': {
    slug: 'material',
    searchQuery: 'material for composite lab',
    title: 'Materials, Apparatus & Chemicals for CBSE Composite Science Lab',
    metaTitle: 'Composite Lab Material & Equipment List - CBSE SARAS SOP Mandate | CSEEL',
    metaDescription: 'Complete CBSE SARAS approved equipment, chemicals & apparatus list for Composite Science Lab. 49 non-consumables, 18 chemicals, microscopes, and bio specimens.',
    badge: 'Official CBSE Material Checklist',
    image: '/images/features/hands-on-science-laboratory-beakers.avif',
    tagline: 'Official 49+ Non-Consumable Apparatus, 18 Chemicals & 15 Biological Specimens as per SARAS SOP',
    summary: 'The Central Board of Secondary Education (CBSE) prescribes an exact, mandatory equipment and consumable list for secondary schools seeking fresh affiliation or extension. CSEEL delivers pre-packaged, ISI-certified, audit-ready material sets with zero breakage guarantee.',
    coreHighlights: [
      'Complete pre-audited kit containing all 49 non-consumable items and 18 chemicals as per CBSE SARAS SOP',
      'High-precision optical apparatus: 10 compound microscopes, 10 concave/convex mirrors, glass prisms & lenses',
      'Chemistry glassware & heating: 20 boiling tubes, beakers, conical flasks, separating funnels & Bunsen burners',
      'Freshly prepared lab-grade chemicals in leak-proof, color-coded safety bottles with hazard labels',
      'Permanent biological slide sets & museum-grade specimens (Amoeba, Hydra, Spirogyra, Silkmoth Life Cycle)'
    ],
    keySpecs: [
      { label: 'Non-Consumable SKUs', value: '49 Categories', note: 'Covers Physics, Chemistry & Biology apparatus' },
      { label: 'Chemicals & Consumables', value: '18 Essential Reagents', note: 'Sufficient buffer for 1 full academic year' },
      { label: 'Microscopes Included', value: '10 Compound Microscopes', note: 'Triple revolving nosepiece with 10x & 45x lenses' },
      { label: 'Audit Compliance', value: '100% SARAS Verified', note: 'Pre-tagged with CBSE inspection item codes' }
    ],
    faqs: [
      {
        q: 'Can a school buy local chemicals and glassware for CBSE affiliation?',
        a: 'CBSE inspection committees verify standard specifications, graduated measurements on beakers, and chemical expiry/purity. Unbranded or non-calibrated apparatus can lead to affiliation show-cause notices. CSEEL provides pre-certified laboratory sets that comply directly with CBSE inspection criteria.'
      },
      {
        q: 'How many students does this material kit support?',
        a: 'The CBSE SARAS SOP is strictly designed for a batch of 40 students working concurrently (or in pairs of 20 workstations) under a teacher.'
      },
      {
        q: 'What is the shelf life of the chemical reagents included in the package?',
        a: 'All reagents are dispatched fresh in airtight borosilicate and HDPE bottles with a minimum shelf life of 2 to 3 years.'
      }
    ]
  },

  'vendor': {
    slug: 'vendor',
    searchQuery: 'vendor for composite lab',
    title: 'Certified Vendor & Turnkey Setup Partner for CBSE Composite Science Lab',
    metaTitle: 'Certified Vendor for Composite Lab Setup - GeM Registered Partner | CSEEL',
    metaDescription: 'Trusted turnkey vendor for CBSE Composite Science Lab setup. GeM registered, on-site installation, workbench layout, 8-sink plumbing, and CBSE inspection audit support.',
    badge: 'GeM Registered Turnkey Vendor',
    image: '/images/features/indian-school-students-interactive-classroom.avif',
    tagline: 'End-to-End Execution: Layout Design, 8-Sink Plumbing, Equipment Delivery & Inspection Assurance',
    summary: 'Setting up a CBSE Composite Lab is not just buying boxes of glass — it requires architectural floor planning, 8-sink plumbing lines, gas piping, electrical earth grounding, and furniture installation. CSEEL is India’s leading turnkey execution partner for private and government K-12 institutions.',
    coreHighlights: [
      'Government e-Marketplace (GeM) authorized seller for direct, compliant school procurement',
      '2D & 3D Architectural CAD Layout customized to your school’s 600 sq. ft. room dimensions',
      'On-site installation team: Plumbing, gas pipeline manifold, electrical trunking & workbench assembly',
      'Dedicated CBSE Affiliation Readiness Dossier with equipment stock registers and safety certificates',
      'Fast-track 14-day delivery timeline to meet urgent inspection deadlines'
    ],
    keySpecs: [
      { label: 'Schools Executed', value: '150+ Campuses', note: 'Across CBSE, ICSE and State Boards' },
      { label: 'Execution Mode', value: '100% Turnkey', note: 'From bare hall to fully functional, certified lab' },
      { label: 'On-Site Setup Time', value: '14 to 21 Days', note: 'Fast-track deployment prior to inspection visits' },
      { label: 'Warranty & Support', value: '5-Year Guarantee', note: 'Annual maintenance and equipment replacement' }
    ],
    faqs: [
      {
        q: 'Does CSEEL provide civil and plumbing work for the 8 sinks?',
        a: 'Yes. CSEEL provides turnkey execution including acid-resistant laboratory sinks, anti-clogging drain traps, and master water-supply inlet/outlet manifold piping.'
      },
      {
        q: 'What documentation does CSEEL provide for the CBSE inspection committee?',
        a: 'We provide an Official Equipment Stock Register, Calibration Certificates, ISI Electrical/Gas Compliance NOC, Material Safety Data Sheets (MSDS), and bilingual Do’s & Don’ts safety boards.'
      }
    ]
  },

  'space': {
    slug: 'space',
    searchQuery: 'space for composite lab',
    title: 'Space & Room Size Requirements for CBSE Composite Science Lab (600 Sq. Ft.)',
    metaTitle: 'Space Required for CBSE Composite Lab - 600 Sq Ft Dimensions & Layout | CSEEL',
    metaDescription: 'Know the exact room size, dimensions and layout for CBSE Composite Science Lab. Mandatory 600 sq ft carpet area, 8 sinks, 40 stools, and 2 exit doors blueprint.',
    badge: 'Mandatory 600 Sq. Ft. Norm',
    image: '/images/cbse-composite-science-lab-3d.jpg',
    tagline: 'Floor Dimensions, 8-Sink Distribution, Two Exit Doors & Teacher Demo Table Blueprints',
    summary: 'CBSE Affiliation Bye-Laws mandate a minimum of 600 sq. ft. floor space for the Composite Science Laboratory. Explore the official architectural blueprint, seating layout for 40 students, teacher demonstration bench, and emergency exit norms.',
    coreHighlights: [
      'Minimum Carpet Area: Exactly 600 sq. ft. (e.g., 30 ft x 20 ft or 25 ft x 24 ft) clear usable floor space',
      'Two Unobstructed Exit Doors: Mandatory requirement for fire safety and emergency evacuation',
      '8 Water Sinks Distribution: Evenly mounted along side counters or island workbenches for easy student access',
      'Demonstration Workstation: Master platform with dedicated sink, gas burner, water tap and clear view of all 40 stools',
      'Storage Annex: Dedicated locked cupboard for consumables and flammable reagents separate from student benches'
    ],
    keySpecs: [
      { label: 'Minimum Floor Area', value: '600 Sq. Ft.', note: 'Mandated under CBSE Affiliation SARAS SOP' },
      { label: 'Batch Seating', value: '40 Student Stools', note: 'Circular or square wooden/polymer lab stools' },
      { label: 'Emergency Exits', value: '2 Wide Doors', note: 'Swing outward into the corridor unobstructed' },
      { label: 'Water Points', value: '8 Sinks + 1 Demo Sink', note: 'Equipped with Swan-neck laboratory brass taps' }
    ],
    faqs: [
      {
        q: 'Can a school with a 500 sq. ft. room get CBSE affiliation?',
        a: 'No. The CBSE inspection team strictly measures the physical carpet area. Any room under 600 sq. ft. will be marked as a deficiency in the SARAS inspection report. CSEEL lab architects assist schools in re-configuring adjacent partition walls to achieve the mandatory 600 sq. ft. layout.'
      },
      {
        q: 'Where should the 2 doors be located?',
        a: 'The two doors should ideally be located at opposite ends of the room (front-left and rear-left/right) to allow bidirectional exit during chemical spills or fire emergencies.'
      }
    ]
  },

  'cost': {
    slug: 'cost',
    searchQuery: 'cost of composite lab',
    title: 'CBSE Composite Science Lab Setup Cost & Budget Estimation (2026)',
    metaTitle: 'Composite Science Lab Setup Cost in CBSE Schools - Price & Budget | CSEEL',
    metaDescription: 'Estimated cost to set up a CBSE Composite Science Lab. Budget packages from ₹2.85 Lakhs to ₹6.5 Lakhs including 49 non-consumables, chemicals, furniture, and plumbing.',
    badge: 'Transparent Price Breakdown',
    image: '/images/categories/mathematics.webp',
    tagline: 'Itemized Pricing Tiers for CBSE Affiliation, Upgrade & Turnkey Modernization',
    summary: 'Setting up a compliant Composite Science Lab does not have to be exorbitant. CSEEL offers transparent, itemized packages designed for budget-conscious schools, trust-run institutions, and premium K-12 campuses.',
    coreHighlights: [
      'Starter Affiliation Package: ₹2.85 to ₹3.50 Lakhs (All 49 non-consumable apparatus + 18 chemicals + safety gear)',
      'Turnkey Infrastructure Package: ₹4.50 to ₹6.50 Lakhs (Adds 40 lab stools, 8 workbenches, plumbing & demo table)',
      'Composite Hybrid Super-Lab (Science + STEM): ₹6.50 to ₹9.50 Lakhs (Adds 3D printer, Arduino kits & robotics)',
      'No Hidden Costs: Comprehensive GST-compliant invoices suitable for school audit and grant clearance',
      'Milestone-based payment options for school management societies and charitable trusts'
    ],
    keySpecs: [
      { label: 'Material-Only Package', value: '₹2.85 Lakhs', note: 'All apparatus, chemicals, specimens & glassware' },
      { label: 'Complete Turnkey Lab', value: '₹4.85 Lakhs', note: 'Includes furniture, plumbing, demo desk & setup' },
      { label: 'Hybrid STEM Add-on', value: '₹2.50 Lakhs', note: 'Upgrades room with 3D printer & robotics kits' },
      { label: 'Cost Per Student', value: 'Under ₹35 / mo', note: 'Amortized across 3 academic sessions' }
    ],
    faqs: [
      {
        q: 'What is included in the ₹2.85 Lakhs starter package?',
        a: 'It includes all 49 non-consumable items (10 microscopes, optical lenses, stands, glassware), 18 chemicals, all biological specimens and permanent slides, safety kits, and display charts mandated by CBSE.'
      },
      {
        q: 'Does this cost include on-site installation?',
        a: 'In the turnkey package, on-site installation, plumbing connection for 8 sinks, gas pipe testing, and teacher demonstration are fully included.'
      }
    ]
  },

  'cbse-sop': {
    slug: 'cbse-sop',
    searchQuery: 'cbse sop for composite lab',
    title: 'CBSE Composite Science Lab SOP: Official Guidelines & Inspection Criteria',
    metaTitle: 'CBSE Composite Science Lab SOP - Official Guidelines & PDF Download | CSEEL',
    metaDescription: 'Download the official CBSE SARAS Composite Science Lab SOP PDF. Learn exact affiliation bye-laws, inspection checklists, safety protocols, and waste management.',
    badge: 'Official CBSE Directive',
    image: '/images/categories/physics.webp',
    tagline: 'Complete Clause-by-Clause Inspection Breakdown of the Official CBSE SARAS Document',
    summary: 'The Central Board of Secondary Education published its "Essential Standard Operating Procedure (SOP) Required for Affiliation with CBSE - Composite Science Laboratory" to streamline inspection standards and enforce experiential learning under NEP 2020.',
    coreHighlights: [
      'Direct link to download the original official CBSE SARAS document: CompositeScienceLabSOP.pdf',
      'Clause 4 & 5: Physical infrastructure recommendations (600 sq. ft., intelligent board, 2 laptops, 8 sinks)',
      'Clause 6: Itemized list of non-consumable equipment, chemicals, biological specimens, and permanent slides',
      'Clause 7: Mandatory safety guidelines (two exit doors, fume exhaust, fire extinguishers, first aid kits)',
      'Clause 7 (Work Procedure): 18 mandatory rules for students and teachers to prevent laboratory accidents'
    ],
    keySpecs: [
      { label: 'Issuing Authority', value: 'CBSE Affiliation Division', note: 'Standard Operating Procedure (SOP)' },
      { label: 'Applicability', value: 'Class 6th to 10th', note: 'Secondary and Senior Secondary CBSE Schools' },
      { label: 'NEP Alignment', value: 'Para 4.6 & 7.5', note: 'Experiential science learning pedagogy' },
      { label: 'Document Size', value: '8 Pages PDF', note: 'Available for instant download on CSEEL' }
    ],
    faqs: [
      {
        q: 'Is having a Composite Science Lab compulsory for all secondary schools?',
        a: 'Yes. Under CBSE Affiliation Bye-Laws, every school up to Secondary level (Class 10) must maintain an operational, fully equipped Composite Science Laboratory.'
      },
      {
        q: 'Can Senior Secondary schools (Class 11-12) use the Composite Lab?',
        a: 'Senior Secondary schools offering Science Stream must maintain separate Physics, Chemistry, and Biology laboratories. However, the Composite Lab continues to serve Class 6 to 10 students.'
      }
    ]
  },

  'skill-education': {
    slug: 'skill-education',
    searchQuery: 'composite skill lab vs science lab',
    title: 'Composite Science Lab vs. Composite Skill Lab: NEP 2020 Unified Solution',
    metaTitle: 'Composite Science Lab vs Composite Skill Lab - CBSE NEP 2020 Guide | CSEEL',
    metaDescription: 'Understand the difference between CBSE Composite Science Lab and Composite Skill Lab (Circular Skill-75/2024). How schools can build a hybrid 2-in-1 innovation lab.',
    badge: 'NEP 2020 Innovation Strategy',
    image: '/images/hero/school-science-exhibition-tinkering-lab.webp',
    tagline: 'How to Build an All-in-One 2-in-1 Science & Skill Innovation Hub for Your School',
    summary: 'While CBSE SARAS mandates a Composite Science Lab for general affiliation, recent Circular Skill-75/2024 mandates a Composite Skill Lab for vocational skills (AI, Robotics, Design). Discover how visionary schools combine both into a unified, high-tech campus center.',
    coreHighlights: [
      'Clear differentiation between Affiliation Bye-Law Science Lab vs Circular Skill-75/2024 Skill Lab',
      'How to save 40% floor space and ₹3+ Lakhs capital expenditure with a multi-purpose hybrid layout',
      'Integration of traditional Bunsen burners and microscopes with 3D printers and Arduino robotics kits',
      'Fulfills both CBSE General Science practicals AND CBSE Skill Subject Codes 417 (AI) and 418 (Coding)',
      'High-impact showcase room that impresses visiting parents, inspectors, and school trust dignitaries'
    ],
    keySpecs: [
      { label: 'Curriculum Covered', value: 'Science + AI/Robotics', note: 'Physics, Chem, Bio + Subject 417/418' },
      { label: 'Space Utilization', value: '1 Room (600–800 sq ft)', note: 'Replaces need for 2 separate rooms' },
      { label: 'Cost Savings', value: 'Up to ₹3.5 Lakhs', note: 'Shared workbenches, power lines & displays' },
      { label: 'Future Readiness', value: 'NEP 2020 Ready', note: 'Seamlessly satisfies 2027 CBSE mandate' }
    ],
    faqs: [
      {
        q: 'Can a single room serve as both Composite Science Lab and Skill Lab?',
        a: 'Yes, provided the room meets the minimum 600 sq. ft. area, provides segregated chemical storage away from electronics, and incorporates anti-static modular workbenches.'
      },
      {
        q: 'Will the CBSE inspection committee accept a hybrid lab?',
        a: 'Yes! In fact, CBSE encourages modern integrated facilities that reflect NEP 2020’s experiential learning philosophy, as long as all mandatory science apparatus from the SARAS SOP is physically present and verified.'
      }
    ]
  }
};
