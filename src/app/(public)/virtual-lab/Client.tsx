'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import {
  Sliders,
  Play,
  Pause,
  RotateCw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  FlaskConical,
  Atom,
  Microscope,
  Cpu,
  Layers,
  Activity,
  Scan,
  Barcode,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Eye,
  Flame,
  Zap,
  Radio,
  Copy,
  Check,
  Languages,
  ArrowLeft,
} from 'lucide-react';

interface ExperimentConcept {
  id: string;
  name: string;
  discipline: 'physics' | 'chemistry' | 'biology' | 'robotics';
  barcode: string;
  barcodeNumber: string;
  formula: string;
  title: string;
  principle: string;
  realWorldApp: string;
  specs: string[];
  nepPracticals: string[];
  audioEn: string;
  audioHi: string;
}

const conceptsData: Record<string, ExperimentConcept> = {
  optics_laser: {
    id: 'optics_laser',
    name: 'Laser Optics & Prism Refraction Bench',
    discipline: 'physics',
    barcode: 'CSEEL-3D-PHYS-OPTICS',
    barcodeNumber: '8901234567901',
    formula: 'n = \\frac{\\sin((A + D_m)/2)}{\\sin(A/2)}  \\quad \\text{and} \\quad \\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}',
    title: 'Snell’s Law of Refraction & Triangular Prism Dispersion',
    principle: 'Monochromatic and composite laser beams undergo refractive index boundary bending at glass interfaces, separating light wavelengths according to Cauchy’s dispersion equation and focal plane convergence.',
    realWorldApp: 'Spectrometers, laser barcode scanners, fiber-optic internet routers, and medical endoscopic imaging.',
    specs: [
      'He-Ne Red (650 nm) & DPSS Green (532 nm) Laser Diodes',
      'Equilateral 60° Crown Glass Dispersion Prism (n = 1.517)',
      'Biconvex Lens (f = +100 mm) on 3-Axis Kinematic Mount',
      'Digital Silicon Photodetector with sub-millimeter Vernier',
    ],
    nepPracticals: [
      'Class 12: Refractive index of glass prism using angle of minimum deviation',
      'Class 12: Finding focal length of convex lens by u-v graph method',
      'Class 10: Dispersion of white light through a triangular glass prism',
    ],
    audioEn: '3D Laser Optics Bench active. Observe Snell’s refraction as the laser beam penetrates the glass prism and converges through the biconvex lens.',
    audioHi: '3D लेजर ऑप्टिक्स बेंच सक्रिय है। देखिए कैसे लेजर किरण ग्लास प्रिज्म से अपवर्तित होकर फोकल पॉइंट पर केंद्रित होती है।',
  },
  chemistry_flask: {
    id: 'chemistry_flask',
    name: 'Heated Reaction Flask & Magnetic Stirrer Station',
    discipline: 'chemistry',
    barcode: 'CSEEL-3D-CHEM-FLASK',
    barcodeNumber: '8901234567902',
    formula: 'k = A \\cdot e^{-E_a / (R T)}  \\quad \\text{and} \\quad N_1 V_1 = N_2 V_2',
    title: 'Arrhenius Reaction Kinetics & Thermal Convection',
    principle: 'Increasing solution temperature elevates molecular kinetic energy and collision frequency exceeding activation energy barriers, accelerated by magnetic vortex mass-transfer.',
    realWorldApp: 'Industrial polymer synthesis, exothermic acid-base neutralization, and pharmaceutical drug crystallization.',
    specs: [
      'Borosilicate 3.3 Glass 500 mL Round Bottom Boiling Flask',
      'Digital Ceramic Hotplate (Ambient to 350°C ±1°C)',
      'PTFE Coated Magnetic Stirrer Bar (100 to 1500 RPM)',
      'Real-time Digital RTD Temperature Probe',
    ],
    nepPracticals: [
      'Class 12: Effect of temperature and concentration on the rate of reaction',
      'Class 11: Determination of enthalpy of neutralization of strong acid with strong base',
      'Class 10: Exothermic and endothermic chemical reaction dynamics',
    ],
    audioEn: 'Chemistry Reaction Station. Adjust temperature and stirring RPM on the touch console to observe thermal convection and bubbling particle dynamics.',
    audioHi: 'केमिस्ट्री रिएक्शन स्टेशन। टच कंसोल से तापमान और स्टिरर स्पीड बढ़ाकर थर्मल कन्वेक्शन और बुलबुलों की गतिशीलता देखें।',
  },
  biology_microscope: {
    id: 'biology_microscope',
    name: '4K Research Microscope & Holographic Cell Projection',
    discipline: 'biology',
    barcode: 'CSEEL-3D-BIOL-MIC',
    barcodeNumber: '8901234567903',
    formula: 'd = \\frac{\\lambda}{2 \\cdot \\text{NA}}  \\quad \\text{Total Magnification} = M_{\\text{objective}} \\times M_{\\text{eyepiece}}',
    title: 'High-Resolution Cellular Cytology & Mitosis Stages',
    principle: 'Plan-achromatic compound optics project magnified specimens onto digital sensors, resolving chromosomes during prophase, metaphase, anaphase, and telophase.',
    realWorldApp: 'Cancer biopsy analysis, hematological blood testing, and plant cell genetic engineering.',
    specs: [
      '10x, 40x, 100x Oil Immersion Plan Achromatic Objectives',
      '4K UHD Live Digital Holographic Sensor Feeds',
      '3W Köhler LED Sub-stage Condenser with Iris Diaphragm',
      'Coaxial Coarse/Fine Focus (0.002 mm graduation)',
    ],
    nepPracticals: [
      'Class 12: Study of mitosis in onion root tip temporary squash mount',
      'Class 11: Comparative study of plant and animal cell anatomy',
      'Class 9: Temporary mount of onion peel to study plant cells',
    ],
    audioEn: '4K Cytology Microscope active. The hovering holographic projection reveals active mitotic chromosome division and cell wall organelles.',
    audioHi: '4K माइक्रोस्कोप सक्रिय है। होलोग्राफिक 3D प्रोजेक्शन में माइटोसिस कोशिका विभाजन और सेल ऑर्गेनेल्स को लाइव देखें।',
  },
  robotics_console: {
    id: 'robotics_console',
    name: 'Smart Digital Lab Telemetry & Robotics Hub',
    discipline: 'robotics',
    barcode: 'CSEEL-3D-ROBT-HUB',
    barcodeNumber: '8901234567904',
    formula: '\\vec{\\theta} = J^{-1} \\cdot \\vec{v}  \\quad \\text{and} \\quad V_{\\text{RMS}} = \\frac{V_{\\text{peak}}}{\\sqrt{2}}',
    title: 'Inverse Kinematics & Touchscreen Telemetry Hub',
    principle: 'Translates operator touch coordinates into multivariable actuator commands while logging temperature, RPM, and electrical wave telemetry in real time.',
    realWorldApp: 'Smart laboratory automation, surgical robotics, and industrial IoT SCADA systems.',
    specs: [
      'Capacitive Multi-Touch Digital Lab Dashboard',
      '6-Axis Articulated Micro-Servo Kinematics',
      'Integrated Dual-Channel Oscilloscope & Function Generator',
      'Real-time Bluetooth & Wi-Fi Telemetry Stream',
    ],
    nepPracticals: [
      'ATL Challenge: Designing automated robotic pick-and-place routines',
      'Class 12: Diode waveform rectification and capacitor ripple filtering',
      'STEM Module: Sensor telemetry data logging on cloud dashboards',
    ],
    audioEn: 'Digital Control Console. Touch the onscreen sliders to regulate laboratory apparatus and view real-time telemetry curves.',
    audioHi: 'डिजिटल कंट्रोल कंसोल। ऑन-स्क्रीन स्लाइडर्स को छूकर लैब उपकरणों को नियंत्रित करें और लाइव टेलीमेट्री ग्राफ देखें।',
  },
};

