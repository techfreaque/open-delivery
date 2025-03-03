// file: src/services/emailService.ts
import fs from "fs";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";

import { env } from "../env";
import { debugLogger } from "../utils";

export interface EmailTemplateVariables {
  APP_NAME: string;
  name: string;
  title: string;
  message: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // ... your SMTP/transport settings
      host: env.EMAIL_HOST || "smtp.ethereal.email",
      port: parseInt(env.EMAIL_PORT || "587", 10),
      secure: false,
      auth: {
        user: env.EMAIL_USER || "",
        pass: env.EMAIL_PASS || "",
      },
    });
  }

  /**
   * Send an email using a precompiled Handlebars template.
   *
   * @param to - recipient email
   * @param subject - email subject
   * @param templateName - name of the compiled template, e.g., "welcomeEmail"
   * @param templateData - data for Handlebars to inject
   */
  async sendTemplateEmail<T extends EmailTemplateVariables>({
    to,
    subject,
    templateName,
    templateData,
  }: {
    to: string;
    subject: string;
    templateName: string;
    templateData: T;
  }): Promise<SMTPTransport.SentMessageInfo> {
    // 1. Load the compiled template (which is plain HTML with Handlebars placeholders)
    const compiledPath = path.join(
      __dirname,
      "compiled_templates",
      `${templateName}.html`,
    );
    const templateContent = fs.readFileSync(compiledPath, "utf-8");

    // 2. Compile with Handlebars
    const compile = Handlebars.compile(templateContent);
    const html = compile(templateData);

    // 3. Build the mail options
    const mailOptions: nodemailer.SendMailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    // 4. Send
    const info = await this.transporter.sendMail(mailOptions);
    debugLogger(`Email message sent: ${info.messageId}`);

    if (nodemailer.getTestMessageUrl(info)) {
      debugLogger(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  }
}
