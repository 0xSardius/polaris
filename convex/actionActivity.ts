import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByGoal = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actionActivity")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();
  },
});

export const getRecentByGoal = query({
  args: { goalId: v.id("goals"), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysBack = args.days ?? 7;
    const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;

    return await ctx.db
      .query("actionActivity")
      .withIndex("by_goal_time", (q) => q.eq("goalId", args.goalId))
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .collect();
  },
});

export const getByAction = query({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actionActivity")
      .withIndex("by_action", (q) => q.eq("actionId", args.actionId))
      .order("desc")
      .collect();
  },
});

export const getLatestByAction = query({
  args: { actionId: v.id("actions") },
  handler: async (ctx, args) => {
    const activity = await ctx.db
      .query("actionActivity")
      .withIndex("by_action_time", (q) => q.eq("actionId", args.actionId))
      .order("desc")
      .first();

    return activity;
  },
});

// Get activity summary for heat calculation
export const getHeatData = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get all activity for this goal
    const allActivity = await ctx.db
      .query("actionActivity")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();

    // Group by action and calculate metrics
    const actionMetrics: Record<
      string,
      { lastActivity: number; recentCount: number; streak: number }
    > = {};

    for (const activity of allActivity) {
      const actionId = activity.actionId;
      if (!actionMetrics[actionId]) {
        actionMetrics[actionId] = { lastActivity: 0, recentCount: 0, streak: 0 };
      }

      // Track latest activity
      if (activity.timestamp > actionMetrics[actionId].lastActivity) {
        actionMetrics[actionId].lastActivity = activity.timestamp;
      }

      // Count recent activity
      if (activity.timestamp >= sevenDaysAgo) {
        actionMetrics[actionId].recentCount++;
      }
    }

    // Calculate streaks (simplified: consecutive days with activity)
    for (const actionId of Object.keys(actionMetrics)) {
      const actionActivity = allActivity
        .filter((a) => a.actionId === actionId)
        .sort((a, b) => b.timestamp - a.timestamp);

      let streak = 0;
      let currentDay = new Date();
      currentDay.setHours(0, 0, 0, 0);

      for (let i = 0; i < 30; i++) {
        const dayStart = currentDay.getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;

        const hasActivity = actionActivity.some(
          (a) => a.timestamp >= dayStart && a.timestamp < dayEnd
        );

        if (hasActivity) {
          streak++;
        } else if (i > 0) {
          // Allow today to be skipped, but break on other gaps
          break;
        }

        currentDay.setDate(currentDay.getDate() - 1);
      }

      actionMetrics[actionId].streak = streak;
    }

    return actionMetrics;
  },
});
