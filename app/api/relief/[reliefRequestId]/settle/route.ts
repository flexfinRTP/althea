import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { settleRelief } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function POST(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "system_agent", "relief_reviewer"]);
    const { reliefRequestId } = await context.params;
    entityIdSchema.parse(reliefRequestId);
    const settled = await settleRelief(reliefRequestId);
    return jsonOk({
      status: settled.escrow.status,
      escrowId: settled.escrow.id,
      transactionHash: settled.transactionHash,
      grantAmount: settled.escrow.totalAmount,
    });
  } catch (error) {
    return jsonError(error);
  }
}
