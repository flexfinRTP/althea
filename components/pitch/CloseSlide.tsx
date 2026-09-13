import Image from "next/image";
import { RemainingRoll } from "@/components/pitch/RemainingRoll";
import demo from "@/data/demo/example-medical-center.json";
import { formatUsd } from "@/lib/money";

const partners = [
  { role: "Liveness", name: "World", logo: "/partners/world.png" },
  { role: "Control", name: "Privy", logo: "/partners/privy.png" },
  { role: "Execution", name: "Circle", logo: "/partners/circle.png?v=3" },
  { role: "Settlement", name: "Arc", logo: "/partners/arc.png" },
];

const cuts = [
  {
    label: "Hospital",
    amount: demo.finalHospitalAssistance,
    className: "bg-gold",
  },
  {
    label: "Relief",
    amount: demo.reliefGrant,
    className: "bg-gold-soft",
    min: true,
  },
  {
    label: "Remain",
    amount: demo.finalRemaining,
    className: "bg-cream",
  },
];

export function CloseSlide() {
  const bill = demo.billAmount;

  return (
    <div className="flex h-full items-center justify-center bg-green-dark px-[4em] py-[2em] text-cream">
      <div className="flex w-full max-w-[48em] flex-col items-center text-center">
        <Image
          src="/brand/althea-logo-cream.png"
          alt="Althea"
          width={665}
          height={663}
          priority
          className="h-[10.5em] w-[10.5em] object-contain"
        />

        <p className="mt-[0.2em] max-w-[20em] text-[2.05em] font-semibold leading-[1.12] tracking-tight text-cream">
          Althea Care turns independent charitable funds into a programmable relief network.
        </p>

        <RemainingRoll from={demo.billAmount} to={demo.finalRemaining} />
        <div className="mt-[0.7em] h-[0.18em] w-[3.4em] bg-gold" />

        <div className="mt-[1.3em] flex h-[1.25em] w-full overflow-hidden rounded-full">
          {cuts.map((cut) => (
            <div
              key={cut.label}
              className={cut.className}
              style={{
                width: `${(cut.amount / bill) * 100}%`,
                minWidth: cut.min ? "0.7em" : undefined,
              }}
            />
          ))}
        </div>
        <dl className="mt-[0.8em] grid w-full grid-cols-3 gap-[0.8em] text-[0.95em]">
          {cuts.map((cut) => (
            <div key={cut.label}>
              <dt className="text-[0.72em] font-medium uppercase tracking-[0.18em] text-gold-soft/75">
                {cut.label}
              </dt>
              <dd className="mt-[0.12em] font-medium tabular-nums text-cream">
                {cut.label === "Remain" ? "" : "−"}
                {formatUsd(cut.amount)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-[0.45em] text-[0.78em] text-gold-soft/65">{formatUsd(bill)} bill</p>

        <ul className="mt-[1.4em] flex flex-wrap items-center justify-center gap-x-[1.6em] gap-y-[0.7em]">
          {partners.map((partner) => (
            <li key={partner.name} className="flex items-center gap-[0.55em]">
              <span className="block h-[2.35em] w-[2.35em] overflow-hidden rounded-full bg-cream">
                <img src={partner.logo} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="text-left">
                <span className="block text-[0.62em] font-medium uppercase tracking-[0.18em] text-gold-soft/70">
                  {partner.role}
                </span>
                <span className="block text-[0.95em] text-cream">{partner.name}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-[1.5em] flex items-center justify-center gap-[0.45em] text-[1.05em] text-gold-soft">
          <span>Proudly built for the</span>
          <span className="inline-flex h-[1.9em] w-[2.15em] items-center justify-center rounded-full bg-white">
            <Image
              src="/partners/ethereum.png"
              alt="Ethereum"
              width={119}
              height={179}
              className="h-[1.25em] w-auto"
            />
          </span>
          <span>2026 hackathon!</span>
        </p>
      </div>
    </div>
  );
}
