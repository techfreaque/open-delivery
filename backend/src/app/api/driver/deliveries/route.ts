import type { Prisma } from "@prisma/client";
import { DeliveryStatus } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

// GET deliveries for current driver
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "DRIVER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const driver = await prisma.driver.findUnique({
      where: { userId: user.id },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver profile not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let whereClause: Prisma.DeliveryWhereInput = {};

    // Filter by status
    if (status) {
      if (status === "ACTIVE") {
        whereClause.status = {
          in: ["PICKED_UP", "OUT_FOR_DELIVERY"],
        };
      } else if (status === "COMPLETED") {
        whereClause.status = DeliveryStatus.DELIVERED;
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        restaurant: {
          select: {
            name: true,
            address: true,
            image: true,
          },
        },
        delivery: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pending = orders.filter(
      (order) => order.status === DeliveryStatus.PENDING,
    );
    const accepted = orders.filter(
      (order) => order.status === DeliveryStatus.ACCEPTED,
    );
    const ongoing = orders.filter(
      (order) => order.status === DeliveryStatus.ONGOING,
    );
    const completed = orders.filter(
      (order) => order.status === DeliveryStatus.COMPLETED,
    );

    return NextResponse.json({ pending, accepted, ongoing, completed });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
