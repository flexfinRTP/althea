-- Prisma initial schema for Althea Care.
-- Apply with: npx prisma migrate dev
-- Runtime falls back to .data/althea-store.json when DATABASE_URL is unset.

CREATE TYPE "UserRole" AS ENUM ('patient', 'advocate', 'relief_reviewer', 'program_admin', 'treasury_admin', 'auditor', 'system_agent');
CREATE TYPE "CaseStatus" AS ENUM ('draft', 'fap_analyzed', 'application_prepared', 'application_submitted', 'hospital_review', 'hospital_approved', 'hospital_denied', 'residual_verified', 'relief_requested', 'world_check_complete', 'relief_evaluated', 'relief_review', 'relief_approved', 'relief_denied', 'grant_executed', 'closed');

CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "role" "UserRole" NOT NULL,
  "email" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "hospitals" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "system_name" TEXT,
  "city" TEXT,
  "state" TEXT,
  "organization_type" TEXT,
  "fap_landing_page_url" TEXT,
  "application_url" TEXT,
  "active_policy_version_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "fap_documents" (
  "id" TEXT PRIMARY KEY,
  "hospital_id" TEXT NOT NULL REFERENCES "hospitals"("id"),
  "title" TEXT NOT NULL,
  "source_url" TEXT,
  "source_type" TEXT NOT NULL,
  "effective_date" TEXT,
  "file_hash" TEXT,
  "ingestion_status" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "fap_policy_versions" (
  "id" TEXT PRIMARY KEY,
  "hospital_id" TEXT NOT NULL REFERENCES "hospitals"("id"),
  "document_id" TEXT NOT NULL REFERENCES "fap_documents"("id"),
  "version_label" TEXT NOT NULL,
  "effective_date" TEXT,
  "structured_policy_json" JSONB NOT NULL,
  "validation_status" TEXT NOT NULL,
  "reviewed_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "cases" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT REFERENCES "users"("id"),
  "hospital_id" TEXT NOT NULL REFERENCES "hospitals"("id"),
  "status" "CaseStatus" NOT NULL,
  "case_hash" TEXT UNIQUE,
  "case_hash_salt" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "case_financial_inputs" (
  "case_id" TEXT PRIMARY KEY REFERENCES "cases"("id"),
  "bill_amount" DOUBLE PRECISION NOT NULL,
  "household_size" INTEGER NOT NULL,
  "household_annual_income" DOUBLE PRECISION NOT NULL,
  "insurance_status" TEXT NOT NULL,
  "first_post_discharge_bill_date" TEXT,
  "state" TEXT,
  "additional_policy_inputs_json" JSONB
);

CREATE TABLE "eligibility_estimates" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT NOT NULL REFERENCES "cases"("id"),
  "policy_version_id" TEXT NOT NULL REFERENCES "fap_policy_versions"("id"),
  "fpl_percent" DOUBLE PRECISION,
  "outcome" TEXT NOT NULL,
  "estimated_assistance" DOUBLE PRECISION,
  "estimated_remaining" DOUBLE PRECISION,
  "matched_rule_ids_json" JSONB NOT NULL,
  "assumptions_json" JSONB NOT NULL,
  "reasons_json" JSONB NOT NULL,
  "citation_ids_json" JSONB NOT NULL,
  "calculated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "application_packets" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT NOT NULL REFERENCES "cases"("id"),
  "policy_version_id" TEXT NOT NULL REFERENCES "fap_policy_versions"("id"),
  "status" TEXT NOT NULL,
  "application_url" TEXT,
  "submission_instructions_json" JSONB NOT NULL,
  "required_documents_json" JSONB NOT NULL,
  "generated_fields_json" JSONB NOT NULL,
  "generated_at" TIMESTAMP(3) NOT NULL,
  "submitted_at" TIMESTAMP(3)
);

CREATE TABLE "hospital_decisions" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT NOT NULL REFERENCES "cases"("id"),
  "status" TEXT NOT NULL,
  "original_balance" DOUBLE PRECISION NOT NULL,
  "approved_assistance" DOUBLE PRECISION NOT NULL,
  "remaining_balance" DOUBLE PRECISION NOT NULL,
  "source" TEXT NOT NULL,
  "verified" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "relief_programs" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "max_grant" DOUBLE PRECISION NOT NULL,
  "auto_approval_cap" DOUBLE PRECISION NOT NULL,
  "human_approval_threshold" DOUBLE PRECISION NOT NULL,
  "quorum_threshold" DOUBLE PRECISION,
  "requires_world_check" BOOLEAN NOT NULL,
  "requires_fap_completion" BOOLEAN NOT NULL,
  "requires_verified_residual" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "relief_requests" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT NOT NULL REFERENCES "cases"("id"),
  "program_id" TEXT NOT NULL REFERENCES "relief_programs"("id"),
  "requested_amount" DOUBLE PRECISION NOT NULL,
  "residual_balance" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL,
  "execution_key" TEXT UNIQUE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "world_verifications" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT NOT NULL REFERENCES "cases"("id"),
  "status" TEXT NOT NULL,
  "verification_reference" TEXT,
  "verified_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "relief_decisions" (
  "id" TEXT PRIMARY KEY,
  "relief_request_id" TEXT NOT NULL REFERENCES "relief_requests"("id"),
  "decision" TEXT NOT NULL,
  "calculated_grant_amount" DOUBLE PRECISION NOT NULL,
  "reason_codes_json" JSONB NOT NULL,
  "rules_version" TEXT NOT NULL,
  "approved_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "grants" (
  "id" TEXT PRIMARY KEY,
  "relief_request_id" TEXT NOT NULL REFERENCES "relief_requests"("id"),
  "case_hash" TEXT NOT NULL,
  "program_id" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "provider_settlement_address" TEXT NOT NULL,
  "decision_hash" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "arc_transaction_hash" TEXT,
  "submitted_at" TIMESTAMP(3),
  "confirmed_at" TIMESTAMP(3)
);

CREATE TABLE "treasury_transactions" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "source_address" TEXT,
  "destination_address" TEXT NOT NULL,
  "chain" TEXT NOT NULL,
  "transaction_hash" TEXT,
  "status" TEXT NOT NULL,
  "initiated_by" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_events" (
  "id" TEXT PRIMARY KEY,
  "case_id" TEXT REFERENCES "cases"("id"),
  "actor_type" TEXT NOT NULL,
  "actor_id" TEXT,
  "event_type" TEXT NOT NULL,
  "metadata_json" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "world_nullifiers" (
  "nullifier" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("nullifier", "action")
);
