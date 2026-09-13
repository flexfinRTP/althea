import { describe, expect, it } from "vitest";
import {
  LOADER_FOOTNOTE,
  LOADER_HASH_CELLS,
  LOADER_PRIVACY,
  LOADER_RAIL,
  LOADER_STACK,
  LOADER_STATUS,
  loaderAriaLabel,
} from "@/lib/ui/loader";

describe("loader copy", () => {
  it("keeps hospital assistance offchain and relief on Arc USDC", () => {
    expect(LOADER_RAIL.hospital.layer).toBe("Offchain");
    expect(LOADER_RAIL.relief.layer).toBe("Arc · USDC");
    expect(LOADER_RAIL.relief.items).toContain("caseHash");
  });

  it("names the relief rail stack", () => {
    expect(LOADER_STACK.map((item) => item.name)).toEqual(["World", "Privy", "Circle", "Arc"]);
    expect(LOADER_STACK.find((item) => item.name === "Arc")?.role).toBe("Settlement");
  });

  it("states the privacy split and that no wallet is required", () => {
    expect(LOADER_PRIVACY).toBe("Patient data never onchain.");
    expect(LOADER_FOOTNOTE).toBe("No wallet required.");
    expect(LOADER_HASH_CELLS).toBe(8);
  });

  it("exposes operational status lines, not story copy", () => {
    const values = Object.values(LOADER_STATUS);
    expect(values.every((line) => line.startsWith("Loading"))).toBe(true);
    expect(values.every((line) => !line.includes("..."))).toBe(true);
  });

  it("builds an accessible label from the public facts", () => {
    const label = loaderAriaLabel(LOADER_STATUS.estimate);
    expect(label).toContain("Loading estimate");
    expect(label).toContain("Offchain");
    expect(label).toContain("Arc · USDC");
    expect(label).toContain("World, Privy, Circle, Arc");
    expect(label).toContain("never onchain");
    expect(label).toContain("No wallet required");
  });
});
