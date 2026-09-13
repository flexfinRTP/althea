# CareZero — Research & Evidence Base

## Purpose

This document records the evidence supporting CareZero's product thesis.

It should be used when creating:

* README claims;
* presentations;
* grant applications;
* hackathon materials;
* pitch decks;
* website copy;
* policy explanations;
* partnership outreach;
* future product requirements.

The document distinguishes between:

1. verified facts;
2. product implications;
3. claims CareZero should avoid.

CareZero should prefer:

* federal agencies;
* primary regulations;
* major nonpartisan health-policy research;
* official sponsor requirements;
* direct competitor materials.

---

# 1. Nonprofit Hospitals Must Maintain Financial Assistance Policies

## Evidence

Internal Revenue Code §501(r)(4) requires applicable tax-exempt hospital organizations to establish written Financial Assistance Policies.

IRS guidance states that the FAP must include, among other things:

* eligibility criteria;
* whether assistance consists of free or discounted care;
* the basis for calculating patient charges;
* the method for applying;
* and applicable billing/collection information where not separately documented.

The policy must also be widely publicized.

## CareZero Implication

There is a legally required source of public policy information that can be converted into:

```text
public document
↓
structured rules
↓
patient explanation
↓
application pathway
```

This significantly strengthens CareZero's business thesis.

CareZero is not inventing an assistance program.

It is helping patients use an existing institutional program.

---

# 2. Charity Care Can Help Insured and Uninsured Patients

## Evidence

The Consumer Financial Protection Bureau states that financial assistance or charity-care programs may help both people without insurance and people who are insured but underinsured.

## Product Implication

CareZero should not ask:

> Are you uninsured?

and automatically exclude:

> insured.

Instead:

```text
Insurance:
Insured
Uninsured
```

The hospital-specific policy determines how insurance status matters.

## Marketing Implication

Safe claim:

> Financial assistance isn't necessarily limited to uninsured patients.

Avoid:

> All insured patients qualify for charity care.

---

# 3. Hospitals Define Their Own Federal FAP Eligibility Criteria

## Evidence

Federal law requires nonprofit hospitals to maintain FAPs, but CFPB research notes that federal law does not establish one universal eligibility threshold; hospital and state policies can vary substantially.

## CareZero Implication

This is exactly why a national rules engine is valuable.

There is no universal calculation:

```text
income < X
therefore eligible everywhere
```

CareZero must maintain:

```text
hospital
+
policy version
+
state overlay
+
patient inputs
```

---

# 4. The Application Process Can Be Burdensome

## Evidence

The CFPB describes nonprofit financial-assistance application processes as potentially complex and time-consuming and has noted that burdensome applications may result in eligible patients failing to receive assistance.

The CFPB's consumer guidance tells patients to obtain the policy, complete an application, supply income information, ask about processing, contact collectors when relevant and follow up with the billing office.

## CareZero Implication

CareZero should solve workflow, not merely discovery.

Minimum useful product:

```text
find
↓
explain
↓
calculate
↓
prepare
↓
document checklist
↓
track
↓
follow up
```

A simple chatbot answering:

> “Does this hospital have charity care?”

is not enough.

---

# 5. $220 Billion Medical Debt Estimate

## Evidence

A 2024 KFF analysis estimated Americans owe at least **$220 billion in medical debt**.

KFF estimated approximately:

* 14 million U.S. adults owe more than $1,000;
* roughly 3 million owe more than $10,000.

The estimates were based on government Survey of Income and Program Participation data.

## Marketing Use

Safe:

> KFF estimates Americans owe at least $220 billion in medical debt.

Avoid:

> Americans currently owe exactly $220 billion.

The figure is an estimate based on available survey data.

---

# 6. Medical Billing Is Structurally Difficult to Navigate

## Evidence

CFPB consumer guidance describes medical bills as complicated and notes that whether a patient actually owes a bill can depend on:

* provider;
* insurance;
* financial assistance;
* federal protections;
* state protections.

## CareZero Implication

CareZero should eventually become an orchestration layer rather than a single eligibility calculator.

The user need is not:

> search.

It is:

> navigation.

---

# 7. Eligible Patients Can Still Be Billed

## Evidence

In a 2024 discussion of nonprofit hospital billing practices, the CFPB cited research identifying at least **$2.7 billion** in medical bills that appeared eligible for financial assistance but were nevertheless billed to patients.

