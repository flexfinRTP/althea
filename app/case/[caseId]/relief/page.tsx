"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";

type Payload = {
  decision?: { remainingBalance: number };
};

export default function ReliefPage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Payload>(`/api/cases/${params.caseId}`)
      .then((data) => setRemaining(data.decision?.remainingBalance ?? null))
      .catch((err) => setError(err.message));
  }, [params.caseId]);

  async function requestRelief() {
    try {
      await api(`/api/cases/${params.caseId}/relief-request`, {
        method: "POST",
        body: JSON.stringify({ programId: "cz_general_v1", requestedAmount: 500 }),
      });
      router.push(`/case/${params.caseId}/verify`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Hospital assistance helped.</h1>
      <h2 className="text-3xl">But {remaining !== null ? <Money amount={remaining} /> : "$2,470"} remains.</h2>
      <Card className="space-y-3">
        <p>Althea General Medical Hardship Fund</p>
        <p>Demo available capital: $25,000</p>
        <p>Maximum standard grant: $500</p>
        <p>Patient fee: $0</p>
      </Card>
      {error ? <p className="text-[#8a2f2f]">{error}</p> : null}
      <Button onClick={requestRelief}>Check Althea Relief</Button>
      <Link href={`/case/${params.caseId}`}>Back to case</Link>
    </div>
  );
}
