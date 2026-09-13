import { RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";

export const RELIEF_NETWORK_ADDRESS = (process.env.RELIEF_NETWORK_ADDRESS || "") as `0x${string}`;

export function reliefNetworkAddress(): `0x${string}` | "" {
  return RELIEF_NETWORK_ADDRESS || ("" as const);
}

export function settlementContract(): `0x${string}` | "" {
  return RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS || ("" as const);
}

export const reliefNetworkAbi = [
  {
    type: "function",
    name: "fundProgram",
    stateMutability: "nonpayable",
    inputs: [
      { name: "programId", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "reserveMatchGrant",
    stateMutability: "nonpayable",
    inputs: [
      { name: "caseHash", type: "bytes32" },
      { name: "provider", type: "address" },
      { name: "expiresAt", type: "uint256" },
      { name: "decisionHash", type: "bytes32" },
      { name: "baseProgramId", type: "bytes32" },
      { name: "baseAmount", type: "uint256" },
      { name: "matchProgramId", type: "bytes32" },
      { name: "matchAmount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "reserveGrant",
    stateMutability: "nonpayable",
    inputs: [
      { name: "caseHash", type: "bytes32" },
      { name: "provider", type: "address" },
      { name: "expiresAt", type: "uint256" },
      { name: "decisionHash", type: "bytes32" },
      { name: "programIds", type: "bytes32[]" },
      { name: "amounts", type: "uint256[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "settleGrant",
    stateMutability: "nonpayable",
    inputs: [{ name: "caseHash", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "refundExpiredGrant",
    stateMutability: "nonpayable",
    inputs: [{ name: "caseHash", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "programAccounting",
    stateMutability: "view",
    inputs: [{ name: "programId", type: "bytes32" }],
    outputs: [
      { name: "budget", type: "uint256" },
      { name: "reservedAmount", type: "uint256" },
      { name: "spentAmount", type: "uint256" },
      { name: "availableAmount", type: "uint256" },
      { name: "grantCap", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "createProgram",
    stateMutability: "nonpayable",
    inputs: [
      { name: "programId", type: "bytes32" },
      { name: "funder", type: "address" },
      { name: "grantCap", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
      { name: "ruleHash", type: "bytes32" },
      { name: "matchBps", type: "uint16" },
      { name: "maxMatchPerCase", type: "uint256" },
      { name: "eligibleSourceProgramId", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;
