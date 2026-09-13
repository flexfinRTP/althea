import { describe, expect, it } from "vitest";
import { calculateFplPercent, getGuidelineAmount } from "@/lib/fap/fpl";

describe("calculateFplPercent", () => {
  it("computes the demo household of 3 at $51,000 as 186.7% FPL", () => {
    expect(
      calculateFplPercent({
        householdIncome: 51000,
        householdSize: 3,
      }),
    ).toBe(186.7);
  });

  it("uses household size 1 through 8 from the 2026 table", () => {
    expect(getGuidelineAmount(1)).toBe(15960);
    expect(getGuidelineAmount(8)).toBe(55720);
  });

  it("adds the extra-person amount beyond size 8", () => {
    expect(getGuidelineAmount(9)).toBe(55720 + 5680);
    expect(getGuidelineAmount(10)).toBe(55720 + 5680 * 2);
  });

  it("uses Alaska and Hawaii tables", () => {
    expect(getGuidelineAmount(3, "alaska")).toBe(34150);
    expect(getGuidelineAmount(3, "hawaii")).toBe(31420);
  });

  it("rejects invalid household size", () => {
    expect(() => getGuidelineAmount(0)).toThrow();
    expect(() => getGuidelineAmount(1.5)).toThrow();
  });
});
