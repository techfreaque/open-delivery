import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, restaurants, drivers } from "@/lib/db/schema"
import { hash } from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { signJWT } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Check if user already exists
    const existingUser = await db.select().from(users).where(users.email.equals(email)).limit(1)
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const userId = uuidv4()
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    // Create associated record based on role
    if (role === "restaurant") {
      await db.insert(restaurants).values({
        id: uuidv4(),
        userId: userId,
        name: name,
        description: "",
        address: "",
        phone: "",
        email: email,
        image: "/placeholder.svg?height=100&width=100",
        rating: 0,
        cuisine: "",
        isOpen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } else if (role === "driver") {
      await db.insert(drivers).values({
        id: uuidv4(),
        userId: userId,
        vehicle: "",
        licensePlate: "",
        isActive: false,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    // Create JWT token
    const token = await signJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}

