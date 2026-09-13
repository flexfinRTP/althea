import { jsonError, jsonOk } from "@/lib/http";
import { ensureDemoCase, getFullCase, getCaseTimeline } from "@/lib/db/cases";
import { ESTIMATE_DISCLAIMER } from "@/lib/config";
import { readSession, writeSession } from "@/lib/auth";

export async function POST() {
  try {
    const created = await ensureDemoCase();
    const session = await readSession();
    await writeSession({
      ...session,
      caseIds: session.caseIds.includes("demo") ? session.caseIds : [...session.caseIds, "demo"],
    });
    return jsonOk({
      caseId: created.id,
      status: created.status,
      case: await getFullCase("demo"),
      timeline: await getCaseTimeline("demo"),
      disclaimer: ESTIMATE_DISCLAIMER,
    });
  } catch (error) {
    return jsonError(error);
  }
}
