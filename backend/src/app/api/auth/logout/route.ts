import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser, logoutUser } from "@/lib/auth/authService";

export async function POST(): Promise<NextResponse> {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }
    await logoutUser(user);
    return createSuccessResponse({ message: "Logged out successfully" });
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to logout: ${error.message}`, 500);
  }
}
