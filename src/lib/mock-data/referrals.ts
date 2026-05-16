import { Referral } from "@/types/referral";

export const mockReferrals: Referral[] = [
  {
    id: "ref-001",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["React", "Next.js", "TypeScript", "Python"],
    insiderId: "usr-insider-003",
    insiderName: "Alex K.",
    insiderTitle: "Senior Engineer at StockX",
    jobId: "job-003",
    jobTitle: "Frontend Developer",
    company: "StockX",
    status: "drafting",
    matchScore: 87,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the Frontend Developer role. Their background in React, Next.js, and TypeScript demonstrates the exact problem-solving skills we need for our marketplace redesign. Their recent hackathon projects show a rapid prototyping ability that would be immediately valuable to the team.",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T08:30:00Z",
  },
  {
    id: "ref-002",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["Python", "SQL", "Data Analysis", "ML"],
    insiderId: "usr-insider-002",
    insiderName: "Marcus T.",
    insiderTitle: "Staff Data Engineer at Rocket Companies",
    jobId: "job-002",
    jobTitle: "Data Engineer",
    company: "Rocket Companies",
    status: "pending_approval",
    matchScore: 92,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the Data Engineer position. Their strong SQL and Python skills, combined with hands-on data analysis experience, make them an excellent fit for our pipeline engineering team. Their enthusiasm for data-driven products aligns perfectly with Rocket's mission to simplify homeownership.",
    createdAt: "2026-05-14T14:00:00Z",
    updatedAt: "2026-05-15T16:00:00Z",
  },
  {
    id: "ref-003",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["Python", "Machine Learning", "Cloud", "APIs"],
    insiderId: "usr-insider-001",
    insiderName: "Sarah J.",
    insiderTitle: "Senior AI Engineer at Ford",
    jobId: "job-001",
    jobTitle: "AI Engineer",
    company: "Ford Motor Company",
    status: "approved",
    matchScore: 98,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the AI Engineer role. Their Python experience and machine learning background perfectly align with our connected mobility initiatives in Dearborn. Their hackathon portfolio demonstrates exactly the kind of innovative thinking we need on the autonomous systems team.",
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-05-13T11:00:00Z",
  },
  {
    id: "ref-004",
    requesterId: "usr-applicant-001",
    requesterName: "Jordan P.",
    requesterTitle: "Junior Developer",
    requesterSkills: ["JavaScript", "React", "Node.js", "MongoDB"],
    insiderId: "usr-current",
    insiderName: "You",
    insiderTitle: "Software Engineer",
    jobId: "job-003",
    jobTitle: "Frontend Developer",
    company: "StockX",
    status: "pending_approval",
    matchScore: 78,
    aiPitch:
      "Hi Recruiting, I'd like to refer Jordan P. for the Frontend Developer role. Their JavaScript and React experience, combined with a growing Node.js backend skillset, makes them a strong junior candidate for the marketplace team. Their portfolio shows clean, responsive UI work that aligns with StockX's design standards.",
    createdAt: "2026-05-16T07:00:00Z",
    updatedAt: "2026-05-16T07:30:00Z",
  },
  {
    id: "ref-005",
    requesterId: "usr-applicant-002",
    requesterName: "Aisha R.",
    requesterTitle: "Data Analyst",
    requesterSkills: ["Python", "R", "Tableau", "SQL", "Statistics"],
    insiderId: "usr-current",
    insiderName: "You",
    insiderTitle: "Software Engineer",
    jobId: "job-002",
    jobTitle: "Data Engineer",
    company: "Rocket Companies",
    status: "analyzing",
    matchScore: 74,
    aiPitch: "",
    createdAt: "2026-05-16T08:00:00Z",
    updatedAt: "2026-05-16T08:00:00Z",
  },
];

// Helper: Get referrals where current user is the requester (My Requests / Outbox)
export const myRequests = mockReferrals.filter(
  (r) => r.requesterId === "usr-current"
);

// Helper: Get referrals where current user is the insider (Insider Inbox)
export const incomingRequests = mockReferrals.filter(
  (r) => r.insiderId === "usr-current"
);
