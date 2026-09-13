# Althea Care — World Selfie Check Integration Feedback

## Important Submission Note

This document exists specifically to satisfy and exceed the ETHOnline 2026 World Selfie Check feedback requirement.

The final version must contain **real observations from the actual Althea implementation**.

Do not submit invented developer feedback.

Sections marked:

```text
[FILL AFTER INTEGRATION]
```

must be replaced with actual observations before submission.

---

# 1. Product Context

Althea is a patient financial-advocacy platform.

It helps patients:

* discover hospital Financial Assistance Policies;
* understand whether they may qualify;
* prepare the application process;
* track relevant timelines;
* record the hospital's determination.

Althea also includes a separate:

# Althea Relief Fund

This independent charitable fund may provide limited assistance toward a verified medical balance remaining after hospital financial assistance has been processed.

World Selfie Check is used only within this second layer.

---

# 2. Why Althea Uses Selfie Check

Althea Relief contains scarce charitable capital.

A malicious system could potentially attempt:

* automated Relief applications;
* scripted account creation;
* repeated fraudulent requests;
* fabricated applicant sessions.

Althea therefore wanted a low-friction signal that:

> a live human is actively participating in the Relief request.

Selfie Check is used as:

# an abuse-prevention signal.

It is not treated as:

* medical identity verification;
* hospital FAP eligibility;
* proof of financial need;
* proof of unique lifetime identity;
* proof that submitted financial records are legitimate;
* proof that somebody deserves healthcare.

---

# 3. Critical Product Boundary

Althea deliberately separates:

## Hospital Financial Assistance

World is not required.

The patient can:

* search the hospital;
* receive a policy estimate;
* review sources;
* prepare the application;
* track deadlines;

without Selfie Check.

## Althea Relief

World Selfie Check is one risk-control signal used before limited independently donated charitable funds are released.

This design matters because Althea does not want a biometric credential to become the gatekeeper to a patient's hospital financial-assistance rights.

---

# 4. User-Facing Explanation

Immediately before the World flow, Althea displays:

> Althea Relief is supported by limited charitable funds. We use World Selfie Check as one liveness signal to help reduce automated abuse of this separate fund.

And:

> This check does not determine your eligibility for your hospital's financial-assistance program.

Production Althea should additionally offer:

# Request Manual Review

for people who cannot or do not wish to complete Selfie Check.

---

# 5. Integration Environment

## Product

Althea

## Event

ETHOnline 2026

## Track

World — Selfie Check

## Application Environment

```text
[ENTER FINAL APPLICATION URL]
```

## Repository

```text
[ENTER FINAL REPOSITORY]
```

## World Application ID

Do not expose secrets.

Record only safe public identifier if appropriate:

```text
[FILL AFTER INTEGRATION]
```

## World Action

```text
Althea Relief anti-abuse check
```

## Environment Used

```text
World Sandbox
```

## SDK / Integration Version

```text
@worldcoin/idkit 4.2.x
@worldcoin/idkit-core 4.2.x
selfieCheckLegacy preset
POST https://developer.world.org/api/v4/verify/{rp_id}
RP signatures via @worldcoin/idkit-core/signing
```

## Date Tested

```text
[FILL AFTER INTEGRATION]
```

---

# 6. Integration Flow

The intended Althea flow is:

```text
Patient receives hospital decision
        ↓
Residual medical balance remains
        ↓
Patient requests Althea Relief
        ↓
Althea explains limited-fund rules
        ↓
Selfie Check
        ↓
World returns verification result
        ↓
Althea backend verifies result
        ↓
worldCheckStatus = PASSED
        ↓
Relief rules evaluate remaining signals
        ↓
grant route selected
```

World does not trigger money directly.

A successful World result is one input into the Relief rules system.

---

# 7. Data-Minimization Approach

Althea does not need to send World:

* hospital bill;
* income;
* diagnosis;
* treatment;
* hospital name;
* insurance information;
* FAP application;
* grant explanation.

World receives only the data required for the credential/proof flow.

