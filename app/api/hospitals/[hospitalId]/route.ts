import { jsonError, jsonOk } from "@/lib/http";
import { getHospital } from "@/lib/db/cases";

export async function GET(_request: Request, context: { params: Promise<{ hospitalId: string }> }) {
  try {
    const { hospitalId } = await context.params;
    const hospital = getHospital(hospitalId);
    return jsonOk(hospital);
  } catch (error) {
    return jsonError(error);
  }
}
