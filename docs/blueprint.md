# CareZero — Master Product Blueprint

## 1. Product Definition

**CareZero is an open-source patient financial advocate and charitable relief rail designed to help people find hospital financial assistance before an unaffordable medical bill becomes debt.**

CareZero combines two connected systems:

### Layer 1 — Financial Assistance Navigator

CareZero finds, interprets, and explains a hospital's publicly available Financial Assistance Policy, commonly called a FAP or charity-care policy.

It helps a patient understand:

- whether they may qualify for assistance;
- what type of assistance the hospital describes;
- which household/income requirements appear to apply;
- whether insured patients are eligible;
- residency or other policy conditions;
- which documents are required;
- how to apply;
- applicable application deadlines;
- what collection protections may apply during the process; and
- what to do next.

CareZero does **not** make the hospital's eligibility decision.

The product language is:

> You may qualify for financial assistance.

Never:

> You qualify.

The hospital remains the decision-maker.

### Layer 2 — CareZero Relief Rail

If the hospital processes the patient's financial-assistance application and a significant balance remains, CareZero can offer a separate pathway to **independent, donor-funded charitable assistance**.

The CareZero Relief Rail:

1. verifies that the hospital financial-assistance process occurred;
2. verifies that an eligible residual medical balance remains;
3. evaluates the case against objective CareZero Relief Fund rules;
4. uses World Selfie Check only as an anti-abuse/liveness signal;
5. allows a constrained CareZero Relief Agent to initiate qualifying small grants;
6. settles grants in USDC on Arc;
7. uses Privy-controlled organizational treasury infrastructure; and
8. produces a transparent proof that donor funds were disbursed without exposing the patient's medical or financial information publicly.

The key distinction is:

**CareZero does not replace hospital charity care.**

It makes hospital assistance easier to discover and use, and then provides a transparent charitable rail for the remaining gap.

---



# 2. Core Thesis

The financial help often already exists.

**The interface doesn't.**

Federal rules require nonprofit hospitals subject to Internal Revenue Code §501(r) to maintain written Financial Assistance Policies containing eligibility criteria, the basis for calculating charges, and application procedures.

Patients are nevertheless expected to:

- find the correct policy;
- understand policy language;
- calculate income thresholds;
- determine which bill is covered;
- gather documents;
- locate the correct application;
- understand deadlines;
- track the application;
- navigate collections;
- and seek additional help when hospital assistance is not enough.

CareZero converts this fragmented process into one guided workflow.

The product is intentionally not another loan, credit card, debt purchaser, debt marketplace, or collection company.

---



# 3. One-Line Pitch

**CareZero finds the financial help hidden inside hospital paperwork and creates a transparent charitable rail for the bills that assistance doesn't fully erase.**

Alternative:

**CareZero turns hospital financial assistance from paperwork into a pathway.**

Alternative:

**Before a hospital bill becomes debt, CareZero finds the help already available.**

---



# 4. Hero Message



## The hospital may already have a program that can reduce your bill.

CareZero finds it, explains it, prepares the paperwork, tracks the process, and—when assistance still isn't enough—connects verified remaining balances to transparent charitable relief.

### No loans.



### No medical credit card.



### No percentage taken from the patient's grant.

---



# 5. Problem

Medical billing places administrative work on people precisely when they are least equipped to handle it.

A patient may be:

- recovering from surgery;
- caring for a sick child;
- managing a chronic illness;
- coping with an emergency;
- temporarily unable to work;
- already under financial stress; or
- trying to understand an insurance decision.

Then a bill arrives.

Existing financial assistance may be available, but the patient may have to search a hospital website, download a PDF, interpret income tables, gather documents, fill out paperwork, contact a billing department repeatedly, and track deadlines.

The Consumer Financial Protection Bureau has specifically described medical bills as difficult to navigate and notes that financial assistance can help both uninsured and underinsured patients.

The problem is therefore not simply:

> Financial assistance does not exist.

It is:

> Assistance can exist while remaining functionally inaccessible.

---



# 6. Why This Matters

Medical debt remains a substantial American financial problem.

KFF estimated in 2024 that Americans owed at least **$220 billion in medical debt**, with approximately 14 million people owing more than $1,000.

KFF's broader health-care debt research has also found that health-related debt can lead people to:

