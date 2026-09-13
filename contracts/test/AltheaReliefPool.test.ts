import { expect } from "chai";
import { ethers } from "hardhat";

describe("AltheaReliefPool", function () {
  const programId = ethers.id("cz_general_v1");
  const caseHash = ethers.id("case-one");
  const decisionHash = ethers.id("decision-one");
  const cap = 500n * 10n ** 6n;
  const grant = 500n * 10n ** 6n;

  async function deploy() {
    const [owner, executor, stranger, provider, donor] = await ethers.getSigners();
    const usdc = await (await ethers.getContractFactory("MockUSDC")).deploy();
    const pool = await (await ethers.getContractFactory("AltheaReliefPool")).deploy(
      await usdc.getAddress(),
      owner.address,
    );
    await pool.setAuthorizedExecutor(executor.address, true);
    await pool.setProgramCap(programId, cap);
    await usdc.mint(donor.address, 25_000n * 10n ** 6n);
    await usdc.connect(donor).approve(await pool.getAddress(), 25_000n * 10n ** 6n);
    return { owner, executor, stranger, provider, donor, usdc, pool };
  }

  it("deploys", async function () {
    const { pool, usdc } = await deploy();
    expect(await pool.usdc()).to.equal(await usdc.getAddress());
  });

  it("deposit succeeds", async function () {
    const { pool, donor, usdc } = await deploy();
    await expect(pool.connect(donor).deposit(1_000n * 10n ** 6n)).to.emit(pool, "PoolFunded");
    expect(await usdc.balanceOf(await pool.getAddress())).to.equal(1_000n * 10n ** 6n);
  });

  it("authorized grant succeeds and emits GrantReleased", async function () {
    const { pool, donor, executor, provider, usdc } = await deploy();
    await pool.connect(donor).deposit(1_000n * 10n ** 6n);
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash),
    )
      .to.emit(pool, "GrantReleased")
      .withArgs(caseHash, programId, provider.address, grant, decisionHash);
    expect(await usdc.balanceOf(provider.address)).to.equal(grant);
  });

  it("unauthorized executor fails", async function () {
    const { pool, donor, stranger, provider } = await deploy();
    await pool.connect(donor).deposit(1_000n * 10n ** 6n);
    await expect(
      pool.connect(stranger).releaseGrant(caseHash, programId, provider.address, grant, decisionHash),
    ).to.be.revertedWithCustomError(pool, "UnauthorizedExecutor");
  });

  it("duplicate case fails", async function () {
    const { pool, donor, executor, provider } = await deploy();
    await pool.connect(donor).deposit(1_000n * 10n ** 6n);
    await pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash);
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash),
    ).to.be.revertedWithCustomError(pool, "AlreadyPaid");
  });

  it("grant over program cap fails", async function () {
    const { pool, donor, executor, provider } = await deploy();
    await pool.connect(donor).deposit(2_000n * 10n ** 6n);
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, provider.address, cap + 1n, decisionHash),
    ).to.be.revertedWithCustomError(pool, "CapExceeded");
  });

  it("zero provider fails", async function () {
    const { pool, donor, executor } = await deploy();
    await pool.connect(donor).deposit(1_000n * 10n ** 6n);
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, ethers.ZeroAddress, grant, decisionHash),
    ).to.be.revertedWithCustomError(pool, "InvalidProvider");
  });

  it("insufficient funds fails", async function () {
    const { pool, donor, executor, provider } = await deploy();
    await pool.connect(donor).deposit(100n * 10n ** 6n);
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash),
    ).to.be.reverted;
  });

  it("paused contract fails and unpause restores functionality", async function () {
    const { pool, donor, executor, provider, owner } = await deploy();
    await pool.connect(donor).deposit(1_000n * 10n ** 6n);
    await pool.connect(owner).pause();
    await expect(
      pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash),
    ).to.be.revertedWithCustomError(pool, "EnforcedPause");
    await pool.connect(owner).unpause();
    await pool.connect(executor).releaseGrant(caseHash, programId, provider.address, grant, decisionHash);
    expect(await pool.paidCases(caseHash)).to.equal(true);
  });
});
