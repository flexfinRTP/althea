import { describe, expect, it } from "vitest";
import { resetStoreForTests } from "@/lib/db/store";
import { ensureDemoCase, getCase } from "@/lib/db/cases";
import demo from "@/data/demo/example-medical-center.json";

describe("demo case bootstrap", () => {
  it("creates case id demo with fixture financial inputs", async () => {
    await resetStoreForTests();
    const created = await ensureDemoCase();
    expect(created.id).toBe("demo");
    expect((await getCase("demo")).id).toBe("demo");
    expect((await getCase("demo")).hospitalId).toBe(demo.hospitalId);
  });
});
