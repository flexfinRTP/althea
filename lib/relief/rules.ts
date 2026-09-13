export type ReliefReasonCode =
  | "FAP_COMPLETED"
  | "RESIDUAL_BALANCE_VERIFIED"
  | "WORLD_CHECK_PASSED"
  | "LOW_DUPLICATE_RISK"
  | "WITHIN_PROGRAM_CAP"
  | "FUNDS_AVAILABLE"
  | "HUMAN_APPROVAL_REQUIRED"
  | "FAP_NOT_COMPLETED"
  | "RESIDUAL_NOT_VERIFIED"
  | "WORLD_CHECK_MISSING"
  | "DUPLICATE_RISK"
  | "PROGRAM_LIMIT_EXCEEDED"
  | "INSUFFICIENT_FUNDS"
  | "HUMAN_APPROVAL_MISSING";

export type ReliefDecisionOutcome =
  | "auto_approved"
  | "human_review_required"
  | "approved"
  | "denied";

export type ReliefRulesInput = {
  fapCompleted: boolean;
  residualBalanceVerified: boolean;
  residualBalance: number;
  worldStatus: "passed" | "failed" | "not_started" | "pending" | "manual_review";
  duplicateRisk: "low" | "manual_review";
  requestedAmount: number;
  maxGrant: number;
  autoApprovalCap: number;
  fundBalance: number;
  humanApproval?: boolean;
};

export type ReliefRulesResult = {
  decision: ReliefDecisionOutcome;
  grantAmount: number;
  reasonCodes: ReliefReasonCode[];
};

export const RELIEF_RULES_VERSION = "demo-v1";

export function evaluateReliefRules(input: ReliefRulesInput): ReliefRulesResult {
  const reasonCodes: ReliefReasonCode[] = [];
  const requested = Math.min(input.requestedAmount, input.residualBalance);

  if (!input.fapCompleted) {
    return {
      decision: "denied",
      grantAmount: 0,
      reasonCodes: ["FAP_NOT_COMPLETED"],
    };
  }
  reasonCodes.push("FAP_COMPLETED");

  if (!input.residualBalanceVerified || input.residualBalance <= 0) {
    return {
      decision: "denied",
      grantAmount: 0,
      reasonCodes: [...reasonCodes, "RESIDUAL_NOT_VERIFIED"],
    };
  }
  reasonCodes.push("RESIDUAL_BALANCE_VERIFIED");

  if (input.worldStatus !== "passed") {
    if (!(input.worldStatus === "manual_review" && input.humanApproval)) {
      return {
        decision: "human_review_required",
        grantAmount: 0,
        reasonCodes: [...reasonCodes, "WORLD_CHECK_MISSING"],
      };
    }
  } else {
    reasonCodes.push("WORLD_CHECK_PASSED");
  }

  if (input.duplicateRisk !== "low") {
    return {
      decision: "human_review_required",
      grantAmount: requested,
      reasonCodes: [...reasonCodes, "DUPLICATE_RISK"],
    };
  }
  reasonCodes.push("LOW_DUPLICATE_RISK");

  if (requested <= 0) {
    return {
      decision: "denied",
      grantAmount: 0,
      reasonCodes: [...reasonCodes, "RESIDUAL_NOT_VERIFIED"],
    };
  }

  if (requested > input.maxGrant) {
    return {
      decision: "denied",
      grantAmount: 0,
      reasonCodes: [...reasonCodes, "PROGRAM_LIMIT_EXCEEDED"],
    };
  }
  reasonCodes.push("WITHIN_PROGRAM_CAP");

  if (input.fundBalance < requested) {
    return {
      decision: "denied",
      grantAmount: 0,
      reasonCodes: [...reasonCodes, "INSUFFICIENT_FUNDS"],
    };
  }
  reasonCodes.push("FUNDS_AVAILABLE");

  if (requested <= input.autoApprovalCap) {
    return {
      decision: "auto_approved",
      grantAmount: requested,
      reasonCodes,
    };
  }

  reasonCodes.push("HUMAN_APPROVAL_REQUIRED");
  if (input.humanApproval) {
    return {
      decision: "approved",
      grantAmount: requested,
      reasonCodes,
    };
  }

  return {
    decision: "human_review_required",
    grantAmount: requested,
    reasonCodes,
  };
}
