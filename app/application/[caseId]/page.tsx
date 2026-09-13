"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Packet = {
  requiredDocuments: Array<{ id: string; description: string; required: boolean }>;
  submissionInstructions: string[];
  applicationUrl?: string;
  generatedFields: Record<string, string>;
};

export default function ApplicationPage() {
  const params = useParams<{ caseId: string }>();
  const [packet, setPacket] = useState<Packet | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Packet>(`/api/cases/${params.caseId}/application-packet`, { method: "POST" })
      .then(setPacket)
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  async function markSubmitted() {
    try {
      await api(`/api/cases/${params.caseId}/mark-submitted`, {
        method: "POST",
        body: JSON.stringify({ submittedAt: new Date().toISOString() }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (error && !packet) {
    return (
      <AppPage kicker="Application" title="Application">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }
  if (!packet) return <AppLoader status={LOADER_STATUS.application} />;

  return (
    <AppPage kicker="Application" title="Application">
      <Card className="space-y-4">
        <h2 className="text-2xl tracking-tight text-green">Required documents</h2>
        <ul className="space-y-2">
          {packet.requiredDocuments.map((doc) => (
            <li key={doc.id} className="rounded-2xl bg-cream px-4 py-3">
              {doc.description}
              {doc.required ? " (required)" : ""}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl tracking-tight text-green">Submission methods</h2>
        {packet.submissionInstructions.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {packet.applicationUrl ? <p>Hospital application: {packet.applicationUrl}</p> : null}
        {packet.generatedFields.billingPhone || packet.generatedFields.billingAddress ? (
          <p>
            Hospital contact:{" "}
            {[packet.generatedFields.billingName, packet.generatedFields.billingPhone, packet.generatedFields.billingAddress]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        {packet.generatedFields.applicationMethods ? (
          <p>Submission methods: {packet.generatedFields.applicationMethods}</p>
        ) : null}
        <p>Important dates: first billing statement {packet.generatedFields.firstBillingDate || "not entered"}.</p>
      </Card>
      <ActionRow>
        <Button onClick={markSubmitted} disabled={submitted}>
          Mark as Submitted
        </Button>
        <AppLink variant="ghost" href={`/application/${params.caseId}/print`}>
          Print application packet
        </AppLink>
        <AppLink href={`/case/${params.caseId}`}>Continue to case</AppLink>
      </ActionRow>
      {submitted ? (
        <p className="rounded-2xl bg-gold-soft/40 px-5 py-4 text-sm">
          Recorded as submitted by you. Althea did not send this application to the hospital.
        </p>
      ) : null}
      <AppError>{error}</AppError>
    </AppPage>
  );
}
