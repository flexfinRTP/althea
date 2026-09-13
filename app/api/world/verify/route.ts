import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { verifyWorldProof } from "@/lib/world/verify";
import { recordWorldVerification } from "@/lib/db/cases";

const bodySchema = z.object({
  caseId: z.string(),
  rp_id: z.string().optional(),
  idkitResponse: z.record(z.unknown()).optional(),
  status: z.enum(["passed", "failed", "manual_review"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    if (body.status === "manual_review") {
      const row = recordWorldVerification({ caseId: body.caseId, status: "manual_review" });
      return jsonOk({ caseId: body.caseId, status: row.status, verifiedAt: row.verifiedAt });
    }
    if (!body.idkitResponse || !body.rp_id) {
      const row = recordWorldVerification({ caseId: body.caseId, status: "failed" });
      return jsonOk({ caseId: body.caseId, status: row.status });
    }
    const row = await verifyWorldProof({
      caseId: body.caseId,
      rpId: body.rp_id,
      idkitResponse: body.idkitResponse,
    });
    return jsonOk({ caseId: body.caseId, status: row.status, verifiedAt: row.verifiedAt });
  } catch (error) {
    return jsonError(error);
  }
}
