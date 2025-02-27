import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { menuItems } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get restaurant ID from query params
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const items = await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId))

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "restaurant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Add validation here

    const newMenuItem = await db
      .insert(menuItems)
      .values({
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    return NextResponse.json(newMenuItem[0])
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

