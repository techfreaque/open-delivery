import { NextResponse } from "next/server";
import type { z, ZodSchema } from "zod";
import { ZodError } from "zod";

import {
  errorResponseSchema,
  type ErrorResponseType,
  type ResponseType,
  type SuccessResponseType,
} from "../types/response.schema";
import type { SafeReturnType } from "./api-handler";
import type { ApiEndpoint } from "./endpoint";

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<TRequest, TResponse, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  data: TResponse,
  schema: z.ZodSchema<TResponse>,
  status: number = 200,
): NextResponse<ResponseType<TResponse>> {
  const { error, data: validatedData } = validateData(data, schema);
  if (error) {
    return createErrorResponse<TRequest, TResponse, TUrlVariables>(
      endpoint,
      error,
      400,
    );
  }
  return NextResponse.json(
    { data: validatedData, success: true },
    { status },
  ) as NextResponse<SuccessResponseType<TResponse>>;
}

export function validateData<T>(
  data: T,
  schema: z.ZodSchema<T>,
):
  | {
      success: true;
      data: T;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      error: string;
    } {
  try {
    // Validate the data against the schema
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = formatZodErrors(result.error);
      return { error: errorMessage, success: false };
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data, success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error validating response";
    return { error: message, success: false };
  }
}

export function formatZodErrors(errors: ZodError): string {
  return errors.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse<TRequest, TResponse, TUrlVariables>(
  endpoint: ApiEndpoint<TRequest, TResponse, TUrlVariables>,
  message: string,
  status: number = 400,
): NextResponse<ErrorResponseType> {
  const { data, success, error } = errorResponseSchema.safeParse({
    success: false,
    message,
  });
  if (!success) {
    return NextResponse.json(
      { success: false, message: formatZodErrors(error) } as ErrorResponseType,
      { status: 500 },
    );
  }
  data.message = `[${endpoint.path.join("/")}:${endpoint.method}]: ${message}`;
  return NextResponse.json(data, {
    status,
  }) as NextResponse<ErrorResponseType>;
}

/**
 * Validates request body against a schema
 */
export async function validatePostRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<SafeReturnType<T>> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      // Create a validation error with formatted message
      const validationError = new Error(
        `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      );
      return {
        success: false,
        message: validationError.message,
        errorCode: 400,
      };
    }
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error validating request",
      errorCode: 400,
    };
  }
}

/**
 * Validates request body against a schema
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function validateGetRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<SafeReturnType<T>> {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      // Create a validation error with formatted message
      const validationError = new Error(
        `Validation error: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      );
      return {
        success: false,
        message: validationError.message,
        errorCode: 400,
      };
    }
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error validating request",
      errorCode: 400,
    };
  }
}
