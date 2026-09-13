"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
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

export default function ApplicationPrintPage() {
  const params = useParams<{ caseId: string }>();
  const [packet, setPacket] = useState<Packet | null>(null);

  useEffect(() => {
    api<Packet>(`/api/cases/${params.caseId}/application-packet`, { method: "POST" })
      .then(setPacket)
      .catch(() => undefined);
  }, [params.caseId]);

  if (!packet) return <AppLoader status={LOADER_STATUS.print} />;

  return (
    <div className="space-y-6 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl">Application packet</h1>
        <Button type="button" onClick={() => window.print()}>
          Print
        </Button>
      </div>
      <Logo variant="lockup" size="md" href={null} />
      <p className="text-sm uppercase tracking-[0.16em] text-gold-deep">Althea Care</p>
      <h2 className="text-4xl">Hospital financial assistance packet</h2>
      <Card className="space-y-2">
        <p>Hospital: {packet.generatedFields.hospital}</p>
        <p>Household size: {packet.generatedFields.householdSize}</p>
        <p>Annual household income: {packet.generatedFields.householdAnnualIncome}</p>
        <p>Insurance: {packet.generatedFields.insuranceStatus}</p>
        <p>Bill amount: {packet.generatedFields.billAmount}</p>
        <p>First billing statement: {packet.generatedFields.firstBillingDate || "not entered"}</p>
      </Card>
      <Card className="space-y-2">
        <h3 className="text-2xl">Required documents</h3>
        <ul className="list-disc pl-5">
          {packet.requiredDocuments.map((doc) => (
            <li key={doc.id}>
              {doc.description}
              {doc.required ? " (required)" : ""}
            </li>
          ))}
        </ul>
      </Card>
      <Card className="space-y-2">
        <h3 className="text-2xl">Submission</h3>
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
      </Card>
      <p className="text-sm text-muted">
        Educational packet. Althea does not submit this application to the hospital and does not guarantee eligibility.
      </p>
    </div>
  );
}
