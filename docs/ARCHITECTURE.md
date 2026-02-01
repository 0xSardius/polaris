# Polaris Architecture

High-level overview of the software architecture and user flow.

## Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 15 (App Router) + React 19 + Tailwind CSS v4       │
│  └── @ai-sdk/react (useChat hook for AI conversations)      │
├─────────────────────────────────────────────────────────────┤
│                         AUTH                                 │
│  Clerk (handles login, syncs user to Convex)                │
├─────────────────────────────────────────────────────────────┤
│                       BACKEND                                │
│  Convex (real-time database + serverless functions)         │
│  └── Tables: users, goals, pillars, actions,                │
│              checkIns, actionActivity                        │
├─────────────────────────────────────────────────────────────┤
│                         AI                                   │
│  Claude (via Vercel AI SDK @ai-sdk/anthropic)               │
│  └── /api/chat (goal/pillar/action crafting)                │
│  └── /api/check-in (maps natural language → actions)        │
└─────────────────────────────────────────────────────────────┘
```

## Data Model (Ohtani/Harada Method)

The app implements the Ohtani/Harada Method - a goal-setting framework where one central goal is supported by 8 pillars, each with 8 daily actions (64 total).

```
                    ┌──────────┐
                    │   GOAL   │  (1 per user, active)
                    │ "Run a   │
                    │marathon" │
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ PILLAR 1│ ...  │ PILLAR 4│ ...  │ PILLAR 8│  (8 pillars)
   │"Cardio" │      │"Nutrition│      │"Mental" │
   └────┬────┘      └────┬────┘      └────┬────┘
        │                │                │
   ┌────┴────┐      ┌────┴────┐      ┌────┴────┐
   │8 ACTIONS│      │8 ACTIONS│      │8 ACTIONS│  (64 total)
   │per pillar│     │per pillar│     │per pillar│
   └─────────┘      └─────────┘      └─────────┘
```

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. CRAFT YOUR GOAL (/craft)                                │
│     ┌──────────────────────────────────────────────┐        │
│     │ User chats with AI coach about their goal    │        │
│     │ → AI helps refine into clear statement       │        │
│     │ → User confirms: "Run a half marathon"       │        │
│     └──────────────────────────────────────────────┘        │
│                          ▼                                   │
│  2. DEFINE 8 PILLARS                                        │
│     ┌──────────────────────────────────────────────┐        │
│     │ AI suggests 8 supporting pillars             │        │
│     │ → User can edit/customize each               │        │
│     │ → e.g., Cardio, Strength, Nutrition...       │        │
│     └──────────────────────────────────────────────┘        │
│                          ▼                                   │
│  3. DEFINE 64 ACTIONS (8 per pillar)                        │
│     ┌──────────────────────────────────────────────┐        │
│     │ For each pillar, AI suggests 8 daily actions │        │
│     │ → User can edit/customize                    │        │
│     │ → e.g., "Run 3 miles", "Do stretches"        │        │
│     └──────────────────────────────────────────────┘        │
│                          ▼                                   │
│  4. ACTIVATE → DASHBOARD (/dashboard)                       │
│     ┌──────────────────────────────────────────────┐        │
│     │ 9x9 Mandala Grid showing goal + 8 pillars    │        │
│     │ + 64 actions with HEAT visualization         │        │
│     │ (cold=gray → fire=bright based on activity)  │        │
│     └──────────────────────────────────────────────┘        │
│                          ▼                                   │
│  5. DAILY CHECK-IN (/check-in)                              │
│     ┌──────────────────────────────────────────────┐        │
│     │ User types: "Went for a 5k run today"        │        │
│     │ → AI maps to relevant actions automatically  │        │
│     │ → Updates actionActivity → heat increases    │        │
│     └──────────────────────────────────────────────┘        │
│                          │                                   │
│                          └──────── loops back to 4 ─────────│
└─────────────────────────────────────────────────────────────┘
```

## Heat System (Activity Visualization)

The heat system provides visual feedback on how consistently users are working on each action.

```
Activity Level:     cold → warming → warm → hot → fire
                    (gray)  (blue)  (yellow)(orange)(red)
```

**Calculated from:**
- Days since last activity on that action
- Streak length (consecutive days)

**Displayed on:** Mandala grid cells (each of 64 actions has a heat color)

## Key Files

```
src/
├── app/
│   ├── (main)/
│   │   ├── craft/page.tsx      # Goal wizard (3 steps)
│   │   ├── dashboard/page.tsx  # Mandala + stats
│   │   └── check-in/page.tsx   # Daily logging
│   └── api/
│       ├── chat/route.ts       # AI for crafting
│       └── check-in/route.ts   # AI for action mapping
├── components/
│   ├── mandala/MandalaGrid.tsx # 9x9 visualization
│   └── chat/                   # Chat UI components
└── lib/
    ├── ai/prompts.ts           # All AI system prompts
    └── utils.ts                # Heat calculations

convex/
├── schema.ts                   # Database schema
├── goals.ts                    # Goal CRUD
├── pillars.ts                  # Pillar CRUD
├── actions.ts                  # Action CRUD
├── checkIns.ts                 # Check-in storage
└── actionActivity.ts           # Heat data queries
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Clerk user sync |
| `goals` | Central goal with status (crafting/active/completed/paused) |
| `pillars` | 8 per goal, position 1-8 |
| `actions` | 8 per pillar (64 total), denormalized goalId |
| `checkIns` | Natural language inputs with mapped action IDs |
| `actionActivity` | Individual action completions for heat calculation |

## AI Integration

The app uses Claude via Vercel AI SDK for two main purposes:

1. **Goal Crafting** (`/api/chat`)
   - Conversational coaching to help users define their goal
   - Suggests 8 pillars based on the goal
   - Suggests 8 actions per pillar

2. **Check-in Mapping** (`/api/check-in`)
   - Takes natural language input ("I went for a run")
   - Maps to relevant actions from the user's 64 defined actions
   - Returns confidence score and reasoning

## The Ohtani Method

This is the same goal-setting system Shohei Ohtani used at age 18 to plan his baseball career. The 9x9 mandala grid (1 goal + 8 pillars + 64 actions) provides:

- **Clarity**: Breaking big goals into concrete daily actions
- **Balance**: 8 pillars ensure holistic approach
- **Accountability**: Visual heat map shows consistency
- **Flexibility**: AI helps personalize to each user's context
