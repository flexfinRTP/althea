import { jsonError, jsonOk } from "@/lib/http";
import { calculateCaseEstimate, getCase } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { ESTIMATE_DISCLAIMER } from "@/lib/config";

export async function POST(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    const caseRow = await getCase(caseId);
    canAccessCase(session, caseId, caseRow.userId);
    const estimate = await calculateCaseEstimate(caseId);
    return jsonOk({
      ...estimate,
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}
