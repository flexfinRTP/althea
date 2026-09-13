import { PrivyClient } from "@privy-io/node";
import { encodeFunctionData } from "viem";
import { RELIEF_POOL_ADDRESS, USDC_ADDRESS, erc20Abi, arcTestnet } from "@/lib/arc/chain";
import { usdcToAtomic } from "@/lib/money";
import { ApiError } from "@/lib/errors";

export function privyConfigured(): boolean {
  return Boolean(
    (process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID) && process.env.PRIVY_APP_SECRET,
  );
}

export function privyClient() {
  const appId = process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret) {
    throw new ApiError(
      "PRIVY_NOT_CONFIGURED",
      "Treasury authorization could not be completed. No funds moved.",
      503,
    );
  }
  return new PrivyClient({ appId, appSecret });
}

export function treasuryPolicyRules(reliefPool: string) {
  return [
    {
      name: "Allow USDC approve for ReliefPool",
      method: "eth_sendTransaction" as const,
      action: "ALLOW" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "to" as const,
          operator: "eq" as const,
          value: USDC_ADDRESS,
        },
        {
          field_source: "ethereum_transaction" as const,
          field: "chain_id" as const,
          operator: "eq" as const,
          value: String(arcTestnet.id),
        },
      ],
    },
    {
      name: "Allow ReliefPool deposit",
      method: "eth_sendTransaction" as const,
      action: "ALLOW" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "to" as const,
          operator: "eq" as const,
          value: reliefPool,
        },
        {
          field_source: "ethereum_transaction" as const,
          field: "chain_id" as const,
          operator: "eq" as const,
          value: String(arcTestnet.id),
        },
      ],
    },
  ];
}

export async function ensureTreasuryPolicy(): Promise<{ id?: string; active: boolean; destination: string }> {
  const destination = RELIEF_POOL_ADDRESS;
  if (process.env.PRIVY_POLICY_ID) {
    return { id: process.env.PRIVY_POLICY_ID, active: true, destination };
  }
  if (!privyConfigured() || !destination) {
    return { active: false, destination };
  }
  const privy = privyClient();
  const policy = await privy.policies().create({
    name: "Althea Relief Treasury — ReliefPool allowlist",
    version: "1.0",
    chain_type: "ethereum",
    rules: treasuryPolicyRules(destination),
  });
  return { id: policy.id, active: true, destination };
}

export async function sendUsdcApproveAndDeposit(amountUsd: number): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_TREASURY_WALLET_ID;
  if (!walletId || !RELIEF_POOL_ADDRESS) {
    throw new ApiError(
      "PRIVY_NOT_CONFIGURED",
      "Treasury authorization could not be completed. No funds moved.",
      503,
    );
  }
  const privy = privyClient();
  const atomic = usdcToAtomic(amountUsd);
  const caip2 = `eip155:${arcTestnet.id}` as `eip155:${string}`;
  const approveData = encodeFunctionData({
    abi: erc20Abi,
    functionName: "approve",
    args: [RELIEF_POOL_ADDRESS, atomic],
  });
  await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2,
    params: {
      transaction: {
        to: USDC_ADDRESS,
        data: approveData,
        chain_id: arcTestnet.id,
      },
    },
  });
  const depositData = encodeFunctionData({
    abi: [
      {
        type: "function",
        name: "deposit",
        stateMutability: "nonpayable",
        inputs: [{ name: "amount", type: "uint256" }],
        outputs: [],
      },
    ],
    functionName: "deposit",
    args: [atomic],
  });
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2,
    params: {
      transaction: {
        to: RELIEF_POOL_ADDRESS,
        data: depositData,
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export function policyBlockedMessage() {
  return "Blocked by Althea Treasury Policy";
}
