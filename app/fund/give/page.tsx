"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Campaign = {
  id: string;
  name: string;
  matchRatioNum: number;
  matchRatioDen: number;
  budget: number;
  spent: number;
  status: string;
};

type DonateResult = {
  donation: {
    id: string;
    status: string;
    amount: number;
    matchedAmount: number;
    sourceChain: string;
    sourceTxHash?: string;
    arcTxHash?: string;
  };
  match?: { donation: number; match: number; total: number; campaignName: string };
  next?: {
    action: string;
    destination?: string;
    domain?: number;
    tokenMessenger?: string;
    irisUrl?: string;
    calldata?: string;
  };
};

function DonorSignIn({ onEmail }: { onEmail: (value: string) => void }) {
  const { ready, authenticated, login, user } = usePrivy();
  useEffect(() => {
    const fromPrivy = typeof user?.email === "string" ? user.email : user?.email?.address;
    if (fromPrivy) onEmail(fromPrivy);
  }, [user, onEmail]);
  if (!ready) return <AppLoader variant="inline" status={LOADER_STATUS.donate} />;
  if (authenticated) return null;
  return (
    <Button type="button" variant="ghost" onClick={() => login()}>
      Sign in with email
    </Button>
  );
}

export default function GivePage() {
  const [amount, setAmount] = useState("100");
  const [chain, setChain] = useState("ethereum");
  const [email, setEmail] = useState("");
  const [sourceTx, setSourceTx] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [result, setResult] = useState<DonateResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const privyEnabled = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  useEffect(() => {
    api<{ campaigns: Campaign[] }>("/api/campaigns")
      .then((data) => setCampaigns(data.campaigns))
      .catch(() => undefined);
  }, []);

  async function donate(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const created = await api<DonateResult>("/api/donate", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          sourceChain: chain,
          email: email || undefined,
          campaignId: campaigns[0]?.id,
        }),
      });
      setResult(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Donation could not be created.");
    } finally {
      setBusy(false);
    }
  }

  async function complete() {
    if (!result?.donation.id) return;
    setBusy(true);
    setError("");
    try {
      const updated = await api<{ donation: DonateResult["donation"] }>(`/api/donate/${result.donation.id}`, {
        method: "POST",
        body: JSON.stringify({ sourceTxHash: sourceTx || undefined }),
      });
      setResult({ ...result, donation: updated.donation });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Donation could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  const campaign = campaigns[0];
  const parsed = Number(amount);
  const previewMatch =
    campaign && Number.isFinite(parsed)
      ? Math.min(parsed, Math.max(0, campaign.budget - campaign.spent))
      : 0;
  const recorded = result?.donation.status === "deposited" || result?.donation.status === "matched";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Give</p>
        <h1 className="mt-3 text-4xl tracking-tight text-green">Donate USDC</h1>
      </header>

      {campaign ? (
        <Card>
          <p className="text-sm text-muted">{campaign.name}</p>
          <p className="mt-2 text-2xl">1:{campaign.matchRatioDen === 1 ? campaign.matchRatioNum : campaign.matchRatioDen}</p>
          <p className="mt-2 text-sm text-muted">
            Remaining match budget {formatUsd(Math.max(0, campaign.budget - campaign.spent))}
          </p>
        </Card>
      ) : null}

      {privyEnabled ? <DonorSignIn onEmail={setEmail} /> : null}

      <form className="space-y-4 border border-ink bg-cream-elev p-6" onSubmit={donate}>
        <Field id="email" label="Email">
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field id="amount" label="Amount">
          <input id="amount" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field id="chain" label="From">
          <select id="chain" className={inputClass} value={chain} onChange={(e) => setChain(e.target.value)}>
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="solana">Solana</option>
            <option value="arc">Arc</option>
          </select>
        </Field>
        <p className="text-sm text-muted">Destination: Althea General Medical Hardship Fund</p>
        {Number.isFinite(parsed) ? (
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt>Your donation</dt>
              <dd className="tabular-nums">{formatUsd(parsed)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Foundation match</dt>
              <dd className="tabular-nums">+{formatUsd(previewMatch)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Total relief created</dt>
              <dd className="tabular-nums">{formatUsd(parsed + previewMatch)}</dd>
            </div>
          </dl>
        ) : null}
        <Button type="submit" disabled={busy}>
          Donate
        </Button>
      </form>

      {error ? (
        <p className="text-danger" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <Card>
          <p>
            {formatUsd(result.donation.amount)}{" "}
            {recorded ? "available for Althea Relief" : "recorded for Althea Relief"}
          </p>
          <p className="mt-2 text-sm text-muted">Status: {result.donation.status}</p>
          {result.match ? (
            <p className="mt-2 text-sm">
              {result.match.campaignName}: {formatUsd(result.match.donation)} + {formatUsd(result.match.match)} ={" "}
              {formatUsd(result.match.total)}
            </p>
          ) : null}
          {result.next?.action === "cctp_burn" || result.next?.action === "cctp_burn_solana" ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm">CCTP domain {result.next.domain}</p>
              {result.next.destination ? <p className="break-all text-sm">{result.next.destination}</p> : null}
              <Field id="sourceTx" label="Source transaction">
                <input
                  id="sourceTx"
                  className={inputClass}
                  value={sourceTx}
                  onChange={(e) => setSourceTx(e.target.value)}
                />
              </Field>
              <Button type="button" disabled={busy || !sourceTx} onClick={complete}>
                Attest and mint
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {!campaigns.length && !result ? <AppLoader variant="inline" status={LOADER_STATUS.donate} /> : null}
    </div>
  );
}
