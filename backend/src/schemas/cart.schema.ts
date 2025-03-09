import { z } from "zod";

import { menuItemResponseMinimalSchema } from "./menu.schema";
import { restaurantProfileMinimalSchema } from "./restaurant.schema";

const cartItemBaseSchema = z.object({
  quantity: z.number().int().min(0),
  userId: z.string().uuid(),
});

export const cartItemUpdateSchema = cartItemBaseSchema.extend({
  menuItemId: z.string().uuid(),
  restaurantId: z.string().uuid(),
});

export const cartItemResponseSchema = cartItemBaseSchema.extend({
  menuItem: menuItemResponseMinimalSchema,
  restaurant: restaurantProfileMinimalSchema,
});

export const cartItemsResponseSchema = z.array(cartItemResponseSchema);
