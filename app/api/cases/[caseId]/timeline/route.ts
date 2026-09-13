import { jsonError, jsonOk } from "@/lib/http";
import { getCase, getCaseTimeline } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";

export async function GET(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, (await getCase(caseId)).userId);
    return jsonOk(await getCaseTimeline(caseId));
  } catch (error) {
    return jsonError(error);
  }
}
