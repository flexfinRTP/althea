import { jsonError, jsonOk } from "@/lib/http";
import { getStore } from "@/lib/db/store";
import { completeDonation } from "@/lib/network/service";
import { donateCompleteSchema, entityIdSchema } from "@/lib/validation";
import { ApiError } from "@/lib/errors";

export async function GET(_request: Request, context: { params: Promise<{ donationId: string }> }) {
  try {
    const { donationId } = await context.params;
    entityIdSchema.parse(donationId);
    const donation = (await getStore()).donations.find((row) => row.id === donationId);
    if (!donation) throw new ApiError("DONATION_NOT_FOUND", "Donation not found.", 404);
    return jsonOk({ donation });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ donationId: string }> }) {
  try {
    const { donationId } = await context.params;
    entityIdSchema.parse(donationId);
    const body = donateCompleteSchema.parse(await request.json().catch(() => ({})));
    return jsonOk({ donation: await completeDonation(donationId, body) });
  } catch (error) {
    return jsonError(error);
  }
}