- reduce spending on food and household necessities;
- exhaust savings;
- take on additional work;
- increase other debt;
- delay housing or education decisions;
- postpone additional healthcare; and
- interact with collection agencies.

The CFPB has reported evidence that people who appeared eligible for nonprofit-hospital financial assistance were nevertheless billed billions of dollars.

CareZero attacks the problem **before assistance is missed and before a remaining bill becomes more expensive debt.**

---



# 7. Regulatory Foundation



## Federal §501(r)

Tax-exempt hospital organizations subject to IRC §501(r) must establish written Financial Assistance Policies.

Among other requirements, a hospital's FAP must describe:

- eligibility criteria;
- whether assistance includes free or discounted care;
- the basis used to calculate patient charges;
- how to apply;
- and applicable billing/collection information.

Hospitals must widely publicize these policies.

CareZero's product is built around converting this legally required public information into structured, understandable patient guidance.

## The 120-Day Notification Period

Under federal §501(r)(6) regulations, before certain extraordinary collection actions, hospitals must make reasonable efforts to determine whether an individual is FAP-eligible.

The IRS describes a **120-day notification period** beginning with the first post-discharge billing statement.

This becomes a valuable CareZero timeline event.

Example UI:

> Your first bill was issued 32 days ago.

> Federal nonprofit-hospital rules generally restrict certain extraordinary collection actions during the initial 120-day notification period while reasonable FAP notification efforts occur.

CareZero must avoid presenting this as individualized legal advice.

## The 240-Day Application Period

The IRS also describes a **240-day application period**, beginning from the first post-discharge billing statement, during which a hospital generally must accept and process a submitted FAP application in order to satisfy the regulatory reasonable-efforts framework.

A hospital may accept applications beyond this period as well.

CareZero can turn this into an actionable countdown:

> Approximate federal FAP application-window status: Day 32 of 240.

This is materially more valuable than simply telling someone that charity care exists.

## Incomplete Applications

When an incomplete FAP application is submitted within the application period, the federal framework requires the hospital to notify the individual about how to complete it and provide a reasonable opportunity to do so.

CareZero can therefore maintain:

- Submitted
- Incomplete / additional documentation requested
- Documents supplied
- Under review
- Approved
- Partially approved
- Denied
- Appeal / reconsideration
- Closed



## Hospital Decision Authority

CareZero must always distinguish:

**CareZero estimate**

from

**Hospital determination**

The AI/rules system can identify apparent policy fit.

It cannot represent itself as the final eligibility authority.

---



# 8. Product Philosophy

CareZero should obey five principles.

## Principle 1 — Crypto disappears

The patient should never need to understand:

- seed phrases;
- gas;
- bridges;
- block explorers;
- EVM addresses;
- USDC mechanics;
- smart contracts.

Blockchain infrastructure belongs underneath the experience.

The patient sees:

> $500 CareZero Relief Grant applied.

Not:

> 500 USDC transferred from 0xA43...

An optional "View proof" link can reveal the blockchain record.

## Principle 2 — AI interprets; deterministic code decides calculations

LLMs may:

- extract policy language;
- summarize policies;
- classify requirements;
- explain results;
- help prepare documents.

LLMs should **not independently decide financial eligibility**.

The architecture is:

**AI extraction → structured policy → validation → deterministic rules engine → patient estimate.**

## Principle 3 — Hospital decides hospital assistance

CareZero tells the patient:

> Based on the published policy, you may qualify.

The hospital decides:

> Approved / denied / amount.



## Principle 4 — Relief funding is separate from hospital eligibility

No World verification is required to:

- search a hospital;
- understand a FAP;
- receive an eligibility estimate;
- generate an application-preparation packet;
- learn about federal timelines.

World Selfie Check only appears when someone voluntarily requests a limited, discretionary **CareZero Relief Fund grant**.

## Principle 5 — Sensitive patient information stays offchain

No diagnosis, tax return, income, SSN, bill PDF, treatment information, patient name, insurance details, or medical record belongs on a public blockchain.

---



# 9. User Groups



## Patient

Primary user.

Needs:

- understandable language;
- minimum friction;
- clear next step;
- reassurance without false promises;
- privacy;
- application tracking;
- funding options.



## CareZero Relief Fund Administrator

Manages:

