"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { mockJobs, mockEvents, mockReferrals, defaultUserProfile } from "@/lib/mock-data";
import { recalculateAllJobMatches, recalculateAllEventMatches } from "@/lib/matching/engine";
import type { UserProfile } from "@/types/user";
import type { MicoEvent } from "@/types/event";
import type { Job } from "@/types/job";
import type { Referral, ReferralStatus } from "@/types/referral";

// ─── Toast Types ───
export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

// ─── State Shape ───
export interface MicoState {
  userProfile: UserProfile;
  events: MicoEvent[];
  jobs: Job[];
  referrals: Referral[];
  rsvps: string[];
  bookmarkedJobs: string[];
  resumeFile: { name: string; parsedAt: string } | null;
  toasts: Toast[];
  initialized: boolean;
}

// ─── Actions ───
type Action =
  | { type: "INIT_FROM_STORAGE"; payload: Partial<MicoState> }
  | { type: "SEED_AUTH_USER"; payload: { id: string; email: string; fullName: string; avatarUrl?: string } }
  | { type: "TOGGLE_RSVP"; payload: string }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "REQUEST_REFERRAL"; payload: Referral }
  | { type: "UPDATE_REFERRAL_STATUS"; payload: { id: string; status: ReferralStatus; aiPitch?: string } }
  | { type: "APPROVE_REFERRAL"; payload: string }
  | { type: "DECLINE_REFERRAL"; payload: string }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "ADD_SKILL"; payload: string }
  | { type: "REMOVE_SKILL"; payload: string }
  | { type: "SET_SKILLS_AND_ALIGNMENT"; payload: { skills: string[]; title: string; industryAlignment: UserProfile["industryAlignment"]; fullName?: string } }
  | { type: "UPLOAD_RESUME"; payload: { name: string } }
  | { type: "ADD_HOSTED_EVENT"; payload: MicoEvent }
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "DISMISS_TOAST"; payload: string };

// ─── Initial State ───
const initialState: MicoState = {
  userProfile: defaultUserProfile,
  events: mockEvents,
  jobs: mockJobs,
  referrals: mockReferrals,
  rsvps: [],
  bookmarkedJobs: [],
  resumeFile: null,
  toasts: [],
  initialized: false,
};

