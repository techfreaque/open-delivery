import { compare } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

import { prisma } from "./db/prisma";

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Function to sign JWT
export async function signJWT(payload: any): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
  return token;
}

// Function to verify JWT
export async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Function to get JWT from cookies
export async function getJWTFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
}

// Function to authenticate user
export async function authenticate(
  email: string,
  password: string,
): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
} | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

// Function to get current user from JWT
export async function getCurrentUser(): Promise<User | null> {
  const token = await getJWTFromCookies();

  if (!token) {
    return null;
  }

  try {
    const user = await verifyJWT<User>(token);
    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
