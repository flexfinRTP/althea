import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { fundNetworkProgram } from "@/lib/network/service";
import { entityIdSchema, fundProgramSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ funderId: string; programId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin", "funder"]);
    const { funderId, programId } = await context.params;
    entityIdSchema.parse(funderId);
    entityIdSchema.parse(programId);
    const body = fundProgramSchema.parse(await request.json());
    return jsonOk(await fundNetworkProgram(funderId, programId, body.amount));
  } catch (error) {
    return jsonError(error);
  }
}
