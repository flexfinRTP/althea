import { isDemoMode } from "@/lib/config";

export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="bg-[#1f4a43] px-4 py-2 text-center text-sm text-[#fffdf8]">
      Demo Patient · Demonstration Financial Assistance Policy · Simulated Hospital Decision · Arc Testnet
    </div>
  );
}
