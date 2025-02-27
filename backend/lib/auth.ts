import { compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "./db"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"

// User type
export interface User {
  id: string
  email: string
  name: string
  role: string
}

// Function to sign JWT
export async function signJWT(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret)
  return token
}

// Function to verify JWT
export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as T
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// Function to get JWT from cookies
export async function getJWTFromCookies() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value
  return token
}

// Function to authenticate user
export async function authenticate(email: string, password: string) {
  try {
    // Find user by email
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = result[0]

    if (!user) {
      return null
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return null
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// Function to get current user from JWT
export async function getCurrentUser(): Promise<User | null> {
  const token = await getJWTFromCookies()
  if (!token) {
    return null
  }

  try {
    const payload = await verifyJWT<User>(token)
    return payload
  } catch (error) {
    return null
  }
}

