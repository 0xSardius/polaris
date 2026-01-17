import { Id } from "../../convex/_generated/dataModel";

export type HeatLevel = "cold" | "warming" | "warm" | "hot" | "fire";

export type GoalStatus = "crafting" | "active" | "completed" | "paused";
export type CraftingStep = "goal" | "pillars" | "actions" | "complete";
export type ChatContext = "goal_crafting" | "pillar_crafting" | "action_crafting" | "check_in" | "coaching";
export type InterventionType = "cold_pillar_nudge" | "streak_celebration" | "pattern_observation" | "weekly_reflection" | "strategy_suggestion";

export interface User {
  _id: Id<"users">;
  clerkId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: number;
  onboardingComplete: boolean;
}

export interface Goal {
  _id: Id<"goals">;
  userId: Id<"users">;
  title: string;
  description?: string;
  targetDate?: number;
  status: GoalStatus;
  craftingStep: CraftingStep;
  createdAt: number;
  updatedAt: number;
}

export interface Pillar {
  _id: Id<"pillars">;
  goalId: Id<"goals">;
  position: number;
  title: string;
  description?: string;
  createdAt: number;
}

export interface Action {
  _id: Id<"actions">;
  pillarId: Id<"pillars">;
  goalId: Id<"goals">;
  position: number;
  title: string;
  description?: string;
  frequency?: string;
  createdAt: number;
}

export interface CheckIn {
  _id: Id<"checkIns">;
  userId: Id<"users">;
  goalId: Id<"goals">;
  rawInput: string;
  aiResponse: string;
  mappedActionIds: Id<"actions">[];
  mappingConfidence: number;
  createdAt: number;
}

export interface ActionActivity {
  _id: Id<"actionActivity">;
  actionId: Id<"actions">;
  pillarId: Id<"pillars">;
  goalId: Id<"goals">;
  checkInId: Id<"checkIns">;
  timestamp: number;
}

export interface ChatMessage {
  _id: Id<"chatMessages">;
  userId: Id<"users">;
  goalId?: Id<"goals">;
  context: ChatContext;
  role: "user" | "assistant";
  content: string;
  metadata?: any;
  createdAt: number;
}

export interface CoachingIntervention {
  _id: Id<"coachingInterventions">;
  userId: Id<"users">;
  goalId: Id<"goals">;
  type: InterventionType;
  pillarId?: Id<"pillars">;
  message: string;
  userResponded: boolean;
  responseLeadToAction?: boolean;
  createdAt: number;
}

// Heat Map Types
export interface ActionHeat {
  actionId: Id<"actions">;
  pillarId: Id<"pillars">;
  position: number;
  title: string;
  heat: HeatLevel;
  lastActivity?: number;
  streak: number;
  activityCount: number;
}

export interface PillarHeat {
  pillarId: Id<"pillars">;
  position: number;
  title: string;
  heat: HeatLevel;
  actions: ActionHeat[];
  averageHeat: number;
}

export interface MandalaHeatMap {
  goalId: Id<"goals">;
  goalTitle: string;
  goalHeat: HeatLevel;
  pillars: PillarHeat[];
  overallMomentum: number;
  currentStreak: number;
  lastUpdated: number;
}

// Coaching Context
export interface CoachingContext {
  goal: Goal;
  pillars: Pillar[];
  actions: Action[];
  heatMap: MandalaHeatMap;
  recentCheckIns: CheckIn[];
  coldPillars: Pillar[];
  hotPillars: Pillar[];
  currentStreak: number;
  patterns: string[];
}

// API Types
export interface ActionMappingResult {
  mappedActionIds: Id<"actions">[];
  confidence: number;
  reasoning: string;
}

export interface ChatCompletionRequest {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  context: ChatContext;
  goalId?: string;
}
