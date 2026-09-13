import { jsonError, jsonOk } from "@/lib/http";
import { readPoolBalance, readUsdcBalance } from "@/lib/arc/balances";
import { getStore, nowIso } from "@/lib/db/store";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { ensureTreasuryPolicy, getTreasuryWalletAddress, privyConfigured } from "@/lib/privy/treasury";

export async function GET() {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin"]);
    const poolOnchain = await readPoolBalance();
    const treasuryAddress = await getTreasuryWalletAddress();
    const treasuryOnchain = treasuryAddress ? await readUsdcBalance(treasuryAddress) : null;
    const program = (await getStore()).program;
    const policy = await ensureTreasuryPolicy();
    return jsonOk({
      treasury: {
        usdc: treasuryOnchain ?? 0,
        onchain: treasuryOnchain,
        demoFinancialModel: program.demoAvailableCapital,
        configured: privyConfigured(),
        walletId: process.env.PRIVY_TREASURY_WALLET_ID ?? null,
        address: treasuryAddress,
      },
      reliefPool: {
        usdc: poolOnchain ?? 0,
        onchain: poolOnchain,
        address: RELIEF_POOL_ADDRESS || null,
        demoFinancialModel: program.demoAvailableCapital,
      },
      policy: {
        active: policy.active,
        id: policy.id ?? null,
        destination: policy.destination,
      },
      network: "Arc",
      asset: "USDC",
      asOf: nowIso(),
    });
  } catch (error) {
    return jsonError(error);
  }
}
