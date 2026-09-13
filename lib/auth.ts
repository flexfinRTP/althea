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

export async function readSession(): Promise<Session> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) {
    return { userId: "anon", role: "patient", caseIds: [] };
  }
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return { userId: "anon", role: "patient", caseIds: [] };
  }
}

export async function writeSession(session: Session) {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(session), {
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
