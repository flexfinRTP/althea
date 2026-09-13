import { jsonError, jsonOk } from "@/lib/http";
import { getReliefNetworkIndex } from "@/lib/graph/relief-index";

export async function GET() {
  try {
    return jsonOk({ pools: await getReliefNetworkIndex() });
  } catch (error) {
    return jsonError(error);
  }
}
