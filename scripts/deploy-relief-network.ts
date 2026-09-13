import { ethers } from "hardhat";
import { writeFileSync } from "fs";
import path from "path";

async function main() {
  const usdc = process.env.USDC_ADDRESS || "0x3600000000000000000000000000000000000000";
  const executor = process.env.CIRCLE_AGENT_WALLET_ADDRESS;
  const generalKey = process.env.DEMO_PROGRAM_ID || "cz_general_v1";
  const matchKey = process.env.DEMO_MATCH_PROGRAM_ID || "chf_match_v1";
  const generalCap = BigInt(process.env.NETWORK_GENERAL_CAP_ATOMIC || `${250n * 10n ** 6n}`);
  const matchCap = BigInt(process.env.NETWORK_MATCH_CAP_ATOMIC || `${250n * 10n ** 6n}`);
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("AltheaReliefNetwork");
  const networkContract = await factory.deploy(usdc, deployer.address);
  await networkContract.waitForDeployment();
  const address = await networkContract.getAddress();

  const generalId = ethers.id(generalKey);
  const matchId = ethers.id(matchKey);
  const ruleHash = ethers.id("althea.network.rules.v1");
  await (await networkContract.createProgram(generalId, deployer.address, generalCap, 0, ruleHash, 0, 0, ethers.ZeroHash)).wait();
  await (
    await networkContract.createProgram(matchId, deployer.address, matchCap, 0, ruleHash, 10_000, matchCap, generalId)
  ).wait();
  if (executor) {
    await (await networkContract.setAuthorizedExecutor(executor, true)).wait();
  }

  const tx = networkContract.deploymentTransaction();
  const chain = await ethers.provider.getNetwork();
  const output = {
    network: chain.name,
    chainId: Number(chain.chainId),
    contractAddress: address,
    usdcAddress: usdc,
    deployer: deployer.address,
    transactionHash: tx?.hash,
    generalProgramId: generalId,
    matchProgramId: matchId,
    authorizedExecutor: executor || null,
  };
  console.log(output);
  writeFileSync(path.join(process.cwd(), "docs", "last-network-deploy.json"), JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
