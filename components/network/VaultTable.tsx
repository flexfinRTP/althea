import { formatUsd } from "@/lib/money";

export type VaultRow = {
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
};

export function VaultTable({ vaults }: { vaults: VaultRow[] }) {
  return (
    <div className="overflow-x-auto border border-ink">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <thead className="bg-cream-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Vault</th>
            <th className="px-4 py-3 font-medium">Budget</th>
            <th className="px-4 py-3 font-medium">Committed</th>
            <th className="px-4 py-3 font-medium">Settled</th>
            <th className="px-4 py-3 font-medium">Reserved</th>
            <th className="px-4 py-3 font-medium">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {vaults.map((vault) => (
            <tr key={vault.programId} className="border-t border-line">
              <td className="px-4 py-3">
                <p>{vault.name}</p>
                <p className="text-xs text-muted">
                  {vault.funderName}
                  {vault.matchRatio ? ` · ${vault.matchRatio}` : ""}
                </p>
              </td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(vault.budget)}</td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(vault.committed)}</td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(vault.settled)}</td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(vault.reserved)}</td>
              <td className="px-4 py-3 tabular-nums">{formatUsd(vault.remaining)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
