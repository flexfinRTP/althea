# Althea Care — Build Status

Updated during implementation. Entries are concrete.

## DONE

- [PASS] Repository inspected. Docs-only starting state on `main`.
- [PASS] Specification suite read.
- [PASS] Sponsor research: Arc 5042002, USDC `0x3600000000000000000000000000000000000000`, Privy node policies, World IDKit v4 Selfie Check, Circle CLI `wallet execute`.
- [PASS] 2026 HHS FPL tables.
- [PASS] Next.js app, patient journey including `/result/demo`, FAP engine, APIs including PATCH, Relief rules, ReliefPool + interface, Privy treasury UI/API, Circle agent tools, World IDKit client.
- [PASS] Bill reduction, sequential agent trace, policy source, `/how`, print packet, skip-link, error/not-found.
- [PASS] Unit tests written for FPL, eligibility, timeline, Relief rules, demo-story eval, demo case bootstrap, contract tests, second hospital fixture.
- [PASS] Canonical spec copies in `docs/specs/`, integration notes, AI disclosure file-level entries, World feedback honesty banner.

## IN PROGRESS

- Live sponsor credentials and onchain deploy (Justin).

## BLOCKED

- [BLOCKED] Live Privy treasury wallet ID / policy ID / app credentials.
  Reason: require Justin's Privy Dashboard app, wallet, and policy creation.
  Fallback currently implemented: policy construction + sendTransaction code paths; UI shows configuration needed when credentials are absent.
- [BLOCKED] World Developer Portal app ID, RP ID, RP signing key, Selfie Check feature flag.
  Reason: Selfie Check is access-gated (`developers@toolsforhumanity.com`).
  Fallback currently implemented: real IDKit Selfie Check client + backend verify; Manual Review path; no fake proof success.
- [BLOCKED] Circle Agent Stack authenticated CLI session and agent wallet on Arc testnet.
  Reason: `circle wallet login --testnet` is an interactive/OTP human action.
  Fallback currently implemented: Circle CLI wrapper calling `circle wallet execute` for `releaseGrant`; agent tools are real; execution reports BLOCKED until wallet/session exists.
- [BLOCKED] Arc ReliefPool deployed address and funded test USDC.
  Reason: deploy script is present; onchain deploy needs `DEPLOYER_PRIVATE_KEY` and faucet USDC.
  Fallback currently implemented: contract + tests + testnet/mainnet scripts; `docs/DEPLOYMENTS.md` filled after Justin runs deploy.

## TODO (Justin)

- Copy `.env.example` to `.env.local` and fill credentials.
- `npm test`
- `npm run contracts:test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run dev` then walk the Definition of Done flow.
- `npm run deploy:arc:testnet` after funding a deployer.
- `circle wallet login you@email --testnet` then set `CIRCLE_AGENT_WALLET_ADDRESS`.
- Replace remaining World Sandbox `[FILL AFTER TEST]` items after a real Selfie Check.
- Record the 2–4 minute demo video.

## SPONSOR ELIGIBILITY STATUS

| Partner | Track | Status |
| --- | --- | --- |
| Privy | Best B2B Financial Product | IN PROGRESS — treasury UI + policy allowlist to ReliefPool. Live wallet blocked on credentials. |
| Privy | Best Financial Flow | IN PROGRESS — Fund Relief Pool USDC transfer path. Live tx blocked on credentials. |
| Arc | Best DeFi / Onchain Finance | IN PROGRESS — ReliefPool + USDC + tests + deploy scripts. Live tx blocked on deploy/fund. |
| Arc | Best Agentic Economy / Circle Agent Stack | IN PROGRESS — Relief Agent tools + `circle wallet execute`. Live execute blocked on CLI login. |
| World | Selfie Check | IN PROGRESS — IDKit Selfie Check + verify API. Live sandbox blocked on app credentials / feature flag. |
