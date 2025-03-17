import { z } from "zod";

import { dateSchema } from "@/next-portal/types/common.schema";

import { userResponseSchema } from "../user.schema";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export type LoginFormType = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  expiresAt: dateSchema,
  token: z.string(),
});
export type LoginResponseType = z.input<typeof loginResponseSchema>;
