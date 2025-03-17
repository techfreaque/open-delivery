import bcrypt from "bcryptjs";
import type { NextResponse } from "next/server";

import type { LoginResponseType } from "@/client-package/schema/api/v1/auth/public/login.schema";
import type { RegisterType } from "@/client-package/schema/schemas";
import { createErrorResponse } from "@/next-portal/api/api-response";
import { prisma } from "@/next-portal/db";
import { UserRoleValue } from "@/next-portal/types/enums";
import type { ResponseType } from "@/next-portal/types/response.schema";

import { loginUser } from "./login";

/**
 * Register a new user
 */
export async function registerUser(
  userData: RegisterType,
): Promise<NextResponse<ResponseType<LoginResponseType>>> {
  const { success, message } = await createUser(userData);
  if (success) {
    return loginUser(userData);
  }
  return createErrorResponse(message, 500);
}

export async function createUser(
  userData: RegisterType & { id?: string },
  role: UserRoleValue = UserRoleValue.CUSTOMER,
): Promise<
  { success: true; message?: never } | { success: false; message: string }
> {
  const {
    email,
    password,
    firstName,
    lastName,
    imageUrl,
    confirmPassword,
    id,
  } = userData;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, message: "Email already registered" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { id: id || undefined },
    create: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      imageUrl,
      userRoles: {
        create: { role },
      },
    },
    update: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userRoles: {
        create: { role },
      },
    },
    select: { id: true },
  });
  return { success: true };
}
