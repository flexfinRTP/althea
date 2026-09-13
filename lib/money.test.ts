import { describe, expect, it } from "vitest";
import { formatDateTime, formatUsd } from "@/lib/money";

describe("formatUsd", () => {
  it("rounds to whole dollars", () => {
    expect(formatUsd(1999.4)).toBe("$1,999");
  });
});

describe("formatDateTime", () => {
  it("returns a recorded timestamp for ISO values", () => {
    expect(formatDateTime("2026-09-13T14:05:00.000Z")).toMatch(/2026/);
    expect(formatDateTime()).toBe("Not recorded");
  });
});
