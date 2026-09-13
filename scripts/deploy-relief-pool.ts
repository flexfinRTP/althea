import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import path from "path";

async function main() {
  const usdc = process.env.USDC_ADDRESS || "0x3600000000000000000000000000000000000000";
  const programKey = process.env.DEMO_PROGRAM_ID || "cz_general_v1";
  const programId = ethers.id(programKey);
  const programCap = BigInt(process.env.PROGRAM_CAP_ATOMIC || `${500n * 10n ** 6n}`);
  const executor = process.env.CIRCLE_AGENT_WALLET_ADDRESS;
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("AltheaReliefPool");
  const pool = await factory.deploy(usdc, deployer.address);
  await pool.waitForDeployment();
  const address = await pool.getAddress();
  await (await pool.setProgramCap(programId, programCap)).wait();
  if (executor) {
    await (await pool.setAuthorizedExecutor(executor, true)).wait();
  }
  const tx = pool.deploymentTransaction();
  const network = await ethers.provider.getNetwork();
  const output = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: address,
    usdcAddress: usdc,
    deployer: deployer.address,
    transactionHash: tx?.hash,
    programId,
    programCap: programCap.toString(),
    authorizedExecutor: executor || null,
    providerLabel: "Example Medical Center Demo Settlement Account",
  };
  console.log(output);
  writeFileSync(path.join(process.cwd(), "docs", "last-deploy.json"), JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
