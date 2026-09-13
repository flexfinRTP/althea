import { ApiError } from "@/lib/errors";
import type { EscrowStatus, StoredGrantAllocation, StoredGrantEscrow, StoredNetworkProgram } from "@/lib/network/types";
import { availableAmount } from "@/lib/network/accounting";
import type { ReliefRoute } from "@/lib/network/types";

export const ESCROW_TTL_SECONDS = 60 * 60 * 24;

export function allocationsFromRoute(escrowId: string, route: ReliefRoute): StoredGrantAllocation[] {
  return route.selected.map((source, index) => ({
    id: `${escrowId}_alloc_${index}`,
    escrowId,
    programId: source.programId,
    amount: source.amount,
    role: source.role,
  }));
}

export function applyReserve(
  programs: StoredNetworkProgram[],
  allocations: StoredGrantAllocation[],
): StoredNetworkProgram[] {
  return programs.map((program) => {
    const take = allocations.filter((row) => row.programId === program.id).reduce((sum, row) => sum + row.amount, 0);
    if (take <= 0) return program;
    if (!availableAmount(program) || availableAmount(program) < take) {
      throw new ApiError("INSUFFICIENT_FUNDS", "A selected program no longer has available USDC.");
    }
    return { ...program, reservedAmount: program.reservedAmount + take };
  });
}

export function applySettle(
  programs: StoredNetworkProgram[],
  allocations: StoredGrantAllocation[],
): StoredNetworkProgram[] {
  return programs.map((program) => {
    const take = allocations.filter((row) => row.programId === program.id).reduce((sum, row) => sum + row.amount, 0);
    if (take <= 0) return program;
    return {
      ...program,
      reservedAmount: Math.max(0, program.reservedAmount - take),
      spentAmount: program.spentAmount + take,
    };
  });
}

export function applyRefund(
  programs: StoredNetworkProgram[],
  allocations: StoredGrantAllocation[],
): StoredNetworkProgram[] {
  return programs.map((program) => {
    const take = allocations.filter((row) => row.programId === program.id).reduce((sum, row) => sum + row.amount, 0);
    if (take <= 0) return program;
    return { ...program, reservedAmount: Math.max(0, program.reservedAmount - take) };
  });
}

export function assertEscrowTransition(current: EscrowStatus, next: EscrowStatus) {
  const allowed: Record<EscrowStatus, EscrowStatus[]> = {
    approved: ["reserved"],
    reserved: ["settled", "refunded"],
    settled: [],
    refunded: [],
  };
  if (!allowed[current].includes(next)) {
    throw new ApiError("INVALID_ESCROW_STATE", `Grant cannot move from ${current} to ${next}.`);
  }
}

export function escrowExpired(escrow: StoredGrantEscrow, now = new Date()): boolean {
  return new Date(escrow.expiresAt).getTime() <= now.getTime();
}
