export interface MicoEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  locationType: "detroit-metro" | "ann-arbor" | "grand-rapids" | "upper-peninsula" | "virtual";
  eventType: "networking" | "workshop" | "conference" | "career-fair" | "training" | "community" | "other";
  eventDate: string;
  industry?: string; // "Healthcare", "Manufacturing", "Technology", etc.
  aiSummary: {
    whyAttend: string;
    whosThere: string;
    vibe: string;
  };
  source: "ibm_rpa" | "user_submitted" | "api";
  matchScore?: number;
  rsvpCount?: number;
  createdAt: string;
}
