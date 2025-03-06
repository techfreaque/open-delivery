import { z } from "zod";

import { dateSchema } from "./common.schema";

export const openingTimesCreateSchema = z.object({
  day: z.coerce.number().int().min(1).max(7), // 1-7 for Monday-Sunday
  open: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Opening time must be in HH:mm format",
    })
    .optional(),
  close: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Closing time must be in HH:mm format",
    })
    .optional(),
  validFrom: dateSchema.nullable(),
  validTo: dateSchema.nullable(),
  restaurantId: z.string().uuid({ message: "Valid restaurant ID is required" }),
});

export const openingTimesUpdateSchema = z.object({
  id: z.string().uuid(),
  day: z.coerce.number().int().min(1).max(7), // 1-7 for Monday-Sunday
  open: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Opening time must be in HH:mm format",
    })
    .optional(),
  close: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Closing time must be in HH:mm format",
    })
    .optional(),
  validFrom: dateSchema.nullable(),
  validTo: dateSchema.nullable(),
  restaurantId: z.string().uuid({ message: "Valid restaurant ID is required" }),
});

export const openingTimesResponseSchema = z.object({
  id: z.string().uuid(),
  day: z.coerce.number().int().min(1).max(7), // 1-7 for Monday-Sunday
  open: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Opening time must be in HH:mm format",
    })
    .optional(),
  close: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Closing time must be in HH:mm format",
    })
    .optional(),
  validFrom: dateSchema.nullable(),
  validTo: dateSchema.nullable(),
});
