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
      <p className="text-sm text-[#5c564c]">
        World: We couldn&apos;t complete the liveness check. Try again or request manual review.
      </p>
      <p className="text-sm text-[#5c564c]">Arc: Settlement submitted. Waiting for confirmation.</p>
      <p className="text-sm text-[#5c564c]">Privy: Treasury authorization could not be completed. No funds moved.</p>
      <p className="text-sm text-[#5c564c]">
        Agent: Relief review could not be completed automatically. This case requires manual review.
      </p>
      <button className="rounded-md bg-[#1f4a43] px-4 py-2 text-[#fffdf8]" onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
