export interface SeminarItem {
  id: string;
  title: string;
  topic: string;
  category: "Space Sciences" | "Quantum Physics" | "Green Chemistry" | "Genomics & Bio-Tech" | "Robotics & AI" | "NEP-2020 Pedagogy";
  mode: "In-Person Physical Meet" | "Hybrid (Physical + Online)" | "Live Virtual Webinar";
  date: string;
  time: string;
  duration: string;
  venueDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
    googleMapsUrl: string;
    hallName: string;
    seatingCapacity: number;
  };
  speaker: {
    name: string;
    designation: string;
    institution: string;
    avatar: string;
  };
  bannerImage: string;
  summary: string;
  agenda: { time: string; session: string }[];
  keyTakeaways: string[];
  registeredAttendees: number;
  totalSeats: number;
  enrolledSchoolsCount: number;
  schoolInvitationDetails: {
    invitationCode: string;
    targetGrades: string;
    perksForSchools: string[];
    maxStudentsPerSchool: number;
    maxTeachersPerSchool: number;
    exhibitionBoothsAvailable: boolean;
    hospitalityProvided: string;
  };
  featured: boolean;
  status: "Upcoming" | "Live Now" | "Completed / Recorded";
  recordingLink?: string;
}

export const ALL_SEMINARS: SeminarItem[] = [];
