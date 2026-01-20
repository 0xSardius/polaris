import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { GOAL_CRAFTING_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  // Select the appropriate system prompt based on context
  let systemPrompt = GOAL_CRAFTING_PROMPT;

  // For now, we only support goal crafting
  // TODO: Add pillar_crafting, action_crafting, check_in contexts
  if (context === "goal_crafting") {
    systemPrompt = GOAL_CRAFTING_PROMPT;
  }

  const result = await streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
