import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { loginUser } from "@/lib/auth/authService";
import { loginResponseSchema, loginSchema } from "@/schemas";
import type { LoginResponse } from "@/types/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const validatedData = await validateRequest(request, loginSchema);
    const authResponse = await loginUser(validatedData);
    return createSuccessResponse<LoginResponse>(
      authResponse,
      loginResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to login: ${error.message}`, 500);
  }
}
