# CareZero — Data Model & API Contract

## 1. Purpose

This document defines the application data model, API boundaries, service responsibilities, validation requirements, and privacy constraints for the CareZero MVP.

The goal is to let a coding harness or engineering team implement the application without re-interpreting the product architecture.

The core product flow remains:

```text
Hospital bill
↓
FAP policy
↓
Potential eligibility estimate
↓
Application preparation
↓
Hospital decision
↓
Verified residual balance
↓
CareZero Relief request
↓
World Selfie Check
↓
Relief rules
↓
Privy-controlled approval
↓
Circle Relief Agent
↓
Arc USDC settlement
↓
Final bill reduction
```

The architecture must preserve one central principle:

# AI interprets policy.

# Deterministic code calculates.

# The hospital decides.

# The Relief Fund applies its own rules.

# Blockchain moves charitable money.

---

# 2. Data Classification

Every field must be categorized before implementation.

## PUBLIC

Safe to expose publicly.

Examples:

* hospital name;
* public FAP URL;
* policy effective date;
* general eligibility thresholds;
* public program statistics;
* Arc transaction hash;
* aggregated Relief Fund statistics.

## INTERNAL

Operational but not necessarily sensitive.

Examples:

* case UUID;
* case status;
* policy version ID;
* internal program ID;
* decision version;
* job status.

## SENSITIVE

Requires strong access controls.

Examples:

* household income;
* bill amount;
* insurance status;
* hospital account reference;
* application status;
* requested grant amount;
* hospital determination amount.

## HIGHLY SENSITIVE

Should be avoided unless required.

Examples:

* diagnosis;
* medical record;
* SSN;
* tax returns;
* pay stubs;
* uploaded medical bill;
* World biometric data.

The MVP should avoid collecting HIGHLY SENSITIVE data entirely.

---

# 3. Core Entities

CareZero requires these primary entities:

```text
User
Hospital
FapDocument
FapPolicyVersion
Case
CaseFinancialInput
EligibilityEstimate
ApplicationPacket
HospitalDecision
ReliefProgram
ReliefRequest
WorldVerification
ReliefDecision
Grant
TreasuryTransaction
AuditEvent
```

---

# 4. User Model

```ts
type User = {
  id: string;

  role:
    | "patient"
    | "advocate"
    | "relief_reviewer"
    | "program_admin"
    | "treasury_admin"
    | "auditor";

  email?: string;

  createdAt: string;
  updatedAt: string;
};
```

Do not store wallet address as the primary patient identity.

Patients should be able to use CareZero without understanding or managing blockchain wallets.

---

# 5. Hospital Model

```ts
type Hospital = {
  id: string;

  name: string;
  systemName?: string;

  address?: {
    city?: string;
    state?: string;
    country?: string;
  };

  organizationType?:
    | "nonprofit"
    | "public"
    | "for_profit"
    | "unknown";

  fapLandingPageUrl?: string;

  applicationUrl?: string;

  activePolicyVersionId?: string;

  createdAt: string;
  updatedAt: string;
};
```

For the ETHOnline MVP:

Use:

```text
Example Medical Center
```

as the polished fictional hospital.

Optional:

Add one real public hospital policy as a secondary example.

---

# 6. FAP Document Model

```ts
type FapDocument = {
  id: string;

  hospitalId: string;

  title: string;

  sourceUrl?: string;

  sourceType:
    | "pdf"
    | "html"
    | "manual_fixture";

  effectiveDate?: string;

  fileHash?: string;

  ingestionStatus:
    | "pending"
    | "processing"
    | "parsed"
    | "needs_review"
    | "approved";

  createdAt: string;
};
```

---

# 7. FAP Policy Version Model

```ts
type FapPolicyVersion = {
  id: string;

  hospitalId: string;
  documentId: string;

  versionLabel: string;

  effectiveDate?: string;

  structuredPolicy: FapPolicy;

  validationStatus:
    | "draft"
    | "machine_validated"
    | "human_reviewed"
    | "approved";

  reviewedBy?: string;

  createdAt: string;
  updatedAt: string;
};
```

---

# 8. FAP Policy Schema

