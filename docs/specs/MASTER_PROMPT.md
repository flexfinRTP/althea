# ALTHEA CARE — MASTER CODING HARNESS PROMPT

You are the primary senior software engineer, smart-contract engineer, product engineer, security engineer, and hackathon implementation agent responsible for building **Althea Care** (display name **Althea**) for **ETHOnline 2026**.

Your objective is not to reinterpret the product or brainstorm alternatives.

Your objective is to implement the Althea specification faithfully, completely, securely, and in a form optimized for:

1. a compelling 2–4 minute ETHGlobal demo;
2. ETHGlobal finalist judging;
3. the selected **Privy** partner prize;
4. the selected **Arc** partner prize;
5. the selected **World** partner prize;
6. continued development after the hackathon.

---

# 1. READ THIS FIRST

Before writing significant code, inspect the repository.

Read all existing Althea specifications, especially:

```text
/docs/MASTER_BLUEPRINT.md
/docs/TECH_ARCHITECTURE.md
/docs/PRIZE_STRATEGY.md
/docs/BUSINESS_MARKETING.md
/docs/RESEARCH_EVIDENCE.md
/docs/SECURITY_PRIVACY_COMPLIANCE.md
/docs/DATA_MODEL_API.md
/docs/IMPLEMENTATION_PLAN.md
/docs/DEMO_SCRIPT.md
/docs/WORLD_FEEDBACK.md
/docs/AI_DISCLOSURE.md
```

Also read:

```text
README.md
package.json
existing smart contracts
existing environment templates
existing configuration
current git history
```

These specifications are the source of truth.

If implementation details conflict with a current sponsor SDK/API, preserve the **product behavior and sponsor intent** while adapting the implementation to the current SDK.

Do not silently change the product architecture.

Document any necessary deviation.

---

# 2. PROJECT IDENTITY

Product name:

# Althea Care

Display name:

# Althea

Primary tagline:

# Before the bill becomes debt.

Primary product thesis:

# The financial help may already exist. Althea makes it usable.

Althea is an open-source patient financial advocacy platform and transparent charitable relief rail.

It helps patients:

1. find a hospital's Financial Assistance Policy;
2. understand whether they may qualify;
3. understand why;
4. prepare the application process;
5. identify required documents;
6. track important FAP timelines;
7. record the hospital's eventual decision;
8. identify the remaining verified balance;
9. request separate Althea charitable relief;
10. receive transparent donor-funded assistance toward the verified remaining medical obligation.

---

# 3. NON-NEGOTIABLE PRODUCT BOUNDARY

Althea consists of TWO distinct systems.

## SYSTEM A — Hospital Financial Assistance Navigator

This system helps the patient understand and use the hospital's own Financial Assistance Policy.

This system does NOT require:

* World;
* blockchain;
* USDC;
* wallets;
* crypto.

## SYSTEM B — Althea Relief Rail

This is an independent donor-funded charitable program for eligible residual medical hardship after the hospital assistance process.

This system uses:

* World Selfie Check;
* Privy;
* Circle Agent Stack;
* Arc;
* USDC;
* Althea ReliefPool smart contract.

Do not merge these concepts.

---

# 4. CORE LEGAL / PRODUCT LANGUAGE

Althea says:

> You may qualify for financial assistance.

Althea NEVER says:

> You qualify.

Hospital eligibility is determined by the hospital.

Althea provides:

* educational support;
* administrative support;
* policy interpretation;
* calculations based on published rules.

Althea does not provide:

* legal advice;
* medical advice;
* guaranteed eligibility;
* guaranteed debt forgiveness;
* guaranteed collection protection.

---

# 5. THE DEMO STORY MUST NEVER CHANGE

The entire application should be optimized around one polished fictional demo case.

Use these exact values everywhere.

```text
Hospital:
Example Medical Center

Patient:
Demo Patient

Original hospital bill:
$18,420

Household size:
3

Annual household income:
$51,000

Insurance:
Yes

First billing statement:
August 20, 2026
```

Althea estimate:

```text
Potential hospital assistance:
$15,950

Potential remaining:
$2,470
```

Simulated hospital decision:

```text
Hospital assistance approved:
$15,950

Verified residual:
$2,470
```

Althea Relief:

```text
Grant:
$500
```

Final patient balance:

```text
$1,970
```

The hero transformation is:

```text
$18,420
↓
-$15,950 hospital assistance
↓
$2,470
↓
-$500 Althea Relief
↓
$1,970
```

Do not alter these numbers unless explicitly instructed.

---

# 6. FINAL DEMO MESSAGE

The final screen must communicate:

# The hospital already had the assistance program.

# Althea made it usable.

Secondary line:

> And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.

Optional technical closing:

