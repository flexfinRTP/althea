/**
 * Eval: demo FAP fixture must produce the frozen ETHOnline story numbers.
 * Deterministic gate. Not an LLM eval.
 */
import { describe, expect, it } from "vitest";
import { calculateFapEstimate } from "@/lib/fap/calculate";
import { FapPolicy } from "@/lib/fap/schema";
import { evaluateReliefRules } from "@/lib/relief/rules";
import fixture from "@/data/hospitals/example-medical-center/fap-2026.json";

describe("demo story eval", () => {
  it("holds the $18,420 → $15,950 → $2,470 → $500 → $1,970 path", () => {
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
    const relief = evaluateReliefRules({
      fapCompleted: true,
      residualBalanceVerified: true,
      residualBalance: 2470,
      worldStatus: "passed",
      duplicateRisk: "low",
      requestedAmount: 500,
      maxGrant: 500,
      autoApprovalCap: 250,
      fundBalance: 25000,
    });
    expect(relief.decision).toBe("human_review_required");
    expect(18420 - 15950 - 500).toBe(1970);
  });
});
