import { z } from "zod";

// Common reusable schemas
export const dateSchema = z
  .string()
  .or(z.date())
  .transform((val) => (val instanceof Date ? val.toISOString() : val));

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const searchSchema = z.object({
  search: z.string().nullable(),
});

export const dateRangeSchema = z.object({
  startDate: dateSchema.nullable(),
  endDate: dateSchema.nullable(),
});

// Common response schemas
export const messageResponseSchema = z.string();

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.string().nullable(),
});
