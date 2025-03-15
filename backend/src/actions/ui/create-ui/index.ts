"use server";

import { prisma } from "@/lib/db/prisma";
import type { FullUI } from "@/types/website-editor";

export const createUI = async (
  prompt: string,
  userId: string,
  uiType: UiType,
): Promise<FullUI> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const data = await prisma.uI.create({
    data: {
      userId: userId,
      prompt: prompt,
      uiType: uiType,
      updatedAt: new Date(),
      img: "",
    },

    select: {
      id: true,
      uiType: true,
      user: {
        select: {
          id: true,
          firstName: true,
          imageUrl: true,
        },
      },
      prompt: true,
      public: true,
      img: true,
      viewCount: true,
      likesCount: true,
      forkedFrom: true,
      createdAt: true,
      updatedAt: true,
      subPrompts: {
        select: {
          id: true,
          UIId: true,
          SUBId: true,
          createdAt: true,
          subPrompt: true,
          modelId: true,
          code: {
            select: {
              id: true,
              code: true,
            },
          },
        },
      },
    },
  });
  return data;
};
