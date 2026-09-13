"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { PrivyActions } from "@/components/treasury/PrivyActions";

type Balance = {
  treasury: { usdc: number; configured: boolean; walletId: string | null };
  reliefPool: { usdc: number; address: string | null; demoFinancialModel: number };
};

export default function TreasuryPage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [amount, setAmount] = useState("1000");
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState("");
  const privyEnabled = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  useEffect(() => {
    api<Balance>("/api/treasury/balance").then(setBalance).catch(() => undefined);
  }, []);

  async function fund() {
    setMessage("");
    try {
      const result = await api<{ transactionHash: string }>("/api/treasury/fund-relief-pool", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      setHash(result.transactionHash);
      setMessage("Relief Pool funded");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Treasury authorization could not be completed. No funds moved.");
    }
  }

  async function testRestricted() {
    const result = await api<{ message: string }>("/api/treasury/test-restricted-transfer", { method: "POST" });
    setMessage(result.message);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Treasury</h1>
      <Card className="space-y-2">
        <p>Treasury Balance: {balance ? formatUsd(balance.treasury.usdc) : "..."}</p>
        <p>
          ReliefPool Balance: {balance ? formatUsd(balance.reliefPool.usdc) : "..."}
          {balance ? ` · Demo financial model: ${formatUsd(balance.reliefPool.demoFinancialModel)}` : ""}
        </p>
        <p>Network: Arc</p>
        <p>Approved Contract: Althea ReliefPool</p>
        <p>Treasury Policy: ACTIVE</p>
      </Card>
      {privyEnabled ? (
        <PrivyActions />
      ) : (
        <p className="text-sm text-[#5c564c]">
          Privy app ID not configured. Policy and fund endpoints still run server-side when secrets are present.
        </p>
      )}
      <Field label="Amount">
        <input className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button onClick={fund}>Fund Relief Pool</Button>
        <Button variant="ghost" onClick={testRestricted}>
          Test Restricted Transfer
        </Button>
      </div>
      {message ? <p>{message}</p> : null}
      {hash ? <p>Transaction: {hash}</p> : null}
    </div>
  );
}
