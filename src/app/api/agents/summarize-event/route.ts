import { generateText } from "ai";
import { openrouter, DEFAULT_MODEL, isAIConfigured } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    if (!isAIConfigured()) {
      // Fallback: basic parsing
      const lines = (rawText || "").trim().split("\n");
      return NextResponse.json({
        title: lines[0]?.slice(0, 60) || "Community Event",
        description: rawText,
        location: "Michigan",
        locationType: "detroit-metro",
        eventType: "community",
        industry: "General",
        aiSummary: {
          whyAttend: "Community-submitted event with great networking opportunities.",
          whosThere: "Michigan professionals and community members.",
          vibe: "Welcoming atmosphere with opportunities to connect and learn.",
        },
      });
    }

    const { text } = await generateText({
      model: openrouter(DEFAULT_MODEL),
      system: `You are an event parser for MICo, a Michigan community platform for ALL industries.
Given raw text about an event, extract structured information.

Return ONLY valid JSON with this structure:
{
  "title": "Event Title",
  "description": "1-2 sentence description",
  "location": "Venue name and city",
  "locationType": "detroit-metro|ann-arbor|grand-rapids|upper-peninsula|virtual",
  "eventType": "networking|workshop|conference|career-fair|training|community|other",
  "industry": "specific industry (Healthcare, Manufacturing, Technology, Education, Trades, Finance, etc.)",
  "aiSummary": {
    "whyAttend": "1-2 sentences on value",
    "whosThere": "1-2 sentences on attendees",
    "vibe": "1-2 sentences on atmosphere"
  }
}

Rules:
- Infer location type from Michigan city names. Default to "detroit-metro" if unclear.
- Choose the most appropriate event type
- Identify the industry — this can be ANY field, not just tech
- Make the AI summary compelling and specific`,
      prompt: `Parse this event description:\n\n${rawText}`,
    });

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Summarize event agent error:", error);
    return NextResponse.json({
      title: "Community Event",
      description: "A community event in Michigan.",
      location: "Michigan",
      locationType: "detroit-metro",
      eventType: "community",
      industry: "General",
      aiSummary: {
        whyAttend: "Great networking opportunity.",
        whosThere: "Michigan professionals.",
        vibe: "Friendly and welcoming.",
      },
    });
  }
}
