import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12 py-8">
      <section className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.18em] text-[#5c564c]">Althea Care</p>
        <h1 className="text-4xl leading-tight md:text-6xl">
          An $18,000 hospital bill doesn&apos;t always mean you owe $18,000.
        </h1>
        <p className="max-w-2xl text-lg text-[#5c564c]">
          Althea helps you find and understand hospital financial assistance before an unaffordable bill becomes debt.
        </p>
        <Link
          href="/check"
          className="inline-flex rounded-md bg-[#1f4a43] px-5 py-3 text-[#fffdf8]"
        >
          Check My Bill
        </Link>
        <p className="text-sm text-[#5c564c]">
          No loans. No percentage of your assistance. No medical information published onchain.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Hospital assistance", "Find and understand a published Financial Assistance Policy."],
          ["Althea Relief", "Separate charitable help for a verified remaining balance."],
          ["Public proof", "Grant movement can be verified without patient records."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-[#e3d9c8] bg-[#fffdf8] p-5">
            <h2 className="mb-2 text-xl">{title}</h2>
            <p className="text-sm text-[#5c564c]">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
