import { UserProfile } from "@/types/user";

/**
 * Default blank profile for new users.
 * Gets hydrated with auth data (name/email/avatar from Google) on login,
 * then further enriched when the user uploads their resume.
 */
export const defaultUserProfile: UserProfile = {
  id: "usr-current",
  email: "",
  fullName: "",
  avatarUrl: undefined,
  title: undefined,
  skills: [],
  industryAlignment: [],
  openToRelocate: true,
  openToHybrid: true,
  availableForReferrals: false,
  resumeUrl: undefined,
  resumeParsed: false,
  createdAt: new Date().toISOString(),
};
