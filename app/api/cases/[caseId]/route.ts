import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getFullCase, getCaseTimeline, updateCaseInputs, calculateCaseEstimate } from "@/lib/db/cases";
import { canAccessCase, readSession } from "@/lib/auth";
import { ESTIMATE_DISCLAIMER } from "@/lib/config";

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

const patchSchema = z.object({
  billAmount: z.number().nonnegative().optional(),
  householdSize: z.number().int().min(1).optional(),
  householdAnnualIncome: z.number().nonnegative().optional(),
  insuranceStatus: z.enum(["insured", "uninsured"]).optional(),
  firstPostDischargeBillDate: z.string().optional(),
  state: z.string().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await context.params;
    const session = await readSession();
    const bundle = getFullCase(caseId);
    canAccessCase(session, caseId, bundle.case.userId);
    const body = patchSchema.parse(await request.json());
    updateCaseInputs(caseId, body);
    calculateCaseEstimate(caseId);
    const next = getFullCase(caseId);
    return jsonOk({
      ...next,
      timeline: getCaseTimeline(caseId),
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}
