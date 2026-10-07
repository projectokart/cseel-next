'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Compass,
  RotateCw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Info,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  FlaskConical,
  Atom,
  Microscope,
  Cpu,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Camera,
  ExternalLink,
  Flame,
  Radio,
  Eye,
  Sliders,
  X,
  Layers,
  HelpCircle,
  PhoneCall,
  QrCode,
  Scan,
  Barcode,
  Share2,
  Copy,
  Check,
  Languages,
  Video,
  Activity,
  Zap,
} from 'lucide-react';

export interface Hotspot {
  id: string;
  name: string;
  category: string;
  barcode: string;
  barcodeNumber: string;
  xPercent: number; // 0 to 100 on 360 panoramic canvas
  yPercent: number; // 0 to 100 vertical height
  badge: string;
  safetyLevel: 'Green' | 'Yellow' | 'Blue';
  shortDesc: string;
  fullDesc: string;
  scientificConcept: {
    title: string;
    formula?: string;
    principle: string;
    realWorldApplication: string;
  };
  specifications: string[];
  nepAlignedPracticals: string[];
  modelNumber: string;
  simulatorUrl?: string;
  audioNarrationEn: string;
  audioNarrationHi: string;
  simType: 'titration' | 'spectro' | 'fume' | 'centrifuge' | 'optics' | 'dso' | 'airtrack' | 'microscope' | 'gel' | 'photosynthesis' | 'iot' | 'printer' | 'robotarm';
}

export interface LabEnvironment {
  id: string;
  name: string;
  discipline: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  badgeColor: string;
  backgroundImage: string;
  capacity: string;
  curriculum: string;
  hotspots: Hotspot[];
  cameraAngles: { id: string; name: string; yaw: number; pitch: number }[];
  narrationIntroEn: string;
  narrationIntroHi: string;
}

