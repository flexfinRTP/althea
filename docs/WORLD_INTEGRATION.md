# World Selfie Check integration

World is used only as an Althea Relief abuse-prevention signal.

It is not used for hospital FAP access, eligibility, medical decisions, or identity as a patient.

## SDK

```text
@worldcoin/idkit 4.2.x
@worldcoin/idkit-core 4.2.x
selfieCheckLegacy
RP signatures: @worldcoin/idkit-core/signing
Verify: POST https://developer.world.org/api/v4/verify/{rp_id}
Widget: controlled open / onOpenChange
environment=staging until production credentials exist
```

Selfie Check is access-gated. Request access: `developers@toolsforhumanity.com`.

## Manual review

`Request Manual Review` is the documented non-automated path. Althea does not fake a Selfie Check proof.

## Failure copy

```text
We couldn't complete the liveness check.
Try again or request manual review.
```

## Feedback

`docs/world_feedback.md` records documentation-review notes from official docs. Sandbox runtime observations stay unmarked until a live test is run.
