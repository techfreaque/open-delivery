import type { NextResponse } from "next/server";

import { createErrorResponse, validateRequest } from "@/lib/api/apiResponse";
import { registerUser } from "@/lib/auth/authService";
import { registerSchema } from "@/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const validatedData = await validateRequest(request, registerSchema);
    return registerUser(validatedData);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to sign up: ${error.message}`, 500);
  }
}
