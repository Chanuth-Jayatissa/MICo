import { generateText } from "ai";
import { openrouter, DEFAULT_MODEL, isAIConfigured } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { candidateName, candidateTitle, candidateSkills, jobTitle, company, jobDescription } =
      await req.json();

    if (!isAIConfigured()) {
      // Fallback: template pitch
      const topSkills = (candidateSkills || []).slice(0, 3).join(", ");
      return NextResponse.json({
        pitch: `Hi Recruiting, I'd like to refer ${candidateName} for the ${jobTitle} role at ${company}. Their background in ${topSkills} demonstrates the exact skills needed for your team. Their recent experience shows the problem-solving ability that would be immediately valuable.`,
      });
    }

    const { text } = await generateText({
      model: openrouter(DEFAULT_MODEL),
      system: `You are a professional referral pitch writer for MICo, a Michigan community platform.
Write a warm, compelling referral email paragraph (3-5 sentences) that an insider would send to HR.

Rules:
- Address it to "Hi Recruiting" 
- Be specific about how the candidate's skills match the role
- Mention the company by name
- Sound natural and enthusiastic, not robotic
- Reference Michigan if relevant
- This is for ANY industry (tech, healthcare, manufacturing, education, trades, etc.)
- Return ONLY the pitch text, no JSON wrapping`,
      prompt: `Write a referral pitch for:
Candidate: ${candidateName} (${candidateTitle})
Skills: ${(candidateSkills || []).join(", ")}
Role: ${jobTitle} at ${company}
Job Description: ${jobDescription || "Not provided"}`,
    });

    return NextResponse.json({ pitch: text.trim() });
  } catch (error) {
    console.error("Draft pitch agent error:", error);
    const topSkills = ((await req.clone().json()).candidateSkills || []).slice(0, 3).join(", ");
    return NextResponse.json({
      pitch: `Hi Recruiting, I'd like to refer this candidate for the ${(await req.clone().json()).jobTitle} role. Their background makes them a strong fit for your team.`,
    });
  }
}
