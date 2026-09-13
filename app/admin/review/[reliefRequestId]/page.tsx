"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Review = {
  reliefRequest: { id: string; requestedAmount: number; residualBalance: number; status: string };
  decision?: { remainingBalance: number };
  reliefDecision?: { calculatedGrantAmount: number; reasonCodes: string[]; decision: string };
  program: { name: string; maxGrant: number };
  facts: { residualBalance: number };
};

export default function ReviewPage() {
  const params = useParams<{ reliefRequestId: string }>();
  const [data, setData] = useState<Review | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Review>(`/api/relief/${params.reliefRequestId}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [params.reliefRequestId]);

  async function approve() {
    if (!data) return;
    setBusy(true);
    try {
      await api(`/api/relief/${params.reliefRequestId}/approve`, {
        method: "POST",
        body: JSON.stringify({
          approvedAmount: data.reliefDecision?.calculatedGrantAmount ?? data.reliefRequest.requestedAmount,
        }),
      });
      const next = await api<Review>(`/api/relief/${params.reliefRequestId}`);
      setData(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) return <p>{error}</p>;
  if (!data) return <AppLoader status={LOADER_STATUS.review} />;

  const grant = data.reliefDecision?.calculatedGrantAmount ?? data.reliefRequest.requestedAmount;
  const residual = data.facts.residualBalance || data.reliefRequest.residualBalance;

  return (
    <Card className="space-y-3">
      <h1 className="text-3xl">Human review required</h1>
      <p>Relief request: {data.reliefRequest.id}</p>
      <p>Residual Balance: {formatUsd(residual)}</p>
      <p>Althea Grant: {formatUsd(grant)}</p>
      <p>Program: {data.program.name}</p>
      <p>Rule checks: {data.reliefDecision?.reasonCodes.join(", ") || data.reliefRequest.status}</p>
      <Button onClick={approve} disabled={busy}>
        Approve {formatUsd(grant)}
      </Button>
      {error ? <p className="text-danger">{error}</p> : null}
    </Card>
  );
}
