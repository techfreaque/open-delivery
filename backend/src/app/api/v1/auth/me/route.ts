import { meEndpoint } from "@/client-package/schema/api/v1/auth/me";
import type { LoginResponseType } from "@/client-package/types/types";
import { createSessionAndGetUser } from "@/lib/api/auth/login";
import type {
  ApiHandlerCallBackProps,
  SafeReturnType,
} from "@/next-portal/api/api-handler";
import { apiHandler } from "@/next-portal/api/api-handler";
import type { UndefinedType } from "@/next-portal/types/common.schema";

export const GET = apiHandler({
  endpoint: meEndpoint,
  handler: getUser,
});

export async function getUser({
  user,
}: ApiHandlerCallBackProps<UndefinedType, UndefinedType>): Promise<
  SafeReturnType<LoginResponseType>
> {
  return createSessionAndGetUser(user.id);
}
