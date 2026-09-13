import { jsonError, jsonOk } from "@/lib/http";
import { getProgram, updateProgram } from "@/lib/db/cases";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { compactPatch, programPatchSchema } from "@/lib/validation";

export async function GET() {
  try {
    return jsonOk(await getProgram());
  } catch (error) {
    return jsonError(error);
  }
}


export async function PATCH(request: Request) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin"]);
    const body = compactPatch(programPatchSchema.parse(await request.json()));
    return jsonOk(await updateProgram(body));
  } catch (error) {
    return jsonError(error);
  }
}