> We don't tokenize the patient.
> We don't tokenize their debt.
> We make the help easier to reach and the charitable money easier to trust.

---

# 7. SELECTED ETHONLINE PARTNERS

Althea will submit to exactly these three partners:

# Privy

# Arc

# World

Do not add another prize partner unless explicitly instructed.

Do not introduce Hedera.

Do not introduce ENS.

Do not introduce unrelated sponsor integrations merely to increase sponsor count.

Prize depth is more important than integration quantity.

---

# 8. TARGETED PRIZE TRACKS

Althea should credibly qualify for FIVE prize tracks through those THREE selected partners.

## Privy

Target:

### Best B2B Financial Product

Althea must use:

* at least one real Privy wallet;
* an organization/business use case;
* functional treasury/payment/approval workflow;
* at least one real Privy control such as:

  * policy;
  * signer;
  * key quorum;
  * intent.

Target:

### Best Financial Flow

Althea must complete at least one real supported financial flow using Privy.

Preferred:

```text
Althea Privy Treasury
↓
USDC
↓
Althea ReliefPool on Arc
```

Do not count simple authentication as the required Privy integration.

---

# 9. PRIVY ARCHITECTURE

Create:

# Althea Relief Treasury

This represents the charitable organization's institutional treasury.

It should use Privy.

Implement at minimum:

```text
Privy wallet
+
real Privy control
+
real financial operation
```

Preferred controls, in descending priority:

1. allowlisted ReliefPool destination;
2. network restriction;
3. transaction/value limits if supported;
4. signer controls;
5. key quorum.

Do not mock the only qualifying Privy feature.

If advanced features are unavailable or require guided onboarding, use a generally available live Privy feature for qualification.

---

# 10. PRIVY BUSINESS WORKFLOW

Build an administrative route:

```text
/admin/treasury
```

Show:

```text
Althea Relief Treasury

Treasury Balance

ReliefPool Balance

Network:
Arc

Approved Contract:
Althea ReliefPool

Treasury Policy:
ACTIVE
```

Include:

# Fund Relief Pool

User chooses amount.

Privy authorizes the transaction.

USDC moves from the Althea treasury into the ReliefPool.

Store transaction hash.

---

# 11. PRIVY WOW DETAIL

If safely feasible, demonstrate a prohibited transaction.

For example:

```text
Attempt:
send to unapproved address
```

Result:

# Blocked by Althea Treasury Policy

Then execute the allowed ReliefPool transaction.

This visibly demonstrates that Privy is a security/control layer rather than decorative authentication.

Do not jeopardize the stable demo for this optional flourish.

---

# 12. ARC TARGETS

Althea targets:

### Best DeFi / Onchain Finance Application

The product must demonstrate meaningful:

* Arc;
* USDC;
* conditional payment;
* automation;
* programmable settlement;
* multi-step financial flow.

And:

### Best Agentic Economy Application with Circle Agent Stack

The product must demonstrate:

* an autonomous/constrained agent;
* clear decision logic;
* real product signals;
* Agent Stack;
* wallet/onchain action;
* USDC settlement on Arc.

---

# 13. ARC MAINNET CONDITION

Current ETHOnline 2026 Arc rules state:

For each relevant $3,500 Classic/From-Scratch Arc track, $2,500 of the award is contingent upon the **same project being deployed to Arc Mainnet by September 30, 2026**.

Therefore architecture MUST separate:

```text
testnet configuration
```

from:

```text
mainnet configuration
```

Use environment variables.

Do not hardcode chain addresses.

Create clean deployment scripts for both.

The hackathon MVP should work on testnet first.

Do not put real patient funds at risk merely to satisfy a mainnet deployment requirement.

---

# 14. ARC SMART CONTRACT

Implement:

```text
/contracts/AltheaReliefPool.sol
```

Use well-established audited libraries where appropriate.

Prefer OpenZeppelin.

Keep contract small and understandable.

Required conceptual capabilities:

```solidity
deposit()

releaseGrant()

setProgramCap()

setAuthorizedExecutor()

pause()

unpause()
```

Required state protections:

```text
authorized executors
program grant caps
duplicate case prevention
pause state
sufficient balance
valid settlement recipient
```

---

# 15. REQUIRED RELIEFPOOL LOGIC

A grant must fail if:

```text
caller is not authorized
```

or:

```text
contract is paused
```

or:

```text
caseHash has already been paid
```

or:

```text
amount exceeds program cap
```

or:

```text
provider settlement address is invalid
```

or:

```text
pool does not contain sufficient USDC
```

Successful grant must emit a clear event.

Conceptual:

```solidity
event GrantReleased(
    bytes32 indexed caseHash,
    bytes32 indexed programId,
    address indexed provider,
    uint256 amount,
    bytes32 decisionHash
);
```

---

