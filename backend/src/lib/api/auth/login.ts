import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import type {
  LoginFormType,
  LoginResponseType,
} from "@/client-package/schema/api/v1/auth/public/login.schema";
import type { UserResponseMinimalType } from "@/client-package/schema/schemas";
import { env } from "@/lib/env/env";
import type {
  ApiHandlerCallBackProps,
  SafeReturnType,
} from "@/next-portal/api/api-handler";
import { signJwt } from "@/next-portal/api/auth/jwt";
import { prisma } from "@/next-portal/db";
import type { UndefinedType } from "@/next-portal/types/common.schema";

import { getFullUser } from "./me";

/**
 * Authenticate user with credentials
 */

export async function loginUser({
  data,
}: ApiHandlerCallBackProps<LoginFormType, UndefinedType>): Promise<
  SafeReturnType<LoginResponseType>
> {
  const { email, password } = data;
  const minimalUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
    },
  });
  if (!minimalUser) {
    return {
      success: false,
      message: "Invalid email or password",
      errorCode: 401,
    };
  }
  const isPasswordValid = await bcrypt.compare(password, minimalUser.password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password",
      errorCode: 401,
    };
  }
  return createSessionAndGetUser(minimalUser.id);
}

export async function createSessionAndGetUser(
  userId: string,
): Promise<SafeReturnType<LoginResponseType>> {
  const user = await getFullUser(userId);
  // JWT payload
  const tokenPayload: UserResponseMinimalType = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = await signJwt(tokenPayload);

  const cookiesStore = await cookies();
  cookiesStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return {
    success: true,
    data: {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  };
}
