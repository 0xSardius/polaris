# ✦ Polaris

> Your AI guide to achieving your North Star

Transform one ambitious goal into 64 tangible actions using the Ohtani/Harada Method. Track progress with an AI coach that adapts.

**[Live Demo](https://polaris-rho-hazel.vercel.app)** | [GitHub](https://github.com/0xSardius/polaris)

## 🎯 What is Polaris?

Polaris is an AI-powered goal coaching app built for the [Encode Club "Commit To Change" Hackathon](https://www.encodeclub.com/programmes/comet-resolution-v2-hackathon).

**The Problem:** 92% of resolutions fail because they're vague, lack a system, and have no accountability.

**The Solution:** Polaris uses the same methodology that helped Shohei Ohtani become a baseball legend—breaking one big goal into 8 supporting pillars and 64 specific daily actions, with AI coaching to keep you on track.

## ✨ Features

- **AI-Guided Goal Crafting** — Conversational wizard to define your goal, pillars, and actions
- **Visual Mandala** — 9x9 heat map showing your progress across all 64 actions
- **Natural Language Check-ins** — Just tell Polaris what you did, it maps to your actions automatically
- **Adaptive Coaching** — AI notices patterns, celebrates streaks, nudges cold pillars

## 📸 Screenshots

| Goal Crafting | Mandala Dashboard | Check-in |
|:---:|:---:|:---:|
| AI guides you through defining your goal | Visual heat map of all 64 actions | Natural language activity logging |

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Database:** Convex (real-time subscriptions)
- **Auth:** Clerk
- **AI:** Claude Sonnet 4.5 via Vercel AI SDK v6
- **Observability:** Opik by Comet
- **Styling:** Tailwind CSS v4 + shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts: [Clerk](https://clerk.com), [Convex](https://convex.dev), [Anthropic](https://anthropic.com), [Comet/Opik](https://comet.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/0xSardius/polaris.git
cd polaris

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Initialize Convex
npx convex dev

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
polaris/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── mandala/     # Mandala grid components
│   │   ├── chat/        # Chat interface
│   │   └── craft/       # Goal crafting wizard
│   ├── lib/
│   │   ├── ai/          # AI prompts and logic
│   │   ├── opik/        # Observability setup
│   │   └── utils.ts     # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── convex/              # Convex backend
│   └── schema.ts        # Database schema
└── docs/
    └── PRD.md           # Product Requirements Document
```

## 🎨 Design System

**Color Palette: Night Sky + Polaris Gold**
- Background: Deep space (`#0a0a1a`)
- Primary: Polaris gold (`#fbbf24`)
- Heat states: Cold → Warming → Warm → Hot → Fire

## 📊 Hackathon Categories

Targeting:
- **Best Use of Opik** ($5,000) — Full observability of AI coaching effectiveness
- **Personal Growth & Learning** ($5,000) — Harada Method implementation

## 📖 The Harada Method

Created by Takashi Harada and famously used by Shohei Ohtani:

1. **1 Goal** — Specific, measurable, time-bound
2. **8 Pillars** — Balanced supporting areas (not just skills)
3. **64 Actions** — Daily behaviors, not outcomes

Ohtani's high school chart included "keep room clean" and "be caring" alongside baseball skills. Balance matters.

## 🤝 Contributing

This is a hackathon project, but feedback and ideas are welcome!

## 📝 License

MIT

---

Built with ☕ for the Encode Club "Commit To Change" Hackathon

*Powered by Claude, Vercel AI SDK, Convex, and Opik*
