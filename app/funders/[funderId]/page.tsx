"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { VaultTable } from "@/components/network/VaultTable";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type FunderPayload = {
  id: string;
  name: string;
  kind: string;
  treasuryUsdc: number;
  dailyLimitUsdc: number;
  perMatchLimitUsdc: number;
  privyWalletAddress?: string;
  policyId?: string;
  programs: Array<{
    programId: string;
    name: string;
    funderName: string;
    budget: number;
    committed: number;
    settled: number;
    reserved: number;
    remaining: number;
    grantCap: number;
    matchRatio?: string;
  }>;
  policy: {
    arcOnly: boolean;
    usdcOnly: boolean;
    contractOnly: boolean;
    maxMatch: number;
    dailyLimit: number;
  };
};

export default function FunderConsolePage() {
  const params = useParams<{ funderId: string }>();
  const [data, setData] = useState<FunderPayload | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("Medical Hardship Match");
  const [budget, setBudget] = useState("5000");
  const [grantCap, setGrantCap] = useState("250");
  const [fundAmount, setFundAmount] = useState("250");
  const [fundProgramId, setFundProgramId] = useState("");
  const [probe, setProbe] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const next = await api<FunderPayload>(`/api/funders/${params.funderId}`);
    setData(next);
    if (!fundProgramId && next.programs[0]) setFundProgramId(next.programs[0].programId);
  }, [params.funderId, fundProgramId]);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Console could not be loaded."));
  }, [load]);

  async function createProgram(event: FormEvent) {
    event.preventDefault();
    setBusy("create");
    try {
      await api(`/api/funders/${params.funderId}/programs`, {
        method: "POST",
        body: JSON.stringify({
          name,
          kind: "match",
          budget: Number(budget),
          grantCap: Number(grantCap),
          matchRatioNum: 1,
          matchRatioDen: 1,
          maxMatchPerCase: Number(grantCap),
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Program could not be created.");
    } finally {
      setBusy(null);
    }
  }

  async function fundProgram(event: FormEvent) {
    event.preventDefault();
    setBusy("fund");
    try {
      await api(`/api/funders/${params.funderId}/programs/${fundProgramId}/fund`, {
        method: "POST",
        body: JSON.stringify({ amount: Number(fundAmount) }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Program could not be funded.");
    } finally {
      setBusy(null);
    }
  }

  async function probePolicy(amount: number) {
    setBusy(`probe-${amount}`);
    try {
      const result = await api<{ blocked: boolean; message?: string; allowed: number }>(
        `/api/funders/${params.funderId}/policy-probe`,
        { method: "POST", body: JSON.stringify({ amount }) },
      );
      setProbe(
        result.blocked
          ? `Blocked by foundation treasury policy. Maximum ${formatUsd(result.allowed)}.`
          : `${formatUsd(amount)} allowed.`,
      );
    } catch (err) {
      setProbe(err instanceof Error ? err.message : "Policy probe failed.");
    } finally {
      setBusy(null);
    }
  }

  if (!data && !error) return <AppLoader status={LOADER_STATUS.funders} />;
  if (!data) return <p className="text-danger">{error}</p>;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Funders</p>
        <h1 className="mt-3 text-4xl tracking-tight text-green">{data.name}</h1>
        <p className="mt-2 text-sm text-muted">{data.kind}</p>
      </header>
      {error ? (
        <p className="text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Treasury</p>
          <p className="mt-2 tabular-nums text-3xl">{formatUsd(data.treasuryUsdc)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Active programs</p>
          <p className="mt-2 tabular-nums text-3xl">{data.programs.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Per-match limit</p>
          <p className="mt-2 tabular-nums text-3xl">{formatUsd(data.perMatchLimitUsdc)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Daily limit</p>
          <p className="mt-2 tabular-nums text-3xl">{formatUsd(data.dailyLimitUsdc)}</p>
        </Card>
      </section>

      <section className="border border-ink bg-cream-elev p-6">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Policy</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>{data.policy.arcOnly ? "Arc only" : "Network not restricted"}</li>
          <li>{data.policy.usdcOnly ? "USDC only" : "Asset not restricted"}</li>
          <li>{data.policy.contractOnly ? "Althea Relief Network only" : "Contract not configured"}</li>
          <li>Maximum match {formatUsd(data.policy.maxMatch)}</li>
          <li>Maximum {formatUsd(data.policy.dailyLimit)} / day</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("wallet");
              try {
                await api(`/api/funders/${params.funderId}`, { method: "POST" });
                await load();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Wallet could not be created.");
              } finally {
                setBusy(null);
              }
            }}
          >
            Create foundation wallet
          </Button>
          <Button type="button" variant="ghost" disabled={busy !== null} onClick={() => probePolicy(500)}>
            Send 500 USDC
          </Button>
          <Button type="button" disabled={busy !== null} onClick={() => probePolicy(250)}>
            Send 250 USDC
          </Button>
        </div>
        {data.privyWalletAddress ? (
          <p className="mt-3 break-all text-sm">{data.privyWalletAddress}</p>
        ) : null}
        {probe ? <p className="mt-3">{probe}</p> : null}
      </section>

      <section>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Restricted funds</p>
        <div className="mt-4">
          <VaultTable vaults={data.programs} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="space-y-4 border border-ink bg-cream-elev p-6" onSubmit={createProgram}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Create relief program</p>
          <Field id="programName" label="Program name">
            <input id="programName" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field id="budget" label="Budget">
            <input id="budget" className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)} />
          </Field>
          <Field id="grantCap" label="Maximum per case">
            <input id="grantCap" className={inputClass} value={grantCap} onChange={(e) => setGrantCap(e.target.value)} />
          </Field>
          <Button type="submit" disabled={busy !== null}>
            Create program
          </Button>
        </form>

        <form className="space-y-4 border border-ink bg-cream-elev p-6" onSubmit={fundProgram}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Fund program</p>
          <Field id="fundProgram" label="Program">
            <select
              id="fundProgram"
              className={inputClass}
              value={fundProgramId}
              onChange={(e) => setFundProgramId(e.target.value)}
            >
              {data.programs.map((program) => (
                <option key={program.programId} value={program.programId}>
                  {program.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="fundAmount" label="Amount">
            <input
              id="fundAmount"
              className={inputClass}
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
            />
          </Field>
          <Button type="submit" disabled={busy !== null || !fundProgramId}>
            Fund program
          </Button>
        </form>
      </div>

      <Link href="/funders" className="underline decoration-line underline-offset-4">
        All funders
      </Link>
    </div>
  );
}
