// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IAltheaReliefPool} from "./interfaces/IAltheaReliefPool.sol";

contract AltheaReliefPool is Ownable, Pausable, ReentrancyGuard, IAltheaReliefPool {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;

    mapping(bytes32 => bool) public paidCases;
    mapping(bytes32 => uint256) public programGrantCaps;
    mapping(address => bool) public authorizedExecutors;

    error UnauthorizedExecutor();
    error AlreadyPaid();
    error CapExceeded();
    error InvalidProvider();
    error InvalidAmount();
    error CapRequired();

    constructor(address usdc_, address initialOwner) Ownable(initialOwner) {
        require(usdc_ != address(0), "USDC required");
        usdc = IERC20(usdc_);
    }

    function setAuthorizedExecutor(address executor, bool authorized) external onlyOwner {
        authorizedExecutors[executor] = authorized;
        emit ExecutorUpdated(executor, authorized);
    }

    function setProgramCap(bytes32 programId, uint256 maxGrantAmount) external onlyOwner {
        programGrantCaps[programId] = maxGrantAmount;
        emit ProgramCapUpdated(programId, maxGrantAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit PoolFunded(msg.sender, amount);
    }

    function releaseGrant(
        bytes32 caseHash,
        bytes32 programId,
        address provider,
        uint256 amount,
        bytes32 decisionHash
    ) external nonReentrant whenNotPaused {
        if (!authorizedExecutors[msg.sender]) revert UnauthorizedExecutor();
        if (paidCases[caseHash]) revert AlreadyPaid();
        if (provider == address(0)) revert InvalidProvider();
        if (amount == 0) revert InvalidAmount();
        uint256 cap = programGrantCaps[programId];
        if (cap == 0) revert CapRequired();
        if (amount > cap) revert CapExceeded();

        paidCases[caseHash] = true;
        usdc.safeTransfer(provider, amount);
        emit GrantReleased(caseHash, programId, provider, amount, decisionHash);
    }
}
