import { NextResponse } from "next/server";
import type { z, ZodSchema } from "zod";
import { ZodError } from "zod";

import { errorResponseSchema } from "@/schemas";
import type { ErrorResponse, SuccessResponse } from "@/types/types";

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  schema: z.ZodSchema<T>,
  status: number = 200,
): NextResponse<SuccessResponse<T> | ErrorResponse> {
  const { error, data: validatedData } = validateData(data, schema);
  if (error) {
    return createErrorResponse(error, 400);
  }
  return NextResponse.json(
    { data: validatedData, success: true },
    { status },
  ) as NextResponse<SuccessResponse<T>>;
}

export function validateData<T>(
  data: T,
  schema: z.ZodSchema<T>,
): {
  data?: T;
  error?: string;
} {
  try {
    // Validate the data against the schema
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { error: errorMessage };
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error validating response";
    return { error: message };
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
): NextResponse<ErrorResponse> {
  const response = errorResponseSchema.safeParse({
    success: false,
    message,
  });
  return NextResponse.json(response.data, {
    status,
  }) as NextResponse<ErrorResponse>;
}

/**
 * Validates request body against a schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      // Create a validation error with formatted message
      const validationError = new Error(
        `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
    throw error;
  }
}

/**
 * Validates request body against a schema
 */
export function validateGetRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
): T {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedData = schema.parse(params);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      // Create a validation error with formatted message
      const validationError = new Error(
        `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
    throw error;
  }
}
