"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import {
  CheckCircle,
  Target,
  Columns3,
  Zap,
  Edit3,
  Sparkles,
} from "lucide-react";

type WizardStep = "goal" | "pillars" | "actions" | "complete";

const INITIAL_MESSAGE = `Welcome! I'm Polaris, your AI goal coach.

I'll help you transform your resolution into 64 actionable daily habits using the Ohtani Method—the same system that helped Shohei Ohtani become one of the greatest baseball players ever.

Let's start with your North Star goal. What's something meaningful you want to achieve? It could be a fitness goal, a career milestone, learning a new skill, or anything that matters to you.

Don't worry if it's vague right now—we'll refine it together.`;

export default function CraftPage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<WizardStep>("goal");
  const [goalId, setGoalId] = useState<Id<"goals"> | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalInputValue, setGoalInputValue] = useState("");
  const [pillars, setPillars] = useState<string[]>(Array(8).fill(""));
  const [showGoalInput, setShowGoalInput] = useState(false);

  // Check for existing crafting goal
  const existingGoal = useQuery(api.goals.getCraftingGoal);

  // Convex mutations
  const createGoal = useMutation(api.goals.create);
  const updateStep = useMutation(api.goals.updateCraftingStep);
  const savePillars = useMutation(api.pillars.createBatch);
  const activateGoal = useMutation(api.goals.activate);

  // Resume from existing crafting goal
  useEffect(() => {
    if (existingGoal) {
      setGoalId(existingGoal._id);
      setGoalTitle(existingGoal.title);
      if (existingGoal.craftingStep === "pillars") {
        setStep("pillars");
      } else if (existingGoal.craftingStep === "actions") {
        setStep("actions");
      } else if (existingGoal.craftingStep === "complete") {
        setStep("complete");
      }
    }
  }, [existingGoal]);

  // Handle goal confirmation
  const handleConfirmGoal = async () => {
    if (!goalInputValue.trim()) return;

    try {
      const id = await createGoal({ title: goalInputValue.trim() });
      setGoalId(id);
      setGoalTitle(goalInputValue.trim());
      await updateStep({ goalId: id, step: "pillars" });
      setStep("pillars");
      setShowGoalInput(false);
    } catch (error) {
      console.error("Failed to save goal:", error);
    }
  };

  // Handle pillars confirmation
  const handleConfirmPillars = async () => {
    if (!goalId) return;
    const filledPillars = pillars.filter((p) => p.trim());
    if (filledPillars.length !== 8) {
      alert("Please fill in all 8 pillars");
      return;
    }

    try {
      await savePillars({
        goalId,
        pillars: pillars.map((title) => ({ title: title.trim() })),
      });
      await updateStep({ goalId, step: "actions" });
      setStep("actions");
    } catch (error) {
      console.error("Failed to save pillars:", error);
    }
  };

  // Handle completing the wizard (skip actions for now)
  const handleActivateGoal = async () => {
    if (!goalId) return;
    try {
      await activateGoal({ goalId });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to activate goal:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {step === "goal" && <Target className="w-6 h-6 text-primary" />}
            {step === "pillars" && (
              <Columns3 className="w-6 h-6 text-primary" />
            )}
            {step === "actions" && <Zap className="w-6 h-6 text-primary" />}
            {step === "complete" && (
              <CheckCircle className="w-6 h-6 text-primary" />
            )}
            {step === "goal" && "Craft Your Goal"}
            {step === "pillars" && "Define Your Pillars"}
            {step === "actions" && "Plan Your Actions"}
            {step === "complete" && "Ready to Start!"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === "goal" && "Step 1 of 3: Define your North Star"}
            {step === "pillars" &&
              "Step 2 of 3: Choose 8 areas that support your goal"}
            {step === "actions" && "Step 3 of 3: Define actions for each pillar"}
            {step === "complete" && "Your mandala is ready!"}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          <StepIndicator
            step={1}
            label="Goal"
            active={step === "goal"}
            completed={step !== "goal"}
          />
          <div
            className={`w-8 h-0.5 ${step !== "goal" ? "bg-primary" : "bg-border"}`}
          />
          <StepIndicator
            step={2}
            label="Pillars"
            active={step === "pillars"}
            completed={step === "actions" || step === "complete"}
          />
          <div
            className={`w-8 h-0.5 ${step === "actions" || step === "complete" ? "bg-primary" : "bg-border"}`}
          />
          <StepIndicator
            step={3}
            label="Actions"
            active={step === "actions"}
            completed={step === "complete"}
          />
        </div>
      </div>

      {/* Step Content */}
      {step === "goal" && (
        <GoalStep
          goalInputValue={goalInputValue}
          setGoalInputValue={setGoalInputValue}
          showGoalInput={showGoalInput}
          setShowGoalInput={setShowGoalInput}
          onConfirm={handleConfirmGoal}
        />
      )}

      {step === "pillars" && (
        <PillarsStep
          goalTitle={goalTitle}
          goalId={goalId}
          pillars={pillars}
          setPillars={setPillars}
          onConfirm={handleConfirmPillars}
        />
      )}

      {step === "actions" && (
        <ActionsStep goalTitle={goalTitle} goalId={goalId} onComplete={handleActivateGoal} />
      )}

      {step === "complete" && (
        <CompleteStep goalTitle={goalTitle} onStart={handleActivateGoal} />
      )}
    </div>
  );
}

