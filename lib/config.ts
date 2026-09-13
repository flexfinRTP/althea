import demoFixture from "@/data/demo/example-medical-center.json";

export const DEMO_HOSPITAL_ID = "hosp_demo_001";
export const DEMO_POLICY_VERSION_ID = "fap_demo_2026";
export const DEMO_PROGRAM_ID = "cz_general_v1";
export const DEMO_PROGRAM_NAME = "Althea General Medical Hardship Fund";

export const ESTIMATE_DISCLAIMER =
  "This estimate is based on the hospital's published Financial Assistance Policy and the information entered. The hospital makes the final eligibility and assistance determination.";

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== "false";
}

export function demoReferenceDate(): Date {
  const raw = process.env.DEMO_REFERENCE_DATE;
  if (raw) {
    const parsed = new Date(`${raw}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getDemoFixture() {
  return demoFixture;
}

export function requireStaffKey(headerKey: string | null): boolean {
  const expected = process.env.DEMO_STAFF_KEY;
  if (!expected) return isDemoMode();
  return headerKey === expected;
}