Althea stores the minimum result necessary to associate successful verification with the internal Relief case.

Althea does not intentionally retain the selfie image.

---

# 8. Selfie Check Documentation Feedback

ETHOnline specifically asks for feedback about the Selfie Check documentation and integration flow.

## What Was Clear

```text
Official docs distinguish Selfie Check (device-camera liveness / facial similarity,
not a one-person-one-account guarantee) from Orb Proof of Human.
The React widget is a controlled component (open / onOpenChange), not a render-prop.
Backend verification is explicit: forward the IDKit payload as-is to
POST https://developer.world.org/api/v4/verify/{rp_id}.
RP signatures must be created server-side with the portal signing key.
Sandbox vs production is selected with environment="staging" for the simulator.
```

## What Was Unclear

```text
Selfie Check is documented as access-gated (email developers@toolsforhumanity.com).
The credentials page still points new Selfie Check integrations at selfieCheckLegacy
(World ID 3.0) while idkit-core also exports selfieCheck. Which preset ETHOnline
judges expect should be stated on the prize page, not only in SDK READMEs.
Nullifier storage guidance is written for uniqueness gating; Althea uses Selfie Check
only as a liveness/abuse signal, so the uniqueness model needs a sentence on the
Selfie Check page.
```

## Information We Had to Find Elsewhere

```text
ETHOnline prize language, IDKit SKILL.md, and the idkit-core README disagreed slightly
on preset names (selfieCheck vs selfieCheckLegacy). Circle/Arc and Privy docs were
not needed here; World Developer Portal search is where app_id / rp_id / signing_key live.
```

## Missing Example We Would Have Wanted

```text
A Next.js App Router example that signs RP requests in a Route Handler, opens
IDKitRequestWidget with selfieCheckLegacy, and posts the unmodified result to
/api/v4/verify/{rp_id}. Current snippets are split across integrate + credentials pages.
```

## Most Useful Documentation Section

```text
https://docs.world.org/world-id/idkit/integrate
https://docs.world.org/world-id/idkit/credentials
https://docs.world.org/world-id/sandbox/testing-selfie-check
```

---

# 9. Developer Portal Feedback

ETHOnline asks for feedback concerning:

* navigation;
* search;
* product discovery;
* debugging guidance.

## Navigation

```text
[FILL AFTER INTEGRATION]
```

Questions to answer:

* Could we find Selfie Check quickly?
* Was application configuration discoverable?
* Were Sandbox controls located where expected?
* Was terminology consistent between docs and portal?

## Search

```text
[FILL AFTER INTEGRATION]
```

Questions:

* Did searching "Selfie Check" find current material?
* Did search return outdated or irrelevant results?
* Could errors be searched by code?

## Product Discovery

```text
[FILL AFTER INTEGRATION]
```

Questions:

* Was it obvious Selfie Check was the appropriate product versus World ID / AgentKit?
* Was the distinction between assurance levels understandable?

## Debugging Guidance

```text
[FILL AFTER INTEGRATION]
```

Questions:

* Were common integration failures documented?
* Could developers identify whether failure occurred in client, Sandbox, backend verification, or configuration?

---

# 10. Sandbox Feedback

ETHOnline explicitly requests feedback on:

* Sandbox App states;
* proof flows;
* test users;
* errors;
* edge cases.

## Initial Setup

```text
[FILL AFTER INTEGRATION]
```

Record:

* number of steps;
* configuration required;
* unexpected blockers;
* access delays if any.

## Sandbox Application States

```text
[FILL AFTER INTEGRATION]
```

Document all states encountered.

For example:

```text
not started
pending
success
cancelled
failure
expired
```

Use only the real states observed.

## Proof Flow

```text
[FILL AFTER INTEGRATION]
```

Document:

1. what the frontend requested;
2. what the user saw;
3. what response returned;
4. how backend verification worked;
5. what was persisted.

## Test Users

```text
[FILL AFTER INTEGRATION]
```

Was it obvious how to:

