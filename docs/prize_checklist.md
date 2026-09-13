# Althea Care — ETHOnline 2026 Pre-Submission & Prize-Eligibility Checklist

## Purpose

Run this checklist before final submission.

Do not assume a feature exists because code exists.

Mark:

```text
[PASS]
```

only after verifying the requirement yourself.

Use:

```text
[FAIL]
```

for broken requirements.

Use:

```text
[N/A]
```

only when genuinely inapplicable.

No important item should remain:

```text
TODO
```

at submission.

---

# SECTION A — ETHGLOBAL CORE SUBMISSION

## Project Eligibility

* [ ] Althea qualifies for the intended **From Scratch / Classic** track.
* [ ] Project-specific submitted code was built within the permitted event window.
* [ ] Any starter kits are disclosed.
* [ ] Any pre-existing code, if any, is disclosed according to event rules.
* [ ] Git history reflects real development.
* [ ] Repository does not consist of one artificial final commit.
* [ ] Open-source/reused libraries are appropriately disclosed.
* [ ] Team members can explain the submitted code.

---

# ETHGLOBAL PARTNER SELECTION

Select exactly:

* [ ] **Privy**
* [ ] **Arc**
* [ ] **World**

Do not accidentally select:

* [ ] Hedera
* [ ] ENS
* [ ] another fourth partner

Althea's architecture is optimized specifically for Privy + Arc + World.

---

# ETHGLOBAL DEMO

* [ ] Demo video exists.
* [ ] Demo is between 2 and 4 minutes.
* [ ] Target length is approximately 3:20–3:40.
* [ ] Resolution is at least appropriate for judging.
* [ ] Text is readable.
* [ ] Browser zoom makes numbers clearly visible.
* [ ] Audio is understandable.
* [ ] Video is not artificially sped up.
* [ ] No AI-generated voiceover if event rules prohibit it.
* [ ] Demo shows a real working product.
* [ ] Real sponsor integrations are demonstrated.
* [ ] Demo clearly labels simulated hospital decision.
* [ ] Demo clearly distinguishes testnet activity.
* [ ] No real patient data appears.
* [ ] No secrets/API keys appear.
* [ ] No private wallet keys appear.

---

# DEMO STORY

Verify the video shows:

* [ ] $18,420 original bill.
* [ ] Example Medical Center.
* [ ] Household size 3.
* [ ] $51,000 household income.
* [ ] Insured.
* [ ] Althea searches/uses FAP.
* [ ] “You may qualify.”
* [ ] $15,950 potential hospital assistance.
* [ ] $2,470 potential remaining balance.
* [ ] Explainability/source.
* [ ] Application preparation.
* [ ] Relevant timeline.
* [ ] Simulated hospital approval.
* [ ] $2,470 verified residual.
* [ ] Althea Relief.
* [ ] World Selfie Check.
* [ ] Relief Agent.
* [ ] Human review for $500.
* [ ] Privy approval/control.
* [ ] Circle Agent Stack.
* [ ] Arc USDC transaction.
* [ ] $500 Relief grant.
* [ ] $1,970 final remaining balance.
* [ ] final Althea message.

---

# FINAL DEMO MESSAGE

Final video includes:

* [ ] **The hospital already had the assistance program.**
* [ ] **Althea made it usable.**

Preferably also:

* [ ] **Before the bill becomes debt.**

---

# REPOSITORY

* [ ] Public/accessible repository included as required.
* [ ] README exists.
* [ ] Local setup documented.
* [ ] Environment variables documented without secrets.
* [ ] Architecture diagram included.
* [ ] Sponsor integrations documented.
* [ ] Smart contract documented.
* [ ] Deployment network documented.
* [ ] Test commands documented.
* [ ] Limitations documented.
* [ ] Demo case documented.
* [ ] AI use documented.
* [ ] Spec-driven artifacts preserved.

---

# REQUIRED ALTHEA DOCUMENTS

Confirm repository contains:

