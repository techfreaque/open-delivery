import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { registerUser } from "@/lib/auth/authService";
import { loginResponseSchema, registerSchema } from "@/schemas";
import type { LoginResponse } from "@/types/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const validatedData = await validateRequest(request, registerSchema);
    const userData = await registerUser(validatedData);
    return createSuccessResponse<LoginResponse>(
      userData,
      loginResponseSchema,
      201,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to sign up: ${error.message}`, 500);
  }
}
