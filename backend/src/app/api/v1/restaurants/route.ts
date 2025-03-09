import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateGetRequest,
  validateRequest,
} from "@/lib/api/apiResponse";
import { getCurrentUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { calculateDistance } from "@/lib/geo/distance";
import {
  restaurantCreateSchema,
  restaurantGetSchema,
  restaurantResponseSchema,
} from "@/schemas";
import type {
  ErrorResponse,
  RestaurantCreateType,
  RestaurantGetType,
  RestaurantResponseType,
  SuccessResponse,
} from "@/types/types";

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<SuccessResponse<RestaurantResponseType[]> | ErrorResponse>
> {
  try {
    const validatedData = await validateGetRequest<RestaurantGetType>(
      request,
      restaurantGetSchema,
    );

    const {
      search,
      countryCode,
      zip,
      street,
      streetNumber,
      radius = 10, // Default radius to 10km if not specified
      rating,
      currentlyOpen,
      page = 1,
      limit = 20,
    } = validatedData;

    // First, get coordinates for the search location
    const searchLocation = await prisma.geoLocation.findFirst({
      where: {
        countryCode,
        zip,
        ...(street ? { street } : {}),
        ...(streetNumber ? { streetNumber } : {}),
      },
    });

    if (!searchLocation) {
      return createErrorResponse("Location not found", 404);
    }

    // Build base query conditions
    const where: any = {
      country: {
        code: countryCode,
      },
    };

    // Handle search filter
    if (search && search.length >= 2) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          menuItems: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
        {
          mainCategory: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    // Handle rating filter
    if (rating !== undefined && rating !== null) {
      where.rating = {
        gte: rating,
      };
    }

    // Handle opening hours filter
    if (currentlyOpen === true) {
      const now = new Date();
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday from 0 to 7
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      where.openingTimes = {
        some: {
          day: dayOfWeek,
          open: { lte: currentTime },
          close: { gte: currentTime },
          OR: [
            {
              validFrom: null,
              validTo: null,
            },
            {
              validFrom: { lte: now },
              validTo: { gte: now },
            },
          ],
        },
      };
    }

    // Fetch restaurants with initial filters
    let restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        country: true,
        mainCategory: true,
        latitude: true,
        longitude: true,
        menuItems: {
          take: 10,
          where: {
            published: true,
          },
          include: {
            category: true,
          },
        },
        openingTimes: true,
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
    });

    // Filter and enhance with distance information
    const restaurantsWithDistance = restaurants
      .filter((restaurant) => {
        const distance = calculateDistance(
          searchLocation.latitude,
          searchLocation.longitude,
          restaurant.latitude,
          restaurant.longitude,
        );

        // Add distance to restaurant object for sorting and display
        (restaurant as any).distance = Number(distance.toFixed(1));

        // Filter by radius
        return distance <= radius;
      })
      .sort((a, b) => (a as any).distance - (b as any).distance);

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedRestaurants = restaurantsWithDistance.slice(
      skip,
      skip + limit,
    );

    // Prepare response with pagination metadata
    const response = {
      data: paginatedRestaurants,
      pagination: {
        total: restaurantsWithDistance.length,
        page,
        limit,
        pages: Math.ceil(restaurantsWithDistance.length / limit),
      },
    };

    return createSuccessResponse(response);
  } catch (err) {
    const error = err as Error;
    if (error.name === "ValidationError") {
      return createErrorResponse(`Validation error: ${error.message}`, 400);
    }
    return createErrorResponse(
      `Failed to fetch restaurants: ${error.message}`,
      500,
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<SuccessResponse<RestaurantResponseType> | ErrorResponse>
> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return createErrorResponse("Unauthorized", 401);
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
      return createErrorResponse("Insufficient permissions", 403);
    }

    // Validate restaurant data
    const validatedData = await validateRequest<RestaurantCreateType>(
      request,
      restaurantCreateSchema,
    );

    // Create restaurant
    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...validatedData,
        userId: user.id,
        isOpen: false,
        rating: 0,
        orderCount: 0,
      },
      include: {
        country: true,
        mainCategory: true,
        menuItems: true,
        openingTimes: true,
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return createSuccessResponse(newRestaurant, restaurantResponseSchema);
  } catch (error) {
    const err = error as Error;
    return createErrorResponse(
      `Failed to create restaurant: ${err.message}`,
      500,
    );
  }
}
