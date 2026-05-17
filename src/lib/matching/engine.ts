import type { Job } from "@/types/job";
import type { MicoEvent } from "@/types/event";
import type { UserProfile } from "@/types/user";

/**
 * Normalize a skill string for comparison.
 * "React.js" → "reactjs", "C++" → "c++", "REST APIs" → "rest apis"
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.js/g, "js")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if two skill strings are a semantic match.
 * Handles common aliases and partial matches.
 */
function skillsMatch(userSkill: string, reqSkill: string): boolean {
  const u = normalize(userSkill);
  const r = normalize(reqSkill);

  // Exact match
  if (u === r) return true;

  // One contains the other (e.g., "Python" matches "Python 3")
  if (u.includes(r) || r.includes(u)) return true;

  // Common aliases
  const aliases: Record<string, string[]> = {
    javascript: ["js", "ecmascript"],
    typescript: ["ts"],
    reactjs: ["react", "reactjs", "react js"],
    nextjs: ["next", "nextjs", "next js"],
    nodejs: ["node", "nodejs", "node js"],
    python: ["python3", "python 3"],
    sql: ["mysql", "postgresql", "postgres", "sqlite", "tsql"],
    css: ["css3", "tailwind css", "tailwindcss", "tailwind"],
    html: ["html5"],
    aws: ["amazon web services", "cloud (aws/gcp)", "cloud"],
    gcp: ["google cloud", "cloud (aws/gcp)", "cloud"],
    docker: ["containers", "containerization"],
    git: ["github", "version control"],
    "rest apis": ["restful", "api", "apis", "rest"],
    "machine learning": ["ml", "deep learning", "ai/ml"],
    "data analysis": ["data analytics", "analytics", "data modeling"],
    agile: ["scrum", "kanban", "agile methodology"],
    communication: ["written communication", "verbal communication", "parent communication"],
    leadership: ["team leadership", "management"],
    excel: ["excel/power bi", "microsoft excel", "spreadsheets"],
    "power bi": ["excel/power bi", "tableau", "data visualization"],
  };

  for (const [canonical, alts] of Object.entries(aliases)) {
    const group = [canonical, ...alts];
    if (group.some((a) => a === u || u.includes(a)) && group.some((a) => a === r || r.includes(a))) {
      return true;
    }
  }

  return false;
}

/**
 * Compute a dynamic match score between a user's skills and a job's requirements.
 * Returns score (0-100), matched skills, and gaps.
 */
export function computeJobMatch(
  userSkills: string[],
  job: Job
): { matchScore: number; matchReasons: string[]; skillGaps: string[] } {
  const reqs = job.requirements;
  if (!userSkills.length || !reqs.length) {
    return {
      matchScore: 0,
      matchReasons: ["Upload your resume to see how you match this role."],
      skillGaps: reqs.slice(0, 3),
    };
  }

  // Find overlapping and missing skills
  const matched: string[] = [];
  const gaps: string[] = [];

  for (const req of reqs) {
    const found = userSkills.some((s) => skillsMatch(s, req));
    if (found) {
      matched.push(req);
    } else {
      gaps.push(req);
    }
  }

  // Raw overlap percentage
  const rawScore = (matched.length / reqs.length) * 100;

  // Apply a curve: bonus for having 50%+ match, penalty for <30%
  let score: number;
  if (rawScore >= 70) {
    score = Math.min(98, 80 + (rawScore - 70) * 0.6); // 80-98 range
  } else if (rawScore >= 40) {
    score = 55 + (rawScore - 40) * 0.83; // 55-80 range
  } else if (rawScore > 0) {
    score = 20 + rawScore * 0.875; // 20-55 range
  } else {
    score = 15; // Minimum for any job with requirements
  }

  score = Math.round(score);

  // Generate personalized match reasons
  const matchReasons: string[] = [];
  if (matched.length > 0) {
    const topMatched = matched.slice(0, 3);
    matchReasons.push(
      `Your ${topMatched.join(", ")} experience directly matches ${job.company}'s requirements.`
    );
  }
  if (matched.length >= reqs.length * 0.7) {
    matchReasons.push(
      `You match ${matched.length} of ${reqs.length} required skills — a strong fit for this role.`
    );
  } else if (matched.length >= reqs.length * 0.4) {
    matchReasons.push(
      `You have ${matched.length} of ${reqs.length} required skills with room to grow.`
    );
  }
  if (job.industry && matchReasons.length < 2) {
    matchReasons.push(
      `This ${job.industry} role at ${job.company} is actively hiring in Michigan.`
    );
  }
  if (matchReasons.length === 0) {
    matchReasons.push(`This role at ${job.company} could be a career pivot opportunity.`);
  }

  // Generate actionable skill gaps
  const skillGaps = gaps.slice(0, 3).map((gap) => {
    return `${gap} — consider gaining experience or certification in this area.`;
  });

  return { matchScore: score, matchReasons, skillGaps };
}

/**
 * Compute event relevance based on user's industry alignment.
 */
export function computeEventMatch(
  userAlignment: UserProfile["industryAlignment"],
  event: MicoEvent
): number {
  if (!userAlignment?.length || !event.industry) return 50; // Neutral default

  // Check if any of the user's aligned industries match the event industry
  for (const alignment of userAlignment) {
    const userInd = normalize(alignment.industry);
    const eventInd = normalize(event.industry);

    if (userInd.includes(eventInd) || eventInd.includes(userInd)) {
      if (alignment.confidence === "high") return 95;
      if (alignment.confidence === "medium") return 80;
      return 65;
    }

    // Partial match (e.g., "Automotive Manufacturing" matches "Manufacturing")
    const userWords = userInd.split(/[\s/]+/);
    const eventWords = eventInd.split(/[\s/]+/);
    if (userWords.some((w) => eventWords.includes(w) && w.length > 3)) {
      if (alignment.confidence === "high") return 85;
      return 70;
    }
  }

  // Cross-industry events match everyone
  if (normalize(event.industry).includes("cross")) return 75;

  return 45; // Low relevance
}

/**
 * Recalculate all job matches for the given user profile.
 * Returns jobs with updated matchScore, matchReasons, and skillGaps.
 */
export function recalculateAllJobMatches(
  jobs: Job[],
  userProfile: UserProfile
): Job[] {
  return jobs.map((job) => {
    const { matchScore, matchReasons, skillGaps } = computeJobMatch(
      userProfile.skills,
      job
    );
    return { ...job, matchScore, matchReasons, skillGaps };
  });
}

/**
 * Recalculate all event match scores for the given user profile.
 */
export function recalculateAllEventMatches(
  events: MicoEvent[],
  userProfile: UserProfile
): MicoEvent[] {
  return events.map((event) => ({
    ...event,
    matchScore: computeEventMatch(userProfile.industryAlignment, event),
  }));
}
