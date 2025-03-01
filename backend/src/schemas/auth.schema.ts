import { UserRoleValue } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const logoutResponseSchema = z.object({
  message: z.string(), // Fix: changed from z.string().email() to z.string()
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  role: z.nativeEnum(UserRoleValue),
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

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordConfirmSchema = z
  .object({
    token: z.string(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmNewPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    { message: "Passwords do not match", path: ["confirmNewPassword"] },
  );
