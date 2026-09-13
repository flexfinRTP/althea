import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("AltheaReliefNetwork", function () {
  const generalId = ethers.id("cz_general_v1");
  const matchId = ethers.id("chf_match_v1");
  const caseHash = ethers.id("case-network-one");
  const decisionHash = ethers.id("decision-network-one");
  const ruleHash = ethers.id("rule-v1");
  const base = 250n * 10n ** 6n;
  const matchAmt = 250n * 10n ** 6n;
  const cap = 250n * 10n ** 6n;

  async function deploy() {
    const [owner, executor, stranger, provider, althea, foundation] = await ethers.getSigners();
    const usdc = await (await ethers.getContractFactory("MockUSDC")).deploy();
    const network = await (await ethers.getContractFactory("AltheaReliefNetwork")).deploy(
      await usdc.getAddress(),
      owner.address,
    );
    await network.setAuthorizedExecutor(executor.address, true);
    await network.createProgram(generalId, althea.address, cap, 0, ruleHash, 0, 0, ethers.ZeroHash);
    await network.createProgram(matchId, foundation.address, cap, 0, ruleHash, 10_000, cap, generalId);
    await usdc.mint(althea.address, 25_000n * 10n ** 6n);
    await usdc.mint(foundation.address, 2_000n * 10n ** 6n);
    await usdc.connect(althea).approve(await network.getAddress(), 25_000n * 10n ** 6n);
    await usdc.connect(foundation).approve(await network.getAddress(), 2_000n * 10n ** 6n);
    return { owner, executor, stranger, provider, althea, foundation, usdc, network };
  }

  it("funds restricted programs and reports accounting", async function () {
    const { network, althea, foundation } = await deploy();
    await expect(network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n)).to.emit(
      network,
      "ProgramFunded",
    );
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    const general = await network.programAccounting(generalId);
    expect(general.budget).to.equal(1_000n * 10n ** 6n);
    expect(general.availableAmount).to.equal(1_000n * 10n ** 6n);
    expect(general.reservedAmount).to.equal(0);
    expect(general.spentAmount).to.equal(0);
  });

  it("reserves then settles a 1:1 match waterfall", async function () {
    const { network, althea, foundation, executor, provider, usdc } = await deploy();
    await network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n);
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    const expiresAt = (await time.latest()) + 86_400;
    await expect(
      network
        .connect(executor)
        .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt),
    )
      .to.emit(network, "GrantReserved")
      .and.to.emit(network, "MatchTriggered");

    expect(await network.available(generalId)).to.equal(750n * 10n ** 6n);
    expect((await network.programAccounting(matchId)).reservedAmount).to.equal(matchAmt);
    expect(await usdc.balanceOf(provider.address)).to.equal(0);

    await expect(network.connect(executor).settleGrant(caseHash)).to.emit(network, "GrantReleased");
    expect(await usdc.balanceOf(provider.address)).to.equal(base + matchAmt);
    expect((await network.programAccounting(generalId)).spentAmount).to.equal(base);
    expect((await network.programAccounting(matchId)).reservedAmount).to.equal(0);
    expect((await network.escrows(caseHash)).state).to.equal(2);
  });

  it("refunds an expired reservation to the program", async function () {
    const { network, althea, foundation, executor, provider } = await deploy();
    await network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n);
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    const expiresAt = (await time.latest()) + 60;
    await network
      .connect(executor)
      .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt);
    await time.increase(120);
    await expect(network.connect(executor).refundExpiredGrant(caseHash)).to.emit(network, "GrantRefunded");
    expect(await network.available(generalId)).to.equal(1_000n * 10n ** 6n);
    expect(await network.available(matchId)).to.equal(2_000n * 10n ** 6n);
    expect((await network.escrows(caseHash)).state).to.equal(3);
  });

  it("rejects unauthorized reserve, over-cap, and duplicate reserve", async function () {
    const { network, althea, foundation, stranger, executor, provider } = await deploy();
    await network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n);
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    const expiresAt = (await time.latest()) + 86_400;
    await expect(
      network
        .connect(stranger)
        .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt),
    ).to.be.revertedWithCustomError(network, "UnauthorizedExecutor");
    await expect(
      network
        .connect(executor)
        .reserveMatchGrant(
          caseHash,
          provider.address,
          expiresAt,
          decisionHash,
          generalId,
          cap + 1n,
          matchId,
          matchAmt,
        ),
    ).to.be.revertedWithCustomError(network, "CapExceeded");
    await network
      .connect(executor)
      .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt);
    await expect(
      network
        .connect(executor)
        .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt),
    ).to.be.revertedWithCustomError(network, "EscrowExists");
  });

  it("reserves a three-program waterfall with GrantAllocated", async function () {
    const { network, althea, foundation, executor, provider, usdc } = await deploy();
    const communityId = ethers.id("comm_foundation_v1");
    await network.createProgram(communityId, althea.address, 200n * 10n ** 6n, 0, ruleHash, 0, 0, ethers.ZeroHash);
    await network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n);
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    await usdc.connect(althea).approve(await network.getAddress(), 200n * 10n ** 6n);
    await network.connect(althea).fundProgram(communityId, 200n * 10n ** 6n);
    const expiresAt = (await time.latest()) + 86_400;
    await expect(
      network
        .connect(executor)
        .reserveGrant(
          ethers.id("case-network-three"),
          provider.address,
          expiresAt,
          ethers.id("decision-network-three"),
          [generalId, matchId, communityId],
          [base, matchAmt, 200n * 10n ** 6n],
        ),
    ).to.emit(network, "GrantAllocated");
    expect(await network.available(communityId)).to.equal(0);
  });

  it("rejects settle before reserve and refund before expiry", async function () {
    const { network, althea, foundation, executor, provider } = await deploy();
    await network.connect(althea).fundProgram(generalId, 1_000n * 10n ** 6n);
    await network.connect(foundation).fundProgram(matchId, 2_000n * 10n ** 6n);
    await expect(network.connect(executor).settleGrant(caseHash)).to.be.revertedWithCustomError(
      network,
      "EscrowNotReserved",
    );
    const expiresAt = (await time.latest()) + 86_400;
    await network
      .connect(executor)
      .reserveMatchGrant(caseHash, provider.address, expiresAt, decisionHash, generalId, base, matchId, matchAmt);
    await expect(network.connect(executor).refundExpiredGrant(caseHash)).to.be.revertedWithCustomError(
      network,
      "EscrowNotExpired",
    );
  });
});
