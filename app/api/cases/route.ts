import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { createCase } from "@/lib/db/cases";
import { readSession, writeSession } from "@/lib/auth";
import { randomUUID } from "crypto";

const bodySchema = z.object({
  hospitalId: z.string(),
  billAmount: z.number().nonnegative(),
  householdSize: z.number().int().min(1),
  householdAnnualIncome: z.number().nonnegative(),
  insuranceStatus: z.enum(["insured", "uninsured"]),
  firstPostDischargeBillDate: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const session = await readSession();
    const userId = session.userId === "anon" ? `user_${randomUUID().slice(0, 8)}` : session.userId;
    const created = createCase({ ...body, userId });
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