* [ ] `MASTER_BLUEPRINT.md`
* [ ] `TECH_ARCHITECTURE.md`
* [ ] `PRIZE_STRATEGY.md`
* [ ] `BUSINESS_MARKETING.md`
* [ ] `RESEARCH_EVIDENCE.md`
* [ ] `SECURITY_PRIVACY_COMPLIANCE.md`
* [ ] `DATA_MODEL_API.md`
* [ ] `IMPLEMENTATION_PLAN.md`
* [ ] `DEMO_SCRIPT.md`
* [ ] `WORLD_FEEDBACK.md`
* [ ] `AI_DISCLOSURE.md`
* [ ] `MASTER_CODING_HARNESS_PROMPT.md`
* [ ] `PRE_SUBMISSION_PRIZE_ELIGIBILITY_CHECKLIST.md`

---

# AI DISCLOSURE

ETHGlobal requires transparency around AI-assisted development.

Verify:

* [ ] `AI_DISCLOSURE.md` exists.
* [ ] ChatGPT usage disclosed.
* [ ] Actual coding assistant disclosed.
* [ ] AI-assisted code areas disclosed.
* [ ] AI-assisted tests disclosed.
* [ ] AI-assisted documentation disclosed.
* [ ] AI-generated visual assets disclosed if used.
* [ ] Human contributions described.
* [ ] Team understands core generated code.
* [ ] No statement falsely suggests humans manually wrote code that AI generated.

---

# SPEC-DRIVEN DEVELOPMENT

Because Althea uses a spec-driven workflow:

* [ ] Specifications are preserved.
* [ ] Master coding-harness prompt is preserved.
* [ ] Important implementation prompts are preserved.
* [ ] Planning artifacts are preserved.
* [ ] Prompt/spec files used by coding AI are committed.
* [ ] No relevant prompt artifacts were deleted before submission.

---

# SECTION B — PRODUCT FUNCTIONALITY

## Patient Intake

* [ ] Hospital selector works.
* [ ] Bill amount works.
* [ ] Household size works.
* [ ] Household income works.
* [ ] Insurance selection works.
* [ ] First bill date works.
* [ ] Input validation works.
* [ ] Load Demo button works.

---

# FAP ENGINE

* [ ] Demonstration FAP exists.
* [ ] It is clearly labeled fictional/demo.
* [ ] Policy uses structured schema.
* [ ] FAP versioning exists.
* [ ] Deterministic rules engine works.
* [ ] FPL calculation works.
* [ ] Calculations produce intended demo result.
* [ ] AI free-form output is not trusted directly for calculations.
* [ ] Missing/ambiguous rule returns review state.
* [ ] Source citations are preserved.

---

# DEMO CALCULATION

Input:

```text
Bill:
$18,420

Household:
3

Income:
$51,000

Insurance:
Yes
```

Expected output:

```text
Potential assistance:
$15,950

Potential remaining:
$2,470
```

Verify:

* [ ] exact result returned.

---

# LANGUAGE SAFETY

Patient result says:

* [ ] “You may qualify.”

It does NOT say:

* [ ] “You qualify.”

Verify visible disclaimer:

* [ ] hospital determines final eligibility.
* [ ] estimate is based on published/demo policy.
* [ ] Althea does not guarantee assistance.

---

# EXPLAINABILITY

* [ ] “Why?” control works.
* [ ] Household size displayed.
* [ ] Income displayed.
* [ ] Policy match displayed.
* [ ] Insurance condition displayed.
* [ ] Policy source displayed.
* [ ] No black-box “AI decided” language.

---

# FAP TIMELINE

* [ ] First billing date is tracked.
* [ ] Application-period calculation works.
* [ ] Timeline language is conservative.
* [ ] No claim says all collections are prohibited for 240 days.
* [ ] Educational/legal disclaimer visible where appropriate.

---

# APPLICATION

* [ ] Prepare Application works.
* [ ] Required-document list shown.
* [ ] Submission instructions shown.
* [ ] Hospital/application information shown.
* [ ] Application status can advance.
* [ ] Product does not falsely claim electronic submission occurred.

---

# HOSPITAL DECISION

* [ ] Demo hospital decision can be recorded.
* [ ] It is visibly labeled simulated.
* [ ] Assistance = $15,950.
* [ ] Residual = $2,470.
* [ ] Althea does not claim it made this hospital decision.

