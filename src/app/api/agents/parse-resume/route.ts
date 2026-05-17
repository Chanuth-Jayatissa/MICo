import { generateText } from "ai";
import { openrouter, DEFAULT_MODEL, isAIConfigured } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function POST(req: Request) {
  try {
    let { resumeText, fileName } = await req.json();

    // If the input is a Data URL, decode it
    if (resumeText && resumeText.startsWith("data:")) {
      const isPdf = resumeText.startsWith("data:application/pdf");
      const base64Data = resumeText.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      if (isPdf) {
        try {
          const pdfData = await pdfParse(buffer);
          resumeText = pdfData.text;
        } catch (e) {
          console.error("PDF parsing failed", e);
          resumeText = buffer.toString("utf8"); // Fallback
        }
      } else {
        // For txt, doc, etc., just decode as text
        resumeText = buffer.toString("utf8");
      }
    }

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
      maxTokens: 2500,
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
- STRICTLY extract ONLY the skills explicitly mentioned in the resume text. Do NOT hallucinate or guess skills that are not present.
- Extract the candidate's full name from the resume.
- Extract 8-15 specific skills from the resume (only if they exist in the text).
- Infer the most likely current job title based on their experience.
- Map skills to 3-5 relevant Michigan industries (NOT limited to tech — include healthcare, manufacturing, education, trades, finance, agriculture, automotive, etc.).
- Set confidence: "high" if skills directly match, "medium" if adjacent, "low" if tangential.
- Be specific with industry names (e.g., "Automotive Manufacturing" not just "Manufacturing").`,
      prompt: `Parse this resume text and ONLY extract facts from it. Do not invent details.\n\nFilename: ${fileName}\n\n${resumeText || "No resume text provided."}`,
    });

    const cleanText = text.replace(/```(?:json)?/gi, "").trim();
    const parsed = JSON.parse(cleanText);
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