- charitable treasury;
- grant rules;
- approval thresholds;
- exceptional cases;
- wallet policies;
- available funding;
- program limits.



## CareZero Reviewer

Reviews grants above the autonomous threshold or flagged cases.

## Donor

Can contribute to the general CareZero Relief Fund.

Donor receives aggregate impact information but **does not choose individual recipients**.

## Hospital / Provider — Future Partner

Future integrations could allow hospitals to:

- confirm assistance decisions;
- confirm residual balance;
- supply secure payment destination;
- receive grant payments;
- reconcile payment references.

The hackathon demo does not require hospital participation.

---



# 10. Complete Patient Journey



## STEP 1 — Start With the Bill

CareZero asks for only the minimum information necessary.

Demo:

**Hospital:** Example Medical Center
**Total Bill:** $18,420
**Household Size:** 3
**Household Annual Income:** $51,000
**Insurance:** Yes

For the production product, additional questions appear only if the relevant hospital policy requires them.

Examples:

- state residency;
- assets;
- immigration-neutral residency criteria where applicable;
- type/date of service;
- household composition.

Avoid asking for diagnosis unless strictly necessary.

---



# 11. STEP 2 — Find the Hospital FAP

CareZero maintains a structured FAP registry.

Each hospital record contains:

- hospital name;
- health system;
- location;
- nonprofit/other status where known;
- FAP page;
- policy document;
- plain-language summary;
- application document;
- effective date;
- last reviewed date;
- structured policy version.

For the hackathon MVP, seed one polished demo hospital plus one or two additional policies to demonstrate generalizability.

---



# 12. STEP 3 — Parse the Policy

CareZero transforms a hospital FAP into a structured schema.

Example:

```json
{
  "hospital": "Example Medical Center",
  "policyVersion": "2026-01",
  "freeCare": {
    "fplMax": 200
  },
  "discountedCare": [
    {
      "fplMin": 201,
      "fplMax": 300,
      "discountPercent": 80
    },
    {
      "fplMin": 301,
      "fplMax": 400,
      "discountPercent": 50
    }
  ],
  "insuredEligible": true,
  "residencyRequired": false,
  "assetTest": false,
  "documents": [
    "proof_of_income",
    "household_size"
  ],
  "applicationMethod": [
    "mail",
    "in_person"
  ]
}
```

The actual demo numbers can be fictional.

Any real hospital policy used for demonstration must be presented accurately.

---



# 13. STEP 4 — Calculate Apparent Eligibility

The rules engine uses:

- household income;
- household size;
- current federal poverty guideline table;
- hospital policy thresholds;
- insurance rules;
- residency rules;
- asset rules where applicable;
- bill amount.

The rules engine returns:

```text
status:
POTENTIALLY_ELIGIBLE

confidence:
HIGH

estimated_assistance:
$15,950

estimated_remaining:
$2,470

reason:
Household income appears to fall within the hospital's published discounted-care range.

authority:
Hospital makes final eligibility and assistance determination.
```

The UI says:

# You may qualify for financial assistance.

Then:

**Original bill:** $18,420

**Potential hospital assistance:** $15,950

**Potential remaining balance:** $2,470

And:

> This estimate is based on the hospital's published policy. The hospital determines final eligibility and assistance.

---



# 14. STEP 5 — Explain Why

Patients should be able to click:

**Why am I seeing this?**

CareZero should show:

- policy income limit;
- household size used;
- relevant FPL;
- insurance condition;
- policy section/page;
- calculation.

This protects against opaque AI.

Example:

> Example Medical Center's published policy offers discounted care to certain households within this income range. Your entered household income and size appear to fall within that range.

Never:

> Our AI decided you deserve $15,950.

---



# 15. STEP 6 — Build the Application Packet

Button:

# Prepare Application

CareZero creates a patient packet containing:

- hospital's application;
- prefilled patient-provided values where technically/legal appropriate;
- required-document checklist;
- submission instructions;
- billing office contact information;
- applicable deadline tracker;
- cover sheet;
- CareZero case ID.

For hospitals without electronic submission APIs, CareZero does **not** pretend an application was submitted automatically.

Status should distinguish:

**Application prepared**

from:

**Application submitted**

---



# 16. STEP 7 — Track the Process

Case timeline:

