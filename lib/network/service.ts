import { getStore, id, nowIso, saveStore, writeAudit } from "@/lib/db/store";
import { ensureCaseHash, getReliefRequest, saveGrant, saveTreasuryTransaction } from "@/lib/db/cases";
import { assembleReliefRoute } from "@/lib/network/waterfall";
import { programAccounting } from "@/lib/network/accounting";
import {
  allocationsFromRoute,
  applyRefund,
  applyReserve,
  applySettle,
  assertEscrowTransition,
  ESCROW_TTL_SECONDS,
  escrowExpired,
} from "@/lib/network/escrow";
import { applyCampaignSpend, campaignMatchAmount } from "@/lib/network/match";
import { eligiblePoolsWithBalance, getReliefNetworkIndex } from "@/lib/graph/relief-index";
import { decisionHash, programIdBytes32 } from "@/lib/relief/case-hash";
import { DEMO_PROVIDER_SETTLEMENT_ADDRESS, RELIEF_POOL_ADDRESS } from "@/lib/arc/chain";
import { RELIEF_NETWORK_ADDRESS } from "@/lib/arc/network";
import { circleConfigured, circleWalletExecute } from "@/lib/circle/cli";
import {
  agentReserveMatch,
  agentReserveGrant,
  agentSettle,
  agentRefund,
  agentReceiveMessage,
  agentWalletConfigured,
} from "@/lib/privy/agent-wallet";
import { sendProgramFund, policyBlockedByLimit, ensureFunderPolicy, ensureFunderWallet } from "@/lib/privy/policies";
import { privyConfigured } from "@/lib/privy/treasury";
import { usdcToAtomic } from "@/lib/money";
import { ApiError } from "@/lib/errors";
import { isDemoMode } from "@/lib/config";
import { donationBurnCall, fetchCctpAttestation, sourceDomain, MESSAGE_TRANSMITTER_V2 } from "@/lib/circle/cctp";
import { gatewayBalances, gatewayTransfer, gatewayTransferStatus } from "@/lib/circle/gateway";
import type {
  SourceChain,
  StoredDonation,
  StoredDonor,
  StoredFunder,
  StoredGrantEscrow,
  StoredMatchCampaign,
  StoredNetworkProgram,
} from "@/lib/network/types";
import { NETWORK_GENERAL_PROGRAM_ID } from "@/lib/network/ids";

function providerAddress(): `0x${string}` {
  if (DEMO_PROVIDER_SETTLEMENT_ADDRESS && DEMO_PROVIDER_SETTLEMENT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
    return DEMO_PROVIDER_SETTLEMENT_ADDRESS;
  }
  if (isDemoMode()) {
    return "0x0000000000000000000000000000000000000001";
  }
  throw new ApiError("PROVIDER_REQUIRED", "Provider settlement address is not configured.", 503);
}

export async function listFunders() {
  const store = await getStore();
  return store.funders.map((funder) => ({
    ...funder,
    programs: store.networkPrograms.filter((program) => program.funderId === funder.id).map((program) => programAccounting(program, funder)),
    committed: store.networkPrograms
      .filter((program) => program.funderId === funder.id)
      .reduce((sum, program) => sum + program.reservedAmount + program.spentAmount, 0),
    grantsMatched: store.allocations.filter((row) => {
      const program = store.networkPrograms.find((item) => item.id === row.programId);
      return program?.funderId === funder.id && row.role === "match";
    }).length,
  }));
}

export async function getFunder(funderId: string) {
  const store = await getStore();
  const funder = store.funders.find((row) => row.id === funderId);
  if (!funder) throw new ApiError("FUNDER_NOT_FOUND", "Funder not found.", 404);
  const programs = store.networkPrograms.filter((program) => program.funderId === funderId);
  return {
    ...funder,
    programs: programs.map((program) => programAccounting(program, funder)),
    campaigns: store.campaigns.filter((campaign) => programs.some((program) => program.id === campaign.programId)),
    policy: {
      arcOnly: true,
      usdcOnly: true,
      contractOnly: Boolean(RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS),
      maxMatch: funder.perMatchLimitUsdc,
      dailyLimit: funder.dailyLimitUsdc,
      destination: RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS,
    },
  };
}

