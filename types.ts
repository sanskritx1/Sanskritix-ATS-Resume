export interface Education {
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  achievements: string[];
}

export interface Project {
  title: string;
  description: string;
}

export interface ResumeData {
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  ats_keywords: string[];
  ats_score: string;
  improvement_suggestions: string[];
  additional_information?: string[];
}

export interface FormData {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    education: string;
    experience: string;
    skills: string;
    objective: string;
    projects: string;
    otherDetails: string;
}