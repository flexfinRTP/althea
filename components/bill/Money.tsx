import { formatUsd } from "@/lib/money";

export function Money({ amount, large = false }: { amount: number; large?: boolean }) {
  return (
    <span className={`tabular-nums ${large ? "text-5xl tracking-tight md:text-6xl" : "text-2xl"}`}>
      {formatUsd(amount)}
    </span>
  );
}
