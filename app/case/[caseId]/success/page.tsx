"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage, FactRow } from "@/components/app/AppChrome";
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

  if (error && !data) {
    return (
      <AppPage kicker="Final amount" title="Final amount">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }
  if (!data?.financialInput || !data.decision) return <AppLoader status={LOADER_STATUS.success} />;

  const original = data.financialInput.billAmount;
  const hospital = data.decision.approvedAssistance;
  const grantReady = data.grant?.status === "confirmed" || data.grant?.status === "submitted";
  const relief = data.grant?.amount ?? data.reliefDecision?.calculatedGrantAmount ?? 0;
  const proofHref = data.grant ? `/fund/verify/${data.grant.id}` : "/fund/verify/demo";
  const txHref = data.grant?.arcTransactionHash ? explorerTx(data.grant.arcTransactionHash) : null;

  return (
    <AppPage
      kicker="Final amount"
      title="The hospital already had the assistance program."
      lead="Althea made it usable."
    >
      <Card>
        <BillReduction original={original} hospital={hospital} relief={relief} />
      </Card>
      {!grantReady ? (
        <p className="rounded-2xl bg-cream-2 px-5 py-4 text-sm text-muted">
          Settlement submitted. Waiting for confirmation.
        </p>
      ) : null}
      {data.route?.selected?.length ? (
        <Card className="space-y-3">
          {data.route.selected.map((row) => (
            <FactRow key={row.name} label={row.name} value={formatUsd(row.amount)} />
          ))}
          <FactRow emphasize label="Total relief" value={formatUsd(data.route.total)} />
        </Card>
      ) : null}
      <p className="text-muted">
        And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.
      </p>
      <p className="text-sm text-muted">
        Settlement destination: Example Medical Center Demo Settlement Account
      </p>
      {data.grant?.arcTransactionHash ? <p>Confirmed on Arc.</p> : null}
      <p className="text-sm text-muted">We don&apos;t tokenize the patient.</p>
      <ActionRow>
        <AppLink href={proofHref}>View Relief Proof</AppLink>
        {txHref ? (
          <AppLink href={txHref} variant="ghost" external>
            View transaction
          </AppLink>
        ) : null}
        <AppLink variant="ghost" href={`/case/${params.caseId}`}>
          Case
        </AppLink>
      </ActionRow>
    </AppPage>
  );
}
