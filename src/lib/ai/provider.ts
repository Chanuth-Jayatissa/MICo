import { createOpenAI } from "@ai-sdk/openai";

/**
 * OpenRouter AI provider — routes to any model (GPT-4o-mini, Claude, Llama, etc.)
 * via a single API key. Falls back gracefully if key is missing.
 */
export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  headers: {
    "X-OpenRouter-Title": "MICo Platform",
  },
});

/** Default model — free tier, auto-routes to best available free model. */
export const DEFAULT_MODEL = "openrouter/free";

/** Check if OpenRouter is configured */
export function isAIConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}
