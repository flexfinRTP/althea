import { readFileSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";

const POLICY_FILES: Record<string, { file: string; title: string }> = {
  hosp_demo_001: {
    file: "data/hospitals/example-medical-center/fap-2026.md",
    title: "Demonstration Policy, Example Medical Center 2026 FAP",
  },
  hosp_riverside_001: {
    file: "data/hospitals/riverside-community/fap-2026.md",
    title: "Demonstration Policy, Riverside Community Hospital 2026 FAP",
  },
};

export default async function PolicySourcePage({
  params,
}: {
  params: Promise<{ hospitalId: string }>;
}) {
  const { hospitalId } = await params;
  const meta = POLICY_FILES[hospitalId];
  if (!meta) notFound();
  const source = readFileSync(path.join(process.cwd(), meta.file), "utf8");
  return (
    <article className="space-y-4">
      <p className="text-sm uppercase tracking-[0.16em] text-[#5c564c]">Policy source</p>
      <h1 className="text-4xl">{meta.title}</h1>
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-[#e3d9c8] bg-[#fffdf8] p-6 font-sans text-sm leading-6">
        {source}
      </pre>
    </article>
  );
}
