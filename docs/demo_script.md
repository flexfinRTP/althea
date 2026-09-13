# Althea Care — ETHOnline 2026 Demo Script

## 1. Demo Goal

The demo should make the judge feel two things simultaneously:

### Emotionally

> This could genuinely help people.

### Technically

> The sponsor integrations are real, necessary, and thoughtfully designed.

The demo should not feel like:

> Here's a healthcare app, and by the way we added crypto.

It should feel like:

> Althea solves the patient problem first, then uses blockchain exactly where transparency and programmable charitable money add value.

---

# 2. Target Length

Aim for:

# 3 minutes 20 seconds to 3 minutes 40 seconds.

ETHGlobal's demo window is short.

Every screen must earn its place.

---

# 3. The Demo Patient

Use:

```text
Patient:
Demo Patient

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

First bill date:
August 20, 2026
```

Althea estimate:

```text
Potential hospital assistance:
$15,950

Potential remaining:
$2,470
```

Simulated hospital outcome:

```text
Approved:
$15,950

Remaining:
$2,470
```

Althea Relief:

```text
$500
```

Final:

```text
$1,970
```

Never change these numbers during the pitch.

---

# 4. Demo Opening Screen

Full screen.

No dashboard.

No sponsor logos.

Just:

# $18,420

Underneath:

**Hospital Bill**

Narration:

> This is an $18,420 hospital bill.

Pause.

> For many patients, this number immediately becomes a question of credit cards, payment plans or collections.

Next screen.

> But this patient may already qualify for thousands of dollars in financial assistance through the hospital itself.

---

# 5. Problem Introduction

Show landing page.

Narration:

> Applicable nonprofit hospitals maintain financial-assistance policies, but the patient may still have to find the correct policy, decode eligibility rules, understand income thresholds, gather documents and track deadlines.

Hover/scroll through:

```text
Find the policy
Understand the rules
Prepare the application
Track the process
```

Then:

> Althea turns that paperwork into one guided path.

Click:

# Check My Bill

---

# 6. Patient Intake

Show clean form.

Enter or load:

```text
Hospital:
Example Medical Center

Bill:
18,420

Household:
3

Income:
51,000

Insurance:
Yes
```

Narration:

> The patient starts with just a few facts.

> No wallet.

> No crypto.

> No medical diagnosis.

Click:

# Check Assistance

---

# 7. FAP Processing Moment

Brief animation:

```text
Finding hospital policy...
✓

Reading eligibility rules...
✓

Calculating household income threshold...
✓
```

Do not fake a long AI process.

Narration:

> Althea structures the hospital's published Financial Assistance Policy.

> AI can help interpret the policy, but deterministic code performs the financial calculation.

---

# 8. Eligibility Result

Reveal:

# You may qualify for financial assistance.

Then:

```text
Original bill                $18,420

Potential assistance         $15,950

Potential remaining           $2,470
```

Narration:

> Based on this hospital's published policy and the information entered, this patient may qualify for approximately $15,950 in assistance.

Immediately say:

> Althea does not make the hospital's decision. The hospital does.

This demonstrates credibility.

---

# 9. Explainability

Click:

# Why?

Show:

```text
Household size:
3

Annual income:
$51,000

Published policy range:
matched

Insurance:
eligible under demo policy

Policy source:
Financial Assistance Policy, 2026
```

Narration:

> Every result is explainable and tied back to the policy source.

> We don't ask a language model to decide whether someone deserves assistance.

Close drawer.

---

# 10. Federal Timeline

Scroll to:

```text
Important Timeline

First billing statement:
August 20, 2026

Approximate federal FAP application period:
Day 24 of 240
```

Narration:

> Althea also converts regulatory timelines into something useful.

> Based on the first post-discharge bill date, this patient appears to still be within the federal 240-day financial-assistance application period that applies in the Section 501(r) framework.

Small disclaimer visible:

**Educational information only. Hospital and state rules vary.**

---

# 11. Prepare Application

Click:

# Prepare Application

Show:

```text
Application ready

Documents:
✓ proof of income
✓ household information

Submission method:
Mail / hospital financial-assistance office

Hospital contact:
...
```

Narration:

> Althea prepares the next step instead of simply telling the patient that a program exists.

> It identifies the application, documents and submission instructions.

---

# 12. Hospital Decision

Click demo control:

# Simulate Hospital Decision

