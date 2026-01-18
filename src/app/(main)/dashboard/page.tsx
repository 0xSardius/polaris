"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Target, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrent);

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Your journey to achieving your goals starts here.
        </p>
      </div>

      {/* No goal state */}
      {!user?.onboardingComplete && (
        <div className="bg-card rounded-xl p-8 border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                Ready to set your goal?
              </h2>
              <p className="text-muted-foreground mb-4">
                Let&apos;s transform your resolution into 64 actionable daily
                habits using the Ohtani Method. I&apos;ll guide you through the
                process step by step.
              </p>
              <Link
                href="/craft"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Target className="w-4 h-4" />
                Start Crafting Your Goal
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for when user has a goal */}
      {user?.onboardingComplete && (
        <div className="grid gap-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Your Mandala</h2>
            <p className="text-muted-foreground">
              Goal visualization will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
