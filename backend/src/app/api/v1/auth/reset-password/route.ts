import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { prisma } from "@/lib/db/prisma";
import { sendPasswordResetToken } from "@/lib/email/senders";
import { messageResponseSchema, resetPasswordRequestSchema } from "@/schemas";
import type { MessageResponse } from "@/types/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Validate request data
    const validatedData = await validateRequest(
      request,
      resetPasswordRequestSchema,
    );

    // Check if user exists with this email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return createErrorResponse("User not found with this email address", 404);
    }

    // Send password reset token
    await sendPasswordResetToken(validatedData.email);

    return createSuccessResponse<MessageResponse>(
      { message: "Password reset email sent" },
      messageResponseSchema,
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation failed")) {
      return createErrorResponse(`Invalid request: ${err.message}`, 400);
    }
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(
      `Failed to handle password reset: ${errorMessage}`,
      500,
    );
  }
}
