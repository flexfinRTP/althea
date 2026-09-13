import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { recordHospitalDecision } from "@/lib/db/cases";
import { isDemoMode } from "@/lib/config";
import { ApiError } from "@/lib/errors";
import { staffAuthorized } from "@/lib/auth";

const bodySchema = z.object({
  status: z.enum(["approved", "partially_approved", "denied"]).default("approved"),
  approvedAssistance: z.number().nonnegative().default(15950),
  remainingBalance: z.number().nonnegative().default(2470),
});

export async function POST(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    if (!isDemoMode()) {
      throw new ApiError("DEMO_ONLY", "Simulated hospital decisions are only available in demo mode.");
    }
    if (!staffAuthorized(request) && !isDemoMode()) {
      throw new ApiError("FORBIDDEN", "Staff authorization required.", 403);
    }
    const { caseId } = await context.params;
    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const decision = recordHospitalDecision(caseId, body);
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
