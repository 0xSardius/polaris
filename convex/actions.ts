import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByPillar = query({
  args: { pillarId: v.id("pillars") },
  handler: async (ctx, args) => {
    const actions = await ctx.db
      .query("actions")
      .withIndex("by_pillar", (q) => q.eq("pillarId", args.pillarId))
      .collect();

    return actions.sort((a, b) => a.position - b.position);
  },
});

export const getByGoal = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actions")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();
  },
});

export const createBatch = mutation({
  args: {
    pillarId: v.id("pillars"),
    goalId: v.id("goals"),
    actions: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        frequency: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Validate we have exactly 8 actions
    if (args.actions.length !== 8) {
      throw new Error("Must provide exactly 8 actions");
    }

    // Delete any existing actions for this pillar
    const existingActions = await ctx.db
      .query("actions")
      .withIndex("by_pillar", (q) => q.eq("pillarId", args.pillarId))
      .collect();

    for (const action of existingActions) {
      await ctx.db.delete(action._id);
    }

    // Create all 8 actions
    const actionIds = [];
    for (let i = 0; i < args.actions.length; i++) {
      const actionId = await ctx.db.insert("actions", {
        pillarId: args.pillarId,
        goalId: args.goalId,
        position: i + 1,
        title: args.actions[i].title,
        description: args.actions[i].description,
        frequency: args.actions[i].frequency,
        createdAt: Date.now(),
      });
      actionIds.push(actionId);
    }

    return actionIds;
  },
});

export const markAllPillarsComplete = mutation({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    // Update goal crafting step to complete
    await ctx.db.patch(args.goalId, {
      craftingStep: "complete",
      updatedAt: Date.now(),
    });
  },
});
