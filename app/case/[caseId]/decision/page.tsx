"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";

type Payload = {
  decision?: {
    originalBalance: number;
    approvedAssistance: number;
    remainingBalance: number;
    source: string;
  };
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

  async function simulate() {
    try {
      await api(`/api/demo/cases/${params.caseId}/hospital-decision`, {
        method: "POST",
        body: JSON.stringify({ status: "approved", approvedAssistance: 15950, remainingBalance: 2470 }),
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Hospital Decision Recorded</h1>
      <Badge>SIMULATED FOR DEMO</Badge>
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
          <div className="flex justify-between border-t border-[#e3d9c8] pt-4">
            <span>Remaining</span>
            <Money amount={data.decision.remainingBalance} />
          </div>
        </Card>
      ) : (
        <Button onClick={simulate}>Simulate Hospital Approval</Button>
      )}
      {error ? <p className="text-[#8a2f2f]">{error}</p> : null}
      {data.decision ? (
        <Link className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]" href={`/case/${params.caseId}/relief`}>
          Continue
        </Link>
      ) : null}
    </div>
  );
}
