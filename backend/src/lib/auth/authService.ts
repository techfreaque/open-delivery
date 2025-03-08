import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import type { NextResponse } from "next/server";

import { signJwt, verifyJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { loginResponseSchema } from "@/schemas";
import type {
  ErrorResponse,
  LoginFormType,
  LoginResponseType,
  RegisterType,
  SuccessResponse,
  UserResponseMinimalType,
  UserRoleResponseType,
} from "@/types/types";
import { UserRoleValue } from "@/types/types";

import { createErrorResponse, createSuccessResponse } from "../api/apiResponse";
import { env } from "../env";

export async function getVerifiedUser(
  role: UserRoleValue,
  restaurantId?: string,
): Promise<UserResponseMinimalType | undefined> {
  const user = await getCurrentUser();
  if (!user) {
    return undefined;
  }
  if (role === UserRoleValue.CUSTOMER) {
    return user;
  }
  const roles = await getUserRoles(user.id);
  if (
    role === UserRoleValue.RESTAURANT_EMPLOYEE ||
    role === UserRoleValue.RESTAURANT_ADMIN
  ) {
    if (
      restaurantId &&
      roles.some((r) => r.restaurantId === restaurantId && r.role === role)
    ) {
      return user;
    }
  }

  if (roles.some((r) => r.role === role)) {
    return user;
  }
  return undefined;
}

/**
 * Register a new user
 */
export async function registerUser(
  userData: RegisterType,
): Promise<NextResponse<SuccessResponse<LoginResponseType> | ErrorResponse>> {
  const { email, password, firstName, lastName } = userData;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return createErrorResponse("Email already registered", 500);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });
  await prisma.userRole.create({
    data: {
      userId: newUser.id,
      role: UserRoleValue.CUSTOMER,
    },
  });
  return loginUser(userData);
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(
  userId: string,
): Promise<UserRoleResponseType[]> {
  // Simple query if role is just a string field
  return prisma.userRole.findMany({
    where: { userId },
    select: { role: true, restaurantId: true, id: true },
  });
}

/**
 * Gets the current user from the session
 * @returns UserSession or null if not authenticated
 */
export async function getCurrentUser(): Promise<UserResponseMinimalType | null> {
  try {
    // First check for Auth header
    const authHeader = (await headers()).get("Authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader || null;

    // Then check for cookie if no header token
    const token = headerToken || (await cookies()).get("token")?.value;

    if (!token) {
      return null;
    }

    try {
      const payload = await verifyJwt(token);
      if (!payload) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  } catch (error) {
    throw new Error(`Error getting current user, error: ${error}`);
  }
}

/**
 * Logout user
 */
export async function logoutUser(user: UserResponseMinimalType): Promise<void> {
  // Clear auth cookie
  (await cookies()).delete("auth-token");

  // Remove sessions from database
  await prisma.session.deleteMany({ where: { userId: user.id } });
  return;
}

export async function getFullUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      userRoles: {
        select: {
          role: true,
          id: true,
          restaurantId: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      addresses: {
        select: {
          id: true,
          userId: true,
          label: true,
          name: true,
          message: true,
          street: true,
          streetNumber: true,
          zip: true,
          city: true,
          phone: true,
          isDefault: true,
          country: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      cartItems: {
        select: {
          id: true,
          quantity: true,
          menuItem: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              taxPercent: true,
              image: true,
              published: true,
              availableFrom: true,
              availableTo: true,
              createdAt: true,
              updatedAt: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          restaurant: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

/**
 * Authenticate user with credentials
 */
export async function loginUser(
  credentials: LoginFormType,
): Promise<NextResponse<SuccessResponse<LoginResponseType> | ErrorResponse>> {
  const { email, password } = credentials;
  const minimalUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
    },
  });
  if (!minimalUser) {
    return createErrorResponse("Invalid email or password", 401);
  }
  const isPasswordValid = await bcrypt.compare(password, minimalUser.password);
  if (!isPasswordValid) {
    return createErrorResponse("Invalid email or password", 401);
  }
  const user = await getFullUser(minimalUser.id);
  // Create JWT payload
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
  return createSuccessResponse<LoginResponseType>(
    {
      user: user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    loginResponseSchema,
  );
}
