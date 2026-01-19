"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  const isUser = role === "user";

  // Strip the confirmation markers from display
  const displayContent = content
    .replace(/---GOAL_CONFIRMED---[\s\S]*$/i, "")
    .replace(/---PILLAR_CONFIRMED---[\s\S]*$/i, "")
    .replace(/---ACTION_CONFIRMED---[\s\S]*$/i, "")
    .replace(/---MAPPING---[\s\S]*$/i, "")
    .trim();

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary/20 rounded-tr-sm text-foreground"
            : "bg-card rounded-tl-sm text-foreground"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
            <span
              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <span
              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {displayContent}
          </p>
        )}
      </div>
    </div>
  );
}
