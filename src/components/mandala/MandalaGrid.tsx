"use client";

import { Id } from "@convex/_generated/dataModel";
import { cn, getHeatLevel, HeatLevel } from "@/lib/utils";
import { useState } from "react";

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

interface MandalaGridProps {
  goalTitle: string;
  pillars: PillarData[];
  actions: ActionData[];
  activity?: ActivityData[];
  onCellClick?: (type: "goal" | "pillar" | "action", id?: string) => void;
}

// Map pillar position (1-8) to the center of its 3x3 region in the 9x9 grid
// Using 0-indexed grid coordinates
const PILLAR_REGION_CENTERS: Record<number, { row: number; col: number }> = {
  1: { row: 1, col: 4 }, // Top
  2: { row: 1, col: 7 }, // Top-right
  3: { row: 4, col: 7 }, // Right
  4: { row: 7, col: 7 }, // Bottom-right
  5: { row: 7, col: 4 }, // Bottom
  6: { row: 7, col: 1 }, // Bottom-left
  7: { row: 4, col: 1 }, // Left
  8: { row: 1, col: 1 }, // Top-left
};

// Map pillar position to its cell in the center 3x3 region (around the goal)
const PILLAR_CENTER_POSITIONS: Record<number, { row: number; col: number }> = {
  1: { row: 3, col: 4 }, // Top
  2: { row: 3, col: 5 }, // Top-right
  3: { row: 4, col: 5 }, // Right
  4: { row: 5, col: 5 }, // Bottom-right
  5: { row: 5, col: 4 }, // Bottom
  6: { row: 5, col: 3 }, // Bottom-left
  7: { row: 4, col: 3 }, // Left
  8: { row: 3, col: 3 }, // Top-left
};

// Action positions within a 3x3 region (relative offsets from center)
const ACTION_OFFSETS: Record<number, { row: number; col: number }> = {
  1: { row: -1, col: 0 },  // Top
  2: { row: -1, col: 1 },  // Top-right
  3: { row: 0, col: 1 },   // Right
  4: { row: 1, col: 1 },   // Bottom-right
  5: { row: 1, col: 0 },   // Bottom
  6: { row: 1, col: -1 },  // Bottom-left
  7: { row: 0, col: -1 },  // Left
  8: { row: -1, col: -1 }, // Top-left
};

function getHeatClass(heat: HeatLevel): string {
  return `heat-${heat}`;
}

function getDaysSince(timestamp: number | undefined): number {
  if (!timestamp) return Infinity;
  return Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
}

export function MandalaGrid({
  goalTitle,
  pillars,
  actions,
  activity = [],
  onCellClick,
}: MandalaGridProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Build a map of action activity for quick lookup
  const activityMap = new Map(
    activity.map((a) => [a.actionId, { lastActivity: a.lastActivity, streak: a.streak }])
  );

  // Build a map of actions by pillarId for quick lookup
  const actionsByPillar = new Map<string, ActionData[]>();
  for (const action of actions) {
    const pillarId = action.pillarId as string;
    if (!actionsByPillar.has(pillarId)) {
      actionsByPillar.set(pillarId, []);
    }
    actionsByPillar.get(pillarId)!.push(action);
  }

  // Sort actions within each pillar by position
  for (const pillarActions of actionsByPillar.values()) {
    pillarActions.sort((a, b) => a.position - b.position);
  }

  // Build the grid (9x9 = 81 cells)
  const grid: Array<{
    row: number;
    col: number;
    type: "goal" | "pillar" | "action" | "empty";
    data?: PillarData | ActionData;
    heat?: HeatLevel;
  }> = [];

  // Initialize all cells as empty
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid.push({ row, col, type: "empty" });
    }
  }

  const getIndex = (row: number, col: number) => row * 9 + col;

  // Place the goal in the center
  grid[getIndex(4, 4)] = { row: 4, col: 4, type: "goal" };

  // Place pillars in the center 3x3 region and their outer regions
  for (const pillar of pillars) {
    const centerPos = PILLAR_CENTER_POSITIONS[pillar.position];
    const regionCenter = PILLAR_REGION_CENTERS[pillar.position];

    if (centerPos) {
      // Pillar in center region (around goal)
      grid[getIndex(centerPos.row, centerPos.col)] = {
        row: centerPos.row,
        col: centerPos.col,
        type: "pillar",
        data: pillar,
      };
    }

    if (regionCenter) {
      // Pillar repeated in its own region center
      grid[getIndex(regionCenter.row, regionCenter.col)] = {
        row: regionCenter.row,
        col: regionCenter.col,
        type: "pillar",
        data: pillar,
      };

      // Place actions around the pillar in its region
      const pillarActions = actionsByPillar.get(pillar._id as string) || [];
      for (const action of pillarActions) {
        const offset = ACTION_OFFSETS[action.position];
        if (offset) {
          const actionRow = regionCenter.row + offset.row;
          const actionCol = regionCenter.col + offset.col;

          // Get heat level for this action
          const activityInfo = activityMap.get(action._id);
          const daysSince = getDaysSince(activityInfo?.lastActivity);
          const streak = activityInfo?.streak || 0;
          const heat = getHeatLevel(daysSince, streak);

          grid[getIndex(actionRow, actionCol)] = {
            row: actionRow,
            col: actionCol,
            type: "action",
            data: action,
            heat,
          };
        }
      }
    }
  }

  // Get tooltip text for a cell
  const getTooltip = (cell: (typeof grid)[0]): string => {
    if (cell.type === "goal") return goalTitle;
    if (cell.type === "pillar" && cell.data) return (cell.data as PillarData).title;
    if (cell.type === "action" && cell.data) return (cell.data as ActionData).title;
    return "";
  };

  return (
    <div className="relative">
      <div className="mandala-grid">
        {grid.map((cell, index) => {
          const cellId = `${cell.row}-${cell.col}`;
          const isHovered = hoveredCell === cellId;
          const tooltip = getTooltip(cell);

          return (
            <div
              key={index}
              className={cn(
                "mandala-cell",
                cell.type === "goal" && "mandala-cell-goal",
                cell.type === "pillar" && "mandala-cell-pillar",
                cell.type === "action" && cell.heat && getHeatClass(cell.heat),
                cell.type === "empty" && "bg-transparent",
                isHovered && cell.type !== "empty" && "ring-2 ring-primary"
              )}
              onMouseEnter={() => cell.type !== "empty" && setHoveredCell(cellId)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => {
                if (cell.type === "goal") {
                  onCellClick?.("goal");
                } else if (cell.type === "pillar" && cell.data) {
                  onCellClick?.("pillar", (cell.data as PillarData)._id);
                } else if (cell.type === "action" && cell.data) {
                  onCellClick?.("action", (cell.data as ActionData)._id);
                }
              }}
              title={tooltip}
            >
              {cell.type === "goal" && (
                <span className="truncate px-1">{truncate(goalTitle, 12)}</span>
              )}
              {cell.type === "pillar" && cell.data && (
                <span className="truncate px-0.5">
                  {truncate((cell.data as PillarData).title, 10)}
                </span>
              )}
              {cell.type === "action" && cell.data && (
                <span className="truncate px-0.5 text-[0.5rem]">
                  {truncate((cell.data as ActionData).title, 8)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm heat-cold" />
          <span>Cold</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm heat-warming" />
          <span>Warming</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm heat-warm" />
          <span>Warm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm heat-hot" />
          <span>Hot</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm heat-fire" />
          <span>Fire</span>
        </div>
      </div>
    </div>
  );
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + "…";
}
