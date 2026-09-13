/**
 * Eval: public relief fund stays a ledger. No story copy. Stats and verify remain.
 */
import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const NARRATIVE = [
  "magic",
  "journey",
  "hang tight",
  "almost there",
  "working on it",
  "please wait while we",
  "safely held",
  "world class",
  "amplify",
  "democratizes",
];

const REQUIRED = [
  "Althea Relief Fund",
  "Available Capital",
  "Relief Delivered",
  "Grants Completed",
  "Average Grant",
  "Platform percentage taken from patient grants",
  "Patient medical records published onchain",
  "Testnet",
  "Verify Relief Transaction",
  "Demo financial model",
];

describe("relief fund copy eval", () => {
  const source = [
    readFileSync(path.join(process.cwd(), "app/fund/page.tsx"), "utf8"),
    readFileSync(path.join(process.cwd(), "app/fund/verify/[grantId]/page.tsx"), "utf8"),
  ].join("\n");

  it("keeps public fund labels and omits narrative copy", () => {
    const lower = source.toLowerCase();
    for (const phrase of NARRATIVE) {
      expect(lower).not.toContain(phrase);
    }
    for (const label of REQUIRED) {
      expect(source).toContain(label);
    }
  });
});
