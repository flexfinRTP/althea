"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { BillReduction } from "@/components/bill/BillReduction";
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
  const grantReady =
    data?.grant?.status === "confirmed" || data?.grant?.status === "submitted";
  const relief = grantReady ? data?.grant?.amount ?? 500 : 500;

  return (
    <div className="space-y-8">
      <Card>
        <BillReduction original={original} hospital={hospital} relief={relief} />
      </Card>
      {!grantReady ? (
        <p className="text-sm text-[#5c564c]">
          Settlement submitted. Waiting for confirmation.
        </p>
      ) : null}
      <h1 className="text-4xl">The hospital already had the assistance program.</h1>
      <h2 className="text-3xl">Althea made it usable.</h2>
      <p className="text-[#5c564c]">
        And when that assistance stopped short, Althea carried transparent charitable relief the rest of the way.
      </p>
      <p className="text-sm text-[#5c564c]">
        Settlement destination: Example Medical Center Demo Settlement Account
      </p>
      {data?.grant?.arcTransactionHash ? (
        <p>
          Confirmed on Arc.{" "}
          <a href={explorerTx(data.grant.arcTransactionHash)} className="underline">
            View transaction
          </a>
        </p>
      ) : null}
      <p className="text-sm text-[#5c564c]">We don&apos;t tokenize the patient.</p>
      {data?.grant ? (
        <Link className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]" href={`/fund/verify/${data.grant.id}`}>
          View Relief Proof
        </Link>
      ) : (
        <Link className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]" href="/fund/verify/demo">
          View Relief Proof
        </Link>
      )}
    </div>
  );
}
