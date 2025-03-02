import { UserRoleValue } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.nativeEnum(UserRoleValue)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  token: z.string(),
});

// Rename to match imports in types.ts
export const resetPasswordRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const resetPasswordConfirmSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