Transition.

Screen:

# Hospital Assistance Approved

Badge:

**SIMULATED DEMO DECISION**

Then:

```text
Original balance             $18,420

Hospital assistance         -$15,950

Remaining balance             $2,470
```

Narration:

> For the hackathon, the hospital decision is simulated.

> In production, this could come from the hospital, the patient's determination letter or a verified revenue-cycle integration.

Pause.

> But there is still a problem.

Highlight:

# $2,470 remaining.

---

# 13. Introduce Althea Relief

Next screen.

# Hospital assistance helped.

## But $2,470 remains.

Text:

> Althea Relief is an independent charitable fund for verified residual medical hardship.

Show:

```text
Available Relief Capital:
$25,000

Maximum Standard Grant:
$500

Patient Fee:
$0
```

Narration:

> This is where Althea becomes more than a financial-assistance navigator.

> If hospital assistance still leaves a verified unaffordable balance, an independent charitable fund can help close part of the gap.

Click:

# Check Althea Relief

---

# 14. Explain World Before Showing It

Screen:

# Protecting limited charitable funds.

Copy:

> Hospital financial assistance does not require World.

> Althea uses World Selfie Check only as one liveness signal to reduce abuse of this separate donor-funded Relief Fund.

Narration:

> We intentionally do not use biometric verification as a gate to hospital financial-assistance rights.

> World is only protecting a scarce charitable pool from automated or repeated abuse.

Buttons:

# Continue

# Manual Review

Click Continue.

---

# 15. World Selfie Check

Run the real World sandbox flow.

Successful return:

```text
✓ Liveness check complete
```

Narration:

> The selfie itself is not stored by Althea.

> We only need the verification result.

Do not linger.

---

# 16. Relief Agent Screen

Now display:

# Althea Relief Agent

Checks begin.

Narration:

> Now our Relief Agent evaluates the case.

Show one by one:

```text
Hospital assistance processed
✓

Verified residual balance
✓ $2,470

Althea program limit
✓ Maximum $500

World anti-abuse signal
✓ Passed

Duplicate-risk check
✓ Low

Available fund balance
✓ $25,000
```

Then:

```text
Requested grant:
$500
```

---

# 17. Explain Agent Safety

Narration:

> The important part is what the agent cannot do.

> It cannot decide hospital eligibility.

> It cannot change the Relief Fund's rules.

> It cannot drain the treasury.

> Deterministic code evaluates the rules, and the Arc contract enforces financial limits.

Show:

```text
Decision:
HUMAN REVIEW REQUIRED

Reason:
Grant exceeds autonomous $250 limit.
```

This is an excellent technical detail.

---

# 18. Privy Moment

Switch to Althea reviewer/admin view.

Show:

```text
Grant Request

Verified residual:
$2,470

Requested:
$500

Program:
Althea General Medical Hardship

Decision:
Eligible for reviewer approval
```

Button:

# Approve $500

Narration:

> Althea's Relief Fund is controlled through Privy.

> Privy gives the nonprofit an organizational wallet, policies and approval controls instead of handing unrestricted private keys to an AI agent.

Click:

# Approve

---

# 19. Privy Architecture Flash

Optional 5–7 second mini overlay:

```text
PRIVY

Althea Relief Treasury
✓ organization wallet
✓ policy-controlled
✓ approved Arc contract
✓ reviewer authorization
```

Narration:

> Privy is our institutional control layer.

Do not spend 30 seconds explaining wallets.

---

# 20. Circle Agent Execution

Return to patient/agent screen.

Show:

```text
Human approval received
✓

Preparing grant...
✓

Executing settlement...
```

Narration:

> After approval, the Althea Relief Agent uses Circle Agent Stack to execute the authorized settlement.

---

# 21. Arc Moment

Transaction animation.

Show:

```text
500 USDC

Althea ReliefPool
↓
Demo Provider Settlement Account
```

Then:

# CONFIRMED ON ARC

Transaction hash.

Narration:

> Arc is where charitable capital becomes programmable.

> The contract verifies that the case hasn't already been paid, the agent is authorized, the grant is within the program cap and enough USDC is available.

> Then $500 is released toward the verified medical obligation.

---

# 22. Critical Privacy Line

Before final reveal:

> The blockchain sees the grant amount and a privacy-safe case hash.

