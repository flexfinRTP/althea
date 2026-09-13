import { jsonError, jsonOk } from "@/lib/http";
import { readPoolBalance } from "@/lib/arc/balances";
import { getStore } from "@/lib/db/store";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { privyConfigured } from "@/lib/privy/treasury";

export async function GET() {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin"]);
    const poolOnchain = await readPoolBalance();
    const treasuryAddress = process.env.PRIVY_TREASURY_WALLET_ID ? undefined : undefined;
    const program = getStore().program;
    return jsonOk({
      treasury: {
        usdc: program.demoAvailableCapital,
        onchain: null as number | null,
        configured: privyConfigured(),
        walletId: process.env.PRIVY_TREASURY_WALLET_ID ?? null,
        address: treasuryAddress ?? null,
      },
      reliefPool: {
        usdc: poolOnchain ?? 0,
        address: RELIEF_POOL_ADDRESS || null,
        demoFinancialModel: program.demoAvailableCapital,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
