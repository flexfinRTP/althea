import { readFileSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { ActionRow, AppLink, AppPage } from "@/components/app/AppChrome";
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
    <AppPage kicker="Policy source" title={`Demonstration Policy, ${hospital.name} FAP`}>
      <ActionRow>
        <AppLink variant="ghost" href="/check">
          Check My Bill
        </AppLink>
      </ActionRow>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-[2rem] border border-line/80 bg-cream-elev p-6 font-sans text-sm leading-6 md:p-8">
        {source}
      </pre>
    </AppPage>
  );
}