```ts
type FapPolicy = {
  hospitalName: string;

  policyScope: {
    emergencyCare?: boolean;
    medicallyNecessaryCare?: boolean;
    insuredPatientsEligible?: boolean | "conditional";
  };

  freeCareRules: AssistanceRule[];

  discountedCareRules: AssistanceRule[];

  residency?: {
    required: boolean;
    allowedStates?: string[];
    description?: string;
  };

  assets?: {
    evaluated: boolean;
    description?: string;
  };

  householdDefinition?: string;

  requiredDocuments: RequiredDocument[];

  applicationMethods: ApplicationMethod[];

  applicationUrl?: string;

  billingOffice?: {
    phone?: string;
    email?: string;
    address?: string;
  };

  collectionsSummary?: string;

  notes?: string[];

  citations: PolicyCitation[];
};
```

---

# 9. Assistance Rule Model

```ts
type AssistanceRule = {
  id: string;

  minFplPercent?: number;
  maxFplPercent?: number;

  assistanceType:
    | "free"
    | "percentage_discount"
    | "amount_limit"
    | "amounts_generally_billed"
    | "custom";

  discountPercent?: number;

  customDescription?: string;

  conditions?: RuleCondition[];

  citationIds: string[];
};
```

---

# 10. Rule Condition Model

```ts
type RuleCondition = {
  field:
    | "insurance_status"
    | "residency"
    | "asset_test"
    | "service_type"
    | "other";

  operator:
    | "equals"
    | "not_equals"
    | "in"
    | "not_in"
    | "requires_review";

  value: string | string[] | boolean;
};
```

---

# 11. Required Document Model

```ts
type RequiredDocument = {
  id: string;

  type:
    | "proof_of_income"
    | "pay_stub"
    | "tax_return"
    | "proof_of_residency"
    | "insurance_document"
    | "hospital_bill"
    | "application_form"
    | "other";

  required: boolean;

  description: string;

  citationIds: string[];
};
```

---

# 12. Policy Citation Model

```ts
type PolicyCitation = {
  id: string;

  documentId: string;

  page?: number;

  section?: string;

  shortExcerpt?: string;
};
```

Do not store long copied policy passages unless necessary.

---

# 13. Case Model

```ts
type Case = {
  id: string;

  userId?: string;

  hospitalId: string;

  status:
    | "draft"
    | "fap_analyzed"
    | "application_prepared"
    | "application_submitted"
    | "hospital_review"
    | "hospital_approved"
    | "hospital_denied"
    | "residual_verified"
    | "relief_requested"
    | "world_check_complete"
    | "relief_evaluated"
    | "relief_review"
    | "relief_approved"
    | "relief_denied"
    | "grant_executed"
    | "closed";

  createdAt: string;
  updatedAt: string;
};
```

---

# 14. Case Financial Input Model

Keep sensitive financial inputs separate from general case metadata.

```ts
type CaseFinancialInput = {
  caseId: string;

  billAmount: number;

  householdSize: number;

  householdAnnualIncome: number;

  insuranceStatus:
    | "insured"
    | "uninsured";

  firstPostDischargeBillDate?: string;

  state?: string;

  residencyAnswers?: Record<string, unknown>;

  additionalPolicyInputs?: Record<string, unknown>;
};
```

---

# 15. FPL Model

```ts
type FplGuideline = {
  year: number;

  jurisdiction:
    | "contiguous_us"
    | "alaska"
    | "hawaii";

  householdSize: number;

  annualGuidelineAmount: number;
};
```

Function:

```ts
calculateFplPercent(
  householdIncome,
  householdSize,
  jurisdiction,
  guidelineYear
)
```

Returns:

```ts
number
```

Example:

```text
265.4
```

meaning:

```text
265.4% FPL
```

---

# 16. Eligibility Estimate Model

```ts
type EligibilityEstimate = {
  id: string;

  caseId: string;

  policyVersionId: string;

  fplPercent?: number;

  outcome:
    | "potentially_eligible"
    | "potentially_ineligible"
    | "needs_more_information";

  estimatedAssistance?: number;

  estimatedRemaining?: number;

  matchedRuleIds: string[];

  assumptions: string[];

  reasons: string[];

  citationIds: string[];

  calculatedAt: string;
};
```

---

# 17. Required Estimate Disclaimer

Every estimate object should have or map to:

```text
This estimate is based on the hospital's published Financial Assistance Policy and the information entered. The hospital makes the final eligibility and assistance determination.
```

---

# 18. Regulatory Timeline Model

