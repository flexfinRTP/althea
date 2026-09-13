/**
 * Eval: public loader copy must describe the two-system rail without implying
 * the current page load is a chain transaction or that the patient holds crypto.
 */
import { existsSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  LOADER_FOOTNOTE,
  LOADER_PRIVACY,
  LOADER_RAIL,
  LOADER_STACK,
  LOADER_STATUS,
  loaderAriaLabel,
} from "@/lib/ui/loader";

const NARRATIVE = [
  "magic",
  "journey",
  "hang tight",
  "almost there",
  "working on it",
  "please wait while we",
];

describe("loader public-copy eval", () => {
  const publicLines = [
    ...Object.values(LOADER_STATUS),
    LOADER_RAIL.hospital.title,
    LOADER_RAIL.hospital.layer,
    ...LOADER_RAIL.hospital.items,
    LOADER_RAIL.relief.title,
    LOADER_RAIL.relief.layer,
    ...LOADER_RAIL.relief.items,
    ...LOADER_STACK.flatMap((item) => [item.name, item.role]),
    LOADER_PRIVACY,
    LOADER_FOOTNOTE,
    loaderAriaLabel(),
  ]
    .join(" | ")
    .toLowerCase();

  it("does not use narrative filler", () => {
    for (const banned of NARRATIVE) {
      expect(publicLines.includes(banned)).toBe(false);
    }
  });

  it("does not tell the patient to use a wallet or send crypto", () => {
    expect(publicLines).toContain("no wallet required");
    expect(publicLines.includes("connect wallet")).toBe(false);
    expect(publicLines.includes("sign transaction")).toBe(false);
  });

  it("keeps the FAP / relief boundary visible", () => {
    expect(publicLines).toContain("hospital assistance");
    expect(publicLines).toContain("offchain");
    expect(publicLines).toContain("arc");
    expect(publicLines).toContain("usdc");
    expect(publicLines).toContain("casehash");
    expect(publicLines).toContain("privy");
    expect(publicLines).toContain("circle");
  });

  it("points at partner logo files that exist on disk", () => {
    for (const item of LOADER_STACK) {
      const file = path.join(process.cwd(), "public", item.logo.replace(/^\//, ""));
      expect(existsSync(file)).toBe(true);
    }
  });
});