export async function listNetworkPrograms() {
  const store = await getStore();
  const index = await getReliefNetworkIndex();
  return store.networkPrograms.map((program) => {
    const funder = store.funders.find((row) => row.id === program.funderId);
    const live = index.find((row) => row.programId === program.id);
    return {
      ...programAccounting(program, funder),
      liveAvailable: live?.availableUsdc,
      liveSource: live?.source,
    };
  });
}

export async function getProgramDetail(programId: string) {
  const store = await getStore();
  const program = store.networkPrograms.find((row) => row.id === programId);
  if (!program) throw new ApiError("PROGRAM_NOT_FOUND", "Program not found.", 404);
  const funder = store.funders.find((row) => row.id === program.funderId);
  return {
    program,
    accounting: programAccounting(program, funder),
    funder,
  };
}

export async function createFunderProgram(funderId: string, input: {
  name: string;
  kind?: StoredNetworkProgram["kind"];
  budget?: number;
  grantCap: number;
  matchRatioNum?: number;
  matchRatioDen?: number;
  maxMatchPerCase?: number;
  expiresAt?: string;
  eligibleSourceProgramId?: string;
}) {
  const store = await getStore();
  const funder = store.funders.find((row) => row.id === funderId);
  if (!funder) throw new ApiError("FUNDER_NOT_FOUND", "Funder not found.", 404);
  const created = nowIso();
  const program: StoredNetworkProgram = {
    id: id("prog"),
    funderId,
    name: input.name,
    kind: input.kind ?? (input.matchRatioNum ? "match" : "community"),
    status: "active",
    currency: "USDC",
    budget: input.budget ?? 0,
    spentAmount: 0,
    reservedAmount: 0,
    grantCap: input.grantCap,
    matchRatioNum: input.matchRatioNum ?? 0,
    matchRatioDen: input.matchRatioDen ?? 1,
    maxMatchPerCase: input.maxMatchPerCase ?? input.grantCap,
    expiresAt: input.expiresAt,
    ruleHash: "althea.network.rules.v1",
    eligibleSourceProgramId: input.eligibleSourceProgramId ?? NETWORK_GENERAL_PROGRAM_ID,
    allowedRecipientMode: "verified_settlement_only",
    requiresWorldCheck: true,
    requiresFapCompletion: true,
    requiresVerifiedResidual: true,
    createdAt: created,
    updatedAt: created,
  };
  store.networkPrograms.push(program);
  await writeAudit({
    actorType: "staff",
    eventType: "PROGRAM_CREATED",
    metadata: { programId: program.id, funderId },
  });
  await saveStore();
  return program;
}

export async function fundNetworkProgram(funderId: string, programId: string, amount: number) {
  const store = await getStore();
  const funder = store.funders.find((row) => row.id === funderId);
  const program = store.networkPrograms.find((row) => row.id === programId && row.funderId === funderId);
  if (!funder || !program) throw new ApiError("PROGRAM_NOT_FOUND", "Program not found.", 404);
  if (policyBlockedByLimit(amount, funder.perMatchLimitUsdc) && program.kind === "match") {
    throw new ApiError("POLICY_BLOCKED", `Blocked by foundation treasury policy. Maximum ${funder.perMatchLimitUsdc} USDC.`, 403);
  }
  let hash: string | undefined;
  if (funder.privyWalletId && RELIEF_NETWORK_ADDRESS) {
    const sent = await sendProgramFund({
      walletId: funder.privyWalletId,
      programId,
      amountUsd: amount,
    });
    hash = sent.hash;
  }
  program.budget += amount;
  program.updatedAt = nowIso();
  funder.treasuryUsdc = Math.max(0, funder.treasuryUsdc - amount);
  funder.updatedAt = nowIso();
  await saveTreasuryTransaction({
    id: id("tx"),
    type: "fund_program",
    amount,
    currency: "USDC",
    destinationAddress: RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS || "network",
    chain: "arc",
    transactionHash: hash,
    status: hash ? "confirmed" : "pending",
    initiatedBy: funderId,
    createdAt: nowIso(),
  });
  await saveStore();
  return { program: programAccounting(program, funder), transactionHash: hash };
}