```ts
type RegulatoryTimeline = {
  caseId: string;

  firstBillingDate?: string;

  notificationPeriodDay?: number;

  applicationPeriodDay?: number;

  approximateNotificationPeriodEnd?: string;

  approximateApplicationPeriodEnd?: string;

  status:
    | "date_missing"
    | "within_notification_period"
    | "within_application_period"
    | "beyond_240_days";

  messages: string[];
};
```

Never calculate legal rights solely from this object.

It is educational guidance.

---

# 19. Application Packet Model

```ts
type ApplicationPacket = {
  id: string;

  caseId: string;

  policyVersionId: string;

  status:
    | "prepared"
    | "submitted"
    | "needs_documents";

  applicationUrl?: string;

  submissionInstructions: string[];

  requiredDocuments: RequiredDocument[];

  generatedFields: Record<string, string>;

  generatedAt: string;

  submittedAt?: string;
};
```

---

# 20. Hospital Decision Model

```ts
type HospitalDecision = {
  id: string;

  caseId: string;

  status:
    | "approved"
    | "partially_approved"
    | "denied";

  originalBalance: number;

  approvedAssistance: number;

  remainingBalance: number;

  source:
    | "simulated_demo"
    | "patient_uploaded"
    | "hospital_api"
    | "manual_verified";

  verified: boolean;

  createdAt: string;
};
```

For ETHOnline:

```text
source = simulated_demo
verified = true-for-demo-flow only
```

UI must display:

# Simulated Hospital Decision

---

# 21. Relief Program Model

```ts
type ReliefProgram = {
  id: string;

  name: string;

  status:
    | "active"
    | "paused"
    | "closed";

  currency:
    | "USDC";

  minGrant?: number;

  maxGrant: number;

  autoApprovalCap: number;

  humanApprovalThreshold: number;

  quorumThreshold?: number;

  requiresWorldCheck: boolean;

  requiresFapCompletion: boolean;

  requiresVerifiedResidual: boolean;

  createdAt: string;
  updatedAt: string;
};
```

ETHOnline demo fixture:

```text
Name:
CareZero General Medical Hardship Fund

Max Grant:
$500

Auto Approval:
$250

Human Review:
$251-$1,000

World:
Required for normal relief path
```

---

# 22. Relief Request Model

```ts
type ReliefRequest = {
  id: string;

  caseId: string;

  programId: string;

  requestedAmount: number;

  residualBalance: number;

  status:
    | "pending"
    | "awaiting_world"
    | "evaluating"
    | "review_required"
    | "approved"
    | "denied"
    | "executing"
    | "executed";

  createdAt: string;
  updatedAt: string;
};
```

---

# 23. World Verification Model

```ts
type WorldVerification = {
  id: string;

  caseId: string;

  status:
    | "not_started"
    | "pending"
    | "passed"
    | "failed"
    | "manual_review";

  verificationReference?: string;

  verifiedAt?: string;

  createdAt: string;
};
```

Do not store:

* selfie;
* image;
* raw biometric information.

---

# 24. Relief Decision Model

```ts
type ReliefDecision = {
  id: string;

  reliefRequestId: string;

  decision:
    | "auto_approved"
    | "human_review_required"
    | "approved"
    | "denied";

  calculatedGrantAmount: number;

  reasonCodes: ReliefReasonCode[];

  rulesVersion: string;

  approvedBy?: string;

  createdAt: string;
};
```

---

# 25. Relief Reason Codes

```ts
type ReliefReasonCode =
  | "FAP_COMPLETED"
  | "RESIDUAL_BALANCE_VERIFIED"
  | "WORLD_CHECK_PASSED"
  | "LOW_DUPLICATE_RISK"
  | "WITHIN_PROGRAM_CAP"
  | "FUNDS_AVAILABLE"
  | "HUMAN_APPROVAL_REQUIRED"
  | "FAP_NOT_COMPLETED"
  | "RESIDUAL_NOT_VERIFIED"
  | "WORLD_CHECK_MISSING"
  | "DUPLICATE_RISK"
  | "PROGRAM_LIMIT_EXCEEDED"
  | "INSUFFICIENT_FUNDS";
```

---

# 26. Grant Model

```ts
type Grant = {
  id: string;

  reliefRequestId: string;

  caseHash: string;

  programId: string;

  amount: number;

  currency: "USDC";

  providerSettlementAddress: string;

  decisionHash: string;

  status:
    | "prepared"
    | "submitted"
    | "confirmed"
    | "failed";

  arcTransactionHash?: string;

  submittedAt?: string;
  confirmedAt?: string;
};
```

