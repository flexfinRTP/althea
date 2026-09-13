# Althea Care — AI Development Disclosure

## 1. Purpose

ETHOnline 2026 permits the use of AI-assisted development tools.

ETHGlobal requires teams to disclose where and how AI tools contributed to the project.

ETHGlobal also requires developers using spec-driven development workflows to include the relevant:

* specification files;
* prompts;
* planning artifacts;

in the submission repository.

This document records Althea's AI-assisted development process.

It must be updated before final submission to reflect what actually occurred.

---

# 2. Development Principle

Althea uses AI as:

# an engineering and research assistant.

AI is not presented as:

# the autonomous creator of the entire project.

Human contributors remain responsible for:

* selecting the problem;
* product strategy;
* healthcare workflow decisions;
* sponsor selection;
* architecture;
* privacy boundaries;
* financial controls;
* integration choices;
* implementation decisions;
* debugging;
* validation;
* testing;
* presentation.

---

# 3. AI Tools Used

## ChatGPT

Used for:

* problem research;
* competitor research;
* healthcare financial-assistance research;
* ETHOnline prize research;
* product ideation;
* architecture planning;
* sponsor strategy;
* technical specification drafting;
* security/privacy planning;
* business positioning;
* demo design;
* documentation drafting;
* coding-harness planning.

Model/configuration used during planning:

```text
ChatGPT
GPT-5.6 Sol
```

Update if additional models/configurations are used.

---

# 4. Coding Assistant

## 4. Coding Assistant

```text
Tool:
Cursor (Grok 4.6)

Used for:
repository scaffolding
component generation
API implementation
smart contract suggestions
unit test generation
debugging
refactoring
documentation
spec-driven implementation from /docs
```

---

# 5. Spec-Driven Development

Althea is intentionally being developed from detailed specification artifacts.

These specifications were created before and during implementation to ensure the coding harness maintains:

* product boundaries;
* sponsor eligibility;
* healthcare privacy;
* deterministic financial logic;
* demo consistency.

Repository:

```text
/docs/
```

contains the specifications.

---

# 6. Specification Files

The following project specifications were AI-assisted but directed and reviewed by the human project team:

```text
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

DEPLOYMENTS.md
```

Additional coding prompts should be retained under:

```text
/docs/prompts/
```

or:

```text
/specs/
```

---

# 7. Product Ideation Disclosure

AI assisted in researching and comparing potential ETHOnline project concepts.

Human decisions included:

* selecting healthcare financial assistance as the final problem;
* choosing Althea over alternative concepts;
* deciding the project should be mission-first;
* choosing Privy + Arc + World as the three prize partners;
* preserving hospital decision authority;
* separating hospital FAP navigation from the Althea Relief Fund;
* rejecting tokenization of medical debt;
* rejecting patient-facing crypto complexity.

---

# 8. Research Disclosure

AI-assisted web research was used to investigate:

* Internal Revenue Code §501(r);
* hospital Financial Assistance Policies;
* IRS billing and collection guidance;
* CFPB medical-debt guidance;
* KFF medical-debt estimates;
* HHS OIG patient-assistance guidance;
* healthcare privacy;
* FTC Health Breach Notification rules;
* competitors;
* ETHGlobal sponsor requirements;
* recent ETHGlobal projects.

Human contributors are responsible for validating consequential claims before production use.

Althea's hackathon implementation is not a substitute for healthcare legal counsel.

---

# 9. Architecture Disclosure

AI assisted in producing architectural options.

Human-selected architecture:

```text
Hospital FAP
↓
structured extraction
↓
schema validation
↓
deterministic eligibility engine
↓
hospital decision
↓
verified residual balance
↓
World risk signal
↓
deterministic Relief rules
↓
Privy governance
↓
Circle Agent Stack orchestration
↓
Arc contract
↓
USDC settlement
```

Key human-directed constraints included:

* no PHI onchain;
* no AI final hospital eligibility decisions;
* no World gate for hospital FAP access;
* no unrestricted agent treasury;
* no medical debt tokenization;
* no donor patient selection.

---

# 10. AI-Assisted Code

Before submission, list every meaningful area where AI generated or substantially assisted code.

Example format:

## `/lib/fap/schema.ts`

AI contribution:

```text
Initial TypeScript/Zod schema scaffold.
```

Human contribution:

```text
Validated fields against product requirements,
removed unnecessary patient fields,
and tested structured policy parsing.
```

---

## `/lib/fap/calculate.ts`

AI contribution:

```text
Initial eligibility matching, discount arithmetic, and estimate reasons.
```

Human contribution:

```text
Frozen demo numbers ($15,950 / $2,470), 2026 FPL 186.7% for HH3, insured-eligible
demo policy, and “You may qualify” language. No invented eligibility.
```

---

## `/lib/fap/timeline.ts`

