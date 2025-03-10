import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser, logoutUser } from "@/lib/auth/authService";
import { messageResponseSchema } from "@/schemas";
import type { ErrorResponse, SuccessResponse } from "@/types/types";
import { type MessageResponseType, UserRoleValue } from "@/types/types";

export async function GET(): Promise<
  NextResponse<SuccessResponse<MessageResponseType> | ErrorResponse>
> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  try {
    await logoutUser(user);
    return createSuccessResponse<MessageResponseType>(
      "Logged out successfully",
      messageResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to logout: ${error.message}`, 500);
  }
}
