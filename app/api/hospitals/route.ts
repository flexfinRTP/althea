import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { listHospitals } from "@/lib/db/cases";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") ?? undefined;
    const state = request.nextUrl.searchParams.get("state") ?? undefined;
    const hospitals = listHospitals(search, state).map((hospital) => ({
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
