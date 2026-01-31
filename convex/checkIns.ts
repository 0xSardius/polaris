import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    goalId: v.id("goals"),
    rawInput: v.string(),
    aiResponse: v.string(),
    mappedActionIds: v.array(v.id("actions")),
    mappingConfidence: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const userId = user._id;

    const now = Date.now();

    // Create the check-in record
    const checkInId = await ctx.db.insert("checkIns", {
      userId,
      goalId: args.goalId,
      rawInput: args.rawInput,
      aiResponse: args.aiResponse,
      mappedActionIds: args.mappedActionIds,
      mappingConfidence: args.mappingConfidence,
      createdAt: now,
    });

    // Record activity for each mapped action
    for (const actionId of args.mappedActionIds) {
      const action = await ctx.db.get(actionId);
      if (action) {
        await ctx.db.insert("actionActivity", {
          actionId,
          pillarId: action.pillarId,
          goalId: args.goalId,
          checkInId,
          timestamp: now,
        });
      }
    }

    return checkInId;
  },
});

export const getRecentByGoal = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_created", (q) => q.eq("goalId", args.goalId))
      .order("desc")
      .take(10);

    return checkIns;
  },
});

export const getToday = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_created", (q) => q.eq("goalId", args.goalId))
      .filter((q) => q.gte(q.field("createdAt"), startOfDay.getTime()))
      .order("desc")
      .collect();

    return checkIns;
  },
});
