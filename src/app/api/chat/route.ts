import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import {
  GOAL_CRAFTING_PROMPT,
  PILLAR_SUGGESTION_PROMPT,
  ACTION_SUGGESTION_PROMPT,
} from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages: rawMessages } = body;

  // AI SDK v6 sends data in different locations depending on version/config
  // Check multiple possible locations for the context and goal
  const context =
    body.data?.context ||
    body.context ||
    body.options?.body?.context ||
    "goal_crafting";

  const goal =
    body.data?.goal ||
    body.goal ||
    body.options?.body?.goal;

  const pillar =
    body.data?.pillar ||
    body.pillar ||
    body.options?.body?.pillar;

  const conversationHistory =
    body.data?.conversationHistory ||
    body.conversationHistory ||
    body.options?.body?.conversationHistory;


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
  let systemPrompt: string;

  switch (context) {
    case "pillar_crafting":
      if (!goal) {
        throw new Error("Goal is required for pillar crafting");
      }
      systemPrompt = PILLAR_SUGGESTION_PROMPT(goal, conversationHistory);
      break;
    case "action_crafting":
      if (!goal || !pillar) {
        throw new Error("Goal and pillar are required for action crafting");
      }
      systemPrompt = ACTION_SUGGESTION_PROMPT(goal, pillar);
      break;
    case "goal_crafting":
    default:
      systemPrompt = GOAL_CRAFTING_PROMPT;
      break;
  }

  const result = await streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
