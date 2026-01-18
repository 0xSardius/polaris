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
- [ ] Build ChatMessage component: `src/components/chat/ChatMessage.tsx`
- [ ] Build ChatInput component: `src/components/chat/ChatInput.tsx`
- [ ] Build ChatInterface component: `src/components/chat/ChatInterface.tsx`
- [ ] Create barrel export: `src/components/chat/index.ts`
- [ ] Create chat API route: `src/app/api/chat/route.ts`
- [ ] Wire up `GOAL_CRAFTING_PROMPT`
- [ ] Create Convex goals functions: `convex/goals.ts`
- [ ] Parse `---GOAL_CONFIRMED---` from AI response → save goal
- [ ] Build craft page: `src/app/(main)/craft/page.tsx`
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
- Next session: Start with auth pages (Day 3-4 tasks) after fixing ESLint version
