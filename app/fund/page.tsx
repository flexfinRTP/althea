"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLoader } from "@/components/ui/AppLoader";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";
import { LOADER_STATUS } from "@/lib/ui/loader";

type Stats = {
  totalContributed: number;
  totalReliefDelivered: number;
  grantsCompleted: number;
  averageGrant: number;
  platformGrantFeePercent: number;
  patientMedicalRecordsOnchain: number;
  demoLabeled: boolean;
  demoFinancialModel?: {
    availableCapital: number;
    reliefDelivered: number;
    grantsCompleted: number;
    averageGrant: number;
  };
  testnet: { reliefDelivered: number; grantsCompleted: number; reliefPoolUsdc?: number | null; averageGrant?: number };
};

export default function FundPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/api/public/relief-stats").then(setStats).catch(() => undefined);
  }, []);

  if (!stats) return <AppLoader status={LOADER_STATUS.fund} />;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Fund</h1>
      {stats.demoLabeled ? <p className="text-sm text-muted">Demo financial model</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Available Capital" value={formatUsd(stats.totalContributed)} />
        <Stat label="Relief Delivered" value={formatUsd(stats.totalReliefDelivered)} />
        <Stat label="Grants Completed" value={String(stats.grantsCompleted)} />
        <Stat label="Average Grant" value={formatUsd(stats.averageGrant)} />
        <Stat label="Platform percentage taken from patient grants" value={`${stats.platformGrantFeePercent}%`} />
        <Stat label="Patient medical records published onchain" value={String(stats.patientMedicalRecordsOnchain)} />
      </div>
      <Card>
        <h2 className="mb-2 text-2xl">Testnet</h2>
        <p>Relief pool USDC: {stats.testnet.reliefPoolUsdc == null ? "not deployed" : formatUsd(stats.testnet.reliefPoolUsdc)}</p>
        <p>Relief delivered: {formatUsd(stats.testnet.reliefDelivered)}</p>
        <p>Grants completed: {stats.testnet.grantsCompleted}</p>
        <p>Average grant: {formatUsd(stats.testnet.averageGrant ?? 0)}</p>
      </Card>
      <Link href="/fund/verify/demo">Verify Relief Transaction</Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl tabular-nums text-gold-deep">{value}</p>
    </Card>
  );
}
