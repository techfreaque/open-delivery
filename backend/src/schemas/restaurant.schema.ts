import { z } from "zod";

import { dateSchema } from "./common.schema";
import { minimalCountryResponseSchema } from "./locale.schema";
import { menuItemResponseMinimalSchema } from "./menu.schema";
import { openingTimesResponseSchema } from "./opening-times.schema";
import {
  userRoleRestaurantCreateSchema,
  userRoleRestaurantResponseSchema,
} from "./user-roles.schema";

const restaurantBaseSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Restaurant name must be at least 2 characters long" }),
  description: z.string(),
  street: z.string().min(1, { message: "Street is required" }),
  streetNumber: z.string().min(1, { message: "Street number is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z
    .string()
    .min(5, { message: "Phone number must be at least 5 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  image: z.string().url({ message: "Image must be a valid URL" }),
  published: z.boolean(),
});

export const restaurantCreateSchema = restaurantBaseSchema.extend({
  countryId: z.string().uuid({ message: "Valid country ID is required" }),
  mainCategoryId: z.string().uuid({ message: "Valid category ID is required" }),
  userRoles: z.array(userRoleRestaurantCreateSchema),
});

export const restaurantUpdateSchema = restaurantCreateSchema.extend({
  id: z.string().uuid(),
});

export const restaurantProfileSchema = restaurantBaseSchema.extend({
  id: z.string().uuid(),
  orderCount: z.number(),
  rating: z.number().min(0).max(5),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  country: minimalCountryResponseSchema,
  mainCategory: z.any().nullable(),
  menuItems: z.array(menuItemResponseMinimalSchema),
  openingTimes: openingTimesResponseSchema,
  latitude: z.number(),
  longitude: z.number(),
});

export const restaurantResponseSchema = restaurantProfileSchema.extend({
  userRoles: z.array(userRoleRestaurantResponseSchema),
});

export const restaurantProfileMinimalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Restaurant name is required" }),
  image: z.string().url().nullable(),
});

export const restaurantGetSchema = z.object({
  search: z.string().min(2).nullable().optional(),
  countryCode: z.string().length(2),
  zip: z.string().min(1),
  street: z.string().min(1).optional().nullable(),
  streetNumber: z.string().min(1).optional().nullable(),
  radius: z.number().max(50),
  rating: z.number().min(0).max(5).optional().nullable(),
  currentlyOpen: z.boolean().optional().nullable(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(100),
});
