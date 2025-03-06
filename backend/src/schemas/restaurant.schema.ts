import { z } from "zod";

import { dateSchema } from "./common.schema";
import { minimalCountryResponseSchema } from "./locale.schema";
import { menuItemResponseMinimalSchema } from "./menu.schema";
import { openingTimesResponseSchema } from "./opening-times.schema";
import {
  userRoleRestaurantCreateSchema,
  userRoleRestaurantResponseSchema,
  userRoleRestaurantUpdateSchema,
} from "./user-roles.schema";

export const restaurantCreateSchema = z.object({
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
  countryId: z.string().uuid({ message: "Valid country ID is required" }),
  mainCategoryId: z.string().uuid({ message: "Valid category ID is required" }),
  userRoles: z.array(userRoleRestaurantCreateSchema),
});

export const restaurantUpdateSchema = {
  id: z.string().uuid(),
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
  mainCategoryId: z.string().uuid({ message: "Valid category ID is required" }),
  userRoles: z.array(userRoleRestaurantUpdateSchema),
};

export const restaurantResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  street: z.string(),
  streetNumber: z.string(),
  zip: z.string(),
  city: z.string(),
  phone: z.string(),
  email: z.string().email(),
  image: z.string().url(),
  orderCount: z.number(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  rating: z.number().min(0).max(5),
  country: minimalCountryResponseSchema,
  mainCategory: z.any().nullable(),
  menuItems: z.array(menuItemResponseMinimalSchema),
  userRoles: z.array(userRoleRestaurantResponseSchema),
  openingTimes: openingTimesResponseSchema,
});

export const restaurantProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Restaurant name is required" }),
  description: z.string().nullable(),
  street: z.string().min(1, { message: "Street is required" }),
  streetNumber: z.string().min(1, { message: "Street number is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Valid email address is required" }),
  image: z.string().url().nullable(),
  orderCount: z.number(),
  createdAt: dateSchema,
  rating: z.number().min(0).max(5),
  country: minimalCountryResponseSchema,
  mainCategory: z.any().nullable(),
  menuItems: z.array(menuItemResponseMinimalSchema),
  userRoles: z.array(userRoleRestaurantResponseSchema),
  openingTimes: openingTimesResponseSchema,
});

export const restaurantProfileMinimalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: "Restaurant name is required" }),
  image: z.string().url().nullable(),
});
