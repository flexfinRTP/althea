import { jsonError, jsonOk } from "@/lib/http";
import { verifyWorldProof } from "@/lib/world/verify";
import { recordWorldVerification } from "@/lib/db/cases";
import { worldVerifySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = worldVerifySchema.parse(await request.json());
    if (body.status === "manual_review") {
      const row = await recordWorldVerification({ caseId: body.caseId, status: "manual_review" });
      return jsonOk({ caseId: body.caseId, status: row.status, verifiedAt: row.verifiedAt });
    }
    if (!body.idkitResponse || !body.rp_id) {
      const row = await recordWorldVerification({ caseId: body.caseId, status: "failed" });
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
