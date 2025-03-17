import { resetPasswordConfirmEndpoint } from "@/client-package/schema/api/v1/auth/public/reset-password-confirm";
import { confirmPasswordReset } from "@/lib/api/auth/reset-password-confirm";
import { apiHandler } from "@/next-portal/api/api-handler";

export const POST = apiHandler({
  endpoint: resetPasswordConfirmEndpoint,
  handler: confirmPasswordReset,
});
