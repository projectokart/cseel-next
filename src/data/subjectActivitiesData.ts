export interface ExperimentActivity {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  gradeLevel: 'Primary (1-5)' | 'Middle (6-8)' | 'Secondary (9-10)' | 'Senior Sec (11-12)' | 'All Grades';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  safetyLevel: 'Safe for Home' | 'Adult Supervision' | 'Lab Environment Required';
  description: string;
  scientificPrinciple: string;
  materials: string[];
  steps: string[];
  realWorldApplication: string;
  tags: string[];
  badge?: string;
  image?: string;
  colorTheme: string;
}

export interface SubjectMetadata {
  slug: string;
  name: string;
  tagline: string;
  heroGradient: string;
  accentColor: string;
  badgeColor: string;
  iconName: string;
  activeCount: number;
  labType: string;
  description: string;
  popularConcepts: string[];
  simulatorType: 'chemistry_titration' | 'physics_pendulum' | 'biology_dna' | 'math_fractal' | 'art_color' | 'tech_logic' | 'eng_bridge';
  activities: ExperimentActivity[];
}

export const SUBJECTS_DATA: Record<string, SubjectMetadata> = {
  chemistry: {
    slug: 'chemistry',
    name: 'Chemistry Activities',
    tagline: 'Explore Molecular Reactions, Crystal Growth & Chemical Magic',
    heroGradient: 'from-amber-500/20 via-orange-600/15 to-red-600/20',
    accentColor: '#f59e0b',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconName: 'FlaskConical',
    activeCount: 42,
    labType: 'Virtual Molecular & Wet Lab',
    description: 'Immerse in hands-on chemical reactions, exothermic discoveries, pH indicators, crystal syntheses, and atomic models designed in strict compliance with NEP 2020 experiential learning.',
    popularConcepts: ['Acid-Base Neutralization', 'Exothermic Reactions', 'Polymer Synthesis', 'Electrolysis', 'Chemiluminescence'],
    simulatorType: 'chemistry_titration',
    activities: [
      {
        id: 'chem-1',
        title: 'Exothermic Elephant Toothpaste Reaction',
        subtitle: 'Rapid Catalytic Decomposition of Hydrogen Peroxide',
        category: 'Inorganic Chemistry & Catalysis',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Beginner',
        duration: '20 Mins',
        safetyLevel: 'Adult Supervision',
        description: 'Watch a gigantic steaming foam plume erupt as Potassium Iodide catalyzes the decomposition of hydrogen peroxide into water and trapped oxygen bubbles.',
        scientificPrinciple: '2H2O2 (aq) -> 2H2O (l) + O2 (g) + Heat. The catalyst lowers the activation energy, producing rapid oxygen gas trapped by liquid soap.',
        materials: ['30% or 6% Hydrogen Peroxide', 'Potassium Iodide / Yeast solution', 'Liquid Dish Soap', 'Food Coloring', 'Erlenmeyer Flask', 'Safety Tray'],
        steps: [
          'Place the Erlenmeyer flask inside a wide plastic safety tray.',
          'Pour 100ml of Hydrogen Peroxide into the flask.',
          'Add 15ml of dish soap and 5-6 drops of food coloring along the inner wall.',
          'In a separate cup, dissolve 5g of yeast or potassium iodide in warm water.',
          'Pour the catalyst solution into the flask and step back immediately!'
        ],
        realWorldApplication: 'Rocket propellant catalysis, industrial oxygen synthesis, and biological catalase enzymes in blood.',
        tags: ['Kinetics', 'Catalyst', 'Exothermic', 'Gases'],
        badge: 'Top Popular',
        colorTheme: 'from-amber-500 to-orange-600'
      },
      {
        id: 'chem-2',
        title: 'Luminescent Blue Chemiluminescence in the Dark',
        subtitle: 'Synthesize Cold Light with Luminol & Iron Catalyst',
        category: 'Physical Chemistry & Quantum Light',
        gradeLevel: 'Secondary (9-10)',
        difficulty: 'Intermediate',
        duration: '35 Mins',
        safetyLevel: 'Adult Supervision',
        description: 'Create a mystical neon blue glow in complete darkness through the oxidation of luminol, converting chemical bond energy directly into photon emission without heat.',
        scientificPrinciple: 'Luminol is oxidized by alkaline peroxide in the presence of an iron complex to form 3-aminophthalate in an excited triplet state, releasing photons at 424nm wavelength upon relaxation.',
        materials: ['Luminol Powder (0.2g)', 'Sodium Hydroxide solution', 'Potassium Ferricyanide catalyst', 'Hydrogen Peroxide 3%', 'Darkened Room', 'Graduated Cylinder'],
        steps: [
          'Prepare Solution A: Dissolve 0.2g Luminol in 50ml diluted NaOH.',
          'Prepare Solution B: Mix 10ml H2O2 with 100ml water and 0.1g Potassium Ferricyanide.',
          'Turn off room lights so the room is pitch dark.',
          'Simultaneously pour Solution A and Solution B into a spiral glass tube.',
          'Observe the continuous radiant sapphire blue emission of light!'
        ],
        realWorldApplication: 'Forensic bloodstain detection at crime scenes, bioluminescence in fireflies, and quantum diagnostic immunoassays.',
        tags: ['Quantum', 'Light', 'Luminol', 'Photochemistry'],
        badge: 'Forensics',
        colorTheme: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'chem-3',
        title: 'Silicate Crystal Chemical Forest Garden',
        subtitle: 'Osmotic Membrane Growth of Metallic Silicates',
        category: 'Inorganic Chemistry & Geology',
        gradeLevel: 'Primary (1-5)',
        difficulty: 'Beginner',
        duration: '25 Mins (Grows 24 Hrs)',
        safetyLevel: 'Safe for Home',
        description: 'Drop colorful transition metal salts into sodium silicate solution and watch tall, branch-like stalagmites and coral formations bloom within hours.',
        scientificPrinciple: 'Metal salts react with silicate ions to form insoluble semipermeable colloidal membranes. Osmotic pressure draws water in until the membrane bursts upward, growing branches.',
        materials: ['Sodium Silicate (Water Glass) solution', 'Cobalt Chloride (Blue)', 'Copper Sulfate (Cyan)', 'Ferric Chloride (Orange)', 'Glass Beaker'],
        steps: [
          'Fill a clean glass beaker with 1 part Sodium Silicate to 3 parts distilled water.',
          'Stir until crystal clear and let liquid settle for 5 minutes.',
          'Carefully drop crystals of Copper Sulfate, Cobalt Chloride, and Ferric Chloride to the bottom.',
          'Do not stir or shake the beaker; leave it undisturbed on a stable bench.',
          'Watch beautiful crystalline trees rise within minutes to hours!'
        ],
        realWorldApplication: 'Geological formation of hydrothermal sea vents, cement hydration physics, and prebiotic origin of life theories.',
        tags: ['Crystals', 'Osmosis', 'Minerals', 'Membranes'],
        badge: 'Visual Wonder',
        colorTheme: 'from-emerald-500 to-teal-600'
      },
      {
        id: 'chem-4',
        title: 'Electrochemical Lemon Battery & LED Circuit',
        subtitle: 'Harnessing Redox Potentials across Zinc and Copper',
        category: 'Electrochemistry',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Beginner',
        duration: '30 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Transform fresh citrus lemons into a working multi-cell voltaic battery generating sufficient electromotive force to power an LED and digital clock.',
        scientificPrinciple: 'Zn (s) -> Zn2+ + 2e- (Oxidation at anode); 2H+ + 2e- -> H2 (g) (Reduction at copper cathode). Citric acid acts as electrolyte.',
        materials: ['4 Fresh Juicy Lemons', '4 Zinc Galvanized Nails', '4 Pure Copper Plates / Coins', '5 Alligator Clip Wires', 'Low-voltage Red LED'],
        steps: [
          'Roll each lemon gently on the table to release internal acidic juice.',
          'Insert one Zinc nail and one Copper strip into each lemon without letting them touch.',
          'Connect the Copper of Lemon 1 to the Zinc of Lemon 2 using an alligator wire (series connection).',
          'Repeat across all 4 lemons to produce approximately 3.6 Volts.',
          'Connect the free Copper lead to the LED anode and Zinc lead to cathode to light the LED!'
        ],
        realWorldApplication: 'Lithium-ion vehicle batteries, fuel cell energy storage, and biomedical bio-galvanic pacemakers.',
        tags: ['Electricity', 'Redox', 'Battery', 'Green Energy'],
        badge: 'Clean Energy',
        colorTheme: 'from-lime-500 to-emerald-600'
      },
      {
        id: 'chem-5',
        title: 'Spectroscopic Flame Emission of Metal Ions',
        subtitle: 'Atomic Orbital Transitions & Characteristic Wavelengths',
        category: 'Atomic Structure & Spectroscopy',
        gradeLevel: 'Senior Sec (11-12)',
        difficulty: 'Advanced',
        duration: '45 Mins',
        safetyLevel: 'Lab Environment Required',
        description: 'Introduce metal salts into a clean flame to produce distinctive atomic emission spectrum colors: crimson strontium, lilac potassium, emerald copper, and brilliant golden sodium.',
        scientificPrinciple: 'Heat excites valence electrons into higher energy orbitals. When electrons transition back to ground state, they release photons of discrete wavelength: E = hc / lambda.',
        materials: ['Bunsen Burner or Alcohol Lamp', 'Nichrome Wire Loop', 'Concentrated HCl (cleaning)', 'Lithium Chloride, Sodium Chloride, Potassium Chloride, Copper Sulfate salts'],
        steps: [
          'Clean the nichrome wire loop by dipping in HCl and heating in flame until no color appears.',
          'Dip the damp loop into Strontium/Lithium salt and place into the outer flame cone.',
          'Observe the intense deep crimson flame signature.',
          'Repeat for Copper (Emerald Green), Potassium (Lilac Violet), and Barium (Apple Green).',
          'Record the wavelengths using a handheld prism spectroscope.'
        ],
        realWorldApplication: 'Stellar astrophysics (analyzing star composition), fireworks pyrotechnics, and environmental flame photometry.',
        tags: ['Spectroscopy', 'Quantum', 'Atoms', 'Fireworks'],
        badge: 'Class 11-12 Lab',
        colorTheme: 'from-purple-500 to-pink-600'
      },
      {
        id: 'chem-6',
        title: 'Non-Newtonian Oobleck & Polymer Crosslinking',
        subtitle: 'Shear-Thickening Fluid Dynamics and Viscoelasticity',
        category: 'Polymer Chemistry & Fluid Dynamics',
        gradeLevel: 'Primary (1-5)',
        difficulty: 'Beginner',
        duration: '15 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Create a mind-bending substance that flows like liquid honey when handled gently, but instantly turns rock-solid when punched or squeezed!',
        scientificPrinciple: 'Cornstarch granules form colloidal suspensions. Under sudden shear stress, water is squeezed out between granules, causing friction lock and momentary solid behavior.',
        materials: ['2 Cups Cornstarch', '1 Cup Warm Water', 'Food Coloring', 'Mixing Bowl', 'Speaker with Plastic Wrap (Optional vibration test)'],
        steps: [
          'Place cornstarch in a wide mixing bowl.',
          'Slowly add warm water while stirring with fingers.',
          'Adjust ratio until fluid feels silky smooth when moved slowly, but rock-hard when tapped rapidly.',
          'Grab a handful and roll into a solid ball in your palm.',
          'Stop rolling and watch it melt through your fingers back into a puddle!'
        ],
        realWorldApplication: 'Liquid body armor for military defense, smart speed-breakers, and damper shock absorbers in sports gear.',
        tags: ['Polymers', 'Viscosity', 'Non-Newtonian', 'Fun Science'],
        badge: 'Family Favorite',
        colorTheme: 'from-amber-400 to-yellow-600'
      },
      {
        id: 'chem-7',
        title: 'Deep Crimson Singlet Oxygen Chemiluminescence',
        subtitle: 'Dimol Photon Emission of Electronically Excited Molecular Oxygen from Alkaline Hypochlorite–Peroxide Decomposition',
        category: 'Photochemistry & Quantum Energetics',
        gradeLevel: 'Senior Sec (11-12)',
        difficulty: 'Advanced',
        duration: '45 Mins',
        safetyLevel: 'Lab Environment Required',
        description: 'Observe an intense ruby-red glow in pitch darkness produced by the simultaneous double electronic de-excitation of paired singlet oxygen molecules (¹Δg) releasing 634 nm photons during the rapid oxidation of hydrogen peroxide by sodium hypochlorite.',
        scientificPrinciple: 'NaOCl (aq) + H2O2 (aq) -> NaCl (aq) + H2O (l) + O2(¹Δg). Two excited singlet delta oxygen molecules collide, undergoing a cooperative dimol transition 2O2(¹Δg) -> 2O2(³Σg⁻) + hν that emits visible crimson light at λ = 634 nm and 703 nm.',
        materials: [
          'Sodium Hypochlorite (NaOCl 10-12% or fresh 6% Bleach)',
          'Hydrogen Peroxide (H2O2 30% Analytical Grade)',
          'Sodium Hydroxide (NaOH 2M Alkaline Buffer)',
          '500 mL Borosilicate Round-Bottom Reaction Flask',
          'Pressure-Equalizing Dropping Funnel (100 mL)',
          'Ice-Water Cooling Bath Basin (0°C)',
          'Ring Stand with Utility Clamp',
          'Darkroom / Light-Tight Blackout Chamber'
        ],
        steps: [
          'Pre-chill all reagents and the 500 mL round-bottom flask in an ice-water bath at 0–4°C to minimize solvent vibrational quenching.',
          'Under an active chemical fume hood, add 50 mL of chilled 30% H2O2 and 20 mL of 2M NaOH into the round-bottom flask.',
          'Secure a 100 mL dropping funnel containing 100 mL of cold NaOCl solution to the neck of the flask.',
          'Extinguish all ambient laboratory lights until the room is in complete pitch darkness (allow 5 minutes for dark eye adaptation).',
          'Open the stopcock to rapidly dispense NaOCl dropwise into the alkaline peroxide with gentle swirling.',
          'Observe the dramatic eruption of radiant crimson/ruby-red chemiluminescence cascading through the boiling effervescence and vapor mist!'
        ],
        realWorldApplication: 'Photodynamic Therapy (PDT) in targeted cancer oncology, Chemical Oxygen-Iodine Laser (COIL) military weapons systems, and fundamental quantum selection rules for spin-forbidden electronic transitions.',
        tags: ['Singlet Oxygen', 'Chemiluminescence', 'Dimol Emission', 'Quantum Light', 'Photodynamic Therapy', 'NEP 2020'],
        badge: 'Quantum Wonder',
        image: '/images/experiments/red-chemiluminescence.jpg',
        colorTheme: 'from-rose-600 via-red-700 to-slate-950'
      },
      {
        id: 'chem-8',
        title: 'Microscale Thermite Reaction',
        subtitle: 'Controlled Redox Reduction of Iron(III) Oxide with Aluminium Under Borosilicate Containment',
        category: 'Inorganic Chemistry & Metallurgy',
        gradeLevel: 'Secondary (9-10)',
        difficulty: 'Advanced',
        duration: '35 Mins',
        safetyLevel: 'Lab Environment Required',
        description: 'Observe a dazzling microscale thermite reaction under an inverted borosilicate beaker, demonstrating the electrochemical reactivity series, solid-to-liquid kinetic acceleration, and the reduction of iron(III) oxide to elemental molten iron.',
        scientificPrinciple: 'Fe2O3 (s) + 2Al (s) -> Al2O3 (s) + 2Fe (l) + Heat (Delta H = -851.5 kJ/mol). The low bulk powder density allows rapid heating past aluminium\'s melting point (660°C), converting the system into an ultra-fast liquid-solid reaction sustained by internal oxidant to reach over 2000°C.',
        materials: [
          'Aluminium Powder (0.25 g)',
          'Iron(III) Oxide Powder (0.75 g)',
          'Magnesium Powder (0.05 g)',
          'Barium Nitrate(V) (0.45 g)',
          'Magnesium Ribbon Fuse (6 cm feathered)',
          '1 L Borosilicate Glass Beaker',
          'Small Wide-Base Metal Tin & Sand Bed (3 cm depth)',
          'Passive Welding Filter (Shade 9)'
        ],
        steps: [
          'Prepare the setup: stand a trimmed filter-paper cone in 3 cm dry sand inside a wide-base tin seated on a heat-resistant mat.',
          'Add 1.0 g thermite mix (0.25 g Al + 0.75 g Fe2O3) into the cone, indent the top, and add 0.50 g Ba(NO3)2 / Mg ignition primer.',
          'Insert the unfeathered end of a 6 cm magnesium ribbon fuse down through the powders and filter cone until it contacts the tin base.',
          'Clear all observers behind a polycarbonate shield at least 4 meters away, equipped with Shade 9 welding filters.',
          'Ignite the feathered tip of the magnesium ribbon, immediately invert the 1 L beaker over the assembly, and step back.',
          'Observe the intense blinding flash and white-hot incandescence (>2000°C), and test the cooled metallic iron bead with a magnet.'
        ],
        realWorldApplication: 'Continuous Welded Rail (CWR) track welding, metallurgical carbon-free metal extraction (Goldschmidt process), and underwater thermal cutting torches.',
        tags: ['Redox', 'Reactivity Series', 'Exothermic', 'Thermite', 'Iron Extraction', 'Metallurgy', 'NEP 2020'],
        badge: 'Dramatic Redox',
        image: '/images/experiments/microscale-thermite-hero.jpg',
        colorTheme: 'from-amber-600 via-orange-700 to-slate-950'
      }
    ]
  },

  physics: {
    slug: 'physics',
    name: 'Physics Activities',
    tagline: 'Master Classical Mechanics, Quantum Light, Electromagnetism & Aerodynamics',
    heroGradient: 'from-cyan-500/20 via-blue-600/15 to-indigo-700/20',
    accentColor: '#0ea5e9',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    iconName: 'Atom',
    activeCount: 48,
    labType: 'Mechanics & Wave Optics Lab',
    description: 'Explore kinematic trajectories, electromagnetic induction, laser diffraction, hydraulic Pascal laws, and resonance oscillators with high-precision virtual and physical experiments.',
    popularConcepts: ['Lorentz Force & Motors', 'Wave-Particle Duality', 'Conservation of Momentum', 'Bernoulli Principle', 'Electromagnetic Resonance'],
    simulatorType: 'physics_pendulum',
    activities: [
      {
        id: 'phys-1',
        title: 'High-Speed Homopolar Electromagnetic Motor',
        subtitle: 'Harness Lorentz Force to Spin Copper Wire at 3,000 RPM',
        category: 'Electromagnetism & Motors',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Beginner',
        duration: '15 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Build the simplest possible electric motor in the world with just one AA battery, a Neodymium magnet, and a bent copper wire spinning effortlessly.',
        scientificPrinciple: 'Lorentz Force F = I * (L x B). Current flowing down copper arms interacts with the magnetic flux lines of the neodymium disk, generating continuous rotational torque.',
        materials: ['1.5V Alkaline AA Battery', 'Strong Neodymium Disk Magnet', 'Bare 18-gauge Copper Wire (15cm)', 'Pliers'],
        steps: [
          'Attach the neodymium magnet to the flat negative (-) terminal of the AA battery.',
          'Stand the battery upright on the magnet on a smooth tabletop.',
          'Bend the copper wire into a heart or symmetrical spiral shape with a central pivot notch.',
          'Place the notch on the positive (+) terminal with bottom arms lightly brushing the magnet perimeter.',
          'Watch the wire spin into a high-speed blur instantly!'
        ],
        realWorldApplication: 'Electric vehicle propulsion, maglev bullet trains, and brushless drone motors.',
        tags: ['Magnetism', 'Motors', 'Electricity', 'Lorentz'],
        badge: 'Super Fast',
        colorTheme: 'from-cyan-500 to-blue-600'
      },
      {
        id: 'phys-2',
        title: 'Laser Diffraction & Hair Strand Wavelength Measurement',
        subtitle: 'Measure Micron-Scale Diameters using Wave Interference',
        category: 'Wave Optics & Lasers',
        gradeLevel: 'Senior Sec (11-12)',
        difficulty: 'Advanced',
        duration: '40 Mins',
        safetyLevel: 'Adult Supervision',
        description: 'Shine a precision red laser pointer across a single human hair strand and use Fraunhofer diffraction fringes on a wall to measure hair thickness down to micrometers.',
        scientificPrinciple: 'Babinet Principle states complementary screens yield identical diffraction patterns. Fringe spacing y = lambda * D / d enables precision diameter calculation.',
        materials: ['Red/Green Laser Pointer (650nm / 532nm)', 'Single Strand of Human Hair', 'Cardboard Frame / Slide Holder', 'Measuring Tape', 'Dark Screen / Wall'],
        steps: [
          'Tape the hair taut across a 2cm hole in a cardboard mount.',
          'Position the laser mount 3 to 5 meters away from a white wall in a dim room.',
          'Direct the laser beam directly centered on the hair strand.',
          'Observe the crisp line of bright and dark diffraction bands on the wall.',
          'Measure distance D and distance between 5 minima to calculate hair diameter d = lambda * D / y.'
        ],
        realWorldApplication: 'Optical quality control in fiber-optic communications, semiconductor lithography, and laser medical surgery.',
        tags: ['Optics', 'Lasers', 'Diffraction', 'Calculations'],
        badge: 'Class 12 CBSE/ISC',
        colorTheme: 'from-red-500 to-rose-600'
      },
      {
        id: 'phys-3',
        title: 'Hydraulic Robotic Grabber Arm with Pascal Law',
        subtitle: 'Fluid Pressure Power Transmission across Syringe Pistons',
        category: 'Fluid Mechanics & Robotics',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Intermediate',
        duration: '60 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Construct a 3-axis articulated robotic gripper made of cardboard and medical syringes that lifts and sorts objects via hydraulic fluid pressure.',
        scientificPrinciple: 'Pascal Law: Pressure applied to an enclosed liquid is transmitted undiminished in all directions: P1 = P2 => F1/A1 = F2/A2, multiplying mechanical force.',
        materials: ['6x 10ml Syringes', 'Flexible Aquarist PVC Tubing', 'Water with Food Coloring', 'Cardboard / Popsicle Sticks', 'Hot Glue Gun'],
        steps: [
          'Assemble cardboard linkages for base rotation, shoulder elevation, and claw pinch.',
          'Connect pairs of syringes with water-filled flexible tubing, purging all air bubbles.',
          'Mount slave syringes onto the arm joints and master syringes onto the control cockpit.',
          'Push and pull the cockpit pistons to watch the mechanical claw grip and lift payloads smoothly.'
        ],
        realWorldApplication: 'Excavator heavy machinery, airplane hydraulic landing gear, and surgical robotic manipulators.',
        tags: ['Hydraulics', 'Robotics', 'Pascal', 'Engineering'],
        badge: 'Hands-On Masterpiece',
        colorTheme: 'from-blue-600 to-indigo-700'
      },
      {
        id: 'phys-4',
        title: 'Bernoulli Airflow Levitating Ping-Pong Ball',
        subtitle: 'Fluid Velocity & Pressure Gradient in Coanda Effect',
        category: 'Aerodynamics',
        gradeLevel: 'Primary (1-5)',
        difficulty: 'Beginner',
        duration: '15 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Float a ping-pong ball magically suspended in mid-air above a hairdryer stream, tilting it at 45 degrees without the ball falling!',
        scientificPrinciple: 'Fast-moving air creates a low-pressure column. High-pressure surrounding ambient air continuously pushes the ball back into the stream center against gravity.',
        materials: ['Standard Hairdryer with Cool Air mode', '2 Ping-Pong Balls', 'Funnel attachment (optional)'],
        steps: [
          'Switch hairdryer to highest cool airflow setting and point the nozzle straight upwards.',
          'Carefully place the ping-pong ball into the center of the air stream and let go.',
          'Observe the ball hovering stably in the air vortex.',
          'Slowly tilt the hairdryer nozzle at 30 to 45 degrees angle and observe the ball remaining trapped in the tilted stream!'
        ],
        realWorldApplication: 'Aircraft wing lift generation, race car downforce spoilers, and industrial cyclone dust separators.',
        tags: ['Bernoulli', 'Flight', 'Pressure', 'Aerodynamics'],
        badge: 'Magic of Physics',
        colorTheme: 'from-sky-400 to-blue-500'
      }
    ]
  },

  biology: {
    slug: 'biology',
    name: 'Biology & Life Science Activities',
    tagline: 'Discover Cellular Machinery, Genetics, Botanical Osmosis & Bio-Ecosystems',
    heroGradient: 'from-emerald-500/20 via-green-600/15 to-teal-700/20',
    accentColor: '#10b981',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconName: 'Dna',
    activeCount: 39,
    labType: 'Microbiology & Botanical Lab',
    description: 'Investigate DNA extraction, cellular respiration, stomatal transpiration under microscope, enzyme kinetics, and mini self-sustaining hydroponic ecosystems.',
    popularConcepts: ['Genomic DNA Extraction', 'Photosynthetic Pigments', 'Enzyme Substrate Kinetics', 'Microbial Culturing', 'Cell Osmosis'],
    simulatorType: 'biology_dna',
    activities: [
      {
        id: 'bio-1',
        title: 'Strawberry Genomic DNA Spooling in a Vial',
        subtitle: 'Extract and Spool Visible DNA Strands from Fresh Fruit Cells',
        category: 'Molecular Genetics',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Beginner',
        duration: '25 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Break cell membranes with detergent and salt, then precipitate millions of long octoploid strawberry DNA molecules into cloudy white strands visible to the naked eye.',
        scientificPrinciple: 'Detergent dissolves phospholipid bilayer membranes. Salt shields negative phosphate backbones. Ice-cold isopropanol lowers dielectric constant, causing DNA to precipitate out of aqueous solution.',
        materials: ['2 Fresh Strawberries', '50ml Lysis Buffer (Water + Dish Soap + Table Salt)', 'Ice-cold 99% Isopropanol / Rubbing Alcohol', 'Ziploc Bag', 'Coffee Filter / Funnel', 'Wooden Skewer'],
        steps: [
          'Place strawberries in Ziploc bag and mash thoroughly into a smooth puree.',
          'Add 10ml of Lysis buffer and mix gently for 2 minutes to break cellular membranes.',
          'Filter strawberry slurry through coffee filter into a test tube or clear cup.',
          'Slowly pour ice-cold alcohol down the side of the tube to form a distinct top layer.',
          'Watch translucent white DNA fibers precipitate at the liquid interface; spool them onto a wooden skewer!'
        ],
        realWorldApplication: 'Genetic sequencing, PCR viral diagnostics, CRISPR gene editing, and agricultural GMO crop breeding.',
        tags: ['DNA', 'Genetics', 'Cells', 'Biotechnology'],
        badge: 'Top Discovery',
        colorTheme: 'from-emerald-500 to-teal-600'
      },
      {
        id: 'bio-2',
        title: 'Leaf Paper Chromatography & Chlorophyll Separation',
        subtitle: 'Isolate Chlorophyll A, Chlorophyll B, Xanthophylls & Carotenoids',
        category: 'Plant Physiology & Photosynthesis',
        gradeLevel: 'Secondary (9-10)',
        difficulty: 'Intermediate',
        duration: '35 Mins',
        safetyLevel: 'Adult Supervision',
        description: 'Separate photosynthetic pigments from fresh spinach leaves into distinct vibrant yellow, orange, and emerald bands on chromatography paper.',
        scientificPrinciple: 'Capillary action moves organic solvent up porous paper. Pigments travel at different retention factors (Rf) based on molecular size, solubility in acetone, and polarity affinity to cellulose.',
        materials: ['Fresh Spinach or Coleus Leaves', 'Acetone or Rubbing Alcohol', 'Whatman Chromatography / Coffee Filter Strips', 'Mortar & Pestle', 'Glass Jar with Lid', 'Pencil & Ruler'],
        steps: [
          'Grind fresh spinach leaves in mortar with a splash of acetone until a rich green extract forms.',
          'Draw a faint pencil line 2cm from bottom of chromatography strip.',
          'Spot concentrated pigment extract repeatedly on the line with a capillary tube or toothpick.',
          'Suspend strip vertically in jar containing 1cm solvent without submerging the pigment dot.',
          'Allow solvent front to rise 10cm, then identify Carotenes (Top Yellow/Orange), Xanthophylls (Yellow), Chlorophyll A (Blue-Green), and Chlorophyll B (Olive Green).'
        ],
        realWorldApplication: 'Crop yield optimization, understanding autumn leaf color change, and oceanographic phytoplankton satellite monitoring.',
        tags: ['Photosynthesis', 'Chromatography', 'Plants', 'Pigments'],
        badge: 'NEP 2020 Aligned',
        colorTheme: 'from-green-600 to-emerald-700'
      },
      {
        id: 'bio-3',
        title: 'Microscopic Stomata Density & Transpiration Mapping',
        subtitle: 'Peel Epidermal Layers to Inspect Guard Cells & Pore Apertures',
        category: 'Plant Anatomy & Microscopy',
        gradeLevel: 'Senior Sec (11-12)',
        difficulty: 'Intermediate',
        duration: '40 Mins',
        safetyLevel: 'Lab Environment Required',
        description: 'Prepare crystal clear nail-polish leaf epidermal impressions to calculate stomatal index and count open/closed guard cell pores under 400x magnification.',
        scientificPrinciple: 'Turgor pressure driven by potassium (K+) ion influx causes asymmetric swelling of guard cell inner walls, opening stomata for CO2 uptake while balancing transpiration water loss.',
        materials: ['Fresh Tradescantia / Rhoeo / Betel Leaf', 'Clear Nail Polish', 'Transparent Tape', 'Microscope Slides & Coverslips', 'Compound Optical Microscope'],
        steps: [
          'Paint a thin 1cm square patch of clear nail polish on the lower leaf surface.',
          'Let dry completely for 10 minutes.',
          'Press a strip of transparent cello-tape firmly over the dried patch and peel off gently.',
          'Mount the tape onto a clean glass slide without air wrinkles.',
          'Observe under 100x and 400x magnification; count stomata in a calibrated field of view.'
        ],
        realWorldApplication: 'Drought-resistant crop bioengineering, climate change transpiration modeling, and agricultural stomatal conductance sensors.',
        tags: ['Microscope', 'Stomata', 'Cells', 'Botany'],
        badge: 'CBSE Practicals',
        colorTheme: 'from-teal-500 to-cyan-600'
      }
    ]
  },

  math: {
    slug: 'math',
    name: 'Mathematics & Logic Activities',
    tagline: 'Unravel Fractal Geometry, Golden Ratio, Graph Theory & Computational Puzzles',
    heroGradient: 'from-purple-500/20 via-indigo-600/15 to-violet-700/20',
    accentColor: '#8b5cf6',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    iconName: 'Calculator',
    activeCount: 36,
    labType: 'Applied Math & Geometry Sandbox',
    description: 'Transform abstract theorems into tactile geometric models, Fibonacci spiraling art, recursive tower algorithms, and statistical Monte Carlo simulations.',
    popularConcepts: ['Golden Ratio Phi (1.618)', 'Euler Formula for Polyhedra', 'Fractal Dimension', 'Königsberg Seven Bridges', 'Pascal Triangle Modulo'],
    simulatorType: 'math_fractal',
    activities: [
      {
        id: 'math-1',
        title: '3D Origami Polyhedra & Euler Formula Verification',
        subtitle: 'Construct Platonic Solids and Prove V - E + F = 2',
        category: 'Topology & Polyhedral Geometry',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Beginner',
        duration: '30 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Fold Sonobe modular origami units to assemble Icosahedrons and Dodecahedrons, mathematically proving Euler invariant topological formula.',
        scientificPrinciple: 'For any convex spherical polyhedron, Vertices (V) - Edges (E) + Faces (F) = 2 (Euler Characteristic Chi = 2).',
        materials: ['12 to 30 Square Colored Origami Sheets', 'Ruler', 'Data Recording Table'],
        steps: [
          'Fold 12 Sonobe units following standardized parallelogram creases.',
          'Interlock units in sets of three to construct a 6-peaked Stellated Octahedron.',
          'Count total visible vertices (V), sharp edges (E), and triangular faces (F).',
          'Calculate V - E + F and verify it equals exactly 2.',
          'Scale up to a 30-unit Icosahedron and re-verify topological invariance.'
        ],
        realWorldApplication: 'Fullerene C60 carbon buckyball chemistry, geodesic dome architectural engineering, and 3D computer graphics meshes.',
        tags: ['Geometry', 'Origami', 'Topology', 'Euler'],
        badge: 'Spatial Master',
        colorTheme: 'from-purple-500 to-indigo-600'
      },
      {
        id: 'math-2',
        title: 'Monte Carlo Pi (π) Estimation with Buffon Needle Drops',
        subtitle: 'Compute Transcendental Pi through Pure Random Probability',
        category: 'Probability & Statistics',
        gradeLevel: 'Secondary (9-10)',
        difficulty: 'Intermediate',
        duration: '30 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Drop 500 toothpicks onto ruled parallel lines and calculate the exact value of Pi (3.14159...) purely from the geometric probability of line intersections.',
        scientificPrinciple: 'Probability P of a needle of length L crossing lines spaced d apart is P = (2L) / (pi * d). Rearranging yields pi = (2 * L * Total Drops) / (d * Crossings).',
        materials: ['Large Sheet of Paper with parallel lines ruled 5cm apart', '100 Toothpicks cut to exactly 5cm length', 'Tally Counter / Excel Sheet'],
        steps: [
          'Rule parallel lines spaced exactly 5cm apart on poster board.',
          'Drop toothpicks from a height of 50cm uniformly across the board in batches of 50.',
          'Count and record the number of toothpicks that intersect any ruled line.',
          'Repeat until 500 total drops are tallied.',
          'Compute estimated Pi using formula: (2 * Total Drops) / Crossings and compare error percentage.'
        ],
        realWorldApplication: 'Quantum Monte Carlo particle simulations, financial market risk analysis, and AI neural network weight training.',
        tags: ['Probability', 'Pi', 'Statistics', 'Simulation'],
        badge: 'Data Science',
        colorTheme: 'from-indigo-500 to-violet-600'
      }
    ]
  },

  art: {
    slug: 'art',
    name: 'STEAM Art & Creative Design',
    tagline: 'Harmonize Aesthetic Creativity with Photochemistry, Color Physics & Sculpting',
    heroGradient: 'from-rose-500/20 via-pink-600/15 to-fuchsia-700/20',
    accentColor: '#f43f5e',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    iconName: 'Palette',
    activeCount: 32,
    labType: 'STEAM Creative Studio',
    description: 'Bridge left and right brain intelligence through Cyanotype UV solar printing, paper circuit lanterns, Turkish Ebru fluid marbling, and anamorphic 3D perspective art.',
    popularConcepts: ['Cyanotype Solar Printing', 'Ebru Fluid Surface Dynamics', 'Anamorphic Perspective', 'Subtractive & Additive Color Mixing', 'Kinetic Mobiles'],
    simulatorType: 'art_color',
    activities: [
      {
        id: 'art-1',
        title: 'Cyanotype Botanical Sun Printing on Archival Paper',
        subtitle: '19th Century Iron-Salt Photochemical Printmaking',
        category: 'Photochemistry & Visual Arts',
        gradeLevel: 'All Grades',
        difficulty: 'Beginner',
        duration: '30 Mins (Sun Exposure 5 Mins)',
        safetyLevel: 'Safe for Home',
        description: 'Coat paper with light-sensitive iron salts, arrange botanical ferns and flowers, and expose to daylight to create breathtaking Prussian Blue silhouette prints.',
        scientificPrinciple: 'Ferric ammonium citrate and potassium ferricyanide react under UV radiation to form insoluble insoluble Ferric Ferrocyanide (Prussian Blue) dye.',
        materials: ['Cyanotype Chemical Emulsion', 'Heavy Watercolor Paper (300 GSM)', 'Foam Brush', 'Pressed Ferns & Leaves', 'Direct Sunlight', 'Water Wash Tray'],
        steps: [
          'Mix equal parts Part A and Part B in dim ambient light.',
          'Brush emulsion evenly over watercolor paper and let dry in the dark.',
          'Place botanical leaves on coated paper and clamp with a sheet of clear glass.',
          'Expose to bright midday sunlight for 3 to 6 minutes until color turns bronze-grey.',
          'Rinse paper under cold running tap water until rinse water runs clear; watch brilliant Prussian Blue appear!'
        ],
        realWorldApplication: 'Architectural blueprint heritage, fine art photography, and solar UV radiation dosimeters.',
        tags: ['Photography', 'Sun Art', 'Cyanotype', 'Chemistry'],
        badge: 'Stunning Artwork',
        colorTheme: 'from-cyan-600 to-blue-700'
      },
      {
        id: 'art-2',
        title: 'Electrified Paper Circuit Glowing Origami Lanterns',
        subtitle: 'Integrate Copper Tape, Surface LEDs & Button Cells into Paper Art',
        category: 'Circuit Crafts & Design',
        gradeLevel: 'Primary (1-5)',
        difficulty: 'Beginner',
        duration: '25 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Draw working electrical circuit pathways with conductive copper foil tape onto folding origami paper, creating geometric lamps that glow with colored LEDs.',
        scientificPrinciple: 'Continuous electrical current loops with low contact resistance power SMD LEDs with zero soldering needed, exploring closed loops, parallel branches, and polarity.',
        materials: ['Conductive Copper Foil Tape with Conductive Adhesive', '3V Coin Cell Battery (CR2032)', '5mm Diffused LEDs (Red, Blue, Warm White)', 'Cardstock Paper', 'Binder Clip'],
        steps: [
          'Design and trace an origami lantern template on cardstock.',
          'Lay conductive copper tape traces for positive (+) and negative (-) rails.',
          'Bend LED legs and tape over the copper gaps ensuring correct anode/cathode polarity.',
          'Fold a corner switch to clamp the 3V coin cell battery with a binder clip.',
          'Assemble the 3D lantern body and watch it illuminate like a futuristic glowing sculpture.'
        ],
        realWorldApplication: 'Wearable smart textiles, interactive pop-up greeting cards, and flexible printed electronics.',
        tags: ['Circuits', 'Origami', 'LED', 'Maker'],
        badge: 'Maker Favorite',
        colorTheme: 'from-amber-500 to-rose-600'
      }
    ]
  },

  technology: {
    slug: 'technology',
    name: 'Technology & Computing Activities',
    tagline: 'Code Interactive Systems, Design Logic Circuits, AI Vision & IoT Smart Hardware',
    heroGradient: 'from-indigo-500/20 via-sky-600/15 to-blue-700/20',
    accentColor: '#6366f1',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    iconName: 'Cpu',
    activeCount: 45,
    labType: 'Silicon & IoT Sandbox',
    description: 'Explore digital logic gates, microcontrollers, sensor-actuator loops, speech AI models, and real-time interactive web sandbox development.',
    popularConcepts: ['Boolean Logic & Gates', 'IoT Soil Moisture Telemetry', 'Computer Vision Object Recognition', 'Microcontroller UART Communication', 'Cryptography Hashing'],
    simulatorType: 'tech_logic',
    activities: [
      {
        id: 'tech-1',
        title: 'Smart Plant IoT Soil Moisture Automation System',
        subtitle: 'Build an Automated Irrigation Alert System with Microcontroller',
        category: 'Internet of Things & Sensors',
        gradeLevel: 'Secondary (9-10)',
        difficulty: 'Intermediate',
        duration: '45 Mins',
        safetyLevel: 'Safe for Home',
        description: 'Wire a soil hygrometer sensor to an Arduino/ESP32 microcontroller and code an automated threshold buzzer and LED alarm when soil dries out.',
        scientificPrinciple: 'Capacitive/resistive soil probes measure dielectric permittivity changes correlated with volumetric water content, converted via ADC (Analog to Digital Converter).',
        materials: ['Arduino Uno or ESP32 Board', 'Soil Moisture Sensor Probe', '5V Active Buzzer', 'RGB LED', 'Breadboard & Jumper Wires', 'Potted Plant'],
        steps: [
          'Connect sensor VCC to 5V, GND to GND, and Analog Out to pin A0 on Arduino.',
          'Insert probe prongs into the potted plant soil.',
          'Write C++ logic: if (analogRead(A0) < threshold) { digitalWrite(LED_PIN, HIGH); triggerBuzzer(); }',
          'Upload sketch over USB and open Serial Monitor to calibrate dry vs wet soil readings.',
          'Pour water on the soil and watch the alert turn green automatically!'
        ],
        realWorldApplication: 'Precision smart agriculture, automated drip irrigation in greenhouses, and environmental drought monitoring.',
        tags: ['IoT', 'Arduino', 'Coding', 'Sensors'],
        badge: 'Practical Tech',
        colorTheme: 'from-indigo-500 to-sky-600'
      }
    ]
  },

  engineering: {
    slug: 'engineering',
    name: 'Engineering & Maker Innovations',
    tagline: 'Design Structural Bridges, Robotic Linkages, Aerospace Rockets & Solar Engines',
    heroGradient: 'from-amber-600/20 via-yellow-600/15 to-orange-700/20',
    accentColor: '#d97706',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconName: 'Wrench',
    activeCount: 38,
    labType: 'Maker Innovation & Stress Test Lab',
    description: 'Test structural load limits of Warren and Pratt trusses, build pneumatic walking robotics, calculate aerodynamic fin drag on air rockets, and optimize solar thermal engines.',
    popularConcepts: ['Truss Tension & Compression', 'Pneumatic Actuation', 'Rocket Center of Pressure vs Mass', 'Stirling Thermal Cycle', 'Seismic Damping Systems'],
    simulatorType: 'eng_bridge',
    activities: [
      {
        id: 'eng-1',
        title: 'Balsa Wood Warren Truss Bridge Load Destruction Challenge',
        subtitle: 'Design, Construct and Test Maximum Weight-to-Strength Ratio',
        category: 'Structural Civil Engineering',
        gradeLevel: 'Middle (6-8)',
        difficulty: 'Intermediate',
        duration: '90 Mins (Build + Test)',
        safetyLevel: 'Adult Supervision',
        description: 'Construct an ultra-lightweight 30g balsa wood Warren truss bridge that withstands over 20 kg (600x its own weight) before catastrophic failure!',
        scientificPrinciple: 'Triangular truss geometry distributes loads through pure axial tension and compression forces, eliminating bending moments on individual members.',
        materials: ['Balsa Wood Strips (3mm x 3mm)', 'Cyanoacrylate Glue / Wood Glue', 'Craft Knife & Cutting Mat', 'Blueprint Grid Paper', 'Bucket & Sand Weights'],
        steps: [
          'Draw a full-scale Warren truss blueprint with 60-degree equilateral triangles on grid paper.',
          'Cut balsa members with precise mitered angles and pin them over wax paper on the template.',
          'Apply micro-droplets of wood glue at each gusset joint and allow 4 hours full cure.',
          'Assemble top lateral cross-bracing to prevent out-of-plane torsional buckling.',
          'Suspend the bridge across a 40cm gap; attach a loading block and pour sand until failure to record ultimate load!'
        ],
        realWorldApplication: 'Railway steel bridges, crane booms, aerospace rocket fuselage frames, and skyscraper structural cores.',
        tags: ['Bridge', 'Structures', 'Truss', 'Load Test'],
        badge: 'Engineering Classic',
        colorTheme: 'from-amber-600 to-orange-700'
      }
    ]
  }
};

export function slugifyExperimentTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findActivityById(idOrSlug: string): { activity: ExperimentActivity; subject: SubjectMetadata } | null {
  const query = decodeURIComponent(idOrSlug).toLowerCase().trim();
  for (const subject of Object.values(SUBJECTS_DATA)) {
    const act = subject.activities.find((a) => {
      const aId = a.id.toLowerCase();
      const aSlug = slugifyExperimentTitle(a.title);
      if (aId === query || aSlug === query || query.startsWith(aSlug) || aSlug.startsWith(query)) {
        return true;
      }
      if (query.includes('thermite') && (aSlug.includes('thermite') || a.tags?.some((t) => t.toLowerCase().includes('thermite')))) {
        return true;
      }
      if (query.includes('elephant') && aSlug.includes('elephant')) return true;
      if (query.includes('pendulum') && aSlug.includes('pendulum')) return true;
      if (query.includes('oxygen') && aSlug.includes('oxygen')) return true;
      return false;
    });
    if (act) return { activity: act, subject };
  }
  return null;
}

