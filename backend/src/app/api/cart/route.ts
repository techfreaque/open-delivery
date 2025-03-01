import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { cartSchema, removeCartItemSchema } from "@/schemas";
import type { ApiResponse } from "@/types/types";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const response: ApiResponse<null> = {
        error: "Unauthorized",
        status: 401,
      };
      return NextResponse.json(response, { status: response.status });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const response: ApiResponse<typeof cart> = {
      data: cart || { items: [] },
      status: 200,
    };
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: "Failed to fetch cart",
      status: 500,
    };
    return NextResponse.json(response, { status: response.status });
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
      return NextResponse.json(response, { status: response.status });
    }

    const requestData = await request.json();

    // Type validation
    const validation = cartSchema.safeParse(requestData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();
      const errorMessages = Object.entries(formattedErrors)
        .filter(([key]) => key !== "_errors")
        .map(
          ([path, err]) =>
            `${path}: ${(err as { _errors: string[] })._errors.join(", ")}`,
        );

      const response: ApiResponse<null> = {
        error: "Invalid cart data",
        details: errorMessages,
        status: 400,
      };
      return NextResponse.json(response, { status: response.status });
    }

    const { items } = validation.data;

    // Check if user already has a cart
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });

    // Delete existing cart items
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    // Add new cart items
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const response: ApiResponse<typeof updatedCart> = {
      data: updatedCart,
      status: 200,
    };
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: "Failed to update cart",
      status: 500,
    };
    return NextResponse.json(response, { status: response.status });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const response: ApiResponse<null> = {
        error: "Unauthorized",
        status: 401,
      };
      return NextResponse.json(response, { status: response.status });
    }

    const requestData = await request.json();

    // Validate only menuItemId
    const validation = removeCartItemSchema.safeParse(requestData);

    if (!validation.success) {
      const formattedErrors = validation.error.format();
      const errorMessages = Object.entries(formattedErrors)
        .filter(([key]) => key !== "_errors")
        .map(
          ([path, err]) =>
            `${path}: ${(err as { _errors: string[] })._errors.join(", ")}`,
        );

      const response: ApiResponse<null> = {
        error: "Invalid data",
        details: errorMessages,
        status: 400,
      };
      return NextResponse.json(response, { status: response.status });
    }

    const { menuItemId } = validation.data;

    // Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      const response: ApiResponse<null> = {
        error: "Cart not found",
        status: 404,
      };
      return NextResponse.json(response, { status: response.status });
    }

    // Remove the specific item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        menuItemId,
      },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    const response: ApiResponse<typeof updatedCart> = {
      data: updatedCart,
      status: 200,
    };
    return NextResponse.json(response, { status: response.status });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: "Failed to remove item from cart",
      status: 500,
    };
    return NextResponse.json(response, { status: response.status });
  }
}
