export function roundUsd(amount: number): number {
  return Math.round(amount);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(roundUsd(amount));
}

export function parseUsdInput(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

export function usdcToAtomic(amount: number, decimals = 6): bigint {
  return BigInt(roundUsd(amount)) * 10n ** BigInt(decimals);
}

export function atomicToUsdc(amount: bigint, decimals = 6): number {
  return Number(amount / 10n ** BigInt(decimals));
}
