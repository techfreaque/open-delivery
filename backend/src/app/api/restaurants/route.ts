import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { validateParams, validateResponseData } from "@/lib/app-validation";
import { getCurrentUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { restaurantCreateSchema } from "@/schemas";
import { restaurantResponseSchema } from "@/schemas";
import { searchSchema } from "@/schemas";
import type { ApiResponse, DBRestaurant } from "@/types/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Extract search parameters from URL
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  // Validate search parameters with schema
  const { data: validParams, response: validationError } = validateParams(
    params,
    searchSchema,
  );

  if (validationError) {
    return validationError;
  }

  try {
    // Apply filters based on validated params
    const category = validParams?.category;
    const query = validParams?.query;

    const restaurants = await prisma.restaurant.findMany({
      where: {
        ...(category
          ? { cuisineType: { contains: category, mode: "insensitive" } }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        menuItems: true,
      },
    });

    // Validate response using schema
    const { data: validatedResponse, response: responseError } =
      validateResponseData(restaurantResponseSchema.array(), restaurants);

    if (responseError) {
      return responseError;
    }

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { message: "Error fetching restaurants" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      const response: ApiResponse<null> = {
        error: "Unauthorized",
        status: 401,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check if user has restaurant admin role
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });

    const roles = userRoles.map((r) => r.role);
    const canCreateRestaurant =
      roles.includes("RESTAURANT_ADMIN") || roles.includes("ADMIN");

    if (!canCreateRestaurant) {
      const response: ApiResponse<null> = {
        error: "Not authorized to create restaurants",
        status: 403,
      };
      return NextResponse.json(response, { status: 403 });
    }

    // Validate restaurant data
    const body = await request.json();
    const validation = restaurantCreateSchema.safeParse(body);

    if (!validation.success) {
      const response: ApiResponse<null> = {
        error: "Invalid restaurant data",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Create restaurant
    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...validation.data,
        userId: user.id,
        isOpen: false,
        rating: 0,
      },
    });

    const response: ApiResponse<DBRestaurant> = {
      data: {
        ...newRestaurant,
        createdAt: newRestaurant.createdAt.toISOString(),
        updatedAt: newRestaurant.updatedAt.toISOString(),
      },
      status: 201,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);

    const response: ApiResponse<null> = {
      error: "Failed to create restaurant",
      status: 500,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
