# CareZero

## Before the bill becomes debt.

CareZero is an open-source patient financial advocacy platform and transparent charitable relief rail.

CareZero helps patients find and understand hospital Financial Assistance Policies, estimate whether they may qualify for assistance, prepare the application process, track important financial-assistance timelines, and understand the hospital's final decision.

When hospital financial assistance still leaves a verified unaffordable balance, CareZero can route the case into a separate independent charitable Relief Fund.

The CareZero Relief Rail uses:

* **World Selfie Check** as one abuse-prevention signal for scarce charitable funds;
* **Privy** as the institutional wallet, policy, and approval layer for the charitable organization;
* **Circle Agent Stack** to orchestrate approved grant execution; and
* **Arc + USDC** as the programmable settlement layer.

Sensitive patient information remains offchain.

The patient never needs to manage cryptocurrency.

---

# The Problem

A patient can receive a hospital bill for thousands—or tens of thousands—of dollars without realizing that the hospital may already have a Financial Assistance Policy capable of reducing the amount significantly.

Applicable nonprofit hospitals are required to maintain written Financial Assistance Policies.

Those policies can describe:

* free care;
* discounted care;
* income thresholds;
* household rules;
* insurance conditions;
* residency rules;
* application procedures;
* required documentation;
* billing and collection procedures.

But the existence of a policy does not make it easy to use.

Patients may still need to:

1. locate the correct hospital policy;
2. interpret a lengthy PDF;
3. determine which income rule applies;
4. understand Federal Poverty Level thresholds;
5. collect financial documents;
6. locate the application;
7. understand important dates;
8. submit the application;
9. respond to missing-document requests;
10. follow up with billing;
11. understand the final decision;
12. find additional help if a balance remains.

CareZero turns that fragmented process into a guided workflow.

---

# The Core Insight

## The financial help may already exist.

## The interface doesn't.

CareZero does not create the hospital's financial-assistance program.

CareZero makes the existing program easier to discover, understand, and use.

---

# What CareZero Does

The complete CareZero Rail is:

```text
Hospital bill
      ↓
Hospital FAP discovered
      ↓
Policy converted into structured rules
      ↓
Potential eligibility estimated
      ↓
Patient sees why
      ↓
Application prepared
      ↓
Timeline tracked
      ↓
Hospital makes final decision
      ↓
Remaining balance verified
      ↓
CareZero Relief considered
      ↓
World abuse-prevention signal
      ↓
Objective Relief rules
      ↓
Privy-controlled nonprofit approval
      ↓
Circle Relief Agent
      ↓
Arc + USDC settlement
      ↓
Transparent grant proof
```

---

# ETHOnline Demo Case

Our fictional demo patient receives:

# $18,420

in hospital charges.

They enter:

```text
Hospital:
Example Medical Center

Bill:
$18,420

Household size:
3

Annual household income:
$51,000

Insurance:
Yes
```

CareZero analyzes the hospital's demonstration Financial Assistance Policy.

The patient sees:

```text
Original Bill                  $18,420

Potential Hospital Assistance  $15,950

Potential Remaining Balance     $2,470
```

The UI says:

# You may qualify for financial assistance.

It does **not** say:

# You qualify.

The hospital remains the final decision-maker.

---

# Hospital Financial-Assistance Workflow

CareZero prepares:

* application information;
* required-document checklist;
* submission instructions;
* hospital financial-assistance contact information;
* relevant policy citations;
* federal timeline information.

For the ETHOnline demo, the hospital then produces a clearly labeled:

# SIMULATED HOSPITAL DECISION

The decision is:

```text
Original balance               $18,420

Hospital financial assistance -$15,950

Remaining balance               $2,470
```

---

# CareZero Relief

The patient still has:

# $2,470

remaining.

CareZero Relief is a separate independent charitable program.

For the demonstration:

```text
CareZero General Medical Hardship Fund

Demo available capital:
$25,000

Maximum standard grant:
$500

Automatic execution threshold:
$250

$251–$1,000:
human review

Patient fee:
$0
```

CareZero checks:

```text
✓ Hospital assistance processed

✓ Residual balance exists

✓ Residual balance verified

✓ CareZero program rules satisfied

✓ Anti-abuse signal completed

✓ Funding available
```

A $500 grant requires human authorization in the demonstration because it exceeds the $250 autonomous threshold.

---

# World

World Selfie Check is used only for:

# CareZero Relief abuse prevention.

It is not used for:

