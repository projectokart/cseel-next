export interface AdvertisementBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  discountCode?: string;
  discountPercent?: number;
  validUntil: string;
  category: "lab-kits" | "institutional" | "events" | "workshops" | "general";
}

export const ALL_ADVERTISEMENTS: AdvertisementBanner[] = [
  {
    id: "ad-school-lab-upgrade-2026",
    title: "NEP 2020 School Science Lab Modernization Grant",
    subtitle: "Get up to 40% institutional discount on complete Composite STEM Labs for CBSE & ICSE schools across India.",
    tag: "Institutional Special",
    badgeColor: "bg-blue-600 text-white",
    imageUrl: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif",
    ctaText: "Request School Quotation",
    ctaLink: "/for-institutions",
    discountCode: "SCHOOL40",
    discountPercent: 40,
    validUntil: "2026-06-30",
    category: "institutional"
  },
  {
    id: "ad-stem-robotics-starter-kit-deal",
    title: "Flash Sale: Arduino Autonomous Robotics Kit",
    subtitle: "Flat ₹1,500 OFF on complete 4WD obstacle-avoiding smart car kit with ultrasonic radar + free sensor pack.",
    tag: "Limited Time Offer",
    badgeColor: "bg-amber-500 text-black",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop",
    ctaText: "Claim ₹1,500 Off",
    ctaLink: "/materials/robotics-starter-kit",
    discountCode: "ROBOT1500",
    discountPercent: 25,
    validUntil: "2026-04-15",
    category: "lab-kits"
  },
  {
    id: "ad-national-science-fair-pass",
    title: "National STEM Science Fair 2026 Registrations Open",
    subtitle: "Showcase your science model, win ₹5,00,000 in student innovation grants and get mentored by IIT professors.",
    tag: "Grand Competition",
    badgeColor: "bg-emerald-600 text-white",
    imageUrl: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66be608d71d32863b2bf5487_Students-Desk-Classroom-Laptop-reverse.avif",
    ctaText: "Register Your Project",
    ctaLink: "/events/stem-science-fair-2026",
    validUntil: "2026-04-10",
    category: "events"
  },
  {
    id: "ad-free-virtual-lab-trial",
    title: "Free 30-Day Virtual Lab Access for All Science Teachers",
    subtitle: "Assign 150+ interactive physics, chemistry, and biology simulations directly to student batches with instant automated grading.",
    tag: "Teacher Perk",
    badgeColor: "bg-purple-600 text-white",
    imageUrl: "https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf9f93d712be6d135ac575_Student-Remote-Room-Labster-reverse-edit.avif",
    ctaText: "Start Free Educator Pass",
    ctaLink: "/for-educators",
    discountCode: "TEACHERFREE",
    validUntil: "2026-12-31",
    category: "workshops"
  }
];

export const TOP_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    text: "🎉 Free India-wide delivery on all Science Lab Kits above ₹999! Use code: FREESHIP",
    link: "/materials"
  },
  {
    id: "ann-2",
    text: "🏆 National STEM Science Fair 2026 registrations close in 14 days — Submit your student project!",
    link: "/events/upcoming"
  },
  {
    id: "ann-3",
    text: "🔬 New WebGL 3D Chemistry Titration & Optics Ray Tracer simulations are now live in the Virtual Lab.",
    link: "/simulations"
  }
];
