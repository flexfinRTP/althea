"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/client/api";
import { explorerTx, shortenAddress } from "@/lib/arc/chain";
import { GRANT_STATUS_LABEL } from "@/lib/fund/grants";
import { formatDateTime, formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Proof = {
  program: string;
  amount: number;
  status: string;
  transactionHash?: string;
  timestamp?: string;
  network?: string;
  providerLabel?: string;
  demoLabeled?: boolean;
  allocations?: Array<{ program: string; amount: number; role: string }>;
};

const labelClass = "text-sm font-medium uppercase tracking-[0.16em] text-gold-deep";

export default function ProofPage() {
  const params = useParams<{ grantId: string }>();
  const [proof, setProof] = useState<Proof | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Proof>(`/api/public/grants/${params.grantId}`)
      .then(setProof)
      .catch((err) => setError(err.message));
  }, [params.grantId]);

  if (error && !proof) {
    return (
      <div className="space-y-4">
        <p className={labelClass}>Relief Fund</p>
        <h1 className="text-4xl tracking-tight text-green">Althea Relief Grant</h1>
        <p className="text-danger" role="alert">
          {error}
        </p>
        <Link href="/fund" className="underline decoration-line underline-offset-4">
          Relief Fund
        </Link>
      </div>
    );
  }
  if (!proof) return <AppLoader status={LOADER_STATUS.proof} />;

  const href = explorerTx(proof.transactionHash);
  const statusClass =
    proof.status === "confirmed" || proof.status === "demonstration"
      ? "text-green"
      : proof.status === "failed"
        ? "text-danger"
        : "text-gold-deep";

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={labelClass}>Relief Fund</p>
          <h1 className="mt-3 text-4xl tracking-tight text-green md:text-5xl">Althea Relief Grant</h1>
          <p className="mt-3 text-sm text-muted">
            {formatDateTime(proof.timestamp)}
            {proof.demoLabeled ? " · Demo financial model" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>USDC</Badge>
          <Badge>{proof.network ?? "Arc"}</Badge>
          <span className={`inline-flex rounded-full border border-line px-2.5 py-1 text-xs uppercase tracking-wide ${statusClass}`}>
            {GRANT_STATUS_LABEL[proof.status] ?? proof.status}
          </span>
        </div>
      </header>

      <section className="border border-ink bg-cream-elev px-6 py-8 md:px-10">
        <p className={labelClass}>Amount</p>
        <p className="mt-4 tabular-nums text-6xl tracking-tight text-gold-deep md:text-7xl">{formatUsd(proof.amount)}</p>
      </section>

      <section>
        <p className={labelClass}>Proof</p>
        <div className="mt-4 overflow-x-auto border border-ink">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <tbody>
              <ProofRow label="Program" value={proof.program} />
              <ProofRow label="Amount" value={formatUsd(proof.amount)} numeric />
              <ProofRow label="Status" value={GRANT_STATUS_LABEL[proof.status] ?? proof.status} />
              <ProofRow label="Network" value={proof.network ?? "Arc"} />
              <ProofRow
                label="Settlement"
                value={proof.providerLabel ?? "Example Medical Center Demo Settlement Account"}
              />
              {(proof.allocations ?? []).map((row) => (
                <ProofRow
                  key={`${row.program}-${row.role}`}
                  label={row.program}
                  value={formatUsd(row.amount)}
                  numeric
                />
              ))}
              <tr className="border-t border-line">
                <th className="px-4 py-4 font-medium text-muted">Transaction hash</th>
                <td className="px-4 py-4 font-mono">
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4">
                      {shortenAddress(proof.transactionHash)}
                    </a>
                  ) : (
                    proof.transactionHash ?? "pending"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {href ? (
          <p className="mt-4">
            <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4">
              Open explorer
            </a>
          </p>
        ) : null}
      </section>

      <Link href="/fund" className="inline-block underline decoration-line underline-offset-4">
        Relief Fund
      </Link>
    </div>
  );
}

function ProofRow({
  label,
  value,
  numeric = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <tr className="border-t border-line first:border-t-0">
      <th className="px-4 py-4 font-medium text-muted">{label}</th>
      <td className={`px-4 py-4 ${numeric ? "tabular-nums" : ""}`}>{value}</td>
    </tr>
  );
}
