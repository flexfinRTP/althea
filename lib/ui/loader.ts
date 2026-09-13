export const LOADER_STATUS = {
  default: "Loading Althea",
  case: "Loading case",
  estimate: "Loading estimate",
  application: "Loading application packet",
  print: "Loading application packet",
  decision: "Loading hospital decision",
  success: "Loading final amount",
  fund: "Loading relief fund",
  review: "Loading relief review",
  relief: "Loading relief status",
  reliefRequest: "Loading relief",
  proof: "Loading grant proof",
  treasury: "Loading treasury",
} as const;

export type LoaderStatus = (typeof LOADER_STATUS)[keyof typeof LOADER_STATUS];

export const LOADER_RAIL = {
  hospital: {
    title: "Hospital assistance",
    layer: "Offchain",
    items: ["Policy", "Estimate", "Application"],
  },
  relief: {
    title: "Relief",
    layer: "Arc · USDC",
    items: ["caseHash", "Grant proof"],
  },
} as const;

export const LOADER_STACK = [
  { role: "Liveness", name: "World", logo: "/partners/world.png" },
  { role: "Control", name: "Privy", logo: "/partners/privy.svg" },
  { role: "Execution", name: "Circle", logo: "/partners/circle.png" },
  { role: "Settlement", name: "Arc", logo: "/partners/arc.svg" },
] as const;

export const LOADER_FOOTNOTE = "No wallet required.";
export const LOADER_PRIVACY = "Patient data never onchain.";
export const LOADER_RAIL_LABEL = "Relief rail";

export const LOADER_HASH_CELLS = 8;

export function loaderAriaLabel(status: string = LOADER_STATUS.default): string {
  return [
    status,
    `${LOADER_RAIL.hospital.title} ${LOADER_RAIL.hospital.layer}.`,
    `${LOADER_RAIL.relief.title} ${LOADER_RAIL.relief.layer}.`,
    `${LOADER_RAIL_LABEL}: ${LOADER_STACK.map((item) => item.name).join(", ")}.`,
    LOADER_PRIVACY,
    LOADER_FOOTNOTE,
  ].join(" ");
}
