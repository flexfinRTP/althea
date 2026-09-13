import { describe, expect, it } from "vitest";
import { availableAmount, committedAmount, matchAmount, programAccounting } from "@/lib/network/accounting";
import { seedFunders, seedNetworkPrograms } from "@/lib/network/seed";
import { NETWORK_MATCH_PROGRAM_ID } from "@/lib/network/ids";

const now = "2026-09-13T12:00:00.000Z";

describe("restricted fund accounting", () => {
  it("reports budget, committed, settled, reserved, remaining", () => {
    const program = {
      ...seedNetworkPrograms(now).find((row) => row.id === NETWORK_MATCH_PROGRAM_ID)!,
      budget: 2000,
      reservedAmount: 250,
      spentAmount: 500,
    };
    const funder = seedFunders(now).find((row) => row.id === program.funderId);
    const row = programAccounting(program, funder);
    expect(row.budget).toBe(2000);
    expect(row.reserved).toBe(250);
    expect(row.settled).toBe(500);
    expect(row.committed).toBe(750);
    expect(row.remaining).toBe(1250);
    expect(committedAmount(program)).toBe(750);
    expect(availableAmount(program)).toBe(1250);
    expect(row.matchRatio).toBe("1:1");
  });

  it("caps a 1:1 match at maxMatchPerCase and available", () => {
    const program = seedNetworkPrograms(now).find((row) => row.id === NETWORK_MATCH_PROGRAM_ID)!;
    expect(matchAmount(250, program)).toBe(250);
    expect(matchAmount(400, program)).toBe(250);
    expect(matchAmount(250, { ...program, budget: 100, reservedAmount: 0, spentAmount: 0 })).toBe(100);
  });
});