AI contribution:

```text
120/240 day arithmetic from first billing statement date.
```

Human contribution:

```text
Day 1 = first bill date. Demo reference 2026-09-13 → Day 24 of 240.
Educational copy only. No collection-ban claims.
```

---

## `/lib/relief/rules.ts`

AI contribution:

```text
Initial rules-engine scaffold and reason codes.
```

Human contribution:

```text
$500 exceeds $250 auto cap → human_review_required. World missing →
human review. Manual review + humanApproval can proceed. LLM cannot grant money.
```

---

## `/lib/relief/agent.ts`

AI contribution:

```text
Vercel AI SDK tool wrappers and sequential trace labels.
```

Human contribution:

```text
Tools limited to structured Relief facts. executeApprovedGrant requires Circle
wallet + ReliefPool + settlement address. No fake tx hashes.
```

---

## `/contracts/AltheaReliefPool.sol`

AI contribution:

```text
Initial OpenZeppelin Ownable/Pausable/ReentrancyGuard USDC pool scaffold.
```

Human contribution:

```text
Authorized executor, program cap required, one payout per caseHash, pause,
SafeERC20, interface file, deploy setProgramCap($500) and setAuthorizedExecutor.
```

Human validation should include:

* access-control review;
* duplicate payout test;
* cap enforcement;
* authorized executor test;
* pause behavior;
* USDC transfer behavior.

---

# 11. AI-Assisted UI

Record components generated or modified using AI.

```text
/app/check/page.tsx — intake form + Load Demo Case
/app/result/[caseId]/page.tsx — estimate + explainability drawer
/app/application/[caseId]/page.tsx — packet + print
/app/case/[caseId]/* — decision, relief, verify, agent trace, success
/app/fund/* — public stats and proof
/app/admin/treasury/page.tsx — Fund Relief Pool
/app/how/page.tsx — architecture
/app/policy/[hospitalId]/page.tsx — policy source
/components/bill/BillReduction.tsx — remaining-balance animation
/components/relief/AgentTrace.tsx — sequential checks
```

Human contribution: patient language, frozen demo numbers, accessibility, reduced-motion.

---

# 12. AI-Assisted Tests

If AI generates tests, say so.

Example:

```text
AI assisted in generating initial smart-contract unit-test cases and FAP/Relief
unit tests. Justin must run npm test and npm run contracts:test. Tests are not
a substitute for live World/Privy/Arc/Circle credentials.
```

Never imply:

> AI-generated test exists, therefore system is safe.

Tests must actually run.

---

# 13. AI-Assisted Visual Assets

If any visuals are generated using AI, document:

```text
asset
tool
purpose
human edits
```

If none:

```text
No AI-generated visual assets used.
```

Update before submission.

---

# 14. AI-Assisted Copy

AI assisted with:

* homepage language;
* demo narration;
* product positioning;
* README;
* documentation;
* disclaimers.

Human contributors determine final submitted language.

---

# 15. What AI Does Inside the Product

Althea itself may use AI during runtime for:

# hospital policy interpretation.

Potential runtime responsibilities:

* extract eligibility rules from public FAP text;
* classify policy sections;
* generate plain-language explanations.

Runtime AI should not:

* determine final hospital eligibility;
* make medical decisions;
* independently authorize charitable grants;
* choose which patient is more deserving;
* change program rules;
* move money directly.

---

# 16. Deterministic Financial Logic

The following should remain non-LLM logic:

```text
Federal Poverty Level calculation

policy threshold matching

discount arithmetic

deadline arithmetic

grant caps

duplicate payout protection

Relief decision thresholds

smart-contract authorization
```

This is deliberate.

Healthcare financial decisions require reproducibility.

---

# 17. AI Extraction Guardrails

Hospital policy documents are treated as:

# untrusted input.

They are not allowed to modify agent instructions.

AI extraction should use:

* fixed system prompt;
* structured output schema;
* validation;
* citations;
* failure-to-review path.

If extraction fails:

```text
NEEDS_REVIEW
```

not:

```text
best guess
```

---

# 18. AI Agent Guardrails

The Althea Relief Agent receives only structured data.

Example:

```text
fapCompleted = true

residualBalance = 2470

worldSignal = pass

grantLimit = 500

fundBalance = 25000

humanApproval = approved
```

It does not need:

* diagnosis;
* patient story;
* tax return;
* treatment history.

---

# 19. Agent Authority

The agent cannot:

```text
change grant rules

change program cap

change treasury ownership

add arbitrary settlement addresses

override duplicate protection

override Privy treasury policy

access unrestricted treasury funds
```

The agent operates inside preconfigured boundaries.

---

# 20. Human Contribution

Althea's human team is responsible for substantive decisions including:

