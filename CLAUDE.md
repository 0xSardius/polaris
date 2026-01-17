# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polaris is an AI-powered goal coaching app for the Encode Club "Commit To Change" Hackathon. Users transform resolutions into 64 trackable daily actions using the Ohtani/Harada Method (9x9 mandala grid: 1 goal → 8 pillars → 64 actions).

**Full PRD:** `docs/PRD.md`

## Commands

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run convex       # Start Convex dev server (run in separate terminal)
npm run build        # Production build
npm run lint         # ESLint
```

**Development requires both servers running:** Next.js (`npm run dev`) and Convex (`npm run convex`).

## Architecture

### Tech Stack
- **Framework:** Next.js 14 with App Router
- **Database:** Convex (real-time subscriptions)
- **Auth:** Clerk (wraps app in `src/app/layout.tsx`)
- **AI:** Claude via Vercel AI SDK (`@ai-sdk/anthropic`, `ai` packages)
- **Observability:** Opik by Comet
- **Styling:** Tailwind CSS with custom theme in `tailwind.config.ts`

### Data Flow
1. Clerk handles auth → user synced to Convex `users` table
2. Goal crafting wizard uses Vercel AI SDK's `useChat` hook → `/api/chat` route
3. AI responses parsed for structured data (see `parseGoalConfirmation`, `parsePillarConfirmation` in `src/lib/utils.ts`)
4. Convex mutations store goals/pillars/actions with real-time sync
5. Check-ins mapped to actions via `ACTION_MAPPING_PROMPT`, stored in `checkIns` and `actionActivity` tables
6. Heat map calculated from `actionActivity` timestamps using `getHeatLevel()`

### Database Schema (`convex/schema.ts`)
- `users` — Clerk user sync
- `goals` — Central goal with status (`crafting`|`active`|`completed`|`paused`)
- `pillars` — 8 per goal, position 1-8
- `actions` — 8 per pillar (64 total), denormalized `goalId` for queries
- `checkIns` — Natural language inputs with mapped action IDs
- `actionActivity` — Individual action completions for heat calculation
- `chatMessages` — Conversation history by context
- `coachingInterventions` — AI nudges with outcome tracking (for Opik)

### AI Prompts (`src/lib/ai/prompts.ts`)
Prompts use structured markers for parsing:
- `---GOAL_CONFIRMED---` with `goal:` field
- `---PILLAR_CONFIRMED---` with `pillar:` and `position:` fields
- `---ACTION_CONFIRMED---` with `action:` and `position:` fields
- `---MAPPING---` with `actions:` and `confidence:` fields

### Heat System
Heat levels: `cold` → `warming` → `warm` → `hot` → `fire`
- Calculated from days since activity + streak length
- Colors defined in `tailwind.config.ts` under `theme.extend.colors.heat`
- Utility functions in `src/lib/utils.ts`: `getHeatLevel()`, `getHeatColor()`, `getHeatScore()`

## Key Patterns

### Chat with AI
```tsx
import { useChat } from "ai/react";
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: "/api/chat",
  body: { context: "goal_crafting", goalId },
});
```

### Convex Queries/Mutations
```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
const goal = useQuery(api.goals.getActiveGoal);
const createGoal = useMutation(api.goals.create);
```

## Environment Variables

Copy `.env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `ANTHROPIC_API_KEY`
- `OPIK_API_KEY`, `OPIK_WORKSPACE`, `OPIK_PROJECT_NAME`
