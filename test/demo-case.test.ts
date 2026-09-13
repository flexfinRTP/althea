import { describe, expect, it } from "vitest";
import { resetStoreForTests } from "@/lib/db/store";
import { ensureDemoCase, getCase } from "@/lib/db/cases";

describe("demo case bootstrap", () => {
  it("creates case id demo with frozen financial inputs", () => {
    resetStoreForTests();
    const created = ensureDemoCase();
    expect(created.id).toBe("demo");
    expect(getCase("demo").id).toBe("demo");
    expect(getCase("demo").hospitalId).toBe("hosp_demo_001");
  });
});
