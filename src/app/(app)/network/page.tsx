"use client";

import { useState } from "react";
import { useMico } from "@/lib/store/mico-store";
import MatchRing from "@/components/ui/MatchRing";
import AIPulse from "@/components/ui/AIPulse";
import Badge from "@/components/ui/Badge";
import StatusTimeline, { TimelineNodeStatus } from "@/components/ui/StatusTimeline";
import {
  Users,
  Inbox,
  Send,
  Sparkles,
  Check,
  X,
  Briefcase,
  FileText,
  Clock,
  Zap,
  Bot,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Referral, ReferralStatus } from "@/types/referral";

// Map referral status to timeline node statuses
function getTimelineNodes(status: ReferralStatus) {
  const map: Record<
    ReferralStatus,
    [TimelineNodeStatus, TimelineNodeStatus, TimelineNodeStatus]
  > = {
    analyzing: ["active", "pending", "pending"],
    drafting: ["completed", "active", "pending"],
    pending_approval: ["completed", "completed", "pending"],
    approved: ["completed", "completed", "completed"],
    declined: ["completed", "completed", "pending"],
    referred_to_hr: ["completed", "completed", "active"],
  };
  return [
    { label: "Resume Analyzed", status: map[status][0] },
    {
      label:
        status === "drafting"
          ? "Drafting Pitch..."
          : status === "pending_approval"
          ? "Pending Approval"
          : status === "approved"
          ? "Approved"
          : "Intro Sent",
      status: map[status][1],
    },
    { label: "Referred to HR", status: map[status][2] },
  ];
}

// Status label helpers
const statusLabels: Record<ReferralStatus, string> = {
  analyzing: "Analyzing Resume...",
  drafting: "Watsonx Drafting Pitch...",
  pending_approval: "Sent for Insider Approval",
  approved: "Approved & Referred",
  declined: "Declined",
  referred_to_hr: "Routing to HR",
};

