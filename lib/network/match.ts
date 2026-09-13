import { availableAmount, isProgramLive } from "@/lib/network/accounting";
import type { StoredMatchCampaign, StoredNetworkProgram } from "@/lib/network/types";

export function campaignMatchAmount(donationAmount: number, campaign: StoredMatchCampaign, now = new Date()): number {
  if (campaign.status !== "active") return 0;
  if (new Date(campaign.startsAt).getTime() > now.getTime()) return 0;
  if (new Date(campaign.endsAt).getTime() <= now.getTime()) return 0;
  if (campaign.matchRatioDen <= 0) return 0;
  const raw = (donationAmount * campaign.matchRatioNum) / campaign.matchRatioDen;
  const remaining = Math.max(0, campaign.budget - campaign.spent);
  return Math.min(Math.floor(raw), remaining);
}

export function applyCampaignSpend(campaign: StoredMatchCampaign, matchedAmount: number): StoredMatchCampaign {
  return {
    ...campaign,
    spent: campaign.spent + matchedAmount,
    status: campaign.spent + matchedAmount >= campaign.budget ? "closed" : campaign.status,
  };
}

export function programCanMatchSource(program: StoredNetworkProgram, sourceProgramId: string, now = new Date()): boolean {
  if (!isProgramLive(program, now)) return false;
  if (program.kind !== "match" && program.kind !== "campaign") return false;
  if (program.eligibleSourceProgramId && program.eligibleSourceProgramId !== sourceProgramId) return false;
  return availableAmount(program) > 0;
}
