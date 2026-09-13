import { jsonError, jsonOk } from "@/lib/http";
import { getHospital } from "@/lib/db/cases";

export async function GET(_request: Request, context: { params: Promise<{ hospitalId: string }> }) {
  try {
    const { hospitalId } = await context.params;
    const hospital = await getHospital(hospitalId);
    return jsonOk({
      id: hospital.id,
      name: hospital.name,
      state: hospital.state,
      city: hospital.city,
      fapLandingPageUrl: hospital.fapLandingPageUrl,
      applicationUrl: hospital.applicationUrl,
      activePolicyVersionId: hospital.activePolicyVersionId,
    });
  } catch (error) {
    return jsonError(error);
  }
}
