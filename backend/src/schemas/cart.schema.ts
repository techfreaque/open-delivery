import { z } from "zod";
import { menuItemResponseMinimalSchema } from "./menu.schema";
import { restaurantProfileMinimalSchema } from "./restaurant.schema";

export const cartItemUpdateSchema = z.object({
  menuItemId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  quantity: z.number().int().min(0),
});

export const cartItemResponseSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int(),
  menuItem: menuItemResponseMinimalSchema,
  restaurant: restaurantProfileMinimalSchema,
});
