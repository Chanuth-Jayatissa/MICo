"use client";

import { useState, useMemo } from "react";
import { useMico } from "@/lib/store/mico-store";
import MatchRing from "@/components/ui/MatchRing";
import AIPulse from "@/components/ui/AIPulse";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Sparkles,
  Bot,
  Plus,
  X,
  Clock,
  Zap,
} from "lucide-react";
import type { MicoEvent } from "@/types/event";

// Location labels
const locationLabels: Record<string, string> = {
  "detroit-metro": "Detroit Metro",
  "ann-arbor": "Ann Arbor",
  "grand-rapids": "Grand Rapids",
  "upper-peninsula": "Upper Peninsula",
  virtual: "Virtual",
};

// Event type labels & colors
const eventTypeConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  networking: { label: "Networking", color: "text-pine", bg: "bg-sage" },
  workshop: { label: "Workshop", color: "text-success", bg: "bg-success/10" },
  conference: { label: "Conference", color: "text-gold", bg: "bg-gold-50" },
  "career-fair": { label: "Career Fair", color: "text-pine", bg: "bg-sage" },
  training: { label: "Training", color: "text-success", bg: "bg-success/10" },
  community: { label: "Community", color: "text-slate-iron", bg: "bg-surface-light" },
  other: { label: "Other", color: "text-slate-muted", bg: "bg-surface-light" },
};

