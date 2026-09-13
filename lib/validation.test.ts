import { describe, expect, it } from "vitest";
import { parseUsdInput } from "@/lib/money";
import { errorEnvelope } from "@/lib/errors";
import {
  caseCreateSchema,
  compactPatch,
  fieldErrors,
  hospitalListQuerySchema,
  isoDateSchema,
  programPatchSchema,
  todayIsoDate,
  treasuryFundSchema,
  visibleFieldError,
} from "@/lib/validation";
import demo from "@/data/demo/example-medical-center.json";

const valid = {
  hospitalId: demo.hospitalId,
  billAmount: demo.billAmount,
  householdSize: demo.householdSize,
  householdAnnualIncome: demo.income,
  insuranceStatus: demo.insuranceStatus,
  firstPostDischargeBillDate: "2020-06-15",
};

describe("parseUsdInput", () => {
  it("accepts dollars, commas, and two decimals", () => {
    expect(parseUsdInput("$18,420")).toBe(18420);
    expect(parseUsdInput("51000.50")).toBe(51000.5);
    expect(parseUsdInput("0")).toBe(0);
  });

  it("rejects scientific notation, extra decimals, and negatives", () => {
    expect(parseUsdInput("1e6")).toBeNull();
    expect(parseUsdInput("10.123")).toBeNull();
    expect(parseUsdInput("-5")).toBeNull();
    expect(parseUsdInput("abc")).toBeNull();
  });
});

describe("caseCreateSchema", () => {
  it("accepts the demo numbers and money strings", () => {
    expect(caseCreateSchema.parse(valid).billAmount).toBe(18420);
    expect(
      caseCreateSchema.parse({
        ...valid,
        billAmount: "$18,420",
        householdSize: "3",
        householdAnnualIncome: "51,000",
      }).householdAnnualIncome,
    ).toBe(51000);
  });

  it("accepts the Load Demo fixture date", () => {
    const parsed = caseCreateSchema.safeParse({
      ...valid,
      firstPostDischargeBillDate: demo.firstPostDischargeBillDate,
    });
    expect(parsed.success).toBe(true);
  });

  it("requires a hospital, a positive bill, and a household of 1-30", () => {
    expect(caseCreateSchema.safeParse({ ...valid, hospitalId: "" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, billAmount: 0 }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdSize: 0 }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdSize: 1.5 }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdSize: 31 }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdSize: "3.0" }).success).toBe(false);
  });

  it("allows zero income and rejects negative income", () => {
    expect(caseCreateSchema.parse({ ...valid, householdAnnualIncome: 0 }).householdAnnualIncome).toBe(0);
    expect(caseCreateSchema.safeParse({ ...valid, householdAnnualIncome: -1 }).success).toBe(false);
  });

  it("rejects invalid insurance and calendar dates", () => {
    expect(caseCreateSchema.safeParse({ ...valid, insuranceStatus: "maybe" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, firstPostDischargeBillDate: "2026-02-31" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, firstPostDischargeBillDate: "08/20/2026" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, firstPostDischargeBillDate: "2009-12-31" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, firstPostDischargeBillDate: "2099-01-01" }).success).toBe(false);
    expect(caseCreateSchema.parse({ ...valid, firstPostDischargeBillDate: "" }).firstPostDischargeBillDate).toBeUndefined();
  });

  it("maps household failures to INVALID_HOUSEHOLD_SIZE", () => {
    const parsed = caseCreateSchema.safeParse({ ...valid, householdSize: 0 });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(errorEnvelope(parsed.error).error.code).toBe("INVALID_HOUSEHOLD_SIZE");
    expect(errorEnvelope(parsed.error).error.message).toBe("Household size must be at least 1.");
  });

  it("maps bill amount failures to INVALID_BILL_AMOUNT", () => {
    const parsed = caseCreateSchema.safeParse({ ...valid, billAmount: -1 });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(errorEnvelope(parsed.error).error.code).toBe("INVALID_BILL_AMOUNT");
  });
});

describe("treasuryFundSchema", () => {
  it("accepts a positive amount and rejects zero", () => {
    expect(treasuryFundSchema.parse({ amount: "1,000" }).amount).toBe(1000);
    expect(treasuryFundSchema.safeParse({ amount: 0 }).success).toBe(false);
    expect(treasuryFundSchema.safeParse({ amount: "" }).success).toBe(false);
  });
});

describe("programPatchSchema", () => {
  it("rejects a minimum grant above the maximum", () => {
    const parsed = programPatchSchema.safeParse({ minGrant: 600, maxGrant: 500 });
    expect(parsed.success).toBe(false);
  });
});

describe("hospitalListQuerySchema", () => {
  it("uppercases a state code and rejects an unknown state", () => {
    expect(hospitalListQuerySchema.parse({ state: "mo" }).state).toBe("MO");
    expect(hospitalListQuerySchema.safeParse({ state: "XX" }).success).toBe(false);
    expect(hospitalListQuerySchema.safeParse({ search: "a".repeat(101) }).success).toBe(false);
  });
});

describe("field helpers", () => {
  it("returns the first Zod message per field", () => {
    const parsed = caseCreateSchema.safeParse({ ...valid, billAmount: "", householdSize: 0 });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const errors = fieldErrors(parsed.error);
    expect(errors.billAmount).toBeTruthy();
    expect(errors.householdSize).toBe("Household size must be at least 1.");
  });

  it("hides errors until blur or submit", () => {
    expect(visibleFieldError("billAmount", { billAmount: "Enter a bill amount." }, {}, false)).toBeUndefined();
    expect(visibleFieldError("billAmount", { billAmount: "Enter a bill amount." }, { billAmount: true }, false)).toBe(
      "Enter a bill amount.",
    );
    expect(visibleFieldError("billAmount", { billAmount: "Enter a bill amount." }, {}, true)).toBe("Enter a bill amount.");
  });

  it("drops undefined keys from a patch", () => {
    expect(compactPatch({ billAmount: 10, state: undefined })).toEqual({ billAmount: 10 });
  });
});

describe("isoDateSchema", () => {
  it("accepts today", () => {
    expect(isoDateSchema.parse(todayIsoDate())).toBe(todayIsoDate());
  });
});
