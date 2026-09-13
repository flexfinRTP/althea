export type TreasuryActivityType = "fund_relief_pool" | "grant_release" | "refund" | "admin_transfer";
export type TreasuryActivityStatus = "pending" | "confirmed" | "failed";

export type TreasuryActivity = {
  id: string;
  type: TreasuryActivityType;
  amount: number;
  currency: "USDC";
  destinationAddress: string;
  transactionHash?: string;
  status: TreasuryActivityStatus;
  createdAt: string;
};

export type ActivitySourceTx = {
  id: string;
  type: TreasuryActivityType;
  amount: number;
  currency: "USDC";
  destinationAddress: string;
  transactionHash?: string;
  status: TreasuryActivityStatus;
  createdAt: string;
};

export type ActivitySourceGrant = {
  id: string;
  amount: number;
  providerSettlementAddress: string;
  status: "prepared" | "submitted" | "confirmed" | "failed";
  arcTransactionHash?: string;
  submittedAt?: string;
  confirmedAt?: string;
};

export const TREASURY_TYPE_LABEL: Record<TreasuryActivityType, string> = {
  fund_relief_pool: "Fund",
  grant_release: "Grant",
  refund: "Refund",
  admin_transfer: "Transfer",
};

export const TREASURY_STATUS_LABEL: Record<TreasuryActivityStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  failed: "Failed",
};

export function allocation(treasuryUsdc: number, poolUsdc: number) {
  const total = Math.max(0, treasuryUsdc) + Math.max(0, poolUsdc);
  if (total <= 0) return { total: 0, treasuryPct: 0, poolPct: 0 };
  const treasuryPct = Math.round((Math.max(0, treasuryUsdc) / total) * 100);
  return { total, treasuryPct, poolPct: 100 - treasuryPct };
}

function grantStatus(status: ActivitySourceGrant["status"]): TreasuryActivityStatus | null {
  if (status === "prepared") return null;
  if (status === "submitted") return "pending";
  if (status === "failed") return "failed";
  return "confirmed";
}

export function mergeTreasuryActivity(
  txs: ActivitySourceTx[],
  grants: ActivitySourceGrant[],
): TreasuryActivity[] {
  const fromTxs: TreasuryActivity[] = txs.map((row) => ({
    id: row.id,
    type: row.type,
    amount: row.amount,
    currency: "USDC",
    destinationAddress: row.destinationAddress,
    transactionHash: row.transactionHash,
    status: row.status,
    createdAt: row.createdAt,
  }));
  const hashes = new Set(fromTxs.map((row) => row.transactionHash).filter(Boolean));
  const fromGrants: TreasuryActivity[] = [];
  for (const grant of grants) {
    const status = grantStatus(grant.status);
    if (!status) continue;
    if (grant.arcTransactionHash && hashes.has(grant.arcTransactionHash)) continue;
    fromGrants.push({
      id: grant.id,
      type: "grant_release",
      amount: grant.amount,
      currency: "USDC",
      destinationAddress: grant.providerSettlementAddress,
      transactionHash: grant.arcTransactionHash,
      status,
      createdAt: grant.confirmedAt || grant.submittedAt || "",
    });
  }
  return [...fromTxs, ...fromGrants].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
