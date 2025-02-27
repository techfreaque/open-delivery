import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { restaurants } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // If admin, get all restaurants
    // If restaurant owner, get only their restaurant
    const restaurantList = await db.select().from(restaurants)

    return NextResponse.json(restaurantList)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

