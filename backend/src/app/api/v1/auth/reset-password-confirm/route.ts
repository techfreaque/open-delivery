import { hash } from "bcryptjs";
import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { verifyPasswordResetToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { messageResponseSchema, resetPasswordConfirmSchema } from "@/schemas";
import type { MessageResponse } from "@/types/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Validate request data
    const validatedData = await validateRequest(
      request,
      resetPasswordConfirmSchema,
    );

    // Verify token and get user email
    const email = await verifyPasswordResetToken(validatedData.token);
    if (!email) {
      return createErrorResponse("Invalid or expired token", 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    // Hash the new password
    const hashedPassword = await hash(validatedData.confirmPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return createSuccessResponse<MessageResponse>(
      { message: "Password has been successfully reset" },
      messageResponseSchema,
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes("validation failed")) {
      return createErrorResponse(`Invalid request: ${err.message}`, 400);
    }
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(
      `Failed to reset password: ${errorMessage}`,
      500,
    );
  }
}
