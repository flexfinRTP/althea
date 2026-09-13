# CareZero — ETHOnline 2026 Implementation Plan

## 1. Objective

Build a complete CareZero MVP that demonstrates:

```text
$18,420 hospital bill
↓
FAP analysis
↓
$15,950 potential/approved hospital assistance
↓
$2,470 verified residual
↓
World Selfie Check
↓
CareZero Relief evaluation
↓
Privy-controlled approval
↓
Circle Relief Agent
↓
$500 USDC released on Arc
↓
$1,970 remaining
```

The implementation goal is not maximum features.

The implementation goal is:

# One complete, technically credible, emotionally compelling end-to-end flow.

---

# 2. Build Philosophy

Prioritize:

1. working sponsor integrations;
2. stable demo;
3. clear product story;
4. privacy boundaries;
5. documentation.

Do not prioritize:

* nationwide hospital coverage;
* production-grade OCR;
* mobile apps;
* advanced AI chat;
* complex hospital integrations;
* state-by-state law engine;
* patient uploads;
* fancy analytics.

---

# 3. Critical Path

The project cannot succeed without:

```text
FAP result
+
World check
+
Privy control
+
Privy financial flow
+
Arc smart contract
+
Circle Agent Stack
+
Arc transaction
+
final bill reduction
```

Build in that order of dependency.

---

# 4. Phase 0 — Repository Setup

Create:

```text
carezero/
```

Initialize:

* Git;
* Next.js;
* TypeScript;
* ESLint;
* Prettier;
* Tailwind;
* testing;
* environment configuration.

Add:

```text
/docs/
```

Immediately preserve:

* MASTER_BLUEPRINT.md
* TECH_ARCHITECTURE.md
* PRIZE_STRATEGY.md
* BUSINESS_MARKETING.md
* RESEARCH_EVIDENCE.md
* SECURITY_PRIVACY_COMPLIANCE.md
* DATA_MODEL_API.md
* IMPLEMENTATION_PLAN.md
* DEMO_SCRIPT.md
* prompts/specs used

This is important for ETHGlobal's AI/spec-development disclosure requirements.

---

# 5. Phase 1 — Static Patient Journey

Before blockchain integration, build the complete UI path using fixtures.

Pages:

```text
/
↓
/check
↓
/result/demo
↓
/application/demo
↓
/case/demo
↓
/case/demo/decision
↓
/case/demo/relief
↓
/case/demo/verify
↓
/case/demo/relief-status
↓
/case/demo/success
```

Use the exact fixture:

```text
Bill:
$18,420

Hospital assistance:
$15,950

Residual:
$2,470

CareZero Relief:
$500

Final:
$1,970
```

Goal:

The complete emotional demo works before integrations.

---

# 6. Landing Page Implementation

Hero:

```text
An $18,000 hospital bill
doesn't always mean
you owe $18,000.
```

Subtext:

> CareZero helps you find and understand hospital financial assistance before an unaffordable bill becomes debt.

CTA:

# Check My Bill

Trust line:

```text
No loans.
No percentage of your assistance.
No medical information published onchain.
```

---

# 7. Check My Bill Form

Fields:

```text
Hospital
Bill amount
Household size
Household annual income
Insurance status
First billing statement date
```

Hospital defaults:

```text
Example Medical Center
```

Demo values available via:

# Load Demo

This is useful during judging.

---

# 8. FAP Fixture

Create:

```text
/data/hospitals/example-medical-center/fap-2026.json
```

Include:

* free-care rule;
* discounted-care rule;
* insured eligibility;
* required documents;
* application URL placeholder;
* citations;
* collections summary.

The exact policy should yield:

```text
$15,950 estimated assistance
```

for:

```text
bill 18,420
household 3
income 51,000
insured
```

For demo consistency, it is acceptable for the fictional policy to encode a rule that produces the exact amount.

Clearly label:

# Fictional demonstration policy.

---

# 9. FPL Logic

Add:

```text
/data/fpl/2026.json
```

Implement:

```ts
calculateFplPercent()
```

Add unit tests.

Use the result as one input to the fictional policy engine.

Do not let the LLM calculate it.

---

# 10. Eligibility Engine

Create:

```text
/lib/fap/calculate.ts
```

Input:

```text
patient data
policy
FPL
```

Output:

```text
potential eligibility
estimated assistance
estimated remainder
reason
citations
```

Tests:

```text
eligible
not eligible
needs more info
insured allowed
insured not allowed
residency requirement
missing household size
```

---

# 11. Explainability Screen

The result page must show:

# You may qualify for financial assistance.

Then:

```text
Original bill                  $18,420

Potential hospital assistance $15,950

Potential remainder            $2,470
```

Button:

**Why?**

Drawer:

