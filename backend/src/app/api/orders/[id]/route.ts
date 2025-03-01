import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { orderUpdateSchema } from "@/schemas";
import type { ApiResponse, DBOrder, DBOrderWithItems } from "@/types/types";

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Params },
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      const response: ApiResponse<null> = {
        error: "Unauthorized",
        status: 401,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      const response: ApiResponse<null> = {
        error: "Order not found",
        status: 404,
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check authorization (only order's customer, the restaurant owner, the assigned driver, or admin can view)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });

    const roles = userRoles.map((r) => r.role);
    const isAdmin = roles.includes("ADMIN");

    if (
      !isAdmin &&
      order.customerId !== user.id &&
      order.driverId !== user.id
    ) {
      // Check if user is restaurant owner
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: order.restaurantId },
      });

      if (!restaurant || restaurant.userId !== user.id) {
        const response: ApiResponse<null> = {
          error: "Not authorized to view this order",
          status: 403,
        };
        return NextResponse.json(response, { status: 403 });
      }
    }

    // Format response
    const orderWithItems: DBOrderWithItems = {
      ...order,
      items: order.orderItems,
      createdAt: order.createdAt.toISOString(),
      deliveredAt: order.deliveredAt ? order.deliveredAt.toISOString() : null,
    };

    const response: ApiResponse<DBOrderWithItems> = {
      data: orderWithItems,
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching order:", error);

    const response: ApiResponse<null> = {
      error: "Could not fetch order",
      status: 500,
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Params },
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      const response: ApiResponse<null> = {
        error: "Unauthorized",
        status: 401,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Validate request body
    const body = await request.json();
    const validation = orderUpdateSchema.safeParse(body);

    if (!validation.success) {
      const response: ApiResponse<null> = {
        error: "Invalid request data",
        status: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      const response: ApiResponse<null> = {
        error: "Order not found",
        status: 404,
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check authorization (only restaurant owner or admin can update order status)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      select: { role: true },
    });

    const roles = userRoles.map((r) => r.role);
    const isAdmin = roles.includes("ADMIN");
    const isRestaurantAdmin = roles.includes("RESTAURANT_ADMIN");

    // Check if user is restaurant owner
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: order.restaurantId },
    });

    if (
      !isAdmin &&
      (!isRestaurantAdmin || (restaurant && restaurant.userId !== user.id))
    ) {
      const response: ApiResponse<null> = {
        error: "Not authorized to update this order",
        status: 403,
      };
      return NextResponse.json(response, { status: 403 });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: validation.data,
    });

    const response: ApiResponse<DBOrder> = {
      data: {
        ...updatedOrder,
        createdAt: updatedOrder.createdAt.toISOString(),
        deliveredAt: updatedOrder.deliveredAt
          ? updatedOrder.deliveredAt.toISOString()
          : null,
      },
      status: 200,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating order:", error);

    const response: ApiResponse<null> = {
      error: "Could not update order",
      status: 500,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
