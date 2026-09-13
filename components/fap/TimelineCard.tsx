import { formatIsoDate } from "@/lib/money";

export function TimelineCard({
  firstBillingDate,
  applicationPeriodDay,
  notificationPeriodDay,
  messages,
}: {
  firstBillingDate?: string;
  applicationPeriodDay?: number;
  notificationPeriodDay?: number;
  messages: string[];
}) {
  const day = applicationPeriodDay ?? 0;
  const pct = Math.min(100, Math.max(0, (day / 240) * 100));
  const noticePct = Math.min(100, Math.max(0, ((notificationPeriodDay ?? day) / 120) * 100));
  const label = formatIsoDate(firstBillingDate);

  return (
    <section className="rounded-xl border border-line bg-cream-elev p-6">
      <h2 className="mb-3 text-2xl">Federal timeline</h2>
      <p>First billing statement: {label}</p>
      <p className="mt-1">
        Approximate federal FAP application-period status: Day {day} of 240
      </p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <Bar label="Notification period (120 days)" percent={noticePct} />
        <Bar label="Application period (240 days)" percent={pct} />
      </div>
      {messages.map((message) => (
        <p key={message} className="mt-2 text-sm text-muted">
          {message}
        </p>
      ))}
    </section>
  );
}

function Bar({ label, percent }: { label: string; percent: number }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="h-2 rounded-full bg-line">
        <div className="h-2 rounded-full bg-gold" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
