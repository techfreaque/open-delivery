import { z } from "zod";

import { dateSchema } from "./common.schema";

/**
 * Schema for creating a new earning record
 */
export const earningCreateSchema = z.object({
  userId: z.string().uuid({ message: "Valid driver ID is required" }),
  date: dateSchema,
  amount: z.number().positive({ message: "Amount must be positive" }),
  deliveries: z
    .number()
    .int()
    .positive({ message: "Deliveries count must be positive" }),
});

/**
 * Schema for updating an existing earning record
 */
export const earningUpdateSchema = z.object({
  date: dateSchema,
  amount: z.number().positive({ message: "Amount must be positive" }),
  deliveries: z
    .number()
    .int()
    .positive({ message: "Deliveries count must be positive" }),
});

/**
 * Schema for earning responses
 */
export const earningResponseSchema = z.object({
  id: z.string().uuid(),
  date: dateSchema,
  amount: z.number(),
  deliveries: z.number().int(),
  createdAt: dateSchema,
});

/**
 * Schema for earning search parameters
 */
export const earningSearchSchema = z.object({
  driverId: z.string().uuid().nullable(),
  startDate: dateSchema.nullable(),
  endDate: dateSchema.nullable(),
  minAmount: z.number().nullable(),
  maxAmount: z.number().nullable(),
});

/**
 * Schema for earnings summary response
 */
export const earningsSummarySchema = z.object({
  totalEarnings: z.number(),
  totalDeliveries: z.number(),
  averagePerDelivery: z.number(),
  periodStart: dateSchema,
  periodEnd: dateSchema,
});
