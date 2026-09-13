# CareZero — Technical Architecture

## 1. Architectural Goal

Build a working ETHOnline MVP in which:

1. a patient enters basic bill and household information;
2. CareZero retrieves a structured hospital Financial Assistance Policy;
3. deterministic rules calculate potential assistance;
4. CareZero generates an application-preparation workflow;
5. a hospital decision is simulated or recorded;
6. a residual balance becomes eligible for separate CareZero Relief review;
7. World Selfie Check supplies an anti-abuse signal;
8. a CareZero Relief Agent evaluates objective rules;
9. Privy controls the nonprofit treasury;
10. Arc handles transparent USDC relief settlement; and
11. no sensitive patient information is written onchain.

The architecture must maximize ETHOnline sponsor depth while remaining believable as a real product.

---



# 2. Core Architecture

```text
                        CAREZERO

                 ┌────────────────────┐
                 │   Patient Web App  │
                 │ Next.js/TypeScript │
                 └─────────┬──────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ CareZero API     │
                  │ Node/Next API    │
                  └────────┬─────────┘
                           │
        ┌──────────────────┼────────────────────┐
        │                  │                    │
        ▼                  ▼                    ▼
┌──────────────┐   ┌───────────────┐    ┌──────────────┐
│ FAP Registry │   │ Case Service  │    │ Relief Engine│
└──────┬───────┘   └───────┬───────┘    └───────┬──────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌──────────────┐   ┌───────────────┐    ┌──────────────┐
│ Policy       │   │ PostgreSQL /  │    │ World        │
│ Extraction   │   │ encrypted     │    │ Selfie Check │
│ + Rules      │   │ storage       │    └───────┬──────┘
└──────────────┘   └───────────────┘            │
                                                 ▼
                                        ┌────────────────┐
                                        │ Relief Agent   │
                                        │ Circle Agent   │
                                        │ Stack          │
                                        └───────┬────────┘
                                                │
                 ┌──────────────────────────────┼──────────────┐
                 │                              │              │
                 ▼                              ▼              ▼
        ┌────────────────┐            ┌──────────────┐ ┌──────────────┐
        │ Privy Relief   │            │ ReliefPool   │ │ Arc / USDC   │
        │ Treasury       │───────────▶│ Contract     │─▶ Settlement  │
        │ + Policies     │ deposit    │ on Arc       │ └──────────────┘
        └────────────────┘            └──────────────┘

```

---



# 3. Recommended Technology Stack



## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui or equivalent simple component library
- responsive desktop-first design for judging
- minimal animations for bill-reduction wow sequence



## Server

- Next.js server routes or standalone Node.js API
- TypeScript
- Zod for data validation
- deterministic FAP rules library
- background job abstraction only if necessary



## Database

Recommended:

- PostgreSQL
- Supabase if speed is priority

Core tables:

- hospitals
- fap_documents
- fap_policy_versions
- cases
- case_inputs
- assistance_estimates
- application_packets
- hospital_decisions
- residual_balances
- world_verifications
- relief_requests
- relief_decisions
- grants
- donations
- blockchain_transactions
- audit_events



## Sensitive Documents

Hackathon:

- use fictional data only;
- local fixture storage or private object bucket.

Future:

- encrypted object storage;
- separate metadata and file encryption keys;
- short-lived signed URLs;
- strict role-based access;
- audit logging;
- retention/deletion policies.



## Web3

- Arc
- Solidity
- USDC
- viem
- Circle App Kit where relevant
- Circle Agent Stack
- Circle Agent Wallet
- Privy wallet infrastructure
- World Selfie Check

---



# 4. Do Not Overbuild

The critical product is not a generalized hospital AI platform.

For the hackathon:

## Use one excellent policy.

Create:

```text
Example Medical Center

```

with a clearly labeled fictional policy modeled on realistic FAP structures.

Optionally include one real public hospital policy in read-only demonstration form.

The competition should be won by the complete patient-to-money flow, not by scraping 5,000 hospitals overnight.

---



# 5. FAP Policy Ingestion Architecture



## Pipeline

