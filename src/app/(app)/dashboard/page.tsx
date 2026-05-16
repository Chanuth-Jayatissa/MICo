"use client";

import { useState } from "react";
import MatchRing from "@/components/ui/MatchRing";
import AIPulse from "@/components/ui/AIPulse";
import Toggle from "@/components/ui/Toggle";
import StatusTimeline from "@/components/ui/StatusTimeline";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [aiToggle, setAiToggle] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero Greeting */}
      <div>
        <h1 className="font-display text-3xl font-bold text-pine lg:text-4xl">
          Welcome to your MICo Dashboard
        </h1>
        <div className="mt-3">
          <AIPulse label="Your watsonx agents found 3 new local matches today." />
        </div>
      </div>

      {/* MICo Match Spotlight Card */}
      <div className="rounded-2xl bg-sage p-6 shadow-card lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                MICo Match Spotlight
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-iron">
              AI Engineer @ Ford
            </h2>
            <p className="mt-1 text-sm text-slate-muted">
              Dearborn, MI · Full-time · $120K–$160K
            </p>
            <p className="mt-4 text-slate-iron leading-relaxed">
              <span className="font-semibold text-pine">Watsonx logic:</span>{" "}
              Your Python experience perfectly aligns with Ford&apos;s new mobility initiatives in Dearborn.
            </p>
            <button className="mt-5 rounded-xl bg-gold px-6 py-3 font-semibold text-pine-dark shadow-md transition-all duration-200 hover:bg-gold-hover hover:shadow-gold-glow active:scale-[0.98]">
              Request Insider Referral
            </button>
          </div>
          <div className="flex items-center justify-center">
            <MatchRing score={98} size={120} strokeWidth={8} />
          </div>
        </div>
      </div>

      {/* 3-Column Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1: Job Spot */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine mb-4">
            Job Spot
          </h3>
          <div className="space-y-3 stagger-children">
            {[
              { title: "Data Engineer", company: "Rocket Companies", location: "Detroit, MI", score: 92 },
              { title: "Frontend Dev", company: "StockX", location: "Detroit, MI", score: 87 },
              { title: "ML Engineer", company: "GM", location: "Warren, MI", score: 84 },
            ].map((job) => (
              <div
                key={job.title}
                className="flex items-center justify-between rounded-xl border border-border-light p-3 card-hover cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-iron">{job.title}</p>
                  <p className="text-xs text-slate-muted">
                    {job.company} · {job.location}
                  </p>
                </div>
                <MatchRing score={job.score} size={42} strokeWidth={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Local Pulse */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine mb-4">
            Local Pulse
          </h3>
          <div className="space-y-3 stagger-children">
            {[
              { date: "24", month: "MAY", title: "Detroit AI Innovators Meetup", summary: "Deep dive into RAG architectures with local engineers." },
              { date: "01", month: "JUN", title: "Ann Arbor React Workshop", summary: "Hands-on Next.js 15 workshop for frontend devs." },
            ].map((event) => (
              <div
                key={event.title}
                className="flex gap-3 rounded-xl border border-border-light p-3 card-hover cursor-pointer"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-sage">
                  <span className="font-display text-lg font-bold text-pine leading-none">
                    {event.date}
                  </span>
                  <span className="text-[10px] font-semibold text-pine/60">
                    {event.month}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-iron truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-slate-muted line-clamp-2 mt-0.5">
                    {event.summary}
                  </p>
                  <button className="mt-1.5 text-[11px] font-semibold text-gold hover:text-gold-hover transition-colors">
                    RSVP →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Agent Status */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-pine mb-4">
            Agent Status
          </h3>
          <div className="space-y-4 stagger-children">
            <div className="rounded-xl border border-border-light p-3">
              <p className="text-sm font-semibold text-slate-iron mb-3">
                Frontend Dev @ StockX
              </p>
              <StatusTimeline
                nodes={[
                  { label: "Resume Analyzed", status: "completed" },
                  { label: "Drafting Intro...", status: "active" },
                  { label: "Referred to HR", status: "pending" },
                ]}
              />
            </div>
            <div className="rounded-xl border border-border-light p-3">
              <p className="text-sm font-semibold text-slate-iron mb-3">
                Data Engineer @ Rocket
              </p>
              <StatusTimeline
                nodes={[
                  { label: "Resume Analyzed", status: "completed" },
                  { label: "Pending Approval", status: "completed" },
                  { label: "Referred to HR", status: "active" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Component Showcase (for dev — will be removed) */}
      <div className="rounded-2xl border border-dashed border-border p-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-muted mb-4">
          UI Components Showcase
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Toggle label="Watsonx Auto-Curate" checked={aiToggle} onChange={setAiToggle} />
          <Badge>React</Badge>
          <Badge variant="gold">Connected Mobility</Badge>
          <Badge variant="success">Referral Available</Badge>
          <Badge variant="outline">Detroit Metro</Badge>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-pine px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-pine-light"
          >
            Test Modal
          </button>
        </div>
      </div>

      {/* Test Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Host an Event">
        <p className="text-sm text-slate-muted mb-4">
          Paste your raw event details, flyer text, or website link here.
        </p>
        <textarea
          className="w-full rounded-xl border border-border bg-surface-light p-4 text-sm text-slate-iron placeholder:text-slate-light outline-none focus:border-pine focus:ring-2 focus:ring-pine/10 resize-none"
          rows={5}
          placeholder="e.g. Detroit AI Meetup - June 15th at TechTown, 6pm. Join us for talks on RAG and autonomous agents..."
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-muted hover:bg-surface-light transition-colors"
          >
            Cancel
          </button>
          <button className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-pine-dark shadow-md hover:bg-gold-hover hover:shadow-gold-glow transition-all active:scale-[0.98]">
            Submit Event
          </button>
        </div>
      </Modal>
    </div>
  );
}
