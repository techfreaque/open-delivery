import { z } from "zod";

import { dateSchema } from "./common.schema";
import { driverPublicResponseSchema } from "./driver.schema";

const deliveryTypeSchema = z.enum(["PICKUP", "DELIVERY"]);

const deliveryStatusSchema = z.enum(["ASSIGNED", "PICKED_UP", "DELIVERED"]);

export const deliveryCreateSchema = z.object({
  type: deliveryTypeSchema,
  message: z.string().nullable(),
  estimatedDelivery: dateSchema,
  estimatedTime: z.number().int(), // in minutes
  distance: z.number().positive(), // in kilometers
  pickupAddress: z.string().nullable(),
  dropAddress: z.string().nullable(),
  driverId: z.string().uuid().nullable(),
});

export const deliveryUpdateSchema = z.object({
  status: deliveryStatusSchema,
  estimatedDelivery: dateSchema.nullable(),
  deliveredAt: dateSchema.nullable(),
  estimatedTime: z.number().int(),
  driverId: z.string().uuid().nullable(),
});

export const deliveryResponseSchema = z.object({
  id: z.string().uuid(),
  type: deliveryTypeSchema,
  status: deliveryStatusSchema,
  message: z.string().nullable(),
  estimatedDelivery: dateSchema,
  deliveredAt: dateSchema,
  estimatedTime: z.number().int(),
  distance: z.number(),
  pickupAddress: z.string().nullable(),
  dropAddress: z.string().nullable(),
  createdAt: dateSchema,
  updatedAt: dateSchema,

  driver: driverPublicResponseSchema.nullable(),
});
