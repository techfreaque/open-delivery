import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let ordersList;

    if (user.role === "admin") {
      // Admin can see all orders
      ordersList = await prisma.order.findMany({
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    } else if (user.role === "restaurant") {
      // Restaurant can see their orders
      const { searchParams } = new URL(request.url);
      const restaurantId = searchParams.get("restaurantId");

      if (!restaurantId) {
        return NextResponse.json(
          { error: "Restaurant ID is required" },
          { status: 400 },
        );
      }

      ordersList = await prisma.order.findMany({
        where: { restaurantId },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    } else if (user.role === "driver") {
      // Driver can see their assigned orders
      const driver = await prisma.driver.findUnique({
        where: { userId: user.id },
      });

      if (!driver) {
        return NextResponse.json(
          { error: "Driver not found" },
          { status: 404 },
        );
      }

      ordersList = await prisma.order.findMany({
        where: { driverId: driver.id },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    } else {
      // Customer can see their orders
      ordersList = await prisma.order.findMany({
        where: { customerId: user.id },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    }

    return NextResponse.json(ordersList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        restaurantId: body.restaurantId,
        customerId: user.id,
        status: "pending",
        total: body.total,
        deliveryFee: body.deliveryFee,
        tax: body.tax,
        address: body.address,
        items: {
          create: body.items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
