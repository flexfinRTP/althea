"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Payload = {
  decision?: { remainingBalance: number };
  program?: { id: string; name: string; maxGrant: number; demoAvailableCapital: number };
};

export default function ReliefPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Payload>(`/api/cases/${params.caseId}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  async function requestRelief() {
    if (!data?.program || data.decision?.remainingBalance == null) return;
    try {
      await api(`/api/cases/${params.caseId}/relief-request`, {
        method: "POST",
        body: JSON.stringify({
          programId: data.program.id,
          requestedAmount: Math.min(data.program.maxGrant, data.decision.remainingBalance),
        }),
      });
      router.push(`/case/${params.caseId}/verify`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (error && !data) return <p>{error}</p>;
  if (!data) return <AppLoader status={LOADER_STATUS.reliefRequest} />;

  const remaining = data.decision?.remainingBalance;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Hospital assistance helped.</h1>
      <h2 className="text-3xl">
        But {remaining !== undefined ? <Money amount={remaining} /> : "..."} remains.
      </h2>
      <Card className="space-y-3">
        <p>{data.program?.name ?? "Program"}</p>
        {data.program ? <p>Demo available capital: {formatUsd(data.program.demoAvailableCapital)}</p> : null}
        {data.program ? <p>Maximum standard grant: {formatUsd(data.program.maxGrant)}</p> : null}
        <p>Patient fee: $0</p>
      </Card>
      {error ? <p className="text-danger">{error}</p> : null}
      <Button onClick={requestRelief} disabled={!data.program || remaining == null}>
        Check Althea Relief
      </Button>
      <Link href={`/case/${params.caseId}`}>Back to case</Link>
    </div>
  );
}
