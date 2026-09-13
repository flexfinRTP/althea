"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";

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

  if (!packet) return <p>Loading...</p>;

  return (
    <div className="space-y-6 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl">Application packet</h1>
        <Button type="button" onClick={() => window.print()}>
          Print
        </Button>
      </div>
      <p className="text-sm uppercase tracking-[0.16em] text-[#5c564c]">Althea Care</p>
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
      </Card>
      <p className="text-sm text-[#5c564c]">
        Educational packet. Althea does not submit this application to the hospital and does not guarantee eligibility.
      </p>
    </div>
  );
}
