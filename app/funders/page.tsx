"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLoader } from "@/components/ui/AppLoader";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Funder = {
  id: string;
  name: string;
  kind: string;
  treasuryUsdc: number;
  committed: number;
  grantsMatched: number;
  programs: Array<{ programId: string; name: string; remaining: number }>;
};

export default function FundersPage() {
  const [funders, setFunders] = useState<Funder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ funders: Funder[] }>("/api/funders")
      .then((data) => setFunders(data.funders))
      .catch((err) => setError(err instanceof Error ? err.message : "Funders could not be loaded."));
  }, []);

  if (!funders && !error) return <AppLoader status={LOADER_STATUS.funders} />;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Funders</p>
        <h1 className="mt-3 text-4xl tracking-tight text-green">Relief programs</h1>
      </header>
      {error ? (
        <p className="text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {(funders ?? []).map((funder) => (
          <Card key={funder.id}>
            <p className="text-xs uppercase tracking-wide text-muted">{funder.kind}</p>
            <h2 className="mt-2 text-2xl">{funder.name}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Treasury</dt>
                <dd className="tabular-nums text-xl">{formatUsd(funder.treasuryUsdc)}</dd>
              </div>
              <div>
                <dt className="text-muted">Committed</dt>
                <dd className="tabular-nums text-xl">{formatUsd(funder.committed)}</dd>
              </div>
              <div>
                <dt className="text-muted">Active programs</dt>
                <dd className="tabular-nums text-xl">{funder.programs.length}</dd>
              </div>
              <div>
                <dt className="text-muted">Grants matched</dt>
                <dd className="tabular-nums text-xl">{funder.grantsMatched}</dd>
              </div>
            </dl>
            <Link href={`/funders/${funder.id}`} className="mt-5 inline-block underline decoration-line underline-offset-4">
              Open console
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
