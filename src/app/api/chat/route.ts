import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import {
  GOAL_CRAFTING_PROMPT,
  PILLAR_SUGGESTION_PROMPT,
  ACTION_SUGGESTION_PROMPT,
} from "@/lib/ai/prompts";
import { traceChatRequest } from "@/lib/opik/tracing";

export const maxDuration = 30;

// Helper to extract context from message content
function parseContextFromMessage(content: string): {
  context: string;
  goal?: string;
  pillar?: string;
} {
  // Check for pillar crafting pattern: "My goal is: "..." Please suggest 8 pillars"
  const pillarMatch = content.match(/My goal is: "([^"]+)".*(?:suggest|pillars)/i);
  if (pillarMatch) {
    return { context: "pillar_crafting", goal: pillarMatch[1] };
  }

  // Check for action crafting pattern with context markers
  const actionMarkerMatch = content.match(/\[GOAL:([^\]]+)\]\[PILLAR:([^\]]+)\]/);
  if (actionMarkerMatch) {
    return {
      context: "action_crafting",
      goal: actionMarkerMatch[1],
      pillar: actionMarkerMatch[2]
    };
  }

  // Default to goal crafting
  return { context: "goal_crafting" };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { messages: rawMessages } = body;

  // Convert v6 UI messages (with parts) to model messages (with content string)
  const messages = rawMessages.map((msg: {
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  }) => {
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }
    const textContent = msg.parts
      ?.filter((p) => p.type === "text" && p.text)
      .map((p) => p.text)
      .join("") || "";
    return { role: msg.role, content: textContent };
  });

  // Try to get context from body first (AI SDK may pass it)
  let context =
    body.data?.context ||
    body.context ||
    body.options?.body?.context;

  let goal =
    body.data?.goal ||
    body.goal ||
    body.options?.body?.goal;

  let pillar =
    body.data?.pillar ||
    body.pillar ||
    body.options?.body?.pillar;

  // If context not in body, parse from first user message
  if (!context && messages.length > 0) {
    const firstUserMessage = messages.find((m: { role: string }) => m.role === "user");
    if (firstUserMessage) {
      const parsed = parseContextFromMessage(firstUserMessage.content);
      context = parsed.context;
      goal = goal || parsed.goal;
      pillar = pillar || parsed.pillar;
    }
  }

  // Default to goal_crafting
  context = context || "goal_crafting";

  // Trace the request (fire-and-forget, never blocks or crashes)
  traceChatRequest({ context, messageCount: messages.length, goal, pillar });

  // Select the appropriate system prompt based on context
  let systemPrompt: string;

  switch (context) {
    case "pillar_crafting":
      systemPrompt = PILLAR_SUGGESTION_PROMPT(goal || "your goal", undefined);
      break;
    case "action_crafting":
      systemPrompt = ACTION_SUGGESTION_PROMPT(goal || "your goal", pillar || "this pillar");
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
