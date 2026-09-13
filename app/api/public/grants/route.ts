import { jsonError, jsonOk } from "@/lib/http";
import { listPublicGrants } from "@/lib/db/cases";

export async function GET() {
  try {
    return jsonOk(await listPublicGrants());
  } catch (error) {
    return jsonError(error);
  }
}
