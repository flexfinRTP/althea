import { jsonError, jsonOk } from "@/lib/http";
import { createDonation } from "@/lib/network/service";
import { donateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = donateSchema.parse(await request.json());
    return jsonOk(await createDonation(body), 201);
  } catch (error) {
    return jsonError(error);
  }
}
