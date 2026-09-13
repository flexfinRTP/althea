import { describe, expect, it } from "vitest";
import { publicPrivyAppId } from "@/lib/privy/app-id";

describe("publicPrivyAppId", () => {
  it("accepts a Privy app id", () => {
    expect(publicPrivyAppId("cmtzy98h700a10cjpmrcgrd2a")).toBe("cmtzy98h700a10cjpmrcgrd2a");
  });

  it("strips a mistaken World app_ prefix", () => {
    expect(publicPrivyAppId("app_cmtzy98h700a10cjpmrcgrd2a")).toBe("cmtzy98h700a10cjpmrcgrd2a");
  });

  it("rejects empty, World, and short values", () => {
    expect(publicPrivyAppId("")).toBeUndefined();
    expect(publicPrivyAppId("   ")).toBeUndefined();
    expect(publicPrivyAppId("app_staging_123")).toBeUndefined();
    expect(publicPrivyAppId("short")).toBeUndefined();
  });
});
