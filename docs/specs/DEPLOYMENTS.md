# Althea Care — Deployments

Do not hardcode chain addresses in application code. Use environment variables.

## Arc Testnet

```text
Network: Arc Testnet
Chain ID: 5042002
RPC: https://rpc.testnet.arc.io
Explorer: https://testnet.arcscan.app
USDC (ERC-20 interface): 0x3600000000000000000000000000000000000000
```

### ReliefPool

```text
contract address: [FILL AFTER npm run deploy:arc:testnet]
deployer: [FILL]
transaction hash: [FILL]
USDC address: 0x3600000000000000000000000000000000000000
```

### Circle Agent Wallet (authorized executor)

```text
address: [FILL AFTER circle wallet login --testnet]
```

### Demo provider settlement account

```text
address: [FILL DEMO_PROVIDER_SETTLEMENT_ADDRESS]
label: Example Medical Center Demo Settlement Account
```

## Arc Mainnet

Do not put real patient funds at risk for a prize deadline.

```text
RPC: ARC_MAINNET_RPC_URL
Chain ID: ARC_MAINNET_CHAIN_ID
ReliefPool: [FILL AFTER mainnet deploy]
```

ETHOnline 2026 Arc rules: a portion of Classic/From-Scratch Arc track awards is contingent on deploying the same project to Arc Mainnet by September 30, 2026. Keep testnet and mainnet configuration separate.

## Commands

```bash
npm run contracts:compile
npm run contracts:test
npm run deploy:arc:testnet
npm run deploy:arc:mainnet
```
