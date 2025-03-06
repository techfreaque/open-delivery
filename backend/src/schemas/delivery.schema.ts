import { z } from "zod";

import { dateSchema } from "./common.schema";
import { driverPublicResponseSchema } from "./driver.schema";

const deliveryTypeSchema = z.enum(["PICKUP", "DELIVERY"]);

const deliveryStatusSchema = z.enum(["ASSIGNED", "PICKED_UP", "DELIVERED"]);

const deliveryBaseSchema = z.object({
  type: deliveryTypeSchema,
  status: deliveryStatusSchema,
  message: z.string().nullable(),
  estimatedTime: z.number().int(), // in minutes
  estimatedDelivery: dateSchema,
  deliveredAt: dateSchema,
  distance: z.number().positive(), // in kilometers
  pickupAddress: z.string().nullable(),
  dropAddress: z.string().nullable(),
});

export const deliveryCreateSchema = deliveryBaseSchema.extend({
  driverId: z.string().uuid().nullable(),
});

export const deliveryUpdateSchema = z.object({
  id: z.string().uuid(),
  status: deliveryStatusSchema,
  estimatedDelivery: dateSchema.nullable(),
  deliveredAt: dateSchema.nullable(),
  estimatedTime: z.number().int(),
  driverId: z.string().uuid().nullable(),
});

export const deliveryResponseSchema = deliveryBaseSchema.extend({
  id: z.string().uuid(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  driver: driverPublicResponseSchema.nullable(),
});
