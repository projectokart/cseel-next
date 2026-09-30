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
} from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  category: string;
  xPercent: number; // 0 to 100 on 360 panoramic canvas
  yPercent: number; // 0 to 100 vertical height
  badge: string;
  safetyLevel: 'Green' | 'Yellow' | 'Blue';
  shortDesc: string;
  fullDesc: string;
  specifications: string[];
  nepAlignedPracticals: string[];
  modelNumber: string;
  simulatorUrl?: string;
  audioNarration: string;
}

interface LabEnvironment {
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
  narrationIntro: string;
}

const labEnvironments: LabEnvironment[] = [
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
    narrationIntro: 'Welcome to the CSEEL Chemistry Experiential Lab. Equipped with ISO-certified Class-A volumetric glassware, automated laminar fume extraction, and UV-Vis spectrophotometers.',
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
        xPercent: 24,
        yPercent: 48,
        badge: '0.01 mL Precision',
        safetyLevel: 'Green',
        shortDesc: 'Micro-step volumetric dispenser with real-time digital pH endpoint curve graphing.',
        fullDesc: 'The Class-A motorized burette delivers ultra-precise droplets with a resolution of ±0.01 mL. Combined with a variable-speed PTFE magnetic stirrer, it eliminates parallax errors during acid-base neutralisation and redox assays.',
        specifications: [
          'Volumetric Accuracy: ±0.01 mL Class-A DIN EN ISO 8655',
          'Digital LED Titrant Volume Readout with auto-zero tare',
          'Teflon Piston with chemically inert borosilicate barrel',
          'Speed-controlled magnetic stirrer with LED tachometer',
        ],
        nepAlignedPracticals: [
          'Class 11: Determination of strength of given NaOH solution with standard Oxalic Acid',
          'Class 12: Permanganometric titration of KMnO4 against Mohr Salt',
          'Class 10: Quantitative pH neutralization curves of common household acids',
        ],
        modelNumber: 'CS-TITRA-900X',
        simulatorUrl: '/hands-on-experiments?subject=chemistry',
        audioNarration: 'This is the Digital Titration Station. It eliminates meniscus reading error with a precision digital drop counter and magnetic vortex stirrer.',
      },
      {
        id: 'chem-fume-hood',
        name: 'Automated Ducted Laminar Fume Hood',
        category: 'Laboratory Safety',
        xPercent: 62,
        yPercent: 38,
        badge: 'HEPA & Carbon Filtration',
        safetyLevel: 'Green',
        shortDesc: 'Continuous air-velocity containment chamber for handling volatile and toxic vapors.',
        fullDesc: 'Equipped with a micro-processor controller maintaining face velocity at 0.5 m/s. Fitted with gas taps, internal LED lighting, acid-resistant ceramic floor, and multi-stage active carbon gas scrubber filters.',
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
        audioNarration: 'The Laminar Fume Hood protects students during noxious gas evolution with an automated air extraction scrubber.',
      },
      {
        id: 'chem-spectro',
        name: 'Dual-Beam UV-Visible Spectrophotometer',
        category: 'Optical Analytical Spectroscopy',
        xPercent: 82,
        yPercent: 55,
        badge: '190-1100 nm Wavelength',
        safetyLevel: 'Blue',
        shortDesc: 'High-throughput spectrometer for Beer-Lambert concentration absorption analysis.',
        fullDesc: 'Features dual silicon photodiode detectors with holographic grating (1200 lines/mm). Connects over USB to real-time spectral graphing software on student tablets for Beer-Lambert law verification.',
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
        audioNarration: 'The UV-Visible Spectrophotometer measures light absorption at specific wavelengths to calculate chemical reaction kinetics.',
      },
      {
        id: 'chem-centrifuge',
        name: 'Digital Benchtop Angle Centrifuge 6000 RPM',
        category: 'Separation Science',
        xPercent: 44,
        yPercent: 65,
        badge: 'RCF 3500 x g',
        safetyLevel: 'Yellow',
        shortDesc: 'Brushless motor centrifuge for rapid precipitate separation and biological fractionation.',
        fullDesc: 'Features an electronic lid-lock safety mechanism, imbalance sensor, and LCD timer. Accommodates 8 x 15 mL conical centrifuge tubes for quick supernatant isolation.',
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
        audioNarration: 'The Digital Centrifuge separates fine precipitates and colloidal mixtures through high centrifugal acceleration.',
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
    narrationIntro: 'Welcome to the Physics Innovation Studio. Featuring low-friction air kinematics rails, 100 MHz digital storage oscilloscopes, and computerized laser diffraction optical benches.',
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
        xPercent: 30,
        yPercent: 52,
        badge: '0.1 mm Vernier Scale',
        safetyLevel: 'Green',
        shortDesc: 'Extruded aluminum optical rail with red/green laser diodes and digital photodetectors.',
        fullDesc: 'Heavy anodized aluminum rail with dual mm/inch laser engraved scales. Includes kinematic lens mounts, precision slit apertures, biprism adapters, and screen mounts with micro-adjusters.',
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
        audioNarration: 'The 2-meter Optical Bench allows students to verify geometrical lens equations and laser wave interference patterns with sub-millimeter precision.',
      },
      {
        id: 'phy-dso',
        name: '100 MHz Dual-Channel Digital Storage Oscilloscope (DSO)',
        category: 'Electronics & Waveforms',
        xPercent: 70,
        yPercent: 44,
        badge: '1 GSa/s Sampling',
        safetyLevel: 'Green',
        shortDesc: 'High-speed waveform visualizer with FFT spectral analysis and USB waveform capture.',
        fullDesc: '7-inch color TFT display with 1 GSa/s real-time sampling rate. Supports 32 automatic waveform parameter measurements, cursor tracking, and AC/DC circuit analysis.',
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
        audioNarration: 'The Digital Storage Oscilloscope displays real-time voltage waveforms, AC signals, and diode rectification characteristics.',
      },
      {
        id: 'phy-air-track',
        name: 'Linear Air Track Momentum & Kinematics Bench',
        category: 'Classical Mechanics',
        xPercent: 15,
        yPercent: 68,
        badge: 'Frictionless Air Cushion',
        safetyLevel: 'Green',
        shortDesc: 'Precision leveled triangular track with digital photogate timer for conservation laws.',
        fullDesc: 'Air blower generates a uniform air cushion supporting low-friction aluminum gliders. Dual photogate sensors measure velocities to calculate momentum and kinetic energy before and after collision.',
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
        audioNarration: 'The Air Track creates a virtually frictionless surface to experimentally demonstrate Newton’s laws of motion and elastic collisions.',
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
    narrationIntro: 'Welcome to the Biology & Life Sciences Laboratory. Featuring 1000x trinocular microscopes with 4K camera output, horizontal agarose gel electrophoresis systems, and botanical sectioning stations.',
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
        xPercent: 32,
        yPercent: 46,
        badge: '1000x Plan-Achromatic',
        safetyLevel: 'Green',
        shortDesc: 'Research-grade optics with live 4K projection onto student screen tablets.',
        fullDesc: 'Equipped with 4x, 10x, 40x, and 100x Oil Immersion Plan Achromatic objectives. The trinocular head mounts a 4K CMOS sensor for capturing high-definition micrographs of mitosis, pollen tubes, and blood smears.',
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
        audioNarration: 'The 4K Trinocular Microscope magnifies cellular specimens up to 1000 times, broadcasting live feeds directly to student screens.',
      },
      {
        id: 'bio-electrophoresis',
        name: 'Horizontal DNA Agarose Gel Electrophoresis Tank & UV Transilluminator',
        category: 'Biotechnology & Genetics',
        xPercent: 68,
        yPercent: 54,
        badge: '0-150V Regulated Power',
        safetyLevel: 'Blue',
        shortDesc: 'DNA & RNA fragment separation chamber with blue LED visualization tray.',
        fullDesc: 'Transparent UV-transmissible polycarbonate chamber with platinum electrodes. Coupled with a digital power supply and safe 470nm blue-light transilluminator for real-time visualization of DNA bands without harmful UV.',
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
        audioNarration: 'The Electrophoresis system uses electrical potential to separate DNA molecules based on their size and molecular weight.',
      },
      {
        id: 'bio-respiration',
        name: 'Digital Photosynthesis & Respiration Chamber with CO2/O2 Probes',
        category: 'Plant Physiology',
        xPercent: 18,
        yPercent: 66,
        badge: 'Dual Gas Sensors',
        safetyLevel: 'Green',
        shortDesc: 'Sealed environmental chamber logging real-time gas exchange curves during plant metabolism.',
        fullDesc: 'Includes high-precision optical Oxygen and NDIR Carbon Dioxide gas probes connected to digital data loggers. Allows students to graph photosynthetic rate under varying light spectrums and temperatures.',
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
        audioNarration: 'This sensor chamber monitors real-time changes in oxygen and carbon dioxide levels during cellular respiration and photosynthesis.',
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
    narrationIntro: 'Welcome to the ATL Robotics & IoT Tinkering Hub. Equipped with Arduino, ESP32, Raspberry Pi 5 AI kits, rapid 3D prototyping printers, and autonomous robotics arenas.',
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
        xPercent: 28,
        yPercent: 50,
        badge: 'Wi-Fi & BLE 5.0',
        safetyLevel: 'Green',
        shortDesc: 'Modular sensory prototyping dock with cloud dashboard telemetry.',
        fullDesc: 'Comprehensive IoT bench with soil moisture, ultrasonic distance, DHT22 temp/humidity, PIR motion, and light sensors. Students code block-based and C++ scripts to transmit sensor data to real-time cloud dashboards.',
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
        audioNarration: 'The IoT Experimentation Dock enables students to build smart city prototypes and wireless sensor telemetry networks.',
      },
      {
        id: 'atl-3d-printer',
        name: 'CoreXY High-Speed Rapid Prototyping 3D Printer',
        category: 'Additive Manufacturing',
        xPercent: 72,
        yPercent: 42,
        badge: '500 mm/s Print Speed',
        safetyLevel: 'Yellow',
        shortDesc: 'Enclosed 3D printer for student engineering CAD designs and mechanical robotics parts.',
        fullDesc: 'Features direct-drive all-metal hotend up to 300°C, auto-bed leveling sensor, and HEPA air filter. Prints biodegradable PLA and PETG filaments with 0.1 mm layer precision.',
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
        audioNarration: 'The Rapid Prototyping 3D Printer turns student 3D computer designs into physical, functional robotic components in minutes.',
      },
      {
        id: 'atl-arm-robot',
        name: '6-DOF Programmable Robotic Arm with AI Vision Gripper',
        category: 'Robotics & Computer Vision',
        xPercent: 48,
        yPercent: 62,
        badge: 'Inverse Kinematics',
        safetyLevel: 'Green',
        shortDesc: 'Articulated servo robotic arm with onboard camera for color/shape sorting.',
        fullDesc: 'Aluminum alloy robotic arm with metal gear digital servos and magnetic encoders. The wrist-mounted camera runs onboard OpenCV color detection to identify, track, and sort objects autonomously.',
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
        audioNarration: 'The 6-Axis Robotic Arm teaches inverse kinematics, precision coordinate mapping, and artificial intelligence computer vision sorting.',
      },
    ],
  },
];

