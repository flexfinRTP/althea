"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  if (!data) return <AppLoader status={LOADER_STATUS.decision} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Hospital Decision Recorded</h1>
      {data.decision?.source === "simulated_demo" ? <Badge>SIMULATED FOR DEMO</Badge> : null}
      {data.decision ? (
        <Card className="space-y-4">
          <div className="flex justify-between">
            <span>Original balance</span>
            <Money amount={data.decision.originalBalance} />
          </div>
          <div className="flex justify-between">
            <span>Hospital assistance</span>
            <Money amount={-data.decision.approvedAssistance} />
          </div>
          <div className="flex justify-between border-t border-line pt-4">
            <span>Remaining</span>
            <Money amount={data.decision.remainingBalance} />
          </div>
        </Card>
      ) : (
        <Button onClick={recordDecision}>Simulate Hospital Approval</Button>
      )}
      {error ? <p className="text-danger">{error}</p> : null}
      {data.decision ? (
        <Link className="inline-flex rounded-md bg-green px-5 py-3 text-white" href={`/case/${params.caseId}/relief`}>
          Continue
        </Link>
      ) : null}
    </div>
  );
}
