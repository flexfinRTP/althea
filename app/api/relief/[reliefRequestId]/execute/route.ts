import { jsonError, jsonOk } from "@/lib/http";
import { executeApprovedGrant, runReliefAgent } from "@/lib/relief/agent";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";

export async function POST(request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "system_agent"]);
    const { reliefRequestId } = await context.params;
    const idempotencyKey = request.headers.get("Idempotency-Key") ?? undefined;
    await runReliefAgent(reliefRequestId);
    const grant = await executeApprovedGrant(reliefRequestId, idempotencyKey);
    return jsonOk({
      status: grant?.status ?? "submitted",
      transactionHash: grant?.arcTransactionHash,
      grantAmount: grant?.amount,
      grantId: grant?.id,
    });
  } catch (error) {
    return jsonError(error);
  }
}
