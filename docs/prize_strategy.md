# CareZero — ETHOnline 2026 Prize Strategy

## 1. Selected Partners

Select exactly:

# 1. Arc

# 2. Privy

# 3. World

Do not select Hedera.

Do not select ENS.

Those technologies could potentially be used, but neither is as central to the CareZero architecture as the selected three.

ETHOnline permits a project to select up to **three Partner Prizes**.

When one selected partner has multiple tracks, the project may be eligible for multiple tracks from that partner while that partner still consumes only one of the three partner selections.

CareZero is deliberately designed to create **five credible track-level submissions from three selected partners.**

---

# 2. Targeted Tracks

## Privy

### Best B2B Financial Product — $2,500 pool

CareZero fit:

**CareZero Relief Fund Treasury**

Use:

* Privy wallet;
* organization-controlled treasury;
* wallet policy;
* signer or key-quorum structure;
* controlled USDC funding;
* approval workflow.

### Best Financial Flow — $2,500 pool

CareZero fit:

**Funding the ReliefPool and/or executing an approved financial operation through Privy.**

Show a real supported Privy wallet action.

---

## Arc

### Best DeFi/Onchain Finance Application — $3,500 pool

CareZero fit:

**CareZero ReliefPool**

Use:

* Arc;
* USDC;
* programmable conditional settlement;
* multi-stage grant flow;
* smart-contract restrictions;
* funding and payout lifecycle.

Important:

Of this track's stated $3,500 amount, ETHGlobal currently notes that **$2,500 will only be awarded if the same project is deployed to Arc Mainnet by September 30, 2026.**

Build on Arc testnet now.

Preserve a mainnet deployment path.

### Best Agentic Economy Application with Circle Agent Stack — $3,500 pool

CareZero fit:

**CareZero Relief Agent**

Agent reads:

* FAP completion signal;
* hospital decision;
* residual balance;
* World result;
* program rules;
* available funding;
* approval requirement.

Agent then:

* determines execution route;
* executes eligible grant settlement;
* records Arc transaction.

The agent must have **clear decision logic tied to real signals**.

This cannot simply be:

> ChatGPT decides to send $500.

Important:

The same Arc September 30 mainnet condition applies to part of this prize.

---

## World

### Selfie Check — $3,500 pool

World indicates this track may award up to three teams.

CareZero fit:

**Relief Fund abuse prevention.**

Use World Selfie Check only for the separate, limited charitable grant pool.

Do not use it as a gate for hospital FAP access.

World specifically wants realistic uses of Selfie Check as a signal for:

* risk;
* eligibility;
* fairness;
* continuity;
* abuse prevention.

CareZero's implementation squarely fits abuse prevention/fairness around scarce charitable resources.

---

# 3. Total Prize Surface

The selected sponsor pools relevant to CareZero are:

```text
Privy B2B                      $2,500
Privy Financial Flow           $2,500

Arc Onchain Finance            $3,500
Arc Agentic Economy            $3,500

World Selfie Check             $3,500 pool
------------------------------------------------
Relevant track pools          $15,500
```

Do **not** claim:

> CareZero can win $15,500.

World's track can be split among multiple teams, sponsors determine winners, and a project should never assume it can sweep every category.

Use:

> CareZero is purpose-built to qualify credibly for five track categories across our three selected partners.

---

# 4. Why Not Hedera

Hedera's current ETHOnline bounty is excellent, but CareZero does not possess a natural tokenized real-world asset.

Possible forced concepts would include:

* tokenized debt;
* tokenized grant entitlement;
* tokenized patient case.

Those would actively weaken CareZero.

We do not want to tokenize medical debt.

We do not want to turn patients into assets.

We do not want a tradable financial claim attached to someone's hardship.

Hedera would reduce product coherence.

Do not use it.

---

# 5. Why Not ENS

ENSv2 could theoretically enable delegated permissions such as:

```text
case123.carezero.eth
```

with patient/advocate/hospital roles.

But ENS's bounty expects ENSv2 to be central rather than cosmetic.

CareZero can implement access control more directly within its application and Privy architecture.

Adding ENS only to create a case name would look sponsor-driven rather than problem-driven.

Do not use it for ETHOnline.

---

# 6. Privy Track — Exact Mapping

