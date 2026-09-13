import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { EstimatePreview } from "@/components/marketing/EstimatePreview";
import { Frame } from "@/components/marketing/Frame";
import { PartnerRail } from "@/components/marketing/PartnerRail";

const wrap = "mx-auto max-w-6xl px-6";
const pill =
  "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium";
const pillPrimary = `${pill} bg-green text-cream-elev hover:bg-green-2`;
const pillGhost = `${pill} border border-gold bg-transparent text-ink hover:bg-gold-soft/40`;

const needs = [
  {
    kicker: "$18,000",
    title: "Hospital assistance",
    body: "Find and understand a published Financial Assistance Policy.",
    src: "/marketing/needs-hospital.png",
    alt: "Policy folder on a desk",
  },
  {
    kicker: "Apply",
    title: "A guided path",
    body: "Get the correct form, document checklist, and important dates.",
    src: "/marketing/needs-path.png",
    alt: "Clipboard, forms, and a pen",
  },
  {
    kicker: "Relief",
    title: "Althea Relief",
    body: "Independent charitable help for a verified remaining balance.",
    src: "/marketing/needs-relief.png",
    alt: "Remaining paperwork in a kraft envelope",
  },
];

const steps = [
  {
    n: "1",
    title: "Tell us about the bill.",
    body: "Hospital, bill amount, and basic household financial information.",
    src: "/marketing/step-bill.png",
    alt: "Unopened envelope on a kitchen table",
  },
  {
    n: "2",
    title: "Althea reads the policy.",
    body: "We translate the hospital's published Financial Assistance Policy into understandable rules.",
    src: "/marketing/step-policy.png",
    alt: "Open policy packet on a desk",
  },
  {
    n: "3",
    title: "See whether you may qualify.",
    body: "Althea explains the result and shows why.",
    src: "/marketing/step-qualify.png",
    alt: "Calculator and notepad",
  },
  {
    n: "4",
    title: "Prepare your application.",
    body: "Get the correct form, document checklist, and important dates.",
    src: "/marketing/step-application.png",
    alt: "Application packet and folder",
  },
  {
    n: "5",
    title: "Track the decision.",
    body: "The hospital determines final eligibility.",
    src: "/marketing/step-decision.png",
    alt: "Return envelope at a mailbox",
  },
  {
    n: "6",
    title: "If a difficult balance remains, explore Althea Relief.",
    body: "Independent charitable assistance may help close part of the remaining gap.",
    src: "/marketing/step-relief.png",
    alt: "Hands exchanging a kraft envelope",
  },
];

const donorsSee = [
  "dollars entering the program",
  "aggregate grants issued",
  "program balances",
  "completed transactions",
];

const donorsCannotSee = [
  "patient diagnosis",
  "medical records",
  "income",
  "name",
  "hospital documents",
];

