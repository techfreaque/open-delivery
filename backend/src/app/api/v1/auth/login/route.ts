import type { NextResponse } from "next/server";

import { createErrorResponse, validateRequest } from "@/lib/api/apiResponse";
import { loginUser } from "@/lib/auth/authService";
import { loginSchema } from "@/schemas";
import type {
  ErrorResponse,
  LoginFormType,
  LoginResponseType,
  SuccessResponse,
} from "@/types/types";

export async function POST(
  request: Request,
): Promise<NextResponse<SuccessResponse<LoginResponseType> | ErrorResponse>> {
  try {
    const validatedData = await validateRequest<LoginFormType>(
      request,
      loginSchema,
    );
    return loginUser(validatedData);
  } catch (err) {
    const error = err as Error;
    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return createErrorResponse(`Validation error: ${error.message}`, 400);
    }
    return createErrorResponse(`Login error: ${error.message}`, 500);
  }
}
