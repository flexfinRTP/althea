import { BigInt } from "@graphprotocol/graph-ts";
import {
  ProgramCreated,
  ProgramFunded,
  GrantReserved,
  GrantReleased,
  GrantRefunded,
  GrantAllocated,
  GrantAllocationRefunded,
  MatchTriggered,
} from "../generated/AltheaReliefNetwork/AltheaReliefNetwork";
import { Program, GrantEscrow, MatchEvent } from "../generated/schema";

export function handleProgramCreated(event: ProgramCreated): void {
  const program = new Program(event.params.programId.toHex());
  program.funder = event.params.funder;
  program.grantCap = event.params.grantCap;
  program.ruleHash = event.params.ruleHash;
  program.budget = BigInt.fromI32(0);
  program.reserved = BigInt.fromI32(0);
  program.spent = BigInt.fromI32(0);
  program.available = BigInt.fromI32(0);
  program.active = true;
  program.createdAt = event.block.timestamp;
  program.save();
}

export function handleProgramFunded(event: ProgramFunded): void {
  const program = Program.load(event.params.programId.toHex());
  if (!program) return;
  program.budget = program.budget.plus(event.params.amount);
  program.available = program.budget.minus(program.reserved).minus(program.spent);
  program.save();
}

export function handleGrantAllocated(event: GrantAllocated): void {
  const program = Program.load(event.params.programId.toHex());
  if (!program) return;
  program.reserved = program.reserved.plus(event.params.amount);
  program.available = program.budget.minus(program.reserved).minus(program.spent);
  program.save();
}

export function handleGrantAllocationRefunded(event: GrantAllocationRefunded): void {
  const program = Program.load(event.params.programId.toHex());
  if (!program) return;
  if (program.reserved.ge(event.params.amount)) {
    program.reserved = program.reserved.minus(event.params.amount);
  }
  program.available = program.budget.minus(program.reserved).minus(program.spent);
  program.save();
}

export function handleGrantReserved(event: GrantReserved): void {
  const escrow = new GrantEscrow(event.params.caseHash.toHex());
  escrow.provider = event.params.provider;
  escrow.totalAmount = event.params.totalAmount;
  escrow.expiresAt = event.params.expiresAt;
  escrow.decisionHash = event.params.decisionHash;
  escrow.state = "reserved";
  escrow.createdAt = event.block.timestamp;
  escrow.save();
}

export function handleGrantReleased(event: GrantReleased): void {
  const escrow = GrantEscrow.load(event.params.caseHash.toHex());
  if (escrow) {
    escrow.state = "settled";
    escrow.save();
  }
  const program = Program.load(event.params.programId.toHex());
  if (!program) return;
  program.spent = program.spent.plus(event.params.amount);
  if (program.reserved.ge(event.params.amount)) {
    program.reserved = program.reserved.minus(event.params.amount);
  }
  program.available = program.budget.minus(program.reserved).minus(program.spent);
  program.save();
}

export function handleGrantRefunded(event: GrantRefunded): void {
  const escrow = GrantEscrow.load(event.params.caseHash.toHex());
  if (!escrow) return;
  escrow.state = "refunded";
  escrow.save();
}

export function handleMatchTriggered(event: MatchTriggered): void {
  const row = new MatchEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  row.caseHash = event.params.caseHash;
  row.matchProgramId = event.params.matchProgramId;
  row.sourceProgramId = event.params.sourceProgramId;
  row.matchAmount = event.params.matchAmount;
  row.createdAt = event.block.timestamp;
  row.save();
}
