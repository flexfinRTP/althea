import { describe, expect, it } from "vitest";
import { calculateFapEstimate } from "@/lib/fap/calculate";
import { FapPolicy } from "@/lib/fap/schema";
import fixture from "@/data/hospitals/example-medical-center/fap-2026.json";

const policy = fixture.structuredPolicy as FapPolicy;

const demoInput = {
  householdSize: 3,
  householdAnnualIncome: 51000,
  insuranceStatus: "insured" as const,
  billAmount: 18420,
};

describe("calculateFapEstimate", () => {
  it("marks the demo case potentially eligible for $15,950", () => {
    const result = calculateFapEstimate(demoInput, policy);
    expect(result.outcome).toBe("potentially_eligible");
    expect(result.estimatedAssistance).toBe(15950);
    expect(result.estimatedRemaining).toBe(2470);
    expect(result.fplPercent).toBe(186.7);
    expect(result.matchedRuleIds).toContain("emc-discount-151-200");
  });

  it("returns free care at or below 150% FPL", () => {
    const result = calculateFapEstimate(
      { ...demoInput, householdAnnualIncome: 20000 },
      policy,
    );
    expect(result.outcome).toBe("potentially_eligible");
    expect(result.estimatedAssistance).toBe(18420);
    expect(result.estimatedRemaining).toBe(0);
  });

  it("returns potentially ineligible when income is above published ranges", () => {
    const result = calculateFapEstimate(
      { ...demoInput, householdAnnualIncome: 200000 },
      policy,
    );
    expect(result.outcome).toBe("potentially_ineligible");
    expect(result.estimatedAssistance).toBe(0);
    expect(result.estimatedRemaining).toBe(18420);
  });

  it("asks for more information when household size is missing", () => {
    const result = calculateFapEstimate(
      { ...demoInput, householdSize: 0 },
      policy,
    );
    expect(result.outcome).toBe("needs_more_information");
  });

  it("allows insured patients when the policy says they are eligible", () => {
    const result = calculateFapEstimate(demoInput, policy);
    expect(result.outcome).toBe("potentially_eligible");
  });

  it("marks insured patients potentially ineligible when the policy excludes them", () => {
    const closed: FapPolicy = {
      ...policy,
      policyScope: { ...policy.policyScope, insuredPatientsEligible: false },
    };
    const result = calculateFapEstimate(demoInput, closed);
    expect(result.outcome).toBe("potentially_ineligible");
  });

  it("asks for a state when residency is required and missing", () => {
    const residencyPolicy: FapPolicy = {
      ...policy,
      residency: { required: true, allowedStates: ["MO"] },
    };
    const result = calculateFapEstimate(demoInput, residencyPolicy);
    expect(result.outcome).toBe("needs_more_information");
  });

  it("marks out-of-state applicants potentially ineligible when residency is required", () => {
    const residencyPolicy: FapPolicy = {
      ...policy,
      residency: { required: true, allowedStates: ["MO"] },
    };
    const result = calculateFapEstimate({ ...demoInput, state: "TX" }, residencyPolicy);
    expect(result.outcome).toBe("potentially_ineligible");
  });

  it("applies an 80% discount in the 201-300% bracket", () => {
    const result = calculateFapEstimate(
      { ...demoInput, householdAnnualIncome: 70000 },
      policy,
    );
    expect(result.outcome).toBe("potentially_eligible");
    expect(result.estimatedAssistance).toBe(14736);
    expect(result.estimatedRemaining).toBe(3684);
  });
});

describe("Riverside Community Hospital fixture", () => {
  it("does not treat insured patients as eligible", async () => {
    const riverside = (await import("@/data/hospitals/riverside-community/fap-2026.json")).default;
    const result = calculateFapEstimate(demoInput, riverside.structuredPolicy as FapPolicy);
    expect(result.outcome).toBe("potentially_ineligible");
  });
});
