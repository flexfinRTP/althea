import { signRequest } from "@worldcoin/idkit-core/signing";
import { ApiError } from "@/lib/errors";
import { recordWorldVerification, storeNullifier } from "@/lib/db/cases";

export function worldConfigured(): boolean {
  return Boolean(
    (process.env.WORLD_APP_ID || process.env.NEXT_PUBLIC_WORLD_APP_ID) &&
      process.env.WORLD_RP_ID &&
      process.env.WORLD_RP_SIGNING_KEY,
  );
}

export function createRpSignature(action: string) {
  const signingKeyHex = process.env.WORLD_RP_SIGNING_KEY;
  if (!signingKeyHex) {
    throw new ApiError(
      "WORLD_NOT_CONFIGURED",
      "We couldn't complete the liveness check. Try again or request manual review.",
      503,
    );
  }
  const signed = signRequest({ signingKeyHex, action });
  return {
    rp_id: process.env.WORLD_RP_ID as string,
    nonce: signed.nonce,
    created_at: Number(signed.createdAt),
    expires_at: Number(signed.expiresAt),
    signature: signed.sig,
    sig: signed.sig,
  };
}

function extractNullifier(payload: Record<string, unknown>): string | undefined {
  const responses = payload.responses;
  if (!Array.isArray(responses) || responses.length === 0) return undefined;
  const first = responses[0] as Record<string, unknown>;
  if (typeof first.nullifier === "string") return first.nullifier;
  return undefined;
}

export async function verifyWorldProof(input: {
  caseId: string;
  rpId: string;
  idkitResponse: Record<string, unknown>;
}) {
  const response = await fetch(`https://developer.world.org/api/v4/verify/${input.rpId}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input.idkitResponse),
  });
  if (!response.ok) {
    await recordWorldVerification({ caseId: input.caseId, status: "failed" });
    throw new ApiError(
      "WORLD_VERIFY_FAILED",
      "We couldn't complete the liveness check. Try again or request manual review.",
      400,
    );
  }
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const nullifier = extractNullifier(input.idkitResponse) ?? extractNullifier(body);
  const action = process.env.WORLD_ACTION_ID || process.env.NEXT_PUBLIC_WORLD_ACTION_ID || "althea-relief-liveness";
  if (nullifier) {
  const stored = await storeNullifier(nullifier, action);
    if (!stored) {
      throw new ApiError(
        "WORLD_DUPLICATE",
        "We couldn't complete the liveness check. Try again or request manual review.",
        400,
      );
    }
  }
  return recordWorldVerification({
    caseId: input.caseId,
    status: "passed",
    verificationReference: nullifier,
  });
}