---

# 27. Treasury Transaction Model

```ts
type TreasuryTransaction = {
  id: string;

  type:
    | "fund_relief_pool"
    | "grant_release"
    | "refund"
    | "admin_transfer";

  amount: number;

  currency: "USDC";

  sourceAddress?: string;

  destinationAddress: string;

  chain: "arc";

  transactionHash?: string;

  status:
    | "pending"
    | "confirmed"
    | "failed";

  initiatedBy: string;

  createdAt: string;
};
```

---

# 28. Audit Event Model

```ts
type AuditEvent = {
  id: string;

  caseId?: string;

  actorType:
    | "patient"
    | "staff"
    | "system"
    | "agent"
    | "blockchain";

  actorId?: string;

  eventType: string;

  metadata?: Record<string, unknown>;

  createdAt: string;
};
```

Never put raw patient documents in metadata.

---

# 29. Audit Events

Recommended events:

```text
CASE_CREATED

FAP_SELECTED

FAP_PARSED

ESTIMATE_CALCULATED

APPLICATION_PREPARED

APPLICATION_MARKED_SUBMITTED

HOSPITAL_DECISION_RECORDED

RESIDUAL_BALANCE_VERIFIED

RELIEF_REQUEST_CREATED

WORLD_CHECK_STARTED

WORLD_CHECK_PASSED

RELIEF_RULES_EVALUATED

RELIEF_HUMAN_APPROVED

RELIEF_AUTO_APPROVED

GRANT_PREPARED

ARC_TRANSACTION_SUBMITTED

ARC_TRANSACTION_CONFIRMED

CASE_CLOSED
```

---

# 30. PostgreSQL Table Outline

## users

```sql
id
role
email
created_at
updated_at
```

## hospitals

```sql
id
name
system_name
city
state
organization_type
fap_landing_page_url
application_url
active_policy_version_id
created_at
updated_at
```

## fap_documents

```sql
id
hospital_id
title
source_url
source_type
effective_date
file_hash
ingestion_status
created_at
```

## fap_policy_versions

```sql
id
hospital_id
document_id
version_label
effective_date
structured_policy_json
validation_status
reviewed_by
created_at
updated_at
```

## cases

```sql
id
user_id
hospital_id
status
created_at
updated_at
```

## case_financial_inputs

```sql
case_id
bill_amount
household_size
household_annual_income
insurance_status
first_post_discharge_bill_date
state
additional_policy_inputs_json
```

## eligibility_estimates

```sql
id
case_id
policy_version_id
fpl_percent
outcome
estimated_assistance
estimated_remaining
matched_rule_ids_json
assumptions_json
reasons_json
citation_ids_json
calculated_at
```

## application_packets

```sql
id
case_id
policy_version_id
status
application_url
submission_instructions_json
required_documents_json
generated_fields_json
generated_at
submitted_at
```

## hospital_decisions

```sql
id
case_id
status
original_balance
approved_assistance
remaining_balance
source
verified
created_at
```

## relief_programs

```sql
id
name
status
currency
max_grant
auto_approval_cap
human_approval_threshold
quorum_threshold
requires_world_check
requires_fap_completion
requires_verified_residual
created_at
updated_at
```

## relief_requests

```sql
id
case_id
program_id
requested_amount
residual_balance
status
created_at
updated_at
```

## world_verifications

```sql
id
case_id
status
verification_reference
verified_at
created_at
```

## relief_decisions

```sql
id
relief_request_id
decision
calculated_grant_amount
reason_codes_json
rules_version
approved_by
created_at
```

## grants

```sql
id
relief_request_id
case_hash
program_id
amount
currency
provider_settlement_address
decision_hash
status
arc_transaction_hash
submitted_at
confirmed_at
```

## treasury_transactions

```sql
id
type
amount
currency
source_address
destination_address
chain
transaction_hash
status
initiated_by
created_at
```

## audit_events

```sql
id
case_id
actor_type
actor_id
event_type
metadata_json
created_at
```

---

# 31. API Principles

All APIs should:

* validate request bodies using Zod;
* return structured error codes;
* never return internal stack traces;
* enforce authentication where required;
* enforce authorization;
* avoid exposing PII in URLs;
* avoid patient data in query strings;
* log privacy-safe metadata only.

---

# 32. API Error Envelope

