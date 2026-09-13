export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function errorEnvelope(error: unknown): { error: { code: string; message: string } } {
  if (error instanceof ApiError) {
    return { error: { code: error.code, message: error.message } };
  }
  console.error(error);
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
    },
  };
}

export function statusFor(error: unknown): number {
  if (error instanceof ApiError) return error.status;
  return 500;
}