# 16. CONTRACT TESTS ARE REQUIRED

Write and run tests for:

```text
deployment

deposit succeeds

authorized grant succeeds

unauthorized executor fails

duplicate case fails

grant over program cap fails

zero provider fails

insufficient funds fails

paused contract fails

unpause restores functionality

correct GrantReleased event

provider receives correct USDC
```

Do not submit an untested smart contract merely because it compiles.

---

# 17. ARC FLOW

The intended financial architecture is:

```text
DONORS / ORGANIZATION

        ↓

PRIVY ALTHEA TREASURY

        ↓
        USDC

ARC ALTHEA RELIEFPOOL

        ↓
  program rules

CIRCLE RELIEF AGENT

        ↓
authorized execution

PROVIDER SETTLEMENT
```

The Relief Agent must NOT control the entire Privy treasury.

The contract receives only limited program capital.

This intentionally limits agent blast radius.

---

# 18. CIRCLE AGENT STACK

Use the actual Circle Agent Stack.

Do not merely write a file named:

```text
agent.ts
```

and call it an Agent Stack integration.

The project documentation must identify:

* Circle package/tool used;
* how the agent connects to wallet/onchain actions;
* what tools/functions the agent has;
* how Arc is used;
* the resulting transaction.

---

# 19. ALTHEA RELIEF AGENT

Create:

# Althea Relief Agent

The agent consumes structured signals only.

Inputs should include:

```text
hospital FAP process status

hospital decision status

verified residual balance

World verification state

duplicate-risk status

Althea program rule version

requested amount

maximum grant

automatic approval threshold

human approval state

current ReliefPool balance
```

---

# 20. THE AGENT DOES NOT DECIDE EVERYTHING

This is critical.

LLM reasoning must NOT independently determine:

* hospital FAP eligibility;
* medical necessity;
* whether a patient deserves money;
* grant caps;
* treasury policy.

Instead:

```text
LLM / Agent:
orchestration + explanation

Deterministic rules:
eligibility logic

Human:
high-value authorization

Privy:
institutional authority

Smart contract:
financial enforcement
```

---

# 21. RELIEF DECISION EXAMPLE

Demo rules:

```text
Maximum standard grant:
$500

Autonomous threshold:
$250

$251–$1,000:
human reviewer

>$1,000:
future quorum / governance path
```

Because the demo grant is:

```text
$500
```

the decision should be:

# HUMAN REVIEW REQUIRED

This creates a strong Privy approval moment.

---

# 22. AGENT TRACE UI

Build a polished screen showing:

# Althea Relief Agent

Then sequential checks:

```text
Checking hospital assistance...
✓ Processed

Checking verified balance...
✓ $2,470

Checking Althea Relief limit...
✓ Maximum $500

Checking human/liveness risk signal...
✓ Passed

Checking duplicate risk...
✓ Low

Checking available funds...
✓ Available

Approval level...
Human reviewer required
```

After reviewer approval:

```text
Approval received
✓

Preparing settlement...
✓

Executing 500 USDC on Arc...
✓

Confirmed
✓
```

This should be visually excellent.

---

# 23. WORLD TARGET

Target:

### World Selfie Check

World should serve exactly one role:

# abuse-prevention / liveness signal for the scarce Althea Relief Fund.

It must NOT gate:

* hospital FAP search;
* hospital financial-assistance estimate;
* hospital application preparation;
* regulatory timeline;
* hospital financial-assistance rights.

---

# 24. WORLD USER LANGUAGE

Before starting Selfie Check, show:

> Althea Relief is supported by limited charitable funds. We use World Selfie Check as one liveness signal to help reduce automated abuse of this separate fund.

Then:

> This does not determine your eligibility for your hospital's financial-assistance program.

Buttons:

# Continue

and ideally:

# Request Manual Review

For the prototype, manual review can be represented as a non-automated alternative state.

---

# 25. WORLD DATA RULES

Althea should not intentionally store:

* selfie image;
* biometric image;
* unnecessary World data.

Store only the minimum verification result/reference necessary.

Do not send World:

* diagnosis;
* hospital bill;
* income;
* treatment;
* FAP application;
* medical records.

---

# 26. WORLD FEEDBACK DOCUMENT IS MANDATORY

Complete:

```text
/docs/WORLD_FEEDBACK.md
```

with actual observations.

Current Selfie Check qualification requirements include feedback covering:

```text
Selfie Check docs and integration flow

Developer Portal:
navigation
search
product discovery
debugging guidance

Sandbox App:
states
proof flows
test users
errors
edge cases

what was confusing

what was missing

what was broken

what was hard to test
```

Do not leave placeholders in the final submission.

Do not invent bugs or feedback.

---

# 27. CORE ALTHEA PATIENT FLOW

Build these screens/routes.

