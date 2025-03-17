import { registerEndpoint } from "@/client-package/schema/api/apis";
import { registerUser } from "@/lib/api/auth/register";
import { apiHandler } from "@/next-portal/api/api-handler";

export const POST = apiHandler({
  endpoint: registerEndpoint,
  handler: registerUser,
});
