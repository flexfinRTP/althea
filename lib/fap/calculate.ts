import { ESTIMATE_DISCLAIMER } from "@/lib/config";
import { roundUsd } from "@/lib/money";
import { calculateFplPercent, FplJurisdiction } from "@/lib/fap/fpl";
import { AssistanceRule, FapPolicy } from "@/lib/fap/schema";

export type InsuranceStatus = "insured" | "uninsured";

export type PatientFinancialInputs = {
  householdSize: number;
  householdAnnualIncome: number;
  insuranceStatus: InsuranceStatus;
  state?: string;
  billAmount: number;
  firstBillingStatementDate?: string;
  jurisdiction?: FplJurisdiction;
  guidelineYear?: number;
};

export type FapEstimate = {
  outcome: "potentially_eligible" | "potentially_ineligible" | "needs_more_information";
  estimatedAssistance?: number;
  estimatedRemaining?: number;
  fplPercent?: number;
  matchedRuleIds: string[];
  assumptions: string[];
  reasons: string[];
  citationIds: string[];
  disclaimer: string;
};

function inRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

function conditionsNeedReview(rule: AssistanceRule): boolean {
  return (rule.conditions ?? []).some((condition) => condition.operator === "requires_review");
}

function conditionsFail(rule: AssistanceRule, input: PatientFinancialInputs): boolean {
  for (const condition of rule.conditions ?? []) {
    if (condition.operator === "requires_review") continue;
    if (condition.field === "insurance_status") {
      const actual = input.insuranceStatus;
      if (condition.operator === "equals" && condition.value !== actual) return true;
      if (condition.operator === "not_equals" && condition.value === actual) return true;
      if (condition.operator === "in" && Array.isArray(condition.value) && !condition.value.includes(actual)) {
        return true;
      }
      if (
        condition.operator === "not_in" &&
        Array.isArray(condition.value) &&
        condition.value.includes(actual)
      ) {
        return true;
      }
    }
  }
  return false;
}

function assistanceFromRule(rule: AssistanceRule, billAmount: number): number | null {
  if (rule.assistanceType === "free") {
    return roundUsd(billAmount);
  }
  if (rule.assistanceType === "percentage_discount") {
    if (rule.discountPercent === undefined) return null;
    return roundUsd((billAmount * rule.discountPercent) / 100);
  }
  if (rule.assistanceType === "custom" && rule.fixedAssistanceAmount !== undefined) {
    return roundUsd(Math.min(rule.fixedAssistanceAmount, billAmount));
  }
  if (rule.assistanceType === "amount_limit" && rule.fixedAssistanceAmount !== undefined) {
    return roundUsd(Math.max(0, billAmount - rule.fixedAssistanceAmount));
  }
  return null;
}

function matchRule(
  rules: AssistanceRule[],
  fplPercent: number,
  input: PatientFinancialInputs,
): { rule?: AssistanceRule; needsReview: boolean } {
  for (const rule of rules) {
    if (!inRange(fplPercent, rule.minFplPercent, rule.maxFplPercent)) continue;
    if (conditionsFail(rule, input)) continue;
    if (conditionsNeedReview(rule)) return { rule, needsReview: true };
    return { rule, needsReview: false };
  }
  return { needsReview: false };
}

