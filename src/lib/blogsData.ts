import { slugify } from "@/lib/utils";

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: "Pedagogy" | "STEM Innovation" | "Student Projects" | "EdTech & AI" | "Lab Safety";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export const ALL_BLOGS: BlogPostItem[] = [
  {
    id: "blog-1",
    slug: "implementing-nep-2020-experiential-learning-in-school-labs",
    title: "How to Implement NEP 2020 Experiential Learning in School Science Labs",
    summary: "A practical guide for school principals and science educators on transitioning from rote textbook memorization to inquiry-based, hands-on scientific experimentation.",
    content: `The National Education Policy (NEP) 2020 places paramount emphasis on experiential learning, critical thinking, and inquiry-based pedagogy. For science education, this represents a fundamental shift from cookbook-style laboratory exercises to student-led scientific investigation.

### Key Pillars of Experiential Science Learning:
1. **Hypothesis-Driven Inquiry**: Rather than giving students pre-determined outcomes, ask open questions such as "How does temperature affect enzyme activity in yeast?"
2. **Hybrid Virtual-Physical Workflows**: Students perform hands-on experiments & live labs to master concepts and safety protocols before conducting wet-lab experiments.
3. **Cross-Disciplinary Integration**: Merging chemistry, IoT sensor logging, and statistical data visualization.
4. **Formative Competency Assessment**: Assessing understanding through experimental design, error analysis, and viva discussions rather than standardized pen-paper tests.

By adopting integrated STEM lab kits and hands-on experiments & live labs, schools across India are achieving up to 300% improvement in student retention and national science olympiad performance.`,
    category: "Pedagogy",
    author: {
      name: "Dr. Arvind Sharma",
      role: "Director of Curriculum & Pedagogy, CSEEL",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    },
    publishedAt: "2026-03-01",
    readTime: "6 min read",
    coverImage: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif",
    tags: ["NEP2020", "Science Education", "Pedagogy", "Experiential Learning"]
  },
  {
    id: "blog-2",
    slug: "building-iot-weather-stations-for-school-science-fairs",
    title: "Step-by-Step: Building an IoT Weather Station for Science Fairs",
    summary: "Discover how Class 9-12 students can build a complete solar-powered microclimate station with cloud data logging for regional science exhibitions.",
    content: `Environmental monitoring is one of the highest-scoring and most socially impactful themes in national science fairs like IRIS and CBSE Science Exhibition.

### System Architecture:
- **Microcontroller**: ESP8266 or ESP32 NodeMCU
- **Sensors**: DHT22 (Temp/Humidity), BMP280 (Pressure), MQ-135 (Air Quality), Rain Sensor
- **Power**: 6V 2W Solar Panel with TP4056 charge management module and 18650 Li-ion battery
- **Cloud Dashboard**: Real-time telemetry via MQTT to ThingSpeak or Grafana

Students not only learn electronics soldering and firmware programming in C++, but also gain hands-on experience in meteorological data analysis and climate trends in their local school campus.`,
    category: "Student Projects",
    author: {
      name: "Rohan Sen",
      role: "Hardware & IoT Mentor, CSEEL",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
    },
    publishedAt: "2026-02-18",
    readTime: "8 min read",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=600&fit=crop",
    tags: ["IoT", "Science Fair", "Arduino", "Weather Station"]
  },
  {
    id: "blog-3",
    slug: "essential-laboratory-safety-protocols-for-secondary-schools",
    title: "10 Essential Laboratory Safety Protocols Every School Must Follow",
    summary: "Comprehensive checklist covering chemical storage, eye protection, hazardous waste disposal, and emergency first-aid protocols in high school laboratories.",
    content: `Laboratory safety is the cornerstone of effective science learning. Ensuring a secure environment prevents accidents and builds confidence among students and educators alike.

### Top Safety Mandates:
1. **Personal Protective Equipment (PPE)**: Polycarbonate splash goggles and nitrile gloves must be worn whenever handling acids, bases, or heating glassware.
2. **Proper Chemical Segregation**: Store strong oxidizing agents away from organic solvents and flammable liquids in dedicated ventilated cabinets.
3. **Emergency Eyewash & Safety Shower**: Regular monthly inspection and clear unhindered access.
4. **Fume Extraction**: Conduct distillation, organic extractions, and chlorine generation only inside certified fume hoods.
5. **Clear Material Safety Data Sheets (MSDS)**: Keep physical laminated safety sheets accessible beside every chemical storage rack.`,
    category: "Lab Safety",
    author: {
      name: "Dr. Shalini Panda",
      role: "Chief Safety Officer & Senior Scientist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop"
    },
    publishedAt: "2026-01-25",
    readTime: "5 min read",
    coverImage: "https://png.pngtree.com/thumb_back/fw800/background/20241007/pngtree-biology-laboratory-nature-and-science-plants-with-biochemistry-structure-on-green-image_16319180.jpg",
    tags: ["Lab Safety", "Chemistry", "School Guidelines", "First Aid"]
  }
];

export function getBlogBySlug(slug: string): BlogPostItem | undefined {
  const clean = slug.toLowerCase().trim();
  return ALL_BLOGS.find((b) => b.slug.toLowerCase() === clean || slugify(b.title) === clean);
}
