"use client";

import { useState, useCallback } from "react";
import { useMico } from "@/lib/store/mico-store";
import UploadZone from "@/components/ui/UploadZone";
import Toggle from "@/components/ui/Toggle";
import Badge from "@/components/ui/Badge";
import AIPulse from "@/components/ui/AIPulse";
import {
  Sparkles,
  FileText,
  MapPin,
  Building,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Edit3,
  X,
  Zap,
  Bot,
} from "lucide-react";
import type { IndustryAlignment } from "@/types/user";

// Confidence styling
const confidenceConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  high: {
    label: "Highly Aligned",
    color: "text-gold",
    bg: "bg-gold-50",
    border: "border-gold/30",
  },
  medium: {
    label: "Strong Fit",
    color: "text-pine",
    bg: "bg-sage",
    border: "border-pine/20",
  },
  low: {
    label: "Emerging",
    color: "text-slate-muted",
    bg: "bg-surface-light",
    border: "border-border",
  },
};

export default function ProfilePage() {
  const { state, updateProfile, addSkill, removeSkill, uploadResume } = useMico();
  const { userProfile: user, resumeFile } = state;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleFileUpload = useCallback(
    (file: File) => {
      setIsProcessing(true);
      // Simulate parsing delay
      setTimeout(() => {
        setIsProcessing(false);
        uploadResume(file.name);
      }, 2500);
    },
    [uploadResume]
  );

  const handleToggleRelocate = (checked: boolean) => {
    updateProfile({ openToRelocate: checked });
  };

  const handleToggleHybrid = (checked: boolean) => {
    updateProfile({ openToHybrid: checked });
  };

  const handleToggleReferrals = (checked: boolean) => {
    updateProfile({ availableForReferrals: checked });
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill) {
      addSkill(skill);
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="font-display text-3xl font-bold text-pine lg:text-4xl">
          Your MICo Identity
        </h1>
        <p className="mt-1 text-slate-muted">
          The data source for your personalized AI matching engine.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.05s" }}
      >
        <UploadZone
          onFileSelect={handleFileUpload}
          isProcessing={isProcessing}
          isComplete={user.resumeParsed}
          className="min-h-[160px]"
        />
      </div>

      {/* AI Status */}
      {user.resumeParsed && (
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <AIPulse label="Watsonx has parsed your resume and generated industry alignments. Matches are being updated." />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column: Skills & Preferences (2/5 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parsed Profile Card */}
          <div
            className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-3 mb-5">
              {/* Avatar */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage font-display text-xl font-bold text-pine">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-iron">
                  {user.fullName}
                </h3>
                <p className="text-sm text-slate-muted">{user.title}</p>
              </div>
            </div>

            <div className="border-t border-border-light pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                    Parsed Skills
                  </span>
                </div>
                {!isEditingSkills && (
                  <button
                    onClick={() => setIsEditingSkills(true)}
                    className="flex items-center gap-1 text-xs font-medium text-pine hover:text-pine-light transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                )}
              </div>

              {/* Skills Grid */}
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-iron transition-all ${
                      isEditingSkills ? "pr-1.5" : ""
                    }`}
                  >
                    {skill}
                    {isEditingSkills && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-slate-light hover:bg-error/10 hover:text-error transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add Skill Input */}
              {isEditingSkills && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 rounded-xl border border-border bg-surface-light px-3 py-2 text-sm text-slate-iron placeholder:text-slate-light outline-none focus:border-pine focus:ring-2 focus:ring-pine/10"
                  />
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="rounded-xl bg-pine px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-pine-light active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsEditingSkills(false)}
                    className="rounded-xl border border-border px-3 py-2 text-sm text-slate-muted hover:bg-surface-light transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MICo Preferences */}
          <div
            className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-4 w-4 text-pine" />
              <span className="text-xs font-semibold uppercase tracking-wider text-pine">
                Your MICo Preferences
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-border-light p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-muted" />
                  <div>
                    <p className="text-sm font-semibold text-slate-iron">
                      Open to Relocating within Michigan?
                    </p>
                    <p className="text-xs text-slate-light mt-0.5">
                      Receive opportunities across the state
                    </p>
                  </div>
                </div>
                <Toggle
                  label=""
                  checked={user.openToRelocate}
                  onChange={handleToggleRelocate}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border-light p-4">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-slate-muted" />
                  <div>
                    <p className="text-sm font-semibold text-slate-iron">
                      Open to Hybrid/On-Site in Detroit?
                    </p>
                    <p className="text-xs text-slate-light mt-0.5">
                      Include non-remote Detroit roles
                    </p>
                  </div>
                </div>
                <Toggle
                  label=""
                  checked={user.openToHybrid}
                  onChange={handleToggleHybrid}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border-light p-4 bg-sage-light">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gold" />
                  <div>
                    <p className="text-sm font-semibold text-slate-iron">
                      Available to give referrals?
                    </p>
                    <p className="text-xs text-slate-light mt-0.5">
                      Become an Insider on the Network tab
                    </p>
                  </div>
                </div>
                <Toggle
                  label=""
                  checked={user.availableForReferrals}
                  onChange={handleToggleReferrals}
                />
              </div>

              {user.availableForReferrals && (
                <div className="rounded-xl bg-gold-50 border border-gold/20 p-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gold shrink-0" />
                  <p className="text-xs text-slate-iron">
                    You&apos;re an active <span className="font-semibold text-gold">Insider</span>. AI-drafted referral
                    pitches from candidates will appear in your{" "}
                    <a
                      href="/network"
                      className="font-semibold text-pine underline"
                    >
                      Network Inbox
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Knowledge Graph (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Industry Alignment */}
          <div
            className="rounded-2xl bg-white p-5 shadow-card lg:p-6 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Bot className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                MICo Industry Alignment
              </span>
            </div>
            <p className="text-sm text-slate-muted mb-5">
              Watsonx translates your skills into Michigan&apos;s specific economic
              sectors for targeted matching.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {user.industryAlignment.map((alignment, index) => (
                <IndustryCard key={index} alignment={alignment} index={index} />
              ))}
            </div>

            {/* AI Transparency */}
            <div className="mt-5 rounded-xl bg-sage p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  How This Works
                </span>
              </div>
              <p className="text-sm text-slate-iron leading-relaxed">
                The IBM Granite LLM analyzes your parsed skills and experience
                to map them against Michigan&apos;s core industries — automotive,
                fintech, healthcare, and advanced manufacturing. This alignment
                drives your job and event recommendations across the entire
                platform.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className="grid gap-4 sm:grid-cols-3 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            {[
              {
                label: "Skills Parsed",
                value: user.skills.length.toString(),
                icon: Sparkles,
                color: "text-pine",
              },
              {
                label: "Industries Matched",
                value: user.industryAlignment.length.toString(),
                icon: TrendingUp,
                color: "text-gold",
              },
              {
                label: "Profile Strength",
                value: user.resumeParsed ? "Strong" : "Weak",
                icon: Shield,
                color: user.resumeParsed ? "text-success" : "text-error",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-border-light bg-white p-4 shadow-soft"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-light ${stat.color}`}
                >
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

          {/* Resume Status */}
          <div
            className="rounded-2xl bg-white p-5 shadow-card animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-pine" />
              <span className="text-xs font-semibold uppercase tracking-wider text-pine">
                Document Status
              </span>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-border-light p-4">
              {user.resumeParsed ? (
                <>
                  <CheckCircle className="h-8 w-8 text-success shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-iron">
                      Resume Successfully Parsed
                      {resumeFile && (
                        <span className="text-sm font-normal text-slate-muted ml-2">
                          ({resumeFile.name})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-slate-muted mt-0.5">
                      Document Extractor has analyzed your skills, experience,
                      and industry focus. Your profile is actively driving
                      recommendations.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FileText className="h-8 w-8 text-slate-light shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-iron">
                      No Resume Uploaded
                    </p>
                    <p className="text-sm text-slate-muted mt-0.5">
                      Upload your resume above to unlock AI-powered job
                      matching, event recommendations, and referral
                      personalization.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Industry Alignment Card ---- */

function IndustryCard({
  alignment,
  index,
}: {
  alignment: IndustryAlignment;
  index: number;
}) {
  const config = confidenceConfig[alignment.confidence];

  return (
    <div
      className={`group rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-300 hover:shadow-card hover:-translate-y-0.5`}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge
          variant={alignment.confidence === "high" ? "gold" : "default"}
          size="sm"
        >
          {config.label}
        </Badge>
        {alignment.confidence === "high" && (
          <Zap className="h-3.5 w-3.5 text-gold" />
        )}
      </div>

      <h4 className="font-display text-base font-bold text-slate-iron leading-tight">
        {alignment.industry}
      </h4>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-muted">
        <TrendingUp className="h-3 w-3" />
        <span>Based on: {alignment.skills}</span>
      </div>
    </div>
  );
}
