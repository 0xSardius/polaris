"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { parsePillarsConfirmation } from "@/lib/utils";
import { CheckCircle, Target, Columns3, ArrowRight } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

export default function PillarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goalId = searchParams.get("goalId") as Id<"goals"> | null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [confirmedPillars, setConfirmedPillars] = useState<string[] | null>(null);

  // Fetch goal data
  const goal = useQuery(
    api.goals.getById,
    goalId ? { goalId } : "skip"
  );

  // Mutations
  const savePillars = useMutation(api.pillars.createBatch);

  // Chat setup
  const { messages, sendMessage, status, isLoading: hookIsLoading } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      // Extract content from message
      const content =
        typeof message.content === "string"
          ? message.content
          : message.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") || "";

      // Check for pillars confirmation
      const pillars = parsePillarsConfirmation(content);
      if (pillars) {
        setConfirmedPillars(pillars);
      }
    },
  });

  const isLoading = hookIsLoading ?? (status === "streaming" || status === "submitted" || status === "in_progress");

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Trigger initial suggestion when goal loads
  const hasTriggeredInitial = useRef(false);
  useEffect(() => {
    if (goal && !hasTriggeredInitial.current && messages.length === 0) {
      hasTriggeredInitial.current = true;
      // Send empty message to trigger AI to suggest pillars
      sendMessage({
        content: "Please suggest 8 pillars for my goal.",
        data: {
          context: "pillar_crafting",
          goal: goal.title,
        },
      });
    }
  }, [goal, messages.length, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && goal) {
      sendMessage({
        content: input,
        data: {
          context: "pillar_crafting",
          goal: goal.title,
        },
      });
      setInput("");
    }
  };

  const handleSavePillars = async () => {
    if (!confirmedPillars || !goalId) return;

    try {
      await savePillars({
        goalId,
        pillars: confirmedPillars.map((title) => ({ title })),
      });
      // Navigate to actions page
      router.push(`/actions?goalId=${goalId}`);
    } catch (error) {
      console.error("Failed to save pillars:", error);
    }
  };

  // Helper to get message content
  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (typeof message.content === "string") {
      return message.content;
    }
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  // Loading state while fetching goal
  if (!goalId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No goal specified. Please start from the craft page.</p>
      </div>
    );
  }

  if (goal === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Columns3 className="w-6 h-6 text-primary" />
            Define Your Pillars
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step 2 of 3: Choose 8 areas that support your goal
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <StepIndicator step={1} label="Goal" completed />
          <div className="w-8 h-0.5 bg-primary" />
          <StepIndicator step={2} label="Pillars" active />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator step={3} label="Actions" />
        </div>
      </div>

      {/* Goal reminder */}
      <div className="mb-4 p-3 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Target className="w-4 h-4" />
          <span>Your goal:</span>
          <span className="text-foreground font-medium">{goal?.title}</span>
        </div>
      </div>

      {/* Confirmed pillars banner */}
      {confirmedPillars && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">8 Pillars Confirmed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {confirmedPillars.map((pillar, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-secondary rounded text-sm"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleSavePillars}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue to Actions
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Chat interface */}
      <div className="flex-1 bg-card/50 rounded-xl border border-border overflow-hidden flex flex-col">
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
            placeholder="Accept the pillars, suggest changes, or ask questions..."
          />
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number;
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          completed
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary/20 text-primary border-2 border-primary"
              : "bg-secondary text-muted-foreground"
        }`}
      >
        {completed ? <CheckCircle className="w-4 h-4" /> : step}
      </div>
      <span
        className={`text-sm ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}
