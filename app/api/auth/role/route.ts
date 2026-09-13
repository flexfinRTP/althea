import { jsonError, jsonOk } from "@/lib/http";
import { writeSession } from "@/lib/auth";
import { Role } from "@/lib/db/store";
import { isDemoMode } from "@/lib/config";
import { ApiError } from "@/lib/errors";
import { authRoleSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    if (!isDemoMode()) {
      throw new ApiError("DEMO_ONLY", "Role switching is demo-only.");
    }
    const body = authRoleSchema.parse(await request.json());
    await writeSession({
      userId: `demo_${body.role}`,
      role: body.role as Role,
      caseIds: [],
    });
    return jsonOk({ role: body.role });
  } catch (error) {
    return jsonError(error);
  }
}
