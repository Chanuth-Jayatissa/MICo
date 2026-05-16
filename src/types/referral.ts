export type ReferralStatus =
  | "analyzing"
  | "drafting"
  | "pending_approval"
  | "approved"
  | "declined"
  | "referred_to_hr";

export interface Referral {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterTitle?: string;
  requesterSkills: string[];
  insiderId: string;
  insiderName: string;
  insiderTitle?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ReferralStatus;
  matchScore: number;
  aiPitch: string;
  createdAt: string;
  updatedAt: string;
}
