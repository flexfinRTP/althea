# Prompt 002 — FAP schema and eligibility

Goal: Deterministic FPL, eligibility, and timeline from docs/data_model_api.md.

Constraints:
- 2026 HHS FPL
- Demo: HH3 $51,000 insured $18,420 → $15,950 / $2,470 / 186.7% FPL
- Language: You may qualify. Never You qualify.

Result: lib/fap/* plus tests.

# Prompt 003 — Application workflow

Goal: Application packet, mark submitted, hospital simulated decision, PATCH /api/cases/:id.

# Prompt 004 — World Selfie Check

Goal: IDKit v4 selfieCheckLegacy, RP signature, /v4/verify, Manual Review. No fake proofs.

# Prompt 005 — Relief rules and agent

Goal: Deterministic rules + Circle wallet execute releaseGrant. $500 → human review. LLM does not grant money.

# Prompt 006 — ReliefPool

Goal: OpenZeppelin AltheaReliefPool, IAltheaReliefPool, tests, deploy setProgramCap($500), setAuthorizedExecutor.

# Prompt 007 — Privy treasury

Goal: Allowlisted ReliefPool destination, Fund Relief Pool, Test Restricted Transfer.

# Prompt 008 — Patient journey polish

Goal: /result/demo, bill reduction, sequential agent trace, policy source, /how, print packet, skip link, error/not-found.

# Prompt 009 — Docs and disclosure

Goal: Canonical specs copies, integration notes, AI disclosure file-level, World feedback honesty, BUILD_STATUS.