export const labEnvironments: LabEnvironment[] = [
  {
    id: 'chemistry',
    name: 'Chemistry & Molecular Synthesis Lab',
    discipline: 'Chemistry',
    icon: FlaskConical,
    tagline: 'Precision titration benches, fume hoods, and analytical spectroscopy for Class 9-12.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    backgroundImage: '/images/categories/chemistry.jpg',
    capacity: '40 Students (Dual-Station)',
    curriculum: 'CBSE, ICSE, NEP 2020 Aligned',
    narrationIntroEn: 'Welcome to the CSEEL Chemistry Experiential Lab. Click on any instrument barcode to scan and explore its scientific concept.',
    narrationIntroHi: 'CSEEL केमिस्ट्री लैब में आपका स्वागत है। किसी भी उपकरण के बारकोड पर क्लिक करके उसके वैज्ञानिक सिद्धांत और वीडियो को देखें।',
    cameraAngles: [
      { id: 'cam-chem-1', name: 'Main Workstation', yaw: 0, pitch: 0 },
      { id: 'cam-chem-2', name: 'Titration Bay', yaw: 75, pitch: -5 },
      { id: 'cam-chem-3', name: 'Fume Hood Station', yaw: 160, pitch: 5 },
      { id: 'cam-chem-4', name: 'Reagent Dispenser', yaw: 250, pitch: -2 },
    ],
    hotspots: [
      {
        id: 'chem-titrator',
        name: 'Digital Motorized Titration Burette & Magnetic Stirrer',
        category: 'Volumetric Analysis',
        barcode: 'CSEEL-CHEM-8492-TITRATION',
        barcodeNumber: '8901234567890',
        xPercent: 24,
        yPercent: 48,
        badge: '0.01 mL Precision',
        safetyLevel: 'Green',
        shortDesc: 'Micro-step volumetric dispenser with real-time digital pH endpoint curve graphing.',
        fullDesc: 'The Class-A motorized burette delivers ultra-precise droplets with a resolution of ±0.01 mL. Combined with a variable-speed PTFE magnetic stirrer, it eliminates parallax errors during acid-base neutralisation and redox assays.',
        scientificConcept: {
          title: 'Acid-Base Neutralization & Molar Equivalence Point',
          formula: 'N₁V₁ = N₂V₂  or  H⁺(aq) + OH⁻(aq) → H₂O(l)',
          principle: 'Neutralization occurs when the exact stoichiometric amount of titrant acid/base reacts with the analyte base/acid, detected precisely by sharp pH indicator color inflection (e.g. Phenolphthalein colorless to pink at pH 8.2-10.0).',
          realWorldApplication: 'Industrial quality control in pharmaceutical dosage testing, municipal water hardness quantification, and food acidity balancing.',
        },
        specifications: [
          'Volumetric Accuracy: ±0.01 mL Class-A DIN EN ISO 8655',
          'Digital LED Titrant Volume Readout with auto-zero tare',
          'Teflon Piston with chemically inert borosilicate barrel',
          'Speed-controlled magnetic stirrer with LED tachometer',
        ],
        nepAlignedPracticals: [
          'Class 11: Determination of strength of given NaOH solution using standard Oxalic Acid',
          'Class 12: Permanganometric titration of KMnO4 against Mohr’s Salt',
          'Class 10: Quantitative pH neutralization curves of common household acids',
        ],
        modelNumber: 'CS-TITRA-900X',
        simulatorUrl: '/hands-on-experiments?subject=chemistry',
        audioNarrationEn: 'Barcode scanned: Digital Titration Burette. Concept: Acid-Base Neutralization. It eliminates meniscus reading errors using micro-drop dispensing and magnetic vortex stirring.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: डिजिटल टाइट्रेशन ब्यूरेट। सिद्धांत: अम्ल-क्षार उदासीनीकरण (Neutralization)। यह ड्रॉप-बाय-ड्रॉप प्रेसिजन के साथ pH एंडपॉइंट डिटेक्ट करता है।',
        simType: 'titration',
      },
      {
        id: 'chem-fume-hood',
        name: 'Automated Ducted Laminar Fume Hood',
        category: 'Laboratory Safety',
        barcode: 'CSEEL-CHEM-3921-FUMEHOOD',
        barcodeNumber: '8901234567891',
        xPercent: 62,
        yPercent: 38,
        badge: 'HEPA & Carbon Filtration',
        safetyLevel: 'Green',
        shortDesc: 'Continuous air-velocity containment chamber for handling volatile and toxic vapors.',
        fullDesc: 'Equipped with a micro-processor controller maintaining face velocity at 0.5 m/s. Fitted with gas taps, internal LED lighting, acid-resistant ceramic floor, and multi-stage active carbon gas scrubber filters.',
        scientificConcept: {
          title: 'Fluid Aerodynamics & Negative Pressure Chemical Containment',
          formula: 'Q = A · v  (Volumetric Airflow = Sash Face Area × Face Velocity)',
          principle: 'Creates a laminar air curtain and negative static pressure gradient inside the chamber so toxic fumes, acid vapors, and volatile organic solvents are continuously drawn away from the user into neutralizing scrubbers.',
          realWorldApplication: 'Petrochemical testing, synthesis of halogenated organic compounds, and heavy metal digestion in acid matrices.',
        },
        specifications: [
          'Face Velocity: 0.5 m/s auto-regulated airflow sensor',
          'Tempered 6mm explosion-proof vertical sliding sash',
          'Chemical Resistant Phenolic Resin internal lining',
          'Integrated utility taps for inert gas, vacuum, and DI water',
        ],
        nepAlignedPracticals: [
          'Class 11: Preparation of Colloidal Sol of Ferric Hydroxide',
          'Class 12: Tests for Functional Groups: Carbonyl, Carboxylic & Phenolic fumes',
          'Class 12: Qualitative Salt Analysis: Evolution of pungent gases (SO2, NO2, Cl2, NH3)',
        ],
        modelNumber: 'CS-FUME-HEPA40',
        simulatorUrl: '/hands-on-experiments?subject=chemistry',
        audioNarrationEn: 'Barcode scanned: Laminar Fume Hood. Concept: Aerodynamic negative pressure containment. It shields researchers and students during volatile and noxious gas reactions.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: लैमिनार फ्यूम हुड। सिद्धांत: नेगेटिव प्रेशर एरोडायनामिक्स। यह जहरीली गैसों और एसिड वाष्प से छात्रों की सुरक्षा करता है।',
        simType: 'fume',
      },
      {
        id: 'chem-spectro',
        name: 'Dual-Beam UV-Visible Spectrophotometer',
        category: 'Optical Analytical Spectroscopy',
        barcode: 'CSEEL-CHEM-9104-SPECTRO',
        barcodeNumber: '8901234567892',
        xPercent: 82,
        yPercent: 55,
        badge: '190-1100 nm Wavelength',
        safetyLevel: 'Blue',
        shortDesc: 'High-throughput spectrometer for Beer-Lambert concentration absorption analysis.',
        fullDesc: 'Features dual silicon photodiode detectors with holographic grating (1200 lines/mm). Connects over USB to real-time spectral graphing software on student tablets for Beer-Lambert law verification.',
        scientificConcept: {
          title: 'Beer-Lambert Law & Photonic Absorbance',
          formula: 'A = \\varepsilon \\cdot c \\cdot l = -\\log_{10}\\left(\\frac{I}{I_0}\\right)',
          principle: 'The absorbance of monochromatic electromagnetic radiation by a dissolved substance is directly proportional to its molar concentration and the optical path length traversed through the sample.',
          realWorldApplication: 'Blood hemoglobin estimation, pharmaceutical purity assays, and environmental water contaminant trace monitoring.',
        },
        specifications: [
          'Spectral Bandwidth: 1.8 nm with Deuterium & Tungsten halogen lamps',
          'Wavelength Accuracy: ±0.3 nm with automatic wavelength calibration',
          'Photometric Range: 0 to 3.0 Absorbance units',
          'Matched optical quartz cuvettes (10mm path length)',
        ],
        nepAlignedPracticals: [
          'Class 12: Determination of concentration of unknown Copper Sulfate solution using Colorimetry',
          'Class 12: Rate of reaction between Potassium Persulfate and Potassium Iodide',
          'Class 11: Study of reaction kinetics of Ester hydrolysis',
        ],
        modelNumber: 'CS-UV-VIS200',
        simulatorUrl: '/hands-on-experiments?subject=chemistry',
        audioNarrationEn: 'Barcode scanned: UV-Visible Spectrophotometer. Concept: Beer-Lambert Law. It measures light attenuation through colored solutions to calculate exact molar concentration.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: यूवी-विजिबल स्पेक्ट्रोफोटोमीटर। सिद्धांत: बीयर-लैम्बर्ट का नियम। यह प्रकाश अवशोषण से सॉल्यूशन की सही सांद्रता मापता है।',
        simType: 'spectro',
      },
      {
        id: 'chem-centrifuge',
        name: 'Digital Benchtop Angle Centrifuge 6000 RPM',
        category: 'Separation Science',
        barcode: 'CSEEL-CHEM-5512-CENTRIFUGE',
        barcodeNumber: '8901234567893',
        xPercent: 44,
        yPercent: 65,
        badge: 'RCF 3500 x g',
        safetyLevel: 'Yellow',
        shortDesc: 'Brushless motor centrifuge for rapid precipitate separation and biological fractionation.',
        fullDesc: 'Features an electronic lid-lock safety mechanism, imbalance sensor, and LCD timer. Accommodates 8 x 15 mL conical centrifuge tubes for quick supernatant isolation.',
        scientificConcept: {
          title: 'Centrifugal Acceleration & Sedimentation Velocity',
          formula: 'RCF = 1.118 \\times 10^{-5} \\cdot r \\cdot (RPM)^2',
          principle: 'Subjecting heterogeneous mixtures to intense centrifugal artificial gravity accelerates the sedimentation rate of denser particles, forcing them to pellet at the bottom while isolating the pure supernatant liquid.',
          realWorldApplication: 'Plasma separation from whole blood, isolating DNA precipitates in alcohol, and industrial milk cream separation.',
        },
        specifications: [
          'Max Speed: 6000 RPM adjustable in steps of 100 RPM',
          'Max RCF: 3500 x g with brushless maintenance-free induction drive',
          'Lid-drop safety interlock and dynamic imbalance detector',
          'Microprocessor timer from 1 to 99 minutes with continuous hold',
        ],
        nepAlignedPracticals: [
          'Class 11: Purification of impure samples of solids by recrystallization & centrifugation',
          'Class 12: Separation of pigments from spinach extract',
          'Class 9: Separation of colloidal mixtures and suspensions',
        ],
        modelNumber: 'CS-CENTRI-6K',
        simulatorUrl: '/hands-on-experiments?subject=chemistry',
        audioNarrationEn: 'Barcode scanned: Digital Centrifuge. Concept: Centrifugal acceleration and sedimentation. It isolates precipitates and colloids at 3500 times the force of gravity.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: डिजिटल सेंट्रीफ्यूज। सिद्धांत: अपकेन्द्री बल (Centrifugal Force)। यह 3500 g फोर्स से सस्पेंशन और प्रेसिपिटेट को तुरंत अलग करता है।',
        simType: 'centrifuge',
      },
    ],
  },
  {
    id: 'physics',
    name: 'Physics & Optics Innovation Studio',
    discipline: 'Physics',
    icon: Atom,
    tagline: 'Precision laser optical benches, digital storage oscilloscopes, and kinematics tracks.',
    badgeColor: 'bg-blue-50 text-[#006fcc] border-blue-200',
    backgroundImage: '/images/categories/physics.jpg',
    capacity: '36 Students (Modular Stations)',
    curriculum: 'CBSE, ICSE, Cambridge STEM Aligned',
    narrationIntroEn: 'Welcome to the Physics Innovation Studio. Scan any apparatus barcode to inspect the underlying physics laws.',
    narrationIntroHi: 'फिजिक्स इनोवेशन स्टूडियो में आपका स्वागत है। भौतिक विज्ञान के नियमों और लाइव प्रयोग को देखने के लिए किसी भी उपकरण का बारकोड स्कैन करें।',
    cameraAngles: [
      { id: 'cam-phy-1', name: 'Optics Bench', yaw: 0, pitch: 0 },
      { id: 'cam-phy-2', name: 'Electronics DSO Station', yaw: 90, pitch: 5 },
      { id: 'cam-phy-3', name: 'Mechanics Air Track', yaw: 180, pitch: -5 },
      { id: 'cam-phy-4', name: 'Electromagnetism Bay', yaw: 270, pitch: 0 },
    ],
    hotspots: [
      {
        id: 'phy-optics-bench',
        name: 'Precision 2-Meter Laser Optical Bench System',
        category: 'Geometrical & Wave Optics',
        barcode: 'CSEEL-PHYS-1029-OPTICS',
        barcodeNumber: '8901234567894',
        xPercent: 30,
        yPercent: 52,
        badge: '0.1 mm Vernier Scale',
        safetyLevel: 'Green',
        shortDesc: 'Extruded aluminum optical rail with red/green laser diodes and digital photodetectors.',
        fullDesc: 'Heavy anodized aluminum rail with dual mm/inch laser engraved scales. Includes kinematic lens mounts, precision slit apertures, biprism adapters, and screen mounts with micro-adjusters.',
        scientificConcept: {
          title: 'Thin Lens Equation, Refraction & Wave Diffraction',
          formula: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}  \\quad \\text{and} \\quad \\beta = \\frac{\\lambda D}{d}',
          principle: 'Demonstrates Snell’s Law of refraction across spherical glass surfaces, image formation by convex/concave lenses, and Young’s Double Slit constructive/destructive photon interference fringes.',
          realWorldApplication: 'Microscope/telescope lens design, optical fiber telecommunications, laser barcode readers, and camera sensor optics.',
        },
        specifications: [
          'Bench Length: 2000 mm heavy rigid extruded profile',
          'He-Ne & Solid-State 650nm Laser Sources with diffraction slits',
          'Kinematic mounts with 3-axis angular fine adjustment screws',
          'Achromatic doublet lens sets (focal lengths: +50, +100, +150, -100 mm)',
        ],
        nepAlignedPracticals: [
          'Class 12: Finding focal length of convex lens & concave mirror by u-v graph',
          'Class 12: Refractive index of glass prism using angle of minimum deviation',
          'Class 12: Wave optics: Young’s Double Slit interference & diffraction fringe width',
        ],
        modelNumber: 'CS-OPTIC-200L',
        simulatorUrl: '/hands-on-experiments?subject=physics',
        audioNarrationEn: 'Barcode scanned: 2-Meter Precision Optical Bench. Concept: Thin lens refraction and wave interference. Verifies focal lengths and laser diffraction fringes.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: 2-मीटर ऑप्टिकल बेंच। सिद्धांत: लेंस अपवर्तन (Refraction) और वेव इंटरफेरेंस। यह फोकल लेंथ और लेजर फ्रिंज की जांच करता है।',
        simType: 'optics',
      },
      {
        id: 'phy-dso',
        name: '100 MHz Dual-Channel Digital Storage Oscilloscope (DSO)',
        category: 'Electronics & Waveforms',
        barcode: 'CSEEL-PHYS-7741-DSO100',
        barcodeNumber: '8901234567895',
        xPercent: 70,
        yPercent: 44,
        badge: '1 GSa/s Sampling',
        safetyLevel: 'Green',
        shortDesc: 'High-speed waveform visualizer with FFT spectral analysis and USB waveform capture.',
        fullDesc: '7-inch color TFT display with 1 GSa/s real-time sampling rate. Supports 32 automatic waveform parameter measurements, cursor tracking, and AC/DC circuit analysis.',
        scientificConcept: {
          title: 'AC Alternating Voltage Waveforms & Fourier Spectral Analysis',
          formula: 'V(t) = V_0 \\sin(2\\pi f t + \\phi)  \\quad \\text{and} \\quad V_{RMS} = \\frac{V_0}{\\sqrt{2}}',
          principle: 'Converts analog electrical potential signals into digital samples via high-speed ADCs, graphing instantaneous amplitude against time and plotting harmonics through Fast Fourier Transform (FFT).',
          realWorldApplication: 'ECG medical monitors, audio acoustic synthesis, semiconductor chip verification, and wireless telecommunications.',
        },
        specifications: [
          'Bandwidth: 100 MHz with 2 independent analog input channels',
          'Sample Rate: 1 GSa/s per channel with 28 Mpts memory depth',
          'Built-in 25 MHz arbitrary function generator with sine/square/ramp waves',
          'Auto-triggering: Edge, Pulse, Video, Slope, and Pattern triggers',
        ],
        nepAlignedPracticals: [
          'Class 12: Study of half-wave and full-wave rectifier ripple factor and filter circuits',
          'Class 12: V-I characteristics of PN junction diode and Zener voltage regulator',
          'Class 11: Determination of frequency of AC mains using Sonometer and electromagnet',
        ],
        modelNumber: 'CS-DSO-100D',
        simulatorUrl: '/hands-on-experiments?subject=physics',
        audioNarrationEn: 'Barcode scanned: 100 Megahertz Digital Storage Oscilloscope. Concept: Alternating current waveforms, frequency synthesis, and diode rectification.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: 100 MHz डिजिटल ऑसिलोस्कोप। सिद्धांत: एसी वेवफॉर्म और डायोड रेक्टिफिकेशन। यह वोल्टेज सिग्नल्स को रियल-टाइम ग्राफ करता है।',
        simType: 'dso',
      },
      {
        id: 'phy-air-track',
        name: 'Linear Air Track Momentum & Kinematics Bench',
        category: 'Classical Mechanics',
        barcode: 'CSEEL-PHYS-4203-AIRTRACK',
        barcodeNumber: '8901234567896',
        xPercent: 15,
        yPercent: 68,
        badge: 'Frictionless Air Cushion',
        safetyLevel: 'Green',
        shortDesc: 'Precision leveled triangular track with digital photogate timer for conservation laws.',
        fullDesc: 'Air blower generates a uniform air cushion supporting low-friction aluminum gliders. Dual photogate sensors measure velocities to calculate momentum and kinetic energy before and after collision.',
        scientificConcept: {
          title: 'Conservation of Linear Momentum & Newton’s Second Law',
          formula: '\\sum p_{\\text{initial}} = \\sum p_{\\text{final}}  \\iff  m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2',
          principle: 'In an isolated mechanical system with zero net external forces, total linear momentum remains invariant across elastic and inelastic collisions on frictionless air cushions.',
          realWorldApplication: 'Automotive crash safety testing, rocket orbital staging, and spacecraft inertia dynamics.',
        },
        specifications: [
          'Track Length: 1.5 meters triangular hollow extrusion with precision orifices',
          'Photogate Resolution: 0.0001 seconds digital microsecond timer',
          'Elastic and Inelastic collision bumpers with mass add-on weights',
          'Quiet variable-speed centrifugal air pump with flexible hose',
        ],
        nepAlignedPracticals: [
          'Class 11: Verification of Law of Conservation of Linear Momentum in 1D',
          'Class 11: Determination of acceleration due to gravity (g) using photogates',
          'Class 11: Study of Newton’s Second Law: Force vs Acceleration',
        ],
        modelNumber: 'CS-AIR-KIN150',
        simulatorUrl: '/hands-on-experiments?subject=physics',
        audioNarrationEn: 'Barcode scanned: Linear Air Track. Concept: Conservation of Linear Momentum. Creates a near-frictionless surface to verify Newton’s laws of motion.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: लीनियर एयर ट्रैक। सिद्धांत: संवेग संरक्षण का नियम (Conservation of Momentum) और न्यूटन के गति के नियम।',
        simType: 'airtrack',
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology & Cellular Microscopy Lab',
    discipline: 'Biology',
    icon: Microscope,
    tagline: 'Trinocular research microscopes, DNA electrophoresis tanks, and human anatomy stations.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    backgroundImage: '/images/categories/biology.jpg',
    capacity: '32 Students (Observation Pods)',
    curriculum: 'CBSE, ICSE, NCERT Biology Lab Manual',
    narrationIntroEn: 'Welcome to the Biology & Life Sciences Laboratory. Scan instrument barcodes to view cellular structures and genetic biotechnology concepts.',
    narrationIntroHi: 'बायोलॉजी लैब में आपका स्वागत है। सेलुलर माइक्रोस्कोपी और डीएनए बायोटेक्नोलॉजी के नियमों को समझने के लिए बारकोड स्कैन करें।',
    cameraAngles: [
      { id: 'cam-bio-1', name: 'Microscopy Bay', yaw: 0, pitch: 0 },
      { id: 'cam-bio-2', name: 'DNA Electrophoresis Pod', yaw: 80, pitch: -3 },
      { id: 'cam-bio-3', name: 'Anatomy Models Stand', yaw: 170, pitch: 5 },
      { id: 'cam-bio-4', name: 'Specimen Prep Station', yaw: 260, pitch: -4 },
    ],
    hotspots: [
      {
        id: 'bio-microscope',
        name: 'Trinocular Research Microscope with 4K HDMI Digital Camera',
        category: 'Cellular Cytology',
        barcode: 'CSEEL-BIOL-8321-MIC4K',
        barcodeNumber: '8901234567897',
        xPercent: 32,
        yPercent: 46,
        badge: '1000x Plan-Achromatic',
        safetyLevel: 'Green',
        shortDesc: 'Research-grade optics with live 4K projection onto student screen tablets.',
        fullDesc: 'Equipped with 4x, 10x, 40x, and 100x Oil Immersion Plan Achromatic objectives. The trinocular head mounts a 4K CMOS sensor for capturing high-definition micrographs of mitosis, pollen tubes, and blood smears.',
        scientificConcept: {
          title: 'Optical Magnification, Numerical Aperture & Resolution Limit',
          formula: 'd = \\frac{\\lambda}{2 \\cdot \\text{NA}}  \\quad \\text{where } \\text{NA} = n \\sin \\alpha',
          principle: 'Compound optical systems utilize dual-lens magnification (objective + ocular). Oil immersion with refractive index matching eliminates light refraction at glass interfaces to resolve sub-micron cellular organelles.',
          realWorldApplication: 'Pathology cancer biopsy diagnosis, hematology cell counts, and microbiology pathogen screening.',
        },
        specifications: [
          'Magnification: 40x to 1000x with Widefield WF10x/20mm eyepieces',
          'Camera: 4K UHD 60fps HDMI/USB CMOS Live Imaging Sensor',
          'Illumination: 3W Köhler LED with adjustable iris diaphragm condenser',
          'Coaxial coarse and fine focusing with 0.002 mm micro-step sensitivity',
        ],
        nepAlignedPracticals: [
          'Class 12: Preparation and study of temporary mount of Onion Root Tip to observe stages of Mitosis',
          'Class 12: Pollen germination on slide and pollen tube growth measurement',
          'Class 11: Study of plant anatomy: T.S. of Monocot and Dicot stem/root',
        ],
        modelNumber: 'CS-MIC-4KUHD',
        simulatorUrl: '/hands-on-experiments?subject=biology',
        audioNarrationEn: 'Barcode scanned: 4K Trinocular Research Microscope. Concept: Optical magnification and Abbe resolution limit. Resolves mitotic chromosomes and cellular organelles.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: 4K ट्राइनोकुलर माइक्रोस्कोप। सिद्धांत: ऑप्टिकल मैग्निफिकेशन और रेजोल्यूशन लिमिट। यह सेल डिवीजन और माइटोसिस को 1000 गुना बड़ा दिखाता है।',
        simType: 'microscope',
      },
      {
        id: 'bio-electrophoresis',
        name: 'Horizontal DNA Agarose Gel Electrophoresis Tank & UV Transilluminator',
        category: 'Biotechnology & Genetics',
        barcode: 'CSEEL-BIOL-6210-GELDNA',
        barcodeNumber: '8901234567898',
        xPercent: 68,
        yPercent: 54,
        badge: '0-150V Regulated Power',
        safetyLevel: 'Blue',
        shortDesc: 'DNA & RNA fragment separation chamber with blue LED visualization tray.',
        fullDesc: 'Transparent UV-transmissible polycarbonate chamber with platinum electrodes. Coupled with a digital power supply and safe 470nm blue-light transilluminator for real-time visualization of DNA bands without harmful UV.',
        scientificConcept: {
          title: 'Electrophoretic Migration & Molecular Sieving of DNA',
          formula: 'v = \\frac{q \\cdot E}{f}  \\quad (\\text{Velocity} \\propto \\text{Charge/Mass Ratio \& Gel Pore Size})',
          principle: 'Because negatively charged phosphate backbones give DNA uniform charge-to-mass ratios, fragments migrate towards the positive anode (+), sieving through porous agarose matrix where smaller base pairs travel faster.',
          realWorldApplication: 'Forensic DNA fingerprinting in criminology, paternity testing, viral PCR diagnostic detection, and recombinant gene cloning.',
        },
        specifications: [
          'Gel Size: 7 x 10 cm and 10 x 10 cm casting trays with multi-tooth combs',
          'Power Supply: 10-150V / 10-300mA constant voltage/current modes',
          'Safe Blue Light (470 nm) transilluminator for safe fluorescent dyes',
          'Safety cover with electrical interlock and auto-shutoff mechanism',
        ],
        nepAlignedPracticals: [
          'Class 12: Isolation of DNA from available plant material (Spinach / Green Pea)',
          'Class 12: Separation of DNA fragments by Agarose Gel Electrophoresis (Simulation)',
          'Class 12: Study of Mendelian inheritance through pedigree analysis',
        ],
        modelNumber: 'CS-GEL-DNA150',
        simulatorUrl: '/hands-on-experiments?subject=biology',
        audioNarrationEn: 'Barcode scanned: Agarose Gel Electrophoresis System. Concept: Molecular sieving of negatively charged DNA fragments across electric field potential.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: एगारोज जेल इलेक्ट्रोफोरेसिस। सिद्धांत: इलेक्ट्रिक फील्ड में डीएनए फ्रैगमेंट का मॉलिक्यूलर सेपरेशन। यह फॉरेंसिक डीएनए फिंगरप्रिंटिंग में काम आता है।',
        simType: 'gel',
      },
      {
        id: 'bio-respiration',
        name: 'Digital Photosynthesis & Respiration Chamber with CO2/O2 Probes',
        category: 'Plant Physiology',
        barcode: 'CSEEL-BIOL-4918-RESP',
        barcodeNumber: '8901234567899',
        xPercent: 18,
        yPercent: 66,
        badge: 'Dual Gas Sensors',
        safetyLevel: 'Green',
        shortDesc: 'Sealed environmental chamber logging real-time gas exchange curves during plant metabolism.',
        fullDesc: 'Includes high-precision optical Oxygen and NDIR Carbon Dioxide gas probes connected to digital data loggers. Allows students to graph photosynthetic rate under varying light spectrums and temperatures.',
        scientificConcept: {
          title: 'Cellular Respiration & Photosynthetic Gas Exchange',
          formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} + h\\nu \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
          principle: 'Measures dynamic equilibrium between photosynthetic CO2 fixation / O2 release under photon irradiation versus cellular respiration O2 consumption in darkness.',
          realWorldApplication: 'Agricultural greenhouse climate optimization, biofuel algae production, and atmospheric carbon sequestration analysis.',
        },
        specifications: [
          'CO2 Sensor Range: 0 to 10,000 ppm (±50 ppm accuracy)',
          'O2 Sensor Range: 0 to 25% (±0.2% resolution)',
          'Programmable RGB LED light array for spectral wavelength experiments',
          'Bluetooth data telemetry to mobile and desktop graph analysis apps',
        ],
        nepAlignedPracticals: [
          'Class 11: Study of rate of respiration in germinating seeds',
          'Class 11: Comparison of the rate of transpiration on upper and lower surfaces of leaf',
          'Class 10: Experimental proof that Carbon Dioxide is given out during respiration',
        ],
        modelNumber: 'CS-RESP-DUAL',
        simulatorUrl: '/hands-on-experiments?subject=biology',
        audioNarrationEn: 'Barcode scanned: Digital Photosynthesis Chamber. Concept: Photochemical gas exchange and cellular respiration rates under controlled wavelengths.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: डिजिटल प्रकाश संश्लेषण चैंबर। सिद्धांत: प्रकाश संश्लेषण और श्वसन में CO2 और O2 गैस एक्सचेंज की लाइव मॉनिटरिंग।',
        simType: 'photosynthesis',
      },
    ],
  },
  {
    id: 'robotics',
    name: 'ATL Robotics, AI & IoT Tinkering Hub',
    discipline: 'ATL Robotics & AI',
    icon: Cpu,
    tagline: 'Microcontroller experimentation stations, 3D printers, and edge AI computer vision.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    backgroundImage: '/images/categories/engineering.jpg',
    capacity: '40 Innovators (Team Pods)',
    curriculum: 'Atal Innovation Mission (AIM), NITI Aayog, NEP 2020 AI Framework',
    narrationIntroEn: 'Welcome to the ATL Robotics Hub. Scan barcodes on microcontrollers, 3D printers, and AI robotic arms to inspect their embedded engineering concepts.',
    narrationIntroHi: 'अटल टिंकरिंग लैब में आपका स्वागत है। 3D प्रिंटर, रोबोटिक आर्म और IoT सिस्टम के इंजीनियरिंग कॉन्सेप्ट्स देखने के लिए बारकोड स्कैन करें।',
    cameraAngles: [
      { id: 'cam-atl-1', name: 'IoT Sensor Station', yaw: 0, pitch: 0 },
      { id: 'cam-atl-2', name: '3D Prototyping Bay', yaw: 85, pitch: 5 },
      { id: 'cam-atl-3', name: 'Robotics Arena', yaw: 175, pitch: -4 },
      { id: 'cam-atl-4', name: 'AI Computer Vision Rig', yaw: 265, pitch: 0 },
    ],
    hotspots: [
      {
        id: 'atl-iot-kit',
        name: 'ESP32 IoT Sensor & Smart Agriculture Experimentation Dock',
        category: 'Internet of Things & Microcontrollers',
        barcode: 'CSEEL-ROBT-3180-IOTDOCK',
        barcodeNumber: '8901234567801',
        xPercent: 28,
        yPercent: 50,
        badge: 'Wi-Fi & BLE 5.0',
        safetyLevel: 'Green',
        shortDesc: 'Modular sensory prototyping dock with cloud dashboard telemetry.',
        fullDesc: 'Comprehensive IoT bench with soil moisture, ultrasonic distance, DHT22 temp/humidity, PIR motion, and light sensors. Students code block-based and C++ scripts to transmit sensor data to real-time cloud dashboards.',
        scientificConcept: {
          title: 'Analog-to-Digital Conversion (ADC) & MQTT Cloud Telemetry',
          formula: 'V_{\\text{out}} = V_{\\text{in}} \\left(\\frac{R_2}{R_1 + R_2}\\right) \\implies \\text{Digital Code} = \\left(\\frac{V_{\\text{out}}}{V_{\\text{ref}}}\\right) \\times 4095',
          principle: 'Transduces continuous physical environmental phenomena (soil resistance, capacitance, photon flux) into 12-bit digital values, broadcasting telemetry via Wi-Fi UDP/MQTT packet architecture.',
          realWorldApplication: 'Smart city weather stations, automated precision drip irrigation, and industrial predictive maintenance.',
        },
        specifications: [
          'Controller: Dual-Core ESP32 240MHz with 4MB Flash and Wi-Fi/Bluetooth',
          '20+ Plug-and-Play Grove sensor modules with protected reverse polarity',
          '0.96-inch OLED I2C visual telemetry screen on dock',
          'Cloud dashboard integration for remote IoT actuator control',
        ],
        nepAlignedPracticals: [
          'Middle & Secondary: Building an automated smart plant watering IoT system',
          'Class 9-12: Air quality monitoring station with cloud alert notification',
          'ATL Tinkering Challenge: Home automation and smart energy management',
        ],
        modelNumber: 'CS-ATL-IOT32',
        simulatorUrl: '/hands-on-experiments?subject=engineering',
        audioNarrationEn: 'Barcode scanned: ESP32 IoT Sensor Dock. Concept: Analog-to-digital signal conversion and MQTT wireless cloud telemetry for smart automation.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: ESP32 IoT सेंसर डॉक। सिद्धांत: एनालॉग टू डिजिटल कन्वर्जन (ADC) और वाई-फाई क्लाउड डेटा टेलीमेट्री।',
        simType: 'iot',
      },
      {
        id: 'atl-3d-printer',
        name: 'CoreXY High-Speed Rapid Prototyping 3D Printer',
        category: 'Additive Manufacturing',
        barcode: 'CSEEL-ROBT-9902-PRINT3D',
        barcodeNumber: '8901234567802',
        xPercent: 72,
        yPercent: 42,
        badge: '500 mm/s Print Speed',
        safetyLevel: 'Yellow',
        shortDesc: 'Enclosed 3D printer for student engineering CAD designs and mechanical robotics parts.',
        fullDesc: 'Features direct-drive all-metal hotend up to 300°C, auto-bed leveling sensor, and HEPA air filter. Prints biodegradable PLA and PETG filaments with 0.1 mm layer precision.',
        scientificConcept: {
          title: 'Fused Deposition Modeling (FDM) & Polymer Glass Transition',
          formula: 'T_g < T_{\\text{extrusion}} < T_d  \\quad (\\text{PLA: } T_g \\approx 60^\\circ\\text{C}, \\; T_{\\text{nozzle}} \\approx 210^\\circ\\text{C})',
          principle: 'Translates 3D CAD G-code Cartesian toolpaths into coordinated dual-stepper CoreXY motion, liquefying thermoplastic filament past glass transition temperature and fusing consecutive micro-layers.',
          realWorldApplication: 'Rapid aerospace lightweight prototyping, custom biomechanical implants, and robotic gearing fabrication.',
        },
        specifications: [
          'Build Volume: 220 x 220 x 250 mm with PEI textured spring steel plate',
          'Max Print Speed: 500 mm/s with 20000 mm/s² acceleration',
          'Auto Bed Leveling with 36-point dual inductive mesh compensation',
          'Filament run-out sensor and power-loss resume recovery',
        ],
        nepAlignedPracticals: [
          'Middle School: Designing and 3D printing custom robotic chassis wheels and gears',
          'Secondary: Aerodynamic airfoil testing in miniature wind tunnel',
          'ATL Innovation: Creating ergonomic prosthetic assistive devices',
        ],
        modelNumber: 'CS-PRINT-3D500',
        simulatorUrl: '/hands-on-experiments?subject=engineering',
        audioNarrationEn: 'Barcode scanned: CoreXY Rapid 3D Printer. Concept: Additive fused deposition modeling and polymer phase transition for mechanical robotics fabrication.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: हाई-स्पीड 3D प्रिंटर। सिद्धांत: एडिटिव मैन्युफैक्चरिंग (FDM)। यह कंप्यूटर CAD डिज़ाइन को रियल 3D ऑब्जेक्ट में प्रिंट करता है।',
        simType: 'printer',
      },
      {
        id: 'atl-arm-robot',
        name: '6-DOF Programmable Robotic Arm with AI Vision Gripper',
        category: 'Robotics & Computer Vision',
        barcode: 'CSEEL-ROBT-7043-ARM6DOF',
        barcodeNumber: '8901234567803',
        xPercent: 48,
        yPercent: 62,
        badge: 'Inverse Kinematics',
        safetyLevel: 'Green',
        shortDesc: 'Articulated servo robotic arm with onboard camera for color/shape sorting.',
        fullDesc: 'Aluminum alloy robotic arm with metal gear digital servos and magnetic encoders. The wrist-mounted camera runs onboard OpenCV color detection to identify, track, and sort objects autonomously.',
        scientificConcept: {
          title: 'Inverse Kinematics (IK) & Convolutional Feature Extraction',
          formula: '\\vec{\\theta} = f^{-1}(\\vec{X}_{x, y, z, \\text{roll}, \\text{pitch}, \\text{yaw}})',
          principle: 'Transforms Cartesian target coordinates in 3D space into calculated joint servo rotational angles (\\(\\theta_1 \\dots \\theta_6\\)) using trigonometric Jacobian matrices, paired with computer vision edge-detection convolution filters.',
          realWorldApplication: 'Automated factory assembly lines, robotic surgical laparoscopy, and warehouse AI logistics sorting.',
        },
        specifications: [
          'Degrees of Freedom: 6-Axis articulating arm with parallel jaw gripper',
          'Payload Capacity: 350 grams with 0.5 mm repeatability precision',
          'Vision: HD wide-angle camera with integrated OpenCV color & QR tracking',
          'Control: Python API, ROS (Robot Operating System), and Scratch visual blocks',
        ],
        nepAlignedPracticals: [
          'Class 10-12: Programming inverse kinematics for robotic pick-and-place routines',
          'AI Module: Machine learning object classification and automated sorting',
          'Robotics Competition: Precision trajectory path planning and obstacle evasion',
        ],
        modelNumber: 'CS-ROBOT-6DOF',
        simulatorUrl: '/hands-on-experiments?subject=engineering',
        audioNarrationEn: 'Barcode scanned: 6-Axis AI Robotic Arm. Concept: Inverse kinematics and OpenCV computer vision for automated coordinate sorting.',
        audioNarrationHi: 'बारकोड स्कैन हुआ: 6-DOF एआई रोबोटिक आर्म। सिद्धांत: इनवर्स काइनेमैटिक्स (Inverse Kinematics) और कंप्यूटर विजन ऑब्जेक्ट ट्रैकिंग।',
        simType: 'robotarm',
      },
    ],
  },
];

