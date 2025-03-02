import { UserRoleValue } from "@prisma/client";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { getVerifiedUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { cartSchema, removeCartItemSchema } from "@/schemas";
import { cartResponseSchema } from "@/schemas";

export async function GET(): Promise<NextResponse> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  try {
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

    return createSuccessResponse<CartResponse>(
      cart || { items: [] },
      cartResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to fetch cart: ${error.message}`, 500);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getVerifiedUser();
  try {
    const validatedData = await validateRequest(request, cartSchema);
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
          create: validatedData.items.map((item) => ({
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

    return createSuccessResponse<CartResponse>(updatedCart, cartResponseSchema);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(`Failed to update cart: ${error.message}`, 500);
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await getVerifiedUser();
  try {
    const validatedData = await validateRequest(request, removeCartItemSchema);

    // Get the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return createErrorResponse("Cart not found", 404);
    }

    // Remove the specific item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        menuItemId: validatedData.menuItemId,
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

    return createSuccessResponse<CartResponse>(updatedCart, cartResponseSchema);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(
      `Failed to remove item from cart: ${error.message}`,
      500,
    );
  }
}
