// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAltheaReliefPool {
    event GrantReleased(
        bytes32 indexed caseHash,
        bytes32 indexed programId,
        address indexed provider,
        uint256 amount,
        bytes32 decisionHash
    );
    event PoolFunded(address indexed funder, uint256 amount);
    event ExecutorUpdated(address indexed executor, bool authorized);
    event ProgramCapUpdated(bytes32 indexed programId, uint256 cap);

    function deposit(uint256 amount) external;

    function releaseGrant(
        bytes32 caseHash,
        bytes32 programId,
        address provider,
        uint256 amount,
        bytes32 decisionHash
    ) external;

    function setProgramCap(bytes32 programId, uint256 maxGrantAmount) external;

    function setAuthorizedExecutor(address executor, bool authorized) external;

    function pause() external;

    function unpause() external;
}