---

# SECTION C — WORLD PRIZE

Target:

# World — Selfie Check

Current track purpose:

Selfie Check must be used meaningfully as a:

* risk;
* eligibility;
* fairness;
* continuity;
* or abuse-prevention signal.

Althea's use:

# Abuse prevention for scarce Althea Relief funds.

---

# WORLD FUNCTIONAL REQUIREMENTS

* [ ] Actual Selfie Check or compatible credential flow integrated.
* [ ] Working app demonstrates it.
* [ ] Sandbox App used appropriately.
* [ ] Successful verification state works.
* [ ] Failure state works.
* [ ] Cancel state handled.
* [ ] User is not stranded if verification fails.
* [ ] Verification is stored minimally.
* [ ] Raw selfie is not intentionally stored by Althea.
* [ ] World is used meaningfully.
* [ ] World is not just generic login.

---

# WORLD ETHICAL BOUNDARY

Hospital financial assistance:

* [ ] does NOT require World.

Althea FAP search:

* [ ] does NOT require World.

Althea estimate:

* [ ] does NOT require World.

Application preparation:

* [ ] does NOT require World.

Althea Relief:

* [ ] may use World as one anti-abuse signal.

Patient language clearly states:

* [ ] Selfie Check does not determine hospital FAP eligibility.

---

# WORLD MANUAL FALLBACK

Preferably:

* [ ] “Request Manual Review” exists.

At minimum:

* [ ] product architecture documents future non-biometric alternative.

---

# WORLD FEEDBACK DOCUMENT

Current Selfie Check requirements explicitly call for feedback on these topics.

`WORLD_FEEDBACK.md` contains actual feedback about:

* [ ] Selfie Check docs.
* [ ] Selfie Check integration flow.
* [ ] Developer Portal navigation.
* [ ] Developer Portal search.
* [ ] product discovery.
* [ ] debugging guidance.
* [ ] Sandbox App states.
* [ ] proof flows.
* [ ] test users.
* [ ] errors.
* [ ] edge cases.
* [ ] what was confusing.
* [ ] what was missing.
* [ ] what was broken.
* [ ] what was difficult to test.

Additionally recommended:

* [ ] user feedback.
* [ ] camera-flow feedback.
* [ ] Althea-specific comprehension feedback.
* [ ] concrete improvement suggestions.

---

# WORLD PLACEHOLDERS

Search repository for:

```text
[FILL
TODO WORLD
WORLD TODO
```

Verify:

* [ ] no incomplete World feedback placeholders remain.

---

# WORLD PRIZE EXPLANATION

Submission clearly explains:

> Selfie Check is one liveness/abuse-prevention signal protecting limited charitable funds. Althea intentionally does not use it to gate hospital financial-assistance rights.

* [ ] explanation included.

---

# SECTION D — PRIVY PRIZE

## Target 1

# Best B2B Financial Product

Current Privy qualification expects:

* core Privy integration;
* at least one Privy wallet;
* organization/business use case;
* functional B2B workflow;
* at least one Privy control;
* working demo;
* source code;
* explanation of Privy's role.

Verify:

* [ ] Privy is a core integration.
* [ ] Privy wallet exists.
* [ ] Wallet represents Althea organizational treasury.
* [ ] Business/organization use case is clear.
* [ ] B2B workflow works.
* [ ] At least one real Privy control works.
* [ ] Control is not mocked.
* [ ] Source code present.
* [ ] Demo demonstrates integration.
* [ ] README explains why Privy matters.

---

# PRIVY CONTROL

At least one must be real:

* [ ] policy;
* [ ] signer control;
* [ ] key quorum;
* [ ] intent.

Record which one qualifies:

```text
QUALIFYING PRIVY CONTROL:
__________________________
```

---

# PRIVY B2B FLOW

Preferred:

```text
Althea Relief Treasury
↓
Privy authorization
↓
fund Althea ReliefPool
```

Verify:

* [ ] works.

---

# Target 2

# Best Financial Flow

Current Privy criteria require:

* core Privy use;
* Privy wallet;
* at least one functional financial flow using generally available Privy functionality;
* working demo;
* source;
* explanation of improved UX.

