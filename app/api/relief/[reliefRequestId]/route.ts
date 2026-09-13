import { jsonError, jsonOk } from "@/lib/http";
import { getFullCase, getReliefRequest } from "@/lib/db/cases";
import { getProgramRules, getCaseReliefFacts } from "@/lib/relief/agent";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";

export async function GET(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["relief_reviewer", "program_admin", "treasury_admin"]);
    const { reliefRequestId } = await context.params;
    const request = await getReliefRequest(reliefRequestId);
    const bundle = await getFullCase(request.caseId);
    return jsonOk({
      reliefRequest: request,
      decision: bundle.decision,
      reliefDecision: bundle.reliefDecision,
      grant: bundle.grant,
      program: await getProgramRules(),
      facts: await getCaseReliefFacts(request.caseId),
    });
  } catch (error) {
    return jsonError(error);
  }
}
