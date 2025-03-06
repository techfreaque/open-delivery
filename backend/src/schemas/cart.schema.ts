import { z } from "zod";

export const cartItemUpdateSchema = z.object({
  menuItemId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  quantity: z.number().int().min(0),
});

export const cartItemResponseSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int(),
  menuItem: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    taxPercent: z.number(),
    image: z.string().url().nullable(),
    category: z.object({
      name: z.string(),
      image: z.string().url(),
    }),
  }),
  restaurant: z.object({
    name: z.string(),
    image: z.string().url(),
  }),
});