// ─── Reducer ───
function micoReducer(state: MicoState, action: Action): MicoState {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      const merged = { ...state, ...action.payload, initialized: true };
      // Recalculate matches based on the restored user profile
      if (merged.userProfile.skills.length > 0) {
        merged.jobs = recalculateAllJobMatches(merged.jobs, merged.userProfile);
        merged.events = recalculateAllEventMatches(merged.events, merged.userProfile);
      }
      return merged;
    }

    case "SEED_AUTH_USER": {
      // Always apply auth data — the auth session is the source of truth for identity
      const profile = state.userProfile;
      return {
        ...state,
        userProfile: {
          ...profile,
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName || profile.fullName,
          avatarUrl: action.payload.avatarUrl || profile.avatarUrl,
        },
      };
    }

    case "TOGGLE_RSVP": {
      const id = action.payload;
      const has = state.rsvps.includes(id);
      return { ...state, rsvps: has ? state.rsvps.filter((r) => r !== id) : [...state.rsvps, id] };
    }

    case "TOGGLE_BOOKMARK": {
      const id = action.payload;
      const has = state.bookmarkedJobs.includes(id);
      return { ...state, bookmarkedJobs: has ? state.bookmarkedJobs.filter((b) => b !== id) : [...state.bookmarkedJobs, id] };
    }

    case "REQUEST_REFERRAL":
      return { ...state, referrals: [...state.referrals, action.payload] };

    case "UPDATE_REFERRAL_STATUS":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload.id
            ? { ...r, status: action.payload.status, aiPitch: action.payload.aiPitch ?? r.aiPitch, updatedAt: new Date().toISOString() }
            : r
        ),
      };

    case "APPROVE_REFERRAL":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload ? { ...r, status: "approved" as ReferralStatus, updatedAt: new Date().toISOString() } : r
        ),
      };

    case "DECLINE_REFERRAL":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload ? { ...r, status: "declined" as ReferralStatus, updatedAt: new Date().toISOString() } : r
        ),
      };

    case "UPDATE_PROFILE":
      return { ...state, userProfile: { ...state.userProfile, ...action.payload } };

    case "ADD_SKILL": {
      const skill = action.payload.trim();
      if (!skill || state.userProfile.skills.includes(skill)) return state;
      const updatedProfile = { ...state.userProfile, skills: [...state.userProfile.skills, skill] };
      return {
        ...state,
        userProfile: updatedProfile,
        jobs: recalculateAllJobMatches(state.jobs, updatedProfile),
        events: recalculateAllEventMatches(state.events, updatedProfile),
      };
    }

    case "REMOVE_SKILL": {
      const updatedProfile2 = { ...state.userProfile, skills: state.userProfile.skills.filter((s) => s !== action.payload) };
      return {
        ...state,
        userProfile: updatedProfile2,
        jobs: recalculateAllJobMatches(state.jobs, updatedProfile2),
        events: recalculateAllEventMatches(state.events, updatedProfile2),
      };
    }

    case "SET_SKILLS_AND_ALIGNMENT": {
      const newProfile = {
        ...state.userProfile,
        skills: action.payload.skills,
        title: action.payload.title,
        industryAlignment: action.payload.industryAlignment,
        fullName: action.payload.fullName || state.userProfile.fullName,
        resumeParsed: true,
      };
      return {
        ...state,
        userProfile: newProfile,
        jobs: recalculateAllJobMatches(state.jobs, newProfile),
        events: recalculateAllEventMatches(state.events, newProfile),
      };
    }

    case "UPLOAD_RESUME":
      return { ...state, resumeFile: { name: action.payload.name, parsedAt: new Date().toISOString() }, userProfile: { ...state.userProfile, resumeParsed: true } };

    case "ADD_HOSTED_EVENT":
      return { ...state, events: [action.payload, ...state.events] };

    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };

    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

// ─── Context ───
interface MicoContextValue {
  state: MicoState;
  dispatch: React.Dispatch<Action>;
  toggleRsvp: (eventId: string) => void;
  toggleBookmark: (jobId: string) => void;
  requestReferral: (job: Job) => void;
  approveReferral: (id: string) => void;
  declineReferral: (id: string) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  uploadResume: (fileName: string, resumeText?: string) => void;
  submitHostedEvent: (rawText: string) => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
  isRsvpd: (eventId: string) => boolean;
  isBookmarked: (jobId: string) => boolean;
}

const MicoContext = createContext<MicoContextValue | null>(null);

<<<<<<< HEAD
// ─── Storage Key ───
// Bump this version when mock data changes to invalidate stale localStorage cache
const DATA_VERSION = "v2-real-data";
const STORAGE_KEY = `mico-app-state-${DATA_VERSION}`;
=======
// ─── Storage ───
const STORAGE_KEY = "mico-app-state";
>>>>>>> 0cbd9301b1e3685ee4df9cbbe876f7a94d274f95

