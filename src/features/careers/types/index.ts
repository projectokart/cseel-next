/**
 * Careers & HR Service Types
 */

export type JobEmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote / Hybrid' | 'Fellowship';
export type JobStatus = 'active' | 'closed' | 'draft' | 'archived';

export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: JobEmploymentType;
  experience: string;
  salary: string;
  skills: string[];
  descriptionHtml: string;
  deadline: string;
  applicantsCount: number;
  status: JobStatus;
  postedDate: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  experienceYears: number;
  currentOrganization?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  status: 'applied' | 'reviewing' | 'interview_scheduled' | 'shortlisted' | 'rejected' | 'offered';
  appliedDate: string;
}

export interface JobFilterState {
  searchQuery: string;
  selectedDepartments: string[];
  selectedTypes: JobEmploymentType[];
  status: 'all' | 'active' | 'closed';
  sortBy: 'newest' | 'applicants' | 'deadline' | 'title';
}
