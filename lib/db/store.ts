import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { DEMO_HOSPITAL_ID, DEMO_POLICY_VERSION_ID, DEMO_PROGRAM_ID, DEMO_PROGRAM_NAME } from "@/lib/config";
import fixture from "@/data/hospitals/example-medical-center/fap-2026.json";
import { FapPolicy } from "@/lib/fap/schema";

export type CaseStatus =
  | "draft"
  | "fap_analyzed"
  | "application_prepared"
  | "application_submitted"
  | "hospital_review"
  | "hospital_approved"
  | "hospital_denied"
  | "residual_verified"
  | "relief_requested"
  | "world_check_complete"
  | "relief_evaluated"
  | "relief_review"
  | "relief_approved"
  | "relief_denied"
  | "grant_executed"
  | "closed";

export type Role =
  | "patient"
  | "advocate"
  | "relief_reviewer"
  | "program_admin"
  | "treasury_admin"
  | "auditor"
  | "system_agent";

export type StoredCase = {
  id: string;
  userId?: string;
  hospitalId: string;
  status: CaseStatus;
  caseHash?: string;
  caseHashSalt?: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredFinancialInput = {
  caseId: string;
  billAmount: number;
  householdSize: number;
  householdAnnualIncome: number;
  insuranceStatus: "insured" | "uninsured";
  firstPostDischargeBillDate?: string;
  state?: string;
};

export type StoredEstimate = {
  id: string;
  caseId: string;
  policyVersionId: string;
  fplPercent?: number;
  outcome: string;
  estimatedAssistance?: number;
  estimatedRemaining?: number;
  matchedRuleIds: string[];
  assumptions: string[];
  reasons: string[];
  citationIds: string[];
  calculatedAt: string;
};

export type StoredPacket = {
  id: string;
  caseId: string;
  policyVersionId: string;
  status: "prepared" | "submitted" | "needs_documents";
  applicationUrl?: string;
  submissionInstructions: string[];
  requiredDocuments: FapPolicy["requiredDocuments"];
  generatedFields: Record<string, string>;
  generatedAt: string;
  submittedAt?: string;
};

export type StoredDecision = {
  id: string;
  caseId: string;
  status: "approved" | "partially_approved" | "denied";
  originalBalance: number;
  approvedAssistance: number;
  remainingBalance: number;
  source: "simulated_demo" | "patient_uploaded" | "hospital_api" | "manual_verified";
  verified: boolean;
  createdAt: string;
};

export type StoredWorld = {
  id: string;
  caseId: string;
  status: "not_started" | "pending" | "passed" | "failed" | "manual_review";
  verificationReference?: string;
  verifiedAt?: string;
  createdAt: string;
};

export type StoredReliefRequest = {
  id: string;
  caseId: string;
  programId: string;
  requestedAmount: number;
  residualBalance: number;
  status:
    | "pending"
    | "awaiting_world"
    | "evaluating"
    | "review_required"
    | "approved"
    | "denied"
    | "executing"
    | "executed";
  executionKey?: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredReliefDecision = {
  id: string;
  reliefRequestId: string;
  decision: "auto_approved" | "human_review_required" | "approved" | "denied";
  calculatedGrantAmount: number;
  reasonCodes: string[];
  rulesVersion: string;
  approvedBy?: string;
  createdAt: string;
};

export type StoredGrant = {
  id: string;
  reliefRequestId: string;
  caseHash: string;
  programId: string;
  amount: number;
  currency: "USDC";
  providerSettlementAddress: string;
  decisionHash: string;
  status: "prepared" | "submitted" | "confirmed" | "failed";
  arcTransactionHash?: string;
  submittedAt?: string;
  confirmedAt?: string;
};

export type StoredTreasuryTx = {
  id: string;
  type: "fund_relief_pool" | "grant_release" | "refund" | "admin_transfer";
  amount: number;
  currency: "USDC";
  sourceAddress?: string;
  destinationAddress: string;
  chain: "arc";
  transactionHash?: string;
  status: "pending" | "confirmed" | "failed";
  initiatedBy: string;
  createdAt: string;
};

export type StoredAudit = {
  id: string;
  caseId?: string;
  actorType: "patient" | "staff" | "system" | "agent" | "blockchain";
  actorId?: string;
  eventType: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type StoreShape = {
  hospitals: Array<{
    id: string;
    name: string;
    systemName?: string;
    city?: string;
    state?: string;
    organizationType?: string;
    fapLandingPageUrl?: string;
    applicationUrl?: string;
    activePolicyVersionId?: string;
  }>;
  policies: Array<{
    id: string;
    hospitalId: string;
    documentId: string;
    versionLabel: string;
    effectiveDate?: string;
    structuredPolicy: FapPolicy;
    validationStatus: string;
  }>;
  users: Array<{ id: string; role: Role; email?: string }>;
  cases: StoredCase[];
  financialInputs: StoredFinancialInput[];
  estimates: StoredEstimate[];
  packets: StoredPacket[];
  decisions: StoredDecision[];
  world: StoredWorld[];
  reliefRequests: StoredReliefRequest[];
  reliefDecisions: StoredReliefDecision[];
  grants: StoredGrant[];
  treasury: StoredTreasuryTx[];
  audits: StoredAudit[];
  nullifiers: Array<{ nullifier: string; action: string }>;
  program: {
    id: string;
    name: string;
    status: "active" | "paused" | "closed";
    currency: "USDC";
    maxGrant: number;
    autoApprovalCap: number;
    humanApprovalThreshold: number;
    requiresWorldCheck: boolean;
    requiresFapCompletion: boolean;
    requiresVerifiedResidual: boolean;
    demoAvailableCapital: number;
    demoReliefDelivered: number;
    demoGrantsCompleted: number;
  };
};

const DATA_PATH = path.join(process.cwd(), ".data", "althea-store.json");

function emptyStore(): StoreShape {
  return {
    hospitals: [
      {
        id: DEMO_HOSPITAL_ID,
        name: fixture.hospital.name,
        systemName: fixture.hospital.systemName,
        city: fixture.hospital.city,
        state: fixture.hospital.state,
        organizationType: fixture.hospital.organizationType,
        fapLandingPageUrl: fixture.hospital.fapLandingPageUrl,
        applicationUrl: fixture.hospital.applicationUrl,
        activePolicyVersionId: DEMO_POLICY_VERSION_ID,
      },
    ],
    policies: [
      {
        id: DEMO_POLICY_VERSION_ID,
        hospitalId: DEMO_HOSPITAL_ID,
        documentId: fixture.documentId,
        versionLabel: fixture.versionLabel,
        effectiveDate: fixture.effectiveDate,
        structuredPolicy: fixture.structuredPolicy as FapPolicy,
        validationStatus: "approved",
      },
    ],
    users: [],
    cases: [],
    financialInputs: [],
    estimates: [],
    packets: [],
    decisions: [],
    world: [],
    reliefRequests: [],
    reliefDecisions: [],
    grants: [],
    treasury: [],
    audits: [],
    nullifiers: [],
    program: {
      id: DEMO_PROGRAM_ID,
      name: DEMO_PROGRAM_NAME,
      status: "active",
      currency: "USDC",
      maxGrant: 500,
      autoApprovalCap: 250,
      humanApprovalThreshold: 251,
      requiresWorldCheck: true,
      requiresFapCompletion: true,
      requiresVerifiedResidual: true,
      demoAvailableCapital: 25000,
      demoReliefDelivered: 8250,
      demoGrantsCompleted: 31,
    },
  };
}

let memory: StoreShape | null = null;

function load(): StoreShape {
  if (memory) return memory;
  try {
    memory = JSON.parse(readFileSync(DATA_PATH, "utf8")) as StoreShape;
  } catch {
    memory = emptyStore();
    persist();
  }
  return memory;
}

function persist() {
  mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(memory, null, 2));
}

export function getStore(): StoreShape {
  return load();
}

export function saveStore(): void {
  persist();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function id(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export function writeAudit(event: Omit<StoredAudit, "id" | "createdAt">): StoredAudit {
  const store = load();
  const row: StoredAudit = { ...event, id: id("aud"), createdAt: nowIso() };
  store.audits.push(row);
  persist();
  return row;
}

export function resetStoreForTests(): void {
  memory = emptyStore();
  persist();
}