export function calculateFapEstimate(input: PatientFinancialInputs, policy: FapPolicy): FapEstimate {
  const assumptions: string[] = [];
  const reasons: string[] = [];
  const citationIds: string[] = [];
  const matchedRuleIds: string[] = [];

  if (!Number.isInteger(input.householdSize) || input.householdSize < 1) {
    return {
      outcome: "needs_more_information",
      matchedRuleIds,
      assumptions,
      reasons: ["Household size is required and must be at least 1."],
      citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  if (!Number.isFinite(input.householdAnnualIncome) || input.householdAnnualIncome < 0) {
    return {
      outcome: "needs_more_information",
      matchedRuleIds,
      assumptions,
      reasons: ["Annual household income is required."],
      citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  if (!Number.isFinite(input.billAmount) || input.billAmount < 0) {
    return {
      outcome: "needs_more_information",
      matchedRuleIds,
      assumptions,
      reasons: ["Bill amount is required."],
      citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  if (policy.residency?.required) {
    const allowed = policy.residency.allowedStates ?? [];
    if (!input.state) {
      return {
        outcome: "needs_more_information",
        matchedRuleIds,
        assumptions,
        reasons: ["This policy describes a residency requirement. A state is needed to continue the estimate."],
        citationIds,
        disclaimer: ESTIMATE_DISCLAIMER,
      };
    }
    if (allowed.length > 0 && !allowed.includes(input.state)) {
      return {
        outcome: "potentially_ineligible",
        estimatedAssistance: 0,
        estimatedRemaining: roundUsd(input.billAmount),
        matchedRuleIds,
        assumptions,
        reasons: ["Entered state does not appear to meet this policy's published residency requirement."],
        citationIds,
        disclaimer: ESTIMATE_DISCLAIMER,
      };
    }
  }

  const insuredEligible = policy.policyScope.insuredPatientsEligible;
  if (input.insuranceStatus === "insured" && insuredEligible === false) {
    return {
      outcome: "potentially_ineligible",
      estimatedAssistance: 0,
      estimatedRemaining: roundUsd(input.billAmount),
      fplPercent: calculateFplPercent({
        householdIncome: input.householdAnnualIncome,
        householdSize: input.householdSize,
        jurisdiction: input.jurisdiction,
        guidelineYear: input.guidelineYear,
      }),
      matchedRuleIds,
      assumptions,
      reasons: ["This published policy does not list insured patients as eligible for financial assistance."],
      citationIds: policy.citations.filter((c) => c.section?.toLowerCase().includes("who")).map((c) => c.id),
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  if (input.insuranceStatus === "insured" && insuredEligible === "conditional") {
    return {
      outcome: "needs_more_information",
      matchedRuleIds,
      assumptions,
      reasons: [
        "This policy lists insured eligibility as conditional. Additional policy-specific facts are needed before an estimate can be calculated.",
      ],
      citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  const fplPercent = calculateFplPercent({
    householdIncome: input.householdAnnualIncome,
    householdSize: input.householdSize,
    jurisdiction: input.jurisdiction,
    guidelineYear: input.guidelineYear,
  });

  assumptions.push(
    `Federal Poverty Guideline percentage uses HHS ${input.guidelineYear ?? 2026} tables for the selected jurisdiction.`,
  );
  assumptions.push("The hospital makes the final eligibility and assistance determination.");

  const free = matchRule(policy.freeCareRules, fplPercent, input);
  const discounted = matchRule(policy.discountedCareRules, fplPercent, input);
  const matched = free.rule ?? discounted.rule;

  if (free.needsReview || discounted.needsReview) {
    return {
      outcome: "needs_more_information",
      fplPercent,
      matchedRuleIds: matched ? [matched.id] : [],
      assumptions,
      reasons: ["A published rule applies but requires human review before an amount can be estimated."],
      citationIds: matched?.citationIds ?? [],
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  if (!matched) {
    return {
      outcome: "potentially_ineligible",
      estimatedAssistance: 0,
      estimatedRemaining: roundUsd(input.billAmount),
      fplPercent,
      matchedRuleIds,
      assumptions,
      reasons: [
        "Entered household income and size do not appear to fall within this policy's published free-care or discounted-care ranges.",
      ],
      citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  const assistance = assistanceFromRule(matched, input.billAmount);
  if (assistance === null) {
    return {
      outcome: "needs_more_information",
      fplPercent,
      matchedRuleIds: [matched.id],
      assumptions,
      reasons: ["A matching policy bracket was found but the assistance amount is not specified clearly enough to calculate."],
      citationIds: matched.citationIds,
      disclaimer: ESTIMATE_DISCLAIMER,
    };
  }

  const remaining = roundUsd(Math.max(0, input.billAmount - assistance));
  matchedRuleIds.push(matched.id);
  citationIds.push(...matched.citationIds);
  if (input.insuranceStatus === "insured") {
    citationIds.push(
      ...policy.citations.filter((c) => c.id === "cit-insured" || c.section?.toLowerCase().includes("who")).map((c) => c.id),
    );
  }

  if (matched.assistanceType === "free") {
    reasons.push(
      "Household income appears to fall within the hospital's published free-care range.",
    );
  } else {
    reasons.push(
      "Household income appears to fall within the hospital's published discounted-care range.",
    );
  }

  return {
    outcome: "potentially_eligible",
    estimatedAssistance: assistance,
    estimatedRemaining: remaining,
    fplPercent,
    matchedRuleIds,
    assumptions,
    reasons,
    citationIds: [...new Set(citationIds)],
    disclaimer: ESTIMATE_DISCLAIMER,
  };
}
