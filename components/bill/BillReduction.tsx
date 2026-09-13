"use client";

import { useEffect, useState } from "react";
import { formatUsd } from "@/lib/money";

export function BillReduction({
  original,
  hospital,
  relief,
  compact = false,
}: {
  original: number;
  hospital: number;
  relief: number;
  compact?: boolean;
}) {
  const [phase, setPhase] = useState(0);
  const remainingAfterHospital = original - hospital;
  const remaining = remainingAfterHospital - relief;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase(3);
      return;
    }
    const timers = [1, 2, 3].map((step, index) =>
      window.setTimeout(() => setPhase(step), 700 * (index + 1)),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div aria-live="polite" className={compact ? "space-y-3" : "space-y-5"}>
      <Row label="ORIGINAL BILL" amount={original} compact={compact} />
      {phase >= 1 ? (
        <Row label="HOSPITAL FINANCIAL ASSISTANCE" amount={-hospital} compact={compact} />
      ) : null}
      {phase >= 2 ? <Row label="ALTHEA RELIEF" amount={-relief} compact={compact} /> : null}
      <div className="border-t border-gold-soft pt-4">
        <Row
          label="REMAINING"
          amount={phase === 0 ? original : phase === 1 ? remainingAfterHospital : remaining}
          compact={compact}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  amount,
  compact,
}: {
  label: string;
  amount: number;
  compact?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm tracking-wide text-muted">{label}</span>
      <span
        className={`tabular-nums tracking-tight ${compact ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl"}`}
      >
        {formatUsd(amount)}
      </span>
    </div>
  );
}
