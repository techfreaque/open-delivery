import { z } from "zod";

import { dateSchema } from "./common.schema";
import { earningResponseSchema } from "./driver-earning.schema";
import {
  userPublicResponseSchema,
  userResponseMinimalSchema,
} from "./user.schema";

export const driverCreateSchema = z.object({
  userId: z.string().uuid(),
  vehicle: z.string(),
  licensePlate: z.string(),
});

export const driverUpdateSchema = z.object({
  driverId: z.string().uuid(),
  vehicle: z.string().nullable(),
  licensePlate: z.string().nullable(),
  isActive: z.boolean().nullable(),
});

export const driverPrivateResponseSchema = z.object({
  id: z.string().uuid(),
  vehicle: z.string(),
  licensePlate: z.string(),
  isActive: z.boolean(),
  rating: z.number(),
  createdAt: dateSchema,
  user: userResponseMinimalSchema,
  earnings: z.array(earningResponseSchema),
});

export const driverPublicResponseSchema = z.object({
  id: z.string().uuid(),
  vehicle: z.string(),
  licensePlate: z.string(),
  rating: z.number(),
  createdAt: dateSchema,
  user: userPublicResponseSchema,
});
