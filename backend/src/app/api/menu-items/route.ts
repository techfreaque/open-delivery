import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { menuItemSchema } from "@/schemas";

type MenuItemInput = z.infer<typeof menuItemSchema>;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.roles.includes("RESTAURANT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as MenuItemInput;

    // Validate using schema
    const result = menuItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() },
        { status: 400 },
      );
    }

    const { restaurantId, name, description, price, category, image } = body;

    // Verify restaurant ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId,
        userId: user.id,
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found or you don't have permission" },
        { status: 404 },
      );
    }

    // Create menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description,
        price,
        category,
        image: image || "/food-placeholder.jpg",
      },
    });

    return NextResponse.json({ success: true, menuItem });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const menuItems = await prisma.menuItem.findMany();

    return NextResponse.json({ success: true, menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { success: false, message: "Could not fetch menu items" },
      { status: 500 },
    );
  }
}
