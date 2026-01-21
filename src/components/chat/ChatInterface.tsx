"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  context: "goal_crafting" | "pillar_crafting" | "action_crafting" | "check_in";
  goalId?: string;
  pillarId?: string;
  onGoalConfirmed?: (goal: string) => void;
  onPillarConfirmed?: (pillar: string, position: number) => void;
  onActionConfirmed?: (action: string, position: number) => void;
  initialMessage?: string;
}

export function ChatInterface({
  context,
  goalId,
  pillarId,
  onGoalConfirmed,
  onPillarConfirmed,
  onActionConfirmed,
  initialMessage,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    api: "/api/chat",
    initialMessages: initialMessage
      ? [{
          id: "initial",
          role: "assistant" as const,
          content: initialMessage,
          parts: [{ type: "text" as const, text: initialMessage }],
        }]
      : undefined,
    onFinish: (message) => {
      // Get content from message - handle both string and parts formats
      const content =
        typeof message.content === "string"
          ? message.content
          : message.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") || "";

      // Check for confirmations in the response
      if (context === "goal_crafting" && onGoalConfirmed) {
        const match = content.match(/---GOAL_CONFIRMED---\s*goal:\s*(.+)/i);
        if (match) {
          onGoalConfirmed(match[1].trim());
        }
      }

      if (context === "pillar_crafting" && onPillarConfirmed) {
        const pillarMatch = content.match(
          /---PILLAR_CONFIRMED---\s*pillar:\s*(.+)/i
        );
        const positionMatch = content.match(/position:\s*(\d+)/i);
        if (pillarMatch && positionMatch) {
          onPillarConfirmed(
            pillarMatch[1].trim(),
            parseInt(positionMatch[1], 10)
          );
        }
      }

      if (context === "action_crafting" && onActionConfirmed) {
        const actionMatch = content.match(
          /---ACTION_CONFIRMED---\s*action:\s*(.+)/i
        );
        const positionMatch = content.match(/position:\s*(\d+)/i);
        if (actionMatch && positionMatch) {
          onActionConfirmed(
            actionMatch[1].trim(),
            parseInt(positionMatch[1], 10)
          );
        }
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({
        content: input,
        data: { context, goalId, pillarId },
      });
      setInput("");
    }
  };

  // Helper to get message content
  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (typeof message.content === "string") {
      return message.content;
    }
    // v6 format with parts
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role as "user" | "assistant"}
            content={getMessageContent(message)}
          />
        ))}
        {isLoading && (
          <ChatMessage role="assistant" content="" isLoading={true} />
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          placeholder={
            context === "goal_crafting"
              ? "Tell me about your goal..."
              : context === "check_in"
                ? "What did you work on today?"
                : "Type your message..."
          }
        />
      </div>
    </div>
  );
}
