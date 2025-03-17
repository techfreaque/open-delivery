import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type { ResetPasswordRequestType } from "@/client-package/schema/schemas";
import { generatePasswordResetToken } from "@/lib/api/auth/reset-password-utils";
import type {
  ApiHandlerCallBackProps,
  SafeReturnType,
} from "@/next-portal/api/api-handler";
import { APP_DOMAIN, APP_NAME } from "@/next-portal/constants";
import { prisma } from "@/next-portal/db";
import type { UndefinedType } from "@/next-portal/types/common.schema";
import type { MessageResponseType } from "@/next-portal/types/response.schema";

import {
  EmailService,
  type EmailTemplateVariables,
} from "../../email/email-service";

export interface ResetPasswordEmailTemplateVariables
  extends EmailTemplateVariables {
  passwordResetUrl: string;
}

const responseMessage =
  "Password reset email sent. If the email exists in our system, you will receive instructions to reset your password.";

export async function sendPasswordResetToken({
  data,
}: ApiHandlerCallBackProps<ResetPasswordRequestType, UndefinedType>): Promise<
  SafeReturnType<MessageResponseType>
> {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!existingUser) {
    // don't give feedback if user does not exist
    return { success: true, data: responseMessage };
  }
  const token = await generatePasswordResetToken(data.email, existingUser.id);
  const passwordResetUrl = `${APP_DOMAIN}/reset-password?token=${token}`;
  const emailService = new EmailService();
  const response: SMTPTransport.SentMessageInfo | null =
    await emailService.sendTemplateEmail<ResetPasswordEmailTemplateVariables>({
      to: existingUser.email,
      subject: "Reset your password",
      templateName: "reset-password-mail",
      templateData: {
        title: "Reset your password",
        message:
          "You requested a password reset. Click the button below to set a new password for your account.",
        name: existingUser.firstName,
        passwordResetUrl,
        APP_NAME: APP_NAME,
      },
    });
  if (!response) {
    return { success: false, message: "Failed to send email", errorCode: 500 };
  }
  if (response.accepted.length === 0) {
    return { success: false, message: "Failed to send email", errorCode: 500 };
  }
  return { success: true, data: responseMessage };
}
