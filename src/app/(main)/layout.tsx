"use client";

import { UserButton } from "@clerk/nextjs";
import { UserSync } from "@/components/providers/user-sync";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, MessageSquare, BarChart3 } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Goal", href: "/craft", icon: Target },
  { name: "Check In", href: "/check-in", icon: MessageSquare },
  { name: "Progress", href: "/progress", icon: BarChart3 },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