```text
Hospital FAP PDF / HTML
       ↓
Document Loader
       ↓
Text + page/section segmentation
       ↓
LLM Structured Extraction
       ↓
Zod Schema Validation
       ↓
Human/fixture verification
       ↓
Versioned FAP JSON
       ↓
Deterministic Eligibility Engine

```

The LLM is an extraction tool.

The structured JSON—not freeform LLM output—is what the eligibility engine uses.

---



# 6. Suggested FAP Schema

```ts
type FapPolicy = {
  id: string;
  hospitalId: string;
  effectiveDate: string;
  sourceDocumentId: string;

  policyScope: {
    emergencyCare: boolean;
    medicallyNecessaryCare: boolean;
    insuredPatientsEligible: boolean | "conditional";
  };

  householdDefinition?: string;

  freeCareRules: AssistanceRule[];

  discountedCareRules: AssistanceRule[];

  residency?: {
    required: boolean;
    states?: string[];
    notes?: string;
  };

  assets?: {
    evaluated: boolean;
    description?: string;
  };

  requiredDocuments: RequiredDocument[];

  applicationMethods: (
    | "online"
    | "mail"
    | "fax"
    | "in_person"
    | "phone"
  )[];

  applicationUrl?: string;

  billingOffice?: {
    phone?: string;
    address?: string;
  };

  collections?: {
    summary?: string;
  };

  citations: PolicyCitation[];
};

```

Assistance rule:

```ts
type AssistanceRule = {
  minFplPercent?: number;
  maxFplPercent?: number;

  assistanceType:
    | "free"
    | "percentage_discount"
    | "AGB_limit"
    | "custom";

  discountPercent?: number;

  conditions?: RuleCondition[];

  sourceCitationIds: string[];
};

```

Citation:

```ts
type PolicyCitation = {
  id: string;
  page?: number;
  section?: string;
  quoteFragment?: string;
};

```

Do not reproduce large copyrighted policy text unnecessarily.

Store the minimum excerpt needed for auditability.

---



# 7. Extraction Prompt Strategy

System intent:

```text
You are extracting structured financial-assistance rules
from a hospital's public Financial Assistance Policy.

Do not make eligibility decisions.
Do not infer requirements that are not present.
Return null/unknown where the policy does not specify a field.
Every extracted rule must point to a source page or section.

```

Output must conform to JSON schema.

Then validate using Zod.

If schema fails:

```text
status = NEEDS_REVIEW

```

Never silently invent missing values.

---



# 8. Deterministic Eligibility Engine

Inputs:

```ts
type PatientFinancialInputs = {
  householdSize: number;
  householdAnnualIncome: number;
  insuranceStatus: "insured" | "uninsured";
  state?: string;
  billAmount: number;
  firstBillingStatementDate?: string;
};

```

Derived:

```ts
fplIncomeThreshold
patientFplPercent
policyBracket
estimatedDiscount
estimatedAssistance
estimatedRemainingBalance
deadlineStatus

```

Result:

```ts
type FapEstimate = {
  outcome:
    | "potentially_eligible"
    | "potentially_ineligible"
    | "needs_more_information";

  estimatedAssistance?: number;
  estimatedRemaining?: number;

  assumptions: string[];

  reasons: string[];

  sourceCitationIds: string[];

  disclaimer:
    "The hospital makes the final financial-assistance determination.";
};

```

Do not let an LLM calculate the final financial numbers.

---



# 9. FPL Service

For MVP:

Create a versioned fixture:

```text
/fap-data/federal-poverty-guidelines-2026.json

```

Store:

- jurisdiction;
- year;
- household size;
- guideline amount.

Do not hardcode a single household value directly into eligibility logic.

Function:

```ts
calculateFplPercent({
  householdSize,
  annualIncome,
  guidelineTable
})

```

This enables annual updates.

---



# 10. Regulatory Timeline Engine

Input:

```text
firstPostDischargeBillingDate

```

Calculate:

```text
notificationPeriodStart
notificationPeriodDay
applicationPeriodStart
applicationPeriodDay
approxApplicationPeriodEnd

```

Federal baseline:

