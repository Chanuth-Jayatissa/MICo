"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { mockJobs, mockEvents, mockReferrals, mockUserProfile } from "@/lib/mock-data";
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
  rsvps: string[]; // event IDs
  bookmarkedJobs: string[]; // job IDs
  resumeFile: { name: string; parsedAt: string } | null;
  toasts: Toast[];
  initialized: boolean;
}

// ─── Actions ───
type Action =
  | { type: "INIT_FROM_STORAGE"; payload: Partial<MicoState> }
  | { type: "TOGGLE_RSVP"; payload: string }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "REQUEST_REFERRAL"; payload: Referral }
  | { type: "UPDATE_REFERRAL_STATUS"; payload: { id: string; status: ReferralStatus; aiPitch?: string } }
  | { type: "APPROVE_REFERRAL"; payload: string }
  | { type: "DECLINE_REFERRAL"; payload: string }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "ADD_SKILL"; payload: string }
  | { type: "REMOVE_SKILL"; payload: string }
  | { type: "UPLOAD_RESUME"; payload: { name: string } }
  | { type: "ADD_HOSTED_EVENT"; payload: MicoEvent }
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "DISMISS_TOAST"; payload: string };

// ─── Initial State ───
const initialState: MicoState = {
  userProfile: mockUserProfile,
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
    case "INIT_FROM_STORAGE":
      return { ...state, ...action.payload, initialized: true };

    case "TOGGLE_RSVP": {
      const id = action.payload;
      const has = state.rsvps.includes(id);
      return {
        ...state,
        rsvps: has
          ? state.rsvps.filter((r) => r !== id)
          : [...state.rsvps, id],
      };
    }

    case "TOGGLE_BOOKMARK": {
      const id = action.payload;
      const has = state.bookmarkedJobs.includes(id);
      return {
        ...state,
        bookmarkedJobs: has
          ? state.bookmarkedJobs.filter((b) => b !== id)
          : [...state.bookmarkedJobs, id],
      };
    }

    case "REQUEST_REFERRAL":
      return {
        ...state,
        referrals: [...state.referrals, action.payload],
      };

    case "UPDATE_REFERRAL_STATUS":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload.id
            ? {
                ...r,
                status: action.payload.status,
                aiPitch: action.payload.aiPitch ?? r.aiPitch,
                updatedAt: new Date().toISOString(),
              }
            : r
        ),
      };

    case "APPROVE_REFERRAL":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload
            ? { ...r, status: "approved" as ReferralStatus, updatedAt: new Date().toISOString() }
            : r
        ),
      };

    case "DECLINE_REFERRAL":
      return {
        ...state,
        referrals: state.referrals.map((r) =>
          r.id === action.payload
            ? { ...r, status: "declined" as ReferralStatus, updatedAt: new Date().toISOString() }
            : r
        ),
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };

    case "ADD_SKILL": {
      const skill = action.payload.trim();
      if (!skill || state.userProfile.skills.includes(skill)) return state;
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          skills: [...state.userProfile.skills, skill],
        },
      };
    }

    case "REMOVE_SKILL":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          skills: state.userProfile.skills.filter((s) => s !== action.payload),
        },
      };

    case "UPLOAD_RESUME":
      return {
        ...state,
        resumeFile: { name: action.payload.name, parsedAt: new Date().toISOString() },
        userProfile: { ...state.userProfile, resumeParsed: true },
      };

    case "ADD_HOSTED_EVENT":
      return {
        ...state,
        events: [action.payload, ...state.events],
      };

    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

// ─── Context ───
interface MicoContextValue {
  state: MicoState;
  dispatch: React.Dispatch<Action>;
  // Convenience actions
  toggleRsvp: (eventId: string) => void;
  toggleBookmark: (jobId: string) => void;
  requestReferral: (job: Job) => void;
  approveReferral: (id: string) => void;
  declineReferral: (id: string) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  uploadResume: (fileName: string) => void;
  submitHostedEvent: (rawText: string) => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
  isRsvpd: (eventId: string) => boolean;
  isBookmarked: (jobId: string) => boolean;
}

