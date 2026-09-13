import { ZodError } from "zod";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const ZOD_FIELD_CODES: Record<string, string> = {
  householdSize: "INVALID_HOUSEHOLD_SIZE",
  billAmount: "INVALID_BILL_AMOUNT",
  householdAnnualIncome: "INVALID_INCOME",
  firstPostDischargeBillDate: "INVALID_BILL_DATE",
  hospitalId: "INVALID_HOSPITAL",
  insuranceStatus: "INVALID_INSURANCE_STATUS",
  state: "INVALID_STATE",
  amount: "INVALID_AMOUNT",
  requestedAmount: "INVALID_AMOUNT",
  approvedAmount: "INVALID_AMOUNT",
  approvedAssistance: "INVALID_AMOUNT",
  remainingBalance: "INVALID_AMOUNT",
  minGrant: "INVALID_PROGRAM",
  maxGrant: "INVALID_PROGRAM",
  autoApprovalCap: "INVALID_PROGRAM",
  humanApprovalThreshold: "INVALID_PROGRAM",
  quorumThreshold: "INVALID_PROGRAM",
  name: "INVALID_PROGRAM",
  programId: "INVALID_PROGRAM",
  submittedAt: "INVALID_SUBMITTED_AT",
  status: "INVALID_STATUS",
  caseId: "INVALID_CASE_ID",
  role: "INVALID_ROLE",
  search: "INVALID_SEARCH",
  action: "INVALID_ACTION",
  rp_id: "INVALID_RP_ID",
};

export function errorEnvelope(error: unknown): { error: { code: string; message: string } } {
  if (error instanceof ApiError) {
    return { error: { code: error.code, message: error.message } };
  }
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const path = String(first?.path[0] ?? "");
    const code = ZOD_FIELD_CODES[path] ?? "INVALID_REQUEST";
    const fallback = path === "householdSize" ? "Household size must be at least 1." : "Request validation failed.";
    return {
      error: {
        code,
        message: first?.message || fallback,
      },
    };
  }
  console.error(error);
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
    },
  };
}

export function statusFor(error: unknown): number {
  if (error instanceof ApiError) return error.status;
  if (error instanceof ZodError) return 400;
  return 500;
}
