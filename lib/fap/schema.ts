import { z } from "zod";

export const applicationMethodSchema = z.enum([
  "online",
  "mail",
  "fax",
  "in_person",
  "phone",
]);

export const requiredDocumentTypeSchema = z.enum([
  "proof_of_income",
  "pay_stub",
  "tax_return",
  "proof_of_residency",
  "insurance_document",
  "hospital_bill",
  "application_form",
  "other",
]);

export const policyCitationSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  page: z.number().int().positive().optional(),
  section: z.string().optional(),
  shortExcerpt: z.string().optional(),
});

export const requiredDocumentSchema = z.object({
  id: z.string(),
  type: requiredDocumentTypeSchema,
  required: z.boolean(),
  description: z.string(),
  citationIds: z.array(z.string()),
});

export const ruleConditionSchema = z.object({
  field: z.enum([
    "insurance_status",
    "residency",
    "asset_test",
    "service_type",
    "other",
  ]),
  operator: z.enum(["equals", "not_equals", "in", "not_in", "requires_review"]),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
});

export const assistanceRuleSchema = z.object({
  id: z.string(),
  minFplPercent: z.number().nonnegative().optional(),
  maxFplPercent: z.number().nonnegative().optional(),
  assistanceType: z.enum([
    "free",
    "percentage_discount",
    "amount_limit",
    "amounts_generally_billed",
    "custom",
  ]),
  discountPercent: z.number().min(0).max(100).optional(),
  fixedAssistanceAmount: z.number().nonnegative().optional(),
  customDescription: z.string().optional(),
  conditions: z.array(ruleConditionSchema).optional(),
  citationIds: z.array(z.string()),
});

export const fapPolicySchema = z.object({
  hospitalName: z.string(),
  policyScope: z.object({
    emergencyCare: z.boolean().optional(),
    medicallyNecessaryCare: z.boolean().optional(),
    insuredPatientsEligible: z.union([z.boolean(), z.literal("conditional")]).optional(),
  }),
  freeCareRules: z.array(assistanceRuleSchema),
  discountedCareRules: z.array(assistanceRuleSchema),
  residency: z
    .object({
      required: z.boolean(),
      allowedStates: z.array(z.string()).optional(),
      description: z.string().optional(),
    })
    .optional(),
  assets: z
    .object({
      evaluated: z.boolean(),
      description: z.string().optional(),
    })
    .optional(),
  householdDefinition: z.string().optional(),
  requiredDocuments: z.array(requiredDocumentSchema),
  applicationMethods: z.array(applicationMethodSchema),
  applicationUrl: z.string().optional(),
  billingOffice: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  collectionsSummary: z.string().optional(),
  notes: z.array(z.string()).optional(),
  citations: z.array(policyCitationSchema),
});

export type FapPolicy = z.infer<typeof fapPolicySchema>;
export type AssistanceRule = z.infer<typeof assistanceRuleSchema>;
export type PolicyCitation = z.infer<typeof policyCitationSchema>;
export type RequiredDocument = z.infer<typeof requiredDocumentSchema>;
export type ApplicationMethod = z.infer<typeof applicationMethodSchema>;

export type ExtractionResult =
  | { status: "validated"; policy: FapPolicy }
  | { status: "NEEDS_REVIEW"; issues: string[]; policy?: Partial<FapPolicy> };

export function validateFapPolicy(input: unknown): ExtractionResult {
  const parsed = fapPolicySchema.safeParse(input);
  if (parsed.success) {
    return { status: "validated", policy: parsed.data };
  }
  return {
    status: "NEEDS_REVIEW",
    issues: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };
}
