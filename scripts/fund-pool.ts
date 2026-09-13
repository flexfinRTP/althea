import { ethers } from "hardhat";

async function main() {
  const poolAddress = process.env.RELIEF_POOL_ADDRESS;
  const usdcAddress = process.env.USDC_ADDRESS || "0x3600000000000000000000000000000000000000";
  if (!poolAddress) throw new Error("RELIEF_POOL_ADDRESS required");
  const amount = BigInt(process.env.FUND_AMOUNT_ATOMIC || `${1000n * 10n ** 6n}`);
  const usdc = await ethers.getContractAt("MockUSDC", usdcAddress);
  const pool = await ethers.getContractAt("AltheaReliefPool", poolAddress);
  await (await usdc.approve(poolAddress, amount)).wait();
  const tx = await pool.deposit(amount);
  await tx.wait();
  console.log({ poolAddress, amount: amount.toString(), hash: tx.hash });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
