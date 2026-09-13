"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, fieldDescribedBy, inputClass } from "@/components/ui/Field";
import { AppLoader } from "@/components/ui/AppLoader";
import { ChainAddress } from "@/components/treasury/ChainAddress";
import { PrivyActions } from "@/components/treasury/PrivyActions";
import { api } from "@/lib/client/api";
import { explorerTx, shortenAddress } from "@/lib/arc/chain";
import { formatDateTime, formatUsd } from "@/lib/money";
import {
  allocation,
  TREASURY_STATUS_LABEL,
  TREASURY_TYPE_LABEL,
  type TreasuryActivity,
} from "@/lib/treasury/activity";
import { fieldErrors, treasuryFundSchema, visibleFieldError } from "@/lib/validation";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Balance = {
  treasury: {
    usdc: number;
    configured: boolean;
    walletId: string | null;
    address?: string | null;
    onchain: number | null;
    demoFinancialModel?: number;
  };
  reliefPool: {
    usdc: number;
    address: string | null;
    demoFinancialModel: number;
    onchain: number | null;
  };
  policy?: { active: boolean; id?: string | null; destination?: string };
  network?: string;
  asset?: string;
  asOf?: string;
};

type ActivityResponse = { transactions: TreasuryActivity[] };

const labelClass = "text-sm font-medium uppercase tracking-[0.16em] text-gold-deep";

