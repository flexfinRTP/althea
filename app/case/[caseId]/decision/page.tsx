"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage, FactRow } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Payload = {
  decision?: {
    originalBalance: number;
    approvedAssistance: number;
    remainingBalance: number;
    source: string;
  };
  estimate?: { estimatedAssistance?: number; estimatedRemaining?: number };
  financialInput?: { billAmount: number };
};

export default function DecisionPage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const next = await api<Payload>(`/api/cases/${params.caseId}`);
    setData(next);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, [params.caseId]);

  async function recordDecision() {
    try {
      try {
        await api(`/api/demo/cases/${params.caseId}/hospital-decision`, {
          method: "POST",
          body: JSON.stringify({
            status: "approved",
            approvedAssistance: data?.estimate?.estimatedAssistance,
            remainingBalance: data?.estimate?.estimatedRemaining,
          }),
        });
      } catch {
        await api(`/api/cases/${params.caseId}/hospital-decision`, {
          method: "POST",
          body: JSON.stringify({
            status: "approved",
            approvedAssistance: data?.estimate?.estimatedAssistance,
            remainingBalance: data?.estimate?.estimatedRemaining,
            source: "manual_verified",
          }),
        });
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!data && !error) return <AppLoader status={LOADER_STATUS.decision} />;
  if (!data) {
    return (
      <AppPage kicker="Hospital" title="Hospital Decision Recorded">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }

  return (
    <AppPage
      kicker="Hospital"
      title="Hospital Decision Recorded"
      aside={data.decision?.source === "simulated_demo" ? <Badge>SIMULATED FOR DEMO</Badge> : null}
    >
      {data.decision ? (
        <Card className="space-y-4">
          <FactRow label="Original balance" value={<Money amount={data.decision.originalBalance} />} />
          <FactRow label="Hospital assistance" value={<Money amount={-data.decision.approvedAssistance} />} />
          <FactRow
            emphasize
            label="Remaining"
            value={<Money amount={data.decision.remainingBalance} />}
          />
        </Card>
      ) : (
        <ActionRow>
          <Button onClick={recordDecision}>Simulate Hospital Approval</Button>
        </ActionRow>
      )}
      <AppError>{error}</AppError>
      <ActionRow>
        {data.decision ? (
          <AppLink href={`/case/${params.caseId}/relief`}>Continue</AppLink>
        ) : null}
        <AppLink variant="ghost" href={`/case/${params.caseId}`}>
          Case
        </AppLink>
      </ActionRow>
    </AppPage>
  );
}
