import { jsonError, jsonOk } from "@/lib/http";
import { getFunder, provisionFunderWallet } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ funderId: string }> }) {
  try {
    const { funderId } = await context.params;
    entityIdSchema.parse(funderId);
    return jsonOk(await getFunder(funderId));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(_request: Request, context: { params: Promise<{ funderId: string }> }) {
  try {
    const { funderId } = await context.params;
    entityIdSchema.parse(funderId);
    return jsonOk(await provisionFunderWallet(funderId));
  } catch (error) {
    return jsonError(error);
  }
}
