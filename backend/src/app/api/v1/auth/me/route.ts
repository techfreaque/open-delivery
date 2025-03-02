import type { NextResponse } from "next/server";

import { createSuccessResponse } from "@/lib/api/apiResponse";
import { getVerifiedUser } from "@/lib/auth/authService";
import { userResponseSchema } from "@/schemas";
import { type UserResponse, UserRoleValue } from "@/types/types";

export async function GET(): Promise<NextResponse> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);

  return createSuccessResponse<UserResponse>(user, userResponseSchema);
}
