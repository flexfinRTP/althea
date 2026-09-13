import { createPublicClient, http } from "viem";
import { atomicToUsdc } from "@/lib/money";
import { arcTestnet, erc20Abi, RELIEF_POOL_ADDRESS, USDC_ADDRESS } from "@/lib/arc/chain";

export function arcClient() {
  return createPublicClient({
    chain: arcTestnet,
    transport: http(arcTestnet.rpcUrls.default.http[0]),
  });
}

export async function readUsdcBalance(address: `0x${string}`): Promise<number | null> {
  if (!address || address === "0x") return null;
  try {
    const client = arcClient();
    const raw = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    return atomicToUsdc(raw);
  } catch (error) {
    console.error("Arc balance read failed", error);
    return null;
  }
}

export async function readPoolBalance(): Promise<number | null> {
  if (!RELIEF_POOL_ADDRESS) return null;
  return readUsdcBalance(RELIEF_POOL_ADDRESS);
}
