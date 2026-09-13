import { describe, expect, it } from "vitest";
import { evaluateReliefRules } from "@/lib/relief/rules";

const base = {
  fapCompleted: true,
  residualBalanceVerified: true,
  residualBalance: 2470,
  worldStatus: "passed" as const,
  duplicateRisk: "low" as const,
  requestedAmount: 500,
  maxGrant: 500,
  autoApprovalCap: 250,
  fundBalance: 25000,
};

describe("evaluateReliefRules", () => {
  it("requires human review for the $500 demo grant", () => {
    const result = evaluateReliefRules(base);
    expect(result.decision).toBe("human_review_required");
    expect(result.grantAmount).toBe(500);
    expect(result.reasonCodes).toContain("HUMAN_APPROVAL_REQUIRED");
  });

  it("auto-approves at or below the $250 cap", () => {
    const result = evaluateReliefRules({ ...base, requestedAmount: 250 });
    expect(result.decision).toBe("auto_approved");
    expect(result.grantAmount).toBe(250);
  });

  it("returns approved after human approval", () => {
    const result = evaluateReliefRules({ ...base, humanApproval: true });
    expect(result.decision).toBe("approved");
  });

  it("denies when FAP is incomplete", () => {
    const result = evaluateReliefRules({ ...base, fapCompleted: false });
    expect(result.decision).toBe("denied");
    expect(result.reasonCodes).toContain("FAP_NOT_COMPLETED");
  });

  it("denies when residual is not verified", () => {
    const result = evaluateReliefRules({
      ...base,
      residualBalanceVerified: false,
    });
    expect(result.decision).toBe("denied");
    expect(result.reasonCodes).toContain("RESIDUAL_NOT_VERIFIED");
  });

  it("requires review when World is missing", () => {
    const result = evaluateReliefRules({ ...base, worldStatus: "not_started" });
    expect(result.decision).toBe("human_review_required");
    expect(result.reasonCodes).toContain("WORLD_CHECK_MISSING");
  });

  it("requires review on duplicate risk", () => {
    const result = evaluateReliefRules({ ...base, duplicateRisk: "manual_review" });
    expect(result.decision).toBe("human_review_required");
    expect(result.reasonCodes).toContain("DUPLICATE_RISK");
  });

  it("denies over max grant", () => {
    const result = evaluateReliefRules({ ...base, requestedAmount: 501 });
    expect(result.decision).toBe("denied");
    expect(result.reasonCodes).toContain("PROGRAM_LIMIT_EXCEEDED");
  });

  it("denies insufficient funds", () => {
    const result = evaluateReliefRules({ ...base, fundBalance: 100 });
    expect(result.decision).toBe("denied");
    expect(result.reasonCodes).toContain("INSUFFICIENT_FUNDS");
  });
});
