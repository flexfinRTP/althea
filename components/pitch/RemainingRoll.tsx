"use client";

import { useEffect, useState } from "react";
import { formatUsd } from "@/lib/money";

export function RemainingRoll({ from, to }: { from: number; to: number }) {
  const [value, setValue] = useState(from);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      setDone(true);
      return;
    }

    let frame = 0;
    let start = 0;
    const hold = 420;
    const duration = 2400;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed < hold) {
        setValue(from);
        frame = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (elapsed - hold) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      setValue(to);
      setDone(true);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [from, to]);

  return (
    <>
      <p className="mt-[1.3em] text-[0.75em] font-medium uppercase tracking-[0.22em] text-gold">
        {done ? "Remaining" : "Bill"}
      </p>
      <p className="font-semibold tabular-nums leading-none tracking-tight text-gold-soft">
        <span className={`inline-block text-[6.2em] ${done ? "pitch-remain-pop" : ""}`}>
          {formatUsd(value)}
        </span>
      </p>
    </>
  );
}
