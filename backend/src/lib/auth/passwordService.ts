import { prisma } from "@/lib/db/prisma";
import type {
  ResetPasswordConfirmType,
  ResetPasswordRequestType,
} from "@/types/types";

/**
 * Request a password reset by creating a token and sending an email
 */
export async function requestPasswordReset(
  data: ResetPasswordRequestType,
): Promise<{
  success: boolean;
  token?: string; // Remove undefined from token since we actually return it
}> {
  const { email } = data;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // For security reasons, we don't reveal if the email exists or not
    return { success: true };
  }

  // Generate a reset token (valid for 1 hour)
  const token = generateResetToken();

  // Store the token in the database
  await prisma.passwordReset.upsert({
    where: { userId: user.id },
    update: {
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    },
    create: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    },
  });

  // TODO: Send email with reset link
  // In a real app, you would send an email with the reset link
  // For now we'll just return the token for testing

  return { success: true, token };
}

/**
 * Verify a reset token and update the user's password
 */
export async function verifyAndResetPassword(
  data: ResetPasswordConfirmType,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const { token, password } = data;

  // Find the password reset record
  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() }, // Token must not be expired
    },
    include: { user: true },
  });

  if (!resetRecord) {
    return { success: false, message: "Invalid or expired token" };
  }

  // Update the user's password
  // In a real app you would hash the password
  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { password },
  });

  // Delete the used token
  await prisma.passwordReset.delete({
    where: { id: resetRecord.id },
  });

  return { success: true };
}

function generateResetToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
