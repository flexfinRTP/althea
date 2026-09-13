"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActionRow, AppLink } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { ChainAddress } from "@/components/treasury/ChainAddress";
import { api } from "@/lib/client/api";
import { explorerTx, shortenAddress } from "@/lib/arc/chain";
import { GRANT_STATUS_LABEL } from "@/lib/fund/grants";
import { formatDateTime, formatUsd } from "@/lib/money";
import { allocation } from "@/lib/treasury/activity";
import { LOADER_STATUS } from "@/lib/ui/loader";
import { VaultTable, VaultRow } from "@/components/network/VaultTable";

type Stats = {
  totalContributed: number;
  totalReliefDelivered: number;
  grantsCompleted: number;
  averageGrant: number;
  platformGrantFeePercent: number;
  patientMedicalRecordsOnchain: number;
  demoLabeled: boolean;
  asOf?: string;
  network?: string;
  asset?: string;
  poolAddress?: string | null;
  program?: { name: string; status: string; maxGrant: number; currency: string };
  demoFinancialModel?: {
    availableCapital: number;
    reliefDelivered: number;
    grantsCompleted: number;
    averageGrant: number;
  };
  testnet: {
    reliefDelivered: number;
    grantsCompleted: number;
    reliefPoolUsdc?: number | null;
    averageGrant?: number;
  };
  vaults?: VaultRow[];
  campaigns?: Array<{ id: string; name: string; budget: number; spent: number; status: string }>;
};

type PublicGrant = {
  id: string;
  amount: number;
  status: string;
  timestamp?: string;
  transactionHash?: string;
  explorer?: string;
  program: string;
};

const labelClass = "text-sm font-medium uppercase tracking-[0.16em] text-gold-deep";

