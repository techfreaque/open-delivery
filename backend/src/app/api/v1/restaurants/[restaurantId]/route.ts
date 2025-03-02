import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { getCurrentUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { restaurantResponseSchema, restaurantUpdateSchema } from "@/schemas";

// GET a specific restaurant by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        menuItems: {
          where: { available: true },
          orderBy: { category: "asc" },
        },
      },
    });

    if (!restaurant) {
      return createErrorResponse("Restaurant not found", 404);
    }

    return createSuccessResponse(restaurant, restaurantResponseSchema);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Error fetching restaurant: ${error.message}`,
      500,
    );
  }
}

// PUT update restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return createErrorResponse("Unauthorized", 401);
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    });

    if (!restaurant) {
      return createErrorResponse("Restaurant not found", 404);
    }

    // Only the restaurant owner or admin can update
    if (restaurant.userId !== user.id && !user.roles.includes("ADMIN")) {
      return createErrorResponse("Unauthorized", 403);
    }

    const validatedData = await validateRequest(
      request,
      restaurantUpdateSchema,
    );

    const updated = await prisma.restaurant.update({
      where: { id: params.id },
      data: validatedData,
    });

    return createSuccessResponse(updated, restaurantResponseSchema);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Error updating restaurant: ${error.message}`,
      500,
    );
  }
}