export default function TreasuryPage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [activity, setActivity] = useState<TreasuryActivity[]>([]);
  const [amount, setAmount] = useState("1000");
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"fund" | "test" | "refresh" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const privyEnabled = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

  const parsed = treasuryFundSchema.safeParse({ amount });
  const errors = parsed.success ? {} : fieldErrors(parsed.error);
  const amountError = visibleFieldError("amount", errors, { amount: touched }, submitted);

  const load = useCallback(async () => {
    const [nextBalance, nextActivity] = await Promise.all([
      api<Balance>("/api/treasury/balance"),
      api<ActivityResponse>("/api/treasury/transactions").catch(() => ({ transactions: [] })),
    ]);
    setBalance(nextBalance);
    setActivity(nextActivity.transactions);
  }, []);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Treasury could not be loaded."));
  }, [load]);

  async function fund(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setHash("");
    setSubmitted(true);
    const result = treasuryFundSchema.safeParse({ amount });
    if (!result.success) {
      document.getElementById("amount")?.focus();
      return;
    }
    setBusy("fund");
    try {
      const funded = await api<{ transactionHash: string }>("/api/treasury/fund-relief-pool", {
        method: "POST",
        body: JSON.stringify(result.data),
      });
      setHash(funded.transactionHash);
      setMessage("Relief Pool funded");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Treasury authorization could not be completed. No funds moved.");
    } finally {
      setBusy(null);
    }
  }

  async function testRestricted() {
    setBusy("test");
    setHash("");
    try {
      const result = await api<{ message: string }>("/api/treasury/test-restricted-transfer", { method: "POST" });
      setMessage(result.message);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Treasury authorization could not be completed. No funds moved.");
    } finally {
      setBusy(null);
    }
  }

  async function refresh() {
    setBusy("refresh");
    setError("");
    try {
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Treasury could not be loaded.");
    } finally {
      setBusy(null);
    }
  }

  if (!balance && !error) return <AppLoader status={LOADER_STATUS.treasury} />;

  const split = allocation(balance?.treasury.usdc ?? 0, balance?.reliefPool.usdc ?? 0);
  const policyActive = Boolean(balance?.policy?.active);
  const hashHref = explorerTx(hash);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={labelClass}>Relief Treasury</p>
          <h1 className="mt-3 text-4xl tracking-tight text-green md:text-5xl">USDC on Arc</h1>
          <p className="mt-3 text-sm text-muted">
            As of {formatDateTime(balance?.asOf)}
            {balance?.treasury.onchain == null && balance?.reliefPool.onchain == null ? " · Onchain unread" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{balance?.asset ?? "USDC"}</Badge>
          <Badge>{balance?.network ?? "Arc"}</Badge>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs uppercase tracking-wide ${
              policyActive ? "border-green text-green" : "border-danger text-danger"
            }`}
          >
            {policyActive ? "Policy active" : "Policy not configured"}
          </span>
          {privyEnabled ? (
            <PrivyActions />
          ) : (
            <p className="max-w-xs text-sm text-muted">
              Privy app ID not configured. Policy and fund endpoints still run server-side when secrets are present.
            </p>
          )}
          <Button type="button" variant="ghost" onClick={refresh} disabled={busy !== null}>
            Refresh
          </Button>
        </div>
      </header>

      {error ? (
        <p className="text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <section className="border border-ink bg-cream-elev px-6 py-8 md:px-10">
        <p className={labelClass}>Total USDC</p>
        <p className="mt-4 tabular-nums text-6xl tracking-tight text-gold-deep md:text-7xl">
          {formatUsd(split.total)}
        </p>
        {balance?.reliefPool.demoFinancialModel ? (
          <p className="mt-3 text-sm text-muted">
            Demo model {formatUsd(balance.reliefPool.demoFinancialModel)}
          </p>
        ) : null}
        <div
          className="mt-8 flex h-3 overflow-hidden bg-cream-2"
          role="img"
          aria-label={`Treasury ${split.treasuryPct} percent, Relief Pool ${split.poolPct} percent`}
        >
          <span className="h-full bg-green" style={{ width: `${split.treasuryPct}%` }} />
          <span className="h-full bg-gold" style={{ width: `${split.poolPct}%` }} />
        </div>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Treasury {split.treasuryPct}%</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">{formatUsd(balance?.treasury.usdc ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Relief Pool {split.poolPct}%</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">{formatUsd(balance?.reliefPool.usdc ?? 0)}</dd>
          </div>
        </dl>
      </section>

      <section>
        <p className={labelClass}>Holdings</p>
        <div className="mt-4 overflow-x-auto border border-ink">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Venue</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="px-4 py-4">USDC</td>
                <td className="px-4 py-4">Treasury</td>
                <td className="px-4 py-4 tabular-nums">{formatUsd(balance?.treasury.usdc ?? 0)}</td>
                <td className="px-4 py-4">
                  <ChainAddress value={balance?.treasury.address} label="treasury address" />
                </td>
              </tr>
              <tr className="border-t border-line">
                <td className="px-4 py-4">USDC</td>
                <td className="px-4 py-4">Relief Pool</td>
                <td className="px-4 py-4 tabular-nums">{formatUsd(balance?.reliefPool.usdc ?? 0)}</td>
                <td className="px-4 py-4">
                  <ChainAddress value={balance?.reliefPool.address} label="Relief Pool address" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-ink bg-cream-elev p-6">
          <p className={labelClass}>Policy</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd>{policyActive ? "Active" : "Not configured"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Approved contract</dt>
              <dd>Althea ReliefPool</dd>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <dt className="text-muted">Destination</dt>
              <dd>
                <ChainAddress
                  value={balance?.policy?.destination || balance?.reliefPool.address}
                  label="policy destination"
                />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Treasury wallet</dt>
              <dd>{balance?.treasury.configured ? "Configured" : "Not configured"}</dd>
            </div>
            {balance?.policy?.id ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <dt className="text-muted">Policy ID</dt>
                <dd className="break-all font-mono text-xs">{balance.policy.id}</dd>
              </div>
            ) : null}
            {balance?.treasury.walletId ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <dt className="text-muted">Wallet ID</dt>
                <dd className="break-all font-mono text-xs">{balance.treasury.walletId}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="border border-ink bg-cream-elev p-6">
          <p className={labelClass}>Operations</p>
          <form className="mt-5 space-y-4" noValidate onSubmit={fund}>
            <Field id="amount" label="Amount" hint="USDC" required error={amountError}>
              <input
                id="amount"
                name="amount"
                className={inputClass}
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                maxLength={14}
                value={amount}
                aria-invalid={Boolean(amountError)}
                aria-describedby={fieldDescribedBy("amount", amountError, "USDC")}
                onBlur={() => setTouched(true)}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy !== null}>
                Fund Relief Pool
              </Button>
              <Button type="button" variant="ghost" onClick={testRestricted} disabled={busy !== null}>
                Test Restricted Transfer
              </Button>
            </div>
          </form>
          {message ? (
            <p className="mt-4" role="alert">
              {message}
            </p>
          ) : null}
          {hash ? (
            <p className="mt-2 font-mono text-sm">
              {hashHref ? (
                <a href={hashHref} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4">
                  {shortenAddress(hash)}
                </a>
              ) : (
                shortenAddress(hash)
              )}
            </p>
          ) : null}
        </section>
      </div>

      <section>
        <p className={labelClass}>Activity</p>
        <div className="mt-4 overflow-x-auto border border-ink">
          {activity.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No transactions</p>
          ) : (
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row) => {
                  const href = explorerTx(row.transactionHash);
                  const statusClass =
                    row.status === "confirmed"
                      ? "text-green"
                      : row.status === "failed"
                        ? "text-danger"
                        : "text-gold-deep";
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-4 py-4 text-muted">{formatDateTime(row.createdAt)}</td>
                      <td className="px-4 py-4">{TREASURY_TYPE_LABEL[row.type]}</td>
                      <td className="px-4 py-4 tabular-nums">{formatUsd(row.amount)}</td>
                      <td className={`px-4 py-4 ${statusClass}`}>{TREASURY_STATUS_LABEL[row.status]}</td>
                      <td className="px-4 py-4">
                        <ChainAddress value={row.destinationAddress} label="destination" />
                      </td>
                      <td className="px-4 py-4 font-mono">
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4">
                            {shortenAddress(row.transactionHash)}
                          </a>
                        ) : (
                          "Not recorded"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