- 120-day notification period;
- 240-day application period.

UI language must remain careful.

Example:

> Based on the date you entered, you appear to be within the federal 240-day FAP application period described by IRS §501(r) regulations for applicable nonprofit hospitals.

Do not say:

> Collections are illegal for 240 days.

That is inaccurate.

---



# 11. Application Packet Service

Route:

```text
POST /api/cases/:caseId/application-packet

```

Produces:

```text
Case summary
Hospital application URL/document
Prefilled answers
Required document checklist
Submission instructions
Hospital contact
CareZero case ID
Timeline information

```

For hackathon:

Render as a clean printable HTML page.

PDF generation is optional.

---



# 12. Case State Machine

```text
DRAFT
  ↓
FAP_ANALYZED
  ↓
APPLICATION_PREPARED
  ↓
APPLICATION_SUBMITTED
  ↓
HOSPITAL_REVIEW
  ↓
APPROVED
  ↓
RESIDUAL_VERIFIED
  ↓
RELIEF_REQUESTED
  ↓
WORLD_CHECK_COMPLETE
  ↓
RELIEF_EVALUATED
  ↓
RELIEF_APPROVED
  ↓
GRANT_EXECUTED
  ↓
CLOSED

```

Alternative branches:

```text
DENIED
NEEDS_DOCUMENTS
RELIEF_REVIEW
RELIEF_DENIED

```

---



# 13. Hospital Decision Model

Hackathon endpoint:

```text
POST /api/demo/cases/:caseId/hospital-decision

```

Payload:

```json
{
  "status": "approved",
  "approvedAssistance": 15950,
  "remainingBalance": 2470,
  "source": "simulated_demo"
}

```

UI badge:

# SIMULATED HOSPITAL DECISION

Never hide this.

---



# 14. CareZero Relief Model

Data object:

```ts
type ReliefRequest = {
  id: string;
  caseId: string;

  residualBalance: number;

  fapProcessStatus:
    | "completed"
    | "not_available"
    | "exception_documented";

  worldCheckStatus:
    | "not_started"
    | "passed"
    | "failed";

  duplicateRisk:
    | "low"
    | "manual_review";

  requestedAmount: number;

  calculatedGrantAmount?: number;

  decision:
    | "pending"
    | "auto_approved"
    | "review_required"
    | "approved"
    | "denied";

  reasonCodes: string[];
};

```

---



# 15. Relief Rules Engine

Hackathon rules:

```ts
if (!fapProcessComplete) {
  return DENY_OR_REVIEW("FAP_NOT_COMPLETED");
}

if (!residualBalanceVerified) {
  return REVIEW("BALANCE_NOT_VERIFIED");
}

if (worldSignal !== "pass") {
  return REVIEW("LIVENESS_SIGNAL_MISSING");
}

if (duplicateRisk !== "low") {
  return REVIEW("DUPLICATE_RISK");
}

if (fundBalance < grantAmount) {
  return DENY("INSUFFICIENT_PROGRAM_FUNDS");
}

if (grantAmount <= AUTO_GRANT_CAP) {
  return AUTO_APPROVE;
}

return HUMAN_REVIEW;

```

The real production criteria would require legal/clinical-financial program design.

---



# 16. World Architecture



## Correct Use

World Selfie Check is used for:

**risk / abuse prevention in the discretionary Relief Fund.**

Not for:

- hospital FAP eligibility;
- access to CareZero;
- medical need;
- identity publication;
- medical necessity;
- final grant entitlement.

Flow:

```text
CareZero frontend
↓
World ID / Selfie Check
↓
World Sandbox verification
↓
Backend proof/result verification
↓
worldCheckStatus = passed
↓
Relief rules engine

```

Store:

```text
verificationStatus
verificationTimestamp
World reference/derived identifier only if supported and necessary

```

Do not store raw biometric content.

---



# 17. Required World Feedback File

Create:

```text
/docs/WORLD_FEEDBACK.md

```

It must discuss:

## Selfie Check Documentation

- what was clear;
- what was unclear;
- missing examples;
- integration friction.



## Developer Portal

