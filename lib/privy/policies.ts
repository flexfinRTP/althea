import { encodeFunctionData } from "viem";
import { arcTestnet, USDC_ADDRESS, erc20Abi } from "@/lib/arc/chain";
import { RELIEF_NETWORK_ADDRESS, reliefNetworkAbi } from "@/lib/arc/network";
import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { usdcToAtomic } from "@/lib/money";
import { ApiError } from "@/lib/errors";
import { privyClient, privyConfigured } from "@/lib/privy/treasury";
import { programIdBytes32 } from "@/lib/relief/case-hash";

export function destinationAllowlist() {
  return [RELIEF_NETWORK_ADDRESS, RELIEF_POOL_ADDRESS, USDC_ADDRESS].filter(Boolean);
}

export function funderPolicyRules(destination: string, maxPerTxUsd: number) {
  return [
    {
      name: "Arc only",
      method: "eth_sendTransaction" as const,
      action: "ALLOW" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "chain_id" as const,
          operator: "eq" as const,
          value: String(arcTestnet.id),
        },
      ],
    },
    {
      name: "USDC approve only",
      method: "eth_sendTransaction" as const,
      action: "ALLOW" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "to" as const,
          operator: "eq" as const,
          value: USDC_ADDRESS,
        },
      ],
    },
    {
      name: "Althea Relief Network only",
      method: "eth_sendTransaction" as const,
      action: "ALLOW" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "to" as const,
          operator: "eq" as const,
          value: destination,
        },
      ],
    },
    {
      name: `Maximum ${maxPerTxUsd} USDC per transfer`,
      method: "eth_sendTransaction" as const,
      action: "DENY" as const,
      conditions: [
        {
          field_source: "ethereum_transaction" as const,
          field: "value" as const,
          operator: "gt" as const,
          value: usdcToAtomic(maxPerTxUsd).toString(),
        },
      ],
    },
  ];
}

export async function ensureFunderPolicy(input: {
  name: string;
  destination: string;
  maxPerTxUsd: number;
}): Promise<{ id?: string; active: boolean; destination: string }> {
  if (!privyConfigured() || !input.destination) {
    return { active: false, destination: input.destination };
  }
  const privy = privyClient();
  const policy = await privy.policies().create({
    name: input.name,
    version: "1.0",
    chain_type: "ethereum",
    rules: funderPolicyRules(input.destination, input.maxPerTxUsd),
  });
  return { id: policy.id, active: true, destination: input.destination };
}

export async function ensureFunderWallet(input: {
  externalId: string;
  policyId?: string;
}): Promise<{ id?: string; address?: string }> {
  if (!privyConfigured()) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Foundation wallet could not be created.", 503);
  }
  const privy = privyClient();
  const created = await privy.wallets().create({
    chain_type: "ethereum",
    external_id: input.externalId,
    policy_ids: input.policyId ? [input.policyId] : undefined,
  });
  return { id: created.id, address: created.address };
}

export async function sendProgramFund(input: {
  walletId: string;
  programId: string;
  amountUsd: number;
}): Promise<{ hash: string }> {
  const destination = RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS;
  if (!destination) {
    throw new ApiError("NETWORK_NOT_CONFIGURED", "Relief Network is not deployed.", 503);
  }
  const privy = privyClient();
  const atomic = usdcToAtomic(input.amountUsd);
  const caip2 = `eip155:${arcTestnet.id}` as `eip155:${string}`;
  await privy.wallets().ethereum().sendTransaction(input.walletId, {
    caip2,
    params: {
      transaction: {
        to: USDC_ADDRESS,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [destination, atomic],
        }),
        chain_id: arcTestnet.id,
      },
    },
  });
  if (RELIEF_NETWORK_ADDRESS) {
    const response = await privy.wallets().ethereum().sendTransaction(input.walletId, {
      caip2,
      params: {
        transaction: {
          to: RELIEF_NETWORK_ADDRESS,
          data: encodeFunctionData({
            abi: reliefNetworkAbi,
            functionName: "fundProgram",
            args: [programIdBytes32(input.programId), atomic],
          }),
          chain_id: arcTestnet.id,
        },
      },
    });
    return { hash: response.hash };
  }
  const response = await privy.wallets().ethereum().sendTransaction(input.walletId, {
    caip2,
    params: {
      transaction: {
        to: RELIEF_POOL_ADDRESS,
        data: encodeFunctionData({
          abi: [{ type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] }],
          functionName: "deposit",
          args: [atomic],
        }),
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export function policyBlockedByLimit(amountUsd: number, maxUsd: number) {
  return amountUsd > maxUsd;
}
