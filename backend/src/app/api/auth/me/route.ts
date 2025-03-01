import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api/apiResponse";
import { getVerifiedUser } from "@/lib/auth/authService";
import type { UserResponse } from "@/types/types";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getVerifiedUser();
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }
    return createSuccessResponse<UserResponse>(user);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Failed to get your profile: ${error.message}`,
      500,
    );
  }
}
