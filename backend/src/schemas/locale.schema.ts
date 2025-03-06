import { z } from "zod";

export const languageCreateSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(2, { message: "Language code is required" }),
  countryIds: z.array(
    z.string().uuid({ message: "Valid country ID is required" }),
  ),
});

export const languageUpdateSchema = languageCreateSchema;

export const languageResponseSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const countryCreateSchema = z.object({
  code: z.string().min(2, { message: "Country code is required" }),
  name: z.string().min(1, { message: "Country name is required" }),
});

export const countryUpdateSchema = countryCreateSchema;

export const countryResponseSchema = z.object({
  name: z.string(),
  code: z.string(),
  languages: z.array(languageResponseSchema),
});
export const minimalCountryResponseSchema = countryCreateSchema;
