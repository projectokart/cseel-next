import { slugify } from "@/lib/utils";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  subcategory: string;
  tags: string[];
  duration: string;
  views: number;
  likes: number;
  rating: number;
  img: string;
  desc: string;
  featured: boolean;
  components: string[];
  procedure?: string[];
  schematics_url?: string;
  code_snippet?: string;
  updated: string;
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    slug: "senku-smart-egg-incubator",
    title: "SENKU: Smart Egg Incubator",
    author: "MakerVerse India",
    difficulty: "Beginner",
    category: "General / Misc",
    subcategory: "WiFi & IoT",
    tags: ["wifi", "incubator", "esp8266", "dht22", "iot"],
    duration: "4 hrs",
    views: 18450,
    likes: 1420,
    rating: 4.9,
    img: "https://img.freepik.com/premium-photo/technology-abstract-circuit-board-texture-background-hightech-futuristic-circuit-board-banner-wallpaper_1029473-136066.jpg",
    desc: "Smart Egg Incubator to optimize the temperature and humidity using real-time WiFi telemetry to increase the chance of hatching eggs. Includes automatic egg turning mechanism, digital PID heating control, and cloud alerts over Telegram and Blynk.",
    featured: true,
    components: [
      "ESP8266 NodeMCU V3 Microcontroller",
      "DHT22 High-Precision Temperature & Humidity Sensor",
      "12V PTC Ceramic Heating Element with DC Fan",
      "SG90 Micro Servo Motor for 45° Egg Tray Tilting",
      "5V Dual-Channel Relay Module (Optocoupler Isolated)",
      "0.96 inch I2C OLED Display (128x64)",
      "12V 5A DC Power Supply Adapter"
    ],
    procedure: [
      "Build the thermal insulated acrylic chamber with air circulation vents.",
      "Mount the DHT22 sensor in the center zone away from direct heater radiation.",
      "Connect the NodeMCU to the relay module to trigger the heating coil and egg turning servo.",
      "Flash the Arduino C++ firmware with WiFi credentials and Blynk auth token.",
      "Calibrate the PID temperature loop to hold 37.5°C ± 0.2°C consistently."
    ],
    updated: "2026-03-12"
  },
  {
    id: "p2",
    slug: "n-style-home-info-system",
    title: "N**** Style Home Info System",
    author: "RetroMakers Hub",
    difficulty: "Intermediate",
    category: "Environment & Weather",
    subcategory: "General",
    tags: ["retro", "clock", "matrix-display", "arduino", "bme280"],
    duration: "5 hrs",
    views: 14200,
    likes: 980,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    desc: "A Home Info System (a.k.a smart clock) which displays the time, date, humidity, temperature, barometric pressure, air quality index, and moon phase using 4x cascading 8x8 LED dot matrix displays and real-time NTP sync.",
    featured: true,
    components: [
      "ESP32 WROOM-32 Development Board",
      "4-in-1 MAX7219 Dot Matrix LED Module (Red/Green)",
      "BME280 Precision Barometric & Humidity Sensor (I2C)",
      "DS3231 High Precision Real-Time Clock with Battery Backup",
      "Custom Laser-cut Walnut Wood & Frosted Acrylic Enclosure",
      "Type-C USB Cable & 5V 2A Power Brick"
    ],
    procedure: [
      "Solder male header pins to the MAX7219 display modules and daisy-chain SPI data lines.",
      "Wire the BME280 sensor to ESP32 I2C pins (GPIO 21 & GPIO 22).",
      "Upload the display controller sketch using the MD_Parola and MD_MAX72xx libraries.",
      "Connect to local WiFi router to synchronize exact Indian Standard Time (IST) via pool.ntp.org.",
      "Assemble into the wooden retro enclosure."
    ],
    updated: "2026-03-08"
  },
  {
    id: "p3",
    slug: "amiga-pijoystick",
    title: "Amiga PiJoystick Controller",
    author: "RetroPi Lab",
    difficulty: "Intermediate",
    category: "Raspberry Pi Platform",
    subcategory: "Raspberry Pi (Generic)",
    tags: ["raspberry-pi", "gaming", "amiga", "joystick", "gpio"],
    duration: "3 hrs",
    views: 9800,
    likes: 670,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop",
    desc: "Control your classic Commodore Amiga 9-pin DB9 joystick port with a modern USB Raspberry Pi gamepad or wireless Bluetooth arcade controller with sub-millisecond input lag.",
    featured: false,
    components: [
      "Raspberry Pi Pico (RP2040)",
      "DB9 Male D-Sub Connector with Breakout PCB",
      "74HCT245 Octal Bus Transceiver (3.3V to 5V Level Shifter)",
      "Sanwa Arcade Sanwa Style 8-Way Microswitch Joystick",
      "3D-Printed Classic Beige Desktop Console Box"
    ],
    updated: "2026-02-28"
  },
  {
    id: "p4",
    slug: "arduino-weather-station-with-oled-display",
    title: "Arduino Weather Station with OLED Display",
    author: "TechMakers India",
    difficulty: "Intermediate",
    category: "Arduino Platform",
    subcategory: "IoT & Sensors",
    tags: ["Arduino", "Sensors", "OLED", "Weather"],
    duration: "3 hrs",
    views: 12400,
    likes: 892,
    rating: 4.8,
    img: "https://img.freepik.com/premium-photo/physics-lab-background-with-pendulums-circuits_641503-120945.jpg",
    desc: "Build a fully functional weather station that measures atmospheric pressure, relative humidity, ambient temperature, and heat index. Displays live trends and weather forecasts on a crisp SSD1306 0.96 inch OLED display.",
    featured: true,
    components: [
      "Arduino Uno R3",
      "DHT22 Digital Temperature & Humidity Sensor",
      "BMP280 Barometric Pressure & Altitude Sensor",
      "0.96 inch I2C OLED Display Module",
      "Solderless Breadboard & 20x Jumper Wires",
      "9V Battery with DC Barrel Plug"
    ],
    updated: "2026-02-10"
  },
  {
    id: "p5",
    slug: "raspberry-pi-smart-home-automation-hub",
    title: "Raspberry Pi Smart Home Automation Hub",
    author: "HomeGeeks Lab",
    difficulty: "Advanced",
    category: "Raspberry Pi Platform",
    subcategory: "Smart Home",
    tags: ["Raspberry Pi", "Python", "Automation", "HomeAssistant"],
    duration: "8 hrs",
    views: 28700,
    likes: 1920,
    rating: 4.9,
    img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif",
    desc: "Turn your Raspberry Pi 4 into a self-hosted, cloud-independent smart home controller with voice commands, Zigbee wireless mesh network, and a responsive mobile dashboard for lights, fans, AC, and door locks.",
    featured: true,
    components: [
      "Raspberry Pi 4 Model B (4GB RAM) with Case & Heatsink",
      "ConBee II Zigbee USB Gateway Coordinator",
      "4-Channel 5V Optocoupler Relay Board",
      "PIR Motion Sensors & Sonoff Smart Plugs",
      "Class 10 64GB MicroSD Card with Home Assistant OS"
    ],
    updated: "2026-03-01"
  },
  {
    id: "p6",
    slug: "solar-powered-plant-watering-system",
    title: "Solar-Powered Smart Plant Irrigation System",
    author: "GreenTech Innovators",
    difficulty: "Beginner",
    category: "Environment & Weather",
    subcategory: "Agriculture & Soil",
    tags: ["Solar", "Soil Sensor", "Arduino", "Agriculture"],
    duration: "2 hrs",
    views: 8200,
    likes: 640,
    rating: 4.6,
    img: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    desc: "Automate garden watering using soil moisture sensors and solar energy. The system checks moisture levels every hour and activates a submersible 5V water pump only when soil is dry, conserving water and electricity.",
    featured: false,
    components: [
      "Arduino Nano (ATmega328P)",
      "Capacitive Corrosion-Resistant Soil Moisture Sensor V1.2",
      "5V DC Mini Submersible Water Pump with Silicon Tube",
      "6V 2W Monocrystalline Solar Panel with TP4056 Charging Module",
      "18650 3.7V 2600mAh Li-ion Battery & Step-up Booster"
    ],
    updated: "2026-01-20"
  },
  {
    id: "p7",
    slug: "ml-powered-gesture-recognition-glove",
    title: "ML-Powered Gesture Recognition Glove",
    author: "AIBuilders India",
    difficulty: "Advanced",
    category: "Motor & Motion Control",
    subcategory: "Wearables & AI",
    tags: ["TensorFlow", "BLE", "Python", "Sign Language"],
    duration: "10 hrs",
    views: 31200,
    likes: 2100,
    rating: 4.9,
    img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
    desc: "Create an assistive smart glove that translates Indian Sign Language (ISL) gestures into real-time spoken audio and text on a smartphone using an embedded TinyML model running on an Arduino Nano 33 BLE Sense.",
    featured: true,
    components: [
      "Arduino Nano 33 BLE Sense (Arm Cortex-M4)",
      "5x 2.2 inch Flexible Bend Resistance Sensors",
      "MPU-6050 6-Axis Gyroscope & Accelerometer",
      "Conductive Stretch Fabric & Lycra Glove",
      "3.7V 500mAh LiPo Battery with JST Connector"
    ],
    updated: "2026-03-05"
  },
  {
    id: "p8",
    slug: "3d-printed-robot-arm-with-6-dof",
    title: "3D Printed Robotic Arm with 6-DOF & Inverse Kinematics",
    author: "RoboticsTech Lab",
    difficulty: "Intermediate",
    category: "Motor & Motion Control",
    subcategory: "Robotics & Arms",
    tags: ["3D Print", "Servo", "Arduino", "Robotics"],
    duration: "20 hrs",
    views: 44500,
    likes: 3200,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    desc: "A fully articulated 6 Degrees of Freedom desktop robotic arm with inverse kinematics trajectory planning, wireless joystick teleoperation, and computer vision object sorting using OpenCV.",
    featured: true,
    components: [
      "6x MG996R Metal Gear High-Torque Servos",
      "Arduino Mega 2560 R3",
      "PCA9685 16-Channel 12-bit PWM Servo Driver (I2C)",
      "Complete 3D-Printed Arm Frame (PETG Filament)",
      "Wireless 2.4GHz Joystick Module",
      "5V 10A Heavy-Duty Switched-Mode Power Supply (SMPS)"
    ],
    updated: "2026-02-15"
  },
  {
    id: "p9",
    slug: "ai-attendance-system-with-face-recognition",
    title: "AI Attendance System with Face Recognition",
    author: "SchoolTech Innovations",
    difficulty: "Intermediate",
    category: "Industrial & Factory Automation",
    subcategory: "Computer Vision",
    tags: ["OpenCV", "Face Recognition", "Python", "Raspberry Pi"],
    duration: "6 hrs",
    views: 22100,
    likes: 1680,
    rating: 4.7,
    img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66be608d71d32863b2bf5487_Students-Desk-Classroom-Laptop-reverse.avif",
    desc: "Automate student classroom attendance using deep learning facial embeddings. The system detects multiple faces simultaneously in under 500ms, logs entry timestamps to a Google Sheet, and emails daily summary reports to teachers.",
    featured: false,
    components: [
      "Raspberry Pi 4 (4GB)",
      "Sony IMX219 8MP Camera Module V2 with Wide Angle Lens",
      "3.5 inch Touchscreen LCD Monitor",
      "Active Piezo Buzzer & RGB Status LED",
      "Python 3.10 OpenCV & face_recognition libraries"
    ],
    updated: "2026-02-20"
  },
  {
    id: "p10",
    slug: "autonomous-line-following-robot",
    title: "High-Speed Autonomous PID Line Following Robot",
    author: "BotBuilders India",
    difficulty: "Beginner",
    category: "Motor & Motion Control",
    subcategory: "Autonomous Vehicles",
    tags: ["IR Sensor", "PID", "Arduino", "Robotics"],
    duration: "3 hrs",
    views: 21000,
    likes: 1560,
    rating: 4.7,
    img: "https://img.freepik.com/premium-photo/technology-abstract-circuit-board-texture-background-hightech-futuristic-circuit-board-banner-wallpaper_1029473-136066.jpg",
    desc: "Build a high-speed robotics competition line follower that navigates complex sharp bends, crossovers, and gaps using a calibrated 8-sensor analog IR bar and proportional-integral-derivative (PID) feedback loop.",
    featured: false,
    components: [
      "Arduino Uno / Nano",
      "8-Channel TCRT5000 Infrared Reflectance Sensor Array",
      "TB6612FNG Dual H-Bridge Motor Driver (1.2A)",
      "2x N20 6V 600RPM Micro Metal Gearmotors with Wheels",
      "CNC Acrylic Lightweight Chassis",
      "7.4V 2S 850mAh LiPo Battery"
    ],
    updated: "2026-02-05"
  },
  {
    id: "p11",
    slug: "indoor-air-quality-monitor",
    title: "IoT Indoor Air Quality & AQI Monitor",
    author: "CleanAir Labs",
    difficulty: "Intermediate",
    category: "Environment & Weather",
    subcategory: "Air Quality",
    tags: ["MQ135", "PM2.5", "WiFi", "ESP32", "AQI"],
    duration: "4 hrs",
    views: 13200,
    likes: 980,
    rating: 4.6,
    img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
    desc: "Monitor indoor pollutants including PM2.5, PM10, CO2, and TVOC in real-time. Displays National Air Quality Index (NAQI) color codes on a built-in screen and logs historical data to an interactive web dashboard.",
    featured: false,
    components: [
      "ESP32-WROOM-32 WiFi + Bluetooth Board",
      "Plantower PMS5003 Laser Particulate Matter Sensor",
      "Sensirion SGP30 TVOC and eCO2 Sensor",
      "1.3 inch I2C SH1106 OLED Display",
      "Custom 3D-Printed Wall Mount Enclosure"
    ],
    updated: "2026-03-08"
  },
  {
    id: "p12",
    slug: "eeg-brainwave-visualizer",
    title: "Non-Invasive EEG Brainwave Visualizer & Attention Tracker",
    author: "NeuroHacks India",
    difficulty: "Advanced",
    category: "General / Misc",
    subcategory: "Biomedical & Neuroscience",
    tags: ["EEG", "Brainwave", "Python", "Bio-signals", "OpenBCI"],
    duration: "14 hrs",
    views: 27600,
    likes: 2010,
    rating: 4.8,
    img: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif",
    desc: "Capture raw electrical brain potentials using an open hardware EEG headset. Applies digital Fast Fourier Transforms (FFT) in Python to isolate Alpha (8-12Hz) and Beta (13-30Hz) waves and track real-time student focus and meditation states.",
    featured: true,
    components: [
      "OpenBCI Cyton 8-Channel Biosensing Board (32-bit)",
      "Gold-Plated Dry EEG Snap Electrodes & Headband",
      "Bluetooth USB Dongle with FTDI Driver",
      "Python 3.10 NumPy, SciPy & BrainFlow libraries",
      "Rechargeable 3.7V LiPo Battery"
    ],
    updated: "2026-03-12"
  },
  {
    id: "p13",
    slug: "industrial-conveyor-sorting-system",
    title: "Industrial Automated Conveyor Color Sorting System",
    author: "Automation India",
    difficulty: "Intermediate",
    category: "Industrial & Factory Automation",
    subcategory: "Factory Automation",
    tags: ["TCS3200", "Conveyor", "Arduino", "Automation"],
    duration: "6 hrs",
    views: 11200,
    likes: 840,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    desc: "Build a miniature automated factory conveyor belt that identifies item colors using a TCS3200 color sensor and sorts defective or mismatched parts into separate bins using servo diverter arms.",
    featured: false,
    components: [
      "Arduino Uno",
      "TCS3200 RGB Color Sensor Module",
      "12V DC Geared Conveyor Motor",
      "2x TowerPro SG90 Servo Diverters",
      "Laser Cut Acrylic Conveyor Frame & Rubber Belt"
    ],
    updated: "2026-02-18"
  },
  {
    id: "p14",
    slug: "stepper-motor-cnc-foam-cutter",
    title: "2-Axis CNC Hot Wire Foam & Wing Cutter",
    author: "Aeromodelling Club",
    difficulty: "Advanced",
    category: "Motor & Motion Control",
    subcategory: "CNC & Fabrication",
    tags: ["CNC", "NEMA17", "GRBL", "Aerodynamics"],
    duration: "15 hrs",
    views: 17300,
    likes: 1290,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&auto=format&fit=crop",
    desc: "Precision computer-controlled CNC hot wire cutting machine for RC model aircraft wings, aerodynamic airfoils, and architectural foam prototypes using GRBL and NEMA 17 stepper motors.",
    featured: false,
    components: [
      "2x NEMA 17 Stepper Motors with Lead Screws",
      "Arduino Uno with CNC Shield V3 & A4988 Drivers",
      "Nichrome 80 Hot Wire (0.3mm)",
      "24V 10A DC Power Supply & PWM Wire Heat Controller",
      "V-Slot Aluminum Extrusions (2020)"
    ],
    updated: "2026-01-28"
  },
  {
    id: "p15",
    slug: "smart-rfid-school-bus-tracking-system",
    title: "Smart RFID & GPS Student Bus Attendance & Safety System",
    author: "SafetyTech Labs",
    difficulty: "Intermediate",
    category: "General / Misc",
    subcategory: "Smart Tracking & Safety",
    tags: ["RFID", "GPS", "GSM", "SIM800L", "Safety"],
    duration: "5 hrs",
    views: 19800,
    likes: 1510,
    rating: 4.9,
    img: "https://img.freepik.com/premium-photo/technology-abstract-circuit-board-texture-background-hightech-futuristic-circuit-board-banner-wallpaper_1029473-136066.jpg",
    desc: "A vehicle safety tracker that scans student RFID identity cards on boarding/deboarding, retrieves live GPS coordinates from NEO-6M, and sends automated SMS alerts with Google Maps live location links to parents via GSM SIM800L.",
    featured: true,
    components: [
      "ESP32 NodeMCU Development Board",
      "RC522 13.56MHz RFID Reader & Student Smart Cards",
      "u-blox NEO-6M GPS Receiver Module with Ceramic Antenna",
      "SIM800L GPRS/GSM Quad-Band Cellular Module",
      "LM2596 DC-DC Buck Converter & 12V Car Adapter"
    ],
    updated: "2026-03-02"
  }
];

export function getProjectBySlugOrId(identifier: string): ProjectItem | undefined {
  const clean = identifier.toLowerCase().trim();
  return ALL_PROJECTS.find(
    (p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean || slugify(p.title) === clean
  );
}
