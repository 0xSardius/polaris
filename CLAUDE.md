# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Status (Jan 28, 2026)

**Core flow is complete:** Goal → Pillars → Actions → Dashboard with mandala visualization.

### What's Working
- `/craft` — Single-page wizard: Goal chat → Pillars (AI suggests 8, editable) → Actions (8 per pillar, AI suggests)
- `/dashboard` — Mandala grid visualization with heat map styling, stats sidebar, pillar list
- Auth via Clerk, data persisted to Convex
- Resumable crafting (user can leave and return)

### Next Steps (Priority Order)
1. **Check-in flow** (`/check-in`) — Natural language input → AI maps to actions → store in `checkIns` + `actionActivity`
2. **Wire heat to activity** — Dashboard mandala currently shows all "cold"; needs to query `actionActivity` for real heat
3. **Deploy to Vercel** — Get public URL for hackathon demo

### Known Issues

**Must fix for check-in flow:**
- `ACTION_MAPPING_PROMPT` returns JSON but `parseActionMapping()` looks for `---MAPPING---` markers — standardize on JSON

**Low priority:**
- ESLint version mismatch (eslint-config-next v16 vs Next.js v15)
- Missing `.env.example`
- Debug `console.log` in `/api/chat/route.ts` — remove before production

See `SCRATCHPAD.md` for detailed session notes.

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

### Skills Reference
Use these skills when working on relevant areas of the codebase:

| Skill | When to Use |
|-------|-------------|
| `/ai-sdk-core` | Backend AI: `streamText`, `generateText`, API routes, error handling |
| `/ai-sdk-ui` | Frontend AI: `useChat`, `useCompletion`, `useObject` hooks, message handling |
| `/vercel-react-best-practices` | React/Next.js performance, data fetching, bundle optimization |
| `/prompt-engineering-patterns` | Designing or improving AI coaching prompts |
| `/web-design-guidelines` | UI review, accessibility, UX audit |

### Vercel AI SDK
**Always use the `/ai-sdk-core` and `/ai-sdk-ui` skills** when:
- Creating or modifying AI chat functionality
- Working with `useChat`, `useCompletion`, or `useObject` hooks
- Building API routes that use `streamText` or `generateText`
- Debugging AI SDK errors
- Reviewing AI-related code for correctness

These skills contain up-to-date patterns for AI SDK v5/v6 and prevent common mistakes like using deprecated APIs.

### AI Coach UX Design
Before building any new coaching flow (pillars, actions, check-ins, etc.):

1. **Analyze the user flow** — Map out each step the user takes. Identify friction points and where users might drop off.

2. **Design targeted prompts** — Each prompt should:
   - Have a clear, singular purpose
   - Guide without overwhelming
   - Use the user's own language/context from previous steps
   - Include examples that make the task concrete

3. **Minimize user effort** — The coach should:
   - Suggest rather than ask open-ended questions when possible
   - Offer smart defaults the user can accept or tweak
   - Batch related inputs (don't ask 8 separate questions for 8 pillars)
   - Celebrate progress to maintain momentum

4. **Test the conversation** — Before finalizing, simulate the full flow and ask:
   - Does this feel like a helpful coach or an interrogation?
   - Can a user complete this in one sitting without fatigue?
   - Are we respecting the user's time?