// Helper: Play Beep / Laser Sound using pure Web Audio API without external file dependencies
const playScanBeep = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Laser chirp oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Ignore audio context autoplay restrictions
  }
};

// Interactive Animated Scientific Concept Visualizer Component
const ConceptVisualizer: React.FC<{ hotspot: Hotspot }> = ({ hotspot }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const renderSim = () => {
    switch (hotspot.simType) {
      case 'titration':
        const dropY = (frame * 1.5) % 60;
        const colorProgress = Math.min(1, frame / 70);
        const liquidColor = `rgb(${Math.round(240 - colorProgress * 30)}, ${Math.round(240 - colorProgress * 140)}, ${Math.round(255 - colorProgress * 50)})`;
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-900 rounded-xl">
            {/* Burette Tube */}
            <rect x="135" y="10" width="30" height="70" fill="rgba(255,255,255,0.15)" stroke="#60A5FA" strokeWidth="2" rx="4" />
            <line x1="140" y1="25" x2="150" y2="25" stroke="#93C5FD" strokeWidth="1" />
            <line x1="140" y1="40" x2="155" y2="40" stroke="#93C5FD" strokeWidth="1.5" />
            <line x1="140" y1="55" x2="150" y2="55" stroke="#93C5FD" strokeWidth="1" />
            {/* Liquid in Burette */}
            <rect x="138" y="30" width="24" height="48" fill="#3B82F6" opacity="0.8" />
            {/* Burette Tip & Stopcock */}
            <polygon points="145,80 155,80 152,90 148,90" fill="#60A5FA" />
            <circle cx="150" cy="85" r="3" fill="#EF4444" />
            {/* Falling Drop */}
            <circle cx="150" cy={90 + dropY} r="3" fill="#3B82F6" opacity={dropY > 50 ? 0 : 1} />
            {/* Conical Flask */}
            <polygon points="120,150 180,150 165,115 135,115" fill="rgba(255,255,255,0.1)" stroke="#CBD5E1" strokeWidth="2" />
            {/* Analyte Solution with dynamic color transition */}
            <polygon points="123,148 177,148 168,128 132,128" fill={liquidColor} />
            {/* Magnetic Stirrer Vortex */}
            <ellipse cx="150" cy="144" rx={8 + Math.sin(frame * 0.3) * 3} ry="2" fill="#E2E8F0" />
            {/* Live Data HUD */}
            <text x="15" y="25" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">TITRATION SIMULATION</text>
            <text x="15" y="42" fill="#94A3B8" fontSize="9" fontFamily="monospace">Vol: {(frame * 0.12).toFixed(2)} mL</text>
            <text x="15" y="58" fill="#F472B6" fontSize="9" fontFamily="monospace">pH: {(3.2 + colorProgress * 6.8).toFixed(2)}</text>
            <text x="15" y="74" fill="#34D399" fontSize="9" fontFamily="monospace">Status: {colorProgress > 0.85 ? 'ENDPOINT REACHED' : 'TITRATING'}</text>
          </svg>
        );

      case 'optics':
        const rayAngle = Math.sin(frame * 0.05) * 12;
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-900 rounded-xl">
            {/* Optical Bench Rail */}
            <rect x="20" y="130" width="260" height="8" fill="#334155" rx="2" />
            {/* Laser Emitter */}
            <rect x="25" y="65" width="30" height="30" fill="#DC2626" rx="4" />
            <circle cx="55" cy="80" r="4" fill="#EF4444" />
            <text x="30" y="83" fill="#FFF" fontSize="8" fontWeight="bold">LASER</text>
            {/* Laser Beam Path */}
            <line x1="55" y1="80" x2="150" y2={80 + rayAngle} stroke="#EF4444" strokeWidth="3" opacity="0.9" />
            {/* Convex Lens */}
            <path d="M 150,40 Q 165,80 150,120 Q 135,80 150,40 Z" fill="rgba(147, 197, 253, 0.4)" stroke="#60A5FA" strokeWidth="2" />
            <line x1="150" y1="30" x2="150" y2="130" stroke="#94A3B8" strokeDasharray="3,3" strokeWidth="1" />
            {/* Refracted Focus Rays */}
            <line x1="150" y1={80 + rayAngle} x2="230" y2="80" stroke="#EF4444" strokeWidth="2.5" />
            <line x1="230" y1="80" x2="275" y2={80 - rayAngle * 1.2} stroke="#EF4444" strokeWidth="2" strokeDasharray="2,2" />
            {/* Focal Point Indicator */}
            <circle cx="230" cy="80" r="4" fill="#FBBF24" className="animate-ping" />
            <text x="218" y="100" fill="#FBBF24" fontSize="9" fontFamily="monospace" fontWeight="bold">Focal (F)</text>
            {/* Live Data HUD */}
            <text x="15" y="25" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">WAVE & RAY OPTICS SIM</text>
            <text x="15" y="40" fill="#94A3B8" fontSize="9" fontFamily="monospace">f = +150.0 mm</text>
            <text x="15" y="55" fill="#94A3B8" fontSize="9" fontFamily="monospace">λ = 650 nm (He-Ne)</text>
          </svg>
        );

      case 'dso':
        const points = [];
        for (let x = 30; x <= 270; x += 3) {
          const y = 80 + Math.sin((x + frame * 4) * 0.08) * 35;
          points.push(`${x},${y}`);
        }
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-950 rounded-xl">
            {/* Oscilloscope Grid Screen */}
            <rect x="20" y="20" width="260" height="120" fill="#022c22" stroke="#059669" strokeWidth="1.5" rx="6" />
            {/* Grid lines */}
            {[40, 60, 80, 100, 120].map((y) => (
              <line key={y} x1="20" y1={y} x2="280" y2={y} stroke="#065f46" strokeDasharray="2,4" strokeWidth="1" />
            ))}
            {[60, 100, 140, 180, 220, 260].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="140" stroke="#065f46" strokeDasharray="2,4" strokeWidth="1" />
            ))}
            {/* Center crosshair */}
            <line x1="20" y1="80" x2="280" y2="80" stroke="#10b981" strokeWidth="1.2" opacity="0.6" />
            <line x1="150" y1="20" x2="150" y2="140" stroke="#10b981" strokeWidth="1.2" opacity="0.6" />
            {/* Phosphor Sine Wave */}
            <polyline fill="none" stroke="#34D399" strokeWidth="2.5" points={points.join(' ')} filter="drop-shadow(0 0 4px #34D399)" />
            {/* Live Measurements HUD */}
            <text x="30" y="36" fill="#6EE7B7" fontSize="9" fontFamily="monospace" fontWeight="bold">CH1: 5.00V / Div</text>
            <text x="120" y="36" fill="#6EE7B7" fontSize="9" fontFamily="monospace">Time: 1.00ms</text>
            <text x="210" y="36" fill="#FBBF24" fontSize="9" fontFamily="monospace">1.000 kHz</text>
            <text x="30" y="132" fill="#A7F3D0" fontSize="8" fontFamily="monospace">Vpp: 10.04V | Vrms: 3.54V</text>
          </svg>
        );

      case 'gel':
        const band1 = 35 + ((frame * 0.8) % 85);
        const band2 = 35 + ((frame * 0.55) % 65);
        const band3 = 35 + ((frame * 0.35) % 45);
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-900 rounded-xl">
            {/* Gel Tank Surface */}
            <rect x="25" y="20" width="250" height="120" fill="#082f49" stroke="#0284c7" strokeWidth="2" rx="6" />
            {/* Gel Wells */}
            {[50, 95, 140, 185, 230].map((x, i) => (
              <rect key={i} x={x} y="30" width="25" height="10" fill="#0369a1" stroke="#38bdf8" rx="2" />
            ))}
            {/* Cathode & Anode Marks */}
            <text x="32" y="38" fill="#F87171" fontSize="12" fontWeight="bold">- (Cathode)</text>
            <text x="32" y="132" fill="#4ADE80" fontSize="12" fontWeight="bold">+ (Anode)</text>
            {/* Migrating DNA Fluorescent Bands */}
            <rect x="52" y={band1} width="21" height="4" fill="#38BDF8" rx="1" filter="drop-shadow(0 0 5px #38BDF8)" />
            <rect x="52" y={band2} width="21" height="4" fill="#38BDF8" rx="1" filter="drop-shadow(0 0 5px #38BDF8)" />
            <rect x="52" y={band3} width="21" height="4" fill="#38BDF8" rx="1" filter="drop-shadow(0 0 5px #38BDF8)" />

            <rect x="97" y={35 + ((frame * 0.7) % 75)} width="21" height="4" fill="#818CF8" rx="1" filter="drop-shadow(0 0 5px #818CF8)" />
            <rect x="142" y={35 + ((frame * 0.9) % 90)} width="21" height="4" fill="#34D399" rx="1" filter="drop-shadow(0 0 5px #34D399)" />
            {/* Live Telemetry */}
            <text x="180" y="80" fill="#E0F2FE" fontSize="9" fontFamily="monospace">Voltage: 100V</text>
            <text x="180" y="95" fill="#38BDF8" fontSize="9" fontFamily="monospace">Ladder: 100-1000 bp</text>
            <text x="180" y="110" fill="#4ADE80" fontSize="9" fontFamily="monospace">RUNNING: 45 min</text>
          </svg>
        );

      case 'robotarm':
        const angle = Math.sin(frame * 0.06) * 25;
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-900 rounded-xl">
            {/* Robotic Base Platform */}
            <rect x="40" y="130" width="60" height="15" fill="#334155" rx="3" />
            <circle cx="70" cy="130" r="14" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            {/* Arm Link 1 */}
            <g transform={`rotate(${angle - 30}, 70, 130)`}>
              <rect x="64" y="65" width="12" height="65" fill="#3B82F6" rx="4" />
              <circle cx="70" cy="65" r="8" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="1.5" />
              {/* Arm Link 2 */}
              <g transform={`rotate(${45 - angle * 1.5}, 70, 65)`}>
                <rect x="66" y="15" width="8" height="50" fill="#60A5FA" rx="3" />
                <circle cx="70" cy="15" r="6" fill="#2563EB" />
                {/* Vision Gripper */}
                <path d="M 64,15 L 60,0 M 76,15 L 80,0" stroke="#F59E0B" strokeWidth="3" />
                {/* AI Camera Cone */}
                <polygon points="70,12 50,-10 90,-10" fill="rgba(234, 179, 8, 0.2)" />
              </g>
            </g>
            {/* Sorting Target Box */}
            <rect x="220" y="115" width="40" height="30" fill="#1E293B" stroke="#22C55E" strokeWidth="1.5" rx="4" />
            <text x="226" y="134" fill="#4ADE80" fontSize="9" fontFamily="monospace" fontWeight="bold">BIN #1</text>
            {/* Live HUD */}
            <text x="140" y="25" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">6-DOF INVERSE KINEMATICS</text>
            <text x="140" y="42" fill="#94A3B8" fontSize="8" fontFamily="monospace">X: 184.2 mm | Y: 92.0 mm</text>
            <text x="140" y="56" fill="#FBBF24" fontSize="8" fontFamily="monospace">AI Vision: Object Detected</text>
            <text x="140" y="70" fill="#34D399" fontSize="8" fontFamily="monospace">Gripper: Locked (350g)</text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 300 160" className="w-full h-full bg-slate-900 rounded-xl">
            {/* Generic Instrument Sensor Wave Simulation */}
            <rect x="20" y="20" width="260" height="120" fill="#0f172a" stroke="#334155" strokeWidth="1.5" rx="6" />
            <circle cx="80" cy="80" r={30 + Math.sin(frame * 0.1) * 8} fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
            <circle cx="80" cy="80" r="10" fill="#0284C7" />
            <path d={`M 140,80 Q 180,${80 - Math.sin(frame * 0.1) * 30} 220,80 T 260,80`} fill="none" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="130" y="45" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">{hotspot.category}</text>
            <text x="130" y="65" fill="#94A3B8" fontSize="9" fontFamily="monospace">Model: {hotspot.modelNumber}</text>
            <text x="130" y="115" fill="#4ADE80" fontSize="9" fontFamily="monospace">System Calibrated: 100%</text>
          </svg>
        );
    }
  };

  return <div className="w-full aspect-[16/9] max-h-[220px]">{renderSim()}</div>;
};