```text
Bill received
↓
FAP discovered
↓
Potential eligibility estimated
↓
Application prepared
↓
Application submitted
↓
Additional documents requested
↓
Documents supplied
↓
Hospital decision
```

CareZero tracks relevant dates.

Example:

```text
First billing statement: Aug. 20, 2026
FAP application prepared: Sept. 13, 2026
Approximate federal application-period day: 24/240
```

Use precise regulatory language in production.

---



# 17. STEP 8 — Record the Hospital Decision

For the hackathon demo:

**Hospital outcome is simulated.**

This must be explicitly labeled.

Demo:

```text
Hospital Assistance Decision

Original balance:       $18,420
Hospital assistance:  -$15,950
--------------------------------
Verified remainder:      $2,470
```

For future production:

The decision could be imported through:

- hospital API;
- secure billing-office portal;
- patient-uploaded determination letter;
- EHR/revenue-cycle integration;
- secure document processing;
- verified billing statement.

---



# 18. STEP 9 — Offer CareZero Relief

Only after the FAP workflow:

> You still have a $2,470 balance.

> CareZero Relief may be able to help with part of the remaining amount.

Button:

# Check CareZero Relief

This is not another hospital eligibility process.

It is an independent charitable grant.

---



# 19. STEP 10 — CareZero Relief Eligibility

Example program rules:

```text
PROGRAM:
CareZero General Medical Relief

Purpose:
Residual hospital balances remaining after available hospital financial assistance has been processed.

Maximum autonomous grant:
$250

Maximum standard grant:
$500

Higher grants:
manual board/reviewer approval

Payment:
directly toward verified medical obligation

Recipient selection:
financial-need criteria only

Donor influence:
none

Required:
verified residual balance
FAP process completed or documented reason unavailable
funds available
anti-duplication checks
World Selfie Check risk signal
```

These are hackathon/demo parameters, not finalized legal program rules.

---



# 20. STEP 11 — World Selfie Check

Patient sees:

> CareZero Relief is funded by limited charitable donations. We use a brief liveness check to help reduce automated and duplicate abuse of this fund.

World is **not** used to determine whether the person qualifies for hospital financial assistance.

World is **not** used to identify the person publicly.

World is **not** used to determine medical need.

World is only an additional risk signal for the discretionary CareZero grant.

Architecture:

```text
Patient
↓
World Selfie Check
↓
World verification response
↓
CareZero backend verifies result
↓
case.livenessRiskSignal = PASS
```

Do not store the selfie.

Do not claim Selfie Check alone proves that one person has never previously applied.

It is one anti-abuse signal combined with CareZero's own application controls.

---



# 21. STEP 12 — Relief Agent

The CareZero Relief Agent evaluates structured facts.

It does not read the patient's diagnosis.

Example decision inputs:

```json
{
  "fapCompleted": true,
  "residualBalanceVerified": true,
  "residualBalance": 2470,
  "requestedGrant": 500,
  "worldRiskSignal": "pass",
  "duplicateCaseRisk": "low",
  "fundBalance": 25000,
  "programGrantCap": 500
}
```

Decision output:

```json
{
  "eligibleForReliefReview": true,
  "grantAmount": 500,
  "approvalRoute": "human_review"
}
```

Example approval policy:

```text
$0–$250:
Relief Agent may autonomously execute if all objective rules pass.

$251–$1,000:
one authorized CareZero reviewer required.

Above $1,000:
2-of-3 CareZero governance approval.
```

For the exact hackathon wow demo, either:

A. set the autonomous demo cap to $500;

or

B. visibly show one reviewer clicking **Approve $500** before the agent executes.

Option B creates a stronger Privy B2B/quorum story.

---



# 22. STEP 13 — Arc Relief Settlement

The CareZero Relief Treasury has:

# 25,000 USDC

The verified residual bill is:

# $2,470

CareZero grants:

# $500

The Arc smart contract records only privacy-safe information.

Conceptual event:

```solidity
event GrantReleased(
    bytes32 indexed caseHash,
    bytes32 indexed programId,
    address indexed providerSettlementAddress,
    uint256 amount,
    uint256 timestamp
);
```

No patient identity appears.

No diagnosis appears.

No original bill document appears.

No income appears.

No application appears.

No World selfie appears.

---



