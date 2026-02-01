"use client";

import { UserButton } from "@clerk/nextjs";
import { UserSync } from "@/components/providers/user-sync";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Target, MessageSquare, Info, ChevronDown, ChevronUp } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Goal", href: "/craft", icon: Target },
  { name: "Check In", href: "/check-in", icon: MessageSquare },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [methodExpanded, setMethodExpanded] = useState(false);

  return (
    <UserSync>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold text-primary">Polaris</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* How It Works section */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setMethodExpanded(!methodExpanded)}
              className="flex items-center justify-between w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                The Ohtani Method
              </span>
              {methodExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {methodExpanded && (
              <div className="mt-3 text-xs text-muted-foreground space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <p>
                  The <span className="text-foreground font-medium">Ohtani Method</span> (also called the Harada Method) is the goal-setting system Shohei Ohtani used at age 18 to plan his path to MLB stardom.
                </p>

                <div className="space-y-2">
                  <p className="text-foreground font-medium">How it works:</p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex gap-2">
                      <span className="text-primary">1.</span>
                      <span>Define one clear goal at the center</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">2.</span>
                      <span>Identify 8 pillars that support your goal</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">3.</span>
                      <span>Break each pillar into 8 daily actions</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">4.</span>
                      <span>Track consistency with the 9x9 mandala grid</span>
                    </li>
                  </ul>
                </div>

                <p className="pt-1 border-t border-border">
                  The result: <span className="text-foreground">64 concrete daily habits</span> that compound into extraordinary achievement.
                </p>
              </div>
            )}
          </div>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm text-muted-foreground">Account</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </UserSync>
  );
}