export default function VirtualLab3DClient() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active Category Selection
  const [activeCategory, setActiveCategory] = useState<'all' | 'physics' | 'chemistry' | 'biology' | 'robotics'>('all');
  const [selectedConcept, setSelectedConcept] = useState<ExperimentConcept | null>(null);

  // Live Experiment Physical Controls State
  const [laserPower, setLaserPower] = useState<boolean>(true);
  const [laserAngle, setLaserAngle] = useState<number>(15); // degrees
  const [prismRefractionIndex, setPrismRefractionIndex] = useState<number>(1.52);

  const [heaterTemp, setHeaterTemp] = useState<number>(78); // °C
  const [stirrerRpm, setStirrerRpm] = useState<number>(420); // RPM
  const [solutionColor, setSolutionColor] = useState<string>('#38BDF8'); // Cyan Blue

  const [microscopeZoom, setMicroscopeZoom] = useState<number>(400); // x
  const [hologramActive, setHologramActive] = useState<boolean>(true);

  // Performance Telemetry State
  const [fps, setFps] = useState<number>(60);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [narrationLang, setNarrationLang] = useState<'en' | 'hi'>('en');
  const [copiedBarcode, setCopiedBarcode] = useState<boolean>(false);

  // 3D Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic 3D Objects References
  const laserBeamGroupRef = useRef<THREE.Group | null>(null);
  const fluidMeshRef = useRef<THREE.Mesh | null>(null);
  const bubblesGroupRef = useRef<THREE.Group | null>(null);
  const hologramMeshRef = useRef<THREE.Mesh | null>(null);
  const prismMeshRef = useRef<THREE.Mesh | null>(null);

  // Camera Target Interpolation
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 5.8));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  // Audio Speech Synthesis Trigger
  const stopAllAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakNarration = useCallback((text: string, lang: 'en' | 'hi' = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isAudioMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [isAudioMuted]);

  // Handle Category Switching and Camera Positioning
  const handleSelectCategory = (cat: 'all' | 'physics' | 'chemistry' | 'biology' | 'robotics') => {
    setActiveCategory(cat);
    stopAllAudio();

    if (cat === 'all') {
      targetCamPos.current.set(0, 3.2, 5.8);
      targetLookAt.current.set(0, 1.2, 0);
      setSelectedConcept(null);
    } else if (cat === 'physics') {
      targetCamPos.current.set(-2.2, 2.4, 3.2);
      targetLookAt.current.set(-2.0, 1.4, 0);
      setSelectedConcept(conceptsData.optics_laser);
      speakNarration(narrationLang === 'hi' ? conceptsData.optics_laser.audioHi : conceptsData.optics_laser.audioEn, narrationLang);
    } else if (cat === 'chemistry') {
      targetCamPos.current.set(0, 2.3, 3.0);
      targetLookAt.current.set(0, 1.3, 0);
      setSelectedConcept(conceptsData.chemistry_flask);
      speakNarration(narrationLang === 'hi' ? conceptsData.chemistry_flask.audioHi : conceptsData.chemistry_flask.audioEn, narrationLang);
    } else if (cat === 'biology') {
      targetCamPos.current.set(2.4, 2.4, 3.2);
      targetLookAt.current.set(2.2, 1.4, 0);
      setSelectedConcept(conceptsData.biology_microscope);
      speakNarration(narrationLang === 'hi' ? conceptsData.biology_microscope.audioHi : conceptsData.biology_microscope.audioEn, narrationLang);
    } else if (cat === 'robotics') {
      targetCamPos.current.set(0.2, 1.9, 2.6);
      targetLookAt.current.set(0.2, 1.1, 0.4);
      setSelectedConcept(conceptsData.robotics_console);
      speakNarration(narrationLang === 'hi' ? conceptsData.robotics_console.audioHi : conceptsData.robotics_console.audioEn, narrationLang);
    }
  };

  // Build Three.js 3D Virtual Laboratory Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c111c);
    scene.fog = new THREE.FogExp2(0x0c111c, 0.055);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High Dynamic Range & Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 3. Laboratory Interior Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdce7f7, 1.4);
    scene.add(ambientLight);

    const mainCeilingLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainCeilingLight.position.set(0, 8, 4);
    mainCeilingLight.castShadow = true;
    mainCeilingLight.shadow.mapSize.width = 1024;
    mainCeilingLight.shadow.mapSize.height = 1024;
    scene.add(mainCeilingLight);

    // Accent Laser Point Lights
    const redLaserLight = new THREE.PointLight(0xff2244, 3, 4);
    redLaserLight.position.set(-2, 1.6, 0);
    scene.add(redLaserLight);

    const blueFlaskLight = new THREE.PointLight(0x00aaff, 4, 3);
    blueFlaskLight.position.set(0, 1.5, 0);
    scene.add(blueFlaskLight);

    const greenHoloLight = new THREE.PointLight(0x00ff88, 3, 3);
    greenHoloLight.position.set(2.2, 1.8, 0);
    scene.add(greenHoloLight);

    // 4. Lab Room Architecture & Floor
    // Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      roughness: 0.2,
      metalness: 0.1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Wall Grid GridHelper
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Back Lab Wall
    const wallGeo = new THREE.PlaneGeometry(24, 8);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 4, -4);
    scene.add(wallMesh);

    // 5. Heavy-Duty Science Workbench Table
    const tableTopGeo = new THREE.BoxGeometry(9, 0.15, 3.2);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.05,
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.set(0, 1.0, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // Table Frame Legs (Aluminum)
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    [
      [-4.2, 0.5, 1.4],
      [4.2, 0.5, 1.4],
      [-4.2, 0.5, -1.4],
      [4.2, 0.5, -1.4],
      [0, 0.5, 1.4],
      [0, 0.5, -1.4],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      scene.add(leg);
    });

    // ─── STATION 1: PHYSICS LASER OPTICS BENCH (Left: x = -2.2) ───
    const opticsGroup = new THREE.Group();
    opticsGroup.position.set(-2.2, 1.08, 0);

    // Optical Rail (Black Anodized)
    const railGeo = new THREE.BoxGeometry(2.4, 0.06, 0.25);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 0.03, 0);
    opticsGroup.add(rail);

    // Laser Emitter Box
    const laserBoxGeo = new THREE.BoxGeometry(0.3, 0.25, 0.2);
    const laserBoxMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.5, roughness: 0.3 });
    const laserBox = new THREE.Mesh(laserBoxGeo, laserBoxMat);
    laserBox.position.set(-1.0, 0.18, 0);
    opticsGroup.add(laserBox);

    // Laser Emitter Aperture Ring
    const ringGeo = new THREE.TorusGeometry(0.04, 0.015, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xfca5a5, emissive: 0xff0000, emissiveIntensity: 2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-0.84, 0.18, 0);
    opticsGroup.add(ring);

    // Triangular Glass Prism
    const prismGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.35, 3);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.4,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(-0.2, 0.24, 0);
    prism.rotation.y = Math.PI / 6;
    opticsGroup.add(prism);
    prismMeshRef.current = prism;

    // Biconvex Lens Mount
    const lensRingGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 32);
    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
    lensRing.position.set(0.4, 0.22, 0);
    lensRing.rotation.y = Math.PI / 2;
    opticsGroup.add(lensRing);

    const lensGlassGeo = new THREE.SphereGeometry(0.15, 32, 16);
    lensGlassGeo.scale(0.2, 1, 1);
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.95,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
    });
    const lensGlass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
    lensGlass.position.set(0.4, 0.22, 0);
    opticsGroup.add(lensGlass);

    // Laser Detector Screen
    const screenGeo = new THREE.BoxGeometry(0.04, 0.35, 0.3);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(1.0, 0.22, 0);
    opticsGroup.add(screen);

    // Volumetric Laser Rays (Beams)
    const laserBeamGroup = new THREE.Group();
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const beam1Geo = new THREE.CylinderGeometry(0.008, 0.008, 0.8, 8);
    const beam1 = new THREE.Mesh(beam1Geo, beamMat);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-0.6, 0.18, 0);
    laserBeamGroup.add(beam1);

    const beam2Geo = new THREE.CylinderGeometry(0.007, 0.007, 0.6, 8);
    const beam2 = new THREE.Mesh(beam2Geo, beamMat);
    beam2.rotation.z = Math.PI / 2.05;
    beam2.position.set(0.1, 0.18, 0);
    laserBeamGroup.add(beam2);

    const beam3Geo = new THREE.CylinderGeometry(0.006, 0.006, 0.6, 8);
    const beam3 = new THREE.Mesh(beam3Geo, beamMat);
    beam3.rotation.z = Math.PI / 1.95;
    beam3.position.set(0.7, 0.18, 0);
    laserBeamGroup.add(beam3);

    opticsGroup.add(laserBeamGroup);
    laserBeamGroupRef.current = laserBeamGroup;
    scene.add(opticsGroup);

    // ─── STATION 2: CHEMISTRY FLASK & MAGNETIC HOTPLATE (Center: x = 0) ───
    const chemGroup = new THREE.Group();
    chemGroup.position.set(0, 1.08, 0);

    // Hotplate Magnetic Stirrer Base
    const hotplateGeo = new THREE.BoxGeometry(0.8, 0.16, 0.8);
    const hotplateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.4, roughness: 0.3 });
    const hotplate = new THREE.Mesh(hotplateGeo, hotplateMat);
    hotplate.position.set(0, 0.08, 0);
    chemGroup.add(hotplate);

    // Heating Plate Surface
    const plateTopGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 32);
    const plateTopMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
    const plateTop = new THREE.Mesh(plateTopGeo, plateTopMat);
    plateTop.position.set(0, 0.17, 0);
    chemGroup.add(plateTop);

    // Retort Stand Rod & Clamp
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 16);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xc0c6d0, metalness: 0.95 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.set(-0.35, 0.6, -0.3);
    chemGroup.add(rod);

    const clampGeo = new THREE.TorusGeometry(0.12, 0.015, 16, 32);
    const clamp = new THREE.Mesh(clampGeo, rodMat);
    clamp.position.set(-0.05, 0.65, 0);
    chemGroup.add(clamp);

    // Borosilicate Glass Boiling Flask (Transparent)
    const flaskSphereGeo = new THREE.SphereGeometry(0.24, 32, 32);
    const flaskGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      transparent: true,
      roughness: 0.04,
      ior: 1.48,
      thickness: 0.2,
    });
    const flaskBody = new THREE.Mesh(flaskSphereGeo, flaskGlassMat);
    flaskBody.position.set(0, 0.4, 0);
    chemGroup.add(flaskBody);

    // Flask Neck
    const neckGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.35, 32);
    const flaskNeck = new THREE.Mesh(neckGeo, flaskGlassMat);
    flaskNeck.position.set(0, 0.65, 0);
    chemGroup.add(flaskNeck);

    // Chemical Solution Inside Flask
    const fluidGeo = new THREE.SphereGeometry(0.22, 32, 32, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.6);
    const fluidMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(solutionColor),
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
    });
    const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
    fluidMesh.position.set(0, 0.4, 0);
    chemGroup.add(fluidMesh);
    fluidMeshRef.current = fluidMesh;

    // Bubbling Particles Inside Liquid
    const bubblesGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.015, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.7 });
    for (let i = 0; i < 20; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        (Math.random() - 0.5) * 0.24,
        0.26 + Math.random() * 0.2,
        (Math.random() - 0.5) * 0.24
      );
      bubblesGroup.add(bubble);
    }
    chemGroup.add(bubblesGroup);
    bubblesGroupRef.current = bubblesGroup;

    scene.add(chemGroup);

    // ─── STATION 3: 4K CELLULAR RESEARCH MICROSCOPE (Right: x = 2.2) ───
    const bioGroup = new THREE.Group();
    bioGroup.position.set(2.2, 1.08, 0);

    // Heavy Microscope Base
    const micBaseGeo = new THREE.BoxGeometry(0.55, 0.12, 0.65);
    const micMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.2 });
    const micBase = new THREE.Mesh(micBaseGeo, micMat);
    micBase.position.set(0, 0.06, 0);
    bioGroup.add(micBase);

    // Curved Arm & Stage
    const armGeo = new THREE.BoxGeometry(0.12, 0.8, 0.18);
    const micArm = new THREE.Mesh(armGeo, micMat);
    micArm.position.set(0, 0.45, -0.2);
    bioGroup.add(micArm);

    // Mechanical Stage
    const stageGeo = new THREE.BoxGeometry(0.4, 0.04, 0.35);
    const stage = new THREE.Mesh(stageGeo, micMat);
    stage.position.set(0, 0.35, 0.02);
    bioGroup.add(stage);

    // Objective Turret & Eyepiece
    const turretGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
    const turretMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
    const turret = new THREE.Mesh(turretGeo, turretMat);
    turret.position.set(0, 0.55, 0.02);
    bioGroup.add(turret);

    // Trinocular Head Tubes
    const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 16);
    const tube1 = new THREE.Mesh(tubeGeo, turretMat);
    tube1.position.set(-0.06, 0.82, 0.02);
    tube1.rotation.z = -0.2;
    bioGroup.add(tube1);

    const tube2 = new THREE.Mesh(tubeGeo, turretMat);
    tube2.position.set(0.06, 0.82, 0.02);
    tube2.rotation.z = 0.2;
    bioGroup.add(tube2);

    // Hovering 3D Holographic Cellular Mitosis Projection
    const holoGeo = new THREE.IcosahedronGeometry(0.24, 2);
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.5,
      wireframe: true,
    });
    const hologram = new THREE.Mesh(holoGeo, holoMat);
    hologram.position.set(0, 1.25, 0.02);
    bioGroup.add(hologram);
    hologramMeshRef.current = hologram;

    scene.add(bioGroup);

    // ─── FOREGROUND INTERACTIVE TOUCH TABLET (like in user's image) ───
    const tabletGroup = new THREE.Group();
    tabletGroup.position.set(0.2, 1.15, 0.85);
    tabletGroup.rotation.x = -Math.PI / 6; // Ergonomic 30° tilt

    const tabletBodyGeo = new THREE.BoxGeometry(0.9, 0.04, 0.6);
    const tabletBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.2 });
    const tabletBody = new THREE.Mesh(tabletBodyGeo, tabletBodyMat);
    tabletGroup.add(tabletBody);

    // Tablet Screen (Emissive Cyan Glass)
    const screenGlassGeo = new THREE.PlaneGeometry(0.82, 0.52);
    const screenGlassMat = new THREE.MeshBasicMaterial({
      color: 0x0369a1,
    });
    const tabletScreen = new THREE.Mesh(screenGlassGeo, screenGlassMat);
    tabletScreen.position.set(0, 0.022, 0);
    tabletScreen.rotation.x = -Math.PI / 2;
    tabletGroup.add(tabletScreen);

    scene.add(tabletGroup);

    // ─── ANIMATION LOOP & FPS COUNTER ───
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // FPS Tracking
      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 0.5) {
        setFps(Math.round(frameCount / fpsTimer));
        frameCount = 0;
        fpsTimer = 0;
      }

      // Smooth Camera Transition towards target position and lookAt
      camera.position.lerp(targetCamPos.current, 0.06);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const desiredLook = targetLookAt.current.clone().sub(camera.position).normalize();
      camera.lookAt(camera.position.clone().add(desiredLook));

      // Animate Laser Prism Refraction
      if (prismMeshRef.current) {
        prismMeshRef.current.rotation.y = Math.PI / 6 + Math.sin(time * 0.001) * 0.1;
      }

      // Animate Chemistry Bubbles
      if (bubblesGroupRef.current) {
        const speed = (stirrerRpm / 400) * 0.02;
        bubblesGroupRef.current.children.forEach((b) => {
          b.position.y += speed * (0.5 + Math.random() * 0.5);
          if (b.position.y > 0.55) {
            b.position.y = 0.26;
            b.position.x = (Math.random() - 0.5) * 0.22;
            b.position.z = (Math.random() - 0.5) * 0.22;
          }
        });
      }

      // Animate Biology Hologram
      if (hologramMeshRef.current && hologramActive) {
        hologramMeshRef.current.rotation.x += 0.01;
        hologramMeshRef.current.rotation.y += 0.015;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      stopAllAudio();
    };
  }, [hologramActive, narrationLang, solutionColor, speakNarration, stirrerRpm, stopAllAudio]);

  // Update Fluid Color Dynamically
  useEffect(() => {
    if (fluidMeshRef.current) {
      (fluidMeshRef.current.material as THREE.MeshPhysicalMaterial).color.set(solutionColor);
    }
  }, [solutionColor]);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBarcode(true);
      setTimeout(() => setCopiedBarcode(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[640px] bg-[#0c111c] text-white flex overflow-hidden select-none font-sans">
      
      {/* ─── 1. LEFT SIDEBAR NAVIGATION (Matching Reference Screenshot) ─── */}
      <aside className="w-56 sm:w-64 bg-[#111827]/95 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between z-30 shrink-0">
        <div>
          {/* User Profile Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
                U
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">CSEEL Innovator</p>
                <p className="text-[10px] text-slate-400 truncate font-mono">@learn_lab</p>
              </div>
            </div>
            <Link
              href="/virtual-lab-tour"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              title="Switch to 360 Panoramic Tour"
            >
              <RotateCw size={14} />
            </Link>
          </div>

          {/* Navigation Categories */}
          <nav className="p-2 space-y-1">
            <button
              onClick={() => handleSelectCategory('all')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer text-left ${
                activeCategory === 'all'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>Full Studio View</span>
            </button>

            <button
              onClick={() => handleSelectCategory('physics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer text-left ${
                activeCategory === 'physics'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Atom size={16} className="text-red-400" />
              <span>Physics Studio</span>
            </button>

            <button
              onClick={() => handleSelectCategory('chemistry')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer text-left ${
                activeCategory === 'chemistry'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FlaskConical size={16} className="text-cyan-400" />
              <span>Chemistry Flask</span>
            </button>

            <button
              onClick={() => handleSelectCategory('biology')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer text-left ${
                activeCategory === 'biology'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Microscope size={16} className="text-emerald-400" />
              <span>Biology 4K</span>
            </button>

            <button
              onClick={() => handleSelectCategory('robotics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer text-left ${
                activeCategory === 'robotics'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Cpu size={16} className="text-purple-400" />
              <span>Telemetry Hub</span>
            </button>
          </nav>
        </div>

        {/* Quick Back & Support Link */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Audio Voice</span>
            <button
              onClick={() => {
                const nextMuted = !isAudioMuted;
                setIsAudioMuted(nextMuted);
                if (nextMuted) stopAllAudio();
              }}
              className="text-slate-300 hover:text-white"
            >
              {!isAudioMuted ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-red-400" />}
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition px-2 py-1"
          >
            <ArrowLeft size={13} />
            <span>Return to CSEEL Main</span>
          </Link>
        </div>
      </aside>

      {/* ─── 2. MAIN 3D THREE.JS VIEWPORT ─── */}
      <main className="relative flex-1 h-full overflow-hidden">
        
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* TOP-RIGHT LIVE PERFORMANCE HUD (Matching Reference Image) */}
        <div className="absolute top-4 right-4 z-30 pointer-events-auto flex items-start gap-2">
          <div className="bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-xl text-right">
            <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">Framerate</p>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-lg font-black font-mono text-emerald-400">{fps}</span>
              <span className="text-[10px] font-mono text-slate-400">FPS</span>
            </div>
            {/* Dynamic Activity Bars */}
            <div className="flex items-end justify-end gap-0.5 mt-1 h-3">
              {[6, 8, 12, 10, 14, 11, 9, 13, 14, 12].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-500 rounded-xs"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TOP-LEFT APPARATUS BARCODE HUD */}
        {selectedConcept && (
          <div className="absolute top-4 left-4 z-30 pointer-events-auto bg-[#0f172a]/95 backdrop-blur-md border border-slate-700 rounded-2xl p-3.5 shadow-2xl max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                  {selectedConcept.barcode}
                </span>
              </div>
              <button
                onClick={() => {
                  stopAllAudio();
                  setSelectedConcept(null);
                }}
                className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                <X size={12} />
              </button>
            </div>

            <h3 className="text-xs font-bold text-white leading-snug">
              {selectedConcept.name}
            </h3>
            <p className="text-[11px] font-mono text-amber-300 font-bold mt-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
              {selectedConcept.formula}
            </p>
            <p className="text-[10px] text-slate-300 leading-relaxed mt-2 line-clamp-2">
              {selectedConcept.principle}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  const nextLang = narrationLang === 'en' ? 'hi' : 'en';
                  setNarrationLang(nextLang);
                  speakNarration(nextLang === 'hi' ? selectedConcept.audioHi : selectedConcept.audioEn, nextLang);
                }}
                className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <Languages size={12} />
                <span>{narrationLang === 'en' ? 'Switch to Hindi Audio' : 'Switch to English'}</span>
              </button>
              <button
                onClick={stopAllAudio}
                className="p-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-700/60 transition cursor-pointer"
                title="Stop Audio"
              >
                <VolumeX size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ─── 3. BOTTOM FLOATING INTERACTIVE CONTROLS DOCK ─── */}
        <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto flex items-center justify-center">
          <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/90 rounded-3xl p-3 sm:px-6 sm:py-3.5 shadow-2xl flex items-center gap-4 sm:gap-8 max-w-4xl overflow-x-auto no-scrollbar">
            
            {/* Control 1: Temperature Slider */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Flame size={13} className="text-amber-400" />
                  <span>Temp</span>
                </span>
                <span className="text-amber-400 font-mono">{heaterTemp}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                value={heaterTemp}
                onChange={(e) => setHeaterTemp(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Control 2: Stirrer Speed Slider */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Activity size={13} className="text-cyan-400" />
                  <span>Stirrer</span>
                </span>
                <span className="text-cyan-400 font-mono">{stirrerRpm} RPM</span>
              </div>
              <input
                type="range"
                min="0"
                max="1200"
                step="50"
                value={stirrerRpm}
                onChange={(e) => setStirrerRpm(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Control 3: Chemical Reagent Color Switcher */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Reagent pH</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Acid (Cyan)', color: '#38BDF8' },
                  { name: 'Neutral (Green)', color: '#34D399' },
                  { name: 'Indicator Pink', color: '#F472B6' },
                  { name: 'Base (Amber)', color: '#F59E0B' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSolutionColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                    className={`w-5 h-5 rounded-full border-2 transition cursor-pointer ${
                      solutionColor === item.color ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Control 4: Microscope Hologram Toggle */}
            <div className="flex items-center gap-2 shrink-0 border-l border-slate-700/80 pl-4">
              <button
                onClick={() => setHologramActive(!hologramActive)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  hologramActive
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Sparkles size={13} />
                <span>{hologramActive ? 'Hologram ON' : 'Hologram OFF'}</span>
              </button>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
