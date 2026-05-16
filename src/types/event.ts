export interface MicoEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  locationType: "detroit-metro" | "ann-arbor" | "grand-rapids" | "upper-peninsula" | "virtual";
  eventType: "hackathon" | "networking" | "workshop" | "panel";
  eventDate: string;
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
