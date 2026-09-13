import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { createReliefRequest, getCase } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { DEMO_PROGRAM_ID } from "@/lib/config";

const bodySchema = z.object({
  programId: z.string().default(DEMO_PROGRAM_ID),
  requestedAmount: z.number().positive().default(500),
});

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, getCase(caseId).userId);
    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const relief = createReliefRequest(caseId, body.programId, body.requestedAmount);
    return jsonOk({ reliefRequestId: relief.id, status: relief.status });
  } catch (error) {
    return jsonError(error);
  }
}
