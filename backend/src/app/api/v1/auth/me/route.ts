import type { NextResponse } from "next/server";

import { createSuccessResponse } from "@/lib/api/apiResponse";
import { getFullUser, getVerifiedUser } from "@/lib/auth/authService";
import { userResponseSchema } from "@/schemas";
import type { ErrorResponse, SuccessResponse } from "@/types/types";
import { type UserResponseType, UserRoleValue } from "@/types/types";

export async function GET(): Promise<
  NextResponse<SuccessResponse<UserRoleValue> | ErrorResponse>
> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  const fullUser = await getFullUser(user.id);

  return createSuccessResponse<UserResponseType>(fullUser, userResponseSchema);
}
