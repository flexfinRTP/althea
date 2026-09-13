"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage, FactRow } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { ExplainDrawer } from "@/components/fap/ExplainDrawer";
import { TimelineCard } from "@/components/fap/TimelineCard";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type ResultPayload = {
  estimate?: {
    outcome: string;
    estimatedAssistance?: number;
    estimatedRemaining?: number;
    fplPercent?: number;
    reasons: string[];
    assumptions: string[];
    matchedRuleIds: string[];
  };
  financialInput?: {
    billAmount: number;
    householdSize: number;
    householdAnnualIncome: number;
    insuranceStatus: string;
  };
  policy?: {
    structuredPolicy: {
      citations: Array<{ id: string; page?: number; section?: string; shortExcerpt?: string }>;
      discountedCareRules: Array<{ id: string; minFplPercent?: number; maxFplPercent?: number }>;
      freeCareRules: Array<{ id: string; minFplPercent?: number; maxFplPercent?: number }>;
    };
  };
  hospital?: { id: string; name: string };
  timeline?: {
    applicationPeriodDay?: number;
    notificationPeriodDay?: number;
    firstBillingDate?: string;
    messages: string[];
  };
  disclaimer: string;
};

export default function ResultPage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<ResultPayload | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ResultPayload>(`/api/cases/${params.caseId}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  if (error) {
    return (
      <AppPage kicker="Estimate" title="Estimate">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }
  if (!data?.estimate || !data.financialInput) return <AppLoader status={LOADER_STATUS.estimate} />;

  const citations = data.policy?.structuredPolicy.citations ?? [];
  const rules = [
    ...(data.policy?.structuredPolicy.freeCareRules ?? []),
    ...(data.policy?.structuredPolicy.discountedCareRules ?? []),
  ];
  const matched = rules.find((rule) => data.estimate?.matchedRuleIds.includes(rule.id));
  const hospitalId = data.hospital?.id;
  const heading =
    data.estimate.outcome === "potentially_ineligible"
      ? "You may not qualify based on this published policy."
      : data.estimate.outcome === "needs_more_information"
        ? "More information is needed."
        : "You may qualify for financial assistance.";

  return (
    <AppPage kicker="Estimate" title={heading}>
      <Card className="space-y-5">
        <FactRow label="Original bill" value={<Money amount={data.financialInput.billAmount} />} />
        <FactRow label="Potential assistance" value={<Money amount={data.estimate.estimatedAssistance ?? 0} />} />
        <FactRow
          emphasize
          label="Potential remaining"
          value={<Money amount={data.estimate.estimatedRemaining ?? 0} />}
        />
      </Card>
      <p className="text-sm text-muted">{data.disclaimer}</p>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Why am I seeing this?
      </Button>
      <ExplainDrawer open={open} onClose={() => setOpen(false)}>
        <h2 className="text-2xl tracking-tight text-green">Why</h2>
        <p className="mt-4">Household: {data.financialInput.householdSize}</p>
        <p>Income: {formatUsd(data.financialInput.householdAnnualIncome)}</p>
        <p>Insurance: {data.financialInput.insuranceStatus === "insured" ? "Insured" : "Uninsured"}</p>
        <p className="mt-3">
          Applicable policy bracket:{" "}
          {matched ? `${matched.minFplPercent}–${matched.maxFplPercent}% FPL matched` : "matched"}
        </p>
        <p>Source: hospital Financial Assistance Policy</p>
        {data.estimate.reasons.map((reason) => (
          <p key={reason} className="mt-2">
            {reason}
          </p>
        ))}
        <div className="mt-4 space-y-2 text-sm text-muted">
          {citations.map((citation) => (
            <p key={citation.id}>
              {citation.section}
              {citation.page ? `, page ${citation.page}` : ""}: {citation.shortExcerpt}
            </p>
          ))}
        </div>
        <p className="mt-4 text-sm">View policy source</p>
        <AppLink
          className="mt-3"
          variant="ghost"
          href={hospitalId ? `/policy/${hospitalId}` : "/check"}
        >
          Demonstration Policy, {data.hospital?.name ?? "hospital"} FAP.
        </AppLink>
        <Button className="mt-6" variant="ghost" onClick={() => setOpen(false)}>
          Close
        </Button>
      </ExplainDrawer>
      {data.timeline ? (
        <TimelineCard
          firstBillingDate={data.timeline.firstBillingDate}
          applicationPeriodDay={data.timeline.applicationPeriodDay}
          notificationPeriodDay={data.timeline.notificationPeriodDay}
          messages={data.timeline.messages}
        />
      ) : null}
      <ActionRow>
        <AppLink href={`/application/${params.caseId}`}>Prepare Application</AppLink>
      </ActionRow>
    </AppPage>
  );
}
