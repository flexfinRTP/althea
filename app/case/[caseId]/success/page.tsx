"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Card } from "@/components/ui/Card";
import { BillReduction } from "@/components/bill/BillReduction";
import { api } from "@/lib/client/api";
import { explorerTx } from "@/lib/arc/chain";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Payload = {
  financialInput?: { billAmount: number };
  decision?: { approvedAssistance: number; remainingBalance: number };
  grant?: { amount: number; id: string; arcTransactionHash?: string; status: string };
  reliefDecision?: { calculatedGrantAmount: number };
  allocations?: Array<{ programId: string; amount: number; role: string }>;
  route?: { selected: Array<{ name: string; amount: number }>; total: number };
};

export default function SuccessPage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Payload>(`/api/cases/${params.caseId}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  if (error) return <p>{error}</p>;
  if (!data?.financialInput || !data.decision) return <AppLoader status={LOADER_STATUS.success} />;

  const original = data.financialInput.billAmount;
  const hospital = data.decision.approvedAssistance;
  const grantReady = data.grant?.status === "confirmed" || data.grant?.status === "submitted";
  const relief = data.grant?.amount ?? data.reliefDecision?.calculatedGrantAmount ?? 0;

  return (
    <div className="space-y-8">
      <Card>
        <BillReduction original={original} hospital={hospital} relief={relief} />
      </Card>
      {!grantReady ? (
        <p className="text-sm text-muted">Settlement submitted. Waiting for confirmation.</p>
      ) : null}
      {data.route?.selected?.length ? (
        <Card>
          {data.route.selected.map((row) => (
            <p key={row.name}>
              {row.name}: {formatUsd(row.amount)}
            </p>
          ))}
          <p className="mt-2">Total relief: {formatUsd(data.route.total)}</p>
        </Card>
      ) : null}
      <h1 className="text-4xl">The hospital already had the assistance program.</h1>
      <h2 className="text-3xl">Althea made it usable.</h2>
      <p className="text-muted">
        And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.
      </p>
      <p className="text-sm text-muted">
        Settlement destination: Example Medical Center Demo Settlement Account
      </p>
      {data.grant?.arcTransactionHash ? (
        <p>
          Confirmed on Arc.{" "}
          <a href={explorerTx(data.grant.arcTransactionHash)} className="underline">
            View transaction
          </a>
        </p>
      ) : null}
      <p className="text-sm text-muted">We don&apos;t tokenize the patient.</p>
      {data.grant ? (
        <Link className="inline-flex rounded-md bg-green px-5 py-3 text-white" href={`/fund/verify/${data.grant.id}`}>
          View Relief Proof
        </Link>
      ) : (
        <Link className="inline-flex rounded-md bg-green px-5 py-3 text-white" href="/fund/verify/demo">
          View Relief Proof
        </Link>
      )}
    </div>
  );
}
