import { z } from "zod";

import { minimalCountryResponseSchema } from "./locale.schema";

export const addressCreateSchema = z.object({
  userId: z.string().uuid({ message: "Valid user ID is required" }),
  label: z.string().min(1, { message: "Label is required" }),
  street: z.string().min(1, { message: "Street is required" }),
  streetNumber: z.string().min(1, { message: "Street number is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z.string().nullable(),
  isDefault: z.boolean().nullable().default(false),
  countryId: z.string().uuid({ message: "Valid country ID is required" }),
});

export const addressUpdateSchema = addressCreateSchema.partial();

export const addressResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  label: z.string(),
  name: z.string(),
  message: z.string().nullable(),
  street: z.string(),
  streetNumber: z.string(),
  zip: z.string(),
  city: z.string(),
  phone: z.string().nullable(),
  isDefault: z.boolean(),
  country: minimalCountryResponseSchema,
});
