import { jsonError, jsonOk } from "@/lib/http";
import { assembleForRelief } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const { reliefRequestId } = await context.params;
    entityIdSchema.parse(reliefRequestId);
    return jsonOk(await assembleForRelief(reliefRequestId));
  } catch (error) {
    return jsonError(error);
  }
}
