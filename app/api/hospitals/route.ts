import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { listHospitals } from "@/lib/db/cases";
import { hospitalListQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const query = hospitalListQuerySchema.parse({
      search: request.nextUrl.searchParams.get("search") ?? undefined,
      state: request.nextUrl.searchParams.get("state") ?? undefined,
    });
    const hospitals = (await listHospitals(query.search, query.state)).map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      state: hospital.state,
      organizationType: hospital.organizationType,
    }));
    return jsonOk({ hospitals });
  } catch (error) {
    return jsonError(error);
  }
}