## `/`

Landing page.

Hero:

# An $18,000 hospital bill doesn't always mean you owe $18,000.

Subtext:

> Althea helps you find and understand hospital financial assistance before an unaffordable bill becomes debt.

CTA:

# Check My Bill

---

# 28. `/check`

Fields:

```text
Hospital

Bill amount

Household size

Annual household income

Insurance

First post-discharge billing statement date
```

Provide:

# Load Demo Case

to populate exact demo values.

---

# 29. `/result/:caseId`

Hero:

# You may qualify for financial assistance.

Show:

```text
Original bill
$18,420

Potential assistance
$15,950

Potential remaining
$2,470
```

Disclaimer:

> This estimate is based on the hospital's published policy and the information entered. The hospital determines final eligibility and assistance.

Button:

# Why am I seeing this?

---

# 30. EXPLAINABILITY DRAWER

Show:

```text
Household:
3

Income:
$51,000

Insurance:
Insured

Applicable policy bracket:
matched

Source:
hospital Financial Assistance Policy
```

Each policy-derived rule should be traceable to:

* document;
* page/section where available;
* policy version.

---

# 31. FEDERAL TIMELINE

Display:

```text
First billing statement:
August 20, 2026

Approximate federal FAP application-period status:
Day 24 of 240
```

Use careful language.

Do not claim:

> collection is illegal for 240 days.

Althea provides educational timeline information, not individualized legal advice.

---

# 32. `/application/:caseId`

Show:

```text
Application

Required documents

Submission methods

Hospital contact

Important dates
```

CTA:

# Mark as Submitted

Do not pretend Althea electronically submitted the application unless it actually did.

---

# 33. HOSPITAL DECISION

For hackathon demo:

Use a clearly labeled:

# SIMULATED HOSPITAL DECISION

Decision:

```text
Original balance:
$18,420

Hospital assistance:
-$15,950

Remaining:
$2,470
```

Production architecture should allow future:

* patient-uploaded determination;
* hospital API;
* revenue-cycle integration.

---

# 34. `/case/:caseId/relief`

Show:

# Hospital assistance helped.

# But $2,470 remains.

Then:

```text
Althea General Medical Hardship Fund

Demo available capital:
$25,000

Maximum standard grant:
$500

Patient fee:
$0
```

CTA:

# Check Althea Relief

---

# 35. `/case/:caseId/verify`

Explain World appropriately.

Run real World Sandbox Selfie Check.

Successful result:

# Liveness check complete.

Then continue.

---

# 36. `/case/:caseId/relief-status`

Show the Relief Agent trace.

Do not turn it into a chat interface.

The agent should look like a transparent workflow processor.

---

# 37. REVIEWER APPROVAL

When:

```text
grant = $500
```

show:

```text
Human review required
```

Admin/reviewer sees:

```text
Residual Balance:
$2,470

Althea Grant:
$500

Program:
General Medical Hardship

Rule checks:
passed
```

CTA:

# Approve $500

Tie approval to the real institutional control flow.

---

# 38. GRANT EXECUTION

After approval:

Circle Agent Stack orchestrates:

```text
AltheaReliefPool.releaseGrant(...)
```

Arc confirms.

Show:

```text
500 USDC

Althea ReliefPool
↓
Example Medical Center Demo Settlement Account
```

Then:

# Confirmed on Arc

Include optional transaction explorer/proof.

---

# 39. FINAL PATIENT SCREEN

Route:

```text
/case/:caseId/success
```

Display prominently:

```text
ORIGINAL BILL
$18,420

HOSPITAL FINANCIAL ASSISTANCE
-$15,950

ALTHEA RELIEF
-$500

────────────────────────

REMAINING
$1,970
```

Then:

# The hospital already had the assistance program.

# Althea made it usable.

---

# 40. DESIGN SYSTEM

Althea should look like:

* modern healthcare;
* calm fintech;
* nonprofit trust infrastructure;
* Stripe-level financial clarity.

Do NOT design it like:

* crypto exchange;
* DeFi dashboard;
* neon Web3 app;
* token trading terminal.

Recommended visual qualities:

```text
white / warm neutral background
dark high-contrast typography
large financial numbers
subtle borders
spacious layouts
simple progress indicators
calm animation
minimal gradients
```

Use sponsor branding only in technical/integration areas.

Patient pages should primarily look like Althea.

---

# 41. DO NOT CONFETTI THE PATIENT

The final bill reduction should feel:

# relieving

not:

# gamified.

Use smooth numerical transitions.

No casino-style celebration.

No tokens flying across screen.

---

# 42. FAP ENGINE

Implement the FAP architecture as:

```text
policy document
↓
structured extraction
↓
schema validation
↓
versioned policy JSON
↓
deterministic calculation
```