* obtain a test identity;
* reset testing;
* repeat the flow;
* test multiple outcomes?

## Errors

```text
[FILL AFTER INTEGRATION]
```

Use the issue format below.

---

# 11. Issue Template

For each meaningful issue encountered:

## Issue: [NAME]

### Expected

```text
What we expected to occur.
```

### Actual

```text
What actually occurred.
```

### Environment

```text
Browser:
OS:
SDK:
World environment:
Althea environment:
```

### Steps to Reproduce

```text
1.
2.
3.
```

### Error

```text
Exact non-sensitive error message/code.
```

### Workaround

```text
What allowed development to continue.
```

### Suggested Improvement

```text
Specific documentation/SDK/portal improvement.
```

---

# 12. Edge Cases Tested

Test as many as possible.

Record actual results.

## User Cancels

Expected Althea response:

```text
Verification not completed.

Try Again

or

Request Manual Review
```

Actual:

```text
[FILL AFTER TEST]
```

## Camera Permission Denied

Expected:

Althea does not crash.

Actual:

```text
[FILL AFTER TEST]
```

## Verification Fails

Expected:

No Relief grant is automatically executed.

Actual:

```text
[FILL AFTER TEST]
```

## Verification Expires

Expected:

User can safely restart.

Actual:

```text
[FILL AFTER TEST]
```

## User Refreshes Mid-Flow

Expected:

No duplicate grant request.

Actual:

```text
[FILL AFTER TEST]
```

## User Attempts Repeat Relief Request

Expected:

Other Althea duplicate-risk controls still apply.

Selfie Check alone is not treated as sufficient duplicate prevention.

Actual:

```text
[FILL AFTER TEST]
```

---

# 13. User Experience Feedback

Although ETHOnline's current qualification language focuses heavily on developer feedback, Althea should additionally document the actual user experience.

## Comprehension

Question:

Did the user understand why Althea requested a selfie?

```text
[FILL AFTER USER TEST]
```

## Trust

Question:

Did the medical context make the request feel more sensitive?

```text
[FILL AFTER USER TEST]
```

## Friction

Question:

How many actions did the user take?

```text
[FILL AFTER USER TEST]
```

## Camera Flow

```text
[FILL AFTER USER TEST]
```

## Completion

```text
[FILL AFTER USER TEST]
```

## Confusion

```text
[FILL AFTER USER TEST]
```

---

# 14. Althea-Specific UX Finding to Evaluate

We specifically want to know whether the following explanation prevents the user from believing World controls their hospital financial assistance:

> Selfie Check protects only the Althea Relief Fund. It does not determine whether you qualify for your hospital's financial-assistance program.

Test whether users understand this distinction.

Result:

```text
[FILL AFTER USER TEST]
```

---

# 15. Why Selfie Check Instead of Generic Login?

Email authentication tells Althea:

> somebody controls this email session.

It does not provide the same liveness signal.

Selfie Check adds a stronger signal that:

> a live human is participating now.

This matters when distributing a limited charitable resource.

However, Althea intentionally treats that as:

# one signal.

Not absolute proof.

---

# 16. Why Althea Does Not Use World for Hospital Eligibility

Hospital FAP eligibility can involve:

* household income;
* household size;
* insurance;
* residency;
* service type;
* hospital-specific rules.

Selfie Check does not answer those questions.

Using it to determine hospital FAP eligibility would therefore be both technically inappropriate and ethically unnecessary.

---

# 17. Why Althea Does Not Claim Selfie Check Prevents All Fraud

Potential fraud can include:

* forged medical bills;
* manipulated hospital determinations;
* incorrect account information;
* duplicate cases using different documents.

A liveness credential does not solve all of those.

Althea therefore combines it with:

```text
hospital decision state

verified residual balance

case history

duplicate-risk rules

provider settlement verification

program limits
```

---

# 18. Privacy Feedback

Evaluate whether World documentation makes these questions easy for developers to answer:

* what biometric information is retained?
* by whom?
* for how long?
* what does the application receive?
* what should the developer store?
* what should the developer not store?
* what identifiers are stable/reusable?

