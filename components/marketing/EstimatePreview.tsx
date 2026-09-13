import { BillReduction } from "@/components/bill/BillReduction";
import demo from "@/data/demo/example-medical-center.json";

export function EstimatePreview() {
  return (
    <div className="rounded-[2rem] border border-line bg-cream-elev p-6 shadow-[0_24px_60px_-28px_rgba(44,43,31,0.18)] md:p-8">
      <p className="text-sm text-muted">{demo.hospital}</p>
      <p className="mt-1 text-lg font-medium">You may qualify for financial assistance.</p>
      <div className="mt-6">
        <BillReduction
          compact
          original={demo.billAmount}
          hospital={demo.estimatedAssistance}
          relief={demo.reliefGrant}
        />
      </div>
      <p className="mt-6 text-sm text-muted">
        This estimate is based on the hospital&apos;s published policy. The hospital decides.
      </p>
    </div>
  );
}
