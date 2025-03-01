import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { sendPasswordResetEmail } from "@/lib/auth/passwordService";
import { resetPasswordRequestSchema } from "@/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Validate request using schema
    const validatedData = await validateRequest(
      request,
      resetPasswordRequestSchema,
    );

    // Send password reset email
    await sendPasswordResetEmail(validatedData.email);

    // Return standardized success response
    return createSuccessResponse({ message: "Password reset email sent" });
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Failed to handle password reset: ${error.message}`,
      500,
    );
  }
}
