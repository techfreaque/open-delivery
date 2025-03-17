import { loginEndpoint } from "@/client-package/schema/api/apis";
import { loginUser } from "@/lib/api/auth/login";
import { apiHandler } from "@/next-portal/api/api-handler";

export const POST = apiHandler({
  endpoint: loginEndpoint,
  handler: loginUser,
});
