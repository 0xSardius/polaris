import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { ACTION_MAPPING_PROMPT } from "@/lib/ai/prompts";
import { parseActionMapping } from "@/lib/utils";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { userInput, actions } = body;

  if (!userInput || !actions || !Array.isArray(actions)) {
    return Response.json(
      { error: "Missing userInput or actions" },
      { status: 400 }
    );
  }

  const systemPrompt = ACTION_MAPPING_PROMPT(userInput, actions);

  const result = await generateText({
    model: anthropic("claude-sonnet-4-5"),
    prompt: systemPrompt,
  });

  const parsed = parseActionMapping(result.text);

  if (!parsed) {
    return Response.json(
      {
        error: "Failed to parse AI response",
        rawResponse: result.text,
      },
      { status: 500 }
    );
  }

  return Response.json({
    mappedActionIds: parsed.mappedActionIds,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
    rawResponse: result.text,
  });
}
