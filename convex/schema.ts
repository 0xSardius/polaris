import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    onboardingComplete: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  goals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    status: v.union(
      v.literal("crafting"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("paused")
    ),
    craftingStep: v.union(
      v.literal("goal"),
      v.literal("pillars"),
      v.literal("actions"),
      v.literal("complete")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["userId", "status"]),

  pillars: defineTable({
    goalId: v.id("goals"),
    position: v.number(), // 1-8
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_goal", ["goalId"])
    .index("by_goal_position", ["goalId", "position"]),

  actions: defineTable({
    pillarId: v.id("pillars"),
    goalId: v.id("goals"), // Denormalized for easier queries
    position: v.number(), // 1-8
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.optional(v.string()), // "daily", "3x/week", etc.
    createdAt: v.number(),
  })
    .index("by_pillar", ["pillarId"])
    .index("by_goal", ["goalId"])
    .index("by_pillar_position", ["pillarId", "position"]),

  checkIns: defineTable({
    userId: v.id("users"),
    goalId: v.id("goals"),
    rawInput: v.string(),
    aiResponse: v.string(),
    mappedActionIds: v.array(v.id("actions")),
    mappingConfidence: v.number(), // 0-1
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_created", ["goalId", "createdAt"]),

  actionActivity: defineTable({
    actionId: v.id("actions"),
    pillarId: v.id("pillars"), // Denormalized
    goalId: v.id("goals"), // Denormalized
    checkInId: v.id("checkIns"),
    timestamp: v.number(),
  })
    .index("by_action", ["actionId"])
    .index("by_pillar", ["pillarId"])
    .index("by_goal", ["goalId"])
    .index("by_action_time", ["actionId", "timestamp"])
    .index("by_goal_time", ["goalId", "timestamp"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    goalId: v.optional(v.id("goals")),
    context: v.union(
      v.literal("goal_crafting"),
      v.literal("pillar_crafting"),
      v.literal("action_crafting"),
      v.literal("check_in"),
      v.literal("coaching")
    ),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(v.any()), // For storing structured data
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_context", ["userId", "context"]),

  coachingInterventions: defineTable({
    userId: v.id("users"),
    goalId: v.id("goals"),
    type: v.union(
      v.literal("cold_pillar_nudge"),
      v.literal("streak_celebration"),
      v.literal("pattern_observation"),
      v.literal("weekly_reflection"),
      v.literal("strategy_suggestion")
    ),
    pillarId: v.optional(v.id("pillars")),
    message: v.string(),
    userResponded: v.boolean(),
    responseLeadToAction: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_type", ["goalId", "type"]),
});
