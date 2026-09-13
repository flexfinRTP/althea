import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { refundRelief } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function POST(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin", "system_agent"]);
    const { reliefRequestId } = await context.params;
    entityIdSchema.parse(reliefRequestId);
    return jsonOk(await refundRelief(reliefRequestId));
  } catch (error) {
    return jsonError(error);
  }
}
