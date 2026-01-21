# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Status

See `SCRATCHPAD.md` for build progress and session notes.

## Known Issues (Codebase Review - Jan 2026)

### Missing Files (Week 2+)
- `src/components/mandala/MiniMap.tsx` — Heat map visualization
- `src/lib/opik/client.ts` — Observability integration
- `docs/PRD.md` — Full product requirements document
- Pillar crafting flow (pages + Convex functions)
- Action crafting flow (pages + Convex functions)

### Configuration Issues
- **ESLint version mismatch:** `eslint-config-next` is v16.x but Next.js is v15.x — update to `^15.1.6`
- **Missing `.env.example`:** Was deleted, needs recreation for onboarding

### Logic Inconsistency
- **Action mapping parser mismatch:** `ACTION_MAPPING_PROMPT` in `src/lib/ai/prompts.ts` expects JSON response format, but `parseActionMapping()` in `src/lib/utils.ts` looks for text markers (`---MAPPING---`). Need to standardize on one approach.

### Low: Cleanup
- **Autoprefixer:** Can be removed from devDependencies (Tailwind v4 handles this internally)
- **Git line endings:** Add `.gitattributes` with `* text=auto eol=lf` for cross-platform consistency

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
- **Framework:** Next.js 15 with App Router (React 19)
- **Database:** Convex (real-time subscriptions)
- **Auth:** Clerk (wraps app in `src/app/layout.tsx`)
- **AI:** Claude via Vercel AI SDK (`@ai-sdk/anthropic`, `ai` packages)
- **Observability:** Opik by Comet
- **Styling:** Tailwind CSS v4 with theme defined in `src/app/globals.css` (using `@theme` directive)

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
- Colors defined in `src/app/globals.css` under `@theme` (e.g., `--color-heat-cold`)
- CSS classes: `.heat-cold`, `.heat-warming`, `.heat-warm`, `.heat-hot`, `.heat-fire`
- Utility functions in `src/lib/utils.ts`: `getHeatLevel()`, `getHeatColor()`, `getHeatScore()`

## Key Patterns

### Chat with AI (v5/v6 pattern)
```tsx
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const [input, setInput] = useState("");
const { messages, sendMessage, status } = useChat({
  api: "/api/chat",
});

// Send message with data
sendMessage({
  content: input,
  data: { context: "goal_crafting", goalId },
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

## Git

- Remote is configured; pushing is allowed
- Do not add "Co-Authored-By" lines to commit messages

## Rules

### Vercel AI SDK
**Always use the `/ai-sdk-core` and `/ai-sdk-ui` skills** when:
- Creating or modifying AI chat functionality
- Working with `useChat`, `useCompletion`, or `useObject` hooks
- Building API routes that use `streamText` or `generateText`
- Debugging AI SDK errors
- Reviewing AI-related code for correctness

These skills contain up-to-date patterns for AI SDK v5/v6 and prevent common mistakes like using deprecated APIs.
