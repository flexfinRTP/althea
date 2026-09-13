import { generateText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { ApiError } from "@/lib/errors";
import {
  duplicateRiskForCase,
  ensureCaseHash,
  getFullCase,
  getReliefRequest,
  saveGrant,
  saveReliefDecision,
} from "@/lib/db/cases";
import { getStore, id, nowIso, saveStore, writeAudit } from "@/lib/db/store";
import { evaluateReliefRules, RELIEF_RULES_VERSION } from "@/lib/relief/rules";
import { decisionHash, programIdBytes32 } from "@/lib/relief/case-hash";
import { circleConfigured, circleWalletExecute } from "@/lib/circle/cli";
import { readPoolBalance } from "@/lib/arc/balances";
import { DEMO_PROVIDER_SETTLEMENT_ADDRESS, RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { usdcToAtomic } from "@/lib/money";
import { isDemoMode } from "@/lib/config";

export type AgentTraceStep = {
  id: string;
  label: string;
  detail?: string;
  status: "pending" | "complete" | "blocked";
};

export async function getCaseReliefFacts(caseId: string) {
  const bundle = await getFullCase(caseId);
  const store = await getStore();
  return {
    fapCompleted: Boolean(
      bundle.packet?.status === "submitted" ||
        bundle.decision ||
        [
          "application_submitted",
          "hospital_review",
          "hospital_approved",
          "residual_verified",
          "relief_requested",
          "world_check_complete",
          "relief_evaluated",
          "relief_review",
          "relief_approved",
          "grant_executed",
        ].includes(bundle.case.status),
    ),
    residualBalanceVerified: Boolean(bundle.decision && bundle.decision.remainingBalance > 0),
    residualBalance: bundle.decision?.remainingBalance ?? 0,
    worldStatus: bundle.world?.status ?? "not_started",
    duplicateRisk: duplicateRiskForCase(store, caseId),
    requestedAmount: bundle.reliefRequest?.requestedAmount ?? 0,
    hospitalDecisionSource: bundle.decision?.source,
  };
}

export async function getProgramRules() {
  const program = (await getStore()).program;
  return {
    programId: program.id,
    name: program.name,
    maxGrant: program.maxGrant,
    autoApprovalCap: program.autoApprovalCap,
    humanApprovalThreshold: program.humanApprovalThreshold,
    minGrant: program.minGrant,
  };
}

export async function getPoolBalance() {
  const program = (await getStore()).program;
  const onchain = await readPoolBalance();
  const availableUsdc = onchain ?? (isDemoMode() ? program.demoAvailableCapital : 0);
  return {
    availableUsdc,
    onchain,
    demoFinancialModel: program.demoAvailableCapital,
  };
}

export async function evaluateReliefRequest(reliefRequestId: string, humanApproval = false) {
  const request = await getReliefRequest(reliefRequestId);
  const facts = await getCaseReliefFacts(request.caseId);
  const program = await getProgramRules();
  const pool = await getPoolBalance();
  const result = evaluateReliefRules({
    fapCompleted: facts.fapCompleted,
    residualBalanceVerified: facts.residualBalanceVerified,
    residualBalance: facts.residualBalance,
    worldStatus: facts.worldStatus as "passed" | "failed" | "not_started" | "pending" | "manual_review",
    duplicateRisk: facts.duplicateRisk,
    requestedAmount: request.requestedAmount,
    maxGrant: program.maxGrant,
    autoApprovalCap: program.autoApprovalCap,
    fundBalance: pool.availableUsdc,
    humanApproval,
  });
  const row = {
    id: id("rdec"),
    reliefRequestId,
    decision: result.decision,
    calculatedGrantAmount: result.grantAmount,
    reasonCodes: result.reasonCodes,
    rulesVersion: RELIEF_RULES_VERSION,
    approvedBy: humanApproval ? "relief_reviewer" : undefined,
    createdAt: nowIso(),
  };
  await saveReliefDecision(row);
  request.status =
    result.decision === "denied"
      ? "denied"
      : result.decision === "human_review_required"
        ? "review_required"
        : "approved";
  request.updatedAt = nowIso();
  const store = await getStore();
  const caseRow = store.cases.find((item) => item.id === request.caseId);
  if (caseRow) {
    caseRow.status =
      result.decision === "denied"
        ? "relief_denied"
        : result.decision === "human_review_required"
          ? "relief_review"
          : "relief_evaluated";
    caseRow.updatedAt = nowIso();
  }
  await writeAudit({
    caseId: request.caseId,
    actorType: "agent",
    eventType: "RELIEF_RULES_EVALUATED",
    metadata: { decision: result.decision, reasonCodes: result.reasonCodes },
  });
  await saveStore();
  return { ...result, rulesVersion: RELIEF_RULES_VERSION };
}

function providerConfigured(): boolean {
  return Boolean(
    DEMO_PROVIDER_SETTLEMENT_ADDRESS &&
      DEMO_PROVIDER_SETTLEMENT_ADDRESS !== "0x0000000000000000000000000000000000000000",
  );
}

export async function executeApprovedGrant(reliefRequestId: string, idempotencyKey?: string) {
  const request = await getReliefRequest(reliefRequestId);
  const store = await getStore();
  if (request.status === "executed") {
    return [...store.grants].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  }
  if (request.status === "executing") {
    throw new ApiError("IN_FLIGHT", "Settlement submitted. Waiting for confirmation.", 409);
  }
  const latest = [...store.reliefDecisions].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (!latest || (latest.decision !== "approved" && latest.decision !== "auto_approved")) {
    throw new ApiError("NOT_APPROVED", "This grant is not approved.");
  }
  if (idempotencyKey && request.executionKey === idempotencyKey) {
    return [...store.grants].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  }
  if (!circleConfigured() || !RELIEF_POOL_ADDRESS || !providerConfigured()) {
    throw new ApiError(
      "AGENT_BLOCKED",
      "Relief review could not be completed automatically. This case requires manual review.",
      503,
    );
  }
  request.status = "executing";
  request.executionKey = idempotencyKey ?? request.id;
  request.updatedAt = nowIso();
  await saveStore();

  const hashMaterial = await ensureCaseHash(request.caseId);
  const dHash = decisionHash({
    reliefRequestId: request.id,
    grantAmount: latest.calculatedGrantAmount,
    rulesVersion: latest.rulesVersion,
    approvedBy: latest.approvedBy,
  });
  const amount = usdcToAtomic(latest.calculatedGrantAmount).toString();
  const executed = await circleWalletExecute({
    signature: "releaseGrant(bytes32,bytes32,address,uint256,bytes32)",
    params: [
      hashMaterial.caseHash,
      programIdBytes32(request.programId),
      DEMO_PROVIDER_SETTLEMENT_ADDRESS,
      amount,
      dHash,
    ],
    contract: RELIEF_POOL_ADDRESS,
    wallet: process.env.CIRCLE_AGENT_WALLET_ADDRESS as string,
  });
  const grant = {
    id: id("grant"),
    reliefRequestId,
    caseHash: hashMaterial.caseHash,
    programId: request.programId,
    amount: latest.calculatedGrantAmount,
    currency: "USDC" as const,
    providerSettlementAddress: DEMO_PROVIDER_SETTLEMENT_ADDRESS,
    decisionHash: dHash,
    status: executed.ok ? ("submitted" as const) : ("failed" as const),
    arcTransactionHash: executed.txHash,
    submittedAt: nowIso(),
    confirmedAt: executed.ok ? nowIso() : undefined,
  };
  if (executed.ok) {
    grant.status = executed.txHash ? "confirmed" : "submitted";
    request.status = "executed";
    const caseRow = (await getStore()).cases.find((item) => item.id === request.caseId);
    if (caseRow) {
      caseRow.status = "grant_executed";
      caseRow.updatedAt = nowIso();
    }
    await writeAudit({
      caseId: request.caseId,
      actorType: "agent",
      eventType: "ARC_TRANSACTION_CONFIRMED",
      metadata: { transactionHash: executed.txHash },
    });
  } else {
    request.status = "approved";
    await writeAudit({
      caseId: request.caseId,
      actorType: "agent",
      eventType: "ARC_TRANSACTION_SUBMITTED",
      metadata: { error: executed.error },
    });
    await saveGrant(grant);
    await saveStore();
    throw new ApiError("ARC_PENDING", "Settlement submitted. Waiting for confirmation.", 502);
  }
  await saveGrant(grant);
  await saveStore();
  return grant;
}

export function agentTools(reliefRequestId: string) {
  return {
    getCaseReliefFacts: tool({
      description: "Read structured Relief facts for a case. No diagnosis or documents.",
      inputSchema: z.object({ caseId: z.string() }),
      execute: async ({ caseId }) => getCaseReliefFacts(caseId),
    }),
    getProgramRules: tool({
      description: "Read Althea Relief program caps and thresholds.",
      inputSchema: z.object({}),
      execute: async () => getProgramRules(),
    }),
    getPoolBalance: tool({
      description: "Read available ReliefPool USDC.",
      inputSchema: z.object({}),
      execute: async () => getPoolBalance(),
    }),
    evaluateReliefRequest: tool({
      description: "Run the deterministic Relief rules engine. Does not move money.",
      inputSchema: z.object({ humanApproval: z.boolean().optional() }),
      execute: async ({ humanApproval }) => evaluateReliefRequest(reliefRequestId, Boolean(humanApproval)),
    }),
    executeApprovedGrant: tool({
      description: "Execute an already authorized grant through Circle Agent Stack on Arc.",
      inputSchema: z.object({ idempotencyKey: z.string().optional() }),
      execute: async ({ idempotencyKey }) => executeApprovedGrant(reliefRequestId, idempotencyKey),
    }),
    getTransactionStatus: tool({
      description: "Return the latest grant transaction for this Relief request.",
      inputSchema: z.object({}),
      execute: async () => {
        const grant = [...(await getStore()).grants]
          .reverse()
          .find((row) => row.reliefRequestId === reliefRequestId);
        return grant ?? { status: "none" };
      },
    }),
  };
}

export async function runReliefAgent(reliefRequestId: string) {
  const request = await getReliefRequest(reliefRequestId);
  const facts = await getCaseReliefFacts(request.caseId);
  const program = await getProgramRules();
  const pool = await getPoolBalance();
  const evaluation = await evaluateReliefRequest(reliefRequestId);
  const steps: AgentTraceStep[] = [
    {
      id: "fap",
      label: "Checking hospital assistance...",
      detail: facts.fapCompleted ? "Processed" : "Not processed",
      status: facts.fapCompleted ? "complete" : "blocked",
    },
    {
      id: "balance",
      label: "Checking verified balance...",
      detail: facts.residualBalanceVerified ? `$${facts.residualBalance.toLocaleString("en-US")}` : "Not verified",
      status: facts.residualBalanceVerified ? "complete" : "blocked",
    },
    {
      id: "cap",
      label: "Checking Althea Relief limit...",
      detail: `Maximum $${program.maxGrant}`,
      status: "complete",
    },
    {
      id: "world",
      label: "Checking human/liveness risk signal...",
      detail:
        facts.worldStatus === "passed"
          ? "Passed"
          : facts.worldStatus === "manual_review"
            ? "Manual review"
            : "Missing",
      status:
        facts.worldStatus === "passed" || facts.worldStatus === "manual_review" ? "complete" : "blocked",
    },
    {
      id: "duplicate",
      label: "Checking duplicate risk...",
      detail: facts.duplicateRisk === "low" ? "Low" : "Manual review",
      status: facts.duplicateRisk === "low" ? "complete" : "blocked",
    },
    {
      id: "funds",
      label: "Checking available funds...",
      detail: pool.availableUsdc >= request.requestedAmount ? "Available" : "Insufficient",
      status: pool.availableUsdc >= request.requestedAmount ? "complete" : "blocked",
    },
    {
      id: "approval",
      label: "Approval level...",
      detail:
        evaluation.decision === "human_review_required"
          ? "Human reviewer required"
          : evaluation.decision === "auto_approved"
            ? "Automatic"
            : evaluation.decision,
      status: evaluation.decision === "denied" ? "blocked" : "complete",
    },
  ];

  const key = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  let explanation =
    "Deterministic Relief rules evaluated structured case facts. The language model does not set grant eligibility.";
  if (key) {
    try {
      const openai = createOpenAI({ apiKey: key });
      const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: agentTools(reliefRequestId),
        prompt: `Explain the Althea Relief evaluation for request ${reliefRequestId} using only the tools. Do not approve money yourself. Decision=${evaluation.decision}.`,
      });
      explanation = result.text;
    } catch (error) {
      console.error(error);
    }
  }

  return { steps, evaluation, explanation, facts, program, pool };
}
