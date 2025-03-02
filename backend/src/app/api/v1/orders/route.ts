import { NextResponse } from "next/server";

import { createSuccessResponse, validateRequest } from "@/lib/api/apiResponse";
import { validateResponseData } from "@/lib/app-validation";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { orderCreateSchema, orderResponseSchema } from "@/schemas";
import type { OrderResponse } from "@/types/types";

export async function POST(request: Request) {
  // Verify authentication
  const authResult = await verifyAuth(request, ["CUSTOMER"]);
  if (!authResult.success) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status },
    );
  }

  // Validate request body
  const validatedData = await validateRequest(request, orderCreateSchema);

  try {
    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        total: data.total,
        userId: authResult.userId,
        restaurantId: data.restaurantId,
        address: data.address,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price || 0, // Get price from menu item if not provided
          })),
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        restaurant: true,
      },
    });

    return createSuccessResponse<OrderResponse>(order, orderResponseSchema);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error creating order" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  // Verify authentication
  const authResult = await verifyAuth(request, [
    "CUSTOMER",
    "RESTAURANT",
    "ADMIN",
  ]);
  if (!authResult.success) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status },
    );
  }

  try {
    // Define filter based on user role
    const filter = {};

    // Filter orders based on user role
    if (authResult.role === "CUSTOMER") {
      Object.assign(filter, { userId: authResult.userId });
    } else if (authResult.role === "RESTAURANT") {
      // Get restaurant IDs owned by this user
      const restaurants = await prisma.restaurant.findMany({
        where: { ownerId: authResult.userId },
        select: { id: true },
      });
      const restaurantIds = restaurants.map((r) => r.id);
      Object.assign(filter, { restaurantId: { in: restaurantIds } });
    }
    // Admin can see all orders (no filter)

    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        restaurant: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Validate response
    const { data: validatedResponse, response: responseError } =
      validateResponseData(orderResponseSchema.array(), orders);

    if (responseError) {
      return responseError;
    }

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 },
    );
  }
}