export default function HomePage() {
  return (
    <div className="bg-cream">
      <section className={`${wrap} grid items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24`}>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">
            Before the bill becomes debt.
          </p>
          <h1 className="mt-5 max-w-xl text-4xl leading-[1.08] tracking-tight text-green md:text-6xl">
            An $18,000 hospital bill doesn&apos;t always mean you owe $18,000.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-7 text-muted">
            Althea helps you find and understand your hospital&apos;s financial-assistance program
            before an unaffordable bill becomes debt.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/check" className={pillPrimary}>
              Check My Bill
            </Link>
            <Link href="#how-it-works" className={pillGhost}>
              How It Works
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm text-green">
            <li className="rounded-full bg-gold-soft px-4 py-2">No loans.</li>
            <li className="rounded-full bg-gold-soft px-4 py-2">No percentage of your hospital assistance.</li>
            <li className="rounded-full bg-gold-soft px-4 py-2">No medical information published onchain.</li>
          </ul>
        </div>
        <div>
          <Frame
            src="/marketing/hero-bill.png"
            alt="Opened hospital bill on a kitchen table"
            className="rounded-[2rem]"
            priority
          />
          <div className="relative z-10 -mt-14 px-4">
            <EstimatePreview />
          </div>
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-24">
        <div className={wrap}>
          <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            Assistance may already exist.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-muted">
            Many hospitals offer free or discounted care through Financial Assistance Policies. Finding
            the correct policy, understanding the rules, and completing the process can be overwhelming.
            Althea turns it into a guided path.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {needs.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[2rem] bg-cream-elev">
                <Frame src={item.src} alt={item.alt} sizes="(min-width: 768px) 30vw, 100vw" />
                <div className="flex min-h-[14rem] flex-col justify-between p-8">
                  <p className="text-5xl tracking-tight text-gold-deep md:text-6xl">{item.kicker}</p>
                  <div>
                    <h3 className="text-2xl">{item.title}</h3>
                    <p className="mt-3 text-base leading-6 text-muted">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${wrap} grid items-start gap-12 py-20 md:grid-cols-2 md:py-24`}>
        <div className="space-y-5">
          <Frame
            src="/marketing/usable-help.png"
            alt="Paperwork at a kitchen table"
            className="rounded-[2rem]"
          />
          <ol className="space-y-3 rounded-[2rem] bg-cream-2 p-6 md:p-8">
            {[
              "Bill",
              "Policy",
              "Eligibility estimate",
              "Application",
              "Hospital decision",
              "Althea Relief if a gap remains",
            ].map((label, index) => (
              <li
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-cream-elev px-5 py-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-sm font-medium text-gold-soft">
                  {index + 1}
                </span>
                <span className="text-lg">{label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:sticky md:top-28">
          <h2 className="max-w-xl text-3xl leading-tight tracking-tight md:text-5xl">
            The financial help may already exist. Althea makes it usable.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-7 text-muted">
            You should not need to understand hospital billing rules just to know whether help is
            available. There is no medical loan. There is no percentage taken from your financial
            assistance. Your hospital makes the final decision about its own financial-assistance
            program.
          </p>
          <div className="mt-8">
            <Link href="/check" className={pillPrimary}>
              Check My Bill
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-cream-2 py-20 md:py-24">
        <div className={wrap}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">
            How It Works
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            From hospital bill to financial help in one guided path.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.n} className="overflow-hidden rounded-[2rem] bg-cream-elev">
                <Frame src={step.src} alt={step.alt} sizes="(min-width: 768px) 30vw, 100vw" />
                <div className="p-8">
                  <p className="text-5xl tracking-tight text-gold-deep">{step.n}</p>
                  <h3 className="mt-6 text-2xl leading-snug">{step.title}</h3>
                  <p className="mt-3 text-base leading-6 text-muted">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${wrap} py-20 md:py-24`}>
        <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
          No loans. No percentage of your hospital assistance.
        </h2>
        <Frame
          src="/marketing/proof-no-loans.png"
          alt="Open hands over an empty table"
          ratio="aspect-[16/9]"
          sizes="(min-width: 768px) 72rem, 100vw"
          className="mt-12 rounded-[2rem]"
        />
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            ["0%", "Platform percentage taken from grants"],
            ["0", "Patient medical records published"],
            ["Free", "Patients never pay to find hospital financial assistance"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-6xl tracking-tight text-gold-deep md:text-7xl">{value}</p>
              <p className="mt-3 text-base leading-6 text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <PartnerRail />

      <section className="bg-green py-20 text-cream-elev md:py-24">
        <div className={`${wrap} grid items-center gap-12 md:grid-cols-2`}>
          <div>
            <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
              When hospital assistance stops short.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-7 text-gold-soft">
              Althea Relief is an independent charitable fund designed for verified medical hardship
              remaining after available hospital financial assistance has been explored.
            </p>
            <ul className="mt-8 max-w-2xl space-y-3 text-base leading-6 text-gold-soft">
              <li>Funds are limited.</li>
              <li>Grant decisions follow objective program rules.</li>
              <li>Donors do not choose individual patients.</li>
              <li>Althea does not take a percentage of a patient&apos;s Relief grant.</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/fund"
                className={`${pill} bg-gold text-green hover:bg-gold-soft`}
              >
                Help Close the Gap.
              </Link>
              <Link href="/fund/verify/demo" className={`${pill} border border-gold text-cream-elev`}>
                Verify Fund Activity
              </Link>
            </div>
          </div>
          <Frame
            src="/marketing/relief-gap.png"
            alt="Donation box on a wooden table"
            ratio="aspect-[16/9] md:aspect-[4/3]"
            className="rounded-[2rem]"
          />
        </div>
      </section>

      <section className={`${wrap} py-20 md:py-24`}>
        <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
          Private patient. Public accountability.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-7 text-muted">
          Patients should not have to publish their medical story to receive help. Althea keeps
          sensitive patient information private while using transparent financial infrastructure to
          show that charitable funds were actually disbursed.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="overflow-hidden rounded-[2rem] bg-cream-2">
            <Frame
              src="/marketing/privacy-public.png"
              alt="Open ledger and stacked coins"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
            <div className="p-8">
              <h3 className="text-2xl">Donors can see</h3>
              <ul className="mt-5 space-y-3 text-base leading-6 text-muted">
                {donorsSee.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
          <article className="overflow-hidden rounded-[2rem] bg-cream-2">
            <Frame
              src="/marketing/privacy-private.png"
              alt="Sealed folder and latched box"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
            <div className="p-8">
              <h3 className="text-2xl">They cannot see</h3>
              <ul className="mt-5 space-y-3 text-base leading-6 text-muted">
                {donorsCannotSee.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <Frame
          src="/marketing/cta-check.png"
          alt=""
          fillParent
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-cream/80" />
        <div className={`${wrap} relative text-center`}>
          <Logo variant="lockup" size="lg" href={null} className="mx-auto mb-8" />
          <h2 className="mx-auto max-w-3xl text-3xl leading-tight tracking-tight text-green md:text-5xl">
            Know what help you may qualify for before you pay.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-muted">
            Check My Bill. No loans. No percentage of your hospital assistance.
          </p>
          <div className="mt-8">
            <Link href="/check" className={pillPrimary}>
              Check My Bill
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