Verify:

* [ ] actual financial flow works.
* [ ] transaction is not purely mocked.
* [ ] Privy wallet participates.
* [ ] supported generally available feature is used.
* [ ] blockchain complexity is hidden from normal user.
* [ ] financial flow demonstrated.
* [ ] transaction/proof available.

---

# PRIVY DOES NOT COUNT IF

Fail the checklist if the only Privy implementation is:

```text
login
```

or:

```text
mocked card
```

or:

```text
screenshot
```

with no live qualifying wallet financial flow/control.

* [ ] Privy implementation exceeds authentication.

---

# PRIVY JUDGE EXPLANATION

Submission should communicate:

> Althea uses Privy as the institutional control layer. The nonprofit treasury is governed through a Privy wallet and explicit controls before funds reach the programmable ReliefPool. This prevents an AI agent from receiving unrestricted treasury authority.

* [ ] explanation included.

---

# SECTION E — ARC PRIZE

## Target 1

# Best DeFi / Onchain Finance Application

Current criteria emphasize:

* meaningful Arc + USDC;
* advanced programmable money flows;
* conditional payments;
* automation;
* multi-step settlement;
* working frontend/backend;
* architecture diagram;
* demo/presentation;
* GitHub/Replit repository.

Verify:

* [ ] Althea deployed on Arc test environment.
* [ ] USDC used.
* [ ] ReliefPool deployed.
* [ ] conditional logic exists.
* [ ] payment involves more than simple transfer.
* [ ] authorized executor enforced.
* [ ] program cap enforced.
* [ ] duplicate payout protection enforced.
* [ ] sufficient balance enforced.
* [ ] provider destination enforced.
* [ ] frontend works.
* [ ] backend works.
* [ ] architecture diagram exists.
* [ ] repo linked.
* [ ] demo visibly demonstrates settlement.

---

# ARC CONTRACT TESTS

* [ ] deposit passes.
* [ ] grant release passes.
* [ ] unauthorized executor rejected.
* [ ] duplicate case rejected.
* [ ] grant above cap rejected.
* [ ] zero recipient rejected.
* [ ] insufficient balance rejected.
* [ ] paused contract rejected.
* [ ] unpause works.
* [ ] event emitted correctly.
* [ ] correct amount reaches demo provider.

---

# ARC TRANSACTION

Record:

```text
NETWORK:
__________________________

RELIEFPOOL CONTRACT:
__________________________

USDC CONTRACT:
__________________________

DEMO GRANT TX:
__________________________

DEMO PROVIDER:
__________________________
```

* [ ] transaction confirmed.

---

# ARC MAINNET CONDITION

Current ETHOnline 2026 rules state that $2,500 of the relevant $3,500 Arc Classic track award is conditional on deployment of the **same project to Arc Mainnet by September 30, 2026**.

Verify:

* [ ] team is aware.
* [ ] mainnet deployment script exists.
* [ ] mainnet environment is separated.
* [ ] contract contains no hardcoded testnet assumptions.
* [ ] README explains mainnet path.
* [ ] plan exists for September 30 deployment.
* [ ] real patient funds are NOT required to satisfy infrastructure deployment.
* [ ] no unsafe rush into real patient payments.

---

# Target 2

# Best Agentic Economy Application with Circle Agent Stack

Current Arc criteria emphasize:

* autonomous agents transacting on Arc;
* wallets;
* USDC;
* clear decision logic tied to real signals;
* Agent Stack;
* autonomous spending/payment/settlement.

Verify:

* [ ] actual Circle Agent Stack used.
* [ ] dependency/import proves integration.
* [ ] Agent Stack use documented.
* [ ] agent connects to wallet/onchain action.
* [ ] agent uses USDC.
* [ ] agent uses Arc.
* [ ] agent decision logic is visible.
* [ ] decision depends on actual case state.
* [ ] transaction executed.

---

# RELIEF AGENT SIGNALS

Agent should consume:

* [ ] FAP status.
* [ ] hospital decision.
* [ ] verified residual.
* [ ] World state.
* [ ] duplicate-risk state.
* [ ] program cap.
* [ ] requested grant.
* [ ] ReliefPool balance.
* [ ] human approval state.

