import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getDaysSince(timestamp: number | undefined): number {
  if (!timestamp) return Infinity;
  const now = Date.now();
  return Math.floor((now - timestamp) / (24 * 60 * 60 * 1000));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + "...";
}

// Heat level helpers
export type HeatLevel = "cold" | "warming" | "warm" | "hot" | "fire";

export function getHeatLevel(daysSince: number, streak: number): HeatLevel {
  if (streak >= 3) return "fire";
  if (daysSince <= 2) return "hot";
  if (daysSince <= 7) return "warm";
  if (daysSince <= 14) return "warming";
  return "cold";
}

export function getHeatColor(heat: HeatLevel): string {
  const colors: Record<HeatLevel, string> = {
    cold: "bg-heat-cold/50 text-slate-400",
    warming: "bg-heat-warming/50 text-blue-300",
    warm: "bg-heat-warm/70 text-amber-200",
    hot: "bg-heat-hot/80 text-white",
    fire: "bg-gradient-to-br from-amber-400 to-orange-500 text-white animate-pulse-slow",
  };
  return colors[heat];
}

export function getHeatScore(heat: HeatLevel): number {
  const scores: Record<HeatLevel, number> = {
    cold: 0,
    warming: 1,
    warm: 2,
    hot: 3,
    fire: 4,
  };
  return scores[heat];
}

export function heatLevelFromScore(score: number): HeatLevel {
  if (score >= 3.5) return "fire";
  if (score >= 2.5) return "hot";
  if (score >= 1.5) return "warm";
  if (score >= 0.5) return "warming";
  return "cold";
}

// Mandala grid position helpers
export function getGridPosition(pillarPosition: number, actionPosition: number): { row: number; col: number } {
  // This maps the pillar (1-8) and action (1-8) positions to the 9x9 grid
  // Center is (4,4) - the goal
  // Pillars occupy the inner ring
  // Actions fill the outer 3x3 regions
  
  const pillarPositions: Record<number, { row: number; col: number }> = {
    1: { row: 1, col: 4 },  // Top
    2: { row: 1, col: 7 },  // Top-right
    3: { row: 4, col: 7 },  // Right
    4: { row: 7, col: 7 },  // Bottom-right
    5: { row: 7, col: 4 },  // Bottom
    6: { row: 7, col: 1 },  // Bottom-left
    7: { row: 4, col: 1 },  // Left
    8: { row: 1, col: 1 },  // Top-left
  };
  
  // For now, return pillar position - action positioning is more complex
  return pillarPositions[pillarPosition] || { row: 4, col: 4 };
}

// Parse AI response for confirmed data
export function parseGoalConfirmation(response: string): string | null {
  const match = response.match(/---GOAL_CONFIRMED---\s*goal:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

export function parsePillarConfirmation(response: string): { pillar: string; position: number } | null {
  const pillarMatch = response.match(/---PILLAR_CONFIRMED---\s*pillar:\s*(.+)/i);
  const positionMatch = response.match(/position:\s*(\d+)/i);
  
  if (pillarMatch && positionMatch) {
    return {
      pillar: pillarMatch[1].trim(),
      position: parseInt(positionMatch[1], 10),
    };
  }
  return null;
}

export function parseActionConfirmation(response: string): { action: string; position: number } | null {
  const actionMatch = response.match(/---ACTION_CONFIRMED---\s*action:\s*(.+)/i);
  const positionMatch = response.match(/position:\s*(\d+)/i);
  
  if (actionMatch && positionMatch) {
    return {
      action: actionMatch[1].trim(),
      position: parseInt(positionMatch[1], 10),
    };
  }
  return null;
}

export function parseActionMapping(response: string): {
  mappedActionIds: string[];
  confidence: number;
  reasoning: string;
} | null {
  // ACTION_MAPPING_PROMPT returns JSON format
  try {
    // Try to extract JSON from the response (may have markdown code blocks)
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                      response.match(/(\{[\s\S]*\})/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1].trim());
      return {
        mappedActionIds: parsed.mappedActionIds || [],
        confidence: parsed.confidence || 0,
        reasoning: parsed.reasoning || "",
      };
    }

    // Try parsing the whole response as JSON
    const parsed = JSON.parse(response.trim());
    return {
      mappedActionIds: parsed.mappedActionIds || [],
      confidence: parsed.confidence || 0,
      reasoning: parsed.reasoning || "",
    };
  } catch {
    return null;
  }
}

export function parsePillarsConfirmation(response: string): string[] | null {
  const match = response.match(/---PILLARS_CONFIRMED---\s*pillars:\s*(.+)/i);

  if (match) {
    const pillarsStr = match[1].trim();
    // Split by comma, handling potential brackets
    const pillars = pillarsStr
      .replace(/^\[|\]$/g, "") // Remove surrounding brackets if present
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (pillars.length === 8) {
      return pillars;
    }
  }
  return null;
}
