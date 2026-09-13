"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Something went wrong.</h1>
      <p>We couldn&apos;t complete this step.</p>
      <p className="text-sm text-muted">
        World: We couldn&apos;t complete the liveness check. Try again or request manual review.
      </p>
      <p className="text-sm text-muted">Arc: Settlement submitted. Waiting for confirmation.</p>
      <p className="text-sm text-muted">Privy: Treasury authorization could not be completed. No funds moved.</p>
      <p className="text-sm text-muted">
        Agent: Relief review could not be completed automatically. This case requires manual review.
      </p>
      <button className="rounded-md bg-green px-4 py-2 text-white" onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
