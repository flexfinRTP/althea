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

const MONEY_PATTERN = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

export function sanitizeMoneyInput(value: string): string {
  const compact = value.replace(/\s/g, "");
  const dollar = compact.startsWith("$") ? "$" : "";
  const body = (dollar ? compact.slice(1) : compact).replace(/[^0-9.,]/g, "");
  const dot = body.indexOf(".");
  if (dot === -1) return dollar + body;
  const whole = body.slice(0, dot).replace(/\./g, "");
  const frac = body.slice(dot + 1).replace(/[.,]/g, "").slice(0, 2);
  return `${dollar}${whole}.${frac}`;
}

export function sanitizeWholeNumberInput(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, "");
  return maxLength == null ? digits : digits.slice(0, maxLength);
}

export function sanitizeHexInput(value: string): string {
  const compact = value.replace(/\s/g, "");
  if (compact === "0" || compact === "0x" || compact === "0X") return compact === "0X" ? "0x" : compact;
  const prefixed = /^0x/i.test(compact);
  const body = (prefixed ? compact.slice(2) : compact).replace(/[^0-9a-fA-F]/g, "");
  return prefixed ? `0x${body}` : body;
}

export function parseUsdInput(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  if (!MONEY_PATTERN.test(cleaned)) return null;
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

export function formatDateTime(value?: string): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatIsoDate(value?: string): string {
  if (!value) return "Date not entered";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
