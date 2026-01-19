import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getActiveGoal = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("goals")
      .withIndex("by_status", (q) =>
        q.eq("userId", user._id).eq("status", "active")
      )
      .first();
  },
});

export const getCraftingGoal = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("goals")
      .withIndex("by_status", (q) =>
        q.eq("userId", user._id).eq("status", "crafting")
      )
      .first();
  },
});

export const getById = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.goalId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    targetDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check for existing crafting goal
    const existingCrafting = await ctx.db
      .query("goals")
      .withIndex("by_status", (q) =>
        q.eq("userId", user._id).eq("status", "crafting")
      )
      .first();

    if (existingCrafting) {
      // Update existing crafting goal instead of creating new
      await ctx.db.patch(existingCrafting._id, {
        title: args.title,
        description: args.description,
        targetDate: args.targetDate,
        updatedAt: Date.now(),
      });
      return existingCrafting._id;
    }

    return await ctx.db.insert("goals", {
      userId: user._id,
      title: args.title,
      description: args.description,
      targetDate: args.targetDate,
      status: "crafting",
      craftingStep: "goal",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateCraftingStep = mutation({
  args: {
    goalId: v.id("goals"),
    step: v.union(
      v.literal("goal"),
      v.literal("pillars"),
      v.literal("actions"),
      v.literal("complete")
    ),
  },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.goalId);
    if (!goal) {
      throw new Error("Goal not found");
    }

    await ctx.db.patch(args.goalId, {
      craftingStep: args.step,
      updatedAt: Date.now(),
    });
  },
});

export const activate = mutation({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const goal = await ctx.db.get(args.goalId);
    if (!goal) {
      throw new Error("Goal not found");
    }

    // Mark any existing active goal as paused
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (user) {
      const activeGoal = await ctx.db
        .query("goals")
        .withIndex("by_status", (q) =>
          q.eq("userId", user._id).eq("status", "active")
        )
        .first();

      if (activeGoal) {
        await ctx.db.patch(activeGoal._id, {
          status: "paused",
          updatedAt: Date.now(),
        });
      }

      // Mark onboarding complete
      await ctx.db.patch(user._id, {
        onboardingComplete: true,
      });
    }

    await ctx.db.patch(args.goalId, {
      status: "active",
      craftingStep: "complete",
      updatedAt: Date.now(),
    });
  },
});

export const updateTitle = mutation({
  args: {
    goalId: v.id("goals"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.goalId, {
      title: args.title,
      updatedAt: Date.now(),
    });
  },
});
