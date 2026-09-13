/**
 * Eval: Check My Bill and treasury inputs share one Zod contract with the API.
 * Deterministic gate. Not an LLM eval.
 */
import { describe, expect, it } from "vitest";
import { errorEnvelope } from "@/lib/errors";
import { sanitizeMoneyInput, sanitizeWholeNumberInput } from "@/lib/money";
import { caseCreateSchema, donateSchema, funderProgramSchema, treasuryFundSchema } from "@/lib/validation";
import demo from "@/data/demo/example-medical-center.json";

describe("input validation eval", () => {
  it("accepts the demo Check My Bill payload and rejects empty required fields", () => {
    const ok = caseCreateSchema.safeParse({
      hospitalId: demo.hospitalId,
      billAmount: String(demo.billAmount),
      householdSize: String(demo.householdSize),
      householdAnnualIncome: String(demo.income),
      insuranceStatus: demo.insuranceStatus,
      firstPostDischargeBillDate: demo.firstPostDischargeBillDate,
    });
    expect(ok.success).toBe(true);

    const empty = caseCreateSchema.safeParse({
      hospitalId: "",
      billAmount: "",
      householdSize: "",
      householdAnnualIncome: "",
      insuranceStatus: "insured",
      firstPostDischargeBillDate: "",
    });
    expect(empty.success).toBe(false);
    if (empty.success) return;
    expect(errorEnvelope(empty.error).error.code).not.toBe("INTERNAL_ERROR");
  });

  it("rejects a zero treasury fund amount", () => {
    const parsed = treasuryFundSchema.safeParse({ amount: 0 });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(errorEnvelope(parsed.error).error.code).toBe("INVALID_AMOUNT");
  });

  it("rejects letters in money fields on Check My Bill, treasury, donate, and funder", () => {
    expect(sanitizeMoneyInput("eighteen thousand")).toBe("");
    expect(sanitizeWholeNumberInput("three")).toBe("");
    expect(caseCreateSchema.safeParse({
      hospitalId: demo.hospitalId,
      billAmount: "abc",
      householdSize: "x",
      householdAnnualIncome: "50k",
      insuranceStatus: demo.insuranceStatus,
    }).success).toBe(false);
    expect(treasuryFundSchema.safeParse({ amount: "1e6" }).success).toBe(false);
    expect(donateSchema.safeParse({ amount: "fifty", sourceChain: "ethereum" }).success).toBe(false);
    expect(funderProgramSchema.safeParse({ name: "Match", grantCap: "two fifty" }).success).toBe(false);
  });
});
