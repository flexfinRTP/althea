import { formatUsd } from "@/lib/money";

export function Money({ amount, large = false }: { amount: number; large?: boolean }) {
  const label = formatUsd(amount);
  return (
    <span
      className={`tabular-nums ${large ? "text-5xl tracking-tight md:text-6xl" : "text-2xl"}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}
