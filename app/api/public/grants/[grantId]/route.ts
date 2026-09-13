import { jsonError, jsonOk } from "@/lib/http";
import { publicGrant } from "@/lib/db/cases";

export async function GET(_request: Request, context: { params: Promise<{ grantId: string }> }) {
  try {
    const { grantId } = await context.params;
    return jsonOk(await publicGrant(grantId));
  } catch (error) {
    return jsonError(error);
  }
}
