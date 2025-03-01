import { z } from "zod";

export const deliveryStatusSchema = z.enum([
  "ASSIGNED",
  "PICKED_UP",
  "DELIVERED",
]);

export const deliveryCreateSchema = z.object({
  orderId: z.string().uuid(),
  estimatedTime: z.number().int().optional(),
  distance: z.number().positive(),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  dropoffLat: z.number().optional(),
  dropoffLng: z.number().optional(),
});

export const deliveryUpdateSchema = z.object({
  status: deliveryStatusSchema.optional(),
  estimatedDelivery: z.date().optional(),
});

export const deliveryResponseSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.string(),
  estimatedDelivery: z.string().nullable().optional(),
  estimatedTime: z.number().int().nullable().optional(),
  distance: z.number(),
  tip: z.number().nullable().optional(),
  pickupLat: z.number().nullable().optional(),
  pickupLng: z.number().nullable().optional(),
  dropoffLat: z.number().nullable().optional(),
  dropoffLng: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  order: z.any().optional(),
});