ETHOnline's Privy B2B criteria require a project to:

* integrate Privy as a core part of the product;
* create or use at least one Privy wallet;
* demonstrate an organization/business use case;
* implement a functional B2B workflow;
* use at least one Privy control such as policies, signers, key quorums, or intents;
* provide working demo/source;
* explain how Privy enables the product.

CareZero should satisfy every criterion visibly.

## CareZero implementation

### Wallet

```text
CareZero Relief Treasury
```

### Organization Use Case

Nonprofit financial operations.

### B2B Workflow

Funding the ReliefPool.

### Privy Control

Minimum:

```text
Treasury wallet policy:
- Arc network only
- approved contract allowlist
- USDC only where supported
- transfer size restriction
```

Stronger:

```text
2-of-3 approval / key quorum for higher-value treasury operations
```

### Demo

Admin page:

```text
CareZero Relief Treasury
Balance: 25,000 USDC

Policy:
✓ Arc only
✓ ReliefPool contract approved
✓ High-value transactions require review
```

Button:

**Fund Relief Pool**

---

# 7. Privy Financial Flow — Exact Mapping

Privy wants a functional financial flow using generally available features.

CareZero flow:

```text
Privy CareZero Treasury
↓
1,000 USDC
↓
Arc CareZeroReliefPool
```

Why Privy matters:

A nonprofit employee should not:

* install MetaMask;
* export a private key;
* paste an address;
* sign an opaque transaction.

They should see:

```text
Fund Relief Pool

Amount: $1,000

Destination:
CareZero General Medical Hardship Program

[Review]

[Approve]
```

Privy turns blockchain treasury management into normal organizational finance UX.

That is the story.

---

# 8. How to Make the Privy Integration Score Higher

Do not stop at:

> We use Privy to log in.

That will waste the sponsor.

Demonstrate:

1. actual Privy wallet;
2. treasury funding;
3. Privy-enforced control;
4. policy failure.

The policy failure is an excellent technical moment.

Example:

Try to send:

```text
5,000 USDC
```

when policy allows only:

```text
1,000
```

Display:

# Transaction blocked by CareZero treasury policy.

Then execute valid funding.

This proves the security architecture is real.

---

# 9. Privy Judge Pitch

> CareZero's patient experience hides crypto completely, but charitable money requires institutional controls. Privy is the account and control layer for the CareZero Relief Fund. The nonprofit treasury uses a Privy-controlled wallet with explicit policies and approval controls, then funds our programmable Arc ReliefPool. Privy lets a real charity operate onchain without employees managing seed phrases or unrestricted private keys.

---

# 10. Arc Onchain Finance — Exact Mapping

Arc is looking for:

* meaningful Arc + USDC;
* advanced programmable money flows;
* conditional payment;
* automation;
* multi-step settlement;
* financial infrastructure that demonstrates why stablecoin-native infrastructure changes what is possible.

CareZero should emphasize:

**charitable settlement infrastructure.**

Not:

**medical crypto payments.**

Architecture:

```text
DONOR / CAREZERO TREASURY
        ↓
     USDC
        ↓
CAREZERO RELIEFPOOL
        ↓
Case verified
        ↓
Program rules satisfied
        ↓
Agent/human authorization
        ↓
Grant released
        ↓
PROVIDER SETTLEMENT ACCOUNT
```

That is programmable charitable finance.

---

# 11. Arc Smart Contract Features Needed for Prize Strength

The contract should enforce at least:

* authorized executors;
* one payout per case hash;
* program grant cap;
* sufficient pool balance;
* pause capability;
* grant event;
* provider address required.

Optional:

* daily program cap;
* program active/inactive state;
* emergency admin;
* grant reservation;
* expiry.

Do not build a 1,000-line contract.

Small, tested, explainable is stronger.

---

# 12. Arc Judge Pitch

> Arc is where charitable capital becomes programmable. CareZero doesn't put patient data onchain. Instead, our ReliefPool holds USDC and releases it only when a privacy-safe case reaches a verified state: hospital financial assistance has been processed, an eligible residual balance remains, program rules pass, and the appropriate approval path is satisfied. The blockchain proves what happened to the money without exposing why the patient needed help.

---

# 13. Arc Agentic Economy — Exact Mapping

Arc wants autonomous agents that:

* hold/use wallets;
* make payments;
* manage risk;
* settle jobs;
* transact in USDC;
* make decisions based on real signals;
* use Circle Agent Stack.

CareZero Relief Agent receives:

```text
case status
FAP status
hospital decision
residual balance
World signal
duplicate risk
program limits
fund balance
approval threshold
```

Then returns:

```text
AUTO_EXECUTE
or
HUMAN_REVIEW
or
DENY
```

For autonomous cases:

```text
Agent Stack
↓
Arc transaction
↓
ReliefPool.releaseGrant(...)
```

---

# 14. Do Not Let AI Determine Need

This is critical.

The LLM is not the grant authority.

The agent orchestration layer reads deterministic decision output.

Recommended:

```text
LLM:
"Explain why this grant qualifies."

Rules engine:
"Grant qualifies."

Contract:
"Grant is permitted."

Privy:
"Treasury configuration was authorized."

Arc:
"Money moved."
```

This separation creates a sophisticated technical story.

---

# 15. Agent Demo

Use an on-screen trace.

```text
CareZero Relief Agent

Checking hospital assistance...
✓ Completed

Checking verified residual balance...
✓ $2,470

Checking CareZero Relief limit...
✓ Maximum $500

Checking anti-abuse signal...
✓ Passed

Checking fund liquidity...
✓ $25,000 available

Approval level...
✓ Human approval received

Preparing settlement...
✓

Executing 500 USDC on Arc...
✓
```

Then show transaction.

This is much more compelling than a chatbot.

---

# 16. Circle Agent Stack Requirement

Use the actual Circle Agent Stack.

Do not merely call your own Node service:

`reliefAgent.ts`

and describe it as Circle Agent Stack.

Document:

* Agent Stack installation/setup;
* Circle wallet/account used;
* Arc interaction;
* command/tool called;
* resulting transaction hash.

---

# 17. Circle Spending Policy Caveat

Circle currently documents custom Agent Wallet spending policies as a mainnet feature.

Therefore:

### Hackathon Testnet

Use:

* CareZero rules engine;
* ReliefPool contract limits;
* authorization constraints;
* minimal test funds.

### Mainnet Deployment

Add the native Circle Agent Wallet spending controls.

Mentioning this proactively makes the architecture appear more thoughtful, not weaker.

---

# 18. Arc Mainnet Strategy

Two Arc tracks state that $2,500 of each $3,500 amount is contingent on the same project being deployed to Arc Mainnet by **September 30, 2026**.

Therefore the repo should separate configuration:

```text
ARC_TESTNET_RPC
ARC_MAINNET_RPC

USDC_TESTNET_ADDRESS
USDC_MAINNET_ADDRESS

RELIEF_POOL_TESTNET
RELIEF_POOL_MAINNET
```

Never hardcode addresses.

Deployment:

```text
npm run deploy:arc:testnet
npm run deploy:arc:mainnet
```

Mainnet deployment should use trivial/safe amounts until legal/operational structure is ready.

You can deploy functional infrastructure without operating a real patient-assistance fund.

---

# 19. World — Exact Mapping

World's Selfie Check bounty wants:

* meaningful Selfie Check;
* realistic low-friction biometric credential use;
* risk/eligibility/fairness/continuity/abuse prevention;
* working app;
* mandatory integration feedback document.

CareZero's use is:

# Abuse protection for scarce charitable aid.

This is stronger than:

> We added proof of human because crypto.

---

# 20. Ethical World Positioning

The patient should see:

> Hospital financial assistance is available whether or not you use World.

Then:

> CareZero Relief is funded by limited charitable donations. A brief liveness check helps us reduce automated abuse and preserve more of the fund for real people.

If the person cannot complete World:

Production product should offer a manual alternative.

Hackathon:

Display:

**Can't complete the check? Request manual review.**

This prevents the system from turning a biometric product into an absolute healthcare-access gate.

---

# 21. World Judge Pitch

> We intentionally refuse to use World as a gate to hospital charity-care rights. Selfie Check is only used when a patient applies to CareZero's separate, scarce donor-funded Relief Fund. It's one low-friction anti-abuse signal before charitable money is released. That gives World a meaningful fairness and abuse-prevention role without putting identity or medical information onchain.

---

