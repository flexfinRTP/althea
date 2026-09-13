"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage, FactRow } from "@/components/app/AppChrome";
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

  if (error && !data) {
    return (
      <AppPage kicker="Relief" title="Hospital assistance helped.">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }
  if (!data) return <AppLoader status={LOADER_STATUS.reliefRequest} />;

  const remaining = data.decision?.remainingBalance;

  return (
    <AppPage
      kicker="Relief"
      title="Hospital assistance helped."
      lead={
        remaining !== undefined ? (
          <>
            Remaining <Money amount={remaining} />
          </>
        ) : (
          "Remaining ..."
        )
      }
    >
      <Card className="space-y-4">
        <FactRow label="Program" value={data.program?.name ?? "Program"} />
        {data.program ? (
          <FactRow label="Demo available capital" value={formatUsd(data.program.demoAvailableCapital)} />
        ) : null}
        {data.program ? (
          <FactRow label="Maximum standard grant" value={formatUsd(data.program.maxGrant)} />
        ) : null}
        <FactRow emphasize label="Patient fee" value="$0" />
      </Card>
      <AppError>{error}</AppError>
      <ActionRow>
        <Button onClick={requestRelief} disabled={!data.program || remaining == null}>
          Check Althea Relief
        </Button>
        <AppLink variant="ghost" href={`/case/${params.caseId}`}>
          Back to case
        </AppLink>
      </ActionRow>
    </AppPage>
  );
}
