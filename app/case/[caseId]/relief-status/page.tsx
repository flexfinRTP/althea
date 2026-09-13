"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AgentTrace, AgentStep } from "@/components/relief/AgentTrace";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Trace = {
  steps: AgentStep[];
  evaluation: { decision: string; grantAmount: number; reasonCodes: string[] };
  facts?: { residualBalance: number };
  program?: { name: string; maxGrant: number };
};

type CasePayload = {
  reliefRequest?: { id: string; requestedAmount: number };
  decision?: { remainingBalance: number };
  program?: { name: string };
};

export default function ReliefStatusPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [trace, setTrace] = useState<Trace | null>(null);
  const [reliefId, setReliefId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [programName, setProgramName] = useState("");

  useEffect(() => {
    api<CasePayload>(`/api/cases/${params.caseId}`)
      .then(async (data) => {
        if (!data.reliefRequest) return;
        setReliefId(data.reliefRequest.id);
        setRemaining(data.decision?.remainingBalance ?? data.reliefRequest.requestedAmount);
        setProgramName(data.program?.name ?? "");
        const next = await api<Trace>(`/api/relief/${data.reliefRequest.id}/trace`);
        setTrace(next);
        if (next.facts?.residualBalance != null) setRemaining(next.facts.residualBalance);
        if (next.program?.name) setProgramName(next.program.name);
      })
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  const executionSteps = useMemo<AgentStep[]>(() => {
    const steps: AgentStep[] = [];
    if (phase === "eval") return steps;
    steps.push({
      id: "human-approved",
      label: "Human approval required...",
      detail: "Approved",
      status: "complete",
    });
    if (phase === "approved") return steps;
    steps.push({
      id: "prep",
      label: "Preparing settlement...",
      status: "complete",
    });
    if (phase === "settling") return steps;
    if (phase === "sent") {
      steps.push({
        id: "send",
        label: `Sending ${trace?.evaluation.grantAmount ?? ""} USDC...`,
        detail: "Confirmed",
        status: "complete",
      });
    }
    if (phase === "blocked") {
      steps.push({
        id: "send",
        label: `Sending ${trace?.evaluation.grantAmount ?? ""} USDC...`,
        detail: "Relief review could not be completed automatically. This case requires manual review.",
        status: "blocked",
      });
    }
    return steps;
  }, [phase, trace]);

  async function approve() {
    if (!reliefId) return;
    setBusy(true);
    setError("");
    try {
      setPhase("approved");
      await api(`/api/relief/${reliefId}/approve`, {
        method: "POST",
        body: JSON.stringify({ approvedAmount: trace?.evaluation.grantAmount }),
      });
      setPhase("settling");
      await api(`/api/relief/${reliefId}/execute`, {
        method: "POST",
        headers: { "Idempotency-Key": reliefId },
      });
      setPhase("sent");
      window.setTimeout(() => router.push(`/case/${params.caseId}/success`), 900);
    } catch (err) {
      setPhase("blocked");
      setError(
        err instanceof Error
          ? err.message
          : "Relief review could not be completed automatically. This case requires manual review.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (error && !trace) return <p>{error}</p>;
  if (!trace) return <AppLoader status={LOADER_STATUS.relief} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Agent</h1>
      <Card>
        <AgentTrace steps={trace.steps} executionSteps={executionSteps} />
      </Card>
      {trace.evaluation.decision === "human_review_required" && phase === "eval" ? (
        <Card className="space-y-3">
          <h2 className="text-2xl">Human review required</h2>
          <p>Residual Balance: {remaining !== null ? formatUsd(remaining) : "..."}</p>
          <p>Althea Grant: {formatUsd(trace.evaluation.grantAmount)}</p>
          <p>Program: {programName || trace.program?.name}</p>
          <p>Rule checks: {trace.evaluation.reasonCodes.join(", ")}</p>
          <Button onClick={approve} disabled={busy}>
            Approve {formatUsd(trace.evaluation.grantAmount)}
          </Button>
        </Card>
      ) : null}
      {phase === "eval" && trace.evaluation.decision !== "human_review_required" ? (
        <Button onClick={approve} disabled={busy}>
          Continue
        </Button>
      ) : null}
      {error ? <p className="text-danger">{error}</p> : null}
    </div>
  );
}