```text
Based on:
Household size: 3
Annual household income: $51,000
Policy income range: ...
Insurance eligibility: allowed
```

Source:

**View policy source**

This demonstrates trust and avoids black-box AI.

---

# 12. Regulatory Timeline

Implement:

```text
/lib/fap/timeline.ts
```

Input:

```text
first bill date
```

Output:

```text
notification day
application period day
status
educational message
```

Display:

```text
Approximate federal FAP application-period status:
Day 24 of 240
```

Disclaimer:

> This is educational information, not legal advice.

---

# 13. Application Preparation

Build:

# Prepare Application

Screen shows:

```text
Hospital application
Required documents
Submission method
Billing office
Important dates
```

Button:

# Mark as Submitted

No fake API submission.

---

# 14. Hospital Decision Demo Control

Add a hidden/demo admin control.

Button:

```text
Simulate Hospital Approval
```

Triggers:

```text
approved assistance = 15,950
residual = 2,470
```

Patient screen displays:

# Hospital Decision Recorded

Badge:

# SIMULATED FOR DEMO

---

# 15. Relief Entry Screen

Copy:

# Hospital assistance helped.

## But $2,470 remains.

CareZero Relief may be able to help with part of the verified remaining balance.

Program:

```text
CareZero General Medical Hardship Fund
```

Available:

```text
$25,000
```

Maximum grant:

```text
$500
```

CTA:

# Check CareZero Relief

---

# 16. Phase 2 — Database

Add PostgreSQL/Supabase.

Implement:

* hospitals;
* policies;
* cases;
* estimates;
* hospital decisions;
* Relief requests;
* World verifications;
* Relief decisions;
* grants;
* audit events.

Do not add unnecessary patient document storage.

---

# 17. Phase 3 — World Integration

Goal:

One real sandbox Selfie Check.

Implement:

```text
/case/:id/verify
```

Pre-check explanation:

> This is only for the CareZero Relief Fund.

> It does not determine your hospital financial-assistance eligibility.

Buttons:

# Continue

# Request Manual Review

World success:

```text
✓ Liveness check complete
```

Store only:

```text
status
timestamp
verification reference
```

---

# 18. World Error Handling

Support:

```text
cancelled
failed
expired
sandbox unavailable
verification error
```

Do not dead-end the demo.

In demo mode:

Provide:

```text
Try Again
```

and:

```text
Use Sandbox Success State
```

only if consistent with World hackathon sandbox rules.

Do not fake the sponsor integration.

---

# 19. WORLD_FEEDBACK.md

Create immediately after integration.

Write observations while they are fresh.

Required sections:

```text
Documentation
Developer Portal
Sandbox
Proof states
Test users
Errors
Edge cases
Confusing areas
Missing information
Bugs
Suggestions
```

Do not wait until submission night.

---

# 20. Phase 4 — Arc Smart Contract

Create:

```text
/contracts/CareZeroReliefPool.sol
```

Use OpenZeppelin.

Implement:

```text
deposit
setProgramCap
setAuthorizedExecutor
releaseGrant
pause
unpause
```

State:

```text
paidCases
programCaps
authorizedExecutors
```

---

# 21. Contract Unit Tests

Tests:

```text
deployment
deposit
authorized release
unauthorized rejected
duplicate rejected
over-cap rejected
paused rejected
insufficient pool rejected
event emitted
correct USDC transfer
```

Do not continue until tests pass.

---

# 22. Arc Testnet Deployment

Create script:

```text
/scripts/deploy-relief-pool.ts
```

Outputs:

```text
network
contract address
USDC address
deployer
transaction hash
```

Write deployment information to:

```text
/docs/DEPLOYMENTS.md
```

---

# 23. Fund the Relief Pool

Use test USDC.

Target displayed demo balance:

```text
25,000 USDC
```

If test faucet availability prevents exactly 25,000:

UI may display demo denominated value while technical dashboard accurately displays actual test amount.

Do not misrepresent actual onchain value.

Simplest:

use a smaller onchain amount and label:

```text
Demo financial model: $25,000
Testnet pool balance: X test USDC
```

---

# 24. Phase 5 — Privy

Set up:

```text
CareZero Relief Treasury
```

Implement at least one real policy/control.

Recommended minimum:

```text
authorized contract = ReliefPool
```

If supported cleanly:

Add transaction/value restrictions.

Optional:

Add key quorum.

---

# 25. Privy Admin Screen

Route:

```text
/admin/treasury
```

Show:

```text
CareZero Relief Treasury

Balance

Network:
Arc

Approved Destination:
CareZero ReliefPool

Policy:
Active
```

Button:

# Fund Relief Pool

---

# 26. Privy Policy-Failure Demo

Optional but high value.

Button:

```text
Test Restricted Transfer
```

Attempt invalid:

```text
unknown destination
```

Expected:

# Blocked by CareZero Treasury Policy

Then execute correct ReliefPool funding.

This visibly proves sponsor depth.

---

# 27. Phase 6 — Relief Rules Engine

Create:

```text
/lib/relief/rules.ts
```

Pure function.

Input:

```ts
{
  fapCompleted,
  residualBalanceVerified,
  residualBalance,
  worldStatus,
  duplicateRisk,
  requestedAmount,
  maxGrant,
  autoApprovalCap,
  fundBalance
}
```

Output:

```ts
{
  decision,
  grantAmount,
  reasonCodes
}
```

Tests:

```text
auto approved
human review required
missing World
no residual
duplicate risk
insufficient funds
over max
FAP incomplete
```

---

# 28. Demo Grant Decision

For:

```text
$500 request
```

Set:

```text
autoApprovalCap = $250
```

Result:

```text
human_review_required
```

This creates a Privy approval moment.

Reviewer clicks:

# Approve $500

Then agent executes.

---

# 29. Phase 7 — Circle Agent Stack

Create:

```text
/lib/relief/agent.ts
```

Agent tools:

```text
getCaseReliefFacts
getProgramRules
getPoolBalance
evaluateReliefRequest
executeApprovedGrant
getTransactionStatus
```

Agent should never receive unrestricted wallet operations.

---

# 30. Agent Trace UI

Build:

```text
/case/:id/relief-status
```

Display live or simulated-in-sequence states backed by real calls:

```text
Checking hospital assistance...
✓

Checking verified balance...
✓ $2,470

Checking CareZero program...
✓ Maximum $500

Checking liveness signal...
✓

Checking available funds...
✓

Human approval required...
✓ Approved

Preparing settlement...
✓

Sending 500 USDC...
✓
```

This is the technical wow moment.

---

# 31. Phase 8 — Arc Grant Execution

Agent calls:

```text
CareZeroReliefPool.releaseGrant()
```

Inputs:

```text
caseHash
programId
demo provider address
500 USDC
decisionHash
```

Wait for confirmation.

Record transaction.

---

# 32. Final Patient Screen

Display:

```text
ORIGINAL BILL
$18,420

HOSPITAL FINANCIAL ASSISTANCE
-$15,950

CAREZERO RELIEF
-$500

-----------------------------

REMAINING BALANCE
$1,970
```

Then:

# The hospital already had the assistance program.

# CareZero made it usable.

Secondary:

> And when assistance stopped short, CareZero carried transparent charitable relief the rest of the way.

Button:

# View Relief Proof

---

# 33. Relief Proof Screen

Patient-safe:

```text
CareZero Relief Grant

Amount:
$500

Program:
General Medical Hardship

Status:
Confirmed

Network:
Arc

Transaction:
0x...
```

No patient identifiers.

---

# 34. Public Fund Dashboard

Route:

```text
/fund
```

Show:

```text
Available Capital
$25,000

Relief Delivered
$8,250

Grants Completed
31

Average Grant
$266

Patient medical records onchain
0

Platform percentage from grants
0%
```

Values may be clearly marked demo values.

Actual testnet stats can appear separately.

---

# 35. Phase 9 — Visual Polish

Design principles:

* white background;
* dark type;
* healthcare-trust aesthetic;
* no crypto neon;
* no token logos on patient screens;
* dollar amount visually dominant.

Use motion only for:

* progress;
* bill reduction;
* Relief Agent checks;
* transaction confirmation.

---

# 36. Bill Reduction Animation

Sequence:

```text
$18,420
```

pause.

Then line appears:

```text
-$15,950
```

number transitions:

```text
$2,470
```

Then:

```text
-$500
```

Final:

```text
$1,970
```

Do not use casino-style effects.

Use calm motion.

---

# 37. Phase 10 — Documentation

Complete:

```text
README.md
MASTER_BLUEPRINT.md
TECH_ARCHITECTURE.md
PRIZE_STRATEGY.md
BUSINESS_MARKETING.md
RESEARCH_EVIDENCE.md
SECURITY_PRIVACY_COMPLIANCE.md
DATA_MODEL_API.md
IMPLEMENTATION_PLAN.md
DEMO_SCRIPT.md
WORLD_FEEDBACK.md
AI_DISCLOSURE.md
DEPLOYMENTS.md
```

Optional:

```text
CONTRACTS.md
PRIVY_INTEGRATION.md
ARC_INTEGRATION.md
WORLD_INTEGRATION.md
```

---

# 38. README Technical Sections

README must include:

```text
Problem
Solution
How it works
Architecture
Sponsor integrations
Privacy model
Demo case
Local setup
Environment variables
Smart contract deployment
Known limitations
AI usage
Future roadmap
```

---

# 39. Demo Reliability Pass