const MicoContext = createContext<MicoContextValue | null>(null);

// ─── Storage Key ───
const STORAGE_KEY = "mico-app-state";

function saveToStorage(state: MicoState) {
  try {
    const { toasts, initialized, ...persistable } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // localStorage may not be available
  }
}

function loadFromStorage(): Partial<MicoState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── AI Simulation helpers ───
function generateReferralPitch(job: Job, profile: UserProfile): string {
  const topSkills = profile.skills.slice(0, 3).join(", ");
  return `Hi Recruiting, I'd like to refer ${profile.fullName} for the ${job.title} role. Their background in ${topSkills} demonstrates the exact skills needed for your team. Their recent projects and experience show the problem-solving ability that would be immediately valuable.`;
}

function generateHostedEventSummary() {
  return {
    whyAttend: "Community-submitted event with unique networking opportunities.",
    whosThere: "Local Michigan tech professionals and community members.",
    vibe: "Welcoming atmosphere with opportunities to connect and learn.",
  };
}

// ─── Provider ───
export function MicoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(micoReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      dispatch({ type: "INIT_FROM_STORAGE", payload: stored });
    } else {
      dispatch({ type: "INIT_FROM_STORAGE", payload: {} });
    }
  }, []);

  // Persist to localStorage on every state change (after init)
  useEffect(() => {
    if (state.initialized) {
      saveToStorage(state);
    }
  }, [state]);

  // Auto-dismiss toasts after 4s
  useEffect(() => {
    if (state.toasts.length === 0) return;
    const latest = state.toasts[state.toasts.length - 1];
    const timer = setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST", payload: latest.id });
    }, 4000);
    return () => clearTimeout(timer);
  }, [state.toasts]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", payload: id });
  }, []);

  const toggleRsvp = useCallback(
    (eventId: string) => {
      const isCurrentlyRsvpd = state.rsvps.includes(eventId);
      dispatch({ type: "TOGGLE_RSVP", payload: eventId });
      const event = state.events.find((e) => e.id === eventId);
      addToast(
        isCurrentlyRsvpd
          ? `RSVP removed for ${event?.title ?? "event"}`
          : `RSVP confirmed for ${event?.title ?? "event"}`,
        isCurrentlyRsvpd ? "info" : "success"
      );
    },
    [state.rsvps, state.events, addToast]
  );

  const toggleBookmark = useCallback(
    (jobId: string) => {
      const isCurrentlyBookmarked = state.bookmarkedJobs.includes(jobId);
      dispatch({ type: "TOGGLE_BOOKMARK", payload: jobId });
      const job = state.jobs.find((j) => j.id === jobId);
      addToast(
        isCurrentlyBookmarked
          ? `Removed ${job?.title ?? "job"} from saved`
          : `Saved ${job?.title ?? "job"}`,
        isCurrentlyBookmarked ? "info" : "success"
      );
    },
    [state.bookmarkedJobs, state.jobs, addToast]
  );

  const requestReferral = useCallback(
    (job: Job) => {
      // Check if already requested
      const existing = state.referrals.find(
        (r) => r.jobId === job.id && r.requesterId === "usr-current"
      );
      if (existing) {
        addToast("You've already requested a referral for this role.", "warning");
        return;
      }

      const id = `ref-${Date.now()}`;
      const now = new Date().toISOString();

      const newReferral: Referral = {
        id,
        requesterId: "usr-current",
        requesterName: state.userProfile.fullName,
        requesterTitle: state.userProfile.title,
        requesterSkills: state.userProfile.skills.slice(0, 4),
        insiderId: job.referralContactId ?? "usr-insider-unknown",
        insiderName: job.referralContactName ?? "Community Member",
        insiderTitle: `Employee at ${job.company}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        status: "analyzing",
        matchScore: job.matchScore,
        aiPitch: "",
        createdAt: now,
        updatedAt: now,
      };

      dispatch({ type: "REQUEST_REFERRAL", payload: newReferral });
      addToast("Referral request submitted — watsonx is analyzing your profile", "info");

      // Simulated AI pipeline: analyzing → drafting → pending_approval
      setTimeout(() => {
        dispatch({
          type: "UPDATE_REFERRAL_STATUS",
          payload: { id, status: "drafting" },
        });
      }, 1500);

      setTimeout(() => {
        const pitch = generateReferralPitch(job, state.userProfile);
        dispatch({
          type: "UPDATE_REFERRAL_STATUS",
          payload: { id, status: "pending_approval", aiPitch: pitch },
        });
        addToast(`Watsonx drafted your referral pitch for ${job.title} @ ${job.company}`, "success");
      }, 3000);
    },
    [state.referrals, state.userProfile, addToast]
  );

  const approveReferral = useCallback(
    (id: string) => {
      dispatch({ type: "APPROVE_REFERRAL", payload: id });
      addToast("Referral approved — routing to HR via Orchestrate", "success");

      // Simulate HR routing after a short delay
      setTimeout(() => {
        dispatch({
          type: "UPDATE_REFERRAL_STATUS",
          payload: { id, status: "referred_to_hr" },
        });
      }, 2000);
    },
    [addToast]
  );

  const declineReferral = useCallback(
    (id: string) => {
      dispatch({ type: "DECLINE_REFERRAL", payload: id });
      addToast("Referral declined — candidate notified gracefully", "info");
    },
    [addToast]
  );

  const updateProfile = useCallback(
    (partial: Partial<UserProfile>) => {
      dispatch({ type: "UPDATE_PROFILE", payload: partial });
    },
    []
  );

  const addSkill = useCallback((skill: string) => {
    dispatch({ type: "ADD_SKILL", payload: skill });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    dispatch({ type: "REMOVE_SKILL", payload: skill });
  }, []);

  const uploadResume = useCallback(
    (fileName: string) => {
      dispatch({ type: "UPLOAD_RESUME", payload: { name: fileName } });
      addToast("Resume parsed successfully — your profile has been updated", "success");
    },
    [addToast]
  );

  const submitHostedEvent = useCallback(
    (rawText: string) => {
      const id = `evt-hosted-${Date.now()}`;
      // Extract a rough title from the first line
      const lines = rawText.trim().split("\n");
      const title = lines[0].slice(0, 60) || "Community Event";
      const description = rawText;

      const newEvent: MicoEvent = {
        id,
        title,
        description,
        location: "TBD — Parsed by watsonx",
        locationType: "detroit-metro",
        eventType: "networking",
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks out
        aiSummary: generateHostedEventSummary(),
        source: "user_submitted",
        rsvpCount: 0,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "ADD_HOSTED_EVENT", payload: newEvent });
      addToast("Event published — watsonx extracted the details", "success");
    },
    [addToast]
  );

  const isRsvpd = useCallback(
    (eventId: string) => state.rsvps.includes(eventId),
    [state.rsvps]
  );

  const isBookmarked = useCallback(
    (jobId: string) => state.bookmarkedJobs.includes(jobId),
    [state.bookmarkedJobs]
  );

  const value: MicoContextValue = {
    state,
    dispatch,
    toggleRsvp,
    toggleBookmark,
    requestReferral,
    approveReferral,
    declineReferral,
    updateProfile,
    addSkill,
    removeSkill,
    uploadResume,
    submitHostedEvent,
    addToast,
    dismissToast,
    isRsvpd,
    isBookmarked,
  };

  return <MicoContext.Provider value={value}>{children}</MicoContext.Provider>;
}

// ─── Hook ───
export function useMico() {
  const ctx = useContext(MicoContext);
  if (!ctx) throw new Error("useMico must be used within MicoProvider");
  return ctx;
}
