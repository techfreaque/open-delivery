import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// GET a specific menu item
export async function GET(
  _request: Request,
  { params }: { params: { restaurantId: string; itemId: string } },
): Promise<NextResponse> {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: params.itemId,
        restaurantId: params.restaurantId,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(menuItem);
  } catch (_error) {
    // Use a proper logger in production
    return NextResponse.json(
      { error: "Error fetching menu item" },
      { status: 500 },
    );
  }
}

// PUT update a menu item
export async function PUT(
  request: Request,
  { params }: { params: { restaurantId: string; itemId: string } },
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.restaurantId },
    });

    if (!restaurant || restaurant.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this menu item" },
        { status: 403 },
      );
    }

    const data = await request.json();
    const menuItem = await prisma.menuItem.update({
      where: {
        id: params.itemId,
        restaurantId: params.restaurantId,
      },
      data,
    });

    return NextResponse.json(menuItem);
  } catch (_error) {
    // Use a proper logger in production
    return NextResponse.json(
      { error: "Error updating menu item" },
      { status: 500 },
    );
  }
}

// DELETE a menu item
export async function DELETE(
  _request: Request,
  { params }: { params: { restaurantId: string; itemId: string } },
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.restaurantId },
    });

    if (!restaurant || restaurant.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this menu item" },
        { status: 403 },
      );
    }

    await prisma.menuItem.delete({
      where: {
        id: params.itemId,
        restaurantId: params.restaurantId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    // Use a proper logger in production
    return NextResponse.json(
      { error: "Error deleting menu item" },
      { status: 500 },
    );
  }
}
