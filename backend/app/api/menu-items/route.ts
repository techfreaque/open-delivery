import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "restaurant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as MenuItem;
    const { restaurantId, name, description, price, category, image } = body;

    // Validate inputs
    if (!restaurantId || !name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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
        price: parseFloat(price.toString()),
        category,
        image: image || "/food-placeholder.jpg",
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 },
    );
  }
}