```json
{
  "error": {
    "code": "INVALID_HOUSEHOLD_SIZE",
    "message": "Household size must be at least 1."
  }
}
```

For unexpected errors:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong."
  }
}
```

Log the detailed error internally.

---

# 33. Hospital Search API

## GET `/api/hospitals`

Query:

```text
search
state
```

Example:

```text
/api/hospitals?search=example
```

Response:

```json
{
  "hospitals": [
    {
      "id": "hosp_demo_001",
      "name": "Example Medical Center",
      "state": "MO",
      "organizationType": "nonprofit"
    }
  ]
}
```

---

# 34. Hospital Detail API

## GET `/api/hospitals/:hospitalId`

Returns:

```json
{
  "id": "hosp_demo_001",
  "name": "Example Medical Center",
  "state": "MO",
  "fapLandingPageUrl": "...",
  "applicationUrl": "...",
  "activePolicyVersionId": "fap_demo_2026"
}
```

---

# 35. FAP API

## GET `/api/hospitals/:hospitalId/fap`

Returns structured policy summary.

Do not return hidden administrative notes.

Response:

```json
{
  "hospitalId": "hosp_demo_001",
  "policyVersion": "2026-demo",
  "insuredPatientsEligible": true,
  "freeCareRules": [...],
  "discountedCareRules": [...],
  "requiredDocuments": [...],
  "applicationUrl": "...",
  "citations": [...]
}
```

---

# 36. Create Case API

## POST `/api/cases`

Request:

```json
{
  "hospitalId": "hosp_demo_001",
  "billAmount": 18420,
  "householdSize": 3,
  "householdAnnualIncome": 51000,
  "insuranceStatus": "insured",
  "firstPostDischargeBillDate": "2026-08-20"
}
```

Response:

```json
{
  "caseId": "case_demo_001",
  "status": "draft"
}
```

---

# 37. Calculate Estimate API

## POST `/api/cases/:caseId/estimate`

Server:

1. retrieves case;
2. retrieves active policy;
3. retrieves FPL table;
4. calculates FPL percentage;
5. evaluates deterministic rules;
6. stores estimate;
7. returns result.

Response:

```json
{
  "outcome": "potentially_eligible",
  "estimatedAssistance": 15950,
  "estimatedRemaining": 2470,
  "fplPercent": 265,
  "reasons": [
    "Household income appears to fall within the hospital's published discounted-care range."
  ],
  "disclaimer": "The hospital makes the final eligibility and assistance determination."
}
```

---

# 38. Regulatory Timeline API

## GET `/api/cases/:caseId/timeline`

Response:

```json
{
  "notificationPeriodDay": 24,
  "applicationPeriodDay": 24,
  "status": "within_notification_period",
  "messages": [
    "Based on the date entered, you appear to be within the federal 240-day FAP application period described by IRS regulations for applicable nonprofit hospitals."
  ]
}
```

---

# 39. Application Packet API

## POST `/api/cases/:caseId/application-packet`

Response:

```json
{
  "applicationPacketId": "app_001",
  "status": "prepared",
  "requiredDocuments": [
    {
      "type": "proof_of_income",
      "description": "Recent proof of household income"
    }
  ],
  "submissionInstructions": [
    "Complete the hospital's application.",
    "Attach required financial documentation.",
    "Submit using the hospital's listed method."
  ]
}
```

---

# 40. Mark Application Submitted

## POST `/api/cases/:caseId/mark-submitted`

Request:

```json
{
  "submittedAt": "2026-09-13T10:30:00-05:00"
}
```

Result:

```json
{
  "status": "application_submitted"
}
```

---

# 41. Demo Hospital Decision API

## POST `/api/demo/cases/:caseId/hospital-decision`

Request:

```json
{
  "status": "approved",
  "approvedAssistance": 15950,
  "remainingBalance": 2470
}
```

Server automatically sets:

```text
source = simulated_demo
```

Response:

```json
{
  "decisionId": "decision_001",
  "status": "approved",
  "originalBalance": 18420,
  "approvedAssistance": 15950,
  "remainingBalance": 2470,
  "source": "simulated_demo"
}
```

---

# 42. Relief Request API

## POST `/api/cases/:caseId/relief-request`

Request:

```json
{
  "programId": "cz_general_v1",
  "requestedAmount": 500
}
```

Validation:

* hospital decision exists;
* remaining balance > 0;
* program exists;
* request <= residual balance.

Response:

```json
{
  "reliefRequestId": "relief_001",
  "status": "awaiting_world"
}
```

---

# 43. World Verification API

## POST `/api/world/verify`

Input should be based on the exact integration contract required by World's SDK/API.

Internally map the successful result to:

```json
{
  "caseId": "case_demo_001",
  "status": "passed",
  "verifiedAt": "..."
}
```

Failure:

```json
{
  "caseId": "case_demo_001",
  "status": "failed"
}
```

Manual fallback:

```json
{
  "caseId": "case_demo_001",
  "status": "manual_review"
}
```

---

# 44. Evaluate Relief API

## POST `/api/relief/:reliefRequestId/evaluate`

Server gathers:

* hospital decision;
* residual;
* World check;
* duplicate risk;
* Relief Fund balance;
* program limits.

Returns:

```json
{
  "decision": "human_review_required",
  "calculatedGrantAmount": 500,
  "reasonCodes": [
    "FAP_COMPLETED",
    "RESIDUAL_BALANCE_VERIFIED",
    "WORLD_CHECK_PASSED",
    "WITHIN_PROGRAM_CAP",
    "FUNDS_AVAILABLE",
    "HUMAN_APPROVAL_REQUIRED"
  ]
}
```

---

# 45. Human Approval API

## POST `/api/relief/:reliefRequestId/approve`

Requires reviewer role.

Request:

```json
{
  "approvedAmount": 500
}
```

Response:

```json
{
  "status": "approved",
  "approvedAmount": 500
}
```

This approval should connect to the intended Privy-controlled flow rather than merely updating a database.

---

# 46. Execute Grant API

## POST `/api/relief/:reliefRequestId/execute`

Backend checks:

* Relief request approved;
* case hash generated;
* provider address verified;
* not already executed;
* program active;
* pool balance sufficient.

Then triggers Circle Agent Stack.

Response before confirmation:

```json
{
  "status": "submitted",
  "transactionHash": "0x..."
}
```

After confirmation:

```json
{
  "status": "confirmed",
  "transactionHash": "0x...",
  "grantAmount": 500
}
```

---

# 47. Treasury Balance API

## GET `/api/treasury/balance`

Response:

```json
{
  "treasury": {
    "usdc": 25000
  },
  "reliefPool": {
    "usdc": 5000
  }
}
```

Use actual onchain reads where feasible.

---

# 48. Fund Relief Pool API

## POST `/api/treasury/fund-relief-pool`

Requires treasury-admin permission.

Request:

```json
{
  "amount": 1000
}
```

Privy flow should:

1. validate wallet policy;
2. sign authorized transaction;
3. send USDC;
4. store transaction hash.

---

# 49. Public Relief Stats API

## GET `/api/public/relief-stats`

Response:

```json
{
  "totalContributed": 25000,
  "totalReliefDelivered": 8250,
  "grantsCompleted": 31,
  "averageGrant": 266,
  "platformGrantFeePercent": 0
}
```

No patient-level identifying fields.

---

# 50. Relief Grant Public Proof API

## GET `/api/public/grants/:grantId`

Response:

```json
{
  "program": "CareZero General Medical Hardship Fund",
  "amount": 500,
  "status": "confirmed",
  "transactionHash": "0x...",
  "timestamp": "..."
}
```

No hospital, city, diagnosis, patient name, income, or exact original bill.

---

# 51. Agent Tool Definitions

The Circle Agent Stack layer should expose narrow tools.

## `getCaseReliefFacts`

Input:

```json
{
  "caseId": "case_demo_001"
}
```

Output:

```json
{
  "fapCompleted": true,
  "residualBalanceVerified": true,
  "residualBalance": 2470,
  "worldStatus": "passed",
  "duplicateRisk": "low"
}
```

## `getProgramRules`

Output:

```json
{
  "programId": "cz_general_v1",
  "maxGrant": 500,
  "autoApprovalCap": 250
}
```

## `getPoolBalance`

Output:

```json
{
  "availableUsdc": 25000
}
```

## `evaluateReliefRequest`

Returns deterministic result.

## `executeGrant`

Can only run after authorization.

---

# 52. Agent Must Not Receive

Do not pass the agent:

* diagnosis;
* treatment details;
* tax returns;
* patient narrative;
* long free-form uploads.

Agent only needs structured relief facts.

---

# 53. Smart Contract Interface

Recommended Solidity interface:

```solidity
interface ICareZeroReliefPool {
    event GrantReleased(
        bytes32 indexed caseHash,
        bytes32 indexed programId,
        address indexed provider,
        uint256 amount,
        bytes32 decisionHash
    );

