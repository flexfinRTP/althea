import { NETWORK_RULES_VERSION } from "@/lib/network/ids";
import { availableAmount, isProgramLive, matchAmount } from "@/lib/network/accounting";
import type {
  AllocationRole,
  ReliefRoute,
  RouteSource,
  StoredFunder,
  StoredNetworkProgram,
} from "@/lib/network/types";

export type WaterfallInput = {
  residualBalance: number;
  requestedAmount: number;
  programs: StoredNetworkProgram[];
  funders: StoredFunder[];
  now?: Date;
};

function funderName(funders: StoredFunder[], funderId: string): string {
  return funders.find((row) => row.id === funderId)?.name ?? funderId;
}

function roleFor(kind: StoredNetworkProgram["kind"]): AllocationRole {
  if (kind === "match" || kind === "campaign") return "match";
  if (kind === "employer") return "employer";
  if (kind === "community") return "community";
  return "base";
}

export function assembleReliefRoute(input: WaterfallInput): ReliefRoute {
  const now = input.now ?? new Date();
  const requested = Math.min(Math.max(0, input.requestedAmount), Math.max(0, input.residualBalance));
  const sources: RouteSource[] = [];
  const selected: RouteSource[] = [];
  let remainingNeed = requested;

  const ordered = [...input.programs].sort((a, b) => {
    const rank = (kind: StoredNetworkProgram["kind"]) =>
      kind === "general" ? 0 : kind === "match" || kind === "campaign" ? 1 : kind === "employer" ? 2 : 3;
    return rank(a.kind) - rank(b.kind);
  });

  const basePrograms = ordered.filter((program) => program.kind === "general");
  for (const program of basePrograms) {
    const available = availableAmount(program);
    const live = isProgramLive(program, now);
    const amount = live ? Math.min(remainingNeed, program.grantCap, available) : 0;
    const source: RouteSource = {
      programId: program.id,
      name: program.name,
      funderName: funderName(input.funders, program.funderId),
      amount,
      role: "base",
      eligible: live && amount > 0,
      reason: !live
        ? program.status !== "active"
          ? "Program paused"
          : "Program expired"
        : available <= 0
          ? "No available USDC"
          : amount > 0
            ? "Eligible"
            : "Need already filled",
      available,
    };
    sources.push(source);
    if (source.eligible) {
      selected.push(source);
      remainingNeed -= amount;
    }
  }

  const baseSelected = selected.filter((row) => row.role === "base").reduce((sum, row) => sum + row.amount, 0);

  for (const program of ordered.filter((row) => row.kind !== "general")) {
    const available = availableAmount(program);
    const live = isProgramLive(program, now);
    const role = roleFor(program.kind);
    let amount = 0;
    let reason = "Eligible";
    if (!live) {
      reason = program.status !== "active" ? "Program paused" : "Program expired";
    } else if (available <= 0) {
      reason = "No available USDC";
    } else if (role === "match") {
      if (program.eligibleSourceProgramId && !selected.some((row) => row.programId === program.eligibleSourceProgramId)) {
        reason = "Eligible source grant not selected";
      } else if (baseSelected <= 0) {
        reason = "No base grant to match";
      } else {
        amount = Math.min(remainingNeed, matchAmount(baseSelected, program));
        reason = amount > 0 ? "Eligible" : "Match not available";
      }
    } else {
      amount = Math.min(remainingNeed, program.grantCap, available);
      reason = amount > 0 ? "Eligible" : "Need already filled";
    }

    const source: RouteSource = {
      programId: program.id,
      name: program.name,
      funderName: funderName(input.funders, program.funderId),
      amount,
      role,
      eligible: amount > 0,
      reason,
      available,
      matchRatio:
        program.matchRatioDen > 0 ? `${program.matchRatioNum}:${program.matchRatioDen}` : undefined,
    };
    sources.push(source);
    if (source.eligible) {
      selected.push(source);
      remainingNeed -= amount;
    }
  }

  const total = selected.reduce((sum, row) => sum + row.amount, 0);
  return {
    residualBalance: input.residualBalance,
    requestedAmount: input.requestedAmount,
    sources,
    selected,
    total,
    remainingAfter: Math.max(0, input.residualBalance - total),
    rulesVersion: NETWORK_RULES_VERSION,
  };
}