# 22. Required WORLD_FEEDBACK.md

This file is mandatory for prize qualification.

Include:

```text
# World Selfie Check Integration Feedback

## Environment

## Integration Path

## Documentation Feedback

## Developer Portal Feedback

## Sandbox Feedback

## Test User Experience

## Error States Encountered

## Edge Cases

## Confusing / Missing Items

## Bugs

## Workarounds

## Suggestions

## Overall Developer Experience
```

Fill it with actual observations.

Do not submit a template full of blanks.

---

# 23. Combined Sponsor Architecture

The clean sentence:

# Privy controls the money.

# Arc programs the money.

# World protects the scarce money from abuse.

More precise:

**Privy** is the institutional account/control layer.

**Arc** is the programmable USDC settlement layer.

**World** is one privacy-conscious risk signal before discretionary charitable funds are released.

Every sponsor owns a different problem.

There is minimal overlap.

That is ideal.

---

# 24. Prize Demo Ordering

Do not demo sponsors individually.

Do not say:

> Now here is our Privy integration.

Instead demonstrate the patient's story.

Sponsor technology naturally appears underneath.

Correct order:

```text
Patient enters bill
↓
FAP estimate
↓
Application
↓
Hospital approval
↓
Residual balance
↓
CareZero Relief request
↓
World
↓
Relief Agent
↓
Privy-controlled approval
↓
Arc settlement
↓
final bill reduction
```

The judges should understand the product even if all sponsor logos were removed.

Then one architecture slide explains the sponsor stack.

---

# 25. Final Architecture Slide

```text
PATIENT EXPERIENCE

Hospital Bill
     ↓
FAP Intelligence
     ↓
Application
     ↓
Hospital Decision
     ↓
Residual Balance

----------------------------------------

CAREZERO RELIEF RAIL

World
anti-abuse signal
     ↓
CareZero Rules
     ↓
Circle Relief Agent
     ↓
Privy
organization controls
     ↓
Arc + USDC
conditional settlement
     ↓
Provider
```

---

# 26. Judging Criteria Strategy

ETHGlobal judges score:

1. Technicality
2. Originality
3. Practicality
4. Usability
5. Wow Factor

CareZero should intentionally demonstrate each.

## Technicality

Show:

* FAP extraction schema;
* deterministic rules;
* regulatory deadline engine;
* World proof verification;
* Privy policy;
* Circle Agent Stack;
* Solidity contract;
* Arc transaction;
* privacy separation.

## Originality

Do not claim:

> Nobody helps people find charity care.

That is false.

Claim:

> Existing navigation tools validate the need. CareZero extends the concept into a full patient financial-assistance rail: public-policy intelligence, application workflow, verified residual hardship, independently governed programmable charitable capital, and privacy-safe proof of disbursement.

## Practicality

Working end-to-end demo.

One polished hospital.

One real blockchain payout.

Avoid 20 unfinished features.

## Usability

Patient sees dollars.

Not crypto.

## Wow Factor

The number:

# $18,420

becomes:

# $1,970

in the course of the demo.

---

# 27. Competitor Question

Judge:

> Isn't this Dollar For?

Answer:

> Dollar For is one of the organizations that proves how serious the problem is, and we'd rather partner with organizations like them than pretend they don't exist. CareZero goes beyond eligibility screening. We're building an infrastructure rail that structures the hospital policy, guides the application, tracks regulatory timelines, records the resulting hospital decision, verifies any remaining hardship, and then allows an independent charitable fund to transparently settle part of that remaining balance. Dollar For could eventually be an upstream case source for the CareZero Relief Rail.

Excellent answer.

Do not criticize their website.

Do not say they are outdated.

Use the competitor to validate the market.

---

# 28. Blockchain Question

Judge:

> Why blockchain?

Answer:

> We don't use blockchain for the part that doesn't need it. Hospital eligibility stays offchain. Sensitive patient information stays offchain. Blockchain begins where independently donated money enters the system. It lets CareZero make conditional USDC grants and lets donors verify that program funds were actually disbursed without learning who the patient is or what medical condition they have.

---

# 29. World Question

Judge:

> Why should a patient need facial verification to get help?

Answer:

