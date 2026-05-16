export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  title?: string;
  skills: string[];
  industryAlignment: IndustryAlignment[];
  openToRelocate: boolean;
  openToHybrid: boolean;
  availableForReferrals: boolean;
  resumeUrl?: string;
  resumeParsed: boolean;
  createdAt: string;
}

export interface IndustryAlignment {
  skills: string;
  industry: string;
  confidence: "high" | "medium" | "low";
}
