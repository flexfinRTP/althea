import { describe, expect, it } from "vitest";
import { applyCampaignSpend, campaignMatchAmount, programCanMatchSource } from "@/lib/network/match";
import { seedCampaigns, seedNetworkPrograms } from "@/lib/network/seed";
import { NETWORK_GENERAL_PROGRAM_ID, NETWORK_MATCH_PROGRAM_ID } from "@/lib/network/ids";

const now = new Date("2026-09-13T12:00:00.000Z");

describe("automatic match campaigns", () => {
  it("matches $50 + $50 until the campaign budget is gone", () => {
    const campaign = seedCampaigns(now.toISOString())[0];
    expect(campaignMatchAmount(50, campaign, now)).toBe(50);
    const after = applyCampaignSpend(campaign, 50);
    expect(after.spent).toBe(50);
    expect(after.status).toBe("active");
    const closed = applyCampaignSpend({ ...campaign, spent: 9950 }, 50);
    expect(closed.status).toBe("closed");
  });

  it("only matches an eligible source program", () => {
    const program = seedNetworkPrograms(now.toISOString()).find((row) => row.id === NETWORK_MATCH_PROGRAM_ID)!;
    expect(programCanMatchSource(program, NETWORK_GENERAL_PROGRAM_ID, now)).toBe(true);
    expect(programCanMatchSource(program, "other", now)).toBe(false);
  });
});
