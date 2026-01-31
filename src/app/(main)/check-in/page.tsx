"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

type MappingResult = {
  mappedActionIds: string[];
  confidence: number;
  reasoning: string;
};

export default function CheckInPage() {
  const [input, setInput] = useState("");
  const [isMapping, setIsMapping] = useState(false);
  const [mappingResult, setMappingResult] = useState<MappingResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeGoal = useQuery(api.goals.getActiveGoal);
  const actionsWithPillars = useQuery(
    api.actions.getWithPillarInfo,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );
  const recentCheckIns = useQuery(
    api.checkIns.getRecentByGoal,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );

  const createCheckIn = useMutation(api.checkIns.create);

  // Handle submitting a check-in for mapping
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !actionsWithPillars || isMapping) return;

    setIsMapping(true);
    setError(null);
    setMappingResult(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input,
          actions: actionsWithPillars,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to map actions");
      }

      setMappingResult({
        mappedActionIds: data.mappedActionIds,
        confidence: data.confidence,
        reasoning: data.reasoning,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsMapping(false);
    }
  };

  // Handle confirming the mapping
  const handleConfirm = async () => {
    if (!mappingResult || !activeGoal) return;

    setIsMapping(true);
    setError(null);

    try {
      await createCheckIn({
        goalId: activeGoal._id,
        rawInput: input,
        aiResponse: mappingResult.reasoning,
        mappedActionIds: mappingResult.mappedActionIds as Id<"actions">[],
        mappingConfidence: mappingResult.confidence,
      });

      const actionCount = mappingResult.mappedActionIds.length;
      setSuccessMessage(
        actionCount > 0
          ? `Logged ${actionCount} action${actionCount > 1 ? "s" : ""}!`
          : "Check-in recorded!"
      );
      setInput("");
      setMappingResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save check-in");
    } finally {
      setIsMapping(false);
    }
  };

  // Handle canceling the mapping
  const handleCancel = () => {
    setMappingResult(null);
    setError(null);
  };

  // Loading state
  if (activeGoal === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // No active goal
  if (!activeGoal) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl p-8 border border-border text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Goal</h2>
          <p className="text-muted-foreground mb-4">
            You need to create and activate a goal before you can check in.
          </p>
          <Link
            href="/craft"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Your Goal
          </Link>
        </div>
      </div>
    );
  }

  // Get mapped action details
  const getMappedActions = () => {
    if (!mappingResult || !actionsWithPillars) return [];
    return actionsWithPillars.filter((a) =>
      mappingResult.mappedActionIds.includes(a.id)
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          Check In
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tell me what you did today, and I&apos;ll track it against your
          actions.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-card rounded-xl p-6 border border-border mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What did you accomplish today? (e.g., 'Went for a 30-minute run this morning and did my stretches afterward')"
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isMapping || !!mappingResult}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          {/* Submit button (when no mapping result) */}
          {!mappingResult && (
            <button
              type="submit"
              disabled={!input.trim() || isMapping || !actionsWithPillars}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isMapping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mapping to actions...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Log Check-In
                </>
              )}
            </button>
          )}
        </form>

        {/* Mapping Result */}
        {mappingResult && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Mapped Actions ({mappingResult.mappedActionIds.length})
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {Math.round(mappingResult.confidence * 100)}% confident
              </span>
            </div>

            {getMappedActions().length > 0 ? (
              <div className="space-y-2 mb-4">
                {getMappedActions().map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {action.pillar}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mb-4 p-3 bg-secondary/30 rounded-lg">
                No specific actions matched, but your check-in will still be
                recorded.
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4 italic">
              &quot;{mappingResult.reasoning}&quot;
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isMapping}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isMapping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Check-ins */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Recent Check-ins</h2>
        {recentCheckIns && recentCheckIns.length > 0 ? (
          <div className="space-y-3">
            {recentCheckIns.map((checkIn) => (
              <div
                key={checkIn._id}
                className={cn(
                  "p-3 rounded-lg border border-border",
                  checkIn.mappedActionIds.length > 0
                    ? "bg-secondary/30"
                    : "bg-background"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm">{checkIn.rawInput}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(checkIn.createdAt)}
                  </span>
                </div>
                {checkIn.mappedActionIds.length > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {checkIn.mappedActionIds.length} action
                    {checkIn.mappedActionIds.length > 1 ? "s" : ""} logged
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No check-ins yet. Start logging your progress!
          </p>
        )}
      </div>
    </div>
  );
}
