"use client";

import { useEffect, useState } from "react";

export type AgentStep = {
  id: string;
  label: string;
  detail?: string;
  status: string;
};

export function AgentTrace({
  steps,
  executionSteps = [],
}: {
  steps: AgentStep[];
  executionSteps?: AgentStep[];
}) {
  const all = [...steps, ...executionSteps];
  const key = all.map((step) => `${step.id}:${step.status}`).join("|");
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(all.length);
      return;
    }
    setVisible(0);
    const timers = all.map((_, index) =>
      window.setTimeout(() => setVisible(index + 1), 280 * (index + 1)),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [key, all.length]);

  return (
    <ol className="space-y-4">
      {all.slice(0, visible).map((step) => (
        <li key={step.id} className="flex items-start justify-between gap-4 border-b border-[#e3d9c8] pb-3 last:border-0">
          <div>
            <p>{step.label}</p>
            {step.detail ? <p className="text-sm text-[#5c564c]">{step.detail}</p> : null}
          </div>
          <span aria-label={step.status === "complete" ? "complete" : step.status}>
            {step.status === "complete" ? "✓" : "•"}
          </span>
        </li>
      ))}
    </ol>
  );
}
