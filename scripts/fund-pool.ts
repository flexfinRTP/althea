import { ethers } from "hardhat";

const IERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

async function main() {
  const poolAddress = process.env.RELIEF_POOL_ADDRESS;
  const usdcAddress = process.env.USDC_ADDRESS || "0x3600000000000000000000000000000000000000";
  if (!poolAddress) throw new Error("RELIEF_POOL_ADDRESS required");
  const amount = BigInt(process.env.FUND_AMOUNT_ATOMIC || `${1000n * 10n ** 6n}`);
  const [signer] = await ethers.getSigners();
  const usdc = new ethers.Contract(usdcAddress, IERC20_ABI, signer);
  const pool = await ethers.getContractAt("AltheaReliefPool", poolAddress);
  await (await usdc.approve(poolAddress, amount)).wait();
  const tx = await pool.deposit(amount);
  await tx.wait();
  console.log({
    poolAddress,
    amount: amount.toString(),
    hash: tx.hash,
    funder: signer.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
