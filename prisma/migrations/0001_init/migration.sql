-- Demo SQLite schema. No Postgres required.

CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "role" TEXT NOT NULL,
  "email" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL
);

CREATE TABLE "hospitals" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "system_name" TEXT,
  "city" TEXT,
  "state" TEXT,
  "organization_type" TEXT,
  "fap_landing_page_url" TEXT,
  "application_url" TEXT,
  "active_policy_version_id" TEXT,
  "policy_source_path" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL
);

CREATE TABLE "fap_documents" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "hospital_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "source_url" TEXT,
  "source_type" TEXT NOT NULL,
  "effective_date" TEXT,
  "file_hash" TEXT,
  "ingestion_status" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fap_documents_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "fap_policy_versions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "hospital_id" TEXT NOT NULL,
  "document_id" TEXT NOT NULL,
  "version_label" TEXT NOT NULL,
  "effective_date" TEXT,
  "structured_policy_json" TEXT NOT NULL,
  "validation_status" TEXT NOT NULL,
  "reviewed_by" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  CONSTRAINT "fap_policy_versions_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "fap_policy_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "fap_documents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "cases" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT,
  "hospital_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "case_hash" TEXT,
  "case_hash_salt" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  CONSTRAINT "cases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "cases_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "cases_case_hash_key" ON "cases"("case_hash");

CREATE TABLE "case_financial_inputs" (
  "case_id" TEXT NOT NULL PRIMARY KEY,
  "bill_amount" REAL NOT NULL,
  "household_size" INTEGER NOT NULL,
  "household_annual_income" REAL NOT NULL,
  "insurance_status" TEXT NOT NULL,
  "first_post_discharge_bill_date" TEXT,
  "state" TEXT,
  "residency_answers_json" TEXT,
  "additional_policy_inputs_json" TEXT,
  CONSTRAINT "case_financial_inputs_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "eligibility_estimates" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT NOT NULL,
  "policy_version_id" TEXT NOT NULL,
  "fpl_percent" REAL,
  "outcome" TEXT NOT NULL,
  "estimated_assistance" REAL,
  "estimated_remaining" REAL,
  "matched_rule_ids_json" TEXT NOT NULL,
  "assumptions_json" TEXT NOT NULL,
  "reasons_json" TEXT NOT NULL,
  "citation_ids_json" TEXT NOT NULL,
  "calculated_at" DATETIME NOT NULL,
  CONSTRAINT "eligibility_estimates_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "eligibility_estimates_policy_version_id_fkey" FOREIGN KEY ("policy_version_id") REFERENCES "fap_policy_versions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "application_packets" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT NOT NULL,
  "policy_version_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "application_url" TEXT,
  "submission_instructions_json" TEXT NOT NULL,
  "required_documents_json" TEXT NOT NULL,
  "generated_fields_json" TEXT NOT NULL,
  "generated_at" DATETIME NOT NULL,
  "submitted_at" DATETIME,
  CONSTRAINT "application_packets_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "application_packets_policy_version_id_fkey" FOREIGN KEY ("policy_version_id") REFERENCES "fap_policy_versions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "hospital_decisions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "original_balance" REAL NOT NULL,
  "approved_assistance" REAL NOT NULL,
  "remaining_balance" REAL NOT NULL,
  "source" TEXT NOT NULL,
  "verified" BOOLEAN NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hospital_decisions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "relief_programs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "min_grant" REAL,
  "max_grant" REAL NOT NULL,
  "auto_approval_cap" REAL NOT NULL,
  "human_approval_threshold" REAL NOT NULL,
  "quorum_threshold" REAL,
  "requires_world_check" BOOLEAN NOT NULL,
  "requires_fap_completion" BOOLEAN NOT NULL,
  "requires_verified_residual" BOOLEAN NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL
);

CREATE TABLE "relief_requests" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT NOT NULL,
  "program_id" TEXT NOT NULL,
  "requested_amount" REAL NOT NULL,
  "residual_balance" REAL NOT NULL,
  "status" TEXT NOT NULL,
  "execution_key" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  CONSTRAINT "relief_requests_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "relief_requests_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "relief_programs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "relief_requests_execution_key_key" ON "relief_requests"("execution_key");

CREATE TABLE "world_verifications" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "verification_reference" TEXT,
  "verified_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "world_verifications_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "relief_decisions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "relief_request_id" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "calculated_grant_amount" REAL NOT NULL,
  "reason_codes_json" TEXT NOT NULL,
  "rules_version" TEXT NOT NULL,
  "approved_by" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "relief_decisions_relief_request_id_fkey" FOREIGN KEY ("relief_request_id") REFERENCES "relief_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "grants" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "relief_request_id" TEXT NOT NULL,
  "case_hash" TEXT NOT NULL,
  "program_id" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "currency" TEXT NOT NULL,
  "provider_settlement_address" TEXT NOT NULL,
  "decision_hash" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "arc_transaction_hash" TEXT,
  "submitted_at" DATETIME,
  "confirmed_at" DATETIME,
  CONSTRAINT "grants_relief_request_id_fkey" FOREIGN KEY ("relief_request_id") REFERENCES "relief_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "treasury_transactions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "currency" TEXT NOT NULL,
  "source_address" TEXT,
  "destination_address" TEXT NOT NULL,
  "chain" TEXT NOT NULL,
  "transaction_hash" TEXT,
  "status" TEXT NOT NULL,
  "initiated_by" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_events" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "case_id" TEXT,
  "actor_type" TEXT NOT NULL,
  "actor_id" TEXT,
  "event_type" TEXT NOT NULL,
  "metadata_json" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_events_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "world_nullifiers" (
  "nullifier" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "verified_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("nullifier", "action")
);
