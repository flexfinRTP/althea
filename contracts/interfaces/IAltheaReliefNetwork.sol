// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAltheaReliefNetwork {
    event ProgramCreated(
        bytes32 indexed programId,
        address indexed funder,
        uint256 grantCap,
        bytes32 ruleHash
    );
    event ProgramFunded(bytes32 indexed programId, address indexed funder, uint256 amount);
    event ProgramUpdated(bytes32 indexed programId, bool active, uint256 grantCap, uint256 expiresAt);
    event GrantReserved(
        bytes32 indexed caseHash,
        address indexed provider,
        uint256 totalAmount,
        uint256 expiresAt,
        bytes32 decisionHash
    );
    event GrantReleased(
        bytes32 indexed caseHash,
        bytes32 indexed programId,
        address indexed provider,
        uint256 amount,
        bytes32 decisionHash
    );
    event GrantRefunded(bytes32 indexed caseHash, uint256 totalAmount);
    event GrantAllocated(bytes32 indexed caseHash, bytes32 indexed programId, uint256 amount);
    event GrantAllocationRefunded(bytes32 indexed caseHash, bytes32 indexed programId, uint256 amount);
    event MatchTriggered(
        bytes32 indexed caseHash,
        bytes32 indexed matchProgramId,
        bytes32 indexed sourceProgramId,
        uint256 matchAmount
    );
    event ExecutorUpdated(address indexed executor, bool authorized);

    function createProgram(
        bytes32 programId,
        address funder,
        uint256 grantCap,
        uint256 expiresAt,
        bytes32 ruleHash,
        uint16 matchBps,
        uint256 maxMatchPerCase,
        bytes32 eligibleSourceProgramId
    ) external;

    function fundProgram(bytes32 programId, uint256 amount) external;

    function reserveGrant(
        bytes32 caseHash,
        address provider,
        uint256 expiresAt,
        bytes32 decisionHash,
        bytes32[] calldata programIds,
        uint256[] calldata amounts
    ) external;

    function reserveMatchGrant(
        bytes32 caseHash,
        address provider,
        uint256 expiresAt,
        bytes32 decisionHash,
        bytes32 baseProgramId,
        uint256 baseAmount,
        bytes32 matchProgramId,
        uint256 matchAmount
    ) external;

    function settleGrant(bytes32 caseHash) external;

    function refundExpiredGrant(bytes32 caseHash) external;

    function setAuthorizedExecutor(address executor, bool authorized) external;

    function pause() external;

    function unpause() external;
}
