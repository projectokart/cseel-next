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
  subject_slug?: string;
  class: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  duration_minutes?: number;
  status?: string;
  views?: number;
  likes?: number;
  rating?: number;
  description: string;
  aim?: string;
  theory?: string;
  thumbnail_url: string;
  images: string[];
  video_link?: string;
  demo_link?: string;
  materials: string[];
  procedure: string[];
  outcome: string;
  precautions: string[];
  learning_objectives?: string[];
  tags?: string[];
  popularity?: number;
  formulas?: { formula: string; explanation: string }[];
  quiz?: QuizQuestion[];
  relatedMaterialIds?: string[];
}

export const ALL_EXPERIMENTS: ExperimentItem[] = [
  {
    "id": "9bc212e4-49b7-4c22-8666-48092e0ed7a6",
    "title": "Verification of Ohm's Law and Resistance Determination",
    "slug": "ohms-law-verification-resistance",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 45,
    "description": "Determine the resistance per unit length of a given wire by plotting a graph between potential difference (V) and current (I), verifying Ohm's Law (V = IR) at constant temperature.",
    "outcome": "The V-I graph is a straight line passing through the origin. The constant slope (ΔV/ΔI) verifies Ohm's Law and yields the resistance of the unknown conductor.",
    "materials": [
      "Unknown Resistance Wire (Nichrome / Constantan) × 1 m",
      "DC Voltmeter (0-3V range, least count 0.05V) × 1",
      "DC Ammeter (0-1.5A range, least count 0.02A) × 1",
      "Rheostat (100Ω variable resistor) × 1",
      "DC Battery Eliminator / 2V Accumulator × 1",
      "One-way Plug Key with plug × 1",
      "Connecting Copper Wires & Sandpaper × 1 set"
    ],
    "procedure": [
      "Clean the ends of all connecting wires with sandpaper to remove oxide insulation.",
      "Assemble the circuit in series: battery positive to ammeter positive, ammeter negative to resistance wire, wire to rheostat, rheostat to key, and key to battery negative.",
      "Connect the voltmeter in parallel across the resistance wire observing correct polarity (+ to +, - to -).",
      "Insert the plug key and slide the rheostat contact to achieve a low measurable current on the ammeter.",
      "Record the ammeter reading (I) and corresponding voltmeter reading (V).",
      "Shift the rheostat slider to 5 distinct positions to record 5 sets of (V, I) readings.",
      "Calculate resistance R = V / I for each trial and plot the V versus I graph on millimeter graph paper."
    ],
    "precautions": [
      "Ensure all circuit connections are tight and clean.",
      "Never keep the key plugged continuously; remove the plug between readings to prevent wire heating.",
      "Voltmeter must always be connected in parallel and ammeter in series.",
      "Check that zero errors of both meters are accounted for before taking readings."
    ],
    "learning_objectives": [
      "Understand the linear relationship between voltage and current in ohmic conductors.",
      "Calculate least count and zero error of electrical measuring instruments.",
      "Analyze graphical slope to determine experimental resistance."
    ],
    "tags": [
      "Ohm's Law",
      "Current Electricity",
      "Class 10 CBSE",
      "Circuit Analysis",
      "NEP 2020"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 98,
    "status": "published",
    "duration": "45 Mins",
    "views": 1176,
    "likes": 784,
    "rating": 5
  },
  {
    "id": "cc00b1af-93b2-411b-b9c4-5e27a219d0bf",
    "title": "Determination of Refractive Index of Glass Prism",
    "slug": "refractive-index-glass-prism",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Determine the angle of minimum deviation (Dm) for a given glass triangular prism by plotting the i-D curve and calculate the refractive index (μ) of the prism material.",
    "outcome": "The i-D graph forms a smooth parabola with a distinct minimum. The refractive index of crown glass is determined to be approximately 1.51 ± 0.02 using the prism formula.",
    "materials": [
      "Equilateral Triangular Glass Prism (60°) × 1",
      "Drawing Board with Thumb Pins × 1",
      "White Drawing Sheet (A3/A4) × 2",
      "Optical Fixing Pins × 6",
      "Protractor & 30cm Metric Scale × 1 set",
      "Sharp Pencil & Eraser × 1"
    ],
    "procedure": [
      "Fix the white paper firmly on the wooden drawing board with thumb pins.",
      "Place the prism on its triangular base and draw its boundary ABC with a sharp pencil.",
      "Draw a normal on face AB and erect an incident ray at an angle i = 35°.",
      "Fix two optical pins P1 and P2 vertically along the incident ray separated by at least 5 cm.",
      "Look through face AC of the prism and fix pins P3 and P4 such that their bases align with images of P1 and P2.",
      "Remove the prism, join the pin pricks, produce incident and emergent rays to measure the deviation angle (D).",
      "Repeat for incident angles 40°, 45°, 50°, 55°, and 60°, then plot the angle of incidence vs deviation (i-D) graph."
    ],
    "precautions": [
      "Optical pins must be fixed strictly vertically into the board.",
      "Distance between pins on the same ray must not be less than 5 cm to ensure angular accuracy.",
      "Align pin pricks viewing their feet/bases, not the bent tops.",
      "Do not disturb the prism position while sighting pins."
    ],
    "learning_objectives": [
      "Understand Snell's Law and refraction through non-parallel interfaces.",
      "Derive and apply the prism formula: μ = sin((A+Dm)/2) / sin(A/2).",
      "Identify the angle of minimum deviation from experimental data curves."
    ],
    "tags": [
      "Ray Optics",
      "Refraction",
      "Prism",
      "Class 12 Physics",
      "Optics Lab"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "50 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "9a9669d2-b571-44ec-8bcf-d396c473ece5",
    "title": "Focal Length of Convex Lens using u-v Method",
    "slug": "focal-length-convex-lens-uv-method",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Determine the focal length of a thin convex lens by finding the image distance (v) for various object distances (u) on an optical bench, removing parallax.",
    "outcome": "The focal length of the convex lens is determined to be 15.0 cm ± 0.2 cm using the lens formula 1/f = 1/v - 1/u and confirmed via the 1/u vs 1/v graph.",
    "materials": [
      "Optical Bench (2 meters long with graduated scale) × 1",
      "Biconvex Lens mounted on upright holder × 1",
      "Object Optical Needle × 1",
      "Image Optical Needle × 1",
      "Index Needle for measuring bench error × 1",
      "Screen / Spirit Level × 1"
    ],
    "procedure": [
      "Level the optical bench horizontally using the leveling screws and spirit level.",
      "Obtain a rough estimate of the focal length by projecting the image of a distant tree or building on a white wall.",
      "Mount the convex lens in the middle of the optical bench on an upright holder.",
      "Place the object needle at a distance u > 2f from the lens and illuminate it.",
      "Place the image needle on the other side of the lens and look through the lens from a distance.",
      "Adjust the position of the image needle until its tip coincides with the inverted tip of the object needle image without parallax.",
      "Note the positions of lens, object needle, and image needle to compute u and v across 6 distinct distances."
    ],
    "precautions": [
      "Tips of the object needle, lens optical center, and image needle must lie along the same horizontal axis.",
      "Parallax must be completely eliminated between the real inverted image and the image needle.",
      "Object needle must always remain beyond the principal focus (u > f).",
      "Account for index correction for precise distances."
    ],
    "learning_objectives": [
      "Master the technique of removing optical parallax with needles.",
      "Verify the thin lens formula 1/f = 1/v - 1/u.",
      "Calculate focal length through analytical means and graphical intercepts."
    ],
    "tags": [
      "Optics",
      "Convex Lens",
      "Focal Length",
      "Optical Bench",
      "Parallax"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 94,
    "status": "published",
    "duration": "40 Mins",
    "views": 1128,
    "likes": 752,
    "rating": 4.8999999999999995
  },
  {
    "id": "a0ac41ae-1ea8-4276-acf4-fc76201dc144",
    "title": "Resistance Combination & Verification using Meter Bridge",
    "slug": "meter-bridge-resistance-combination",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 55,
    "description": "Verify the laws of combination of resistances (series and parallel) using a Wheatstone meter bridge apparatus and determine unknown resistances.",
    "outcome": "Experimental equivalent resistances for series (Rs = R1 + R2) and parallel (1/Rp = 1/R1 + 1/R2) match theoretical values within an experimental error of < 1.5%.",
    "materials": [
      "Meter Bridge Board with 1m Manganin wire × 1",
      "Leclanché Cell or regulated 2V DC power supply × 1",
      "Sensitive Galvanometer (center zero) × 1",
      "Standard Resistance Box (1 to 100 Ω) × 1",
      "Jockey with sharp knife edge × 1",
      "Two standard resistance coils (R1 ≈ 2Ω, R2 ≈ 3Ω) × 2",
      "One-way key and thick copper connecting strips × 1 set"
    ],
    "procedure": [
      "Connect the meter bridge circuit strictly according to Wheatstone bridge principles.",
      "Introduce a resistance R from the resistance box in the left gap and unknown coil X in the right gap.",
      "Touch the jockey at 0 cm and 100 cm of the bridge wire to verify opposite deflections in the galvanometer.",
      "Gently slide the jockey along the manganin wire until the galvanometer indicates zero deflection (null point l).",
      "Calculate unknown resistance X = R × (100 - l) / l.",
      "Repeat the determination with R1 and R2 connected in series, then in parallel.",
      "Compare the experimental combination values with theoretical series and parallel formulas."
    ],
    "precautions": [
      "Do not drag or scrape the jockey along the bridge wire; touch it gently to prevent non-uniform wire cross-section.",
      "Ensure balance point lies near the center (between 40 cm and 60 cm) for maximum bridge sensitivity.",
      "Clean connecting terminals and tighten screws with pliers.",
      "Use shunt across galvanometer during initial rough balance."
    ],
    "learning_objectives": [
      "Understand Wheatstone bridge balance condition: P/Q = R/S.",
      "Measure unknown electrical resistances with high null-deflection precision.",
      "Empirically verify series and parallel resistor combination formulas."
    ],
    "tags": [
      "Wheatstone Bridge",
      "Meter Bridge",
      "Resistance",
      "Class 12 Physics",
      "Current Electricity"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 92,
    "status": "published",
    "duration": "55 Mins",
    "views": 1104,
    "likes": 736,
    "rating": 5
  },
  {
    "id": "21e4615d-c572-488b-b237-808561a04293",
    "title": "Acceleration due to Gravity (g) using Simple Pendulum",
    "slug": "acceleration-due-to-gravity-simple-pendulum",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 11",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Determine acceleration due to gravity (g) at a place by studying the variation of time period (T) with effective length (L) of a simple pendulum and plotting an L-T² graph.",
    "outcome": "The L-T² graph is a linear straight line passing through the origin. The acceleration due to gravity g is calculated as 9.78 m/s² ± 0.05 m/s².",
    "materials": [
      "Heavy Metallic Bob with small hook (brass) × 1",
      "Fine unspun cotton thread (approx 1.5 m) × 1",
      "Split Cork & Rigid Retort Stand with clamp × 1",
      "Precision Vernier Caliper for measuring bob radius × 1",
      "Digital Stopwatch (least count 0.01s) × 1",
      "Meter Scale & Chalk for fiducial mark × 1"
    ],
    "procedure": [
      "Measure the diameter of the brass bob with a Vernier caliper in two perpendicular directions and compute its radius r.",
      "Tie one end of the fine thread to the hook of the bob and pass the other end through the split cork held firmly in the clamp.",
      "Adjust the thread length such that the effective length L (length of thread + hook + bob radius) is exactly 70 cm.",
      "Make a vertical chalk mark on the wall behind the bob's rest position as the reference mean position.",
      "Displace the bob slightly (amplitude < 5°) and release it without jerk to execute simple harmonic motion.",
      "Using the stopwatch, time 20 complete oscillations and calculate the time period T = time / 20.",
      "Repeat for lengths 80 cm, 90 cm, 100 cm, 110 cm, and 120 cm, then plot the L versus T² graph."
    ],
    "precautions": [
      "Angular amplitude of oscillation must be kept very small (< 4°-5°) for true SHM behavior (sin θ ≈ θ).",
      "The pendulum must oscillate strictly in a single vertical plane without spinning.",
      "Ensure the suspension point is rigid and does not yield during oscillations.",
      "Air currents must be prevented by shutting nearby fans and windows."
    ],
    "learning_objectives": [
      "Explore conditions for Simple Harmonic Motion in pendulum systems.",
      "Master oscillation counting and reduce timing errors through averaging.",
      "Calculate local gravitational acceleration g from the slope of L-T² plot."
    ],
    "tags": [
      "Simple Pendulum",
      "Gravitation",
      "SHM",
      "Mechanics",
      "Class 11 Physics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 95,
    "status": "published",
    "duration": "40 Mins",
    "views": 1140,
    "likes": 760,
    "rating": 5
  },
  {
    "id": "b3884c02-0427-404d-be3a-cf4265de00f7",
    "title": "Verification of Boyle's Law of Ideal Gases",
    "slug": "boyles-law-verification-ideal-gas",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 11",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Verify Boyle's Law (P × V = constant) at constant ambient room temperature using a Quill tube / Boyle's Law J-tube apparatus containing an enclosed dry air column.",
    "outcome": "The product of total absolute pressure P and air column volume V remains constant within 1.2% variance. The P versus 1/V graph is a straight line through the origin.",
    "materials": [
      "Boyle's Law Apparatus (Quill tube / graduated closed burette with mercury reservoir) × 1",
      "Fortin's Barometer (to record atmospheric pressure H in cm of Hg) × 1",
      "Pure clean Mercury (in closed apparatus) × 1",
      "Laboratory Thermometer (0-100°C) × 1",
      "Vertical Metric Scale & Plumb line × 1"
    ],
    "procedure": [
      "Record the ambient room temperature and atmospheric pressure (H) using the Fortin's barometer in cm of Hg.",
      "Check that the apparatus is set vertical with a plumb line.",
      "Adjust the open mercury tube to bring the mercury levels in both limbs to the same height (gauge pressure = 0).",
      "Note the initial length of the enclosed dry air column (l1), which is proportional to volume V1.",
      "Raise the open tube by 5 cm to increase the pressure. Record the difference in mercury levels (h) and new air column length (l).",
      "Calculate total pressure P = H + h and compute product P × l.",
      "Lower the open tube below the closed tube by several steps to take negative gauge pressure readings (P = H - h) and verify P × V = constant."
    ],
    "precautions": [
      "The air enclosed in the tube must be completely dry (moisture causes vapor pressure deviations).",
      "Wait at least 2 minutes after adjusting mercury levels so gas temperature returns to room temperature.",
      "Never touch the enclosed gas bulb/tube with bare hands during readings to avoid heating.",
      "Take readings at the top of the mercury meniscus with eyes at the same horizontal level."
    ],
    "learning_objectives": [
      "Understand isothermal gas behavior and the kinetic theory of ideal gases.",
      "Distinguish between absolute pressure, atmospheric pressure, and gauge pressure.",
      "Graphically evaluate Boyle's constant P·V = k."
    ],
    "tags": [
      "Boyle's Law",
      "Thermodynamics",
      "Ideal Gas",
      "Kinetic Theory",
      "Class 11 Physics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 88,
    "status": "published",
    "duration": "45 Mins",
    "views": 1056,
    "likes": 704,
    "rating": 4.8999999999999995
  },
  {
    "id": "dd3ced12-41c0-4ae1-97ea-3597e8c82941",
    "title": "Precision Measurement via Vernier Caliper and Screw Gauge",
    "slug": "vernier-caliper-screw-gauge-precision-measurement",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 11",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Measure the internal diameter, external diameter, and depth of a calorimeter using a Vernier Caliper, and measure the diameter of a thin wire using a Micrometer Screw Gauge.",
    "outcome": "Computed least count of Vernier Caliper is 0.01 cm and Screw Gauge is 0.001 cm (10 μm). Volume of cylinder and wire cross-sectional area are measured to 4 significant figures.",
    "materials": [
      "Standard Vernier Caliper (0.1 mm least count) × 1",
      "Micrometer Screw Gauge (0.01 mm least count, 50/100 divisions) × 1",
      "Hollow Metallic Cylinder / Calorimeter with lid × 1",
      "Thin copper/brass resistance wire sample × 1",
      "Glass plate / irregular lead shot × 1",
      "Magnifying glass lens × 1"
    ],
    "procedure": [
      "Determine the value of one main scale division (MSD) and total Vernier scale divisions (VSD) to calculate Vernier Least Count = 1 MSD - 1 VSD.",
      "Inspect the instrument with jaws closed to record any positive or negative zero error.",
      "Place the cylinder between the lower jaws to measure external diameter across three different orientations.",
      "Insert upper internal jaws inside the cylinder mouth to measure internal diameter.",
      "Use the rear depth probe strip to measure the internal depth of the cylinder.",
      "Switch to the Screw Gauge: determine pitch = distance moved / full rotations and least count = pitch / circular divisions.",
      "Clamp the thin wire between anvil and spindle using the ratchet stop until 3 clicks are heard, and compute mean corrected diameter."
    ],
    "precautions": [
      "Never over-tighten the screw gauge spindle; always use the ratchet head to ensure uniform contact pressure.",
      "Account for zero error with appropriate algebraic sign before reporting final measurements.",
      "Take measurements at multiple positions and perpendicular diameters to eliminate non-circularity errors.",
      "Avoid parallax while aligning coinciding Vernier divisions."
    ],
    "learning_objectives": [
      "Calculate least count and zero correction for linear and circular vernier mechanisms.",
      "Handle significant figures, instrumental limits, and random error reduction through averaging.",
      "Determine physical dimensions and derive 3D geometric volumes."
    ],
    "tags": [
      "Measurement",
      "Vernier Caliper",
      "Screw Gauge",
      "Class 11 Physics",
      "Practical Lab"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 91,
    "status": "published",
    "duration": "40 Mins",
    "views": 1092,
    "likes": 728,
    "rating": 4.8999999999999995
  },
  {
    "id": "1b58e6d5-a9ee-475c-b102-10e0ef321418",
    "title": "Velocity of Sound in Air using Resonance Tube",
    "slug": "resonance-tube-velocity-of-sound",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 11",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Determine the speed of sound in air at room temperature using a resonance column tube apparatus and a set of standard tuning forks of known frequencies.",
    "outcome": "First and second resonance air column lengths yield sound velocity v = 2f(l2 - l1) = 343.4 m/s at 22°C, matching theoretical acoustic speed within 0.8% error.",
    "materials": [
      "Resonance Tube Apparatus with water reservoir and pinch cock × 1",
      "Set of Tuning Forks of known frequencies (256 Hz, 384 Hz, 480 Hz, 512 Hz) × 1 set",
      "Rubber Striking Pad / Mallet × 1",
      "Laboratory Thermometer (0-50°C) × 1",
      "Metre scale & Plumb line × 1",
      "Water jug × 1"
    ],
    "procedure": [
      "Level the resonance tube apparatus and fill the reservoir with clean water.",
      "Strike the tuning fork of highest frequency (e.g. 512 Hz) against the rubber pad to set its prongs in vibration.",
      "Hold the vibrating prongs horizontally about 1 cm above the open end of the glass resonance tube.",
      "Slowly lower the water level by releasing the pinch cock until a loud sound (first resonance) is distinctly heard.",
      "Pinpoint the water meniscus reading for first resonance length (l1).",
      "Lower the water level further until the sound swells loudly again at the second resonance position (l2 ≈ 3l1).",
      "Calculate velocity v = 2f(l2 - l1) which eliminates end correction (e = (l2 - 3l1)/2). Repeat for two other tuning forks."
    ],
    "precautions": [
      "Never strike the tuning fork on metallic or hard surfaces; use only the rubber pad.",
      "Hold vibrating prongs horizontally along the tube diameter without touching the glass rim.",
      "Locate the resonance peak carefully by raising and lowering the water meniscus around the maximum.",
      "Record room air temperature to correct the experimental sound velocity to 0°C (v0 = vt - 0.61t)."
    ],
    "learning_objectives": [
      "Understand stationary sound waves, nodes, and antinodes in closed organ pipes.",
      "Apply resonance principles to eliminate tube end-correction errors experimentally.",
      "Relate acoustic velocity, wave frequency, and wavelength: v = f·λ."
    ],
    "tags": [
      "Acoustics",
      "Resonance Tube",
      "Speed of Sound",
      "Waves",
      "Class 11 Physics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 89,
    "status": "published",
    "duration": "50 Mins",
    "views": 1068,
    "likes": 712,
    "rating": 5
  },
  {
    "id": "2357c24d-bf7c-4f62-bad3-726dcaadb9f8",
    "title": "Internal Resistance of Primary Cell via Potentiometer",
    "slug": "internal-resistance-primary-cell-potentiometer",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 60,
    "description": "Determine the internal resistance (r) of a primary Leclanché/Daniel cell using a high-precision 10-wire electrical potentiometer.",
    "outcome": "Internal resistance r = R(l1 - l2)/l2 of the primary Leclanché cell is measured accurately as 1.45 Ω ± 0.05 Ω without drawing active current during open-circuit null balance.",
    "materials": [
      "10-Wire Potentiometer board with uniform resistance wires × 1",
      "Storage Accumulator (Lead-Acid / Regulated 4V DC supply) × 1",
      "Leclanché Cell / Dry Cell (primary test cell) × 1",
      "Sensitive Galvanometer with high resistance protection × 1",
      "Standard Resistance Box (1 to 20 Ω) × 1",
      "High Resistance Box (10,000 Ω) × 1",
      "Jockey, 2 one-way plug keys, and connecting wires × 1 set"
    ],
    "procedure": [
      "Connect the auxiliary driver circuit: battery positive to terminal A of potentiometer, negative through rheostat and key K1 to terminal B.",
      "Connect primary cell positive to terminal A, negative to galvanometer, high resistance, and jockey.",
      "Connect a shunt resistance box R in parallel across the primary cell via key K2.",
      "Keep K2 open (cell on open circuit). Touch jockey along wires to find balancing length l1 where galvanometer deflection is zero (emf balance).",
      "Close key K2 with a resistance R = 5 Ω unplugged in the shunt box.",
      "Find the new balancing length l2 where null deflection is achieved (terminal voltage balance).",
      "Compute internal resistance r = R × (l1 - l2) / l2 across 5 different shunt resistor values (2Ω, 4Ω, 6Ω, 8Ω, 10Ω)."
    ],
    "precautions": [
      "Electromotive force (emf) of the auxiliary driver battery must be strictly greater than that of the test primary cell.",
      "Positive terminals of both the driver battery and primary cell must connect to the same starting terminal (A).",
      "Jockey must never be dragged along potentiometer wires; press lightly to preserve uniform wire diameter.",
      "Ensure balance length l1 > l2 is always observed."
    ],
    "learning_objectives": [
      "Understand the zero-current null measurement advantage of potentiometers over voltmeters.",
      "Distinguish between open-circuit EMF (E) and closed-circuit terminal voltage (V).",
      "Derive and compute cell internal resistance from balancing lengths."
    ],
    "tags": [
      "Potentiometer",
      "Internal Resistance",
      "Current Electricity",
      "Class 12 Physics",
      "Null Method"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 93,
    "status": "published",
    "duration": "60 Mins",
    "views": 1116,
    "likes": 744,
    "rating": 4.8
  },
  {
    "id": "707975d7-5803-4976-a257-02e6e9b8f8c4",
    "title": "Faraday's Law of Electromagnetic Induction",
    "slug": "faradays-law-electromagnetic-induction-coil",
    "subject": "Physics",
    "subject_slug": "physics",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Investigate electromagnetic induction by demonstrating that relative motion between a bar magnet and a solenoid coil induces an electromotive force (EMF) and current according to Faraday's Law.",
    "outcome": "Induced voltage is directly proportional to the rate of change of magnetic flux (dΦ/dt) and number of turns (N). Deflection reverses when magnet polarity or direction is reversed, verifying Lenz's Law.",
    "materials": [
      "Insulated Copper Solenoid Coils (100 turns, 500 turns, 1000 turns) × 1 set",
      "Strong Neodymium Bar Magnets (N-S marked) × 2",
      "Center-zero Micro-Galvanometer (±30 divisions) × 1",
      "Connecting Wires with banana/alligator clips × 1 set",
      "Soft iron core rod × 1",
      "Digital Multimeter / Oscilloscope (optional for waveform visualization) × 1"
    ],
    "procedure": [
      "Connect the terminals of the 500-turn coil directly to the center-zero galvanometer without any battery in the circuit.",
      "Hold the bar magnet at rest inside the coil and observe the galvanometer needle (indicates strictly 0 deflection).",
      "Thrust the North pole of the magnet quickly into the coil: note the instantaneous deflection to the right.",
      "Hold the magnet stationary inside: needle returns to zero immediately.",
      "Withdraw the North pole rapidly from the coil: needle deflects in the opposite direction (left).",
      "Repeat with the South pole entering first: observe deflection opposite to the North pole entry.",
      "Vary insertion speed and switch to the 1000-turn coil and soft-iron core to observe proportionally larger deflections."
    ],
    "precautions": [
      "Keep powerful neodymium magnets away from electronic smartwatches, credit cards, and computers.",
      "Ensure coil connection wires do not move or flex during magnet thrusts to avoid contact noise.",
      "Use center-zero galvanometer with appropriate sensitivity to prevent pointer slamming against limits.",
      "Perform trials with uniform deliberate speed strokes."
    ],
    "learning_objectives": [
      "Formulate Faraday's Law: ε = -N(dΦ/dt).",
      "Verify Lenz's Law of conservation of energy in electromagnetic systems.",
      "Analyze factors influencing induced EMF: magnetic field strength, coil turns, and relative velocity."
    ],
    "tags": [
      "Electromagnetic Induction",
      "Faraday's Law",
      "Lenz's Law",
      "Magnetism",
      "Class 12 Physics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 97,
    "status": "published",
    "duration": "45 Mins",
    "views": 1164,
    "likes": 776,
    "rating": 4.8999999999999995
  },
  {
    "id": "84d65ede-a90d-4c29-9ee6-525648c59dd1",
    "title": "Acid-Base Titration: Standardizing HCl with 0.1M NaOH",
    "slug": "acid-base-titration-hcl-naoh",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 11",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Determine the strength and molarity of a given Hydrochloric Acid (HCl) solution by titrating against a standard 0.1 M Sodium Hydroxide (NaOH) solution using phenolphthalein indicator.",
    "outcome": "Equivalence point reached when solution turns faintly pink lasting 30 seconds. Concordant burette readings determine the exact concentration of HCl as 0.098 M.",
    "materials": [
      "Standard 0.1 M NaOH Solution × 250 mL",
      "Unknown HCl Solution × 250 mL",
      "Phenolphthalein Indicator Solution × 1 dropper bottle",
      "Burette (50 mL, 0.1 mL graduation) with clamp stand × 1",
      "Volumetric Pipette (20 mL or 25 mL) with safety bulb × 1",
      "Conical Flasks (250 mL) × 2",
      "Glass Funnel, Wash Bottle with Distilled Water × 1 set",
      "White porcelain tile × 1"
    ],
    "procedure": [
      "Rinse and fill the burette with standard 0.1 M NaOH solution, ensuring no air bubbles in the jet.",
      "Adjust the NaOH meniscus to exactly 0.0 mL with the bottom of the curve touching the mark.",
      "Rinse a 20 mL pipette with the unknown HCl solution and pipette exactly 20.0 mL into a clean conical flask.",
      "Add 2 to 3 drops of phenolphthalein indicator into the flask (solution remains colorless in acidic medium).",
      "Place the flask on the white tile below the burette tip to observe sharp color transitions.",
      "Add NaOH dropwise while swirling constantly until a single drop imparts a permanent pale pink tint.",
      "Record the final burette reading. Repeat the titration until three concordant burette readings (±0.05 mL) are obtained."
    ],
    "precautions": [
      "Always remove the glass funnel from the top of the burette before taking readings to avoid dripping.",
      "Ensure no trapped air bubble remains in the burette stopcock nozzle.",
      "Do not blow out the last drop remaining in the pipette tip; it is calibrated for retention.",
      "Use only 2-3 drops of indicator; excessive indicator consumes titrant and skews the endpoint."
    ],
    "learning_objectives": [
      "Master quantitative volumetric analysis and burette meniscus readings.",
      "Understand acid-base neutralization stoichiometry: M1·V1 = M2·V2.",
      "Identify sharp equivalence endpoints using pH indicator transition intervals."
    ],
    "tags": [
      "Titration",
      "Volumetric Analysis",
      "Neutralization",
      "Class 11 Chemistry",
      "Physical Chemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 99,
    "status": "published",
    "duration": "45 Mins",
    "views": 1188,
    "likes": 792,
    "rating": 4.8
  },
  {
    "id": "3ca9eef1-351f-4199-9a32-4654a47142f7",
    "title": "Redox Titration: Potassium Permanganate vs Mohr's Salt",
    "slug": "redox-titration-kmno4-mohrs-salt",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 50,
    "description": "Determine the molarity and strength of Potassium Permanganate (KMnO4) solution by titrating against a standard 0.05 M solution of Mohr's Salt [FeSO4·(NH4)2SO4·6H2O] in acidic medium.",
    "outcome": "KMnO4 acts as its own self-indicator (Mn7+ reduced to colorless Mn2+). Concordant endpoint reached when excess drop produces a persistent faint pink color, yielding KMnO4 molarity of 0.020 M.",
    "materials": [
      "Standard 0.05 M Mohr's Salt Solution × 250 mL",
      "Potassium Permanganate (KMnO4) Solution (~0.02 M) × 250 mL",
      "Dilute Sulfuric Acid (2 M H2SO4) × 100 mL",
      "50 mL Burette with Burette Stand × 1",
      "20 mL Volumetric Pipette × 1",
      "Conical Flask (250 mL) & White Tile × 1",
      "Distilled water wash bottle × 1"
    ],
    "procedure": [
      "Rinse and fill the burette with the dark purple KMnO4 solution. Read the upper meniscus level.",
      "Pipette out 20.0 mL of standard 0.05 M Mohr's salt solution into a clean conical flask.",
      "Add one full test tube (~20 mL) of 2 M dilute sulfuric acid into the conical flask to ensure acidic medium.",
      "No external indicator is needed since KMnO4 is a self-indicator.",
      "Titrate by adding KMnO4 dropwise while swirling. The purple color discharges immediately upon contact with Fe2+.",
      "Continue titrating until a single drop gives a permanent, distinct pale pink color that persists for 30 seconds.",
      "Note the concordant volume of KMnO4 and apply the redox equation: 5 Fe2+ + MnO4- + 8 H+ -> 5 Fe3+ + Mn2+ + 4 H2O."
    ],
    "precautions": [
      "For dark purple KMnO4, read the upper meniscus of the burette level at eye line.",
      "Always use dilute H2SO4; never use HCl (oxidized to chlorine) or HNO3 (competing oxidizing agent).",
      "Mohr's salt solution must be freshly prepared to avoid aerial oxidation of Fe2+ to Fe3+.",
      "Keep endpoint strictly to faint pink; dark purple indicates over-titration error."
    ],
    "learning_objectives": [
      "Understand oxidation-reduction electron transfer mechanisms in quantitative titrations.",
      "Recognize self-indicator action of transition metal ions (MnO4-).",
      "Calculate solution molarity and strength in grams per liter using stoichiometric ratios."
    ],
    "tags": [
      "Redox Titration",
      "KMnO4",
      "Mohr's Salt",
      "Class 12 Chemistry",
      "CBSE Chemistry Lab"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1603555501671-8f96b3fce8e4?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 97,
    "status": "published",
    "duration": "50 Mins",
    "views": 1164,
    "likes": 776,
    "rating": 4.8999999999999995
  },
  {
    "id": "0383321d-f48e-46bf-9179-07ed1b46a137",
    "title": "Systematic Qualitative Salt Analysis: Cation & Anion Detection",
    "slug": "qualitative-salt-analysis-cation-anion",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 60,
    "description": "Systematically analyze an unknown inorganic salt to identify one acid radical (anion) and one basic radical (cation) through preliminary and confirmatory wet tests.",
    "outcome": "Anion confirmed as Sulfate (SO4²⁻) via white BaSO4 precipitate insoluble in conc. HCl. Cation confirmed as Lead (Pb²⁺) via golden yellow PbI2 spangles test.",
    "materials": [
      "Unknown Inorganic Salt Sample (Lead Sulfate / Lead Nitrate) × 5 g",
      "Dilute and Concentrated HCl, H2SO4, and HNO3 × 1 set",
      "Barium Chloride (BaCl2) Solution × 50 mL",
      "Potassium Iodide (KI) Solution × 50 mL",
      "Potassium Chromate (K2CrO4) Solution × 50 mL",
      "Test Tubes with Stand, Test Tube Holder, & Boiling Tube × 1 set",
      "Bunsen Burner & Platinum/Nichrome wire for flame test × 1"
    ],
    "procedure": [
      "Preliminary physical examination: record salt color, crystalline/amorphous state, and odor.",
      "Dry heating test: heat a pinch of salt in a dry test tube; observe decrepitation, sublimation, or gas evolution.",
      "Flame test: prepare a paste with conc. HCl on a nichrome wire loop and introduce into non-luminous flame.",
      "Anion detection: test salt with dil. H2SO4 (carbonate/sulfite group), then conc. H2SO4 (chloride/nitrate group).",
      "Wet test for sulfate: dissolve salt in water, add BaCl2 solution to obtain a thick white BaSO4 precipitate.",
      "Prepare original solution (O.S.) for cation group separation: add dil. HCl to precipitate Group I (Pb²⁺ as white PbCl2).",
      "Boil PbCl2 with water and divide: add KI solution to observe bright yellow PbI2 precipitation forming golden spangles upon cooling."
    ],
    "precautions": [
      "Always add concentrated acids dropwise along the inner wall of the test tube; never look down into the tube.",
      "Never point the mouth of a heated boiling tube towards yourself or neighboring students.",
      "Wash nichrome loop with conc. HCl until it produces no persistent color in the flame before testing.",
      "Use clean test tubes rinsed with distilled water for confirmatory wet tests."
    ],
    "learning_objectives": [
      "Master systematic qualitative scheme of cation group separation (Groups 0 to VI).",
      "Understand selective precipitation through solubility product (Ksp) and common ion effect.",
      "Formulate ionic reaction equations for analytical confirmatory tests."
    ],
    "tags": [
      "Salt Analysis",
      "Qualitative Analysis",
      "Inorganic Chemistry",
      "Class 12 Lab",
      "CBSE Practicals"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "60 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "c8a43713-9ab9-4df3-819f-890ff4a2b7d1",
    "title": "Preparation of Standard 0.1 M Oxalic Acid Solution",
    "slug": "preparation-standard-oxalic-acid-solution",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 11",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Prepare 250 mL of standard 0.1 M primary standard solution of hydrated Oxalic Acid [(COOH)2·2H2O] using an analytical balance and volumetric flask.",
    "outcome": "Successfully weighed exactly 3.151 g of oxalic acid crystals and prepared 250.0 mL of standard 0.100 M primary solution for analytical titrations.",
    "materials": [
      "Hydrated Oxalic Acid crystals [(COOH)2·2H2O, M.W. = 126.07 g/mol] × 1 bottle",
      "Digital Analytical Balance (precision 0.001 g) × 1",
      "Volumetric Measuring Flask (250 mL with glass stopper) × 1",
      "Clean Dry Watch Glass & Spatula × 1",
      "Glass Funnel and Stirring Rod × 1",
      "Wash bottle with double-distilled water × 1",
      "Beaker (100 mL) × 1"
    ],
    "procedure": [
      "Calculate mass required: Mass = Molarity × Molar Mass × Volume (L) = 0.1 × 126.07 × 0.250 = 3.151 g.",
      "Weigh a clean, dry watch glass on the digital balance and tare to 0.000 g.",
      "Carefully weigh out exactly 3.151 g of pure oxalic acid crystals using a dry spatula.",
      "Transfer crystals into a 100 mL beaker through a glass funnel. Rinse the watch glass with distilled water into the beaker.",
      "Add ~50 mL distilled water to the beaker and stir with a glass rod until crystals dissolve completely.",
      "Transfer solution quantitatively into the 250 mL volumetric flask using the funnel and rinse beaker 3 times.",
      "Make up the volume with distilled water dropwise until the lower meniscus touches the 250 mL graduation mark, stopper and invert 10 times to homogenize."
    ],
    "precautions": [
      "Do not touch chemical crystals or weighing balance pan with bare hands.",
      "Ensure all transfers are quantitative: wash funnel and beaker walls thoroughly into the flask.",
      "Avoid overshooting the graduation mark; if overfilled, the standard solution must be discarded and remade.",
      "Oxalic acid is a toxic organic acid; avoid skin contact and wash spills immediately."
    ],
    "learning_objectives": [
      "Understand criteria of a primary standard substance (high purity, known formula, stable in air).",
      "Operate precision analytical balances and volumetric glassware according to GLP standards.",
      "Calculate molecular concentration, equivalents, and dilution factors."
    ],
    "tags": [
      "Standard Solution",
      "Oxalic Acid",
      "Volumetric Preparation",
      "Class 11 Chemistry",
      "Analytical Chemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 90,
    "status": "published",
    "duration": "35 Mins",
    "views": 1080,
    "likes": 720,
    "rating": 4.8
  },
  {
    "id": "5c98dbf7-d5cb-46f0-afaa-badf9e4b58da",
    "title": "pH Determination of Common Solutions using Universal Indicator",
    "slug": "ph-determination-universal-indicator-solutions",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 30,
    "description": "Determine the pH values of various everyday and laboratory solutions (lemon juice, vinegar, saliva, baking soda, NaOH, HCl) using pH paper strips and a calibrated pH meter.",
    "outcome": "Constructed the standard color-coded pH scale (1 to 14). Identified lemon juice as pH 2.2 (strongly acidic), distilled water as pH 7.0 (neutral), and NaOH as pH 13.5 (strongly basic).",
    "materials": [
      "Broad-range Universal Indicator Paper strips with standard color chart × 1 box",
      "Test solutions: Dilute HCl, Dilute NaOH, Ethanoic acid (vinegar), Lemon juice, NaHCO3 solution, Distilled water × 20 mL each",
      "Clean porcelain spot plate / series of test tubes × 1 set",
      "Glass dropper pipettes × 6",
      "Digital Pocket pH Pen Meter with calibration buffer packets × 1"
    ],
    "procedure": [
      "Place clean porcelain spot plate on a clean white surface.",
      "Tear small 1 cm strips of broad-range universal pH paper and place one strip in each well.",
      "Using a clean dropper, apply 1 drop of dilute HCl onto the first strip and observe the instantaneous color change.",
      "Compare the developed red color immediately with the standard pH reference chart to read pH ≈ 1.",
      "Repeat the test with lemon juice (reddish orange, pH ~2), vinegar (orange, pH ~3), distilled water (green, pH ~7), baking soda (blue-green, pH ~8.5), and dilute NaOH (deep violet, pH ~13).",
      "Cross-check readings using the digital pH electrode rinsed with distilled water between samples.",
      "Tabulate solution name, observed color, inferred pH, and acidic/basic nature."
    ],
    "precautions": [
      "Use a separate clean dropper for each solution to prevent cross-contamination.",
      "Do not touch active indicator paper test zones with fingers.",
      "Read the color immediately within 10-15 seconds before drying alters the hue.",
      "Rinse pH meter glass electrode thoroughly with distilled water and blot dry with lint-free tissue between tests."
    ],
    "learning_objectives": [
      "Understand the logarithmic pH scale: pH = -log10[H+].",
      "Correlate hydrogen ion concentration with indicator color transitions.",
      "Classify everyday household and chemical substances into acidic, neutral, and alkaline domains."
    ],
    "tags": [
      "pH Scale",
      "Acids and Bases",
      "Universal Indicator",
      "Class 10 Chemistry",
      "Experiential Science"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 94,
    "status": "published",
    "duration": "30 Mins",
    "views": 1128,
    "likes": 752,
    "rating": 4.8999999999999995
  },
  {
    "id": "910370a2-3579-4c90-8085-6ef4ede209b5",
    "title": "Chemical Reaction Kinetics: Sodium Thiosulfate and HCl",
    "slug": "reaction-kinetics-sodium-thiosulfate-hcl",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Investigate the effect of concentration on the rate of reaction between Sodium Thiosulfate (Na2S2O3) and Hydrochloric Acid (HCl) by timing the opacity created by colloidal sulfur.",
    "outcome": "Reaction rate (1/t) increases linearly with sodium thiosulfate concentration. The rate versus concentration plot is a straight line, confirming first-order kinetics with respect to thiosulfate.",
    "materials": [
      "0.1 M Sodium Thiosulfate (Na2S2O3) solution × 300 mL",
      "1.0 M Hydrochloric Acid (HCl) solution × 100 mL",
      "Conical Flask (100 mL) × 1",
      "Measuring Cylinders (10 mL and 50 mL) × 2",
      "White paper tile with a bold black cross mark (X) × 1",
      "Digital Stopwatch (least count 0.01 s) × 1",
      "Distilled water wash bottle × 1"
    ],
    "procedure": [
      "Draw a bold black cross 'X' on a white sheet of paper and place the conical flask directly over it.",
      "Measure 50 mL of 0.1 M Na2S2O3 into the flask.",
      "Measure 5.0 mL of 1.0 M HCl; pour it rapidly into the flask and start the stopwatch immediately.",
      "Swirl the flask once and look down vertically through the liquid at the cross mark.",
      "As colloidal sulfur precipitates (Na2S2O3 + 2HCl -> 2NaCl + SO2 + S↓ + H2O), the solution turns milky yellow.",
      "Stop the stopwatch the exact moment the black cross mark becomes invisible. Record time (t).",
      "Repeat the experiment using 40 mL, 30 mL, 20 mL, and 10 mL of thiosulfate diluted with water to maintain a constant 50 mL volume. Plot 1/t vs concentration."
    ],
    "precautions": [
      "Keep eye position directly above the mouth of the flask at a uniform distance for every trial.",
      "Use the same conical flask and black cross throughout the experiment for optical consistency.",
      "Rinse the conical flask thoroughly with distilled water between trials to remove trace sulfur.",
      "Conduct in a well-ventilated lab because sulfur dioxide (SO2) gas is produced."
    ],
    "learning_objectives": [
      "Understand collision theory and the effect of reactant concentration on reaction rates.",
      "Relate optical turbidity extinction time with reaction velocity: Rate ∝ 1/t.",
      "Determine reaction order from linear rate-concentration graphs."
    ],
    "tags": [
      "Chemical Kinetics",
      "Reaction Rate",
      "Sodium Thiosulfate",
      "Class 12 Chemistry",
      "Physical Chemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 91,
    "status": "published",
    "duration": "50 Mins",
    "views": 1092,
    "likes": 728,
    "rating": 4.8999999999999995
  },
  {
    "id": "9853b28e-4db9-41f1-a628-e4626badf78a",
    "title": "Paper Chromatography of Plant Pigments in Spinach Leaves",
    "slug": "paper-chromatography-plant-pigments",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 11",
    "difficulty": "Beginner",
    "duration_minutes": 45,
    "description": "Separate and identify photosynthetic leaf pigments (Chlorophyll a, Chlorophyll b, Xanthophyll, and Carotene) from fresh spinach extract using ascending paper chromatography.",
    "outcome": "Distinct color bands separated on Whatman paper strip: olive green (Chlorophyll b), blue green (Chlorophyll a), yellow (Xanthophyll), and orange-yellow (Carotene) with distinct Rf values.",
    "materials": [
      "Fresh Spinach Leaves × 50 g",
      "Chromatography Paper (Whatman No. 1, 20 cm × 3 cm strip) × 1",
      "Extraction Solvent: Acetone (analytical grade) × 20 mL",
      "Developing Solvent: Petroleum Ether and Acetone (9:1 ratio v/v) × 50 mL",
      "Mortar and Pestle with fine washed sand × 1 set",
      "Capillary tube / fine micropipette × 1",
      "Chromatography Developing Jar with airtight lid × 1"
    ],
    "procedure": [
      "Grind fresh spinach leaves with 10 mL acetone and a pinch of sand in a mortar to obtain a concentrated dark green extract.",
      "Cut Whatman chromatography paper into a strip 20 cm × 3 cm with a pointed V-shape at the bottom.",
      "Draw a faint pencil baseline 2 cm above the pointed edge.",
      "Using a fine capillary tube, apply a tiny drop of pigment extract on the center of the baseline and let dry.",
      "Repeat spotting 8-10 times over the exact same spot until a dark, concentrated green dot is formed.",
      "Pour 10 mL of developing solvent into the jar and suspend the paper so the tip dips into solvent while the spot remains 1 cm above the liquid.",
      "Cover the jar tightly; allow the solvent front to ascend 15 cm. Remove strip, mark solvent front, and calculate Retention Factors: Rf = distance traveled by pigment / distance traveled by solvent."
    ],
    "precautions": [
      "Keep the sample spot as small and concentrated as possible (< 3 mm diameter).",
      "Do not let the pigment spot immerse directly into the developing solvent pool.",
      "Keep chromatography jar strictly closed and undisturbed during solvent ascent.",
      "Work in a fume hood or away from open flames as petroleum ether and acetone are volatile and flammable."
    ],
    "learning_objectives": [
      "Understand principles of partition and adsorption chromatography.",
      "Calculate Rf (Retention Factor) values to identify separated phytochemical components.",
      "Relate molecular polarity with differential mobility in non-polar mobile phases."
    ],
    "tags": [
      "Chromatography",
      "Plant Pigments",
      "Separation Techniques",
      "Class 11 Chemistry",
      "Organic Chemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 93,
    "status": "published",
    "duration": "45 Mins",
    "views": 1116,
    "likes": 744,
    "rating": 4.8
  },
  {
    "id": "2e9130b9-af62-41fb-ac3d-9aa1abaac8f7",
    "title": "Preparation of Colloidal Sol & Tyndall Effect Demonstration",
    "slug": "preparation-colloidal-sol-tyndall-effect",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 40,
    "description": "Prepare a lyophilic starch sol and a lyophobic Ferric Hydroxide [Fe(OH)3] sol, and demonstrate light scattering (Tyndall Effect) using a red laser beam.",
    "outcome": "Stable wine-red Ferric Hydroxide sol and translucent starch sol prepared. Red laser beam exhibits clear brilliant Tyndall cone through both sols while remaining invisible in true aqueous NaCl solution.",
    "materials": [
      "Ferric Chloride (FeCl3) 2% w/v solution × 20 mL",
      "Soluble Starch Powder × 2 g",
      "Sodium Chloride (NaCl) crystals × 5 g",
      "Red Semiconductor Laser Pointer (650 nm) × 1",
      "Boiling Beakers (250 mL and 500 mL) × 2",
      "Bunsen Burner, Tripod stand, and Wire Gauze × 1 set",
      "Glass Rod and Dropper Pipette × 1"
    ],
    "procedure": [
      "Preparation of Starch Sol (Lyophilic): Make a smooth paste of 1 g starch in 10 mL cold water. Pour this paste slowly with vigorous stirring into 100 mL boiling distilled water. Boil for 2 minutes and cool.",
      "Preparation of Fe(OH)3 Sol (Lyophobic): Boil 100 mL distilled water in a beaker. Add 2% FeCl3 solution drop by drop using a dropper while boiling continuously.",
      "A deep wine-red/brown colloidal sol forms via hydrolysis: FeCl3 + 3 H2O -> Fe(OH)3(sol) + 3 HCl.",
      "Prepare a true solution of NaCl in 100 mL water as a control comparison.",
      "Darken the room. Pass the red laser beam horizontally through: (1) True NaCl solution, (2) Starch sol, (3) Fe(OH)3 sol.",
      "Observe that the laser path is invisible in true solution, but produces a brilliant illuminated optical cone (Tyndall Effect) in the colloidal sols."
    ],
    "precautions": [
      "Distilled water must be boiling vigorously when adding FeCl3 dropwise to prevent coarse precipitation.",
      "Never point the laser beam towards anyone's eyes.",
      "Apparatus must be scrupulously clean; electrolyte traces can coagulate lyophobic sols.",
      "Starch paste must be lump-free before addition to boiling water."
    ],
    "learning_objectives": [
      "Differentiate between true solutions, colloidal dispersions, and suspensions.",
      "Understand lyophilic versus lyophobic colloidal stability mechanisms.",
      "Observe and explain optical scattering (Tyndall Effect) in dispersed colloidal systems."
    ],
    "tags": [
      "Surface Chemistry",
      "Colloids",
      "Tyndall Effect",
      "Class 12 Chemistry",
      "Physical Chemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 88,
    "status": "published",
    "duration": "40 Mins",
    "views": 1056,
    "likes": 704,
    "rating": 4.8999999999999995
  },
  {
    "id": "d9c08be5-2de8-47c6-a493-2f2eab43d285",
    "title": "Systematic Tests for Organic Functional Groups",
    "slug": "organic-functional-group-tests",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Perform characteristic chemical diagnostic tests to detect the presence of Carbonyl (Aldehyde/Ketone), Carboxylic Acid, and Alcoholic functional groups in organic compounds.",
    "outcome": "Aldehyde confirmed via Tollens' test yielding a shiny reflective silver mirror on glass walls; Carboxylic acid confirmed via vigorous effervescence of CO2 gas with sodium bicarbonate.",
    "materials": [
      "Organic test samples: Formaldehyde/Acetaldehyde, Acetone, Acetic acid, Ethanol × 20 mL each",
      "Tollens' Reagent (Ammoniacal Silver Nitrate, freshly prepared) × 20 mL",
      "Fehling's Solution A and Fehling's Solution B × 30 mL each",
      "Sodium Bicarbonate (NaHCO3) 10% solution × 30 mL",
      "Neutral Ferric Chloride (FeCl3) solution × 20 mL",
      "Ceric Ammonium Nitrate reagent × 15 mL",
      "Test tubes, test tube holder, water bath, and burner × 1 set"
    ],
    "procedure": [
      "Tollens' Silver Mirror Test for Aldehydes: Add 2 mL freshly prepared Tollens' reagent to 1 mL aldehyde sample in a clean test tube. Warm gently in a 60°C water bath for 5 minutes without shaking. A brilliant silver mirror coats the tube wall.",
      "Fehling's Test for Aldehydes: Mix equal volumes (1 mL each) of Fehling's A and B. Add 1 mL sample and heat in boiling water bath. A red precipitate of Cuprous Oxide (Cu2O) confirms aldehyde.",
      "Sodium Bicarbonate Test for Carboxylic Acid: Add 1 mL saturated NaHCO3 to 1 mL acetic acid sample. Immediate brisk effervescence occurs; pass the gas through lime water to turn it milky (confirms CO2).",
      "Esterification Test: Warm 1 mL ethanol, 1 mL acetic acid, and 2 drops conc. H2SO4; pour into water to detect characteristic fruity pleasant aroma of ethyl acetate.",
      "Ceric Ammonium Nitrate Test for Alcohols: Add reagent to sample; red color confirms aliphatic alcohol."
    ],
    "precautions": [
      "Always prepare Tollens' reagent freshly; do not store as it forms explosive silver fulminate on standing.",
      "Use warm water baths instead of direct flames when heating flammable organic liquids.",
      "Discard silver mirror residues immediately by dissolving in dilute nitric acid.",
      "Neutralize acidic and alkaline waste before disposal."
    ],
    "learning_objectives": [
      "Identify reactive functional groups using specific chemical diagnostic reagents.",
      "Formulate redox and condensation reaction equations for aldehydes, acids, and alcohols.",
      "Relate molecular structural features to observed chemical reactivity."
    ],
    "tags": [
      "Organic Chemistry",
      "Functional Groups",
      "Tollens Test",
      "Class 12 Chemistry",
      "Diagnostic Tests"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 95,
    "status": "published",
    "duration": "50 Mins",
    "views": 1140,
    "likes": 760,
    "rating": 5
  },
  {
    "id": "8d3edf3a-b147-4ea8-8323-c267e5939a8c",
    "title": "Enthalpy of Neutralization Calorimetry: Strong Acid & Strong Base",
    "slug": "enthalpy-of-neutralization-calorimetry",
    "subject": "Chemistry",
    "subject_slug": "chemistry",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 50,
    "description": "Determine the enthalpy of neutralization of a strong acid (1.0 M HCl) with a strong base (1.0 M NaOH) using a polystyrene coffee cup calorimeter.",
    "outcome": "Temperature rise of 6.7°C measured. Heat released yields enthalpy of neutralization ΔH = -56.8 kJ/mol, matching theoretical standard thermodynamic value (-57.1 kJ/mol) within 0.7% error.",
    "materials": [
      "1.0 M Hydrochloric Acid (HCl) solution × 150 mL",
      "1.0 M Sodium Hydroxide (NaOH) solution × 150 mL",
      "Expanded Polystyrene (Styrofoam) Cup Calorimeter with lid × 1",
      "Precision Beckman/Digital Thermometer (0.01°C least count) × 1",
      "Calorimeter Plastic Stirrer × 1",
      "Graduated Cylinders (100 mL) × 2",
      "Distilled water wash bottle × 1"
    ],
    "procedure": [
      "Determine calorimeter water equivalent (W) using hot and cold water mixing method.",
      "Measure exactly 100 mL of 1.0 M HCl in a graduated cylinder and transfer to the calorimeter cup.",
      "Measure exactly 100 mL of 1.0 M NaOH in another cylinder. Place both solutions side by side until both reach the exact same initial temperature (T1).",
      "Record initial temperature T1 to 0.1°C precision.",
      "Pour the 100 mL NaOH quickly into the calorimeter cup containing HCl.",
      "Immediately replace the insulated lid, insert the thermometer and stirrer, and stir smoothly.",
      "Record the temperature every 15 seconds until it reaches a maximum peak (T2) and begins to fall. Calculate ΔH = -[m·c + W]·(T2 - T1) / n."
    ],
    "precautions": [
      "Mix acid and base rapidly without splashing to minimize early heat dissipation.",
      "Stir gently and constantly to maintain uniform thermal equilibrium throughout the mixture.",
      "Ensure thermometer bulb is fully submerged in the liquid without touching the cup bottom or walls.",
      "Keep calorimeter cover tightly seated to avoid convective heat losses."
    ],
    "learning_objectives": [
      "Understand thermochemical principles and conservation of energy in chemical reactions.",
      "Operate constant-pressure calorimeters and calculate heat capacities.",
      "Explain why strong acid-strong base neutralizations share a constant ΔH ≈ -57.1 kJ/mol (formation of 1 mol H2O from H+ and OH-)."
    ],
    "tags": [
      "Thermochemistry",
      "Enthalpy of Neutralization",
      "Calorimetry",
      "Class 12 Chemistry",
      "Thermodynamics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 90,
    "status": "published",
    "duration": "50 Mins",
    "views": 1080,
    "likes": 720,
    "rating": 4.8
  },
  {
    "id": "abe9f719-a49e-4734-b52b-0bc08a4506c8",
    "title": "Temporary Mount of Onion Peel Epidermal Cells",
    "slug": "onion-peel-cell-microscopy",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 9",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Prepare a temporary stained mount of onion bulb epidermal peel and observe the structural organization of plant cells (cell wall, nucleus, cytoplasm, and vacuole) under a compound microscope.",
    "outcome": "Clear rectangular epidermal plant cells observed with distinct cell walls, prominent darkly-stained peripheral nuclei, and large central vacuoles.",
    "materials": [
      "Fresh Onion Bulb × 1",
      "Methylene Blue / Safranin Stain Solution (0.5%) × 1 dropper bottle",
      "Glycerine (pure laboratory grade) × 1 dropper bottle",
      "Compound Light Microscope (10x, 40x objectives) × 1",
      "Glass Microscope Slides & Cover Slips (No. 1 thickness) × 1 box",
      "Watch Glass, Forceps, Dissecting Needle, and Camel Hair Brush × 1 set",
      "Filter Paper / Blotting Paper strips × 1 pack"
    ],
    "procedure": [
      "Cut a fresh onion bulb and peel off a fleshy scale leaf.",
      "Bend the leaf inward until it snaps, then use fine forceps to gently peel off the thin, transparent inner epidermal membrane.",
      "Immediately transfer the epidermal peel into a watch glass containing water using a camel hair brush to prevent folding or drying.",
      "Add 2-3 drops of Safranin stain to the watch glass and let the peel stain for 2 minutes.",
      "Transfer peel to another watch glass of clean water to rinse off excess stain.",
      "Place the stained peel flat in the center of a clean glass slide and add a single drop of glycerine.",
      "Lower a clean coverslip gently at a 45° angle using a needle to prevent air bubble formation. Blot excess fluid and examine under 10x, then 40x."
    ],
    "precautions": [
      "Always use a camel hair brush to transfer delicate peels; forceps can tear or crush cell walls.",
      "Do not let the peel dry out at any stage of preparation.",
      "Lower the coverslip slowly to avoid trapping air bubbles (air bubbles appear as thick black-rimmed rings).",
      "Wipe off excess glycerine with blotting paper so microscope stage remains clean."
    ],
    "learning_objectives": [
      "Master the technique of preparing thin temporary mounts for biological microscopy.",
      "Identify core plant cell organelles: rigid cellulose cell wall, plasma membrane, nucleus, and central vacuole.",
      "Operate compound light microscopes with proper stage illumination."
    ],
    "tags": [
      "Cell Biology",
      "Microscopy",
      "Plant Cells",
      "Class 9 Biology",
      "NEP 2020 Experiential"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 98,
    "status": "published",
    "duration": "35 Mins",
    "views": 1176,
    "likes": 784,
    "rating": 5
  },
  {
    "id": "da207a82-ac24-4d67-9e57-6216fde56260",
    "title": "Mitosis in Onion Root Tip Cells via Squash Method",
    "slug": "mitosis-onion-root-tip-squash",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 55,
    "description": "Prepare temporary root tip squashes of Allium cepa to study and identify distinct stages of mitotic cell division (prophase, metaphase, anaphase, telophase).",
    "outcome": "Distinct mitotic stages clearly observed: condensed chromosome threads (Prophase), equatorial plate alignment (Metaphase), sister chromatid poleward separation (Anaphase), and nuclear reorganization (Telophase).",
    "materials": [
      "Freshly germinated Onion Root Tips (1-2 cm long) fixed in Carnoy's fluid (1:3 acetic alcohol) × 1 vial",
      "1N Hydrochloric Acid (HCl) × 20 mL",
      "Acetocarmine / Aceto-orcein Stain (2%) × 1 dropper bottle",
      "Compound Research Microscope (100x oil immersion objective) × 1",
      "Spirit Lamp / Bunsen Burner & Test Tube Holder × 1",
      "Glass Slides, Coverslips, Razor Blade, and Dissecting Needle × 1 set",
      "Blotting paper strips × 1 pack"
    ],
    "procedure": [
      "Cut 2-3 mm of the terminal actively growing apical meristem tip of the onion root.",
      "Place root tips in a watch glass containing 1N HCl and warm gently over a spirit lamp for 2 minutes to hydrolyze the pectin middle lamella.",
      "Discard acid, wash tips with water, and place on a clean glass slide.",
      "Add 1 drop of 2% acetocarmine stain, warm gently over flame without boiling, and allow to stain for 5 minutes.",
      "Add a small drop of 45% acetic acid, place a coverslip over the tissue.",
      "Cover the slide with a folded piece of blotting paper and press down firmly and vertically with the thumb to squash the meristem cells into a single monolayer.",
      "Observe under low power (10x) to locate dividing zones, then switch to high power (40x and 100x) to document mitotic stages."
    ],
    "precautions": [
      "Do not boil the root tips during acid hydrolysis or staining (boiling destroys chromosome morphology).",
      "Apply thumb pressure strictly vertically during squashing; avoid sideways slipping which twists and shears cells.",
      "Harvest root tips between 9:00 AM and 10:30 AM when mitotic index peaks in Allium cepa.",
      "Use only the terminal 2 mm apical tip containing active dividing meristem."
    ],
    "learning_objectives": [
      "Understand eukaryotic somatic cell cycle and chromosome segregation mechanics.",
      "Differentiate between interphase and the four sequential stages of mitosis.",
      "Master acid maceration and cytological staining squashes."
    ],
    "tags": [
      "Mitosis",
      "Cell Division",
      "Cytology",
      "Class 12 Biology",
      "Chromosomes"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "55 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "28a79657-42ed-45a3-82ef-8e791357cf9f",
    "title": "Demonstration of Osmosis using Potato Osmoscope",
    "slug": "osmosis-potato-osmoscope-demonstration",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Demonstrate endosmosis through living plant tissue using a potato tuber osmoscope containing concentrated sucrose solution placed in water.",
    "outcome": "Liquid level in the potato cavity rises significantly above the initial pin mark due to water entering from the petri dish (hypotonic) into the sucrose solution (hypertonic) across selectively permeable potato membranes.",
    "materials": [
      "Large healthy Potato Tuber × 1",
      "Concentrated Sucrose / Sugar Solution (20% w/v) colored with eosin/food coloring × 50 mL",
      "Petri Dish with distilled water × 1",
      "Scalpel / Kitchen Knife & Potato Corer × 1",
      "All-metal common pins × 2",
      "Petri dish and ruler × 1"
    ],
    "procedure": [
      "Peel the skin from the base and sides of a large fresh potato tuber.",
      "Slice the base flat so the potato stands upright steadily in the petri dish.",
      "Scoop out a deep rectangular cavity from the top with a scalpel, leaving a thin base wall (~5 mm thick).",
      "Fill the cavity halfway with colored 20% sucrose solution.",
      "Insert a common pin horizontally into the inner wall of the potato cavity to mark the initial liquid level.",
      "Place the potato osmoscope upright into a petri dish containing clean distilled water (water level below cavity brim).",
      "Leave the setup undisturbed for 2 hours, then observe and mark the final sugar solution level with a second pin."
    ],
    "precautions": [
      "The bottom wall of the potato cavity must be kept thin (3-5 mm) to facilitate measurable osmotic flux.",
      "Ensure the sucrose solution level inside the cavity is higher than the outside water level to prevent hydrostatic backpressure.",
      "Use living, fresh potato cells; boiled potatoes fail because boiling denatures plasma membranes.",
      "Color the sugar solution with a drop of dye to ensure clear visual tracking."
    ],
    "learning_objectives": [
      "Understand osmosis as the passive net movement of water across a selectively permeable membrane.",
      "Distinguish between hypotonic, isotonic, and hypertonic cellular environments.",
      "Recognize the role of turgor pressure and cell membrane integrity in plant water relations."
    ],
    "tags": [
      "Osmosis",
      "Plant Physiology",
      "Potato Osmoscope",
      "Class 10 Biology",
      "Hands-on Biology"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 92,
    "status": "published",
    "duration": "40 Mins",
    "views": 1104,
    "likes": 736,
    "rating": 5
  },
  {
    "id": "39513e7c-504f-4c80-8bcb-1604e53825e5",
    "title": "Measurement of Transpiration Rate using Ganong's Potometer",
    "slug": "transpiration-rate-ganongs-potometer",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 11",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Measure the rate of water absorption and transpiration in a leafy shoot using Ganong's Potometer under varying environmental conditions (still air, fan wind, bright sunlight).",
    "outcome": "Bubble travel velocity is fastest under bright light and breeze (0.85 cm/min) and slowest in humid shade (0.15 cm/min), demonstrating stomatal transpiration dynamics.",
    "materials": [
      "Ganong's Potometer apparatus with graduated capillary tube and water reservoir × 1",
      "Fresh leafy shoot (Coleus / Hibiscus / Nerium) cut underwater × 1",
      "Colored water / beaker with water × 1",
      "Stopwatch × 1",
      "Electric Table Fan & 100W Incandescent Lamp (for variable testing) × 1 set",
      "Vaseline / Petroleum jelly (for airtight seals) × 1 tub"
    ],
    "procedure": [
      "Fill the entire Ganong's potometer apparatus with water, ensuring zero trapped air bubbles in the capillary.",
      "Cut the base of a leafy shoot underwater at a slant with a sharp razor blade to prevent air embolism in xylem vessels.",
      "Insert the cut shoot tightly into the vertical rubber cork of the potometer.",
      "Apply petroleum jelly around all cork joints to ensure the entire apparatus is 100% airtight.",
      "Dip the bent end of the capillary into a beaker of colored water. Lift it briefly for a few seconds to introduce a single air bubble, then re-immerse.",
      "Record the time taken by the air bubble to travel 5 cm along the graduated capillary in normal room conditions.",
      "Reset the bubble using the reservoir stopcock and measure bubble movement under fan breeze and lamp illumination."
    ],
    "precautions": [
      "Cut the shoot underwater at a 45° angle to prevent air entering xylem vessels and blocking water uptake.",
      "The entire apparatus must be completely airtight; any leakage prevents bubble movement.",
      "Introduce only a single, compact air bubble into the capillary tube.",
      "Ensure leaves are dry before commencing measurements."
    ],
    "learning_objectives": [
      "Understand the transpiration pull mechanism and xylem sap ascent.",
      "Evaluate environmental factors influencing transpiration rates: humidity, temperature, air movement, and light.",
      "Operate volumetric potometer measurement systems."
    ],
    "tags": [
      "Transpiration",
      "Plant Physiology",
      "Potometer",
      "Class 11 Biology",
      "CBSE Biology"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 91,
    "status": "published",
    "duration": "50 Mins",
    "views": 1092,
    "likes": 728,
    "rating": 4.8999999999999995
  },
  {
    "id": "e64e76ca-2898-48fd-8f7c-9a1bdc25decc",
    "title": "Carbon Dioxide Release during Cellular Respiration in Seeds",
    "slug": "carbon-dioxide-release-seed-respiration",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Demonstrate that germinating gram/pea seeds release carbon dioxide (CO2) during aerobic respiration using an airtight conical flask with potassium hydroxide (KOH).",
    "outcome": "Water level in the bent delivery tube rises by 6.2 cm. KOH absorbs exhaled CO2, creating a partial vacuum inside the flask that draws water upward from the beaker.",
    "materials": [
      "Germinating Gram (Chana) / Moong Seeds × 50 g",
      "Conical Flask (250 mL) with single-bore rubber stopper × 1",
      "Small suspended test tube with thread × 1",
      "Potassium Hydroxide (KOH) 20% solution / pellets × 10 mL",
      "Bent Glass Delivery Tube (U-shaped) × 1",
      "Beaker with colored water × 1",
      "Petroleum jelly (Vaseline) for sealing × 1 tub"
    ],
    "procedure": [
      "Soak gram seeds in water overnight and keep in moist cloth for 24-48 hours to initiate active germination.",
      "Place 30-40 germinating seeds in a 250 mL conical flask.",
      "Suspend a small test tube containing freshly prepared 20% KOH solution inside the flask using a thread secured by the stopper.",
      "Insert a bent glass delivery tube through the airtight rubber stopper.",
      "Place the other open end of the delivery tube into a beaker containing colored water.",
      "Seal all stopper joints thoroughly with petroleum jelly to make the apparatus completely airtight.",
      "Mark the initial water level in the delivery tube and leave the setup undisturbed for 2 hours. Note the water rise."
    ],
    "precautions": [
      "Apparatus must be strictly airtight; any air leak will prevent the water column from rising.",
      "KOH solution must not spill onto the germinating seeds.",
      "Use actively germinating seeds with emerging radicles for high metabolic respiration rates.",
      "Ensure the delivery tube end is submerged well below the beaker water surface."
    ],
    "learning_objectives": [
      "Formulate the aerobic cellular respiration equation: C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ATP.",
      "Explain the chemical role of KOH as a selective carbon dioxide absorbent (2 KOH + CO2 -> K2CO3 + H2O).",
      "Demonstrate gas volume pressure differentials in biological respiration experiments."
    ],
    "tags": [
      "Respiration",
      "Germinating Seeds",
      "Metabolism",
      "Class 10 Biology",
      "NCERT Practicals"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 94,
    "status": "published",
    "duration": "40 Mins",
    "views": 1128,
    "likes": 752,
    "rating": 4.8999999999999995
  },
  {
    "id": "27df9539-946e-4b23-82e9-f0d45ed688a9",
    "title": "Light & Starch Test for Photosynthesis in Variegated Leaves",
    "slug": "photosynthesis-starch-test-iodine",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 45,
    "description": "Demonstrate that sunlight and chlorophyll are essential for photosynthesis using a destarched variegated Croton/Coleus leaf and the iodine-starch test.",
    "outcome": "Only green chlorophyll-bearing regions exposed to light turn blue-black with iodine; white and light-blocked areas remain pale yellow/brown, proving light and chlorophyll are essential.",
    "materials": [
      "Potted plant with variegated leaves (Croton / Coleus / Money Plant) × 1",
      "Ethanol / Methylated Spirit (95%) × 100 mL",
      "Lugol's Iodine Solution (1% I2 in KI) × 1 dropper bottle",
      "Black opaque paper strip and paper clips × 1 set",
      "Water Bath (500 mL beaker with boiling water) × 1",
      "Petri Dish and Forceps × 1 set",
      "Bunsen Burner, Tripod, and Wire Gauze × 1 set"
    ],
    "procedure": [
      "Destarch the potted variegated plant by keeping it in a dark room for 72 hours (respiration consumes stored leaf starch).",
      "Clip a strip of black paper across a healthy leaf to block light in that region.",
      "Place the plant in bright direct sunlight for 6 hours to allow photosynthesis to proceed.",
      "Pluck the test leaf and sketch its green and non-green patterns on paper for reference.",
      "Boil the leaf in water for 2 minutes to soften cell walls and denature enzymes.",
      "Transfer the leaf into a beaker of ethanol placed inside the boiling water bath until all green chlorophyll dissolves and the leaf turns chalky white.",
      "Wash leaf in warm water to soften it, spread in a petri dish, add dilute iodine solution, and observe blue-black color development."
    ],
    "precautions": [
      "Never heat ethanol directly over an open flame; always use a water bath (ethanol is highly flammable).",
      "Destarching in complete darkness for a full 48-72 hours is crucial to ensure baseline negative starch.",
      "Boil leaf thoroughly in alcohol until completely bleached so green pigment does not obscure iodine results.",
      "Handle hot glassware with beaker tongs."
    ],
    "learning_objectives": [
      "Understand autotrophic photosynthetic carbon fixation: 6 CO2 + 6 H2O -> C6H12O6 + 6 O2.",
      "Relate chlorophyll pigment distribution with primary starch synthesis locations.",
      "Apply iodine testing for macromolecular polysaccharide detection."
    ],
    "tags": [
      "Photosynthesis",
      "Chlorophyll",
      "Starch Test",
      "Class 10 Biology",
      "Plant Metabolism"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 97,
    "status": "published",
    "duration": "45 Mins",
    "views": 1164,
    "likes": 776,
    "rating": 4.8999999999999995
  },
  {
    "id": "3a6c5e9b-1665-46f4-8fa0-3bab2b14ee83",
    "title": "Isolation of Genomic DNA from Plant Material (Banana/Papaya)",
    "slug": "dna-isolation-plant-material",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 50,
    "description": "Extract and isolate genomic DNA from ripe banana or papaya fruit tissue through mechanical disruption, detergent cell lysis, protein digestion, and ice-cold ethanol spooling.",
    "outcome": "Visible white fibrous threads of aggregated genomic DNA precipitated at the ice-cold alcohol interface and successfully spooled onto a clean glass rod.",
    "materials": [
      "Ripe Banana / Papaya / Green Peas × 50 g",
      "Lysis Buffer: Liquid Dishwashing Detergent (10 mL) + Non-iodized Table Salt (3 g) + Distilled Water (90 mL) × 100 mL",
      "Ice-cold 95% Ethanol or Isopropanol (stored at -20°C) × 50 mL",
      "Mortar and Pestle / Zip-lock bag × 1",
      "Meat tenderizer / Papain / Pineapple juice (protease source) × 5 mL",
      "Cheesecloth / Fine tea strainer × 1",
      "Test tubes and Glass Spooling Rod × 1 set"
    ],
    "procedure": [
      "Mash 50 g of peeled banana thoroughly in a zip-lock bag or mortar to break down plant cell walls mechanically.",
      "Add 50 mL of prepared lysis buffer (detergent disrupts phospholipid cell and nuclear membranes; salt shields negatively charged phosphate DNA backbones).",
      "Mix gently for 10 minutes to avoid excess froth formation.",
      "Filter the homogenate through double-layered cheesecloth into a clean beaker to collect cellular filtrate.",
      "Add 5 mL pineapple juice or meat tenderizer (proteases digest histones and cellular proteins associated with DNA) and swirl for 5 minutes.",
      "Tilt a test tube containing 10 mL filtrate at a 45° angle. Slowly trickle 10 mL of ice-cold ethanol down the tube wall to form an unmixed top layer.",
      "Watch white translucent mucous-like DNA precipitate at the water-alcohol interface. Spool the DNA fibers onto a clean glass rod by rotating gently."
    ],
    "precautions": [
      "Ethanol must be ice-cold (-20°C freezer chilled); warm ethanol will not precipitate DNA effectively.",
      "Pour ethanol very slowly along the tube side to form two distinct stratified layers.",
      "Do not whip or shake vigorously after adding detergent to prevent shearing long DNA strands into fragments.",
      "Use fresh fruit for highest nucleic acid yield."
    ],
    "learning_objectives": [
      "Understand the molecular basis of cell lysis, membrane dissolution, and protein deproteinization.",
      "Explain the chemical mechanism of nucleic acid precipitation in cold alcohol via dielectric constant reduction.",
      "Experience fundamental biotechnology and molecular biology techniques firsthand."
    ],
    "tags": [
      "Biotechnology",
      "DNA Isolation",
      "Molecular Biology",
      "Class 12 Biology",
      "Genetics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "50 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "5dff7235-948c-411f-8535-4ddaa0b83791",
    "title": "Identification of Human Blood Cells in Peripheral Smear",
    "slug": "human-blood-smear-wbc-identification",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 12",
    "difficulty": "Advanced",
    "duration_minutes": 50,
    "description": "Prepare and stain a thin peripheral blood film using Leishman's stain to identify erythrocytes, platelets, and differential leukocytes (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils).",
    "outcome": "High magnification examination reveals non-nucleated biconcave RBCs, multi-lobed pinkish-purple Neutrophils (~65%), large-nucleus Lymphocytes (~25%), and kidney-shaped Monocytes.",
    "materials": [
      "Prepared sterile human blood smear slide or fresh finger-prick blood via sterile lancet × 1",
      "Leishman's Stain powder dissolved in absolute methanol (0.15% w/v) × 1 bottle",
      "Distilled water / Sorensen's Phosphate buffer (pH 6.8) × 100 mL",
      "Grease-free microscope slides with smooth polished spreader slide × 2",
      "Compound Microscope with 100x Oil Immersion lens & Cedarwood oil × 1",
      "70% Isopropanol alcohol swabs & sterile disposable lancets × 1 set",
      "Staining rack and timer × 1"
    ],
    "procedure": [
      "Clean fingertip with alcohol swab, let dry, and make a quick prick with a sterile lancet.",
      "Place a small drop of blood 1 cm from the frosted end of a clean slide.",
      "Hold a spreader slide at a 30°-45° angle, pull back until it contacts the blood drop spreading it along the edge, then push smoothly forward in one stroke to form a thin feathered tail.",
      "Air dry the blood film completely for 2 minutes.",
      "Place slide on staining rack. Cover film with 10 drops of Leishman's stain for 2 minutes (methanol fixes cells).",
      "Add 20 drops of distilled water/buffer, blow gently to mix until a metallic golden scum forms, and let stain for 10 minutes.",
      "Wash gently under running tap water, air dry, add cedarwood oil, and examine under the 100x oil immersion objective."
    ],
    "precautions": [
      "Strict aseptic precautions: use disposable lancets once and discard immediately in a sharp-safe container.",
      "The blood smear must have a smooth monolayer 'feathered edge' without ridges or holes.",
      "Buffer pH must be maintained at 6.8 for optimal differential differentiation of granules.",
      "Do not touch slide surface with fingers to prevent lipid smudging."
    ],
    "learning_objectives": [
      "Master hematology smear spreading and polychromatic Romanowsky-type staining.",
      "Identify morphological characteristics of granulocytes and agranulocytes.",
      "Perform differential leukocyte counting (DLC) and relate to immune status."
    ],
    "tags": [
      "Hematology",
      "Leukocytes",
      "Blood Cells",
      "Class 12 Biology",
      "Microscopic Anatomy"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 93,
    "status": "published",
    "duration": "50 Mins",
    "views": 1116,
    "likes": 744,
    "rating": 4.8
  },
  {
    "id": "6c28c2b0-f2aa-42bb-878d-a82eb4d8306d",
    "title": "Enzyme Kinetics: Action of Salivary Amylase on Starch",
    "slug": "salivary-amylase-starch-digestion",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 12",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Investigate the digestive enzymatic action of human salivary amylase (ptyalin) on starch and determine the achromic point (time required for complete hydrolysis) at 37°C.",
    "outcome": "Blue-black iodine response gradually lightens through violet and red-brown to reach the achromic point (colorless) at 6.5 minutes at body temperature (37°C), proving complete enzyme breakdown to maltose.",
    "materials": [
      "1% Soluble Starch solution (freshly prepared) × 50 mL",
      "Dilute Salivary Amylase solution (1:10 filtered human saliva in distilled water) × 20 mL",
      "Lugol's Dilute Iodine Solution × 1 dropper bottle",
      "Porcelain Spotting Tile with multiple depression cavities × 1",
      "Water Bath maintained at 37°C (human body temperature) × 1",
      "Digital Stopwatch and Pipettes (1 mL and 5 mL) × 1 set",
      "Test tubes and test tube rack × 1 set"
    ],
    "procedure": [
      "Rinse mouth with lukewarm water. Collect 2 mL saliva in a beaker and dilute with 18 mL distilled water to obtain 1:10 enzyme solution.",
      "Place 1 drop of dilute iodine solution in each depression well of the porcelain spotting tile.",
      "In a test tube, take 5 mL of 1% starch solution and incubate in a 37°C water bath for 5 minutes.",
      "Add 1 mL of dilute salivary amylase solution to the starch tube, mix quickly, and start the stopwatch immediately.",
      "At 1-minute intervals, withdraw 1 drop from the reaction mixture using a clean dropper and add to an iodine depression well.",
      "Observe the color progression: initially dark blue-black (starch present), fading to violet (erythrodextrin), brownish-yellow (achroodextrin), and finally no color change (maltose).",
      "Record the exact time when no blue color develops; this is the achromic point (complete starch digestion)."
    ],
    "precautions": [
      "Maintain the water bath temperature strictly around 37°C (higher temperatures denature the amylase enzyme).",
      "Ensure starch solution is completely free from reducing sugars before the test.",
      "Rinse the sampling dropper between minute intervals to prevent early transfer of enzyme.",
      "Dilute saliva appropriately so the reaction takes between 5 to 10 minutes for measurable tracking."
    ],
    "learning_objectives": [
      "Understand enzyme biocatalysis, substrate specificity, and hydrolytic cleavage of α-1,4-glycosidic bonds.",
      "Track enzymatic substrate depletion over time using colorimetric indicator progression.",
      "Analyze the effect of temperature and pH on enzyme kinetic activity."
    ],
    "tags": [
      "Enzymes",
      "Salivary Amylase",
      "Digestion",
      "Class 12 Biology",
      "Biochemistry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 95,
    "status": "published",
    "duration": "45 Mins",
    "views": 1140,
    "likes": 760,
    "rating": 5
  },
  {
    "id": "cffa990c-dff3-413d-b9c4-df4ab669496d",
    "title": "Distribution and Density of Stomata on Leaf Surfaces",
    "slug": "stomata-distribution-density-leaf-epidermis",
    "subject": "Biology",
    "subject_slug": "biology",
    "class": "Class 11",
    "difficulty": "Beginner",
    "duration_minutes": 40,
    "description": "Compare the distribution, frequency, and density of stomata on the upper (adaxial) and lower (abaxial) epidermis of a dorsiventral leaf (Hibiscus / Petunia) and an isobilateral leaf (Grass / Maize).",
    "outcome": "Dorsiventral leaves exhibit significantly higher stomatal frequency on the lower surface (abaxial, ~185 stomata/mm²) than the upper surface (adaxial, ~20 stomata/mm²), minimizing transpirational water loss.",
    "materials": [
      "Fresh leaves: Hibiscus / Nerium (dorsiventral) and Grass / Zea mays (isobilateral) × 2 each",
      "Colorless clear nail polish or quick-drying collodion × 1 bottle",
      "Clear transparent cellophane tape (Scotch tape) × 1 roll",
      "Clean glass microscope slides and cover slips × 1 box",
      "Compound Microscope with calibrated ocular micrometer grid × 1",
      "Fine Forceps and Scissors × 1 set"
    ],
    "procedure": [
      "Select a clean, turgid leaf and dry the surface with tissue paper.",
      "Paint a thin, uniform patch (~1 cm²) of clear nail polish on the upper epidermis of the leaf.",
      "Paint a similar patch on the lower epidermis.",
      "Allow the nail polish to dry completely for 10-15 minutes into a tough, clear peel.",
      "Press a piece of clear cellophane tape firmly over the dried polish patch.",
      "Peel the tape away smoothly; the leaf impression (epidermal imprint showing guard cells and stomatal pores) adheres to the tape.",
      "Mount the tape onto a clean glass slide and count the number of stomata per microscopic field under 40x on both surfaces."
    ],
    "precautions": [
      "Apply a thin, even coat of nail polish; thick coats take too long to dry and produce blurred optical impressions.",
      "Allow polish to dry thoroughly before peeling with tape to avoid smudging.",
      "Count multiple microscopic fields (at least 5 fields) and average to obtain statistically reliable stomatal counts.",
      "Avoid leaf veins when counting stomatal density."
    ],
    "learning_objectives": [
      "Compare anatomical adaptations of dorsiventral and isobilateral leaves.",
      "Calculate stomatal index: SI = [S / (E + S)] × 100, where S = stomata count and E = epidermal cells count.",
      "Explain the evolutionary significance of hypostomatic leaf organization in terrestrial plants."
    ],
    "tags": [
      "Stomata",
      "Plant Anatomy",
      "Transpiration Adaptation",
      "Class 11 Biology",
      "Epidermal Cells"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 92,
    "status": "published",
    "duration": "40 Mins",
    "views": 1104,
    "likes": 736,
    "rating": 5
  },
  {
    "id": "eb685add-e2b6-49ab-b72a-2a770d0c1f3c",
    "title": "Geometric Verification of Pythagoras Theorem",
    "slug": "pythagoras-theorem-geometric-verification",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Verify the Pythagorean Theorem (a² + b² = c²) for a right-angled triangle by cutting and rearranging unit squares and algebraic dissection puzzles on graph board.",
    "outcome": "Area of the square on the hypotenuse (c²) exactly equals the combined sum of the areas of squares constructed on the base (a²) and perpendicular (b²) through geometric congruence.",
    "materials": [
      "Cardboard base sheet (30 cm × 30 cm) × 1",
      "Colored construction paper (red, blue, yellow) × 3 sheets",
      "Geometry Box (Ruler, Right-angle Set Squares, Pencil) × 1",
      "Pair of Scissors, Glue Stick, and Acrylic Board × 1 set",
      "Square grid graph sheet (1 cm × 1 cm) × 2"
    ],
    "procedure": [
      "Draw a right-angled triangle with sides a = 6 cm, b = 8 cm, and hypotenuse c = 10 cm on cardboard.",
      "Construct square A of dimensions 6 cm × 6 cm (area = 36 cm²) on the base using blue paper.",
      "Construct square B of dimensions 8 cm × 8 cm (area = 64 cm²) on the perpendicular using red paper.",
      "Construct square C of dimensions 10 cm × 10 cm (area = 100 cm²) on the hypotenuse using yellow paper.",
      "Divide square A into 36 unit squares of 1 cm² and square B into 64 unit squares of 1 cm².",
      "Cut and rearrange the 36 blue unit squares and 64 red unit squares onto the yellow square C.",
      "Observe that the 100 unit squares from A and B completely and precisely cover square C without any gap or overlap: 36 + 64 = 100."
    ],
    "precautions": [
      "Ensure all triangle angles are drawn with 90° precision using set squares.",
      "Cut unit squares strictly along grid lines to ensure edge-to-edge alignment.",
      "Measure hypotenuse length with high accuracy before cutting the target square.",
      "Avoid adhesive warping by smoothing paper firmly onto cardboard."
    ],
    "learning_objectives": [
      "Understand the geometric visual proof of Pythagoras Theorem: a² + b² = c².",
      "Connect algebraic identities with physical geometric surface areas.",
      "Apply Pythagorean triplets (3-4-5, 6-8-10, 5-12-13) in practical problem-solving."
    ],
    "tags": [
      "Pythagoras Theorem",
      "Geometry",
      "Triangles",
      "Class 10 Maths",
      "NEP 2020 Hands-on"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 98,
    "status": "published",
    "duration": "35 Mins",
    "views": 1176,
    "likes": 784,
    "rating": 5
  },
  {
    "id": "7e695f1c-6454-47d2-8b46-ee19cb14917e",
    "title": "Area of a Circle Formula via Sector Partitioning",
    "slug": "area-of-circle-sector-partitioning",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Derive and verify the formula for the area of a circle (Area = π·r²) by partitioning a circle into 16 and 32 congruent sectors and rearranging into an approximate rectangle.",
    "outcome": "As the number of circular sectors increases, the rearranged shape approaches a rectangle of base length π·r (half circumference) and height r. Area = base × height = π·r × r = π·r².",
    "materials": [
      "Cardboard sheet with pre-printed circular disc of radius r = 7 cm × 1",
      "Protractor for measuring 11.25° and 22.5° sector angles × 1",
      "Two contrasting colored glaze papers (blue and white) × 1 each",
      "Scissors and Craft Glue Stick × 1",
      "Geometry Compass and 30 cm ruler × 1"
    ],
    "procedure": [
      "Draw a circle of radius r = 7 cm on colored cardboard.",
      "Using a protractor, divide the circle into 16 congruent sectors, each with central angle θ = 360° / 16 = 22.5°.",
      "Shade 8 alternate sectors in blue and the remaining 8 sectors in white.",
      "Cut out all 16 sectors carefully along the radial radii lines.",
      "Cut one end sector into two equal half-sectors of 11.25° to form vertical borders.",
      "Arrange the sectors side by side alternating up and down in interlocking fashion on a display board.",
      "Measure the dimensions of the formed parallelogram/rectangle: length = half circumference = (2πr)/2 = π·r, and breadth = radius r. Area = π·r × r = π·r²."
    ],
    "precautions": [
      "Cut strictly along circular arcs and radial radii lines without tearing paper edges.",
      "Ensure alternate up/down sector placement is tight without overlapping.",
      "Keep sector radius r constant throughout circle division.",
      "Handle sharp scissors with care."
    ],
    "learning_objectives": [
      "Understand the calculus limit concept: circular sector dissection converging to a rectangle.",
      "Derive the relationship between circle circumference (2πr) and circular area (πr²).",
      "Visualize how partitioning curved geometries resolves into familiar rectangular calculations."
    ],
    "tags": [
      "Circle Area",
      "Mensuration",
      "Geometry",
      "Class 10 Mathematics",
      "Hands-on Math"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 94,
    "status": "published",
    "duration": "35 Mins",
    "views": 1128,
    "likes": 752,
    "rating": 4.8999999999999995
  },
  {
    "id": "021190c5-fe94-4fad-8572-84112536cfcb",
    "title": "Surface Area & Volume Relationships: Sphere, Cone, and Cylinder",
    "slug": "surface-area-volume-sphere-cone-cylinder",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Verify Archimedes' ratio of volumes and surface areas between a cone, a sphere, and a cylinder having identical radius (r) and height (h = 2r) using dry fine sand displacement.",
    "outcome": "Empirically verified that Volume of Cone : Volume of Sphere : Volume of Cylinder = 1 : 2 : 3. Sand from one cone and one sphere exactly fills the circumscribed cylinder without spill.",
    "materials": [
      "Hollow transparent acrylic geometric models: Cylinder (radius r = 5 cm, height h = 10 cm), Sphere (radius r = 5 cm with top aperture), Cone (radius r = 5 cm, height h = 10 cm) × 1 set",
      "Fine dry colored sand or water × 1 kg",
      "Measuring Flask (1000 mL) × 1",
      "Plastic funnel and collection tray × 1",
      "Leveling straightedge ruler × 1"
    ],
    "procedure": [
      "Verify dimensions of acrylic solids: cylinder height h = 10 cm, radius r = 5 cm; cone height h = 10 cm, radius r = 5 cm; sphere diameter 2r = 10 cm.",
      "Fill the hollow cone completely with fine sand and level off flush with the rim using a straightedge.",
      "Pour the sand from the cone into the empty cylinder. Observe that it fills exactly 1/3 of the cylinder's volume.",
      "Fill the cone two more times into the cylinder: three full cones exactly fill the cylinder (V_cylinder = 3 × V_cone = 3 × (1/3 πr²h) = πr²h).",
      "Now empty the cylinder. Fill the hollow sphere model with fine sand.",
      "Pour the sphere's sand into the empty cylinder: it fills exactly 2/3 of the cylinder (V_sphere = 2/3 V_cylinder = 4/3 πr³).",
      "Combine one full cone of sand and one full sphere of sand: together they fill the cylinder 100% full."
    ],
    "precautions": [
      "Ensure sand is completely dry and free of clumps to ensure uniform packing density.",
      "Always level the sand rim with a flat straightedge; avoid packing or shaking vigorously between fills.",
      "Pour sand through a funnel slowly into the models to avoid spilling outside the measurement rim.",
      "Wipe acrylic models with anti-static cloth to prevent sand grains sticking to walls."
    ],
    "learning_objectives": [
      "Verify Archimedes' famous theorem: V_cone + V_sphere = V_cylinder for equal radius and height.",
      "Master standard mensuration volume formulas: V_cone = 1/3 πr²h, V_sphere = 4/3 πr³, V_cylinder = πr²h.",
      "Develop strong 3D spatial reasoning through tactile volume comparison."
    ],
    "tags": [
      "Mensuration",
      "Volume Relationships",
      "Archimedes",
      "Class 10 Mathematics",
      "3D Geometry"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1516383717472-9904703a00e0?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516383717472-9904703a00e0?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "45 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "f6b7bed3-1fb8-4f19-a540-895e28ad8cca",
    "title": "Angle Subtended by an Arc at the Center vs Circumference",
    "slug": "angle-subtended-by-arc-circle-theorem",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 9",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Verify that the angle subtended by an arc at the center of a circle is double the angle subtended by it at any point on the remaining part of the circle (Angle at Center Theorem).",
    "outcome": "For any chosen arc AB, angle ∠AOB at center measured 80° while inscribed angle ∠APB at circumference measured exactly 40°. Verified ∠AOB = 2 · ∠APB across all arc lengths.",
    "materials": [
      "Circular Geoboard with 36-peg graduated circumference × 1",
      "Colored elastic rubber bands (red, blue, yellow) × 1 pack",
      "360° Circular Full Protractor × 1",
      "Tracing paper and Drawing Compass × 1 set",
      "Cardboard sheet with pins × 1"
    ],
    "procedure": [
      "Draw a circle of radius 10 cm on white cardboard and mark center O.",
      "Mark two points A and B on the circumference to define arc AB.",
      "Join radius OA and radius OB to form central angle ∠AOB.",
      "Mark any point P on the remaining major arc circumference and join PA and PB to form inscribed angle ∠APB.",
      "Measure central angle ∠AOB accurately with the 360° protractor (e.g. ∠AOB = 80°).",
      "Measure angle ∠APB with the protractor (measured ∠APB = 40°).",
      "Trace angle ∠APB onto transparent tracing paper twice. Place both traced angles side by side over ∠AOB to demonstrate that 2 × ∠APB fits perfectly over ∠AOB."
    ],
    "precautions": [
      "Ensure center point O is accurately positioned before drawing radii.",
      "Point P must lie strictly on the remaining circumference, not on arc AB itself.",
      "Use sharp pencils and fine rubber bands on the geoboard to prevent angular reading errors.",
      "Verify the theorem across both minor arcs, major arcs, and semicircles (angle in a semicircle = 90°)."
    ],
    "learning_objectives": [
      "Understand circle geometry theorems and cyclic angle properties.",
      "Deduce corollary that angles in the same segment of a circle are equal.",
      "Prove that the angle in a semicircle is a right angle (90°)."
    ],
    "tags": [
      "Circle Theorems",
      "Geometry",
      "Inscribed Angle",
      "Class 9 Maths",
      "CBSE Mathematics"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 93,
    "status": "published",
    "duration": "35 Mins",
    "views": 1116,
    "likes": 744,
    "rating": 4.8
  },
  {
    "id": "c19950ec-c9c0-4ec3-a9a1-b6b42ce917d4",
    "title": "Equality of Tangents Drawn from an External Point to a Circle",
    "slug": "circle-tangents-external-point-construction",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 35,
    "description": "Verify that the lengths of tangents drawn from an external point to a circle are equal (Theorem 10.2) through paper folding, Euclidean geometric construction, and RHS congruency.",
    "outcome": "Tangents PT1 and PT2 from point P measure exactly 12.0 cm each. Triangle OPT1 is congruent to Triangle OPT2 by RHS criterion, proving PT1 = PT2.",
    "materials": [
      "Drawing sheet (white chart paper) × 1",
      "Geometry Box (Compass, 30 cm Metric Ruler, Protractor) × 1",
      "Tracing paper and colored pencils × 1 set",
      "Fine craft paper-creasing tool × 1"
    ],
    "procedure": [
      "Draw a circle of radius r = 5 cm with center O on white chart paper.",
      "Choose a point P outside the circle such that distance OP = 13 cm.",
      "Join OP and draw the perpendicular bisector of OP to find midpoint M.",
      "With M as center and radius MO = MP, draw a second circle intersecting the original circle at points T1 and T2.",
      "Join PT1 and PT2: these are the two tangents from external point P to the circle.",
      "Measure lengths PT1 and PT2 with a precision metric ruler (both measure exactly 12.0 cm: √(13² - 5²) = √(169 - 25) = √144 = 12 cm).",
      "Fold the paper along line OP: observe that ray PT1 superimposes precisely on PT2, verifying equality."
    ],
    "precautions": [
      "Compass pivot must be sharp and tightened to prevent slipping during arc construction.",
      "The tangent must touch the circle at exactly one point (radius OT is strictly perpendicular to PT: ∠OTP = 90°).",
      "Align the ruler with hairline accuracy along the points of tangency.",
      "Crease paper cleanly along axis of symmetry OP for folding verification."
    ],
    "learning_objectives": [
      "Understand the geometric properties of circle tangents and points of contact.",
      "Apply the Right-Hypotenuse-Side (RHS) triangle congruency condition.",
      "Calculate tangent lengths using the Pythagorean theorem: Length = √(d² - r²)."
    ],
    "tags": [
      "Tangents to Circles",
      "Euclidean Geometry",
      "Class 10 Mathematics",
      "Congruence",
      "Hands-on Math"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 95,
    "status": "published",
    "duration": "35 Mins",
    "views": 1140,
    "likes": 760,
    "rating": 5
  },
  {
    "id": "a82d8ea4-52e8-4cc4-ba99-a30fd90fcf0d",
    "title": "Basic Proportionality Theorem (Thales' Theorem) Verification",
    "slug": "basic-proportionality-thales-theorem",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Intermediate",
    "duration_minutes": 40,
    "description": "Verify Thales' Basic Proportionality Theorem: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio (AD/DB = AE/EC).",
    "outcome": "Measured segments AD = 4.0 cm, DB = 6.0 cm (ratio = 0.667) and AE = 4.8 cm, EC = 7.2 cm (ratio = 0.667). Ratios AD/DB = AE/EC verified across scalene, isosceles, and right triangles.",
    "materials": [
      "Cardboard sheet with parallel ruled line grid (spaced 1 cm apart) × 1",
      "Colored construction paper triangles of varying shapes × 3",
      "30 cm Metric Ruler (millimeter divisions) × 1",
      "Protractor and Pair of Set Squares × 1 set",
      "Push pins and colored thread × 1 set"
    ],
    "procedure": [
      "Draw any scalene triangle ABC on paper with sides AB = 10 cm, AC = 12 cm, BC = 14 cm.",
      "Using set squares, draw line segment DE parallel to side BC, intersecting AB at point D and AC at point E.",
      "Measure the lengths of segments AD and DB with a precision ruler.",
      "Compute ratio 1: R1 = AD / DB.",
      "Measure the lengths of segments AE and EC with the ruler.",
      "Compute ratio 2: R2 = AE / EC.",
      "Compare R1 and R2 to confirm AD/DB = AE/EC. Draw two other parallel lines at different heights to verify constancy of ratio."
    ],
    "precautions": [
      "Line DE must be strictly parallel to base BC; use paired set squares to ensure zero angular error.",
      "Measure segment lengths with a sharp pencil and millimeter scale at eye level.",
      "Avoid using tiny triangles where measurement errors become significant percentages.",
      "Check that points D and E lie strictly on the respective sides."
    ],
    "learning_objectives": [
      "Master the fundamental foundation theorem for triangle similarity.",
      "Relate triangle area ratios with proportional base segments sharing a common vertex.",
      "Apply Thales' theorem to solve geometric height and distance division problems."
    ],
    "tags": [
      "Thales Theorem",
      "Similar Triangles",
      "Proportionality",
      "Class 10 Maths",
      "CBSE Syllabus"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1509869175650-a1c978349568?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509869175650-a1c978349568?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 97,
    "status": "published",
    "duration": "40 Mins",
    "views": 1164,
    "likes": 776,
    "rating": 4.8999999999999995
  },
  {
    "id": "51e20d48-b921-4f37-ab52-8ff2da1a21b4",
    "title": "Sum of First n Natural Numbers via Staircase Model",
    "slug": "sum-of-natural-numbers-staircase-model",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 30,
    "description": "Derive and verify the arithmetic progression formula for the sum of the first n natural numbers (S_n = n(n+1)/2) using a physical 2D staircase model of unit square tiles.",
    "outcome": "Two identical staircases of n = 6 steps (1+2+3+4+5+6 = 21 tiles each) fit together to form a rectangle of dimensions n × (n+1) = 6 × 7 = 42 tiles. Hence S_n = 42 / 2 = 21.",
    "materials": [
      "Cardboard sheet (30 cm × 30 cm) with 1 cm × 1 cm grid × 1",
      "Unit wooden / plastic square tiles (1 cm × 1 cm) × 50",
      "Colored chart paper (red and yellow) × 1 each",
      "Scissors, Glue stick, and marker pen × 1 set"
    ],
    "procedure": [
      "Choose n = 6 as the target natural number.",
      "Construct a staircase of red unit squares: 1 square in column 1, 2 in column 2, 3 in column 3, up to 6 in column 6. Total red tiles = 1 + 2 + 3 + 4 + 5 + 6 = 21.",
      "Construct an identical second staircase using yellow unit squares (total 21 yellow tiles).",
      "Invert the yellow staircase and interlock it with the red staircase.",
      "Observe that the two interlocked staircases form a perfect solid rectangle.",
      "Count the dimensions of the rectangle: breadth = n = 6 rows, length = n + 1 = 7 columns.",
      "Total area of rectangle = n × (n+1) = 6 × 7 = 42 tiles. Since it comprises two identical staircases, the sum of one staircase is S_n = n(n+1)/2 = 42/2 = 21."
    ],
    "precautions": [
      "All unit tiles must have identical square dimensions (1 cm × 1 cm) for gapless interlocking.",
      "Align tiles strictly along rectangular grid lines.",
      "Ensure student clearly distinguishes between the two contrasting colored staircases.",
      "Test with multiple values of n (n = 4, n = 5, n = 10) to confirm generalizability."
    ],
    "learning_objectives": [
      "Understand Arithmetic Progressions (AP) with first term a = 1 and common difference d = 1.",
      "Visualize Gauss's pairing trick for finite series summation geometrically.",
      "Connect discrete arithmetic sequences with 2D geometric array areas."
    ],
    "tags": [
      "Arithmetic Progression",
      "Algebra",
      "Series Summation",
      "Class 10 Mathematics",
      "Experiential Math"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 91,
    "status": "published",
    "duration": "30 Mins",
    "views": 1092,
    "likes": 728,
    "rating": 4.8999999999999995
  },
  {
    "id": "0239d714-599b-4a85-811b-80dd124eff6d",
    "title": "Algebraic Identity (a + b)³ 3D Dissection Model",
    "slug": "algebraic-identity-cube-of-binomial-3d",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 9",
    "difficulty": "Intermediate",
    "duration_minutes": 40,
    "description": "Verify the algebraic identity (a + b)³ = a³ + 3a²b + 3ab² + b³ geometrically using a set of 8 physical 3D volumetric acrylic blocks of dimensions a and b.",
    "outcome": "An assembled cube of side (a + b) decomposes into exactly 8 geometric solid pieces: 1 cube of a³, 3 cuboids of a²b, 3 cuboids of ab², and 1 cube of b³, verifying the identity.",
    "materials": [
      "3D Acrylic / Wooden mathematical model set for binomial cube: a = 4 cm, b = 2 cm × 1 set",
      "- Cube of side a (4 × 4 × 4 = 64 cm³) × 1",
      "- Cube of side b (2 × 2 × 2 = 8 cm³) × 1",
      "- Cuboids of dimension a × a × b (4 × 4 × 2 = 32 cm³) × 3",
      "- Cuboids of dimension a × b × b (4 × 2 × 2 = 16 cm³) × 3",
      "Display tray with base 6 cm × 6 cm × 1",
      "Metric Vernier Caliper / Ruler × 1"
    ],
    "procedure": [
      "Measure dimensions of each block using a ruler: confirm a = 4 cm and b = 2 cm.",
      "Assemble all 8 blocks together inside the tray to form a large single solid cube.",
      "Measure the edge of the large assembled cube: edge = a + b = 4 + 2 = 6 cm.",
      "Calculate total volume of assembled cube: V = (a + b)³ = 6³ = 216 cm³.",
      "Disassemble the cube and separate into 4 component categories:",
      "1 cube of a³ (volume = 64 cm³), 3 cuboids of a²b (volume = 3 × 32 = 96 cm³), 3 cuboids of ab² (volume = 3 × 16 = 48 cm³), 1 cube of b³ (volume = 8 cm³).",
      "Sum the volumes of all 8 components: 64 + 96 + 48 + 8 = 216 cm³. Confirm (a + b)³ = a³ + 3a²b + 3ab² + b³."
    ],
    "precautions": [
      "Handle precision acrylic blocks carefully to avoid chipping corners and edges.",
      "Ensure all 8 blocks fit together flush without gaps when building the main cube.",
      "Label dimensions a and b clearly on each block face to facilitate spatial tracking.",
      "Store blocks in labeled compartments to prevent losing components."
    ],
    "learning_objectives": [
      "Bridge abstract algebraic expansion formulas with concrete 3D volumetric space.",
      "Master combinatorial binomial expansions for polynomial degree 3.",
      "Develop spatial assembly and decomposition reasoning."
    ],
    "tags": [
      "Algebraic Identities",
      "Polynomials",
      "3D Models",
      "Class 9 Maths",
      "Experiential Learning"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 92,
    "status": "published",
    "duration": "40 Mins",
    "views": 1104,
    "likes": 736,
    "rating": 5
  },
  {
    "id": "0c762953-3ac1-4dc3-8507-387d93881286",
    "title": "Trigonometric Height Estimation using a Handmade Clinometer",
    "slug": "clinometer-trigonometric-height-estimation",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 10",
    "difficulty": "Beginner",
    "duration_minutes": 45,
    "description": "Construct an optical clinometer and determine the height of an inaccessible tall object (school building, tree, or flagpole) using the trigonometric tangent ratio (tan θ = opposite / adjacent).",
    "outcome": "Measured elevation angle θ = 35° at distance d = 15.0 m with eye height h1 = 1.45 m. Computed height H = h1 + d · tan(35°) = 1.45 + 15.0 · (0.700) = 11.95 m (true height = 12.0 m).",
    "materials": [
      "180° Plastic Protractor with center hole × 1",
      "Straight drinking straw / hollow tube (optical sight) × 1",
      "Fine cotton thread (25 cm) with metallic plumb weight / nut × 1",
      "Heavy 30-meter Measuring Tape × 1",
      "Double-sided tape / craft glue × 1",
      "Scientific Calculator (for tan θ) × 1"
    ],
    "procedure": [
      "Affix the drinking straw firmly along the flat straight edge (0°-180° line) of the protractor using tape.",
      "Tie one end of the fine thread through the center hole of the protractor and attach a metallic nut to the other end to act as a vertical plumb line.",
      "Measure the distance (d) from the observer's standing point to the base of the tall building/tree using the measuring tape.",
      "Look through the straw sight to align the top of the object.",
      "Hold the clinometer steady and have a partner read the angle (α) indicated by the plumb line on the curved scale.",
      "Compute angle of elevation: θ = 90° - α.",
      "Measure the observer's eye height from ground level (h1).",
      "Calculate total object height: H = h1 + d · tan(θ)."
    ],
    "precautions": [
      "Ensure the ground between the observer and the object is reasonably horizontal.",
      "Wait until the plumb line stops swinging and hangs strictly vertical before recording angle α.",
      "Keep straw sight aligned with the exact apex of the target object.",
      "Include observer eye height (h1); omitting it introduces a 1.4-1.7 m systematic error."
    ],
    "learning_objectives": [
      "Apply right-triangle trigonometry and tangent function in real-world surveying.",
      "Understand the difference between angle of elevation and angle of depression.",
      "Construct precision scientific instrumentation using everyday materials."
    ],
    "tags": [
      "Trigonometry",
      "Heights and Distances",
      "Clinometer",
      "Class 10 Mathematics",
      "Outdoor STEM"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 96,
    "status": "published",
    "duration": "45 Mins",
    "views": 1152,
    "likes": 768,
    "rating": 4.8
  },
  {
    "id": "f2a8bf77-9c3b-460a-867d-d3eed54e4ff8",
    "title": "Galton Board & Experimental Verification of Normal Distribution",
    "slug": "galton-board-normal-distribution-binomial",
    "subject": "Mathematics",
    "subject_slug": "mathematics",
    "class": "Class 11",
    "difficulty": "Intermediate",
    "duration_minutes": 45,
    "description": "Demonstrate the Central Limit Theorem and normal (Gaussian) distribution curve by dropping 1,000 steel ball bearings through a triangular quincunx pegboard (Galton Board).",
    "outcome": "Steel balls accumulating in bottom bins form a smooth symmetric bell-shaped Gaussian curve, empirically proving the convergence of binomial distribution B(n, 0.5) to normal distribution N(μ, σ²).",
    "materials": [
      "Acrylic Galton Board apparatus with 12 rows of staggered hexagonal pegs and collection bins × 1",
      "Steel ball bearings (2 mm diameter) × 1,000",
      "Millimeter scale for measuring bin fill heights × 1",
      "Smartphone camera with high-speed video capture × 1",
      "Graph paper for plotting frequency histogram and bell curve × 2"
    ],
    "procedure": [
      "Set the Galton Board strictly vertical on a level laboratory table.",
      "Inspect that all 1,000 ball bearings are collected in the upper funnel reservoir.",
      "Release the gate mechanism to allow the balls to drop through the triangular peg array.",
      "At each peg collision, a ball has an equal probability p = 0.5 of bouncing left and 1 - p = 0.5 of bouncing right.",
      "Observe the final accumulation of balls in the graduated bins at the bottom.",
      "Measure the height of balls (frequency) in each of the 13 bins from left to right.",
      "Plot the bin number (x-axis) versus ball height (y-axis): draw the smooth envelope curve to demonstrate the classic Gaussian bell-shaped distribution."
    ],
    "precautions": [
      "The board must be set strictly perpendicular using a spirit level; tilt causes asymmetric skewness.",
      "Release balls smoothly without shaking the apparatus.",
      "Ensure pegs and balls are clean and dry to minimize electrostatic or frictional bias.",
      "Verify that all bins have uniform internal cross-sectional width."
    ],
    "learning_objectives": [
      "Understand the Central Limit Theorem and law of large numbers in probability.",
      "Connect discrete binomial probability P(X = k) = C(n, k) · p^k · (1-p)^(n-k) with continuous Gaussian curves.",
      "Analyze mean, variance, standard deviation, and symmetry in statistical distributions."
    ],
    "tags": [
      "Probability",
      "Statistics",
      "Normal Distribution",
      "Galton Board",
      "Class 11 Maths"
    ],
    "thumbnail_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    ],
    "popularity": 90,
    "status": "published",
    "duration": "45 Mins",
    "views": 1080,
    "likes": 720,
    "rating": 4.8
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
