import { z, ZodError } from "zod";
import { DEMO_PROGRAM_ID } from "@/lib/config";
import { parseUsdInput } from "@/lib/money";

export const MIN_BILL_DATE = "2010-01-01";
export const MAX_MONEY = 10_000_000;
export const MAX_HOUSEHOLD_SIZE = 30;

export const US_STATE_CODES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

export function todayIsoDate(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isRealIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function fieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export function visibleFieldError(
  field: string,
  errors: Record<string, string>,
  touched: Record<string, boolean>,
  submitted: boolean,
): string | undefined {
  if (!(submitted || touched[field])) return undefined;
  return errors[field];
}

export function compactPatch<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;
}

function emptyToUndefined(value: unknown): unknown {
  if (value === null || value === "") return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return value;
}

function toMoney(value: unknown): unknown {
  const next = emptyToUndefined(value);
  if (typeof next === "number") return next;
  if (typeof next === "string") return parseUsdInput(next);
  return next;
}

function toWholeNumber(value: unknown): unknown {
  const next = emptyToUndefined(value);
  if (typeof next === "number") return next;
  if (typeof next !== "string") return next;
  if (!/^\d+$/.test(next)) return Number.NaN;
  return Number(next);
}

function toState(value: unknown): unknown {
  const next = emptyToUndefined(value);
  if (typeof next === "string") return next.toUpperCase();
  return next;
}

function hasAtMostTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;
}

export const entityIdSchema = z
  .string({ required_error: "Missing id.", invalid_type_error: "Missing id." })
  .trim()
  .min(1, "Missing id.")
  .max(64, "Id is not valid.")
  .regex(/^[a-zA-Z0-9_-]+$/, "Id is not valid.");

export const hospitalIdSchema = z
  .string({ required_error: "Select a hospital.", invalid_type_error: "Select a hospital." })
  .trim()
  .min(1, "Select a hospital.")
  .max(64, "Hospital is not valid.")
  .regex(/^[a-zA-Z0-9_-]+$/, "Hospital is not valid.");

export const insuranceStatusSchema = z.enum(["insured", "uninsured"], {
  errorMap: () => ({ message: "Select insurance status." }),
});

export const usStateSchema = z.enum(US_STATE_CODES, {
  errorMap: () => ({ message: "Enter a valid US state." }),
});

const billAmountNumber = z
  .number({ required_error: "Enter a bill amount.", invalid_type_error: "Enter a valid dollar amount." })
  .finite("Enter a valid dollar amount.")
  .positive("Bill amount must be greater than $0.")
  .max(MAX_MONEY, "Bill amount cannot exceed $10,000,000.")
  .refine(hasAtMostTwoDecimals, "Use up to two decimal places.");

const incomeNumber = z
  .number({
    required_error: "Enter annual household income.",
    invalid_type_error: "Enter a valid dollar amount.",
  })
  .finite("Enter a valid dollar amount.")
  .nonnegative("Income cannot be negative.")
  .max(MAX_MONEY, "Income cannot exceed $10,000,000.")
  .refine(hasAtMostTwoDecimals, "Use up to two decimal places.");

const householdSizeNumber = z
  .number({
    required_error: "Enter household size.",
    invalid_type_error: "Enter household size as a whole number.",
  })
  .int("Household size must be a whole number.")
  .min(1, "Household size must be at least 1.")
  .max(MAX_HOUSEHOLD_SIZE, "Household size cannot exceed 30.");

const moneyNumber = z
  .number({ required_error: "Enter an amount.", invalid_type_error: "Enter a valid dollar amount." })
  .finite("Enter a valid dollar amount.")
  .positive("Amount must be greater than $0.")
  .max(MAX_MONEY, "Amount cannot exceed $10,000,000.")
  .refine(hasAtMostTwoDecimals, "Use up to two decimal places.");

const nonnegativeMoneyNumber = z
  .number({ required_error: "Enter an amount.", invalid_type_error: "Enter a valid dollar amount." })
  .finite("Enter a valid dollar amount.")
  .nonnegative("Amount cannot be negative.")
  .max(MAX_MONEY, "Amount cannot exceed $10,000,000.")
  .refine(hasAtMostTwoDecimals, "Use up to two decimal places.");

export const billAmountSchema = z.preprocess(toMoney, billAmountNumber);
export const householdSizeSchema = z.preprocess(toWholeNumber, householdSizeNumber);
export const householdAnnualIncomeSchema = z.preprocess(toMoney, incomeNumber);
export const treasuryAmountSchema = z.preprocess(toMoney, moneyNumber);
export const requestedAmountSchema = z.preprocess(toMoney, moneyNumber);
export const nonnegativeMoneySchema = z.preprocess(toMoney, nonnegativeMoneyNumber);

