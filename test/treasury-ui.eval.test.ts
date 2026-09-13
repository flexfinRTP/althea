/**
 * Eval: treasury board stays a ledger. No story copy. Operator controls remain.
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
];

const REQUIRED = [
  "Relief Treasury",
  "Total USDC",
  "Holdings",
  "Policy",
  "Operations",
  "Activity",
  "Fund Relief Pool",
  "Test Restricted Transfer",
  "Demo model",
  "Approved contract",
];

describe("treasury board copy eval", () => {
  const source = [
    readFileSync(path.join(process.cwd(), "app/admin/treasury/page.tsx"), "utf8"),
    readFileSync(path.join(process.cwd(), "components/treasury/ChainAddress.tsx"), "utf8"),
    readFileSync(path.join(process.cwd(), "components/treasury/PrivyActions.tsx"), "utf8"),
  ].join("\n");

  it("keeps operator labels and omits narrative copy", () => {
    const lower = source.toLowerCase();
    for (const phrase of NARRATIVE) {
      expect(lower).not.toContain(phrase);
    }
    for (const label of REQUIRED) {
      expect(source).toContain(label);
    }
  });
});
