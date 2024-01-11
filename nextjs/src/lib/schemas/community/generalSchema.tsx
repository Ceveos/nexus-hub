import { z } from "zod";

export const GeneralSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  subdomain: z.string().min(4, "Subdomain must be at least 4 characters long").optional(),
  description: z.string().optional(),
});

export type GeneralFormData = z.infer<typeof GeneralSchema>;