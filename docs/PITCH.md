# Polaris — 3-Minute Pitch Deck & Demo Script

> **Encode Club "Commit To Change" Hackathon**
> Total time: 3 minutes (~90s pitch + ~90s live demo)

---

## Slide-by-Slide Deck

### Slide 1: The Problem (15s)

**On screen:**
> "92% of New Year's resolutions fail."
>
> - Vague goals with no actionable path
> - No system to turn ambition into daily behavior
> - No one checking in on your progress

**Presenter notes:**
Open strong with the stat — let it land for a beat. "Ninety-two percent of New Year's resolutions fail. And it's not because people lack willpower. It's because they lack a *system*. 'Get healthier' is an aspiration, not a plan. There's no daily path, no structure, and no one keeping you accountable."

---

### Slide 2: The Ohtani Method (15s)

**On screen:**
> The Ohtani/Harada Method: 1 goal → 8 pillars → 64 daily actions
>
> [Image of a 9x9 mandala grid]
>
> Used by Shohei Ohtani in high school to become the greatest baseball player alive.

**Presenter notes:**
"There's a proven framework for this. In high school, Shohei Ohtani filled out a 9x9 grid — one central goal surrounded by 8 areas of focus, each broken into 8 concrete daily actions. 64 actions total. It's the system behind arguably the greatest baseball player alive. The problem? Staring at 81 empty cells is paralyzing. Most people don't know where to start."

---

### Slide 3: Polaris — The Solution (15s)

**On screen:**
> **Polaris** — Your AI guide to your North Star
>
> An AI coach that transforms one goal into 64 trackable daily actions, then keeps you on track with natural language check-ins and a living heat map.
>
> _From resolution to reality._

**Presenter notes:**
"That's where Polaris comes in. Polaris is an AI coach that *walks you through* building your Ohtani grid. You have a conversation — it helps you clarify your goal, suggests 8 balanced pillars, and generates specific daily actions for each. Then it tracks your progress with a visual heat map and natural language check-ins. You just tell it what you did today."

---

### Slide 4: How It Works (15s)

**On screen:**
> 1. **Chat** — AI helps you refine your goal
> 2. **Build** — AI suggests 8 pillars & 64 actions (you edit freely)
> 3. **Track** — Check in with natural language ("Ran 3 miles and meal prepped")
> 4. **See** — Mandala heat map shows what's hot and what's going cold

**Presenter notes:**
"Four steps. First, you chat with Polaris to sharpen your goal. Then it suggests 8 pillars and 64 actions — you can accept, tweak, or rewrite any of them. Once activated, you check in by just *telling it what you did* in plain English. The AI maps your words to the right actions automatically. And you see everything on a living mandala heat map — hot areas where you're crushing it, cold areas that need attention."

---

### Slide 5: Tech Stack (10s)

**On screen:**
> - **Next.js 15** + React 19 (App Router)
> - **Convex** — Real-time database & subscriptions
> - **Clerk** — Authentication
> - **Claude AI** via Vercel AI SDK v6
> - **Deployed on Vercel**

**Presenter notes:**
"Built with Next.js 15, Convex for real-time data, Clerk for auth, and Claude as the AI backbone via Vercel's AI SDK. Deployed on Vercel. Let me show you."

*Transition immediately to demo.*

---

### Slide 6: Post-Demo Closing (10s)

**On screen:**
> **Polaris** — From resolution to reality
>
> One goal. Eight pillars. Sixty-four actions. Your North Star.

**Presenter notes:**
"Polaris takes a vague resolution and turns it into a daily system. One goal, 8 pillars, 64 actions — and an AI coach that keeps you honest. Thank you."

---

## Live Demo Script (~90s)

### Pre-Demo Setup

**Before presenting:**
1. Fresh account or cleared data (no existing goal)
2. Browser open to the deployed Vercel URL, signed in
3. Start on `/dashboard` (will be empty — this is intentional)
4. Have your goal ready in your head: **"Run a sub-4-hour marathon"** (or whatever feels natural)
5. Pre-test the full flow once to make sure API keys / Convex are responsive

**Fallback:** If AI is slow or anything breaks, have screenshots or a screen recording ready.

---

### Demo Beat 1: Empty State → Craft (10s)

**Action:** Show the empty dashboard briefly. Click "Craft Goal" in sidebar.

**Say:** "Right now I have no goal. Let's create one from scratch."