export default function VirtualLabTourClient() {
  const [selectedLabId, setSelectedLabId] = useState<string>('chemistry');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [narrationLang, setNarrationLang] = useState<'en' | 'hi'>('en');

  // 360 Panoramic Drag & Orientation State
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedBarcode, setCopiedBarcode] = useState<boolean>(false);

  const tourContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeLab = labEnvironments.find((l) => l.id === selectedLabId) || labEnvironments[0];

  // Auto-pan loop
  useEffect(() => {
    let lastTime = performance.now();
    const rotate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      if (isAutoRotating && !isDragging) {
        setPanX((prev) => (prev + delta * 6) % 360);
      }
      animationFrameRef.current = requestAnimationFrame(rotate);
    };

    animationFrameRef.current = requestAnimationFrame(rotate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAutoRotating, isDragging]);

  // Stop all active audio/speech
  const stopAllAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Centralized Close Inspector handler that immediately kills all sounds
  const handleCloseInspector = useCallback(() => {
    stopAllAudio();
    setSelectedHotspot(null);
    setIsScanning(false);
  }, [stopAllAudio]);

  // Escape key handler to close modal & kill sound instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseInspector();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseInspector]);

  // Audio Speech Synthesis Trigger Function
  const speakNarration = useCallback((text: string, lang: 'en' | 'hi' = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isAudioMuted) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [isAudioMuted]);

  // Hotspot selection / Barcode scan handler
  const handleScanHotspot = (hotspot: Hotspot) => {
    stopAllAudio();
    setIsAutoRotating(false);
    setIsScanning(true);
    setScannedBarcode(hotspot.barcode);
    playScanBeep();

    // Laser scan animation delay before revealing modal
    setTimeout(() => {
      setIsScanning(false);
      setSelectedHotspot(hotspot);
      const narration = narrationLang === 'hi' ? hotspot.audioNarrationHi : hotspot.audioNarrationEn;
      speakNarration(narration, narrationLang);
    }, 450);
  };

  // Re-speak if language toggled inside modal
  const handleToggleLang = (lang: 'en' | 'hi') => {
    setNarrationLang(lang);
    if (selectedHotspot) {
      const narration = lang === 'hi' ? selectedHotspot.audioNarrationHi : selectedHotspot.audioNarrationEn;
      speakNarration(narration, lang);
    }
  };

  // Drag Handlers for 360 Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanX((prev) => (prev - deltaX * 0.35) % 360);
    setPanY((prev) => Math.max(-25, Math.min(25, prev + deltaY * 0.25)));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Handlers for Mobile Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setPanX((prev) => (prev - deltaX * 0.35) % 360);
    setPanY((prev) => Math.max(-25, Math.min(25, prev + deltaY * 0.25)));
  };

  const handleTouchEnd = () => setIsDragging(false);

  const toggleFullscreen = () => {
    if (!tourContainerRef.current) return;
    if (!document.fullscreenElement) {
      tourContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const setCameraAngle = (yaw: number, pitch: number) => {
    setIsAutoRotating(false);
    setPanX(yaw);
    setPanY(pitch);
  };

  const getCompassDirection = (deg: number) => {
    const d = ((deg % 360) + 360) % 360;
    if (d >= 337.5 || d < 22.5) return 'N (0°)';
    if (d >= 22.5 && d < 67.5) return 'NE (45°)';
    if (d >= 67.5 && d < 112.5) return 'E (90°)';
    if (d >= 112.5 && d < 157.5) return 'SE (135°)';
    if (d >= 157.5 && d < 202.5) return 'S (180°)';
    if (d >= 202.5 && d < 247.5) return 'SW (225°)';
    if (d >= 247.5 && d < 292.5) return 'W (270°)';
    return 'NW (315°)';
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBarcode(true);
      setTimeout(() => setCopiedBarcode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#121212] text-[#202124] dark:text-[#E8EAED] pb-12 transition-colors">
      
      {/* ─── Top Header Banner ─── */}
      <section className="bg-white dark:bg-[#1E1F20] border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F0FE] text-[#1967D2] dark:bg-[#1A73E8]/15 dark:text-[#8AB4F8] mb-1.5">
              <Barcode className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>Smart Barcode & NEP 2020 Interactive Lab</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              360° Virtual Science & ATL Robotics Lab Tour
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Scan instrument barcodes in 360° view to discover scientific concepts, live simulations, and CBSE practicals.
            </p>
          </div>

          {/* Quick Stats & Audio Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link
              href="/virtual-lab"
              className="btn-google-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs"
            >
              <Layers size={14} />
              <span>Launch 3D Lab Workbench</span>
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground">
              <Scan className="w-4 h-4 text-primary animate-pulse" />
              <span>Click Barcode to Scan</span>
            </div>
            <button
              onClick={() => {
                const nextMuted = !isAudioMuted;
                setIsAudioMuted(nextMuted);
                if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                !isAudioMuted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {!isAudioMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{!isAudioMuted ? 'Voice Audio ON' : 'Voice Audio OFF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Lab Selector Tabs ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {labEnvironments.map((lab) => {
            const Icon = lab.icon;
            const isSelected = lab.id === selectedLabId;
            return (
              <button
                key={lab.id}
                onClick={() => {
                  setSelectedLabId(lab.id);
                  setSelectedHotspot(null);
                  setPanX(0);
                  setPanY(0);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                  isSelected
                    ? 'btn-google-primary shadow-sm'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lab.name.split('&')[0]}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Main 360° Interactive Canvas ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div
          ref={tourContainerRef}
          className="relative rounded-3xl overflow-hidden border border-border bg-slate-950 shadow-lg group select-none touch-none aspect-[4/3] sm:aspect-auto sm:h-[68vh] sm:min-h-[500px] sm:max-h-[740px]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Panoramic Dynamic Background Sphere */}
          <div
            className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
            style={{
              backgroundImage: `url(${activeLab.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: `${50 + panX * 0.35}% ${50 + panY * 0.5}%`,
              transform: `scale(${zoomLevel})`,
              filter: 'brightness(0.95) contrast(1.08) saturate(1.12)',
            }}
          />

          {/* Perspective Depth Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.85) 100%), linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 60px 60px, 60px 60px',
              transform: `translate(${panX * 1.5}px, ${panY * 1.5}px)`,
            }}
          />

          {/* Soft Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60" />

          {/* Laser Barcode Scanning Sweep Animation */}
          {isScanning && (
            <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
              <div className="relative w-72 h-44 border-2 border-emerald-400/80 rounded-2xl bg-emerald-950/30 overflow-hidden shadow-[0_0_30px_rgba(52,168,83,0.4)] flex flex-col items-center justify-between p-4">
                {/* Corner Targets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                
                {/* Sweeping Laser Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#EF4444] animate-bounce duration-700" />

                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                  <Scan className="w-4 h-4 animate-spin" />
                  <span>READING BARCODE...</span>
                </div>

                <div className="bg-black/80 border border-emerald-500/40 px-3 py-1 rounded-lg text-[11px] font-mono text-emerald-300">
                  {scannedBarcode}
                </div>

                <p className="text-[10px] text-emerald-200/80 font-mono">
                  CSEEL OPTICAL CODE VERIFIED ✓
                </p>
              </div>
            </div>
          )}

          {/* 360 Interactive Barcode Hotspots */}
          {activeLab.hotspots.map((hotspot) => {
            const normalizedX = (hotspot.xPercent + (panX * 0.3) + 100) % 100;
            const normalizedY = Math.max(12, Math.min(88, hotspot.yPercent - (panY * 0.35)));
            const isSelected = selectedHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 active:scale-95 group/pin"
                style={{
                  left: `${normalizedX}%`,
                  top: `${normalizedY}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleScanHotspot(hotspot);
                }}
              >
                {/* Barcode Instrument Tag HUD */}
                <div className="relative flex flex-col items-center">
                  
                  {/* Glowing Pulse Rings */}
                  <span className={`absolute -inset-1 rounded-2xl animate-ping opacity-50 ${isSelected ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  
                  {/* Barcode Badge Pill */}
                  <div
                    className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-xl transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-300 scale-105 shadow-amber-500/30'
                        : 'bg-slate-900/90 hover:bg-slate-900 text-white border-emerald-400/80 hover:border-emerald-300 hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-emerald-300 shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] font-black leading-tight text-white flex items-center gap-1">
                          <span>{hotspot.name.split(' ')[0]} {hotspot.name.split(' ')[1] || ''}</span>
                        </p>
                        <p className="text-[8px] font-mono text-emerald-300 leading-none mt-0.5">
                          SCAN BARCODE
                        </p>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                      <Scan size={10} className="text-emerald-300 animate-pulse" />
                    </div>
                  </div>

                  {/* Indicator Arrow */}
                  <div className="w-2 h-2 bg-slate-900 border-r border-b border-emerald-400 transform rotate-45 -mt-1" />

                </div>
              </div>
            );
          })}

          {/* Top HUD: Current Lab Info & Orientation */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border border-border rounded-2xl p-2 sm:px-3.5 sm:py-2.5 shadow-lg flex items-center gap-2 sm:gap-3 max-w-[80%] sm:max-w-md">
              <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] dark:bg-[#1A73E8]/20 border border-border text-primary flex items-center justify-center shrink-0">
                <activeLab.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">
                  {activeLab.name}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium truncate mt-0.5">
                  {activeLab.capacity} • {activeLab.hotspots.length} Barcoded Stations
                </p>
              </div>
            </div>

            {/* Compass Heading */}
            <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border border-border rounded-2xl px-3 py-1.5 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <div className="text-left">
                <p className="text-[8px] font-bold text-muted-foreground uppercase leading-none">Orientation</p>
                <p className="text-[11px] font-bold text-foreground">{getCompassDirection(panX)}</p>
              </div>
            </div>
          </div>

          {/* Center Drag Hint on Mobile / Desktop */}
          <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-md opacity-80 whitespace-nowrap">
            👆 Drag to explore in 360° • Click any Barcode to inspect concept
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
            
            {/* Camera Angle Presets on the Left */}
            <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border border-border rounded-full p-1 shadow-lg max-w-[60%] sm:max-w-none overflow-x-auto no-scrollbar">
              <Camera className="w-3.5 h-3.5 text-primary ml-1.5 mr-0.5 shrink-0" />
              {activeLab.cameraAngles.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setCameraAngle(cam.yaw, cam.pitch)}
                  className="px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-foreground hover:bg-primary hover:text-white transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {cam.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Viewer Controls on the Right */}
            <div className="pointer-events-auto flex items-center gap-1 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border border-border rounded-full p-1 shadow-lg shrink-0">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                aria-label={isAutoRotating ? 'Pause auto-pan' : 'Start auto-pan'}
                className={`p-1.5 rounded-full transition cursor-pointer ${
                  isAutoRotating ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={() => {
                  setPanX(0);
                  setPanY(0);
                  setZoomLevel(1);
                }}
                aria-label="Reset view"
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition cursor-pointer"
              >
                <RotateCw size={14} />
              </button>

              <button
                onClick={() => setZoomLevel((prev) => Math.min(1.8, prev + 0.2))}
                aria-label="Zoom in"
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition cursor-pointer hidden xs:inline-flex"
              >
                <ZoomIn size={14} />
              </button>

              <button
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition cursor-pointer hidden sm:inline-flex"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

          </div>

        </div>

        {/* Live Audio & Narration Bar */}
        <div className="mt-3 card-google-surface p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase text-primary tracking-wider">
                  Live Voice Audio Guide
                </p>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-muted border border-border text-muted-foreground">
                  {narrationLang === 'hi' ? 'Hindi Narration' : 'English Narration'}
                </span>
              </div>
              <p className="text-xs text-foreground font-medium truncate mt-0.5">
                "{selectedHotspot ? (narrationLang === 'hi' ? selectedHotspot.audioNarrationHi : selectedHotspot.audioNarrationEn) : (narrationLang === 'hi' ? activeLab.narrationIntroHi : activeLab.narrationIntroEn)}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => handleToggleLang(narrationLang === 'en' ? 'hi' : 'en')}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-muted border border-border text-foreground hover:bg-card transition cursor-pointer flex items-center gap-1"
            >
              <Languages size={13} />
              <span>{narrationLang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Barcode Scanned Instrument Detail Modal Module ─── */}
      {selectedHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleCloseInspector}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-[#1E1F20] rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-muted/40 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="badge-soft-blue">
                    {selectedHotspot.category}
                  </span>
                  <span className="badge-soft-green">
                    Safety Level: {selectedHotspot.safetyLevel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-bold">
                    MODEL: {selectedHotspot.modelNumber}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-foreground leading-snug">
                  {selectedHotspot.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Direct Mute / Stop Audio Button in Header */}
                <button
                  onClick={() => {
                    stopAllAudio();
                  }}
                  title="Stop audio narration"
                  className="px-2.5 py-1.5 rounded-xl bg-muted hover:bg-border text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <VolumeX size={14} className="text-red-500" />
                  <span className="hidden sm:inline">Stop Audio</span>
                </button>

                <button
                  onClick={handleCloseInspector}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-border text-muted-foreground hover:text-foreground flex items-center justify-center font-bold text-xs shrink-0 transition cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              
              {/* 1. Barcode & Verification Tag Card */}
              <div className="card-soft-neutral p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* SVG Barcode Visual */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-2xs flex flex-col items-center">
                    <svg viewBox="0 0 140 40" className="w-28 h-8">
                      <rect x="0" y="0" width="140" height="40" fill="white" />
                      {/* Barcode lines pattern */}
                      {[2, 6, 12, 16, 20, 26, 32, 36, 42, 48, 52, 58, 64, 70, 74, 80, 86, 92, 98, 102, 108, 114, 120, 126, 132].map((x, i) => (
                        <line
                          key={i}
                          x1={x}
                          y1="5"
                          x2={x}
                          y2="35"
                          stroke="black"
                          strokeWidth={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}
                        />
                      ))}
                    </svg>
                    <p className="text-[8px] font-mono tracking-widest text-slate-800 font-bold mt-1">
                      {selectedHotspot.barcodeNumber}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 size={14} />
                      <span>Barcode Authenticated</span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {selectedHotspot.barcode}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      DIN EN ISO 8655 / CE Laboratory Standard
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(selectedHotspot.barcode)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedBarcode ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedBarcode ? 'Copied' : 'Copy Barcode'}</span>
                </button>
              </div>

              {/* 2. Interactive Concept Simulation & Video Visualizer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Live Scientific Concept Simulation</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Real-time Physics / Chem Engine
                  </span>
                </div>
                <ConceptVisualizer hotspot={selectedHotspot} />
              </div>

              {/* 3. Core Scientific Concept & Working Principle */}
              <div className="card-soft-blue p-4 sm:p-5">
                <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm mb-1.5">
                  <Sparkles size={16} />
                  <span>Scientific Working Concept: {selectedHotspot.scientificConcept.title}</span>
                </div>

                {selectedHotspot.scientificConcept.formula && (
                  <div className="my-2.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 font-mono text-xs sm:text-sm text-primary font-bold shadow-2xs">
                    {selectedHotspot.scientificConcept.formula}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  <strong>Principle:</strong> {selectedHotspot.scientificConcept.principle}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-blue-200/50 dark:border-blue-900/40">
                  <strong>Real-World Application:</strong> {selectedHotspot.scientificConcept.realWorldApplication}
                </p>
              </div>

              {/* 4. Audio Narration Section with Language & Mute Controls */}
              <div className="card-soft-green p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Voice Concept Explanation
                    </p>
                    <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400">
                      Listen to high-definition concept lecture in English or Hindi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <button
                    onClick={() => handleToggleLang('en')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      narrationLang === 'en'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    English Audio
                  </button>
                  <button
                    onClick={() => handleToggleLang('hi')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      narrationLang === 'hi'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    हिंदी व्याख्या
                  </button>
                  <button
                    onClick={stopAllAudio}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-200 transition cursor-pointer flex items-center gap-1"
                    title="Stop Audio Speech"
                  >
                    <VolumeX size={13} />
                    <span>Stop</span>
                  </button>
                </div>
              </div>

              {/* 5. Key Specifications */}
              <div className="bg-muted/50 rounded-2xl p-4 border border-border space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Technical Specifications & Calibration:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedHotspot.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-foreground">
                      <span className="text-primary font-bold">•</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. CBSE & NEP 2020 Practicals */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                  Associated CBSE & NEP 2020 Practicals:
                </p>
                <div className="space-y-1.5">
                  {selectedHotspot.nepAlignedPracticals.map((prac, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-2.5 rounded-xl bg-card border border-border text-foreground flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-[#34A853] shrink-0" />
                      <span>{prac}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-border bg-muted/40 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleCloseInspector}
                className="btn-google-secondary text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5"
              >
                <span>Close Inspector & Stop Sound</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedHotspot.simulatorUrl && (
                  <Link
                    href={selectedHotspot.simulatorUrl}
                    className="btn-google-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-1.5"
                  >
                    <span>Launch Virtual Simulator</span>
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
