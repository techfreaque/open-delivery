import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let ordersList

    if (user.role === "admin") {
      // Admin can see all orders
      ordersList = await db.select().from(orders)
    } else if (user.role === "restaurant") {
      // Restaurant can see their orders
      const { searchParams } = new URL(request.url)
      const restaurantId = searchParams.get("restaurantId")

      if (!restaurantId) {
        return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
      }

      ordersList = await db.select().from(orders).where(eq(orders.restaurantId, restaurantId))
    } else if (user.role === "driver") {
      // Driver can see their assigned orders
      ordersList = await db.select().from(orders).where(eq(orders.driverId, user.id))
    }

    // For each order, get the order items
    const ordersWithItems = await Promise.all(
      ordersList.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))

        return {
          ...order,
          items,
        }
      }),
    )

    return NextResponse.json(ordersWithItems)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