* hospital FAP eligibility;
* hospital application access;
* patient education;
* medical eligibility;
* treatment decisions;
* diagnosis;
* hospital rights.

The patient can access the entire hospital financial-assistance navigator without World.

The Relief screen explicitly explains:

> CareZero Relief is supported by limited charitable funds. We use World Selfie Check as one liveness signal to help reduce automated abuse of this separate fund.

A production CareZero system should also offer a manual-review pathway for users unable or unwilling to complete a biometric verification.

CareZero does not store the patient's selfie.

---

# Privy

CareZero uses Privy as the institutional control layer for the charitable organization.

The architecture separates:

```text
CareZero Relief Treasury
        │
        │ Privy organization controls
        ▼
CareZero ReliefPool
        │
        │ limited program capital
        ▼
Relief Agent
        │
        ▼
Verified medical obligation
```

Privy is used for:

* CareZero organizational wallet infrastructure;
* treasury operations;
* financial flow;
* policies;
* signers and/or approval controls;
* restricting what the charitable treasury can do.

The agent does not receive unrestricted access to CareZero's treasury.

---

# Circle Agent Stack

CareZero uses a constrained Relief Agent.

The agent receives structured signals including:

```text
FAP process status

hospital decision

verified residual balance

World result

duplicate-risk status

program grant cap

available ReliefPool balance

approval state
```

The agent does **not** decide the hospital's financial-assistance eligibility.

It does **not** determine medical necessity.

It does **not** change grant rules.

It orchestrates an already governed financial workflow.

CareZero's design principle is:

# AI interprets.

# Deterministic code calculates.

# Humans govern.

# Smart contracts enforce.

---

# Arc

Arc is CareZero's programmable charitable settlement layer.

The CareZero ReliefPool uses USDC and enforces conditions such as:

```text
authorized executor

active program

grant within program cap

case not already paid

valid settlement destination

sufficient ReliefPool balance
```

Only after those requirements are satisfied can the approved grant execute.

This makes the payment flow more meaningful than a simple token transfer.

---

# Final Demo Result

After the CareZero Relief grant:

```text
Original Bill                  $18,420

Hospital Assistance           -$15,950

CareZero Relief                  -$500

---------------------------------------

Remaining Balance               $1,970
```

The demo closes with:

# The hospital already had the assistance program.

# CareZero made it usable.

And:

# When assistance stopped short, CareZero carried transparent charitable relief the rest of the way.

---

# Why Blockchain?

CareZero deliberately does **not** put hospital financial-assistance eligibility onchain.

That problem does not require a blockchain.

The blockchain begins where independently donated money enters the system.

Traditional charitable relief requires donors to trust an organization's internal accounting.

CareZero can instead make the financial movement verifiable:

```text
charitable capital
↓
program contract
↓
approved grant
↓
USDC settlement
↓
verifiable transaction
```

while keeping private:

```text
patient name

diagnosis

income

hospital bill

insurance data

tax documents

medical record
```

The result is:

# Private patient.

# Public financial accountability.

---

# Why Not Tokenize Medical Debt?

CareZero does not tokenize:

* patient debt;
* medical claims;
* patient identities;
* hardship cases.

Patients are not financial assets.

CareZero uses blockchain only to improve the transparency and programmability of charitable capital.

---

# Architecture

```text
                    CAREZERO

                  Patient App
              Next.js / TypeScript
                       │
                       ▼
                CareZero API
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    FAP Intelligence          Case Workflow
          │                         │
     AI extraction                  │
          │                         │
    Structured rules                │
          │                         │
    Deterministic engine            │
          │                         │
          └────────────┬────────────┘
                       │
                Hospital Decision
                       │
                Residual Balance
                       │
                       ▼
                 CAREZERO RELIEF

                       │
               World Selfie Check
                       │
                       ▼
               Relief Rules Engine
                       │
                       ▼
               Circle Relief Agent
                       │
                  approval state
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Privy                 Arc
    organization control     ReliefPool
       + treasury              + USDC
             │                   │
             └─────────┬─────────┘
                       ▼
              Provider Settlement
```

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* TypeScript
* Next.js server routes / Node
* Zod validation

## Database

* PostgreSQL
* Supabase acceptable for MVP

## Policy Intelligence

* FAP PDF/HTML ingestion
* structured JSON extraction
* schema validation
* deterministic eligibility rules

## Web3

* Arc
* USDC
* Solidity
* viem
* Privy
* Circle Agent Stack
* World Selfie Check

## Contracts

* OpenZeppelin components
* CareZeroReliefPool

