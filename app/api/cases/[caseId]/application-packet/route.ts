import { jsonError, jsonOk } from "@/lib/http";
import { getCase, prepareApplication } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";

export async function POST(_request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    canAccessCase(session, caseId, getCase(caseId).userId);
    const packet = prepareApplication(caseId);
    return jsonOk({
      applicationPacketId: packet.id,
      status: packet.status,
      requiredDocuments: packet.requiredDocuments,
      submissionInstructions: packet.submissionInstructions,
      applicationUrl: packet.applicationUrl,
      generatedFields: packet.generatedFields,
    });
  } catch (error) {
    return jsonError(error);
  }
}
