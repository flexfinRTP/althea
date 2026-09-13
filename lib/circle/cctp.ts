import { encodeFunctionData } from "viem";
import { USDC_ADDRESS } from "@/lib/arc/chain";
import { usdcToAtomic } from "@/lib/money";
import type { SourceChain } from "@/lib/network/types";

export const CCTP_DOMAIN = {
  ethereum: 0,
  base: 6,
  solana: 5,
  arc: 26,
} as const;

export const CCTP_IRIS_URL =
  process.env.CCTP_IRIS_URL || "https://iris-api-sandbox.circle.com/v2/messages";

/** CCTP V2 CREATE2 on Arc + Circle testnets. Mainnet ETH/Base use CCTP_TOKEN_MESSENGER. */
export const TOKEN_MESSENGER_V2 = (process.env.CCTP_TOKEN_MESSENGER ||
  "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA") as `0x${string}`;

export const MESSAGE_TRANSMITTER_V2 = (process.env.CCTP_MESSAGE_TRANSMITTER ||
  "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275") as `0x${string}`;

export const SOURCE_USDC: Record<Exclude<SourceChain, "solana">, `0x${string}`> = {
  arc: USDC_ADDRESS,
  ethereum: (process.env.ETHEREUM_SEPOLIA_USDC ||
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238") as `0x${string}`,
  base: (process.env.BASE_SEPOLIA_USDC ||
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e") as `0x${string}`,
};

const depositForBurnAbi = [
  {
    type: "function",
    name: "depositForBurn",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationDomain", type: "uint32" },
      { name: "mintRecipient", type: "bytes32" },
      { name: "burnToken", type: "address" },
      { name: "destinationCaller", type: "bytes32" },
      { name: "maxFee", type: "uint256" },
      { name: "minFinalityThreshold", type: "uint32" },
    ],
    outputs: [],
  },
] as const;

const receiveMessageAbi = [
  {
    type: "function",
    name: "receiveMessage",
    stateMutability: "nonpayable",
    inputs: [
      { name: "message", type: "bytes" },
      { name: "attestation", type: "bytes" },
    ],
    outputs: [{ type: "bool" }],
  },
] as const;

export function addressToBytes32(address: string): `0x${string}` {
  return `0x${address.replace(/^0x/, "").toLowerCase().padStart(64, "0")}` as `0x${string}`;
}

export function encodeDepositForBurn(input: {
  amountUsd: number;
  mintRecipient: string;
  burnToken: `0x${string}`;
  maxFeeUsd?: number;
}): `0x${string}` {
  return encodeFunctionData({
    abi: depositForBurnAbi,
    functionName: "depositForBurn",
    args: [
      usdcToAtomic(input.amountUsd),
      CCTP_DOMAIN.arc,
      addressToBytes32(input.mintRecipient),
      input.burnToken,
      addressToBytes32("0x0000000000000000000000000000000000000000"),
      usdcToAtomic(input.maxFeeUsd ?? 1),
      1000,
    ],
  });
}

export function encodeReceiveMessage(message: `0x${string}`, attestation: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: receiveMessageAbi,
    functionName: "receiveMessage",
    args: [message, attestation],
  });
}

export async function fetchCctpAttestation(sourceDomain: number, transactionHash: string) {
  const url = `${CCTP_IRIS_URL}/${sourceDomain}?transactionHash=${transactionHash}`;
  const response = await fetch(url);
  if (!response.ok) {
    return { ready: false as const, status: response.status, raw: await response.text() };
  }
  const body = (await response.json()) as {
    messages?: Array<{
      attestation?: string;
      message?: string;
      status?: string;
    }>;
  };
  const message = body.messages?.[0];
  if (!message?.attestation || message.attestation === "PENDING") {
    return { ready: false as const, status: 202, raw: JSON.stringify(body) };
  }
  return {
    ready: true as const,
    attestation: message.attestation as `0x${string}`,
    message: message.message as `0x${string}`,
  };
}

export function sourceDomain(chain: SourceChain): number {
  return CCTP_DOMAIN[chain];
}

export const SOLANA_TOKEN_MESSENGER_V2 =
  process.env.SOLANA_TOKEN_MESSENGER || "CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe";
export const SOLANA_MESSAGE_TRANSMITTER_V2 =
  process.env.SOLANA_MESSAGE_TRANSMITTER || "CCTPV2Sm4AdWt5296sk4P66VBZ7bEhcARwFaaS9YPbeC";

export function sourceTokenMessenger(chain: SourceChain): string | undefined {
  if (chain === "solana") return SOLANA_TOKEN_MESSENGER_V2;
  if (chain === "ethereum" && process.env.ETHEREUM_SEPOLIA_TOKEN_MESSENGER) {
    return process.env.ETHEREUM_SEPOLIA_TOKEN_MESSENGER;
  }
  if (chain === "base" && process.env.BASE_SEPOLIA_TOKEN_MESSENGER) {
    return process.env.BASE_SEPOLIA_TOKEN_MESSENGER;
  }
  return TOKEN_MESSENGER_V2;
}

export function donationBurnCall(input: {
  amountUsd: number;
  sourceChain: SourceChain;
  mintRecipient: string;
}) {
  const messenger = sourceTokenMessenger(input.sourceChain);
  const burnToken = input.sourceChain === "solana" ? undefined : SOURCE_USDC[input.sourceChain];
  return {
    domain: sourceDomain(input.sourceChain),
    tokenMessenger: messenger,
    burnToken,
    destinationDomain: CCTP_DOMAIN.arc,
    mintRecipient: addressToBytes32(input.mintRecipient),
    irisUrl: `${CCTP_IRIS_URL}/${sourceDomain(input.sourceChain)}`,
    calldata:
      messenger && burnToken
        ? encodeDepositForBurn({
            amountUsd: input.amountUsd,
            mintRecipient: input.mintRecipient,
            burnToken,
          })
        : undefined,
  };
}
