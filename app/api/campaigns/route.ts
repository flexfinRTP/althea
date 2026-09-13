import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { getStore, id, saveStore } from "@/lib/db/store";
import { listCampaigns } from "@/lib/network/service";
import { campaignSchema } from "@/lib/validation";

export async function GET() {
  try {
    return jsonOk({ campaigns: await listCampaigns() });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "funder"]);
    const body = campaignSchema.parse(await request.json());
    const store = await getStore();
    const campaign = {
      id: id("camp"),
      programId: body.programId,
      name: body.name,
      matchRatioNum: body.matchRatioNum,
      matchRatioDen: body.matchRatioDen,
      budget: body.budget,
      spent: 0,
      startsAt: body.startsAt,
      endsAt: body.endsAt,
      recipientProgramId: body.recipientProgramId,
      status: "active" as const,
    };
    store.campaigns.push(campaign);
    await saveStore();
    return jsonOk({ campaign }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