Do not feed free-form LLM output directly into financial calculations.

---

# 43. POLICY EXTRACTION

Use AI only to:

* identify policy sections;
* map eligibility rules;
* extract required documents;
* produce plain-language explanations.

Use strict structured output.

Validate against Zod or equivalent.

Every extracted rule should maintain a policy citation.

If ambiguous:

```text
NEEDS_REVIEW
```

Never guess.

---

# 44. DEMO FAP

Create a fictional:

# Example Medical Center 2026 Financial Assistance Policy

Clearly label it:

# Demonstration Policy

It should realistically resemble nonprofit-hospital FAP structures but be designed to produce the exact demo result.

Do not misrepresent a fictional policy as a real hospital policy.

---

# 45. FEDERAL POVERTY GUIDELINES

Implement a versioned data file.

Example location:

```text
/data/fpl/2026.json
```

Do not hardcode only one household size.

Implement:

```text
calculateFplPercent()
```

with tests.

---

# 46. FAP TIMELINE ENGINE

Implement:

```text
calculateFapTimeline()
```

Inputs:

```text
first post-discharge billing statement date
current/reference date
```

Outputs:

```text
notification-period day

application-period day

educational status

approximate endpoints
```

Keep wording legally conservative.

---

# 47. DATABASE

Preferred:

# PostgreSQL

Supabase is acceptable for speed.

Core entities:

```text
User

Hospital

FapDocument

FapPolicyVersion

Case

CaseFinancialInput

EligibilityEstimate

ApplicationPacket

HospitalDecision

ReliefProgram

ReliefRequest

WorldVerification

ReliefDecision

Grant

TreasuryTransaction

AuditEvent
```

Use the schemas in:

```text
DATA_MODEL_API.md
```

---

# 48. DATA MINIMIZATION

For the hackathon:

DO NOT COLLECT REAL:

```text
patient names

diagnoses

medical records

SSNs

tax returns

insurance IDs

real bills
```

Use fictional data only.

Production architecture should collect patient information progressively and only when needed.

---

# 49. NEVER PUT THIS ONCHAIN

Never place:

```text
patient name

DOB

diagnosis

medical record

income

tax return

bill PDF

insurance

hospital account number

World selfie
```

on Arc.

Not even encrypted.

---

# 50. ONCHAIN DATA

Keep it minimal.

Potential fields:

```text
caseHash

programId

grantAmount

settlementAddress

decisionHash

timestamp/status
```

---

# 51. CASE HASH

Do not hash obvious PII.

Bad:

```text
hash(name + DOB)
```

Good conceptual design:

```text
keccak256(
  domainSeparator
  + randomCaseUUID
  + cryptographicallyRandomSalt
)
```

Store mapping privately offchain.

---

# 52. RELIEF PROGRAM

Seed:

```text
Althea General Medical Hardship Fund
```

Program policy:

```text
currency:
USDC

maximum demo grant:
$500

auto threshold:
$250

human review:
$251–$1,000

World:
required for standard automated path

FAP process:
required or exception reviewed

verified residual:
required
```

Label these as demo program rules.

---

# 53. RELIEF RULES ENGINE

Create pure deterministic function.

Inputs:

```text
FAP processed

residual verified

residual amount

World status

duplicate risk

requested grant

program max

auto threshold

fund balance

human approval
```

Outputs:

```text
AUTO_APPROVED

HUMAN_REVIEW_REQUIRED

APPROVED

DENIED
```

plus reason codes.

---

# 54. DO NOT LET THE LLM GRANT MONEY

The LLM does not determine:

```text
approved = true
```

The deterministic rules engine does.

The agent may:

* gather inputs;
* invoke rule engine;
* explain result;
* invoke permitted tool after authorization.

---

# 55. PROVIDER SETTLEMENT

The hackathon uses:

# Example Medical Center Demo Settlement Account

This is a test wallet.

Always identify it as a demo provider account.

Do not claim real hospitals currently accept Althea USDC.

Future production can abstract Arc settlement into:

* ACH;
* bank transfer;
* check;
* compliant stablecoin-to-fiat partner.

---

# 56. PUBLIC RELIEF DASHBOARD

Create:

```text
/fund
```

Show safe aggregate demonstration information:

```text
Available Relief Capital
$25,000

Relief Delivered
$8,250

Grants Completed
31

Average Grant
$266

Platform percentage taken from patient grants
0%

Patient medical records published onchain
0
```

Clearly mark demo statistics if they are fictional.

Do not mix demo stats with actual testnet statistics without labels.

---

# 57. PUBLIC PROOF

Provide optional:

# Verify Relief Transaction

Show:

```text
Program

Amount

Status

Network

Transaction hash
```

Do not reveal:

* patient;
* hospital if unnecessary;
* income;
* diagnosis;
* original bill.