Before recording:

Run full flow at least three times.

Confirm:

```text
World succeeds
Privy succeeds
Arc succeeds
Agent executes
transaction confirms
final screen updates
```

If external sandbox instability exists:

prepare recorded backup evidence.

Do not falsify integrations.

---

# 40. Fallback Strategy

Each external dependency should have a graceful demo failure state.

## World Failure

Show:

```text
Verification service unavailable.
Try again.
```

## Arc RPC Failure

Show:

```text
Transaction submitted.
Awaiting confirmation.
```

with actual hash if submitted.

## Privy Failure

Do not bypass silently.

Explain in demo only if necessary.

---

# 41. Submission Scope Freeze

Once full end-to-end flow works:

# STOP ADDING FEATURES.

Then focus on:

* bugs;
* sponsor requirements;
* documentation;
* recording;
* pitch;
* architecture diagram.

Hackathons are lost by unfinished ambition.

---

# 42. Suggested Build Sequence

Exact coding order:

```text
1. scaffold repo
2. copy docs
3. build landing page
4. build intake
5. seed FAP fixture
6. build deterministic eligibility
7. result page
8. timeline
9. application page
10. hospital demo decision
11. residual balance screen
12. database
13. World
14. Relief rules
15. Arc contract
16. contract tests
17. Arc deployment
18. Privy treasury
19. Privy policy
20. fund ReliefPool
21. Circle Agent Stack
22. execute grant
23. final screen
24. public proof
25. docs
26. video
```

---

# 43. Suggested Commit Strategy

Create meaningful commits.

Examples:

```text
feat: scaffold CareZero patient flow

feat: add structured FAP schema and eligibility rules

feat: add federal FAP timeline calculations

feat: add application preparation workflow

feat: integrate World Selfie Check

feat: deploy CareZero ReliefPool on Arc testnet

feat: add Privy treasury policies

feat: add Circle Relief Agent

feat: execute USDC Relief grant on Arc

docs: add ETHOnline sponsor integration notes

docs: add World feedback and AI disclosure
```

This also helps demonstrate actual hackathon development.

---

# 44. Definition of Done — Patient Flow

Patient can:

* choose hospital;
* enter bill;
* enter household;
* receive result;
* understand why;
* prepare application;
* view timeline;
* see hospital outcome;
* request Relief;
* complete World check;
* see grant decision;
* see final amount.

---

# 45. Definition of Done — Privy

* Privy wallet exists.
* It represents CareZero organizational treasury.
* Real policy/control exists.
* Real financial flow exists.
* Policy role is visible.
* Documentation explains implementation.

---

# 46. Definition of Done — Arc

* ReliefPool deployed.
* Uses USDC.
* Conditional logic exists.
* Grant released.
* Transaction hash visible.
* Agent Stack involved.
* Architecture diagram included.
* Mainnet deployment path documented.

---

# 47. Definition of Done — World

* Selfie Check works.
* Only Relief Fund is gated.
* Manual-review concept exists.
* World does not determine hospital eligibility.
* Feedback document completed.

---

# 48. Definition of Done — Privacy

* no medical data onchain;
* no real patient data;
* case hash randomized;
* World raw biometric not stored;
* grant proof patient-safe;
* demo labels visible.

---

# 49. Definition of Done — Demo

The judge sees:

```text
$18,420
↓
$15,950 hospital assistance
↓
$2,470
↓
$500 CareZero Relief
↓
$1,970
```

and understands:

```text
World
↓
Privy
↓
Circle Agent
↓
Arc
```

without needing a crypto tutorial.

---

# 50. Post-Hackathon Immediate Roadmap

## Week 1

* Arc mainnet deployment preparation.
* Submit mainnet requirement if pursuing Arc payout.
* Security cleanup.
* Demo repository cleanup.

## Month 1

* real FAP ingestion experiments;
* state-law research;
* nonprofit formation research;
* hospital counselor interviews;
* patient interviews;
* Dollar For partnership exploration.

## Month 2–3

* 20–50 hospital FAP dataset;
* advocate dashboard;
* manual review workflow;
* privacy/legal architecture.

## Later

* real hospital integration;
* real nonprofit Relief Fund;
* provider settlement partners;
* enterprise API;
* national FAP engine.

---

# 51. The Most Important Scope Rule

If forced to choose between:

```text
10 hospitals
```

and:

```text
one working Arc transaction
```

choose the transaction.

If forced to choose between:

```text
beautiful chatbot
```

and:

```text
real Privy policy
```

choose Privy.

If forced to choose between:

```text
OCR
```

and:

```text
working World Selfie Check
```

choose World.

If forced to choose between:

```text
complex AI
```

and:

```text
stable final demo
```

choose the stable demo.

The project wins through depth, not breadth.
