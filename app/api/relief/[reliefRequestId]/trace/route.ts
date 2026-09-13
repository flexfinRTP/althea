import { jsonError, jsonOk } from "@/lib/http";
import { getReliefRequest } from "@/lib/db/cases";
import { runReliefAgent } from "@/lib/relief/agent";

export async function GET(_request: Request, context: { params: Promise<{ reliefRequestId: string }> }) {
  try {
    const { reliefRequestId } = await context.params;
    getReliefRequest(reliefRequestId);
    const trace = await runReliefAgent(reliefRequestId);
    return jsonOk(trace);
  } catch (error) {
    return jsonError(error);
  }
}