The agency noted this estimate may understate the gap.

## Product Implication

The FAP is not enough.

CareZero should maintain evidence that:

```text
application submitted
hospital response received
decision recorded
remaining balance calculated
```

This creates patient-controlled documentation.

## Marketing Language

Recommended:

> Assistance can exist on paper without reaching every eligible patient.

Avoid:

> Hospitals are illegally denying billions in aid.

The evidence is more nuanced than that claim.

---

# 8. Nonprofit Hospitals Represent a Large Part of the U.S. Hospital Market

## Evidence

The CFPB reported in 2024 that approximately **58% of more than 5,000 U.S. community hospitals were classified as nonprofits**.

## Product Implication

The federal §501(r) workflow addresses a very large hospital segment.

However:

CareZero should still be able to represent:

* nonprofit hospitals;
* public hospitals;
* for-profit hospitals with voluntary policies;
* state-specific programs.

---

# 9. 120-Day Notification Period

## Evidence

IRS §501(r)(6) guidance describes a 120-day notification period beginning on the date the first post-discharge billing statement is provided.

During the regulatory reasonable-efforts framework, applicable hospitals must refrain from specified extraordinary collection actions for at least this initial period while satisfying FAP notification requirements.

## Product Implication

CareZero should track:

```text
first post-discharge bill date
↓
notification period day
```

Example:

> Day 32 of the initial 120-day notification period.

## Important Limitation

Do not say:

> The hospital cannot do any collection activity for 120 days.

The federal rule specifically concerns extraordinary collection actions and reasonable-efforts requirements.

---

# 10. 240-Day Application Period

## Evidence

IRS guidance describes a 240-day application period beginning on the first post-discharge billing statement.

If a complete FAP application is submitted during this period, the hospital's reasonable-efforts framework requires a determination of FAP eligibility.

The IRS also notes hospitals may accept applications beyond that period.

## Product Implication

This can become one of CareZero's most useful differentiators.

Example:

```text
FIRST BILL
August 20

TODAY
September 13

APPLICATION WINDOW
Approximately day 24 of 240
```

Patient sees:

# You appear to still be within the federal FAP application period.

Then:

**Prepare Application**

---

# 11. Incomplete Applications Matter

## Evidence

The IRS states that if an individual submits an incomplete FAP application during the 240-day application period, the hospital must notify the person about how to complete it and provide a reasonable opportunity to do so as part of the applicable reasonable-efforts framework.

## Product Implication

CareZero needs:

```text
APPLICATION SUBMITTED
↓
INCOMPLETE
↓
DOCUMENT REQUESTED
↓
DOCUMENT PROVIDED
```

Do not treat incomplete as denied.

---

# 12. Hospitals May Accept Applications Beyond 240 Days

## Evidence

IRS guidance states that hospitals may continue to accept and process FAP applications at any time.

## CareZero Implication

Never display:

> Too late.

Instead:

> The federal 240-day application period appears to have passed. The hospital may still accept applications. Contact the financial-assistance office.

---

# 13. State Law Can Add Additional Rights

## Evidence

CFPB consumer guidance notes that states can impose additional charity-care requirements.

It identifies examples where state protections extend beyond the federal nonprofit-hospital baseline.

CFPB's research also describes state-specific eligibility requirements and examples of uniform applications.

## Product Implication

Future architecture:

```text
Federal Baseline
+
Hospital Policy
+
State Requirements
=
CareZero Patient Guidance
```

This should be a versioned rules engine.

---

# 14. Medical Debt Can Reach Collections Despite Assistance Issues

## Evidence

CFPB has reported consumer complaints in which medical debt collectors attempted to collect bills that were already paid or that should have been addressed through nonprofit-hospital financial assistance.

The CFPB specifically notes poor information-sharing can shift the burden onto patients to prove a debt is no longer owed.

## Product Implication

CareZero's case record has value beyond initial eligibility.

Future “CareZero Receipt”:

```text
Application submitted
Hospital decision
Assistance applied
Corrected balance
```

Patient controls these records.

---

# 15. Why CareZero Should Intervene Before Financing

## Evidence

CFPB materials warn that medical-billing complexity can lead to:

* collection activity;
* interest;
* lawsuits;
* garnishments;
* financial consequences;

when unresolved bills remain unpaid.

## Product Thesis

Traditional consumer finance asks:

> How should this person finance the bill?

