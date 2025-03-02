import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser } from "@/lib/auth/authService";
import { userResponseSchema } from "@/schemas";
import { type UserResponse, UserRoleValue } from "@/types/types";

export async function GET(): Promise<NextResponse> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  try {
    return createSuccessResponse<UserResponse>(user, userResponseSchema);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Failed to get your profile: ${error.message}`,
      500,
    );
  }
}