    function deposit(uint256 amount) external;

    function releaseGrant(
        bytes32 caseHash,
        bytes32 programId,
        address provider,
        uint256 amount,
        bytes32 decisionHash
    ) external;

    function setProgramCap(
        bytes32 programId,
        uint256 maxGrantAmount
    ) external;

    function setAuthorizedExecutor(
        address executor,
        bool authorized
    ) external;

    function pause() external;

    function unpause() external;
}
```

---

# 54. Smart Contract Events

Required:

```solidity
event PoolFunded(
  address indexed funder,
  uint256 amount
);

event GrantReleased(
  bytes32 indexed caseHash,
  bytes32 indexed programId,
  address indexed provider,
  uint256 amount,
  bytes32 decisionHash
);

event ExecutorUpdated(
  address indexed executor,
  bool authorized
);

event ProgramCapUpdated(
  bytes32 indexed programId,
  uint256 cap
);
```

---

# 55. Contract Tests

Minimum tests:

```text
deposit works
grant release works
unauthorized executor rejected
duplicate case rejected
grant > cap rejected
zero provider rejected
insufficient balance rejected
paused contract rejects release
unpause restores operation
grant event emitted
correct provider receives USDC
```

---

# 56. API Authorization Matrix

| Endpoint            | Patient |     Reviewer | Program Admin | Treasury Admin |
| ------------------- | ------: | -----------: | ------------: | -------------: |
| Create Case         |       ✓ |              |               |                |
| View Own Case       |       ✓ |    delegated |               |                |
| Calculate Estimate  |       ✓ |              |               |                |
| Prepare Application |       ✓ |              |               |                |
| Request Relief      |       ✓ |              |               |                |
| World Verify        |       ✓ |              |               |                |
| Evaluate Relief     |         |            ✓ |             ✓ |                |
| Approve Relief      |         |            ✓ |             ✓ |                |
| Execute Grant       |         | system/agent |             ✓ |                |
| Fund Relief Pool    |         |              |               |              ✓ |
| Change Program Rule |         |              |             ✓ |                |
| View Treasury       |         |              |             ✓ |              ✓ |

---

# 57. Idempotency

Financial APIs must support idempotency.

Especially:

```text
POST /api/relief/:id/execute
```

Use:

```text
Idempotency-Key
```

or internal execution ID.

A user double-click must not create two grants.

Contract-level case hash protection is an additional defense.

---

# 58. Demo Fixtures

Create:

```text
/data/demo/example-medical-center.json
```

with:

```json
{
  "hospital": "Example Medical Center",
  "billAmount": 18420,
  "householdSize": 3,
  "income": 51000,
  "insuranceStatus": "insured",
  "estimatedAssistance": 15950,
  "estimatedRemaining": 2470,
  "finalHospitalAssistance": 15950,
  "reliefGrant": 500,
  "finalRemaining": 1970
}
```

This ensures demo consistency.

---

# 59. Demo Provider Wallet

Environment:

```text
DEMO_PROVIDER_SETTLEMENT_ADDRESS
```

UI:

> Example Medical Center Demo Settlement Account

Do not label it as a real hospital crypto account.

---

# 60. Environment Variables

Suggested:

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

# 61. Demo Mode

Implement:

```text
DEMO_MODE=true
```

When true:

* only fictional patients;
* simulated hospital decisions enabled;
* testnet wallets;
* test USDC;
* visible demo labels.

This reduces accidental misrepresentation.

---

# 62. API Contract Principle

No frontend component should directly make its own eligibility assumptions.

All financial calculations should come from:

```text
eligibility service
```

No frontend component should independently decide grant eligibility.

All Relief decisions should come from:

```text
relief rules service
```

No frontend component should directly send provider money.

All grant execution should come from:

```text
agent → contract
```

---

# 63. Final System Boundary

```text
CareZero knows:
what the hospital policy says
what the patient entered
what the hospital later decided
whether a residual balance exists
whether Relief rules pass
whether charitable money moved

CareZero does NOT claim:
what medical care is necessary
whether treatment is appropriate
whether insurance made the correct clinical decision
whether a patient is legally entitled to relief
whether the hospital violated the law
```

That boundary should remain explicit throughout the codebase.
