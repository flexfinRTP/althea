"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { explorerTx } from "@/lib/arc/chain";

type Proof = {
  program: string;
  amount: number;
  status: string;
  transactionHash?: string;
  timestamp?: string;
  network?: string;
};

export default function ProofPage() {
  const params = useParams<{ grantId: string }>();
  const [proof, setProof] = useState<Proof | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Proof>(`/api/public/grants/${params.grantId}`)
      .then(setProof)
      .catch((err) => setError(err.message));
  }, [params.grantId]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Grant</h1>
      {error ? <p>{error}</p> : null}
      {proof ? (
        <Card className="space-y-3">
          <p>Program: {proof.program}</p>
          <p>Amount: {formatUsd(proof.amount)}</p>
          <p>Status: {proof.status}</p>
          <p>Network: {proof.network ?? "Arc"}</p>
          <p>Transaction hash: {proof.transactionHash ?? "pending"}</p>
          {proof.transactionHash ? (
            <a className="underline" href={explorerTx(proof.transactionHash)}>
              Open explorer
            </a>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
