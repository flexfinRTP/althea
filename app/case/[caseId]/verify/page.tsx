"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IDKitRequestWidget, selfieCheckLegacy } from "@worldcoin/idkit";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";

type RpContext = {
  rp_id: string;
  nonce: string;
  created_at: number | string;
  expires_at: number | string;
  signature: string;
};

export default function VerifyPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rp, setRp] = useState<RpContext | null>(null);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_WORLD_APP_ID);

  const preset = useMemo(() => selfieCheckLegacy({ signal: params.caseId }), [params.caseId]);

  async function start() {
    setError("");
    try {
      const signature = await api<RpContext>("/api/world/rp-signature", {
        method: "POST",
        body: JSON.stringify({ action: process.env.NEXT_PUBLIC_WORLD_ACTION_ID }),
      });
      setRp(signature);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification service unavailable. Try again.");
    }
  }

  async function manual() {
    await api("/api/world/verify", {
      method: "POST",
      body: JSON.stringify({ caseId: params.caseId, status: "manual_review" }),
    });
    router.push(`/case/${params.caseId}/relief-status`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief liveness check</h1>
      <Card className="space-y-4">
        <p>
          Althea Relief is supported by limited charitable funds. We use World Selfie Check as one liveness signal to help reduce automated abuse of this separate fund.
        </p>
        <p>
          This does not determine your eligibility for your hospital&apos;s financial-assistance program.
        </p>
      </Card>
      {complete ? <p>Liveness check complete.</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}
      {!configured ? (
        <p className="text-sm text-muted">
          World app credentials are not configured. Request Manual Review to continue the demo path without faking a Selfie Check proof.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button onClick={start} disabled={!configured}>
          Continue
        </Button>
        <Button variant="ghost" onClick={manual}>
          Request Manual Review
        </Button>
        <Button variant="ghost" onClick={start} disabled={!configured}>
          Try Again
        </Button>
      </div>
      {rp && process.env.NEXT_PUBLIC_WORLD_APP_ID ? (
        <IDKitRequestWidget
          open={open}
          onOpenChange={setOpen}
          app_id={process.env.NEXT_PUBLIC_WORLD_APP_ID as `app_${string}`}
          action={process.env.NEXT_PUBLIC_WORLD_ACTION_ID || "althea-relief-liveness"}
          rp_context={rp}
          allow_legacy_proofs={true}
          environment={(process.env.NEXT_PUBLIC_WORLD_ENVIRONMENT as "staging" | "production") || "staging"}
          preset={preset}
          handleVerify={async (result) => {
            const response = await fetch("/api/world/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                caseId: params.caseId,
                rp_id: rp.rp_id,
                idkitResponse: result,
              }),
            });
            if (!response.ok) {
              throw new Error("We couldn't complete the liveness check. Try again or request manual review.");
            }
          }}
          onSuccess={() => {
            setComplete(true);
            router.push(`/case/${params.caseId}/relief-status`);
          }}
        />
      ) : null}
    </div>
  );
}
