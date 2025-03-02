import { z } from "zod";

// Base menu item schema
export const menuItemSchema = z.object({
  id: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  category: z.string(),
  isAvailable: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Menu item creation schema
export const menuItemCreateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string(),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  category: z.string(),
  image: z.string().url().optional(),
  isAvailable: z.boolean().default(true),
});

// Menu item update schema
export const menuItemUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  image: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
});

// Menu item search schema
export const menuItemSearchSchema = z.object({
  category: z.string().optional(),
  isAvailable: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export const menuCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
  displayOrder: z.number().int().nonnegative().optional(),
});
