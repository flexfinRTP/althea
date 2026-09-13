import { jsonError, jsonOk } from "@/lib/http";
import { createReliefRequest, getCase } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { reliefRequestSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, (await getCase(caseId)).userId);
    const body = reliefRequestSchema.parse(await request.json().catch(() => ({})));
    const relief = await createReliefRequest(caseId, body.programId, body.requestedAmount);
    return jsonOk({ reliefRequestId: relief.id, status: relief.status });
  } catch (error) {
    return jsonError(error);
  }
}
