import { describe, expect, it } from "vitest";
import { resetStoreForTests } from "@/lib/db/store";
import {
  calculateCaseEstimate,
  createCase,
  createReliefRequest,
  getFullCase,
  recordHospitalDecision,
} from "@/lib/db/cases";
import demo from "@/data/demo/example-medical-center.json";
import riverside from "@/data/hospitals/riverside-community/fap-2026.json";

describe("live case values follow the engine, not UI literals", () => {
  it("records hospital decisions from the stored estimate", async () => {
    await resetStoreForTests();
    const created = await createCase({
      hospitalId: demo.hospitalId,
      billAmount: demo.billAmount,
      householdSize: demo.householdSize,
      householdAnnualIncome: demo.income,
      insuranceStatus: "insured",
      firstPostDischargeBillDate: demo.firstPostDischargeBillDate,
    });
    const estimate = await calculateCaseEstimate(created.id);
    const decision = await recordHospitalDecision(created.id, { status: "approved" });
    expect(decision.approvedAssistance).toBe(estimate.estimatedAssistance);
    expect(decision.remainingBalance).toBe(estimate.estimatedRemaining);
    expect(decision.originalBalance).toBe(demo.billAmount);
  });

  it("caps a relief request at the program max and residual", async () => {
    await resetStoreForTests();
    const created = await createCase({
      hospitalId: demo.hospitalId,
      billAmount: demo.billAmount,
      householdSize: demo.householdSize,
      householdAnnualIncome: demo.income,
      insuranceStatus: "insured",
    });
    await calculateCaseEstimate(created.id);
    await recordHospitalDecision(created.id, { status: "approved" });
    const relief = await createReliefRequest(created.id, "cz_general_v1");
    const bundle = await getFullCase(created.id);
    expect(relief.requestedAmount).toBe(Math.min(bundle.program.maxGrant, bundle.decision!.remainingBalance));
    expect(relief.residualBalance).toBe(bundle.decision!.remainingBalance);
  });

  it("does not invent Example Medical Center amounts for Riverside", async () => {
    await resetStoreForTests();
    const created = await createCase({
      hospitalId: riverside.hospital.id,
      billAmount: 10000,
      householdSize: 2,
      householdAnnualIncome: 80000,
      insuranceStatus: "insured",
    });
    const estimate = await calculateCaseEstimate(created.id);
    expect(estimate.outcome).toBe("potentially_ineligible");
    expect(estimate.estimatedAssistance).toBe(0);
    expect(estimate.estimatedRemaining).toBe(10000);
  });
});
