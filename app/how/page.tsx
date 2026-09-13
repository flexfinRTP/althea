import Link from "next/link";
import { Frame } from "@/components/marketing/Frame";

const wrap = "mx-auto max-w-6xl px-6";
const pill =
  "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-medium";
const pillPrimary = `${pill} bg-green text-cream-elev hover:bg-green-2`;
const pillGhost = `${pill} border border-gold bg-transparent text-ink hover:bg-gold-soft/40`;

const stages = [
  {
    title: "Patient App",
    body: "A guided path from the bill you were handed to the help that may already exist. The patient never needs to manage cryptocurrency.",
    src: "/marketing/how-patient-app.png",
    alt: "Laptop, folder, and phone on a desk",
  },
  {
    title: "Althea API",
    body: "One case holds the hospital, the estimate, the application, the decision, and any Relief request. Nothing important lives in a side channel.",
    src: "/marketing/how-api.png",
    alt: "Case folders in a wooden tray",
  },
  {
    title: "FAP Intelligence",
    body: "Althea reads the hospital's published Financial Assistance Policy and turns it into rules you can follow. Extract. Structure. Then a deterministic engine calculates the estimate.",
    src: "/marketing/step-policy.png",
    alt: "Open policy packet on a desk",
  },
  {
    title: "Case Workflow",
    body: "The correct form, the document checklist, and the important dates sit in one place, instead of a PDF, a billing office, and a calendar.",
    src: "/marketing/needs-path.png",
    alt: "Clipboard, forms, and a pen",
  },
  {
    title: "Hospital Decision",
    body: "Althea estimates whether you may qualify and shows why. The hospital makes the final eligibility and assistance determination.",
    src: "/marketing/step-decision.png",
    alt: "Return envelope at a mailbox",
  },
  {
    title: "Residual Balance",
    body: "If hospital assistance still leaves a verified unaffordable amount, that remaining hardship can be considered for independent charitable Relief.",
    src: "/marketing/needs-relief.png",
    alt: "Remaining paperwork in a kraft envelope",
  },
];

const reliefStages = [
  {
    title: "World Check",
    body: "Selfie Check is one liveness signal against automated claims on scarce Relief funds. It is never used to decide hospital assistance. The selfie is not stored.",
  },
  {
    title: "Relief Rules",
    body: "Grant decisions follow objective program rules. Donors do not choose individual patients. Funds are limited.",
  },
  {
    title: "Circle Agent",
    body: "The Agent Stack carries out a grant that has already been approved. It does not choose who receives help, and it does not change the rules.",
  },
  {
    title: "Privy",
    body: "Organizational treasury, policy, and approval. The Relief Agent does not get an open hand.",
  },
  {
    title: "Arc + USDC",
    body: "Settlement that can be verified without a medical record. Public proof that funds moved.",
  },
];

const neverOnchain = [
  "patient name",
  "date of birth",
  "diagnosis",
  "medical records",
  "income",
  "bills",
  "insurance",
  "selfie",
];

const onchain = [
  "caseHash",
  "programId",
  "grantAmount",
  "settlementAddress",
  "decisionHash",
  "status",
];

