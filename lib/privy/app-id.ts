/** Privy app IDs are cuid-style. World IDs are `app_…`. */
const PRIVY_APP_ID_RE = /^[a-z][a-z0-9]{16,}$/i;

export function publicPrivyAppId(raw = process.env.NEXT_PUBLIC_PRIVY_APP_ID): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  const normalized = trimmed.startsWith("app_") ? trimmed.slice(4) : trimmed;
  if (!PRIVY_APP_ID_RE.test(normalized)) return undefined;
  return normalized;
}
