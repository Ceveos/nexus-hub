import { z } from "zod";

export const DomainSchema = z.object({
  id: z.string().uuid(),
  customDomain: z.string().optional(),
  domainVerified: z.boolean().optional()
});

export type DomainFormData = z.infer<typeof DomainSchema>;