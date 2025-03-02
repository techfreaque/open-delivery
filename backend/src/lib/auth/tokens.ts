import { randomBytes } from "crypto";
import { jwtVerify, SignJWT } from "jose";

import { env } from "../env";

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);
const RESET_TOKEN_EXPIRY = "4h"; // 4 hours

// Generate a password reset token
export async function generatePasswordResetToken(
  email: string,
): Promise<string> {
  // Create a random token to make it more secure
  const randomToken = randomBytes(16).toString("hex");

  // Sign the token with jose
  return new SignJWT({ email, randomToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(RESET_TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

// Verify a password reset token and return the email if valid
export async function verifyPasswordResetToken(
  token: string,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.email as string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
