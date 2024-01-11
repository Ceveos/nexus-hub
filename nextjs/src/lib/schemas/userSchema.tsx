import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  avatar: z.object({
    file: z.instanceof(File).refine(file => file.size <= 1048576, {
      message: "File size should be less than 1MB",
    })
    .optional(),
  })
  .optional()
});

export type UserFormData = z.infer<typeof UserSchema>;