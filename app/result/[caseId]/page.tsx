"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";

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
    };
  };
  hospital?: { name: string };
  timeline?: {
    applicationPeriodDay?: number;
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

  if (error) return <p>{error}</p>;
  if (!data?.estimate || !data.financialInput) return <p>Loading...</p>;

  const citations = data.policy?.structuredPolicy.citations ?? [];
  const matched = data.policy?.structuredPolicy.discountedCareRules.find((rule) =>
    data.estimate?.matchedRuleIds.includes(rule.id),
  );

  return (
    <div className="space-y-6">
      <p className="text-sm uppercase tracking-[0.16em] text-[#5c564c]">Estimate</p>
      <h1 className="text-4xl">You may qualify for financial assistance.</h1>
      <Card className="space-y-5">
        <div className="flex items-baseline justify-between">
          <span>Original bill</span>
          <Money amount={data.financialInput.billAmount} />
        </div>
        <div className="flex items-baseline justify-between">
          <span>Potential assistance</span>
          <Money amount={data.estimate.estimatedAssistance ?? 0} />
        </div>
        <div className="flex items-baseline justify-between border-t border-[#e3d9c8] pt-4">
          <span>Potential remaining</span>
          <Money amount={data.estimate.estimatedRemaining ?? 0} />
        </div>
      </Card>
      <p className="text-sm text-[#5c564c]">{data.disclaimer}</p>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Why am I seeing this?
      </Button>
      {open ? (
        <Card className="space-y-3" aria-label="Estimate explanation">
          <h2 className="text-2xl">Why</h2>
          <p>Household: {data.financialInput.householdSize}</p>
          <p>Income: {formatUsd(data.financialInput.householdAnnualIncome)}</p>
          <p>Insurance: {data.financialInput.insuranceStatus === "insured" ? "Insured" : "Uninsured"}</p>
          <p>
            Applicable policy bracket:{" "}
            {matched ? `${matched.minFplPercent}–${matched.maxFplPercent}% FPL matched` : "matched"}
          </p>
          <p>Source: hospital Financial Assistance Policy</p>
          {data.estimate.reasons.map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
          <div className="space-y-2 text-sm text-[#5c564c]">
            {citations
              .filter((citation) => data.estimate?.matchedRuleIds.length)
              .map((citation) => (
                <p key={citation.id}>
                  {citation.section}
                  {citation.page ? `, page ${citation.page}` : ""}: {citation.shortExcerpt}
                </p>
              ))}
          </div>
          <p className="text-sm">View policy source: Demonstration Policy, Example Medical Center 2026 FAP.</p>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Card>
      ) : null}
      {data.timeline ? (
        <Card>
          <h2 className="mb-3 text-2xl">Federal timeline</h2>
          <p>First billing statement: {data.timeline.firstBillingDate === "2026-08-20" ? "August 20, 2026" : data.timeline.firstBillingDate}</p>
          <p>
            Approximate federal FAP application-period status: Day {data.timeline.applicationPeriodDay} of 240
          </p>
          {data.timeline.messages.map((message) => (
            <p key={message} className="mt-2 text-sm text-[#5c564c]">
              {message}
            </p>
          ))}
        </Card>
      ) : null}
      <Link
        href={`/application/${params.caseId}`}
        className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]"
      >
        Prepare Application
      </Link>
    </div>
  );
}
