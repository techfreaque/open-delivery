import "server-only";

import * as jose from "jose";

import type { UserResponse } from "@/types/types";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Sign a JWT token
export async function signJwt(payload: UserResponse): Promise<string> {
  const token = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

// Verify a JWT token
export async function verifyJwt(token: string): Promise<UserResponse> {
  try {
    const { payload } = await jose.jwtVerify<UserResponse>(token, JWT_SECRET);

    // Cast the payload to our UserJwtPayload type
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid token");
  }
}
