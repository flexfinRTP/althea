import { keccak256, stringToHex, concat, toBytes, toHex } from "viem";
import { randomBytes } from "crypto";

const DOMAIN = "althea.relief.case.v1";

export function generateCaseHashMaterial(caseId: string): {
  caseHash: string;
  salt: string;
} {
  const salt = toHex(randomBytes(32));
  const caseHash = keccak256(
    concat([toBytes(stringToHex(DOMAIN)), toBytes(stringToHex(caseId)), toBytes(salt)]),
  );
  return { caseHash, salt };
}

export function programIdBytes32(programId: string): `0x${string}` {
  return keccak256(stringToHex(programId));
}

export function decisionHash(input: {
  reliefRequestId: string;
  grantAmount: number;
  rulesVersion: string;
  approvedBy?: string;
}): `0x${string}` {
  return keccak256(
    stringToHex(
      JSON.stringify({
        domain: "althea.relief.decision.v1",
        ...input,
      }),
    ),
  );
}
