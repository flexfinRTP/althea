import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { getStore, id, nowIso, saveStore } from "@/lib/db/store";
import { listFunders } from "@/lib/network/service";
import { z } from "zod";

const createFunderSchema = z.object({
  name: z.string().trim().min(1).max(120),
  kind: z.enum(["foundation", "employer", "community"]).default("foundation"),
  treasuryUsdc: z.number().nonnegative().optional(),
  dailyLimitUsdc: z.number().positive().optional(),
  perMatchLimitUsdc: z.number().positive().optional(),
});

export async function GET() {
  try {
    return jsonOk({ funders: await listFunders() });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin"]);
    const body = createFunderSchema.parse(await request.json());
    const store = await getStore();
    const created = nowIso();
    const funder = {
      id: id("org"),
      name: body.name,
      kind: body.kind,
      treasuryUsdc: body.treasuryUsdc ?? 0,
      dailyLimitUsdc: body.dailyLimitUsdc ?? 5000,
      perMatchLimitUsdc: body.perMatchLimitUsdc ?? 250,
      createdAt: created,
      updatedAt: created,
    };
    store.funders.push(funder);
    await saveStore();
    return jsonOk({ funder }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
