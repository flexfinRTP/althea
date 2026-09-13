require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
const accounts = privateKey ? [privateKey] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./contracts/test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    arcTestnet: {
      url: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io",
      chainId: Number(process.env.ARC_CHAIN_ID || 5042002),
      accounts,
    },
    arcMainnet: {
      url: process.env.ARC_MAINNET_RPC_URL || "",
      chainId: Number(process.env.ARC_MAINNET_CHAIN_ID || 0),
      accounts,
    },
  },
};