// =============================================================================
// GOAL STEP
// =============================================================================

function GoalStep({
  goalInputValue,
  setGoalInputValue,
  showGoalInput,
  setShowGoalInput,
  onConfirm,
}: {
  goalInputValue: string;
  setGoalInputValue: (v: string) => void;
  showGoalInput: boolean;
  setShowGoalInput: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [hasEngaged, setHasEngaged] = useState(false);

  const { messages, sendMessage, status, isLoading: hookIsLoading } = useChat({
    api: "/api/chat",
  });

  const isLoading =
    hookIsLoading ??
    (status === "streaming" ||
      status === "submitted" ||
      status === "in_progress");

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
        data: { context: "goal_crafting" },
      });
      setInput("");
      setHasEngaged(true);
    }
  };

  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (typeof message.content === "string") return message.content;
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 bg-card/50 rounded-xl border border-border overflow-hidden flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
        >
          {messages.length === 0 && (
            <ChatMessage role="assistant" content={INITIAL_MESSAGE} />
          )}
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

        <div className="p-4 border-t border-border">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            placeholder="Tell me about your goal..."
          />
        </div>
      </div>

      {/* Goal Confirmation Panel - only show after user has sent a message */}
      {hasEngaged && (
        <div className="bg-card rounded-xl border border-border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {!showGoalInput ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                When you're happy with your goal, click to confirm it:
              </div>
              <button
                onClick={() => setShowGoalInput(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                I'm Ready to Confirm My Goal
              </button>
            </div>
          ) : (
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Type your final goal statement:
            </label>
            <input
              type="text"
              value={goalInputValue}
              onChange={(e) => setGoalInputValue(e.target.value)}
              placeholder="e.g., Run a half marathon by June 2026"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowGoalInput(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!goalInputValue.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Goal
              </button>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PILLARS STEP
// =============================================================================

function PillarsStep({
  goalTitle,
  goalId,
  pillars,
  setPillars,
  onConfirm,
}: {
  goalTitle: string;
  goalId: Id<"goals"> | null;
  pillars: string[];
  setPillars: (p: string[]) => void;
  onConfirm: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const hasTriggeredInitial = useRef(false);
  const hasAutoFilled = useRef(false);

  const { messages, sendMessage, status, isLoading: hookIsLoading } = useChat({
    api: "/api/chat",
    onFinish: (response) => {
      // Only auto-fill once (on first AI response)
      if (hasAutoFilled.current) return;

      // AI SDK v6: Get content from response.messages array
      let content = "";

      if (response.messages && Array.isArray(response.messages)) {
        const lastAssistant = [...response.messages].reverse().find(
          (m: { role: string }) => m.role === "assistant"
        );

        if (lastAssistant) {
          // v6 format: check parts array first
          if (lastAssistant.parts && Array.isArray(lastAssistant.parts)) {
            content = lastAssistant.parts
              .filter((p: { type: string; text?: string }) => p.type === "text" && p.text)
              .map((p: { text: string }) => p.text)
              .join("");
          }
          // Fallback to content string
          else if (typeof lastAssistant.content === "string") {
            content = lastAssistant.content;
          }
        }
      }

      // Extract pillars from AI response
      // Expected format: "1. **Pillar Name** — explanation" or "1. Pillar Name - explanation"
      const pillarsFound: string[] = [];
      const lines = content.split("\n");

      for (const line of lines) {
        // Match: "1. **Name**" or "1. Name" with optional explanation after dash
        const boldMatch = line.match(/^\d+[\.\)]\s*\*\*([^*]+)\*\*/);
        if (boldMatch && boldMatch[1]) {
          pillarsFound.push(boldMatch[1].trim());
          continue;
        }

        // Fallback: "1. Name — explanation" or "1. Name - explanation"
        const plainMatch = line.match(/^\d+[\.\)]\s+([^—\-–\n]+)/);
        if (plainMatch && plainMatch[1]) {
          const name = plainMatch[1].trim();
          // Skip if it looks like a full sentence (explanation, not pillar name)
          if (name.length > 0 && name.length < 40 && !name.includes(".")) {
            pillarsFound.push(name);
          }
        }
      }

      // Auto-fill if we found at least 8 pillars
      if (pillarsFound.length >= 8) {
        hasAutoFilled.current = true;
        setPillars(pillarsFound.slice(0, 8));
      }
    },
  });

  const isLoading =
    hookIsLoading ??
    (status === "streaming" ||
      status === "submitted" ||
      status === "in_progress");

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Trigger initial pillar suggestion
  useEffect(() => {
    if (goalTitle && !hasTriggeredInitial.current && messages.length === 0) {
      hasTriggeredInitial.current = true;
      // Include goal in message content as fallback (data passing can be unreliable)
      sendMessage({
        content: `My goal is: "${goalTitle}"\n\nPlease suggest 8 pillars to support this goal.`,
        data: {
          context: "pillar_crafting",
          goal: goalTitle,
        },
      });
    }
  }, [goalTitle, messages.length, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({
        content: input,
        data: {
          context: "pillar_crafting",
          goal: goalTitle,
        },
      });
      setInput("");
    }
  };

  const handlePillarChange = (index: number, value: string) => {
    const newPillars = [...pillars];
    newPillars[index] = value;
    setPillars(newPillars);
  };

  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (typeof message.content === "string") return message.content;
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  const filledCount = pillars.filter((p) => p.trim()).length;

  return (
    <div className="flex-1 flex gap-4 overflow-hidden">
      {/* Left: Chat */}
      <div className="flex-1 flex flex-col bg-card/50 rounded-xl border border-border overflow-hidden">
        {/* Goal reminder */}
        <div className="p-3 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Your goal:</span>
            <span className="font-medium">{goalTitle}</span>
          </div>
        </div>

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

        <div className="p-4 border-t border-border">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            placeholder="Ask to change pillars, get explanations, or refine..."
          />
        </div>
      </div>

      {/* Right: Pillars Editor */}
      <div className="w-80 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Columns3 className="w-4 h-4" />
              Your 8 Pillars
            </h3>
            <span className="text-sm text-muted-foreground">
              {filledCount}/8
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Edit any pillar below. AI suggestions auto-fill when available.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pillars.map((pillar, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={pillar}
                onChange={(e) => handlePillarChange(index, e.target.value)}
                placeholder={`Pillar ${index + 1}...`}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onConfirm}
            disabled={filledCount !== 8}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm 8 Pillars
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ACTIONS STEP
// =============================================================================

function ActionsStep({
  goalTitle,
  goalId,
  onComplete,
}: {
  goalTitle: string;
  goalId: Id<"goals"> | null;
  onComplete: () => void;
}) {
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [actions, setActions] = useState<string[]>(Array(8).fill(""));
  const [completedPillars, setCompletedPillars] = useState<Set<number>>(new Set());

  // Fetch pillars for this goal
  const pillarsData = useQuery(
    api.pillars.getByGoalOrdered,
    goalId ? { goalId } : "skip"
  );

  // Mutation to save actions
  const saveActions = useMutation(api.actions.createBatch);

  const currentPillar = pillarsData?.[currentPillarIndex];

  // Reset actions when switching pillars
  useEffect(() => {
    setActions(Array(8).fill(""));
  }, [currentPillarIndex]);

  const handleConfirmActions = async () => {
    if (!goalId || !currentPillar) return;
    const filledActions = actions.filter((a) => a.trim());
    if (filledActions.length !== 8) {
      alert("Please fill in all 8 actions");
      return;
    }

    try {
      await saveActions({
        pillarId: currentPillar._id,
        goalId,
        actions: actions.map((title) => ({ title: title.trim() })),
      });

      // Mark this pillar as complete
      setCompletedPillars((prev) => new Set([...prev, currentPillarIndex]));

      // Move to next pillar or finish
      if (currentPillarIndex < 7) {
        setCurrentPillarIndex(currentPillarIndex + 1);
        setActions(Array(8).fill(""));
      }
    } catch (error) {
      console.error("Failed to save actions:", error);
    }
  };

  const allPillarsComplete = completedPillars.size === 8;

  if (!pillarsData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading pillars...</div>
      </div>
    );
  }

  if (allPillarsComplete) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">All 64 Actions Defined!</h2>
          <p className="text-muted-foreground mb-6">
            Your mandala is complete. You're ready to start tracking your progress.
          </p>
          <button
            onClick={onComplete}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            Activate My Goal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Pillar Progress Bar */}
      <div className="flex gap-2">
        {pillarsData.map((pillar, index) => (
          <button
            key={pillar._id}
            onClick={() => {
              setCurrentPillarIndex(index);
              setActions(Array(8).fill(""));
            }}
            className={`flex-1 p-2 rounded-lg text-xs font-medium transition-colors ${
              completedPillars.has(index)
                ? "bg-green-500/20 text-green-500 border border-green-500/30"
                : index === currentPillarIndex
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              {completedPillars.has(index) && <CheckCircle className="w-3 h-3" />}
              <span className="truncate">{pillar.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Current Pillar Actions */}
      {currentPillar && (
        <ActionEditor
          goalTitle={goalTitle}
          pillarTitle={currentPillar.title}
          pillarIndex={currentPillarIndex}
          actions={actions}
          setActions={setActions}
          onConfirm={handleConfirmActions}
        />
      )}
    </div>
  );
}

// =============================================================================
// ACTION EDITOR (for a single pillar)
// =============================================================================

function ActionEditor({
  goalTitle,
  pillarTitle,
  pillarIndex,
  actions,
  setActions,
  onConfirm,
}: {
  goalTitle: string;
  pillarTitle: string;
  pillarIndex: number;
  actions: string[];
  setActions: (a: string[]) => void;
  onConfirm: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  // Track which pillar we've triggered for (guards against Strict Mode double-invocation)
  const triggeredForPillarRef = useRef<number | null>(null);
  const autoFilledForPillarRef = useRef<number | null>(null);

  const { messages, sendMessage, status, isLoading: hookIsLoading, setMessages } = useChat({
    api: "/api/chat",
    id: `actions-${pillarIndex}`, // Unique chat per pillar
    onFinish: (response) => {
      // Only auto-fill once per pillar
      if (autoFilledForPillarRef.current === pillarIndex) return;

      // AI SDK v6: Get content from response.messages array
      let content = "";

      if (response.messages && Array.isArray(response.messages)) {
        const lastAssistant = [...response.messages].reverse().find(
          (m: { role: string }) => m.role === "assistant"
        );

        if (lastAssistant) {
          if (lastAssistant.parts && Array.isArray(lastAssistant.parts)) {
            content = lastAssistant.parts
              .filter((p: { type: string; text?: string }) => p.type === "text" && p.text)
              .map((p: { text: string }) => p.text)
              .join("");
          } else if (typeof lastAssistant.content === "string") {
            content = lastAssistant.content;
          }
        }
      }

      // Extract actions from AI response
      const actionsFound: string[] = [];
      const lines = content.split("\n");

      for (const line of lines) {
        const boldMatch = line.match(/^\d+[\.\)]\s*\*\*([^*]+)\*\*/);
        if (boldMatch && boldMatch[1]) {
          actionsFound.push(boldMatch[1].trim());
          continue;
        }

        const plainMatch = line.match(/^\d+[\.\)]\s+([^—\-–\n]+)/);
        if (plainMatch && plainMatch[1]) {
          const name = plainMatch[1].trim();
          if (name.length > 0 && name.length < 60 && !name.includes(". ")) {
            actionsFound.push(name);
          }
        }
      }

      if (actionsFound.length >= 8) {
        autoFilledForPillarRef.current = pillarIndex;
        setActions(actionsFound.slice(0, 8));
      }
    },
  });

  const isLoading =
    hookIsLoading ??
    (status === "streaming" ||
      status === "submitted" ||
      status === "in_progress");

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Trigger initial action suggestion (guards against React Strict Mode double-invocation)
  useEffect(() => {
    // Only trigger if we haven't already triggered for this specific pillar
    if (!pillarTitle || triggeredForPillarRef.current === pillarIndex) {
      return;
    }

    // Mark this pillar as triggered immediately (before any async work)
    triggeredForPillarRef.current = pillarIndex;

    // Clear previous messages and send new request
    setMessages([]);
    sendMessage({
      content: `My goal is: "${goalTitle}"\nPillar: "${pillarTitle}"\n\nPlease suggest 8 actions for this pillar.`,
      data: {
        context: "action_crafting",
        goal: goalTitle,
        pillar: pillarTitle,
      },
    });
  }, [pillarIndex, pillarTitle, goalTitle, sendMessage, setMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({
        content: input,
        data: {
          context: "action_crafting",
          goal: goalTitle,
          pillar: pillarTitle,
        },
      });
      setInput("");
    }
  };

  const handleActionChange = (index: number, value: string) => {
    const newActions = [...actions];
    newActions[index] = value;
    setActions(newActions);
  };

  const getMessageContent = (message: (typeof messages)[0]): string => {
    if (typeof message.content === "string") return message.content;
    return (
      message.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") || ""
    );
  };

  const filledCount = actions.filter((a) => a.trim()).length;

  return (
    <div className="flex-1 flex gap-4 overflow-hidden">
      {/* Left: Chat */}
      <div className="flex-1 flex flex-col bg-card/50 rounded-xl border border-border overflow-hidden">
        {/* Pillar header */}
        <div className="p-3 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Defining actions for:</span>
            <span className="font-medium">{pillarTitle}</span>
          </div>
        </div>

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

        <div className="p-4 border-t border-border">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            placeholder="Ask to change actions, get explanations, or refine..."
          />
        </div>
      </div>

      {/* Right: Actions Editor */}
      <div className="w-80 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              8 Actions
            </h3>
            <span className="text-sm text-muted-foreground">
              {filledCount}/8
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Daily habits for "{pillarTitle}"
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={action}
                onChange={(e) => handleActionChange(index, e.target.value)}
                placeholder={`Action ${index + 1}...`}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onConfirm}
            disabled={filledCount !== 8}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Confirm 8 Actions
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPLETE STEP
// =============================================================================

function CompleteStep({
  goalTitle,
  onStart,
}: {
  goalTitle: string;
  onStart: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">You're All Set!</h2>
        <p className="text-muted-foreground mb-2">Your goal:</p>
        <p className="font-medium text-lg mb-6">"{goalTitle}"</p>
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// STEP INDICATOR
// =============================================================================

function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
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