export default function VirtualLabTourClient() {
  const [selectedLabId, setSelectedLabId] = useState<string>('chemistry');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeTab, setActiveTab] = useState<'tour' | 'curriculum' | 'safety' | 'booking'>('tour');

  // 360 Panoramic Drag & Orientation State
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

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

  // Audio speech narration for current lab or hotspot
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isAudioMuted) {
      window.speechSynthesis.cancel();
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = selectedHotspot ? selectedHotspot.audioNarration : activeLab.narrationIntro;
    setAudioTranscript(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedLabId, selectedHotspot, isAudioMuted, activeLab.narrationIntro]);

  // Drag Handlers for 360 Canvas (Mouse & Touch)
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
    setPanX((prev) => (prev - deltaX * 0.45) % 360);
    setPanY((prev) => Math.max(-25, Math.min(25, prev + deltaY * 0.3)));
  };

  const handleTouchEnd = () => setIsDragging(false);

  const setCameraAngle = (yaw: number, pitch: number) => {
    setIsAutoRotating(false);
    setPanX(yaw);
    setPanY(pitch);
  };

  const toggleFullscreen = () => {
    if (!tourContainerRef.current) return;
    if (!document.fullscreenElement) {
      tourContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const getCompassDirection = (deg: number) => {
    const normalized = (deg + 360) % 360;
    if (normalized >= 337.5 || normalized < 22.5) return 'N (0°)';
    if (normalized >= 22.5 && normalized < 67.5) return 'NE (45°)';
    if (normalized >= 67.5 && normalized < 112.5) return 'E (90°)';
    if (normalized >= 112.5 && normalized < 157.5) return 'SE (135°)';
    if (normalized >= 157.5 && normalized < 202.5) return 'S (180°)';
    if (normalized >= 202.5 && normalized < 247.5) return 'SW (225°)';
    if (normalized >= 247.5 && normalized < 292.5) return 'W (270°)';
    return 'NW (315°)';
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 selection:bg-[#006fcc] selection:text-white pb-20">
      
      {/* ─── Top Header & Lab Switcher ─── */}
      <section className="pt-4 sm:pt-8 pb-3 sm:pb-6 px-3 sm:px-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb & Live Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
            <Link href="/" className="hover:text-[#006fcc] transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <span className="text-[#003c6e] font-bold truncate">360° Virtual Lab Tour</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006fcc] border border-blue-200 text-[10px] sm:text-xs font-bold shadow-2xs">
              <Radio className="w-3 h-3 text-[#006fcc] animate-pulse" />
              <span className="hidden xs:inline">LIVE</span> 360°
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              NEP 2020
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#006fcc] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interactive Experiential Laboratory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#003c6e] leading-tight">
              CSEEL 360° Science Lab Tour
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Drag anywhere to look around in 360°. Tap any glowing hotspot to inspect laboratory equipment specifications and syllabus practicals.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shrink-0 shadow-2xs self-start md:self-auto">
            <div className="px-2.5 py-0.5 text-center border-r border-slate-100">
              <p className="text-[9px] uppercase font-bold text-slate-400">Labs</p>
              <p className="text-xs sm:text-sm font-black text-[#003c6e]">4 Studios</p>
            </div>
            <div className="px-2.5 py-0.5 text-center border-r border-slate-100">
              <p className="text-[9px] uppercase font-bold text-slate-400">Stations</p>
              <p className="text-xs sm:text-sm font-black text-[#006fcc]">16+ Hotspots</p>
            </div>
            <div className="px-2.5 py-0.5 text-center">
              <p className="text-[9px] uppercase font-bold text-slate-400">Capacity</p>
              <p className="text-xs sm:text-sm font-black text-emerald-700">40 Students</p>
            </div>
          </div>
        </div>

        {/* Discipline Tab Switcher - Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-2 mt-4 sm:mt-6 overflow-x-auto no-scrollbar pb-1">
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
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#003c6e] text-white border-[#003c6e] shadow-sm shadow-blue-900/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? 'text-white' : 'text-[#006fcc]'}`} />
                <span>{lab.name.split('&')[0]}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Main 360° Interactive Canvas ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
        <div
          ref={tourContainerRef}
          className="relative rounded-3xl overflow-hidden border border-slate-300/80 bg-slate-950 shadow-lg group select-none touch-none aspect-[4/3] sm:aspect-auto sm:h-[65vh] sm:min-h-[480px] sm:max-h-[720px]"
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

          {/* 360 Hotspot Markers */}
          {activeLab.hotspots.map((hotspot) => {
            const normalizedX = (hotspot.xPercent + (panX * 0.3) + 100) % 100;
            const normalizedY = Math.max(12, Math.min(88, hotspot.yPercent - (panY * 0.35)));
            const isSelected = selectedHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 active:scale-95"
                style={{
                  left: `${normalizedX}%`,
                  top: `${normalizedY}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(hotspot);
                  setIsAutoRotating(false);
                }}
              >
                {/* Hotspot Pulse Ring */}
                <div className="relative flex items-center justify-center">
                  <span className={`absolute w-8 sm:w-10 h-8 sm:h-10 rounded-full animate-ping opacity-60 ${isSelected ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                  <span className={`absolute w-5 sm:w-6 h-5 sm:h-6 rounded-full opacity-80 ${isSelected ? 'bg-amber-500' : 'bg-cyan-500'}`} />
                  <div
                    className={`relative w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white font-black text-white ${
                      isSelected
                        ? 'bg-amber-500'
                        : 'bg-[#006fcc]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>

                  {/* Hotspot Floating Label */}
                  <div className="hidden sm:flex absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-200 shadow-lg pointer-events-none items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006fcc] animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-900 tracking-tight">
                      {hotspot.name.split(' ')[0]} {hotspot.name.split(' ')[1] || ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Top HUD: Current Lab Info & Orientation */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 sm:px-3.5 sm:py-2.5 shadow-lg flex items-center gap-2 sm:gap-3 max-w-[80%] sm:max-w-md">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006fcc] flex items-center justify-center shrink-0">
                <activeLab.icon className="w-4 h-4 text-[#006fcc]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
                  {activeLab.name}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {activeLab.capacity} • {activeLab.hotspots.length} Stations
                </p>
              </div>
            </div>

            {/* Compass Heading */}
            <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-[#006fcc]" />
              <div className="text-left">
                <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Orientation</p>
                <p className="text-[11px] font-black text-slate-900">{getCompassDirection(panX)}</p>
              </div>
            </div>
          </div>

          {/* Center Drag Hint on Mobile / Desktop */}
          <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-md opacity-75 sm:opacity-90 transition-opacity whitespace-nowrap">
            👆 Drag to look around in 360°
          </div>

          {/* Bottom Floating Control Bar (Unified & Non-overlapping on Mobile) */}
          <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
            
            {/* Camera Angle Presets on the Left */}
            <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full p-1 shadow-lg max-w-[60%] sm:max-w-none overflow-x-auto no-scrollbar">
              <Camera className="w-3.5 h-3.5 text-[#006fcc] ml-1.5 mr-0.5 shrink-0" />
              {activeLab.cameraAngles.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setCameraAngle(cam.yaw, cam.pitch)}
                  className="px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-700 hover:text-white hover:bg-[#003c6e] transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  {cam.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Viewer Controls on the Right */}
            <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full p-1 shadow-lg shrink-0">
              {/* Auto-Rotation */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                aria-label={isAutoRotating ? 'Pause auto-pan' : 'Start auto-pan'}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  isAutoRotating ? 'bg-blue-50 text-[#006fcc]' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  setPanX(0);
                  setPanY(0);
                  setZoomLevel(1);
                }}
                aria-label="Reset view"
                className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCw size={14} />
              </button>

              {/* Zoom Controls */}
              <button
                onClick={() => setZoomLevel((prev) => Math.min(1.8, prev + 0.2))}
                aria-label="Zoom in"
                className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer hidden xs:inline-flex"
              >
                <ZoomIn size={14} />
              </button>

              {/* Audio Toggle */}
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                aria-label={isAudioMuted ? 'Unmute guide' : 'Mute guide'}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  !isAudioMuted ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-600" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
                className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer hidden sm:inline-flex"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

          </div>

          {/* Desktop Floating Equipment Popover Inspector (Hidden on mobile <768px, replaced by bottom drawer) */}
          {selectedHotspot && (
            <div
              className="hidden md:block absolute top-16 right-6 z-40 max-w-sm w-full bg-white/98 backdrop-blur-xl border-2 border-[#006fcc]/70 rounded-3xl p-5 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 max-h-[82%] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200">
                      {selectedHotspot.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Safety: {selectedHotspot.safetyLevel}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {selectedHotspot.name}
                  </h3>
                  <p className="text-[10px] text-[#006fcc] font-mono font-bold mt-0.5">
                    Model: {selectedHotspot.modelNumber} • {selectedHotspot.badge}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                {selectedHotspot.fullDesc}
              </p>

              {/* Specifications */}
              <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  Key Specifications:
                </p>
                <ul className="text-[11px] text-slate-700 space-y-0.5 pl-1">
                  {selectedHotspot.specifications.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-[#006fcc] font-bold">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* NEP Practicals */}
              <div className="mt-2.5 space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  Associated CBSE Practicals:
                </p>
                {selectedHotspot.nepAlignedPracticals.slice(0, 2).map((prac, idx) => (
                  <div
                    key={idx}
                    className="text-[10px] bg-emerald-50/80 border border-emerald-200/80 px-2 py-1 rounded-lg text-emerald-800 font-medium flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{prac}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                {selectedHotspot.simulatorUrl && (
                  <Link
                    href={selectedHotspot.simulatorUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#003c6e] hover:bg-[#002d54] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all text-decoration-none"
                  >
                    <span>Launch Simulator</span>
                    <ExternalLink size={13} />
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (!isAudioMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(selectedHotspot.audioNarration);
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Volume2 size={13} className="text-[#006fcc]" />
                  <span>Audio</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Slide-Up Bottom Drawer for Selected Hotspot (<768px) */}
        {selectedHotspot && (
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-slate-300 shadow-2xl p-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Drag Bar */}
            <div className="w-12 h-1 rounded-full bg-slate-300 mx-auto mb-3" />

            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200">
                    {selectedHotspot.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Safety: {selectedHotspot.safetyLevel}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {selectedHotspot.name}
                </h3>
                <p className="text-[10px] text-[#006fcc] font-mono font-bold mt-0.5">
                  {selectedHotspot.badge} • Model {selectedHotspot.modelNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedHotspot(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
              {selectedHotspot.fullDesc}
            </p>

            {/* Specifications */}
            <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                Key Specifications:
              </p>
              <ul className="text-[11px] text-slate-700 space-y-0.5 pl-1">
                {selectedHotspot.specifications.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-[#006fcc] font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Associated Practicals */}
            <div className="mt-2.5 space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                CBSE & NEP 2020 Practicals:
              </p>
              {selectedHotspot.nepAlignedPracticals.map((prac, idx) => (
                <div
                  key={idx}
                  className="text-[10px] bg-emerald-50/80 border border-emerald-200/80 px-2 py-1 rounded-lg text-emerald-800 font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{prac}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              {selectedHotspot.simulatorUrl && (
                <Link
                  href={selectedHotspot.simulatorUrl}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#003c6e] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs text-decoration-none"
                >
                  <span>Launch Simulator</span>
                  <ExternalLink size={13} />
                </Link>
              )}
              <button
                onClick={() => setSelectedHotspot(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Live Audio Guide Transcript Banner */}
        <div className="mt-3 bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-[#006fcc] flex items-center justify-center shrink-0">
              <Volume2 className="w-3.5 h-3.5 text-[#006fcc]" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase text-[#006fcc] tracking-wider">
                Audio Guide Narration
              </p>
              <p className="text-xs text-slate-700 font-medium truncate">
                "{audioTranscript || activeLab.narrationIntro}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {isAudioMuted ? '🔊 Unmute' : '🔇 Mute'}
          </button>
        </div>
      </section>

      {/* ─── Laboratory Architecture & Curriculum Standards ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#003c6e]">
              Laboratory Architecture & Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              Explore equipment specifications, safety protocols, and CBSE practical syllabus mapping.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1 rounded-full shadow-2xs overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('tour')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tour'
                  ? 'bg-[#003c6e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Equipment Roster
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'curriculum'
                  ? 'bg-[#003c6e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CBSE Mapping
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'safety'
                  ? 'bg-[#003c6e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety Protocols
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'booking'
                  ? 'bg-[#003c6e] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School Setup
            </button>
          </div>
        </div>

        {/* Tab 1: Equipment Roster Grid */}
        {activeTab === 'tour' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeLab.hotspots.map((station) => (
              <div
                key={station.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-[#006fcc]/50 transition-all hover:shadow-md group shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006fcc] border border-blue-200">
                      {station.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {station.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#006fcc] transition-colors mb-1.5 leading-snug">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {station.shortDesc}
                  </p>

                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-3">
                    <p className="text-[9px] font-black uppercase text-slate-500">Key Features:</p>
                    {station.specifications.slice(0, 2).map((s, idx) => (
                      <p key={idx} className="text-[11px] text-slate-700 flex items-start gap-1">
                        <span className="text-[#006fcc] font-bold">✓</span> {s}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedHotspot(station);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-[#003c6e] text-white font-bold text-xs hover:bg-[#002d54] transition-colors cursor-pointer shadow-xs text-center"
                  >
                    View in 360° Studio
                  </button>
                  {station.simulatorUrl && (
                    <Link
                      href={station.simulatorUrl}
                      className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-decoration-none"
                      title="Launch Practical"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Curriculum Mapping */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                CBSE, ICSE & NEP 2020 Hands-on Mapping ({activeLab.discipline})
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every station is aligned with national curriculum mandates for Class 9 to 12 practical assessments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLab.hotspots.map((station) => (
                <div key={station.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">{station.name}</h4>
                  <div className="space-y-1.5">
                    {station.nepAlignedPracticals.map((prac, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span>{prac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Safety Protocols */}
        {activeTab === 'safety' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">
                Institutional Safety & Environmental Compliance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Standard operating procedures certified for school laboratory environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">Classroom Safe Reagents</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Non-toxic, micro-scale chemical reagents minimizing environmental hazard and student exposure.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                <Sliders className="w-6 h-6 text-[#006fcc] mb-2" />
                <h4 className="text-sm font-bold text-blue-900">Emergency Isolation</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Central electrical circuit breakers, fire blankets, eyewash stations, and acid spill neutralization kits.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200">
                <Award className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="text-sm font-bold text-purple-900">Certified ISO 9001:2015</h4>
                <p className="text-xs text-purple-700 mt-1">
                  All instruments undergo calibrated optical, volumetric, and electrical testing before school dispatch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: School Lab Setup */}
        {activeTab === 'booking' && (
          <div className="bg-gradient-to-br from-[#003c6e] to-[#001f3b] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
            <div className="max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider">
                Institutional Partnership
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-3 text-white">
                Set Up a State-of-the-Art CSEEL Experiential Lab in Your School
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                Complete turnkey solution: Custom lab furniture, certified equipment, digital data loggers, teacher master training, and annual consumable refill kits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/compare-plans"
                className="px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md text-decoration-none"
              >
                Compare School Lab Packages
              </Link>
              <Link
                href="/get-support"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all text-decoration-none flex items-center gap-2"
              >
                <PhoneCall size={14} />
                <span>Request Quotation / Callback</span>
              </Link>
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