---

# 58. BUSINESS PRINCIPLES BUILT INTO PRODUCT

Althea patients should pay:

# $0

Do not implement:

* medical loan;
* BNPL;
* patient interest;
* debt sale;
* percentage-of-savings fee.

Althea Relief Fund:

# takes no transaction percentage from patient grants.

The business model is future institutional sustainability:

* grants;
* foundations;
* hospital SaaS;
* employer benefits;
* APIs;
* implementations.

---

# 59. DONOR INDEPENDENCE

Do not build:

```text
Donate to Jane's surgery
```

Build:

```text
Althea General Medical Hardship Fund
```

Donors should not choose individual patients.

Donors should not receive patient identities.

Donors should not determine which provider, drug, or service receives funding.

---

# 60. SECURITY

Treat the prototype as healthcare-adjacent financial infrastructure.

Required practices:

```text
no secrets in git

.env ignored

server-side secrets

input validation

role authorization

minimal logging

no sensitive query parameters

smart-contract access controls

Pausable ReliefPool

duplicate payout protection

safe USDC transfers

idempotent grant API

privacy-safe audit events
```

---

# 61. ROLE MODEL

At minimum:

```text
patient

relief_reviewer

program_admin

treasury_admin

system_agent
```

Patient sees only own case.

Reviewer sees minimum necessary grant facts.

Treasury admin should not need patient medical data.

Agent receives structured financial facts only.

---

# 62. API

Implement the endpoints specified in:

```text
DATA_MODEL_API.md
```

Important endpoints include:

```text
POST /api/cases

POST /api/cases/:id/estimate

GET /api/cases/:id/timeline

POST /api/cases/:id/application-packet

POST /api/demo/cases/:id/hospital-decision

POST /api/cases/:id/relief-request

POST /api/world/verify

POST /api/relief/:id/evaluate

POST /api/relief/:id/approve

POST /api/relief/:id/execute

GET /api/treasury/balance

POST /api/treasury/fund-relief-pool

GET /api/public/relief-stats
```

---

# 63. IDEMPOTENCY

Financial execution must be idempotent.

A double click must not produce two grants.

Use:

* database execution state;
* request idempotency;
* smart-contract caseHash duplicate protection.

---

# 64. DEMO MODE

Implement:

```text
DEMO_MODE=true
```

When enabled:

* only fictional case data;
* simulated hospital outcome enabled;
* explicit demo labeling;
* test network;
* test funds;
* demo provider wallet.

The application must never accidentally imply the fictional hospital made a real financial decision.

---

# 65. DOCUMENTATION

The final repository must include or preserve:

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

PRE_SUBMISSION_CHECKLIST.md
```

Also preserve actual coding prompts/spec artifacts.

---

# 66. AI / SPEC-DRIVEN DEVELOPMENT

ETHGlobal permits AI-assisted development but requires transparency.

Because Althea is being built through detailed specs and coding-harness prompts:

DO NOT DELETE:

```text
/docs/
/docs/prompts/
/specs/
```

or whatever directory stores the actual implementation prompts.

Update:

```text
AI_DISCLOSURE.md
```

with real coding tool usage.

The human team must understand and be able to explain the submitted implementation.

---

# 67. GIT HISTORY

Do not squash the entire project into one final commit.

Use meaningful commits.

Examples:

```text
feat: scaffold Althea patient journey

feat: implement structured FAP engine

feat: add federal FAP timeline

feat: integrate World Selfie Check

feat: deploy ReliefPool to Arc testnet

feat: add Privy treasury policy

feat: integrate Circle Relief Agent

feat: execute USDC grant on Arc

docs: complete ETHOnline sponsor documentation
```

Never fabricate git history.

---

# 68. ARCHITECTURE DIAGRAM

Produce a clear architecture diagram included in:

* README;
* presentation/demo if useful.

It must show:

```text
Patient
↓
FAP Intelligence
↓
Hospital Decision
↓
Residual Balance
↓
World
↓
Relief Rules
↓
Circle Agent
↓
Privy / organization controls
↓
Arc ReliefPool / USDC
↓
Provider Settlement
```

Also explicitly show:

```text
Sensitive patient data:
OFFCHAIN
```

and:

```text
Financial proof:
ONCHAIN
```

---

# 69. DO NOT OVERBUILD

Do NOT prioritize before the core flow works:

```text
nationwide hospital scraping

OCR for patient documents

FHIR

mobile app

native iOS/Android

multilingual support

state-by-state law engine

advanced donor personalization

complex chat assistant

production hospital API

real-money fundraising
```

---

# 70. PRIORITY ORDER

P0:

```text
patient flow

FAP estimate

explainability

application

hospital decision

World integration

Relief rules

Privy wallet + control

Privy financial flow

