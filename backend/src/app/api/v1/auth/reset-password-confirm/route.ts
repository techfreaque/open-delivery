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
      resetPasswordConfirmSchema,
    );
    const resetPayload = await verifyPasswordResetToken(validatedData.token);
    if (!resetPayload || !resetPayload.email || !resetPayload.userId) {
      return createErrorResponse("Invalid or expired token", 400);
    }
    const user = await prisma.user.findUnique({
      where: { email: resetPayload.email, id: resetPayload.userId },
    });
    if (!user) {
      return createErrorResponse("User not found", 404);
    }
    const hashedPassword = await hash(validatedData.confirmPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return createSuccessResponse<MessageResponseType>(
      "Password has been successfully reset",
      messageResponseSchema,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return createErrorResponse(
      `Failed to reset password: ${errorMessage}`,
      500,
    );
  }
}
