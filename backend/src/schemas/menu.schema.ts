import { z } from "zod";

import { categoryResponseSchema } from "./category.schema";
import { dateSchema } from "./common.schema";

const menuItemBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  taxPercent: z.number().min(0).default(0),
  restaurantId: z.string().uuid(),
});

export const menuItemCreateSchema = menuItemBaseSchema.extend({
  published: z.boolean().optional().default(true),
  availableFrom: z.date().nullable().optional(),
  availableTo: z.date().nullable().optional(),
  categoryId: z.string().uuid().optional(),
});

export const menuItemResponseMinimalSchema = menuItemBaseSchema.extend({
  id: z.string().uuid(),
  category: categoryResponseSchema,
});

export const menuItemResponseSchema = menuItemResponseMinimalSchema.extend({
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string(),
  image: z.string().optional(),
  restaurantId: z.string().uuid(),
});

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

export const menuItemSearchSchema = z.object({
  categoryId: z.string().uuid().nullable(),
  published: z.boolean().nullable(),
  minPrice: z.number().nullable(),
  maxPrice: z.number().nullable(),
  restaurantId: z.string().uuid().nullable(),
});
