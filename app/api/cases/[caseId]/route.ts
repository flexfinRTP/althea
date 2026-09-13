import { jsonError, jsonOk } from "@/lib/http";
import { getFullCase, getCaseTimeline, updateCaseInputs, calculateCaseEstimate } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { ESTIMATE_DISCLAIMER } from "@/lib/config";
import { casePatchSchema, compactPatch } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    const bundle = await getFullCase(caseId);
    canAccessCase(session, caseId, bundle.case.userId);
    return jsonOk({
      ...bundle,
      timeline: await getCaseTimeline(caseId),
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}


export async function PATCH(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    const bundle = await getFullCase(caseId);
    canAccessCase(session, caseId, bundle.case.userId);
    const body = compactPatch(casePatchSchema.parse(await request.json()));
    await updateCaseInputs(caseId, body);
    await calculateCaseEstimate(caseId);
    const next = await getFullCase(caseId);
    return jsonOk({
      ...next,
      timeline: await getCaseTimeline(caseId),
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}
