import { APP_NAME } from "@/constants";
import { prisma } from "@/lib/db/prisma";

import { EmailService, type EmailTemplateVariables } from "./email-service";

export interface ResetPasswordEmailTemplateVariables
  extends EmailTemplateVariables {
  passwordResetUrl: string;
}

export async function sendPasswordResetToken(email: string): Promise<void> {
  const emailService = new EmailService();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    // don't give feedback if user does not exist
    return;
  }
  await emailService.sendTemplateEmail<ResetPasswordEmailTemplateVariables>({
    to: existingUser.email,
    // TODO
    subject: "",
    templateName: "reset-password-mail",
    templateData: {
      title: "Confirm your password reset",
      message: "",
      name: existingUser.name,
      passwordResetUrl: "",
      APP_NAME,
    },
  });
}