---

# FAP Architecture

CareZero does not feed a hospital policy into an LLM and blindly trust the answer.

The pipeline is:

```text
Public Hospital FAP
↓
Text extraction
↓
AI structured extraction
↓
Schema validation
↓
Policy citations
↓
Versioned policy JSON
↓
Deterministic eligibility calculation
```

If a policy rule cannot be interpreted confidently:

```text
NEEDS_REVIEW
```

is returned.

CareZero should never invent a missing eligibility requirement.

---

# Explainability

Every patient estimate should answer:

# Why am I seeing this?

Example:

```text
Household size:
3

Household income:
$51,000

Policy bracket:
Matched

Insurance:
Allowed under this policy

Source:
Financial Assistance Policy
```

The calculation is traceable back to the policy.

---

# Federal Timeline Support

CareZero tracks educational timeline information tied to nonprofit-hospital Financial Assistance Policies.

The federal Section 501(r) framework includes concepts commonly described as:

* a 120-day notification period;
* a 240-day application period.

CareZero can show:

```text
First billing statement:
August 20, 2026

Approximate application-period status:
Day 24 of 240
```

This is educational information.

CareZero does not provide legal advice and does not claim all collection actions are prohibited during the entire period.

---

# Privacy Architecture

## Never onchain

CareZero does not publish:

* patient name;
* diagnosis;
* treatment;
* medical record;
* income;
* bill PDF;
* tax documentation;
* SSN;
* insurance information;
* World selfie.

## Possible onchain information

Only privacy-minimized values such as:

```text
caseHash

programId

grantAmount

settlementAddress

decisionHash

transaction status
```

The case hash is created from a random case identifier and salt rather than guessable PII.

---

# Demo Privacy

The ETHOnline version uses:

# fictional patient information only.

The hospital decision is:

# simulated.

The provider wallet is:

# a demonstration settlement wallet.

Testnet funds are used for the hackathon integration.

---

# Repository Structure

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
│
├── lib/
│   ├── fap/
│   ├── relief/
│   ├── world/
│   ├── privy/
│   ├── arc/
│   ├── circle/
│   └── db/
│
├── contracts/
│   ├── CareZeroReliefPool.sol
│   └── test/
│
├── data/
│   ├── hospitals/
│   └── fpl/
│
├── scripts/
│
├── docs/
│   ├── MASTER_BLUEPRINT.md
│   ├── TECH_ARCHITECTURE.md
│   ├── PRIZE_STRATEGY.md
│   ├── BUSINESS_MARKETING.md
│   ├── RESEARCH_EVIDENCE.md
│   ├── SECURITY_PRIVACY_COMPLIANCE.md
│   ├── DATA_MODEL_API.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── DEMO_SCRIPT.md
│   ├── WORLD_FEEDBACK.md
│   ├── AI_DISCLOSURE.md
│   └── DEPLOYMENTS.md
│
└── README.md
```

---

# Running Locally

## Requirements

* Node.js
* package manager
* PostgreSQL or configured Supabase project
* World developer configuration
* Privy developer configuration
* Circle developer configuration
* Arc RPC access
* test USDC
* test wallets

## Installation

```bash
npm install
```

Create:

```text
.env.local
```

using the project's environment template.

Then:

```bash
npm run dev
```

---

# Environment Variables

Expected configuration includes values similar to:

```text
DATABASE_URL

NEXT_PUBLIC_APP_URL

PRIVY_APP_ID
PRIVY_APP_SECRET

WORLD_APP_ID
WORLD_ACTION_ID

ARC_RPC_URL
ARC_CHAIN_ID

USDC_ADDRESS
RELIEF_POOL_ADDRESS

CIRCLE_API_KEY
CIRCLE_ENTITY_SECRET

DEMO_PROVIDER_SETTLEMENT_ADDRESS

AI_API_KEY

DEMO_MODE=true
```

Never commit production secrets.

---

# Smart Contract Development

Compile:

```bash
npm run contracts:compile
```

Test:

```bash
npm run contracts:test
```

Deploy to Arc testnet:

```bash
npm run deploy:arc:testnet
```

Deployment details belong in:

```text
docs/DEPLOYMENTS.md
```

---

# Minimum Smart Contract Tests

The ReliefPool test suite must verify:

```text
deposit works

authorized grant works

unauthorized executor fails

duplicate case fails

grant above cap fails

zero settlement address fails

insufficient balance fails

paused contract rejects execution

unpause restores execution

grant event is emitted

