import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getCase, markSubmitted } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";

const bodySchema = z.object({
  submittedAt: z.string().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, getCase(caseId).userId);
    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const packet = markSubmitted(caseId, body.submittedAt);
    return jsonOk({ status: "application_submitted", submittedAt: packet.submittedAt });
  } catch (error) {
    return jsonError(error);
  }
}
