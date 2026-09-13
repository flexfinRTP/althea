import { createPublicClient, http } from "viem";
import { arcTestnet } from "@/lib/arc/chain";
import { RELIEF_NETWORK_ADDRESS, reliefNetworkAbi } from "@/lib/arc/network";
import { programIdBytes32 } from "@/lib/relief/case-hash";
import { atomicToUsdc } from "@/lib/money";
import { getStore } from "@/lib/db/store";
import { programAccounting } from "@/lib/network/accounting";
import type { StoredNetworkProgram } from "@/lib/network/types";

function graphIdToProgram(graphId: string, programs: StoredNetworkProgram[]): StoredNetworkProgram | undefined {
  const normalized = (graphId.startsWith("0x") ? graphId : `0x${graphId}`).toLowerCase();
  return programs.find((program) => programIdBytes32(program.id).toLowerCase() === normalized);
}

function unitsToUsdc(raw: string | undefined): number {
  if (!raw) return 0;
  try {
    const value = BigInt(raw);
    if (value >= 1_000_000n) return atomicToUsdc(value);
    return Number(value);
  } catch {
    return Number(raw) || 0;
  }
}

export type IndexedPool = {
  programId: string;
  name: string;
  availableUsdc: number;
  reservedUsdc: number;
  spentUsdc: number;
  budgetUsdc: number;
  source: "the-graph" | "onchain" | "store";
};

const POOL_QUERY = `
query ReliefPools {
  programs(where: { active: true }) {
    id
    budget
    reserved
    spent
    available
  }
}
`;

async function queryGraph(): Promise<IndexedPool[] | null> {
  const url = process.env.GRAPH_SUBGRAPH_URL;
  if (!url) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: POOL_QUERY }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    data?: {
      programs?: Array<{
        id: string;
        name?: string;
        budget?: string;
        reserved?: string;
        spent?: string;
        available?: string;
      }>;
    };
  };
  const programs = body.data?.programs;
  if (!programs) return null;
  const store = await getStore();
  return programs.map((row) => {
    const local = graphIdToProgram(row.id, store.networkPrograms);
    return {
      programId: local?.id ?? row.id,
      name: local?.name ?? row.id,
      availableUsdc: unitsToUsdc(row.available),
      reservedUsdc: unitsToUsdc(row.reserved),
      spentUsdc: unitsToUsdc(row.spent),
      budgetUsdc: unitsToUsdc(row.budget),
      source: "the-graph" as const,
    };
  });
}

async function queryOnchain(): Promise<IndexedPool[] | null> {
  if (!RELIEF_NETWORK_ADDRESS) return null;
  const store = await getStore();
  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(arcTestnet.rpcUrls.default.http[0]),
  });
  const pools: IndexedPool[] = [];
  for (const program of store.networkPrograms) {
    try {
      const accounting = await client.readContract({
        address: RELIEF_NETWORK_ADDRESS,
        abi: reliefNetworkAbi,
        functionName: "programAccounting",
        args: [programIdBytes32(program.id)],
      });
      pools.push({
        programId: program.id,
        name: program.name,
        budgetUsdc: atomicToUsdc(accounting[0]),
        reservedUsdc: atomicToUsdc(accounting[1]),
        spentUsdc: atomicToUsdc(accounting[2]),
        availableUsdc: atomicToUsdc(accounting[3]),
        source: "onchain",
      });
    } catch {
      const local = programAccounting(program);
      pools.push({
        programId: program.id,
        name: program.name,
        budgetUsdc: local.budget,
        reservedUsdc: local.reserved,
        spentUsdc: local.settled,
        availableUsdc: local.remaining,
        source: "store",
      });
    }
  }
  return pools;
}

export async function getReliefNetworkIndex(): Promise<IndexedPool[]> {
  const fromGraph = await queryGraph();
  if (fromGraph?.length) return fromGraph;
  const fromChain = await queryOnchain();
  if (fromChain?.length) return fromChain;
  const store = await getStore();
  return store.networkPrograms.map((program) => {
    const local = programAccounting(program);
    return {
      programId: program.id,
      name: program.name,
      budgetUsdc: local.budget,
      reservedUsdc: local.reserved,
      spentUsdc: local.settled,
      availableUsdc: local.remaining,
      source: "store" as const,
    };
  });
}

export async function eligiblePoolsWithBalance(minimumUsdc = 1): Promise<IndexedPool[]> {
  const pools = await getReliefNetworkIndex();
  return pools.filter((pool) => pool.availableUsdc >= minimumUsdc);
}