export default function FundPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [grants, setGrants] = useState<PublicGrant[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [grantId, setGrantId] = useState("");

  const load = useCallback(async () => {
    const [nextStats, nextGrants] = await Promise.all([
      api<Stats>("/api/public/relief-stats"),
      api<{ grants: PublicGrant[] }>("/api/public/grants").catch(() => ({ grants: [] })),
    ]);
    setStats(nextStats);
    setGrants(nextGrants.grants);
  }, []);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Relief fund could not be loaded."));
  }, [load]);

  async function refresh() {
    setBusy(true);
    setError("");
    try {
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Relief fund could not be loaded.");
    } finally {
      setBusy(false);
    }
  }

  function openProof(event: FormEvent) {
    event.preventDefault();
    const id = grantId.trim();
    if (!id) return;
    router.push(`/fund/verify/${encodeURIComponent(id)}`);
  }

  if (!stats && !error) return <AppLoader status={LOADER_STATUS.fund} />;

  const split = allocation(stats?.totalContributed ?? 0, stats?.totalReliefDelivered ?? 0);
  const live = stats?.program?.status === "active";

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={labelClass}>Relief Fund</p>
          <h1 className="mt-3 text-4xl tracking-tight text-green md:text-5xl">Althea Relief Fund</h1>
          <p className="mt-3 text-sm text-muted">
            As of {formatDateTime(stats?.asOf)}
            {stats?.demoLabeled ? " · Demo financial model" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{stats?.asset ?? "USDC"}</Badge>
          <Badge>{stats?.network ?? "Arc"}</Badge>
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs uppercase tracking-wide ${
              live ? "border-green text-green" : "border-line text-muted"
            }`}
          >
            {live ? "Live" : stats?.program?.status ?? "Unknown"}
          </span>
          <Button type="button" variant="ghost" onClick={refresh} disabled={busy}>
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
        <p className={labelClass}>Available Capital</p>
        <p className="mt-4 tabular-nums text-6xl tracking-tight text-gold-deep md:text-7xl">
          {formatUsd(stats?.totalContributed ?? 0)}
        </p>
        {stats?.demoFinancialModel ? (
          <p className="mt-3 text-sm text-muted">
            Demo model {formatUsd(stats.demoFinancialModel.availableCapital)}
          </p>
        ) : null}
        <div
          className="mt-8 flex h-3 overflow-hidden bg-cream-2"
          role="img"
          aria-label={`Available ${split.treasuryPct} percent, Relief delivered ${split.poolPct} percent`}
        >
          <span className="h-full bg-green" style={{ width: `${split.treasuryPct}%` }} />
          <span className="h-full bg-gold" style={{ width: `${split.poolPct}%` }} />
        </div>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-muted">Available {split.treasuryPct}%</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">{formatUsd(stats?.totalContributed ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Relief Delivered {split.poolPct}%</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">
              {formatUsd(stats?.totalReliefDelivered ?? 0)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Grants Completed</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">{stats?.grantsCompleted ?? 0}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Average Grant</dt>
            <dd className="mt-1 tabular-nums text-3xl tracking-tight">{formatUsd(stats?.averageGrant ?? 0)}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-ink bg-cream-elev p-6">
          <p className={labelClass}>Pool</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Program</dt>
              <dd className="text-right">{stats?.program?.name ?? "Althea Relief Fund"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Platform percentage taken from patient grants</dt>
              <dd className="tabular-nums">{stats?.platformGrantFeePercent ?? 0}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Patient medical records published onchain</dt>
              <dd className="tabular-nums">{stats?.patientMedicalRecordsOnchain ?? 0}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Max grant</dt>
              <dd className="tabular-nums">{formatUsd(stats?.program?.maxGrant ?? 0)}</dd>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <dt className="text-muted">Relief Pool</dt>
              <dd>
                <ChainAddress value={stats?.poolAddress} label="Relief Pool address" />
              </dd>
            </div>
          </dl>
        </section>

        <section className="border border-ink bg-cream-elev p-6">
          <p className={labelClass}>Verify Relief Transaction</p>
          <form className="mt-5 space-y-4" onSubmit={openProof}>
            <Field id="grantId" label="Grant ID">
              <input
                id="grantId"
                name="grantId"
                className={inputClass}
                autoComplete="off"
                spellCheck={false}
                value={grantId}
                onChange={(e) => setGrantId(e.target.value)}
              />
            </Field>
            <ActionRow>
              <Button type="submit" disabled={!grantId.trim()}>
                Verify Relief Transaction
              </Button>
              <AppLink href="/fund/verify/demo" variant="ghost">
                Demo proof
              </AppLink>
            </ActionRow>
          </form>
        </section>
      </div>

      <section>
        <p className={labelClass}>Testnet</p>
        <div className="mt-4 overflow-x-auto border border-ink">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="px-4 py-4">Relief pool USDC</td>
                <td className="px-4 py-4 tabular-nums">
                  {stats?.testnet.reliefPoolUsdc == null ? "not deployed" : formatUsd(stats.testnet.reliefPoolUsdc)}
                </td>
              </tr>
              <tr className="border-t border-line">
                <td className="px-4 py-4">Relief delivered</td>
                <td className="px-4 py-4 tabular-nums">{formatUsd(stats?.testnet.reliefDelivered ?? 0)}</td>
              </tr>
              <tr className="border-t border-line">
                <td className="px-4 py-4">Grants completed</td>
                <td className="px-4 py-4 tabular-nums">{stats?.testnet.grantsCompleted ?? 0}</td>
              </tr>
              <tr className="border-t border-line">
                <td className="px-4 py-4">Average grant</td>
                <td className="px-4 py-4 tabular-nums">{formatUsd(stats?.testnet.averageGrant ?? 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className={labelClass}>Grants</p>
        <div className="mt-4 overflow-x-auto border border-ink">
          {grants.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">No grants</p>
          ) : (
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Transaction</th>
                  <th className="px-4 py-3 font-medium">Proof</th>
                </tr>
              </thead>
              <tbody>
                {grants.map((row) => {
                  const href = row.explorer || explorerTx(row.transactionHash);
                  const statusClass =
                    row.status === "confirmed"
                      ? "text-green"
                      : row.status === "failed"
                        ? "text-danger"
                        : "text-gold-deep";
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-4 py-4 text-muted">{formatDateTime(row.timestamp)}</td>
                      <td className="px-4 py-4 tabular-nums">{formatUsd(row.amount)}</td>
                      <td className={`px-4 py-4 ${statusClass}`}>
                        {GRANT_STATUS_LABEL[row.status] ?? row.status}
                      </td>
                      <td className="px-4 py-4 font-mono">
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-line underline-offset-4"
                          >
                            {shortenAddress(row.transactionHash)}
                          </a>
                        ) : (
                          "Not recorded"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/fund/verify/${row.id}`}
                          className="font-medium text-green hover:text-green-2"
                        >
                          Verify Relief Transaction
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {stats?.vaults?.length ? (
        <section>
          <p className={labelClass}>Restricted funds</p>
          <div className="mt-4">
            <VaultTable vaults={stats.vaults} />
          </div>
        </section>
      ) : null}

      {stats?.campaigns?.length ? (
        <section className="border border-ink bg-cream-elev p-6">
          <p className={labelClass}>Match campaigns</p>
          <div className="mt-4 space-y-2 text-sm">
            {stats.campaigns.map((campaign) => (
              <p key={campaign.id}>
                {campaign.name}: {formatUsd(campaign.spent)} of {formatUsd(campaign.budget)} · {campaign.status}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <ActionRow>
        <AppLink href="/fund/give" variant="ghost">
          Give from any chain
        </AppLink>
        <AppLink href="/funders" variant="ghost">
          Funder console
        </AppLink>
      </ActionRow>
    </div>
  );
}
