import { jsonError, jsonOk } from "@/lib/http";
import { explorerTx } from "@/lib/arc/chain";
import { getStore } from "@/lib/db/store";

export async function GET(_request: Request, context: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await context.params;
    const grant = getStore().grants.find((row) => row.arcTransactionHash === hash);
    return jsonOk({
      hash,
      explorer: explorerTx(hash),
      status: grant?.status ?? "unknown",
      amount: grant?.amount,
      program: grant ? getStore().program.name : undefined,
    });
  } catch (error) {
    return jsonError(error);
  }
}
