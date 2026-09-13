import { jsonError, jsonOk } from "@/lib/http";
import { evaluateReliefRequest } from "@/lib/relief/agent";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";

export async function POST(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["relief_reviewer", "program_admin", "system_agent"]);
    const { reliefRequestId } = await context.params;
    const result = await evaluateReliefRequest(reliefRequestId);
    return jsonOk({
      decision: result.decision,
      calculatedGrantAmount: result.grantAmount,
      reasonCodes: result.reasonCodes,
    });
  } catch (error) {
    return jsonError(error);
  }
}
