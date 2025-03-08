import { randomBytes } from "crypto";
import { jwtVerify, SignJWT } from "jose";

import { prisma } from "../db/prisma";
import { env } from "../env";
import { debugLogger } from "../utils";

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);
const RESET_TOKEN_EXPIRY = "4h";

export interface PasswordResetTokenPayload {
  email: string;
  userId: string;
}

export async function generatePasswordResetToken(
  email: string,
  userId: string,
): Promise<string> {
  // Create a random token to make it more secure
  const randomToken = randomBytes(16).toString("hex");

  // Sign the token with jose
  const token = await new SignJWT({ email, userId, randomToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(RESET_TOKEN_EXPIRY)
    .sign(SECRET_KEY);
  await prisma.passwordReset.upsert({
    where: {
      userId,
    },
    update: {
      token,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
    create: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    },
  });
  return token;
}

// Verify a password reset token and return the email if valid
export async function verifyPasswordResetToken(
  token: string,
): Promise<PasswordResetTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<PasswordResetTokenPayload>(
      token,
      SECRET_KEY,
    );

    const resetRecord =  await prisma.passwordReset.findFirst({
      where: {
        userId: payload.userId,
        token,
      },
    });
    if (!resetRecord) {
      return null;
    }
    await prisma.passwordReset.delete({
      where: {
        userId: payload.userId,
      },
    });
    if (resetRecord.expiresAt < new Date()) {
      return null;
    }

    return { email: payload.email, userId: payload.userId };
  } catch (error) {
    debugLogger("Invalid token", error);
    return null;
  }
}
