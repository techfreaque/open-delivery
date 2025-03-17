import { z } from "zod";

import { userRoleAdminCreateSchema } from "../../../../../../../packages/next-portal/src/types/user-roles.schema";

export const registerBaseSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  imageUrl: z.string().nullable(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password confirmation is required" }),
});

export const registerSchema = registerBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);
export type RegisterType = z.infer<typeof registerSchema>;

export const adminRegisterSchema = registerBaseSchema.extend({
  userRoles: z.array(userRoleAdminCreateSchema),
});
export type AdminRegisterType = z.infer<typeof adminRegisterSchema>;
