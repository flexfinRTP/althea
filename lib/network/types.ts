export type FunderKind = "althea" | "foundation" | "employer" | "community";

export type NetworkProgramKind = "general" | "match" | "employer" | "community" | "campaign";

export type NetworkProgramStatus = "active" | "paused" | "closed";

export type EscrowStatus = "approved" | "reserved" | "settled" | "refunded";

export type AllocationRole = "base" | "match" | "employer" | "community";

export type DonationStatus =
  | "pending"
  | "awaiting_source"
  | "bridging"
  | "attested"
  | "minted"
  | "deposited"
  | "matched"
  | "failed";

export type SourceChain = "arc" | "ethereum" | "base" | "solana";

export type StoredFunder = {
  id: string;
  name: string;
  kind: FunderKind;
  email?: string;
  privyWalletId?: string;
  privyWalletAddress?: string;
  policyId?: string;
  treasuryUsdc: number;
  dailyLimitUsdc: number;
  perMatchLimitUsdc: number;
  createdAt: string;
  updatedAt: string;
};

export type StoredNetworkProgram = {
  id: string;
  funderId: string;
  name: string;
  kind: NetworkProgramKind;
  status: NetworkProgramStatus;
  currency: "USDC";
  budget: number;
  spentAmount: number;
  reservedAmount: number;
  grantCap: number;
  matchRatioNum: number;
  matchRatioDen: number;
  maxMatchPerCase: number;
  expiresAt?: string;
  ruleHash: string;
  eligibleSourceProgramId?: string;
  allowedRecipientMode: "verified_settlement_only";
  requiresWorldCheck: boolean;
  requiresFapCompletion: boolean;
  requiresVerifiedResidual: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoredGrantAllocation = {
  id: string;
  escrowId: string;
  programId: string;
  amount: number;
  role: AllocationRole;
};

export type StoredGrantEscrow = {
  id: string;
  reliefRequestId: string;
  caseId: string;
  caseHash: string;
  provider: string;
  totalAmount: number;
  expiresAt: string;
  decisionHash: string;
  status: EscrowStatus;
  reserveTxHash?: string;
  settleTxHash?: string;
  refundTxHash?: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredMatchCampaign = {
  id: string;
  programId: string;
  name: string;
  matchRatioNum: number;
  matchRatioDen: number;
  budget: number;
  spent: number;
  startsAt: string;
  endsAt: string;
  recipientProgramId: string;
  status: NetworkProgramStatus;
};

export type StoredDonation = {
  id: string;
  donorId?: string;
  email?: string;
  amount: number;
  sourceChain: SourceChain;
  destinationProgramId: string;
  campaignId?: string;
  matchedAmount: number;
  status: DonationStatus;
  sourceTxHash?: string;
  attestation?: string;
  gatewayTransferId?: string;
  arcTxHash?: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredDonor = {
  id: string;
  email?: string;
  privyUserId?: string;
  walletAddress?: string;
  createdAt: string;
};

export type ProgramAccounting = {
  programId: string;
  name: string;
  funderId: string;
  funderName: string;
  kind: NetworkProgramKind;
  status: NetworkProgramStatus;
  budget: number;
  committed: number;
  settled: number;
  reserved: number;
  remaining: number;
  grantCap: number;
  matchRatio?: string;
  expiresAt?: string;
  ruleHash: string;
};

export type RouteSource = {
  programId: string;
  name: string;
  funderName: string;
  amount: number;
  role: AllocationRole;
  eligible: boolean;
  reason: string;
  available: number;
  matchRatio?: string;
};

export type ReliefRoute = {
  residualBalance: number;
  requestedAmount: number;
  sources: RouteSource[];
  selected: RouteSource[];
  total: number;
  remainingAfter: number;
  rulesVersion: string;
};
