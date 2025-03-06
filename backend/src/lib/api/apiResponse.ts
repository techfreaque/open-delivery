import { NextResponse } from "next/server";
import type { z } from "zod";

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
    { data, success: true },
    { status },
  ) satisfies NextResponse<SuccessResponse<T>>;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = errorResponseSchema.safeParse({
    success: false,
    message,
  }) as ErrorResponse;
  return NextResponse.json(response, {
    status,
  }) satisfies NextResponse<ErrorResponse>;
}

/**
 * Validates request body against a Zod schema
 * Returns validated data or throws error
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<T> {
  try {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      throw new Error(
        validation.error.errors.map((err) => err.message).join(", "),
      );
    }

    return validation.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    throw new Error("Invalid request data");
  }
}