> It does not see the patient's name, income, diagnosis, medical record or hospital bill.

This is very important.

---

# 23. Final Bill Reveal

Full screen.

Start:

```text
Original Bill
$18,420
```

Then:

```text
Hospital Financial Assistance
-$15,950
```

Then:

```text
Althea Relief
-$500
```

Final:

# $1,970 remaining

Pause for one full second.

Narration:

> An $18,420 bill became $1,970.

---

# 24. Closing Line

Recommended final narration:

> The hospital already had the assistance program.

> Althea made it usable.

Pause.

> And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.

Final screen:

# Althea

## Before the bill becomes debt.

---

# 25. Closing Architecture Slide

Show only briefly.

```text
Hospital Bill
↓
FAP Intelligence
↓
Application
↓
Hospital Decision
↓
Residual Balance
↓
World
anti-abuse signal
↓
Althea Relief Rules
↓
Circle Relief Agent
↓
Privy
institutional control
↓
Arc + USDC
conditional settlement
```

Bottom:

```text
Patient data:
OFFCHAIN

Charitable proof:
ONCHAIN
```

---

# 26. Sponsor Logos

Sponsor logos can appear here.

Do not open the demo with them.

The product must come first.

---

# 27. 3:30 Timing Plan

## 0:00–0:15

$18,420 bill.

## 0:15–0:35

Problem + Althea thesis.

## 0:35–1:00

Patient intake + FAP result.

## 1:00–1:20

Explainability + timeline.

## 1:20–1:35

Prepare application.

## 1:35–1:50

Hospital approval → $2,470.

## 1:50–2:05

Introduce Relief.

## 2:05–2:20

World.

## 2:20–2:40

Agent evaluation.

## 2:40–2:55

Privy approval.

## 2:55–3:15

Circle + Arc transaction.

## 3:15–3:30

$1,970 final + closing.

---

# 28. Extended Judge Q&A

## Q: Isn't this Dollar For?

Answer:

> Dollar For validates the patient-navigation problem and could eventually be a partner. Althea extends the workflow beyond qualification screening into structured policy intelligence, regulatory timeline tracking, the hospital decision, verified residual hardship and a transparent charitable settlement rail. A future Althea Relief Rail could even accept cases referred from organizations like Dollar For.

---

# 29. Q: Why not just donate dollars?

Answer:

> A traditional charity can absolutely donate dollars. The added value here is programmable accountability. Our ReliefPool can enforce program caps and duplicate protections, while donors can verify that charitable money actually left the fund. We get public financial accountability without publishing private patient information.

---

# 30. Q: Why USDC?

Answer:

> USDC lets the fund hold and settle a dollar-denominated asset programmatically. The patient never needs to manage crypto. In a production system, provider settlement could ultimately abstract into fiat rails where needed.

---

# 31. Q: Why Arc?

Answer:

> Arc is the programmable settlement layer. Our ReliefPool isn't just sending tokens; it enforces conditional grant execution—authorized executor, verified case hash, program cap, duplicate protection and available liquidity.

---

# 32. Q: Why Privy?

Answer:

> A real nonprofit cannot give an AI agent unrestricted custody of its treasury. Privy gives us the organizational wallet and control layer—policies, authorized signers and approval logic—before funds ever reach the grant execution layer.

---

# 33. Q: Why World?

Answer:

> Only because the Relief Fund is scarce and abuse-resistant distribution matters. We deliberately do not use World to gate hospital charity care. World provides one liveness risk signal for our separate donor-funded program.

---

# 34. Q: Doesn't World exclude people who cannot complete a selfie check?

Answer:

> That's why the architecture includes a manual-review route. World is a risk signal, not an absolute healthcare-access requirement.

---

# 35. Q: Why an agent instead of a cron job?

Answer:

> The deterministic rules could absolutely operate without an LLM. The agent adds orchestration across changing case state, program rules, fund liquidity, approval paths and settlement. We intentionally keep financial authorization deterministic because we don't want opaque AI making healthcare financial decisions.

---

# 36. Q: Where does AI actually help?

Answer:

> In interpreting unstructured hospital policies, mapping them into a structured schema and explaining results in plain language. Financial calculation and grant authorization remain deterministic.

---

# 37. Q: Are you giving legal advice?

Answer:

> No. We provide educational and administrative support based on public hospital policies and federal guidance. We clearly state that hospitals make final eligibility decisions and that regulatory timelines are informational.

