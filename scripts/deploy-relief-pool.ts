import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import path from "path";

async function main() {
  const usdc = process.env.USDC_ADDRESS || "0x3600000000000000000000000000000000000000";
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("AltheaReliefPool");
  const pool = await factory.deploy(usdc, deployer.address);
  await pool.waitForDeployment();
  const address = await pool.getAddress();
  const tx = pool.deploymentTransaction();
  const network = await ethers.provider.getNetwork();
  const output = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: address,
    usdcAddress: usdc,
    deployer: deployer.address,
    transactionHash: tx?.hash,
  };
  console.log(output);
  writeFileSync(path.join(process.cwd(), "docs", "last-deploy.json"), JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
