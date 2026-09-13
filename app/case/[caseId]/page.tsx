"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppError, AppNavCard, AppPage, FactRow, StatusList } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";
import { formatIsoDate } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type CasePayload = {
  case: { status: string };
  hospital?: { name: string };
  financialInput?: { billAmount: number };
  timeline?: { applicationPeriodDay?: number; firstBillingDate?: string };
};

const STEPS = [
  "draft",
  "fap_analyzed",
  "application_prepared",
  "application_submitted",
  "residual_verified",
  "relief_requested",
  "world_check_complete",
  "relief_review",
  "grant_executed",
];

export default function CasePage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<CasePayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<CasePayload>(`/api/cases/${params.caseId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Case could not be loaded."));
  }, [params.caseId]);

  if (error && !data) {
    return (
      <AppPage kicker="Case" title={params.caseId}>
        <AppError>{error}</AppError>
      </AppPage>
    );
  }
  if (!data) return <AppLoader status={LOADER_STATUS.case} />;

  return (
    <AppPage
      kicker="Case"
      title={params.caseId}
      aside={<Badge>{data.case.status.replaceAll("_", " ")}</Badge>}
    >
      <Card className="space-y-4">
        {data.hospital?.name ? <FactRow label="Hospital" value={data.hospital.name} /> : null}
        {data.financialInput ? (
          <FactRow label="Bill" value={<Money amount={data.financialInput.billAmount} />} />
        ) : null}
        {data.timeline?.firstBillingDate ? (
          <FactRow label="First billing statement" value={formatIsoDate(data.timeline.firstBillingDate)} />
        ) : null}
        {data.timeline?.applicationPeriodDay != null ? (
          <FactRow label="Application period" value={`Day ${data.timeline.applicationPeriodDay} of 240`} />
        ) : null}
      </Card>
      <Card>
        <StatusList items={STEPS} current={data.case.status} />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <AppNavCard href={`/application/${params.caseId}`} kicker="01" label="Application" />
        <AppNavCard href={`/case/${params.caseId}/decision`} kicker="02" label="Hospital decision" />
        <AppNavCard href={`/case/${params.caseId}/relief`} kicker="03" label="Althea Relief" />
        <AppNavCard href={`/case/${params.caseId}/verify`} kicker="04" label="Liveness check" />
        <AppNavCard href={`/case/${params.caseId}/relief-status`} kicker="05" label="Relief Agent" />
        <AppNavCard href={`/case/${params.caseId}/success`} kicker="06" label="Final amount" />
      </div>
    </AppPage>
  );
}
