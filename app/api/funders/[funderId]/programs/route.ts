import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { createFunderProgram } from "@/lib/network/service";
import { entityIdSchema, funderProgramSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ funderId: string }> }) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin", "funder"]);
    const { funderId } = await context.params;
    entityIdSchema.parse(funderId);
    const body = funderProgramSchema.parse(await request.json());
    const program = await createFunderProgram(funderId, body);
    return jsonOk({ program }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
