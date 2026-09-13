"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { AppError, AppPage } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, fieldDescribedBy, inputClass } from "@/components/ui/Field";
import { api } from "@/lib/client/api";
import { formatUsd, parseUsdInput, sanitizeHexInput, sanitizeMoneyInput } from "@/lib/money";
import { donateSchema, fieldErrors, visibleFieldError } from "@/lib/validation";
import { publicPrivyAppId } from "@/lib/privy/app-id";
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
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const privyEnabled = Boolean(publicPrivyAppId());

  const donateValues = { amount, sourceChain: chain, email };
  const donateParsed = donateSchema.safeParse(donateValues);
  const donateErrors = donateParsed.success ? {} : fieldErrors(donateParsed.error);
  const emailError = visibleFieldError("email", donateErrors, touched, submitted);
  const amountError = visibleFieldError("amount", donateErrors, touched, submitted);
  const chainError = visibleFieldError("sourceChain", donateErrors, touched, submitted);

  useEffect(() => {
    api<{ campaigns: Campaign[] }>("/api/campaigns")
      .then((data) => setCampaigns(data.campaigns))
      .catch(() => undefined);
  }, []);

  async function donate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitted(true);
    const result = donateSchema.safeParse(donateValues);
    if (!result.success) {
      const next = fieldErrors(result.error);
      const first = ["email", "amount", "sourceChain"].find((field) => next[field]);
      if (first) document.getElementById(first === "sourceChain" ? "chain" : first)?.focus();
      return;
    }
    setBusy(true);
    try {
      const created = await api<DonateResult>("/api/donate", {
        method: "POST",
        body: JSON.stringify({
          ...result.data,
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
  const parsed = parseUsdInput(amount);
  const previewMatch =
    campaign && parsed != null ? Math.min(parsed, Math.max(0, campaign.budget - campaign.spent)) : 0;
  const recorded = result?.donation.status === "deposited" || result?.donation.status === "matched";

  return (
    <AppPage kicker="Give" title="Donate USDC">

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

      <form className="space-y-4 rounded-[2rem] border border-line/80 bg-cream-elev p-6 md:p-8" noValidate onSubmit={donate}>
        <Field id="email" label="Email" error={emailError}>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            autoComplete="email"
            aria-invalid={Boolean(emailError)}
            aria-describedby={fieldDescribedBy("email", emailError)}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field id="amount" label="Amount" required error={amountError}>
          <input
            id="amount"
            className={inputClass}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            maxLength={14}
            value={amount}
            aria-invalid={Boolean(amountError)}
            aria-describedby={fieldDescribedBy("amount", amountError)}
            onBlur={() => setTouched((current) => ({ ...current, amount: true }))}
            onChange={(e) => setAmount(sanitizeMoneyInput(e.target.value))}
            required
          />
        </Field>
        <Field id="chain" label="From" required error={chainError}>
          <select
            id="chain"
            className={inputClass}
            value={chain}
            aria-invalid={Boolean(chainError)}
            aria-describedby={fieldDescribedBy("chain", chainError)}
            onBlur={() => setTouched((current) => ({ ...current, sourceChain: true }))}
            onChange={(e) => setChain(e.target.value)}
          >
            <option value="ethereum">Ethereum</option>
            <option value="base">Base</option>
            <option value="solana">Solana</option>
            <option value="arc">Arc</option>
          </select>
        </Field>
        <p className="text-sm text-muted">Destination: Althea General Medical Hardship Fund</p>
        {parsed != null ? (
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

      <AppError>{error}</AppError>

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
                  autoComplete="off"
                  spellCheck={false}
                  value={sourceTx}
                  onChange={(e) => setSourceTx(sanitizeHexInput(e.target.value))}
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
    </AppPage>
  );
}