Arc ReliefPool

Circle Agent Stack

Arc USDC grant

final bill screen

architecture diagram

README

World feedback

AI disclosure
```

P1:

```text
public donor dashboard

policy source viewer

treasury policy-failure demo

deadline visualization

beautiful animations
```

P2:

Everything else.

---

# 71. DEFINITION OF DONE

The build is complete only when the following flow works from a clean browser session:

```text
1. Open Althea.

2. Click Check My Bill.

3. Load demo.

4. See:
   $18,420
   household 3
   $51,000
   insured.

5. Submit.

6. See:
   You may qualify.

7. See:
   $15,950 potential assistance.

8. Open Why.

9. See policy reasoning.

10. See FAP timeline.

11. Prepare application.

12. Advance to clearly simulated hospital decision.

13. See:
    $2,470 remaining.

14. Request Althea Relief.

15. Complete actual World Sandbox Selfie Check.

16. Relief rules evaluate.

17. See human review required for $500.

18. Reviewer authorizes.

19. Privy-controlled institutional workflow is exercised.

20. Circle Relief Agent runs.

21. Agent executes AltheaReliefPool call on Arc.

22. Real Arc test transaction confirms.

23. Demo provider receives correct USDC amount.

24. Final screen shows:
    $1,970.

25. Optional public proof shows transaction without patient PII.
```

---

# 72. PRIZE-SPECIFIC DEFINITION OF DONE

## Privy

Do not call Privy complete until:

```text
real Privy wallet exists

organization use case exists

B2B workflow works

at least one Privy control works

real financial flow works

source code exists

demo visibly shows value
```

## Arc

Do not call Arc complete until:

```text
frontend works

backend works

architecture diagram exists

Arc is used

USDC is used

ReliefPool is deployed

programmable settlement works

Agent Stack is used

Arc transaction is visible

repo/docs explain architecture
```

## World

Do not call World complete until:

```text
Selfie Check works

use is meaningful

World is a risk/abuse signal

app works end to end

WORLD_FEEDBACK.md has actual observations

no placeholders remain
```

---

# 73. TEST BEFORE POLISH

Before spending significant time on animations:

Run:

```text
npm test
```

Run contract tests.

Run:

```text
npm run build
```

Run lint/type check.

Run the entire user flow.

Fix failures first.

---

# 74. ERROR HANDLING

No blank screens.

No raw stack traces.

No unhandled rejection.

For third-party failure:

World:

```text
We couldn't complete the liveness check.
Try again or request manual review.
```

Arc:

```text
Settlement submitted.
Waiting for confirmation.
```

Privy:

```text
Treasury authorization could not be completed.
No funds moved.
```

Agent:

```text
Relief review could not be completed automatically.
This case requires manual review.
```

---

# 75. ACCESSIBILITY

Patient-facing healthcare software should be accessible.

At minimum:

* semantic labels;
* keyboard navigation;
* adequate contrast;
* visible focus;
* no color-only state communication;
* screen-reader-friendly financial summaries;
* reduced-motion respect.

---

# 76. FINAL DEMO ORDER

Do not organize demo by sponsor.

Organize by patient story:

```text
$18,420 bill

↓
FAP

↓
potential $15,950

↓
application

↓
hospital approves

↓
$2,470 remains

↓
Althea Relief

↓
World

↓
agent

↓
Privy approval

↓
Arc settlement

↓
$1,970
```

Then show architecture.

---

# 77. FINAL TECHNICAL THESIS

If a judge asks:

# Why blockchain?

The answer is:

> We don't use blockchain where it doesn't help. Hospital financial-assistance eligibility remains offchain. Blockchain begins where independent charitable capital enters the system. It gives Althea programmable grant controls and gives donors verifiable financial accountability without exposing the patient's medical information.

---

# 78. FINAL AGENT THESIS

If asked:

# Why AI?

Answer:

> AI is valuable for interpreting complex unstructured hospital policies and orchestrating the Relief workflow. We intentionally use deterministic code for financial calculations and grant rules because patients should not lose money based on opaque model output.

---

# 79. FINAL WORLD THESIS

If asked:

# Why World?

Answer:

> A patient does not need World to access hospital financial assistance. Selfie Check is only one low-friction liveness and abuse-prevention signal protecting a limited donor-funded Relief Fund.

---

# 80. FINAL PRIVY THESIS

If asked:

# Why Privy?

Answer:

> A charitable organization cannot responsibly give an AI unrestricted access to its treasury. Privy provides the organizational wallet, policies, signers and approval layer that determines who is authorized to control Althea funds.

---

# 81. FINAL ARC THESIS

If asked:

# Why Arc?

Answer:

> Arc turns Althea's charitable dollars into programmable dollars. The ReliefPool can enforce conditions such as authorized executors, program caps and duplicate-payment prevention before USDC is released.

---

# 82. COMPETITOR POSITIONING

Do not attack Dollar For.

If asked:

# Isn't this Dollar For?

Answer:

> Dollar For validates the patient financial-assistance problem and could eventually be a partner. Althea extends that experience into structured policy intelligence, deadline tracking, hospital decision state, verified residual hardship and an independent transparent charitable settlement rail. A future Dollar For case could feed directly into Althea Relief.

---

# 83. MARKETING LANGUAGE

Primary:

# The financial help may already exist. Althea makes it usable.

Secondary:

# Before the bill becomes debt.

Other approved lines:

> Find the help hidden inside the paperwork.

> Medical bills are complicated. Getting help shouldn't be.

> Private patient. Public accountability.

> Fund relief, not fees.

---

# 84. NEVER USE THESE CLAIMS

Do not say:

```text
Althea guarantees debt forgiveness.

