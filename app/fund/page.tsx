"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { api } from "@/lib/client/api";
import { formatUsd } from "@/lib/money";

type Stats = {
  totalContributed: number;
  totalReliefDelivered: number;
  grantsCompleted: number;
  averageGrant: number;
  platformGrantFeePercent: number;
  patientMedicalRecordsOnchain: number;
  demoLabeled: boolean;
  testnet: { reliefDelivered: number; grantsCompleted: number };
};

export default function FundPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/api/public/relief-stats").then(setStats).catch(() => undefined);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Althea Relief Fund</h1>
      {stats.demoLabeled ? <p className="text-sm text-[#5c564c]">Demo statistics</p> : null}
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
        <p>Relief delivered: {formatUsd(stats.testnet.reliefDelivered)}</p>
        <p>Grants completed: {stats.testnet.grantsCompleted}</p>
      </Card>
      <Link href="/fund/verify/demo">Verify Relief Transaction</Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm text-[#5c564c]">{label}</p>
      <p className="mt-2 text-3xl tabular-nums">{value}</p>
    </Card>
  );
}
