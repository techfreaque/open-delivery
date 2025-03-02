import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { verifyTokenAndResetPassword } from "@/lib/auth/passwordService";
import { messageResponseSchema, resetPasswordConfirmSchema } from "@/schemas";
import type { MessageResponse } from "@/types/types";

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
      validatedData.password,
    );

    // Return standardized success response
    return createSuccessResponse<MessageResponse>(
      {
        message: "Password has been reset successfully",
      },
      messageResponseSchema,
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Invalid or expired token";
    return createErrorResponse(errorMessage, 400);
  }
}
