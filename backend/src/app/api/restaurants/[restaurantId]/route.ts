import type { Restaurant } from "@prisma/client";
import type { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// GET a specific restaurant by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const restaurant = (await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        menuItems: {
          where: { available: true },
          orderBy: { category: "asc" },
        },
      },
    })) as Restaurant;

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Error fetching restaurant" },
      { status: 500 },
    );
  }
}

// PUT update restaurant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 },
      );
    }

    // Only the restaurant owner or admin can update
    if (restaurant.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await request.json();
    const updated = await prisma.restaurant.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { error: "Error updating restaurant" },
      { status: 500 },
    );
  }
}
