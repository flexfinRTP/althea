import type { ProgramAccounting, StoredFunder, StoredNetworkProgram } from "@/lib/network/types";

export function availableAmount(program: StoredNetworkProgram): number {
  return Math.max(0, program.budget - program.reservedAmount - program.spentAmount);
}

export function committedAmount(program: StoredNetworkProgram): number {
  return program.reservedAmount + program.spentAmount;
}

export function programAccounting(program: StoredNetworkProgram, funder?: StoredFunder): ProgramAccounting {
  const remaining = availableAmount(program);
  return {
    programId: program.id,
    name: program.name,
    funderId: program.funderId,
    funderName: funder?.name ?? program.funderId,
    kind: program.kind,
    status: program.status,
    budget: program.budget,
    committed: committedAmount(program),
    settled: program.spentAmount,
    reserved: program.reservedAmount,
    remaining,
    grantCap: program.grantCap,
    matchRatio:
      program.matchRatioDen > 0 && program.matchRatioNum > 0
        ? `${program.matchRatioNum}:${program.matchRatioDen}`
        : undefined,
    expiresAt: program.expiresAt,
    ruleHash: program.ruleHash,
  };
}

export function isProgramLive(program: StoredNetworkProgram, now = new Date()): boolean {
  if (program.status !== "active") return false;
  if (program.expiresAt && new Date(program.expiresAt).getTime() <= now.getTime()) return false;
  return true;
}

export function matchAmount(sourceAmount: number, program: StoredNetworkProgram): number {
  if (program.matchRatioDen <= 0) return 0;
  const raw = (sourceAmount * program.matchRatioNum) / program.matchRatioDen;
  return Math.min(Math.floor(raw), program.maxMatchPerCase || raw, availableAmount(program));
}
