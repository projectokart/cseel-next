import { slugify } from "@/lib/utils";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExperimentItem {
  id: string;
  slug: string;
  title: string;
  subject: "Chemistry" | "Biology" | "Physics" | "Mathematics" | "Engineering" | "Technology";
  class: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  views: number;
  likes: number;
  rating: number;
  description: string;
  aim: string;
  theory: string;
  thumbnail_url: string;
  images: string[];
  video_link?: string;
  demo_link?: string;
  materials: string[];
  procedure: string[];
  outcome: string;
  precautions: string[];
  formulas?: { formula: string; explanation: string }[];
  quiz?: QuizQuestion[];
  relatedMaterialIds?: string[];
}

export const ALL_EXPERIMENTS: ExperimentItem[] = [
  {
    id: "e1",
    slug: "absorption-in-the-small-and-large-intestines",
    title: "Absorption In the Small and Large Intestines",
    subject: "Biology",
    class: "Higher Education & High School",
    difficulty: "Intermediate",
    duration: "45 min",
    views: 18900,
    likes: 1340,
    rating: 4.9,
    description: "Explore how nutrients and water are absorbed in the human intestinal lining through this hands-on virtual experiment. Examine the cellular architecture of villi, microvilli, active transport, and osmosis across dialysis tubing.",
    aim: "To demonstrate the diffusion and selective absorption of glucose, amino acids, and water across a semi-permeable membrane modeling intestinal villi.",
    theory: "The human small intestine has an immense surface area due to circular folds, villi, and microvilli. Small molecules (glucose, salts) diffuse through epithelial cells into capillary networks via active and passive transport, while large starch molecules cannot cross without enzymatic breakdown.",
    thumbnail_url: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
    images: [
      "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
      "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg"
    ],
    video_link: "https://www.youtube.com/watch?v=b20VRR9C37Q",
    materials: [
      "Dialysis tubing (Visking tubing 20cm)",
      "10% Glucose solution & 1% Starch solution",
      "Benedict's Reagent & Iodine solution",
      "Boiling water bath & 250ml Beakers",
      "Test tubes and test tube rack",
      "Pipettes and measuring cylinder"
    ],
    procedure: [
      "Soak a 20cm length of dialysis tubing in distilled water to soften it.",
      "Tie one end tightly with thread, fill with 10ml of starch-glucose mixture, and knot the top securely.",
      "Rinse the outside of the tube with distilled water to remove external contamination.",
      "Suspend the dialysis tube in a beaker containing 150ml of distilled water.",
      "After 30 minutes, test the water in the beaker using Benedict's solution (heating for 3 min) and Iodine solution.",
      "Observe the color change to confirm glucose diffusion and starch retention."
    ],
    outcome: "Benedict's test on the external water turns brick-red (positive for glucose), while the Iodine test remains yellow-brown (starch molecules were too large to cross the dialysis pores).",
    precautions: [
      "Ensure dialysis knots are leak-proof to prevent false positive contamination.",
      "Always use a water bath when heating Benedict's reagent — do not heat directly over flame.",
      "Rinse glassware with deionized water before starting."
    ],
    formulas: [
      { formula: "J = -D · (dC/dx)", explanation: "Fick's First Law of Diffusion across membrane barrier" },
      { formula: "Osmotic Pressure: Π = i · M · R · T", explanation: "Van 't Hoff equation for solution osmotic potential" }
    ],
    quiz: [
      {
        question: "Why does glucose pass through the dialysis membrane while starch remains inside?",
        options: ["Glucose has a lower molecular weight and smaller size", "Starch is hydrophobic", "The membrane is positively charged", "Glucose is active transported by the membrane"],
        correctIndex: 0,
        explanation: "Dialysis tubing has microscopic pores (~1-2nm) allowing small monosaccharides like glucose (MW 180) to diffuse while blocking massive starch polysaccharides (MW > 50,000)."
      }
    ],
    relatedMaterialIds: ["m1", "m3"]
  },
  {
    id: "e2",
    slug: "acid-base-titration-simulation",
    title: "Acid-Base Neutralization Titration (HCl vs NaOH)",
    subject: "Chemistry",
    class: "Higher Education & High School",
    difficulty: "Intermediate",
    duration: "40 min",
    views: 24300,
    likes: 1890,
    rating: 4.9,
    description: "Determine the exact molarity of an unknown Hydrochloric Acid (HCl) solution by titrating against a standard 0.1M Sodium Hydroxide (NaOH) solution using Phenolphthalein indicator.",
    aim: "To determine the strength and concentration of unknown hydrochloric acid solution using volumetric titration against standard 0.1 M NaOH.",
    theory: "Titration is a quantitative analytical method where a solution of known concentration (titrant) is added gradually to a solution of unknown concentration (analyte) until chemical equivalence is reached. Phenolphthalein turns from colorless to faint permanent pink at pH 8.2-10.0.",
    thumbnail_url: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
    images: [
      "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
      "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif"
    ],
    materials: [
      "50ml Class A Borosilicate Burette with PTFE Stopcock",
      "20ml Volumetric Pipette with rubber suction bulb",
      "250ml Conical Flasks (Erlenmeyer)",
      "Standard 0.1M NaOH solution & Unknown HCl solution",
      "Phenolphthalein indicator dropper bottle",
      "Retort stand with burette clamp & white tile"
    ],
    procedure: [
      "Rinse and fill the burette with standard 0.1M NaOH solution. Expel air bubbles and adjust meniscus to 0.00ml.",
      "Pipette 20.0ml of unknown HCl solution into a clean 250ml conical flask.",
      "Add 2 to 3 drops of phenolphthalein indicator to the flask and swirl.",
      "Titrate by adding NaOH dropwise while swirling until a permanent faint pink tint appears.",
      "Record reading and repeat for 3 concordant values within ±0.05ml."
    ],
    outcome: "Concordant titre values allow accurate calculation of unknown HCl molarity using M1V1 = M2V2.",
    precautions: [
      "Remove funnel from top of burette before taking initial readings to prevent accidental dripping.",
      "Avoid excess indicator (adds acidity to weak titrations)."
    ],
    formulas: [
      { formula: "M₁ · V₁ = M₂ · V₂", explanation: "Molarity volumetric equivalence equation for monoprotic acids" }
    ],
    relatedMaterialIds: ["m1", "m2", "m3"]
  },
  {
    id: "e3",
    slug: "verification-of-reflection-laws",
    title: "Verification of the Laws of Reflection of Light",
    subject: "Physics",
    class: "Higher Education & High School",
    difficulty: "Beginner",
    duration: "30 min",
    views: 31500,
    likes: 2450,
    rating: 4.8,
    description: "Verify that the angle of incidence equals the angle of reflection (θᵢ = θᵣ) and that the incident ray, reflected ray, and normal all lie in the same geometric plane using optical pins and a plane mirror.",
    aim: "To experimentally verify the first and second laws of reflection of light using a plane mirror strip on drawing board.",
    theory: "When a light ray strikes a polished flat specular reflective surface, it bounces back into the same optical medium such that the angle of incidence equals the angle of reflection (∠i = ∠r).",
    thumbnail_url: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    images: [
      "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"
    ],
    materials: [
      "Soft wooden drawing board with fixing pins",
      "Plain white A4 drawing paper sheet",
      "Plane mirror strip with wooden support stand",
      "4 to 6 steel optical alignment pins",
      "Protractor (360°) and 30cm ruler"
    ],
    procedure: [
      "Fix white paper on drawing board and draw reference line MM' with normal ON.",
      "Draw an incident line at 30° to normal ON and fix pins P and Q.",
      "Place mirror along line MM' and look from opposite side to align pins R and S with images of P and Q.",
      "Measure the angle of reflection (∠r) with a protractor. Repeat for 45° and 60°."
    ],
    outcome: "In each trial, ∠i equals ∠r within experimental tolerance, successfully validating Snell's reflection law.",
    precautions: [
      "Optical pins must be placed vertically perpendicular to the board.",
      "Distance between pins should be at least 5cm for sharp angular accuracy."
    ],
    formulas: [
      { formula: "θᵢ = θᵣ", explanation: "First Law of Reflection" }
    ],
    relatedMaterialIds: ["m7"]
  },
  {
    id: "e4",
    slug: "ohms-law-and-resistance-verification",
    title: "Verification of Ohm's Law and V-I Characteristic",
    subject: "Physics",
    class: "Higher Education & High School",
    difficulty: "Beginner",
    duration: "35 min",
    views: 29800,
    likes: 2120,
    rating: 4.8,
    description: "Study the linear relationship between voltage and current across a nichrome conductor, plot the V-I characteristic curve, and determine unknown electrical resistance.",
    aim: "To verify Ohm's law (V ∝ I) and calculate resistance per unit length of unknown wire.",
    theory: "Ohm's law states that the current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) applied across its terminals, provided temperature remains constant: V = I · R.",
    thumbnail_url: "https://img.freepik.com/premium-photo/technology-abstract-circuit-board-texture-background-hightech-futuristic-circuit-board-banner-wallpaper_1029473-136066.jpg",
    images: [
      "https://img.freepik.com/premium-photo/technology-abstract-circuit-board-texture-background-hightech-futuristic-circuit-board-banner-wallpaper_1029473-136066.jpg"
    ],
    materials: [
      "0-3V DC Regulated Power Supply",
      "Digital DC Voltmeter & Ammeter",
      "Unknown Nichrome resistance coil (1 meter)",
      "Rheostat (100Ω, 2A) & Plug Key switch",
      "Connecting copper wires"
    ],
    procedure: [
      "Clean wire terminal ends with sandpaper.",
      "Connect battery, ammeter, rheostat, key, and resistance wire in series.",
      "Connect the voltmeter in parallel across the resistance coil.",
      "Vary current in steps of 0.2A up to 1.0A, recording corresponding V values.",
      "Plot a graph of V vs I and find the slope to determine resistance."
    ],
    outcome: "A linear straight-line graph passing through the origin is obtained, confirming V = I · R.",
    precautions: [
      "Do not leave plug key inserted continuously to avoid conductor heating."
    ],
    formulas: [
      { formula: "V = I · R", explanation: "Ohm's Law relationship (Volts = Amperes × Ohms)" }
    ],
    relatedMaterialIds: ["m9", "m7"]
  },
  {
    id: "e5",
    slug: "mitosis-stages-in-onion-root-tip",
    title: "Observation of Mitosis Cell Division in Onion Root Tip",
    subject: "Biology",
    class: "Higher Education & High School",
    difficulty: "Advanced",
    duration: "50 min",
    views: 21400,
    likes: 1650,
    rating: 4.9,
    description: "Prepare temporary acetocarmine squash mounts of Allium cepa (onion) root tips to observe and identify distinct stages of mitotic cell division: Prophase, Metaphase, Anaphase, and Telophase.",
    aim: "To prepare a temporary acetocarmine squash of onion root tip and study different stages of mitosis under a compound microscope.",
    theory: "The root apical meristem of onion exhibits active vegetative cell division. Staining with acetocarmine binds to nucleic acids, making condensed chromosomes clearly visible under light microscopy.",
    thumbnail_url: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    images: [
      "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg"
    ],
    materials: [
      "Freshly germinated onion bulbs with healthy white root tips",
      "1N Hydrochloric Acid (HCl)",
      "2% Acetocarmine stain",
      "Clean glass slides, cover slips, spirit lamp",
      "Compound Microscope 40x-1000x"
    ],
    procedure: [
      "Macerate 2-3mm root tip in 1N HCl gently over spirit lamp for 1 minute.",
      "Transfer to clean slide, add 2 drops of 2% acetocarmine stain, and let sit for 5 minutes.",
      "Place a coverslip, apply vertical thumb pressure to squash cells into a single monolayer.",
      "Examine under microscope to locate prophase, metaphase, anaphase, and telophase stages."
    ],
    outcome: "Clear visualization of condensed chromosomes aligned along equatorial metaphase plate and migrating to poles during anaphase.",
    precautions: [
      "Do not slide the coverslip sideways during squashing to avoid tearing cells."
    ],
    formulas: [
      { formula: "Mitotic Index (%) = (Dividing cells / Total cells) × 100", explanation: "Proportion of cells undergoing division" }
    ],
    relatedMaterialIds: ["m5"]
  },
  {
    id: "e6",
    slug: "pythagoras-theorem-proof-demonstration",
    title: "Visual Demonstration & Proof of Pythagoras Theorem",
    subject: "Mathematics",
    class: "Higher Education & High School",
    difficulty: "Beginner",
    duration: "25 min",
    views: 16800,
    likes: 1210,
    rating: 4.7,
    description: "Verify geometrically that in any right-angled triangle, the area of the square constructed on the hypotenuse is equal to the sum of areas of squares on the other two sides (a² + b² = c²).",
    aim: "To demonstrate and verify Pythagoras Theorem through paper cutting, acrylic geometric tiles, and visual dissection proofs.",
    theory: "For any right triangle with base 'a', perpendicular 'b', and hypotenuse 'c', the geometric relation a² + b² = c² holds true.",
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop"
    ],
    materials: [
      "Acrylic Pythagoras geometric puzzle board",
      "Color-coded modular square tiles (3cm, 4cm, 5cm)",
      "Centimeter grid paper & geometry set"
    ],
    procedure: [
      "Construct a right triangle of sides 3cm and 4cm.",
      "Build a 3x3 square (9 units) and a 4x4 square (16 units).",
      "Rearrange all 25 unit tiles to completely fill the 5x5 square (25 units) on hypotenuse 'c'."
    ],
    outcome: "Area of Square on Hypotenuse (25 cm²) = Area on Base (9 cm²) + Area on Altitude (16 cm²).",
    precautions: [
      "Ensure precise 90° angle measurement using a drafting square."
    ],
    formulas: [
      { formula: "c² = a² + b²", explanation: "Fundamental Euclidean Pythagorean identity" }
    ],
    relatedMaterialIds: ["m7"]
  },
  {
    id: "e7",
    slug: "logic-gates-truth-table-simulation",
    title: "Digital Logic Gates Truth Table Verification (AND, OR, NOT, NAND, NOR)",
    subject: "Engineering",
    class: "Higher Education & High School",
    difficulty: "Intermediate",
    duration: "40 min",
    views: 19400,
    likes: 1470,
    rating: 4.8,
    description: "Construct fundamental digital logic circuits using 7400-series TTL Integrated Circuits (ICs), wire input logic switches, and verify output truth tables with LED indicators.",
    aim: "To verify the operation and truth tables of basic and universal logic gates (AND, OR, NOT, NAND, NOR, XOR).",
    theory: "Digital electronics uses binary signals (0: 0V, 1: 5V). Universal gates (NAND, NOR) can synthesize any combinational logic function.",
    thumbnail_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop"
    ],
    materials: [
      "Digital IC Trainer Kit with 5V DC power supply",
      "TTL ICs: 7408 (AND), 7432 (OR), 7404 (NOT), 7400 (NAND)",
      "Logic input toggle switches & output LED indicators",
      "Breadboard & single-core connecting jumper wires"
    ],
    procedure: [
      "Insert IC 7408 (Quad 2-input AND) into breadboard.",
      "Connect Pin 14 to +5V (Vcc) and Pin 7 to Ground (GND).",
      "Connect Pins 1 and 2 to logic input switches A and B.",
      "Connect Pin 3 (Output Y) to LED indicator with 330Ω resistor.",
      "Cycle through inputs (0,0), (0,1), (1,0), (1,1) and record LED state."
    ],
    outcome: "Output LED glows only when both inputs A and B are HIGH (1), perfectly confirming AND truth table Y = A · B.",
    precautions: [
      "Do not exceed +5V supply voltage to prevent destroying TTL transistor junctions."
    ],
    formulas: [
      { formula: "Y = A · B (AND Gate)", explanation: "Logical conjunction operation" },
      { formula: "Y = A + B (OR Gate)", explanation: "Logical disjunction operation" }
    ],
    relatedMaterialIds: ["m9"]
  },
  {
    id: "e8",
    slug: "iot-temperature-cloud-monitoring",
    title: "IoT Temperature & Humidity Cloud Telemetry Station",
    subject: "Technology",
    class: "Higher Education & High School",
    difficulty: "Intermediate",
    duration: "45 min",
    views: 22100,
    likes: 1780,
    rating: 4.9,
    description: "Interface a DHT22 environmental sensor with an ESP32 microcontroller, publish live telemetry over MQTT/HTTP protocol, and visualize real-time charts on an interactive web dashboard.",
    aim: "To build a connected IoT weather monitor that logs ambient telemetry to the cloud every 5 seconds.",
    theory: "Microcontrollers with built-in Wi-Fi radios (ESP32) sample analog/digital transducer voltages and format data into JSON payloads transmitted to MQTT brokers or REST APIs.",
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop"
    ],
    materials: [
      "ESP32-WROOM-32 Development Board",
      "DHT22 Digital Temperature & Humidity Sensor",
      "0.96 inch I2C OLED Display (SSD1306)",
      "Micro-USB Cable & Breadboard with Jumpers"
    ],
    procedure: [
      "Connect DHT22 Data pin to ESP32 GPIO 4 with a 10kΩ pull-up resistor.",
      "Wire OLED display to I2C pins (GPIO 21 SDA, GPIO 22 SCL).",
      "Flash Arduino C++ code with local Wi-Fi credentials.",
      "Observe temperature and humidity readings streaming live on the web cloud dashboard."
    ],
    outcome: "Successful real-time graph plotting of ambient conditions with sub-second cloud synchronization.",
    precautions: [
      "Ensure supply voltage is regulated 3.3V to 5V DC."
    ],
    formulas: [
      { formula: "Heat Index HI = c₁ + c₂T + c₃R + c₄TR ...", explanation: "Rothfusz empirical formula for perceived heat index" }
    ],
    relatedMaterialIds: ["m9"]
  },
  {
    id: "e9",
    slug: "determination-of-g-using-simple-pendulum",
    title: "Determination of Acceleration Due to Gravity (g) Using Simple Pendulum",
    subject: "Physics",
    class: "Higher Education & High School",
    difficulty: "Beginner",
    duration: "35 min",
    views: 17200,
    likes: 1390,
    rating: 4.8,
    description: "Measure the time period of oscillations of a simple pendulum for varying lengths, plot an L vs T² graph, and calculate the local gravitational acceleration constant g.",
    aim: "To determine the acceleration due to gravity 'g' at a place and draw L-T² graph.",
    theory: "For small angular displacements (<5°), a simple pendulum executes Simple Harmonic Motion with time period T = 2π√(L/g). Hence, g = 4π²(L / T²).",
    thumbnail_url: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    images: ["https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg"],
    materials: ["Metallic spherical bob with hook", "Fine inextensible cotton thread", "Rigid clamp stand with split cork", "Digital stopwatch (0.01s precision)", "Vernier Callipers and meter scale"],
    procedure: [
      "Measure diameter of bob with Vernier Callipers to find radius r.",
      "Set effective length L = l + r + e to 60cm.",
      "Displace bob slightly (<5°) and release. Time 20 complete oscillations.",
      "Repeat for lengths 70cm, 80cm, 90cm, 100cm and compute T = time / 20.",
      "Plot L on y-axis vs T² on x-axis and find slope."
    ],
    outcome: "Experimental value of g obtained within 1.5% of standard 9.8 m/s².",
    precautions: ["Displacement amplitude must not exceed 5 degrees for SHM."],
    formulas: [{ formula: "g = 4π² · (L / T²)", explanation: "Standard formula for acceleration due to gravity" }],
    relatedMaterialIds: ["m4", "m7"]
  },
  {
    id: "e10",
    slug: "qualitative-salt-analysis-anions-cations",
    title: "Systematic Qualitative Salt Analysis (Acid & Basic Radicals)",
    subject: "Chemistry",
    class: "Higher Education & High School",
    difficulty: "Advanced",
    duration: "50 min",
    views: 26100,
    likes: 2150,
    rating: 4.9,
    description: "Systematically identify unknown inorganic cation (Group I-VI) and anion (Carbonate, Sulphate, Nitrate, Chloride) radicals through preliminary dry tests and confirmatory wet tests.",
    aim: "To identify one cation and one anion present in the given inorganic inorganic salt sample.",
    theory: "Qualitative inorganic analysis uses selective precipitation, complex ion formation, redox color changes, and flame emission spectra to uniquely classify ions.",
    thumbnail_url: "https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg",
    images: ["https://img.freepik.com/premium-photo/chemistryfilled-beakers-beakers-with-colorful-chemical-generative-ai_722401-1517.jpg"],
    materials: ["Unknown inorganic salt sample", "Dilute & Concentrated H2SO4, Dilute HCl", "Silver Nitrate (AgNO3) & Barium Chloride (BaCl2)", "Ammonium Hydroxide & Sodium Hydroxide", "Platinum wire for flame test, Test tubes & Bunsen burner"],
    procedure: [
      "Perform physical examination (color, smell, crystalline state).",
      "Treat salt with dilute H2SO4 to detect carbonate, sulphite, sulphide radicals.",
      "Perform Brown Ring Test for nitrate (FeSO4 + conc H2SO4 layer).",
      "Perform group separation for cations from Group 0 (NH4+) through Group VI (Mg2+).",
      "Carry out specific confirmatory tests."
    ],
    outcome: "Accurate identification of salt identity with chemical reaction equations.",
    precautions: ["Handle concentrated sulfuric and nitric acids in fume hood with safety goggles."],
    formulas: [{ formula: "Fe²⁺ + NO + H₂O → [Fe(H₂O)₅(NO)]²⁺", explanation: "Formation of brown ring complex for nitrate" }],
    relatedMaterialIds: ["m1", "m2", "m8"]
  },
  {
    id: "e11",
    slug: "rate-of-photosynthesis-light-intensity",
    title: "Measurement of Rate of Photosynthesis via Hydrilla Plant & Light",
    subject: "Biology",
    class: "Higher Education & High School",
    difficulty: "Beginner",
    duration: "35 min",
    views: 15400,
    likes: 1180,
    rating: 4.7,
    description: "Investigate how varying light intensity and distance from light source affects the photosynthetic oxygen evolution rate in aquatic Hydrilla verticillata plants.",
    aim: "To demonstrate that light intensity directly increases photosynthetic oxygen bubble production rate.",
    theory: "In light reactions of photosynthesis (6CO2 + 6H2O + light → C6H12O6 + 6O2), water photolysis releases oxygen gas, counted as bubbles per minute.",
    thumbnail_url: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    images: ["https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg"],
    materials: ["Fresh Hydrilla twigs", "0.5% Sodium Bicarbonate (NaHCO3) solution", "Glass funnel & 100ml beaker", "Graduated test tube & 100W lamp", "Meter rule & stopwatch"],
    procedure: [
      "Place Hydrilla twigs with cut ends facing upward inside a glass funnel submerged in 0.5% NaHCO3 solution.",
      "Invert a water-filled test tube over the stem of the funnel.",
      "Place a 100W lamp at 10cm, 20cm, 30cm, 40cm distances.",
      "Count the number of oxygen bubbles evolved per minute at each distance."
    ],
    outcome: "Bubble count increases inversely with the square of distance (I ∝ 1/d²).",
    precautions: ["Add sodium bicarbonate to ensure CO2 is not a rate-limiting factor."],
    formulas: [{ formula: "Rate (bubbles/min) ∝ Light Intensity (I)", explanation: "Photosynthetic kinetic response curve" }],
    relatedMaterialIds: ["m1", "m3"]
  },
  {
    id: "e12",
    slug: "bridge-truss-stress-strain-load-analysis",
    title: "Structural Bridge Truss Load Analysis & Deflection Study",
    subject: "Engineering",
    class: "Higher Education & High School",
    difficulty: "Advanced",
    duration: "45 min",
    views: 14200,
    likes: 1120,
    rating: 4.8,
    description: "Analyze tension and compression internal member forces in Pratt and Warren truss bridges under varying point loads using digital strain gauges and finite element analysis.",
    aim: "To calculate member forces in a bridge truss and verify with experimental strain gauge readings.",
    theory: "Method of Joints (ΣFx = 0, ΣFy = 0) and Method of Sections resolve internal axial forces in statically determinate pin-connected trusses.",
    thumbnail_url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop"],
    materials: ["Modular acrylic truss structure apparatus", "Digital strain gauge amplifier & readout", "Hanging load hangers with 100g-1000g slotted weights", "Dial test indicator (0.01mm)"],
    procedure: [
      "Assemble Warren truss on pin supports with strain gauges bonded to bottom chord members.",
      "Apply 500g central vertical load at node C.",
      "Record digital microstrain readings and convert to stress σ = E · ε.",
      "Compare measured load-deflection curve with analytical calculations."
    ],
    outcome: "Experimental member stresses match theoretical calculations within 4.2% error.",
    precautions: ["Do not exceed elastic yield limit of truss members."],
    formulas: [{ formula: "σ = E · ε", explanation: "Hooke's Law of Elasticity" }],
    relatedMaterialIds: ["m4", "m9"]
  }
];

export function getExperimentBySlugOrId(identifier: string): ExperimentItem | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().trim();
  return ALL_EXPERIMENTS.find(
    (e) =>
      e.slug.toLowerCase() === clean ||
      e.id.toLowerCase() === clean ||
      slugify(e.title) === clean ||
      clean.includes(e.slug.toLowerCase()) ||
      e.slug.toLowerCase().includes(clean)
  );
}
