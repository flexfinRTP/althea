import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { reserveRelief } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "system_agent", "relief_reviewer"]);
    const { reliefRequestId } = await context.params;
    entityIdSchema.parse(reliefRequestId);
    const reserved = await reserveRelief(reliefRequestId);
    return jsonOk({
      status: reserved.escrow.status,
      escrowId: reserved.escrow.id,
      totalAmount: reserved.escrow.totalAmount,
      transactionHash: reserved.transactionHash,
      route: reserved.route,
      allocations: reserved.allocations,
    });
  } catch (error) {
    return jsonError(error);
  }
}