---

# 38. Q: Are you HIPAA compliant?

Answer:

> The hackathon uses fictional data only. A production deployment would need a formal privacy analysis based on our actual relationships with hospitals and patients. We've architected for data minimization and offchain privacy, but we don't make a blanket HIPAA-compliance claim.

---

# 39. Q: Is patient information onchain?

Answer:

> No. The chain sees only privacy-safe grant metadata such as case hash, program identifier, amount, settlement address and transaction state. No diagnosis, income, bill or patient identity is public.

---

# 40. Q: How do you prevent duplicate grants?

Answer:

> Offchain, Althea performs duplicate-risk checks. Onchain, the ReliefPool stores each randomized case hash and will not pay the same case hash twice.

---

# 41. Q: Why not just send money to the patient?

Answer:

> Direct payment toward the verified medical obligation helps preserve the charitable purpose and removes wallet-management friction for the patient. They don't need to become a crypto user.

---

# 42. Q: What if hospitals don't accept USDC?

Answer:

> The hackathon uses a demo provider settlement wallet. In production, Arc can remain the programmable funding rail while a settlement partner converts to ACH, fiat or another provider-compatible payment method.

---

# 43. Q: How would you make money?

Answer:

> Patients should remain free. The sustainable business model is institutional infrastructure—hospital integrations, employer benefits, APIs, foundations and grants—while maintaining a nonprofit/public-good patient advocacy core.

---

# 44. Q: Can a hospital pay you?

Answer:

> Potentially for software infrastructure, but Althea's patient advocacy logic and Relief Fund governance need clear independence. The business model should never reward Althea for denying assistance.

---

# 45. Q: How big is the problem?

Answer:

> KFF estimated Americans owed at least $220 billion in medical debt in 2024. Althea doesn't claim all of that is preventable through charity care, but it demonstrates the scale of the affordability problem we're addressing.

---

# 46. Q: What happens after the hackathon?

Answer:

> First, expand structured FAP coverage and validate the workflow with patient advocates and financial counselors. Then establish the legal and nonprofit infrastructure required for a real Relief Fund. The long-term product becomes a national patient financial-assistance rail.

---

# 47. Q: What is the moat?

Answer:

> The moat is not the smart contract. It's a versioned structured dataset of hospital financial-assistance rules, the policy interpretation engine, patient workflow infrastructure, institutional relationships and the Relief Rail connecting verified hardship to charitable capital.

---

# 48. Q: What happens if AI interprets the policy incorrectly?

Answer:

> Every rule must map back to the source policy. If extraction confidence is inadequate or the schema cannot be validated, Althea returns “needs review” instead of guessing. The financial calculation never uses unvalidated free-form AI output.

---

# 49. Q: What is the biggest risk?

Answer:

> The biggest long-term risk is not technical. It's deploying financial assistance infrastructure in healthcare without adequate privacy and regulatory governance. That's why the hackathon uses fictional data and testnet funds, and why we separate patient navigation from the independent Relief Fund.

---

# 50. Backup Demo Strategy

Record the successful final transaction separately before the live presentation.

If a sandbox fails live:

Show:

* actual transaction hash;
* successful prior execution;
* code;
* architecture.

Do not pretend a failed live transaction succeeded.

---

# 51. Presenter Tone

Speak like:

* patient advocate;
* product founder;
* engineer.

Not:

* crypto trader;
* attorney;
* hospital critic.

The strongest tone is:

> This system is too complicated for patients, and modern technology can make it easier.

---

# 52. Words to Emphasize

Use:

* patient;
* assistance;
* verified;
* transparent;
* private;
* independent;
* relief;
* hospital policy;
* programmable;
* accountable.

---

# 53. Words to Minimize

Avoid repeatedly saying:

* Web3;
* crypto;
* token;
* decentralized;
* disruption;
* revolution;
* trustless.

Judges already know it is ETHGlobal.

Show the utility.

---

# 54. Exact Final Script

Recommended final 20 seconds:

> Althea does not tokenize the patient.

> We don't tokenize their debt.

> We use AI where interpretation helps, deterministic rules where fairness matters, privacy where patients need it, and blockchain only where charitable money benefits from public accountability.

Pause.

> The hospital already had the assistance program.

> Althea made it usable.

Screen:

# Althea

## Before the bill becomes debt.
