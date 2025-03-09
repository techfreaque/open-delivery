import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { getVerifiedUser } from "@/lib/auth/authService";
import { prisma } from "@/lib/db/prisma";
import { cartItemsResponseSchema, cartItemUpdateSchema } from "@/schemas";
import {
  type CartItemsResponseType,
  type DBCartItemExtended,
  type ErrorResponse,
  type SuccessResponse,
  UserRoleValue,
} from "@/types/types";

export async function GET(): Promise<
  NextResponse<SuccessResponse<CartItemsResponseType> | ErrorResponse>
> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  if (!user) {
    return createErrorResponse("Not signed in", 401);
  }
  try {
    const cartItems = await getCartItems(user.id);
    return createSuccessResponse<CartItemsResponseType>(
      cartItems,
      cartItemsResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    if (error.name === "ValidationError") {
      return createErrorResponse(`Validation error: ${error.message}`, 400);
    }
    return createErrorResponse(`Failed to fetch cart: ${error.message}`, 500);
  }
}

async function getCartItems(userId: string): Promise<DBCartItemExtended[]> {
  return prisma.cartItem.findMany({
    where: { userId },
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
          restaurantId: true,
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
  });
}

export async function POST(
  request: NextRequest,
): Promise<
  NextResponse<SuccessResponse<CartItemsResponseType> | ErrorResponse>
> {
  const user = await getVerifiedUser(UserRoleValue.CUSTOMER);
  if (!user) {
    return createErrorResponse("Not signed in", 401);
  }
  const validatedData = await validateRequest(request, cartItemUpdateSchema);
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: validatedData.menuItemId },
      include: { restaurant: true },
    });
    if (!menuItem) {
      return createErrorResponse("Menu item not found", 404);
    }
    if (menuItem.published === false) {
      return createErrorResponse("Menu item currently not available", 404);
    }
    if (menuItem.availableFrom && menuItem.availableFrom < new Date()) {
      return createErrorResponse("Menu item not available yet", 404);
    }
    if (menuItem.availableTo && menuItem.availableTo > new Date()) {
      return createErrorResponse("Menu item no longer available", 404);
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_menuItemId_restaurantId: {
          userId: user.id,
          menuItemId: validatedData.menuItemId,
          restaurantId: menuItem.restaurantId,
        },
      },
    });

    // If quantity is 0, remove the item
    if (validatedData.quantity === 0) {
      if (existingCartItem) {
        await prisma.cartItem.delete({
          where: { id: existingCartItem.id },
        });
      }
    } else {
      await prisma.cartItem.upsert({
        where: {
          userId_menuItemId_restaurantId: {
            userId: user.id,
            menuItemId: validatedData.menuItemId,
            restaurantId: menuItem.restaurantId,
          },
        },
        update: {
          quantity: validatedData.quantity,
        },
        create: {
          userId: user.id,
          menuItemId: validatedData.menuItemId,
          restaurantId: menuItem.restaurantId,
          quantity: validatedData.quantity,
        },
        include: {
          menuItem: true,
          restaurant: true,
        },
      });
    }
    const cartItems = await getCartItems(user.id);

    return createSuccessResponse<CartItemsResponseType>(
      cartItems,
      cartItemsResponseSchema,
    );
  } catch (err) {
    const error = err as Error;
    if (error.name === "ValidationError") {
      return createErrorResponse(`Validation error: ${error.message}`, 400);
    }
    return createErrorResponse(`Failed to update cart: ${error.message}`, 500);
  }
}
