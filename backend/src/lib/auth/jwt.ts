import "server-only";

import { jwtVerify, SignJWT } from "jose";

import { env } from "@/lib/env";
import type { UserResponse } from "@/types/types";

const getSecretKey = (): Uint8Array<ArrayBufferLike> => {
  return new TextEncoder().encode(env.JWT_SECRET_KEY);
};

// Sign a JWT token
export async function signJwt(payload: UserResponse): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

// Verify a JWT token
export async function verifyJwt(token: string): Promise<UserResponse> {
  try {
    const { payload } = await jwtVerify<UserResponse>(token, getSecretKey());
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Invalid token");
  }
}
