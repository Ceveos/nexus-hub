import { z } from "zod";

export const CreateCommunitySchema = z.object({
  name: z.string()
    .min(1, "Community names must be at least 1 character long")
    .max(32, "Community names cannot be longer than 32 characters"),
  subdomain: z.string()
    .min(4, "Subdomains must be at least 4 characters long")
    .max(32, "Subdomains cannot be longer than 32 characters"),
  description: z.string()
    .max(256, "Community descriptions cannot be longer than 256 characters")
    .optional(),
});

export type CreateCommunityFormData = z.infer<typeof CreateCommunitySchema>;