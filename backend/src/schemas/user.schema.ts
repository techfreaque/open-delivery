import { z } from "zod";

import { addressResponseSchema } from "./address.schema";
import { cartItemResponseSchema } from "./cart.schema";
import { dateSchema } from "./common.schema";
import { userRoleResponseSchema } from "./user-roles.schema";

export const userPublicResponseSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
});

export const userPublicDetailedResponseSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
});

export const userResponseMinimalSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
});

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  roles: z.array(userRoleResponseSchema),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  addresses: z.array(addressResponseSchema),
  cartItems: z.array(cartItemResponseSchema),
});

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  expiresAt: z.string().or(z.date()),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  token: z.string(),
});