export const isoDateSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .refine(isRealIsoDate, "Enter a valid date.")
    .refine((value) => value >= MIN_BILL_DATE, "Date cannot be before 2010.")
    .refine((value) => value <= todayIsoDate(), "Date cannot be in the future.")
    .optional(),
);

export const optionalStateSchema = z.preprocess(toState, usStateSchema.optional());

export const caseCreateSchema = z.object({
  hospitalId: hospitalIdSchema,
  billAmount: billAmountSchema,
  householdSize: householdSizeSchema,
  householdAnnualIncome: householdAnnualIncomeSchema,
  insuranceStatus: insuranceStatusSchema,
  firstPostDischargeBillDate: isoDateSchema,
  state: optionalStateSchema,
});

export const casePatchSchema = z.object({
  billAmount: billAmountSchema.optional(),
  householdSize: householdSizeSchema.optional(),
  householdAnnualIncome: householdAnnualIncomeSchema.optional(),
  insuranceStatus: insuranceStatusSchema.optional(),
  firstPostDischargeBillDate: isoDateSchema,
  state: optionalStateSchema,
});

export const treasuryFundSchema = z.object({
  amount: treasuryAmountSchema,
});

export const reliefRequestSchema = z.object({
  programId: entityIdSchema.default(DEMO_PROGRAM_ID),
  requestedAmount: requestedAmountSchema.optional(),
});

export const hospitalDecisionSchema = z.object({
  status: z.enum(["approved", "partially_approved", "denied"], {
    errorMap: () => ({ message: "Select a decision status." }),
  }),
  approvedAssistance: nonnegativeMoneySchema.optional(),
  remainingBalance: nonnegativeMoneySchema.optional(),
  source: z.enum(["patient_uploaded", "hospital_api", "manual_verified"]).default("manual_verified"),
  verified: z.boolean().optional(),
});

export const demoHospitalDecisionSchema = z.object({
  status: z.enum(["approved", "partially_approved", "denied"]).default("approved"),
  approvedAssistance: nonnegativeMoneySchema.optional(),
  remainingBalance: nonnegativeMoneySchema.optional(),
});

export const markSubmittedSchema = z.object({
  submittedAt: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date and time.")
    .optional(),
});

export const programPatchSchema = z
  .object({
    name: z.string().trim().min(1, "Enter a program name.").max(120, "Program name is too long.").optional(),
    status: z.enum(["active", "paused", "closed"], {
      errorMap: () => ({ message: "Select a program status." }),
    }).optional(),
    minGrant: nonnegativeMoneySchema.optional(),
    maxGrant: requestedAmountSchema.optional(),
    autoApprovalCap: nonnegativeMoneySchema.optional(),
    humanApprovalThreshold: nonnegativeMoneySchema.optional(),
    quorumThreshold: z
      .number({ invalid_type_error: "Enter a valid threshold." })
      .finite("Enter a valid threshold.")
      .nonnegative("Threshold cannot be negative.")
      .max(100, "Threshold is too large.")
      .optional(),
    requiresWorldCheck: z.boolean().optional(),
    requiresFapCompletion: z.boolean().optional(),
    requiresVerifiedResidual: z.boolean().optional(),
  })
  .refine(
    (value) => value.minGrant === undefined || value.maxGrant === undefined || value.minGrant <= value.maxGrant,
    { message: "Minimum grant cannot exceed maximum grant.", path: ["minGrant"] },
  );

export const reliefApproveSchema = z.object({
  approvedAmount: requestedAmountSchema.optional(),
});

export const worldVerifySchema = z.object({
  caseId: entityIdSchema,
  rp_id: z.string().trim().min(1, "Missing rp id.").max(200, "rp id is too long.").optional(),
  idkitResponse: z.record(z.unknown()).optional(),
  status: z.enum(["passed", "failed", "manual_review"]).optional(),
});

export const worldRpSignatureSchema = z.object({
  action: z
    .string()
    .trim()
    .min(1, "Enter an action.")
    .max(128, "Action is too long.")
    .default(process.env.WORLD_ACTION_ID || "althea-relief-liveness"),
});

export const hospitalListQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().trim().max(100, "Search is too long.").optional()),
  state: optionalStateSchema,
});

export const authRoleSchema = z.object({
  role: z.enum(["patient", "relief_reviewer", "program_admin", "treasury_admin"], {
    errorMap: () => ({ message: "Select a valid role." }),
  }),
});

export type CaseCreateInput = z.infer<typeof caseCreateSchema>;

export const CASE_FIELD_ORDER = [
  "hospitalId",
  "billAmount",
  "householdSize",
  "householdAnnualIncome",
  "insuranceStatus",
  "firstPostDischargeBillDate",
] as const;
