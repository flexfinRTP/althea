import { jsonError, jsonOk } from "@/lib/http";
import { probeFunderPolicy } from "@/lib/network/service";
import { entityIdSchema, policyProbeSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ funderId: string }> }) {
  try {
    const { funderId } = await context.params;
    entityIdSchema.parse(funderId);
    const body = policyProbeSchema.parse(await request.json());
    return jsonOk(await probeFunderPolicy(funderId, body.amount));
  } catch (error) {
    return jsonError(error);
  }
}
