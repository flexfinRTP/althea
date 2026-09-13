import { readFileSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getHospital } from "@/lib/db/cases";

export default async function PolicySourcePage({
  params,
}: {
  params: Promise<{ hospitalId: string }>;
}) {
  const { hospitalId } = await params;
  let hospital;
  try {
    hospital = await getHospital(hospitalId);
  } catch {
    notFound();
  }
  if (!hospital.policySourcePath) notFound();
  const source = readFileSync(path.join(process.cwd(), hospital.policySourcePath), "utf8");
  return (
    <article className="space-y-4">
      <p className="text-sm uppercase tracking-[0.16em] text-muted">Policy source</p>
      <h1 className="text-4xl">Demonstration Policy, {hospital.name} FAP</h1>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-line bg-cream-elev p-6 font-sans text-sm leading-6">
        {source}
      </pre>
    </article>
  );
}
