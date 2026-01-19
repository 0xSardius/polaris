"use client";

import { useChat, Message } from "ai/react";
import { useEffect, useRef } from "react";
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

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: { context, goalId, pillarId },
      initialMessages: initialMessage
        ? [{ id: "initial", role: "assistant", content: initialMessage }]
        : undefined,
      onFinish: (message: Message) => {
        // Check for confirmations in the response
        if (context === "goal_crafting" && onGoalConfirmed) {
          const match = message.content.match(
            /---GOAL_CONFIRMED---\s*goal:\s*(.+)/i
          );
          if (match) {
            onGoalConfirmed(match[1].trim());
          }
        }

        if (context === "pillar_crafting" && onPillarConfirmed) {
          const pillarMatch = message.content.match(
            /---PILLAR_CONFIRMED---\s*pillar:\s*(.+)/i
          );
          const positionMatch = message.content.match(/position:\s*(\d+)/i);
          if (pillarMatch && positionMatch) {
            onPillarConfirmed(
              pillarMatch[1].trim(),
              parseInt(positionMatch[1], 10)
            );
          }
        }

        if (context === "action_crafting" && onActionConfirmed) {
          const actionMatch = message.content.match(
            /---ACTION_CONFIRMED---\s*action:\s*(.+)/i
          );
          const positionMatch = message.content.match(/position:\s*(\d+)/i);
          if (actionMatch && positionMatch) {
            onActionConfirmed(
              actionMatch[1].trim(),
              parseInt(positionMatch[1], 10)
            );
          }
        }
      },
    });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
            content={message.content}
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
          onChange={(value) =>
            handleInputChange({
              target: { value },
            } as React.ChangeEvent<HTMLTextAreaElement>)
          }
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
