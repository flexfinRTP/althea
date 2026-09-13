"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ActionRow, AppError, AppLink, AppPage } from "@/components/app/AppChrome";
import { AppLoader } from "@/components/ui/AppLoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, fieldDescribedBy, inputClass } from "@/components/ui/Field";
import { VaultTable } from "@/components/network/VaultTable";
import { api } from "@/lib/client/api";
import { formatUsd, sanitizeMoneyInput } from "@/lib/money";
import { fieldErrors, funderProgramSchema, fundProgramSchema, visibleFieldError } from "@/lib/validation";
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
  const [createSubmitted, setCreateSubmitted] = useState(false);
  const [fundSubmitted, setFundSubmitted] = useState(false);
  const [createTouched, setCreateTouched] = useState<Record<string, boolean>>({});
  const [fundTouched, setFundTouched] = useState<Record<string, boolean>>({});

  const createValues = {
    name,
    kind: "match" as const,
    budget,
    grantCap,
    matchRatioNum: 1,
    matchRatioDen: 1,
    maxMatchPerCase: grantCap,
  };
  const createParsed = funderProgramSchema.safeParse(createValues);
  const createErrors = createParsed.success ? {} : fieldErrors(createParsed.error);
  const nameError = visibleFieldError("name", createErrors, createTouched, createSubmitted);
  const budgetError = visibleFieldError("budget", createErrors, createTouched, createSubmitted);
  const grantCapError = visibleFieldError("grantCap", createErrors, createTouched, createSubmitted);

  const fundParsed = fundProgramSchema.safeParse({ amount: fundAmount });
  const fundErrors = fundParsed.success ? {} : fieldErrors(fundParsed.error);
  const fundAmountError = visibleFieldError("amount", fundErrors, fundTouched, fundSubmitted);

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
    setError("");
    setCreateSubmitted(true);
    const result = funderProgramSchema.safeParse(createValues);
    if (!result.success) {
      const next = fieldErrors(result.error);
      const first = ["programName", "budget", "grantCap"].find((field) => {
        const key = field === "programName" ? "name" : field;
        return next[key];
      });
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setBusy("create");
    try {
      await api(`/api/funders/${params.funderId}/programs`, {
        method: "POST",
        body: JSON.stringify(result.data),
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
    setError("");
    setFundSubmitted(true);
    const result = fundProgramSchema.safeParse({ amount: fundAmount });
    if (!result.success) {
      document.getElementById("fundAmount")?.focus();
      return;
    }
    setBusy("fund");
    try {
      await api(`/api/funders/${params.funderId}/programs/${fundProgramId}/fund`, {
        method: "POST",
        body: JSON.stringify(result.data),
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
  if (!data) {
    return (
      <AppPage kicker="Funders" title="Relief programs">
        <AppError>{error}</AppError>
      </AppPage>
    );
  }

  return (
    <AppPage kicker="Funders" title={data.name} lead={data.kind}>
      <AppError>{error}</AppError>

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

      <section className="rounded-[2rem] border border-line/80 bg-cream-elev p-6 md:p-8">
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
        <form className="space-y-4 rounded-[2rem] border border-line/80 bg-cream-elev p-6 md:p-8" noValidate onSubmit={createProgram}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Create relief program</p>
          <Field id="programName" label="Program name" required error={nameError}>
            <input
              id="programName"
              className={inputClass}
              maxLength={120}
              value={name}
              aria-invalid={Boolean(nameError)}
              aria-describedby={fieldDescribedBy("programName", nameError)}
              onBlur={() => setCreateTouched((current) => ({ ...current, name: true }))}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field id="budget" label="Budget" error={budgetError}>
            <input
              id="budget"
              className={inputClass}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              maxLength={14}
              value={budget}
              aria-invalid={Boolean(budgetError)}
              aria-describedby={fieldDescribedBy("budget", budgetError)}
              onBlur={() => setCreateTouched((current) => ({ ...current, budget: true }))}
              onChange={(e) => setBudget(sanitizeMoneyInput(e.target.value))}
            />
          </Field>
          <Field id="grantCap" label="Maximum per case" required error={grantCapError}>
            <input
              id="grantCap"
              className={inputClass}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              maxLength={14}
              value={grantCap}
              aria-invalid={Boolean(grantCapError)}
              aria-describedby={fieldDescribedBy("grantCap", grantCapError)}
              onBlur={() => setCreateTouched((current) => ({ ...current, grantCap: true }))}
              onChange={(e) => setGrantCap(sanitizeMoneyInput(e.target.value))}
              required
            />
          </Field>
          <Button type="submit" disabled={busy !== null}>
            Create program
          </Button>
        </form>

        <form className="space-y-4 rounded-[2rem] border border-line/80 bg-cream-elev p-6 md:p-8" noValidate onSubmit={fundProgram}>
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
          <Field id="fundAmount" label="Amount" required error={fundAmountError}>
            <input
              id="fundAmount"
              className={inputClass}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              maxLength={14}
              value={fundAmount}
              aria-invalid={Boolean(fundAmountError)}
              aria-describedby={fieldDescribedBy("fundAmount", fundAmountError)}
              onBlur={() => setFundTouched((current) => ({ ...current, amount: true }))}
              onChange={(e) => setFundAmount(sanitizeMoneyInput(e.target.value))}
              required
            />
          </Field>
          <Button type="submit" disabled={busy !== null || !fundProgramId}>
            Fund program
          </Button>
        </form>
      </div>

      <ActionRow>
        <AppLink href="/funders" variant="ghost">
          All funders
        </AppLink>
      </ActionRow>
    </AppPage>
  );
}
