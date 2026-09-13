import { jsonError, jsonOk } from "@/lib/http";
import { recordHospitalDecision } from "@/lib/db/cases";
import { isDemoMode } from "@/lib/config";
import { ApiError } from "@/lib/errors";
import { staffAuthorized } from "@/lib/auth";
import { demoHospitalDecisionSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    if (!isDemoMode()) {
      throw new ApiError("DEMO_ONLY", "Simulated hospital decisions are only available in demo mode.");
    }
    if (!staffAuthorized(request) && !isDemoMode()) {
      throw new ApiError("FORBIDDEN", "Staff authorization required.", 403);
    }
    const { caseId } = await context.params;
    const body = demoHospitalDecisionSchema.parse(await request.json().catch(() => ({})));
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
