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
  try {
    // Validate the data against the schema
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return createErrorResponse(
        `Response validation error: ${errorMessage}`,
        500,
      );
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return NextResponse.json(
      { data: result.data, success: true },
      { status },
    ) satisfies NextResponse<SuccessResponse<T>>;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error validating response";
    return createErrorResponse(`Response processing error: ${message}`, 500);
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
 * Format Zod error messages
 */
function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
  }
  return "Unknown validation error";
}
