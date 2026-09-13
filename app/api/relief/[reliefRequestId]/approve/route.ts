import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { evaluateReliefRequest } from "@/lib/relief/agent";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { getReliefRequest } from "@/lib/db/cases";
import { writeAudit } from "@/lib/db/store";

const bodySchema = z.object({
  approvedAmount: z.number().positive().default(500),
});

export async function POST(request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["relief_reviewer", "program_admin"]);
    const { reliefRequestId } = await context.params;
    bodySchema.parse(await request.json().catch(() => ({})));
    const result = await evaluateReliefRequest(reliefRequestId, true);
    const relief = getReliefRequest(reliefRequestId);
    writeAudit({
      caseId: relief.caseId,
      actorType: "staff",
      actorId: session.userId,
      eventType: "RELIEF_HUMAN_APPROVED",
      metadata: { approvedAmount: result.grantAmount },
    });
    return jsonOk({ status: "approved", approvedAmount: result.grantAmount });
  } catch (error) {
    return jsonError(error);
  }
}
