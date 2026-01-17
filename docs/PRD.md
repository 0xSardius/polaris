# Polaris - Product Requirements Document

> **AI-Powered Goal Coaching Based on the Ohtani/Harada Method**
>
> _Turn your resolution into 64 daily actions. Track progress with an AI coach that adapts._

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Target Users](#target-users)
5. [Hackathon Alignment](#hackathon-alignment)
6. [Core Concepts](#core-concepts)
7. [User Flows](#user-flows)
8. [Feature Specifications](#feature-specifications)
9. [Technical Architecture](#technical-architecture)
10. [Data Models](#data-models)
11. [AI Coaching System](#ai-coaching-system)
12. [Opik Observability Integration](#opik-observability-integration)
13. [UI/UX Specifications](#uiux-specifications)
14. [Build Timeline](#build-timeline)
15. [Success Metrics](#success-metrics)
16. [Future Enhancements](#future-enhancements)

---

## Overview

### Product Name

**Polaris** — Your AI guide to achieving your North Star

### Tagline Options

- "Your goals. Your guide."
- "From resolution to reality."
- "Navigate your goals with AI."
- "64 actions to your North Star."

### One-Liner

Polaris is an AI coaching app that helps users transform a single ambitious goal into 64 trackable daily actions using the proven Ohtani/Harada Method, then provides ongoing conversational coaching to keep them on track.

### Hackathon

**Encode Club: Commit To Change** — AI Agents Hackathon

- Prize Pool: $30,000
- Duration: 4 weeks (Jan 13 - Feb 10, 2026)
- Target Categories: **Best Use of Opik** ($5K) + **Personal Growth & Learning** ($5K)

---

## Problem Statement

### The Resolution Problem

92% of New Year's resolutions fail. Why?

1. **Vague goals** — "Get healthier" has no actionable path
2. **No system** — Goals without daily behaviors don't stick
3. **No accountability** — No one checking in on progress
4. **No adaptability** — Life changes, but rigid plans don't

### The Blank Page Problem

Goal-setting frameworks like the Mandala Chart are powerful but overwhelming. Users stare at 81 empty cells and don't know where to start.

### The Tracking Fatigue Problem

Checkbox-based habit trackers become chores. Users abandon them because logging feels like work, not progress.

---

## Solution

### Polaris Approach

**Phase 1: AI-Guided Goal Crafting**
Work side-by-side with an AI coach to transform one ambitious goal into a complete 9x9 mandala:

- 1 central goal (refined through conversation)
- 8 supporting pillars (balanced life areas)
- 64 specific actions (behaviors, not outcomes)

**Phase 2: Conversational Progress Tracking**
Check in naturally by telling Polaris what you accomplished:

- Natural language input ("Did my morning run and prepped meals")
- AI maps activities to relevant actions automatically
- Visual heat map shows which areas are hot/cold
- Adaptive coaching based on patterns and gaps

**The Magic:** Polaris doesn't just track—it coaches. It notices when pillars go cold, celebrates streaks, and adapts its strategy based on what's actually working.

---

## Target Users

### Primary Persona: The Ambitious Professional

- Age: 25-45
- Has big goals but struggles with consistent execution
- Familiar with productivity tools (Notion, Todoist, etc.)
- Wants structure but not rigidity
- Values data and seeing progress visually

### Secondary Persona: The Self-Improver

- Actively working on personal development
- Reads books like Atomic Habits, listens to podcasts
- Has tried habit trackers before, found them tedious
- Wants an accountability partner, not just a tool

### Tertiary Persona: The Resolution Maker

- Sets New Year's resolutions annually
- History of starting strong, fading by February
- Needs external structure and motivation
- Looking for something different this year

---

## Hackathon Alignment

### "Commit To Change" Theme Fit

The hackathon is about "AI that turns New Year's resolutions into real results." Polaris directly addresses this:

- Takes a resolution → converts to actionable system
- Provides ongoing AI coaching to maintain momentum
- Tracks and visualizes actual progress

### Category Targeting

#### Best Use of Opik ($5,000)

Polaris implements comprehensive observability:

- Every AI conversation turn is traced
- Coaching interventions are logged with outcomes
- We can demonstrate: "This coaching prompt led to this user action"
- Dashboard shows AI effectiveness metrics

**Demo Story:** "We can prove which coaching strategies work. When a user's Recovery pillar went cold, Polaris noticed and intervened. Three days later, they logged activity. That's traceable cause and effect."

#### Personal Growth & Learning ($5,000)

Polaris embodies the Harada Method—a proven personal development framework:

- Systematic goal decomposition
- Balanced life area coverage
- Daily action focus
- Continuous improvement through reflection

### Judging Criteria Alignment

| Criteria                       | How Polaris Delivers                                           |
| ------------------------------ | -------------------------------------------------------------- |
| **Functionality**              | Complete goal-setting + tracking system that works             |
| **Real-world relevance**       | Addresses universal problem of failed resolutions              |
| **Use of LLMs/Agents**         | AI coach that refines goals, suggests actions, adapts coaching |
| **Evaluation & Observability** | Full Opik integration with intervention tracking               |
| **Goal alignment**             | Literally about achieving goals                                |

---

## Core Concepts

### The Harada/Ohtani Method

Developed by Japanese track coach Takashi Harada and famously used by baseball star Shohei Ohtani in high school to become the #1 draft pick.

**Structure:**

```
                    ┌─────────────────────────────────────┐
                    │           9x9 MANDALA GRID          │
                    │                                     │
  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │
  │   1     │   2     │   3     │   49    │   50    │   51    │   17    │   18    │   19    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ PILLAR  │ Action  │ Action  │ PILLAR  │ Action  │ Action  │ PILLAR  │ Action  │
  │   4     │   1     │   5     │   52    │   7     │   53    │   20    │   3     │   21    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │
  │   6     │   7     │   8     │   54    │   55    │   56    │   22    │   23    │   24    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ Action  │ Action  │ PILLAR  │ PILLAR  │ PILLAR  │ Action  │ Action  │ Action  │
  │   25    │   26    │   27    │   6     │   8     │   4     │   33    │   34    │   35    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ PILLAR  │ Action  │ PILLAR  │  GOAL   │ PILLAR  │ Action  │ PILLAR  │ Action  │
  │   28    │   2     │   29    │   5     │ (North  │   1     │   36    │   5     │   37    │
  │         │         │         │         │  Star)  │         │         │         │         │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ Action  │ Action  │ PILLAR  │ PILLAR  │ PILLAR  │ Action  │ Action  │ Action  │
  │   30    │   31    │   32    │   3     │   2     │   7     │   38    │   39    │   40    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │
  │   41    │   42    │   43    │   57    │   58    │   59    │   9     │   10    │   11    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ PILLAR  │ Action  │ Action  │ PILLAR  │ Action  │ Action  │ PILLAR  │ Action  │
  │   44    │   6     │   45    │   60    │   8     │   61    │   12    │   4     │   13    │
  ├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │ Action  │
  │   46    │   47    │   48    │   62    │   63    │   64    │   14    │   15    │   16    │
  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Key Principles:**

1. **One North Star** — A single, specific, ambitious goal
2. **Eight Pillars** — Balanced supporting areas (not just goal-related skills)
3. **Behaviors, Not Outcomes** — "Run 3x/week" not "Be faster"
4. **Daily Practice** — Goals become training, not hoping

**Ohtani's Example:**

- **Goal:** Be the #1 draft pick in NPB
- **Pillars:** Physical training, Ball control, Pitch quality, Mental strength, Character, Adaptability, Breaking ball, 160km fastball
- **Sample Actions under "Character":** Be caring, Clean room, Be well-mannered, Read books, Think positively, Continue habits, Be grateful, Punctuality

### Heat Map Concept

Inspired by GitHub's contribution graph, the Polaris heat map shows activity across all 64 actions:

**Heat Levels:**
| Level | Visual | Condition |
|-------|--------|-----------|
| Cold | `slate-800` | No activity in 14+ days |
| Warming | `blue-900` | Activity within 14 days |
| Warm | `amber-700` | Activity within 7 days |
| Hot | `amber-500` | Activity within 48 hours |
| On Fire | `amber-400 pulse` | 3+ day streak |

**Pillar Aggregation:**
Each pillar's heat = average of its 8 actions' heat levels

**Center Cell:**
Overall momentum indicator based on % of pillars that are warm or hotter

---

## User Flows

### Flow 1: Onboarding & Goal Crafting (Phase 1)

**Duration:** 10-20 minutes (first session)

#### Step 1.1: Welcome

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         ✦ POLARIS                          │
│                                                             │
│              Your AI guide to achieving your                │
│                       North Star                            │
│                                                             │
│     Transform one ambitious goal into 64 daily actions      │
│          using the method that made Ohtani a legend         │
│                                                             │
│                  ┌─────────────────────┐                    │
│                  │   Begin Your Journey │                    │
│                  └─────────────────────┘                    │
│                                                             │
│               Already have an account? Sign in              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 1.2: Central Goal Definition

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                              Step 1 of 3: Your Goal │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        ┌───────┐                            │
│                        │   ?   │                            │
│                        └───────┘                            │
│                     Your North Star                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Chat with Polaris                                  │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 🤖 Polaris                                   │   │   │
│  │  │                                              │   │   │
│  │  │ Welcome! I'm Polaris, your AI goal coach.   │   │   │
│  │  │                                              │   │   │
│  │  │ What's the ONE thing you want to achieve    │   │   │
│  │  │ this year? Don't worry about making it      │   │   │
│  │  │ perfect—we'll refine it together.           │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Type your goal...                           │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Conversation Flow:**

```
User: "I want to get healthier"

Polaris: "Great starting point! 'Healthier' can mean many things though.
         When you imagine yourself at your healthiest, what does that
         look like? Is it:

         • A specific achievement (running a race, lifting a weight)
         • A feeling (more energy, less stress)
         • A number (weight, body fat %, blood pressure)
         • Something else?

         Tell me more about what 'healthy' means to you."

User: "I want to be able to run a half marathon. I've never been a runner."

Polaris: "A half marathon—that's ambitious! I love it. Let's make it specific:

         • When do you want to complete it? (A specific race? By end of year?)
         • What would success look like? (Just finishing? A time goal?)

         The more specific, the better we can build your roadmap."

User: "There's a half marathon in my city in June. I just want to finish it."

Polaris: "Perfect. So your North Star is:

         ✦ 'Complete the [City] Half Marathon in June 2026'

         This is specific, measurable, and has a deadline.
         Does this feel right, or should we adjust?"

User: "That's it!"

[Goal confirmed → Stored to database → Mini-map updates to show center filled]
```

#### Step 1.3: Pillar Creation

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                           Step 2 of 3: Your Pillars │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│            ┌───┐ ┌───┐ ┌───┐                               │
│            │   │ │ 1 │ │   │    Pillars completed: 1/8     │
│            └───┘ └───┘ └───┘                               │
│            ┌───┐ ┌───┐ ┌───┐                               │
│            │   │ │ ✦ │ │   │    ✦ = Your goal              │
│            └───┘ └───┘ └───┘                               │
│            ┌───┐ ┌───┐ ┌───┐                               │
│            │   │ │   │ │   │                               │
│            └───┘ └───┘ └───┘                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 🤖 Polaris                                   │   │   │
│  │  │                                              │   │   │
│  │  │ Now let's build what supports your goal.    │   │   │
│  │  │                                              │   │   │
│  │  │ Ohtani didn't just focus on baseball skills.│   │   │
│  │  │ He included "keep room clean" and "be       │   │   │
│  │  │ caring" because he knew success requires    │   │   │
│  │  │ balance.                                     │   │   │
│  │  │                                              │   │   │
│  │  │ What areas of your life need attention to   │   │   │
│  │  │ make this half marathon happen?             │   │   │
│  │  │                                              │   │   │
│  │  │ ┌─────────────────────────────────────────┐ │   │   │
│  │  │ │ I have ideas—let me share them          │ │   │   │
│  │  │ ├─────────────────────────────────────────┤ │   │   │
│  │  │ │ Suggest pillars for me                  │ │   │   │
│  │  │ ├─────────────────────────────────────────┤ │   │   │
│  │  │ │ Let's figure them out together          │ │   │   │
│  │  │ └─────────────────────────────────────────┘ │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Pillar Creation Modes:**

**Mode A: User-Driven**

```
User: "I'm thinking: Running training, Strength, Nutrition, Sleep,
       Mental prep, Gear/equipment... that's 6. Not sure about the other 2."

Polaris: "Great start! You've got the physical foundation covered.

         Looking at what Ohtani included, I notice you're missing some
         'softer' areas. For a half marathon, consider:

         • Recovery (stretching, rest days, injury prevention)
         • Support System (telling friends, finding running buddies)
         • Life Balance (not letting training consume everything)
         • Environment (route planning, weather prep)

         Which two resonate? Or do you have other ideas?"
```

**Mode B: AI-Suggested**

```
Polaris: "Based on your goal, here are 8 pillars I'd suggest:

         1. 🏃 Endurance Training — Building your running base
         2. 💪 Strength & Mobility — Supporting muscles and flexibility
         3. 🥗 Nutrition — Fueling your training
         4. 😴 Recovery & Sleep — Where gains actually happen
         5. 🧠 Mental Game — Race day confidence
         6. 📅 Schedule & Consistency — Making training non-negotiable
         7. 🤝 Support System — Community and accountability
         8. ⚖️ Life Balance — Sustainable integration

         These feel balanced to you? We can swap any out."
```

**Mode C: Collaborative**

```
Polaris: "Let's build these one at a time.

         What's the MOST important supporting area for your half marathon?
         The one thing that, if you nail it, makes everything else easier?"

User: "Probably just consistently running. I've never stuck with it before."

Polaris: "Consistency—that's your foundation. Let's call this pillar
         'Training Consistency' or 'Running Habit'. Which feels right?"

User: "Running Habit"

Polaris: "Perfect. Pillar 1: Running Habit ✓

         [Pillar 1 lights up on mini-map]

         Now, what's next? Think about: What usually derails your fitness
         attempts? What would make running easier?"

[Continue for all 8 pillars]
```

#### Step 1.4: Action Creation (Per Pillar)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                           Pillar 1: Running Habit   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────┐                      │
│   │  ┌───┬───┬───┐                  │                      │
│   │  │ 1 │ 2 │ 3 │  Actions: 3/8    │                      │
│   │  ├───┼───┼───┤                  │                      │
│   │  │ 4 │ ✦ │   │  ✦ = Running     │                      │
│   │  ├───┼───┼───┤      Habit       │                      │
│   │  │   │   │   │                  │                      │
│   │  └───┴───┴───┘                  │                      │
│   └─────────────────────────────────┘                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 🤖 Polaris                                   │   │   │
│  │  │                                              │   │   │
│  │  │ Now let's define 8 specific ACTIONS for     │   │   │
│  │  │ "Running Habit."                             │   │   │
│  │  │                                              │   │   │
│  │  │ Remember: actions are BEHAVIORS you can do, │   │   │
│  │  │ not outcomes you hope for.                   │   │   │
│  │  │                                              │   │   │
│  │  │ ✅ "Run 3x per week" (behavior)             │   │   │
│  │  │ ❌ "Get faster" (outcome)                   │   │   │
│  │  │                                              │   │   │
│  │  │ What daily or weekly actions would build    │   │   │
│  │  │ your running habit?                          │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  [Type or choose from suggestions...]              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Action Refinement Example:**

```
User: "Run more"

Polaris: "'Run more' is a great intention, but it's hard to track.
         Let's make it specific:

         • How many times per week?
         • For how long or how far?
         • Any specific days?

         What feels sustainable for where you're starting?"

User: "Maybe 3 times a week, starting with 20 minutes"

Polaris: "Perfect! Action 1: 'Run 3x per week for 20+ minutes' ✓

         That's specific and trackable. When you tell me 'I went for a
         run today,' I'll know to mark this.

         What's another action that would build your running habit?"
```

**AI-Suggested Actions Example:**

```
Polaris: "For 'Running Habit,' here are 8 actions I'd suggest:

         1. Run 3x per week (20+ min)
         2. Lay out running clothes the night before
         3. Schedule runs in calendar like meetings
         4. Track each run in an app (Strava, Nike Run)
         5. Do a weekly long run (add 10% each week)
         6. Find or create a running playlist
         7. Join a running group or find a buddy
         8. Sign up for a 5K as a milestone

         Edit any of these or swap in your own ideas."
```

#### Step 1.5: The Reveal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ✦ YOUR POLARIS ✦                        │
│                                                             │
│        Complete the City Half Marathon - June 2026          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [FULL 9x9 MANDALA GRID ANIMATES INTO VIEW]        │   │
│  │                                                     │   │
│  │  All 64 actions visible                             │   │
│  │  Center glowing with goal                           │   │
│  │  8 pillars highlighted                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│           8 Pillars  •  64 Actions  •  1 North Star        │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  📸 Share        │  │  🚀 Start Tracking│                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
│  🤖 "This is your roadmap. Every cell is a step toward     │
│      your North Star. Ready to start the journey?"         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Flow 2: Progress Tracking (Phase 2)

**Duration:** 30 seconds - 2 minutes per session

#### Step 2.1: Check-In Entry

```
┌─────────────────────────────────────────────────────────────┐
│  ☰                         POLARIS                     👤   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │           [9x9 HEAT MAP - CURRENT STATE]            │   │
│  │                                                     │   │
│  │  🔥 Endurance     🔥 Strength    ❄️ Recovery        │   │
│  │  🌤️ Nutrition     ✦ GOAL ✦     🔥 Schedule         │   │
│  │  🌤️ Mental        ❄️ Support    🌤️ Balance         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 👤 You (2 hours ago)                        │   │   │
│  │  │                                              │   │   │
│  │  │ Did a 5K this morning and meal prepped      │   │   │
│  │  │ for the week                                 │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 🤖 Polaris                                   │   │   │
│  │  │                                              │   │   │
│  │  │ Nice work! 🔥                                │   │   │
│  │  │                                              │   │   │
│  │  │ • 5K logged → "Run 3x/week" (that's 3 this  │   │   │
│  │  │   week—you're on fire!)                      │   │   │
│  │  │ • Meal prep → "Prep healthy meals weekly"    │   │   │
│  │  │                                              │   │   │
│  │  │ Your Endurance and Nutrition pillars are     │   │   │
│  │  │ heating up. 🌡️                               │   │   │
│  │  │                                              │   │   │
│  │  │ I noticed your Recovery pillar has been      │   │   │
│  │  │ cold for 9 days. Any stretching or rest      │   │   │
│  │  │ planned?                                      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ What did you accomplish today?              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2.2: AI Mapping & Response

**Behind the scenes:**

1. User input: "Did a 5K this morning and meal prepped for the week"
2. AI analyzes against 64 actions
3. Maps to relevant actions:
   - "Run 3x per week" under Endurance pillar
   - "Prep healthy meals weekly" under Nutrition pillar
4. Updates activity timestamps
5. Recalculates heat map
6. Checks for cold pillars needing attention
7. Generates personalized response

**Opik Trace:**

```
Trace: Check-in Processing
├─ Input: "Did a 5K this morning and meal prepped for the week"
├─ Span: Action Mapping
│   ├─ Model: claude-sonnet-4-5-20250514
│   ├─ Mapped Actions: [action_12, action_34]
│   ├─ Confidence: 0.94
│   └─ Duration: 245ms
├─ Span: Heat Map Update
│   ├─ Actions Updated: 2
│   ├─ Pillars Affected: [Endurance, Nutrition]
│   └─ New Hot Pillars: 1
├─ Span: Coaching Response Generation
│   ├─ Cold Pillars Detected: [Recovery, Support]
│   ├─ Coaching Strategy: "Gentle nudge on Recovery"
│   ├─ Response Length: 127 tokens
│   └─ Duration: 312ms
└─ Total Duration: 623ms
```

#### Step 2.3: Pattern Recognition

**Over time, Polaris notices patterns:**

```
Polaris: "I've been looking at your patterns over the past 3 weeks:

         🔥 Crushing it:
         • Endurance pillar: 12 activities (150% of target)
         • You never miss a Tuesday run

         ❄️ Needs attention:
         • Recovery pillar: 2 activities (25% of target)
         • Support pillar: 0 activities

         🔍 Pattern I noticed:
         • Your strength training drops off on weeks when work
           gets busy (I see the gap last week)

         Want to talk strategy for keeping Recovery on track?"
```

#### Step 2.4: Weekly Reflection (Optional)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   📊 WEEKLY REFLECTION                      │
│                      Jan 13 - Jan 19                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Activities Logged: 14                              │   │
│  │  Pillars Active: 6/8                                │   │
│  │  Actions Touched: 23/64                             │   │
│  │  Current Streak: 5 days                             │   │
│  │                                                     │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  🔥 Hottest     │  ❄️ Coldest                 │ │   │
│  │  │  Endurance      │  Recovery                   │ │   │
│  │  │  Schedule       │  Support System             │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🤖 "Great week! You're building real momentum on the       │
│      physical side. Next week, let's get one Recovery       │
│      action in. Even 10 minutes of stretching counts.       │
│      What day works best?"                                  │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Set Intention   │  │  Skip for Now    │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Specifications

### F1: User Authentication

- **Provider:** Clerk
- **Methods:** Email/password, Google OAuth, Apple OAuth
- **User Data:** Name, email, avatar, created_at
- **Session:** Persistent across devices

### F2: Goal Crafting Wizard

#### F2.1: Central Goal Definition

- Conversational interface with AI
- Goal refinement through dialogue
- Specificity checking (measurable, time-bound)
- Save draft capability
- Goal editing after creation

#### F2.2: Pillar Creation

- Three input modes: User-driven, AI-suggested, Collaborative
- 8 pillars required before proceeding
- Pillar naming and optional description
- Reordering capability
- Balance feedback from AI ("You have 6 fitness pillars...")

#### F2.3: Action Definition

- 8 actions per pillar (64 total)
- Behavior validation (not outcomes)
- AI suggestions with edit capability
- Bulk accept for speed
- Progress saved per pillar

#### F2.4: Mandala Reveal

- Animated grid assembly
- All 81 cells displayed
- Share/screenshot functionality
- Transition to tracking mode

### F3: Mandala Visualization

#### F3.1: 9x9 Grid Display

- Responsive layout (desktop and mobile)
- Center cell: Goal
- Inner ring: 8 pillars
- Outer cells: 64 actions (8 per pillar region)

#### F3.2: Heat Map States

| State   | Color       | Condition                | Visual Effect   |
| ------- | ----------- | ------------------------ | --------------- |
| Cold    | `slate-700` | No activity 14+ days     | Dim, static     |
| Warming | `blue-800`  | Activity within 14 days  | Subtle glow     |
| Warm    | `amber-700` | Activity within 7 days   | Visible warmth  |
| Hot     | `amber-500` | Activity within 48 hours | Bright          |
| On Fire | `amber-400` | 3+ day streak            | Pulse animation |

#### F3.3: Interactions

- Tap cell → Show action details + recent activity
- Tap pillar → Show pillar summary + all 8 actions
- Tap center → Show goal + overall stats
- Pinch to zoom (mobile)
- Hover states (desktop)

### F4: Conversational Check-In

#### F4.1: Natural Language Input

- Free-form text entry
- No required format
- Multiple activities per message
- Emoji support

#### F4.2: AI Action Mapping

- Parse input for activities
- Match to relevant actions
- Confidence threshold for mapping
- Ask for clarification if ambiguous
- Handle unmappable input gracefully

#### F4.3: Real-Time Heat Update

- Immediate visual feedback
- Animation on state change
- Streak detection and celebration
- Cold pillar highlighting

### F5: AI Coaching

#### F5.1: Responsive Coaching

- Acknowledge logged activities
- Celebrate achievements and streaks
- Notice patterns and gaps
- Suggest strategies for cold pillars

#### F5.2: Proactive Coaching

- Weekly reflection prompts (optional)
- Cold pillar nudges after 7 days
- Streak risk warnings
- Milestone recognition

#### F5.3: Adaptive Strategies

- Track which coaching approaches work
- Adjust tone based on user response
- Learn user preferences over time
- Opik-traced intervention outcomes

### F6: Progress Analytics

#### F6.1: Dashboard Metrics

- Total activities logged
- Current streak (consecutive days with check-ins)
- Pillar heat distribution
- Actions completion rate
- Week-over-week trends

#### F6.2: Historical View

- Calendar view of activity
- Pillar-level trends over time
- Action-level detail on demand

---

## Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  Next.js 14 (App Router) + React 18                        │
│  Tailwind CSS + shadcn/ui                                  │
│  Framer Motion (animations)                                 │
│  Vercel AI SDK (useChat, streaming)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                             │
│  Next.js API Routes (/api/*)                               │
│  Vercel AI SDK (streamText, generateText)                  │
│  Opik tracing wrapper                                       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌───────────────────┐ ┌─────────────┐ ┌─────────────────────┐
│      CONVEX       │ │   CLERK     │ │    ANTHROPIC        │
│                   │ │             │ │                     │
│  Real-time DB     │ │   Auth      │ │  Claude Sonnet 4.5  │
│  Subscriptions    │ │   Users     │ │  Claude Opus 4.5    │
│  Mutations        │ │   Sessions  │ │                     │
│  Queries          │ │             │ │                     │
└───────────────────┘ └─────────────┘ └─────────────────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │      OPIK       │
                                      │                 │
                                      │  Traces         │
                                      │  Evaluations    │
                                      │  Dashboard      │
                                      └─────────────────┘
```

### Project Structure

```
polaris/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard/home
│   │   ├── craft/
│   │   │   ├── page.tsx                # Goal crafting wizard
│   │   │   ├── pillars/page.tsx        # Pillar creation
│   │   │   └── actions/[pillarId]/page.tsx  # Action creation
│   │   ├── mandala/
│   │   │   └── page.tsx                # Full mandala view
│   │   ├── check-in/
│   │   │   └── page.tsx                # Check-in interface
│   │   └── analytics/
│   │       └── page.tsx                # Progress analytics
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts                # AI chat endpoint
│   │   ├── map-actions/
│   │   │   └── route.ts                # Action mapping endpoint
│   │   └── webhooks/
│   │       └── clerk/route.ts          # Clerk webhooks
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn components
│   ├── mandala/
│   │   ├── MandalaGrid.tsx             # Full 9x9 grid
│   │   ├── MandalaCell.tsx             # Individual cell
│   │   ├── PillarDetail.tsx            # Pillar expansion
│   │   └── ActionDetail.tsx            # Action expansion
│   ├── chat/
│   │   ├── ChatInterface.tsx           # Main chat component
│   │   ├── ChatMessage.tsx             # Individual message
│   │   └── ChatInput.tsx               # Input with suggestions
│   ├── craft/
│   │   ├── GoalWizard.tsx              # Goal crafting flow
│   │   ├── PillarWizard.tsx            # Pillar creation flow
│   │   └── ActionWizard.tsx            # Action creation flow
│   └── analytics/
│       ├── HeatCalendar.tsx            # GitHub-style calendar
│       ├── PillarChart.tsx             # Pillar comparison
│       └── StatsCard.tsx               # Metric display
├── convex/
│   ├── _generated/
│   ├── schema.ts                       # Database schema
│   ├── users.ts                        # User operations
│   ├── goals.ts                        # Goal CRUD
│   ├── pillars.ts                      # Pillar CRUD
│   ├── actions.ts                      # Action CRUD
│   ├── checkIns.ts                     # Check-in logging
│   ├── activity.ts                     # Activity tracking
│   └── heatMap.ts                      # Heat calculations
├── lib/
│   ├── ai/
│   │   ├── prompts.ts                  # System prompts
│   │   ├── coaching.ts                 # Coaching logic
│   │   └── mapping.ts                  # Action mapping
│   ├── opik/
│   │   ├── client.ts                   # Opik client setup
│   │   ├── tracing.ts                  # Trace wrappers
│   │   └── evaluations.ts              # Eval metrics
│   └── utils.ts                        # Utility functions
├── hooks/
│   ├── useGoal.ts                      # Goal state
│   ├── useMandala.ts                   # Mandala state
│   ├── useHeatMap.ts                   # Heat calculations
│   └── useChat.ts                      # Chat state
├── types/
│   └── index.ts                        # TypeScript types
├── convex.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "convex": "latest",
    "@clerk/nextjs": "latest",
    "ai": "latest",
    "@anthropic-ai/sdk": "latest",
    "opik": "latest",
    "framer-motion": "latest",
    "tailwindcss": "latest",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "lucide-react": "latest",
    "date-fns": "latest",
    "zod": "latest"
  }
}
```

---

## Data Models

### Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    onboardingComplete: v.boolean(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  goals: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    status: v.union(
      v.literal("crafting"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("paused")
    ),
    craftingStep: v.union(
      v.literal("goal"),
      v.literal("pillars"),
      v.literal("actions"),
      v.literal("complete")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["userId", "status"]),

  pillars: defineTable({
    goalId: v.id("goals"),
    position: v.number(), // 1-8
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_goal", ["goalId"])
    .index("by_goal_position", ["goalId", "position"]),

  actions: defineTable({
    pillarId: v.id("pillars"),
    goalId: v.id("goals"), // Denormalized for easier queries
    position: v.number(), // 1-8
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.optional(v.string()), // "daily", "3x/week", etc.
    createdAt: v.number(),
  })
    .index("by_pillar", ["pillarId"])
    .index("by_goal", ["goalId"])
    .index("by_pillar_position", ["pillarId", "position"]),

  checkIns: defineTable({
    userId: v.id("users"),
    goalId: v.id("goals"),
    rawInput: v.string(),
    aiResponse: v.string(),
    mappedActionIds: v.array(v.id("actions")),
    mappingConfidence: v.number(), // 0-1
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_created", ["goalId", "createdAt"]),

  actionActivity: defineTable({
    actionId: v.id("actions"),
    pillarId: v.id("pillars"), // Denormalized
    goalId: v.id("goals"), // Denormalized
    checkInId: v.id("checkIns"),
    timestamp: v.number(),
  })
    .index("by_action", ["actionId"])
    .index("by_pillar", ["pillarId"])
    .index("by_goal", ["goalId"])
    .index("by_action_time", ["actionId", "timestamp"])
    .index("by_goal_time", ["goalId", "timestamp"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    goalId: v.optional(v.id("goals")),
    context: v.union(
      v.literal("goal_crafting"),
      v.literal("pillar_crafting"),
      v.literal("action_crafting"),
      v.literal("check_in"),
      v.literal("coaching")
    ),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(v.any()), // For storing structured data
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_context", ["userId", "context"]),

  coachingInterventions: defineTable({
    userId: v.id("users"),
    goalId: v.id("goals"),
    type: v.union(
      v.literal("cold_pillar_nudge"),
      v.literal("streak_celebration"),
      v.literal("pattern_observation"),
      v.literal("weekly_reflection"),
      v.literal("strategy_suggestion")
    ),
    pillarId: v.optional(v.id("pillars")),
    message: v.string(),
    userResponded: v.boolean(),
    responseLeadToAction: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal", ["goalId"])
    .index("by_type", ["goalId", "type"]),
});
```

### TypeScript Types

```typescript
// types/index.ts

export type HeatLevel = "cold" | "warming" | "warm" | "hot" | "fire";

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: number;
  status: "crafting" | "active" | "completed" | "paused";
  craftingStep: "goal" | "pillars" | "actions" | "complete";
  createdAt: number;
  updatedAt: number;
}

export interface Pillar {
  _id: string;
  goalId: string;
  position: number;
  title: string;
  description?: string;
  createdAt: number;
}

export interface Action {
  _id: string;
  pillarId: string;
  goalId: string;
  position: number;
  title: string;
  description?: string;
  frequency?: string;
  createdAt: number;
}

export interface CheckIn {
  _id: string;
  userId: string;
  goalId: string;
  rawInput: string;
  aiResponse: string;
  mappedActionIds: string[];
  mappingConfidence: number;
  createdAt: number;
}

export interface ActionHeat {
  actionId: string;
  pillarId: string;
  position: number;
  heat: HeatLevel;
  lastActivity?: number;
  streak: number;
  activityCount: number; // Last 14 days
}

export interface PillarHeat {
  pillarId: string;
  position: number;
  title: string;
  heat: HeatLevel;
  actions: ActionHeat[];
  averageHeat: number;
}

export interface MandalaHeatMap {
  goalId: string;
  goalHeat: HeatLevel;
  pillars: PillarHeat[];
  overallMomentum: number; // 0-100
  lastUpdated: number;
}

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
```

---

## AI Coaching System

### System Prompts

```typescript
// lib/ai/prompts.ts

export const POLARIS_BASE_PROMPT = `You are Polaris, an AI goal coach that helps users achieve their North Star goals using the Ohtani/Harada Method.

Your personality:
- Warm, encouraging, but not sycophantic
- Direct and actionable in your guidance
- You celebrate wins genuinely
- You notice patterns and gently call out gaps
- You use the user's own language when possible

Key principles of the Harada Method you embody:
1. One clear, specific goal at the center
2. Eight balanced supporting pillars (not just goal-related skills)
3. Actions are BEHAVIORS, not outcomes ("Run 3x/week" not "Get faster")
4. Daily practice transforms goals into training
5. Balance matters—Ohtani included "keep room clean" alongside baseball skills

You never:
- Use excessive emojis (1-2 max per message)
- Write walls of text (keep responses focused)
- Ignore what the user actually said
- Give generic advice that could apply to anyone`;

export const GOAL_CRAFTING_PROMPT = `${POLARIS_BASE_PROMPT}

You are helping the user define their central goal—their North Star.

Your job is to:
1. Start with their initial idea, however vague
2. Ask clarifying questions to make it specific
3. Ensure it's measurable and has a timeline
4. Confirm the final goal statement with them

Good goals are:
- Specific: "Run a half marathon" not "Get fit"
- Measurable: "Complete in under 2 hours" or "Just finish"
- Time-bound: "By June 2026" or "This year"
- Meaningful: The user actually wants this

Keep the conversation flowing naturally. Don't interrogate—explore together.`;

export const PILLAR_CRAFTING_PROMPT = `${POLARIS_BASE_PROMPT}

You are helping the user define the 8 pillars that support their goal.

The user's goal is: {goal}

Your job is to:
1. Help them identify 8 supporting areas of life
2. Ensure balance (not all physical, not all mental)
3. Include "soft" pillars like Ohtani did (character, environment, etc.)
4. Challenge them if pillars are too narrow or overlapping

Reference Ohtani's pillars for a baseball goal:
- Physical training, Ball control, Pitch quality, Mental strength
- Character, Adaptability, Breaking ball mastery, 160km fastball

Notice: He had both skill-specific AND character/mindset pillars.

Current pillars defined: {pillarsCount}/8
Existing pillars: {existingPillars}`;

export const ACTION_CRAFTING_PROMPT = `${POLARIS_BASE_PROMPT}

You are helping the user define 8 specific actions for a pillar.

Goal: {goal}
Current Pillar: {pillarTitle}

Your job is to:
1. Help them identify 8 specific, trackable behaviors
2. Ensure actions are BEHAVIORS not outcomes
3. Make actions realistic and sustainable
4. Vary the actions (not 8 versions of the same thing)

✅ Good actions (behaviors):
- "Run 3x per week"
- "Lay out running clothes the night before"
- "Log every run in Strava"
- "Do 10 minutes of stretching after each run"

❌ Bad actions (outcomes):
- "Get faster"
- "Improve endurance"
- "Be more consistent"

Current actions defined: {actionsCount}/8
Existing actions: {existingActions}`;

export const CHECK_IN_PROMPT = `${POLARIS_BASE_PROMPT}

You are helping the user log their progress and providing coaching.

Goal: {goal}

Their mandala has these pillars and current heat:
{pillarSummary}

Recent activity pattern:
{recentPattern}

Cold pillars (no activity 7+ days): {coldPillars}
Hot pillars (streak 3+ days): {hotPillars}

The user just said: {userInput}

Your job is to:
1. Map their input to relevant actions (list which ones)
2. Acknowledge what they accomplished
3. Update on streak/heat changes
4. Gently nudge about cold pillars if appropriate
5. Keep response concise (3-5 sentences max)

Format your response as:
[Your natural response to them]

---MAPPING---
action_ids: [comma-separated action IDs that their input maps to]
confidence: [0-1 confidence score]`;

export const COACHING_INTERVENTION_PROMPT = `${POLARIS_BASE_PROMPT}

You need to provide a coaching intervention.

Context:
- Goal: {goal}
- Intervention type: {interventionType}
- Specific pillar (if applicable): {pillarTitle}
- Days since activity: {daysSinceActivity}
- User's typical response style: {userStyle}

Generate a brief, personalized nudge that:
1. Acknowledges their overall progress
2. Gently highlights the gap
3. Suggests ONE small action they could take
4. Doesn't guilt or pressure

Keep it to 2-3 sentences. Be warm but direct.`;
```

### Action Mapping Logic

```typescript
// lib/ai/mapping.ts
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { opik } from "@/lib/opik/client";

interface MappingResult {
  mappedActionIds: string[];
  confidence: number;
  reasoning: string;
}

export async function mapCheckInToActions(
  userInput: string,
  actions: Action[],
  context: CoachingContext
): Promise<MappingResult> {
  const trace = opik.startTrace("action_mapping");

  try {
    const actionList = actions
      .map((a) => `${a._id}: "${a.title}" (Pillar: ${a.pillarId})`)
      .join("\n");

    const response = await generateText({
      model: anthropic("claude-sonnet-4-5-20250514"),
      system: `You are an action mapping system. Given a user's check-in message, 
               identify which actions from their goal system it relates to.
               
               Available actions:
               ${actionList}
               
               Respond in JSON format:
               {
                 "mappedActionIds": ["id1", "id2"],
                 "confidence": 0.85,
                 "reasoning": "Brief explanation"
               }
               
               Only map to actions that are clearly related. 
               Confidence should reflect how certain you are.
               If nothing maps, return empty array with confidence 1.0.`,
      prompt: userInput,
    });

    const result = JSON.parse(response.text) as MappingResult;

    trace.addSpan({
      name: "mapping_result",
      attributes: {
        input: userInput,
        mappedCount: result.mappedActionIds.length,
        confidence: result.confidence,
      },
    });

    return result;
  } catch (error) {
    trace.addError(error);
    throw error;
  } finally {
    trace.end();
  }
}
```

### Heat Calculation Logic

```typescript
// convex/heatMap.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

const DAY_MS = 24 * 60 * 60 * 1000;

export const getHeatMap = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    const now = Date.now();

    // Get all pillars for this goal
    const pillars = await ctx.db
      .query("pillars")
      .withIndex("by_goal", (q) => q.eq("goalId", goalId))
      .collect();

    // Get all actions for this goal
    const actions = await ctx.db
      .query("actions")
      .withIndex("by_goal", (q) => q.eq("goalId", goalId))
      .collect();

    // Get activity from last 14 days
    const recentActivity = await ctx.db
      .query("actionActivity")
      .withIndex("by_goal_time", (q) =>
        q.eq("goalId", goalId).gte("timestamp", now - 14 * DAY_MS)
      )
      .collect();

    // Build activity map: actionId -> timestamps
    const activityMap = new Map<string, number[]>();
    for (const activity of recentActivity) {
      const existing = activityMap.get(activity.actionId) || [];
      existing.push(activity.timestamp);
      activityMap.set(activity.actionId, existing);
    }

    // Calculate heat for each action
    const actionHeats: ActionHeat[] = actions.map((action) => {
      const timestamps = activityMap.get(action._id) || [];
      const lastActivity =
        timestamps.length > 0 ? Math.max(...timestamps) : undefined;
      const daysSince = lastActivity ? (now - lastActivity) / DAY_MS : Infinity;
      const streak = calculateStreak(timestamps, now);

      return {
        actionId: action._id,
        pillarId: action.pillarId,
        position: action.position,
        heat: calculateHeatLevel(daysSince, streak),
        lastActivity,
        streak,
        activityCount: timestamps.length,
      };
    });

    // Aggregate by pillar
    const pillarHeats: PillarHeat[] = pillars.map((pillar) => {
      const pillarActions = actionHeats.filter(
        (a) => a.pillarId === pillar._id
      );
      const averageHeat = calculateAverageHeat(pillarActions);

      return {
        pillarId: pillar._id,
        position: pillar.position,
        title: pillar.title,
        heat: heatLevelFromScore(averageHeat),
        actions: pillarActions,
        averageHeat,
      };
    });

    // Overall momentum
    const overallMomentum = calculateOverallMomentum(pillarHeats);

    return {
      goalId,
      goalHeat: heatLevelFromScore((overallMomentum / 100) * 4),
      pillars: pillarHeats,
      overallMomentum,
      lastUpdated: now,
    };
  },
});

function calculateHeatLevel(daysSince: number, streak: number): HeatLevel {
  if (streak >= 3) return "fire";
  if (daysSince <= 2) return "hot";
  if (daysSince <= 7) return "warm";
  if (daysSince <= 14) return "warming";
  return "cold";
}

function calculateStreak(timestamps: number[], now: number): number {
  if (timestamps.length === 0) return 0;

  // Sort descending
  const sorted = [...timestamps].sort((a, b) => b - a);

  let streak = 0;
  let checkDate = new Date(now);
  checkDate.setHours(0, 0, 0, 0);

  for (const timestamp of sorted) {
    const activityDate = new Date(timestamp);
    activityDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (checkDate.getTime() - activityDate.getTime()) / DAY_MS
    );

    if (daysDiff <= 1) {
      streak++;
      checkDate = activityDate;
    } else {
      break;
    }
  }

  return streak;
}

function calculateAverageHeat(actions: ActionHeat[]): number {
  if (actions.length === 0) return 0;

  const heatScores = actions.map((a) => {
    switch (a.heat) {
      case "fire":
        return 4;
      case "hot":
        return 3;
      case "warm":
        return 2;
      case "warming":
        return 1;
      case "cold":
        return 0;
    }
  });

  return heatScores.reduce((a, b) => a + b, 0) / heatScores.length;
}

function heatLevelFromScore(score: number): HeatLevel {
  if (score >= 3.5) return "fire";
  if (score >= 2.5) return "hot";
  if (score >= 1.5) return "warm";
  if (score >= 0.5) return "warming";
  return "cold";
}

function calculateOverallMomentum(pillars: PillarHeat[]): number {
  const warmOrHotter = pillars.filter((p) =>
    ["warm", "hot", "fire"].includes(p.heat)
  ).length;
  return Math.round((warmOrHotter / pillars.length) * 100);
}
```

---

## Opik Observability Integration

### Setup

```typescript
// lib/opik/client.ts
import { Opik } from "opik";

export const opik = new Opik({
  apiKey: process.env.OPIK_API_KEY,
  projectName: "polaris",
});
```

### Tracing Wrapper

```typescript
// lib/opik/tracing.ts
import { opik } from "./client";

export function withTracing<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T,
  attributes?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    const trace = opik.startTrace(name);

    if (attributes) {
      trace.setAttributes(attributes);
    }

    try {
      const result = await fn(...args);
      trace.setStatus("ok");
      return result;
    } catch (error) {
      trace.setStatus("error");
      trace.addError(error);
      throw error;
    } finally {
      trace.end();
    }
  }) as T;
}

export function traceConversation(
  context: string,
  userId: string,
  goalId?: string
) {
  return opik.startTrace("conversation", {
    attributes: {
      context,
      userId,
      goalId,
    },
  });
}

export function traceCoachingIntervention(
  type: string,
  userId: string,
  goalId: string,
  pillarId?: string
) {
  return opik.startTrace("coaching_intervention", {
    attributes: {
      type,
      userId,
      goalId,
      pillarId,
    },
  });
}
```

### Key Trace Points

```typescript
// Trace 1: Goal Crafting Conversation
{
  name: "goal_crafting",
  spans: [
    {
      name: "initial_input",
      attributes: { userInput: "...", wordCount: 5 }
    },
    {
      name: "refinement_turn_1",
      attributes: {
        aiQuestion: "...",
        userResponse: "...",
        specificity_improved: true
      }
    },
    // ... more turns
    {
      name: "goal_confirmed",
      attributes: {
        finalGoal: "...",
        turnsToConfirm: 4,
        hasDeadline: true,
        isMeasurable: true
      }
    }
  ]
}

// Trace 2: Action Mapping
{
  name: "action_mapping",
  spans: [
    {
      name: "input_analysis",
      attributes: {
        userInput: "Did a 5K and meal prepped",
        detectedActivities: 2
      }
    },
    {
      name: "mapping_result",
      attributes: {
        mappedActionIds: ["action_12", "action_34"],
        confidence: 0.94,
        pillarsAffected: 2
      }
    }
  ]
}

// Trace 3: Coaching Intervention
{
  name: "coaching_intervention",
  spans: [
    {
      name: "intervention_trigger",
      attributes: {
        type: "cold_pillar_nudge",
        pillar: "Recovery",
        daysSinceActivity: 9
      }
    },
    {
      name: "message_generation",
      attributes: {
        message: "...",
        tone: "gentle",
        suggestionIncluded: true
      }
    },
    {
      name: "user_response",
      attributes: {
        responded: true,
        responseTime: 3600000, // 1 hour
        sentiment: "positive"
      }
    },
    {
      name: "follow_up_action",
      attributes: {
        actionLogged: true,
        daysToAction: 3,
        interventionEffective: true
      }
    }
  ]
}
```

### Evaluation Metrics

```typescript
// lib/opik/evaluations.ts
import { opik } from "./client";

// Metric 1: Goal Crafting Efficiency
export async function evaluateGoalCrafting(traceId: string) {
  const trace = await opik.getTrace(traceId);

  return {
    turnsToConfirm: trace.spans.length,
    specificity_score: calculateSpecificityScore(trace),
    user_satisfaction: trace.attributes.userConfirmed ? 1 : 0,
  };
}

// Metric 2: Action Mapping Accuracy
export async function evaluateActionMapping(traceId: string) {
  const trace = await opik.getTrace(traceId);

  return {
    confidence: trace.attributes.confidence,
    actions_mapped: trace.attributes.mappedActionIds.length,
    false_positive_rate: await calculateFalsePositiveRate(trace),
  };
}

// Metric 3: Coaching Effectiveness
export async function evaluateCoachingEffectiveness(traceId: string) {
  const trace = await opik.getTrace(traceId);

  return {
    user_responded: trace.attributes.userResponded ? 1 : 0,
    led_to_action: trace.attributes.actionLogged ? 1 : 0,
    days_to_action: trace.attributes.daysToAction || null,
    intervention_type: trace.attributes.type,
  };
}

// Dashboard queries
export async function getCoachingEffectivenessReport(
  startDate: Date,
  endDate: Date
) {
  const traces = await opik.queryTraces({
    name: "coaching_intervention",
    startTime: startDate,
    endTime: endDate,
  });

  const byType = groupBy(traces, (t) => t.attributes.type);

  return Object.entries(byType).map(([type, typeTraces]) => ({
    type,
    count: typeTraces.length,
    responseRate:
      typeTraces.filter((t) => t.attributes.userResponded).length /
      typeTraces.length,
    actionRate:
      typeTraces.filter((t) => t.attributes.actionLogged).length /
      typeTraces.length,
    avgDaysToAction: average(
      typeTraces
        .filter((t) => t.attributes.daysToAction)
        .map((t) => t.attributes.daysToAction)
    ),
  }));
}
```

---

## UI/UX Specifications

### Design System

#### Color Palette

```css
/* Base - Night Sky Theme */
--background: #0a0a1a; /* Deep space */
--foreground: #f0f0f5; /* Starlight */
--card: #12122a; /* Dark navy */
--card-foreground: #f0f0f5;

/* Primary - Polaris Gold */
--primary: #fbbf24; /* Amber-400 */
--primary-foreground: #0a0a1a;

/* Heat Map Colors */
--heat-cold: #334155; /* Slate-700 */
--heat-warming: #1e3a5f; /* Blue-900 */
--heat-warm: #b45309; /* Amber-700 */
--heat-hot: #f59e0b; /* Amber-500 */
--heat-fire: #fbbf24; /* Amber-400 + pulse */

/* Accents */
--success: #22c55e; /* Green-500 */
--warning: #eab308; /* Yellow-500 */
--error: #ef4444; /* Red-500 */
--muted: #64748b; /* Slate-500 */
```

#### Typography

```css
/* Headings - Clean, modern */
font-family: "Inter", system-ui, sans-serif;

/* Display (Hero, Goal Title) */
.text-display {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Headings */
.text-h1 {
  font-size: 2rem;
  font-weight: 600;
}
.text-h2 {
  font-size: 1.5rem;
  font-weight: 600;
}
.text-h3 {
  font-size: 1.25rem;
  font-weight: 500;
}

/* Body */
.text-body {
  font-size: 1rem;
  line-height: 1.6;
}
.text-small {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Mandala Cell */
.text-cell {
  font-size: 0.625rem;
  line-height: 1.2;
}
```

### Component Specifications

#### MandalaGrid Component

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Desktop: 540px × 540px (60px cells)                       │
│  Mobile: 100% width, square aspect ratio                   │
│                                                             │
│  Grid: 9 columns × 9 rows                                  │
│  Gap: 2px                                                   │
│  Border radius: 4px per cell                               │
│                                                             │
│  Center cell (goal): Larger text, always warm glow         │
│  Pillar cells: Medium text, position labels                │
│  Action cells: Small text, truncated with tooltip          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### MandalaCell States

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│             │  │             │  │             │
│    COLD     │  │   WARMING   │  │    WARM     │
│             │  │             │  │             │
│  slate-700  │  │  blue-900   │  │  amber-700  │
│  opacity 50 │  │  subtle     │  │  visible    │
│             │  │  glow       │  │  warmth     │
└─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐
│             │  │   ∿∿∿∿∿∿    │
│     HOT     │  │   ON FIRE   │
│             │  │   ∿∿∿∿∿∿    │
│  amber-500  │  │  amber-400  │
│  bright     │  │  pulse      │
│             │  │  animation  │
└─────────────┘  └─────────────┘
```

#### ChatInterface Component

```
┌─────────────────────────────────────────────────────────────┐
│  Chat Header (context indicator)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🤖 Polaris                                    10:32 │   │
│  │                                                     │   │
│  │ Message content with markdown support               │   │
│  │ - Bullet points                                     │   │
│  │ - **Bold text**                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                              👤 You │   │
│  │                                                     │   │
│  │ User message aligned right                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Streaming indicator when AI is responding]               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐  ┌────┐  │
│  │ Type your message...                        │  │ ➤  │  │
│  └─────────────────────────────────────────────┘  └────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Screen Layouts

#### Dashboard (Main Screen)

```
┌─────────────────────────────────────────────────────────────┐
│  ☰  POLARIS                                         👤 JD  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              [MANDALA HEAT MAP]                     │   │
│  │                   9x9 Grid                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 🔥 12    │ │ 📊 6/8   │ │ ⚡ 5     │ │ 📅 23    │      │
│  │ streak   │ │ pillars  │ │ day      │ │ actions  │      │
│  │          │ │ active   │ │ streak   │ │ touched  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [QUICK CHECK-IN CHAT]                              │   │
│  │  "What did you accomplish today?"                   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Type what you did...                        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Layout

```
┌───────────────────────┐
│  ☰  POLARIS      👤  │
├───────────────────────┤
│                       │
│  ┌─────────────────┐  │
│  │                 │  │
│  │  [MANDALA]      │  │
│  │   Compact       │  │
│  │   9x9 Grid      │  │
│  │                 │  │
│  └─────────────────┘  │
│                       │
│  🔥 5 day streak      │
│  📊 6/8 pillars hot   │
│                       │
├───────────────────────┤
│                       │
│  [CHAT INTERFACE]     │
│                       │
│  Recent messages      │
│  scrollable           │
│                       │
│  ┌─────────────────┐  │
│  │ Type here...    │  │
│  └─────────────────┘  │
│                       │
└───────────────────────┘
```

---

## Build Timeline

### Week 1: Foundation + Goal Crafting (Jan 13-19)

#### Day 1-2: Project Setup

- [ ] Unzip project, run `npm install`
- [ ] Create Clerk app → add keys to `.env.local`
- [ ] Run `npx convex dev` → initialize and deploy schema
- [ ] Add Anthropic API key to `.env.local`
- [ ] Create Opik/Comet account → add key to `.env.local`
- [ ] Verify `npm run dev` works (landing page loads)
- [ ] Deploy to Vercel (get CI/CD going early)

**Files to create:**

- `.env.local` (from `.env.example`)

#### Day 3-4: Auth + Dashboard Shell

- [ ] Create sign-in page: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- [ ] Create sign-up page: `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- [ ] Create auth layout: `src/app/(auth)/layout.tsx`
- [ ] Create main layout with sidebar: `src/app/(main)/layout.tsx`
- [ ] Create dashboard page: `src/app/(main)/dashboard/page.tsx`
- [ ] Create Convex users functions: `convex/users.ts`
- [ ] Create Clerk middleware: `src/middleware.ts`
- [ ] Sync Clerk user to Convex on sign-in

**Files to create:**

- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(main)/layout.tsx`
- `src/app/(main)/dashboard/page.tsx`
- `convex/users.ts`
- `src/middleware.ts`

#### Day 5-7: Goal Crafting Chat

- [ ] Build ChatMessage component: `src/components/chat/ChatMessage.tsx`
- [ ] Build ChatInput component: `src/components/chat/ChatInput.tsx`
- [ ] Build ChatInterface component: `src/components/chat/ChatInterface.tsx`
- [ ] Create chat API route: `src/app/api/chat/route.ts`
- [ ] Wire up `GOAL_CRAFTING_PROMPT` from `src/lib/ai/prompts.ts`
- [ ] Create Convex goals functions: `convex/goals.ts`
- [ ] Parse `---GOAL_CONFIRMED---` from AI response → save goal
- [ ] Build craft page: `src/app/(main)/craft/page.tsx`
- [ ] Build mini-map preview component: `src/components/mandala/MiniMap.tsx`
- [ ] Add basic Opik tracing: `src/lib/opik/client.ts`

**Files to create:**

- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/components/chat/ChatInterface.tsx`
- `src/components/chat/index.ts`
- `src/app/api/chat/route.ts`
- `convex/goals.ts`
- `src/app/(main)/craft/page.tsx`
- `src/components/mandala/MiniMap.tsx`
- `src/lib/opik/client.ts`

**Week 1 Deliverable:** User can sign up, have a conversation with Polaris, and create a refined, specific goal.

---

### Week 2: Pillars + Actions + Mandala (Jan 20-26)

#### Day 8-10: Pillar Creation

- [ ] Create pillars page: `src/app/(main)/craft/pillars/page.tsx`
- [ ] Build PillarWizard component: `src/components/craft/PillarWizard.tsx`
- [ ] Add three input mode buttons (user-driven / AI-suggested / collaborative)
- [ ] Update chat API to handle pillar context
- [ ] Wire up `PILLAR_CRAFTING_PROMPT` with dynamic goal context
- [ ] Create Convex pillars functions: `convex/pillars.ts`
- [ ] Parse `---PILLAR_CONFIRMED---` → save pillar
- [ ] Update MiniMap to show 8 pillar slots filling in
- [ ] Add progress indicator component (X/8 pillars)

**Files to create:**

- `src/app/(main)/craft/pillars/page.tsx`
- `src/components/craft/PillarWizard.tsx`
- `src/components/craft/ProgressIndicator.tsx`
- `convex/pillars.ts`

#### Day 11-12: Action Creation

- [ ] Create actions page: `src/app/(main)/craft/actions/[pillarId]/page.tsx`
- [ ] Build ActionWizard component: `src/components/craft/ActionWizard.tsx`
- [ ] Wire up `ACTION_CRAFTING_PROMPT` with pillar context
- [ ] Create Convex actions functions: `convex/actions.ts`
- [ ] Parse `---ACTION_CONFIRMED---` → save action
- [ ] Build action list component with edit/delete
- [ ] Loop navigation through all 8 pillars
- [ ] "Complete Setup" button when 64 actions done
- [ ] Update goal status to "active" on completion

**Files to create:**

- `src/app/(main)/craft/actions/[pillarId]/page.tsx`
- `src/components/craft/ActionWizard.tsx`
- `src/components/craft/ActionList.tsx`
- `convex/actions.ts`

#### Day 13-14: Mandala Visualization

- [ ] Build MandalaCell component: `src/components/mandala/MandalaCell.tsx`
- [ ] Build MandalaGrid component: `src/components/mandala/MandalaGrid.tsx`
- [ ] Create grid position mapping logic (pillar + action → row/col)
- [ ] Create mandala page: `src/app/(main)/mandala/page.tsx`
- [ ] Build reveal animation (cells animate in sequence)
- [ ] Build cell detail modal: `src/components/mandala/CellDetail.tsx`
- [ ] Add click-to-expand for pillar and action details
- [ ] Mobile responsive grid (smaller cells on mobile)
- [ ] Add share/screenshot button

**Files to create:**

- `src/components/mandala/MandalaCell.tsx`
- `src/components/mandala/MandalaGrid.tsx`
- `src/components/mandala/CellDetail.tsx`
- `src/components/mandala/index.ts`
- `src/app/(main)/mandala/page.tsx`

**Week 2 Deliverable:** Complete Phase 1 flow. User can create full 1-8-64 mandala with AI assistance and see the reveal.

---

### Week 3: Tracking + Heat Map (Jan 27 - Feb 2)

#### Day 15-17: Check-In System

- [ ] Create check-in page: `src/app/(main)/check-in/page.tsx`
- [ ] Adapt ChatInterface for check-in context
- [ ] Create action mapping API: `src/app/api/map-actions/route.ts`
- [ ] Wire up `ACTION_MAPPING_PROMPT` with user's 64 actions
- [ ] Create Convex checkIns functions: `convex/checkIns.ts`
- [ ] Create Convex actionActivity functions: `convex/actionActivity.ts`
- [ ] Parse `---MAPPING---` → log activity for each mapped action
- [ ] Show confirmation UI of what was logged
- [ ] Add Opik tracing for mapping accuracy

**Files to create:**

- `src/app/(main)/check-in/page.tsx`
- `src/app/api/map-actions/route.ts`
- `convex/checkIns.ts`
- `convex/actionActivity.ts`

#### Day 18-19: Heat Map Implementation

- [ ] Create heat map query: `convex/heatMap.ts`
- [ ] Implement `calculateHeatLevel()` (cold → warming → warm → hot → fire)
- [ ] Implement `calculateStreak()` (consecutive days)
- [ ] Add real-time subscription to heat changes in MandalaGrid
- [ ] Update MandalaCell to accept heat prop and animate changes
- [ ] Add pillar-level heat aggregation
- [ ] Update center cell to show overall momentum

**Files to create:**

- `convex/heatMap.ts`
- `src/hooks/useHeatMap.ts`

#### Day 20-21: Coaching Responses

- [ ] Wire up `CHECK_IN_PROMPT` with heat context
- [ ] Detect cold pillars (7+ days no activity)
- [ ] Detect hot pillars / streaks (3+ consecutive days)
- [ ] Generate coaching response after each check-in
- [ ] Create Convex coaching functions: `convex/coachingInterventions.ts`
- [ ] Log all interventions for Opik analysis
- [ ] Show coaching message in check-in UI

**Files to create:**

- `convex/coachingInterventions.ts`
- `src/lib/ai/coaching.ts`

**Week 3 Deliverable:** Full tracking loop works. User can check in naturally, see heat map update in real-time, receive adaptive coaching.

---

### Week 4: Polish + Opik + Demo (Feb 3-10)

#### Day 22-23: Coaching Intelligence

- [ ] Add weekly reflection trigger (detect Sunday)
- [ ] Create reflection prompt UI
- [ ] Implement proactive cold pillar nudges (after 7 days)
- [ ] Implement streak celebration messages (3, 7, 14, 30 days)
- [ ] Wire up `COACHING_INTERVENTION_PROMPT`
- [ ] Track: intervention → user response → follow-up action correlation
- [ ] Store effectiveness data in Convex

**Files to create:**

- `src/components/coaching/WeeklyReflection.tsx`
- `src/components/coaching/ColdPillarNudge.tsx`
- `src/components/coaching/StreakCelebration.tsx`

#### Day 24-25: Opik Dashboard + Analytics

- [ ] Complete Opik tracing setup: `src/lib/opik/tracing.ts`
- [ ] Add evaluation functions: `src/lib/opik/evaluations.ts`
- [ ] Create coaching effectiveness queries
- [ ] Create goal crafting efficiency metrics
- [ ] Create action mapping accuracy reports
- [ ] Build analytics page: `src/app/(main)/analytics/page.tsx`
- [ ] Add user progress charts

**Files to create:**

- `src/lib/opik/tracing.ts`
- `src/lib/opik/evaluations.ts`
- `src/app/(main)/analytics/page.tsx`
- `src/components/analytics/EffectivenessChart.tsx`
- `src/components/analytics/ProgressChart.tsx`

#### Day 26-27: Polish

- [ ] Add loading states to all async operations
- [ ] Add error boundaries and fallback UI
- [ ] Create empty states (no goal yet, no check-ins yet)
- [ ] Add toast notifications (sonner or similar)
- [ ] Add keyboard shortcuts (Enter to send in chat)
- [ ] Mobile optimization pass (test on real device)
- [ ] Accessibility pass (focus states, aria labels, color contrast)
- [ ] Performance optimization (lazy load heavy components)

**Files to create:**

- `src/components/ui/LoadingState.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/ErrorBoundary.tsx`

#### Day 28: Demo Prep + Submission

- [ ] Seed demo account with compelling sample data
- [ ] Create demo user journey (goal → pillars → actions → check-ins → coaching)
- [ ] Record 2-3 minute demo video
- [ ] Capture screenshots for submission
- [ ] Write hackathon submission description
- [ ] Final Opik dashboard polish (clean up test data)
- [ ] Submit to Encode Club! 🚀

**Week 4 Deliverable:** Polished, demo-ready app with compelling Opik observability story.

---

## Quick Reference: Files by Day

| Day   | Key Files to Create                                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1-2   | `.env.local`                                                                                                                       |
| 3-4   | `src/app/(auth)/*`, `src/app/(main)/layout.tsx`, `src/app/(main)/dashboard/page.tsx`, `convex/users.ts`, `src/middleware.ts`       |
| 5-7   | `src/components/chat/*`, `src/app/api/chat/route.ts`, `convex/goals.ts`, `src/app/(main)/craft/page.tsx`, `src/lib/opik/client.ts` |
| 8-10  | `src/app/(main)/craft/pillars/page.tsx`, `src/components/craft/PillarWizard.tsx`, `convex/pillars.ts`                              |
| 11-12 | `src/app/(main)/craft/actions/[pillarId]/page.tsx`, `src/components/craft/ActionWizard.tsx`, `convex/actions.ts`                   |
| 13-14 | `src/components/mandala/*`, `src/app/(main)/mandala/page.tsx`                                                                      |
| 15-17 | `src/app/(main)/check-in/page.tsx`, `src/app/api/map-actions/route.ts`, `convex/checkIns.ts`, `convex/actionActivity.ts`           |
| 18-19 | `convex/heatMap.ts`, `src/hooks/useHeatMap.ts`                                                                                     |
| 20-21 | `convex/coachingInterventions.ts`, `src/lib/ai/coaching.ts`                                                                        |
| 22-23 | `src/components/coaching/*`                                                                                                        |
| 24-25 | `src/lib/opik/*`, `src/app/(main)/analytics/page.tsx`, `src/components/analytics/*`                                                |
| 26-27 | `src/components/ui/LoadingState.tsx`, `src/components/ui/EmptyState.tsx`, `src/components/ui/ErrorBoundary.tsx`                    |
| 28    | Demo prep, no new files                                                                                                            |

---

## Convex Functions Reference

| File                              | Functions to Implement                                   |
| --------------------------------- | -------------------------------------------------------- |
| `convex/users.ts`                 | `create`, `getByClerkId`, `update`                       |
| `convex/goals.ts`                 | `create`, `getById`, `getActiveGoal`, `update`, `list`   |
| `convex/pillars.ts`               | `create`, `getByGoal`, `update`, `delete`                |
| `convex/actions.ts`               | `create`, `getByPillar`, `getByGoal`, `update`, `delete` |
| `convex/checkIns.ts`              | `create`, `getByGoal`, `getRecent`                       |
| `convex/actionActivity.ts`        | `create`, `getByAction`, `getByGoal`, `getRecent`        |
| `convex/heatMap.ts`               | `getByGoal` (query with heat calculations)               |
| `convex/coachingInterventions.ts` | `create`, `getByGoal`, `markResponded`, `markEffective`  |

---

## Success Metrics

### Hackathon Success

- [ ] Functional app submitted before deadline
- [ ] Compelling demo video (< 3 minutes)
- [ ] Clear Opik integration story
- [ ] Judge-ready presentation

### Product Metrics (Post-Hackathon)

| Metric                   | Target | Measurement                                |
| ------------------------ | ------ | ------------------------------------------ |
| Onboarding completion    | > 60%  | Users who complete full 1-8-64 setup       |
| Day 7 retention          | > 30%  | Users who check in at least once in week 2 |
| Avg check-ins/week       | > 3    | Active users' weekly check-in count        |
| Coaching response rate   | > 50%  | % of nudges that get user response         |
| Intervention→action rate | > 25%  | Nudges that lead to logged activity        |

### Opik Metrics (Demo Focus)

| Metric                         | What It Shows                                |
| ------------------------------ | -------------------------------------------- |
| Goal crafting turns            | How efficiently AI refines vague goals       |
| Action mapping confidence      | How well AI understands natural language     |
| Coaching effectiveness by type | Which intervention strategies work           |
| Cold→warm conversion           | Can AI coaching reactivate neglected pillars |

---

## Future Enhancements (Post-Hackathon)

### V1.1: Social Features

- Share mandala publicly
- Accountability buddy matching
- Community challenges

### V1.2: Integrations

- Calendar sync (block time for actions)
- Fitness app imports (auto-log runs)
- Notification preferences

### V1.3: Advanced Coaching

- Voice check-ins
- Personalized coaching style learning
- Goal adjustment suggestions

### V1.4: Teams/Enterprise

- Team goals with shared pillars
- Manager dashboards
- OKR integration

---

## Appendix

### A: Ohtani's Original Mandala (Reference)

**Goal:** Be the #1 draft pick in NPB

**8 Pillars:**

1. Physical Training
2. Ball Control
3. Pitch Quality
4. Mental Strength
5. Character
6. Adaptability
7. Breaking Ball
8. 160km Fastball

**Sample Actions (Character pillar):**

- Be caring
- Keep room clean
- Be well-mannered
- Read books
- Think positively
- Continue habits
- Be grateful
- Punctuality

### B: Example Goal Flows

**Example 1: Fitness Goal**

- Goal: "Complete a marathon in under 4 hours by October 2026"
- Pillars: Endurance, Strength, Nutrition, Recovery, Mental Game, Schedule, Gear, Support
- Sample Actions (Endurance): Run 4x/week, Weekly long run, Track all runs, Join running group, Follow training plan, Do tempo runs, Practice race pace, Register for tune-up races

**Example 2: Career Goal**

- Goal: "Get promoted to Senior Engineer by end of 2026"
- Pillars: Technical Skills, Visibility, Mentorship, Documentation, Side Projects, Networking, Communication, Work-Life Balance
- Sample Actions (Visibility): Present at team meetings, Write engineering blog posts, Lead one project, Document wins weekly, Share learnings in Slack, Volunteer for demos, Contribute to RFCs, Ask for feedback monthly

### C: Key Prompts Quick Reference

See `lib/ai/prompts.ts` for full prompts:

- `POLARIS_BASE_PROMPT` - Core personality
- `GOAL_CRAFTING_PROMPT` - Phase 1 goal definition
- `PILLAR_CRAFTING_PROMPT` - Phase 1 pillar creation
- `ACTION_CRAFTING_PROMPT` - Phase 1 action definition
- `CHECK_IN_PROMPT` - Phase 2 tracking
- `COACHING_INTERVENTION_PROMPT` - Proactive nudges

---

## Document History

| Version | Date         | Author          | Changes     |
| ------- | ------------ | --------------- | ----------- |
| 1.0     | Jan 16, 2026 | Justin + Claude | Initial PRD |

---

_Built for the Encode Club "Commit To Change" Hackathon_
_Powered by Claude, Vercel AI SDK, Convex, and Opik_