recipient receives correct USDC
```

---

# Sponsor Integrations

## Privy

CareZero targets:

### Best B2B Financial Product

The Relief Fund treasury is an organizational financial operation.

CareZero uses at least:

* one Privy wallet;
* one business workflow;
* one Privy control;
* a real treasury operation.

### Best Financial Flow

CareZero uses Privy to perform a real supported financial action, such as funding the ReliefPool.

---

## Arc

CareZero targets:

### Best DeFi / Onchain Finance Application

CareZero uses Arc + USDC for conditional, programmable charitable settlement.

### Best Agentic Economy Application with Circle Agent Stack

The constrained Relief Agent uses real case/program signals and Circle Agent Stack to orchestrate authorized USDC settlement on Arc.

Arc's ETHOnline 2026 rules state that portions of these prize amounts depend on deployment of the same project to Arc Mainnet by September 30, 2026.

A separate deployment configuration must therefore be maintained.

---

## World

CareZero targets:

### Selfie Check

World is used as a meaningful abuse-prevention signal for a scarce charitable fund.

A separate developer-feedback document is included at:

```text
docs/WORLD_FEEDBACK.md
```

---

# Why Privy + Arc + World?

Each sponsor solves a different problem.

## Privy

# Who is allowed to control the money?

## Arc

# Under what rules does the money move?

## World

# How do we add a low-friction human/liveness signal before scarce aid is released?

This separation prevents sponsor integrations from feeling artificial.

---

# Competitors

CareZero is not the first organization to help patients find hospital financial assistance.

That is a strength, not a weakness.

Organizations such as Dollar For validate that:

* patients need charity-care navigation;
* hospital policy databases are useful;
* digital screening can help;
* free patient advocacy has real value.

CareZero expands the category through:

```text
structured FAP intelligence

explainable eligibility estimation

federal timeline tracking

application workflow

hospital decision tracking

verified residual hardship

independent charitable Relief Rail

programmable donor capital

privacy-safe public financial proof
```

A future CareZero system could accept cases from Dollar For and similar advocacy organizations.

---

# What CareZero Is Not

CareZero is not:

* a lender;
* medical credit;
* a debt collector;
* a debt purchaser;
* an insurer;
* a hospital;
* a final FAP eligibility authority;
* a legal-advice service;
* a medical-advice service;
* a medical-debt tokenization marketplace.

---

# Business Model

Patients should remain free.

Possible future sustainability sources include:

* philanthropic grants;
* health-equity grants;
* hospital SaaS integrations;
* employer benefits;
* nonprofit partnerships;
* foundation support;
* enterprise APIs;
* implementation services.

CareZero should never monetize by:

* taking a percentage of hospital assistance;
* selling patient health information;
* selling debt-relief leads;
* steering patients toward medical loans;
* allowing donors to purchase influence over patient selection.

---

# Relief Fund Governance

The intended future structure is independent and need-based.

Principles include:

```text
CareZero defines objective grant criteria.

Donors contribute to a broad fund.

Donors do not choose individual patients.

Donors do not receive patient identities.

Donors do not condition aid on their product.

Donors do not condition aid on a specific provider.

Patient medical information remains private.
```

A real-money launch requires specialized healthcare, nonprofit, privacy, payments, and tax counsel.

---

# Current Status

ETHOnline MVP.

Not a production medical or charitable service.

The prototype uses:

* fictional patient data;
* testnet assets;
* simulated hospital determinations;
* demonstration settlement addresses.

---

# ETHOnline Demo

The core demo is intentionally simple:

```text
$18,420
↓
$15,950 hospital assistance
↓
$2,470 remaining
↓
$500 CareZero Relief
↓
$1,970 remaining
```

The closing statement is:

# The hospital already had the assistance program.

# CareZero made it usable.

---

# AI Development Disclosure

AI-assisted development is permitted under ETHOnline rules but must be transparently documented.

See:

```text
docs/AI_DISCLOSURE.md
```

All spec-driven planning artifacts used to direct coding assistants are preserved in the repository.

---

# Disclaimer

CareZero currently exists as a hackathon prototype.

It provides educational and administrative support based on published financial-assistance information.

It does not:

* determine hospital eligibility;
* guarantee financial assistance;
* provide legal advice;
* provide medical advice;
* guarantee collection protections.

Hospital and state requirements vary.

Production deployment requires further legal, privacy, security, charitable-governance, and healthcare-regulatory review.

---

# CareZero

## The financial help may already exist.

## CareZero makes it usable.
