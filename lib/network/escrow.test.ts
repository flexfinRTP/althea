import { describe, expect, it } from "vitest";
import {
  allocationsFromRoute,
  applyRefund,
  applyReserve,
  applySettle,
  assertEscrowTransition,
  escrowExpired,
} from "@/lib/network/escrow";
import { assembleReliefRoute } from "@/lib/network/waterfall";
import { seedFunders, seedNetworkPrograms } from "@/lib/network/seed";
import { NETWORK_GENERAL_PROGRAM_ID, NETWORK_MATCH_PROGRAM_ID } from "@/lib/network/ids";

const now = "2026-09-13T12:00:00.000Z";

describe("grant escrow", () => {
  it("reserves then settles program balances", () => {
    const programs = seedNetworkPrograms(now);
    const route = assembleReliefRoute({
      residualBalance: 2470,
      requestedAmount: 500,
      programs,
      funders: seedFunders(now),
      now: new Date(now),
    });
    const allocations = allocationsFromRoute("escrow_1", route);
    const reserved = applyReserve(programs, allocations);
    const general = reserved.find((row) => row.id === NETWORK_GENERAL_PROGRAM_ID)!;
    const match = reserved.find((row) => row.id === NETWORK_MATCH_PROGRAM_ID)!;
    expect(general.reservedAmount).toBe(250);
    expect(match.reservedAmount).toBe(250);
    const settled = applySettle(reserved, allocations);
    expect(settled.find((row) => row.id === NETWORK_GENERAL_PROGRAM_ID)?.spentAmount).toBe(250);
    expect(settled.find((row) => row.id === NETWORK_MATCH_PROGRAM_ID)?.reservedAmount).toBe(0);
  });

  it("refunds reserved amounts after expiry", () => {
    const programs = seedNetworkPrograms(now);
    const route = assembleReliefRoute({
      residualBalance: 2470,
      requestedAmount: 500,
      programs,
      funders: seedFunders(now),
      now: new Date(now),
    });
    const allocations = allocationsFromRoute("escrow_2", route);
    const reserved = applyReserve(programs, allocations);
    const refunded = applyRefund(reserved, allocations);
    expect(refunded.find((row) => row.id === NETWORK_GENERAL_PROGRAM_ID)?.reservedAmount).toBe(0);
    expect(escrowExpired({ expiresAt: "2026-09-12T00:00:00.000Z" } as never, new Date(now))).toBe(true);
    expect(() => assertEscrowTransition("approved", "settled")).toThrow();
    expect(() => assertEscrowTransition("reserved", "settled")).not.toThrow();
  });
});