* choosing the healthcare problem;
* project mission;
* competitor analysis interpretation;
* regulatory framing;
* product boundaries;
* user flow;
* sponsor selection;
* privacy strategy;
* Relief Fund philosophy;
* architecture selection;
* coding decisions;
* integration setup;
* configuration;
* debugging;
* test execution;
* deployment;
* demo recording;
* final presentation.

Update this section with individual team contributions if multiple builders participate.

---

# 21. Code Verification

Every AI-generated or AI-assisted code path included in the submitted application should be:

* reviewed;
* executed;
* tested;
* debugged;
* understood by the project team.

The team should be able to explain the implementation during judging.

---

# 22. Smart Contract Verification

AI assistance does not substitute for smart-contract review.

Althea's ETHOnline contract is:

# testnet prototype code.

Before real financial deployment it would require:

* security audit;
* threat model;
* deployment review;
* governance review.

---

# 23. Healthcare Research Verification

AI-assisted research is not treated as legal advice.

Primary sources should be preferred when making regulatory claims.

Relevant sources include:

* IRS;
* CFPB;
* HHS;
* FTC;
* KFF;
* ETHGlobal sponsor materials.

Production Althea would require specialized counsel.

---

# 24. Spec Artifact Preservation

Because Althea uses a spec-driven coding approach, all prompts and planning artifacts actually used to direct implementation should remain in version control.

Recommended directory:

```text
/docs/specs/
```

and:

```text
/docs/prompts/
```

Do not delete these before submission simply because they look messy.

ETHGlobal specifically wants judges to see how AI was directed.

---

# 25. Prompt Logging

For major coding tasks, preserve prompts such as:

```text
001_scaffold.md

002_fap_schema.md

003_eligibility_engine.md

004_world_integration.md

005_relief_contract.md

006_privy_treasury.md

007_circle_agent.md

008_arc_execution.md

009_demo_polish.md
```

Each file can contain:

```text
Goal

Constraints

Prompt

Result

Human changes
```

---

# 26. Example Prompt Log

```text
# Prompt 005 — Althea ReliefPool

Goal:
Implement the Arc ReliefPool contract from TECH_ARCHITECTURE.md.

Constraints:
- no patient PII
- USDC only
- randomized case hash
- one payment per case hash
- program cap
- authorized executor
- pausable
- OpenZeppelin
- unit tests required

AI output:
Initial contract implementation.

Human review:
Added program status validation,
changed owner permissions,
added duplicate payout test,
verified USDC decimals,
deployed to Arc testnet.
```

This is excellent ETHGlobal evidence.

---

# 27. Reused Code / Libraries

Document all meaningful reused libraries and starter kits.

Examples:

```text
Next.js

React

OpenZeppelin

Privy SDK

World SDK

Circle Agent Stack starter materials

viem

Zod

Tailwind
```

Using open-source libraries is permitted.

Be transparent.

---

# 28. Pre-Existing Project Work

Althea is intended for ETHOnline's:

# Start Fresh / Classic Track.

Therefore project-specific code, designs, and assets submitted for prize eligibility must comply with ETHGlobal's From Scratch rules.

Planning/research should be handled according to event rules, and any reused public starter kits or libraries must be disclosed.

If any Althea-specific code existed before the event start:

# flag it immediately.

Do not conceal it.

---

# 29. Repository History

ETHGlobal expects version-control history demonstrating development during the event.

Avoid:

```text
one giant final commit
```

Prefer incremental commits reflecting real work.

---

# 30. Final Submission Disclosure Template

Use something similar in the ETHGlobal submission:

> We used AI-assisted development tools including ChatGPT and [coding assistant]. AI helped with research, product specifications, code scaffolding, documentation, test suggestions, and debugging. The team made the core product, architecture, sponsor-integration, privacy, and financial-control decisions; reviewed and tested the submitted implementation; and performed the actual integration and deployment work. Because we used a spec-driven workflow, our repository includes the planning documents and prompts used to direct AI development.

Update the tool names.

---

# 31. File-Level Disclosure Checklist

Before submission:

* [x] document ChatGPT use;
* [x] document coding assistant (Cursor / Grok 4.6);
* [x] identify AI-assisted smart contract;
* [x] identify AI-assisted backend;
* [x] identify AI-assisted frontend;
* [x] identify AI-assisted tests;
* [x] identify AI-generated assets (none);
* [x] identify AI-assisted copy;
* [x] preserve specs;
* [x] preserve prompts;
* [x] disclose starter kits;
* [x] disclose reused libraries;
* [ ] ensure meaningful human contribution is clear to the submitting team;
* [ ] ensure team understands all core code.

---

# 32. Final Statement

Althea uses AI to accelerate research and development.

It does not outsource responsibility to AI.

The team remains responsible for:

# what Althea does,

# what Althea claims,

# how Althea protects patients,

# and how Althea moves money.
