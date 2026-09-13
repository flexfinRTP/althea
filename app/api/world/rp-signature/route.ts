import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { createRpSignature } from "@/lib/world/verify";
import { worldConfigured } from "@/lib/world/verify";
import { ApiError } from "@/lib/errors";

const bodySchema = z.object({
  action: z.string().default(process.env.WORLD_ACTION_ID || "althea-relief-liveness"),
});

export async function POST(request: Request) {
  try {
    if (!worldConfigured()) {
      throw new ApiError(
        "WORLD_NOT_CONFIGURED",
        "We couldn't complete the liveness check. Try again or request manual review.",
        503,
      );
    }
    const body = bodySchema.parse(await request.json().catch(() => ({})));
    return jsonOk(createRpSignature(body.action));
  } catch (error) {
    return jsonError(error);
  }
}