Althea assessment:

```text
[FILL AFTER INTEGRATION]
```

---

# 19. What Worked Well

Complete after implementation.

Suggested categories:

```text
SDK ergonomics

documentation

Sandbox

response clarity

credential speed

mobile experience

backend verification

developer portal
```

Actual feedback:

```text
[FILL AFTER INTEGRATION]
```

---

# 20. What Was Hard

```text
[FILL AFTER INTEGRATION]
```

Be specific.

Bad:

> Docs were confusing.

Better:

> The documentation explained the client initiation clearly, but we had difficulty finding one consolidated example showing client initiation, backend verification, and Sandbox failure handling in the same flow.

Only say this if actually true.

---

# 21. What Was Missing

```text
[FILL AFTER INTEGRATION]
```

Possible categories:

* TypeScript end-to-end example;
* Sandbox error matrix;
* testing reset documentation;
* privacy/data-retention explanation;
* backend verification examples;
* framework-specific examples.

Use real observations.

---

# 22. What Was Broken

```text
[FILL AFTER INTEGRATION]
```

If nothing broke:

# No blocking defects encountered.

Do not invent bugs to make feedback seem more substantial.

---

# 23. What Was Hard to Test

```text
[FILL AFTER INTEGRATION]
```

This section is explicitly relevant to World's ETHOnline feedback requirements.

Potential questions:

* Could every error state be intentionally triggered?
* Could repeat-use behavior be tested?
* Was mobile camera testing easy?
* Could sandbox credentials be reset?
* Could the backend verifier be tested locally?

---

# 24. Suggested World Improvement

After implementation, provide at least three concrete suggestions.

## Suggestion 1

```text
[FILL]
```

## Suggestion 2

```text
[FILL]
```

## Suggestion 3

```text
[FILL]
```

---

# 25. Overall Integration Assessment

## Integration Difficulty

Choose one:

```text
Very Easy
Easy
Moderate
Difficult
Very Difficult
```

Final rating:

```text
[FILL]
```

## Time to First Successful Verification

```text
[FILL]
```

## Would Althea Continue Using Selfie Check?

```text
[FILL YES/NO + WHY]
```

---

# 26. Product Value Assessment

Complete after testing:

> Selfie Check was / was not sufficiently low-friction for Althea's intended use because...

```text
[FILL]
```

> The assurance provided was / was not useful for making a Althea Relief risk decision because...

```text
[FILL]
```

> The biggest product tradeoff was...

```text
[FILL]
```

---

# 27. Final Althea Position

Regardless of integration quality, Althea's intended policy is:

```text
Hospital financial-assistance access
NEVER requires Selfie Check.

Althea Relief standard path
may use Selfie Check.

Alternative manual review
should exist in production.
```

This keeps the credential in the role for which it is most appropriate:

# risk signal.

Not:

# healthcare gatekeeper.

---

# 28. Submission Checklist

Before committing final `WORLD_FEEDBACK.md`:

* [ ] Replace every `[FILL]`.
* [ ] Include actual SDK/version.
* [ ] Include actual test date.
* [ ] Include actual Sandbox observations.
* [ ] Include actual error states.
* [ ] Include documentation feedback.
* [ ] Include Developer Portal feedback.
* [ ] Include test-user feedback.
* [ ] Include edge-case testing.
* [ ] Include what was confusing.
* [ ] Include what was missing.
* [ ] Include anything broken.
* [ ] Include what was difficult to test.
* [ ] Include at least three actionable suggestions.
* [ ] Verify no secrets appear.
* [ ] Verify no real patient data appears.

---

# 29. Summary

Althea uses World Selfie Check for a narrow and intentional purpose:

> protecting a limited charitable medical-hardship fund from abuse while preserving unrestricted access to hospital financial-assistance navigation.

That separation is core to both Althea's product design and our evaluation of Selfie Check.

The final implementation feedback above documents whether the credential achieved that goal in practice.
