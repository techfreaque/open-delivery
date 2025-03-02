import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser, logoutUser } from "@/lib/auth/authService";
import { messageResponseSchema } from "@/schemas";
import type { ErrorResponse } from "@/types/types";
import { type MessageResponse, UserRoleValue } from "@/types/types";

export async function GET(): Promise<
  NextResponse<MessageResponse | ErrorResponse>
> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  try {
    await logoutUser(user);
    return createSuccessResponse<MessageResponse>(
      "Logged out successfully",
      messageResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to logout: ${error.message}`, 500);
  }
}
