import * as jose from "jose";

import { env } from "@/lib/env";
import type { UserResponseMinimalType } from "@/types/types";

// Use a stable secret key for tests
const secretKey =
  env.NODE_ENV === "test"
    ? "test-secret-key-for-e2e-tests"
    : env.JWT_SECRET_KEY;

if (!secretKey) {
  throw new Error("JWT_SECRET_KEY environment variable is not defined");
}

/**
 * Sign a JWT with the given payload
 */
export async function signJwt(
  payload: UserResponseMinimalType,
): Promise<string> {
  const secret = new TextEncoder().encode(secretKey);
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);
}

/**
 * Verify a JWT and return its payload
 */
export async function verifyJwt(
  token: string,
): Promise<UserResponseMinimalType> {
  // Special handling for test tokens
  if (
    token.endsWith(".test_signature_for_e2e_tests") &&
    env.NODE_ENV === "test"
  ) {
    try {
      const base64Payload = token.split(".")[0];
      const payload = JSON.parse(
        atob(base64Payload),
      ) as UserResponseMinimalType;
      return payload;
    } catch {
      throw new Error("Invalid token");
    }
  }

  const secret = new TextEncoder().encode(secretKey);

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as UserResponseMinimalType;
  } catch {
    throw new Error("Invalid token");
  }
}