# 23. STEP 14 — Final Patient Result

The screen transitions from:

# MEDICAL BILL



# $18,420

to:

```text
Hospital Financial Assistance   -$15,950

CareZero Relief Grant              -$500

------------------------------------------

Remaining Balance                  $1,970
```

Then:

# $16,450 in total assistance identified or delivered.

CareZero must carefully distinguish:

- hospital assistance actually approved;
- CareZero grant actually disbursed;
- estimates.

---



# 24. The ETHGlobal Wow Moment

This exact sequence should anchor the demo.

## Opening

Full-screen:

# $18,420

Voice:

> This is a hospital bill.

Patient enters:

- Example Medical Center
- $18,420
- household of 3
- $51,000 income
- insured



## Transformation One

CareZero reads the hospital FAP.

Screen:

# YOU MAY QUALIFY FOR FINANCIAL ASSISTANCE

```text
Potential assistance:       $15,950
Potential remaining:         $2,470
```

Voice:

> The assistance program was already there. The patient just had to find it, understand it, and successfully apply.

Click:

# PREPARE APPLICATION

Application package appears.

## Transformation Two

Move demo case to:

**Hospital Approved**

```text
$18,420
-$15,950 hospital assistance
=$2,470 residual
```

Voice:

> But charity care does not always erase the entire bill.



## World Moment

Click:

# CHECK CAREZERO RELIEF

World Sandbox Selfie Check completes.

Voice:

> World is not deciding whether this patient deserves hospital assistance. It is simply helping protect a scarce, donor-funded relief pool from abuse.



## Agent Moment

Display:

```text
CareZero Relief Agent

✓ Hospital FAP processed
✓ Residual balance verified
✓ Program criteria passed
✓ Liveness risk check passed
✓ Funds available
```

Then:

# GRANT APPROVED — $500

The Relief Agent calls Arc.

Transaction success animation.

## Final Screen

```text
Original bill               $18,420

Hospital assistance        -$15,950

CareZero Relief               -$500

────────────────────────────────────

Remaining                    $1,970
```

Then the final line:

# The hospital already had the assistance program.



# CareZero made it usable.

Optional second line:

**And when assistance stopped short, CareZero carried relief the rest of the way.**

---



# 25. What the Blockchain Is Actually Doing

CareZero must be able to answer the inevitable judge question:

> Why does this need blockchain?

Answer:

**Hospital charity-care eligibility does not need blockchain.**

That part should not be forced onchain.

Blockchain solves a different problem:

### Transparent charitable capital.

Traditional charitable relief requires donors to trust a central operator's spreadsheet:

> We received money and promise we spent it correctly.

CareZero can instead demonstrate:

```text
Donation entered pool
↓
Grant rule satisfied
↓
Authorized execution occurred
↓
USDC reached designated settlement account
↓
Public amount / timestamp / program proof exists
```

while sensitive patient data remains private.

This produces:

**public financial accountability + private patient information.**

That is the correct blockchain thesis.

---



# 26. What CareZero Is NOT

CareZero is not:

- a lender;
- a medical credit card;
- a debt collector;
- a debt purchaser;
- a debt marketplace;
- a hospital;
- an insurer;
- a medical provider;
- a final eligibility authority;
- legal advice;
- financial advice;
- a platform for selling patient data;
- a tokenized medical-debt marketplace;
- a crowdfunding popularity contest;
- a patient diagnosis database;
- a system where donors choose who receives treatment.

CareZero should never tokenize an individual's medical debt for trading.

---



# 27. Competitive Landscape



## Dollar For

Dollar For strongly validates the underlying patient problem.

Its current public workflow allows people to enter:

- hospital;
- original bill date;
- amount owed;
- household income;
- household size;
- insurance status;

and determine whether they may qualify for hospital financial assistance.

Dollar For also helps patients pursue hospital-bill forgiveness.

This is not a reason to abandon CareZero.

It establishes that:

1. the underlying problem is real;
2. patients use digital charity-care screening;
3. hospital FAP information can be structured;
4. nonprofit organizations can successfully advocate for patients.

CareZero should avoid positioning itself publicly as:

> Better Dollar For.

Instead:

> CareZero is the next-generation infrastructure layer for patient financial assistance: policy intelligence, application workflow, deadline tracking, and a transparent residual-relief rail in one system.

