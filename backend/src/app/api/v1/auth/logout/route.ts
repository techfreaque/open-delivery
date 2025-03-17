import { logoutEndpoint } from "@/client-package/schema/api/v1/auth/logout";
import { logoutUser } from "@/lib/api/auth/logout";
import { apiHandler } from "@/next-portal/api/api-handler";

export const GET = apiHandler({
  endpoint: logoutEndpoint,
  handler: logoutUser,
});