- navigation;
- search;
- product discovery;
- app configuration;
- debugging.



## Sandbox

- testing setup;
- proof states;
- test users;
- errors;
- edge cases.



## Specific Issues

For every issue:

```text
Expected:
Actual:
Environment:
Steps:
Workaround:
Suggestion:

```

This is a formal qualification requirement for the ETHOnline World Selfie Check bounty.

---



# 18. Privy Architecture

Privy serves two distinct roles.

## A. Relief Fund Treasury Control

Create a Privy-controlled wallet:

```text
CareZero Relief Treasury

```

The organization treasury owns USDC used to fund the Arc ReliefPool contract.

Implement at least one **real Privy control**, because the B2B prize requires it.

Recommended:

### Policy

Restrict the treasury wallet to:

- Arc network;
- USDC;
- approved ReliefPool contract address;
- maximum transaction size;
- authorized operations.

Optional:

### Key Quorum

Use a 2-of-3 key quorum for sensitive actions.

Example:

```text
Treasury Admin
Compliance Reviewer
Foundation Director

2-of-3 required for:
- changing ReliefPool contract;
- moving > $1,000;
- emergency treasury withdrawal.

```

Privy supports key quorums and programmable wallet policies.

If key-quorum setup is too slow during the hackathon, implement a real Privy policy/signing control first.

A working control is more important than a mocked complex control.

---



# 19. Privy B2B Prize Flow

Show this explicitly in the demo or technical appendix.

```text
CareZero Relief Treasury
      ↓
Privy controlled organization wallet
      ↓
Policy validates:
Arc network
approved ReliefPool
USDC amount
      ↓
Authorized funding transaction
      ↓
ReliefPool receives USDC

```

This is a real:

- organization use case;
- wallet administration workflow;
- financial operation;
- policy-controlled transaction.

---



# 20. Privy Financial Flow Prize

A separate visible flow should use Privy to move funds.

Example:

```text
CareZero Treasury
    |
    | 1,000 USDC
    ▼
Arc ReliefPool

```

The UI should hide blockchain complexity.

Admin sees:

# Fund Relief Pool

Amount:

`1,000 USDC`

Button:

# Fund

Then:

```text
✓ Relief Pool funded
Available charitable capital: 25,000 USDC

```

Optional "View transaction."

This gives Privy judges an actual financial flow rather than just authentication.

---



# 21. Arc Architecture

Deploy:

```text
CareZeroReliefPool.sol

```

to Arc testnet.

Functions conceptually:

```solidity
deposit(uint256 amount)

configureProgram(
  bytes32 programId,
  uint256 maxGrantAmount
)

authorizeExecutor(address executor)

releaseGrant(
  bytes32 caseHash,
  bytes32 programId,
  address provider,
  uint256 amount,
  bytes32 decisionHash
)

pause()

unpause()

```

Keep contract narrow.

Do not put patient logic onchain.

---



# 22. Suggested ReliefPool Contract Model

State:

```solidity
mapping(bytes32 => bool) public paidCases;

mapping(bytes32 => uint256) public programGrantCaps;

mapping(address => bool) public authorizedExecutors;

bool public paused;

```

Grant release conditions:

```text
caller is authorized executor
pool not paused
caseHash not previously paid
amount > 0
amount <= program cap
pool has sufficient USDC
provider != zero address

```

Then:

```text
paidCases[caseHash] = true
USDC.safeTransfer(provider, amount)
emit GrantReleased(...)

```

This prevents a duplicate contract-level payout for the same case hash.

Offchain CareZero still handles broader anti-duplication logic.

---



# 23. Privacy-Safe Case Hash

Never hash obvious raw PII such as:

```text
hash(name + DOB)

```

That can be vulnerable to guessing/correlation.

Generate an internal random case secret:

```text
caseUUID
+
randomSalt
+
environmentDomain

```

Then:

```text
caseHash = keccak256(caseUUID || salt || domain)

```

Store the mapping privately offchain.

---



# 24. Provider Settlement Address

The demo uses:

```text
Example Medical Center Settlement Wallet

```

Clearly label it:

**Demo settlement wallet representing the provider's billing account.**

