import { z } from "zod";

import { categoryResponseSchema } from "./category.schema";
import { dateSchema } from "./common.schema";
import { restaurantProfileMinimalSchema } from "./restaurant.schema";

// Base menu item schema
export const menuItemResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  taxPercent: z.number().nonnegative(),
  image: z.string().url().nullable(),
  published: z.boolean(),
  availableFrom: dateSchema.nullable(),
  availableTo: dateSchema.nullable(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  restaurant: restaurantProfileMinimalSchema,
  category: categoryResponseSchema,
});

export const menuItemResponseMinimalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  taxPercent: z.number().nonnegative(),
  image: z.string().url().nullable(),
  published: z.boolean(),
  availableFrom: dateSchema.nullable(),
  availableTo: dateSchema.nullable(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  category: categoryResponseSchema,
});

// Menu item creation schema
export const menuItemCreateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string(),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  taxPercent: z
    .number()
    .nonnegative({ message: "Tax percent must be non-negative" }),
  image: z.string().url().nullable(),
  published: z.boolean().default(true),
  availableFrom: dateSchema.nullable(),
  availableTo: dateSchema.nullable(),
  categoryId: z.string().uuid({ message: "Valid category ID is required" }),
  restaurantId: z.string().uuid({ message: "Valid restaurant ID is required" }),
});

// Menu item update schema
export const menuItemUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  taxPercent: z.number().nonnegative(),
  image: z.string().url().nullable(),
  published: z.boolean(),
  availableFrom: dateSchema.nullable(),
  availableTo: dateSchema.nullable(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  categoryId: z.string().uuid({ message: "Valid category ID is required" }),
  restaurantId: z.string().uuid({ message: "Valid restaurant ID is required" }),
});

// Menu item search schema
export const menuItemSearchSchema = z.object({
  categoryId: z.string().uuid().nullable(),
  published: z.boolean().nullable(),
  minPrice: z.number().nullable(),
  maxPrice: z.number().nullable(),
  restaurantId: z.string().uuid().nullable(),
});
