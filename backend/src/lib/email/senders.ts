import { APP_DOMAIN, APP_NAME } from "@/constants";
import { generatePasswordResetToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";

import { EmailService, type EmailTemplateVariables } from "./email-service";

export interface ResetPasswordEmailTemplateVariables
  extends EmailTemplateVariables {
  passwordResetUrl: string;
}

export async function sendPasswordResetToken(email: string): Promise<void> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    // don't give feedback if user does not exist
    return;
  }

  const token = generatePasswordResetToken(email);

  const baseUrl = APP_DOMAIN;

  const passwordResetUrl = `${baseUrl}/reset-password?token=${token}`;

  const emailService = new EmailService();
  await emailService.sendTemplateEmail<ResetPasswordEmailTemplateVariables>({
    to: existingUser.email,
    // TODO handle message and template
    subject: "Confirm your password reset",
    templateName: "reset-password-mail",
    templateData: {
      title: "Confirm your password reset",
      message: "",
      name: existingUser.name,
      passwordResetUrl,
      APP_NAME,
    },
  });
}
