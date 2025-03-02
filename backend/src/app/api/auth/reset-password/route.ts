import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { sendPasswordResetToken } from "@/lib/email/senders";
import { messageResponseSchema, resetPasswordRequestSchema } from "@/schemas";
import type { MessageResponse } from "@/types/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const validatedData = await validateRequest(
      request,
      resetPasswordRequestSchema,
    );
    await sendPasswordResetToken(validatedData.email);
    return createSuccessResponse<MessageResponse>(
      { message: "Password reset email sent" },
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
