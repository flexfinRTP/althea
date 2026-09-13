"use client";

import { useEffect, useState } from "react";
import { formatUsd } from "@/lib/money";

export function BillReduction({
  original = 18420,
  hospital = 15950,
  relief = 500,
}: {
  original?: number;
  hospital?: number;
  relief?: number;
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
    <div aria-live="polite" className="space-y-5">
      <Row label="ORIGINAL BILL" amount={original} />
      {phase >= 1 ? <Row label="HOSPITAL FINANCIAL ASSISTANCE" amount={-hospital} /> : null}
      {phase >= 2 ? <Row label="ALTHEA RELIEF" amount={-relief} /> : null}
      <div className="border-t border-[#e3d9c8] pt-4">
        <Row
          label="REMAINING"
          amount={phase === 0 ? original : phase === 1 ? remainingAfterHospital : remaining}
        />
      </div>
    </div>
  );
}

function Row({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm tracking-wide text-[#5c564c]">{label}</span>
      <span className="text-5xl tabular-nums tracking-tight md:text-6xl">{formatUsd(amount)}</span>
    </div>
  );
}
