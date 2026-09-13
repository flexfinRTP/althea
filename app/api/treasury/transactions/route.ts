import { jsonError, jsonOk } from "@/lib/http";
import { assertRole, readSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/config";
import { listTreasuryActivity } from "@/lib/db/cases";

export async function GET() {
  try {
    const session = await readSession();
    if (!isDemoMode()) assertRole(session, ["program_admin", "treasury_admin"]);
    const transactions = await listTreasuryActivity();
    return jsonOk({ transactions });
  } catch (error) {
    return jsonError(error);
  }
}
