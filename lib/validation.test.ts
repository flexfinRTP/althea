import { describe, expect, it } from "vitest";
import { parseUsdInput, sanitizeHexInput, sanitizeMoneyInput, sanitizeWholeNumberInput } from "@/lib/money";
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
  donateSchema,
  funderProgramSchema,
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

describe("sanitizeMoneyInput", () => {
  it("strips letters and extra punctuation", () => {
    expect(sanitizeMoneyInput("abc")).toBe("");
    expect(sanitizeMoneyInput("18k")).toBe("18");
    expect(sanitizeMoneyInput("1e6")).toBe("16");
    expect(sanitizeMoneyInput("-50")).toBe("50");
    expect(sanitizeMoneyInput("12.3456")).toBe("12.34");
  });

  it("keeps dollars, commas, and a trailing decimal", () => {
    expect(sanitizeMoneyInput("$18,420.50")).toBe("$18,420.50");
    expect(sanitizeMoneyInput("18.")).toBe("18.");
    expect(sanitizeMoneyInput("$")).toBe("$");
  });
});

describe("sanitizeWholeNumberInput", () => {
  it("keeps digits only and respects max length", () => {
    expect(sanitizeWholeNumberInput("3 people")).toBe("3");
    expect(sanitizeWholeNumberInput("twelve")).toBe("");
    expect(sanitizeWholeNumberInput("123", 2)).toBe("12");
  });
});

describe("sanitizeHexInput", () => {
  it("allows 0x and hex letters only", () => {
    expect(sanitizeHexInput("0xabcDEF12")).toBe("0xabcDEF12");
    expect(sanitizeHexInput("0xzzz")).toBe("0x");
    expect(sanitizeHexInput("hello")).toBe("");
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

  it("rejects letters in money and household fields", () => {
    expect(caseCreateSchema.safeParse({ ...valid, billAmount: "eighteen" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdSize: "two" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, householdAnnualIncome: "50k" }).success).toBe(false);
    expect(caseCreateSchema.safeParse({ ...valid, billAmount: "1e6" }).success).toBe(false);
  });
});

describe("treasuryFundSchema", () => {
  it("accepts a positive amount and rejects zero", () => {
    expect(treasuryFundSchema.parse({ amount: "1,000" }).amount).toBe(1000);
    expect(treasuryFundSchema.safeParse({ amount: 0 }).success).toBe(false);
    expect(treasuryFundSchema.safeParse({ amount: "" }).success).toBe(false);
  });
});

describe("donateSchema", () => {
  it("accepts a source chain and amount", () => {
    expect(donateSchema.parse({ amount: "50", sourceChain: "ethereum" })).toMatchObject({
      amount: 50,
      sourceChain: "ethereum",
    });
    expect(donateSchema.safeParse({ amount: 50, sourceChain: "bitcoin" }).success).toBe(false);
  });

  it("treats a blank email as omitted and rejects letter amounts", () => {
    expect(donateSchema.parse({ amount: 50, sourceChain: "arc", email: "" }).email).toBeUndefined();
    expect(donateSchema.safeParse({ amount: "abc", sourceChain: "arc" }).success).toBe(false);
    expect(donateSchema.safeParse({ amount: 50, sourceChain: "arc", email: "not-an-email" }).success).toBe(false);
  });
});

describe("funderProgramSchema", () => {
  it("requires a grant cap", () => {
    expect(
      funderProgramSchema.parse({ name: "Medical Hardship Match", grantCap: 250, matchRatioNum: 1, matchRatioDen: 1 })
        .grantCap,
    ).toBe(250);
    expect(funderProgramSchema.safeParse({ name: "Match" }).success).toBe(false);
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
