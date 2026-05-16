import { UserProfile } from "@/types/user";

export const mockUserProfile: UserProfile = {
  id: "usr-current",
  email: "demo@mico.community",
  fullName: "Chanuth Jayatissa",
  avatarUrl: undefined,
  title: "Software Engineer",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Node.js",
    "SQL",
    "Tailwind CSS",
    "Git",
    "REST APIs",
    "Agile",
    "Machine Learning",
    "Data Analysis",
  ],
  industryAlignment: [
    {
      skills: "React + Next.js + TypeScript",
      industry: "Connected Mobility / Auto-Tech",
      confidence: "high",
    },
    {
      skills: "Python + Machine Learning",
      industry: "Autonomous Systems / AI Research",
      confidence: "high",
    },
    {
      skills: "Data Analysis + SQL",
      industry: "FinTech / Digital Banking",
      confidence: "medium",
    },
    {
      skills: "Node.js + REST APIs",
      industry: "E-Commerce / Marketplace Tech",
      confidence: "medium",
    },
  ],
  openToRelocate: true,
  openToHybrid: true,
  availableForReferrals: true,
  resumeUrl: undefined,
  resumeParsed: true,
  createdAt: "2026-05-01T00:00:00Z",
};
