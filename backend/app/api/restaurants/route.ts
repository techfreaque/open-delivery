import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Filter by query parameters
    const { searchParams } = new URL(request.url);
    const cuisine = searchParams.get("cuisine");

    let whereClause = {};

    if (cuisine) {
      whereClause = {
        ...whereClause,
        cuisine: {
          equals: cuisine,
          mode: "insensitive",
        },
      };
    }

    const restaurants = await prisma.restaurant.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        image: true,
        cuisine: true,
        rating: true,
        isOpen: true,
      },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "restaurant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, address, phone, email, cuisine, image } = body;

    // Validate inputs
    if (!name || !description || !address || !phone || !email || !cuisine) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        userId: user.id,
        name,
        description,
        address,
        phone,
        email,
        cuisine,
        image: image || "/restaurant-placeholder.jpg",
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 },
    );
  }
}
