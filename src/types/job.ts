export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationFilter: "detroit-metro" | "ann-arbor" | "grand-rapids" | "remote-mi";
  salaryRange?: string;
  description: string;
  requirements: string[];
  matchScore: number;
  matchReasons: string[];
  skillGaps: string[];
  referralAvailable: boolean;
  referralContactName?: string;
  referralContactId?: string;
  sourceUrl?: string;
  postedAt: string;
  createdAt: string;
}
