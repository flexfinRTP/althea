import { jsonError, jsonOk } from "@/lib/http";
import { getHospitalFap } from "@/lib/db/cases";

export async function GET(_request: Request, context: { params: Promise<{ hospitalId: string }> }) {
  try {
    const { hospitalId } = await context.params;
    return jsonOk(getHospitalFap(hospitalId));
  } catch (error) {
    return jsonError(error);
  }
}
