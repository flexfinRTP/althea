import { jsonError, jsonOk } from "@/lib/http";
import { getFullCase } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { ESTIMATE_DISCLAIMER } from "@/lib/config";
import { getCaseTimeline } from "@/lib/db/cases";

export async function GET(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    const bundle = getFullCase(caseId);
    canAccessCase(session, caseId, bundle.case.userId);
    return jsonOk({
      ...bundle,
      timeline: getCaseTimeline(caseId),
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}
