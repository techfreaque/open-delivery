import type { NextResponse } from "next/server";

import { createErrorResponse, validateRequest } from "@/lib/api/apiResponse";
import { registerUser } from "@/lib/auth/authService";
import { registerSchema } from "@/schemas";
import type {
  ErrorResponse,
  LoginResponseType,
  RegisterType,
  SuccessResponse,
} from "@/types/types";

export async function POST(
  request: Request,
): Promise<NextResponse<SuccessResponse<LoginResponseType> | ErrorResponse>> {
  try {
    const validatedData = await validateRequest<RegisterType>(
      request,
      registerSchema,
    );
    return registerUser(validatedData);
  } catch (err) {
    const error = err as Error;
    if (error.name === "ValidationError") {
      return createErrorResponse(`Validation error: ${error.message}`, 400);
    }
    return createErrorResponse(`Failed to sign up: ${error.message}`, 500);
  }
}
