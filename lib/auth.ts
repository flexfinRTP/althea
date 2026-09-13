import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { Role } from "@/lib/db/store";
import { isDemoMode, requireStaffKey } from "@/lib/config";
import { ApiError } from "@/lib/errors";

export type Session = {
  userId: string;
  role: Role;
  caseIds: string[];
};

const COOKIE = "althea_session";

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (isDemoMode()) return "demo-session-secret";
  throw new ApiError("SESSION_UNCONFIGURED", "Session signing is not configured.", 500);
}

function sign(payload: string): string {
  const mac = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return `${payload}.${mac}`;
}

function verify(raw: string): string | null {
  const index = raw.lastIndexOf(".");
  if (index <= 0) return null;
  const payload = raw.slice(0, index);
  const mac = raw.slice(index + 1);
  const expected = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  if (mac.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= mac.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0 ? payload : null;
}

export async function readSession(): Promise<Session> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) {
    return { userId: "anon", role: "patient", caseIds: [] };
  }
  try {
    const payload = verify(raw) ?? (isDemoMode() && !raw.includes(".") ? raw : null);
    if (!payload) return { userId: "anon", role: "patient", caseIds: [] };
    return JSON.parse(payload) as Session;
  } catch {
    return { userId: "anon", role: "patient", caseIds: [] };
  }
}

export async function writeSession(session: Session) {
  const jar = await cookies();
  jar.set(COOKIE, sign(JSON.stringify(session)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export function assertRole(session: Session, allowed: Role[]) {
  if (!allowed.includes(session.role)) {
    throw new ApiError("FORBIDDEN", "You are not allowed to perform this action.", 403);
  }
}

export function canAccessCase(session: Session, caseId: string, ownerId?: string) {
  if (session.role !== "patient") return true;
  if (session.caseIds.includes(caseId)) return true;
  if (ownerId && ownerId === session.userId) return true;
  if (isDemoMode() && (session.userId === "anon" || caseId === "demo")) return true;
  throw new ApiError("FORBIDDEN", "You can only view your own case.", 403);
}

export function staffAuthorized(request: Request): boolean {
  return requireStaffKey(request.headers.get("x-althea-staff-key"));
}
