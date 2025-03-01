import { NextResponse } from "next/server";
import type { z } from "zod";

import type { ApiResponse } from "@/types/types";

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
): NextResponse {
  const response: ApiResponse<T> = {
    data,
    status,
  };
  return NextResponse.json(response, { status });
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
): NextResponse {
  const response: ApiResponse<null> = {
    error: message,
    status,
  };
  return NextResponse.json(response, { status });
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
