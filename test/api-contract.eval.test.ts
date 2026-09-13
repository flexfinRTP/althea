import { describe, expect, it } from "vitest";
import { readdirSync, statSync } from "fs";
import path from "path";

function routeFiles(dir: string, prefix = "/api"): string[] {
  const entries = readdirSync(dir);
  const routes: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      routes.push(...routeFiles(full, `${prefix}/${entry}`));
    } else if (entry === "route.ts") {
      routes.push(prefix.replace(/\\/g, "/"));
    }
  }
  return routes;
}

describe("documented API routes exist on disk", () => {
  it("covers the DATA_MODEL_API contract plus required live endpoints", () => {
    const found = routeFiles(path.join(process.cwd(), "app", "api"));
    const required = [
      "/api/hospitals",
      "/api/hospitals/[hospitalId]",
      "/api/hospitals/[hospitalId]/fap",
      "/api/cases",
      "/api/cases/[caseId]",
      "/api/cases/[caseId]/estimate",
      "/api/cases/[caseId]/timeline",
      "/api/cases/[caseId]/application-packet",
      "/api/cases/[caseId]/mark-submitted",
      "/api/cases/[caseId]/relief-request",
      "/api/cases/[caseId]/hospital-decision",
      "/api/demo/cases/[caseId]/hospital-decision",
      "/api/world/verify",
      "/api/relief/[reliefRequestId]/evaluate",
      "/api/relief/[reliefRequestId]/approve",
      "/api/relief/[reliefRequestId]/execute",
      "/api/treasury/balance",
      "/api/treasury/fund-relief-pool",
      "/api/treasury/transactions",
      "/api/public/relief-stats",
      "/api/public/grants",
      "/api/public/grants/[grantId]",
      "/api/relief/program",
    ];
    for (const route of required) {
      expect(found).toContain(route);
    }
  });
});