Potential future relationship:

```text
Dollar For
or
Hospital Financial Navigator
or
Hospital API
or
CareZero FAP Navigator
       ↓
Verified residual hardship
       ↓
CareZero Relief Rail
```

Dollar For can eventually become an upstream partner instead of an enemy.

## TailorMed

TailorMed provides extensive financial-navigation infrastructure focused strongly on medication access and health-system workflows.

It validates:

- automated financial navigation;
- patient-facing enrollment;
- program matching;
- digital assistance workflows.

CareZero differs by focusing the hackathon product on:

- nonprofit-hospital FAP rights;
- patient-first public access;
- transparent donor-funded residual medical-bill relief;
- open-source/public-good architecture.



## Cinnamon

Cinnamon combines charity care, manufacturer programs, nonprofit foundations, government assistance and other affordability programs into a broader healthcare coverage waterfall.

Again, this validates the need.

CareZero's unique architectural thesis is:

**public FAP intelligence + consumer advocate + independently governed charitable settlement rail + verifiable donor capital.**

---



# 28. Competitive Positioning Statement

Existing organizations prove that patients need help finding financial assistance.

**CareZero connects that navigation process to the missing financial infrastructure behind it.**

Other products may help answer:

> What assistance exists?

CareZero additionally answers:

> What happens after I find it?

> What deadline am I under?

> What documentation is missing?

> What happened to my application?

> What balance remains?

> Can independent charity close part of that gap?

> Can donors prove their money actually reached verified medical hardship without exposing the patient?

That is the CareZero system.

---



# 29. Business Structure

The preferred long-term structure is mission-first.

Potential structure:

## CareZero Foundation

A nonprofit or equivalent public-benefit entity that governs:

- patient advocacy;
- open-source software;
- relief eligibility;
- charitable treasury;
- donor independence;
- privacy standards.

Potential supporting entity later:

## CareZero Labs / Public Benefit Company

Could provide:

- hospital integrations;
- health-system workflow software;
- analytics;
- enterprise APIs;
- white-label infrastructure;
- implementation services.

This dual-entity structure requires legal and tax advice before implementation.

For hackathon purposes:

**CareZero is presented as an open-source public-good project with a prototype independent Relief Fund.**

---



# 30. Revenue / Sustainability Without Exploiting Patients

Patients should not pay to access:

- FAP search;
- eligibility estimate;
- application preparation;
- deadline information;
- case tracking;
- CareZero Relief eligibility.

Potential sustainable funding:

- philanthropy;
- health-equity grants;
- foundation grants;
- nonprofit technology grants;
- community-benefit partnerships;
- health-system enterprise integrations;
- employer social-benefit programs;
- API licensing for institutional partners;
- optional analytics products using aggregated/de-identified data;
- donor support.

Never monetize by:

- selling patient data;
- taking a percentage of hospital financial assistance;
- charging patients a percentage of debt reduced;
- selling patient leads to lenders;
- steering patients into medical credit cards;
- steering patients to donor-affiliated providers;
- auctioning patient cases.

---



# 31. Relief Fund Independence

This is an important future compliance principle.

HHS OIG has repeatedly emphasized that independent patient-assistance charities need genuine independence from donors, particularly when federal healthcare programs are involved.

CareZero's fund should therefore be designed around principles such as:

- CareZero—not donors—sets grant criteria;
- eligibility is based on objective financial hardship;
- donors do not choose individual patients;
- donors do not receive recipient identities;
- donors do not condition funds on use of their products;
- donors do not condition funds on use of a particular provider;
- donor contribution size does not affect patient selection;
- grant decisions remain independent of referring provider;
- no donor gets data enabling it to correlate its contribution with particular patients.

A real launch should receive specialized healthcare regulatory counsel before paying patient obligations, particularly for federal-program beneficiaries.

Hackathon demo funds are fictional/testnet.

---



# 32. Recommended Charity Model

The most defensible version is a **broad general medical hardship fund**.

Avoid:

```text
Company X Hospital Patient Fund
Drug Y Cancer Fund
Surgeon Z Procedure Fund
```

Prefer:

```text
CareZero General Medical Hardship Fund
```

Objective criteria.

Provider-neutral.

Donor-independent.

---



# 33. Privacy Model



