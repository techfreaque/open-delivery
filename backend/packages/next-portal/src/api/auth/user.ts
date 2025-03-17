import { UserRoleValue } from "@prisma/client";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { prisma } from "../../db";
import type { JwtPayloadType } from "../../types/types";
import type { UserRoleResponseType } from "../../types/user-roles.schema";
import { verifyJwt } from "./jwt";

export async function getVerifiedUser(
  roles: UserRoleValue[],
  restaurantId?: string,
): Promise<JwtPayloadType | undefined> {
  if (roles.includes(UserRoleValue.PUBLIC)) {
    return { id: "public" };
  }
  const user = await getCurrentUser();
  if (!user) {
    return undefined;
  }

  if (roles.includes(UserRoleValue.CUSTOMER)) {
    return user;
  }

  const userRoles = await getUserRoles(user.id);

  // Check for restaurant-specific roles
  if (restaurantId) {
    const hasRestaurantRole = userRoles.some(
      (r) =>
        r.restaurantId === restaurantId &&
        roles.includes(r.role as UserRoleValue),
    );

    if (hasRestaurantRole) {
      return user;
    }
  }

  // Check for general roles
  const hasRequiredRole = userRoles.some((r) =>
    roles.includes(r.role as UserRoleValue),
  );

  if (hasRequiredRole) {
    return user;
  }

  return undefined;
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(
  userId: string,
): Promise<UserRoleResponseType[]> {
  // Simple query if role is just a string field
  return (await prisma.userRole.findMany({
    where: { userId },
    select: { role: true, restaurantId: true, id: true },
  })) as UserRoleResponseType[];
}

export function hasRole(
  roles: UserRoleResponseType[],
  role: UserRoleValue,
  restaurantId?: string,
): boolean {
  return roles.some(
    (r) =>
      r.role === role &&
      (restaurantId ? r.restaurantId === restaurantId : true),
  );
}

/**
 * Gets the current user from the session
 */
export async function getCurrentUser(): Promise<JwtPayloadType | null> {
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
