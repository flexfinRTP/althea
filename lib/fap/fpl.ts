import fpl2026 from "@/data/fpl/2026.json";

export type FplJurisdiction = "contiguous_us" | "alaska" | "hawaii";

export type FplGuidelineTable = {
  year: number;
  jurisdictions: Record<
    FplJurisdiction,
    {
      label: string;
      additionalPersonAmount: number;
      households: { householdSize: number; annualGuidelineAmount: number }[];
    }
  >;
};

const tables: Record<number, FplGuidelineTable> = {
  2026: fpl2026 as FplGuidelineTable,
};

export function getFplTable(year = 2026): FplGuidelineTable {
  const table = tables[year];
  if (!table) {
    throw new Error(`No FPL table for year ${year}`);
  }
  return table;
}

export function getGuidelineAmount(
  householdSize: number,
  jurisdiction: FplJurisdiction = "contiguous_us",
  year = 2026,
): number {
  if (!Number.isInteger(householdSize) || householdSize < 1) {
    throw new Error("Household size must be an integer of at least 1.");
  }
  const table = getFplTable(year);
  const set = table.jurisdictions[jurisdiction];
  if (!set) {
    throw new Error(`Unknown FPL jurisdiction: ${jurisdiction}`);
  }
  const exact = set.households.find((row) => row.householdSize === householdSize);
  if (exact) return exact.annualGuidelineAmount;
  const eight = set.households.find((row) => row.householdSize === 8);
  if (!eight) {
    throw new Error("FPL table missing household size 8.");
  }
  return eight.annualGuidelineAmount + set.additionalPersonAmount * (householdSize - 8);
}

export function calculateFplPercent(input: {
  householdIncome: number;
  householdSize: number;
  jurisdiction?: FplJurisdiction;
  guidelineYear?: number;
}): number {
  const { householdIncome, householdSize, jurisdiction = "contiguous_us", guidelineYear = 2026 } =
    input;
  if (!Number.isFinite(householdIncome) || householdIncome < 0) {
    throw new Error("Household income must be a non-negative number.");
  }
  const guideline = getGuidelineAmount(householdSize, jurisdiction, guidelineYear);
  if (guideline <= 0) {
    throw new Error("FPL guideline must be positive.");
  }
  const raw = (householdIncome / guideline) * 100;
  return Math.round(raw * 10) / 10;
}
