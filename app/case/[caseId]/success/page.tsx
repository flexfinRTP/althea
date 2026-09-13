"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/bill/Money";
import { api } from "@/lib/client/api";
import { explorerTx } from "@/lib/arc/chain";

type Payload = {
  financialInput?: { billAmount: number };
  decision?: { approvedAssistance: number; remainingBalance: number };
  grant?: { amount: number; id: string; arcTransactionHash?: string; status: string };
};

export default function SuccessPage() {
  const params = useParams<{ caseId: string }>();
  const [data, setData] = useState<Payload | null>(null);

  useEffect(() => {
    api<Payload>(`/api/cases/${params.caseId}`).then(setData).catch(() => undefined);
  }, [params.caseId]);

  const original = data?.financialInput?.billAmount ?? 18420;
  const hospital = data?.decision?.approvedAssistance ?? 15950;
  const relief = data?.grant?.status === "confirmed" || data?.grant?.status === "submitted" ? data.grant.amount : 0;
  const remaining = original - hospital - (relief || 0);

  return (
    <div className="space-y-8">
      <Card className="space-y-5">
        <Row label="ORIGINAL BILL" amount={original} />
        <Row label="HOSPITAL FINANCIAL ASSISTANCE" amount={-hospital} />
        <Row label="ALTHEA RELIEF" amount={-relief} />
        <div className="border-t border-[#e3d9c8] pt-4">
          <Row label="REMAINING" amount={remaining} />
        </div>
      </Card>
      <h1 className="text-4xl">The hospital already had the assistance program.</h1>
      <h2 className="text-3xl">Althea made it usable.</h2>
      <p className="text-[#5c564c]">
        And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.
      </p>
      {data?.grant?.arcTransactionHash ? (
        <p>
          Confirmed on Arc.{" "}
          <a href={explorerTx(data.grant.arcTransactionHash)} className="underline">
            View transaction
          </a>
        </p>
      ) : (
        <p>Settlement submitted. Waiting for confirmation.</p>
      )}
      {data?.grant ? (
        <Link className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]" href={`/fund/verify/${data.grant.id}`}>
          View Relief Proof
        </Link>
      ) : null}
    </div>
  );
}

function Row({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm tracking-wide text-[#5c564c]">{label}</span>
      <Money amount={amount} large />
    </div>
  );
}
