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
      { id: 'cam-chem-3', name: 'Fume Hood & Safety Station', yaw: 160, pitch: 5 },
      { id: 'cam-chem-4', name: 'Reagent Dispenser Rack', yaw: 250, pitch: -2 },
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
          'Digital LED Titrant Volume Readout',
          'Teflon Piston with chemically inert borosilicate barrel',
          'Integrated optical endpoint photo-detector',
        ],
        nepAlignedPracticals: [
          'Class 11 CBSE: Standard Oxalic Acid vs. NaOH Titration',
          'Class 12 CBSE: Redox Titration of Potassium Permanganate vs Mohr’s Salt',
          'NEP 2020: Buffering capacity of real-world antacid medicines',
        ],
        modelNumber: 'CSEEL-TITRA-X200',
        simulatorUrl: '/subject/chemistry',
        audioNarration: 'This digital burette ensures zero liquid wastage and micro-scale precision, allowing students to accurately detect equivalent neutralization points.',
      },
      {
        id: 'chem-fumehood',
        name: 'Aerodynamic Laminar Fume Hood & Scrubber',
        category: 'Hazard Containment',
        xPercent: 62,
        yPercent: 36,
        badge: 'ISO 14644-1 Safe',
        safetyLevel: 'Blue',
        shortDesc: 'High-velocity HEPA-carbon dual exhaust chamber for volatile reaction synthesis.',
        fullDesc: 'Engineered for hazardous gas generation experiments such as chlorine gas, nitrogen dioxide emissions, and ester synthesis. Constant face velocity monitoring ensures 100% student safety with automated glass sash interlocks.',
        specifications: [
          'Face Velocity: 0.5 m/s uniform laminar air flow',
          'Activated carbon scrubber + HEPA particulate filters',
          'Toughened explosion-resistant polycarbonate sash',
          'Integrated spark-proof LED internal illumination',
        ],
        nepAlignedPracticals: [
          'Class 10 CBSE: Thermal decomposition of Lead Nitrate (NO₂ emissions)',
          'Class 12 CBSE: Synthesis of Aspirin & Esterification aroma trials',
          'NEP 2020: Environmental capture of sulfurous emissions',
        ],
        modelNumber: 'CSEEL-FUME-PRO70',
        simulatorUrl: '/subject/chemistry',
        audioNarration: 'The aerodynamic fume hood safely isolates all toxic chemical fumes, exhausting them through multi-stage eco scrubbers.',
      },
      {
        id: 'chem-spectro',
        name: 'UV-Vis Dual-Beam Digital Spectrophotometer',
        category: 'Optical Spectroscopy',
        xPercent: 82,
        yPercent: 54,
        badge: '190 - 1100 nm',
        safetyLevel: 'Green',
        shortDesc: 'Measures light absorption spectra for Beer-Lambert law verification and complexometry.',
        fullDesc: 'Provides direct absorption spectrum measurement of transition metal solutions (CuSO₄, KMnO₄, FeCl₃). Allows high school learners to plot calibration curves and calculate unknown sample concentrations with research-level clarity.',
        specifications: [
          'Wavelength Range: 190 nm to 1100 nm (UV to Near-IR)',
          'Spectral Bandwidth: 1.8 nm with deuterium & tungsten halogen lamps',
          'USB & Wi-Fi Data Export directly to student tablet apps',
        ],
        nepAlignedPracticals: [
          'Class 12 CBSE: Beer-Lambert Law validation using Copper Sulfate',
          'Class 12 CBSE: Chemical kinetics of Crystal Violet fading reaction',
        ],
        modelNumber: 'CSEEL-SPEC-UV2026',
        simulatorUrl: '/subject/chemistry',
        audioNarration: 'This spectrophotometer allows students to visually see molecular absorption peaks and verify Beer-Lambert law in real time.',
      },
      {
        id: 'chem-centrifuge',
        name: 'High-Speed Analytical Micro-Centrifuge',
        category: 'Precipitate Separation',
        xPercent: 44,
        yPercent: 58,
        badge: '12,000 RPM',
        safetyLevel: 'Yellow',
        shortDesc: 'Rapid separation of qualitative inorganic analysis precipitates and colloids.',
        fullDesc: 'Equipped with electronic lid safety locks and unbalanced rotor detection. Replaces tedious filtration with rapid centrifugal sedimentation in salt analysis tests.',
        specifications: [
          'Speed Range: 500 – 12,000 RPM with soft braking',
          'Capacity: 12 x 1.5/2.0 mL microcentrifuge tubes',
          'Quiet brushless induction motor (<54 dB)',
        ],
        nepAlignedPracticals: [
          'Class 11/12 CBSE: Qualitative Salt Analysis (Separation of Cations Gr I-VI)',
          'NEP 2020: Colloid precipitation and Tyndall effect verification',
        ],
        modelNumber: 'CSEEL-CENTRI-12K',
        simulatorUrl: '/subject/chemistry',
        audioNarration: 'Our micro-centrifuge separates chemical precipitates in seconds without requiring single-use filter paper.',
      },
    ],
  },
  {
    id: 'physics',
    name: 'Physics & Quantum Optics Lab',
    discipline: 'Physics',
    icon: Atom,
    tagline: 'Precision laser optical benches, digital storage oscilloscopes, and air tracks.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    backgroundImage: '/images/categories/physics.jpg',
    capacity: '36 Students (Modular Benches)',
    curriculum: 'CBSE, ICSE, Cambridge AS/A-Level',
    narrationIntro: 'Welcome to the CSEEL Physics Pavilion. Here students test classical mechanics, wave optics, semiconductor physics, and electromagnetism.',
    cameraAngles: [
      { id: 'cam-phy-1', name: 'Laser Optics Bench', yaw: 0, pitch: 0 },
      { id: 'cam-phy-2', name: 'Electronics & Oscilloscope Rig', yaw: 90, pitch: -3 },
      { id: 'cam-phy-3', name: 'Mechanics Air Track', yaw: 180, pitch: -8 },
      { id: 'cam-phy-4', name: 'High-Voltage Van de Graaff', yaw: 270, pitch: 6 },
    ],
    hotspots: [
      {
        id: 'phy-optical-bench',
        name: 'Precision Laser Optical Bench & Interferometer',
        category: 'Wave & Ray Optics',
        xPercent: 30,
        yPercent: 44,
        badge: 'Class 2 Red/Green Laser',
        safetyLevel: 'Yellow',
        shortDesc: '2-meter rigid extruded rail with micrometer Vernier riders and diffraction slits.',
        fullDesc: 'Designed for high-accuracy focal length measurements, Young’s Double Slit experiment, and laser wavelength diffraction. Magnetic self-aligning lens holders prevent axis misalignment.',
        specifications: [
          'Bed Length: 2000 mm dual-scale metric & vernier engraving',
          'Laser Sources: 650 nm Red (2mW) and 532 nm Green (1mW) Class II',
          'Diffraction Grating: 300 & 600 lines/mm holographic glass',
        ],
        nepAlignedPracticals: [
          'Class 12 CBSE: Refractive index of glass prism using spectrometer',
          'Class 12 CBSE: Focal length of convex lens by displacement method',
          'NEP 2020: Laser wavelength determination using diffraction grating',
        ],
        modelNumber: 'CSEEL-OPTIC-2M',
        simulatorUrl: '/subject/physics',
        audioNarration: 'The 2-meter optical bench provides nanometer precision for laser wave optics and lens aberration experiments.',
      },
      {
        id: 'phy-oscilloscope',
        name: 'Dual-Channel Digital Storage Oscilloscope (DSO)',
        category: 'Electronics & Signals',
        xPercent: 68,
        yPercent: 42,
        badge: '100 MHz / 1 GSa/s',
        safetyLevel: 'Green',
        shortDesc: '7-inch color display for analyzing AC waveforms, resonance curves, and sound harmonics.',
        fullDesc: 'Students observe live alternating currents, rectify signals using PN junction diodes, and analyze LCR resonant circuits. Features automated frequency, peak-to-peak voltage, and FFT frequency spectrum analysis.',
        specifications: [
          'Bandwidth: 100 MHz, 2 Channels + External Trigger',
          'Real-time Sampling Rate: 1 GSa/s per channel',
          'Auto-measurement of 32 waveform parameters',
        ],
        nepAlignedPracticals: [
          'Class 12 CBSE: Half-wave and Full-wave Rectifier waveform profiling',
          'Class 12 CBSE: Series LCR Circuit Resonance & Quality Factor (Q-factor)',
          'NEP 2020: Audio frequencies and Doppler effect sound wave visualization',
        ],
        modelNumber: 'CSEEL-DSO-100X',
        simulatorUrl: '/subject/physics',
        audioNarration: 'This digital oscilloscope translates invisible electronic oscillations and alternating currents into clear, interactive graphs.',
      },
      {
        id: 'phy-vandegraaff',
        name: 'Van de Graaff Electrostatic High-Voltage Generator',
        category: 'Electrostatics',
        xPercent: 88,
        yPercent: 32,
        badge: '250,000 Volts (Safe mA)',
        safetyLevel: 'Yellow',
        shortDesc: 'Generates static high-voltage potentials for spark discharge and Faraday cage demos.',
        fullDesc: 'Demonstrates charge accumulation, Coulomb’s electric field lines, and electrical breakdown in air. Built with student-safe micro-ampere current limitations and grounding wands.',
        specifications: [
          'Output Potential: Up to 250 kV with dry belt transmission',
          'Spark Discharge Distance: 60 - 80 mm in ambient air',
          'Polished 250 mm stainless steel spherical dome',
        ],
        nepAlignedPracticals: [
          'Class 12 CBSE: Electrostatic induction and electric field distribution',
          'NEP 2020: Faraday Cage lightning shielding demonstrations',
        ],
        modelNumber: 'CSEEL-VDG-250',
        simulatorUrl: '/subject/physics',
        audioNarration: 'The Van de Graaff generator creates dramatic electrostatic discharges while remaining safely in micro-ampere current ranges.',
      },
      {
        id: 'phy-airtrack',
        name: 'Linear Air Track Frictionless Mechanics Station',
        category: 'Classical Mechanics',
        xPercent: 12,
        yPercent: 62,
        badge: 'Near Zero Friction',
        safetyLevel: 'Green',
        shortDesc: 'High-volume blower air cushion rail with millimeter photogate timers.',
        fullDesc: 'Eliminates friction to deliver textbook-perfect conservation of momentum and energy demonstrations. Dual photogates record microsecond glider transit times.',
        specifications: [
          'Track Length: 1500 mm anodized aluminum triangular prism',
          'Air Cushion: 240 uniform precision micro-orifices',
          'Timer Resolution: 0.0001 seconds (0.1 ms)',
        ],
        nepAlignedPracticals: [
          'Class 11 CBSE: Elastic and Inelastic Collisions in One Dimension',
          'Class 11 CBSE: Verification of Newton’s Second Law ($F = ma$)',
          'Class 11 CBSE: Simple Harmonic Motion with spring gliders',
        ],
        modelNumber: 'CSEEL-AIR-150',
        simulatorUrl: '/subject/physics',
        audioNarration: 'By floating gliders on a cushion of pressurized air, students experience pure frictionless Newtonian physics.',
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology & Cellular Microscopy Studio',
    discipline: 'Biology',
    icon: Microscope,
    tagline: 'Binocular LED compound microscopes, DNA gel electrophoresis, and physiology rigs.',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    backgroundImage: '/images/categories/biology.jpg',
    capacity: '32 Students (Dual-Microscope)',
    curriculum: 'CBSE, ICSE, NEET Practical Focus',
    narrationIntro: 'Welcome to the CSEEL Biology and Cytology Lab. Students explore the microscopic world, isolate real plant DNA, and analyze enzyme kinetics.',
    cameraAngles: [
      { id: 'cam-bio-1', name: 'Microscopy Station', yaw: 0, pitch: 0 },
      { id: 'cam-bio-2', name: 'Electrophoresis Bench', yaw: 85, pitch: -4 },
      { id: 'cam-bio-3', name: 'Plant Physiology Station', yaw: 175, pitch: 2 },
      { id: 'cam-bio-4', name: 'Anatomy 3D Model Center', yaw: 260, pitch: -6 },
    ],
    hotspots: [
      {
        id: 'bio-microscope',
        name: 'Binocular Research Compound LED Microscope (1000x)',
        category: 'Cellular Cytology',
        xPercent: 28,
        yPercent: 46,
        badge: 'Plan Achromatic Optics',
        safetyLevel: 'Green',
        shortDesc: '1000x oil-immersion optics with digital HDMI camera for group screen projection.',
        fullDesc: 'Features Plan Achromatic infinity-corrected lenses (4x, 10x, 40x, 100x Oil). Includes coaxial coarse and fine focus with 0.002 mm graduations, Kohler illumination, and a 4K digital camera mount.',
        specifications: [
          'Magnification Range: 40x, 100x, 400x, 1000x Oil',
          'Illumination: 3W Kohler Variable LED with Abbe N.A. 1.25 condenser',
          'Live 4K USB/HDMI live stream sensor to school smartboards',
        ],
        nepAlignedPracticals: [
          'Class 9 CBSE: Temporary mount of Onion Peel and Human Cheek Cells',
          'Class 11 CBSE: Study of Mitosis in Onion Root Tip Squash',
          'Class 12 CBSE: Pollen germination on stigma and pollen tube growth',
        ],
        modelNumber: 'CSEEL-MIC-1000X',
        simulatorUrl: '/subject/biology',
        audioNarration: 'Our research-grade binocular microscope lets students view cellular organelles and stream live slide images directly to the smartboard.',
      },
      {
        id: 'bio-electrophoresis',
        name: 'Agarose Gel DNA Electrophoresis & UV Transilluminator',
        category: 'Molecular Genetics',
        xPercent: 72,
        yPercent: 40,
        badge: 'Blue LED Non-UV Safe',
        safetyLevel: 'Green',
        shortDesc: 'Separates DNA fragments by molecular size using uniform electric fields.',
        fullDesc: 'Gives high school students real hands-on biotechnology experience. Safely visualize separated DNA bands from plant leaf tissue and plasmid vectors using non-carcinogenic blue LED transillumination.',
        specifications: [
          'Submarine Gel Tank with Platinum Electrodes',
          'Voltage Supply: 50V / 100V / 150V constant current regulation',
          'Safe Blue-Light (470 nm) Transilluminator (No hazardous UV required)',
        ],
        nepAlignedPracticals: [
          'Class 12 CBSE: Isolation of DNA from plant material (Spinach / Papaya)',
          'NEP 2020: Simulated DNA fingerprinting in forensic crime solving',
        ],
        modelNumber: 'CSEEL-GEL-BIO20',
        simulatorUrl: '/subject/biology',
        audioNarration: 'Students separate DNA molecules under an electric field, turning abstract genetic theory into visible fluorescent bands.',
      },
      {
        id: 'bio-potometer',
        name: 'Digital Ganong’s Potometer & Environmental Chamber',
        category: 'Plant Physiology',
        xPercent: 48,
        yPercent: 56,
        badge: '0.001 mL/min Rate',
        safetyLevel: 'Green',
        shortDesc: 'Real-time digital transpiration rate tracker under varied humidity, wind, and light.',
        fullDesc: 'Automates transpiration measurement with optical meniscus tracking. Students observe how wind currents, light intensity, and stomata density directly alter water uptake in leafy twigs.',
        specifications: [
          'Precision Capillary Tube with motorized air bubble injector',
          'Dual digital sensors for leaf temperature and ambient humidity',
          'Adjustable LED grow lamp and mini wind fan attachment',
        ],
        nepAlignedPracticals: [
          'Class 10 CBSE: Stomatal distribution in monocot and dicot leaves',
          'Class 11 CBSE: Transpiration rates under variable environmental stressors',
        ],
        modelNumber: 'CSEEL-POTO-DIGI',
        simulatorUrl: '/subject/biology',
        audioNarration: 'The digital potometer tracks how environmental variables like sunlight and wind alter transpiration rates in real-time.',
      },
    ],
  },
  {
    id: 'robotics',
    name: 'ATL Tinkering, IoT & Robotics Studio',
    discipline: 'Technology & AI',
    icon: Cpu,
    tagline: 'Dual 3D printers, Arduino/Raspberry Pi IoT stations, and autonomous robotics arenas.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    backgroundImage: '/images/categories/technology.jpg',
    capacity: '30 Students (4 per Workstation)',
    curriculum: 'NITI Aayog ATL, CBSE AI & Coding',
    narrationIntro: 'Welcome to the CSEEL Atal Tinkering and Robotics Studio. A modern maker-space for rapid 3D prototyping, embedded IoT coding, and robotics competitions.',
    cameraAngles: [
      { id: 'cam-atl-1', name: '3D Prototyping Bay', yaw: 0, pitch: 0 },
      { id: 'cam-atl-2', name: 'IoT Microcontroller Bench', yaw: 80, pitch: -5 },
      { id: 'cam-atl-3', name: 'Soldering & Rework Station', yaw: 170, pitch: -2 },
      { id: 'cam-atl-4', name: 'Autonomous Rover Arena', yaw: 260, pitch: -10 },
    ],
    hotspots: [
      {
        id: 'atl-3dprinter',
        name: 'Dual-Nozzle CoreXY High-Speed 3D Printer',
        category: 'Additive Manufacturing',
        xPercent: 32,
        yPercent: 42,
        badge: '500 mm/s Speed',
        safetyLevel: 'Yellow',
        shortDesc: 'Enclosed chamber 3D printer for student engineering CAD designs and robot chassis.',
        fullDesc: 'Allows students to turn 3D CAD models into durable functional parts within minutes. Dual nozzles enable soluble PVA supports for complex mechanical gears, planetary transmissions, and drone frames.',
        specifications: [
          'Build Volume: 250 x 250 x 250 mm',
          'Print Speed: Up to 500 mm/s with active vibration compensation',
          'Supported Filaments: PLA, PETG, ABS, Carbon-Fiber Reinforced Nylon',
        ],
        nepAlignedPracticals: [
          'ATL Tinkering: CAD Modeling of Robotic Grippers and Pinion Gears',
          'NEP 2020: Sustainable product design using biodegradable PLA',
        ],
        modelNumber: 'CSEEL-PRINT-3DX',
        simulatorUrl: '/subject/technology',
        audioNarration: 'This high-speed 3D printer transforms digital student CAD models into physical working mechanisms in under thirty minutes.',
      },
      {
        id: 'atl-iot-station',
        name: 'Arduino, ESP32 & AI Vision Microcontroller Workbench',
        category: 'Embedded IoT & AI',
        xPercent: 68,
        yPercent: 48,
        badge: '50+ Sensor Modules',
        safetyLevel: 'Green',
        shortDesc: 'Comprehensive sensor arrays, OLED displays, servo actuators, and AI camera modules.',
        fullDesc: 'Pre-wired breadboards with quick-connect magnetic probe headers. Students build smart agriculture moisture monitors, IoT weather stations, and AI object-recognition sorting bots.',
        specifications: [
          'Core Boards: ESP32 Dual-Core Wi-Fi/BLE + Arduino Mega + Raspberry Pi 5',
          'Sensors: Ultrasonic, Lidar, DHT22, MQ-135 Air Quality, Gyroscope IMU',
          'Output Actuators: Continuous rotation servos, stepper motors, relay banks',
        ],
        nepAlignedPracticals: [
          'CBSE Class 10 AI: Smart Irrigation System with ESP32 and Soil Sensors',
          'ATL Challenge: Automated Waste Segregation using AI Vision',
          'NEP 2020: Solar tracking panel efficiency optimization',
        ],
        modelNumber: 'CSEEL-IOT-MAKER50',
        simulatorUrl: '/subject/technology',
        audioNarration: 'Students learn embedded coding by interfacing environmental sensors, Wi-Fi telemetry, and neural vision camera modules.',
      },
      {
        id: 'atl-soldering',
        name: 'Lead-Free ESD-Safe Digital Soldering & Rework Station',
        category: 'Hardware Electronics',
        xPercent: 86,
        yPercent: 54,
        badge: 'PID Temp Control',
        safetyLevel: 'Yellow',
        shortDesc: 'Temperature-controlled rapid heating iron with smoke absorption suction fan.',
        fullDesc: 'Features rapid PID temperature control from 150°C to 480°C with automated standby sleep when placed in the cradle. Anti-static ESD protection safeguards delicate microchips.',
        specifications: [
          'Power: 90W Rapid High-Frequency Heating (<6 sec to 350°C)',
          'Integrated Mini Activated-Carbon Fume Absorber',
          'ESD-Safe Silicone High-Temp Heat Mat',
        ],
        nepAlignedPracticals: [
          'ATL Tinkering: PCB Soldering of 555-Timer Flashing LED Circuit',
          'NEP 2020: Hardware rework and repair of consumer electronics',
        ],
        modelNumber: 'CSEEL-SOLDER-90W',
        simulatorUrl: '/subject/technology',
        audioNarration: 'Our ESD-safe soldering station features rapid temperature stabilization and direct fume extraction for clean classroom assembly.',
      },
    ],
  },
];

export default function VirtualLabTourClient() {
  const [selectedLabId, setSelectedLabId] = useState<string>('chemistry');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [panX, setPanX] = useState<number>(0); // -180 to 180 deg
  const [panY, setPanY] = useState<number>(0); // -35 to 35 deg
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 to 2.0
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tour' | 'curriculum' | 'safety' | 'booking'>('tour');

  const tourContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const activeLab = labEnvironments.find((l) => l.id === selectedLabId) || labEnvironments[0];

  // Auto-narration speech update
  useEffect(() => {
    if (selectedHotspot) {
      setAudioTranscript(selectedHotspot.audioNarration);
      if (!isAudioMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(selectedHotspot.audioNarration);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setAudioTranscript(activeLab.narrationIntro);
    }
  }, [selectedHotspot, activeLab, isAudioMuted]);

  // Handle auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setPanX((prev) => (prev >= 180 ? -180 : prev + 0.22));
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Pan drag interactions (Mouse and Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    startDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panX,
      startPanY: panY,
    };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startDragRef.current.x;
      const deltaY = e.clientY - startDragRef.current.y;

      let newPanX = startDragRef.current.startPanX - deltaX * 0.25;
      let newPanY = startDragRef.current.startPanY + deltaY * 0.18;

      if (newPanX > 180) newPanX -= 360;
      if (newPanX < -180) newPanX += 360;
      newPanY = Math.max(-35, Math.min(35, newPanY));

      setPanX(newPanX);
      setPanY(newPanY);
    },
    [panX, panY]
  );

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsAutoRotating(false);
      startDragRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startPanX: panX,
        startPanY: panY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startDragRef.current.x;
    const deltaY = e.touches[0].clientY - startDragRef.current.y;

    let newPanX = startDragRef.current.startPanX - deltaX * 0.35;
    let newPanY = startDragRef.current.startPanY + deltaY * 0.22;

    if (newPanX > 180) newPanX -= 360;
    if (newPanX < -180) newPanX += 360;
    newPanY = Math.max(-35, Math.min(35, newPanY));

    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Switch camera angle preset
  const setCameraAngle = (yaw: number, pitch: number) => {
    setIsAutoRotating(false);
    setPanX(yaw);
    setPanY(pitch);
  };

  // Fullscreen toggle
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

  // Compass Heading Calculation
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
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 selection:bg-[#006fcc] selection:text-white pb-16">
      
      {/* ─── Hero Header & Lab Switcher ─── */}
      <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 max-w-7xl mx-auto">
        
        {/* Breadcrumbs & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#006fcc] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#003c6e] font-bold">360° Virtual Lab Tour</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#006fcc] border border-blue-200 text-xs font-bold shadow-xs">
              <Radio className="w-3.5 h-3.5 text-[#006fcc] animate-pulse" />
              LIVE 360° SIMULATION ACTIVE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              NEP 2020 CERTIFIED
            </span>
          </div>
        </div>

        {/* Headline & Overview */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#006fcc] mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Interactive Experiential Laboratory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#003c6e]">
              CSEEL 360° Interactive Science Lab Tour
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed font-medium">
              Step inside our high-precision CBSE & ICSE certified STEM laboratories. Drag with mouse or touch to pan 360°, inspect instruments, and launch live interactive simulations.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shrink-0 shadow-xs">
            <div className="px-3 py-1 text-center border-r border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Disciplines</p>
              <p className="text-base font-black text-[#003c6e]">4 Labs</p>
            </div>
            <div className="px-3 py-1 text-center border-r border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Hotspots</p>
              <p className="text-base font-black text-[#006fcc]">16+ Stations</p>
            </div>
            <div className="px-3 py-1 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Batch Size</p>
              <p className="text-base font-black text-emerald-700">40 Students</p>
            </div>
          </div>
        </div>

        {/* Discipline Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-thin">
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
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#006fcc] text-white border-[#006fcc] shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#006fcc]'}`} />
                <span>{lab.name.split('&')[0]}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Main 360° Interactive Canvas ─── */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div
          ref={tourContainerRef}
          className="relative rounded-3xl overflow-hidden border-2 border-slate-200/90 bg-slate-900 shadow-xl group select-none"
          style={{ height: '70vh', minHeight: '520px', maxHeight: '760px' }}
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
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/50" />

          {/* 360 Hotspot Markers */}
          {activeLab.hotspots.map((hotspot) => {
            const normalizedX = (hotspot.xPercent + (panX * 0.3) + 100) % 100;
            const normalizedY = Math.max(10, Math.min(90, hotspot.yPercent - (panY * 0.35)));
            const isSelected = selectedHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-125"
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
                  <span className={`absolute w-10 h-10 rounded-full animate-ping opacity-60 ${isSelected ? 'bg-amber-400' : 'bg-[#006fcc]'}`} />
                  <span className={`absolute w-6 h-6 rounded-full opacity-80 ${isSelected ? 'bg-amber-500' : 'bg-[#006fcc]'}`} />
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white font-black text-[10px] text-white ${
                      isSelected
                        ? 'bg-amber-500'
                        : 'bg-[#006fcc]'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </div>

                  {/* Hotspot Floating Label */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 shadow-xl pointer-events-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006fcc] animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-900 tracking-tight">
                      {hotspot.name.split(' ')[0]} {hotspot.name.split(' ')[1] || ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Top HUD: Current Lab Info & Compass */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#006fcc] flex items-center justify-center shrink-0">
                <activeLab.icon className="w-5 h-5 text-[#006fcc]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {activeLab.name}
                  </h2>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#006fcc] border border-blue-200">
                    {activeLab.curriculum}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
                  Capacity: {activeLab.capacity} • {activeLab.hotspots.length} Interactive Stations
                </p>
              </div>
            </div>

            {/* Compass Heading & Camera Controls */}
            <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-lg">
              <Compass className="w-4 h-4 text-[#006fcc] animate-spin-slow" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Orientation</p>
                <p className="text-xs font-black text-slate-900">{getCompassDirection(panX)}</p>
              </div>
            </div>
          </div>

          {/* Camera Angles Selector Toolbar */}
          <div className="absolute bottom-20 sm:bottom-6 left-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 shadow-lg overflow-x-auto max-w-[calc(100%-2rem)]">
            <span className="text-[10px] font-black uppercase text-slate-500 px-2 flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5 text-[#006fcc]" />
              <span className="hidden md:inline">Presets:</span>
            </span>
            {activeLab.cameraAngles.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setCameraAngle(cam.yaw, cam.pitch)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-white hover:bg-[#006fcc] transition-colors whitespace-nowrap border border-slate-100 hover:border-[#006fcc] cursor-pointer"
              >
                {cam.name}
              </button>
            ))}
          </div>

          {/* 360 Viewer Controls Toolbar */}
          <div className="absolute bottom-6 right-4 z-30 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-1.5 sm:p-2 shadow-lg">
            {/* Auto Rotation Toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause Auto-Pan' : 'Start Auto-Pan'}
              className={`p-2 rounded-xl transition-all ${
                isAutoRotating
                  ? 'bg-blue-50 text-[#006fcc] border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Reset View */}
            <button
              onClick={() => {
                setPanX(0);
                setPanY(0);
                setZoomLevel(1);
              }}
              title="Reset View"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2.0, prev + 0.2))}
              title="Zoom In"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => setZoomLevel((prev) => Math.max(1.0, prev - 0.2))}
              title="Zoom Out"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Voice Narration Audio Toggle */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              title={isAudioMuted ? 'Unmute Audio Guide' : 'Mute Audio Guide'}
              className={`p-2 rounded-xl transition-all ${
                !isAudioMuted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Mouse/Touch Drag Instruction */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md opacity-85 group-hover:opacity-100 transition-opacity">
            👆 Click & drag anywhere to look around in 360°
          </div>

          {/* Active Equipment Popover Inspector */}
          {selectedHotspot && (
            <div
              className="absolute top-16 right-4 sm:right-6 z-40 max-w-sm sm:max-w-md w-full bg-white/98 backdrop-blur-xl border-2 border-[#006fcc]/60 rounded-3xl p-4 sm:p-5 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#006fcc] border border-blue-200">
                      {selectedHotspot.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        selectedHotspot.safetyLevel === 'Green'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : selectedHotspot.safetyLevel === 'Yellow'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-[#006fcc] border border-blue-200'
                      }`}
                    >
                      Safety: {selectedHotspot.safetyLevel}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    {selectedHotspot.name}
                  </h3>
                  <p className="text-[11px] text-[#006fcc] font-mono font-bold mt-0.5">
                    Model: {selectedHotspot.modelNumber} • {selectedHotspot.badge}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mt-3">
                {selectedHotspot.fullDesc}
              </p>

              {/* Specifications */}
              <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Key Specifications:
                </p>
                <ul className="text-[11px] text-slate-700 space-y-1 pl-1">
                  {selectedHotspot.specifications.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#006fcc] font-bold">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* NEP Aligned Practicals */}
              <div className="mt-3 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Associated CBSE & NEP 2020 Practicals:
                </p>
                <div className="space-y-1">
                  {selectedHotspot.nepAlignedPracticals.map((prac, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] bg-emerald-50/70 border border-emerald-200/80 px-2 py-1 rounded-lg text-emerald-800 font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{prac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                {selectedHotspot.simulatorUrl && (
                  <Link
                    href={selectedHotspot.simulatorUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#006fcc] hover:bg-[#005bb8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
                  >
                    <span>Launch Simulator</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#006fcc]" />
                  <span>Hear Audio</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Audio Guide Transcript Banner */}
        <div className="mt-4 bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006fcc] flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4 text-[#006fcc]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase text-[#006fcc] tracking-wider">
                Virtual Lab Audio Commentary
              </p>
              <p className="text-xs text-slate-700 font-medium truncate">
                "{audioTranscript || activeLab.narrationIntro}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {isAudioMuted ? 'Unmute Audio' : 'Mute'}
          </button>
        </div>
      </section>

      {/* ─── Laboratory Architecture & Curriculum Standards ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#003c6e]">
              Laboratory Architecture & Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Explore equipment specifications, safety protocols, and CBSE practical syllabus mapping.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-xs">
            <button
              onClick={() => setActiveTab('tour')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tour'
                  ? 'bg-[#006fcc] text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Equipment Roster
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-[#006fcc] text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CBSE & NEP Mapping
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'safety'
                  ? 'bg-[#006fcc] text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Safety Protocols
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-[#006fcc] text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              School Lab Setup
            </button>
          </div>
        </div>

        {/* Tab 1: Equipment Roster Grid */}
        {activeTab === 'tour' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLab.hotspots.map((station) => (
              <div
                key={station.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-[#006fcc]/50 transition-all hover:shadow-md group shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006fcc] border border-blue-200">
                    {station.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {station.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006fcc] transition-colors mb-2">
                  {station.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {station.shortDesc}
                </p>

                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4">
                  <p className="text-[10px] font-black uppercase text-slate-500">Features:</p>
                  {station.specifications.slice(0, 2).map((s, idx) => (
                    <p key={idx} className="text-[11px] text-slate-700 flex items-start gap-1">
                      <span className="text-[#006fcc] font-bold">✓</span> {s}
                    </p>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedHotspot(station);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Inspect in 360°</span>
                    <Eye className="w-3.5 h-3.5 text-[#006fcc]" />
                  </button>
                  {station.simulatorUrl && (
                    <Link
                      href={station.simulatorUrl}
                      className="py-2 px-3 rounded-xl bg-[#006fcc] hover:bg-[#005bb8] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <span>Simulate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: CBSE & NEP 2020 Mapping */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="max-w-2xl">
              <h3 className="text-lg font-black text-[#003c6e]">
                Aligned with National Education Policy (NEP 2020) & Board Practicals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Every CSEEL laboratory station is engineered to meet 100% of the prescribed CBSE, ICSE, and State Board practical syllabi for secondary and senior secondary stages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#006fcc] flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Class 9 & 10 Secondary Stage</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Foundational experiments in chemical reactions, optics, electric circuits, and plant cytology.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Class 11 & 12 Senior Secondary</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Advanced volumetric titration, LCR resonance, wave diffraction, organic synthesis, and DNA isolation.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">NEP 2020 Experiential Tinkering</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cross-disciplinary problem solving, 3D rapid fabrication, IoT environmental monitoring, and robotics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Safety Protocols */}
        {activeTab === 'safety' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#003c6e]">
                  Zero-Accident Safety Compliance (ISO 17025 Certified)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Built-in multi-tier safety mechanisms protect student researchers across all experiment types.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Flame className="w-5 h-5 text-rose-500 mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Emergency Cut-Off</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Master electrical and gas cutoff switches located at teacher station and laboratory exits.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-[#006fcc] mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Eye-Wash & Drench Shower</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Immediate 15-second foot-activated eye-wash stations with tempered water delivery.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <FlaskConical className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Micro-Scale Chemistry</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Green Chemistry protocols reduce reagent volume by 85%, eliminating toxic runoff.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-amber-600 mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Shatter-Proof Glassware</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  High thermal shock borosilicate 3.3 glassware with double-jacketed safety rims.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: School Lab Setup Booking */}
        {activeTab === 'booking' && (
          <div className="bg-gradient-to-br from-[#003c6e] via-[#004f98] to-[#006fcc] text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-200 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>On-Campus Turnkey Setup</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Transform Your School's Science Laboratory
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                CSEEL provides turnkey experiential lab architecture, custom furniture, ISO apparatus, digital simulators, and comprehensive teacher training for premier schools across India.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href="/contact-us"
                  className="px-6 py-3 rounded-full bg-white hover:bg-blue-50 text-[#003c6e] font-black text-sm flex items-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span>Request Lab Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#003c6e]" />
                </Link>
                <Link
                  href="/compare-plans"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-xs transition-colors"
                >
                  View Institutional Plans
                </Link>
              </div>
            </div>

            <div className="w-full md:w-80 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 shadow-lg">
              <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-200">
                Institutional Lab Package Includes:
              </h4>
              <ul className="text-xs text-white space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Custom Anti-Corrosive Lab Workstations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Complete CBSE/ICSE Instrument Kits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Digital 3D Interactive Simulators License</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>On-Site Teacher Mentorship Workshops</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