---

### Demo Beat 2: Goal Chat (20s)

**Action:** Type something like: "I want to run a marathon" — let AI respond. Then click "I'm ready to confirm my goal." Type refined goal: "Run a sub-4-hour marathon by October 2026." Confirm.

**Say:** "I tell Polaris my goal, and it helps me think it through — is it specific enough, is the timeline realistic? Once I'm happy, I confirm: Run a sub-4-hour marathon by October."

> **Timing tip:** Don't wait for a long AI response. As soon as the first response appears and you've shown the chat works, move to confirm. The audience gets the idea.

---

### Demo Beat 3: Pillars (20s)

**Action:** AI auto-suggests 8 pillars. Show them appearing. Optionally edit one to demonstrate it's not locked in. Click "Confirm 8 Pillars."

**Say:** "Polaris immediately suggests 8 pillars — Training, Nutrition, Recovery, Mental Toughness, and so on. These are fully editable — I can change anything. But the suggestions are solid, so I'll confirm."

> **Timing tip:** Don't edit more than one pillar. Just show it's possible and move on.

---

### Demo Beat 4: Actions (20s)

**Action:** Show AI suggesting 8 actions for the first pillar. Click through 1-2 more pillars quickly to show actions filling in. Click "Activate Goal."

**Say:** "Now each pillar gets 8 specific daily actions. Not 'run more' — things like 'Complete one interval session per week' and 'Do 15-minute dynamic warmup before every run.' 64 concrete actions total. I activate the goal."

> **Timing tip:** You do NOT need to show all 8 pillars. Show 2-3, then activate. The audience understands the pattern.

---

### Demo Beat 5: The Mandala (10s)

**Action:** Navigate to `/dashboard`. The mandala grid appears with the goal in the center, all cells cold/blue.

**Say:** "And here's my mandala. My goal in the center, 8 pillars around it, and 64 actions radiating out. Everything's cold right now — I haven't done anything yet."

---

### Demo Beat 6: Check-In (10s)

**Action:** Click "Check In" in sidebar. Type: "Did a 5-mile tempo run this morning and stretched for 20 minutes after." Submit. Show the AI mapping to specific actions. Confirm.

**Say:** "I check in by just saying what I did. Polaris maps my words to the right actions automatically. 5-mile tempo run — that's mapped to my Training pillar. Stretching — mapped to Recovery."

> **Timing tip:** Have this sentence pre-typed or ready to paste if needed. Don't fumble typing live.

---

### Demo Beat 7: Heat Map Update (quick glance)

**Action:** Go back to dashboard. Show the cells that just lit up (warming/warm).

**Say:** "And now the mandala is coming alive. I can see exactly where I'm putting in work — and where I need to step up."

*Transition back to closing slide.*

---

## Timing Summary

| Section | Duration | Running Total |
|---------|----------|---------------|
| Slide 1: Problem | 15s | 0:15 |
| Slide 2: Ohtani Method | 15s | 0:30 |
| Slide 3: Solution | 15s | 0:45 |
| Slide 4: How It Works | 15s | 1:00 |
| Slide 5: Tech Stack | 10s | 1:10 |
| Demo | 90s | 2:40 |
| Slide 6: Closing | 10s | 2:50 |
| **Buffer** | **10s** | **3:00** |

---

## Tips for the 3-Minute Format

1. **Don't read slides.** Slides are sparse visuals. You're telling a story.
2. **The demo IS the pitch.** Get to it fast. The mandala filling up is your money shot.
3. **Pre-type or paste check-in text.** Don't waste seconds typing live.
4. **If AI is slow, narrate over the loading.** "While that's thinking..." — fill dead air with context.
5. **Practice the demo 3x.** Know exactly which buttons you'll click and in what order.
6. **Have a screen recording fallback.** If the live demo gods are not with you, play a recording instead. No shame in it.
7. **End clean.** Don't trail off. Final line, pause, "Thank you." Done.

---

## If You Need to Cut to 2 Minutes

- Merge slides 1-3 into one: "92% of resolutions fail. The Ohtani Method fixes this — 1 goal, 8 pillars, 64 actions. Polaris is an AI coach that builds this grid with you and tracks your progress. Let me show you."
- Skip the tech stack slide entirely (mention in passing during demo)
- In demo, skip showing pillar editing — just confirm defaults
- Skip showing the check-in confirmation step — just show the input and jump to the heat map
