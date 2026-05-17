"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockJobs } from "@/lib/mock-data";
import MatchRing from "@/components/ui/MatchRing";
import Badge from "@/components/ui/Badge";
import AIPulse from "@/components/ui/AIPulse";
import Toggle from "@/components/ui/Toggle";
import {
  Search,
  MapPin,
  ChevronDown,
  Briefcase,
  TrendingUp,
  Sparkles,
  Zap,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";
import type { Job } from "@/types/job";

const locationLabels: Record<string, string> = {
  "detroit-metro": "Detroit Metro",
  "ann-arbor": "Ann Arbor",
  "grand-rapids": "Grand Rapids",
  "remote-mi": "Remote (MI)",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"match" | "recent">("match");
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0]);
  const [highMatchOnly, setHighMatchOnly] = useState(false);

  const filteredJobs = useMemo(() => {
    return mockJobs
      .filter((job) => {
        const matchesSearch =
          search === "" ||
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.requirements.some((r) =>
            r.toLowerCase().includes(search.toLowerCase())
          );
        const matchesLocation =
          locationFilter === "all" || job.locationFilter === locationFilter;
        const matchesHighMatch = !highMatchOnly || job.matchScore > 80;
        return matchesSearch && matchesLocation && matchesHighMatch;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchScore - a.matchScore;
        return (
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
      });
  }, [search, locationFilter, sortBy, highMatchOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold text-pine">
          MICo Opportunities
        </h1>
        <p className="mt-1 text-slate-muted">
          Michigan roles matched to your skills by watsonx.
        </p>
      </div>

      {/* AI Toggle & Location Pills */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between animate-fade-in-up" style={{ animationDelay: "0.03s" }}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(locationLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLocationFilter(locationFilter === key ? "all" : key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                locationFilter === key
                  ? "bg-pine text-white shadow-md"
                  : "bg-sage text-pine hover:bg-sage-dark"
              }`}
            >
              {label}
            </button>
          ))}
          {locationFilter !== "all" && (
            <button
              onClick={() => setLocationFilter("all")}
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-muted bg-surface-light hover:bg-border-light transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <Toggle
          label="Only show jobs > 80% MICo Match"
          checked={highMatchOnly}
          onChange={setHighMatchOnly}
        />
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card lg:flex-row lg:items-center animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
          <input
            type="text"
            placeholder="Search by role, company, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-light py-2.5 pl-10 pr-4 text-sm text-slate-iron placeholder:text-slate-light outline-none transition-all focus:border-pine focus:ring-2 focus:ring-pine/10"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light pointer-events-none" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="appearance-none rounded-xl border border-border bg-surface-light py-2.5 pl-9 pr-9 text-sm text-slate-iron outline-none cursor-pointer transition-all focus:border-pine focus:ring-2 focus:ring-pine/10"
          >
            <option value="all">All Locations</option>
            {Object.entries(locationLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-light pointer-events-none" />
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "match" | "recent")}
            className="appearance-none rounded-xl border border-border bg-surface-light py-2.5 pl-9 pr-9 text-sm text-slate-iron outline-none cursor-pointer transition-all focus:border-pine focus:ring-2 focus:ring-pine/10"
          >
            <option value="match">Best Match</option>
            <option value="recent">Most Recent</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-light pointer-events-none" />
        </div>

        <span className="text-xs font-medium text-slate-light whitespace-nowrap">
          {filteredJobs.length} role{filteredJobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Split Panel: Job List (left) + Detail (right) */}
      <div
        className="flex flex-col gap-6 lg:flex-row animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Left: Job List */}
        <div className="w-full space-y-3 lg:w-[380px] shrink-0">
          {filteredJobs.map((job) => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full text-left rounded-2xl p-4 transition-all duration-200 group ${
                  isSelected
                    ? "bg-sage border-2 border-pine/20 shadow-card"
                    : "bg-white border-2 border-transparent shadow-soft hover:shadow-card hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-display text-base font-bold leading-tight transition-colors ${
                        isSelected
                          ? "text-pine"
                          : "text-slate-iron group-hover:text-pine"
                      }`}
                    >
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-muted mt-0.5">
                      {job.company}
                    </p>
                  </div>
                  <MatchRing
                    score={job.matchScore}
                    size={46}
                    strokeWidth={3}
                    animated={false}
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  {job.salaryRange && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {job.salaryRange}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {job.referralAvailable && (
                    <Badge variant="success" size="sm">
                      <Zap className="h-2.5 w-2.5" />
                      Referral
                    </Badge>
                  )}
                  <Badge variant="outline" size="sm">
                    {timeAgo(job.postedAt)}
                  </Badge>
                </div>
              </button>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12 shadow-card">
              <Briefcase className="h-10 w-10 text-slate-light mb-3" />
              <p className="font-display text-base font-semibold text-slate-iron">
                No roles found
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLocationFilter("all");
                }}
                className="mt-1 text-sm font-semibold text-pine hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Right: Job Detail */}
        <div className="flex-1 min-w-0">
          {selectedJob ? (
            <JobDetail
              job={selectedJob}
              onBack={() => setSelectedJob(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-card">
              <Briefcase className="h-12 w-12 text-slate-light mb-4" />
              <p className="font-display text-lg font-semibold text-slate-iron">
                Select a role to view details
              </p>
              <p className="mt-1 text-sm text-slate-muted">
                Click any listing on the left to see match analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Job Detail Sub-Component ---- */

function JobDetail({ job, onBack }: { job: Job; onBack: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card lg:p-8 space-y-6 animate-fade-in-up">
      {/* Mobile back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-muted hover:text-pine transition-colors lg:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to listings
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-slate-iron">
            {job.title}
          </h2>
          <p className="mt-1 text-lg text-slate-muted">{job.company}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              Full-time
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                {job.salaryRange}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <MatchRing score={job.matchScore} size={80} strokeWidth={5} />
          <span className="mt-1 text-[10px] font-semibold text-gold uppercase tracking-wider">
            MICo Match
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {job.referralAvailable && (
          <Badge variant="success">
            <Zap className="h-3 w-3" />
            Insider Referral Available via {job.referralContactName}
          </Badge>
        )}
        <Badge variant="outline">{timeAgo(job.postedAt)}</Badge>
        <Badge variant="outline">
          {locationLabels[job.locationFilter]}
        </Badge>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine mb-2">
          About the Role
        </h3>
        <p className="text-sm text-slate-iron leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine mb-3">
          Requirements
        </h3>
        <div className="flex flex-wrap gap-2">
          {job.requirements.map((req) => (
            <Badge key={req} variant="default">
              {req}
            </Badge>
          ))}
        </div>
      </div>

      {/* Watsonx Match Analysis Card */}
      <div className="rounded-xl bg-sage p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            Watsonx Match Analysis
          </span>
        </div>

        {/* Match Reasons */}
        <div>
          <h4 className="text-xs font-bold text-pine uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            Why You&apos;re a Match
          </h4>
          <ul className="space-y-1.5">
            {job.matchReasons.map((reason, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-iron"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Skill Gaps */}
        {job.skillGaps.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-pine uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-gold" />
              MICo Upskill Suggestions
            </h4>
            <ul className="space-y-1.5">
              {job.skillGaps.map((gap, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-iron"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {job.referralAvailable ? (
          <Link
            href="/network"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold py-3.5 font-semibold text-pine-dark shadow-md transition-all hover:bg-gold-hover hover:shadow-gold-glow active:scale-[0.98]"
          >
            <Zap className="h-4 w-4" />
            Request Referral via {job.referralContactName}
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-surface-light py-3.5 font-semibold text-slate-light cursor-not-allowed"
          >
            <Zap className="h-4 w-4" />
            No Insider Referral Available
          </button>
        )}
        {job.sourceUrl && (
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 px-6 font-semibold text-slate-iron transition-all hover:border-pine/30 hover:bg-surface-light"
          >
            Apply Direct
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* AI Status Footer */}
      <div className="pt-2 border-t border-border-light">
        <AIPulse
          label="Watsonx continuously re-ranks matches as your profile evolves."
          size="sm"
        />
      </div>
    </div>
  );
}
