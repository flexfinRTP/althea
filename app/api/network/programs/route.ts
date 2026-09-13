import { jsonError, jsonOk } from "@/lib/http";
import { listNetworkPrograms } from "@/lib/network/service";

export async function GET() {
  try {
    return jsonOk({ programs: await listNetworkPrograms() });
  } catch (error) {
    return jsonError(error);
  }
}
