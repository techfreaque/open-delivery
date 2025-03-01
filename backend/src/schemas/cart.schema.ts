import { z } from "zod";

export const cartItemSchema = z.object({
  menuItemId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const cartItemResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  quantity: z.number().int(),
  menuItem: z.any().optional(),
  restaurant: z.any().optional(),
});
