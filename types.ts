

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  phoneNumber?: string;
  profileViews?: number;
  onlineStatus: 'online' | 'offline';
  role: 'candidate' | 'hrd'; // Added user role
  avatarUrl?: string; // Added avatar url
}

export interface WorkExperience {
  id:string;
  jobTitle: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface RecruitmentStage {
  name: 'Screening' | 'Psikotest' | 'Interview HR' | 'Interview User' | 'Penawaran';
  status: 'Lolos' | 'Tidak Lolos' | 'Pending' | 'Dalam Proses' | 'Belum';
}

export interface ApplicationHistory {
    id: string;
    position: string;
    company?: string;
    applied_date: string;
    status: 'Diterima' | 'Ditolak' | 'Interview' | 'Dalam Proses' | 'Pending';
    stages: RecruitmentStage[];
}

// Candidate type extends Profile
export interface Candidate extends Profile {
    id: string;
    positionApplied: string;
    documents: Document[];
    activity: Activity[];
    applicationHistory: ApplicationHistory[];
}

export interface Document {
    id: string;
    type: 'resume' | 'certificate';
    name: string;
    url: string;
    uploadedAt: string;
    fileSize?: number; // in bytes
}

export interface Activity {
    time: string;
    event: string;
}


export interface Profile {
  user: User;
  salaryExpectation: {
    min: number;
    max: number;
  };
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  applicationHistory?: ApplicationHistory[];
  resumeUrl?: string;
  documents?: Document[];
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    jobLevel: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director';
    employmentType: 'Full Time' | 'Part Time' | 'Freelance' | 'Contractual' | 'Internship';
    jobFunction: string;
    education: string;
    salary: {
        min: number;
        max: number;
    };
    postedDate: string;
    logoUrl: string;
    // HRD specific properties
    applicants?: number; 
    status?: 'Aktif' | 'Ditutup' | 'Draft' | 'Published' | 'Closed';
}

export interface JobRequirements {
    education: string;
    experience_years: number;
    certifications: string[];
    skills: string[];
}

export interface JobPosition extends Job {
    requiredSkills: Skill[]; // Kept for backward compatibility with Matching Engine
    jobDescription: string;
    
    // New Fields for Job Creation Feature
    department?: string;
    requirements?: JobRequirements;
    closingDate?: string;
    openPositions?: number;
}

export interface FilterOptions {
    jobLevel: string[];
    employmentType: string[];
    jobFunction: string[];
    education: string[];
    company: string[];
}

export interface SelectedFilters {
    jobLevel: string[];
    employmentType: string[];
    jobFunction: string[];
    education: string[];
    company: string[];
}

// HRD Dashboard Types
export interface MatchResult {
    candidate: Candidate;
    fitScore: number;
    summary: string;
    matchingAspects: {
        meets: string[];
        lacks: string[];
    };
    aiReason: string;
}

export interface GapAnalysisReport {
    candidate: Candidate;
    gapScore: number;
    missingCompetencies: string[];
    trainingRecommendations: string[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    status: 'read' | 'unread';
    target_page: string;
    category: string;
    target_params?: { [key: string]: any };
    type?: 'info' | 'success' | 'warning';
    target_type?: "document" | "application_history" | "profile_info";
    target_candidate_id?: string;
}