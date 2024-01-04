import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required")
});

export type UserFormData = z.infer<typeof UserSchema>;