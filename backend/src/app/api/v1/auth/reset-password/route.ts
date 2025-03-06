import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { sendPasswordResetToken } from "@/lib/email/senders";
import { messageResponseSchema, resetPasswordRequestSchema } from "@/schemas";
import type {
  ErrorResponse,
  MessageResponseType,
  SuccessResponse,
} from "@/types/types";

export async function POST(
  request: Request,
): Promise<NextResponse<SuccessResponse<MessageResponseType> | ErrorResponse>> {
  try {
    const validatedData = await validateRequest(
      request,
      resetPasswordRequestSchema,
    );
    await sendPasswordResetToken(validatedData.email);
    return createSuccessResponse<MessageResponseType>(
      "Password reset email sent, If the email exists in our system, you will receive an email with instructions to reset your password.",
      messageResponseSchema,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(
      `Failed to handle password reset: ${errorMessage}`,
      500,
    );
  }
}
