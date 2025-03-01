import { z } from "zod";

export const driverCreateSchema = z.object({
  userId: z.string().uuid(),
  vehicle: z.string(),
  licensePlate: z.string(),
});

export const driverUpdateSchema = z.object({
  vehicle: z.string().optional(),
  licensePlate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const driverResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  vehicle: z.string(),
  licensePlate: z.string(),
  isActive: z.boolean(),
  rating: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.any().optional(),
  earnings: z.array(z.any()).optional(),
});
