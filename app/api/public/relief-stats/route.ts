import { jsonError, jsonOk } from "@/lib/http";
import { publicReliefStats } from "@/lib/db/cases";

export async function GET() {
  try {
    return jsonOk(publicReliefStats());
  } catch (error) {
    return jsonError(error);
  }
}
