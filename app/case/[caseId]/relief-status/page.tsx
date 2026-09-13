"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";

type Trace = {
  steps: Array<{ id: string; label: string; detail?: string; status: string }>;
  evaluation: { decision: string; grantAmount: number; reasonCodes: string[] };
};

type CasePayload = {
  reliefRequest?: { id: string; requestedAmount: number };
  decision?: { remainingBalance: number };
};

export default function ReliefStatusPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [trace, setTrace] = useState<Trace | null>(null);
  const [reliefId, setReliefId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<CasePayload>(`/api/cases/${params.caseId}`)
      .then(async (data) => {
        if (!data.reliefRequest) return;
        setReliefId(data.reliefRequest.id);
        const next = await api<Trace>(`/api/relief/${data.reliefRequest.id}/trace`);
        setTrace(next);
      })
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  async function approve() {
    if (!reliefId) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/relief/${reliefId}/approve`, {
        method: "POST",
        body: JSON.stringify({ approvedAmount: 500 }),
      });
      await api(`/api/relief/${reliefId}/execute`, {
        method: "POST",
        headers: { "Idempotency-Key": reliefId },
      });
      router.push(`/case/${params.caseId}/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Relief review could not be completed automatically. This case requires manual review.");
    } finally {
      setBusy(false);
    }
  }

  if (!trace) return <p>{error || "Loading..."}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Agent</h1>
      <Card className="space-y-4">
        {trace.steps.map((step) => (
          <div key={step.id} className="flex items-start justify-between gap-4 border-b border-[#e3d9c8] pb-3 last:border-0">
            <div>
              <p>{step.label}</p>
              {step.detail ? <p className="text-sm text-[#5c564c]">{step.detail}</p> : null}
            </div>
            <span aria-label={step.status}>{step.status === "complete" ? "✓" : "•"}</span>
          </div>
        ))}
      </Card>
      {trace.evaluation.decision === "human_review_required" ? (
        <Card className="space-y-3">
          <h2 className="text-2xl">Human review required</h2>
          <p>Residual Balance: $2,470</p>
          <p>Althea Grant: $500</p>
          <p>Program: General Medical Hardship</p>
          <p>Rule checks: passed</p>
          <Button onClick={approve} disabled={busy}>
            Approve $500
          </Button>
        </Card>
      ) : (
        <Button onClick={approve} disabled={busy}>
          Continue
        </Button>
      )}
      {error ? <p className="text-[#8a2f2f]">{error}</p> : null}
    </div>
  );
}