const statusColors: Record<ReferralStatus, string> = {
  analyzing: "text-slate-muted",
  drafting: "text-gold",
  pending_approval: "text-gold",
  approved: "text-success",
  declined: "text-error",
  referred_to_hr: "text-pine",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function NetworkPage() {
  const { state, approveReferral, declineReferral } = useMico();
  const { referrals } = state;

  // Split referrals into outbox (my requests) and inbox (requests sent to me as an insider)
  const myRequests = referrals.filter((r) => r.requesterId === "usr-current");
  const incomingRequests = referrals.filter((r) => r.insiderId === "usr-current" || r.insiderId === "usr-insider-unknown");

  const [activeView, setActiveView] = useState<"outbox" | "inbox">("outbox");

  const pendingInboxCount = incomingRequests.filter(
    (r) => r.status !== "approved" && r.status !== "declined" && r.status !== "referred_to_hr"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold text-pine lg:text-4xl">
          MICo Network Engine
        </h1>
        <p className="mt-1 text-slate-muted">
          Manage referrals and grow your Michigan tech network.
        </p>
      </div>

      {/* Perspective Toggle */}
      <div
        className="flex justify-center animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="inline-flex rounded-full border-2 border-border bg-white p-1 shadow-soft">
          <button
            onClick={() => setActiveView("outbox")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeView === "outbox"
                ? "bg-gold text-pine-dark shadow-md"
                : "text-slate-muted hover:text-slate-iron"
            }`}
          >
            <Send className="h-4 w-4" />
            My Requests
          </button>
          <button
            onClick={() => setActiveView("inbox")}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeView === "inbox"
                ? "bg-gold text-pine-dark shadow-md"
                : "text-slate-muted hover:text-slate-iron"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Insider Inbox
            {pendingInboxCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {pendingInboxCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* AI Status */}
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <AIPulse
          label={
            activeView === "outbox"
              ? "Watsonx is monitoring your referral pipeline and drafting personalized pitches."
              : "AI-generated referral pitches are ready for your review."
          }
        />
      </div>

      {/* View A: My Requests (Outbox) */}
      {activeView === "outbox" && (
        <div className="space-y-4 stagger-children">
          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-card">
              <Send className="h-12 w-12 text-slate-light mb-4" />
              <p className="font-display text-lg font-semibold text-slate-iron">
                No referral requests yet
              </p>
              <p className="mt-1 text-sm text-slate-muted">
                Browse{" "}
                <a
                  href="/jobs"
                  className="font-semibold text-pine hover:underline"
                >
                  job listings
                </a>{" "}
                and click &ldquo;Request Insider Referral&rdquo; to get started.
              </p>
            </div>
          ) : (
            myRequests.map((referral) => (
              <OutboxCard key={referral.id} referral={referral} />
            ))
          )}
        </div>
      )}

      {/* View B: Insider Inbox */}
      {activeView === "inbox" && (
        <div className="space-y-4 stagger-children">
          {incomingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-card">
              <Inbox className="h-12 w-12 text-slate-light mb-4" />
              <p className="font-display text-lg font-semibold text-slate-iron">
                No incoming referral requests
              </p>
              <p className="mt-1 text-sm text-slate-muted">
                When someone requests a referral through your network, it will
                appear here.
              </p>
            </div>
          ) : (
            incomingRequests.map((referral) => (
              <InboxCard
                key={referral.id}
                referral={referral}
                onApprove={() => approveReferral(referral.id)}
                onDecline={() => declineReferral(referral.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Outbox Card Sub-Component ---- */

function OutboxCard({ referral }: { referral: Referral }) {
  return (
    <div className="rounded-2xl bg-sage p-5 shadow-card lg:p-6">
      {/* Header Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              Referral Request
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-slate-iron">
            {referral.jobTitle} @ {referral.company}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-muted">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Routing to: {referral.insiderName},{" "}
              {referral.insiderTitle}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(referral.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={
              referral.status === "approved" || referral.status === "referred_to_hr"
                ? "success"
                : referral.status === "declined"
                ? "outline"
                : "gold"
            }
          >
            <span
              className={`text-xs font-semibold ${statusColors[referral.status]}`}
            >
              {statusLabels[referral.status]}
            </span>
          </Badge>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mt-5 flex justify-center">
        <StatusTimeline nodes={getTimelineNodes(referral.status)} />
      </div>

      {/* AI Pitch Preview */}
      {referral.aiPitch && (
        <div className="mt-5 rounded-xl bg-white/80 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
              AI-Generated Pitch Preview
            </span>
          </div>
          <p className="text-sm text-slate-iron leading-relaxed italic">
            &ldquo;{referral.aiPitch}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- Inbox Card Sub-Component ---- */

function InboxCard({
  referral,
  onApprove,
  onDecline,
}: {
  referral: Referral;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const isApproved = referral.status === "approved" || referral.status === "referred_to_hr";
  const isDeclined = referral.status === "declined";
  const hasActioned = isApproved || isDeclined;

  return (
    <div
      className={`rounded-2xl bg-white shadow-card transition-all duration-300 overflow-hidden ${
        isApproved
          ? "ring-2 ring-success/30"
          : isDeclined
          ? "ring-2 ring-slate-light/30 opacity-60"
          : ""
      }`}
    >
      <div className="p-5 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column: Candidate Snapshot */}
          <div className="lg:w-2/5 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-pine" />
              <span className="text-xs font-semibold uppercase tracking-wider text-pine">
                Candidate Snapshot
              </span>
            </div>

            <div className="flex items-start gap-4">
              {/* Avatar Placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage font-display text-lg font-bold text-pine">
                {referral.requesterName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-iron">
                  {referral.requesterName}
                </h3>
                <p className="text-sm text-slate-muted">
                  {referral.requesterTitle}
                </p>
              </div>
            </div>

            {/* Match Score */}
            <div className="mt-4 flex items-center gap-4">
              <MatchRing
                score={referral.matchScore}
                size={60}
                strokeWidth={4}
              />
              <div>
                <p className="text-xs font-semibold text-gold uppercase tracking-wider">
                  MICo Match
                </p>
                <p className="text-sm text-slate-muted mt-0.5">
                  AI-vetted candidate
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-pine uppercase tracking-wide mb-2">
                Top Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {referral.requesterSkills.map((skill) => (
                  <Badge key={skill} variant="default" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div className="mt-4 rounded-xl bg-sage p-3">
              <p className="text-xs font-semibold text-pine uppercase tracking-wide mb-1">
                Requesting Referral For
              </p>
              <p className="text-sm font-semibold text-slate-iron">
                {referral.jobTitle} @ {referral.company}
              </p>
            </div>
          </div>

          {/* Right Column: AI-Generated Pitch */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                AI-Generated Referral Pitch
              </span>
            </div>

            {referral.aiPitch ? (
              <div className="flex-1 rounded-xl border border-border bg-sage-light p-4">
                <p className="text-sm text-slate-iron leading-relaxed whitespace-pre-wrap">
                  {referral.aiPitch}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-xl border border-border bg-sage-light p-4">
                <div className="text-center">
                  <AIPulse label="Watsonx is analyzing the candidate's resume and drafting a pitch..." />
                </div>
              </div>
            )}

            {/* Transparency Tag */}
            <p className="mt-3 text-[11px] italic text-slate-light flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Drafted autonomously by IBM Granite LLM based on candidate profile
              and job requirements.
            </p>

            {/* Action Buttons */}
            {!hasActioned && referral.aiPitch && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={onApprove}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold py-3 font-semibold text-pine-dark shadow-md transition-all hover:bg-gold-hover hover:shadow-gold-glow active:scale-[0.98]"
                >
                  <Check className="h-4 w-4" />
                  Approve &amp; Send
                </button>
                <button
                  onClick={onDecline}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3 font-semibold text-slate-muted transition-all hover:border-slate-light hover:bg-surface-light"
                >
                  <X className="h-4 w-4" />
                  Decline
                </button>
              </div>
            )}

            {/* Post-action states */}
            {isApproved && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">
                    Approved & Sent
                  </p>
                  <p className="text-xs text-slate-muted">
                    The referral pitch has been routed to HR automatically via
                    Orchestrate.
                  </p>
                </div>
              </div>
            )}

            {isDeclined && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-light border border-border p-3">
                <XCircle className="h-5 w-5 text-slate-light" />
                <div>
                  <p className="text-sm font-semibold text-slate-muted">
                    Declined
                  </p>
                  <p className="text-xs text-slate-light">
                    The candidate has been notified gracefully. No further action
                    needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
