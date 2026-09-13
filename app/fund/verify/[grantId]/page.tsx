"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { explorerTx } from "@/lib/arc/chain";
import { LOADER_STATUS } from "@/lib/ui/loader";

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

  if (error && !proof) return <p>{error}</p>;
  if (!proof) return <AppLoader status={LOADER_STATUS.proof} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Grant</h1>
      <Card className="space-y-3">
        <p>Program: {proof.program}</p>
        <p>Amount: {formatUsd(proof.amount)}</p>
        <p>Status: {proof.status}</p>
        <p>Network: {proof.network ?? "Arc"}</p>
        <p>Settlement: Example Medical Center Demo Settlement Account</p>
        <p>Transaction hash: {proof.transactionHash ?? "pending"}</p>
        {proof.transactionHash ? (
          <a className="underline" href={explorerTx(proof.transactionHash)}>
            Open explorer
          </a>
        ) : null}
      </Card>
    </div>
  );
}
