import { describe, expect, it } from "vitest";
import { calculateFapTimeline } from "@/lib/fap/timeline";

describe("calculateFapTimeline", () => {
  it("reports day 24 of 240 for the demo bill date on 2026-09-13", () => {
    const result = calculateFapTimeline({
      firstPostDischargeBillingDate: "2026-08-20",
      referenceDate: new Date(2026, 8, 13),
    });
    expect(result.notificationPeriodDay).toBe(24);
    expect(result.applicationPeriodDay).toBe(24);
    expect(result.status).toBe("within_notification_period");
    expect(result.approximateApplicationPeriodEnd).toBe("2027-04-16");
    expect(result.messages.some((m) => m.includes("educational information"))).toBe(true);
  });

  it("returns date_missing without a bill date", () => {
    const result = calculateFapTimeline({});
    expect(result.status).toBe("date_missing");
  });

  it("marks days after 240", () => {
    const result = calculateFapTimeline({
      firstPostDischargeBillingDate: "2026-01-01",
      referenceDate: new Date(2026, 11, 1),
    });
    expect(result.status).toBe("beyond_240_days");
  });

  it("marks days 121-240 as within the application period", () => {
    const result = calculateFapTimeline({
      firstPostDischargeBillingDate: "2026-01-01",
      referenceDate: new Date(2026, 4, 15),
    });
    expect(result.status).toBe("within_application_period");
  });
});
