import { z } from "zod";

export const orderStatusSchema = z.enum([
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
});

export const orderCreateSchema = z.object({
  restaurantId: z.string().uuid(),
  address: z.string(),
  items: z.array(orderItemSchema).min(1),
});

export const orderUpdateSchema = z.object({
  status: orderStatusSchema.optional(),
  driverId: z.string().uuid().optional(),
});

export const orderItemResponseSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  quantity: z.number().int(),
  price: z.number(),
  menuItem: z.any().optional(),
});

export const orderResponseSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  customerId: z.string().uuid(),
  driverId: z.string().uuid().optional().nullable(),
  status: z.string(),
  total: z.number(),
  deliveryFee: z.number(),
  tax: z.number(),
  address: z.string(),
  createdAt: z.string(),
  deliveredAt: z.string().nullable().optional(),
  orderItems: z.array(orderItemResponseSchema).optional(),
  restaurant: z.any().optional(),
  customer: z.any().optional(),
  driver: z.any().optional(),
  delivery: z.any().optional(),
});