---

# AGENT SAFETY

* [ ] Agent cannot alter program cap.
* [ ] Agent cannot alter treasury owner.
* [ ] Agent cannot withdraw arbitrary Privy treasury funds.
* [ ] Agent cannot override duplicate protection.
* [ ] Agent cannot invent settlement address.
* [ ] Agent does not receive unnecessary patient medical information.
* [ ] Financial decision ultimately governed by deterministic rules.

---

# ARC AGENT JUDGE EXPLANATION

Submission should say:

> Althea's Relief Agent orchestrates a governed charitable settlement workflow. It reads real case and program signals, determines whether the deterministic rules require autonomous or human approval, and after authorization uses Circle Agent Stack to execute the USDC settlement through Althea's Arc ReliefPool.

* [ ] explanation included.

---

# SECTION F — PRIVACY & SECURITY

## Demo Data

* [ ] All patient data fictional.
* [ ] No real medical bill.
* [ ] No real medical record.
* [ ] No real tax return.
* [ ] No real insurance identifier.
* [ ] No real patient name.

---

# Blockchain Privacy

Verify blockchain contains NO:

* [ ] patient name.
* [ ] date of birth.
* [ ] diagnosis.
* [ ] medical record.
* [ ] bill PDF.
* [ ] income.
* [ ] insurance information.
* [ ] SSN.
* [ ] World selfie.
* [ ] tax document.

---

# Privacy-Safe Onchain Data

Onchain information limited to things like:

* [ ] randomized caseHash.
* [ ] programId.
* [ ] grant amount.
* [ ] settlement address.
* [ ] decisionHash.
* [ ] status/event.

---

# CASE HASH

* [ ] Does not use name + DOB.
* [ ] Does not directly hash guessable PII.
* [ ] Uses random case UUID.
* [ ] Uses random salt/domain separation.
* [ ] mapping remains offchain.

---

# WORLD PRIVACY

* [ ] Raw selfie not stored by Althea.
* [ ] World receives no medical bill.
* [ ] World receives no income.
* [ ] World receives no diagnosis.
* [ ] World receives no treatment details.

---

# TREASURY SECURITY

* [ ] Agent does not own master treasury.
* [ ] ReliefPool holds limited program capital.
* [ ] Privy controls institutional wallet.
* [ ] Contract pausable.
* [ ] High-risk authority separated.

---

# SECRET MANAGEMENT

Search repository for:

```text
PRIVATE_KEY
API_KEY
SECRET
ENTITY_SECRET
PASSWORD
```

Verify:

* [ ] no real secrets committed.
* [ ] `.env` ignored.
* [ ] `.env.example` contains placeholders only.
* [ ] leaked test credentials rotated if necessary.

---

# LOGGING

* [ ] No sensitive form body logged.
* [ ] No World raw result improperly logged.
* [ ] No private key logged.
* [ ] No income in third-party analytics.
* [ ] No bill amount unnecessarily sent to advertising trackers.
* [ ] No marketing pixels on sensitive screens.

---

# SECTION G — SMART CONTRACT QUALITY

* [ ] Solidity compiler version pinned.
* [ ] reputable libraries used.
* [ ] SafeERC20 used where appropriate.
* [ ] access control understood.
* [ ] ownership/admin documented.
* [ ] pause rights documented.
* [ ] checks-effects-interactions considered.
* [ ] duplicate payout addressed.
* [ ] USDC decimals handled correctly.
* [ ] events emitted.
* [ ] tests pass.
* [ ] contract source committed.
* [ ] deployment address documented.

---

# SECTION H — APPLICATION QUALITY

Run:

```text
npm run build
```

* [ ] passes.

Run:

```text
npm run lint
```

* [ ] passes or no material errors.

Run:

```text
npm test
```

* [ ] passes.

Run contract tests:

* [ ] passes.

Run type check:

* [ ] passes.

---

# BROWSER TESTING

Test:

