"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { ChatInterface } from "@/components/chat";
import { useRouter } from "next/navigation";
import { CheckCircle, Target } from "lucide-react";

const INITIAL_MESSAGE = `Welcome! I'm Polaris, your AI goal coach.

I'll help you transform your resolution into 64 actionable daily habits using the Ohtani Method—the same system that helped Shohei Ohtani become one of the greatest baseball players ever.

Let's start with your North Star goal. What's something meaningful you want to achieve? It could be a fitness goal, a career milestone, learning a new skill, or anything that matters to you.

Don't worry if it's vague right now—we'll refine it together.`;

export default function CraftPage() {
  const router = useRouter();
  const craftingGoal = useQuery(api.goals.getCraftingGoal);
  const createGoal = useMutation(api.goals.create);
  const updateStep = useMutation(api.goals.updateCraftingStep);

  const handleGoalConfirmed = async (goalTitle: string) => {
    try {
      const goalId = await createGoal({ title: goalTitle });
      await updateStep({ goalId, step: "pillars" });
      // For now, just show success - pillars page coming later
    } catch (error) {
      console.error("Failed to save goal:", error);
    }
  };

  // Show current crafting state
  const currentStep = craftingGoal?.craftingStep || "goal";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Craft Your Goal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Step 1 of 3: Define your North Star
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <StepIndicator step={1} label="Goal" active={currentStep === "goal"} completed={currentStep !== "goal"} />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator step={2} label="Pillars" active={currentStep === "pillars"} completed={currentStep === "actions" || currentStep === "complete"} />
          <div className="w-8 h-0.5 bg-border" />
          <StepIndicator step={3} label="Actions" active={currentStep === "actions"} completed={currentStep === "complete"} />
        </div>
      </div>

      {/* Show confirmed goal if exists */}
      {craftingGoal && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-primary/30">
          <div className="flex items-center gap-2 text-primary mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Goal Confirmed</span>
          </div>
          <p className="text-foreground">{craftingGoal.title}</p>
        </div>
      )}

      {/* Chat interface */}
      <div className="flex-1 bg-card/50 rounded-xl border border-border overflow-hidden">
        <ChatInterface
          context="goal_crafting"
          goalId={craftingGoal?._id}
          onGoalConfirmed={handleGoalConfirmed}
          initialMessage={!craftingGoal ? INITIAL_MESSAGE : undefined}
        />
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
