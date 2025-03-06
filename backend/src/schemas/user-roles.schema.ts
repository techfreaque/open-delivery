import { z } from "zod";

const userRoleTypeSchema = z.enum([
  "CUSTOMER",
  "RESTAURANT_ADMIN",
  "RESTAURANT_EMPLOYEE",
  "DRIVER",
  "ADMIN",
]);

export const userRoleRestaurantCreateSchema = z.object({
  role: userRoleTypeSchema,
  userId: z.string().uuid(),
});

export const userRoleRestaurantResponseSchema = z.object({
  id: z.string().uuid(),
  role: userRoleTypeSchema,
  userId: z.string().uuid(),
});

export const userRoleRestaurantUpdateSchema = userRoleRestaurantResponseSchema;

export const userRoleResponseSchema = z.object({
  id: z.string().uuid(),
  role: userRoleTypeSchema,
  restaurantId: z.string().uuid().nullable(),
});
