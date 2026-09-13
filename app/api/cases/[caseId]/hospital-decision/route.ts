import { jsonError, jsonOk } from "@/lib/http";
import { recordHospitalDecision } from "@/lib/db/cases";
import { assertRole, readSession, staffAuthorized } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { ApiError } from "@/lib/errors";
import { hospitalDecisionSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) {
      assertRole(session, ["relief_reviewer", "program_admin"]);
      if (!staffAuthorized(request)) {
        throw new ApiError("FORBIDDEN", "Staff authorization required.", 403);
      }
    }
    const { caseId } = await context.params;
    const body = hospitalDecisionSchema.parse(await request.json());
    const decision = await recordHospitalDecision(caseId, body);
    return jsonOk({
      decisionId: decision.id,
      status: decision.status,
      originalBalance: decision.originalBalance,
      approvedAssistance: decision.approvedAssistance,
      remainingBalance: decision.remainingBalance,
      source: decision.source,
    });
  } catch (error) {
    return jsonError(error);
  }
}
