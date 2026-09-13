import Image from "next/image";

// Sourced in docs/research_evidence.md §§5, 7, 10
const facts = [
  { n: "20M", line: "adults in medical debt", source: "KFF" },
  {
    n: "$2.7B",
    line: "billed after they likely already qualified for financial assistance",
    source: "CFPB",
  },
  {
    n: "240d",
    line: "to apply for financial assistance. Eligible patients still miss it.",
    source: "IRS · CFPB",
  },
];

export function OpenSlide() {
  return (
    <div className="grid h-full grid-cols-[0.7fr_0.3fr] bg-cream">
      <div className="flex h-full flex-col justify-between border-r border-gold/35 px-[3.6em] py-[2.4em]">
        <p className="text-[1em] font-medium uppercase tracking-[0.22em] text-gold-deep">
          ETHOnline 2026
        </p>

        <div>
          <p className="text-[0.95em] font-medium uppercase tracking-[0.22em] text-gold-deep">
            Medical debt
          </p>
          <p className="mt-[0.08em] font-semibold leading-none tracking-tight text-gold">
            <span className="block text-[7.2em]">$220B</span>
          </p>
          <p className="mt-[0.4em] text-[0.78em] font-medium uppercase tracking-[0.18em] text-gold-deep/80">
            KFF
          </p>
          <div className="mt-[0.55em] h-[0.18em] w-[3.4em] bg-gold" />
          <ol className="mt-[1.2em] space-y-[0.95em]">
            {facts.map((fact) => (
              <li key={fact.n} className="flex items-baseline gap-[0.85em] text-green">
                <span className="w-[4.1em] shrink-0 text-[1.7em] font-semibold tabular-nums text-gold-deep">
                  {fact.n}
                </span>
                <span>
                  <span className="block text-[1.45em] leading-snug">{fact.line}</span>
                  <span className="mt-[0.22em] block text-[0.78em] font-medium uppercase tracking-[0.18em] text-gold-deep/80">
                    {fact.source}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="max-w-[14em] text-[2.45em] font-semibold leading-[1.12] tracking-tight text-green">
          Before the bill becomes debt.
        </p>
      </div>

      <div className="flex items-center justify-center bg-cream px-[1.6em]">
        <Image
          src="/brand/althea-logo-cream.png"
          alt="Althea"
          width={665}
          height={663}
          priority
          className="h-[12em] w-[12em] object-contain"
        />
      </div>
    </div>
  );
}
