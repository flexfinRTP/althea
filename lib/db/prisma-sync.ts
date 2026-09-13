import type { PrismaClient, Prisma } from "@prisma/client";
import type { FapPolicy } from "@/lib/fap/schema";
import type {
  StoreShape,
  StoredAudit,
  StoredCase,
  StoredDecision,
  StoredEstimate,
  StoredFinancialInput,
  StoredGrant,
  StoredPacket,
  StoredReliefDecision,
  StoredReliefRequest,
  StoredTreasuryTx,
  StoredWorld,
  Role,
  CaseStatus,
} from "@/lib/db/store";
import type {
  StoredDonation,
  StoredDonor,
  StoredFunder,
  StoredGrantAllocation,
  StoredGrantEscrow,
  StoredMatchCampaign,
  StoredNetworkProgram,
} from "@/lib/network/types";

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asRecord(value: Prisma.JsonValue | null | undefined): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const record: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") record[key] = entry;
  }
  return record;
}

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function iso(date: Date | null | undefined): string | undefined {
  return date ? date.toISOString() : undefined;
}

export async function hydrateFromPrisma(
  client: PrismaClient,
  fallback: () => StoreShape,
): Promise<StoreShape> {
  const hospitalCount = await client.hospital.count();
  if (hospitalCount === 0) {
    const seeded = fallback();
    await persistToPrisma(client, seeded);
    return seeded;
  }

  const [
    hospitals,
    policies,
    users,
    cases,
    financialInputs,
    estimates,
    packets,
    decisions,
    world,
    reliefRequests,
    reliefDecisions,
    grants,
    treasury,
    audits,
    nullifiers,
    programs,
    funders,
    networkPrograms,
    escrows,
    allocations,
    donations,
    campaigns,
    donors,
  ] = await Promise.all([
    client.hospital.findMany(),
    client.fapPolicyVersion.findMany(),
    client.user.findMany(),
    client.case.findMany(),
    client.caseFinancialInput.findMany(),
    client.eligibilityEstimate.findMany(),
    client.applicationPacket.findMany(),
    client.hospitalDecision.findMany(),
    client.worldVerification.findMany(),
    client.reliefRequest.findMany(),
    client.reliefDecision.findMany(),
    client.grant.findMany(),
    client.treasuryTransaction.findMany(),
    client.auditEvent.findMany(),
    client.worldNullifier.findMany(),
    client.reliefProgram.findMany(),
    client.funderOrganization.findMany(),
    client.networkProgram.findMany(),
    client.grantEscrow.findMany(),
    client.grantAllocation.findMany(),
    client.donation.findMany(),
    client.matchCampaign.findMany(),
    client.donor.findMany(),
  ]);

  const seed = fallback();
  const program = programs[0]
    ? {
        id: programs[0].id,
        name: programs[0].name,
        status: programs[0].status as StoreShape["program"]["status"],
        currency: "USDC" as const,
        minGrant: programs[0].minGrant ?? undefined,
        maxGrant: programs[0].maxGrant,
        autoApprovalCap: programs[0].autoApprovalCap,
        humanApprovalThreshold: programs[0].humanApprovalThreshold,
        quorumThreshold: programs[0].quorumThreshold ?? undefined,
        requiresWorldCheck: programs[0].requiresWorldCheck,
        requiresFapCompletion: programs[0].requiresFapCompletion,
        requiresVerifiedResidual: programs[0].requiresVerifiedResidual,
        demoAvailableCapital: seed.program.demoAvailableCapital,
        demoReliefDelivered: seed.program.demoReliefDelivered,
        demoGrantsCompleted: seed.program.demoGrantsCompleted,
      }
    : seed.program;

  const store: StoreShape = {
    hospitals: hospitals.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      systemName: hospital.systemName ?? undefined,
      city: hospital.city ?? undefined,
      state: hospital.state ?? undefined,
      organizationType: hospital.organizationType ?? undefined,
      fapLandingPageUrl: hospital.fapLandingPageUrl ?? undefined,
      applicationUrl: hospital.applicationUrl ?? undefined,
      activePolicyVersionId: hospital.activePolicyVersionId ?? undefined,
      policySourcePath: hospital.policySourcePath ?? undefined,
    })),
    policies: policies.map((policy) => ({
      id: policy.id,
      hospitalId: policy.hospitalId,
      documentId: policy.documentId,
      versionLabel: policy.versionLabel,
      effectiveDate: policy.effectiveDate ?? undefined,
      structuredPolicy: policy.structuredPolicyJson as FapPolicy,
      validationStatus: policy.validationStatus,
    })),
    users: users.map((user) => ({
      id: user.id,
      role: user.role as Role,
      email: user.email ?? undefined,
    })),
    cases: cases.map(
      (row): StoredCase => ({
        id: row.id,
        userId: row.userId ?? undefined,
        hospitalId: row.hospitalId,
        status: row.status as CaseStatus,
        caseHash: row.caseHash ?? undefined,
        caseHashSalt: row.caseHashSalt ?? undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    financialInputs: financialInputs.map(
      (row): StoredFinancialInput => ({
        caseId: row.caseId,
        billAmount: row.billAmount,
        householdSize: row.householdSize,
        householdAnnualIncome: row.householdAnnualIncome,
        insuranceStatus: row.insuranceStatus as StoredFinancialInput["insuranceStatus"],
        firstPostDischargeBillDate: row.firstPostDischargeBillDate ?? undefined,
        state: row.state ?? undefined,
        residencyAnswers: (row.residencyAnswersJson as Record<string, unknown> | null) ?? undefined,
      }),
    ),
    estimates: estimates.map(
      (row): StoredEstimate => ({
        id: row.id,
        caseId: row.caseId,
        policyVersionId: row.policyVersionId,
        fplPercent: row.fplPercent ?? undefined,
        outcome: row.outcome,
        estimatedAssistance: row.estimatedAssistance ?? undefined,
        estimatedRemaining: row.estimatedRemaining ?? undefined,
        matchedRuleIds: asStringArray(row.matchedRuleIdsJson),
        assumptions: asStringArray(row.assumptionsJson),
        reasons: asStringArray(row.reasonsJson),
        citationIds: asStringArray(row.citationIdsJson),
        calculatedAt: row.calculatedAt.toISOString(),
      }),
    ),
    packets: packets.map(
      (row): StoredPacket => ({
        id: row.id,
        caseId: row.caseId,
        policyVersionId: row.policyVersionId,
        status: row.status as StoredPacket["status"],
        applicationUrl: row.applicationUrl ?? undefined,
        submissionInstructions: asStringArray(row.submissionInstructionsJson),
        requiredDocuments: (row.requiredDocumentsJson as StoredPacket["requiredDocuments"]) ?? [],
        generatedFields: asRecord(row.generatedFieldsJson),
        generatedAt: row.generatedAt.toISOString(),
        submittedAt: iso(row.submittedAt),
      }),
    ),
    decisions: decisions.map(
      (row): StoredDecision => ({
        id: row.id,
        caseId: row.caseId,
        status: row.status as StoredDecision["status"],
        originalBalance: row.originalBalance,
        approvedAssistance: row.approvedAssistance,
        remainingBalance: row.remainingBalance,
        source: row.source as StoredDecision["source"],
        verified: row.verified,
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    world: world.map(
      (row): StoredWorld => ({
        id: row.id,
        caseId: row.caseId,
        status: row.status as StoredWorld["status"],
        verificationReference: row.verificationReference ?? undefined,
        verifiedAt: iso(row.verifiedAt),
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    reliefRequests: reliefRequests.map(
      (row): StoredReliefRequest => ({
        id: row.id,
        caseId: row.caseId,
        programId: row.programId,
        requestedAmount: row.requestedAmount,
        residualBalance: row.residualBalance,
        status: row.status as StoredReliefRequest["status"],
        executionKey: row.executionKey ?? undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    reliefDecisions: reliefDecisions.map(
      (row): StoredReliefDecision => ({
        id: row.id,
        reliefRequestId: row.reliefRequestId,
        decision: row.decision as StoredReliefDecision["decision"],
        calculatedGrantAmount: row.calculatedGrantAmount,
        reasonCodes: asStringArray(row.reasonCodesJson),
        rulesVersion: row.rulesVersion,
        approvedBy: row.approvedBy ?? undefined,
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    grants: grants.map(
      (row): StoredGrant => ({
        id: row.id,
        reliefRequestId: row.reliefRequestId,
        caseHash: row.caseHash,
        programId: row.programId,
        amount: row.amount,
        currency: "USDC",
        providerSettlementAddress: row.providerSettlementAddress,
        decisionHash: row.decisionHash,
        status: row.status as StoredGrant["status"],
        escrowId: row.escrowId ?? undefined,
        arcTransactionHash: row.arcTransactionHash ?? undefined,
        submittedAt: iso(row.submittedAt),
        confirmedAt: iso(row.confirmedAt),
      }),
    ),
    treasury: treasury.map(
      (row): StoredTreasuryTx => ({
        id: row.id,
        type: row.type as StoredTreasuryTx["type"],
        amount: row.amount,
        currency: "USDC",
        sourceAddress: row.sourceAddress ?? undefined,
        destinationAddress: row.destinationAddress,
        chain: "arc",
        transactionHash: row.transactionHash ?? undefined,
        status: row.status as StoredTreasuryTx["status"],
        initiatedBy: row.initiatedBy,
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    audits: audits.map(
      (row): StoredAudit => ({
        id: row.id,
        caseId: row.caseId ?? undefined,
        actorType: row.actorType as StoredAudit["actorType"],
        actorId: row.actorId ?? undefined,
        eventType: row.eventType,
        metadata: (row.metadataJson as Record<string, unknown> | null) ?? undefined,
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    nullifiers: nullifiers.map((row) => ({ nullifier: row.nullifier, action: row.action })),
    funders: funders.map(
      (row): StoredFunder => ({
        id: row.id,
        name: row.name,
        kind: row.kind as StoredFunder["kind"],
        email: row.email ?? undefined,
        privyWalletId: row.privyWalletId ?? undefined,
        privyWalletAddress: row.privyWalletAddress ?? undefined,
        policyId: row.policyId ?? undefined,
        treasuryUsdc: row.treasuryUsdc,
        dailyLimitUsdc: row.dailyLimitUsdc,
        perMatchLimitUsdc: row.perMatchLimitUsdc,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    networkPrograms: networkPrograms.map(
      (row): StoredNetworkProgram => ({
        id: row.id,
        funderId: row.funderId,
        name: row.name,
        kind: row.kind as StoredNetworkProgram["kind"],
        status: row.status as StoredNetworkProgram["status"],
        currency: "USDC",
        budget: row.budget,
        spentAmount: row.spentAmount,
        reservedAmount: row.reservedAmount,
        grantCap: row.grantCap,
        matchRatioNum: row.matchRatioNum,
        matchRatioDen: row.matchRatioDen,
        maxMatchPerCase: row.maxMatchPerCase,
        expiresAt: iso(row.expiresAt),
        ruleHash: row.ruleHash,
        eligibleSourceProgramId: row.eligibleSourceProgramId ?? undefined,
        allowedRecipientMode: "verified_settlement_only",
        requiresWorldCheck: row.requiresWorldCheck,
        requiresFapCompletion: row.requiresFapCompletion,
        requiresVerifiedResidual: row.requiresVerifiedResidual,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    escrows: escrows.map(
      (row): StoredGrantEscrow => ({
        id: row.id,
        reliefRequestId: row.reliefRequestId,
        caseId: row.caseId,
        caseHash: row.caseHash,
        provider: row.provider,
        totalAmount: row.totalAmount,
        expiresAt: row.expiresAt.toISOString(),
        decisionHash: row.decisionHash,
        status: row.status as StoredGrantEscrow["status"],
        reserveTxHash: row.reserveTxHash ?? undefined,
        settleTxHash: row.settleTxHash ?? undefined,
        refundTxHash: row.refundTxHash ?? undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    allocations: allocations.map(
      (row): StoredGrantAllocation => ({
        id: row.id,
        escrowId: row.escrowId,
        programId: row.programId,
        amount: row.amount,
        role: row.role as StoredGrantAllocation["role"],
      }),
    ),
    donations: donations.map(
      (row): StoredDonation => ({
        id: row.id,
        donorId: row.donorId ?? undefined,
        email: row.email ?? undefined,
        amount: row.amount,
        sourceChain: row.sourceChain as StoredDonation["sourceChain"],
        destinationProgramId: row.destinationProgramId,
        campaignId: row.campaignId ?? undefined,
        matchedAmount: row.matchedAmount,
        status: row.status as StoredDonation["status"],
        sourceTxHash: row.sourceTxHash ?? undefined,
        attestation: row.attestation ?? undefined,
        gatewayTransferId: row.gatewayTransferId ?? undefined,
        arcTxHash: row.arcTxHash ?? undefined,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
    campaigns: campaigns.map(
      (row): StoredMatchCampaign => ({
        id: row.id,
        programId: row.programId,
        name: row.name,
        matchRatioNum: row.matchRatioNum,
        matchRatioDen: row.matchRatioDen,
        budget: row.budget,
        spent: row.spent,
        startsAt: row.startsAt,
        endsAt: row.endsAt,
        recipientProgramId: row.recipientProgramId,
        status: row.status as StoredMatchCampaign["status"],
      }),
    ),
    donors: donors.map(
      (row): StoredDonor => ({
        id: row.id,
        email: row.email ?? undefined,
        privyUserId: row.privyUserId ?? undefined,
        walletAddress: row.walletAddress ?? undefined,
        createdAt: row.createdAt.toISOString(),
      }),
    ),
    program,
  };

  return store;
}

export async function persistToPrisma(client: PrismaClient, store: StoreShape): Promise<void> {
  await client.$transaction(async (tx) => {
    for (const hospital of store.hospitals) {
      await tx.hospital.upsert({
        where: { id: hospital.id },
        update: {
          name: hospital.name,
          systemName: hospital.systemName,
          city: hospital.city,
          state: hospital.state,
          organizationType: hospital.organizationType,
          fapLandingPageUrl: hospital.fapLandingPageUrl,
          applicationUrl: hospital.applicationUrl,
          activePolicyVersionId: hospital.activePolicyVersionId,
          policySourcePath: hospital.policySourcePath,
        },
        create: {
          id: hospital.id,
          name: hospital.name,
          systemName: hospital.systemName,
          city: hospital.city,
          state: hospital.state,
          organizationType: hospital.organizationType,
          fapLandingPageUrl: hospital.fapLandingPageUrl,
          applicationUrl: hospital.applicationUrl,
          activePolicyVersionId: hospital.activePolicyVersionId,
          policySourcePath: hospital.policySourcePath,
        },
      });
    }

    for (const policy of store.policies) {
      await tx.fapDocument.upsert({
        where: { id: policy.documentId },
        update: {
          title: policy.structuredPolicy.hospitalName,
          sourceType: "manual_fixture",
          ingestionStatus: "approved",
          effectiveDate: policy.effectiveDate,
        },
        create: {
          id: policy.documentId,
          hospitalId: policy.hospitalId,
          title: policy.structuredPolicy.hospitalName,
          sourceType: "manual_fixture",
          ingestionStatus: "approved",
          effectiveDate: policy.effectiveDate,
        },
      });
      await tx.fapPolicyVersion.upsert({
        where: { id: policy.id },
        update: {
          versionLabel: policy.versionLabel,
          effectiveDate: policy.effectiveDate,
          structuredPolicyJson: jsonValue(policy.structuredPolicy),
          validationStatus: policy.validationStatus,
        },
        create: {
          id: policy.id,
          hospitalId: policy.hospitalId,
          documentId: policy.documentId,
          versionLabel: policy.versionLabel,
          effectiveDate: policy.effectiveDate,
          structuredPolicyJson: jsonValue(policy.structuredPolicy),
          validationStatus: policy.validationStatus,
        },
      });
    }

    await tx.reliefProgram.upsert({
      where: { id: store.program.id },
      update: {
        name: store.program.name,
        status: store.program.status,
        currency: store.program.currency,
        minGrant: store.program.minGrant,
        maxGrant: store.program.maxGrant,
        autoApprovalCap: store.program.autoApprovalCap,
        humanApprovalThreshold: store.program.humanApprovalThreshold,
        quorumThreshold: store.program.quorumThreshold,
        requiresWorldCheck: store.program.requiresWorldCheck,
        requiresFapCompletion: store.program.requiresFapCompletion,
        requiresVerifiedResidual: store.program.requiresVerifiedResidual,
      },
      create: {
        id: store.program.id,
        name: store.program.name,
        status: store.program.status,
        currency: store.program.currency,
        minGrant: store.program.minGrant,
        maxGrant: store.program.maxGrant,
        autoApprovalCap: store.program.autoApprovalCap,
        humanApprovalThreshold: store.program.humanApprovalThreshold,
        quorumThreshold: store.program.quorumThreshold,
        requiresWorldCheck: store.program.requiresWorldCheck,
        requiresFapCompletion: store.program.requiresFapCompletion,
        requiresVerifiedResidual: store.program.requiresVerifiedResidual,
      },
    });

    for (const user of store.users) {
      await tx.user.upsert({
        where: { id: user.id },
        update: { role: user.role, email: user.email },
        create: { id: user.id, role: user.role, email: user.email },
      });
    }

    for (const row of store.cases) {
      if (row.userId && !store.users.some((user) => user.id === row.userId)) {
        await tx.user.upsert({
          where: { id: row.userId },
          update: {},
          create: { id: row.userId, role: "patient" },
        });
      }
    }

    for (const row of store.cases) {
      await tx.case.upsert({
        where: { id: row.id },
        update: {
          userId: row.userId,
          hospitalId: row.hospitalId,
          status: row.status,
          caseHash: row.caseHash,
          caseHashSalt: row.caseHashSalt,
        },
        create: {
          id: row.id,
          userId: row.userId,
          hospitalId: row.hospitalId,
          status: row.status,
          caseHash: row.caseHash,
          caseHashSalt: row.caseHashSalt,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.financialInputs) {
      await tx.caseFinancialInput.upsert({
        where: { caseId: row.caseId },
        update: {
          billAmount: row.billAmount,
          householdSize: row.householdSize,
          householdAnnualIncome: row.householdAnnualIncome,
          insuranceStatus: row.insuranceStatus,
          firstPostDischargeBillDate: row.firstPostDischargeBillDate,
          state: row.state,
          residencyAnswersJson: row.residencyAnswers ? jsonValue(row.residencyAnswers) : undefined,
        },
        create: {
          caseId: row.caseId,
          billAmount: row.billAmount,
          householdSize: row.householdSize,
          householdAnnualIncome: row.householdAnnualIncome,
          insuranceStatus: row.insuranceStatus,
          firstPostDischargeBillDate: row.firstPostDischargeBillDate,
          state: row.state,
          residencyAnswersJson: row.residencyAnswers ? jsonValue(row.residencyAnswers) : undefined,
        },
      });
    }

    for (const row of store.estimates) {
      await tx.eligibilityEstimate.upsert({
        where: { id: row.id },
        update: {
          fplPercent: row.fplPercent,
          outcome: row.outcome,
          estimatedAssistance: row.estimatedAssistance,
          estimatedRemaining: row.estimatedRemaining,
          matchedRuleIdsJson: jsonValue(row.matchedRuleIds),
          assumptionsJson: jsonValue(row.assumptions),
          reasonsJson: jsonValue(row.reasons),
          citationIdsJson: jsonValue(row.citationIds),
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          policyVersionId: row.policyVersionId,
          fplPercent: row.fplPercent,
          outcome: row.outcome,
          estimatedAssistance: row.estimatedAssistance,
          estimatedRemaining: row.estimatedRemaining,
          matchedRuleIdsJson: jsonValue(row.matchedRuleIds),
          assumptionsJson: jsonValue(row.assumptions),
          reasonsJson: jsonValue(row.reasons),
          citationIdsJson: jsonValue(row.citationIds),
          calculatedAt: new Date(row.calculatedAt),
        },
      });
    }

    for (const row of store.packets) {
      await tx.applicationPacket.upsert({
        where: { id: row.id },
        update: {
          status: row.status,
          applicationUrl: row.applicationUrl,
          submissionInstructionsJson: jsonValue(row.submissionInstructions),
          requiredDocumentsJson: jsonValue(row.requiredDocuments),
          generatedFieldsJson: jsonValue(row.generatedFields),
          submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          policyVersionId: row.policyVersionId,
          status: row.status,
          applicationUrl: row.applicationUrl,
          submissionInstructionsJson: jsonValue(row.submissionInstructions),
          requiredDocumentsJson: jsonValue(row.requiredDocuments),
          generatedFieldsJson: jsonValue(row.generatedFields),
          generatedAt: new Date(row.generatedAt),
          submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
        },
      });
    }

    for (const row of store.decisions) {
      await tx.hospitalDecision.upsert({
        where: { id: row.id },
        update: {
          status: row.status,
          originalBalance: row.originalBalance,
          approvedAssistance: row.approvedAssistance,
          remainingBalance: row.remainingBalance,
          source: row.source,
          verified: row.verified,
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          status: row.status,
          originalBalance: row.originalBalance,
          approvedAssistance: row.approvedAssistance,
          remainingBalance: row.remainingBalance,
          source: row.source,
          verified: row.verified,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.world) {
      await tx.worldVerification.upsert({
        where: { id: row.id },
        update: {
          status: row.status,
          verificationReference: row.verificationReference,
          verifiedAt: row.verifiedAt ? new Date(row.verifiedAt) : null,
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          status: row.status,
          verificationReference: row.verificationReference,
          verifiedAt: row.verifiedAt ? new Date(row.verifiedAt) : null,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.reliefRequests) {
      await tx.reliefRequest.upsert({
        where: { id: row.id },
        update: {
          programId: row.programId,
          requestedAmount: row.requestedAmount,
          residualBalance: row.residualBalance,
          status: row.status,
          executionKey: row.executionKey,
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          programId: row.programId,
          requestedAmount: row.requestedAmount,
          residualBalance: row.residualBalance,
          status: row.status,
          executionKey: row.executionKey,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.reliefDecisions) {
      await tx.reliefDecision.upsert({
        where: { id: row.id },
        update: {
          decision: row.decision,
          calculatedGrantAmount: row.calculatedGrantAmount,
          reasonCodesJson: jsonValue(row.reasonCodes),
          rulesVersion: row.rulesVersion,
          approvedBy: row.approvedBy,
        },
        create: {
          id: row.id,
          reliefRequestId: row.reliefRequestId,
          decision: row.decision,
          calculatedGrantAmount: row.calculatedGrantAmount,
          reasonCodesJson: jsonValue(row.reasonCodes),
          rulesVersion: row.rulesVersion,
          approvedBy: row.approvedBy,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.grants) {
      await tx.grant.upsert({
        where: { id: row.id },
        update: {
          caseHash: row.caseHash,
          programId: row.programId,
          amount: row.amount,
          currency: row.currency,
          providerSettlementAddress: row.providerSettlementAddress,
          decisionHash: row.decisionHash,
          status: row.status,
          escrowId: row.escrowId,
          arcTransactionHash: row.arcTransactionHash,
          submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
          confirmedAt: row.confirmedAt ? new Date(row.confirmedAt) : null,
        },
        create: {
          id: row.id,
          reliefRequestId: row.reliefRequestId,
          caseHash: row.caseHash,
          programId: row.programId,
          amount: row.amount,
          currency: row.currency,
          providerSettlementAddress: row.providerSettlementAddress,
          decisionHash: row.decisionHash,
          status: row.status,
          escrowId: row.escrowId,
          arcTransactionHash: row.arcTransactionHash,
          submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
          confirmedAt: row.confirmedAt ? new Date(row.confirmedAt) : null,
        },
      });
    }

    for (const row of store.treasury) {
      await tx.treasuryTransaction.upsert({
        where: { id: row.id },
        update: {
          type: row.type,
          amount: row.amount,
          currency: row.currency,
          sourceAddress: row.sourceAddress,
          destinationAddress: row.destinationAddress,
          chain: row.chain,
          transactionHash: row.transactionHash,
          status: row.status,
          initiatedBy: row.initiatedBy,
        },
        create: {
          id: row.id,
          type: row.type,
          amount: row.amount,
          currency: row.currency,
          sourceAddress: row.sourceAddress,
          destinationAddress: row.destinationAddress,
          chain: row.chain,
          transactionHash: row.transactionHash,
          status: row.status,
          initiatedBy: row.initiatedBy,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.audits) {
      await tx.auditEvent.upsert({
        where: { id: row.id },
        update: {
          caseId: row.caseId,
          actorType: row.actorType,
          actorId: row.actorId,
          eventType: row.eventType,
          metadataJson: row.metadata ? jsonValue(row.metadata) : undefined,
        },
        create: {
          id: row.id,
          caseId: row.caseId,
          actorType: row.actorType,
          actorId: row.actorId,
          eventType: row.eventType,
          metadataJson: row.metadata ? jsonValue(row.metadata) : undefined,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.nullifiers) {
      await tx.worldNullifier.upsert({
        where: { nullifier_action: { nullifier: row.nullifier, action: row.action } },
        update: {},
        create: { nullifier: row.nullifier, action: row.action },
      });
    }

    for (const row of store.funders ?? []) {
      await tx.funderOrganization.upsert({
        where: { id: row.id },
        update: {
          name: row.name,
          kind: row.kind,
          email: row.email,
          privyWalletId: row.privyWalletId,
          privyWalletAddress: row.privyWalletAddress,
          policyId: row.policyId,
          treasuryUsdc: row.treasuryUsdc,
          dailyLimitUsdc: row.dailyLimitUsdc,
          perMatchLimitUsdc: row.perMatchLimitUsdc,
        },
        create: {
          id: row.id,
          name: row.name,
          kind: row.kind,
          email: row.email,
          privyWalletId: row.privyWalletId,
          privyWalletAddress: row.privyWalletAddress,
          policyId: row.policyId,
          treasuryUsdc: row.treasuryUsdc,
          dailyLimitUsdc: row.dailyLimitUsdc,
          perMatchLimitUsdc: row.perMatchLimitUsdc,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.networkPrograms ?? []) {
      await tx.networkProgram.upsert({
        where: { id: row.id },
        update: {
          funderId: row.funderId,
          name: row.name,
          kind: row.kind,
          status: row.status,
          currency: row.currency,
          budget: row.budget,
          spentAmount: row.spentAmount,
          reservedAmount: row.reservedAmount,
          grantCap: row.grantCap,
          matchRatioNum: row.matchRatioNum,
          matchRatioDen: row.matchRatioDen,
          maxMatchPerCase: row.maxMatchPerCase,
          expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
          ruleHash: row.ruleHash,
          eligibleSourceProgramId: row.eligibleSourceProgramId,
          allowedRecipientMode: row.allowedRecipientMode,
          requiresWorldCheck: row.requiresWorldCheck,
          requiresFapCompletion: row.requiresFapCompletion,
          requiresVerifiedResidual: row.requiresVerifiedResidual,
        },
        create: {
          id: row.id,
          funderId: row.funderId,
          name: row.name,
          kind: row.kind,
          status: row.status,
          currency: row.currency,
          budget: row.budget,
          spentAmount: row.spentAmount,
          reservedAmount: row.reservedAmount,
          grantCap: row.grantCap,
          matchRatioNum: row.matchRatioNum,
          matchRatioDen: row.matchRatioDen,
          maxMatchPerCase: row.maxMatchPerCase,
          expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
          ruleHash: row.ruleHash,
          eligibleSourceProgramId: row.eligibleSourceProgramId,
          allowedRecipientMode: row.allowedRecipientMode,
          requiresWorldCheck: row.requiresWorldCheck,
          requiresFapCompletion: row.requiresFapCompletion,
          requiresVerifiedResidual: row.requiresVerifiedResidual,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.escrows ?? []) {
      await tx.grantEscrow.upsert({
        where: { id: row.id },
        update: {
          reliefRequestId: row.reliefRequestId,
          caseId: row.caseId,
          caseHash: row.caseHash,
          provider: row.provider,
          totalAmount: row.totalAmount,
          expiresAt: new Date(row.expiresAt),
          decisionHash: row.decisionHash,
          status: row.status,
          reserveTxHash: row.reserveTxHash,
          settleTxHash: row.settleTxHash,
          refundTxHash: row.refundTxHash,
        },
        create: {
          id: row.id,
          reliefRequestId: row.reliefRequestId,
          caseId: row.caseId,
          caseHash: row.caseHash,
          provider: row.provider,
          totalAmount: row.totalAmount,
          expiresAt: new Date(row.expiresAt),
          decisionHash: row.decisionHash,
          status: row.status,
          reserveTxHash: row.reserveTxHash,
          settleTxHash: row.settleTxHash,
          refundTxHash: row.refundTxHash,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.allocations ?? []) {
      await tx.grantAllocation.upsert({
        where: { id: row.id },
        update: {
          escrowId: row.escrowId,
          programId: row.programId,
          amount: row.amount,
          role: row.role,
        },
        create: {
          id: row.id,
          escrowId: row.escrowId,
          programId: row.programId,
          amount: row.amount,
          role: row.role,
        },
      });
    }

    for (const row of store.campaigns ?? []) {
      await tx.matchCampaign.upsert({
        where: { id: row.id },
        update: {
          programId: row.programId,
          name: row.name,
          matchRatioNum: row.matchRatioNum,
          matchRatioDen: row.matchRatioDen,
          budget: row.budget,
          spent: row.spent,
          startsAt: row.startsAt,
          endsAt: row.endsAt,
          recipientProgramId: row.recipientProgramId,
          status: row.status,
        },
        create: {
          id: row.id,
          programId: row.programId,
          name: row.name,
          matchRatioNum: row.matchRatioNum,
          matchRatioDen: row.matchRatioDen,
          budget: row.budget,
          spent: row.spent,
          startsAt: row.startsAt,
          endsAt: row.endsAt,
          recipientProgramId: row.recipientProgramId,
          status: row.status,
        },
      });
    }

    for (const row of store.donations ?? []) {
      await tx.donation.upsert({
        where: { id: row.id },
        update: {
          donorId: row.donorId,
          email: row.email,
          amount: row.amount,
          sourceChain: row.sourceChain,
          destinationProgramId: row.destinationProgramId,
          campaignId: row.campaignId,
          matchedAmount: row.matchedAmount,
          status: row.status,
          sourceTxHash: row.sourceTxHash,
          attestation: row.attestation,
          gatewayTransferId: row.gatewayTransferId,
          arcTxHash: row.arcTxHash,
        },
        create: {
          id: row.id,
          donorId: row.donorId,
          email: row.email,
          amount: row.amount,
          sourceChain: row.sourceChain,
          destinationProgramId: row.destinationProgramId,
          campaignId: row.campaignId,
          matchedAmount: row.matchedAmount,
          status: row.status,
          sourceTxHash: row.sourceTxHash,
          attestation: row.attestation,
          gatewayTransferId: row.gatewayTransferId,
          arcTxHash: row.arcTxHash,
          createdAt: new Date(row.createdAt),
        },
      });
    }

    for (const row of store.donors ?? []) {
      await tx.donor.upsert({
        where: { id: row.id },
        update: {
          email: row.email,
          privyUserId: row.privyUserId,
          walletAddress: row.walletAddress,
        },
        create: {
          id: row.id,
          email: row.email,
          privyUserId: row.privyUserId,
          walletAddress: row.walletAddress,
          createdAt: new Date(row.createdAt),
        },
      });
    }
  });
}
