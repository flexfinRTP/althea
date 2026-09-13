import { jsonError, jsonOk } from "@/lib/http";
import { publicNetwork } from "@/lib/network/service";

export async function GET() {
  try {
    return jsonOk(await publicNetwork());
  } catch (error) {
    return jsonError(error);
  }
}
