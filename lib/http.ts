import { NextResponse } from "next/server";
import { errorEnvelope, statusFor } from "@/lib/errors";

export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(error: unknown) {
  return NextResponse.json(errorEnvelope(error), { status: statusFor(error) });
}
