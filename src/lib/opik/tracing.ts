import { getOpikClient } from "./client";

// Trace a chat conversation (fire-and-forget)
export function traceChatRequest(data: {
  context: string;
  messageCount: number;
  goal?: string;
  pillar?: string;
}) {
  try {
    const client = getOpikClient();
    if (!client) return;

    const trace = client.trace({
      name: `chat:${data.context}`,
      input: data,
    });

    // Fire and forget - end trace immediately
    trace.end();
    client.flush().catch(() => {}); // Silent fail
  } catch (e) {
    console.error("Opik trace failed (non-fatal):", e);
  }
}

// Trace a check-in mapping (fire-and-forget)
export function traceCheckInMapping(data: {
  userInput: string;
  actionCount: number;
  mappedCount: number;
  confidence: number;
}) {
  try {
    const client = getOpikClient();
    if (!client) return;

    const trace = client.trace({
      name: "check-in:mapping",
      input: { userInput: data.userInput, actionCount: data.actionCount },
      output: { mappedCount: data.mappedCount, confidence: data.confidence },
    });

    trace.end();
    client.flush().catch(() => {});
  } catch (e) {
    console.error("Opik trace failed (non-fatal):", e);
  }
}