// Source icon labels
const sourceLabels: Record<string, string> = {
  ibm_rpa: "AI Agent",
  api: "via API",
  user_submitted: "Community Submitted",
};

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    time: date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export default function EventsPage() {
  const { state, toggleRsvp, isRsvpd, submitHostedEvent } = useMico();
  const { events: allEvents } = state;

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<MicoEvent | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [hostEventText, setHostEventText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoCurate, setAutoCurate] = useState(false);

  const filteredEvents = useMemo(() => {
    // When auto-curate is on, only sort by match score
    if (autoCurate) {
      return [...allEvents].sort(
        (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
      );
    }

    return allEvents
      .filter((event) => {
        const matchesSearch =
          search === "" ||
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase());
        const matchesLocation =
          locationFilter === "all" || event.locationType === locationFilter;
        const matchesType =
          typeFilter === "all" || event.eventType === typeFilter;
        return matchesSearch && matchesLocation && matchesType;
      })
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );
  }, [allEvents, search, locationFilter, typeFilter, autoCurate]);

  const handleHostSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      submitHostedEvent(hostEventText);
      setIsProcessing(false);
      setHostEventText("");
      setHostModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-pine">
            MICo Events: Michigan Community & Career
          </h1>
          <p className="mt-1 text-slate-muted">
            AI-curated calendar of networking events, career fairs, and professional development across all industries.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Toggle
            label="AI Auto-Curate"
            checked={autoCurate}
            onChange={setAutoCurate}
          />
          <button
            onClick={() => setHostModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-semibold text-pine-dark shadow-md transition-all duration-200 hover:bg-gold-hover hover:shadow-gold-glow active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Host Event
          </button>
        </div>
      </div>

      {/* Filter Bar - hidden when Auto-Curate is on */}
      {!autoCurate && (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card lg:flex-row lg:items-center animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-light py-2.5 pl-10 pr-4 text-sm text-slate-iron placeholder:text-slate-light outline-none transition-all focus:border-pine focus:ring-2 focus:ring-pine/10"
            />
          </div>

          {/* Location Filter */}
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

          {/* Type Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-light pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-surface-light py-2.5 pl-9 pr-9 text-sm text-slate-iron outline-none cursor-pointer transition-all focus:border-pine focus:ring-2 focus:ring-pine/10"
            >
              <option value="all">All Types</option>
              {Object.entries(eventTypeConfig).map(([key, conf]) => (
                <option key={key} value={key}>
                  {conf.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-light pointer-events-none" />
          </div>

          {/* Result Count */}
          <span className="text-xs font-medium text-slate-light whitespace-nowrap">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Auto-Curate banner */}
      {autoCurate && (
        <div className="rounded-2xl bg-sage p-4 shadow-card flex items-center gap-3 animate-fade-in-up">
          <Sparkles className="h-5 w-5 text-gold shrink-0" />
          <p className="text-sm text-slate-iron">
            <span className="font-semibold text-pine">Auto-Curate is on.</span>{" "}
            Events are ranked by your resume match score. Toggle off to use manual filters.
          </p>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filteredEvents.map((event, idx) => {
          const { day, month, time } = formatEventDate(event.eventDate);
          const typeConf = eventTypeConfig[event.eventType];

          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="group cursor-pointer rounded-2xl bg-white p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            >
              <div className="flex gap-4">
                {/* Date Block */}
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-sage group-hover:bg-sage-dark transition-colors">
                  <span className="font-display text-xl font-bold text-pine leading-none">
                    {day}
                  </span>
                  <span className="text-[10px] font-bold text-pine/60 uppercase tracking-wider">
                    {month}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-slate-iron group-hover:text-pine transition-colors leading-tight">
                      {event.title}
                    </h3>
                    {event.matchScore && event.matchScore >= 80 && (
                      <MatchRing
                        score={event.matchScore}
                        size={40}
                        strokeWidth={3}
                        className="shrink-0"
                      />
                    )}
                  </div>

                  {/* Meta */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location.split(",")[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {time}
                    </span>
                    {event.rsvpCount && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.rsvpCount} attending
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="default"
                      size="sm"
                      className={`${typeConf.bg} ${typeConf.color} border-transparent`}
                    >
                      {typeConf.label}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {locationLabels[event.locationType]}
                    </Badge>
                    <span className="flex items-center gap-1 text-[10px] italic text-slate-light">
                      <Bot className="h-3 w-3" />
                      Sourced autonomously via {sourceLabels[event.source]}
                    </span>
                  </div>

                  {/* AI Summary Preview */}
                  <p className="mt-3 text-sm text-slate-muted leading-relaxed line-clamp-2">
                    {event.aiSummary.whyAttend}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-card">
          <Calendar className="h-12 w-12 text-slate-light mb-4" />
          <p className="font-display text-lg font-semibold text-slate-iron">
            No events found
          </p>
          <p className="mt-1 text-sm text-slate-muted">
            Try adjusting your filters or{" "}
            <button
              onClick={() => {
                setSearch("");
                setLocationFilter("all");
                setTypeFilter("all");
              }}
              className="font-semibold text-pine hover:underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      )}

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        size="lg"
      >
        {selectedEvent && <EventDetail event={selectedEvent} toggleRsvp={toggleRsvp} rsvpd={isRsvpd(selectedEvent.id)} />}
      </Modal>

      {/* Host Event Modal */}
      <Modal
        isOpen={hostModalOpen}
        onClose={() => {
          setHostModalOpen(false);
          setHostEventText("");
          setIsProcessing(false);
        }}
        title="Host an Event"
      >
        <p className="text-sm text-slate-muted mb-4">
          Paste your raw event details, flyer text, or website link.
          MICo AI will extract the key information and publish it to the
          community.
        </p>
        <textarea
          value={hostEventText}
          onChange={(e) => setHostEventText(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-light p-4 text-sm text-slate-iron placeholder:text-slate-light outline-none focus:border-pine focus:ring-2 focus:ring-pine/10 resize-none"
          rows={6}
          placeholder="e.g. Detroit AI Meetup - June 15th at TechTown, 6pm. Join us for talks on RAG and autonomous agents..."
        />
        {isProcessing && (
          <div className="mt-3">
            <AIPulse label="MICo AI is extracting event details..." />
          </div>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setHostModalOpen(false);
              setHostEventText("");
            }}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-muted hover:bg-surface-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleHostSubmit}
            disabled={!hostEventText.trim() || isProcessing}
            className="rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-pine-dark shadow-md hover:bg-gold-hover hover:shadow-gold-glow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Submit Event"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ---- Event Detail Sub-Component ---- */

function EventDetail({ event, toggleRsvp, rsvpd }: { event: MicoEvent; toggleRsvp: (id: string) => void; rsvpd: boolean }) {
  const { day, month, time, full } = formatEventDate(event.eventDate);
  const typeConf = eventTypeConfig[event.eventType];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-sage">
          <span className="font-display text-xl font-bold text-pine leading-none">
            {day}
          </span>
          <span className="text-[10px] font-bold text-pine/60 uppercase tracking-wider">
            {month}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-slate-iron">
            {event.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {full} at {time}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-muted">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </div>
        </div>
        {event.matchScore && (
          <MatchRing score={event.matchScore} size={60} strokeWidth={4} />
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="default"
          className={`${typeConf.bg} ${typeConf.color} border-transparent`}
        >
          {typeConf.label}
        </Badge>
        <Badge variant="outline">
          {locationLabels[event.locationType]}
        </Badge>
        {event.rsvpCount && (
          <Badge variant="default">
            <Users className="h-3 w-3" />
            {event.rsvpCount} attending
          </Badge>
        )}
        <span className="flex items-center gap-1 text-xs text-slate-light ml-auto">
          <Bot className="h-3 w-3" />
          {sourceLabels[event.source]}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-iron leading-relaxed">
        {event.description}
      </p>

      {/* AI Summary Card */}
      <div className="rounded-xl bg-sage p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            AI Summary
          </span>
        </div>
        <div className="space-y-2.5">
          <div>
            <p className="text-xs font-semibold text-pine uppercase tracking-wide mb-0.5">
              Why Attend
            </p>
            <p className="text-sm text-slate-iron">{event.aiSummary.whyAttend}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-pine uppercase tracking-wide mb-0.5">
              Who&apos;s There
            </p>
            <p className="text-sm text-slate-iron">{event.aiSummary.whosThere}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-pine uppercase tracking-wide mb-0.5">
              The Vibe
            </p>
            <p className="text-sm text-slate-iron">{event.aiSummary.vibe}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => toggleRsvp(event.id)}
          className={`flex-1 rounded-xl py-3 font-semibold shadow-md transition-all active:scale-[0.98] ${
            rsvpd
              ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
              : "bg-gold text-pine-dark hover:bg-gold-hover hover:shadow-gold-glow"
          }`}
        >
          {rsvpd ? "RSVP'd ✓ — Click to Cancel" : "RSVP & Add to Calendar"}
        </button>
      </div>

      {/* Source Transparency */}
      <p className="text-[11px] italic text-slate-light flex items-center gap-1 justify-center">
        <Bot className="h-3 w-3" />
        Sourced autonomously via {sourceLabels[event.source]}
      </p>
    </div>
  );
}
