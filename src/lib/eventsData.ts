export const events = [
  {
    id: "stem-science-fair-2026",
    title: "STEM Science Fair 2026",
    date: "April 15, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Bhubaneswar Convention Center",
    type: "Science Fair",
    seats: "500+ seats",
    desc: "Annual STEM fair featuring student projects, live experiments, and guest lectures from leading scientists.",
    fullDesc: `The STEM Science Fair 2026 is CSEEL's flagship annual event that brings together the brightest young minds from across Odisha and India. This full-day event showcases hundreds of student projects spanning robotics, chemistry, environmental science, and more.

Highlights include:
• 200+ student science project exhibitions
• Live experiment demonstrations by CSEEL educators
• Guest lectures from renowned scientists and researchers
• Awards in 10 categories across age groups (Class 6–12)
• Networking sessions for students, teachers, and institutions

This is a must-attend event for anyone passionate about science education in India.`,
    agenda: [
      { time: "9:00 AM", activity: "Registration & Welcome" },
      { time: "10:00 AM", activity: "Inauguration Ceremony" },
      { time: "11:00 AM", activity: "Project Exhibitions Open" },
      { time: "1:00 PM", activity: "Lunch Break" },
      { time: "2:00 PM", activity: "Guest Lectures" },
      { time: "4:00 PM", activity: "Awards Ceremony" },
      { time: "5:00 PM", activity: "Closing" },
    ],
  },
  {
    id: "teacher-development-summit",
    title: "Teacher Development Summit",
    date: "April 28, 2026",
    time: "10:00 AM – 4:00 PM",
    location: "CSEEL Campus, Bhubaneswar",
    type: "Workshop",
    seats: "100 seats",
    desc: "Full-day professional development event for science educators focusing on NEP 2020 implementation.",
    fullDesc: `The Teacher Development Summit is a hands-on professional development workshop designed exclusively for science educators. Focused on NEP 2020 implementation, this event equips teachers with modern pedagogical tools and strategies.

What you'll gain:
• In-depth NEP 2020 curriculum alignment strategies
• Hands-on training with CSEEL's virtual lab platform
• Peer learning sessions with 100+ educators
• Certificate of participation from CSEEL
• Resource kit with ready-to-use lesson plans

Seats are limited to 100 participants to ensure an interactive, quality experience.`,
    agenda: [
      { time: "10:00 AM", activity: "Welcome & Introduction" },
      { time: "10:30 AM", activity: "NEP 2020 Deep Dive Session" },
      { time: "12:00 PM", activity: "Virtual Lab Hands-on Training" },
      { time: "1:00 PM", activity: "Lunch" },
      { time: "2:00 PM", activity: "Peer Learning Circles" },
      { time: "3:00 PM", activity: "Resource Sharing & Q&A" },
      { time: "4:00 PM", activity: "Certificate Distribution" },
    ],
  },
  {
    id: "national-science-olympiad",
    title: "National Science Olympiad",
    date: "May 10, 2026",
    time: "8:00 AM – 6:00 PM",
    location: "Online + Offline",
    type: "Competition",
    seats: "Open",
    desc: "Inter-school science competition covering Physics, Chemistry, Biology, and Mathematics.",
    fullDesc: `The National Science Olympiad by CSEEL is a prestigious inter-school competition that challenges students in Physics, Chemistry, Biology, and Mathematics. Open to all students from Class 6 to Class 12, this hybrid event allows participation both online and at designated exam centres.

Competition details:
• 4 subjects: Physics, Chemistry, Biology, Mathematics
• 3 rounds: Preliminary (online), Semi-Final, Grand Final
• Cash prizes and scholarships for top performers
• Participation certificates for all students
• School-level trophies for top performing institutions

Register your school today — no seat limit!`,
    agenda: [
      { time: "8:00 AM", activity: "Online Portal Opens" },
      { time: "9:00 AM", activity: "Preliminary Round Begins" },
      { time: "12:00 PM", activity: "Lunch Break" },
      { time: "1:00 PM", activity: "Semi-Final Round" },
      { time: "3:30 PM", activity: "Grand Final" },
      { time: "5:00 PM", activity: "Results & Prize Distribution" },
      { time: "6:00 PM", activity: "Closing Ceremony" },
    ],
  },
  {
    id: "cseel-open-lab-day",
    title: "CSEEL Open Lab Day",
    date: "May 25, 2026",
    time: "10:00 AM – 2:00 PM",
    location: "CSEEL Labs, Bhubaneswar",
    type: "Open Day",
    seats: "200 seats",
    desc: "Explore our state-of-the-art labs, meet our educators, and experience hands-on experiments first-hand.",
    fullDesc: `CSEEL Open Lab Day is your chance to step inside our world-class science labs and experience the future of science education. Whether you're a student, parent, or school administrator, this event is designed to showcase what CSEEL has to offer.

Experience includes:
• Guided tours of our Physics, Chemistry, and Biology labs
• Live demonstrations of virtual and physical experiments
• One-on-one interactions with CSEEL educators
• Introduction to CSEEL's online learning platform
• Special discount offers for institutions registering on the day

A perfect opportunity for schools considering CSEEL partnerships.`,
    agenda: [
      { time: "10:00 AM", activity: "Welcome & Campus Overview" },
      { time: "10:30 AM", activity: "Lab Tours Begin (Batch-wise)" },
      { time: "11:30 AM", activity: "Live Experiment Demonstrations" },
      { time: "12:30 PM", activity: "Refreshments" },
      { time: "1:00 PM", activity: "Meet the Educators Session" },
      { time: "1:30 PM", activity: "Q&A & Institution Enquiries" },
      { time: "2:00 PM", activity: "Closing" },
    ],
  },
];

export const typeColors: Record<string, string> = {
  "Science Fair": "bg-blue-100 text-blue-700",
  "Workshop": "bg-green-100 text-green-700",
  "Competition": "bg-red-100 text-red-700",
  "Open Day": "bg-purple-100 text-purple-700",
};

export const ALL_EVENTS = events;

export function getEventBySlugOrId(idOrSlug: string) {
  const clean = idOrSlug.toLowerCase().trim();
  return events.find((e) => e.id.toLowerCase() === clean);
}
