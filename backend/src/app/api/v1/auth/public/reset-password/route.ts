import { resetPasswordEndpoint } from "@/client-package/schema/api/v1/auth/public/reset-password";
import { sendPasswordResetToken } from "@/lib/api/auth/reset-password";
import { apiHandler } from "@/next-portal/api/api-handler";

export const POST = apiHandler({
  endpoint: resetPasswordEndpoint,
  handler: sendPasswordResetToken,
});
