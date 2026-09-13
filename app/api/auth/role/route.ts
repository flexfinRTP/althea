import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { writeSession } from "@/lib/auth";
import { Role } from "@/lib/db/store";
import { isDemoMode } from "@/lib/config";
import { ApiError } from "@/lib/errors";

const bodySchema = z.object({
  role: z.enum(["patient", "relief_reviewer", "program_admin", "treasury_admin"]),
});

export async function POST(request: Request) {
  try {
    if (!isDemoMode()) {
      throw new ApiError("DEMO_ONLY", "Role switching is demo-only.");
    }
    const body = bodySchema.parse(await request.json());
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
