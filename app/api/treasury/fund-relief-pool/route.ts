import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { sendUsdcApproveAndDeposit } from "@/lib/privy/treasury";
import { id, nowIso } from "@/lib/db/store";
import { saveTreasuryTransaction } from "@/lib/db/cases";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { treasuryFundSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["treasury_admin"]);
    const body = treasuryFundSchema.parse(await request.json());
    const result = await sendUsdcApproveAndDeposit(body.amount);
    await saveTreasuryTransaction({
      id: id("tx"),
      type: "fund_relief_pool",
      amount: body.amount,
      currency: "USDC",
      destinationAddress: RELIEF_POOL_ADDRESS,
      chain: "arc",
      transactionHash: result.hash,
      status: "confirmed",
      initiatedBy: session.userId,
      createdAt: nowIso(),
    });
    return jsonOk({ status: "confirmed", transactionHash: result.hash });
  } catch (error) {
    return jsonError(error);
  }
}
