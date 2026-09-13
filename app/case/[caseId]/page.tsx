"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { LOADER_STATUS } from "@/lib/ui/loader";

type CasePayload = {
  case: { status: string };
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

  useEffect(() => {
    api<CasePayload>(`/api/cases/${params.caseId}`).then(setData).catch(() => undefined);
  }, [params.caseId]);

  if (!data) return <AppLoader status={LOADER_STATUS.case} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Case</h1>
      <Card>
        <ol className="space-y-2">
          {STEPS.map((step) => (
            <li key={step} className={data.case.status === step ? "font-medium" : "text-muted"}>
              {step.replaceAll("_", " ")}
            </li>
          ))}
        </ol>
      </Card>
      <div className="flex flex-wrap gap-4">
        <Link href={`/application/${params.caseId}`}>Application</Link>
        <Link href={`/case/${params.caseId}/decision`}>Hospital decision</Link>
        <Link href={`/case/${params.caseId}/relief`}>Althea Relief</Link>
        <Link href={`/case/${params.caseId}/verify`}>Liveness check</Link>
        <Link href={`/case/${params.caseId}/relief-status`}>Relief Agent</Link>
        <Link href={`/case/${params.caseId}/success`}>Final amount</Link>
      </div>
    </div>
  );
}
