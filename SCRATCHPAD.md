# Polaris Build Scratchpad

Current Phase: **Week 1 - Foundation + Goal Crafting**

## Week 1 Progress

### Day 1-2: Project Setup
- [x] Project initialized, `npm install` done
- [x] Convex schema deployed (`convex/schema.ts`)
- [x] Create Clerk app → add keys to `.env.local`
- [x] Add Anthropic API key to `.env.local`
- [ ] Create Opik/Comet account → add key to `.env.local` (can defer to Week 4)
- [x] Updated Next.js to v15 + React 19
- [ ] Verify `npm run dev` works (landing page loads)
- [ ] Deploy to Vercel

### Day 3-4: Auth + Dashboard Shell
- [x] Create sign-in page: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- [x] Create sign-up page: `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- [x] Create auth layout: `src/app/(auth)/layout.tsx`
- [x] Create main layout with sidebar: `src/app/(main)/layout.tsx`
- [x] Create dashboard page: `src/app/(main)/dashboard/page.tsx`
- [x] Create Convex users functions: `convex/users.ts`
- [x] Create Clerk middleware: `src/middleware.ts`
- [x] Sync Clerk user to Convex on sign-in (via `UserSync` component)

### Day 5-7: Goal Crafting Chat
- [x] Build ChatMessage component: `src/components/chat/ChatMessage.tsx`
- [x] Build ChatInput component: `src/components/chat/ChatInput.tsx`
- [x] Build ChatInterface component: `src/components/chat/ChatInterface.tsx`
- [x] Create barrel export: `src/components/chat/index.ts`
- [x] Create chat API route: `src/app/api/chat/route.ts`
- [x] Wire up `GOAL_CRAFTING_PROMPT`
- [x] Create Convex goals functions: `convex/goals.ts`
- [x] Parse `---GOAL_CONFIRMED---` from AI response → save goal
- [x] Build craft page: `src/app/(main)/craft/page.tsx`
- [ ] Build mini-map preview: `src/components/mandala/MiniMap.tsx`
- [ ] Add basic Opik tracing: `src/lib/opik/client.ts`

**Week 1 Deliverable:** User can sign up, chat with Polaris, and create a refined goal.

---

## Notes

_Use this section for decisions, blockers, or context to preserve between sessions._

### Session: Jan 18, 2026
- Fixed Tailwind CSS v4 configuration (migrated from v3 syntax)
- Updated `globals.css` to use `@import "tailwindcss"` and `@theme` directive
- Ran comprehensive codebase review — findings added to CLAUDE.md under "Known Issues"

### Session: Jan 20, 2026
- Completed Day 3-4: Auth + Dashboard Shell
- Completed Day 5-7: Goal Crafting Chat
- Fixed AI SDK v6 compatibility (message format conversion, sendMessage API)
- Added AI SDK skills rule and AI Coach UX design rules to CLAUDE.md
- Started Week 2: Pillars flow with batch suggestion UX
- Created PILLAR_SUGGESTION_PROMPT for better UX (suggest all 8, user accepts/tweaks)
- Built pillars page with chat interface and confirmation flow

### Session: Jan 21, 2026
- **Major UX refactor: Single-page wizard flow**
- Problem: Separate pages for goal/pillars/actions was fragile — relied on parsing AI markers, users missed "Continue" buttons
- Solution: Rebuilt `/craft` as a single-page wizard with explicit user controls
- New flow:
  1. Goal Step: Chat + "I'm Ready to Confirm" button → user types final goal → Confirm
  2. Pillars Step: AI auto-suggests 8 pillars → editable sidebar → user can tweak → Confirm 8 Pillars
  3. Actions Step: (placeholder for now) → Activate Goal
- Key improvements:
  - User clicks buttons to advance (not waiting for AI parsing)
  - Pillars auto-fill from AI response but are fully editable
  - Resumes from existing crafting goal if user returns
- Removed separate `/pillars` page (integrated into `/craft`)
