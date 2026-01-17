import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        {/* Logo/Star */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/50">
            <span className="text-4xl">✦</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Polaris
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-2">
          Your AI guide to achieving your North Star
        </p>

        <p className="text-base text-muted-foreground/70 mb-8 max-w-xl mx-auto">
          Transform one ambitious goal into 64 daily actions using the method 
          that made Shohei Ohtani a legend. Track progress with an AI coach that adapts.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedOut>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="text-2xl mb-3">🎯</div>
          <h3 className="font-semibold mb-2">1 Goal</h3>
          <p className="text-sm text-muted-foreground">
            Define your North Star with AI-guided refinement
          </p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="text-2xl mb-3">🏛️</div>
          <h3 className="font-semibold mb-2">8 Pillars</h3>
          <p className="text-sm text-muted-foreground">
            Build balanced support across all areas of life
          </p>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-semibold mb-2">64 Actions</h3>
          <p className="text-sm text-muted-foreground">
            Transform ambition into trackable daily behaviors
          </p>
        </div>
      </div>

      {/* Method Attribution */}
      <div className="mt-16 text-center text-sm text-muted-foreground/50">
        <p>Based on the Ohtani/Harada Method</p>
      </div>
    </main>
  );
}
