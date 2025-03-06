import { z } from "zod";

import { addressResponseSchema } from "./address.schema";
import { dateSchema } from "./common.schema";
import { deliveryResponseSchema } from "./delivery.schema";
import { restaurantProfileSchema } from "./restaurant.schema";
import { userPublicDetailedResponseSchema } from "./user.schema";

const orderStatusSchema = z.enum([
  "NEW",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const orderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  message: z.string().nullable(),
});

export const orderCreateSchema = z.object({
  restaurantId: z.string().uuid(),
  message: z.string().nullable(),
  items: z.array(orderItemSchema).min(1),
  deliveryFee: z.number().nonnegative(),
  driverTip: z.number().nonnegative().nullable(),
  restaurantTip: z.number().nonnegative().nullable(),
  projectTip: z.number().nonnegative().nullable(),
});

export const orderUpdateSchema = z.object({
  status: orderStatusSchema.nullable(),
  message: z.string().nullable(),
});

export const orderItemResponseSchema = z.object({
  id: z.string().uuid(),
  message: z.string().nullable(),
  quantity: z.number().int(),
  price: z.number(),
  taxPercent: z.number(),
});

export const orderResponseSchema = z.object({
  id: z.string().uuid(),
  message: z.string().nullable(),
  status: orderStatusSchema,
  total: z.number(),
  deliveryFee: z.number(),
  driverTip: z.number().nullable(),
  restaurantTip: z.number().nullable(),
  projectTip: z.number().nullable(),
  createdAt: dateSchema,
  restaurant: restaurantProfileSchema,
  customer: userPublicDetailedResponseSchema,
  address: addressResponseSchema,
  delivery: deliveryResponseSchema,
  orderItems: z.array(orderItemResponseSchema),
});
