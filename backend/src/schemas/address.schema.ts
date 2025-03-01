import { z } from "zod";

export const addressCreateSchema = z.object({
  userId: z.string().uuid(),
  label: z.string(),
  address: z.string(),
  isDefault: z.boolean().optional().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial();

export const addressResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  label: z.string(),
  address: z.string(),
  isDefault: z.boolean(),
});
