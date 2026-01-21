import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { GOAL_CRAFTING_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages: rawMessages } = body;

  // In v5/v6, data comes from the message data field
  const context = body.data?.context || body.context || "goal_crafting";

  // Convert v6 UI messages (with parts) to model messages (with content string)
  const messages = rawMessages.map((msg: {
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  }) => {
    // If content exists as string, use it
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }
    // Otherwise extract text from parts
    const textContent = msg.parts
      ?.filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("") || "";
    return { role: msg.role, content: textContent };
  });

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

  return result.toUIMessageStreamResponse();
}
