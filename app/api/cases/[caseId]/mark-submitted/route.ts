import { jsonError, jsonOk } from "@/lib/http";
import { getCase, markSubmitted } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { markSubmittedSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, (await getCase(caseId)).userId);
    const body = markSubmittedSchema.parse(await request.json().catch(() => ({})));
    const packet = await markSubmitted(caseId, body.submittedAt);
    return jsonOk({ status: "application_submitted", submittedAt: packet.submittedAt });
  } catch (error) {
    return jsonError(error);
  }
}
