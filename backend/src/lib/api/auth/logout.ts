import { cookies } from "next/headers";

import type {
  ApiHandlerCallBackProps,
  SafeReturnType,
} from "@/next-portal/api/api-handler";
import { prisma } from "@/next-portal/db/index";
import type { UndefinedType } from "@/next-portal/types/common.schema";

/**
 * Logout user
 */
export async function logoutUser({
  user,
}: ApiHandlerCallBackProps<UndefinedType, UndefinedType>): Promise<
  SafeReturnType<UndefinedType>
> {
  // Clear auth cookie
  try {
    (await cookies()).delete("auth-token");
  } catch {
    // empty
  }

  // Remove sessions from database
  try {
    await prisma.session.deleteMany({ where: { userId: user.id } });
  } catch {
    // empty
  }
  return { success: true, data: undefined };
}
