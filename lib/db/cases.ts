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
  StoredWorld,
  writeAudit,
} from "@/lib/db/store";
import { calculateFapEstimate } from "@/lib/fap/calculate";
import { FapPolicy } from "@/lib/fap/schema";
import { calculateFapTimeline } from "@/lib/fap/timeline";
import { DEMO_HOSPITAL_ID, demoReferenceDate } from "@/lib/config";
import { generateCaseHashMaterial } from "@/lib/relief/case-hash";

export function listHospitals(search?: string, state?: string) {
  const { hospitals } = getStore();
  return hospitals.filter((hospital) => {
    const matchesSearch = search
      ? hospital.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesState = state ? hospital.state === state : true;
    return matchesSearch && matchesState;
  });
}

export function getHospital(hospitalId: string) {
  const hospital = getStore().hospitals.find((row) => row.id === hospitalId);
  if (!hospital) throw new ApiError("HOSPITAL_NOT_FOUND", "Hospital not found.", 404);
  return hospital;
}

export function getHospitalFap(hospitalId: string) {
  const hospital = getHospital(hospitalId);
  const policy = getStore().policies.find((row) => row.id === hospital.activePolicyVersionId);
  if (!policy) throw new ApiError("POLICY_NOT_FOUND", "Policy not found.", 404);
  const structured = policy.structuredPolicy;
  return {
    hospitalId,
    policyVersion: policy.versionLabel,
    insuredPatientsEligible: structured.policyScope.insuredPatientsEligible,
    freeCareRules: structured.freeCareRules,
    discountedCareRules: structured.discountedCareRules,
    requiredDocuments: structured.requiredDocuments,
    applicationUrl: structured.applicationUrl,
    citations: structured.citations,
    demonstrationPolicy: true,
  };
}

export function getPolicy(hospitalId: string): { id: string; structuredPolicy: FapPolicy } {
  const hospital = getHospital(hospitalId);
  const policy = getStore().policies.find((row) => row.id === hospital.activePolicyVersionId);
  if (!policy) throw new ApiError("POLICY_NOT_FOUND", "Policy not found.", 404);
  return policy;
}

export function createCase(input: {
  hospitalId: string;
  billAmount: number;
  householdSize: number;
  householdAnnualIncome: number;
  insuranceStatus: "insured" | "uninsured";
  firstPostDischargeBillDate?: string;
  userId?: string;
}): StoredCase {
  getHospital(input.hospitalId);
  const store = getStore();
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
  });
  writeAudit({
    caseId: row.id,
    actorType: "patient",
    actorId: input.userId,
    eventType: "CASE_CREATED",
    metadata: { hospitalId: input.hospitalId },
  });
  saveStore();
  return row;
}

export function ensureDemoCase(): StoredCase {
  const store = getStore();
  const existing = store.cases.find((item) => item.id === "demo");
  if (existing) return existing;
  const created = nowIso();
  const row: StoredCase = {
    id: "demo",
    userId: "demo_patient",
    hospitalId: DEMO_HOSPITAL_ID,
    status: "draft",
    createdAt: created,
    updatedAt: created,
  };
  store.cases.push(row);
  store.financialInputs.push({
    caseId: "demo",
    billAmount: 18420,
    householdSize: 3,
    householdAnnualIncome: 51000,
    insuranceStatus: "insured",
    firstPostDischargeBillDate: "2026-08-20",
  });
  saveStore();
  calculateCaseEstimate("demo");
  writeAudit({ caseId: "demo", actorType: "system", eventType: "CASE_CREATED", metadata: { demo: true } });
  return getCase("demo");
}

export function getCase(caseId: string): StoredCase {
  if (caseId === "demo") {
    const existing = getStore().cases.find((item) => item.id === "demo");
    if (!existing) return ensureDemoCase();
    return existing;
  }
  const row = getStore().cases.find((item) => item.id === caseId);
  if (!row) throw new ApiError("CASE_NOT_FOUND", "Case not found.", 404);
  return row;
}

export function updateCaseInputs(
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
  const input = getStore().financialInputs.find((row) => row.caseId === caseId);
  if (!input) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  Object.assign(input, patch);
  saveStore();
  return input;
}

