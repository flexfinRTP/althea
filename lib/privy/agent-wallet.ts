import { encodeFunctionData } from "viem";
import { arcTestnet } from "@/lib/arc/chain";
import { RELIEF_NETWORK_ADDRESS, reliefNetworkAbi } from "@/lib/arc/network";
import { privyClient, privyConfigured } from "@/lib/privy/treasury";
import { ensureFunderPolicy } from "@/lib/privy/policies";
import { ApiError } from "@/lib/errors";
import { usdcToAtomic } from "@/lib/money";
import { programIdBytes32 } from "@/lib/relief/case-hash";

export async function ensureAgentPolicy() {
  return ensureFunderPolicy({
    name: "Althea Relief Agent — network cage",
    destination: RELIEF_NETWORK_ADDRESS,
    maxPerTxUsd: 250,
  });
}

export async function agentWalletConfigured(): Promise<boolean> {
  return Boolean(process.env.PRIVY_AGENT_WALLET_ID && privyConfigured() && RELIEF_NETWORK_ADDRESS);
}

export async function agentReserveGrant(input: {
  caseHash: `0x${string}`;
  provider: `0x${string}`;
  expiresAt: number;
  decisionHash: `0x${string}`;
  allocations: Array<{ programId: string; amount: number }>;
}): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_AGENT_WALLET_ID;
  if (!walletId || !RELIEF_NETWORK_ADDRESS) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Agent signer is not configured.", 503);
  }
  if (input.allocations.length === 0) {
    throw new ApiError("INVALID_AMOUNT", "Reserve requires at least one allocation.");
  }
  const privy = privyClient();
  const data = encodeFunctionData({
    abi: reliefNetworkAbi,
    functionName: "reserveGrant",
    args: [
      input.caseHash,
      input.provider,
      BigInt(input.expiresAt),
      input.decisionHash,
      input.allocations.map((row) => programIdBytes32(row.programId)),
      input.allocations.map((row) => usdcToAtomic(row.amount)),
    ],
  });
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2: `eip155:${arcTestnet.id}`,
    params: {
      transaction: {
        to: RELIEF_NETWORK_ADDRESS,
        data,
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export async function agentReceiveMessage(message: `0x${string}`, attestation: `0x${string}`): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_AGENT_WALLET_ID;
  if (!walletId) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Agent signer is not configured.", 503);
  }
  const { MESSAGE_TRANSMITTER_V2, encodeReceiveMessage } = await import("@/lib/circle/cctp");
  const privy = privyClient();
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2: `eip155:${arcTestnet.id}`,
    params: {
      transaction: {
        to: MESSAGE_TRANSMITTER_V2,
        data: encodeReceiveMessage(message, attestation),
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export async function agentReserveMatch(input: {
  caseHash: `0x${string}`;
  provider: `0x${string}`;
  expiresAt: number;
  decisionHash: `0x${string}`;
  baseProgramId: string;
  baseAmount: number;
  matchProgramId: string;
  matchAmount: number;
}): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_AGENT_WALLET_ID;
  if (!walletId || !RELIEF_NETWORK_ADDRESS) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Agent signer is not configured.", 503);
  }
  const privy = privyClient();
  const data = encodeFunctionData({
    abi: reliefNetworkAbi,
    functionName: "reserveMatchGrant",
    args: [
      input.caseHash,
      input.provider,
      BigInt(input.expiresAt),
      input.decisionHash,
      programIdBytes32(input.baseProgramId),
      usdcToAtomic(input.baseAmount),
      programIdBytes32(input.matchProgramId),
      usdcToAtomic(input.matchAmount),
    ],
  });
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2: `eip155:${arcTestnet.id}`,
    params: {
      transaction: {
        to: RELIEF_NETWORK_ADDRESS,
        data,
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export async function agentSettle(caseHash: `0x${string}`): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_AGENT_WALLET_ID;
  if (!walletId || !RELIEF_NETWORK_ADDRESS) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Agent signer is not configured.", 503);
  }
  const privy = privyClient();
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2: `eip155:${arcTestnet.id}`,
    params: {
      transaction: {
        to: RELIEF_NETWORK_ADDRESS,
        data: encodeFunctionData({
          abi: reliefNetworkAbi,
          functionName: "settleGrant",
          args: [caseHash],
        }),
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}

export async function agentRefund(caseHash: `0x${string}`): Promise<{ hash: string }> {
  const walletId = process.env.PRIVY_AGENT_WALLET_ID;
  if (!walletId || !RELIEF_NETWORK_ADDRESS) {
    throw new ApiError("PRIVY_NOT_CONFIGURED", "Agent signer is not configured.", 503);
  }
  const privy = privyClient();
  const response = await privy.wallets().ethereum().sendTransaction(walletId, {
    caip2: `eip155:${arcTestnet.id}`,
    params: {
      transaction: {
        to: RELIEF_NETWORK_ADDRESS,
        data: encodeFunctionData({
          abi: reliefNetworkAbi,
          functionName: "refundExpiredGrant",
          args: [caseHash],
        }),
        chain_id: arcTestnet.id,
      },
    },
  });
  return { hash: response.hash };
}
