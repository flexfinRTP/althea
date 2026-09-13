import { ApiError } from "@/lib/errors";
import {
  CaseStatus,
  getStore,
  id,
  nowIso,
  saveStore,
  StoredCase,
  StoredDecision,
  StoredEstimate,
  StoredGrant,
  StoredPacket,
  StoredReliefDecision,
  StoredReliefRequest,
  StoredTreasuryTx,
  StoredWorld,
  writeAudit,
} from "@/lib/db/store";
import { calculateFapEstimate } from "@/lib/fap/calculate";
import { FapPolicy } from "@/lib/fap/schema";
import { calculateFapTimeline } from "@/lib/fap/timeline";
import { DEMO_HOSPITAL_ID, demoReferenceDate, getDemoFixture, isDemoMode } from "@/lib/config";
import { generateCaseHashMaterial } from "@/lib/relief/case-hash";
import { readPoolBalance } from "@/lib/arc/balances";
import { explorerTx, RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { mergeTreasuryActivity } from "@/lib/treasury/activity";
import { toPublicGrantList } from "@/lib/fund/grants";

export async function listHospitals(search?: string, state?: string) {
  const { hospitals } = await getStore();
  return hospitals.filter((hospital) => {
    const matchesSearch = search
      ? hospital.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesState = state ? hospital.state === state : true;
    return matchesSearch && matchesState;
  });
}

export async function getHospital(hospitalId: string) {
  const hospital = (await getStore()).hospitals.find((row) => row.id === hospitalId);
  if (!hospital) throw new ApiError("HOSPITAL_NOT_FOUND", "Hospital not found.", 404);
  return hospital;
}

export async function getHospitalFap(hospitalId: string) {
  const hospital = await getHospital(hospitalId);
  const policy = (await getStore()).policies.find((row) => row.id === hospital.activePolicyVersionId);
  if (!policy) throw new ApiError("POLICY_NOT_FOUND", "Policy not found.", 404);
  const structured = policy.structuredPolicy;
  return {
    hospitalId,
    policyVersion: policy.versionLabel,
    insuredPatientsEligible: structured.policyScope.insuredPatientsEligible,
    freeCareRules: structured.freeCareRules,
    discountedCareRules: structured.discountedCareRules,
    requiredDocuments: structured.requiredDocuments,
    applicationMethods: structured.applicationMethods,
    applicationUrl: structured.applicationUrl,
    billingOffice: structured.billingOffice,
    citations: structured.citations,
    demonstrationPolicy: true,
  };
}

export async function getPolicy(hospitalId: string): Promise<{ id: string; structuredPolicy: FapPolicy }> {
  const hospital = await getHospital(hospitalId);
  const policy = (await getStore()).policies.find((row) => row.id === hospital.activePolicyVersionId);
  if (!policy) throw new ApiError("POLICY_NOT_FOUND", "Policy not found.", 404);
  return policy;
}

export async function getProgram() {
  return (await getStore()).program;
}

export async function updateProgram(
  patch: Partial<{
    name: string;
    status: "active" | "paused" | "closed";
    minGrant: number;
    maxGrant: number;
    autoApprovalCap: number;
    humanApprovalThreshold: number;
    quorumThreshold: number;
    requiresWorldCheck: boolean;
    requiresFapCompletion: boolean;
    requiresVerifiedResidual: boolean;
  }>,
) {
  const store = await getStore();
  Object.assign(store.program, patch);
  await saveStore();
  return store.program;
}

async function ensureUser(
  userId: string,
  role: "patient" | "relief_reviewer" | "program_admin" | "treasury_admin" = "patient",
) {
  const store = await getStore();
  if (!store.users.some((user) => user.id === userId)) {
    store.users.push({ id: userId, role });
    await saveStore();
  }
}

export async function createCase(input: {
  hospitalId: string;
  billAmount: number;
  householdSize: number;
  householdAnnualIncome: number;
  insuranceStatus: "insured" | "uninsured";
  firstPostDischargeBillDate?: string;
  state?: string;
  userId?: string;
}): Promise<StoredCase> {
  await getHospital(input.hospitalId);
  const store = await getStore();
  if (input.userId) await ensureUser(input.userId);
  const created = nowIso();
  const row: StoredCase = {
    id: id("case"),
    userId: input.userId,
    hospitalId: input.hospitalId,
    status: "draft",
    createdAt: created,
    updatedAt: created,
  };
  store.cases.push(row);
  store.financialInputs.push({
    caseId: row.id,
    billAmount: input.billAmount,
    householdSize: input.householdSize,
    householdAnnualIncome: input.householdAnnualIncome,
    insuranceStatus: input.insuranceStatus,
    firstPostDischargeBillDate: input.firstPostDischargeBillDate,
    state: input.state,
  });
  await writeAudit({
    caseId: row.id,
    actorType: "patient",
    actorId: input.userId,
    eventType: "CASE_CREATED",
    metadata: { hospitalId: input.hospitalId },
  });
  await saveStore();
  return row;
}

export async function ensureDemoCase(): Promise<StoredCase> {
  const store = await getStore();
  const existing = store.cases.find((item) => item.id === "demo");
  if (existing) return existing;
  const demo = getDemoFixture();
  await ensureUser("demo_patient");
  const created = nowIso();
  const row: StoredCase = {
    id: "demo",
    userId: "demo_patient",
    hospitalId: demo.hospitalId || DEMO_HOSPITAL_ID,
    status: "draft",
    createdAt: created,
    updatedAt: created,
  };
  store.cases.push(row);
  store.financialInputs.push({
    caseId: "demo",
    billAmount: demo.billAmount,
    householdSize: demo.householdSize,
    householdAnnualIncome: demo.income,
    insuranceStatus: demo.insuranceStatus as "insured" | "uninsured",
    firstPostDischargeBillDate: demo.firstPostDischargeBillDate,
  });
  await saveStore();
  await calculateCaseEstimate("demo");
  await writeAudit({ caseId: "demo", actorType: "system", eventType: "CASE_CREATED", metadata: { demo: true } });
  return getCase("demo");
}

export async function getCase(caseId: string): Promise<StoredCase> {
  if (caseId === "demo") {
    const existing = (await getStore()).cases.find((item) => item.id === "demo");
    if (!existing) return ensureDemoCase();
    return existing;
  }
  const row = (await getStore()).cases.find((item) => item.id === caseId);
  if (!row) throw new ApiError("CASE_NOT_FOUND", "Case not found.", 404);
  return row;
}

export async function updateCaseInputs(
  caseId: string,
  patch: Partial<{
    billAmount: number;
    householdSize: number;
    householdAnnualIncome: number;
    insuranceStatus: "insured" | "uninsured";
    firstPostDischargeBillDate?: string;
    state?: string;
  }>,
) {
  await getCase(caseId);
  const input = (await getStore()).financialInputs.find((row) => row.caseId === caseId);
  if (!input) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  Object.assign(input, patch);
  await saveStore();
  return input;
}

export async function getCaseBundle(caseId: string) {
  const store = await getStore();
  const caseRow = await getCase(caseId);
  return {
    case: caseRow,
    hospital: await getHospital(caseRow.hospitalId),
    policy: await getPolicy(caseRow.hospitalId),
    financialInput: store.financialInputs.find((row) => row.caseId === caseId),
    estimate: [...store.estimates].reverse().find((row) => row.caseId === caseId),
    packet: [...store.packets].reverse().find((row) => row.caseId === caseId),
    decision: [...store.decisions].reverse().find((row) => row.caseId === caseId),
    world: [...store.world].reverse().find((row) => row.caseId === caseId),
    reliefRequest: [...store.reliefRequests].reverse().find((row) => row.caseId === caseId),
    program: store.program,
    reliefDecision: undefined as StoredReliefDecision | undefined,
    grant: undefined as StoredGrant | undefined,
  };
}

export async function getFullCase(caseId: string) {
  const bundle = await getCaseBundle(caseId);
  const store = await getStore();
  const reliefDecision = bundle.reliefRequest
    ? [...store.reliefDecisions].reverse().find((row) => row.reliefRequestId === bundle.reliefRequest?.id)
    : undefined;
  const grant = bundle.reliefRequest
    ? [...store.grants].reverse().find((row) => row.reliefRequestId === bundle.reliefRequest?.id)
    : undefined;
  return { ...bundle, reliefDecision, grant };
}

async function setStatus(caseId: string, status: CaseStatus) {
  const row = await getCase(caseId);
  row.status = status;
  row.updatedAt = nowIso();
  await saveStore();
}

export async function calculateCaseEstimate(caseId: string): Promise<StoredEstimate> {
  const bundle = await getCaseBundle(caseId);
  if (!bundle.financialInput) {
    throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  }
  const estimate = calculateFapEstimate(bundle.financialInput, bundle.policy.structuredPolicy);
  const store = await getStore();
  const row: StoredEstimate = {
    id: id("est"),
    caseId,
    policyVersionId: bundle.policy.id,
    fplPercent: estimate.fplPercent,
    outcome: estimate.outcome,
    estimatedAssistance: estimate.estimatedAssistance,
    estimatedRemaining: estimate.estimatedRemaining,
    matchedRuleIds: estimate.matchedRuleIds,
    assumptions: estimate.assumptions,
    reasons: estimate.reasons,
    citationIds: estimate.citationIds,
    calculatedAt: nowIso(),
  };
  store.estimates.push(row);
  await setStatus(caseId, "fap_analyzed");
  await writeAudit({
    caseId,
    actorType: "system",
    eventType: "ESTIMATE_CALCULATED",
    metadata: { outcome: estimate.outcome },
  });
  return row;
}

export async function getCaseTimeline(caseId: string) {
  await getCase(caseId);
  const input = (await getStore()).financialInputs.find((row) => row.caseId === caseId);
  if (!input) throw new ApiError("CASE_NOT_FOUND", "Case not found.", 404);
  return calculateFapTimeline({
    firstPostDischargeBillingDate: input.firstPostDischargeBillDate,
    referenceDate: demoReferenceDate(),
  });
}

export async function prepareApplication(caseId: string): Promise<StoredPacket> {
  const bundle = await getCaseBundle(caseId);
  if (!bundle.financialInput) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  const policy = bundle.policy.structuredPolicy;
  const store = await getStore();
  const billing = policy.billingOffice;
  const row: StoredPacket = {
    id: id("app"),
    caseId,
    policyVersionId: bundle.policy.id,
    status: "prepared",
    applicationUrl: policy.applicationUrl,
    submissionInstructions: [
      "Complete the hospital's application.",
      "Attach required financial documentation.",
      "Submit using the hospital's listed method.",
      "Althea does not electronically submit this application.",
    ],
    requiredDocuments: policy.requiredDocuments,
    generatedFields: {
      hospital: bundle.hospital.name,
      householdSize: String(bundle.financialInput.householdSize),
      householdAnnualIncome: String(bundle.financialInput.householdAnnualIncome),
      insuranceStatus: bundle.financialInput.insuranceStatus,
      billAmount: String(bundle.financialInput.billAmount),
      firstBillingDate: bundle.financialInput.firstPostDischargeBillDate ?? "",
      altheaCaseId: caseId,
      billingPhone: billing?.phone ?? "",
      billingEmail: billing?.email ?? "",
      billingAddress: billing?.address ?? "",
      billingName: billing?.name ?? "",
      applicationMethods: (policy.applicationMethods ?? []).join(", "),
    },
    generatedAt: nowIso(),
  };
  store.packets.push(row);
  await setStatus(caseId, "application_prepared");
  await writeAudit({ caseId, actorType: "patient", eventType: "APPLICATION_PREPARED" });
  return row;
}

export async function markSubmitted(caseId: string, submittedAt?: string) {
  const packet = await prepareIfNeeded(caseId);
  packet.status = "submitted";
  packet.submittedAt = submittedAt ?? nowIso();
  await setStatus(caseId, "application_submitted");
  await writeAudit({ caseId, actorType: "patient", eventType: "APPLICATION_MARKED_SUBMITTED" });
  await saveStore();
  return packet;
}

async function prepareIfNeeded(caseId: string): Promise<StoredPacket> {
  const existing = (await getCaseBundle(caseId)).packet;
  if (existing) return existing;
  return prepareApplication(caseId);
}

export async function recordHospitalDecision(
  caseId: string,
  input: {
    status: "approved" | "partially_approved" | "denied";
    approvedAssistance?: number;
    remainingBalance?: number;
    source?: StoredDecision["source"];
    verified?: boolean;
  },
): Promise<StoredDecision> {
  let bundle = await getCaseBundle(caseId);
  if (!bundle.financialInput) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  if (!bundle.estimate) {
    await calculateCaseEstimate(caseId);
    bundle = await getCaseBundle(caseId);
  }
  const original = bundle.financialInput.billAmount;
  const approvedAssistance = input.approvedAssistance ?? bundle.estimate?.estimatedAssistance ?? 0;
  const remainingBalance =
    input.remainingBalance ?? bundle.estimate?.estimatedRemaining ?? Math.max(0, original - approvedAssistance);
  const store = await getStore();
  const source = input.source ?? (isDemoMode() ? "simulated_demo" : "manual_verified");
  const row: StoredDecision = {
    id: id("decision"),
    caseId,
    status: input.status,
    originalBalance: original,
    approvedAssistance,
    remainingBalance,
    source,
    verified: input.verified ?? source !== "patient_uploaded",
    createdAt: nowIso(),
  };
  store.decisions.push(row);
  await ensureCaseHash(caseId);
  await setStatus(caseId, input.status === "denied" ? "hospital_denied" : "residual_verified");
  await writeAudit({
    caseId,
    actorType: "staff",
    eventType: "HOSPITAL_DECISION_RECORDED",
    metadata: { source },
  });
  return row;
}

export async function ensureCaseHash(caseId: string): Promise<{ caseHash: string; salt: string }> {
  const row = await getCase(caseId);
  if (row.caseHash && row.caseHashSalt) {
    return { caseHash: row.caseHash, salt: row.caseHashSalt };
  }
  const generated = generateCaseHashMaterial(caseId);
  row.caseHash = generated.caseHash;
  row.caseHashSalt = generated.salt;
  await saveStore();
  return generated;
}

export function duplicateRiskForCase(
  store: Awaited<ReturnType<typeof getStore>>,
  caseId: string,
): "low" | "manual_review" {
  const current = store.cases.find((row) => row.id === caseId);
  if (!current) return "manual_review";
  const otherExecuted = store.reliefRequests.some((request) => {
    if (request.caseId === caseId) return false;
    if (request.status !== "executed") return false;
    const otherCase = store.cases.find((row) => row.id === request.caseId);
    return Boolean(current.userId && otherCase?.userId && otherCase.userId === current.userId);
  });
  if (otherExecuted) return "manual_review";
  if (current.caseHash) {
    const paid = store.grants.some(
      (grant) => grant.caseHash === current.caseHash && (grant.status === "confirmed" || grant.status === "submitted"),
    );
    if (paid) return "manual_review";
  }
  return "low";
}

export async function createReliefRequest(
  caseId: string,
  programId: string,
  requestedAmount?: number,
): Promise<StoredReliefRequest> {
  const bundle = await getFullCase(caseId);
  if (!bundle.decision) {
    throw new ApiError("DECISION_REQUIRED", "A hospital decision is required before requesting Althea Relief.");
  }
  if (bundle.decision.remainingBalance <= 0) {
    throw new ApiError("NO_RESIDUAL", "No remaining balance is recorded.");
  }
  const program = (await getStore()).program;
  if (program.id !== programId) {
    throw new ApiError("PROGRAM_NOT_FOUND", "Relief program not found.", 404);
  }
  if (program.status !== "active") {
    throw new ApiError("PROGRAM_INACTIVE", "This Relief program is not active.");
  }
  if (requestedAmount && requestedAmount > bundle.decision.remainingBalance) {
    throw new ApiError("AMOUNT_EXCEEDS_RESIDUAL", "Requested amount cannot exceed the remaining balance.");
  }
  const amount = Math.min(
    requestedAmount ?? program.maxGrant,
    bundle.decision.remainingBalance,
    program.maxGrant,
  );
  if (amount <= 0) {
    throw new ApiError("AMOUNT_EXCEEDS_RESIDUAL", "Requested amount cannot exceed the remaining balance.");
  }
  const store = await getStore();
  const created = nowIso();
  const row: StoredReliefRequest = {
    id: id("relief"),
    caseId,
    programId,
    requestedAmount: amount,
    residualBalance: bundle.decision.remainingBalance,
    status: "awaiting_world",
    createdAt: created,
    updatedAt: created,
  };
  store.reliefRequests.push(row);
  await setStatus(caseId, "relief_requested");
  await writeAudit({ caseId, actorType: "patient", eventType: "RELIEF_REQUEST_CREATED" });
  return row;
}

export async function getReliefRequest(reliefRequestId: string): Promise<StoredReliefRequest> {
  const row = (await getStore()).reliefRequests.find((item) => item.id === reliefRequestId);
  if (!row) throw new ApiError("RELIEF_NOT_FOUND", "Relief request not found.", 404);
  return row;
}

export async function recordWorldVerification(input: {
  caseId: string;
  status: StoredWorld["status"];
  verificationReference?: string;
}): Promise<StoredWorld> {
  const store = await getStore();
  await getCase(input.caseId);
  const row: StoredWorld = {
    id: id("world"),
    caseId: input.caseId,
    status: input.status,
    verificationReference: input.verificationReference,
    verifiedAt: input.status === "passed" || input.status === "manual_review" ? nowIso() : undefined,
    createdAt: nowIso(),
  };
  store.world.push(row);
  if (input.status === "passed" || input.status === "manual_review") {
    await setStatus(input.caseId, "world_check_complete");
    const relief = [...store.reliefRequests].reverse().find((item) => item.caseId === input.caseId);
    if (relief && relief.status === "awaiting_world") {
      relief.status = "evaluating";
      relief.updatedAt = nowIso();
    }
  }
  await writeAudit({
    caseId: input.caseId,
    actorType: "patient",
    eventType: input.status === "passed" ? "WORLD_CHECK_PASSED" : "WORLD_CHECK_STARTED",
    metadata: { status: input.status },
  });
  await saveStore();
  return row;
}

export async function storeNullifier(nullifier: string, action: string): Promise<boolean> {
  const store = await getStore();
  const exists = store.nullifiers.some((row) => row.nullifier === nullifier && row.action === action);
  if (exists) return false;
  store.nullifiers.push({ nullifier, action });
  await saveStore();
  return true;
}

export async function saveReliefDecision(row: StoredReliefDecision) {
  (await getStore()).reliefDecisions.push(row);
  await saveStore();
}

export async function saveGrant(row: StoredGrant) {
  (await getStore()).grants.push(row);
  await saveStore();
}

export async function saveTreasuryTransaction(row: StoredTreasuryTx) {
  (await getStore()).treasury.push(row);
  await saveStore();
}

export async function listTreasuryActivity() {
  const store = await getStore();
  return mergeTreasuryActivity(store.treasury, store.grants).map((row) => ({
    ...row,
    explorer: explorerTx(row.transactionHash),
  }));
}

export async function publicReliefStats() {
  const store = await getStore();
  const program = store.program;
  const confirmed = store.grants.filter((row) => row.status === "confirmed" || row.status === "submitted");
  const liveDelivered = confirmed.reduce((sum, row) => sum + row.amount, 0);
  const liveCount = confirmed.length;
  const onchain = await readPoolBalance();
  const averageGrant = liveCount > 0 ? Math.round(liveDelivered / liveCount) : 0;
  return {
    totalContributed: program.demoAvailableCapital,
    totalReliefDelivered: program.demoReliefDelivered,
    grantsCompleted: program.demoGrantsCompleted,
    averageGrant: liveCount > 0 ? averageGrant : 266,
    platformGrantFeePercent: 0,
    patientMedicalRecordsOnchain: 0,
    demoLabeled: true,
    asOf: nowIso(),
    network: "Arc",
    asset: "USDC",
    poolAddress: RELIEF_POOL_ADDRESS || null,
    program: {
      name: program.name,
      status: program.status,
      maxGrant: program.maxGrant,
      currency: program.currency,
    },
    demoFinancialModel: {
      availableCapital: program.demoAvailableCapital,
      reliefDelivered: program.demoReliefDelivered,
      grantsCompleted: program.demoGrantsCompleted,
      averageGrant: 266,
    },
    testnet: {
      reliefPoolUsdc: onchain,
      reliefDelivered: liveDelivered,
      grantsCompleted: liveCount,
      averageGrant,
    },
  };
}

export async function listPublicGrants() {
  const store = await getStore();
  return {
    grants: toPublicGrantList(store.grants, store.program.name).map((row) => ({
      ...row,
      explorer: explorerTx(row.transactionHash),
    })),
  };
}

export async function publicGrant(grantId: string) {
  const program = (await getStore()).program;
  if (grantId === "demo" && isDemoMode()) {
    const demo = getDemoFixture();
    return {
      program: program.name,
      amount: demo.reliefGrant,
      status: "demonstration",
      network: "Arc",
      providerLabel: "Example Medical Center Demo Settlement Account",
      demoLabeled: true,
    };
  }
  const grant = (await getStore()).grants.find((row) => row.id === grantId);
  if (!grant) throw new ApiError("GRANT_NOT_FOUND", "Grant not found.", 404);
  return {
    program: program.name,
    amount: grant.amount,
    status: grant.status,
    transactionHash: grant.arcTransactionHash,
    timestamp: grant.confirmedAt ?? grant.submittedAt,
    network: "Arc",
    providerLabel: "Example Medical Center Demo Settlement Account",
  };
}
