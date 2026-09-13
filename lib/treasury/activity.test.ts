import { describe, expect, it } from "vitest";
import { allocation, mergeTreasuryActivity } from "@/lib/treasury/activity";

describe("allocation", () => {
  it("splits treasury and pool into percents that sum to 100", () => {
    expect(allocation(8000, 2000)).toEqual({ total: 10000, treasuryPct: 80, poolPct: 20 });
  });

  it("returns zeros when both balances are empty", () => {
    expect(allocation(0, 0)).toEqual({ total: 0, treasuryPct: 0, poolPct: 0 });
  });
});

describe("mergeTreasuryActivity", () => {
  it("sorts newest first and maps grants that are not already stored as txs", () => {
    const merged = mergeTreasuryActivity(
      [
        {
          id: "tx_1",
          type: "fund_relief_pool",
          amount: 1000,
          currency: "USDC",
          destinationAddress: "0xpool",
          transactionHash: "0xaaa",
          status: "confirmed",
          createdAt: "2026-09-01T10:00:00.000Z",
        },
      ],
      [
        {
          id: "grant_1",
          amount: 500,
          providerSettlementAddress: "0xhospital",
          status: "confirmed",
          arcTransactionHash: "0xbbb",
          confirmedAt: "2026-09-02T10:00:00.000Z",
        },
        {
          id: "grant_dup",
          amount: 1000,
          providerSettlementAddress: "0xpool",
          status: "confirmed",
          arcTransactionHash: "0xaaa",
          confirmedAt: "2026-09-01T10:00:00.000Z",
        },
        {
          id: "grant_prep",
          amount: 50,
          providerSettlementAddress: "0xhospital",
          status: "prepared",
        },
      ],
    );
    expect(merged.map((row) => row.id)).toEqual(["grant_1", "tx_1"]);
    expect(merged[0]?.type).toBe("grant_release");
  });
});
