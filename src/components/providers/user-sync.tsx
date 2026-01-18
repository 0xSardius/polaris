"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";

export function UserSync({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsert);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasSynced.current) {
      hasSynced.current = true;
      upsertUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.fullName ?? undefined,
        avatarUrl: user.imageUrl ?? undefined,
      }).catch(console.error);
    }
  }, [isLoaded, user, upsertUser]);

  return <>{children}</>;
}
