import { z } from "zod";

export const restaurantCreateSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters long"),
  description: z.string(),
  address: z.string().min(5, "Address must be at least 5 characters long"),
  phone: z.string().min(5, "Phone number must be at least 5 characters long"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Image must be a valid URL"),
  cuisine: z.string(),
});

export const restaurantUpdateSchema = restaurantCreateSchema.partial();

export const restaurantResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  image: z.string(),
  rating: z.number(),
  cuisine: z.string(),
  isOpen: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const restaurantProfileSchema = z.object({
  name: z.string().min(1, { message: "Restaurant name is required" }),
  description: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZIP code is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Valid email address is required" }),
  openingHours: z.string().optional(),
  cuisineType: z.string().optional(),
  deliveryRadius: z.number().optional(),
  isActive: z.boolean().optional(),
});
