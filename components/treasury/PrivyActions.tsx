"use client";

import { usePrivy } from "@privy-io/react-auth";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { LOADER_STATUS } from "@/lib/ui/loader";

export function PrivyActions() {
  const { ready, authenticated, login, logout } = usePrivy();
  if (!ready) return <AppLoader variant="inline" status={LOADER_STATUS.treasury} />;
  return (
    <Button variant="ghost" onClick={() => (authenticated ? logout() : login())}>
      {authenticated ? "Sign out" : "Sign in to treasury"}
    </Button>
  );
}
