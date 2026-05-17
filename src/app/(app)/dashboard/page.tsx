"use client";

import Link from "next/link";
import MatchRing from "@/components/ui/MatchRing";
import AIPulse from "@/components/ui/AIPulse";
import StatusTimeline, { TimelineNodeStatus } from "@/components/ui/StatusTimeline";
import Badge from "@/components/ui/Badge";
import { useMico } from "@/lib/store/mico-store";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Briefcase,
  Calendar,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { ReferralStatus } from "@/types/referral";

// Map referral status to timeline node statuses
function getTimelineNodes(status: ReferralStatus) {
  const map: Record<ReferralStatus, [TimelineNodeStatus, TimelineNodeStatus, TimelineNodeStatus]> = {
    analyzing: ["active", "pending", "pending"],
    drafting: ["completed", "active", "pending"],
    pending_approval: ["completed", "completed", "pending"],
    approved: ["completed", "completed", "completed"],
    declined: ["completed", "completed", "pending"],
    referred_to_hr: ["completed", "completed", "active"],
  };
  return [
    { label: "Resume Analyzed", status: map[status][0] },
    { label: status === "drafting" ? "Drafting Intro..." : status === "pending_approval" ? "Pending Approval" : "Intro Sent", status: map[status][1] },
    { label: "Referred to HR", status: map[status][2] },
  ];
}

// Format event date
function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
}

export default function DashboardPage() {
  const { state, toggleRsvp, isRsvpd } = useMico();
  const { userProfile: user, jobs, events, referrals, rsvps } = state;

  const newMatchCount = jobs.filter((j) => j.matchScore >= 80).length;
  const spotlightJob = jobs.reduce((best, job) =>
    job.matchScore > best.matchScore ? job : best
  );
  const otherJobs = jobs
    .filter((j) => j.id !== spotlightJob.id)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 2);
  const myReferrals = referrals.filter((r) => r.requesterId === "usr-current");
  const activeReferrals = myReferrals.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Greeting + AI Status */}
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold text-pine lg:text-4xl">
          Welcome to your MICo Dashboard, {user.fullName.split(" ")[0]}.
        </h1>
        <div className="mt-3 flex items-center gap-6">
          <AIPulse
            label={`Your watsonx agents found ${newMatchCount} new local matches today.`}
          />
        </div>
      </div>

      {/* MICo Match Spotlight Card */}
      <div className="rounded-2xl bg-sage p-6 shadow-card lg:p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                MICo Match Spotlight
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-iron lg:text-3xl">
              {spotlightJob.title} @ {spotlightJob.company}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-muted">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {spotlightJob.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                Full-time
              </span>
              {spotlightJob.salaryRange && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {spotlightJob.salaryRange}
                </span>
              )}
            </div>
            <p className="mt-4 text-slate-iron leading-relaxed max-w-xl">
              <span className="font-semibold text-pine">Watsonx logic:</span>{" "}
              {spotlightJob.matchReasons[0]}
            </p>
            {spotlightJob.referralAvailable && (
              <Link
                href="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-semibold text-pine-dark shadow-md transition-all duration-200 hover:bg-gold-hover hover:shadow-gold-glow active:scale-[0.98]"
              >
                Request Insider Referral
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="flex items-center justify-center lg:pr-4">
            <div className="relative">
              <MatchRing score={spotlightJob.matchScore} size={130} strokeWidth={8} />
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-gold">
                MICo Match
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Job Spot */}
        <div className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gold" />
              Job Spot
            </h3>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-pine hover:text-pine-light transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3 stagger-children">
            {otherJobs.map((job) => (
              <Link
                key={job.id}
                href="/jobs"
                className="flex items-center justify-between rounded-xl border border-border-light p-3 card-hover cursor-pointer group"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-semibold text-sm text-slate-iron group-hover:text-pine transition-colors truncate">
                    {job.title}
                  </p>
                  <p className="text-xs text-slate-muted truncate">
                    {job.company} · {job.location}
                  </p>
                  {job.referralAvailable && (
                    <Badge variant="success" size="sm" className="mt-1.5">
                      <Zap className="h-2.5 w-2.5" />
                      Referral Available
                    </Badge>
                  )}
                </div>
                <MatchRing score={job.matchScore} size={44} strokeWidth={3} />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Local Pulse */}
        <div className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              Local Pulse
            </h3>
            <Link
              href="/events"
              className="text-xs font-semibold text-pine hover:text-pine-light transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3 stagger-children">
            {upcomingEvents.map((event) => {
              const { day, month } = formatEventDate(event.eventDate);
              const rsvpd = isRsvpd(event.id);
              return (
                <div
                  key={event.id}
                  className="flex gap-3 rounded-xl border border-border-light p-3 card-hover group"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-sage group-hover:bg-sage-dark transition-colors">
                    <span className="font-display text-lg font-bold text-pine leading-none">
                      {day}
                    </span>
                    <span className="text-[10px] font-semibold text-pine/60 uppercase">
                      {month}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-iron group-hover:text-pine transition-colors truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-muted line-clamp-2 mt-0.5">
                      {event.aiSummary.whyAttend}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => toggleRsvp(event.id)}
                        className={`text-[11px] font-semibold transition-colors ${
                          rsvpd ? "text-success" : "text-gold hover:text-gold-hover"
                        }`}
                      >
                        {rsvpd ? "RSVP'd ✓" : "RSVP →"}
                      </button>
                      {event.matchScore && event.matchScore >= 85 && (
                        <Badge variant="gold" size="sm">
                          {event.matchScore}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Agent Status */}
        <div className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold" />
              Agent Status
            </h3>
            <Link
              href="/network"
              className="text-xs font-semibold text-pine hover:text-pine-light transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4 stagger-children">
            {activeReferrals.map((referral) => (
              <Link
                key={referral.id}
                href="/network"
                className="block rounded-xl border border-border-light p-3 card-hover cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-iron group-hover:text-pine transition-colors">
                    {referral.jobTitle} @ {referral.company}
                  </p>
                  <span className="text-[10px] text-slate-light">
                    {referral.insiderName}
                  </span>
                </div>
                <StatusTimeline nodes={getTimelineNodes(referral.status)} />
              </Link>
            ))}
            {activeReferrals.length === 0 && (
              <p className="text-sm text-slate-muted text-center py-6">
                No active referral requests yet.
                <br />
                <Link href="/jobs" className="text-pine font-semibold hover:underline">
                  Browse jobs to get started →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        {[
          { label: "Skills Parsed", value: user.skills.length.toString(), icon: Sparkles, color: "text-pine" },
          { label: "Jobs Matched", value: jobs.filter((j) => j.matchScore >= 70).length.toString(), icon: Briefcase, color: "text-gold" },
          { label: "Events RSVP'd", value: rsvps.length.toString(), icon: Calendar, color: "text-success" },
          { label: "Active Referrals", value: myReferrals.length.toString(), icon: Zap, color: "text-gold" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-border-light bg-white p-4 shadow-soft"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-light ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-slate-iron">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
