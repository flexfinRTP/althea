import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { ExtractionResult, fapPolicySchema, validateFapPolicy } from "@/lib/fap/schema";

const SYSTEM = `You are extracting structured financial-assistance rules from a hospital's public Financial Assistance Policy.

Do not make eligibility decisions.
Do not infer requirements that are not present.
Return null/unknown where the policy does not specify a field.
Every extracted rule must point to a source page or section.
If a field is ambiguous, omit it rather than guessing.`;

export async function extractFapPolicy(documentText: string): Promise<ExtractionResult> {
  const key = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      status: "NEEDS_REVIEW",
      issues: ["AI_API_KEY is not configured. Policy extraction requires a model and then Zod validation."],
    };
  }

  const openai = createOpenAI({ apiKey: key });
  const result = await generateText({
    model: openai("gpt-4o"),
    system: SYSTEM,
    prompt: `Extract a JSON object matching the Althea FapPolicy schema from this policy text:\n\n${documentText}`,
  });

  let parsed: unknown;
  try {
    const start = result.text.indexOf("{");
    const end = result.text.lastIndexOf("}");
    parsed = JSON.parse(result.text.slice(start, end + 1));
  } catch {
    return { status: "NEEDS_REVIEW", issues: ["Model output was not valid JSON."] };
  }

  const validated = fapPolicySchema.safeParse(parsed);
  if (!validated.success) {
    return {
      status: "NEEDS_REVIEW",
      issues: validated.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      policy: parsed as Partial<typeof parsed>,
    };
  }
  return validateFapPolicy(validated.data);
}
