import { z } from "zod";

import { dateSchema } from "../../../../../../packages/next-portal/src/types/common.schema";
import {
  userRoleRestaurantCreateSchema,
  userRoleRestaurantResponseSchema,
} from "../../../../../../packages/next-portal/src/types/user-roles.schema";
import { categoryResponseSchema } from "../../../schemas/category.schema";
import { minimalCountryResponseSchema } from "../../../schemas/locale.schema";
import { menuItemResponseSchema } from "../../../schemas/menu.schema";
import { openingTimesResponseSchema } from "../../../schemas/opening-times.schema";

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
export type RestaurantCreateType = z.infer<typeof restaurantCreateSchema>;

export const restaurantUpdateSchema = restaurantCreateSchema.extend({
  countryId: z.string().uuid({ message: "Valid country ID is required" }),
  mainCategoryId: z.string().uuid({ message: "Valid category ID is required" }),
  id: z.string().uuid(),
});
export type RestaurantUpdateType = z.infer<typeof restaurantUpdateSchema>;

export const restaurantResponseSchema = restaurantBaseSchema.extend({
  id: z.string().uuid(),
  orderCount: z.number(),
  rating: z.number().min(0).max(5),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  country: minimalCountryResponseSchema,
  mainCategory: categoryResponseSchema,
  menuItems: z.array(menuItemResponseSchema),
  userRoles: z.array(userRoleRestaurantResponseSchema).optional(),
  openingTimes: openingTimesResponseSchema,
  latitude: z.number(),
  longitude: z.number(),
});
export type RestaurantResponseType = z.input<typeof restaurantResponseSchema>;

export const restaurantsResponseSchema = z.object({
  restaurants: z.array(restaurantResponseSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
});
export type RestaurantsResponseType = z.input<typeof restaurantsResponseSchema>;

export const restaurantPrivateResponseSchema = restaurantResponseSchema.extend({
  userRoles: z.array(userRoleRestaurantResponseSchema),
});
export type RestaurantPrivateResponseType = z.infer<
  typeof restaurantPrivateResponseSchema
>;

export const restaurantProfileMinimalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Restaurant name is required" }),
  image: z.string().url().nullable(),
});
export type RestaurantProfileMinimalType = z.infer<
  typeof restaurantProfileMinimalSchema
>;

export const restaurantGetSchema = z.object({
  restaurantId: z.string(),
});
export type RestaurantGetType = z.infer<typeof restaurantGetSchema>;

export const restaurantsSearchSchema = z.object({
  search: z.string().min(2).nullable().optional(),
  countryCode: z.string().length(2),
  zip: z.string().min(1),
  street: z.string().min(1).optional().nullable(),
  streetNumber: z.string().min(1).optional().nullable(),
  radius: z.number().max(50).default(10),
  rating: z.number().min(0).max(5).optional().nullable(),
  currentlyOpen: z.boolean().optional().nullable(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(100),
});
export type RestaurantsSearchType = z.infer<typeof restaurantsSearchSchema>;
