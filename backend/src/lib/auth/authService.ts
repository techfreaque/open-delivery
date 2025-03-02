import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { signJwt, verifyJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import type {
  LoginData,
  LoginResponse,
  RegisterData,
  UserResponse,
} from "@/types/types";
import { UserRoleValue } from "@/types/types";

import { createErrorResponse } from "../api/apiResponse";
import { env } from "../env";

export async function getVerifiedUser(
  role: UserRoleValue = UserRoleValue.ADMIN,
): Promise<UserResponse> {
  const user = await getCurrentUser();
  if (!user) {
    throw createErrorResponse("Not signed in", 401);
  }
  if (user.roles.includes(role)) {
    return user;
  }
  throw createErrorResponse("Unauthorized", 401);
}

/**
 * Register a new user
 */
export async function registerUser(
  userData: RegisterData,
): Promise<LoginResponse> {
  const { email, password, name, role } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Determine roles
  const userRole = (role?.toUpperCase() || "CUSTOMER") as UserRoleValue;

  // Create user in DB
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Assign role to user
  await prisma.userRole.create({
    data: {
      userId: newUser.id,
      role: userRole,
    },
  });
  return loginUser(userData);
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string): Promise<UserRoleValue[]> {
  // Simple query if role is just a string field
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: { role: true },
  });

  return userRoles.map((r) => r.role);
}

/**
 * Verify JWT token and return payload
 */
export async function verifyAuthToken(
  token: string,
): Promise<UserResponse | null> {
  try {
    return await verifyJwt(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

/**
 * Gets the current user from the session
 * @returns UserSession or null if not authenticated
 */
async function getCurrentUser(): Promise<UserResponse | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const payload = await verifyJwt(token);
    if (!payload) {
      return null;
    }
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

/**
 * Logout user
 */
export async function logoutUser(user: UserResponse): Promise<void> {
  // Clear auth cookie
  (await cookies()).delete("auth-token");

  // Remove sessions from database
  await prisma.session.deleteMany({ where: { userId: user.id } });
  return;
}

/**
 * Authenticate user with credentials
 */
export async function loginUser(
  credentials: LoginData,
): Promise<LoginResponse> {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userRoles: { select: { role: true } } },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  const roles = user.userRoles.map((userRole) => userRole.role);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Create JWT payload
  const tokenPayload: UserResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const token = await signJwt(tokenPayload);
  // Set authentication cookie
  (await cookies()).set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  return { user: tokenPayload, token };
}
