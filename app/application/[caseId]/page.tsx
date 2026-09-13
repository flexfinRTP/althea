"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  if (error) return <p>{error}</p>;
  if (!packet) return <AppLoader status={LOADER_STATUS.application} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Application</h1>
      <Card className="space-y-3">
        <h2 className="text-2xl">Required documents</h2>
        <ul className="list-disc space-y-1 pl-5">
          {packet.requiredDocuments.map((doc) => (
            <li key={doc.id}>
              {doc.description}
              {doc.required ? " (required)" : ""}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="space-y-3">
        <h2 className="text-2xl">Submission methods</h2>
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
      <Button onClick={markSubmitted} disabled={submitted}>
        Mark as Submitted
      </Button>
      {submitted ? (
        <p>Recorded as submitted by you. Althea did not send this application to the hospital.</p>
      ) : null}
      <Link className="block text-green" href={`/application/${params.caseId}/print`}>
        Print application packet
      </Link>
      <Link className="block text-green" href={`/case/${params.caseId}`}>
        Continue to case
      </Link>
    </div>
  );
}
