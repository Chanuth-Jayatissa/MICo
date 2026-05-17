export type ContactPlatform = "email" | "linkedin" | "github" | "phone";

export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  platform: ContactPlatform;
  relationshipContext: string;
  avatarUrl?: string;
}
