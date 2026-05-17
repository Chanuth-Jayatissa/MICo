import { generateText } from "ai";
import { openrouter, DEFAULT_MODEL, isAIConfigured } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userSkills, userTitle, jobTitle, company, jobDescription, jobRequirements } =
      await req.json();

    if (!isAIConfigured()) {
      // Fallback: basic overlap match
      const overlap = (userSkills || []).filter((s: string) =>
        (jobRequirements || []).some(
          (r: string) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())
        )
      );
      const score = Math.min(95, Math.round((overlap.length / Math.max(jobRequirements?.length || 1, 1)) * 100));
      return NextResponse.json({
        matchScore: Math.max(score, 40),
        matchReasons: [`You have ${overlap.length} matching skills for this role.`],
        skillGaps: jobRequirements?.filter(
          (r: string) => !userSkills?.some((s: string) => s.toLowerCase().includes(r.toLowerCase()))
        ) || [],
      });
    }

    const { text } = await generateText({
      model: openrouter(DEFAULT_MODEL),
      system: `You are a job matching analyst for MICo, a Michigan community platform for ALL industries.
Analyze how well a candidate matches a job listing.

Return ONLY valid JSON:
{
  "matchScore": 0-100,
  "matchReasons": ["reason1", "reason2", "reason3"],
  "skillGaps": ["gap1", "gap2"]
}

Rules:
- matchScore: 90+ = excellent match, 70-89 = strong, 50-69 = moderate, <50 = stretch
- matchReasons: 2-3 specific, personalized reasons explaining WHY they match (reference their actual skills)
- skillGaps: 1-3 specific skills or certifications they should develop (with actionable suggestions)
- This applies to ANY industry — nursing, welding, teaching, engineering, finance, etc.
- Be honest about gaps but encouraging`,
      prompt: `Match analysis:
Candidate: ${userTitle || "Professional"}
Skills: ${(userSkills || []).join(", ")}
Job: ${jobTitle} at ${company}
Requirements: ${(jobRequirements || []).join(", ")}
Description: ${jobDescription || "Not provided"}`,
    });

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Match job agent error:", error);
    return NextResponse.json({
      matchScore: 70,
      matchReasons: ["Your experience shows potential for this role."],
      skillGaps: ["Review the job requirements for specific qualifications."],
    });
  }
}
