import { formatUsd } from "@/lib/money";

export type AssemblySource = {
  programId: string;
  name: string;
  funderName: string;
  amount: number;
  role: string;
  eligible: boolean;
  reason: string;
  available: number;
  matchRatio?: string;
};

export function ReliefAssembly({
  residualBalance,
  sources,
  total,
  remainingAfter,
}: {
  residualBalance: number;
  sources: AssemblySource[];
  total: number;
  remainingAfter: number;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Verified remaining bill</p>
      <p className="tabular-nums text-4xl text-gold-deep">{formatUsd(residualBalance)}</p>
      <div className="overflow-x-auto border border-ink">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Available</th>
              <th className="px-4 py-3 font-medium">Allocation</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.programId} className="border-t border-line">
                <td className="px-4 py-3">
                  <p>{source.name}</p>
                  <p className="text-xs text-muted">
                    {source.funderName}
                    {source.matchRatio ? ` · ${source.matchRatio}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3 tabular-nums">{formatUsd(source.available)}</td>
                <td className="px-4 py-3 tabular-nums">{source.eligible ? formatUsd(source.amount) : "—"}</td>
                <td className="px-4 py-3">{source.eligible ? "Eligible" : source.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">Total relief</dt>
          <dd className="tabular-nums text-3xl text-gold-deep">{formatUsd(total)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Remaining after relief</dt>
          <dd className="tabular-nums text-3xl">{formatUsd(remainingAfter)}</dd>
        </div>
      </dl>
    </div>
  );
}