* [ ] Chrome desktop.
* [ ] mobile responsive view.
* [ ] keyboard navigation.
* [ ] fresh browser/session.
* [ ] refresh mid-case.
* [ ] World cancel.
* [ ] World retry.
* [ ] double-click grant execution.
* [ ] invalid patient inputs.
* [ ] Arc transaction error handling.
* [ ] Privy authorization failure.

---

# ACCESSIBILITY

* [ ] Form labels.
* [ ] keyboard accessible.
* [ ] focus visible.
* [ ] appropriate contrast.
* [ ] error messages understandable.
* [ ] no state conveyed by color alone.
* [ ] reduced-motion respected if practical.
* [ ] large dollar amounts accessible to screen readers.

---

# SECTION I — BUSINESS / CLAIMS

Ensure product does NOT claim:

* [ ] guaranteed hospital forgiveness.
* [ ] guaranteed Althea grant.
* [ ] legal advice.
* [ ] medical advice.
* [ ] Althea determines hospital eligibility.
* [ ] AI determines hospital eligibility.
* [ ] World determines medical need.
* [ ] universal 240-day collection prohibition.
* [ ] HIPAA compliance without justification.
* [ ] real hospital accepts USDC.

---

# REQUIRED WORDING

Use:

* [ ] “may qualify.”
* [ ] “potential assistance.”
* [ ] “hospital determines final eligibility.”
* [ ] “simulated hospital decision.”
* [ ] “World is an anti-abuse/liveness signal.”
* [ ] “Althea Relief is separate from hospital financial assistance.”

---

# SECTION J — RELIEF FUND ETHICS

* [ ] Donors do not select individual patient in demo architecture.
* [ ] Donors do not receive patient identity.
* [ ] Donors do not select diagnosis.
* [ ] Donors do not condition aid on product use.
* [ ] Donors do not condition aid on a specific provider.
* [ ] Broad general hardship fund used.
* [ ] Patient pays no Althea grant fee.
* [ ] No percentage of hospital assistance taken.
* [ ] No medical debt tokenized.
* [ ] No patient grant sold/traded.

---

# SECTION K — COMPETITOR POSITIONING

If Dollar For is mentioned:

* [ ] describe as market validation.
* [ ] do not insult or criticize their website.
* [ ] explain partnership possibility.
* [ ] explain Althea's full-rail differentiation.

Approved explanation:

> Dollar For validates the patient-navigation problem and could eventually be an upstream partner. Althea extends the workflow into structured policy intelligence, deadlines, hospital decision tracking, verified residual hardship and transparent charitable settlement.

---

# SECTION L — ARCHITECTURE DIAGRAM

Architecture diagram visibly includes:

* [ ] Patient.
* [ ] FAP engine.
* [ ] deterministic calculation.
* [ ] hospital decision.
* [ ] residual balance.
* [ ] World.
* [ ] Relief rules.
* [ ] Circle Agent Stack.
* [ ] Privy.
* [ ] Arc.
* [ ] USDC.
* [ ] provider settlement.

Also:

* [ ] **Patient data: OFFCHAIN**
* [ ] **Financial proof: ONCHAIN**

---

# SECTION M — PUBLIC DASHBOARD

If included:

* [ ] Demo statistics clearly labeled.
* [ ] Actual testnet statistics distinguished.
* [ ] no patient PII.
* [ ] no diagnosis.
* [ ] no exact case link enabling identification.
* [ ] transaction verification works.
* [ ] platform fee shown accurately.

---

# SECTION N — FINAL SUBMISSION COPY

Short description ready:

> Althea turns hospital financial-assistance policy into an actionable patient workflow, then uses programmable charitable capital to help close verified remaining medical hardship.

* [ ] ready.

Long description ready:

* [ ] explains problem.
* [ ] explains FAP navigator.
* [ ] explains Relief Rail.
* [ ] explains World.
* [ ] explains Privy.
* [ ] explains Circle Agent Stack.
* [ ] explains Arc.
* [ ] explains privacy.

---

# SECTION O — SPONSOR SUBMISSION ANSWERS

Prepare concise answers before opening submission form.

## Privy — How did you use Privy?

* [ ] drafted.

Must include:

```text
organization treasury
wallet
real control
B2B workflow
real financial flow
UX benefit
```

## Arc — How did you use Arc?

* [ ] drafted.