Do not imply real hospitals currently accept USDC.

Future production could use:

- provider crypto settlement where supported;
- regulated stablecoin-to-fiat infrastructure;
- banking/payment partners;
- check/ACH abstraction.

The Arc proof of concept demonstrates programmable charitable settlement.

---



# 25. Arc Onchain Finance Prize Fit

Do not make the Arc integration simply:

```solidity
usdc.transfer(provider, 500e6);

```

The product should demonstrate **conditional multi-step settlement**.

Flow:

```text
Privy Treasury funds ReliefPool
↓
program configured
↓
verified case reaches eligible state
↓
Relief Agent generates decision
↓
authorized agent triggers contract
↓
contract enforces:
case not previously paid
program cap
authorized executor
available liquidity
↓
USDC released
↓
GrantReleased event
↓
CareZero records transaction

```

That is substantially more aligned with Arc's stated preference for:

- programmable money flows;
- conditional payments;
- onchain automation;
- multi-step settlement.

---



# 26. Circle Agent Stack Architecture

Create:

```text
CareZero Relief Agent

```

The agent uses structured tools/functions.

Do not give the model unrestricted discretion over money.

Agent tools:

```text
getCaseReliefFacts(caseId)
getProgramRules(programId)
getPoolBalance()
evaluateReliefRules(caseId)
prepareGrant(caseId)
executeApprovedGrant(grantId)
getArcTransaction(txHash)

```

LLM may explain.

Deterministic code controls grant eligibility.

---



# 27. Agent Decision Logic

The agent's decision should visibly depend on real product signals:

```text
FAP status
hospital decision
verified residual balance
World liveness signal
duplicate-risk status
grant cap
available ReliefPool balance
approval threshold

```

This matters because Arc specifically asks for agents with **clear decision logic tied to real signals**.

The demo should display these checks.

---



# 28. Agent Wallet Strategy

Circle Agent Wallets support autonomous transactions and programmable controls.

However:

**Circle's built-in custom spending policies currently require mainnet Agent Wallets.**

Therefore for the hackathon:

## Testnet

Use:

- Arc testnet;
- CareZero deterministic grant rules;
- ReliefPool contract limits;
- authorized executor;
- Privy treasury controls;
- minimal agent wallet balance where needed.



## Mainnet Path

If pursuing the conditional Arc mainnet prize portion by September 30:

- deploy the same ReliefPool architecture to Arc mainnet;
- create mainnet Agent Wallet;
- add Circle spending policy;
- cap transfer window;
- restrict recipients/contracts where supported.

Document this clearly.

Do not falsely claim a Circle testnet policy exists if the feature is mainnet-only.

---



# 29. Recommended Agent/Treasury Separation

Use separate financial responsibilities.

```text
PRIVY RELIEF TREASURY
Longer-term funds
Controlled by CareZero organization
Policies/quorum
        |
        | deposits USDC
        ▼
ARC RELIEFPOOL CONTRACT
Program capital
Grant caps
Duplicate case protection
        |
        | authorized release
        ▼
CIRCLE RELIEF AGENT
Triggers qualifying payouts
        |
        ▼
PROVIDER SETTLEMENT WALLET

```

This is superior to giving an AI agent unrestricted control of the entire treasury.

It also creates excellent sponsor storytelling.

---



# 30. CareZero Backend APIs



## Hospital

```text
GET /api/hospitals
GET /api/hospitals/:id
GET /api/hospitals/:id/fap

```



## Case

```text
POST /api/cases
GET /api/cases/:id
PATCH /api/cases/:id

```



## Estimate

```text
POST /api/cases/:id/estimate

```



## Application

```text
POST /api/cases/:id/application-packet
POST /api/cases/:id/mark-submitted

```



## Demo Decision

```text
POST /api/demo/cases/:id/hospital-decision

```



## World

```text
POST /api/world/verify

```



## Relief

```text
POST /api/cases/:id/relief-request
POST /api/relief/:id/evaluate
POST /api/relief/:id/approve
POST /api/relief/:id/execute

```



## Treasury

