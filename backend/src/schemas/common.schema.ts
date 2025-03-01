import { z } from "zod";

// Common reusable schemas
export const idSchema = z.object({
  id: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const searchSchema = z.object({
  search: z.string().optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Common response schemas
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});
