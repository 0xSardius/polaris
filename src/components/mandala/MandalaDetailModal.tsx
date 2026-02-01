"use client";

import { Id } from "@convex/_generated/dataModel";
import { X, Target, Columns3, Zap, Flame, Calendar } from "lucide-react";
import { cn, getHeatLevel, getHeatColor } from "@/lib/utils";

type PillarData = {
  _id: Id<"pillars">;
  title: string;
  position: number;
};

type ActionData = {
  _id: Id<"actions">;
  pillarId: Id<"pillars">;
  title: string;
  position: number;
};

type ActivityData = {
  actionId: Id<"actions">;
  lastActivity?: number;
  streak: number;
};

interface MandalaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "goal" | "pillar" | "action";
  goalTitle: string;
  pillars: PillarData[];
  actions: ActionData[];
  activity: ActivityData[];
  selectedId?: string;
}

function formatLastActivity(timestamp: number | undefined): string {
  if (!timestamp) return "Never";
  const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function MandalaDetailModal({
  isOpen,
  onClose,
  type,
  goalTitle,
  pillars,
  actions,
  activity,
  selectedId,
}: MandalaDetailModalProps) {
  if (!isOpen) return null;

  // Build activity map for quick lookup
  const activityMap = new Map(
    activity.map((a) => [a.actionId as string, a])
  );

  // Get selected pillar or action
  const selectedPillar = type === "pillar"
    ? pillars.find((p) => p._id === selectedId)
    : type === "action"
    ? pillars.find((p) => p._id === actions.find((a) => a._id === selectedId)?.pillarId)
    : null;

  const selectedAction = type === "action"
    ? actions.find((a) => a._id === selectedId)
    : null;

  // Get actions for a pillar
  const getActionsForPillar = (pillarId: string) => {
    return actions
      .filter((a) => a.pillarId === pillarId)
      .sort((a, b) => a.position - b.position);
  };

  // Render goal detail
  const renderGoalDetail = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{goalTitle}</h3>
          <p className="text-sm text-muted-foreground mt-1">Your North Star Goal</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">8 Supporting Pillars</h4>
        <div className="grid grid-cols-2 gap-2">
          {pillars.sort((a, b) => a.position - b.position).map((pillar) => {
            const pillarActions = getActionsForPillar(pillar._id as string);
            const activeCount = pillarActions.filter((a) => {
              const act = activityMap.get(a._id as string);
              return act?.lastActivity && (Date.now() - act.lastActivity) < 7 * 24 * 60 * 60 * 1000;
            }).length;

            return (
              <div
                key={pillar._id}
                className="p-3 bg-secondary/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                    {pillar.position}
                  </span>
                  <span className="font-medium text-sm truncate">{pillar.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCount}/8 active this week
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render pillar detail
  const renderPillarDetail = () => {
    if (!selectedPillar) return null;
    const pillarActions = getActionsForPillar(selectedPillar._id as string);

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary rounded-lg">
            <Columns3 className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{selectedPillar.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pillar {selectedPillar.position} of 8
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">8 Daily Actions</h4>
          <div className="space-y-2">
            {pillarActions.map((action) => {
              const act = activityMap.get(action._id as string);
              const daysSince = act?.lastActivity
                ? Math.floor((Date.now() - act.lastActivity) / (24 * 60 * 60 * 1000))
                : Infinity;
              const heat = getHeatLevel(daysSince, act?.streak || 0);
              const heatColor = getHeatColor(heat);

              return (
                <div
                  key={action._id}
                  className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: heatColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{action.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatLastActivity(act?.lastActivity)}
                      </span>
                      {(act?.streak || 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {act?.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render action detail
  const renderActionDetail = () => {
    if (!selectedAction || !selectedPillar) return null;
    const act = activityMap.get(selectedAction._id as string);
    const daysSince = act?.lastActivity
      ? Math.floor((Date.now() - act.lastActivity) / (24 * 60 * 60 * 1000))
      : Infinity;
    const heat = getHeatLevel(daysSince, act?.streak || 0);
    const heatColor = getHeatColor(heat);

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${heatColor}33` }}
          >
            <Zap className="w-6 h-6" style={{ color: heatColor }} />
          </div>
          <div>
            <h3 className="text-xl font-bold">{selectedAction.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Action {selectedAction.position} of {selectedPillar.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Last Activity</span>
            </div>
            <p className="text-lg font-semibold">{formatLastActivity(act?.lastActivity)}</p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Current Streak</span>
            </div>
            <p className="text-lg font-semibold">
              {act?.streak || 0} {(act?.streak || 0) === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Heat Level</span>
            <span
              className="px-2 py-1 rounded text-xs font-medium capitalize"
              style={{ backgroundColor: `${heatColor}33`, color: heatColor }}
            >
              {heat}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                backgroundColor: heatColor,
                width: heat === "fire" ? "100%"
                  : heat === "hot" ? "80%"
                  : heat === "warm" ? "60%"
                  : heat === "warming" ? "40%"
                  : "20%",
              }}
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Complete this action in your next check-in to increase the heat!</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            {type === "goal" && <Target className="w-4 h-4 text-primary" />}
            {type === "pillar" && <Columns3 className="w-4 h-4" />}
            {type === "action" && <Zap className="w-4 h-4" />}
            {type === "goal" && "Goal Overview"}
            {type === "pillar" && "Pillar Details"}
            {type === "action" && "Action Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {type === "goal" && renderGoalDetail()}
          {type === "pillar" && renderPillarDetail()}
          {type === "action" && renderActionDetail()}
        </div>
      </div>
    </div>
  );
}