```text
GET /api/treasury/balance
POST /api/treasury/fund-relief-pool

```



## Blockchain

```text
GET /api/transactions/:hash

```

---



# 31. Database Model



## hospitals

```text
id
name
system_name
city
state
type
fap_url
application_url
created_at
updated_at

```



## fap_policy_versions

```text
id
hospital_id
effective_date
source_document_hash
structured_policy_json
validation_status
reviewed_at
created_at

```



## cases

```text
id
public_case_id
hospital_id
status
created_at
updated_at

```



## case_sensitive_data

Separate encrypted table.

```text
case_id
bill_amount
household_size
annual_income
insurance_status
first_bill_date
residency_data
encrypted_document_refs

```



## estimates

```text
id
case_id
policy_version_id
outcome
estimated_assistance
estimated_remaining
explanation_json
created_at

```



## hospital_decisions

```text
id
case_id
decision
approved_assistance
remaining_balance
verification_source
is_demo
created_at

```



## world_verifications

```text
id
case_id
status
verification_reference
verified_at

```



## relief_requests

```text
id
case_id
program_id
requested_amount
approved_amount
status
decision_reason_json
created_at

```



## grants

```text
id
relief_request_id
case_hash
program_id
amount_usdc
provider_settlement_address
arc_tx_hash
status
executed_at

```

---



# 32. Frontend Pages



## `/`

Landing page.

CTA:

**Check My Bill**

## `/check`

Four-input hero workflow.

## `/result/:caseId`

Potential assistance.

Show:

- original bill;
- potential assistance;
- estimated remainder;
- why;
- source policy.



## `/application/:caseId`

Application preparation.

## `/case/:caseId`

Timeline.

## `/case/:caseId/decision`

Hospital outcome.

## `/case/:caseId/relief`

CareZero Relief explanation.

## `/case/:caseId/verify`

World Selfie Check.

## `/case/:caseId/relief-status`

Agent checks.

## `/case/:caseId/success`

Final $18,420 → $1,970 screen.

## `/fund`

Relief Fund transparency page.

## `/admin`

Privy treasury + grant approval controls.

---



# 33. UX Rules

Patient should see no crypto terminology before the final optional proof screen.

Use:

**CareZero Relief Fund**

instead of:

**USDC liquidity pool**

Use:

**Grant delivered**

instead of:

**ERC-20 transfer confirmed**

Use:

**Fund protected by organizational approval rules**

instead of:

**2-of-3 key quorum**

The technical detail belongs in:

**How CareZero works**

and the judge presentation.

---



# 34. Donor Transparency Dashboard

Public safe data:

```text
CareZero Relief Fund

Total contributed
$25,000

Relief delivered
$8,250

Open verified requests
14

Grants completed
31

Average grant
$266

Platform fee taken from grants
$0

Patient medical data published
0

```

Optional:

**Verify on Arc**

This is where blockchain becomes understandable to normal people.

---



# 35. Security Boundaries



## AI Boundary

LLM cannot:

- send money;
- change grant caps;
- approve high-value grant;
- determine final hospital eligibility.



## Agent Boundary

Agent may:

- inspect structured facts;
- call authorized functions;
- execute grants within policy.

Agent may not:

- read tax returns unless absolutely required;
- change treasury ownership;
- change ReliefPool owner;
- exceed contract cap;
- withdraw arbitrary treasury funds.



## Human Boundary

High-value operations require human approval.

---



# 36. Audit Log

Record:

```text
CASE_CREATED
FAP_POLICY_SELECTED
ESTIMATE_CALCULATED
APPLICATION_PREPARED
APPLICATION_SUBMITTED
HOSPITAL_DECISION_RECORDED
RELIEF_REQUESTED
WORLD_CHECK_PASSED
RELIEF_RULES_EVALUATED
HUMAN_APPROVAL_GRANTED
GRANT_EXECUTION_REQUESTED
GRANT_EXECUTED

```

Sensitive metadata remains private.

Public blockchain is not the complete audit log.

---



# 37. ETHGlobal AI Disclosure

Create:

```text
/docs/AI_DISCLOSURE.md

```

State:

