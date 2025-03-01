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
): NextResponse {
  return validateResponseData<T>(schema, data, status);
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
): NextResponse {
  const response = errorResponseSchema.safeParse({
    success: false,
    data: message,
  } satisfies ErrorResponse);
  return NextResponse.json(response, { status });
}

/**
 * Validates response data against a schema
 */
function validateResponseData<T>(
  schema: z.ZodSchema<T>,
  data: T,
  status: number,
) {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      return NextResponse.json(
        {
          data: `Response validation error: ${errorMessage}`,
          success: false,
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }
    return NextResponse.json({
      success: true,
      data: JSON.stringify(result.data),
    } satisfies SuccessResponse);
  } catch (error) {
    return NextResponse.json(
      {
        data: "Error validating response data",
        success: false,
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
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
