# Althea ReliefPool

Contract: `contracts/AltheaReliefPool.sol`

Interface: `contracts/interfaces/IAltheaReliefPool.sol`

## Behavior

- USDC only (ERC-20 at `USDC_ADDRESS`)
- `deposit(amount)` funds the pool
- `releaseGrant(caseHash, programId, provider, amount, decisionHash)` pays once per `caseHash`
- `setProgramCap` required before any grant (demo cap = 500 USDC / 6 decimals)
- `setAuthorizedExecutor` allowlists the Circle agent wallet
- `pause` / `unpause`

## Never onchain

Name, DOB, diagnosis, records, income, bills, insurance, selfie.

`caseHash` = keccak256(domain + random case id + salt).

## Commands

```bash
npm run contracts:compile
npm run contracts:test
npm run deploy:arc:testnet
npm run fund:arc:testnet
```

Fill `docs/DEPLOYMENTS.md` after deploy. Do not invent addresses.
