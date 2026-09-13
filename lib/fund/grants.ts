export type PublicGrantSource = {
  id: string;
  amount: number;
  status: "prepared" | "submitted" | "confirmed" | "failed";
  arcTransactionHash?: string;
  submittedAt?: string;
  confirmedAt?: string;
};

export type PublicGrantListItem = {
  id: string;
  amount: number;
  status: "submitted" | "confirmed" | "failed";
  timestamp?: string;
  transactionHash?: string;
  program: string;
};

export const GRANT_STATUS_LABEL: Record<string, string> = {
  prepared: "Prepared",
  submitted: "Submitted",
  confirmed: "Confirmed",
  failed: "Failed",
  demonstration: "Demonstration",
};

export function toPublicGrantList(grants: PublicGrantSource[], program: string): PublicGrantListItem[] {
  return grants
    .filter((row): row is PublicGrantSource & { status: PublicGrantListItem["status"] } => row.status !== "prepared")
    .map((row) => ({
      id: row.id,
      amount: row.amount,
      status: row.status,
      timestamp: row.confirmedAt ?? row.submittedAt,
      transactionHash: row.arcTransactionHash,
      program,
    }))
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
}
