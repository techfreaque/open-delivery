import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { earnings, drivers } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "driver") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get driver ID
    const driverResult = await db.select().from(drivers).where(eq(drivers.userId, user.id)).limit(1)

    if (!driverResult.length) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const driverId = driverResult[0].id

    // Get earnings
    const earningsList = await db.select().from(earnings).where(eq(earnings.driverId, driverId))

    return NextResponse.json(earningsList)
  } catch (error) {
    console.error("Error fetching earnings:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