export async function provisionFunderWallet(funderId: string) {
  const store = await getStore();
  const funder = store.funders.find((row) => row.id === funderId);
  if (!funder) throw new ApiError("FUNDER_NOT_FOUND", "Funder not found.", 404);
  const destination = RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS;
  const policy = await ensureFunderPolicy({
    name: `${funder.name} — Althea Relief Network`,
    destination,
    maxPerTxUsd: funder.perMatchLimitUsdc,
  });
  const wallet = policy.active
    ? await ensureFunderWallet({ externalId: funderId, policyId: policy.id })
    : {};
  funder.policyId = policy.id;
  funder.privyWalletId = wallet.id;
  funder.privyWalletAddress = wallet.address;
  funder.updatedAt = nowIso();
  await saveStore();
  return { funder, policy, wallet };
}

export async function assembleForRelief(reliefRequestId: string) {
  const request = await getReliefRequest(reliefRequestId);
  const store = await getStore();
  const live = await eligiblePoolsWithBalance(0);
  const programs = store.networkPrograms.map((program) => {
    const liveRow = live.find((row) => row.programId === program.id);
    if (!liveRow || liveRow.source === "store") return program;
    return { ...program, budget: liveRow.budgetUsdc, reservedAmount: liveRow.reservedUsdc, spentAmount: liveRow.spentUsdc };
  });
  return assembleReliefRoute({
    residualBalance: request.residualBalance,
    requestedAmount: request.requestedAmount,
    programs,
    funders: store.funders,
  });
}

async function executeNetworkCall(input: {
  kind: "reserve" | "settle" | "refund";
  caseHash: `0x${string}`;
  decisionHash?: `0x${string}`;
  expiresAt?: number;
  allocations?: Array<{ programId: string; amount: number; role: string }>;
}): Promise<string | undefined> {
  const allocations = input.allocations ?? [];
  const base = allocations.find((row) => row.role === "base");
  const match = allocations.find((row) => row.role === "match");
  const expiresAt = input.expiresAt ?? Math.floor(Date.now() / 1000) + ESCROW_TTL_SECONDS;
  const decision = input.decisionHash ?? programIdBytes32("decision");

  if (input.kind === "reserve" && allocations.length > 0 && (await agentWalletConfigured())) {
    if (base && match && allocations.length === 2) {
      return (
        await agentReserveMatch({
          caseHash: input.caseHash,
          provider: providerAddress(),
          expiresAt,
          decisionHash: decision,
          baseProgramId: base.programId,
          baseAmount: base.amount,
          matchProgramId: match.programId,
          matchAmount: match.amount,
        })
      ).hash;
    }
    return (
      await agentReserveGrant({
        caseHash: input.caseHash,
        provider: providerAddress(),
        expiresAt,
        decisionHash: decision,
        allocations,
      })
    ).hash;
  }
  if (input.kind === "settle" && (await agentWalletConfigured())) {
    return (await agentSettle(input.caseHash)).hash;
  }
  if (input.kind === "refund" && (await agentWalletConfigured())) {
    return (await agentRefund(input.caseHash)).hash;
  }
  if (!circleConfigured() || !RELIEF_NETWORK_ADDRESS) return undefined;
  if (input.kind === "reserve" && base && match) {
    const executed = await circleWalletExecute({
      signature: "reserveMatchGrant(bytes32,address,uint256,bytes32,bytes32,uint256,bytes32,uint256)",
      params: [
        input.caseHash,
        providerAddress(),
        String(expiresAt),
        decision,
        programIdBytes32(base.programId),
        usdcToAtomic(base.amount).toString(),
        programIdBytes32(match.programId),
        usdcToAtomic(match.amount).toString(),
      ],
      contract: RELIEF_NETWORK_ADDRESS,
      wallet: process.env.CIRCLE_AGENT_WALLET_ADDRESS as string,
    });
    if (!executed.ok) throw new ApiError("ARC_PENDING", executed.error || "Reserve submitted. Waiting for confirmation.", 502);
    return executed.txHash;
  }
  if (input.kind === "reserve") return undefined;
  const signature = input.kind === "settle" ? "settleGrant(bytes32)" : "refundExpiredGrant(bytes32)";
  const executed = await circleWalletExecute({
    signature,
    params: [input.caseHash],
    contract: RELIEF_NETWORK_ADDRESS,
    wallet: process.env.CIRCLE_AGENT_WALLET_ADDRESS as string,
  });
  if (!executed.ok) throw new ApiError("ARC_PENDING", executed.error || "Settlement submitted. Waiting for confirmation.", 502);
  return executed.txHash;
}

