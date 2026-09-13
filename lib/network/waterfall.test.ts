import { describe, expect, it } from "vitest";
import { assembleReliefRoute } from "@/lib/network/waterfall";
import { seedFunders, seedNetworkPrograms } from "@/lib/network/seed";
import {
  NETWORK_COMMUNITY_PROGRAM_ID,
  NETWORK_GENERAL_PROGRAM_ID,
  NETWORK_MATCH_PROGRAM_ID,
} from "@/lib/network/ids";

const now = "2026-09-13T12:00:00.000Z";

describe("assembleReliefRoute", () => {
  it("assembles $250 general + $250 1:1 match = $500", () => {
    const route = assembleReliefRoute({
      residualBalance: 2470,
      requestedAmount: 500,
      programs: seedNetworkPrograms(now),
      funders: seedFunders(now),
      now: new Date(now),
    });
    expect(route.total).toBe(500);
    expect(route.remainingAfter).toBe(1970);
    expect(route.selected.map((row) => [row.programId, row.amount])).toEqual([
      [NETWORK_GENERAL_PROGRAM_ID, 250],
      [NETWORK_MATCH_PROGRAM_ID, 250],
    ]);
    const community = route.sources.find((row) => row.programId === NETWORK_COMMUNITY_PROGRAM_ID);
    expect(community?.eligible).toBe(false);
    expect(community?.reason).toBe("Need already filled");
  });

  it("adds employer and community when remaining need is still open", () => {
    const programs = seedNetworkPrograms(now).map((program) =>
      program.kind === "employer" ? { ...program, status: "active" as const, budget: 300 } : program,
    );
    const route = assembleReliefRoute({
      residualBalance: 2470,
      requestedAmount: 1000,
      programs,
      funders: seedFunders(now),
      now: new Date(now),
    });
    expect(route.total).toBe(1000);
    expect(route.selected.map((row) => row.amount)).toEqual([250, 250, 300, 200]);
  });
});
