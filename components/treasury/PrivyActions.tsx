"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/Button";

export function PrivyActions() {
  const { ready, authenticated, login, logout } = usePrivy();
  if (!ready) return <p>Loading treasury controls...</p>;
  return (
    <Button variant="ghost" onClick={() => (authenticated ? logout() : login())}>
      {authenticated ? "Sign out" : "Sign in to treasury"}
    </Button>
  );
}