export async function reserveRelief(reliefRequestId: string) {
  const request = await getReliefRequest(reliefRequestId);
  const store = await getStore();
  const existing = [...store.escrows].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (existing?.status === "reserved" || existing?.status === "settled") return { escrow: existing, route: await assembleForRelief(reliefRequestId) };
  const latest = [...store.reliefDecisions].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (!latest || (latest.decision !== "approved" && latest.decision !== "auto_approved")) {
    throw new ApiError("NOT_APPROVED", "This grant is not approved.");
  }
  const route = await assembleForRelief(reliefRequestId);
  if (route.total <= 0) throw new ApiError("INSUFFICIENT_FUNDS", "No eligible relief pools have available USDC.");
  const hashMaterial = await ensureCaseHash(request.caseId);
  const dHash = decisionHash({
    reliefRequestId: request.id,
    grantAmount: route.total,
    rulesVersion: latest.rulesVersion,
    approvedBy: latest.approvedBy,
  });
  const expiresAt = new Date(Date.now() + ESCROW_TTL_SECONDS * 1000).toISOString();
  const escrow: StoredGrantEscrow = {
    id: id("escrow"),
    reliefRequestId,
    caseId: request.caseId,
    caseHash: hashMaterial.caseHash,
    provider: providerAddress(),
    totalAmount: route.total,
    expiresAt,
    decisionHash: dHash,
    status: "approved",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const allocations = allocationsFromRoute(escrow.id, route);
  const txHash = await executeNetworkCall({
    kind: "reserve",
    caseHash: hashMaterial.caseHash as `0x${string}`,
    decisionHash: dHash,
    expiresAt: Math.floor(Date.parse(expiresAt) / 1000),
    allocations: route.selected.map((row) => ({
      programId: row.programId,
      amount: row.amount,
      role: row.role,
    })),
  });
  assertEscrowTransition("approved", "reserved");
  escrow.status = "reserved";
  escrow.reserveTxHash = txHash;
  escrow.updatedAt = nowIso();
  store.networkPrograms = applyReserve(store.networkPrograms, allocations);
  store.escrows.push(escrow);
  store.allocations.push(...allocations);
  request.status = "reserved";
  request.updatedAt = nowIso();
  await saveGrant({
    id: id("grant"),
    reliefRequestId,
    caseHash: hashMaterial.caseHash,
    programId: request.programId,
    amount: route.total,
    currency: "USDC",
    providerSettlementAddress: providerAddress(),
    decisionHash: dHash,
    status: "reserved",
    escrowId: escrow.id,
    arcTransactionHash: txHash,
    submittedAt: nowIso(),
  });
  await writeAudit({
    caseId: request.caseId,
    actorType: "agent",
    eventType: "GRANT_RESERVED",
    metadata: { total: route.total, sources: route.selected.map((row) => row.programId) },
  });
  await saveStore();
  return { escrow, route, allocations, transactionHash: txHash };
}

export async function settleRelief(reliefRequestId: string) {
  const request = await getReliefRequest(reliefRequestId);
  const store = await getStore();
  const escrow = [...store.escrows].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (!escrow) throw new ApiError("ESCROW_NOT_FOUND", "No reserved grant was found.", 404);
  if (escrow.status === "settled") return { escrow };
  assertEscrowTransition(escrow.status, "settled");
  const allocations = store.allocations.filter((row) => row.escrowId === escrow.id);
  const txHash = await executeNetworkCall({
    kind: "settle",
    caseHash: escrow.caseHash as `0x${string}`,
  });
  escrow.status = "settled";
  escrow.settleTxHash = txHash;
  escrow.updatedAt = nowIso();
  store.networkPrograms = applySettle(store.networkPrograms, allocations);
  request.status = "executed";
  request.updatedAt = nowIso();
  const grant = [...store.grants].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (grant) {
    grant.status = "confirmed";
    grant.arcTransactionHash = txHash ?? grant.arcTransactionHash;
    grant.confirmedAt = nowIso();
  }
  const caseRow = store.cases.find((row) => row.id === request.caseId);
  if (caseRow) {
    caseRow.status = "grant_executed";
    caseRow.updatedAt = nowIso();
  }
  await writeAudit({
    caseId: request.caseId,
    actorType: "agent",
    eventType: "ARC_TRANSACTION_CONFIRMED",
    metadata: { transactionHash: txHash, escrowId: escrow.id },
  });
  await saveStore();
  return { escrow, transactionHash: txHash };
}

export async function refundRelief(reliefRequestId: string) {
  const request = await getReliefRequest(reliefRequestId);
  const store = await getStore();
  const escrow = [...store.escrows].reverse().find((row) => row.reliefRequestId === reliefRequestId);
  if (!escrow) throw new ApiError("ESCROW_NOT_FOUND", "No reserved grant was found.", 404);
  if (escrow.status === "refunded") return { escrow };
  if (!escrowExpired(escrow)) throw new ApiError("ESCROW_NOT_EXPIRED", "Reservation has not expired.");
  assertEscrowTransition(escrow.status, "refunded");
  const allocations = store.allocations.filter((row) => row.escrowId === escrow.id);
  const txHash = await executeNetworkCall({
    kind: "refund",
    caseHash: escrow.caseHash as `0x${string}`,
  });
  escrow.status = "refunded";
  escrow.refundTxHash = txHash;
  escrow.updatedAt = nowIso();
  store.networkPrograms = applyRefund(store.networkPrograms, allocations);
  request.status = "approved";
  request.updatedAt = nowIso();
  await writeAudit({
    caseId: request.caseId,
    actorType: "agent",
    eventType: "GRANT_REFUNDED",
    metadata: { escrowId: escrow.id },
  });
  await saveStore();
  return { escrow, transactionHash: txHash };
}

export async function probeFunderPolicy(funderId: string, amount: number) {
  const store = await getStore();
  const funder = store.funders.find((row) => row.id === funderId);
  if (!funder) throw new ApiError("FUNDER_NOT_FOUND", "Funder not found.", 404);
  if (policyBlockedByLimit(amount, funder.perMatchLimitUsdc)) {
    return {
      blocked: true,
      attempted: amount,
      allowed: funder.perMatchLimitUsdc,
      message: "Blocked by foundation treasury policy",
    };
  }
  const program = store.networkPrograms.find((row) => row.funderId === funderId);
  if (funder.privyWalletId && RELIEF_NETWORK_ADDRESS && program) {
    const funded = await fundNetworkProgram(funderId, program.id, amount);
    return {
      blocked: false,
      attempted: amount,
      allowed: funder.perMatchLimitUsdc,
      executed: true,
      transactionHash: funded.transactionHash,
    };
  }
  return { blocked: false, attempted: amount, allowed: funder.perMatchLimitUsdc };
}

async function ensureDonor(email?: string, walletAddress?: string) {
  if (!email && !walletAddress) return undefined;
  const store = await getStore();
  const existing = store.donors.find(
    (row) => (email && row.email === email) || (walletAddress && row.walletAddress === walletAddress),
  );
  if (existing) {
    if (walletAddress && !existing.walletAddress) existing.walletAddress = walletAddress;
    return existing;
  }
  const created = nowIso();
  const donor: StoredDonor = {
    id: id("donor"),
    email,
    walletAddress,
    createdAt: created,
  };
  if (privyConfigured()) {
    const wallet = await ensureFunderWallet({ externalId: donor.id });
    donor.walletAddress = wallet.address ?? walletAddress;
    donor.privyUserId = wallet.id;
  }
  store.donors.push(donor);
  return donor;
}

function mintRecipient(): string {
  return (
    process.env.CIRCLE_AGENT_WALLET_ADDRESS ||
    RELIEF_NETWORK_ADDRESS ||
    RELIEF_POOL_ADDRESS ||
    providerAddress()
  );
}

function applyDonationLedger(
  store: { networkPrograms: StoredNetworkProgram[]; campaigns: StoredMatchCampaign[] },
  donation: StoredDonation,
) {
  if (donation.status === "deposited" || donation.status === "matched") return donation;
  const program = store.networkPrograms.find((row) => row.id === donation.destinationProgramId);
  if (program) {
    program.budget += donation.amount;
    program.updatedAt = nowIso();
  }
  if (donation.matchedAmount > 0 && donation.campaignId) {
    const campaign = store.campaigns.find((row) => row.id === donation.campaignId);
    const matchProgram = campaign
      ? store.networkPrograms.find((row) => row.id === campaign.programId)
      : undefined;
    if (campaign && matchProgram && matchProgram.budget - matchProgram.spentAmount >= donation.matchedAmount) {
      Object.assign(campaign, applyCampaignSpend(campaign, donation.matchedAmount));
      matchProgram.spentAmount += donation.matchedAmount;
      if (program) program.budget += donation.matchedAmount;
      donation.status = "matched";
    } else {
      donation.status = "deposited";
    }
  } else {
    donation.status = "deposited";
  }
  donation.updatedAt = nowIso();
  return donation;
}

async function mintAttestedOnArc(message?: `0x${string}`, attestation?: `0x${string}`) {
  if (!message || !attestation) return undefined;
  if (await agentWalletConfigured()) {
    return (await agentReceiveMessage(message, attestation)).hash;
  }
  if (circleConfigured()) {
    const executed = await circleWalletExecute({
      signature: "receiveMessage(bytes,bytes)",
      params: [message, attestation],
      contract: MESSAGE_TRANSMITTER_V2,
      wallet: process.env.CIRCLE_AGENT_WALLET_ADDRESS as string,
    });
    if (!executed.ok) throw new ApiError("ARC_PENDING", executed.error || "CCTP mint submitted. Waiting for confirmation.", 502);
    return executed.txHash;
  }
  return undefined;
}

export async function createDonation(input: {
  amount: number;
  sourceChain: SourceChain;
  destinationProgramId?: string;
  email?: string;
  campaignId?: string;
  donorWallet?: string;
}) {
  const store = await getStore();
  const destinationProgramId = input.destinationProgramId || NETWORK_GENERAL_PROGRAM_ID;
  const program = store.networkPrograms.find((row) => row.id === destinationProgramId);
  if (!program) throw new ApiError("PROGRAM_NOT_FOUND", "Destination program not found.", 404);
  const campaign =
    store.campaigns.find((row) => row.id === input.campaignId) ??
    store.campaigns.find((row) => row.recipientProgramId === destinationProgramId && row.status === "active");
  const matchedAmount = campaign ? campaignMatchAmount(input.amount, campaign) : 0;
  const donor = await ensureDonor(input.email, input.donorWallet);
  const recipient = mintRecipient();
  const burn = donationBurnCall({
    amountUsd: input.amount,
    sourceChain: input.sourceChain,
    mintRecipient: recipient,
  });
  const donation: StoredDonation = {
    id: id("don"),
    donorId: donor?.id,
    email: input.email,
    amount: input.amount,
    sourceChain: input.sourceChain,
    destinationProgramId,
    campaignId: campaign?.id,
    matchedAmount,
    status: input.sourceChain === "arc" ? "pending" : "awaiting_source",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.donations.push(donation);

  const liveBridge = Boolean(RELIEF_NETWORK_ADDRESS || process.env.CIRCLE_AGENT_WALLET_ADDRESS);
  if (!liveBridge && isDemoMode()) {
    applyDonationLedger(store, donation);
  }

  if (input.sourceChain !== "arc" && process.env.CIRCLE_GATEWAY_API_KEY && recipient) {
    const transferred = await gatewayTransfer({
      sourceAddress: input.donorWallet,
      destinationAddress: recipient,
      destinationDomain: sourceDomain("arc"),
      amount: usdcToAtomic(input.amount).toString(),
    }).catch(() => null);
    if (transferred?.ok) {
      const transferId = String(
        (transferred.body as { transferId?: string; id?: string }).transferId ??
          (transferred.body as { id?: string }).id ??
          "",
      );
      if (transferId) donation.gatewayTransferId = transferId;
      donation.status = "bridging";
    }
  }

  await writeAudit({
    actorType: "patient",
    eventType: "DONATION_CREATED",
    metadata: { donationId: donation.id, sourceChain: input.sourceChain, amount: input.amount },
  });
  await saveStore();
  const match = campaign
    ? {
        campaignId: campaign.id,
        campaignName: campaign.name,
        donation: input.amount,
        match: matchedAmount,
        total: input.amount + matchedAmount,
      }
    : undefined;
  return {
    donation,
    donor,
    match,
    next:
      donation.status === "deposited" || donation.status === "matched"
        ? { action: "recorded", destination: recipient }
        : input.sourceChain === "arc"
          ? { action: "transfer_usdc", destination: recipient }
          : {
              action: input.sourceChain === "solana" ? "cctp_burn_solana" : "cctp_burn",
              domain: burn.domain,
              tokenMessenger: burn.tokenMessenger,
              burnToken: burn.burnToken,
              mintRecipient: burn.mintRecipient,
              irisUrl: burn.irisUrl,
              calldata: burn.calldata,
            },
  };
}

export async function completeDonation(donationId: string, input: { sourceTxHash?: string; gatewayTransferId?: string }) {
  const store = await getStore();
  const donation = store.donations.find((row) => row.id === donationId);
  if (!donation) throw new ApiError("DONATION_NOT_FOUND", "Donation not found.", 404);
  if (input.sourceTxHash) {
    donation.sourceTxHash = input.sourceTxHash;
    if (donation.sourceChain !== "arc") {
      const attested = await fetchCctpAttestation(sourceDomain(donation.sourceChain), input.sourceTxHash);
      if (attested.ready) {
        donation.attestation = attested.attestation;
        donation.status = "attested";
        const hash = await mintAttestedOnArc(attested.message, attested.attestation);
        if (hash) {
          donation.arcTxHash = hash;
          donation.status = "minted";
        }
      } else {
        donation.status = "bridging";
      }
    } else {
      donation.status = "minted";
    }
  }
  if (input.gatewayTransferId) {
    donation.gatewayTransferId = input.gatewayTransferId;
    const status = await gatewayTransferStatus(input.gatewayTransferId);
    const state = String((status.body as { status?: string }).status ?? "");
    if (state === "complete" || state === "confirmed" || state === "finalized") {
      donation.status = "minted";
    } else {
      donation.status = "bridging";
    }
  }
  if (donation.status === "attested" || donation.status === "minted") {
    applyDonationLedger(store, donation);
  }
  await saveStore();
  return donation;
}

export async function listCampaigns() {
  return (await getStore()).campaigns;
}

export async function publicNetwork() {
  const store = await getStore();
  const index = await getReliefNetworkIndex();
  return {
    programs: store.networkPrograms.map((program) => {
      const funder = store.funders.find((row) => row.id === program.funderId);
      return {
        ...programAccounting(program, funder),
        live: index.find((row) => row.programId === program.id),
      };
    }),
    campaigns: store.campaigns,
    gateway: await gatewayBalances(RELIEF_NETWORK_ADDRESS || RELIEF_POOL_ADDRESS || "").catch(() => null),
  };
}

export async function funderSummary(funder: StoredFunder) {
  const store = await getStore();
  const programs = store.networkPrograms.filter((program) => program.funderId === funder.id);
  return {
    treasury: funder.treasuryUsdc,
    activePrograms: programs.filter((program) => program.status === "active").length,
    committed: programs.reduce((sum, program) => sum + program.reservedAmount + program.spentAmount, 0),
    grantsMatched: store.allocations.filter((row) => programs.some((program) => program.id === row.programId) && row.role === "match").length,
  };
}
