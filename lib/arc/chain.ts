import { defineChain } from "viem";

export const arcTestnet = defineChain({
  id: Number(process.env.ARC_CHAIN_ID || 5042002),
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io"],
      webSocket: ["wss://rpc.testnet.arc.io"],
    },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: process.env.ARC_EXPLORER_URL || "https://testnet.arcscan.app" },
  },
  testnet: true,
});

export const USDC_ADDRESS = (process.env.USDC_ADDRESS ||
  "0x3600000000000000000000000000000000000000") as `0x${string}`;

export const RELIEF_POOL_ADDRESS = (process.env.RELIEF_POOL_ADDRESS || "") as `0x${string}`;

export const DEMO_PROVIDER_SETTLEMENT_ADDRESS = (process.env.DEMO_PROVIDER_SETTLEMENT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const reliefPoolAbi = [
  {
    type: "event",
    name: "GrantReleased",
    inputs: [
      { name: "caseHash", type: "bytes32", indexed: true },
      { name: "programId", type: "bytes32", indexed: true },
      { name: "provider", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "decisionHash", type: "bytes32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "PoolFunded",
    inputs: [
      { name: "funder", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "releaseGrant",
    stateMutability: "nonpayable",
    inputs: [
      { name: "caseHash", type: "bytes32" },
      { name: "programId", type: "bytes32" },
      { name: "provider", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "decisionHash", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "usdc",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

export function explorerTx(hash?: string) {
  if (!hash) return undefined;
  return `${process.env.ARC_EXPLORER_URL || "https://testnet.arcscan.app"}/tx/${hash}`;
}
