import { jsonError, jsonOk } from "@/lib/http";
import { getProgramDetail } from "@/lib/network/service";
import { entityIdSchema } from "@/lib/validation";

export async function GET(_request: Request, context: { params: Promise<{ programId: string }> }) {
  try {
    const { programId } = await context.params;
    entityIdSchema.parse(programId);
    return jsonOk(await getProgramDetail(programId));
  } catch (error) {
    return jsonError(error);
  }
}