## Never Public

- name;
- address;
- email;
- phone;
- SSN;
- date of birth;
- diagnosis;
- treatment;
- medical record;
- bill PDF;
- tax return;
- pay stub;
- household income;
- insurance information;
- hospital determination letter;
- raw World Selfie data.



## Encrypted Offchain

- case file;
- hospital bill;
- application;
- financial documentation;
- household information;
- hospital correspondence;
- determination record.



## Safe Onchain Fields

Potentially:

```text
caseHash
programId
grantAmount
providerSettlementAddress
grantTimestamp
paymentStatus
transactionId
```

If a field could reasonably reveal a patient's identity through correlation, do not publish it.

---



# 34. MVP Scope

Must build:

1. Patient intake.
2. Hospital FAP registry.
3. One working policy extraction fixture.
4. Structured policy schema.
5. Deterministic eligibility estimator.
6. Explain-why screen.
7. Application-preparation screen.
8. FAP timeline/deadline tracker.
9. Simulated hospital decision.
10. Verified residual-balance state.
11. World Selfie Check sandbox integration.
12. CareZero Relief rules engine.
13. Privy Relief Treasury.
14. At least one real Privy policy/control.
15. Privy USDC funding flow.
16. Arc ReliefPool smart contract.
17. Circle Agent Stack Relief Agent.
18. Real Arc testnet transaction.
19. Donor-impact proof screen.
20. Architecture diagram.
21. GitHub README.
22. World feedback document.
23. AI-use disclosure.
24. Full spec/prompt artifacts if using spec-driven development.

---



# 35. Stretch Scope

Only after the required flow works:

- multiple hospitals;
- automatic PDF policy ingestion;
- hospital search;
- FPL annual update service;
- state-specific charity-care overlays;
- debt collector notification letter;
- multilingual output;
- donor dashboard;
- individual donor deposits;
- additional grant programs;
- direct hospital verification API;
- patient advocate portal;
- hospital partner portal;
- OCR for determination letters;
- FHIR integrations;
- revenue-cycle integrations;
- application e-signing;
- SMS reminders.

Do not sacrifice the working sponsor integrations for these.

---



# 36. North-Star Metrics

For a future real CareZero:

## Access

- patients screened;
- hospitals represented;
- FAPs structured;
- applications prepared;
- applications submitted.



## Outcome

- hospital assistance identified;
- hospital assistance approved;
- residual balances reduced;
- Relief Fund dollars disbursed;
- percentage of grant dollars reaching medical obligations.



## Speed

- time from bill upload to FAP result;
- time from residual verification to grant decision;
- time from grant approval to settlement.



## Equity

- uninsured users reached;
- underinsured users reached;
- rural users reached;
- applications completed before deadline;
- users receiving assistance who had not known about FAP.



## Transparency

- donor dollars received;
- donor dollars disbursed;
- grants completed;
- administrative cost;
- program reserve.

---



# 37. Success Definition for ETHOnline

CareZero succeeds if a judge can understand this in four minutes:

**A patient receives an $18,420 hospital bill.**

CareZero finds a public hospital policy.

CareZero converts it into understandable rules.

The patient may qualify for $15,950 of assistance.

CareZero prepares the application.

The hospital decision is recorded.

$2,470 remains.

World helps protect the independent aid pool from automated abuse.

Privy controls the nonprofit treasury.

The CareZero Relief Agent verifies program conditions.

Arc moves $500 USDC through a transparent conditional relief flow.

The patient now owes $1,970.

No diagnosis went onchain.

No debt was sold.

No loan was created.

No donor selected the patient.

The patient's financial-assistance right remained independent of crypto.

And every charitable dollar can be accounted for.

---



# 38. Closing Product Statement

**CareZero is not blockchain for medical debt.**

It is infrastructure for keeping a medical bill from becoming debt in the first place.

The hospital's assistance program remains the first source of relief.

CareZero makes that program usable.

When the hospital's assistance still leaves hardship behind, the CareZero Relief Rail gives independent charity a transparent, programmable way to help close the gap.

## The financial help already exists.



## CareZero makes it reachable.

---



# 39. Research Source Registry

Use these as authoritative research sources when writing README, pitch materials, policy explanations, or future product documentation.

