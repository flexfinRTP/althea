/**
 * Eval: Relief Network demo must keep $18,420 → $15,950 → $2,470 → $500 → $1,970
 * with the $500 assembled as $250 general + $250 Community Health Match.
 */
import { describe, expect, it } from "vitest";
import { calculateFapEstimate } from "@/lib/fap/calculate";
import { FapPolicy } from "@/lib/fap/schema";
import { evaluateReliefRules } from "@/lib/relief/rules";
import { assembleReliefRoute } from "@/lib/network/waterfall";
import { seedFunders, seedNetworkPrograms } from "@/lib/network/seed";
import { NETWORK_GENERAL_PROGRAM_ID, NETWORK_MATCH_PROGRAM_ID } from "@/lib/network/ids";
import fixture from "@/data/hospitals/example-medical-center/fap-2026.json";

describe("relief network story eval", () => {
  it("keeps the patient path and splits the $500 grant across two programs", () => {
    const estimate = calculateFapEstimate(
      {
        householdSize: 3,
        householdAnnualIncome: 51000,
        insuranceStatus: "insured",
        billAmount: 18420,
      },
      fixture.structuredPolicy as FapPolicy,
    );
    expect(estimate.estimatedAssistance).toBe(15950);
    expect(estimate.estimatedRemaining).toBe(2470);

    const route = assembleReliefRoute({
      residualBalance: 2470,
      requestedAmount: 500,
      programs: seedNetworkPrograms("2026-09-13T12:00:00.000Z"),
      funders: seedFunders("2026-09-13T12:00:00.000Z"),
      now: new Date("2026-09-13T12:00:00.000Z"),
    });
    expect(route.total).toBe(500);
    expect(route.selected).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ programId: NETWORK_GENERAL_PROGRAM_ID, amount: 250, role: "base" }),
        expect.objectContaining({ programId: NETWORK_MATCH_PROGRAM_ID, amount: 250, role: "match" }),
      ]),
    );
    expect(route.remainingAfter).toBe(1970);

    const relief = evaluateReliefRules({
      fapCompleted: true,
      residualBalanceVerified: true,
      residualBalance: 2470,
      worldStatus: "passed",
      duplicateRisk: "low",
      requestedAmount: route.total,
      maxGrant: 500,
      autoApprovalCap: 250,
      fundBalance: 25000,
    });
    expect(relief.decision).toBe("human_review_required");
    expect(18420 - 15950 - route.total).toBe(1970);
  });
});