Must include:

```text
USDC
ReliefPool
conditional settlement
Circle Agent Stack
real signals
transaction
architecture
```

## World — How did you use World?

* [ ] drafted.

Must include:

```text
Selfie Check
abuse prevention
limited Relief Fund
not hospital FAP gate
Sandbox
feedback document
```

---

# SECTION P — DEMO TRANSACTION EVIDENCE

Have ready:

```text
Privy treasury transaction
Arc ReliefPool address
Arc grant transaction
World successful Sandbox execution
```

* [ ] screenshots/evidence saved.
* [ ] transaction hashes copied.
* [ ] URLs/reference locations ready.
* [ ] no secrets exposed.

---

# SECTION Q — BACKUP DEMO

Because external services can fail:

* [ ] record one successful World flow.
* [ ] record one successful Privy operation.
* [ ] record one successful Arc grant.
* [ ] save transaction hashes.
* [ ] save architecture screenshot.
* [ ] save final $1,970 screen.

Do not pretend a backup recording is a live transaction.

Use it only if necessary to demonstrate previously working functionality.

---

# SECTION R — FINAL FULL RUN

Run from clean state.

### Step 1

* [ ] Open home page.

### Step 2

* [ ] Check My Bill.

### Step 3

* [ ] Load Demo.

### Step 4

* [ ] Submit.

### Step 5

* [ ] $15,950 potential assistance appears.

### Step 6

* [ ] Why panel works.

### Step 7

* [ ] timeline works.

### Step 8

* [ ] application prepared.

### Step 9

* [ ] simulated hospital decision recorded.

### Step 10

* [ ] $2,470 residual appears.

### Step 11

* [ ] Relief request starts.

### Step 12

* [ ] World succeeds.

### Step 13

* [ ] agent evaluates.

### Step 14

* [ ] human approval required.

### Step 15

* [ ] Privy approval works.

### Step 16

* [ ] Circle Agent runs.

### Step 17

* [ ] Arc grant executes.

### Step 18

* [ ] transaction confirms.

### Step 19

* [ ] $1,970 final amount appears.

### Step 20

* [ ] proof screen works.

If any critical step fails:

# fix it before adding anything else.

---

# SECTION S — MAX-PRIZE AUDIT

## Privy

### B2B Financial Product

* [ ] QUALIFIED

### Financial Flow

* [ ] QUALIFIED

## Arc

### DeFi / Onchain Finance

* [ ] QUALIFIED

### Agentic Economy + Circle Agent Stack

* [ ] QUALIFIED

## World

### Selfie Check

* [ ] QUALIFIED

Target:

# 5 credible prize-track surfaces

through:

# 3 selected partners.

---

# SECTION T — FINAL STOP RULE

Once every P0 feature and prize requirement passes:

# STOP BUILDING NEW FEATURES.

Use remaining time for:

```text
bug fixes

integration verification

documentation

submission copy

demo recording

pitch practice

World feedback

AI disclosure

transaction evidence

repository cleanup
```

Do not risk a working submission for:

```text
another hospital

another AI feature

another sponsor

another dashboard

another animation
```

---

# FINAL GREEN-LIGHT CHECK

Do not submit until you can answer YES to all of these:

### PRODUCT

* [ ] Does Althea clearly solve a real human problem?

### PATIENT

* [ ] Can a judge understand the patient benefit without understanding crypto?

### WOW

* [ ] Does the judge see $18,420 become $1,970?

### PRIVY

* [ ] Is Privy actually controlling an institutional financial workflow?

### ARC

* [ ] Is a real programmable USDC settlement happening on Arc?

### AGENT

* [ ] Is Circle Agent Stack really involved in that settlement?

### WORLD

* [ ] Is Selfie Check meaningful and not cosmetic?

### PRIVACY

* [ ] Is patient medical information kept offchain?

### SAFETY

* [ ] Are hospital eligibility and grant rules deterministic and appropriately governed?

### DOCUMENTATION

* [ ] Are AI/spec artifacts and World feedback complete?

### DEMO

* [ ] Can the entire flow run reliably in under four minutes?

If all ten answers are YES:

# Submit Althea Care.
