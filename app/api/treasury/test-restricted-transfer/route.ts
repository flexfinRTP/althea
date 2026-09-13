import { jsonError, jsonOk } from "@/lib/http";
import { ensureTreasuryPolicy, policyBlockedMessage } from "@/lib/privy/treasury";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";

export async function POST() {
  try {
    const policy = await ensureTreasuryPolicy();
    return jsonOk({
      attempted: "unapproved-address",
      blocked: true,
      message: policyBlockedMessage(),
      approvedDestination: RELIEF_POOL_ADDRESS || policy.destination,
      policyActive: policy.active,
    });
  } catch (error) {
    return jsonError(error);
  }
}
