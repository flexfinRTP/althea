import { describe, expect, it } from "vitest";
import {
  CCTP_DOMAIN,
  SOLANA_TOKEN_MESSENGER_V2,
  addressToBytes32,
  sourceDomain,
  sourceTokenMessenger,
} from "@/lib/circle/cctp";

describe("CCTP domains", () => {
  it("uses Circle domain IDs for Ethereum, Base, Solana, and Arc", () => {
    expect(sourceDomain("ethereum")).toBe(0);
    expect(sourceDomain("solana")).toBe(5);
    expect(sourceDomain("base")).toBe(6);
    expect(sourceDomain("arc")).toBe(CCTP_DOMAIN.arc);
    expect(CCTP_DOMAIN.arc).toBe(26);
  });

  it("returns official Solana TokenMessengerMinterV2 and pads EVM mint recipients", () => {
    expect(sourceTokenMessenger("solana")).toBe(SOLANA_TOKEN_MESSENGER_V2);
    expect(addressToBytes32("0x3600000000000000000000000000000000000000")).toMatch(/^0x0{24}3600/);
  });
});
