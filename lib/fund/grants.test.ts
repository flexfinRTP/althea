import { describe, expect, it } from "vitest";
import { toPublicGrantList } from "@/lib/fund/grants";

describe("toPublicGrantList", () => {
  it("drops prepared grants, omits case fields, and sorts newest first", () => {
    const rows = toPublicGrantList(
      [
        {
          id: "grant_old",
          amount: 200,
          status: "confirmed",
          arcTransactionHash: "0xold",
          confirmedAt: "2026-08-01T00:00:00.000Z",
        },
        {
          id: "grant_new",
          amount: 500,
          status: "submitted",
          submittedAt: "2026-09-01T00:00:00.000Z",
        },
        {
          id: "grant_prep",
          amount: 50,
          status: "prepared",
        },
        {
          id: "grant_reserved",
          amount: 500,
          status: "reserved",
          submittedAt: "2026-09-02T00:00:00.000Z",
        },
      ],
      "Althea General Medical Hardship Fund",
    );
    expect(rows.map((row) => row.id)).toEqual(["grant_reserved", "grant_new", "grant_old"]);
    expect(rows[0]).toMatchObject({
      amount: 500,
      status: "submitted",
      program: "Althea General Medical Hardship Fund",
    });
    expect(JSON.stringify(rows)).not.toContain("prepared");
  });
});