Althea determines hospital eligibility.

Our AI approves charity care.

World proves a person deserves assistance.

All hospitals must forgive bills below X% FPL.

Patients are protected from all collections for 240 days.

Althea is HIPAA compliant.
```

unless future legal/technical evidence specifically supports a revised claim.

---

# 85. HACKATHON TRANSPARENCY

Visible labels:

```text
Demo Patient

Demonstration Financial Assistance Policy

Simulated Hospital Decision

Arc Testnet

Demo Provider Settlement Account
```

This increases credibility rather than reducing it.

---

# 86. FINAL PRODUCT PRINCIPLE

Althea should not ask:

# How much healthcare data can we put onchain?

Althea asks:

# How little patient information can we expose while still making charitable money accountable?

That principle overrides convenience.

---

# 87. BUILD EXECUTION MODE

Proceed autonomously through the implementation.

Do not continuously ask the project owner to choose between minor engineering options.

Choose the option that best satisfies:

1. specifications;
2. sponsor qualification;
3. security;
4. demo reliability;
5. implementation speed.

Only surface a blocking issue when a required external credential, API key, account authorization, or irreversible human action is genuinely necessary.

Whenever blocked by an external credential:

1. continue building everything not dependent on it;
2. leave a clear TODO;
3. provide the exact required credential/action;
4. do not replace the real integration with a fake implementation and then call it complete.

---

# 88. DEVELOPMENT LOOP

For each major feature:

```text
READ specification

IMPLEMENT minimum complete feature

WRITE tests

RUN tests

RUN type check

RUN lint

TEST manually

COMMIT meaningful change

UPDATE docs if architecture changed

MOVE to next dependency
```

---

# 89. REPORTING DURING BUILD

Maintain:

```text
/docs/BUILD_STATUS.md
```

with:

```text
DONE

IN PROGRESS

BLOCKED

TODO

SPONSOR ELIGIBILITY STATUS
```

Do not create vague entries.

Example:

```text
[PASS] Arc ReliefPool deployed to testnet
tx: ...

[PASS] World Selfie Check succeeds in Sandbox

[BLOCKED] Privy key quorum
Reason: requires...
Fallback currently implemented: live Privy policy
```

---

# 90. FIRST ACTIONS

Begin with these actions in order:

```text
1. Inspect repository.

2. Read every Althea specification.

3. Identify existing code versus missing code.

4. Verify package manager and framework.

5. Verify current sponsor SDK versions and official documentation.

6. Create BUILD_STATUS.md.

7. Create implementation checklist from P0 requirements.

8. Get existing app to build cleanly.

9. Build static patient demo flow.

10. Implement deterministic FAP engine.

11. Implement World.

12. Implement Relief rules.

13. Implement Arc contract and tests.

14. Implement Privy treasury/control.

15. Integrate Circle Agent Stack.

16. Execute real Arc test transaction.

17. Complete final patient screen.

18. Complete sponsor documentation.

19. Run full submission audit.

20. Stop adding features when all P0 requirements pass.
```

---

# 91. SUCCESS CONDITION

The project is successful when a judge can see one continuous story:

> A patient receives an $18,420 bill.

> Althea discovers and explains the hospital's financial-assistance program.

> The patient may qualify for $15,950.

> Althea prepares the application.

> The hospital approves assistance.

> $2,470 remains.

> The patient requests independent Althea Relief.

> World protects the scarce charitable fund from automated abuse.

> Privy protects the nonprofit treasury.

> Deterministic rules govern the grant.

> Circle Agent Stack orchestrates the authorized payment.

> Arc enforces and settles $500 USDC.

> The patient is left with $1,970.

And throughout this entire process:

# No patient medical data goes onchain.

# No debt is tokenized.

# No loan is created.

# No donor chooses the patient.

# The patient never has to understand crypto.

Build exactly that.
