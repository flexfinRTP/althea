// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IAltheaReliefNetwork} from "./interfaces/IAltheaReliefNetwork.sol";

contract AltheaReliefNetwork is Ownable, Pausable, ReentrancyGuard, IAltheaReliefNetwork {
    using SafeERC20 for IERC20;

    enum EscrowState {
        None,
        Reserved,
        Settled,
        Refunded
    }

    struct Program {
        bool exists;
        bool active;
        address funder;
        uint256 budget;
        uint256 reserved;
        uint256 spent;
        uint256 grantCap;
        uint256 expiresAt;
        bytes32 ruleHash;
        uint16 matchBps;
        uint256 maxMatchPerCase;
        bytes32 eligibleSourceProgramId;
    }

    struct Escrow {
        address provider;
        uint256 totalAmount;
        uint256 expiresAt;
        bytes32 decisionHash;
        EscrowState state;
        uint256 allocationCount;
    }

    IERC20 public immutable usdc;

    mapping(bytes32 => Program) public programs;
    mapping(address => bool) public authorizedExecutors;
    mapping(bytes32 => Escrow) public escrows;
    mapping(bytes32 => mapping(uint256 => bytes32)) public escrowProgramIds;
    mapping(bytes32 => mapping(uint256 => uint256)) public escrowAmounts;
    mapping(bytes32 => mapping(bytes32 => uint256)) public caseProgramPaid;

    error UnauthorizedExecutor();
    error InvalidProgram();
    error ProgramInactive();
    error ProgramExpired();
    error InvalidProvider();
    error InvalidAmount();
    error InvalidExpiry();
    error LengthMismatch();
    error CapExceeded();
    error InsufficientProgramFunds();
    error EscrowExists();
    error EscrowNotReserved();
    error EscrowNotExpired();
    error AlreadySettled();

    constructor(address usdc_, address initialOwner) Ownable(initialOwner) {
        require(usdc_ != address(0), "USDC required");
        usdc = IERC20(usdc_);
    }

    function setAuthorizedExecutor(address executor, bool authorized) external onlyOwner {
        authorizedExecutors[executor] = authorized;
        emit ExecutorUpdated(executor, authorized);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function createProgram(
        bytes32 programId,
        address funder,
        uint256 grantCap,
        uint256 expiresAt,
        bytes32 ruleHash,
        uint16 matchBps,
        uint256 maxMatchPerCase,
        bytes32 eligibleSourceProgramId
    ) external onlyOwner {
        if (programId == bytes32(0) || programs[programId].exists) revert InvalidProgram();
        if (funder == address(0)) revert InvalidProgram();
        if (grantCap == 0) revert InvalidAmount();
        if (matchBps > 10_000) revert InvalidAmount();

        programs[programId] = Program({
            exists: true,
            active: true,
            funder: funder,
            budget: 0,
            reserved: 0,
            spent: 0,
            grantCap: grantCap,
            expiresAt: expiresAt,
            ruleHash: ruleHash,
            matchBps: matchBps,
            maxMatchPerCase: maxMatchPerCase,
            eligibleSourceProgramId: eligibleSourceProgramId
        });
        emit ProgramCreated(programId, funder, grantCap, ruleHash);
    }

    function setProgram(
        bytes32 programId,
        bool active,
        uint256 grantCap,
        uint256 expiresAt,
        bytes32 ruleHash
    ) external onlyOwner {
        Program storage program = programs[programId];
        if (!program.exists) revert InvalidProgram();
        if (grantCap == 0) revert InvalidAmount();
        program.active = active;
        program.grantCap = grantCap;
        program.expiresAt = expiresAt;
        program.ruleHash = ruleHash;
        emit ProgramUpdated(programId, active, grantCap, expiresAt);
    }

    function fundProgram(bytes32 programId, uint256 amount) external nonReentrant whenNotPaused {
        Program storage program = programs[programId];
        if (!program.exists || !program.active) revert InvalidProgram();
        if (amount == 0) revert InvalidAmount();
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        program.budget += amount;
        emit ProgramFunded(programId, msg.sender, amount);
    }

    function reserveGrant(
        bytes32 caseHash,
        address provider,
        uint256 expiresAt,
        bytes32 decisionHash,
        bytes32[] calldata programIds,
        uint256[] calldata amounts
    ) external nonReentrant whenNotPaused {
        if (programIds.length != amounts.length) revert LengthMismatch();
        _reserve(caseHash, provider, expiresAt, decisionHash, programIds, amounts);
    }

    function reserveMatchGrant(
        bytes32 caseHash,
        address provider,
        uint256 expiresAt,
        bytes32 decisionHash,
        bytes32 baseProgramId,
        uint256 baseAmount,
        bytes32 matchProgramId,
        uint256 matchAmount
    ) external nonReentrant whenNotPaused {
        bytes32[] memory programIds = new bytes32[](2);
        uint256[] memory amounts = new uint256[](2);
        programIds[0] = baseProgramId;
        programIds[1] = matchProgramId;
        amounts[0] = baseAmount;
        amounts[1] = matchAmount;
        _reserve(caseHash, provider, expiresAt, decisionHash, programIds, amounts);
    }

    function settleGrant(bytes32 caseHash) external nonReentrant whenNotPaused {
        if (!authorizedExecutors[msg.sender]) revert UnauthorizedExecutor();
        Escrow storage escrow = escrows[caseHash];
        if (escrow.state != EscrowState.Reserved) revert EscrowNotReserved();

        uint256 total = escrow.totalAmount;
        address provider = escrow.provider;
        bytes32 decisionHash = escrow.decisionHash;
        uint256 count = escrow.allocationCount;

        for (uint256 i = 0; i < count; i++) {
            bytes32 programId = escrowProgramIds[caseHash][i];
            uint256 amount = escrowAmounts[caseHash][i];
            Program storage program = programs[programId];
            program.reserved -= amount;
            program.spent += amount;
            caseProgramPaid[caseHash][programId] += amount;
            emit GrantReleased(caseHash, programId, provider, amount, decisionHash);
        }

        escrow.state = EscrowState.Settled;
        usdc.safeTransfer(provider, total);
    }

    function refundExpiredGrant(bytes32 caseHash) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[caseHash];
        if (escrow.state != EscrowState.Reserved) revert EscrowNotReserved();
        if (block.timestamp <= escrow.expiresAt) revert EscrowNotExpired();

        uint256 count = escrow.allocationCount;
        uint256 total = escrow.totalAmount;
        for (uint256 i = 0; i < count; i++) {
            bytes32 programId = escrowProgramIds[caseHash][i];
            uint256 amount = escrowAmounts[caseHash][i];
            programs[programId].reserved -= amount;
            emit GrantAllocationRefunded(caseHash, programId, amount);
        }
        escrow.state = EscrowState.Refunded;
        emit GrantRefunded(caseHash, total);
    }

    function available(bytes32 programId) public view returns (uint256) {
        Program storage program = programs[programId];
        if (!program.exists) return 0;
        if (program.budget < program.reserved + program.spent) return 0;
        return program.budget - program.reserved - program.spent;
    }

    function programAccounting(bytes32 programId)
        external
        view
        returns (
            uint256 budget,
            uint256 reservedAmount,
            uint256 spentAmount,
            uint256 availableAmount,
            uint256 grantCap,
            uint256 expiresAt,
            bool active
        )
    {
        Program storage program = programs[programId];
        return (
            program.budget,
            program.reserved,
            program.spent,
            available(programId),
            program.grantCap,
            program.expiresAt,
            program.active
        );
    }

    function escrowAllocation(bytes32 caseHash, uint256 index) external view returns (bytes32 programId, uint256 amount) {
        return (escrowProgramIds[caseHash][index], escrowAmounts[caseHash][index]);
    }

    function _reserve(
        bytes32 caseHash,
        address provider,
        uint256 expiresAt,
        bytes32 decisionHash,
        bytes32[] memory programIds,
        uint256[] memory amounts
    ) internal {
        if (!authorizedExecutors[msg.sender]) revert UnauthorizedExecutor();
        if (provider == address(0)) revert InvalidProvider();
        if (expiresAt <= block.timestamp) revert InvalidExpiry();
        if (programIds.length == 0) revert InvalidAmount();

        Escrow storage escrow = escrows[caseHash];
        if (escrow.state == EscrowState.Reserved || escrow.state == EscrowState.Settled) {
            revert escrow.state == EscrowState.Settled ? AlreadySettled() : EscrowExists();
        }

        uint256 total;
        for (uint256 i = 0; i < programIds.length; i++) {
            bytes32 programId = programIds[i];
            uint256 amount = amounts[i];
            if (amount == 0) revert InvalidAmount();
            Program storage program = programs[programId];
            if (!program.exists) revert InvalidProgram();
            if (!program.active) revert ProgramInactive();
            if (program.expiresAt != 0 && program.expiresAt <= block.timestamp) revert ProgramExpired();
            if (amount > program.grantCap) revert CapExceeded();
            if (available(programId) < amount) revert InsufficientProgramFunds();
            program.reserved += amount;
            escrowProgramIds[caseHash][i] = programId;
            escrowAmounts[caseHash][i] = amount;
            total += amount;
            emit GrantAllocated(caseHash, programId, amount);
            if (program.matchBps > 0) {
                emit MatchTriggered(caseHash, programId, program.eligibleSourceProgramId, amount);
            }
        }

        escrow.provider = provider;
        escrow.totalAmount = total;
        escrow.expiresAt = expiresAt;
        escrow.decisionHash = decisionHash;
        escrow.state = EscrowState.Reserved;
        escrow.allocationCount = programIds.length;
        emit GrantReserved(caseHash, provider, total, expiresAt, decisionHash);
    }
}