function saveToStorage(state: MicoState) {
  try {
    const { toasts, initialized, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch { /* noop */ }
}

function loadFromStorage(): Partial<MicoState> | null {
  try {
    // Clean up old storage keys from previous versions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("mico-app-state") && key !== STORAGE_KEY) {
        localStorage.removeItem(key);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

// ─── Provider ───
export function MicoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(micoReducer, initialState);

  useEffect(() => {
    const stored = loadFromStorage();
    dispatch({ type: "INIT_FROM_STORAGE", payload: stored ?? {} });
  }, []);

  useEffect(() => {
    if (state.initialized) saveToStorage(state);
  }, [state]);

  useEffect(() => {
    if (state.toasts.length === 0) return;
    const latest = state.toasts[state.toasts.length - 1];
    const timer = setTimeout(() => dispatch({ type: "DISMISS_TOAST", payload: latest.id }), 4000);
    return () => clearTimeout(timer);
  }, [state.toasts]);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
  }, []);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", payload: id });
  }, []);

  const toggleRsvp = useCallback((eventId: string) => {
    const was = state.rsvps.includes(eventId);
    dispatch({ type: "TOGGLE_RSVP", payload: eventId });
    const event = state.events.find((e) => e.id === eventId);
    addToast(was ? `RSVP removed for ${event?.title ?? "event"}` : `RSVP confirmed for ${event?.title ?? "event"}`, was ? "info" : "success");
  }, [state.rsvps, state.events, addToast]);

  const toggleBookmark = useCallback((jobId: string) => {
    const was = state.bookmarkedJobs.includes(jobId);
    dispatch({ type: "TOGGLE_BOOKMARK", payload: jobId });
    const job = state.jobs.find((j) => j.id === jobId);
    addToast(was ? `Removed ${job?.title ?? "job"} from saved` : `Saved ${job?.title ?? "job"}`, was ? "info" : "success");
  }, [state.bookmarkedJobs, state.jobs, addToast]);

  // ─── AI-Powered: Request Referral ───
  const requestReferral = useCallback((job: Job) => {
    const existing = state.referrals.find((r) => r.jobId === job.id && r.requesterId === state.userProfile.id);
    if (existing) { addToast("You've already requested a referral for this role.", "warning"); return; }

    const id = `ref-${Date.now()}`;
    const now = new Date().toISOString();
    const newReferral: Referral = {
      id, requesterId: state.userProfile.id, requesterName: state.userProfile.fullName,
      requesterTitle: state.userProfile.title, requesterSkills: state.userProfile.skills.slice(0, 4),
      insiderId: job.referralContactId ?? "usr-insider-unknown", insiderName: job.referralContactName ?? "Community Member",
      insiderTitle: `Employee at ${job.company}`, jobId: job.id, jobTitle: job.title, company: job.company,
      status: "analyzing", matchScore: job.matchScore, aiPitch: "", createdAt: now, updatedAt: now,
    };
    dispatch({ type: "REQUEST_REFERRAL", payload: newReferral });
    addToast("Referral request submitted — AI agent is analyzing your profile", "info");

    // Step 1: Analyzing → Drafting (quick)
    setTimeout(() => dispatch({ type: "UPDATE_REFERRAL_STATUS", payload: { id, status: "drafting" } }), 1500);

    // Step 2: Call real AI agent for pitch
    (async () => {
      try {
        const res = await fetch("/api/agents/draft-pitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateName: state.userProfile.fullName,
            candidateTitle: state.userProfile.title,
            candidateSkills: state.userProfile.skills,
            jobTitle: job.title,
            company: job.company,
            jobDescription: job.description,
          }),
        });
        const { pitch } = await res.json();
        dispatch({ type: "UPDATE_REFERRAL_STATUS", payload: { id, status: "pending_approval", aiPitch: pitch } });
        addToast(`AI drafted your referral pitch for ${job.title} @ ${job.company}`, "success");
      } catch {
        // Fallback if API fails
        const topSkills = state.userProfile.skills.slice(0, 3).join(", ");
        const fallback = `Hi Recruiting, I'd like to refer ${state.userProfile.fullName} for the ${job.title} role at ${job.company}. Their background in ${topSkills} makes them a strong candidate.`;
        dispatch({ type: "UPDATE_REFERRAL_STATUS", payload: { id, status: "pending_approval", aiPitch: fallback } });
      }
    })();
  }, [state.referrals, state.userProfile, addToast]);

  const approveReferral = useCallback((id: string) => {
    dispatch({ type: "APPROVE_REFERRAL", payload: id });
    addToast("Referral approved — routing to HR", "success");
    setTimeout(() => dispatch({ type: "UPDATE_REFERRAL_STATUS", payload: { id, status: "referred_to_hr" } }), 2000);
  }, [addToast]);

  const declineReferral = useCallback((id: string) => {
    dispatch({ type: "DECLINE_REFERRAL", payload: id });
    addToast("Referral declined — candidate notified gracefully", "info");
  }, [addToast]);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    dispatch({ type: "UPDATE_PROFILE", payload: partial });
  }, []);

  const addSkill = useCallback((skill: string) => dispatch({ type: "ADD_SKILL", payload: skill }), []);
  const removeSkill = useCallback((skill: string) => dispatch({ type: "REMOVE_SKILL", payload: skill }), []);

  // ─── AI-Powered: Resume Upload ───
  const uploadResume = useCallback((fileName: string, resumeText?: string) => {
    dispatch({ type: "UPLOAD_RESUME", payload: { name: fileName } });
    addToast("Uploading resume — AI agent is parsing your profile...", "info");

    (async () => {
      try {
        const res = await fetch("/api/agents/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: resumeText || "", fileName }),
        });
        const parsed = await res.json();
        dispatch({
          type: "SET_SKILLS_AND_ALIGNMENT",
          payload: {
            skills: parsed.skills || state.userProfile.skills,
            title: parsed.title || state.userProfile.title || "Professional",
            industryAlignment: parsed.industryAlignment || state.userProfile.industryAlignment,
            fullName: parsed.fullName,
          },
        });
        addToast(`Resume parsed — found ${parsed.skills?.length ?? 0} skills and ${parsed.industryAlignment?.length ?? 0} industry matches`, "success");
      } catch {
        addToast("Resume uploaded (AI parsing unavailable — using existing profile)", "warning");
      }
    })();
  }, [addToast, state.userProfile]);

  // ─── AI-Powered: Host Event ───
  const submitHostedEvent = useCallback((rawText: string) => {
    addToast("AI agent is parsing your event details...", "info");

    (async () => {
      try {
        const res = await fetch("/api/agents/summarize-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText }),
        });
        const parsed = await res.json();

        const id = `evt-hosted-${Date.now()}`;
        const newEvent: MicoEvent = {
          id,
          title: parsed.title || rawText.split("\n")[0]?.slice(0, 60) || "Community Event",
          description: parsed.description || rawText,
          location: parsed.location || "Michigan",
          locationType: parsed.locationType || "detroit-metro",
          eventType: parsed.eventType || "community",
          industry: parsed.industry || undefined,
          eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          aiSummary: parsed.aiSummary || { whyAttend: "Community event.", whosThere: "Local professionals.", vibe: "Welcoming." },
          source: "user_submitted",
          rsvpCount: 0,
          createdAt: new Date().toISOString(),
        };

        dispatch({ type: "ADD_HOSTED_EVENT", payload: newEvent });
        addToast(`Event "${newEvent.title}" published successfully`, "success");
      } catch {
        // Fallback
        const id = `evt-hosted-${Date.now()}`;
        const lines = rawText.trim().split("\n");
        const newEvent: MicoEvent = {
          id, title: lines[0]?.slice(0, 60) || "Community Event", description: rawText,
          location: "Michigan", locationType: "detroit-metro", eventType: "community",
          eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          aiSummary: { whyAttend: "Community event.", whosThere: "Local professionals.", vibe: "Welcoming." },
          source: "user_submitted", rsvpCount: 0, createdAt: new Date().toISOString(),
        };
        dispatch({ type: "ADD_HOSTED_EVENT", payload: newEvent });
        addToast("Event published (AI parsing unavailable)", "warning");
      }
    })();
  }, [addToast]);

  const isRsvpd = useCallback((eventId: string) => state.rsvps.includes(eventId), [state.rsvps]);
  const isBookmarked = useCallback((jobId: string) => state.bookmarkedJobs.includes(jobId), [state.bookmarkedJobs]);

  const value: MicoContextValue = {
    state, dispatch, toggleRsvp, toggleBookmark, requestReferral, approveReferral, declineReferral,
    updateProfile, addSkill, removeSkill, uploadResume, submitHostedEvent, addToast, dismissToast, isRsvpd, isBookmarked,
  };

  return <MicoContext.Provider value={value}>{children}</MicoContext.Provider>;
}

// ─── Hook ───
export function useMico() {
  const ctx = useContext(MicoContext);
  if (!ctx) throw new Error("useMico must be used within MicoProvider");
  return ctx;
}
