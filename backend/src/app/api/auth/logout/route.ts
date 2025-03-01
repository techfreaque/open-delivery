import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser, logoutUser } from "@/lib/auth/authService";
import { logoutResponseSchema } from "@/schemas";
import type { LogoutResponse } from "@/types/types";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }
    await logoutUser(user);
    return createSuccessResponse<LogoutResponse>(
      { message: "Logged out successfully" },
      logoutResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to logout: ${error.message}`, 500);
  }
}
