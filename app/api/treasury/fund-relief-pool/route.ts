import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { sendUsdcApproveAndDeposit } from "@/lib/privy/treasury";
import { getStore, id, nowIso, saveStore } from "@/lib/db/store";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";

const bodySchema = z.object({
  amount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["treasury_admin"]);
    const body = bodySchema.parse(await request.json());
    const result = await sendUsdcApproveAndDeposit(body.amount);
    const store = getStore();
    store.treasury.push({
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
    saveStore();
    return jsonOk({ status: "confirmed", transactionHash: result.hash });
  } catch (error) {
    return jsonError(error);
  }
}
