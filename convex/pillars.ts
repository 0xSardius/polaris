import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByGoal = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pillars")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();
  },
});

export const getByGoalOrdered = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const pillars = await ctx.db
      .query("pillars")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();

    // Sort by position
    return pillars.sort((a, b) => a.position - b.position);
  },
});

export const createBatch = mutation({
  args: {
    goalId: v.id("goals"),
    pillars: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify goal exists and belongs to user
    const goal = await ctx.db.get(args.goalId);
    if (!goal) {
      throw new Error("Goal not found");
    }

    // Validate we have exactly 8 pillars
    if (args.pillars.length !== 8) {
      throw new Error("Must provide exactly 8 pillars");
    }

    // Delete any existing pillars for this goal
    const existingPillars = await ctx.db
      .query("pillars")
      .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
      .collect();

    for (const pillar of existingPillars) {
      await ctx.db.delete(pillar._id);
    }

    // Create all 8 pillars
    const pillarIds = [];
    for (let i = 0; i < args.pillars.length; i++) {
      const pillarId = await ctx.db.insert("pillars", {
        goalId: args.goalId,
        position: i + 1,
        title: args.pillars[i].title,
        description: args.pillars[i].description,
        createdAt: Date.now(),
      });
      pillarIds.push(pillarId);
    }

    // Update goal crafting step
    await ctx.db.patch(args.goalId, {
      craftingStep: "actions",
      updatedAt: Date.now(),
    });

    return pillarIds;
  },
});

export const update = mutation({
  args: {
    pillarId: v.id("pillars"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: { title?: string; description?: string } = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.pillarId, updates);
  },
});
