import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { verifyTokenAndResetPassword } from "@/lib/auth/passwordService";
import { resetPasswordConfirmSchema } from "@/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Validate request using schema
    const validatedData = await validateRequest(
      request,
      resetPasswordConfirmSchema,
    );

    // Verify token and update password
    await verifyTokenAndResetPassword(
      validatedData.token,
      validatedData.newPassword,
    );

    // Return standardized success response
    return createSuccessResponse({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid or expired token";
    return createErrorResponse(errorMessage, 400);
  }
}