export function getCaseBundle(caseId: string) {
  const store = getStore();
  const caseRow = getCase(caseId);
  return {
    case: caseRow,
    hospital: getHospital(caseRow.hospitalId),
    policy: getPolicy(caseRow.hospitalId),
    financialInput: store.financialInputs.find((row) => row.caseId === caseId),
    estimate: [...store.estimates].reverse().find((row) => row.caseId === caseId),
    packet: [...store.packets].reverse().find((row) => row.caseId === caseId),
    decision: [...store.decisions].reverse().find((row) => row.caseId === caseId),
    world: [...store.world].reverse().find((row) => row.caseId === caseId),
    reliefRequest: [...store.reliefRequests].reverse().find((row) => row.caseId === caseId),
    reliefDecision: undefined as StoredReliefDecision | undefined,
    grant: undefined as StoredGrant | undefined,
  };
}

export function getFullCase(caseId: string) {
  const bundle = getCaseBundle(caseId);
  const store = getStore();
  const reliefDecision = bundle.reliefRequest
    ? [...store.reliefDecisions].reverse().find((row) => row.reliefRequestId === bundle.reliefRequest?.id)
    : undefined;
  const grant = bundle.reliefRequest
    ? [...store.grants].reverse().find((row) => row.reliefRequestId === bundle.reliefRequest?.id)
    : undefined;
  return { ...bundle, reliefDecision, grant };
}

function setStatus(caseId: string, status: CaseStatus) {
  const row = getCase(caseId);
  row.status = status;
  row.updatedAt = nowIso();
  saveStore();
}

export function calculateCaseEstimate(caseId: string): StoredEstimate {
  const bundle = getCaseBundle(caseId);
  if (!bundle.financialInput) {
    throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  }
  const estimate = calculateFapEstimate(bundle.financialInput, bundle.policy.structuredPolicy);
  const store = getStore();
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
  setStatus(caseId, "fap_analyzed");
  writeAudit({
    caseId,
    actorType: "system",
    eventType: "ESTIMATE_CALCULATED",
    metadata: { outcome: estimate.outcome },
  });
  return row;
}

export function getCaseTimeline(caseId: string) {
  const input = getStore().financialInputs.find((row) => row.caseId === caseId);
  if (!input) throw new ApiError("CASE_NOT_FOUND", "Case not found.", 404);
  return calculateFapTimeline({
    firstPostDischargeBillingDate: input.firstPostDischargeBillDate,
    referenceDate: demoReferenceDate(),
  });
}

export function prepareApplication(caseId: string): StoredPacket {
  const bundle = getCaseBundle(caseId);
  if (!bundle.financialInput) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  const policy = bundle.policy.structuredPolicy;
  const store = getStore();
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
    },
    generatedAt: nowIso(),
  };
  store.packets.push(row);
  setStatus(caseId, "application_prepared");
  writeAudit({ caseId, actorType: "patient", eventType: "APPLICATION_PREPARED" });
  return row;
}

export function markSubmitted(caseId: string, submittedAt?: string) {
  const packet = prepareIfNeeded(caseId);
  packet.status = "submitted";
  packet.submittedAt = submittedAt ?? nowIso();
  setStatus(caseId, "application_submitted");
  writeAudit({ caseId, actorType: "patient", eventType: "APPLICATION_MARKED_SUBMITTED" });
  saveStore();
  return packet;
}

function prepareIfNeeded(caseId: string): StoredPacket {
  const existing = getCaseBundle(caseId).packet;
  if (existing) return existing;
  return prepareApplication(caseId);
}

export function recordHospitalDecision(
  caseId: string,
  input: { status: "approved" | "partially_approved" | "denied"; approvedAssistance: number; remainingBalance: number },
): StoredDecision {
  const bundle = getCaseBundle(caseId);
  if (!bundle.financialInput) throw new ApiError("INPUT_MISSING", "Financial inputs are missing.");
  const store = getStore();
  const row: StoredDecision = {
    id: id("decision"),
    caseId,
    status: input.status,
    originalBalance: bundle.financialInput.billAmount,
    approvedAssistance: input.approvedAssistance,
    remainingBalance: input.remainingBalance,
    source: "simulated_demo",
    verified: true,
    createdAt: nowIso(),
  };
  store.decisions.push(row);
  ensureCaseHash(caseId);
  setStatus(caseId, input.status === "denied" ? "hospital_denied" : "residual_verified");
  writeAudit({
    caseId,
    actorType: "staff",
    eventType: "HOSPITAL_DECISION_RECORDED",
    metadata: { source: "simulated_demo" },
  });
  return row;
}

export function ensureCaseHash(caseId: string): { caseHash: string; salt: string } {
  const row = getCase(caseId);
  if (row.caseHash && row.caseHashSalt) {
    return { caseHash: row.caseHash, salt: row.caseHashSalt };
  }
  const generated = generateCaseHashMaterial(caseId);
  row.caseHash = generated.caseHash;
  row.caseHashSalt = generated.salt;
  saveStore();
  return generated;
}

