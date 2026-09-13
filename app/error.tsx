"use client";

import { AppPage } from "@/components/app/AppChrome";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppPage kicker="Error" title="Something went wrong." lead="We couldn't complete this step.">
      <div className="space-y-2 text-sm text-muted">
        <p>World: We couldn&apos;t complete the liveness check. Try again or request manual review.</p>
        <p>Arc: Settlement submitted. Waiting for confirmation.</p>
        <p>Privy: Treasury authorization could not be completed. No funds moved.</p>
        <p>Agent: Relief review could not be completed automatically. This case requires manual review.</p>
      </div>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </AppPage>
  );
}