CareZero first asks:

# **How much of this bill should the patient actually be expected to pay after available assistance is considered?**

Only then should financing even enter the conversation.

---

# 16. Competitor Validation — Dollar For

## Evidence

Dollar For currently maintains a consumer qualification workflow asking for:

* hospital state;
* city;
* hospital;
* original bill date;
* amount owed;
* annual household income;
* household size;
* insurance status.

Dollar For also publicly offers help applying for hospital bill forgiveness.

## Strategic Meaning

Do not treat this as proof CareZero should not exist.

It proves:

* consumer FAP screening is useful;
* patients will submit these inputs;
* hospital policy databases are feasible;
* nonprofit navigation is a real category.

## CareZero Differentiation

CareZero's differentiation should be:

```text
FAP structured rules
+
explainability
+
federal timeline engine
+
case lifecycle
+
hospital outcome
+
verified residual hardship
+
independent Relief Rail
+
transparent settlement
```

---

# 17. Competitor Validation — Cinnamon

## Evidence

Cinnamon describes a financial-assistance platform that integrates:

* manufacturer copay programs;
* nonprofit foundations;
* charity care;
* patient assistance;
* government support;

through a broader “Coverage Waterfall.”

## Strategic Meaning

This validates the concept that patient affordability is best treated as a sequence of potential funding layers.

CareZero's version:

```text
Hospital FAP
↓
other rights / assistance
↓
verified residual hardship
↓
independent Relief Fund
```

Difference:

CareZero begins as a public-good patient advocacy system rather than primarily a provider workflow product.

---

# 18. Patient Assistance Charity Compliance Is a Real Regulatory Area

## Evidence

HHS OIG has long recognized that independent charities can play an important role helping financially needy beneficiaries.

However, OIG has emphasized the need for independence from donors and warned about arrangements that function as conduits for manufacturers to influence use of particular products.

OIG continues to issue advisory opinions on patient-assistance arrangements, including a favorable opinion posted in August 2026 concerning a nonprofit charitable organization's proposed patient-assistance program. Advisory opinions are highly fact-specific and bind only the requestor.

## CareZero Implication

CareZero should begin with:

# broad general medical hardship.

Avoid early dependence on:

* pharmaceutical manufacturers;
* narrow disease-specific funds;
* provider-selected beneficiaries;
* product-specific assistance.

---

# 19. Donor Independence Is Essential

## Evidence

OIG guidance focuses on the independence of patient-assistance charities from donors.

The agency has specifically raised concerns about:

* narrowly defined funds;
* product steering;
* donor influence;
* structures that effectively subsidize a donor's own products.

## CareZero Design Principle

Donor:

```text
contributes money
```

CareZero:

```text
sets objective program rules
selects eligible cases
controls grants
```

Donor should not:

```text
select Jane Doe
select Hospital X
select Drug Y
receive patient identity
condition money on use of donor services
```

---

# 20. HIPAA Is Relationship-Dependent

## Evidence

HHS explains that a consumer-directed health app is not automatically a HIPAA business associate merely because an individual asks a covered healthcare provider to transmit information to the app.

Whether HIPAA applies to the app developer depends on the relationship with the covered entity and whether the app is creating, receiving, maintaining or transmitting protected health information on behalf of that covered entity.

## CareZero Implication

Never casually write:

> HIPAA-compliant.

At launch, legal analysis must determine whether CareZero is acting as:

* direct-to-consumer app;
* business associate;
* subcontractor;
* provider service;
* another category.

---

# 21. Non-HIPAA Health Apps Can Still Have Federal Privacy Obligations

## Evidence

The FTC updated its Health Breach Notification Rule to make clear that certain health apps and similar technologies outside HIPAA can fall within the rule.

Covered vendors of personal health records and related entities may have obligations to notify individuals, the FTC and sometimes the media when unsecured identifiable health information is breached.

## CareZero Implication

“Not HIPAA-covered” does **not** mean:

> no federal health privacy obligations.

CareZero should build privacy/security as though the information is extremely sensitive regardless of technical regulatory classification.

---

# 22. Unauthorized Disclosure Can Count as a Breach

## Evidence

FTC guidance explains that the Health Breach Notification Rule's breach concept can include unauthorized disclosure, not only a malicious database intrusion.

## Product Implication

CareZero should not place third-party marketing pixels or advertising SDKs on pages containing:

* patient bill information;
* hospital;
* income;
* case information;
* health-related application data.

Analytics architecture should be privacy-first.

---

# 23. State Consumer Health Privacy Laws Matter

## Evidence

Washington's My Health My Data Act protects certain consumer health data outside HIPAA and focuses on collection and sharing without appropriate consent.

## Product Implication

CareZero must treat:

```text
direct-to-consumer health-financial data
```

as potentially subject to state-specific health privacy laws even when HIPAA does not apply.

This should be reviewed before national production launch.

---

# 24. ETHOnline: Three Partner Selections

## Evidence

ETHGlobal's ETHOnline 2026 rules allow submissions to select up to **three Partner Prizes**.

If one partner offers multiple prize tracks, a project can be eligible for multiple tracks from that selected partner while using only one of the three partner selections.

## CareZero Strategy

Select:

```text
Privy
Arc
World
```

Potential track fit:

```text
Privy
- B2B financial product
- Financial flow

Arc
- DeFi / Onchain Finance
- Agentic Economy

World
- Selfie Check
```

---

# 25. ETHOnline Judging

## Evidence

ETHGlobal states judges evaluate:

1. Technicality
2. Originality
3. Practicality
4. Usability
5. Wow Factor

## CareZero Mapping

### Technicality

* policy extraction;
* structured rules;
* timeline engine;
* Circle Agent Stack;
* Privy policies;
* World verification;
* Arc contract.

### Originality

Not generic charity care.

The new element is:

**full patient financial-assistance rail + transparent residual grant infrastructure.**

### Practicality

One complete end-to-end patient.

### Usability

No crypto knowledge required.

### Wow

```text
$18,420
↓
$1,970
```

---

# 26. Privy Prize Evidence

## Current ETHOnline Requirements

Privy's B2B track rewards products helping organizations manage digital assets and financial operations, particularly with features such as:

* organization wallets;
* policies;
* team permissions;
* quorum approvals;
* automated operations.

Qualification requires a Privy wallet, business use case, functional B2B flow and at least one real Privy control.

Its Financial Flow track requires a real supported Privy financial action and emphasizes hiding unnecessary blockchain complexity.

## CareZero Fit

```text
Nonprofit treasury
+
policy-controlled wallet
+
fund ReliefPool
```

Strong.

---

# 27. Arc Prize Evidence

## Current ETHOnline Requirements

Arc's main classic-track prize categories include:

### Best DeFi/Onchain Finance Application

Arc specifically calls for:

* meaningful Arc/USDC usage;
* conditional payments;
* onchain automation;
* multi-step settlement;
* payment/treasury/fintech infrastructure.

### Best Agentic Economy Application

Arc calls for:

* autonomous agents;
* wallets;
* USDC;
* clear decision logic;
* real signals;
* Agent Stack;
* payments or settlement.

## CareZero Fit

Perfect architecture:

```text
verified case state
↓
objective program rules
↓
Relief Agent
↓
conditional USDC settlement
```

---

# 28. Arc Mainnet Condition

## Evidence

For both current $3,500 classic-track Arc categories, ETHGlobal states that **$2,500 of the $3,500 will only be awarded if the same project is deployed to Arc Mainnet by September 30, 2026**.

## Development Implication

CareZero must:

* deploy testnet now;
* keep environment config clean;
* prepare mainnet scripts;
* avoid coupling production legal launch to infrastructure deployment.

A mainnet contract can be deployed without immediately funding real patient grants.

---

# 29. World Prize Evidence

## Current ETHOnline Selfie Check Track

World's $3,500 Selfie Check pool may award up to three teams.

World asks projects to use Selfie Check as a meaningful:

* risk;
* eligibility;
* fairness;
* continuity;
* abuse-prevention signal.

World also requires a feedback document covering:

* Selfie Check docs/integration;
* Developer Portal;
* Sandbox states/proof flows/test users;
* errors and edge cases;
* confusing/missing/broken functionality.

## CareZero Fit

Use:

# Relief Fund abuse-prevention signal.

Do not gate:

# hospital FAP rights.

---

# 30. ETHGlobal AI Development Requirements

## Evidence

ETHGlobal permits AI development tools but requires disclosure of where/how AI was used.

Spec-driven development workflows are permitted, but the submission repository must contain the spec files, prompts and planning artifacts used.

## CareZero Requirement

Preserve:

