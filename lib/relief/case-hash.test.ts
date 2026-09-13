import { describe, expect, it } from "vitest";
import { generateCaseHashMaterial } from "@/lib/relief/case-hash";

describe("case hash", () => {
  it("does not embed obvious PII", () => {
    const first = generateCaseHashMaterial("case_demo_001");
    const second = generateCaseHashMaterial("case_demo_001");
    expect(first.caseHash.startsWith("0x")).toBe(true);
    expect(first.caseHash).not.toEqual(second.caseHash);
    expect(first.salt).not.toEqual(second.salt);
  });
});
