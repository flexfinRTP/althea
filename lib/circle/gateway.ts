import { encodeFunctionData } from "viem";
import { USDC_ADDRESS } from "@/lib/arc/chain";
import { usdcToAtomic } from "@/lib/money";

export const GATEWAY_API_URL =
  process.env.CIRCLE_GATEWAY_API_URL || "https://gateway-api-testnet.circle.com";

export const GATEWAY_WALLET = (process.env.CIRCLE_GATEWAY_WALLET ||
  "0x0077777d7EBA4688BDeF3E311b846F25870A19B9") as `0x${string}`;

export const GATEWAY_MINTER = (process.env.CIRCLE_GATEWAY_MINTER ||
  "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B") as `0x${string}`;

const depositAbi = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

const mintAbi = [
  {
    type: "function",
    name: "gatewayMint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "attestation", type: "bytes" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export function encodeGatewayDeposit(amountUsd: number, token: `0x${string}` = USDC_ADDRESS): `0x${string}` {
  return encodeFunctionData({
    abi: depositAbi,
    functionName: "deposit",
    args: [token, usdcToAtomic(amountUsd)],
  });
}

export function encodeGatewayMint(attestation: `0x${string}`, signature: `0x${string}`): `0x${string}` {
  return encodeFunctionData({
    abi: mintAbi,
    functionName: "gatewayMint",
    args: [attestation, signature],
  });
}

export async function gatewayBalances(address: string) {
  const response = await fetch(`${GATEWAY_API_URL}/v1/balances?address=${address}`);
  if (!response.ok) {
    return { ok: false as const, status: response.status, raw: await response.text() };
  }
  return { ok: true as const, body: await response.json() };
}

export async function gatewayTransfer(body: Record<string, unknown>, forwarder = true) {
  const url = `${GATEWAY_API_URL}/v1/transfer${forwarder ? "?enableForwarder=true" : ""}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body: text ? (JSON.parse(text) as Record<string, unknown>) : {},
  };
}

export async function gatewayTransferStatus(transferId: string) {
  const response = await fetch(`${GATEWAY_API_URL}/v1/transfer/${transferId}`);
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body: text ? (JSON.parse(text) as Record<string, unknown>) : {},
  };
}
