"use server";

import { prisma } from "@/lib/db/prisma";

export const getCodeFromId = async (
  codeId: string,
): Promise<string | undefined> => {
  const code = await prisma.code.findUnique({
    where: {
      id: codeId,
    },
    select: {
      code: true,
    },
  });
  return code?.code;
};