export default function HowPage() {
  return (
    <div className="bg-cream">
      <section className={`${wrap} grid items-center gap-12 py-16 md:grid-cols-2 md:py-24`}>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">How Althea works</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] tracking-tight text-green md:text-6xl">
            The financial help may already exist. Althea makes it usable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-muted">
            You should not need to understand hospital billing rules just to know whether help is
            available. Althea is two systems. Only the second one uses World, Privy, Circle, or Arc.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/check" className={pillPrimary}>
              Check My Bill
            </Link>
            <Link href="#architecture" className={pillGhost}>
              See the rail
            </Link>
          </div>
        </div>
        <Frame
          src="/marketing/how-hero.png"
          alt="Paperwork and a closed laptop on a kitchen table"
          ratio="aspect-[16/9] md:aspect-[4/3]"
          className="rounded-[2rem]"
          priority
        />
      </section>

      <section className="bg-cream-2 py-20 md:py-24">
        <div className={wrap}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Two systems</p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            Hospital assistance first. Independent Relief only if a gap remains.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="overflow-hidden rounded-[2rem] bg-cream-elev">
              <Frame
                src="/marketing/needs-hospital.png"
                alt="Policy folder on a desk"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="p-8 md:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">System 1</p>
                <h3 className="mt-4 text-3xl">Hospital Financial Assistance Navigator</h3>
                <p className="mt-4 text-lg leading-7 text-muted">
                  Find the published policy. See whether you may qualify. Prepare the application. Track
                  the hospital&apos;s decision. No World. No chain. No wallets.
                </p>
                <p className="mt-4 text-base leading-6 text-muted">
                  Applicable nonprofit hospitals already maintain Financial Assistance Policies. The
                  problem is that a patient can still miss the PDF, the income table, and the deadline.
                  Althea turns that into a guided path. The hospital still decides.
                </p>
              </div>
            </article>
            <article className="overflow-hidden rounded-[2rem] bg-cream-elev">
              <Frame
                src="/marketing/relief-gap.png"
                alt="Donation box on a wooden table"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="p-8 md:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">System 2</p>
                <h3 className="mt-4 text-3xl">Althea Relief Rail</h3>
                <p className="mt-4 text-lg leading-7 text-muted">
                  When hospital assistance stops short, a separate charitable fund can help close part of
                  a verified remaining balance.
                </p>
                <p className="mt-4 text-base leading-6 text-muted">
                  World is one liveness signal against automated claims. Privy holds organizational
                  control of the treasury. Circle executes an already approved grant. Arc records
                  settlement in USDC. The patient never holds a wallet.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="architecture" className={`${wrap} scroll-mt-28 py-20 md:py-24`}>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Fig. 1</p>
        <h2 className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
          One rail. Two jobs.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-muted">
          AI interprets the policy. Deterministic code calculates the estimate. Humans govern the
          treasury. Settlement can be checked without a medical story.
        </p>
        <figure className="mt-12 overflow-hidden rounded-[2rem] border border-line">
          <Frame
            src="/marketing/how-architecture.png"
            alt="Two stacks of folders meeting one envelope"
            ratio="aspect-[16/9]"
            sizes="(min-width: 768px) 72rem, 100vw"
          />
          <figcaption className="bg-cream-elev px-6 py-4 text-sm leading-6 text-muted">
            Hospital assistance never touches World, Privy, Circle, or Arc. Those rails run only for
            Althea Relief.
          </figcaption>
        </figure>
      </section>

      <section className="bg-cream-2 py-20 md:py-24">
        <div className={wrap}>
          <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            What each stage is for.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {stages.map((stage) => (
              <article key={stage.title} className="overflow-hidden rounded-[2rem] bg-cream-elev">
                <Frame src={stage.src} alt={stage.alt} sizes="(min-width: 768px) 45vw, 100vw" />
                <div className="p-8">
                  <h3 className="text-2xl">{stage.title}</h3>
                  <p className="mt-3 text-base leading-6 text-muted">{stage.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${wrap} py-20 md:py-24`}>
        <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
          When hospital assistance stops short.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-7 text-muted">
          Althea Relief is independent charitable aid for verified medical hardship remaining after
          available hospital financial assistance has been explored. Althea does not take a percentage
          of a patient&apos;s Relief grant.
        </p>
        <Frame
          src="/marketing/step-relief.png"
          alt="Hands exchanging a kraft envelope"
          ratio="aspect-[4/3] md:aspect-[16/9]"
          sizes="(min-width: 768px) 72rem, 100vw"
          className="mt-12 rounded-[2rem]"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reliefStages.map((stage) => (
            <article key={stage.title} className="rounded-[2rem] bg-cream-2 p-8">
              <h3 className="text-2xl">{stage.title}</h3>
              <p className="mt-3 text-base leading-6 text-muted">{stage.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream-2 py-20 md:py-24">
        <div className={wrap}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gold-deep">Programmable relief</p>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            Independent funds. One settlement.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-muted">
            Althea turns independent charitable funds into a programmable relief network. The patient
            path does not change. Behind it, matching programs, restricted vaults, and escrowed USDC
            combine on Arc.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] bg-cream-elev p-8">
              <h3 className="text-2xl">Foundation match</h3>
              <p className="mt-3 text-base leading-6 text-muted">
                A foundation commits capital to a 1:1 match with a per-case cap. It does not choose
                the patient. Privy policy keeps the wallet on Arc, USDC, and Althea contracts only.
              </p>
            </article>
            <article className="rounded-[2rem] bg-cream-elev p-8">
              <h3 className="text-2xl">Reserve, then settle</h3>
              <p className="mt-3 text-base leading-6 text-muted">
                Approved USDC is reserved against the program and provider destination, then released
                only after settlement confirmation. Expired reservations return to the fund.
              </p>
            </article>
            <article className="rounded-[2rem] bg-cream-elev p-8">
              <h3 className="text-2xl">Restricted fund accounting</h3>
              <p className="mt-3 text-base leading-6 text-muted">
                Budget, committed, settled, reserved, and remaining balances are independently
                auditable. Patient evidence stays offchain.
              </p>
            </article>
            <article className="rounded-[2rem] bg-cream-elev p-8">
              <h3 className="text-2xl">Give from any chain</h3>
              <p className="mt-3 text-base leading-6 text-muted">
                Donors sign in with email. Circle CCTP and Gateway move USDC to Arc. Automatic match
                campaigns can double a gift without putting the donor on MetaMask.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-green py-20 text-cream-elev md:py-24">
        <div className={wrap}>
          <h2 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
            Private patient. Public accountability.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-7 text-gold-soft">
            Patients should not have to publish their medical story to receive help. Sensitive
            information stays off the rail. Grant movement can still be verified.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="overflow-hidden rounded-[2rem] bg-green-dark">
              <Frame
                src="/marketing/privacy-private.png"
                alt="Sealed folder and latched box"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="p-8">
                <h3 className="text-2xl">Never on the rail</h3>
                <ul className="mt-5 space-y-3 text-base leading-6 text-gold-soft">
                  {neverOnchain.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
            <article className="overflow-hidden rounded-[2rem] bg-green-dark">
              <Frame
                src="/marketing/privacy-public.png"
                alt="Open ledger and stacked coins"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
              <div className="p-8">
                <h3 className="text-2xl">What a grant can show</h3>
                <ul className="mt-5 space-y-3 text-base leading-6 text-gold-soft">
                  {onchain.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <Frame src="/marketing/cta-check.png" alt="" fillParent sizes="100vw" />
        <div className="absolute inset-0 bg-cream/80" />
        <div className={`${wrap} relative text-center`}>
          <h2 className="mx-auto max-w-3xl text-3xl leading-tight tracking-tight md:text-5xl">
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