```text
AI tools used:
ChatGPT
Claude Code / Cursor / other actual IDE assistant

AI-assisted areas:
architecture planning
documentation
UI scaffolding
test generation
code suggestions
FAP extraction schema
copy editing

Human contributions:
product concept
architecture decisions
sponsor selection
rule design
security boundaries
integration testing
debugging
deployment
demo construction
validation

```

Update with what actually occurs.

ETHGlobal requires transparency about AI-assisted code/files/assets.

---



# 38. Spec-Driven Development Requirement

If using this document as a coding specification, preserve it in the repo.

Recommended:

```text
/docs/specs/MASTER_BLUEPRINT.md
/docs/specs/TECH_ARCHITECTURE.md
/docs/specs/PRIZE_STRATEGY.md
/docs/specs/prompts/

```

If a coding harness is driven by prompts/spec files, keep those artifacts.

ETHGlobal explicitly requires spec-driven prompts/planning artifacts to be included when that development approach is used.

---



# 39. Repository Structure

```text
carezero/
│
├── app/
│   ├── page.tsx
│   ├── check/
│   ├── result/
│   ├── application/
│   ├── case/
│   ├── relief/
│   ├── fund/
│   └── admin/
│
├── components/
│   ├── bill/
│   ├── fap/
│   ├── relief/
│   ├── world/
│   └── treasury/
│
├── lib/
│   ├── fap/
│   │   ├── schema.ts
│   │   ├── calculate.ts
│   │   ├── timeline.ts
│   │   └── fixtures/
│   │
│   ├── relief/
│   │   ├── rules.ts
│   │   ├── agent.ts
│   │   └── case-hash.ts
│   │
│   ├── privy/
│   ├── world/
│   ├── arc/
│   ├── circle/
│   └── db/
│
├── contracts/
│   ├── CareZeroReliefPool.sol
│   └── test/
│
├── scripts/
│   ├── deploy-relief-pool.ts
│   ├── seed-fap.ts
│   └── fund-pool.ts
│
├── data/
│   ├── hospitals/
│   └── fpl/
│
├── docs/
│   ├── MASTER_BLUEPRINT.md
│   ├── TECH_ARCHITECTURE.md
│   ├── PRIZE_STRATEGY.md
│   ├── WORLD_FEEDBACK.md
│   ├── AI_DISCLOSURE.md
│   ├── SECURITY_PRIVACY.md
│   ├── RESEARCH_EVIDENCE.md
│   ├── DEMO_SCRIPT.md
│   └── BUSINESS_MARKETING.md
│
└── README.md

```

---



# 40. Build Priority



## P0 — Cannot submit without

- working Next.js UI;
- FAP estimate;
- application-preparation screen;
- simulated hospital outcome;
- relief request;
- World Selfie Check;
- Privy wallet/control;
- Privy financial flow;
- Arc contract;
- Arc USDC transaction;
- Agent Stack integration;
- architecture diagram;
- public repository;
- 2–4 minute demo.



## P1 — Strongly preferred

- donor dashboard;
- policy explanation;
- deadline tracker;
- admin grant approval;
- real FAP source reference;
- transaction explorer link;
- robust README.



## P2 — Only if time remains

- multiple hospitals;
- OCR;
- multi-language;
- PDF export;
- full scraping;
- state law engine;
- hospital portal.

---



# 41. Technical Success Test

The project is ready when this test passes:

```text
1. Open fresh browser.

2. Enter:
   $18,420
   household 3
   $51,000
   insured

3. Receive FAP estimate.

4. Click Prepare Application.

5. Advance demo case to hospital-approved.

6. See $2,470 residual.

7. Click CareZero Relief.

8. Complete World Sandbox Selfie Check.

9. Relief rules execute.

10. Required Privy approval occurs if demo amount exceeds auto threshold.

11. Circle Relief Agent executes.

12. Arc transaction succeeds.

13. Provider demo wallet receives 500 USDC.

14. Final screen displays $1,970.

15. Public dashboard shows one new grant without exposing the patient's identity.

```

If all 15 steps work reliably, stop adding features and prepare the video.