import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";
import type { UserResponse } from "@/types/types";

const getSecretKey = () => {
  const key = env.JWT_SECRET_KEY;
  if (!key) {
    // This is a safety net that should never trigger with our updated env validation
    console.warn(
      "Warning: JWT_SECRET_KEY is not set, using fallback for development only",
    );
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET_KEY is not defined in production!");
    }
    return new TextEncoder().encode(
      "development-secret-key-not-for-production",
    );
  }
  return new TextEncoder().encode(key);
};

console.log(
  "JWT module loaded with secret key present:",
  !!process.env.JWT_SECRET_KEY || !!process.env.JWT_SECRET,
);

// Sign a JWT token
export async function signJwt(payload: UserResponse): Promise<string> {
  console.log("Signing JWT with payload:", payload);

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());

  return token;
}

// Verify a JWT token
export async function verifyJwt(token: string): Promise<UserResponse> {
  try {
    const { payload } = await jwtVerify<UserResponse>(token, getSecretKey());

    // Cast the payload to our UserJwtPayload type
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid token");
  }
}