**R1 — Internal Revenue Service**
“Financial assistance policies (FAPs).”
Key evidence: required FAP contents and publicity requirements.

**R2 — Internal Revenue Service**
“Billing and collections — Section 501(r)(6).”
Key evidence: 120-day notification period, 240-day application period, incomplete-application requirements, reasonable efforts before specified extraordinary collection actions.

**R3 — Consumer Financial Protection Bureau**
“Is there financial help for my medical bills?”
Key evidence: charity care may help uninsured and underinsured patients; patients should obtain and apply under hospital FAPs.

**R4 — Consumer Financial Protection Bureau**
“Understanding Required Financial Assistance in Medical Care.”
Key evidence: financial assistance appears underused; federal/state requirements differ; hospital policies vary.

**R5 — Consumer Financial Protection Bureau**
“Medical Debt and Non-Profit Hospital Billing Practices.”
Key evidence: reports of eligible patients still being billed and concerns regarding implementation of nonprofit financial assistance.

**R6 — KFF**
“The Burden of Medical Debt in the United States.”
Key evidence: estimated at least $220 billion in medical debt; approximately 14 million people owing over $1,000.

**R7 — KFF**
“Health Care Debt in the U.S.”
Key evidence: consequences of medical debt including savings depletion, collection activity, additional borrowing, and delayed care.

**R8 — HHS Office of Inspector General**
“Supplemental Special Advisory Bulletin: Independent Charity Patient Assistance Programs.”
Key evidence: importance of independence between charitable assistance programs and donors; anti-steering concerns.

**R9 — HHS OIG Advisory Opinions / 2026 guidance**
Key evidence: financial-need-based assistance and donor independence remain important when designing patient-assistance funds.

**R10 — ETHGlobal ETHOnline 2026 Rules and Submission Details**
Key evidence: three partner selections; multiple tracks per selected partner; 2–4 minute demo; technicality, originality, practicality, usability, and wow-factor criteria; AI disclosure; spec-driven artifact requirements.

**R11 — ETHGlobal ETHOnline 2026 Privy Prize Page**
Key evidence: B2B Financial Product and Financial Flow qualification requirements.

**R12 — ETHGlobal ETHOnline 2026 Arc Prize Page**
Key evidence: DeFi/Onchain Finance and Agentic Economy requirements; USDC; Agent Stack; architecture/demo requirements; September 30 mainnet condition for portions of Arc awards.

**R13 — ETHGlobal ETHOnline 2026 World Prize Page**
Key evidence: Selfie Check requirements and required developer-feedback document.

**R14 — Privy Documentation**
“Wallet policies and controls,” “Key quorums,” and “Signers.”
Key evidence: authorization keys, policies, signers, allowlists, transfer limits and quorum-controlled wallet actions.

**R15 — Circle Developer Documentation**
“Agent Stack” and “Agent Wallets.”
Key evidence: autonomous USDC-capable agent wallets and programmable control architecture. Built-in Agent Wallet spending policies currently require mainnet; CareZero should use testnet-safe app/contract controls for the hackathon and document the distinction.

**R16 — Dollar For**
Current public financial-assistance eligibility/application workflow.
Key evidence: established consumer demand for hospital FAP screening and assistance.

**R17 — TailorMed**
Patient financial-navigation platform.
Key evidence: financial-assistance workflow automation and patient-facing program discovery.

**R18 — Cinnamon**
Coverage Waterfall / financial-assistance platform.
Key evidence: modern financial-navigation systems can aggregate charity care, foundations, government programs, and other support.

---



# 40. Critical Language Rules

Use:

- “may qualify”
- “potential financial assistance”
- “based on the hospital's published policy”
- “hospital determines final eligibility”
- “CareZero Relief is separate from hospital financial assistance”
- “World Selfie Check is an anti-abuse risk signal”
- “testnet / simulated hospital decision” in hackathon demos

Avoid:

- “guaranteed debt forgiveness”
- “CareZero approved your charity care”
- “World proved you deserve assistance”
- “AI approved your hospital discount”
- “we erase medical debt”
- “guaranteed legal protection”
- “hospital accepts crypto”
- “HIPAA compliant” unless and until independently justified
- “all nonprofit hospitals must forgive your bill”
- “blockchain determines patient eligibility”

CareZero's credibility comes from being precise.