> They don't need it to access hospital financial assistance, our policy navigator, or our application tools. World is only a risk signal for the separate, limited CareZero Relief Fund. In a production system we'd also support manual review. We designed the system specifically so a biometric credential never becomes the gatekeeper for a patient's hospital financial-assistance rights.

---

# 30. Agent Question

Judge:

> Why an AI agent? This sounds like an if statement.

Answer:

> Eligibility and grant limits intentionally use deterministic rules because money and healthcare should not depend on opaque model output. The agent is the orchestration layer. It monitors case state, obtains current program rules and fund liquidity, evaluates the deterministic result, determines whether autonomous or human approval is required, executes the authorized Arc transaction, and reconciles the result. We use AI where reasoning and explanation add value, but deterministic policy and smart-contract controls where safety matters.

---

# 31. Legal Question

Judge:

> Can charities just pay medical bills like this?

Answer:

> The hackathon uses fictional patients and testnet funds. A real deployment would require CareZero to operate through a properly structured independent charitable entity and obtain healthcare regulatory counsel. Our architecture already reflects key OIG principles: financial-need-based criteria, independence from donors, no donor selection of patients, no donor steering to a specific provider or product, and no patient medical data exposed to donors.

---

# 32. “Why Now?” Answer

> Nonprofit hospital financial-assistance obligations are not new, but the affordability problem remains enormous and the digital infrastructure around those rights remains fragmented. At the same time, stablecoins, programmable organization wallets, agent tooling, and privacy-preserving human verification have matured enough that we can now connect assistance discovery to accountable charitable capital without turning patients into crypto users.

---

# 33. Demo Video Structure

ETHGlobal requires 2–4 minutes.

Aim:

# 3 minutes 30 seconds.

## 0:00–0:20

Problem.

> An $18,420 hospital bill can become debt before a patient ever discovers the hospital's own financial-assistance program.

## 0:20–1:10

Patient enters four facts.

CareZero returns potential assistance.

Explain deterministic FAP rules.

## 1:10–1:35

Prepare application.

Show deadline.

Advance to simulated hospital approval.

## 1:35–2:00

Show $2,470 residual.

Introduce Relief Rail.

## 2:00–2:20

World Selfie Check.

Explain limited role.

## 2:20–2:50

Relief Agent evaluates.

Privy approval/control visible.

## 2:50–3:10

Arc executes $500 USDC.

Transaction appears.

## 3:10–3:30

Final bill:

$1,970.

Architecture flash.

Closing line.

---

# 34. Submission Checklist

## ETHGlobal

* repo public/accessible as required;
* version-control history;
* work began during hackathon;
* all reused open-source work disclosed;
* demo 2–4 minutes;
* at least 720p;
* no AI-generated voiceover;
* no sped-up video;
* architecture diagram;
* source code;
* AI-use disclosure;
* specs/prompts preserved.

## Privy

* real wallet;
* real organization/B2B workflow;
* real Privy control;
* working financial flow;
* explain why Privy matters.

## Arc

* frontend;
* backend;
* architecture diagram;
* Arc;
* USDC;
* transaction;
* Circle tools;
* Agent Stack;
* GitHub;
* documentation;
* plan for Arc Mainnet by September 30.

## World

* working Selfie Check;
* meaningful abuse-prevention usage;
* Sandbox;
* feedback document completed.

---

# 35. Do-Not-Sacrifice List

If time becomes short, do **not** sacrifice:

1. World integration.
2. Privy real policy/control.
3. Privy real financial flow.
4. Arc USDC settlement.
5. Circle Agent Stack.
6. Arc contract transaction.
7. architecture diagram.
8. exact wow demo.
9. World feedback file.
10. AI/spec disclosure.

Sacrifice:

* extra hospitals;
* OCR;
* pretty admin analytics;
* multilingual support;
* FHIR;
* PDF generation;
* advanced donor features.

Prize eligibility comes first.

---

# 36. Final Prize Positioning

CareZero should be described to sponsors as:

## For Privy

**A policy-controlled nonprofit financial operation that hides crypto from healthcare users.**

## For Arc

**Programmable stablecoin infrastructure for independent medical hardship relief.**

## For World

**A privacy-conscious anti-abuse signal protecting scarce charitable resources without gating healthcare rights.**

And to ETHGlobal overall:

# CareZero makes hospital financial assistance usable—and makes charitable relief accountable.
