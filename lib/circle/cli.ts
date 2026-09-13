import { spawn } from "child_process";

export type CircleExecuteResult = {
  ok: boolean;
  txHash?: string;
  raw: string;
  error?: string;
};

function run(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  const bin = process.env.CIRCLE_CLI_PATH || "circle";
  return new Promise((resolve) => {
    const child = spawn(bin, args, { shell: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      resolve({ code: 1, stdout, stderr: error.message });
    });
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

function extractTxHash(text: string): string | undefined {
  const match = text.match(/0x[a-fA-F0-9]{64}/);
  return match?.[0];
}

export async function circleWalletExecute(input: {
  signature: string;
  params: string[];
  contract: string;
  wallet: string;
  chain?: string;
}): Promise<CircleExecuteResult> {
  const chain = input.chain || process.env.CIRCLE_CHAIN || "ARC-TESTNET";
  const result = await run([
    "wallet",
    "execute",
    input.signature,
    ...input.params,
    "--contract",
    input.contract,
    "--address",
    input.wallet,
    "--chain",
    chain,
    "--output",
    "json",
  ]);
  const raw = `${result.stdout}\n${result.stderr}`.trim();
  if (result.code !== 0) {
    return {
      ok: false,
      raw,
      error:
        raw ||
        "Circle Agent Stack could not execute the contract call. Confirm `circle wallet login --testnet` and CIRCLE_AGENT_WALLET_ADDRESS.",
    };
  }
  return { ok: true, txHash: extractTxHash(raw), raw };
}

export async function circlePoolBalance(wallet: string): Promise<string> {
  const chain = process.env.CIRCLE_CHAIN || "ARC-TESTNET";
  const result = await run(["wallet", "balance", "--address", wallet, "--chain", chain, "--output", "json"]);
  return `${result.stdout}\n${result.stderr}`.trim();
}

export function circleConfigured(): boolean {
  return Boolean(process.env.CIRCLE_AGENT_WALLET_ADDRESS);
}