export function createReliefRequest(caseId: string, programId: string, requestedAmount: number): StoredReliefRequest {
  const bundle = getFullCase(caseId);
  if (!bundle.decision) {
    throw new ApiError("DECISION_REQUIRED", "A hospital decision is required before requesting Althea Relief.");
  }
  if (bundle.decision.remainingBalance <= 0) {
    throw new ApiError("NO_RESIDUAL", "No remaining balance is recorded.");
  }
  const program = getStore().program;
  if (program.id !== programId) {
    throw new ApiError("PROGRAM_NOT_FOUND", "Relief program not found.", 404);
  }
  if (requestedAmount > bundle.decision.remainingBalance) {
    throw new ApiError("AMOUNT_EXCEEDS_RESIDUAL", "Requested amount cannot exceed the remaining balance.");
  }
  const store = getStore();
  const created = nowIso();
  const row: StoredReliefRequest = {
    id: id("relief"),
    caseId,
    programId,
    requestedAmount,
    residualBalance: bundle.decision.remainingBalance,
    status: "awaiting_world",
    createdAt: created,
    updatedAt: created,
  };
  store.reliefRequests.push(row);
  setStatus(caseId, "relief_requested");
  writeAudit({ caseId, actorType: "patient", eventType: "RELIEF_REQUEST_CREATED" });
  return row;
}

export function getReliefRequest(reliefRequestId: string): StoredReliefRequest {
  const row = getStore().reliefRequests.find((item) => item.id === reliefRequestId);
  if (!row) throw new ApiError("RELIEF_NOT_FOUND", "Relief request not found.", 404);
  return row;
}

export function recordWorldVerification(input: {
  caseId: string;
  status: StoredWorld["status"];
  verificationReference?: string;
}): StoredWorld {
  const store = getStore();
  getCase(input.caseId);
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
    setStatus(input.caseId, "world_check_complete");
    const relief = [...store.reliefRequests].reverse().find((item) => item.caseId === input.caseId);
    if (relief && relief.status === "awaiting_world") {
      relief.status = "evaluating";
      relief.updatedAt = nowIso();
    }
  }
  writeAudit({
    caseId: input.caseId,
    actorType: "patient",
    eventType: input.status === "passed" ? "WORLD_CHECK_PASSED" : "WORLD_CHECK_STARTED",
    metadata: { status: input.status },
  });
  saveStore();
  return row;
}

export function storeNullifier(nullifier: string, action: string): boolean {
  const store = getStore();
  const exists = store.nullifiers.some((row) => row.nullifier === nullifier && row.action === action);
  if (exists) return false;
  store.nullifiers.push({ nullifier, action });
  saveStore();
  return true;
}

export function saveReliefDecision(row: StoredReliefDecision) {
  getStore().reliefDecisions.push(row);
  saveStore();
}

export function saveGrant(row: StoredGrant) {
  getStore().grants.push(row);
  saveStore();
}

export function publicReliefStats() {
  const program = getStore().program;
  const confirmed = getStore().grants.filter((row) => row.status === "confirmed");
  const liveDelivered = confirmed.reduce((sum, row) => sum + row.amount, 0);
  const liveCount = confirmed.length;
  return {
    totalContributed: program.demoAvailableCapital,
    totalReliefDelivered: program.demoReliefDelivered,
    grantsCompleted: program.demoGrantsCompleted,
    averageGrant: 266,
    platformGrantFeePercent: 0,
    patientMedicalRecordsOnchain: 0,
    demoLabeled: true,
    testnet: {
      reliefDelivered: liveDelivered,
      grantsCompleted: liveCount,
    },
  };
}

export function publicGrant(grantId: string) {
  if (grantId === "demo") {
    return {
      program: getStore().program.name,
      amount: 500,
      status: "demonstration",
      network: "Arc",
      providerLabel: "Example Medical Center Demo Settlement Account",
      demoLabeled: true,
    };
  }
  const grant = getStore().grants.find((row) => row.id === grantId);
  if (!grant) throw new ApiError("GRANT_NOT_FOUND", "Grant not found.", 404);
  return {
    program: getStore().program.name,
    amount: grant.amount,
    status: grant.status,
    transactionHash: grant.arcTransactionHash,
    timestamp: grant.confirmedAt ?? grant.submittedAt,
    network: "Arc",
    providerLabel: "Example Medical Center Demo Settlement Account",
  };
}
