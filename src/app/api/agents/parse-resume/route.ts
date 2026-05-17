import { generateText } from "ai";
import { openrouter, DEFAULT_MODEL, isAIConfigured } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { resumeText, fileName } = await req.json();

    if (!isAIConfigured()) {
      // Fallback: return generic parsed data
      return NextResponse.json({
        skills: ["Communication", "Problem Solving", "Organization", "Teamwork"],
        title: "Professional",
        industryAlignment: [
          { skills: "General skills", industry: "General / Cross-Industry", confidence: "medium" as const },
        ],
      });
    }

    const { text } = await generateText({
      model: openrouter(DEFAULT_MODEL),
      system: `You are a resume parser. Given a resume filename or text, extract structured information.
Return ONLY valid JSON with this exact structure:
{
  "fullName": "Candidate's Full Name",
  "skills": ["skill1", "skill2", ...],
  "title": "inferred job title",
  "industryAlignment": [
    { "skills": "Skill A + Skill B", "industry": "Industry Name", "confidence": "high|medium|low" }
  ]
}

Rules:
- Extract the candidate's full name from the resume
- Extract 8-15 specific skills from the resume
- Infer the most likely current job title
- Map skills to 3-5 relevant Michigan industries (NOT limited to tech — include healthcare, manufacturing, education, trades, finance, agriculture, automotive, etc.)
- Set confidence: "high" if skills directly match, "medium" if adjacent, "low" if tangential
- Be specific with industry names (e.g., "Automotive Manufacturing" not just "Manufacturing")`,
      prompt: `Parse this resume:\n\nFilename: ${fileName}\n\n${resumeText || "No resume text provided — infer from the filename and generate realistic skills for a Michigan professional."}`,
    });

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Resume parse agent error:", error);
    return NextResponse.json(
      {
        skills: ["Communication", "Problem Solving", "Organization"],
        title: "Professional",
        industryAlignment: [
          { skills: "General experience", industry: "Cross-Industry", confidence: "medium" },
        ],
      },
      { status: 200 }
    );
  }
}
