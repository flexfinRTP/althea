import { describe, expect, it } from "vitest";
import { explorerAddress, explorerTx, shortenAddress } from "@/lib/arc/chain";

describe("explorer helpers", () => {
  it("builds ArcScan tx and address URLs", () => {
    expect(explorerTx("0xabc")).toBe("https://testnet.arcscan.app/tx/0xabc");
    expect(explorerAddress("0xdef")).toBe("https://testnet.arcscan.app/address/0xdef");
    expect(explorerTx()).toBeUndefined();
    expect(explorerAddress(null)).toBeUndefined();
  });
});

describe("shortenAddress", () => {
  it("keeps short values and truncates long ones", () => {
    expect(shortenAddress(null)).toBe("Not configured");
    expect(shortenAddress("0xabc")).toBe("0xabc");
    expect(shortenAddress("0x1234567890abcdef1234")).toBe("0x1234...1234");
  });
});
