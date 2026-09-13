import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { DEMO_HOSPITAL_ID, DEMO_POLICY_VERSION_ID, DEMO_PROGRAM_ID, DEMO_PROGRAM_NAME, getDemoFixture } from "@/lib/config";
import fixture from "@/data/hospitals/example-medical-center/fap-2026.json";
import riverside from "@/data/hospitals/riverside-community/fap-2026.json";
import { FapPolicy } from "@/lib/fap/schema";
import { prisma } from "@/lib/db/prisma";
import { hydrateFromPrisma, persistToPrisma } from "@/lib/db/prisma-sync";
import { seedCampaigns, seedFunders, seedNetworkPrograms } from "@/lib/network/seed";
import type {
  StoredDonation,
  StoredDonor,
  StoredFunder,
  StoredGrantAllocation,
  StoredGrantEscrow,
  StoredMatchCampaign,
  StoredNetworkProgram,
} from "@/lib/network/types";

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
  | "system_agent"
  | "funder";
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
  residencyAnswers?: Record<string, unknown>;
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
    | "reserved"
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
  status: "prepared" | "reserved" | "submitted" | "confirmed" | "failed";
  escrowId?: string;
  arcTransactionHash?: string;
  submittedAt?: string;
  confirmedAt?: string;
};

export type StoredTreasuryTx = {
  id: string;
  type:
    | "fund_relief_pool"
    | "fund_program"
    | "grant_reserve"
    | "grant_release"
    | "refund"
    | "donation"
    | "match"
    | "admin_transfer";
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
    policySourcePath?: string;
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
  funders: StoredFunder[];
  networkPrograms: StoredNetworkProgram[];
  escrows: StoredGrantEscrow[];
  allocations: StoredGrantAllocation[];
  donations: StoredDonation[];
  campaigns: StoredMatchCampaign[];
  donors: StoredDonor[];
  program: {
    id: string;
    name: string;
    status: "active" | "paused" | "closed";
    currency: "USDC";
    minGrant?: number;
    maxGrant: number;
    autoApprovalCap: number;
    humanApprovalThreshold: number;
    quorumThreshold?: number;
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
  const seededAt = new Date().toISOString();
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
        policySourcePath: "data/hospitals/example-medical-center/fap-2026.md",
      },
      {
        id: riverside.hospital.id,
        name: riverside.hospital.name,
        systemName: riverside.hospital.systemName,
        city: riverside.hospital.city,
        state: riverside.hospital.state,
        organizationType: riverside.hospital.organizationType,
        fapLandingPageUrl: riverside.hospital.fapLandingPageUrl,
        applicationUrl: riverside.hospital.applicationUrl,
        activePolicyVersionId: riverside.id,
        policySourcePath: "data/hospitals/riverside-community/fap-2026.md",
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
      {
        id: riverside.id,
        hospitalId: riverside.hospitalId,
        documentId: riverside.documentId,
        versionLabel: riverside.versionLabel,
        effectiveDate: riverside.effectiveDate,
        structuredPolicy: riverside.structuredPolicy as FapPolicy,
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
    funders: seedFunders(seededAt),
    networkPrograms: seedNetworkPrograms(seededAt),
    escrows: [],
    allocations: [],
    donations: [],
    campaigns: seedCampaigns(seededAt),
    donors: [],
    program: {
      id: DEMO_PROGRAM_ID,
      name: DEMO_PROGRAM_NAME,
      status: "active",
      currency: "USDC",
      minGrant: undefined,
      maxGrant: getDemoFixture().maxStandardGrant,
      autoApprovalCap: getDemoFixture().autoThreshold,
      humanApprovalThreshold: getDemoFixture().autoThreshold + 1,
      requiresWorldCheck: true,
      requiresFapCompletion: true,
      requiresVerifiedResidual: true,
      demoAvailableCapital: getDemoFixture().demoAvailableCapital,
      demoReliefDelivered: 8250,
      demoGrantsCompleted: 31,
    },
  };
}

let memory: StoreShape | null = null;
let loading: Promise<StoreShape> | null = null;

function persistJson() {
  mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(memory, null, 2));
}

function ensureSeededHospitals(store: StoreShape) {
  const seed = emptyStore();
  for (const hospital of seed.hospitals) {
    const existing = store.hospitals.find((row) => row.id === hospital.id);
    if (!existing) {
      store.hospitals.push(hospital);
    } else if (!existing.policySourcePath && hospital.policySourcePath) {
      existing.policySourcePath = hospital.policySourcePath;
    }
  }
  for (const policy of seed.policies) {
    if (!store.policies.some((row) => row.id === policy.id)) {
      store.policies.push(policy);
    }
  }
  if (!store.program?.id) {
    store.program = seed.program;
  }
  store.funders ??= [];
  store.networkPrograms ??= [];
  store.escrows ??= [];
  store.allocations ??= [];
  store.donations ??= [];
  store.campaigns ??= [];
  store.donors ??= [];
  for (const funder of seed.funders) {
    if (!store.funders.some((row) => row.id === funder.id)) store.funders.push(funder);
  }
  for (const program of seed.networkPrograms) {
    if (!store.networkPrograms.some((row) => row.id === program.id)) store.networkPrograms.push(program);
  }
  for (const campaign of seed.campaigns) {
    if (!store.campaigns.some((row) => row.id === campaign.id)) store.campaigns.push(campaign);
  }
}

async function load(): Promise<StoreShape> {
  if (memory) return memory;
  if (loading) return loading;
  loading = (async () => {
    const client = prisma();
    if (client) {
      memory = await hydrateFromPrisma(client, emptyStore);
      ensureSeededHospitals(memory);
      await persistToPrisma(client, memory);
      return memory;
    }
    try {
      memory = JSON.parse(readFileSync(DATA_PATH, "utf8")) as StoreShape;
      ensureSeededHospitals(memory);
      persistJson();
    } catch {
      memory = emptyStore();
      persistJson();
    }
    return memory;
  })();
  try {
    return await loading;
  } finally {
    loading = null;
  }
}

async function persist() {
  if (!memory) return;
  const client = prisma();
  if (client) {
    await persistToPrisma(client, memory);
    return;
  }
  persistJson();
}

export async function getStore(): Promise<StoreShape> {
  return load();
}

export async function saveStore(): Promise<void> {
  await persist();
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function id(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export async function writeAudit(event: Omit<StoredAudit, "id" | "createdAt">): Promise<StoredAudit> {
  const store = await load();
  const row: StoredAudit = { ...event, id: id("aud"), createdAt: nowIso() };
  store.audits.push(row);
  await persist();
  return row;
}

export async function resetStoreForTests(): Promise<void> {
  memory = emptyStore();
  persistJson();
}
