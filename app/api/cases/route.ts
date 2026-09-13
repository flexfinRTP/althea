import { jsonError, jsonOk } from "@/lib/http";
import { createCase } from "@/lib/db/cases";
import { readSession, writeSession } from "@/lib/auth";
import { caseCreateSchema } from "@/lib/validation";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = caseCreateSchema.parse(await request.json());
    const session = await readSession();
    const userId = session.userId === "anon" ? `user_${randomUUID().slice(0, 8)}` : session.userId;
    const created = await createCase({ ...body, userId });
    await writeSession({
      userId,
      role: "patient",
      caseIds: [...session.caseIds, created.id],
    });
    return jsonOk({ caseId: created.id, status: created.status });
  } catch (error) {
    return jsonError(error);
  }
}