```text
/docs/specs/
/docs/prompts/
/docs/AI_DISCLOSURE.md
```

Do not delete this handoff material before submission.

---

# 31. Research-Backed CareZero Claims

Strong claims:

* applicable nonprofit hospitals must maintain written FAPs;
* FAP requirements include eligibility and application information;
* policies vary by hospital and state;
* insured patients can sometimes qualify;
* application processes can be burdensome;
* federal regulations include 120-day and 240-day timeline concepts;
* medical debt is a major U.S. financial problem;
* independent patient-assistance charities are legitimate but require careful independence;
* digital health privacy extends beyond HIPAA.

---

# 32. Claims That Need Qualification

Do not claim:

> Every hospital must provide free care.

Not all hospitals are covered by the same rules, and federal law does not impose one universal assistance threshold.

Do not claim:

> Anyone under X% FPL qualifies.

Hospital/state rules vary.

Do not claim:

> CareZero can stop collections.

CareZero can inform users of relevant rules and help document the process.

Do not claim:

> 240 days means collections cannot happen.

The regulations are more nuanced.

Do not claim:

> World prevents duplicate people.

Selfie Check is a lower-assurance liveness credential.

Do not claim:

> Blockchain makes CareZero HIPAA compliant.

It does not.

---

# 33. Research Gaps for Post-Hackathon Work

Before a real launch, investigate:

1. state-by-state charity-care statutes;
2. hospital group policies;
3. provider exclusions;
4. emergency-physician billing;
5. hospital-employed vs independent physicians;
6. debt collector notice processes;
7. presumptive eligibility;
8. asset-test differences;
9. immigration/residency requirements;
10. medical-credit products;
11. state medical-debt laws;
12. federal beneficiary-inducement rules;
13. anti-kickback analysis;
14. state charitable-solicitation registration;
15. money-transmission/stablecoin questions;
16. tax treatment of patient grants;
17. state consumer health privacy laws;
18. HIPAA/BAA scope;
19. FTC HBNR;
20. patient consent architecture.

---

# 34. Primary Research Sources

Use primary sources first.

### IRS

Financial Assistance Policies.

Supports:

* FAP requirement;
* minimum policy content.

### IRS

Billing and Collections — Section 501(r)(6).

Supports:

* 120-day notification period;
* 240-day application period;
* incomplete applications;
* reasonable-efforts framework.

### CFPB

Is There Financial Help for My Medical Bills?

Supports:

* charity care;
* insured and underinsured applicability;
* patient workflow;
* state overlays.

### CFPB

Medical Debt and Non-Profit Hospital Billing Practices.

Supports:

* process burden;
* apparent underuse;
* $2.7 billion example;
* hospital variation;
* nonprofit market share.

### KFF

The Burden of Medical Debt in the United States.

Supports:

* $220 billion estimate;
* 14 million adults > $1,000;
* 3 million adults > $10,000.

### HHS OIG

Independent Charity Patient Assistance Guidance.

Supports:

* legitimate role of independent charities;
* donor independence;
* anti-steering concerns.

### HHS OCR

Health Apps / HIPAA Guidance.

Supports:

* relationship-based HIPAA analysis.

### FTC

Health Breach Notification Rule.

Supports:

* non-HIPAA health app obligations;
* unauthorized-disclosure risks.

### ETHGlobal

ETHOnline 2026 Rules.

Supports:

* three partner selections;
* judging;
* demo requirements;
* AI disclosure.

### ETHGlobal — Privy

Supports:

* B2B;
* policies;
* financial-flow criteria.

### ETHGlobal — Arc

Supports:

* programmable USDC;
* Agent Stack;
* mainnet requirement.

### ETHGlobal — World

Supports:

* Selfie Check use case;
* feedback requirement.

---

# 35. Core Evidence Narrative

The research supports one cohesive story:

**Federal law creates financial-assistance obligations for nonprofit hospitals.**

But eligibility rules remain fragmented across hospitals and states.

Patients can be insured and still potentially qualify.

Applications are complicated enough that assistance can go unused.

Patients apparently eligible for assistance have still been billed substantial amounts.

Medical debt remains enormous.

CareZero therefore first improves access to existing institutional assistance.

Then—only after that institutional assistance is considered—the CareZero Relief Rail uses independent charitable capital to address verified remaining hardship.

The model does not replace existing help.

# It connects the help that already exists.
