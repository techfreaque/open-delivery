import { z } from "zod";

/**
 * Validates request body against a Zod schema
 */
export function validateRequestBody<T>(body: unknown, schema: z.ZodType<T>): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
}

/**
 * Validates response data against a Zod schema
 */
export function validateResponseData<T>(
  data: unknown,
  schema: z.ZodType<T>,
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Response validation error: ${JSON.stringify(error.errors)}`,
      );
    }
    throw error;
  }
}
