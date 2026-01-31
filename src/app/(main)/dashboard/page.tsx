"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import Link from "next/link";
import { Target, Sparkles, MessageCircle, TrendingUp, Calendar, Check } from "lucide-react";
import { MandalaGrid } from "@/components/mandala/MandalaGrid";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrent);
  const activeGoal = useQuery(api.goals.getActiveGoal);

  // Fetch pillars and actions when we have an active goal
  const pillars = useQuery(
    api.pillars.getByGoalOrdered,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );
  const actions = useQuery(
    api.actions.getByGoal,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );

  // Fetch heat data and recent check-ins
  const heatData = useQuery(
    api.actionActivity.getHeatData,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );
  const recentCheckIns = useQuery(
    api.checkIns.getRecentByGoal,
    activeGoal ? { goalId: activeGoal._id } : "skip"
  );

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show onboarding state if no active goal
  if (!activeGoal) {
    return (
      <div className="max-w-4xl">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Your journey to achieving your goals starts here.
          </p>
        </div>

        {/* No goal state */}
        <div className="bg-card rounded-xl p-8 border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                Ready to set your goal?
              </h2>
              <p className="text-muted-foreground mb-4">
                Let&apos;s transform your resolution into 64 actionable daily
                habits using the Ohtani Method. I&apos;ll guide you through the
                process step by step.
              </p>
              <Link
                href="/craft"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Target className="w-4 h-4" />
                Start Crafting Your Goal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for goal data
  if (!pillars || !actions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading your mandala...</div>
      </div>
    );
  }

  // Calculate stats
  const totalActions = actions.length;
  const activatedDate = activeGoal.updatedAt;

  // Transform heat data for MandalaGrid
  const activityData = heatData
    ? Object.entries(heatData).map(([actionId, data]) => ({
        actionId: actionId as Id<"actions">,
        lastActivity: data.lastActivity || undefined,
        streak: data.streak,
      }))
    : [];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              {activeGoal.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Activated {formatRelativeTime(activatedDate)}
            </p>
          </div>
          <Link
            href="/check-in"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Check In
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mandala Grid */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4">Your Mandala</h2>
          <MandalaGrid
            goalTitle={activeGoal.title}
            pillars={pillars}
            actions={actions}
            activity={activityData}
            onCellClick={(type, id) => {
              console.log("Clicked:", type, id);
              // TODO: Show detail modal
            }}
          />
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  Actions Defined
                </span>
                <span className="font-semibold">{totalActions}/64</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  Pillars
                </span>
                <span className="font-semibold">{pillars.length}/8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Days Active
                </span>
                <span className="font-semibold">
                  {Math.max(1, Math.floor((Date.now() - activatedDate) / (24 * 60 * 60 * 1000)))}
                </span>
              </div>
            </div>
          </div>

          {/* Pillar List */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Pillars</h3>
            <div className="space-y-2">
              {pillars.map((pillar, index) => {
                const pillarActions = actions.filter(
                  (a) => a.pillarId === pillar._id
                );
                return (
                  <div
                    key={pillar._id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm truncate max-w-[140px]">{pillar.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {pillarActions.length} actions
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Activity</h3>
            {recentCheckIns && recentCheckIns.length > 0 ? (
              <div className="space-y-2">
                {recentCheckIns.slice(0, 5).map((checkIn) => (
                  <div
                    key={checkIn._id}
                    className="p-2 rounded-lg bg-secondary/30 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs truncate flex-1">{checkIn.rawInput}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(checkIn.createdAt)}
                      </span>
                    </div>
                    {checkIn.mappedActionIds.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" />
                        {checkIn.mappedActionIds.length} action{checkIn.mappedActionIds.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/check-in"
                  className="block text-center text-sm text-primary hover:underline pt-2"
                >
                  View all check-ins →
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center py-4">
                  No check-ins yet. Start tracking your progress!
                </p>
                <Link
                  href="/check-in"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  Record your first check-in →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
