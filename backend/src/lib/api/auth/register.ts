import bcrypt from "bcryptjs";

import type { LoginResponseType } from "@/client-package/schema/api/v1/auth/public/login.schema";
import type { RegisterType } from "@/client-package/schema/schemas";
import type {
  ApiHandlerCallBackProps,
  SafeReturnType,
} from "@/next-portal/api/api-handler";
import { prisma } from "@/next-portal/db";
import type { UndefinedType } from "@/next-portal/types/common.schema";
import { UserRoleValue } from "@/next-portal/types/enums";

import { loginUser } from "./login";

/**
 * Register a new user
 */
export async function registerUser(
  props: ApiHandlerCallBackProps<RegisterType, UndefinedType>,
): Promise<SafeReturnType<LoginResponseType>> {
  const { success, message, errorCode } = await createUser(props.data);
  if (success) {
    return loginUser(props);
  }
  return { success: false, message, errorCode };
}

export async function createUser(
  userData: RegisterType & { id?: string },
  role: UserRoleValue = UserRoleValue.CUSTOMER,
): Promise<SafeReturnType<UndefinedType>> {
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
    return {
      success: false,
      message: "Email already registered",
      errorCode: 400,
    };
  }
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
      errorCode: 400,
    };
  }
  const hashedPassword = await hashPassword(password);
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
  return { success: true, data: undefined };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
