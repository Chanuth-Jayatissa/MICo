import { Referral } from "@/types/referral";

export const mockReferrals: Referral[] = [
  {
    id: "ref-001",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["React", "Next.js", "TypeScript", "Python"],
    insiderId: "usr-insider-004",
    insiderName: "Alex K.",
    insiderTitle: "Senior Software Engineer at Rivian",
    jobId: "job-006",
    jobTitle: "Software Engineer — Enterprise Systems",
    company: "Rivian",
    status: "drafting",
    matchScore: 92,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the Enterprise Systems Software Engineer role. Their background in React, TypeScript, and Node.js demonstrates the exact full-stack skills your team needs for the enterprise platform. Their recent projects show a rapid prototyping ability that would be immediately valuable at Rivian.",
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-05-16T08:30:00Z",
  },
  {
    id: "ref-002",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["Python", "SQL", "Data Analysis", "ML"],
    insiderId: "usr-insider-001",
    insiderName: "David L.",
    insiderTitle: "Staff Cybersecurity Engineer at DTE Energy",
    jobId: "job-001",
    jobTitle: "Cybersecurity Engineer",
    company: "DTE Energy",
    status: "pending_approval",
    matchScore: 75,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the Cybersecurity Engineer position. Their strong Python scripting skills, combined with cloud familiarity, make them a promising fit for your security automation team. Their analytical approach to problem-solving aligns well with DTE's infrastructure protection mission.",
    createdAt: "2026-05-14T14:00:00Z",
    updatedAt: "2026-05-15T16:00:00Z",
  },
  {
    id: "ref-003",
    requesterId: "usr-current",
    requesterName: "You",
    requesterTitle: "Software Engineer",
    requesterSkills: ["Python", "Machine Learning", "Cloud", "APIs"],
    insiderId: "usr-insider-003",
    insiderName: "Priya M.",
    insiderTitle: "Senior Sales Engineer at IBM",
    jobId: "job-003",
    jobTitle: "Data & AI Sales Engineer",
    company: "IBM",
    status: "approved",
    matchScore: 85,
    aiPitch:
      "Hi Recruiting, I'd like to refer this candidate for the Data & AI Sales Engineer role at the Detroit office. Their Python and machine learning background align perfectly with watsonx technical demonstrations. Their communication skills and project portfolio show the client-facing aptitude your team values.",
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
    jobId: "job-006",
    jobTitle: "Software Engineer — Enterprise Systems",
    company: "Rivian",
    status: "pending_approval",
    matchScore: 78,
    aiPitch:
      "Hi Recruiting, I'd like to refer Jordan P. for the Enterprise Systems Software Engineer role. Their JavaScript and React experience, combined with a growing Node.js backend skillset, makes them a strong junior candidate for the enterprise platform team. Their portfolio shows clean, scalable architecture work.",
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
    jobTitle: "Software Engineer — Cloud & Data",
    company: "DTE Energy",
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
